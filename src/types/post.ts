/** Publicação do blog (tabela `posts`, migration 0010). */
export interface Post {
  id: string
  slug: string
  titulo: string
  resumo: string
  /** Texto com marcação simples — ver components/home/shared/TextoFormatado */
  conteudo: string
  capa?: string
  areaSlug?: string
  autor?: string
  status: "rascunho" | "publicado"
  /** Data de publicação; no futuro = agendado */
  publicadoEm?: string
  destaque: boolean
  seoTitulo?: string
  seoDescricao?: string
  atualizadoEm?: string
}
