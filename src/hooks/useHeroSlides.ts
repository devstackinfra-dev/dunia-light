import { useState, useEffect } from "react"
import { listHeroSlides, subscribeToHeroSlides } from "@/lib/db/hero"
import { HeroSlideType } from "@/types/hero-slide"
import { LandingSettings } from "@/types/landing"
import type { HomeContent } from "@/config/home-content"
import { BRAND } from "@/config/brand"
import { useHome } from "@/components/home/shared/ConteudoProvider"

/**
 * Slide exibido enquanto o cliente não cadastra nenhum no painel, com os
 * textos do hero deste cliente. Sem imagem: o fundo da página aparece por
 * trás, e nenhum banner de outro cliente vaza.
 */
function slidePadrao(home: HomeContent, landingSettings?: Partial<LandingSettings>): HeroSlideType {
  return {
    id: "default-1",
    active: true,
    order: 0,
    title: landingSettings?.heroTitle?.trim() || home.hero.title,
    glowTitle: landingSettings?.heroGlowText?.trim() || home.hero.glowTitle,
    subtitle: home.hero.subtitle,
    ctaText: home.hero.ctaText,
    ctaUrl: BRAND.vertical === "catalogo" ? "/#catalogo" : "/#contato",
    image: "",
    badge: home.hero.badge,
    overlay: "none",
    theme: "navy",
  }
}

export function useHeroSlides(landingSettings?: Partial<LandingSettings>) {
  const home = useHome()
  const [slides, setSlides] = useState<HeroSlideType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("hero_slides_v2")
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as HeroSlideType[]
          // O cache guarda só slides do painel; o padrão vem sempre dos textos atuais
          if (parsed && parsed.length > 0 && !parsed[0].id?.startsWith("default-")) {
            setSlides(parsed)
            setLoading(false)
          }
        } catch (e) {
          console.error("Erro ao carregar slides do cache local", e)
        }
      }
    }

    function processSlides(rawList: HeroSlideType[]) {
      const activeList = rawList.filter((s) => s.active)

      const now = new Date()
      const visibleList = activeList.filter((slide) => {
        const startValid = !slide.startDate || new Date(slide.startDate) <= now
        const endValid = !slide.endDate || new Date(slide.endDate) >= now
        return startValid && endValid
      })

      visibleList.sort((a, b) => {
        const priorityA = a.displayPriority ?? 0
        const priorityB = b.displayPriority ?? 0
        if (priorityA !== priorityB) return priorityB - priorityA
        return (a.order ?? 0) - (b.order ?? 0)
      })

      setSlides(visibleList)
      if (typeof window !== "undefined") {
        if (visibleList.length > 0) localStorage.setItem("hero_slides_v2", JSON.stringify(visibleList))
        else localStorage.removeItem("hero_slides_v2")
      }
      setLoading(false)
    }

    listHeroSlides()
      .then(processSlides)
      .catch((err) => {
        console.warn("Erro ao carregar slides do Supabase:", err)
        setLoading(false)
      })

    const unsub = subscribeToHeroSlides((updated) => {
      processSlides(updated)
    })

    return () => unsub()
  }, [])

  return { slides: slides.length > 0 ? slides : [slidePadrao(home, landingSettings)], loading }
}
