"use client"

import { getStoredArticles, DEFAULT_DUNIA_ARTICLES, type DuniaArticle, getCommercialMode, type DuniaCommercialMode } from "@/lib/dunia-store"
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

interface Article {
  id: number
  category: "all" | "casamento" | "inspiracao" | "eventos"
  label: string
  title: string
  text: string
  image: string
  article: string
}

const ARTICLES: Article[] = [
  {
    id: 1,
    category: "casamento",
    label: "CASAMENTOS • PLANEJAMENTO",
    title: "Antes do sim: os detalhes que fazem uma história única",
    text: "Da escolha do cenário à última dança, tudo começa pelas emoções que vocês querem viver.",
    image: "/assets/casal.jpg",
    article:
      "Um grande casamento não se mede apenas pela decoração ou pelo número de convidados. Ele se revela nas escolhas que dizem algo sobre o casal: uma música, uma memória, uma mesa preparada para alguém especial. No Dúnia City Hall, o planejamento ganha vida com nossa cenografia monumental e o Espaço da Noiva exclusivo para preparar esse momento com serenidade.",
  },
  {
    id: 2,
    category: "inspiracao",
    label: "INSPIRAÇÃO • DECORAÇÃO",
    title: "A luz certa transforma um espaço em memória",
    text: "Velas, flores e atmosferas que fazem cada convidado sentir que chegou a um lugar especial.",
    image: "/assets/mesa.jpg",
    article:
      "Iluminação não serve apenas para deixar o ambiente bonito. Ela define ritmo, intimidade e sensação. Nossos lustres clássicos de cristal combinados a pontos de destaque cenográficos valorizam as mesas e criam profundidade cinematográfica em cada fotografia.",
  },
  {
    id: 3,
    category: "eventos",
    label: "EVENTOS • EXPERIÊNCIA",
    title: "Receber bem começa muito antes das portas se abrirem",
    text: "Convites digitais, informações claras e uma jornada de convidados pensada com cuidado.",
    image: "/assets/salao.jpg",
    article:
      "O evento começa quando o convidado recebe o primeiro convite. Com o Dúnia Experience OS, oferecemos mini-sites personalizados, mapa interativo, RSVP instantâneo por código e QR Code de entrada, trazendo sofisticação digital desde o primeiro instante.",
  },
  {
    id: 4,
    category: "inspiracao",
    label: "INSPIRAÇÃO • 15 ANOS",
    title: "Uma festa de quinze anos que tem a sua assinatura",
    text: "O que faz uma celebração parecer única é a personalidade de quem está no centro dela.",
    image: "/assets/debutante.jpg",
    article:
      "Uma celebração marcante combina elementos que representam quem está vivendo o momento. No Dúnia, nossa pista de dança de última geração com tecnologia de ponta e ambientes instagramáveis transformam o baile de 15 anos em uma noite lendária.",
  },
  {
    id: 5,
    category: "eventos",
    label: "EVENTOS • CORPORATIVO",
    title: "Conexões que continuam depois do evento",
    text: "Quando um encontro corporativo é pensado para aproximar pessoas e criar significado.",
    image: "/assets/corporativo.jpg",
    article:
      "Os grandes encontros corporativos exigem distinção, acústica perfeita e segurança. Já recebemos autoridades dos Três Poderes, representantes de embaixadas e líderes globais, sempre com gastronomia impecável e estrutura modular para até 1.200 participantes.",
  },
  {
    id: 6,
    category: "casamento",
    label: "CASAMENTOS • CONVIDADOS",
    title: "Como organizar a confirmação de presença sem complicação",
    text: "Um RSVP simples é um gesto de cuidado com os convidados e com a organização.",
    image: "/assets/festa.jpg",
    article:
      "Uma confirmação de presença clara facilita decisões sobre equipe, mesas e buffet. O Dúnia Experience OS entrega ao casal um painel em tempo real onde cada confirmação é atualizada instantaneamente e a portaria valida os acessos por QR Code com bloqueio de duplicidade.",
  },
]

const STORY_ACTS = [
  {
    act: "ATO 01",
    subtitle: "CENOGRAFIA MONUMENTAL",
    title: "O cenário acolhe.",
    description:
      "2.500 m² de arquitetura suntuosa, pé-direito imponente e duas opções de salões integrados com divisórias acústicas retráteis para receber celebrações de 100 a 1.200 convidados no coração do Lago Sul.",
    image: "/assets/salao.jpg",
    stat: "Até 1.200 pessoas",
  },
  {
    act: "ATO 02",
    subtitle: "O OLHAR E O SIM",
    title: "A emoção transborda.",
    description:
      "Espaço da Noiva exclusivo com camarim privativo, conforto térmico e iluminação profissional para preparar o coração com total privacidade nos instantes mais doces antes da cerimônia.",
    image: "/assets/casal.jpg",
    stat: "Camarim Exclusivo",
  },
  {
    act: "ATO 03",
    subtitle: "ALTA GASTRONOMIA",
    title: "A celebração eterniza.",
    description:
      "O afeto servido em cada prato. O Buffet Dúnia une ingredientes nobres, ilhas gastronômicas requintadas e apresentação de alta costura para encantar cada convidado com afeto e distinção.",
    image: "/assets/festa.jpg",
    stat: "Buffet Dúnia Autoral",
  },
]

const FILM_FRAMES = [
  { id: "01", frame: "FRAME 001", label: "O CENÁRIO", title: "Dúnia City Hall", image: "/assets/salao.jpg" },
  { id: "02", frame: "FRAME 002", label: "O CUIDADO", title: "Buffet & Ambientação", image: "/assets/mesa.jpg" },
  { id: "03", frame: "FRAME 003", label: "O SIM", title: "Casamentos Reais", image: "/assets/casal.jpg" },
  { id: "04", frame: "FRAME 004", label: "O COMEÇO", title: "15 Anos Lendários", image: "/assets/debutante.jpg" },
  { id: "05", frame: "FRAME 005", label: "A CELEBRAÇÃO", title: "Pista & Energia", image: "/assets/festa.jpg" },
  { id: "06", frame: "FRAME 006", label: "AS CONEXÕES", title: "Galas & Solenidades", image: "/assets/corporativo.jpg" },
]

export default function Home() {
  const [commercialMode, setCommercialMode] = useState<DuniaCommercialMode>("full")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeStoryAct, setActiveStoryAct] = useState(0)
  const [isStoryHovered, setIsStoryHovered] = useState(false)
  const [journalFilter, setJournalFilter] = useState<string>("all")
  const [showAllArticles, setShowAllArticles] = useState(false)
  const [articlesList, setArticlesList] = useState<DuniaArticle[]>(DEFAULT_DUNIA_ARTICLES)
  const [selectedArticle, setSelectedArticle] = useState<DuniaArticle | null>(null)

  useEffect(() => {
    setCommercialMode(getCommercialMode())
    const onModeChange = (e: any) => {
      if (e.detail) setCommercialMode(e.detail)
    }
    window.addEventListener("dunia-mode-change", onModeChange)

    const load = () => {
      const stored = getStoredArticles()
      const publicOnly = stored.filter((a) => a.status !== "rascunho")
      setArticlesList(publicOnly.length > 0 ? publicOnly : DEFAULT_DUNIA_ARTICLES)
    }
    load()
    window.addEventListener("dunia-articles-change", load)
    return () => {
      window.removeEventListener("dunia-mode-change", onModeChange)
      window.removeEventListener("dunia-articles-change", load)
    }
  }, [])
  const [scrollProgress, setScrollProgress] = useState(0)
  const [headerScrolled, setHeaderScrolled] = useState(false)

  const filmTrackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Cursor Ambiente Dourado
    const cursor = document.getElementById("ambient-cursor")
    const handlePointerMove = (e: PointerEvent) => {
      if (!cursor) return
      cursor.style.left = `${e.clientX}px`
      cursor.style.top = `${e.clientY}px`
      cursor.style.opacity = "0.7"
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })

    const interactiveEls = document.querySelectorAll("a, button, input")
    const handleMouseEnter = () => cursor?.classList.add("grow")
    const handleMouseLeave = () => cursor?.classList.remove("grow")
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter)
      el.addEventListener("mouseleave", handleMouseLeave)
    })

    // 2. Scroll Progress & Header Scrolled
    const handleScroll = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? (y / max) * 100 : 0)
      setHeaderScrolled(y > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("scroll", handleScroll)
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter)
        el.removeEventListener("mouseleave", handleMouseLeave)
      })
    }
  }, [])

  // Auto-avanço da narrativa cinematográfica a cada 6 segundos (pausa suave no hover)
  useEffect(() => {
    if (isStoryHovered) return
    const timer = setInterval(() => {
      setActiveStoryAct((prev) => (prev + 1) % 3)
    }, 6000)
    return () => clearInterval(timer)
  }, [isStoryHovered])

  // Navegação da película 35mm
  const scrollFilm = (direction: "left" | "right") => {
    if (!filmTrackRef.current) return
    const scrollAmount = 380
    filmTrackRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    })
  }

  const filteredArticles = articlesList.filter(
    (a) => journalFilter === "all" || a.category === journalFilter
  )
  const visibleArticles = showAllArticles ? filteredArticles : filteredArticles.slice(0, 3)

  return (
    <div className="relative min-h-screen bg-transparent text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white overflow-x-hidden">
      {/* HEADER NAVEGACAO CENTRALIZADO DE ALTO LUXO */}
      <DuniaHeader currentPage="/" />

      {/* 1. HERO SECTION CINEMATOGRÁFICO EDITORIAL (COM LOGO HERO & FOTO IMERSIVA SEM MOLDURA) */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-20 overflow-hidden z-10" id="top">
        {/* Feixe Cênico de Luz Superior (Lustre Monumental do Dúnia) */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[950px] h-[450px] bg-[radial-gradient(ellipse_at_top,rgba(211,180,124,0.20),transparent_70%)] blur-2xl" />
        {/* Glow de Luz Quente Envolvendo os Noivos */}
        <div className="pointer-events-none absolute top-1/2 right-[5%] -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#D3B47C]/26 via-[#C49A61]/15 to-transparent rounded-full blur-[130px]" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Coluna de Texto: Com Logo Dúnia Monumental no Hero */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* LOGO DÚNIA CITY HALL MAJESTOSA NO HERO */}
              <div className="inline-block pb-1">
                <Link href="/" className="inline-block group" aria-label="Dúnia City Hall">
                  <Image
                    src="/assets/logo.png"
                    alt="Dúnia City Hall"
                    width={380}
                    height={130}
                    priority
                    className="w-56 sm:w-68 lg:w-80 h-auto object-contain filter drop-shadow-[0_12px_35px_rgba(211,180,124,0.32)] transition duration-500 group-hover:brightness-110 group-hover:scale-[1.01]"
                  />
                </Link>
              </div>

              <p className="eyebrow hero-kicker">
                <span className="ornament" /> O LUGAR ONDE AS HISTÓRIAS ACONTECEM
              </p>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-[3.5rem] font-normal leading-[0.94] text-white tracking-[-0.035em]">
                Há dias que<br />
                não cabem <em className="italic text-[#E4C293] font-normal">no tempo.</em>
              </h1>

              <p className="text-xs sm:text-sm leading-relaxed text-[#DFD5CA] max-w-md font-sans">
                Não é apenas uma festa. É a mão que treme antes do sim. É o abraço que demora. É a noite que se torna parte de quem somos no salão mais elegante de Brasília.
              </p>

              <div className="pt-2">
                <a className="line-link" href="#story">
                  ENTRE NESSA HISTÓRIA <b>↗</b>
                </a>

              </div>
            </div>

            {/* Coluna da Foto: Sem Moldura, Flutuando Imersa na Iluminação Cênica */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              {/* Aura Dourada Exclusiva envolvendo os noivos */}
              <div className="pointer-events-none absolute -inset-6 bg-gradient-to-tr from-[#D3B47C]/25 via-[#B58A4A]/14 to-transparent rounded-full blur-3xl opacity-80" />

              <div className="relative w-full max-w-[360px] sm:max-w-[400px] aspect-[4/5] overflow-hidden rounded-3xl group shadow-[0_30px_90px_rgba(0,0,0,0.95)]">
                <Image
                  src="/assets/casal.jpg"
                  alt="Casal celebrando no Dúnia City Hall"
                  fill
                  className="object-cover object-[center_15%] filter brightness-[0.96] contrast-[1.05] transition duration-700 group-hover:scale-105"
                  priority
                />
                {/* Fusão Suave: Sem borda ou moldura rígida; gradientes que se fundem ao salão */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-transparent to-transparent opacity-55 pointer-events-none" />
                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(12,10,9,0.7)] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTAINER CENTRALIZADO DO RESTANTE DO HOTSITE */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* 2. PLACA EDITORIAL MARFIM (CENTRALIZADA & COMPACTA) */}
        <section className="my-10 overflow-hidden rounded-2xl bg-[#F3EEE6] p-6 sm:p-10 text-[#271E17] shadow-xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#8C6D37]">
              POR TRÁS DE CADA CELEBRAÇÃO
            </span>
            <h2 className="mt-2.5 font-serif text-2xl font-normal leading-snug sm:text-4xl text-[#1E1712]">
              O que torna um momento inesquecível não é a grandiosidade.<br />
              É a <em className="italic text-[#8C6D37]">emoção</em> que fica.
            </h2>
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#6E6359]">
              Desde 2008, o Dúnia City Hall acolhe os momentos mais marcantes da capital federal. Com arquitetura clássica no Lago Sul, lustres de cristal e gastronomia autoral, criamos cenários onde o afeto e a distinção se encontram.
            </p>

            {/* Credenciais Arquitetônicas & Tradição do Dúnia */}
            <div className="mt-8 pt-6 border-t border-[#8C6D37]/20 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-normal text-[#271E17]">2.500 m²</span>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#8C6D37]">Área Nobre Lago Sul</p>
              </div>
              <div className="sm:border-x sm:border-[#8C6D37]/15">
                <span className="font-serif text-2xl sm:text-3xl font-normal text-[#271E17]">1.200</span>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#8C6D37]">Convidados Confortáveis</p>
              </div>
              <div>
                <span className="font-serif text-2xl sm:text-3xl font-normal text-[#271E17]">+15 Anos</span>
                <p className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] font-semibold text-[#8C6D37]">Excelência em Brasília</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. UMA HISTÓRIA EM TRÊS ATOS (PALCO CINEMATOGRÁFICO FLUIDO & INTEGRADO) */}
        <section
          id="story"
          className="relative my-10"
          aria-label="História em três atos"
        >
          <div
            className="story-stage"
            onMouseEnter={() => setIsStoryHovered(true)}
            onMouseLeave={() => setIsStoryHovered(false)}
          >
              {/* CENA 01: A EXPECTATIVA */}
              <div
                className={`stage-scene ${activeStoryAct === 0 ? "active" : ""}`}
                data-scene="0"
              >
                <Image
                  src="/assets/salao.jpg"
                  alt="Salão preparado com luzes e flores"
                  fill
                  className="object-cover object-[center_25%]"
                  priority
                />
                <div className="stage-shade left" />
                <div className="stage-caption caption-left">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#D3B47C]">
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
                  src="/assets/casal.jpg"
                  alt="Casal celebrando o sim no Dúnia"
                  fill
                  className="object-cover object-[center_15%]"
                />
                <div className="stage-shade right" />
                <div className="stage-caption caption-right">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#D3B47C]">
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
                  src="/assets/festa.jpg"
                  alt="Celebração e brinde com convidados"
                  fill
                  className="object-cover object-[center_20%]"
                />
                <div className="stage-shade left" />
                <div className="stage-caption caption-left">
                  <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#D3B47C]">
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
                        ? "bg-[#D3B47C] text-[#100E0D] shadow"
                        : "border border-white/15 bg-black/40 text-white/70 hover:text-white hover:bg-black/60"
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
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white/80 hover:border-[#D3B47C] hover:text-white transition"
                    aria-label="Ato anterior"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setActiveStoryAct((prev) => (prev < 2 ? prev + 1 : 0))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 bg-black/40 text-white/80 hover:border-[#D3B47C] hover:text-white transition"
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

        {/* 5. CITAÇÃO CENTRALIZADA (MINIMALISTA) */}
        <section className="my-8 text-center py-6 px-4">
          <p className="eyebrow hero-kicker justify-center mb-3">
            <span className="ornament" /> DÚNIA CITY HALL <span className="ornament" />
          </p>
          <p className="font-serif text-xl sm:text-3xl font-normal leading-relaxed text-white max-w-xl mx-auto">
            &ldquo;Há lugares que recebem eventos.<br />
            <em className="italic text-[#D3B47C]">Outros guardam histórias.</em><br />
            O Dúnia é onde elas acontecem.&rdquo;
          </p>
        </section>

        {/* 6. CELEBRAÇÕES & ESPAÇOS (GRID EDITORIAL EQUILIBRADO 3x2 - SEM CORTES) */}
        <section id="celebrations" className="my-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              CADA VIDA TEM SEUS MARCOS
            </span>
            <h2 className="mt-2 font-serif text-2xl font-normal text-white sm:text-4xl">
              Cenários Inesquecíveis para Momentos Únicos
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
              Estrutura clássica e versátil no Lago Sul, desenhada para acolher sua celebração com distinção.
            </p>
          </div>

          {/* Grid Perfeitamente Simétrico 3x2 com Proporções Fotográficas que Não Cortam Cabeças nem Lustres */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {/* 1. Casamentos */}
            <Link
              href="/casamento"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#141210] shadow-lg transition duration-500 hover:-translate-y-1 hover:border-[#D3B47C]/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <Image
                  src="/assets/casal.jpg"
                  alt="Casamento no Dúnia City Hall"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-[center_12%] transition duration-700 group-hover:scale-105 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                    CASAMENTOS DOS SONHOS
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-normal text-white">
                    O Cenário dos Sonhos Para o Sim
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#ABA29A] line-clamp-2">
                    Desde 2008 eternizando momentos com elegância. Espaço da Noiva exclusivo e lustres de cristal.
                  </p>
                </div>
                <div className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D3B47C] group-hover:text-white transition">
                    CONHECER ESPAÇO <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                  <span className="text-[0.65rem] text-white/50 uppercase tracking-wider">Mini-site incluso</span>
                </div>
              </div>
            </Link>

            {/* 2. 15 Anos */}
            <Link
              href="/debutante"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#141210] shadow-lg transition duration-500 hover:-translate-y-1 hover:border-[#D3B47C]/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <Image
                  src="/assets/debutante.jpg"
                  alt="Debutantes no Dúnia City Hall"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-[center_8%] transition duration-700 group-hover:scale-105 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                    15 ANOS LENDÁRIOS
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-normal text-white">
                    O Baile Perfeito Para Brilhar
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#ABA29A] line-clamp-2">
                    Pista de dança integrada, iluminação cenográfica de ponta e ambientes instagramáveis.
                  </p>
                </div>
                <div className="mt-3.5 border-t border-white/10 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D3B47C] group-hover:text-white transition">
                    VER DETALHES <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>

            {/* 3. Corporativo & Gala */}
            <Link
              href="/corporativo"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#141210] shadow-lg transition duration-500 hover:-translate-y-1 hover:border-[#D3B47C]/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <Image
                  src="/assets/corporativo.jpg"
                  alt="Eventos Corporativos no Dúnia"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-[center_25%] transition duration-700 group-hover:scale-105 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                    CORPORATIVO & GALA
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-normal text-white">
                    Convenções & Premiações
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#ABA29A] line-clamp-2">
                    Isolamento acústico de padrão internacional, climatização inteligente e gerador próprio.
                  </p>
                </div>
                <div className="mt-3.5 border-t border-white/10 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D3B47C] group-hover:text-white transition">
                    VER DETALHES <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>

            {/* 4. Buffet Dúnia */}
            <Link
              href="/buffet"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#141210] shadow-lg transition duration-500 hover:-translate-y-1 hover:border-[#D3B47C]/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <Image
                  src="/assets/mesa.jpg"
                  alt="Gastronomia Autoral Buffet Dúnia"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-[center_18%] transition duration-700 group-hover:scale-105 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                    GASTRONOMIA AUTORAL
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-normal text-white">
                    Buffet Dúnia: Alta Cozinha
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#ABA29A] line-clamp-2">
                    Cardápios sob medida assinados por chefs, coquetéis volantes, ilhas gourmet e ceias refinadas.
                  </p>
                </div>
                <div className="mt-3.5 border-t border-white/10 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D3B47C] group-hover:text-white transition">
                    CONHECER BUFFET <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>

            {/* 5. Embaixadas */}
            <Link
              href="/embaixadas"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#141210] shadow-lg transition duration-500 hover:-translate-y-1 hover:border-[#D3B47C]/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <Image
                  src="/assets/salao.jpg"
                  alt="Recepções Diplomáticas no Dúnia"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-[center_15%] transition duration-700 group-hover:scale-105 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                    DIPLOMACIA & ESTADO
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-normal text-white">
                    Embaixadas & Recepções
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#ABA29A] line-clamp-2">
                    Protocolo diplomático rigoroso, segurança VIP e localização estratégica nobre no Lago Sul.
                  </p>
                </div>
                <div className="mt-3.5 border-t border-white/10 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D3B47C] group-hover:text-white transition">
                    VER PROTOCOLO <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>

            {/* 6. Jardim & Áreas Verdes */}
            <Link
              href="/jardim"
              className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#141210] shadow-lg transition duration-500 hover:-translate-y-1 hover:border-[#D3B47C]/50"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                <Image
                  src="/assets/jardim.jpg"
                  alt="Jardim e Área Externa Dúnia"
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-[center_35%] transition duration-700 group-hover:scale-105 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/20 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                    NATUREZA & AR LIVRE
                  </span>
                  <h3 className="mt-1 font-serif text-xl font-normal text-white">
                    Jardim & Celebrações ao Ar Livre
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#ABA29A] line-clamp-2">
                    Paisagismo maduro, iluminação de árvores e pergolado para cerimônias ao pôr do sol.
                  </p>
                </div>
                <div className="mt-3.5 border-t border-white/10 pt-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D3B47C] group-hover:text-white transition">
                    VER JARDIM <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 7. ESTRUTURA & DIFERENCIAIS (INTERATIVO COM FOTOS REAIS & MODAL) */}
        <section id="diferenciais" className="my-12 rounded-3xl border border-white/10 bg-[#141210] p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              ESTRUTURA & DISTINÇÃO
            </span>
            <h2 className="mt-2 font-serif text-2xl font-normal text-white sm:text-4xl">
              A Cenografia Onde Tudo é Pensado
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
              2.500 m² de infraestrutura desenhados para acolhimento absoluto no Lago Sul. Passe o mouse ou clique para explorar cada ambiente em alta resolução.
            </p>
          </div>

          <CenografiaSpacesInteractive />
        </section>

        {/* 8. REVISTA DÚNIA (EDITORIAL COM FILTRO & LEITOR MODAL) */}
        <section id="journal" className="my-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                REVISTA DÚNIA / EDITORIAL
              </span>
              <h2 className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                Histórias, Inspirações & Sabores
              </h2>
            </div>

            {/* Filtros Compactos */}
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
                      ? "bg-[#D3B47C] text-[#100E0D]"
                      : "border border-white/10 bg-white/5 text-[#ABA29A] hover:text-white"
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
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#141210] shadow-md transition duration-500 hover:-translate-y-1 hover:border-[#D3B47C]/50"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover object-[center_15%] transition duration-700 group-hover:scale-105 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent" />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                      {article.label}
                    </span>
                    <h3 className="mt-1 font-serif text-base font-normal text-white">{article.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#ABA29A] line-clamp-2">
                      {article.text}
                    </p>
                  </div>
                  <div className="mt-3 border-t border-white/10 pt-2.5">
                    <button
                      onClick={() => setSelectedArticle(article)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D3B47C] hover:text-white transition"
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
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs font-semibold tracking-wider text-white hover:border-[#D3B47C] hover:text-[#D3B47C] transition"
              >
                <span>{showAllArticles ? "VER MENOS ARTIGOS" : `VER TODOS OS ARTIGOS (${filteredArticles.length})`}</span>
              </button>
            </div>
          )}
        </section>

        
        {/* 9. CENOGRAFIA & EXPERIÊNCIAS DE LUXO (LIGHT) vs EXPERIENCE OS (FULL) */}
        {commercialMode === "light" ? (
          <section id="experience" className="my-12 overflow-hidden rounded-2xl border border-[#D3B47C]/30 bg-[#141210] p-6 sm:p-10 shadow-xl">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="space-y-3.5 lg:col-span-7">
                <p className="eyebrow hero-kicker">
                  <span className="ornament" /> ESTRUTURA MONUMENTAL • LAGO SUL
                </p>
                <h2 className="font-serif text-2xl text-white sm:text-4xl font-normal">
                  Experiências & Celebrações Dúnia
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                  O cenário mais nobre de Brasília para momentos inesquecíveis. Infraestrutura de 2.500 m² totalmente climatizada, com acústica impecável, paisagismo privativo e alta gastronomia autoral.
                </p>

                {/* 4 Pilares da Infraestrutura Institucional */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="border-l border-[#D3B47C]/40 pl-3">
                    <strong className="block text-xs font-serif text-white">01. Salões Modulares</strong>
                    <span className="text-[0.68rem] text-[#ABA29A]">Capacidade flexível de 100 até 1.200 convidados</span>
                  </div>
                  <div className="border-l border-[#D3B47C]/40 pl-3">
                    <strong className="block text-xs font-serif text-white">02. Alta Gastronomia</strong>
                    <span className="text-[0.68rem] text-[#ABA29A]">Buffet próprio com menus autorais e degustações</span>
                  </div>
                  <div className="border-l border-[#D3B47C]/40 pl-3">
                    <strong className="block text-xs font-serif text-white">03. Jardim & Pôr do Sol</strong>
                    <span className="text-[0.68rem] text-[#ABA29A]">Área externa privativa com espelho d&apos;água</span>
                  </div>
                  <div className="border-l border-[#D3B47C]/40 pl-3">
                    <strong className="block text-xs font-serif text-white">04. Espaço da Noiva</strong>
                    <span className="text-[0.68rem] text-[#ABA29A]">Camarim privativo climatizado com espelhos cenográficos</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <a
                    href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:opacity-90 flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>AGENDAR VISITA VIP</span>
                  </a>

                  <Link
                    href="/sobre"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-white/80 hover:text-[#D3B47C] transition border-b border-white/20 pb-0.5"
                  >
                    <span>CONHECER A ESTRUTURA (2.500 M²) ↗</span>
                  </Link>

                  <Link
                    href="/admin/experiencias"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#ABA29A] hover:text-white transition"
                  >
                    <span>Central do Salão ↗</span>
                  </Link>
                </div>
              </div>

              {/* Visual Monumental do Salão */}
              <div className="flex justify-center lg:col-span-5">
                <div className="relative aspect-[4/3] sm:aspect-[16/10] w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#D3B47C]/30 shadow-2xl">
                  <Image
                    src="/assets/salao.jpg"
                    alt="Salão Dúnia City Hall"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[0.6rem] font-bold uppercase tracking-widest text-[#D3B47C]">Dúnia City Hall • Lago Sul</span>
                    <h4 className="font-serif text-lg text-white">Arquitetura de Alto Padrão</h4>
                    <p className="text-[0.68rem] text-white/80 mt-0.5">Mármore nobre, lustres de cristal e cenografia acústica.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section id="experience" className="my-12 overflow-hidden rounded-2xl border border-white/10 bg-[#141210] p-6 sm:p-10 shadow-xl">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3.5 lg:col-span-7">
              <p className="eyebrow hero-kicker">
                <span className="ornament" /> EXPERIÊNCIA DIGITAL • DÚNIA OS
              </p>
              <h2 className="font-serif text-2xl text-white sm:text-4xl font-normal">
                Dúnia Experience OS
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                A plataforma digital do salão que entrega aos anfitriões e convidados uma jornada sem atrito — do convite interativo ao telão de memórias ao vivo.
              </p>

              {/* 4 Pilares Arquitetônicos Refinados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="border-l border-[#D3B47C]/40 pl-3">
                  <strong className="block text-xs font-serif text-white">01. Mini-site VIP</strong>
                  <span className="text-[0.68rem] text-[#ABA29A]">Contagem regressiva e trajeto Waze</span>
                </div>
                <div className="border-l border-[#D3B47C]/40 pl-3">
                  <strong className="block text-xs font-serif text-white">02. RSVP Inteligente</strong>
                  <span className="text-[0.68rem] text-[#ABA29A]">Confirmação instantânea por código</span>
                </div>
                <div className="border-l border-[#D3B47C]/40 pl-3">
                  <strong className="block text-xs font-serif text-white">03. QR Check-in</strong>
                  <span className="text-[0.68rem] text-[#ABA29A]">Recepção sem filas nem duplicidade</span>
                </div>
                <div className="border-l border-[#D3B47C]/40 pl-3">
                  <strong className="block text-xs font-serif text-white">04. Telão & Memories</strong>
                  <span className="text-[0.68rem] text-[#ABA29A]">Transmissão ao vivo de fotos dos convidados</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-3">
                <Link
                  href="/evento"
                  target="_blank"
                  className="rounded-lg bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:opacity-90"
                >
                  <span>TESTAR MINI-SITE DEMO</span>
                </Link>

                <Link
                  href="/painel"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-white/80 hover:text-[#D3B47C] transition border-b border-white/20 pb-0.5"
                >
                  <span>VER PAINEL DOS NOIVOS ↗</span>
                </Link>
              </div>
            </div>

            {/* Visual do Mini-site em Celular Mockup Elegante */}
            <div className="flex justify-center lg:col-span-5">
              <div className="relative aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-3xl border-2 border-white/20 bg-black shadow-2xl">
                <Image
                  src="/assets/casal.jpg"
                  alt="Prévia do Mini-site do Evento"
                  fill
                  className="object-cover brightness-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60" />
                <div className="absolute top-4 left-4 right-4 text-center">
                  <span className="text-[0.55rem] uppercase tracking-widest text-[#D3B47C]">VOCÊ ESTÁ CONVIDADO</span>
                  <h4 className="font-serif text-lg text-white">Juliana & Marcos</h4>
                  <p className="text-[0.6rem] text-white/70">14 DE DEZEMBRO • DÚNIA</p>
                </div>
                <div className="absolute bottom-4 left-4 right-4 space-y-1.5">
                  <div className="rounded-lg border border-white/20 bg-white/10 p-2 text-center backdrop-blur-md">
                    <span className="block text-[0.6rem] font-bold text-white">CONFIRMAR PRESENÇA</span>
                    <small className="text-[0.55rem] text-[#D3B47C]">Código: CASAL-001</small>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-center text-[0.55rem] text-white/60">
                    📸 Envie fotos para o telão
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* 10. AGENDAMENTO VIP & CONTATO CONCIERGE (CENTRALIZADO & COMPACTO) */}
        <section id="contato" className="my-12 rounded-2xl border border-[#D3B47C]/30 bg-gradient-to-br from-[#161311] to-[#0E0C0B] p-6 sm:p-10 shadow-xl">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3.5 lg:col-span-7">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                ATENDIMENTO EXCLUSIVO
              </span>
              <h2 className="font-serif text-2xl font-normal text-white sm:text-4xl">
                Agende Sua Visita VIP ao Dúnia City Hall
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                Venha conhecer pessoalmente a monumentalidade dos 2.500 m² no Lago Sul, os lustres clássicos de cristal e desenhar a celebração dos seus sonhos com nossa equipe de concierge.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D3B47C] mt-0.5" />
                  <span className="text-xs text-[#ABA29A]">
                    SHIS QI 15 Lote J/K, Lago Sul, Brasília — DF, CEP 71.600-700
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-[#D3B47C]" />
                  <span className="text-xs text-[#ABA29A]">(61) 3686-5339 (Salão Principal)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MessageSquare className="h-3.5 w-3.5 shrink-0 text-[#D3B47C]" />
                  <span className="text-xs text-white font-semibold">
                    (61) 97401-7544 (Concierge WhatsApp VIP)
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:opacity-90"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>FALAR COM CONCIERGE NO WHATSAPP</span>
                </a>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 lg:col-span-5 shadow-xl">
              <Image
                src="/assets/salao.jpg"
                alt="Salão Dúnia City Hall"
                fill
                className="object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[0.65rem] uppercase tracking-widest text-[#D3B47C]">Lago Sul • Brasília</span>
                <p className="font-serif text-lg text-white">Dúnia City Hall</p>
              </div>
            </div>
          </div>
        </section>

        {/* 11. FOOTER OFICIAL CENTRALIZADO & DISCRETO */}
        <footer className="my-10 border-t border-white/10 pt-8 text-center">
          <Image
            src="/assets/logo.png"
            alt="Dúnia City Hall"
            width={140}
            height={48}
            className="mx-auto h-9 w-auto object-contain opacity-90"
          />
          <p className="mt-2.5 font-serif text-xs italic text-[#ABA29A]">
            Algumas noites passam. <em>Outras vivem para sempre.</em>
          </p>

          <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-[#ABA29A]">
            <a href="#story" className="hover:text-white transition">A Experiência</a>
            <span>•</span>
            <a href="#film" className="hover:text-white transition">Galeria 35mm</a>
            <span>•</span>
            <a href="#celebrations" className="hover:text-white transition">Celebrações</a>
            {commercialMode !== "light" && (
              <>
                <span>•</span>
                <Link href="/evento" className="hover:text-white transition">Mini-site</Link>
                <span>•</span>
                <Link href="/painel" className="hover:text-white transition">Painel Casal</Link>
              </>
            )}
            <span>•</span>
            <Link href="/sobre" className="hover:text-white transition">O Salão</Link>
            <span>•</span>
            <a href="#journal" className="hover:text-white transition">Revista Dúnia</a>
            <span>•</span>
            <Link href="/admin/experiencias" className="hover:text-white transition">Central Salão</Link>
          </div>

          <small className="mt-5 block text-[0.6rem] uppercase tracking-widest text-white/40">
            © {new Date().getFullYear()} DÚNIA CITY HALL — SHIS QI 15 LAGO SUL, BRASÍLIA / DF. TODOS OS DIREITOS RESERVADOS.
          </small>
        </footer></main>

      {/* MODAL LEITOR DA REVISTA DÚNIA */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-[#161311] shadow-2xl"
          >
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-[16/9] w-full">
              <Image src={selectedArticle.image} alt={selectedArticle.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-transparent to-transparent" />
            </div>

            <div className="p-8">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                {selectedArticle.label}
              </span>
              <h3 className="mt-2 font-serif text-2xl font-normal text-white sm:text-3xl">
                {selectedArticle.title}
              </h3>
              <div className="mt-4 space-y-4 text-xs leading-relaxed text-[#ABA29A] sm:text-sm">
                <p>{selectedArticle.article}</p>
                <p className="border-t border-white/10 pt-4 text-[0.7rem] italic text-white/50">
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
