import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ChevronRight } from "lucide-react"
import { BRAND, whatsappLink } from "@/config/brand"
import { getConteudo } from "@/lib/conteudo"
import { getAreaPublica, getAreasPublicas } from "@/lib/areas-publicas"
import { getPostsPublicos } from "@/lib/posts-publicos"
import { formatarData } from "@/lib/db/posts"
import { PaginaPublica } from "@/components/home/shared/PaginaPublica"
import { Eyebrow } from "@/components/home/shared/SectionHeader"
import { HomeIcon } from "@/components/home/shared/HomeIcon"
import { HowItWorks } from "@/components/home/how-it-works/HowItWorks"
import { Contact } from "@/components/home/contact/Contact"

// Áreas editadas no painel aparecem em até 5 minutos, sem novo deploy
export const revalidate = 300

type Props = { params: { slug: string } }

export async function generateStaticParams() {
  const areas = await getAreasPublicas()
  return areas.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = await getAreaPublica(params.slug)
  if (!area) return {}
  return {
    title: area.nome,
    description: area.resumo,
    alternates: { canonical: `/areas-de-atuacao/${area.slug}` },
    openGraph: { title: `${area.nome} | ${BRAND.name}`, description: area.resumo },
  }
}

/**
 * Página de uma área de atuação, na estrutura 4V aplicada à área (ver
 * docs/ESTRUTURA-4V-AREAS.md no mvp_guilhermeHoluboski):
 *
 *   hero ("isso é para o meu problema?") → contexto (V2: o que a pessoa
 *   sente, sem prometer desfecho) → situações e serviços (V1+V3) → como
 *   funciona → contato (V4).
 *
 * História, credenciais e endereço são do site, não da área: repeti-los em
 * cada página só duplicaria conteúdo.
 */
export default async function AreaPage({ params }: Props) {
  const { home: HOME } = await getConteudo()
  const area = await getAreaPublica(params.slug)
  if (!area) notFound()

  const outras = (await getAreasPublicas()).filter((a) => a.slug !== area.slug).slice(0, 6)
  const publicacoes = (await getPostsPublicos()).filter((p) => p.areaSlug === area.slug).slice(0, 4)
  const temWhatsapp = Boolean(BRAND.contact.whatsapp)
  const mensagem = HOME.areas.whatsappMessage.replace("{item}", area.nome)

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: `${BRAND.siteUrl}/` },
      { "@type": "ListItem", position: 2, name: HOME.areas.badge, item: `${BRAND.siteUrl}/areas-de-atuacao` },
      { "@type": "ListItem", position: 3, name: area.nome, item: `${BRAND.siteUrl}/areas-de-atuacao/${area.slug}` },
    ],
  }

  return (
    <PaginaPublica>
      {/* 01 — Hero */}
      <section className="relative overflow-hidden bg-marca-tinta pb-20 pt-32 md:pb-24 md:pt-40">
        {area.imagem && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={area.imagem} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-r from-marca-tinta via-marca-tinta/90 to-marca-tinta/60" />
          </>
        )}

        <div className="container relative mx-auto px-6 lg:px-12">
          <nav aria-label="Você está em" className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-marca-nevoa">
            <Link href="/" className="hover:text-white">Início</Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <Link href="/areas-de-atuacao" className="hover:text-white">{HOME.areas.badge}</Link>
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span aria-current="page" className="text-white/80">{area.nome}</span>
          </nav>

          <Eyebrow className="mb-5">Área de atuação</Eyebrow>
          <h1 className="max-w-3xl font-titulo text-4xl font-normal leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            {area.nome}
          </h1>
          {area.resumo && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-marca-nevoa">{area.resumo}</p>
          )}

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href={temWhatsapp ? whatsappLink(mensagem) : "#contato"}
              target={temWhatsapp ? "_blank" : undefined}
              className="inline-flex items-center justify-center gap-2 rounded-sm bg-marca-latao px-7 py-3.5 text-sm font-semibold text-marca-tinta transition-colors hover:bg-marca-latao/90"
            >
              Falar sobre o meu caso <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#contato"
              className="inline-flex items-center justify-center rounded-sm border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:border-marca-latao hover:text-marca-latao"
            >
              Escrever para o escritório
            </Link>
          </div>
        </div>
      </section>

      {/* 02 — Contexto (V2): espelha a situação, não promete desfecho */}
      {area.contexto && (
        <section className="bg-white py-16 md:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <Eyebrow className="mb-6">Se você está passando por isso</Eyebrow>
            <p className="max-w-3xl whitespace-pre-line font-titulo text-2xl leading-[1.5] text-marca-tinta md:text-[1.9rem]">
              {area.contexto}
            </p>
          </div>
        </section>
      )}

      {/* 03 — Situações e serviços (V1 + V3) */}
      <section className="border-t border-slate-200 bg-marca-papel py-16 md:py-24">
        <div className="container mx-auto grid gap-14 px-6 lg:grid-cols-12 lg:px-12">
          <div className="space-y-12 lg:col-span-7">
            {area.situacoes.length > 0 && (
              <div>
                <Eyebrow className="mb-5">Situações frequentes</Eyebrow>
                <ul className="space-y-3">
                  {area.situacoes.map((s) => (
                    <li key={s} className="flex gap-3 text-base leading-relaxed text-slate-800">
                      <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-marca-latao" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {area.servicos.length > 0 && (
              <div>
                <Eyebrow className="mb-5">Como o escritório atua</Eyebrow>
                <ul className="divide-y divide-slate-200 border-y border-slate-200">
                  {area.servicos.map((s) => (
                    <li key={s.item} className="py-5">
                      <h3 className="font-titulo text-xl text-marca-tinta">{s.item}</h3>
                      {s.detalhe && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.detalhe}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="border-l-2 border-marca-latao pl-4 text-sm leading-relaxed text-slate-600">
              A estratégia adequada depende dos fatos e dos documentos de cada caso. Esta página tem
              caráter informativo e não substitui a análise individual.
            </p>
          </div>

          <aside className="space-y-6 lg:col-span-5">
            <div className="rounded-sm border border-slate-200 bg-white p-7">
              <HomeIcon name={area.icone} className="mb-4 h-6 w-6 text-marca-latao" />
              <h2 className="font-titulo text-xl text-marca-tinta">Conte a sua situação</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Para saber se e como o escritório pode atuar no seu caso, descreva o que aconteceu.
                A conversa é sigilosa.
              </p>
              <Link
                href="#contato"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-marca-tinta underline decoration-marca-latao decoration-2 underline-offset-[6px] hover:text-marca-latao"
              >
                Ir para o formulário <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {publicacoes.length > 0 && (
              <nav aria-label="Publicações da área" className="rounded-sm border border-slate-200 bg-white p-7">
                <h2 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Publicações sobre o tema
                </h2>
                <ul className="divide-y divide-slate-100">
                  {publicacoes.map((p) => (
                    <li key={p.slug} className="py-3 first:pt-0 last:pb-0">
                      <Link href={`/blog/${p.slug}`} className="group block">
                        <span className="font-titulo text-base leading-snug text-marca-tinta group-hover:text-marca-latao">{p.titulo}</span>
                        <span className="mt-1 block text-xs text-slate-500">{formatarData(p.publicadoEm)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {outras.length > 0 && (
              <nav aria-label="Outras áreas" className="rounded-sm border border-slate-200 bg-white p-7">
                <h2 className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Outras áreas de atuação
                </h2>
                <ul className="space-y-2.5">
                  {outras.map((a) => (
                    <li key={a.slug}>
                      <Link href={`/areas-de-atuacao/${a.slug}`} className="text-sm text-marca-tinta hover:text-marca-latao">
                        {a.nome}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/areas-de-atuacao" className="mt-5 inline-block border-t border-slate-200 pt-4 text-xs font-semibold text-marca-tinta hover:text-marca-latao">
                  Ver todas as áreas
                </Link>
              </nav>
            )}
          </aside>
        </div>
      </section>

      {/* 04 — Como funciona */}
      <HowItWorks />

      {/* 05 — Contato (V4), já com a área escolhida */}
      <Contact areaInicial={area.slug} />

      {/* "<" escapado: um nome de área com "</script>" não pode fechar a tag */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }}
      />
    </PaginaPublica>
  )
}
