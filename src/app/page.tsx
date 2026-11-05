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
    image: "/images/dunia/casal.jpg",
    tag: "O SIM DOS SONHOS",
    title: "Momentos Inesquecíveis",
    subtitle: "O clássico e o romantismo no Lago Sul de Brasília",
  },
  {
    image: "/images/dunia/salao-principal.jpg",
    tag: "ESTRUTURA MONUMENTAL",
    title: "Salão Imperial de 2.500 m²",
    subtitle: "Lustres de cristal, pé-direito duplo de 7m e acústica sinfônica",
  },
  {
    image: "/images/dunia/mesa.jpg",
    tag: "CENOGRAFIA & DETALHES",
    title: "Mesa Posta & Cristais",
    subtitle: "Arranjos florais imponentes e iluminação cenográfica",
  },
  {
    image: "/images/dunia/buffet-hero.jpg",
    tag: "ALTA GASTRONOMIA",
    title: "Buffet Dúnia Autoral",
    subtitle: "Cardápios sofisticados e degustações exclusivas dos anfitriões",
  },
  {
    image: "/images/dunia/jardim-galeria.jpg",
    tag: "ÁREA EXTERNA PRIVATIVA",
    title: "Jardim Imperial & Pôr do Sol",
    subtitle: "Espelho d'água ao ar livre para cerimônias encantadoras",
  },
  {
    image: "/images/dunia/debutante-hero.jpg",
    tag: "15 ANOS & CELEBRAÇÕES",
    title: "Debutantes & Grandes Festas",
    subtitle: "Pista monumental, iluminação cênica e energia inesquecível",
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

  // Auto-avanço suave do Carrossel do Hero a cada 5 segundos
  useEffect(() => {
    if (isHeroCarouselHovered) return
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isHeroCarouselHovered])

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
    <div className="relative min-h-screen bg-transparent text-[#201215] antialiased selection:bg-[#5A1827]/20 selection:text-[#5A1827] overflow-x-hidden">
      {/* HEADER NAVEGACAO CENTRALIZADO DE ALTO LUXO */}
      <DuniaHeader currentPage="/" />

      {/* 1. HERO SECTION CINEMATOGRÁFICO EDITORIAL (COM LOGO PRESTIGE & CARROSSEL INTERATIVO DE FOTOS) */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden z-10" id="top">
        {/* Halos Luminosos Sutis: Champagne & Bordô Real */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[950px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(197,162,101,0.18),transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute top-1/2 right-[5%] -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#5A1827]/06 via-[#C5A265]/10 to-transparent rounded-full blur-[130px]" />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Coluna de Texto: Marca Dúnia & Tipografia Majestosa de Alto Contraste */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* LOGO DÚNIA CITY HALL MAJESTOSA NO HERO */}
              <div className="inline-block pb-1">
                <Link href="/" className="inline-block group" aria-label="Dúnia City Hall">
                  <Image
                    src="/images/dunia/logo-dunia-preta.png"
                    alt="Dúnia City Hall"
                    width={360}
                    height={120}
                    priority
                    className="w-56 sm:w-64 lg:w-72 h-auto object-contain transition duration-500 group-hover:scale-[1.01]"
                  />
                </Link>
              </div>

              <p className="eyebrow hero-kicker !text-[#5A1827] flex items-center gap-2">
                <span className="ornament !bg-[#5A1827]" /> O LUGAR ONDE AS HISTÓRIAS ACONTECEM
              </p>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal leading-[0.96] text-[#201215] tracking-[-0.035em]">
                Há dias que<br />
                não cabem <em className="italic text-[#5A1827] font-normal">no tempo.</em>
              </h1>

              <p className="text-xs sm:text-sm leading-relaxed text-[#3D2E30] max-w-md font-sans font-normal">
                Não é apenas uma festa. É a mão que treme antes do sim. É o abraço que demora. É a noite que se torna parte de quem somos no salão mais elegante de Brasília.
              </p>

              {/* Botões de Ação do Hero (Bordô Real & Ouro Champagne) */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <a
                  href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5A1827] hover:bg-[#732032] px-6 py-3 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-[0_4px_22px_rgba(90,24,39,0.28)] transition-all duration-300 hover:scale-[1.03]"
                >
                  <Calendar className="h-4 w-4" />
                  <span>AGENDAR VISITA VIP</span>
                </a>

                <a
                  href="#story"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-[#5A1827]/30 bg-white/80 hover:bg-[#5A1827] hover:text-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#5A1827] transition-all duration-300 shadow-sm"
                >
                  <span>A EXPERIÊNCIA</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Coluna do Carrossel de Imagens do Salão (Requisitado pelo Cliente) */}
            <div className="lg:col-span-6 flex flex-col items-center lg:items-end relative">
              {/* Aura Suave Dourada/Champanhe envolvendo o carrossel */}
              <div className="pointer-events-none absolute -inset-6 bg-gradient-to-tr from-[#C5A265]/20 via-[#5A1827]/06 to-transparent rounded-full blur-3xl opacity-80" />

              {/* Container do Carrossel */}
              <div
                className="relative w-full max-w-[430px] aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_25px_60px_rgba(90,24,39,0.16)] border-2 border-[#5A1827]/15 bg-white group"
                onMouseEnter={() => setIsHeroCarouselHovered(true)}
                onMouseLeave={() => setIsHeroCarouselHovered(false)}
              >
                {/* Slides com Transição Suave Cross-Fade */}
                {HERO_SLIDES.map((slide, idx) => (
                  <div
                    key={slide.image}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === currentHeroSlide ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                    }`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      className="object-cover object-center filter brightness-[0.94] contrast-[1.04] transition duration-700 group-hover:scale-105"
                    />

                    {/* Gradiente escuro inferior para legibilidade da legenda */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Pílula de Tag / Categoria no Topo */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                      <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[#C5A265]">
                        {slide.tag}
                      </span>
                    </div>

                    {/* Card de Legenda com Alto Contraste no Rodapé do Slide */}
                    <div className="absolute bottom-4 left-4 right-4 z-20 rounded-2xl border border-white/20 bg-black/60 p-4 backdrop-blur-md shadow-lg text-white">
                      <span className="text-[0.58rem] font-bold uppercase tracking-[0.25em] text-[#C5A265] block">
                        DÚNIA CITY HALL • LAGO SUL
                      </span>
                      <h3 className="font-serif text-lg sm:text-xl font-normal text-white leading-tight mt-1">
                        {slide.title}
                      </h3>
                      <p className="text-[0.72rem] text-white/85 line-clamp-1 mt-1 font-sans">
                        {slide.subtitle}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Botões de Navegação Anterior / Próximo (Laterais) */}
                <button
                  onClick={prevHeroSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-[#5A1827] backdrop-blur-md border border-white/20 transition-all"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextHeroSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-[#5A1827] backdrop-blur-md border border-white/20 transition-all"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Contador de Slides no Topo Direito (ex: 01 / 06) */}
                <div className="absolute top-4 right-4 z-20 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[0.65rem] font-bold text-white tracking-widest font-mono">
                  0{currentHeroSlide + 1} <span className="text-white/40">/</span> 0{HERO_SLIDES.length}
                </div>
              </div>

              {/* Tira de Miniaturas (Thumbnails) abaixo do carrossel */}
              <div className="mt-4 flex items-center justify-center gap-2 max-w-[430px] w-full px-1">
                {HERO_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.image}
                    onClick={() => setCurrentHeroSlide(idx)}
                    className={`relative h-12 flex-1 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      idx === currentHeroSlide
                        ? "border-[#5A1827] scale-105 shadow-md ring-1 ring-[#5A1827]"
                        : "border-[#5A1827]/20 opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Ver foto ${idx + 1}`}
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CONTAINER CENTRALIZADO DO RESTANTE DO HOTSITE */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* 2. PLACA EDITORIAL MARFIM (CENTRALIZADA & COM ALTO CONTRASTE) */}
        <section className="my-10 overflow-hidden rounded-2xl bg-white border border-[#5A1827]/12 p-6 sm:p-10 text-[#201215] shadow-[0_12px_40px_rgba(90,24,39,0.06)]">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#5A1827]">
              POR TRÁS DE CADA CELEBRAÇÃO
            </span>
            <h2 className="mt-2.5 font-serif text-2xl font-normal leading-snug sm:text-4xl text-[#201215]">
              O que torna um momento inesquecível não é a grandiosidade.<br />
              É a <em className="italic text-[#5A1827]">emoção</em> que fica.
            </h2>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#4A3E3D]">
              Desde 2008, o Dúnia City Hall acolhe os momentos mais marcantes da capital federal. Com arquitetura clássica no Lago Sul, lustres de cristal e gastronomia autoral, criamos cenários onde o afeto e a distinção se encontram.
            </p>

            {/* Credenciais Arquitetônicas & Tradição do Dúnia */}
            <div className="mt-8 pt-6 border-t border-[#5A1827]/15 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-normal text-[#201215]">2.500 m²</span>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#5A1827]">Área Nobre Lago Sul</p>
              </div>
              <div className="sm:border-x sm:border-[#5A1827]/15">
                <span className="font-serif text-2xl sm:text-3xl font-normal text-[#201215]">1.200</span>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#5A1827]">Convidados Confortáveis</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-normal text-[#201215]">+15 Anos</span>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#5A1827]">Excelência em Brasília</p>
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
            className="story-stage rounded-3xl overflow-hidden border border-[#5A1827]/20 shadow-2xl"
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
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#C5A265]">
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
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#C5A265]">
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
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#C5A265]">
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
                      ? "bg-[#5A1827] text-white shadow"
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
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-white/80 hover:border-[#5A1827] hover:bg-[#5A1827] hover:text-white transition"
                  aria-label="Ato anterior"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setActiveStoryAct((prev) => (prev < 2 ? prev + 1 : 0))}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-black/40 text-white/80 hover:border-[#5A1827] hover:bg-[#5A1827] hover:text-white transition"
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

        {/* 5. CITAÇÃO CENTRALIZADA (MINIMALISTA DE ALTO CONTRASTE) */}
        <section className="my-8 text-center py-6 px-4">
          <p className="eyebrow hero-kicker justify-center mb-3 !text-[#5A1827]">
            <span className="ornament !bg-[#5A1827]" /> DÚNIA CITY HALL <span className="ornament !bg-[#5A1827]" />
          </p>
          <p className="font-serif text-xl sm:text-3xl font-normal leading-relaxed text-[#201215] max-w-xl mx-auto">
            &ldquo;Há lugares que recebem eventos.<br />
            <em className="italic text-[#5A1827]">Outros guardam histórias.</em><br />
            O Dúnia é onde elas acontecem.&rdquo;
          </p>
        </section>

        {/* 6. CELEBRAÇÕES & ESPAÇOS (GRID EDITORIAL EM CARDS BRANCOS COM BORDÔ) */}
        <section id="celebrations" className="my-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#5A1827]">
              CADA VIDA TEM SEUS MARCOS
            </span>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#201215] sm:text-4xl">
              Cenários Inesquecíveis para Momentos Únicos
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#4A3E3D] leading-relaxed">
              Estrutura clássica e versátil no Lago Sul, desenhada para acolher sua celebração com distinção.
            </p>
          </div>

          {/* Grid Perfeitamente Simétrico com Proporções Fotográficas */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(celebrationCards || DEFAULT_CELEBRATION_CARDS || [])
              .filter((card) => card && card.active !== false)
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((card) => (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#5A1827]/12 bg-white shadow-[0_8px_30px_rgba(90,24,39,0.06)] transition duration-500 hover:-translate-y-1 hover:border-[#5A1827]/40 hover:shadow-[0_16px_40px_rgba(90,24,39,0.12)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className={`object-cover ${card.imagePosition || "object-[center_12%]"} transition duration-700 group-hover:scale-105 filter brightness-95`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#5A1827]">
                        {card.category}
                      </span>
                      <h3 className="mt-1 font-serif text-xl font-normal text-[#201215] group-hover:text-[#5A1827] transition">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#4A3E3D] line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                    <div className="mt-3.5 flex items-center justify-between border-t border-[#5A1827]/10 pt-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1827] group-hover:text-[#732032] transition">
                        {card.buttonText || "VER DETALHES"}{" "}
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </section>

        {/* 7. ESTRUTURA & DIFERENCIAIS (INTERATIVO COM FOTOS REAIS & MODAL) */}
        <section id="diferenciais" className="my-12 rounded-3xl border border-[#5A1827]/15 bg-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#5A1827]">
              ESTRUTURA & DISTINÇÃO
            </span>
            <h2 className="mt-2 font-serif text-2xl font-normal text-[#201215] sm:text-4xl">
              A Cenografia Onde Tudo é Pensado
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#4A3E3D] leading-relaxed">
              2.500 m² de infraestrutura desenhados para acolhimento absoluto no Lago Sul. Passe o mouse ou clique para explorar cada ambiente em alta resolução.
            </p>
          </div>

          <CenografiaSpacesInteractive />
        </section>

        {/* 8. REVISTA DÚNIA (EDITORIAL COM FILTRO & LEITOR MODAL) */}
        <section id="journal" className="my-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#5A1827]">
                REVISTA DÚNIA / EDITORIAL
              </span>
              <h2 className="mt-1 font-serif text-2xl text-[#201215] sm:text-3xl">
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
                      ? "bg-[#5A1827] text-white shadow-sm"
                      : "border border-[#5A1827]/20 bg-white text-[#4A3E3D] hover:border-[#5A1827] hover:text-[#5A1827]"
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
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#5A1827]/12 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:border-[#5A1827]/40 hover:shadow-md"
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
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#5A1827]">
                      {article.label}
                    </span>
                    <h3 className="mt-1 font-serif text-base font-normal text-[#201215] group-hover:text-[#5A1827] transition">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#4A3E3D] line-clamp-2">
                      {article.text}
                    </p>
                  </div>
                  <div className="mt-3 border-t border-[#5A1827]/10 pt-2.5">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A1827] hover:text-[#732032] transition"
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
                className="inline-flex items-center gap-2 rounded-full border border-[#5A1827]/25 bg-white px-5 py-2 text-xs font-semibold tracking-wider text-[#5A1827] hover:bg-[#5A1827] hover:text-white transition shadow-sm"
              >
                <span>{showAllArticles ? "VER MENOS ARTIGOS" : `VER TODOS OS ARTIGOS (${filteredArticles.length})`}</span>
              </button>
            </div>
          )}
        </section>

        {/* 9. CENOGRAFIA & ESTRUTURA INSTITUCIONAL (PRESTIGE LIGHT) */}
        <section id="experience" className="my-12 overflow-hidden rounded-2xl border border-[#5A1827]/15 bg-white p-6 sm:p-10 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3.5 lg:col-span-7">
              <p className="eyebrow hero-kicker !text-[#5A1827]">
                <span className="ornament !bg-[#5A1827]" /> ESTRUTURA MONUMENTAL • LAGO SUL
              </p>
              <h2 className="font-serif text-2xl text-[#201215] sm:text-4xl font-normal">
                Experiências & Celebrações Dúnia
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#4A3E3D]">
                O cenário mais nobre de Brasília para momentos inesquecíveis. Infraestrutura de 2.500 m² totalmente climatizada, com acústica impecável, paisagismo privativo e alta gastronomia autoral.
              </p>

              {/* 4 Pilares da Infraestrutura Institucional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="border-l-2 border-[#5A1827] pl-3">
                  <strong className="block text-xs font-serif text-[#201215] font-semibold">01. Salões Modulares</strong>
                  <span className="text-[0.68rem] text-[#4A3E3D]">Capacidade flexível de 100 até 1.200 convidados</span>
                </div>
                <div className="border-l-2 border-[#5A1827] pl-3">
                  <strong className="block text-xs font-serif text-[#201215] font-semibold">02. Alta Gastronomia</strong>
                  <span className="text-[0.68rem] text-[#4A3E3D]">Buffet próprio com menus autorais e degustações</span>
                </div>
                <div className="border-l-2 border-[#5A1827] pl-3">
                  <strong className="block text-xs font-serif text-[#201215] font-semibold">03. Jardim & Pôr do Sol</strong>
                  <span className="text-[0.68rem] text-[#4A3E3D]">Área externa privativa com espelho d&apos;água</span>
                </div>
                <div className="border-l-2 border-[#5A1827] pl-3">
                  <strong className="block text-xs font-serif text-[#201215] font-semibold">04. Espaço da Noiva</strong>
                  <span className="text-[0.68rem] text-[#4A3E3D]">Camarim privativo climatizado com espelhos cenográficos</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <a
                  href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-[#5A1827] hover:bg-[#732032] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow transition flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>AGENDAR VISITA VIP</span>
                </a>

                <Link
                  href="/sobre"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#5A1827] hover:text-[#732032] transition border-b border-[#5A1827]/30 pb-0.5"
                >
                  <span>CONHECER A ESTRUTURA (2.500 M²) ↗</span>
                </Link>

                <Link
                  href="/admin/experiencias"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#4A3E3D] hover:text-[#5A1827] transition"
                >
                  <span>Central do Salão ↗</span>
                </Link>
              </div>
            </div>

            {/* Visual Monumental do Salão */}
            <div className="flex justify-center lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#5A1827]/15 shadow-xl">
                <Image
                  src="/images/dunia/salao-principal.jpg"
                  alt="Salão Dúnia City Hall"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#C5A265]">Dúnia City Hall • Lago Sul</span>
                  <h4 className="font-serif text-lg text-white">Arquitetura de Alto Padrão</h4>
                  <p className="text-[0.68rem] text-white/85 mt-0.5">Mármore nobre, lustres de cristal e cenografia acústica.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. AGENDAMENTO VIP & CONTATO CONCIERGE (CENTRALIZADO & CLARO) */}
        <section id="contato" className="my-12 rounded-2xl border border-[#5A1827]/15 bg-white p-6 sm:p-10 shadow-xl">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3.5 lg:col-span-7">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#5A1827]">
                ATENDIMENTO EXCLUSIVO
              </span>
              <h2 className="font-serif text-2xl font-normal text-[#201215] sm:text-4xl">
                Agende Sua Visita VIP ao Dúnia City Hall
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#4A3E3D]">
                Venha conhecer pessoalmente a monumentalidade dos 2.500 m² no Lago Sul, os lustres clássicos de cristal e desenhar a celebração dos seus sonhos com nossa equipe de concierge.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#5A1827] mt-0.5" />
                  <span className="text-xs text-[#4A3E3D]">
                    SHIS QI 15 Lote J/K, Lago Sul, Brasília — DF, CEP 71.600-700
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#5A1827]" />
                  <span className="text-xs text-[#4A3E3D]">(61) 3686-5339 (Salão Principal)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#5A1827]" />
                  <span className="text-xs text-[#201215] font-semibold">
                    (61) 97401-7544 (Concierge WhatsApp VIP)
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5A1827] hover:bg-[#732032] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow transition"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>FALAR COM CONCIERGE NO WHATSAPP</span>
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#5A1827]/15 lg:col-span-5 shadow-lg">
              <Image
                src="/images/dunia/salao-principal.jpg"
                alt="Salão Dúnia City Hall"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[0.65rem] uppercase tracking-widest text-[#C5A265]">Lago Sul • Brasília</span>
                <p className="font-serif text-lg text-white">Dúnia City Hall</p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. FOOTER OFICIAL CENTRALIZADO & DISCRETO */}
        <footer className="my-10 border-t border-[#5A1827]/15 pt-8 text-center">
          <Image
            src="/images/dunia/logo-dunia-preta.png"
            alt="Dúnia City Hall"
            width={140}
            height={48}
            className="mx-auto h-9 w-auto object-contain"
          />
          <p className="mt-2.5 font-serif text-xs italic text-[#5A1827]">
            Algumas noites passam. <em>Outras vivem para sempre.</em>
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-[#4A3E3D]">
            <a href="#story" className="hover:text-[#5A1827] transition">A Experiência</a>
            <span>•</span>
            <a href="#film" className="hover:text-[#5A1827] transition">Galeria 35mm</a>
            <span>•</span>
            <a href="#celebrations" className="hover:text-[#5A1827] transition">Celebrações</a>
            <span>•</span>
            <Link href="/sobre" className="hover:text-[#5A1827] transition">O Salão (2.500 m²)</Link>
            <span>•</span>
            <a href="#journal" className="hover:text-[#5A1827] transition">Revista Dúnia</a>
            <span>•</span>
            <Link href="/admin/experiencias" className="hover:text-[#5A1827] transition">Central Salão</Link>
          </div>

          <small className="mt-5 block text-[0.6rem] uppercase tracking-widest text-[#5C4D4C]">
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
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-[#5A1827]/20 bg-white shadow-2xl"
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-[#201215] hover:bg-[#5A1827] hover:text-white transition shadow"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-[16/9] w-full">
              <Image src={selectedArticle.image} alt={selectedArticle.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
            </div>

            <div className="p-8">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#5A1827]">
                {selectedArticle.label}
              </span>
              <h3 className="mt-2 font-serif text-2xl font-normal text-[#201215] sm:text-3xl">
                {selectedArticle.title}
              </h3>
              <div className="mt-4 space-y-4 text-xs leading-relaxed text-[#4A3E3D] sm:text-sm">
                <p>{selectedArticle.article}</p>
                <p className="border-t border-[#5A1827]/10 pt-4 text-[0.7rem] italic text-[#5C4D4C]">
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
