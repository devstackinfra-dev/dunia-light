import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { formatarData, tempoDeLeitura } from "@/lib/db/posts"
import type { Post } from "@/types/post"

/**
 * Card de publicação editorial — padrão de revista jurídica de alto nível.
 * Usado na home, em /blog e na página de cada área.
 */
export function PostCard({ post, areaNome }: { post: Post; areaNome?: string }) {
  const meta = [areaNome, formatarData(post.publicadoEm)].filter(Boolean).join(" · ")

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-stone-200/90 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-marca-latao/50 hover:shadow-[0_20px_40px_-15px_rgba(31,47,74,0.08)]">
      {post.capa && (
        <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.capa}
            alt={post.titulo}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {meta && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-marca-latao">
            {meta}
          </p>
        )}

        <h3 className="mt-3 font-titulo text-xl font-normal leading-snug text-marca-tinta transition-colors group-hover:text-marca-latao">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.titulo}
          </Link>
        </h3>

        {post.resumo && (
          <p className="mt-3.5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 font-corpo">
            {post.resumo}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-marca-tinta transition-colors group-hover:text-marca-latao">
            Ler artigo · {tempoDeLeitura(post.conteudo)} min
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
          {post.autor && (
            <span className="text-[11px] text-stone-600 hidden sm:inline">
              {post.autor.split(" ")[0]}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
