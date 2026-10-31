import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BRAND } from "@/config/brand"
import { getConteudo } from "@/lib/conteudo"
import { getAreasPublicas } from "@/lib/areas-publicas"
import { PaginaPublica } from "@/components/home/shared/PaginaPublica"
import { Eyebrow } from "@/components/home/shared/SectionHeader"
import { HomeIcon } from "@/components/home/shared/HomeIcon"

export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  const { home: HOME } = await getConteudo()
  return {
    title: HOME.areas.badge,
    description: `${HOME.areas.subtitle} ${BRAND.name}.`.trim(),
    alternates: { canonical: "/areas-de-atuacao" },
  }
}

/** Índice das áreas de atuação, cada uma levando à sua página. */
export default async function AreasPage() {
  const { home: HOME } = await getConteudo()
  const areas = await getAreasPublicas()

  return (
    <PaginaPublica>
      <section className="bg-marca-tinta pb-16 pt-32 md:pb-20 md:pt-40">
        <div className="container mx-auto px-6 lg:px-12">
          <Eyebrow className="mb-5">{HOME.areas.badge}</Eyebrow>
          <h1 className="max-w-3xl font-titulo text-4xl font-normal leading-[1.08] text-white sm:text-5xl">
            {HOME.areas.title}
          </h1>
          {HOME.areas.subtitle && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-marca-nevoa">{HOME.areas.subtitle}</p>
          )}
        </div>
      </section>

      <section className="bg-marca-papel py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-12">
          <ul className="grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area) => (
              <li key={area.slug} className="bg-white">
                <Link
                  href={`/areas-de-atuacao/${area.slug}`}
                  className="group flex h-full flex-col p-7 transition-colors hover:bg-slate-50 focus-visible:bg-slate-50"
                >
                  <HomeIcon name={area.icone} className="mb-5 h-6 w-6 text-marca-latao" />
                  <h2 className="font-titulo text-2xl text-marca-tinta">{area.nome}</h2>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{area.resumo}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-marca-tinta group-hover:text-marca-latao">
                    Conhecer a área <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PaginaPublica>
  )
}
