import { supabase } from "@/lib/supabase"
import type { PostRow } from "@/types/database"
import type { Post } from "@/types/post"

/**
 * Repositório de publicações (tabela `posts`).
 * O site lê só as publicadas com data alcançada (RLS); o painel lê e edita tudo.
 */

export function rowToPost(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    titulo: row.titulo,
    resumo: row.resumo,
    conteudo: row.conteudo,
    capa: row.capa ?? undefined,
    areaSlug: row.area_slug ?? undefined,
    autor: row.autor ?? undefined,
    status: row.status,
    publicadoEm: row.publicado_em ?? undefined,
    destaque: row.destaque,
    seoTitulo: row.seo_titulo ?? undefined,
    seoDescricao: row.seo_descricao ?? undefined,
    atualizadoEm: row.updated_at,
  }
}

function postToRow(post: Partial<Post>): Partial<PostRow> {
  const row: Partial<PostRow> = {}
  if (post.slug !== undefined) row.slug = post.slug
  if (post.titulo !== undefined) row.titulo = post.titulo
  if (post.resumo !== undefined) row.resumo = post.resumo
  if (post.conteudo !== undefined) row.conteudo = post.conteudo
  if (post.capa !== undefined) row.capa = post.capa || null
  if (post.areaSlug !== undefined) row.area_slug = post.areaSlug || null
  if (post.autor !== undefined) row.autor = post.autor || null
  if (post.status !== undefined) row.status = post.status
  if (post.publicadoEm !== undefined) row.publicado_em = post.publicadoEm || null
  if (post.destaque !== undefined) row.destaque = post.destaque
  if (post.seoTitulo !== undefined) row.seo_titulo = post.seoTitulo || null
  if (post.seoDescricao !== undefined) row.seo_descricao = post.seoDescricao || null
  return row
}

export const POSTS_PADRAO_JURIDICO: Post[] = [
  {
    id: "default-1",
    slug: "atuacao-estrategica-tribunais-superiores",
    titulo: "A Atuação Estratégica nos Tribunais Superiores (STF e STJ)",
    resumo: "Aspectos determinantes para a admissibilidade de Recursos Especiais e Extraordinários e a consolidação de teses jurídicas nos Tribunais de cúpula.",
    conteudo: `A condução de processos perante o Supremo Tribunal Federal (STF) e o Superior Tribunal de Justiça (STJ) demanda metodologia distinta da advocacia praticada nas instâncias ordinárias.

Nessas cortes, o foco desloca-se da reanálise de fatos e provas para a interpretação uniforme do ordenamento federal e da Constituição da República. A admissibilidade recursal exige precisão cirúrgica na demonstração do prequestionamento, na impugnação específica de todos os fundamentos da decisão recorrida e no cumprimento rigoroso dos requisitos regimentais.

### O papel do prequestionamento
Sem que a matéria federal ou constitucional tenha sido expressamente debatida pelo tribunal de origem, o recurso não transpõe as barreiras das Súmulas 282 e 356 do STF. Antecipar essas exigências desde as instâncias iniciais, por meio de embargos de declaração estrategicamente estruturados, é a chave para assegurar o conhecimento da controvérsia.

### Sustentação oral e memoriais
A entrega de memoriais objetivos e a realização de sustentação oral perante os ministros completam a atuação estratégica, permitindo destacar com clareza os pontos nodais da tese jurídica em julgamento.`,
    areaSlug: "direito-constitucional",
    autor: "Samantha Azevedo Louzeiro",
    status: "publicado",
    publicadoEm: "2026-10-15T10:00:00Z",
    destaque: true,
    capa: "/clientes/louzeiro/escritorio/08-sala-reuniao-frontal.webp",
    seoTitulo: "Atuação Estratégica nos Tribunais Superiores | Louzeiro Advocacia",
    seoDescricao: "Metodologia e rigor técnico na condução de recursos perante o STF e STJ.",
    atualizadoEm: "2026-10-15T10:00:00Z",
  },
  {
    id: "default-2",
    slug: "planejamento-tributario-e-seguranca-juridica",
    titulo: "Planejamento Tributário e Segurança Jurídica Empresarial",
    resumo: "Estratégias preventivas na recuperação de créditos e conformidade fiscal diante das recentes alterações jurisprudenciais dos TRFs.",
    conteudo: `Em um sistema tributário caracterizado pela complexidade e constante mutação normativa, a segurança jurídica tornou-se o principal ativo das sociedades empresárias.

O planejamento tributário contemporâneo não busca atalhos arriscados, mas sim a certeza jurídica decorrente de atos com inequívoco propósito negocial, alinhados à jurisprudência consolidada do CARF e dos Tribunais Regionais Federais.

### Prevenção de contingências fiscais
A atuação preventiva identifica distorções no recolhimento de tributos diretos e indiretos, permitindo o aproveitamento legítimo de créditos fiscais e reduzindo a exposição a autuações administrativas severas.`,
    areaSlug: "direito-tributario",
    autor: "Samantha Azevedo Louzeiro",
    status: "publicado",
    publicadoEm: "2026-10-20T14:30:00Z",
    destaque: true,
    capa: "/clientes/louzeiro/escritorio/02-estante-madeira-ampla.webp",
    seoTitulo: "Planejamento Tributário e Segurança Jurídica | Louzeiro Advocacia",
    seoDescricao: "Estratégias preventivas na estruturação fiscal e recuperação de créditos tributários.",
    atualizadoEm: "2026-10-20T14:30:00Z",
  },
  {
    id: "default-3",
    slug: "processos-administrativos-agencias-reguladoras",
    titulo: "Processos Administrativos perante Agências Reguladoras",
    resumo: "A condução técnica e a observância do devido processo legal em licitações, fiscalizações e defesas sancionatórias nos órgãos federais.",
    conteudo: `O relacionamento de agentes privados com agências reguladoras (como ANVISA, ANATEL, ANTT, ANEEL) e órgãos de controle (TCU, CGU) exige estrito cumprimento de parâmetros de governança e rigor probatório.

A elaboração de respostas consistentes a termos de notificação e a interposição de recursos administrativos fundamentados são indispensáveis para evitar sanções desproporcionais e assegurar a continuidade das operações empresariais.`,
    areaSlug: "direito-regulatorio",
    autor: "Samantha Azevedo Louzeiro",
    status: "publicado",
    publicadoEm: "2026-10-25T09:15:00Z",
    destaque: false,
    capa: "/clientes/louzeiro/escritorio/03-entrada-marca-louzeiro.webp",
    seoTitulo: "Processos Administrativos e Agências Reguladoras | Louzeiro Advocacia",
    seoDescricao: "Defesa técnica de empresas em fiscalizações e processos sancionatórios federais.",
    atualizadoEm: "2026-10-25T09:15:00Z",
  },
]

/** Publicadas, mais recentes primeiro — para a seção da home. */
export async function listPublishedPosts(limite = 3): Promise<Post[]> {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "publicado")
      .lte("publicado_em", new Date().toISOString())
      .order("destaque", { ascending: false })
      .order("publicado_em", { ascending: false })
      .limit(limite)
    if (error) throw error
    if (data && data.length > 0) {
      return (data as PostRow[]).map(rowToPost)
    }
    return POSTS_PADRAO_JURIDICO.slice(0, limite)
  } catch {
    return POSTS_PADRAO_JURIDICO.slice(0, limite)
  }
}

/** Todas, inclusive rascunhos e agendadas — para o painel. */
export async function listAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false })
  if (error) throw error
  return ((data ?? []) as PostRow[]).map(rowToPost)
}

export async function createPost(post: Omit<Post, "id">): Promise<Post> {
  const { data, error } = await supabase.from("posts").insert(postToRow(post) as PostRow).select().single()
  if (error) throw error
  return rowToPost(data as PostRow)
}

export async function updatePost(id: string, patch: Partial<Post>): Promise<void> {
  const { error } = await supabase.from("posts").update(postToRow(patch)).eq("id", id)
  if (error) throw error
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) throw error
}

/** Tempo de leitura estimado (≈ 200 palavras por minuto). */
export function tempoDeLeitura(conteudo: string): number {
  const palavras = conteudo.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(palavras / 200))
}

export function formatarData(iso?: string): string {
  return iso ? new Date(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : ""
}
