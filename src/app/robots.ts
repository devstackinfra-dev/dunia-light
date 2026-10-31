import type { MetadataRoute } from "next"
import { BRAND } from "@/config/brand"

/** Buscadores indexam o site público; painel, login e APIs ficam de fora. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/login", "/definir-senha", "/recuperar-senha"] }],
    sitemap: `${BRAND.siteUrl}/sitemap.xml`,
  }
}
