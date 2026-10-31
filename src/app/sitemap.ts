import type { MetadataRoute } from "next"
import { BRAND } from "@/config/brand"
import { getAreasPublicas } from "@/lib/areas-publicas"
import { getPostsPublicos } from "@/lib/posts-publicos"
import { getConteudo, slugDoPerfil } from "@/lib/conteudo"

export const revalidate = 3600

/** Mapa do site para buscadores: home, áreas de atuação, publicações e privacidade. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = BRAND.siteUrl
  const [areas, posts, { perfil }] = await Promise.all([getAreasPublicas(), getPostsPublicos(), getConteudo()])
  const slugPerfil = perfil.ativo ? slugDoPerfil(perfil) : ""

  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    ...(slugPerfil ? [{ url: `${base}/${slugPerfil}`, changeFrequency: "monthly" as const, priority: 0.8 }] : []),
    { url: `${base}/areas-de-atuacao`, changeFrequency: "monthly", priority: 0.8 },
    ...areas.map((a) => ({
      url: `${base}/areas-de-atuacao/${a.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...(posts.length ? [{ url: `${base}/blog`, changeFrequency: "weekly" as const, priority: 0.7 }] : []),
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.atualizadoEm,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    { url: `${base}/privacidade`, changeFrequency: "yearly", priority: 0.2 },
  ]
}
