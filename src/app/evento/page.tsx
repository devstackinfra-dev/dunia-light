"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  CheckCircle2,
  XCircle,
  Share2,
  Navigation,
  Camera,
  Tv,
  QrCode,
  Download,
  Copy,
  ExternalLink,
  Sparkles,
  Gift,
  Car,
  UtensilsCrossed,
  Music,
  Wine,
  Maximize2,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Printer,
  ScrollText,
  Users,
  Shirt,
  Quote,
  Send,
} from "lucide-react"
import {
  getStoredEvents,
  getActiveEventId,
  setActiveEventId,
  getEventState,
  saveEventState,
  formatEventDate,
  type DuniaEventState,
  type DuniaGuestPhoto,
  getCommercialMode,
  setCommercialMode,
  type DuniaCommercialMode,
} from "@/lib/dunia-store"
import {
  getStorytellingForEvent,
  type EventStorytelling,
  type GuestWish,
} from "@/config/event-storytelling"


interface EventDemoExplanation {
  id: string
  name: string
  shortLabel: string
  pillLabel: string
  niche: string
  badge: string
  capacity: string
  espaco: string
  summary: string
  whyOwnerCares: string
}

const EVENT_DEMO_EXPLANATIONS: Record<string, EventDemoExplanation> = {
  "ev-jm": {
    id: "ev-jm",
    name: "Juliana & Matheus",
    shortLabel: "Juliana",
    pillLabel: "Juliana (Casamento)",
    niche: "Casamento Clássico de Luxo",
    badge: "CASAMENTO PRINCIPAL",
    capacity: "280 Convidados",
    espaco: "Salão Imperial + Espaço da Noiva",
    summary: "Mini-site editorial exclusivo com carta poética dos noivos, história de amor em 4 atos, cortejo de honra (pais e padrinhos), dress code com paleta de cores e RSVP com controle de assentos.",
    whyOwnerCares: "O casal do Lago Sul fecha com o Dúnia porque nenhum outro salão de Brasília entrega essa experiência digital de revista.",
  },
  "ev-clarice": {
    id: "ev-clarice",
    name: "Clarice & Gustavo",
    shortLabel: "Clarice",
    pillLabel: "Clarice (Jardim)",
    niche: "Casamento ao Ar Livre & Pôr do Sol",
    badge: "JARDIM INTEGRADO",
    capacity: "320 Convidados",
    espaco: "Jardim Imperial + Salão Nobre",
    summary: "Demonstração para casamentos que aproveitam a área verde privativa e o espelho d'água de 2.500 m², integrando cerimônia ao entardecer e banquete no salão climatizado.",
    whyOwnerCares: "Valoriza a área externa do Dúnia como o cenário mais exclusivo de Brasília para cerimônias ao ar livre.",
  },
  "ev-sb": {
    id: "ev-sb",
    name: "Sofia 15 Anos",
    shortLabel: "Sofia",
    pillLabel: "Sofia (15 Anos)",
    niche: "Festa de 15 Anos & Debutante",
    badge: "15 ANOS & BALADA",
    capacity: "220 Convidados",
    espaco: "Espaço Cristal + Pista de Dança",
    summary: "Experiência interativa focada no público jovem: contagem regressiva, envio de fotos em tempo real direto para os telões de LED do salão e recados de amigos no Livro de Ouro.",
    whyOwnerCares: "Garante a contratação de debutantes encantando pais e adolescentes com o telão interativo ao vivo durante a balada.",
  },
  "ev-bruno": {
    id: "ev-bruno",
    name: "Dra. Helena & Dr. Bruno",
    shortLabel: "Dra.",
    pillLabel: "Dra. (Black Tie)",
    niche: "Solenidade Black Tie & Autoridades",
    badge: "ALTO PROTOCOLO",
    capacity: "380 Convidados",
    espaco: "Salão Imperial Climatizado",
    summary: "Protocolo oficial para casamentos e eventos de médicos, magistrados e diplomatas: QR Code nominal com trava de segurança na portaria e relatório dietético automático para o buffet.",
    whyOwnerCares: "Segurança anti-penetra e organização impecável para receber autoridades dos Três Poderes e corpo diplomático.",
  },
  "ev-corp": {
    id: "ev-corp",
    name: "Prêmio Empresarial Apex 2026",
    shortLabel: "Prêmio",
    pillLabel: "Prêmio (Corporativo)",
    niche: "Gala Corporativa & Premiação",
    badge: "CORPORATIVO B2B",
    capacity: "450 Convidados",
    espaco: "Salão Modular Completo",
    summary: "Credenciamento corporativo ágil por código de convite, auditório cenográfico com palco, exibição de patrocinadores e jantar executivo de alta gastronomia.",
    whyOwnerCares: "Permite ao Dúnia ocupar a agenda de segunda a quinta-feira com grandes empresas, multinacionais e federações.",
  },
  "ev-reveillon": {
    id: "ev-reveillon",
    name: "Réveillon dos Embaixadores Dúnia",
    shortLabel: "Réveillon",
    pillLabel: "Réveillon (Mega Evento)",
    niche: "Grande Evento & Réveillon de Luxo",
    badge: "EVENTO PRÓPRIO DÚNIA",
    capacity: "550 Convidados",
    espaco: "Todos os Espaços Integrados",
    summary: "Demonstração para grandes festas e eventos com venda de mesas: mapa de setores no salão, ceia de gala, controle de capacidade e transmissão ao vivo nos telões.",
    whyOwnerCares: "Mostra que a plataforma escala para grandes produções proprietárias do salão com total controle de mesas e público.",
  },
}

export default function EventoPage() {
  const [mounted, setMounted] = useState(false)
  const [commercialMode, setCommercialModeState] = useState<DuniaCommercialMode>("full")
  const [state, setState] = useState<DuniaEventState | null>(null)
  const [allEvents, setAllEvents] = useState<any[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("ev-jm")

  // RSVP Form States
  const [rsvpCode, setRsvpCode] = useState("")
  const [rsvpStatus, setRsvpStatus] = useState<"confirmed" | "declined">("confirmed")
  const [rsvpMessage, setRsvpMessage] = useState("")
  const [dietary, setDietary] = useState("padrao")
  const [rsvpFeedback, setRsvpFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  // Feedback & Modal States
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedPix, setCopiedPix] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null)
  const [likedPhotos, setLikedPhotos] = useState<Record<string, number>>({})

  // Storytelling interactive states
  const [wishesList, setWishesList] = useState<GuestWish[]>([])
  const [newWishName, setNewWishName] = useState("")
  const [newWishRelation, setNewWishRelation] = useState("Amigo(a)")
  const [newWishText, setNewWishText] = useState("")
  const [wishSubmitted, setWishSubmitted] = useState(false)

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)

  // Initialize
  useEffect(() => {
    setMounted(true)
    setCommercialModeState(getCommercialMode())
    const stored = getStoredEvents()
    setAllEvents(stored)

    const activeId = getActiveEventId()
    setSelectedEventId(activeId)
    const current = getEventState(activeId)
    setState(current)

    const storyData = getStorytellingForEvent(activeId)
    setWishesList(storyData.guestWishes)
  }, [])

  // Event Switcher handler
  const handleSwitchEvent = (eventId: string) => {
    setSelectedEventId(eventId)
    setActiveEventId(eventId)
    const next = getEventState(eventId)
    setState(next)
    setRsvpFeedback(null)
    setRsvpCode("")
    setRsvpMessage("")
    const nextStory = getStorytellingForEvent(eventId)
    setWishesList(nextStory.guestWishes)
    setWishSubmitted(false)
  }

  // Countdown timer
  useEffect(() => {
    if (!state?.event?.date) return
    const target = new Date(`${state.event.date}T${state.event.time || "18:00"}:00`).getTime()

    const updateCountdown = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [state?.event?.date, state?.event?.time])

  if (!mounted || !state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0A09] text-[#D3B47C]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#D3B47C] border-t-transparent" />
          <p className="font-serif text-lg tracking-wider">Preparando experiência do evento...</p>
        </div>
      </div>
    )
  }

  const { event, guests, album } = state
  const guestPhotos: DuniaGuestPhoto[] = album.guestPhotos || []
  const story = getStorytellingForEvent(selectedEventId)

  // Dynamic Upload URL for QR Code
  const originUrl = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
  const guestUploadUrl = `${originUrl}/evento/fotos`
  const liveTelaoUrl = `${originUrl}/evento/telao`

  // QR Code URL via reliable server with high resolution
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=6&color=120F0D&bgcolor=FFFFFF&data=${encodeURIComponent(
    guestUploadUrl
  )}`

  // Copy helper
  const handleCopyLink = () => {
    navigator.clipboard?.writeText(guestUploadUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2500)
  }

  const handleCopyPix = () => {
    navigator.clipboard?.writeText("financeiro@duniacityhall.com.br")
    setCopiedPix(true)
    setTimeout(() => setCopiedPix(false), 2500)
  }

  // Pre-fill demo RSVP code
  const handleSelectDemoGuest = (code: string) => {
    setRsvpCode(code)
    setRsvpFeedback(null)
  }

  // Like photo
  const handleToggleLike = (photoId: string) => {
    setLikedPhotos((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + 1,
    }))
  }

  // RSVP Submission
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCode = rsvpCode.trim().toUpperCase()
    if (!cleanCode) {
      setRsvpFeedback({ type: "error", text: "Por favor, digite o código do seu convite." })
      return
    }

    const guestIndex = guests.findIndex((g) => g.code.toUpperCase() === cleanCode)
    if (guestIndex === -1) {
      setRsvpFeedback({
        type: "error",
        text: "Código não encontrado. Verifique seu convite (ex: DUNIA-001) ou fale com os anfitriões.",
      })
      return
    }

    const updatedGuests = [...guests]
    const guest = updatedGuests[guestIndex]
    guest.status = rsvpStatus
    guest.message = rsvpMessage.trim()
    guest.dietary = dietary as any
    guest.updatedAt = Date.now()

    const nextState: DuniaEventState = {
      ...state,
      guests: updatedGuests,
    }

    setState(nextState)
    saveEventState(event.id, nextState)

    if (rsvpStatus === "confirmed") {
      setRsvpFeedback({
        type: "success",
        text: `Presença confirmada com sucesso para ${guest.name} (${guest.seats} ${guest.seats > 1 ? "lugares" : "lugar"})! Será uma honra celebrar este momento inesquecível ao seu lado.`,
      })
    } else {
      setRsvpFeedback({
        type: "success",
        text: `Agradecemos por nos avisar, ${guest.name}. Sentiremos muito sua falta nessa celebração tão especial!`,
      })
    }
  }

  // Add guest wish
  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWishName.trim() || !newWishText.trim()) return

    const newWish: GuestWish = {
      id: `gw-${Date.now()}`,
      name: newWishName.trim(),
      relationship: newWishRelation.trim() || "Amigo(a)",
      text: newWishText.trim(),
      timeAgo: "agora mesmo",
    }

    setWishesList((prev) => [newWish, ...prev])
    setNewWishName("")
    setNewWishText("")
    setWishSubmitted(true)
    setTimeout(() => setWishSubmitted(false), 4000)
  }

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`${event.name} — Dúnia City Hall`)
    const details = encodeURIComponent(
      `Celebração oficial no Dúnia City Hall.\nEndereço: SHIS QI 15 Lote J/K, Lago Sul, Brasília - DF.\n${event.message}`
    )
    const location = encodeURIComponent("Dúnia City Hall, SHIS QI 15 Lote J/K, Lago Sul, Brasília - DF")
    const dateFormatted = event.date.replace(/-/g, "")
    const timeFormatted = (event.time || "18:00").replace(":", "") + "00"
    const dates = `${dateFormatted}T${timeFormatted}/${dateFormatted}T235900`
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`
  }

  // Download .ics file
  const handleDownloadIcs = () => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dúnia City Hall//Guest OS//PT
BEGIN:VEVENT
SUMMARY:${event.name} — Dúnia City Hall
DESCRIPTION:${event.message}
LOCATION:Dúnia City Hall - SHIS QI 15 Lote J/K, Lago Sul, Brasília - DF
DTSTART:${event.date.replace(/-/g, "")}T${(event.time || "18:00").replace(":", "")}00
DTEND:${event.date.replace(/-/g, "")}T235900
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`

    const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" })
    const link = document.createElement("a")
    link.href = window.URL.createObjectURL(blob)
    link.setAttribute("download", `convite-${event.id}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Curated official gallery photos
  const officialGallery = [
    { src: "/images/acervo/03-casamento/Destaque-Casamento-1.jpg", caption: "O Sim Sob Lustres de Cristal" },
    { src: "/images/acervo/03-casamento/Destaque-Casamento-2.jpg", caption: "Arquitetura Clássica & Cenografia Monumental" },
    { src: "/images/acervo/03-casamento/Destaque-Casamento-3.jpg", caption: "Mesa de Doces & Alta Gastronomia Dúnia" },
    { src: "/images/acervo/03-casamento/Destaque-Casamento-4.jpg", caption: "Brinde com a Corte de Padrinhos" },
    { src: "/images/acervo/03-casamento/CASAMENTO-92.jpg", caption: "Detalhes Florais & Ambientação de Luxo" },
    { src: "/images/acervo/03-casamento/CASAMENTO-111.jpg", caption: "Celebração & Pista de Dança Sem Fim" },
  ]

  if (commercialMode === "light") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#0C0A09] p-6 text-center antialiased">
        <div className="w-full max-w-lg rounded-3xl border border-[#D3B47C]/30 bg-[#161311] p-8 shadow-2xl backdrop-blur-xl">
          <Image
            src="/assets/logo.png"
            alt="Dúnia City Hall"
            width={160}
            height={45}
            className="h-10 w-auto object-contain mx-auto"
          />
          <div className="mt-6 inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-amber-300">
            MODO HOTSITE INSTITUCIONAL
          </div>
          <h2 className="mt-3 font-serif text-2xl text-white">
            Mini-site de Celebração Desativado
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#ABA29A]">
            O salão está operando na modalidade comercial <strong>Light</strong>. Mini-sites personalizados para anfitriões e RSVPs digitais são disponibilizados exclusivamente na modalidade <strong>Experience OS</strong>.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              Conhecer o Salão Dúnia
            </Link>
            <button
              onClick={() => {
                setCommercialMode("full")
                setCommercialModeState("full")
              }}
              className="w-full sm:w-auto rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
            >
              Ativar Experience OS (Demo)
            </button>
          </div>
        </div>
      </div>
    )
  }

  const activeExplanationKey = hoveredEventId || selectedEventId
  const currentExplanation = EVENT_DEMO_EXPLANATIONS[activeExplanationKey] || EVENT_DEMO_EXPLANATIONS["ev-jm"]

  return (
    <div className="relative min-h-screen bg-[#0C0A09] text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      {/* 0. AURA DE ILUMINAÇÃO DE FUNDO */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-[650px] w-[650px] rounded-full bg-gradient-to-b from-[#D3B47C]/12 to-transparent blur-[160px]" />
        <div className="absolute top-[40%] -left-32 h-[550px] w-[550px] rounded-full bg-[#AF8850]/8 blur-[140px]" />
        <div className="absolute bottom-20 right-10 h-[600px] w-[600px] rounded-full bg-[#D3B47C]/10 blur-[160px]" />
      </div>

      {/* 1. TOPO DE NAVEGAÇÃO VIP REVISADO (LOGO EXPANDIDO & SELETOR EXPLICATIVO) */}
      <header className="sticky top-0 z-50 border-b border-[#D3B47C]/20 bg-[#0C0A09]/98 backdrop-blur-xl shadow-2xl">
        <div className="container mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3.5 sm:px-8">
          {/* LOGO DÚNIA MONUMENTAL & DESTACADO */}
          <div className="flex items-center gap-5 shrink-0">
            <Link href="/" className="flex items-center shrink-0 group py-1" aria-label="Dúnia City Hall — Início">
              <Image
                src="/assets/logo.png"
                alt="Dúnia City Hall"
                width={260}
                height={85}
                className="h-12 w-auto object-contain sm:h-14 lg:h-16 filter drop-shadow-[0_4px_20px_rgba(211,180,124,0.45)] transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </Link>

            <div className="hidden xl:block h-8 w-[1px] bg-white/15" />

            {/* SELETOR DE EVENTOS INTERATIVO COM EXPLICAÇÃO NO HOVER */}
            <div className="hidden lg:flex items-center gap-1.5 rounded-2xl border border-[#D3B47C]/30 bg-black/70 p-1.5 shadow-inner">
              <span className="hidden 2xl:inline-block pl-2.5 pr-1.5 text-[0.62rem] font-bold uppercase tracking-widest text-[#D3B47C]/80">
                Nichos:
              </span>
              {allEvents.map((ev) => {
                const info = EVENT_DEMO_EXPLANATIONS[ev.id] || {
                  shortLabel: ev.name.split(" ")[0],
                  niche: ev.category,
                }
                const isSelected = selectedEventId === ev.id
                const isHovered = hoveredEventId === ev.id

                return (
                  <button
                    key={ev.id}
                    onClick={() => handleSwitchEvent(ev.id)}
                    onMouseEnter={() => setHoveredEventId(ev.id)}
                    onMouseLeave={() => setHoveredEventId(null)}
                    className={`relative rounded-xl px-3.5 py-2 text-xs font-bold tracking-wider transition-all duration-200 ${
                      isSelected
                        ? "bg-[#D3B47C] text-[#100E0D] shadow-[0_2px_14px_rgba(211,180,124,0.5)] scale-102"
                        : isHovered
                        ? "bg-white/15 text-white scale-102 border border-[#D3B47C]/40"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{info.shortLabel}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* AÇÕES E BOTÕES REVISADOS */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <Link
              href="/evento/telao"
              target="_blank"
              title="Abrir projeção ao vivo nos telões de LED do Dúnia"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white/90 transition hover:border-[#D3B47C] hover:text-[#D3B47C] hover:bg-white/10"
            >
              <Tv className="h-4 w-4 text-[#D3B47C]" />
              <span className="hidden sm:inline">Telão ao Vivo</span>
            </Link>

            <a
              href="#qrcode-section"
              title="Simular a experiência do convidado na mesa com QR Code"
              className="inline-flex items-center gap-2 rounded-xl border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3.5 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#D3B47C] transition hover:bg-[#D3B47C]/20"
            >
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR Code Mesa</span>
            </a>

            <a
              href="#rsvp-section"
              className="rounded-xl bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#100E0D] shadow-lg transition hover:opacity-95 hover:shadow-[0_0_20px_rgba(211,180,124,0.4)]"
            >
              Confirmar Presença
            </a>
          </div>
        </div>

        {/* SELETOR MOBILE HORIZONTAL (PERMITE TESTAR TODOS OS NICHOS NO CELULAR) */}
        <div className="flex lg:hidden items-center gap-1.5 overflow-x-auto no-scrollbar px-4 py-2 border-t border-white/10 bg-black/60">
          <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[#D3B47C] shrink-0">
            Nichos:
          </span>
          {allEvents.map((ev) => {
            const info = EVENT_DEMO_EXPLANATIONS[ev.id] || { shortLabel: ev.name.split(" ")[0] }
            const isSelected = selectedEventId === ev.id
            return (
              <button
                key={ev.id}
                onClick={() => handleSwitchEvent(ev.id)}
                className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold tracking-wider transition ${
                  isSelected
                    ? "bg-[#D3B47C] text-[#100E0D] shadow"
                    : "border border-white/10 bg-white/5 text-white/80"
                }`}
              >
                {info.shortLabel}
              </button>
            )
          })}
        </div>

        {/* BANNER EXPLICATIVO INTERATIVO: DEMONSTRAÇÃO EXECUTIVA PARA O DONO DO DÚNIA */}
        {currentExplanation && (
          <div className="border-t border-[#D3B47C]/20 bg-gradient-to-r from-[#14110F] via-[#1C1713] to-[#14110F] px-4 py-3 sm:px-8 shadow-xl transition-all duration-300">
            <div className="container mx-auto flex max-w-7xl flex-col lg:flex-row lg:items-center justify-between gap-3 text-left">
              <div className="flex items-start sm:items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#D3B47C]/20 text-[#D3B47C] border border-[#D3B47C]/40 font-serif text-sm font-bold shadow-inner">
                  ⚜
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#D3B47C] px-2.5 py-0.5 text-[0.62rem] font-black uppercase tracking-widest text-[#100E0D]">
                      {currentExplanation.badge}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-normal text-white">
                      {currentExplanation.name}{" "}
                      <span className="text-[#D3B47C] font-sans text-xs font-semibold">
                        • {currentExplanation.niche}
                      </span>
                    </h3>
                    <span className="text-white/30 hidden sm:inline">•</span>
                    <span className="text-xs text-[#ABA29A] hidden sm:inline">
                      {currentExplanation.espaco} ({currentExplanation.capacity})
                    </span>
                  </div>
                  <p className="text-xs sm:text-[0.82rem] text-[#DFD5CA] mt-1 leading-relaxed">
                    {currentExplanation.summary}{" "}
                    <span className="text-[#D3B47C] font-semibold block sm:inline">
                      — Por que o Dúnia fecha esse contrato: {currentExplanation.whyOwnerCares}
                    </span>
                  </p>
                </div>
              </div>

              {/* Guia Rápido de Demonstração */}
              <div className="flex items-center gap-2 shrink-0 text-[0.7rem] text-[#ABA29A] bg-black/50 px-3.5 py-2 rounded-xl border border-white/10 self-start lg:self-center">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-white/90">
                  Passe o mouse ou clique nos botões acima para ver cada nicho do salão
                </span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* 2. HERO EDITORIAL CINEMATOGRÁFICO */}
      <section className="relative z-10 flex min-h-[85vh] flex-col justify-end overflow-hidden px-4 pb-16 pt-28 sm:px-8 sm:pb-24">
        {/* Foto de Fundo com Fade Suave */}
        <div className="absolute inset-0 z-0">
          <Image
            src={event.welcomePhoto || "/assets/casal.jpg"}
            alt={event.name}
            fill
            className="object-cover object-[center_28%] filter brightness-[0.40] transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/60 to-black/35" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(12,10,9,0.9)_100%)]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          {/* Kicker Dourado com Ornamento */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/30 bg-black/60 px-4 py-1.5 backdrop-blur-md shadow-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D3B47C] animate-pulse" />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#D3B47C]">
              {story.kicker}
            </span>
          </div>

          {/* Nome dos Anfitriões */}
          <h1 className="mt-6 font-serif text-5xl font-normal leading-tight text-white sm:text-7xl lg:text-8xl drop-shadow-md">
            {event.name}
          </h1>

          {/* Poetic Tagline */}
          <p className="mt-3 font-serif text-base italic text-[#E5D7C3]/90 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            &ldquo;{story.heroTagline}&rdquo;
          </p>

          {/* Data e Local */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#ABA29A] sm:text-sm">
            <span>{formatEventDate(event.date)}</span>
            <span>•</span>
            <span>{event.time}</span>
            <span>•</span>
            <span className="text-[#D3B47C] font-semibold">{event.venue}</span>
          </div>

          {/* CONTAGEM REGRESSIVA EM ESTILO CRONÔMETRO DE LUXO */}
          <div className="mt-8 inline-grid grid-cols-4 gap-2.5 rounded-2xl border border-white/15 bg-black/70 p-3.5 backdrop-blur-md sm:gap-6 sm:p-5 shadow-2xl">
            <div className="flex flex-col items-center min-w-[55px] sm:min-w-[80px]">
              <span className="font-serif text-2xl font-light text-white sm:text-4xl lg:text-5xl">
                {timeLeft.days}
              </span>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#D3B47C]">Dias</span>
            </div>
            <div className="flex flex-col items-center min-w-[55px] sm:min-w-[80px] border-l border-white/10">
              <span className="font-serif text-2xl font-light text-white sm:text-4xl lg:text-5xl">
                {timeLeft.hours}
              </span>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#D3B47C]">Horas</span>
            </div>
            <div className="flex flex-col items-center min-w-[55px] sm:min-w-[80px] border-l border-white/10">
              <span className="font-serif text-2xl font-light text-white sm:text-4xl lg:text-5xl">
                {timeLeft.minutes}
              </span>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#D3B47C]">Minutos</span>
            </div>
            <div className="flex flex-col items-center min-w-[55px] sm:min-w-[80px] border-l border-white/10">
              <span className="font-serif text-2xl font-light text-[#D3B47C] sm:text-4xl lg:text-5xl">
                {timeLeft.seconds}
              </span>
              <span className="text-[0.6rem] uppercase tracking-wider text-[#D3B47C]">Segundos</span>
            </div>
          </div>

          {/* BOTÕES DE AÇÃO RÁPIDA NO HERO */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#rsvp-section"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow-lg transition hover:scale-105"
            >
              <Check className="h-4 w-4" />
              <span>Confirmar Minha Presença</span>
            </a>

            <a
              href="#historia-section"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-[#D3B47C] hover:bg-white/10"
            >
              <ScrollText className="h-4 w-4 text-[#D3B47C]" />
              <span>Nossa História</span>
            </a>

            <a
              href="#dress-code-section"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-4 py-3.5 text-xs font-medium text-white/80 transition hover:bg-black/70 hover:text-white"
            >
              <Shirt className="h-4 w-4 text-[#D3B47C]" />
              <span>Dress Code</span>
            </a>

            <button
              onClick={handleDownloadIcs}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-4 py-3.5 text-xs font-medium text-white/80 transition hover:bg-black/70 hover:text-white"
              title="Baixar convite para Apple Calendar / Outlook"
            >
              <Calendar className="h-4 w-4 text-[#D3B47C]" />
              <span>Salvar na Agenda</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2.5 MENU RÁPIDO DE NAVEGAÇÃO EDITORIAL (ANCHORS REVISADO COM LABELS DINÂMICOS) */}
      <nav className="border-b border-white/10 bg-[#100E0D]/95 py-3 backdrop-blur-md overflow-x-auto no-scrollbar shadow-sm">
        <div className="container mx-auto flex max-w-7xl items-center justify-start sm:justify-center gap-2.5 sm:gap-4 px-4 text-xs sm:text-sm font-semibold text-white/80 whitespace-nowrap">
          <a href="#carta-section" className="rounded-full px-3.5 py-1.5 hover:bg-white/10 hover:text-[#D3B47C] transition">
            {event.category === "15 Anos" ? "Mensagem da Debutante" : event.category?.includes("Corporativo") ? "Mensagem da Diretoria" : "Carta aos Convidados"}
          </a>
          <span className="text-white/20">•</span>
          <a href="#historia-section" className="rounded-full px-3.5 py-1.5 hover:bg-white/10 hover:text-[#D3B47C] transition">
            {event.category === "15 Anos" ? "Minha Jornada" : event.category?.includes("Corporativo") ? "Trajetória & Marcos" : "Nossa História"}
          </a>
          <span className="text-white/20">•</span>
          <a href="#corte-section" className="rounded-full px-3.5 py-1.5 hover:bg-white/10 hover:text-[#D3B47C] transition">
            {event.category === "15 Anos" ? "Família & Amigos" : event.category?.includes("Corporativo") ? "Comitê de Honra" : "Pais & Padrinhos"}
          </a>
          <span className="text-white/20">•</span>
          <a href="#dress-code-section" className="rounded-full px-3.5 py-1.5 hover:bg-white/10 hover:text-[#D3B47C] transition">
            Dress Code & Traje
          </a>
          <span className="text-white/20">•</span>
          <a href="#roteiro-section" className="rounded-full px-3.5 py-1.5 hover:bg-white/10 hover:text-[#D3B47C] transition">
            Roteiro da Noite
          </a>
          <span className="text-white/20">•</span>
          <a href="#qrcode-section" className="rounded-full px-3.5 py-1.5 hover:bg-white/10 hover:text-[#D3B47C] transition">
            Display & Telão
          </a>
          <span className="text-white/20">•</span>
          <a href="#livro-ouro-section" className="rounded-full px-3.5 py-1.5 hover:bg-white/10 hover:text-[#D3B47C] transition">
            Livro de Ouro
          </a>
        </div>
      </nav>

      {/* 3. CARTA ABERTA DOS NOIVOS (THE LOVE LETTER / ACOLHIMENTO DOS ANFITRIÕES) */}
      <section id="carta-section" className="relative z-10 border-t border-white/10 bg-[#100E0D] py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6">
          <div className="relative rounded-3xl border border-[#D3B47C]/30 bg-gradient-to-b from-[#181412] to-[#12100E] p-8 sm:p-14 shadow-2xl">
            {/* Selo Dourado de Cera Simulado */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#D3B47C]/60 bg-[#D3B47C]/15 shadow-[0_0_25px_rgba(211,180,124,0.3)]">
              <Heart className="h-7 w-7 text-[#D3B47C] fill-[#D3B47C]/30" />
            </div>

            <div className="text-center mb-8">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#D3B47C]">
                {story.openLetter.kicker}
              </span>
              <h2 className="mt-2 font-serif text-3xl font-normal text-white sm:text-4xl">
                {story.openLetter.title}
              </h2>
              <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-[#D3B47C]/60 to-transparent" />
            </div>

            {/* Texto da Carta */}
            <div className="space-y-5 font-serif text-base sm:text-lg leading-relaxed text-[#D6CEBE]/90 font-light text-justify sm:text-left">
              <p className="text-[#D3B47C] font-normal italic text-lg sm:text-xl">
                {story.openLetter.salutation}
              </p>
              {story.openLetter.paragraphs.map((par, idx) => (
                <p key={idx}>{par}</p>
              ))}
            </div>

            {/* Assinatura e Data */}
            <div className="mt-10 border-t border-white/10 pt-6 text-center sm:text-right">
              <p className="font-serif text-xl sm:text-2xl text-[#D3B47C] italic">
                {story.openLetter.signature}
              </p>
              <p className="mt-1 text-xs uppercase tracking-widest text-[#ABA29A]">
                {story.openLetter.dateAndCity}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CAPÍTULO A CAPÍTULO: A NOSSA LINHA DO TEMPO (THE VISUAL MEMOIR) */}
      <section id="historia-section" className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              MEMÓRIAS QUE CONSTRUÍRAM O NOSSO DESTINO
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white sm:text-5xl">
              Nossa História em Capítulos
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
              Cada passo, cada viagem e cada risada compartilhada nos trouxe até este altar sagrado no Dúnia City Hall.
            </p>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {story.chapters.map((chapter, index) => {
              const isEven = index % 2 === 0
              return (
                <div
                  key={chapter.id}
                  className={`grid gap-8 lg:grid-cols-12 lg:items-center ${
                    isEven ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Foto do Capítulo */}
                  <div className={`lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                    <div
                      onClick={() => setLightboxPhoto(chapter.image)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-black/40 shadow-2xl cursor-pointer"
                    >
                      <Image
                        src={chapter.image}
                        alt={chapter.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      {/* Badge de Ano & Local */}
                      <div className="absolute top-4 left-4 rounded-full border border-[#D3B47C]/40 bg-black/60 px-3.5 py-1 text-xs font-mono font-bold text-[#D3B47C] backdrop-blur-md">
                        {chapter.year}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/80">
                        <span className="flex items-center gap-1.5 truncate">
                          <MapPin className="h-3.5 w-3.5 text-[#D3B47C] shrink-0" />
                          <span className="truncate">{chapter.location}</span>
                        </span>
                        <span className="hidden sm:inline-flex items-center gap-1 text-[0.65rem] text-[#D3B47C] uppercase tracking-wider font-semibold opacity-0 group-hover:opacity-100 transition">
                          Ampliar <Maximize2 className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Texto Narrativo do Capítulo */}
                  <div className={`lg:col-span-6 space-y-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#D3B47C] font-semibold">
                        {chapter.label} • {chapter.year}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
                      {chapter.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#ABA29A] leading-relaxed font-light">
                      {chapter.text}
                    </p>

                    {chapter.quote && (
                      <div className="relative rounded-2xl border-l-2 border-[#D3B47C] bg-[#161311] p-4 text-xs italic text-[#E5D7C3]/90 leading-relaxed">
                        <Quote className="absolute right-3 top-3 h-5 w-5 text-[#D3B47C]/20" />
                        &ldquo;{chapter.quote}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. A CORTE DE HONRA • PAIS & PADRINHOS (AQUELES QUE CAMINHAM CONOSCO) */}
      <section id="corte-section" className="relative z-10 border-t border-white/10 bg-[#100E0D] py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#D3B47C]">
              <Users className="h-3.5 w-3.5" />
              <span>NOSSAS RAÍZES & CÚMPLICES</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl text-white sm:text-5xl">
              {story.honorCourt.title}
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
              {story.honorCourt.subtitle}
            </p>
          </div>

          {/* PAIS DOS NOIVOS */}
          <div className="mb-10">
            <h3 className="mb-4 text-center font-mono text-xs uppercase tracking-[0.25em] text-[#D3B47C]">
              OS PAIS • NOSSA MAIOR INSPIRAÇÃO
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {story.honorCourt.parents.map((p, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-center transition hover:border-[#D3B47C]/40 hover:bg-[#1a1614]"
                >
                  <span className="inline-block rounded-full border border-[#D3B47C]/30 bg-[#D3B47C]/10 px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C]">
                    {p.role}
                  </span>
                  <h4 className="mt-3 font-serif text-xl text-white">{p.name}</h4>
                  <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PADRINHOS & MADRINHAS */}
          <div>
            <h3 className="mb-4 text-center font-mono text-xs uppercase tracking-[0.25em] text-[#D3B47C]">
              CORTE DE PADRINHOS • GUARDIÕES DO NOSSO AMOR
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {story.honorCourt.witnesses.map((w, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-[#14110F] p-5 text-center transition hover:border-[#D3B47C]/40 hover:-translate-y-1"
                >
                  <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#D3B47C]/10 text-[#D3B47C]">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h5 className="font-serif text-base text-white">{w.name}</h5>
                  <span className="mt-1 block text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C]">
                    {w.role}
                  </span>
                  <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">{w.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. GUIA DE ESTILO & DRESS CODE (COMO SONHAMOS RECEBER VOCÊ) */}
      <section id="dress-code-section" className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#D3B47C]">
              <Shirt className="h-3.5 w-3.5" />
              <span>A ELEGÂNCIA DA NOITE</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl text-white sm:text-5xl">
              Guia de Estilo & Dress Code
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A]">
              {story.dressCode.tagline}
            </p>
          </div>

          <div className="rounded-3xl border border-[#D3B47C]/30 bg-[#161311] p-6 sm:p-10 shadow-2xl">
            {/* Tagline Principal */}
            <div className="text-center pb-8 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D3B47C]">
                TRAJE SUGERIDO
              </span>
              <h3 className="mt-1 font-serif text-2xl sm:text-3xl text-white">
                {story.dressCode.style}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#ABA29A] max-w-xl mx-auto leading-relaxed">
                {story.dressCode.description}
              </p>
            </div>

            {/* Paleta de Cores Inspiracional */}
            <div className="py-8 border-b border-white/10">
              <span className="block text-center text-xs font-bold uppercase tracking-widest text-[#D3B47C] mb-4">
                PALETA DE CORES SUGERIDA PARA INSPIRAÇÃO
              </span>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                {story.dressCode.palette.map((color, i) => (
                  <div key={i} className="flex flex-col items-center text-center gap-1.5">
                    <div
                      className="h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-white/20 shadow-lg transition hover:scale-110"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-semibold text-white">{color.name}</span>
                    {color.note && (
                      <span className="text-[0.65rem] text-[#ABA29A]">{color.note}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendações Para Elas & Para Eles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D3B47C]">
                  PARA AS DAMAS
                </span>
                <p className="mt-2 text-xs leading-relaxed text-[#ABA29A]">
                  {story.dressCode.forHer}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D3B47C]">
                  PARA OS CAVALHEIROS
                </span>
                <p className="mt-2 text-xs leading-relaxed text-[#ABA29A]">
                  {story.dressCode.forHim}
                </p>
              </div>
            </div>

            {/* Lembrete Delicado */}
            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-center">
              <p className="text-xs text-amber-200/90 leading-relaxed">
                ✨ <strong>Lembrete carinhoso:</strong> {story.dressCode.caution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PROGRAMAÇÃO & ROTEIRO DA CELEBRAÇÃO */}
      <section id="roteiro-section" className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              CADA INSTANTE IMPORTA
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white sm:text-5xl">
              Roteiro Poético da Noite
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A]">
              Momentos desenhados para você viver conosco com o coração aberto do início ao fim.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {story.poeticSchedule.map((item, idx) => (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#161311] transition hover:border-[#D3B47C]/40 hover:-translate-y-1 shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3 rounded-md bg-black/80 px-2.5 py-1 text-xs font-mono font-bold text-[#D3B47C]">
                    {item.time}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C] block">
                    {item.act}
                  </span>
                  <h3 className="font-serif text-lg text-white font-normal leading-snug">{item.title}</h3>
                  <p className="text-[0.7rem] text-[#D3B47C]/90 italic leading-snug">
                    {item.atmosphere}
                  </p>
                  <p className="text-xs text-[#ABA29A] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. O DESTAQUE PRINCIPAL: DISPLAY DE MESA INTERATIVO & QR CODE AO VIVO */}
      <section id="qrcode-section" className="relative z-10 border-t border-white/10 bg-[#100E0D] py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#D3B47C]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>DÚNIA LIVE MEMORIES • INTERAÇÃO EM TEMPO REAL</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl text-white sm:text-5xl">
              O QR Code da Sua Mesa
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
              Durante a festa, cada mesa tem seu próprio display. Aponte a câmera do seu smartphone, tire fotos e veja suas lembranças aparecerem ao vivo no telão do salão!
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            {/* LADO ESQUERDO: O TOTEM / DISPLAY DE MESA REALISTA EM 3D */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-sm rounded-[28px] border-2 border-[#D3B47C]/40 bg-gradient-to-b from-[#1E1916] via-[#14110F] to-[#0E0C0B] p-6 shadow-[0_25px_60px_-15px_rgba(211,180,124,0.18)] text-center">
                {/* Placa Metálica do Topo */}
                <div className="mb-4 flex items-center justify-center gap-2 border-b border-[#D3B47C]/20 pb-4">
                  <Image
                    src="/assets/logo.png"
                    alt="Dúnia City Hall"
                    width={110}
                    height={30}
                    className="h-6 w-auto object-contain opacity-90"
                  />
                  <span className="text-[0.6rem] font-bold tracking-widest text-[#D3B47C] uppercase">
                    • MESA VIP
                  </span>
                </div>

                {/* Moldura Dourada do QR Code */}
                <div className="relative mx-auto w-48 rounded-2xl border-2 border-[#D3B47C]/60 bg-white p-3 shadow-inner">
                  <img
                    src={qrCodeImageUrl}
                    alt="QR Code do Telão do Evento"
                    className="h-auto w-full rounded-lg object-contain"
                  />
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#100E0D] px-3 py-0.5 text-[0.6rem] font-bold tracking-wider text-[#D3B47C] uppercase border border-[#D3B47C]/40">
                    AO VIVO NO TELÃO
                  </div>
                </div>

                {/* Instruções do Totem */}
                <div className="mt-6 space-y-1.5">
                  <p className="font-serif text-lg font-light text-white">
                    Compartilhe Seus Olhares
                  </p>
                  <p className="text-xs text-[#ABA29A] leading-relaxed max-w-xs mx-auto">
                    Aponte a câmera do seu celular para enviar fotos diretamente para o telão oficial do Dúnia City Hall.
                  </p>
                </div>

                {/* Botões do Totem */}
                <div className="mt-5 flex items-center justify-center gap-2 pt-4 border-t border-white/10">
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/90 hover:bg-white/10 transition"
                  >
                    <Maximize2 className="h-3 w-3 text-[#D3B47C]" />
                    <span>Escanear no Monitor</span>
                  </button>

                  <button
                    onClick={() => setShowPrintModal(true)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3 py-1.5 text-xs font-bold text-[#D3B47C] hover:bg-[#D3B47C]/20 transition"
                  >
                    <Printer className="h-3 w-3" />
                    <span>Imprimir Totens</span>
                  </button>
                </div>
              </div>
            </div>

            {/* LADO DIREITO: EXPLICAÇÃO DO SISTEMA & FEED AO VIVO DO TELÃO */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 sm:p-8">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                  EXPERIÊNCIA INTERATIVA DÚNIA
                </span>
                <h3 className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                  Como Funciona o Telão em 3 Passos
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <span className="font-serif text-2xl text-[#D3B47C]">01</span>
                    <h4 className="mt-1 text-xs font-bold uppercase text-white">Aponte o Celular</h4>
                    <p className="mt-1 text-[0.7rem] text-[#ABA29A] leading-relaxed">
                      Sem precisar baixar nenhum aplicativo. Abre na hora no navegador.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <span className="font-serif text-2xl text-[#D3B47C]">02</span>
                    <h4 className="mt-1 text-xs font-bold uppercase text-white">Envie sua Foto</h4>
                    <p className="mt-1 text-[0.7rem] text-[#ABA29A] leading-relaxed">
                      Tire uma selfie ou escolha da galeria com um recado carinhoso.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <span className="font-serif text-2xl text-[#D3B47C]">03</span>
                    <h4 className="mt-1 text-xs font-bold uppercase text-white">Direto no Telão</h4>
                    <p className="mt-1 text-[0.7rem] text-[#ABA29A] leading-relaxed">
                      A foto entra no slideshow oficial do salão em instantes!
                    </p>
                  </div>
                </div>

                {/* Botões Centrais */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/evento/fotos"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Testar Envio de Fotos Agora</span>
                  </Link>

                  <Link
                    href="/evento/telao"
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    <Tv className="h-4 w-4 text-[#D3B47C]" />
                    <span>Ver Telão em Nova Janela ↗</span>
                  </Link>
                </div>
              </div>

              {/* FEED AO VIVO DAS FOTOS DA NOITE */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                      FEED DO TELÃO
                    </span>
                    <h4 className="font-serif text-xl text-white">
                      Fotos Enviadas pelos Convidados ({guestPhotos.length})
                    </h4>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[0.65rem] font-bold text-emerald-400">
                    Sincronizado
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {guestPhotos.slice(0, 4).map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40"
                    >
                      <Image
                        src={photo.url}
                        alt={photo.guestName}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-xs">
                        <span className="text-[0.65rem] font-bold text-[#D3B47C] block truncate">
                          {photo.guestName.split(" ")[0]}
                        </span>
                        <button
                          onClick={() => handleToggleLike(photo.id)}
                          className="mt-1 flex items-center gap-1 text-[0.6rem] text-white/80 hover:text-rose-400 transition"
                        >
                          <Heart className="h-2.5 w-2.5 fill-rose-500 text-rose-500" />
                          <span>{likedPhotos[photo.id] || 12}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. LOCALIZAÇÃO & COMO CHEGAR */}
      <section id="localizacao" className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Foto e Card de Endereço */}
            <div className="lg:col-span-6 relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="/images/acervo/03-casamento/Destaque-Casamento-2.jpg"
                alt="Dúnia City Hall Fachada"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-xs uppercase tracking-widest text-[#D3B47C] font-semibold">
                  O Salão Mais Elegante de Brasília
                </span>
                <p className="font-serif text-2xl text-white mt-1">Dúnia City Hall • Lago Sul</p>
                <p className="text-xs text-white/70 mt-1">SHIS QI 15 Lote J/K, Lago Sul, Brasília - DF</p>
              </div>
            </div>

            {/* Informações e Botões de Trajeto */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                  FÁCIL ACESSO NO CORAÇÃO DO LAGO SUL
                </span>
                <h3 className="mt-2 font-serif text-3xl text-white sm:text-4xl">Como Chegar ao Dúnia</h3>
                <p className="mt-2 text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                  Localização nobre, privativa e com infraestrutura completa de recepção para todos os convidados.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-[#161311] p-4">
                  <Car className="h-5 w-5 shrink-0 text-[#D3B47C] mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white">Valet Parking com Manobrista</h4>
                    <p className="text-xs text-[#ABA29A]">Serviço de manobrista cortesia na entrada principal para seu conforto.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-xl border border-white/10 bg-[#161311] p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[#D3B47C] mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase text-white">Acessibilidade Total</h4>
                    <p className="text-xs text-[#ABA29A]">Rampas suaves, elevador panorâmico e acolhimento dedicado a pessoas com mobilidade reduzida.</p>
                  </div>
                </div>
              </div>

              {/* Botões de Ação para Navegação */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Dúnia+City+Hall+Lago+Sul+Brasilia"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  <Navigation className="h-4 w-4 text-[#D3B47C]" />
                  <span>Google Maps</span>
                </a>

                <a
                  href="https://waze.com/ul?q=Dunia%20City%20Hall"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  <Navigation className="h-4 w-4 text-[#D3B47C]" />
                  <span>Waze</span>
                </a>

                <a
                  href="https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=D%C3%BAnia%20City%20Hall%2C%20Lago%20Sul"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  <Car className="h-4 w-4 text-[#D3B47C]" />
                  <span>Pedir Uber</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CONFIRMAÇÃO DE PRESENÇA (RSVP DIGITAL DE LUXO) */}
      <section id="rsvp-section" className="relative z-10 border-t border-white/10 bg-[#100E0D] py-24">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              SUA PRESENÇA É NOSSO MAIOR PRESENTE
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white sm:text-5xl">
              Confirmação de Presença
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A]">
              Por favor, confirme até o dia <strong>10 de Novembro de 2026</strong> para organizarmos seu lugar e acolhimento com primor.
            </p>

            {/* Pílulas de Códigos de Demonstração Rápida */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-white/40 text-[0.7rem]">Convites de teste:</span>
              {guests.slice(0, 3).map((g) => (
                <button
                  key={g.id}
                  onClick={() => handleSelectDemoGuest(g.code)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[0.65rem] text-[#D3B47C] hover:border-[#D3B47C] transition"
                >
                  {g.code} ({g.name.split(" ")[0]})
                </button>
              ))}
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleRsvpSubmit} className="mt-8 space-y-4 rounded-3xl border border-white/15 bg-[#161311] p-6 sm:p-8 shadow-2xl">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D3B47C]">
                Código do Convite
              </label>
              <input
                type="text"
                value={rsvpCode}
                onChange={(e) => setRsvpCode(e.target.value)}
                placeholder="Ex: DUNIA-001"
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-[#D3B47C] focus:outline-none focus:ring-1 focus:ring-[#D3B47C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D3B47C]">
                Você comparecerá à celebração?
              </label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus("confirmed")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold uppercase transition ${
                    rsvpStatus === "confirmed"
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : "border-white/15 bg-black/40 text-white/60 hover:border-white/30"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Sim, confirmo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRsvpStatus("declined")}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold uppercase transition ${
                    rsvpStatus === "declined"
                      ? "border-rose-500 bg-rose-500/20 text-rose-300"
                      : "border-white/15 bg-black/40 text-white/60 hover:border-white/30"
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                  <span>Não poderei ir</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D3B47C]">
                Restrição Alimentar (Opcional)
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
              >
                <option value="padrao">Nenhuma restrição (Menu Completo Dúnia)</option>
                <option value="vegetariano">Menu Vegetariano</option>
                <option value="vegano">Menu Vegano</option>
                <option value="sem_gluten">Sem Glúten (Celíacos)</option>
                <option value="sem_lactose">Sem Lactose</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#D3B47C]">
                Mensagem aos Noivos (Opcional)
              </label>
              <textarea
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                rows={3}
                placeholder="Deixe um recado afetuoso para os anfitriões..."
                className="mt-2 w-full rounded-xl border border-white/15 bg-black/50 p-4 text-xs text-white placeholder-white/30 focus:border-[#D3B47C] focus:outline-none focus:ring-1 focus:ring-[#D3B47C]"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow-lg transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Enviar Confirmação
            </button>

            {/* FEEDBACK */}
            {rsvpFeedback && (
              <div
                className={`rounded-xl p-4 text-xs leading-relaxed ${
                  rsvpFeedback.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-200"
                }`}
              >
                {rsvpFeedback.text}
              </div>
            )}
          </form>
        </div>
      </section>

      {/* 12. LISTA DE PRESENTES & COTAS DE LUA DE MEL */}
      <section className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <Gift className="mx-auto mb-3 h-8 w-8 text-[#D3B47C]" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
            CARINHO & GRATIDÃO
          </span>
          <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
            Lista de Presentes & Cotas de Lua de Mel
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#ABA29A] max-w-xl mx-auto leading-relaxed">
            O nosso maior presente é ter você conosco. Caso queira nos presentear com uma cota para a viagem dos nossos sonhos ou para o nosso novo lar:
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-center transition hover:border-[#D3B47C]/40">
              <span className="text-2xl">🗼</span>
              <h4 className="mt-2 font-serif text-base text-white">Jantar Romântico em Paris</h4>
              <p className="mt-1 font-mono text-sm text-[#D3B47C]">R$ 250,00</p>
              <button
                onClick={handleCopyPix}
                className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Presentear Cota
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-center transition hover:border-[#D3B47C]/40">
              <span className="text-2xl">🛶</span>
              <h4 className="mt-2 font-serif text-base text-white">Passeio de Gôndola em Veneza</h4>
              <p className="mt-1 font-mono text-sm text-[#D3B47C]">R$ 400,00</p>
              <button
                onClick={handleCopyPix}
                className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Presentear Cota
              </button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-center transition hover:border-[#D3B47C]/40">
              <span className="text-2xl">🏡</span>
              <h4 className="mt-2 font-serif text-base text-white">Cota Livre para o Novo Lar</h4>
              <p className="mt-1 font-mono text-sm text-[#D3B47C]">Valor à escolha</p>
              <button
                onClick={handleCopyPix}
                className="mt-4 w-full rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Copiar Chave Pix
              </button>
            </div>
          </div>

          {/* CHAVE PIX DOS NOIVOS */}
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-[#D3B47C]/30 bg-[#161311] p-4 text-xs">
            <span className="text-white/60">Chave Pix Oficial:</span>
            <span className="font-mono font-bold text-[#D3B47C]">financeiro@duniacityhall.com.br</span>
            <button
              onClick={handleCopyPix}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#D3B47C] px-3 py-1.5 font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
            >
              {copiedPix ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedPix ? "Copiado!" : "Copiar Chave"}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 13. LIVRO DE OURO DIGITAL (RECADOS & VOTOS DOS CONVIDADOS) */}
      <section id="livro-ouro-section" className="relative z-10 border-t border-white/10 bg-[#100E0D] py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#D3B47C]">
              <Heart className="h-3.5 w-3.5" />
              <span>LIVRO DE OURO DIGITAL</span>
            </div>
            <h2 className="mt-3 font-serif text-3xl text-white sm:text-5xl">
              Mensagens & Votos de Felicidade
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A]">
              Deixe um recado de amor para os anfitriões antes da celebração.
            </p>
          </div>

          {/* Formulário de Deixar Recado */}
          <form onSubmit={handleAddWish} className="mb-12 rounded-3xl border border-white/15 bg-[#161311] p-6 sm:p-8 shadow-xl">
            <h3 className="font-serif text-xl text-white mb-4">Escrever no Livro de Ouro</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-[#D3B47C] uppercase">Seu Nome</label>
                <input
                  type="text"
                  value={newWishName}
                  onChange={(e) => setNewWishName(e.target.value)}
                  placeholder="Ex: Camila & Rodrigo"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#D3B47C] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#D3B47C] uppercase">Grau de Parentesco / Amizade</label>
                <input
                  type="text"
                  value={newWishRelation}
                  onChange={(e) => setNewWishRelation(e.target.value)}
                  placeholder="Ex: Padrinhos / Amiga da Noiva"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-[#D3B47C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D3B47C] uppercase">Sua Mensagem com Carinho</label>
              <textarea
                value={newWishText}
                onChange={(e) => setNewWishText(e.target.value)}
                rows={3}
                placeholder="Deseje bênçãos, compartilhe uma memória ou mande boas energias..."
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 p-3.5 text-xs text-white placeholder-white/30 focus:border-[#D3B47C] focus:outline-none"
                required
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Publicar Mensagem</span>
              </button>

              {wishSubmitted && (
                <span className="text-xs text-emerald-400 font-medium animate-fadeIn">
                  ✓ Sua mensagem foi eternizada no livro de ouro!
                </span>
              )}
            </div>
          </form>

          {/* Mural de Mensagens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishesList.map((wish) => (
              <div
                key={wish.id}
                className="rounded-2xl border border-white/10 bg-[#161311] p-5 space-y-2.5 transition hover:border-[#D3B47C]/30"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-serif text-base text-white font-medium">{wish.name}</span>
                  <span className="text-[0.65rem] text-[#ABA29A]">{wish.timeAgo}</span>
                </div>
                <span className="inline-block rounded-full border border-[#D3B47C]/30 bg-[#D3B47C]/10 px-2 py-0.5 text-[0.6rem] font-bold text-[#D3B47C] uppercase">
                  {wish.relationship}
                </span>
                <p className="text-xs text-[#D6CEBE]/90 font-light italic leading-relaxed">
                  &ldquo;{wish.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 14. ÁLBUM OFICIAL & GALERIA DE FOTOGRAFIAS DO DÚNIA */}
      <section className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              REGISTROS CINEMATOGRÁFICOS
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white sm:text-5xl">
              Álbum Oficial de Inspirações
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A]">
              Momentos reais registrados no Dúnia City Hall para inspirar a sua imaginação.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {officialGallery.map((item, index) => (
              <div
                key={index}
                onClick={() => setLightboxPhoto(item.src)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/40 cursor-pointer shadow-lg"
              >
                <Image
                  src={item.src}
                  alt={item.caption}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-serif text-sm font-light">{item.caption}</span>
                  <Maximize2 className="h-4 w-4 text-[#D3B47C] opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. RODAPÉ INSTITUCIONAL */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0A0807] py-14 text-center text-xs text-[#ABA29A]">
        <div className="container mx-auto max-w-4xl px-4 space-y-4">
          <Image
            src="/assets/logo.png"
            alt="Dúnia City Hall"
            width={130}
            height={36}
            className="h-8 w-auto object-contain mx-auto opacity-80"
          />
          <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
            Dúnia City Hall • O Cenário dos Momentos Inesquecíveis no Lago Sul, Brasília.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-[#D3B47C] pt-2">
            <Link href="/" className="hover:underline">Visitar Página Principal</Link>
            <span>•</span>
            <Link href="/painel" className="hover:underline">Painel Administrativo</Link>
            <span>•</span>
            <a href="#rsvp-section" className="hover:underline">Confirmar Presença</a>
          </div>
          <p className="text-[0.65rem] text-white/30 pt-4">
            © {new Date().getFullYear()} Dúnia City Hall. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* MODAL 1: QR CODE EM TELA CHEIA (PARA ESCANEAR DO MONITOR) */}
      {showQrModal && (
        <div
          onClick={() => setShowQrModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-[#D3B47C]/40 bg-[#161311] p-8 text-center shadow-2xl"
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-widest text-[#D3B47C]">
              DÚNIA LIVE MEMORIES
            </span>
            <h3 className="mt-1 font-serif text-2xl text-white">Escanear com Celular</h3>
            <p className="mt-2 text-xs text-[#ABA29A]">
              Aponte a câmera do seu smartphone para o código abaixo para testar o envio de fotos ao vivo.
            </p>

            <div className="my-6 mx-auto w-64 rounded-2xl border-2 border-[#D3B47C] bg-white p-4 shadow-xl">
              <img
                src={qrCodeImageUrl}
                alt="QR Code Telão Ampliado"
                className="h-auto w-full rounded-lg object-contain"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleCopyLink}
                className="w-full rounded-xl bg-[#D3B47C] py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition flex items-center justify-center gap-2"
              >
                {copiedLink ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copiedLink ? "Link Copiado!" : "Copiar Link Direto"}</span>
              </button>

              <Link
                href="/evento/fotos"
                className="w-full rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Abrir Página de Envio de Fotos
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRÉ-VISUALIZAÇÃO DE DISPLAY DE MESA PARA IMPRESSÃO */}
      {showPrintModal && (
        <div
          onClick={() => setShowPrintModal(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl border border-[#D3B47C]/40 bg-[#161311] p-6 sm:p-8 text-center shadow-2xl my-8"
          >
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-xs font-bold uppercase tracking-widest text-[#D3B47C]">
              DISPLAYS DE MESA OFICIAIS
            </span>
            <h3 className="mt-1 font-serif text-2xl text-white">Totem de Mesa para Gráfica</h3>
            <p className="mt-1 text-xs text-[#ABA29A]">
              Modelo padrão de impressão (10x15cm ou 15x21cm) com acabamento em acrílico ou papel couché fosco.
            </p>

            {/* Cartão de Mesa Simulado */}
            <div className="my-6 mx-auto max-w-xs rounded-2xl border-2 border-[#D3B47C] bg-[#120F0D] p-6 text-center text-white shadow-2xl">
              <Image
                src="/assets/logo.png"
                alt="Dúnia City Hall"
                width={120}
                height={35}
                className="h-7 w-auto object-contain mx-auto mb-3"
              />
              <p className="font-serif text-xl text-[#D3B47C]">{event.name}</p>
              <p className="text-[0.65rem] uppercase tracking-widest text-[#ABA29A] mt-0.5">
                {formatEventDate(event.date)}
              </p>

              <div className="my-4 mx-auto w-40 rounded-xl bg-white p-2.5 shadow">
                <img src={qrCodeImageUrl} alt="QR Code" className="h-auto w-full object-contain" />
              </div>

              <p className="font-serif text-sm text-white">Compartilhe Suas Fotos</p>
              <p className="text-[0.65rem] text-[#ABA29A] mt-1 leading-snug">
                Aponte a câmera do seu celular e veja suas fotos no telão oficial do salão!
              </p>
              <div className="mt-4 border-t border-white/10 pt-2 text-[0.6rem] text-[#D3B47C] uppercase tracking-widest">
                MESA VIP • DÚNIA CITY HALL
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.print()}
                className="rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition inline-flex items-center gap-2"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir Este Modelo</span>
              </button>

              <button
                onClick={() => setShowPrintModal(false)}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: LIGHTBOX DE FOTOS EM ALTA RESOLUÇÃO */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute right-6 top-6 rounded-full bg-white/15 p-3 text-white hover:bg-white/30 transition"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
          >
            <img
              src={lightboxPhoto}
              alt="Foto Ampliada"
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}

          </div>
  )
}
