-- ============================================================================
-- 0006_seguranca_inserts_publicos_e_storage.sql
--
-- Fecha brechas encontradas na revisão de segurança (out/2026):
--
--   1. Depoimento: o visitante podia enviar `approved = true` e publicar o
--      próprio texto na home sem moderação.
--   2. Lead: o visitante podia gravar QUALQUER coluna no insert — status do
--      funil, responsável, score, aprovação de crédito — e textos sem limite.
--   3. drivers: tabela legada do projeto original ainda aceitava insert anônimo.
--   4. Storage: nenhum bucket era criado por migration, e os documentos de leads
--      iam para o bucket PÚBLICO de produtos. Agora existe `lead-docs`, privado.
--
-- Idempotente: pode ser reexecutada.
-- ============================================================================

-- ─── 1. Depoimentos: visitante só envia para a fila de moderação ────────────
drop policy if exists testimonials_criar_publico on public.testimonials;
create policy testimonials_criar_publico on public.testimonials
  for insert with check (approved = false or public.e_admin());

create or replace function public.saneia_depoimento_publico()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.e_admin() then
    new.approved := false;
    if length(coalesce(new.name, '')) > 120
       or length(coalesce(new."time", '')) > 120
       or length(coalesce(new.testimony, '')) > 2000 then
      raise exception 'Depoimento excede o tamanho permitido.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_testimonials_saneia on public.testimonials;
create trigger trg_testimonials_saneia before insert on public.testimonials
  for each row execute function public.saneia_depoimento_publico();

-- ─── 2. Leads: o formulário público só preenche dados de contato ────────────
-- Quem não é admin não escolhe id, etapa do funil, responsável nem decisões.
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
    new.created_at             := now();

    if length(coalesce(new.full_name, '')) > 200
       or length(coalesce(new.phone, '')) > 40
       or length(coalesce(new.whatsapp, '')) > 40
       or length(coalesce(new.email, '')) > 200
       or length(coalesce(new.notes, '')) > 5000
       or length(coalesce(new.source, '')) > 120
       or length(coalesce(new.item_interest, '')) > 300
       or length(coalesce(new.utm::text, '')) > 2000 then
      raise exception 'Dados do contato excedem o tamanho permitido.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_leads_saneia on public.leads;
create trigger trg_leads_saneia before insert on public.leads
  for each row execute function public.saneia_lead_publico();

-- ─── 3. drivers: legado, sem entrada pública ────────────────────────────────
drop policy if exists drivers_criar_publico on public.drivers;
revoke insert on public.drivers from anon;

-- ─── 4. Storage ─────────────────────────────────────────────────────────────
-- Buckets públicos: imagens do site. Privado: documentos de leads (LGPD) —
-- só o servidor (service_role) lê e grava, e o painel abre por URL assinada.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('products', 'products', true,  10485760, array['image/png','image/jpeg','image/webp','image/avif','image/gif']),
  ('banners',  'banners',  true,  10485760, array['image/png','image/jpeg','image/webp','image/avif','image/gif']),
  ('logos',    'logos',    true,  10485760, array['image/png','image/jpeg','image/webp','image/avif','image/gif','image/svg+xml']),
  ('lead-docs','lead-docs',false, 10485760, array['image/png','image/jpeg','image/webp','application/pdf'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Upload direto do painel (central de mídia) só nos buckets públicos e só admin.
-- Leitura pública dispensa policy: bucket público serve o arquivo pela URL.
drop policy if exists midia_admin_escreve on storage.objects;
create policy midia_admin_escreve on storage.objects
  for insert to authenticated
  with check (bucket_id in ('products','banners','logos') and public.e_admin());

drop policy if exists midia_admin_atualiza on storage.objects;
create policy midia_admin_atualiza on storage.objects
  for update to authenticated
  using (bucket_id in ('products','banners','logos') and public.e_admin());

drop policy if exists midia_admin_lista on storage.objects;
create policy midia_admin_lista on storage.objects
  for select to authenticated
  using (bucket_id in ('products','banners','logos') and public.e_admin());

-- `lead-docs` não tem policy nenhuma de propósito: anon e authenticated não
-- leem, não listam e não gravam. Só as rotas de servidor, com service_role.
