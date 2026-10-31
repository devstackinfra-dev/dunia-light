import type { Metadata } from "next"
import { BRAND } from "@/config/brand"
import { getConteudo } from "@/lib/conteudo"
import { getPostsPublicos } from "@/lib/posts-publicos"
import { getAreasPublicas } from "@/lib/areas-publicas"
import { PaginaPublica } from "@/components/home/shared/PaginaPublica"
import { Eyebrow } from "@/components/home/shared/SectionHeader"
import { PostCard } from "@/components/home/blog/PostCard"

// Publicação nova ou agendada aparece em até 5 minutos, sem novo deploy
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const { home: HOME } = await getConteudo()
  return {
    title: HOME.publicacoes.badge,
    description: `${HOME.publicacoes.subtitle} ${BRAND.name}.`,
    alternates: { canonical: "/blog" },
  }
}

/** Lista de publicações, mais recentes primeiro. */
export default async function BlogPage() {
  const { home: HOME } = await getConteudo()
  const [posts, areas] = await Promise.all([getPostsPublicos(), getAreasPublicas()])
  const nomeDaArea = Object.fromEntries(areas.map((a) => [a.slug, a.nome]))

  return (
    <PaginaPublica>
      <section className="bg-marca-tinta pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="container mx-auto px-6 lg:px-12">
          <Eyebrow className="mb-5">{HOME.publicacoes.badge}</Eyebrow>
          <h1 className="max-w-3xl font-titulo text-4xl font-normal leading-[1.08] text-white sm:text-5xl">
            {HOME.publicacoes.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-marca-nevoa">{HOME.publicacoes.subtitle}</p>
        </div>
      </section>

      <section className="bg-marca-papel py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          {posts.length === 0 ? (
            <p className="text-center text-slate-600">Ainda não há publicações. Volte em breve.</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} areaNome={post.areaSlug ? nomeDaArea[post.areaSlug] : undefined} />
              ))}
            </div>
          )}
        </div>
      </section>
    </PaginaPublica>
  )
}
