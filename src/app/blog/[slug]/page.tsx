import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ChevronRight } from "lucide-react"
import { BRAND, whatsappLink } from "@/config/brand"
import { getConteudo } from "@/lib/conteudo"
import { getPostPublico, getPostsPublicos } from "@/lib/posts-publicos"
import { getAreasPublicas } from "@/lib/areas-publicas"
import { formatarData, tempoDeLeitura } from "@/lib/db/posts"
import { PaginaPublica } from "@/components/home/shared/PaginaPublica"
import { Eyebrow } from "@/components/home/shared/SectionHeader"
import { TextoFormatado } from "@/components/home/shared/TextoFormatado"
import { PostCard } from "@/components/home/blog/PostCard"

export const revalidate = 300

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const posts = await getPostsPublicos()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostPublico(params.slug)
  if (!post) return {}
  const titulo = post.seoTitulo || post.titulo
  const descricao = post.seoDescricao || post.resumo
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: titulo,
      description: descricao,
      publishedTime: post.publicadoEm,
      modifiedTime: post.atualizadoEm,
      images: post.capa ? [post.capa] : undefined,
    },
  }
}

/**
 * Página de uma publicação. Conteúdo informativo, com o aviso expresso de que
 * não substitui orientação individual (o verificador da OAB trata essa nota
 * como boa prática), e convite sóbrio ao contato.
 */
export default async function PostPage({ params }: Props) {
  const { home: HOME } = await getConteudo()
  const post = await getPostPublico(params.slug)
  if (!post) notFound()

  const [todos, areas] = await Promise.all([getPostsPublicos(), getAreasPublicas()])
  const area = areas.find((a) => a.slug === post.areaSlug)
  // Leia também: primeiro os da mesma área, depois os mais recentes
  const outros = todos
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.areaSlug === post.areaSlug) - Number(a.areaSlug === post.areaSlug))
    .slice(0, 3)
  const nomeDaArea = Object.fromEntries(areas.map((a) => [a.slug, a.nome]))
  const temWhatsapp = Boolean(BRAND.contact.whatsapp)

  const artigo = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.titulo,
    description: post.resumo,
    datePublished: post.publicadoEm,
    dateModified: post.atualizadoEm,
    image: post.capa || undefined,
    author: { "@type": "Person", name: post.autor || BRAND.professional.name || BRAND.name },
    publisher: { "@type": "Organization", name: BRAND.name },
    mainEntityOfPage: `${BRAND.siteUrl}/blog/${post.slug}`,
  }

  return (
    <PaginaPublica>
      <section className="bg-marca-tinta pb-14 pt-32 md:pb-16 md:pt-40">
        <div className="container mx-auto max-w-4xl px-6">
          <nav aria-label="Você está em" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-marca-nevoa">
            <Link href="/" className="hover:text-white">Início</Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <Link href="/blog" className="hover:text-white">{HOME.publicacoes.badge}</Link>
          </nav>

          {area && <Eyebrow className="mb-5">{area.nome}</Eyebrow>}
          <h1 className="font-titulo text-3xl font-normal leading-[1.12] text-white sm:text-4xl lg:text-5xl">{post.titulo}</h1>
          {post.resumo && <p className="mt-6 text-lg leading-relaxed text-marca-nevoa">{post.resumo}</p>}
          <p className="mt-8 text-sm text-marca-nevoa">
            {[post.autor, formatarData(post.publicadoEm), `${tempoDeLeitura(post.conteudo)} min de leitura`].filter(Boolean).join(" · ")}
          </p>
        </div>
      </section>

      <article className="bg-white py-14 md:py-20">
        <div className="container mx-auto max-w-3xl px-6">
          {post.capa && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.capa} alt="" className="mb-12 aspect-[16/9] w-full rounded-sm object-cover" />
          )}

          <TextoFormatado texto={post.conteudo} />

          <p className="mt-12 border-l-2 border-marca-latao pl-4 text-sm leading-relaxed text-slate-600">
            Conteúdo informativo. Cada situação tem particularidades e não dispensa a análise individual de um advogado.
          </p>

          <div className="mt-12 rounded-sm border border-slate-200 bg-marca-papel p-7">
            <h2 className="font-titulo text-xl text-marca-tinta">Ficou com dúvida sobre o seu caso?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Conte o que está acontecendo. A conversa é sigilosa.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Link
                href={temWhatsapp ? whatsappLink(`Olá! Li a publicação "${post.titulo}" no site e gostaria de conversar.`) : "/#contato"}
                target={temWhatsapp ? "_blank" : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-marca-tinta px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-marca-tinta/90"
              >
                Falar com o escritório <ArrowRight className="h-4 w-4" />
              </Link>
              {area && (
                <Link
                  href={`/areas-de-atuacao/${area.slug}`}
                  className="inline-flex items-center justify-center rounded-sm border border-slate-300 px-6 py-3 text-sm font-semibold text-marca-tinta transition-colors hover:border-marca-latao"
                >
                  Conhecer a área: {area.nome}
                </Link>
              )}
            </div>
          </div>
        </div>
      </article>

      {outros.length > 0 && (
        <section className="border-t border-slate-200 bg-marca-papel py-16 md:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <h2 className="mb-10 font-titulo text-2xl text-marca-tinta md:text-3xl">Leia também</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {outros.map((p) => (
                <PostCard key={p.id} post={p} areaNome={p.areaSlug ? nomeDaArea[p.areaSlug] : undefined} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* "<" escapado: um título com "</script>" não pode fechar a tag */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(artigo).replace(/</g, "\\u003c") }} />
    </PaginaPublica>
  )
}
