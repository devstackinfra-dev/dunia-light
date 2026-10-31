-- ============================================================================
-- 0010_blog.sql
--
-- Publicações (blog): artigos informativos escritos no painel, exibidos em
-- /blog, na página inicial e na página da área relacionada.
--
-- O conteúdo é texto com marcação simples (## título, - lista, **negrito**,
-- [link](url)), renderizado pelo site como elementos React — nunca como HTML
-- bruto, então não há como injetar script por um artigo.
--
-- Visitante lê só o que está publicado e com data já alcançada (permite
-- agendar). Rascunho e agendado só o painel vê.
--
-- Idempotente.
-- ============================================================================

create table if not exists public.posts (
  id            text primary key default gen_random_uuid()::text,
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo        text not null check (length(titulo) between 3 and 160),
  resumo        text not null default '' check (length(resumo) <= 400),
  conteudo      text not null default '' check (length(conteudo) <= 60000),
  capa          text check (length(capa) <= 500),
  area_slug     text references public.areas(slug) on update cascade on delete set null,
  autor         text check (length(autor) <= 120),
  status        text not null default 'rascunho' check (status in ('rascunho', 'publicado')),
  publicado_em  timestamptz,
  destaque      boolean not null default false,
  seo_titulo    text check (length(seo_titulo) <= 70),
  seo_descricao text check (length(seo_descricao) <= 170),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_posts_publicados on public.posts(publicado_em desc) where status = 'publicado';
create index if not exists idx_posts_area on public.posts(area_slug) where status = 'publicado';

drop trigger if exists trg_posts_updated on public.posts;
create trigger trg_posts_updated before update on public.posts
  for each row execute function public.tocar_updated_at();

alter table public.posts enable row level security;

drop policy if exists posts_ler on public.posts;
create policy posts_ler on public.posts
  for select using (
    (status = 'publicado' and publicado_em is not null and publicado_em <= now())
    or public.e_admin()
  );

drop policy if exists posts_admin_escreve on public.posts;
create policy posts_admin_escreve on public.posts
  for all using (public.e_admin()) with check (public.e_admin());

grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;

-- Trilha de auditoria (0009)
drop trigger if exists trg_auditoria on public.posts;
create trigger trg_auditoria after insert or update or delete on public.posts
  for each row execute function public.registra_auditoria();

-- Aba "Blog" no painel para quem já cuida de conteúdo
update public.app_settings
   set value = jsonb_set(
         jsonb_set(value, '{gerente}', (value -> 'gerente') || '["blog"]'::jsonb),
         '{marketing}', (value -> 'marketing') || '["blog"]'::jsonb)
 where key = 'role_permissions'
   and not ((value -> 'gerente') ? 'blog');
