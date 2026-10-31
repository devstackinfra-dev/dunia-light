import { cache } from "react"
import { createServerReadClient } from "@/lib/supabase"
import { rowToPost, POSTS_PADRAO_JURIDICO } from "@/lib/db/posts"
import type { PostRow } from "@/types/database"
import type { Post } from "@/types/post"

/**
 * Publicações para as páginas públicas, lidas no servidor (SEO). Cliente
 * anônimo: o RLS entrega só as publicadas com data alcançada. Banco fora do
 * ar não segura a página — em 3 s, entrega o acervo editorial padrão.
 */
export const getPostsPublicos = cache(async (): Promise<Post[]> => {
  try {
    const { data, error } = await createServerReadClient()
      .from("posts")
      .select("*")
      .eq("status", "publicado")
      .lte("publicado_em", new Date().toISOString())
      .order("publicado_em", { ascending: false })
      .abortSignal(AbortSignal.timeout(3000))
    if (error) throw error
    if (data && data.length > 0) {
      return (data as PostRow[]).map(rowToPost)
    }
    return POSTS_PADRAO_JURIDICO
  } catch (err) {
    console.warn("[posts] Sem publicações no banco, usando padrão editorial:", err instanceof Error ? err.message : err)
    return POSTS_PADRAO_JURIDICO
  }
})

export async function getPostPublico(slug: string): Promise<Post | null> {
  return (await getPostsPublicos()).find((p) => p.slug === slug) ?? null
}
