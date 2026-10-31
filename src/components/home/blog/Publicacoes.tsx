"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { listPublishedPosts } from "@/lib/db/posts"
import { listActiveAreas } from "@/lib/db/areas"
import { SectionHeader } from "@/components/home/shared/SectionHeader"
import { PostCard } from "./PostCard"
import type { Post } from "@/types/post"
import { useHome } from "@/components/home/shared/ConteudoProvider"

/**
 * Últimas publicações do blog na página inicial (destaques primeiro).
 * Sem nenhuma publicada, a seção não aparece.
 */
export function Publicacoes() {
  // Textos deste cliente (banco) sobre o padrão da vertical
  const HOME = useHome()
  const [posts, setPosts] = useState<Post[]>([])
  const [areas, setAreas] = useState<Record<string, string>>({})

  useEffect(() => {
    listPublishedPosts(3)
      .then(setPosts)
      .catch((err) => console.warn("[Publicações] Sem publicações:", err))
    listActiveAreas()
      .then((lista) => setAreas(Object.fromEntries(lista.map((a) => [a.slug, a.nome]))))
      .catch(() => {})
  }, [])

  if (posts.length === 0) return null
  const { badge, title, subtitle } = HOME.publicacoes

  return (
    <section id="publicacoes" className="relative w-full scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader badge={badge} title={title} subtitle={subtitle} tom="claro" />
          <Link
            href="/blog"
            className="mb-14 inline-flex items-center gap-1.5 text-sm font-semibold text-marca-tinta underline decoration-marca-latao decoration-2 underline-offset-[6px] hover:text-marca-latao"
          >
            Ver todas as publicações <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} areaNome={post.areaSlug ? areas[post.areaSlug] : undefined} />
          ))}
        </div>
      </div>
    </section>
  )
}
