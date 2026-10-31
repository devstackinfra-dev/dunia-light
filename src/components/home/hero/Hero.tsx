"use client"

import { useHeroSlides } from "@/hooks/useHeroSlides"
import { HeroCarousel } from "./HeroCarousel"
import { HeroInstitucional } from "./HeroInstitucional"
import { LandingSettings } from "@/types/landing"

interface HeroProps {
  landingSettings: LandingSettings
  isMobile: boolean
}

export function Hero({ landingSettings, isMobile }: HeroProps) {
  // Pass landingSettings so the default slide respects heroTitle/heroGlowText
  const { slides } = useHeroSlides(landingSettings)

  // Calculate dynamic padding-top to accommodate the fixed header/banner
  const hasBanner = landingSettings.showCampaignBanner
  const ptClass = hasBanner
    ? "pt-[114px] md:pt-[126px]"
    : "pt-[76px] md:pt-[88px]"

  // Sem slides cadastrados no painel, o hero é o institucional (texto + retrato).
  const soPadrao = slides.length === 1 && slides[0].id?.startsWith("default-")
  if (soPadrao) {
    return (
      <HeroInstitucional
        slide={slides[0]}
        paddingTop={hasBanner ? "pt-40 md:pt-48" : "pt-32 md:pt-40"}
      />
    )
  }

  return (
    <section className={`relative w-full bg-transparent ${ptClass}`}>
      <HeroCarousel
        slides={slides}
        isMobile={isMobile}
        autoplayInterval={landingSettings.heroAutoplayInterval || 8}
        transitionDuration={landingSettings.heroTransitionDuration || 50}
      />
    </section>
  )
}
