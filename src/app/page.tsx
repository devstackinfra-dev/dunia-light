"use client"

import type { ReactNode } from "react"
import { useLandingSettings } from "@/hooks/useLandingSettings"
import { Navbar } from "@/components/home/navbar/Navbar"
import { Hero } from "@/components/home/hero/Hero"
import { CampaignBanner } from "@/components/home/campaign-banner/CampaignBanner"
import { Areas } from "@/components/home/areas/Areas"
import { FilmReel } from "@/components/home/film/FilmReel"
import { Sobre } from "@/components/home/sobre/Sobre"
import { Chamada } from "@/components/home/chamada/Chamada"
import { Publicacoes } from "@/components/home/blog/Publicacoes"
import { Catalog } from "@/components/home/catalog/Catalog"
import { Advantages } from "@/components/home/advantages/Advantages"
import { HowItWorks } from "@/components/home/how-it-works/HowItWorks"
import { Testimonials } from "@/components/home/testimonials/Testimonials"
import { FAQ } from "@/components/home/faq/FAQ"
import { Contact } from "@/components/home/contact/Contact"
import { Footer } from "@/components/home/footer/Footer"
import { AvisoPrivacidade } from "@/components/home/privacidade/AvisoPrivacidade"
import { type HomeSectionId } from "@/config/home-content"
import { useHome } from "@/components/home/shared/ConteudoProvider"

/**
 * Página inicial do template Louzeiro Advocacia.
 * As fotografias reais do escritório e da Dra. Samantha são integradas diretamente
 * na cenografia e nos cards de cada seção para máxima presença visual e autoridade.
 */
export default function Home() {
  const HOME = useHome()
  const { landingSettings, isMobile } = useLandingSettings()

  const secoes: Record<HomeSectionId, ReactNode> = {
    hero: <Hero landingSettings={landingSettings} isMobile={isMobile} />,
    campanha: <CampaignBanner landingSettings={landingSettings} />,
    areas: <Areas />,
    film: <FilmReel />,
    sobre: <Sobre />,
    chamada: <Chamada />,
    publicacoes: <Publicacoes />,
    catalogo: <Catalog />,
    diferenciais: <Advantages />,
    "como-funciona": <HowItWorks />,
    depoimentos: <Testimonials />,
    faq: <FAQ />,
    contato: <Contact />,
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-marca-tinta font-corpo text-slate-900 antialiased">
      <Navbar landingSettings={landingSettings} />

      <main className="flex-1">
        {HOME.sections.map((id) => (
          <div key={id}>
            {secoes[id]}
          </div>
        ))}
      </main>

      <Footer />
      <AvisoPrivacidade />
    </div>
  )
}
