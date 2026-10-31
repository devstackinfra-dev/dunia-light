-- ============================================================================
-- 0009_trilha_de_auditoria.sql
--
-- Trilha de auditoria imutável, no padrão do mvp_guilhermeHoluboski:
-- registra QUEM fez O QUÊ, QUANDO e QUAIS CAMPOS mudaram — nunca os valores.
-- Copiar valores para outra tabela duplicaria dados pessoais de clientes
-- (LGPD) e informação sob sigilo profissional.
--
-- Feita por gatilho no banco, e não no painel: assim nada escapa, nem
-- alteração feita pela API, por script ou pelo SQL Editor.
--
-- Ninguém edita nem apaga registros (nem o super admin); só o super admin lê.
--
-- Idempotente.
-- ============================================================================

create table if not exists public.audit_log (
  id               bigint generated always as identity primary key,
  created_at       timestamptz not null default now(),
  entidade         text not null,
  registro_id      text not null,
  acao             text not null check (acao in ('criar', 'alterar', 'excluir')),
  campos_alterados text[] not null default '{}',
  autor_id         uuid,
  autor_nome       text not null
);

create index if not exists idx_audit_registro on public.audit_log(entidade, registro_id, created_at desc);
create index if not exists idx_audit_data on public.audit_log(created_at desc);

alter table public.audit_log enable row level security;

drop policy if exists audit_super_admin_le on public.audit_log;
create policy audit_super_admin_le on public.audit_log
  for select using (public.e_super_admin());

-- A 0004 dá todos os privilégios em toda tabela nova; aqui eles são retirados.
-- Sem policy de escrita e sem grant, só o gatilho (security definer) grava.
revoke insert, update, delete, truncate on public.audit_log from anon, authenticated;
grant select on public.audit_log to authenticated;

-- Colunas que mudam sozinhas ou por métrica pública: não geram registro
create or replace function public.registra_auditoria()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_novo     jsonb := case when tg_op = 'DELETE' then null else to_jsonb(new) end;
  v_antigo   jsonb := case when tg_op = 'INSERT' then null else to_jsonb(old) end;
  v_linha    jsonb := coalesce(v_novo, v_antigo);
  v_campos   text[] := '{}';
  v_autor    uuid := auth.uid();
  v_nome     text;
  v_papel    text := coalesce(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role', '');
  v_ruido    text[] := array['updated_at', 'views', 'clicks', 'views_count', 'clicks_count', 'lead_count', 'utm_stats'];
begin
  if tg_op = 'UPDATE' then
    select coalesce(array_agg(n.key order by n.key), '{}')
      into v_campos
      from jsonb_each(v_novo) n
     where not (n.key = any (v_ruido))
       and n.value is distinct from v_antigo -> n.key;

    -- Nada além de carimbo de data ou contador: não é uma ação de alguém
    if cardinality(v_campos) = 0 then
      return null;
    end if;
  end if;

  if v_autor is not null then
    select coalesce(nullif(display_name, ''), email) into v_nome from public.admin_users where id = v_autor;
  end if;
  v_nome := coalesce(
    v_nome,
    case when v_papel = 'service_role' then 'sistema (servidor)'
         when v_papel = 'anon' then 'visitante do site'
         when v_autor is not null then 'usuário sem perfil'
         else 'banco de dados (SQL)' end
  );

  insert into public.audit_log (entidade, registro_id, acao, campos_alterados, autor_id, autor_nome)
  values (
    tg_table_name,
    coalesce(v_linha ->> 'id', v_linha ->> 'key', '?'),
    case tg_op when 'INSERT' then 'criar' when 'UPDATE' then 'alterar' else 'excluir' end,
    v_campos,
    v_autor,
    v_nome
  );

  return null;
end;
$$;

revoke execute on function public.registra_auditoria() from public, anon, authenticated;

-- Tabelas auditadas: dados de clientes, acesso ao painel e o que vai a público
do $$
declare
  t text;
begin
  foreach t in array array[
    'leads', 'lead_documents', 'appointments', 'admin_users',
    'areas', 'campaigns', 'hero_slides', 'app_settings', 'testimonials', 'products'
  ] loop
    execute format('drop trigger if exists trg_auditoria on public.%I', t);
    execute format(
      'create trigger trg_auditoria after insert or update or delete on public.%I
         for each row execute function public.registra_auditoria()', t);
  end loop;
end $$;
