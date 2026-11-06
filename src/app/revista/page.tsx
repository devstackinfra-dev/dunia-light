import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, ArrowRight, Calendar, Clock, ChevronRight } from "lucide-react"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"
import { REVISTA_ARTICLES } from "@/data/revista-posts"

export const metadata: Metadata = {
  title: "Revista Dúnia | Histórias, Inspirações e Alta Gastronomia em Brasília",
  description:
    "Acompanhe as tendências de cenografia monumental, alta gastronomia autoral, casamentos memoráveis e galas corporativas no Dúnia City Hall, Lago Sul.",
}

export default function RevistaIndexPage() {
  const featured = REVISTA_ARTICLES[0]
  const rest = REVISTA_ARTICLES.slice(1)

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C1810]">
      {/* Header Fixo Global */}
      <DuniaHeader currentPage="/revista" />

      <main className="pt-28 pb-20 sm:pt-36 sm:pb-28">
        {/* Cabeçalho Editorial */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#BD9463]">
              REVISTA DÚNIA • EDIÇÃO DIGITAL
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#1E110A] tracking-[-0.015em]">
              Histórias, Inspirações & Sabores
            </h1>
            <p className="text-sm sm:text-base text-[#6E5D53] leading-relaxed max-w-2xl mx-auto">
              Guias de planejamento, detalhes da cenografia clássica, bastidores da alta gastronomia e
              celebrações que marcaram época no Lago Sul.
            </p>
          </div>

          {/* Matéria de Capa em Destaque */}
          {featured && (
            <div className="mt-10 sm:mt-14">
              <Link
                href={`/revista/${featured.slug}`}
                className="group relative block overflow-hidden rounded-3xl border border-[#D7B78D]/40 bg-[#120B08] shadow-2xl transition duration-500 hover:border-[#BD9463]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                  <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-7 overflow-hidden">
                    <Image
                      src={featured.coverImage}
                      alt={featured.title}
                      fill
                      priority
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 700px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent lg:hidden" />
                  </div>

                  <div className="p-6 sm:p-10 lg:col-span-5 flex flex-col justify-between text-white space-y-4">
                    <div>
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-[#BD9463]/20 border border-[#BD9463]/40 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#BD9463]">
                        <Sparkles className="h-3 w-3" />
                        <span>MATÉRIA DE CAPA</span>
                      </div>
                      <h2 className="mt-3 font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight text-[#F7EFE6] group-hover:text-[#BD9463] transition">
                        {featured.title}
                      </h2>
                      <p className="mt-3 text-xs sm:text-sm text-[#D4C7BC] leading-relaxed line-clamp-3">
                        {featured.resumo}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="font-mono text-[#BD9463]">{featured.readingTime}</span>
                      <div className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#F7EFE6] group-hover:text-[#BD9463] transition">
                        <span>Ler Matéria Completa</span>
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Grid com as Demais Matérias */}
          <div className="mt-14 sm:mt-16">
            <div className="flex items-center justify-between border-b border-[#E8DDD4] pb-4">
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#1E110A]">
                Todas as Edições & Publicações
              </h3>
              <span className="text-xs font-mono text-[#8C7A70]">
                {REVISTA_ARTICLES.length} artigos no acervo
              </span>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((art) => (
                <Link
                  key={art.id}
                  href={`/revista/${art.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8DDD4] bg-white shadow-sm hover:shadow-2xl transition duration-500 hover:-translate-y-1.5 hover:border-[#BD9463]/60"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#120B08]">
                    <Image
                      src={art.coverImage}
                      alt={art.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>

                  <div className="p-6 flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#BD9463]">
                        {art.label}
                      </span>
                      <h4 className="mt-2 font-serif text-xl font-normal leading-snug text-[#1E110A] group-hover:text-[#741F32] transition line-clamp-2">
                        {art.title}
                      </h4>
                      <p className="mt-2.5 text-xs text-[#6B5A50] line-clamp-3 leading-relaxed">
                        {art.resumo}
                      </p>
                    </div>

                    <div className="pt-5 border-t border-[#F2ECE4] mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#741F32]">
                      <span className="text-[0.7rem] font-mono text-[#8C7A70] font-normal">
                        {art.readingTime}
                      </span>
                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition">
                        <span>Ler Matéria</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer Global */}
      <DuniaFooter />
    </div>
  )
}
