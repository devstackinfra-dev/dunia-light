"use client"

import {
  getStoredArticles,
  DEFAULT_DUNIA_ARTICLES,
  type DuniaArticle,
  getCommercialMode,
  type DuniaCommercialMode,
  getStoredCelebrationCards,
  DEFAULT_CELEBRATION_CARDS,
  type DuniaCelebrationCard,
} from "@/lib/dunia-store"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import DuniaGalleryViewer from "@/components/dunia-gallery-viewer"
import DuniaHeader from "@/components/dunia-header"
import CenografiaSpacesInteractive from "@/components/home/cenografia-spaces-interactive"
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Award,
  Users,
  Shield,
  Star,
  CheckCircle2,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Menu,
  Heart,
  Globe,
  QrCode,
  Camera,
} from "lucide-react"

const HERO_SLIDES = [
  {
    image: "/images/dunia/fachada-monumental.jpg",
    tag: "ARQUITETURA MONUMENTAL",
    title: "Fachada & Porte-Cochère",
    subtitle: "Chegada triunfal coberta no Lago Sul de Brasília",
    objectPosition: "center 42%",
    mobileObjectPosition: "center 38%",
  },
  {
    image: "/images/dunia/salao-principal.jpg",
    tag: "ESTRUTURA MONUMENTAL",
    title: "Salão Imperial de 2.500 m²",
    subtitle: "Lustres de cristal Baccarat, pé-direito duplo de 7m e acústica impecável",
    objectPosition: "center 30%",
    mobileObjectPosition: "center 28%",
  },
  {
    image: "/images/dunia/casal.jpg",
    tag: "O SIM DOS SONHOS",
    title: "Casamentos Memoráveis",
    subtitle: "O romantismo clássico e a distinção no Lago Sul de Brasília",
    objectPosition: "center 22%",
    mobileObjectPosition: "center 20%",
  },
  {
    image: "/images/dunia/mesa.jpg",
    tag: "CENOGRAFIA & DETALHES",
    title: "Mesa Posta & Cristais",
    subtitle: "Arranjos florais nobres e iluminação cenográfica sob medida",
    objectPosition: "center 35%",
    mobileObjectPosition: "center 35%",
  },
  {
    image: "/images/dunia/buffet-galeria.jpg",
    tag: "ALTA GASTRONOMIA",
    title: "Buffet Dúnia Autoral",
    subtitle: "Menus autorais e degustações exclusivas para anfitriões",
    objectPosition: "center 50%",
    mobileObjectPosition: "center 50%",
  },
  {
    image: "/images/dunia/jardim-galeria.jpg",
    tag: "ÁREA EXTERNA PRIVATIVA",
    title: "Jardim Imperial & Pôr do Sol",
    subtitle: "Espelho d'água ao ar livre para cerimônias encantadoras",
    objectPosition: "center 40%",
    mobileObjectPosition: "center 40%",
  },
  {
    image: "/images/dunia/debutante-hero.jpg",
    tag: "15 ANOS & GRANDES CELEBRAÇÕES",
    title: "Debutantes & Grandes Galas",
    subtitle: "Pista monumental, som e luz cênica com energia vibrante",
    objectPosition: "center 20%",
    mobileObjectPosition: "center 20%",
  },
]

export default function Home() {
  const [commercialMode, setCommercialMode] = useState<DuniaCommercialMode>("light")
  const [activeStoryAct, setActiveStoryAct] = useState(0)
  const [isStoryHovered, setIsStoryHovered] = useState(false)
  const [journalFilter, setJournalFilter] = useState<string>("all")
  const [showAllArticles, setShowAllArticles] = useState(false)
  const [articlesList, setArticlesList] = useState<DuniaArticle[]>(DEFAULT_DUNIA_ARTICLES)
  const [selectedArticle, setSelectedArticle] = useState<DuniaArticle | null>(null)
  const [celebrationCards, setCelebrationCards] = useState<DuniaCelebrationCard[]>(DEFAULT_CELEBRATION_CARDS)

  // Estados do Carrossel de Fotos no Hero
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0)
  const [isHeroCarouselHovered, setIsHeroCarouselHovered] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchStartY, setTouchStartY] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    setCommercialMode(getCommercialMode())
    const onModeChange = (e: any) => {
      if (e.detail) setCommercialMode(e.detail)
    }
    window.addEventListener("dunia-mode-change", onModeChange)

    const loadArticles = () => {
      const stored = getStoredArticles() || []
      const publicOnly = stored.filter((a) => a.status !== "rascunho")
      setArticlesList(publicOnly.length > 0 ? publicOnly : DEFAULT_DUNIA_ARTICLES)
    }
    loadArticles()
    window.addEventListener("dunia-articles-change", loadArticles)

    const loadCelebrations = () => {
      const stored = getStoredCelebrationCards()
      setCelebrationCards(stored && stored.length > 0 ? stored : DEFAULT_CELEBRATION_CARDS)
    }
    loadCelebrations()
    window.addEventListener("dunia-celebrations-change", loadCelebrations)

    return () => {
      window.removeEventListener("dunia-mode-change", onModeChange)
      window.removeEventListener("dunia-articles-change", loadArticles)
      window.removeEventListener("dunia-celebrations-change", loadCelebrations)
    }
  }, [])

  // Auto-avanço cinematográfico do Carrossel a cada 6.5 segundos (entre 6 e 7s)
  useEffect(() => {
    if (isHeroCarouselHovered) return
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 6500)
    return () => clearInterval(timer)
  }, [isHeroCarouselHovered])

  // Gestos de toque no mobile (Swipe Inteligente com Tolerância Vertical)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
    setIsHeroCarouselHovered(true)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null && touchStartY !== null) {
      const touchEndX = e.changedTouches[0].clientX
      const touchEndY = e.changedTouches[0].clientY
      const diffX = touchStartX - touchEndX
      const diffY = touchStartY - touchEndY
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) {
          nextHeroSlide()
        } else {
          prevHeroSlide()
        }
      }
      setTouchStartX(null)
      setTouchStartY(null)
    }
    setTimeout(() => setIsHeroCarouselHovered(false), 3000)
  }

  // Auto-avanço da narrativa cinematográfica a cada 6 segundos
  useEffect(() => {
    if (isStoryHovered) return
    const timer = setInterval(() => {
      setActiveStoryAct((prev) => (prev + 1) % 3)
    }, 6000)
    return () => clearInterval(timer)
  }, [isStoryHovered])

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  }

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

  const filteredArticles = (articlesList || DEFAULT_DUNIA_ARTICLES || []).filter(
    (a) => journalFilter === "all" || a.category === journalFilter
  )
  const visibleArticles = showAllArticles ? filteredArticles : filteredArticles.slice(0, 3)

  return (
    <div className="relative min-h-screen bg-transparent text-[#30221D] antialiased selection:bg-[#741F32]/15 selection:text-[#741F32] overflow-x-hidden">
      {/* HEADER NAVEGACAO CENTRALIZADO DE ALTO LUXO */}
      <DuniaHeader currentPage="/" />

      {/* 1. HERO SECTION CINEMATOGRÁFICO: EXPERIÊNCIA RESPONSIVA PREMIUM MOBILE + DESKTOP */}
      <section
        id="top"
        className="relative mx-auto w-full max-w-[1380px] mt-20 sm:mt-24 lg:mt-28 min-h-[90svh] lg:min-h-[640px] lg:h-[clamp(640px,76vh,760px)] overflow-hidden bg-[#120B08] z-10 select-none flex flex-col justify-between pt-6 sm:pt-8 lg:pt-8 pb-5 sm:pb-6 shadow-2xl rounded-2xl lg:rounded-[1.75rem] border border-[#BD9463]/25"
        onMouseEnter={() => setIsHeroCarouselHovered(true)}
        onMouseLeave={() => setIsHeroCarouselHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label="Apresentação Monumental Dúnia City Hall"
      >
        {/* A FOTOGRAFIA OCUPA O HERO (TELA AMPLA COM ENQUADRAMENTO RESPONSIVO E KEN BURNS SUAVE) */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.image}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentHeroSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="(max-width: 1024px) 100vw, 1380px"
                style={{
                  objectPosition: isMobile ? slide.mobileObjectPosition : slide.objectPosition,
                }}
                className="object-cover filter brightness-[0.95] contrast-[1.02] transition-opacity duration-1000 ease-in-out"
              />
            </div>
          ))}

          {/* GRADIENTES REFINADOS:
              - Mobile: Topo suave para logo/menu, meio livre para apreciar a fotografia, e gradiente escuro progressivo a partir de 35% para contraste perfeito dos textos e botões.
              - Desktop: Vinheta lateral esquerda clássica e discreta para respiro do card flutuante. */}
          {/* Mobile Progressive Gradient */}
          <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 via-35% via-[#120B08]/85 via-60% to-[#120B08] pointer-events-none" />

          {/* Desktop Vignettes */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-full sm:w-2/3 lg:w-[48%] bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none" />
          <div className="hidden lg:block absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/75 via-black/25 to-transparent pointer-events-none" />
          <div className="hidden lg:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />
        </div>

        {/* CONTAINER DO CONTEÚDO PRINCIPAL (MOBILE E DESKTOP COMPARTILHAM O MESMO CARROSSEL E ESTADOS) */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:px-12 w-full flex-1 flex flex-col justify-between relative z-20">

          {/* ========================================================
              LAYOUT MOBILE (< 768px / lg:hidden): COMPOSIÇÃO CINEMATOGRÁFICA
              - Sem card preto opaco envolvendo tudo
              - Fotografia em destaque superior
              - Marca Dúnia independente no topo
              - Textos e CTAs sobre o gradiente progressivo
              - Controles e miniaturas na base com touch target de 44px
              ======================================================== */}
          <div className="flex lg:hidden flex-col justify-between flex-1 gap-4 pt-1 pb-1">
            
            {/* Bloco Superior: Marca e Kicker Independentes da Foto */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="h-px w-5 bg-[#BD9463]" />
                <span className="text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#BD9463]">
                  SHIS QI 15 • LAGO SUL, BRASÍLIA
                </span>
              </div>

              <div className="pt-0.5">
                <Link href="/" className="inline-block group focus:outline-none" aria-label="Dúnia City Hall">
                  <Image
                    src="/images/dunia/logo-dunia-hd.png"
                    alt="Dúnia City Hall"
                    width={280}
                    height={88}
                    priority
                    className="w-40 sm:w-48 h-auto object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.85)]"
                  />
                </Link>
              </div>

              {/* Tag do Slide e Contador */}
              <div className="pt-1.5 flex items-center gap-2">
                <span className="rounded-full bg-black/60 backdrop-blur-md border border-[#D7B78D]/35 px-3 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[#BD9463]">
                  {HERO_SLIDES[currentHeroSlide].tag}
                </span>
                <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-2.5 py-1 text-[0.62rem] font-mono font-bold text-[#F7EFE6]">
                  0{currentHeroSlide + 1} / 0{HERO_SLIDES.length}
                </span>
              </div>
            </div>

            {/* Espaço central de visualização livre da fotografia */}
            <div className="flex-1 min-h-[40px] sm:min-h-[80px]" />

            {/* Bloco Inferior: Textos, CTAs e Controles sobre a Região Escurecida */}
            <div className="space-y-3 pt-2">
              
              {/* Título Poético */}
              <h1 className="font-serif text-2xl sm:text-3xl font-normal leading-[1.12] text-[#F7EFE6] tracking-[-0.015em] drop-shadow-md">
                Há dias que não cabem <br />
                <em className="italic text-[#E8D4BF] font-normal">no tempo.</em>
              </h1>

              {/* Descrição Objetiva Mobile */}
              <p className="text-xs sm:text-[0.82rem] text-[#D4C7BC] leading-relaxed font-sans font-normal max-w-sm drop-shadow-sm">
                2.500 m² de arquitetura clássica, alta gastronomia autoral e celebrações memoráveis na capital federal.
              </p>

              {/* Botões Comerciais Facilmente Acessíveis (Touch Target >= 44px) */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <a
                  href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20reservar%20minha%20data%20e%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#741F32] hover:bg-[#541725] px-5 py-3 min-h-[44px] text-xs font-bold uppercase tracking-[0.14em] text-white shadow-lg border border-[#BD9463]/30 transition-all active:scale-[0.98]"
                >
                  <Calendar className="h-4 w-4 text-[#E8D4BF]" />
                  <span>RESERVAR MINHA DATA</span>
                </a>

                {/*<a
                  href="#story"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D7B78D]/45 bg-white/10 hover:bg-white/18 px-4 py-3 min-h-[44px] text-xs font-semibold uppercase tracking-[0.12em] text-[#E8D4BF] backdrop-blur-md transition-all active:scale-[0.98]"
                >
                  <span>CONHECER O ESPAÇO</span>
                  <ArrowRight className="h-4 w-4" />
                </a>*/}
              </div>

              {/* Legenda do Slide Ativo no Mobile */}
              <div className="pt-1">
                <h3 className="font-serif text-sm font-normal text-white leading-tight drop-shadow-sm">
                  {HERO_SLIDES[currentHeroSlide].title}
                </h3>
                <p className="text-[0.66rem] text-white/80 line-clamp-1 font-sans mt-0.5">
                  {HERO_SLIDES[currentHeroSlide].subtitle}
                </p>
              </div>

              {/* Controles de Navegação: Setas 44x44px + Miniaturas Roláveis */}
              <div className="flex items-center justify-between gap-2.5 pt-1">
                {/* Setas Circulares Mobile (Área Interativa de 44x44px) */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={prevHeroSlide}
                    className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/65 text-white/90 hover:bg-[#741F32] hover:text-white backdrop-blur-md border border-white/20 transition shadow-md active:scale-95"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextHeroSlide}
                    className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-black/65 text-white/90 hover:bg-[#741F32] hover:text-white backdrop-blur-md border border-white/20 transition shadow-md active:scale-95"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                {/* Miniaturas Horizontais com Tamanho Confortável para Toque */}
                <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 pl-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.image}
                      onClick={() => setCurrentHeroSlide(idx)}
                      className={`relative h-11 w-16 sm:h-12 sm:w-18 min-h-[44px] rounded-xl overflow-hidden border shrink-0 transition-all duration-300 ${
                        idx === currentHeroSlide
                          ? "border-[#BD9463] ring-2 ring-[#BD9463] scale-105 shadow-xl opacity-100"
                          : "border-white/25 opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Ver foto ${idx + 1}: ${slide.title}`}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="80px"
                        className="object-cover"
                        style={{ objectPosition: slide.mobileObjectPosition }}
                      />
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================
              LAYOUT DESKTOP (>= 1024px / hidden lg:flex):
              - Card de vidro escuro flutuante à esquerda
              - Badges institucionais no topo direito
              - Barra inferior com legenda e miniaturas harmonizadas
              ======================================================== */}
          <div className="hidden lg:flex lg:flex-col lg:justify-between lg:flex-1">
            
            {/* Linha Superior: Card Flutuante (Esquerda) + Badges (Direita) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Card Flutuante com Fundo Translúcido e Blur (Efeito Vidro / Glassmorphic) */}
              <div className="lg:col-span-5 xl:col-span-5">
                <div className="rounded-2xl sm:rounded-[1.5rem] border border-white/10 sm:border-[#BD9463]/30 bg-black/25 sm:bg-[#120B08]/40 backdrop-blur-xl p-3.5 sm:p-4.5 lg:p-5 shadow-[0_20px_45px_rgba(0,0,0,0.55)] space-y-2 sm:space-y-2.5 text-left max-w-[395px]">
                  
                  {/* Kicker Institucional */}
                  <div className="flex items-center gap-2">
                    <span className="h-px w-5 bg-[#BD9463]" />
                    <span className="text-[0.58rem] sm:text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#BD9463]">
                      SHIS QI 15 • LAGO SUL, BRASÍLIA
                    </span>
                  </div>

                  {/* A Marca Dúnia City Hall */}
                  <div className="inline-block">
                    <Link href="/" className="inline-block group focus:outline-none" aria-label="Dúnia City Hall">
                      <Image
                        src="/images/dunia/logo-dunia-hd.png"
                        alt="Dúnia City Hall"
                        width={300}
                        height={96}
                        priority
                        className="w-36 sm:w-44 md:w-48 lg:w-[210px] xl:w-[230px] h-auto object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] transition duration-300 group-hover:scale-[1.01]"
                      />
                    </Link>
                  </div>

                  {/* Título Poético */}
                  <h1 className="font-serif text-base sm:text-lg lg:text-[1.35rem] xl:text-[1.5rem] font-normal leading-[1.18] text-[#F7EFE6] tracking-[-0.015em]">
                    Há dias que não cabem <br className="hidden sm:inline" />
                    <em className="italic text-[#E8D4BF] font-normal">no tempo.</em>
                  </h1>

                  {/* Descrição Concisa */}
                  <p className="text-[0.72rem] sm:text-[0.78rem] text-[#D4C7BC] leading-relaxed font-sans font-normal max-w-sm">
                    O cenário dos momentos mais nobres e celebrações memoráveis da capital federal. 2.500 m² de arquitetura clássica, alta gastronomia autoral e acústica impecável.
                  </p>

                  {/* Dupla de CTAs Refinados */}
                  <div className="pt-0.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <a
                      href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20reservar%20minha%20data%20e%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#741F32] hover:bg-[#541725] px-4 py-2 text-[0.68rem] sm:text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md border border-[#BD9463]/30 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <Calendar className="h-3.5 w-3.5 text-[#E8D4BF]" />
                      <span>RESERVAR MINHA DATA</span>
                    </a>

                    <a
                      href="#story"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D7B78D]/45 bg-white/10 hover:bg-white/18 px-3.5 py-2 text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#E8D4BF] backdrop-blur-md transition-all duration-300 shadow-sm"
                    >
                      <span>CONHECER O ESPAÇO</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Selo de Credibilidade */}
                  <div className="flex flex-wrap items-center gap-2 text-[0.52rem] sm:text-[0.58rem] text-[#D4C7BC]/75 uppercase tracking-wider font-medium pt-1 border-t border-white/10">
                    <span className="flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5 text-[#BD9463]" />
                      2.500 M² NO LAGO SUL
                    </span>
                    <span className="text-[#BD9463]/60">•</span>
                    <span>1.200 CONVIDADOS</span>
                    <span className="text-[#BD9463]/60">•</span>
                    <span>ALTA GASTRONOMIA</span>
                  </div>

                </div>
              </div>

              {/* Badges Flutuantes no Canto Superior Direito (Desktop) */}
              <div className="hidden lg:flex lg:col-span-7 justify-end items-center gap-3 pt-1">
                <span className="rounded-full bg-black/65 backdrop-blur-md border border-[#D7B78D]/35 px-3.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#BD9463] shadow-lg">
                  {HERO_SLIDES[currentHeroSlide].tag}
                </span>

                <div className="rounded-full bg-black/65 backdrop-blur-md border border-white/15 px-3.5 py-1 text-[0.65rem] font-bold text-[#F7EFE6] tracking-widest font-mono shadow-lg">
                  0{currentHeroSlide + 1} <span className="text-[#BD9463]">/</span> 0{HERO_SLIDES.length}
                </div>
              </div>

            </div>

            {/* Faixa Inferior sobre a Foto: Legenda à Esquerda + Miniaturas e Controles à Direita (100% Visíveis e com Alto Contraste) */}
            <div className="relative z-20 pt-2 sm:pt-3 flex flex-col lg:flex-row items-stretch lg:items-end justify-between gap-2.5 sm:gap-3">
              
              {/* Legenda Flutuante com Fundo Translúcido e Blur */}
              <div className="rounded-xl border border-white/15 bg-black/45 backdrop-blur-md px-3.5 py-2 shadow-xl text-white max-w-lg">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[0.54rem] font-bold uppercase tracking-[0.22em] text-[#BD9463] block drop-shadow-sm">
                    DÚNIA CITY HALL • LAGO SUL
                  </span>
                  <span className="lg:hidden text-[0.56rem] font-mono text-[#BD9463] font-bold">
                    0{currentHeroSlide + 1} / 0{HERO_SLIDES.length}
                  </span>
                </div>
                <h3 className="font-serif text-xs sm:text-sm font-normal text-white mt-0.5 leading-snug drop-shadow-md">
                  {HERO_SLIDES[currentHeroSlide].title}
                </h3>
                <p className="text-[0.62rem] text-white/80 line-clamp-1 font-sans mt-0.5">
                  {HERO_SLIDES[currentHeroSlide].subtitle}
                </p>
              </div>

              {/* Controles: Setas e Miniaturas Roláveis */}
              <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-2.5">
                {/* Setas Circulares */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={prevHeroSlide}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/65 text-white/90 hover:bg-[#741F32] hover:text-white backdrop-blur-md border border-white/20 transition shadow-md active:scale-95"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={nextHeroSlide}
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-black/65 text-white/90 hover:bg-[#741F32] hover:text-white backdrop-blur-md border border-white/20 transition shadow-md active:scale-95"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Miniaturas Navegáveis com scrollbar oculta */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-[280px] sm:max-w-none pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {HERO_SLIDES.map((slide, idx) => (
                    <button
                      key={slide.image}
                      onClick={() => setCurrentHeroSlide(idx)}
                      className={`relative h-9 w-13 sm:h-10 sm:w-15 rounded-xl overflow-hidden border shrink-0 transition-all duration-300 ${
                        idx === currentHeroSlide
                          ? "border-[#BD9463] ring-2 ring-[#BD9463] scale-105 shadow-xl"
                          : "border-white/25 opacity-65 hover:opacity-100 hover:border-white/60"
                      }`}
                      aria-label={`Ver foto ${idx + 1}: ${slide.title}`}
                    >
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="70px"
                        className="object-cover"
                        style={{ objectPosition: slide.objectPosition }}
                      />
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* GRADIENTE INFERIOR SUAVE PARA PROTEGER A LEITURA DOS CONTROLES */}
        <div className="pointer-events-none absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-black/75 via-black/35 to-transparent z-10" />
      </section>

      {/* CONTAINER CENTRALIZADO DO RESTANTE DO HOTSITE */}
      <main className="mx-auto w-full max-w-[1380px] px-4 sm:px-6 lg:px-8">
        
        {/* 2. CARD INSTITUCIONAL — EMOÇÃO E CREDIBILIDADE (CHAMPAGNE PROFUNDO & LINHAS FINAS) */}
        <section className="my-14 overflow-hidden rounded-3xl bg-gradient-to-br from-[#F2E4D5]/90 via-[#F7EFE6] to-[#E8D4BF]/80 border border-[#D7B78D]/50 p-8 sm:p-14 text-[#30221D] shadow-[0_16px_45px_rgba(84,23,37,0.06)]">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#741F32]">
              POR TRÁS DE CADA CELEBRAÇÃO
            </span>
            <h2 className="mt-3 font-serif text-2xl sm:text-4xl lg:text-[2.6rem] font-normal leading-snug text-[#30221D]">
              O que torna um momento inesquecível não é a grandiosidade.<br className="hidden sm:inline" />
              É a <em className="italic text-[#741F32]">emoção</em> que fica.
            </h2>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#77665D]">
              Desde 2008, o Dúnia City Hall acolhe os momentos mais marcantes da capital federal. Com arquitetura clássica no Lago Sul, lustres de cristal e gastronomia autoral, criamos cenários onde o afeto e a distinção se encontram.
            </p>

            {/* Credenciais Arquitetônicas & Tradição do Dúnia (Com Divisórias Finas em Dourado Discreto) */}
            <div className="mt-10 pt-8 border-t border-[#D7B78D]/35 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#30221D] tracking-tight">2.500 m²</span>
                <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#741F32]">Área Nobre Lago Sul</p>
              </div>
              <div className="sm:border-x sm:border-[#D7B78D]/35">
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#30221D] tracking-tight">1.200</span>
                <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#741F32]">Convidados Confortáveis</p>
              </div>
              <div>
                <span className="font-serif text-3xl sm:text-4xl font-normal text-[#30221D] tracking-tight">+15 Anos</span>
                <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#741F32]">Excelência em Brasília</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. UMA HISTÓRIA EM TRÊS ATOS (PALCO CINEMATOGRÁFICO INTEGRADO) */}
        <section
          id="story"
          className="relative my-10"
          aria-label="História em três atos"
        >
          <div
            className="story-stage rounded-3xl overflow-hidden border border-[#D7B78D]/35 shadow-[0_25px_60px_-15px_rgba(84,23,37,0.22)]"
            onMouseEnter={() => setIsStoryHovered(true)}
            onMouseLeave={() => setIsStoryHovered(false)}
          >
            {/* CENA 01: A EXPECTATIVA */}
            <div
              className={`stage-scene ${activeStoryAct === 0 ? "active" : ""}`}
              data-scene="0"
            >
              <Image
                src="/images/dunia/salao-principal.jpg"
                alt="Salão preparado com luzes e flores"
                fill
                className="object-cover object-[center_25%]"
                priority
              />
              <div className="stage-shade left" />
              <div className="stage-caption caption-left">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#BD9463]">
                  CAPÍTULO 01 <span className="dot" /> A EXPECTATIVA
                </p>
                <h2>
                  Tudo começa<br />com um <em>sonho.</em>
                </h2>
                <p>
                  Antes do primeiro convidado chegar, cada luz acesa, cada mesa preparada e cada detalhe carregam uma promessa: hoje, algo extraordinário vai acontecer.
                </p>
                <span className="stage-tag">O SILÊNCIO ANTES DA PRIMEIRA MÚSICA</span>
              </div>
            </div>

            {/* CENA 02: O ENCONTRO */}
            <div
              className={`stage-scene ${activeStoryAct === 1 ? "active" : ""}`}
              data-scene="1"
            >
              <Image
                src="/images/dunia/casal.jpg"
                alt="Casal celebrando o sim no Dúnia"
                fill
                className="object-cover object-[center_15%]"
              />
              <div className="stage-shade right" />
              <div className="stage-caption caption-right">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#BD9463]">
                  CAPÍTULO 02 <span className="dot" /> O ENCONTRO
                </p>
                <h2>
                  Então, a vida<br /><em>acontece.</em>
                </h2>
                <p>
                  Um olhar atravessa a sala. A música começa. As pessoas que importam estão ali. E, por alguns instantes, o mundo parece existir apenas para aquele encontro.
                </p>
                <span className="stage-tag">O INSTANTE EM QUE TUDO FAZ SENTIDO</span>
              </div>
            </div>

            {/* CENA 03: A MEMÓRIA */}
            <div
              className={`stage-scene ${activeStoryAct === 2 ? "active" : ""}`}
              data-scene="2"
            >
              <Image
                src="/images/dunia/festas-hero.jpg"
                alt="Celebração e brinde com convidados"
                fill
                className="object-cover object-[center_20%]"
              />
              <div className="stage-shade left" />
              <div className="stage-caption caption-left">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#BD9463]">
                  CAPÍTULO 03 <span className="dot" /> A MEMÓRIA
                </p>
                <h2>
                  A noite termina.<br /><em>A emoção fica.</em>
                </h2>
                <p>
                  As flores são recolhidas, as luzes se apagam. Mas aquele abraço, aquela risada e aquela canção continuam existindo dentro de nós.
                </p>
                <span className="stage-tag">PORQUE O QUE FICA É O QUE SENTIMOS</span>
              </div>
            </div>

            {/* Pílulas de Navegação Direta no Topo Direito do Card */}
            <div className="absolute top-4 right-4 z-20 flex gap-1.5">
              {[
                { label: "ATO 01", idx: 0 },
                { label: "ATO 02", idx: 1 },
                { label: "ATO 03", idx: 2 },
              ].map((act) => (
                <button
                  key={act.idx}
                  onClick={() => setActiveStoryAct(act.idx)}
                  className={`rounded-lg px-2.5 py-1 text-[0.65rem] font-bold tracking-wider transition ${
                    activeStoryAct === act.idx
                      ? "bg-[#741F32] text-white shadow"
                      : "border border-white/20 bg-black/40 text-white/80 hover:text-white hover:bg-black/60"
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>

            {/* Rótulo Lateral Vertical */}
            <div className="stage-side-label hidden sm:block">UMA HISTÓRIA EM TRÊS ATOS</div>

            {/* Contador e Setas no Canto Inferior Direito do Card */}
            <div className="stage-counter-box">
              <span className="font-serif text-xs font-light text-white/90">
                0{activeStoryAct + 1} <span className="text-white/40 font-sans text-[0.65rem]">/ 03</span>
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveStoryAct((prev) => (prev > 0 ? prev - 1 : 2))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-white/80 hover:border-[#741F32] hover:bg-[#741F32] hover:text-white transition"
                  aria-label="Ato anterior"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setActiveStoryAct((prev) => (prev < 2 ? prev + 1 : 0))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-white/80 hover:border-[#741F32] hover:bg-[#741F32] hover:text-white transition"
                  aria-label="Próximo ato"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 4. FERRAMENTA DE GALERIA COMPLETA & 35MM (340+ FOTOS OFICIAIS) */}
        <DuniaGalleryViewer />

        {/* 5. FRASE INSTITUCIONAL — PAUSA EMOCIONAL COM ESPAÇO NEGATIVO E DETALHES DOURADOS */}
        <section className="my-16 sm:my-24 py-12 px-6 text-center relative">
          <p className="eyebrow hero-kicker justify-center mb-4 !text-[#741F32]">
            <span className="ornament !bg-[#D7B78D]" /> DÚNIA CITY HALL <span className="ornament !bg-[#D7B78D]" />
          </p>
          <p className="font-serif text-2xl sm:text-4xl lg:text-[2.5rem] font-normal leading-relaxed text-[#30221D] max-w-2xl mx-auto">
            &ldquo;Há lugares que recebem eventos.<br />
            <em className="italic text-[#741F32]">Outros guardam histórias.</em><br />
            O Dúnia é onde elas acontecem.&rdquo;
          </p>
          <div className="mx-auto mt-8 h-px w-24 bg-[#D7B78D]/60" />
        </section>

        {/* 6. CENÁRIOS PARA MOMENTOS ÚNICOS (CARDS CREME COM BORDAS SUAVES & HOVER ELEGANTE) */}
        <section id="celebrations" className="my-14">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#741F32]">
              CADA VIDA TEM SEUS MARCOS
            </span>
            <h2 className="mt-2 font-serif text-2xl sm:text-4xl font-normal text-[#30221D]">
              Cenários Inesquecíveis para Momentos Únicos
            </h2>
            <p className="mt-2.5 text-xs sm:text-sm text-[#77665D] leading-relaxed">
              Estrutura clássica e versátil no Lago Sul, desenhada para acolher sua celebração com acolhimento e distinção.
            </p>
          </div>

          {/* Grid dos Três Cenários Principais: Casamentos, Debutantes e Corporativo */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(celebrationCards || DEFAULT_CELEBRATION_CARDS || [])
              .filter((card) => card && card.active !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .slice(0, 3)
              .map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D7B78D]/40 bg-[#F2E4D5]/60 hover:bg-[#F2E4D5] shadow-[0_8px_30px_rgba(84,23,37,0.05)] transition duration-500 hover:-translate-y-1.5 hover:border-[#741F32]/50 hover:shadow-[0_18px_45px_rgba(84,23,37,0.12)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-cover ${card.imagePosition || "object-[center_12%]"} transition duration-700 group-hover:scale-[1.03] filter brightness-95`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#741F32]">
                        {card.category}
                      </span>
                      <h3 className="mt-1.5 font-serif text-xl font-normal text-[#30221D] group-hover:text-[#741F32] transition">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-[#77665D] line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-[#D7B78D]/30 pt-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#741F32] group-hover:text-[#541725] transition">
                        <span>{card.buttonText || "Saiba mais"}</span>
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* 7. ESTRUTURA & DIFERENCIAIS (INTERATIVO COM FOTOS REAIS & MODAL) */}
        <section id="diferenciais" className="my-14 rounded-3xl border border-[#D7B78D]/40 bg-gradient-to-br from-[#F2E4D5]/50 via-[#F7EFE6] to-[#E8D4BF]/40 p-6 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#741F32]">
              ESTRUTURA & DISTINÇÃO
            </span>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#30221D] sm:text-4xl">
              A Cenografia Onde Tudo é Pensado
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#77665D] leading-relaxed">
              2.500 m² de infraestrutura desenhados para acolhimento absoluto no Lago Sul. Passe o mouse ou clique para explorar cada ambiente em alta resolução.
            </p>
          </div>

          <CenografiaSpacesInteractive />
        </section>

        {/* 8. REVISTA DÚNIA (EDITORIAL COM FILTRO & LEITOR MODAL) */}
        <section id="journal" className="my-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#741F32]">
                REVISTA DÚNIA / EDITORIAL
              </span>
              <h2 className="mt-1 font-serif text-2xl text-[#30221D] sm:text-3xl">
                Histórias, Inspirações & Sabores
              </h2>
            </div>

            {/* Filtros de Categoria em Alto Contraste */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { key: "all", label: "TODAS" },
                { key: "casamento", label: "CASAMENTOS" },
                { key: "inspiracao", label: "INSPIRAÇÃO" },
                { key: "eventos", label: "EVENTOS" },
                { key: "gastronomia", label: "GASTRONOMIA" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => {
                    setJournalFilter(key)
                    setShowAllArticles(false)
                  }}
                  className={`rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-wider transition ${
                    journalFilter === key
                      ? "bg-[#741F32] text-white shadow-sm"
                      : "border border-[#D7B78D]/40 bg-white text-[#77665D] hover:border-[#741F32] hover:text-[#741F32]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#D7B78D]/40 bg-[#F2E4D5]/50 hover:bg-[#F2E4D5] shadow-sm transition duration-500 hover:-translate-y-1 hover:border-[#741F32]/40 hover:shadow-md"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover object-[center_15%] transition duration-700 group-hover:scale-105 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#741F32]">
                      {article.label}
                    </span>
                    <h3 className="mt-1 font-serif text-base font-normal text-[#30221D] group-hover:text-[#741F32] transition">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#77665D] line-clamp-2">
                      {article.text}
                    </p>
                  </div>
                  <div className="mt-3 border-t border-[#D7B78D]/25 pt-2.5">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#741F32] hover:text-[#541725] transition"
                    >
                      <span>LER ARTIGO COMPLETO</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length > 3 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllArticles(!showAllArticles)}
                className="inline-flex items-center gap-2 rounded-full border border-[#D7B78D]/50 bg-white px-5 py-2 text-xs font-semibold tracking-wider text-[#741F32] hover:bg-[#741F32] hover:text-white transition shadow-sm"
              >
                <span>{showAllArticles ? "VER MENOS ARTIGOS" : `VER TODOS OS ARTIGOS (${filteredArticles.length})`}</span>
              </button>
            </div>
          )}
        </section>

        {/* 9. A DIMENSÃO DÚNIA — INFRAESTRUTURA & CENOGRAFIA MONUMENTAL (LAYOUT EDITORIAL ABERTO) */}
        <section id="experience" className="my-16 sm:my-24">
          {/* Cabeçalho Editorial Aberto com Linha Centralizada */}
          <div className="text-center max-w-3xl mx-auto mb-12 px-4">
            <p className="eyebrow hero-kicker justify-center mb-3 !text-[#741F32]">
              <span className="ornament !bg-[#D7B78D]" /> INFRAESTRUTURA MONUMENTAL • LAGO SUL <span className="ornament !bg-[#D7B78D]" />
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-normal text-[#30221D] leading-tight">
              A Dimensão Dúnia em Quatro Atributos
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#77665D] leading-relaxed max-w-2xl mx-auto">
              Engenharia clássica, pé-direito monumental e acústica de padrão internacional. Uma infraestrutura de 2.500 m² no Lago Sul desenhada para acolher com distinção absoluta.
            </p>
          </div>

          {/* Os 4 Pilares da Infraestrutura — Faixa Editorial Minimalista com Numerais Dourados */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="border-t border-[#D7B78D]/60 pt-5 space-y-2 group transition-all duration-300 hover:border-[#741F32]">
              <span className="font-serif text-2xl font-normal text-[#BD9463] block">01</span>
              <h3 className="font-serif text-lg font-medium text-[#30221D] group-hover:text-[#741F32] transition">
                Salões Modulares
              </h3>
              <p className="text-xs text-[#77665D] leading-relaxed">
                Vão livre de 2.500 m², pé-direito de 7m e acústica impecável. Formato versátil para celebrações intimistas de 100 até grandes noites de 1.200 convidados.
              </p>
            </div>

            <div className="border-t border-[#D7B78D]/60 pt-5 space-y-2 group transition-all duration-300 hover:border-[#741F32]">
              <span className="font-serif text-2xl font-normal text-[#BD9463] block">02</span>
              <h3 className="font-serif text-lg font-medium text-[#30221D] group-hover:text-[#741F32] transition">
                Alta Gastronomia
              </h3>
              <p className="text-xs text-[#77665D] leading-relaxed">
                Cozinha autoral própria de padrão internacional com cardápios exclusivos sob medida, degustação privativa para anfitriões e serviço impecável.
              </p>
            </div>

            <div className="border-t border-[#D7B78D]/60 pt-5 space-y-2 group transition-all duration-300 hover:border-[#741F32]">
              <span className="font-serif text-2xl font-normal text-[#BD9463] block">03</span>
              <h3 className="font-serif text-lg font-medium text-[#30221D] group-hover:text-[#741F32] transition">
                Jardim & Pôr do Sol
              </h3>
              <p className="text-xs text-[#77665D] leading-relaxed">
                Área verde privativa integrada com espelho d&apos;água ao ar livre. O cenário perfeito para cerimônias inesquecíveis durante o entardecer de Brasília.
              </p>
            </div>

            <div className="border-t border-[#D7B78D]/60 pt-5 space-y-2 group transition-all duration-300 hover:border-[#741F32]">
              <span className="font-serif text-2xl font-normal text-[#BD9463] block">04</span>
              <h3 className="font-serif text-lg font-medium text-[#30221D] group-hover:text-[#741F32] transition">
                Suíte Privativa da Noiva
              </h3>
              <p className="text-xs text-[#77665D] leading-relaxed">
                Camarim exclusivo climatizado com espelhos cenográficos, sala de relaxamento e privacidade total para os preparativos mais especiais.
              </p>
            </div>
          </div>

          {/* Vitrine Fotográfica Panorâmica da Arquitetura do Salão Nobre (Widescreen 21:9) */}
          <div className="relative aspect-[16/8] sm:aspect-[21/9] w-full overflow-hidden rounded-3xl border border-[#D7B78D]/40 shadow-2xl group">
            <Image
              src="/images/dunia/decoracao-hero.jpg"
              alt="Cenografia e Decoração Monumental do Dúnia City Hall"
              fill
              className="object-cover object-center filter brightness-[0.92] contrast-[1.04] transition duration-700 group-hover:scale-[1.02]"
            />
            {/* Gradiente Escuro de Profundidade */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* Conteúdo Sobreposto na Imagem Panorâmica */}
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-10 sm:right-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 text-white">
              <div>
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#BD9463] block">
                  CENOGRAFIA MONUMENTAL • LAGO SUL
                </span>
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-white mt-1">
                  O Salão Imperial em Sua Plenitude
                </h3>
                <p className="text-xs text-white/80 max-w-lg mt-1 font-sans hidden sm:block">
                  Lustres de cristal nobre, piso em mármore, climatização central silenciosa e gerador próprio de energia 100% full-backup.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/50 hover:bg-[#741F32] hover:border-[#741F32] px-5 py-2.5 text-xs font-semibold tracking-wider text-white backdrop-blur-md transition-all shadow-md"
                >
                  <span>ESPECIFICAÇÕES TÉCNICAS (2.500 M²)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/admin/experiencias"
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white transition"
                >
                  <span>Central do Salão ↗</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 10. O CONVITE — ATENDIMENTO CONCIERGE VIP (ESTÉTICA DE PAPELARIA DE ALTO LUXO) */}
        <section id="contato" className="my-16 sm:my-24 rounded-3xl border border-[#D7B78D]/60 ring-1 ring-[#D7B78D]/25 bg-gradient-to-br from-[#F2E4D5] via-[#F7EFE6] to-[#E8D4BF]/90 p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          {/* Halos Luminosos Sutis no Convite */}
          <div className="pointer-events-none absolute -top-20 -right-20 w-80 h-80 bg-[radial-gradient(ellipse_at_center,rgba(189,148,99,0.2),transparent_70%)] blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 bg-[radial-gradient(ellipse_at_center,rgba(116,31,50,0.08),transparent_70%)] blur-2xl" />

          <div className="grid gap-10 lg:grid-cols-12 lg:items-center relative z-10">
            {/* Coluna Esquerda: O Convite Personalizado & Concierge */}
            <div className="space-y-5 lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D7B78D] bg-white/70 px-3.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#741F32] backdrop-blur-sm">
                <Sparkles className="h-3 w-3 text-[#BD9463]" /> ATENDIMENTO CONCIERGE EXCLUSIVO
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-normal text-[#30221D] leading-[1.12]">
                Sua celebração merece ser vivida de perto.
              </h2>

              <p className="text-xs sm:text-sm leading-relaxed text-[#77665D] max-w-xl">
                Agende uma visita privativa guiada por nossa equipe de concierge. Conheça pessoalmente a monumentalidade dos 2.500 m² no Lago Sul, encante-se com nossos lustres clássicos de cristal e desenhe cada detalhe da sua história com acolhimento e exclusividade.
              </p>

              {/* Cápsulas de Contato VIP */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-[#D7B78D]/40 bg-white/60 p-4 backdrop-blur-sm shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-[#741F32]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#30221D]">Localização Nobre</span>
                  </div>
                  <p className="text-xs text-[#77665D] pl-5">
                    SHIS QI 15 Lote J/K, Lago Sul — Brasília / DF
                  </p>
                </div>

                <div className="rounded-2xl border border-[#D7B78D]/40 bg-white/60 p-4 backdrop-blur-sm shadow-sm space-y-1">
                  <div className="flex items-center gap-2 text-[#741F32]">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#30221D]">Concierge WhatsApp</span>
                  </div>
                  <p className="text-xs text-[#30221D] font-semibold pl-5">
                    (61) 97401-7544 • Resposta dedicada
                  </p>
                </div>
              </div>

              {/* Botão de Ação Master do Convite */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#741F32] hover:bg-[#541725] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_4px_22px_rgba(116,31,50,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(116,31,50,0.35)]"
                >
                  <Calendar className="h-4 w-4" />
                  <span>AGENDAR VISITA VIP COM O CONCIERGE</span>
                </a>

                <div className="flex items-center gap-2 text-xs text-[#77665D]">
                  <Phone className="h-3.5 w-3.5 text-[#741F32]" />
                  <span>(61) 3686-5339 (Salão Principal)</span>
                </div>
              </div>
            </div>

            {/* Coluna Direita: Fotografia Emocionante de Celebração (Romantismo & Vida) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative aspect-[3/4] w-full max-w-[380px] overflow-hidden rounded-2xl border border-[#D7B78D]/50 shadow-2xl group">
                <Image
                  src="/images/dunia/casamento-hero.jpg"
                  alt="Celebração inesquecível no Dúnia City Hall"
                  fill
                  className="object-cover filter brightness-[0.94] contrast-[1.04] transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                {/* Selo Editorial Discreto */}
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-[0.58rem] font-bold uppercase tracking-[0.25em] text-[#BD9463] block">
                    DÚNIA CITY HALL • LAGO SUL
                  </span>
                  <p className="font-serif text-lg font-normal text-white mt-1 leading-snug">
                    Onde o afeto e a distinção se encontram.
                  </p>
                  <span className="text-[0.68rem] text-white/80 block mt-1 font-sans">
                    Visitas privativas com agendamento prévio.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 11. FOOTER OFICIAL CENTRALIZADO & DISCRETO */}
        <footer className="my-10 border-t border-[#D7B78D]/40 pt-8 text-center">
          <Image
            src="/images/dunia/logo-dunia-hd.png"
            alt="Dúnia City Hall"
            width={140}
            height={48}
            className="mx-auto h-9 w-auto object-contain"
          />
          <p className="mt-2.5 font-serif text-xs italic text-[#741F32]">
            Algumas noites passam. <em>Outras vivem para sempre.</em>
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-[#77665D]">
            <a href="#story" className="hover:text-[#741F32] transition">A Experiência</a>
            <span>•</span>
            <a href="#film" className="hover:text-[#741F32] transition">Galeria 35mm</a>
            <span>•</span>
            <a href="#celebrations" className="hover:text-[#741F32] transition">Celebrações</a>
            <span>•</span>
            <Link href="/sobre" className="hover:text-[#741F32] transition">O Salão (2.500 m²)</Link>
            <span>•</span>
            <a href="#journal" className="hover:text-[#741F32] transition">Revista Dúnia</a>
            <span>•</span>
            <Link href="/admin/experiencias" className="hover:text-[#741F32] transition">Central Salão</Link>
          </div>

          <small className="mt-5 block text-[0.6rem] uppercase tracking-widest text-[#77665D]">
            © {new Date().getFullYear()} DÚNIA CITY HALL — SHIS QI 15 LAGO SUL, BRASÍLIA / DF. TODOS OS DIREITOS RESERVADOS.
          </small>
        </footer>
      </main>

      {/* MODAL LEITOR DA REVISTA DÚNIA */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#D7B78D]/40 bg-[#F7EFE6] shadow-2xl"
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#F2E4D5] text-[#30221D] hover:bg-[#741F32] hover:text-white transition shadow"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-[16/9] w-full">
              <Image src={selectedArticle.image} alt={selectedArticle.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            <div className="p-8">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#741F32]">
                {selectedArticle.label}
              </span>
              <h3 className="mt-2 font-serif text-2xl font-normal text-[#30221D] sm:text-3xl">
                {selectedArticle.title}
              </h3>
              <div className="mt-4 space-y-4 text-xs leading-relaxed text-[#77665D] sm:text-sm">
                <p>{selectedArticle.article}</p>
                <p className="border-t border-[#D7B78D]/25 pt-4 text-[0.7rem] italic text-[#77665D]">
                  Dúnia City Hall — SHIS QI 15 Lago Sul, Brasília / DF. Tradição em celebrações desde 2008.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
