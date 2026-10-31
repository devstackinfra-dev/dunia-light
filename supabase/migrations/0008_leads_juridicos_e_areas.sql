-- ============================================================================
-- 0008_leads_juridicos_e_areas.sql
--
-- Modelo de atendimento jurídico, portado do projeto de referência
-- (mvp_guilhermeHoluboski) para o schema do template:
--
--   1. Funil: etapas "em análise", "qualificado" e "descartado". As demais já
--      existem: new=nova, contacted=contato feito, scheduled=em atendimento,
--      converted=cliente, lost=sem prosseguimento.
--   2. Tabela `areas`: áreas de atuação como dados, editáveis no painel.
--   3. Lead: área de interesse, relato original imutável, tags, prazos,
--      prova de consentimento (LGPD) e controle de retenção e de pedidos do
--      titular.
--   4. Entrada de lead só pela rota /api/leads (validação, consentimento e
--      limite de envios). O insert anônimo direto na API do Supabase acaba.
--
-- Corrige também colunas que o código já usava e o banco não tinha
-- (custom_fields, authorization_recorded_by) e categorias de documento.
--
-- Idempotente.
-- ============================================================================

-- ─── 1. Etapas do funil e categorias de documento ───────────────────────────
alter type public.lead_status add value if not exists 'analysis' after 'new';
alter type public.lead_status add value if not exists 'qualified' after 'analysis';
alter type public.lead_status add value if not exists 'discarded';

alter type public.doc_category add value if not exists 'documento';
alter type public.doc_category add value if not exists 'identidade';

-- ─── 2. Áreas de atuação ────────────────────────────────────────────────────
create table if not exists public.areas (
  id         text primary key default gen_random_uuid()::text,
  slug       text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  nome       text not null check (length(nome) between 2 and 120),
  resumo     text not null default '' check (length(resumo) <= 400),
  -- Bloco "Contexto": a situação de quem procura, em primeira pessoa, sem prometer resultado
  contexto   text check (length(contexto) <= 2000),
  icone      text not null default 'file',
  -- Foto de topo do card (URL do Storage do cliente). Vazio: card sem foto.
  imagem     text check (length(imagem) <= 500),
  situacoes  text[] not null default '{}',
  -- Serviços da área: [{ "item": "...", "detalhe": "..." }]
  servicos   jsonb not null default '[]'::jsonb,
  ordem      integer not null default 0,
  ativo      boolean not null default true,
  destaque   boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_areas_ordem on public.areas(ordem) where ativo;

drop trigger if exists trg_areas_updated on public.areas;
create trigger trg_areas_updated before update on public.areas
  for each row execute function public.tocar_updated_at();

alter table public.areas enable row level security;

drop policy if exists areas_ler on public.areas;
create policy areas_ler on public.areas
  for select using (ativo or public.e_admin());

drop policy if exists areas_admin_escreve on public.areas;
create policy areas_admin_escreve on public.areas
  for all using (public.e_admin()) with check (public.e_admin());

grant select on public.areas to anon;
grant select, insert, update, delete on public.areas to authenticated;

do $$ begin
  execute 'alter publication supabase_realtime add table public.areas';
exception when others then null;
end $$;

-- ─── 3. Campos do atendimento jurídico ──────────────────────────────────────
alter table public.leads
  add column if not exists custom_fields             jsonb not null default '{}'::jsonb,
  add column if not exists authorization_recorded_by text,

  -- Área de interesse: slug para filtrar, nome copiado para o histórico não
  -- mudar se a área for renomeada ou desativada
  add column if not exists area_slug  text references public.areas(slug) on update cascade on delete set null,
  add column if not exists area_name  text,

  -- Relato original enviado pelo titular. Imutável (trigger abaixo); as
  -- anotações internas continuam em `notes`.
  add column if not exists client_message text,

  add column if not exists tags             text[] not null default '{}',
  add column if not exists next_contact_at  timestamptz,
  add column if not exists first_contact_at timestamptz,

  -- Prova de consentimento (LGPD, art. 7º, I e art. 8º)
  add column if not exists consent_at      timestamptz,
  add column if not exists consent_version text,
  add column if not exists consent_source  text,

  -- Governança de retenção e direitos do titular (LGPD, art. 18)
  add column if not exists retention_review_at  date,
  add column if not exists data_subject_request text not null default 'none',

  add column if not exists landing_page text,
  add column if not exists referrer     text;

do $$ begin
  alter table public.leads add constraint leads_data_subject_request_chk
    check (data_subject_request in ('none', 'access', 'correction', 'deletion'));
exception when duplicate_object then null;
end $$;

do $$ begin
  alter table public.leads add constraint leads_tags_chk
    check (cardinality(tags) <= 20);
exception when duplicate_object then null;
end $$;

create index if not exists idx_leads_area on public.leads(area_slug) where not archived;
create index if not exists idx_leads_proximo_contato on public.leads(next_contact_at) where next_contact_at is not null;

-- Relato imutável: uma vez gravado, não é editado nem pelo painel.
create or replace function public.protege_relato_lead()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.client_message is not null and new.client_message is distinct from old.client_message then
    raise exception 'O relato original do lead não pode ser alterado.';
  end if;
  if old.consent_at is not null and (
       new.consent_at is distinct from old.consent_at
    or new.consent_version is distinct from old.consent_version
    or new.consent_source is distinct from old.consent_source) then
    raise exception 'O registro de consentimento não pode ser alterado.';
  end if;
  return new;
end;
$$;

revoke execute on function public.protege_relato_lead() from public, anon, authenticated;

drop trigger if exists trg_leads_protege_relato on public.leads;
create trigger trg_leads_protege_relato before update on public.leads
  for each row execute function public.protege_relato_lead();

-- O saneamento de inserts que não vêm de admin (0006) passa a cobrir os
-- campos novos: quem não é admin não define tags, prazos nem pedidos do titular.
create or replace function public.saneia_lead_publico()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.e_admin() then
    new.id                     := gen_random_uuid()::text;
    new.status                 := 'new';
    new.contacted              := false;
    new.whatsapp_sent          := false;
    new.archived               := false;
    new.assigned_to            := null;
    new.score                  := null;
    new.lead_score             := null;
    new.registration_status    := null;
    new.needs_more_data        := false;
    new.contacted_for_data     := false;
    new.credit_analysis_status := 'pending';
    new.credit_check           := null;
    new.approval_status        := 'pending';
    new.approved_by            := null;
    new.approval_date          := null;
    new.authorized_by          := null;
    new.authorization_date     := null;
    new.file_urls              := '{}'::jsonb;
    new.custom_fields          := coalesce(new.custom_fields, '{}'::jsonb);
    new.tags                   := '{}';
    new.next_contact_at        := null;
    new.first_contact_at       := null;
    new.retention_review_at    := null;
    new.data_subject_request   := 'none';
    new.created_at             := now();

    if length(coalesce(new.full_name, '')) > 200
       or length(coalesce(new.phone, '')) > 40
       or length(coalesce(new.whatsapp, '')) > 40
       or length(coalesce(new.email, '')) > 200
       or length(coalesce(new.notes, '')) > 5000
       or length(coalesce(new.client_message, '')) > 5000
       or length(coalesce(new.source, '')) > 120
       or length(coalesce(new.item_interest, '')) > 300
       or length(coalesce(new.landing_page, '')) > 300
       or length(coalesce(new.referrer, '')) > 300
       or length(coalesce(new.utm::text, '')) > 2000 then
      raise exception 'Dados do contato excedem o tamanho permitido.';
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.saneia_lead_publico() from public, anon, authenticated;

-- ─── 4. Entrada de lead só pelo servidor ────────────────────────────────────
drop policy if exists leads_criar_publico on public.leads;
revoke insert on public.leads from anon;

-- Admin continua criando lead manualmente pelo painel
drop policy if exists leads_admin_cria on public.leads;
create policy leads_admin_cria on public.leads
  for insert to authenticated with check (public.e_admin());
