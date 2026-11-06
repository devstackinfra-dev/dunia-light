import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  Bookmark,
  ChevronRight,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from "lucide-react"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"
import {
  REVISTA_ARTICLES,
  getRevistaArticleBySlug,
  getRelatedRevistaArticles,
} from "@/data/revista-posts"

interface PageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  return REVISTA_ARTICLES.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const article = getRevistaArticleBySlug(params.slug)
  if (!article) return {}

  return {
    title: `${article.title} | Revista Dúnia City Hall`,
    description: article.resumo,
    openGraph: {
      title: article.title,
      description: article.resumo,
      type: "article",
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  }
}

export default function RevistaArticlePage({ params }: PageProps) {
  const article = getRevistaArticleBySlug(params.slug)
  if (!article) {
    notFound()
  }

  const related = getRelatedRevistaArticles(article.slug, 3)

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2C1810]">
      {/* Header Fixo Global */}
      <DuniaHeader currentPage="/revista" />

      <main className="pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Breadcrumb de Navegação */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-[#7D6E66] uppercase tracking-[0.16em]"
          >
            <Link href="/" className="hover:text-[#741F32] transition">
              Início
            </Link>
            <ChevronRight className="h-3 w-3 text-[#C2A17E]" />
            <Link href="/revista" className="hover:text-[#741F32] transition">
              Revista Dúnia
            </Link>
            <ChevronRight className="h-3 w-3 text-[#C2A17E]" />
            <span className="text-[#BD9463] truncate max-w-[200px] sm:max-w-none">
              {article.categoryLabel}
            </span>
          </nav>
        </div>

        {/* Cabeçalho do Artigo */}
        <header className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
          {/* Badge de Categoria */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#741F32]/10 border border-[#741F32]/20 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#741F32]">
            <Sparkles className="h-3 w-3" />
            <span>{article.label}</span>
          </div>

          {/* Título Principal */}
          <h1 className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-normal leading-[1.12] text-[#1E110A] tracking-[-0.015em]">
            {article.title}
          </h1>

          {/* Subtítulo / Linha Fina */}
          <p className="mt-4 text-base sm:text-lg md:text-xl text-[#5C4D44] font-normal leading-relaxed">
            {article.subtitle}
          </p>

          {/* Metadados: Autor, Data, Tempo de Leitura */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-[#E8DDD4] py-4 text-xs text-[#7D6E66]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#120B08] text-[#BD9463] font-serif text-sm font-bold shadow-sm">
                D
              </div>
              <div>
                <p className="font-bold text-[#1E110A]">{article.author.name}</p>
                <p className="text-[0.7rem] text-[#8C7A70]">{article.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[0.75rem] font-mono">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#BD9463]" />
                {article.publishedAt}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#BD9463]" />
                {article.readingTime}
              </span>
            </div>
          </div>
        </header>

        {/* Imagem de Capa do Artigo */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-[#D7B78D]/35 bg-[#120B08] shadow-[0_20px_50px_rgba(30,17,10,0.12)]">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1080px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* Corpo do Artigo / Editorial */}
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12 space-y-8 text-[#3D2C24]">
          {/* Parágrafo Introdutório (Lead) em Destaque */}
          <p className="font-serif text-lg sm:text-xl md:text-[1.35rem] font-normal leading-relaxed text-[#1E110A] first-letter:text-5xl first-letter:font-serif first-letter:font-normal first-letter:float-left first-letter:mr-3 first-letter:text-[#741F32]">
            {article.content.lead}
          </p>

          {/* Parágrafos Principais */}
          {article.content.paragraphs.map((par, i) => (
            <p key={i} className="text-base sm:text-lg leading-[1.8] font-normal text-[#4A3930]">
              {par}
            </p>
          ))}

          {/* Citação em Destaque (Pull Quote) */}
          {article.content.quote && (
            <blockquote className="my-10 rounded-2xl border-l-4 border-[#BD9463] bg-[#F7EFE6]/70 p-6 sm:p-8 shadow-sm">
              <p className="font-serif text-lg sm:text-xl md:text-2xl italic leading-relaxed text-[#1E110A]">
                {article.content.quote.text}
              </p>
              {article.content.quote.author && (
                <footer className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-[#741F32]">
                  — {article.content.quote.author}
                </footer>
              )}
            </blockquote>
          )}

          {/* Subseções / Tópicos */}
          {article.content.subheadings?.map((sub, i) => (
            <div key={i} className="pt-6 space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#1E110A] tracking-[-0.01em]">
                {sub.title}
              </h2>
              <p className="text-base sm:text-lg leading-[1.8] text-[#4A3930]">{sub.text}</p>
              {sub.bullets && (
                <ul className="space-y-3 pt-2">
                  {sub.bullets.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-3 text-base text-[#4A3930]">
                      <span className="mt-1.5 h-2 w-2 rounded-full bg-[#BD9463] shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Card de Destaque / Dica do Concierge */}
          {article.content.highlightCard && (
            <div className="rounded-2xl border border-[#D7B78D]/50 bg-gradient-to-br from-[#FAF5EE] to-[#F2E5D5] p-6 sm:p-8 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#BD9463]">
                <Sparkles className="h-4 w-4" />
                <span>{article.content.highlightCard.title}</span>
              </div>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#3D2C24]">
                {article.content.highlightCard.description}
              </p>
            </div>
          )}

          {/* Tags do Artigo */}
          <div className="pt-6 border-t border-[#E8DDD4] flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A70] mr-2">
              Tags:
            </span>
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-[#EFE7DC] px-3 py-1 text-xs font-medium text-[#5C493F]"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Barra de Compartilhamento e Voltar */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/revista"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#741F32] hover:text-[#541725] transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Voltar para a Revista Dúnia</span>
            </Link>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `Confira esta matéria na Revista Dúnia: "${article.title}"\nhttps://duniacityhall.com.br/revista/${article.slug}`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Compartilhar no WhatsApp</span>
            </a>
          </div>
        </article>

        {/* Banner Comercial de Conversão / Agendar Visita */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-16 sm:mt-20">
          <div className="relative overflow-hidden rounded-3xl bg-[#120B08] border border-[#BD9463]/40 p-8 sm:p-12 shadow-2xl text-white">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#BD9463]">
                VIVENCIE A EXPERIÊNCIA DÚNIA
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal text-[#F7EFE6] leading-tight">
                Transforme seu sonho em uma celebração inesquecível no Lago Sul.
              </h3>
              <p className="text-sm sm:text-base text-[#D4C7BC] leading-relaxed">
                Nossos consultores executivos estão prontos para apresentar os salões, o acervo de alta
                gastronomia e montar uma proposta personalizada para a sua data.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Li%20a%20mat%C3%A9ria%20na%20Revista%20D%C3%BAnia%20e%20gostaria%20de%20agendar%20uma%20visita%20VIP."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#741F32] hover:bg-[#541725] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-lg transition border border-[#BD9463]/40"
                >
                  <Calendar className="h-4 w-4 text-[#E8D4BF]" />
                  <span>AGENDAR VISITA VIP</span>
                </a>
                <Link
                  href="/#top"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#E8D4BF] transition"
                >
                  <span>CONHECER O SALÃO</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Matérias Relacionadas (Continue Lendo) */}
        {related.length > 0 && (
          <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-20 sm:mt-24">
            <div className="flex items-end justify-between border-b border-[#E8DDD4] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#BD9463]">
                  REVISTA DÚNIA
                </span>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-normal text-[#1E110A]">
                  Continue lendo outras histórias
                </h3>
              </div>
              <Link
                href="/revista"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#741F32] hover:underline"
              >
                <span>Ver todas as edições</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/revista/${rel.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#120B08]">
                    <Image
                      src={rel.coverImage}
                      alt={rel.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 350px"
                    />
                  </div>
                  <div className="p-5 flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-[#BD9463]">
                        {rel.label}
                      </span>
                      <h4 className="mt-1.5 font-serif text-lg font-normal text-[#1E110A] group-hover:text-[#741F32] transition line-clamp-2">
                        {rel.title}
                      </h4>
                      <p className="mt-2 text-xs text-[#6B5A50] line-clamp-2 leading-relaxed">
                        {rel.resumo}
                      </p>
                    </div>
                    <div className="pt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#741F32]">
                      <span>Ler Matéria</span>
                      <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer Global */}
      <DuniaFooter />
    </div>
  )
}
