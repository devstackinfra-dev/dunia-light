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

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

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
    { src: "/images/galeria/Destaque-Casamento-1.jpg", caption: "O Sim Sob Lustres de Cristal" },
    { src: "/images/galeria/Destaque-Casamento-2.jpg", caption: "Arquitetura Clássica & Cenografia" },
    { src: "/images/galeria/Destaque-Casamento-3.jpg", caption: "Mesa de Doces & Alta Gastronomia" },
    { src: "/images/galeria/Destaque-Casamento-4.jpg", caption: "Brinde com os Padrinhos" },
    { src: "/images/galeria/CASAMENTO-92.jpg", caption: "Detalhes Florais & Ambientação" },
    { src: "/images/galeria/CASAMENTO-111.jpg", caption: "Celebração & Pista de Dança" },
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

  return (
    <div className="relative min-h-screen bg-[#0C0A09] text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      {/* 0. AURA DE ILUMINAÇÃO DE FUNDO */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-[650px] w-[650px] rounded-full bg-gradient-to-b from-[#D3B47C]/12 to-transparent blur-[160px]" />
        <div className="absolute top-[40%] -left-32 h-[550px] w-[550px] rounded-full bg-[#AF8850]/8 blur-[140px]" />
        <div className="absolute bottom-20 right-10 h-[600px] w-[600px] rounded-full bg-[#D3B47C]/10 blur-[160px]" />
      </div>

      {/* 1. TOPO DE NAVEGAÇÃO VIP */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#100E0D]/95 backdrop-blur-md">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="Dúnia City Hall"
                width={150}
                height={42}
                className="h-8 w-auto object-contain sm:h-10"
                priority
              />
            </Link>

            <div className="hidden lg:block h-5 w-[1px] bg-white/15" />

            {/* SELETOR DE EVENTO DE DEMONSTRAÇÃO */}
            <div className="hidden md:flex items-center gap-1.5 rounded-full border border-[#D3B47C]/30 bg-black/40 p-1 text-xs">
              {allEvents.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => handleSwitchEvent(ev.id)}
                  className={`rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-wider transition ${
                    selectedEventId === ev.id
                      ? "bg-[#D3B47C] text-[#100E0D] shadow"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  {ev.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Links e Botão de Ação */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/evento/telao"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 transition hover:border-[#D3B47C] hover:text-[#D3B47C]"
            >
              <Tv className="h-3.5 w-3.5 text-[#D3B47C]" />
              <span className="hidden sm:inline">Telão ao Vivo</span>
            </Link>

            <a
              href="#qrcode-section"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#D3B47C] transition hover:bg-[#D3B47C]/20"
            >
              <QrCode className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">QR Code Mesa</span>
            </a>

            <a
              href="#rsvp-section"
              className="rounded-lg bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:opacity-95"
            >
              Confirmar Presença
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO EDITORIAL CINEMATOGRÁFICO */}
      <section className="relative z-10 flex min-h-[82vh] flex-col justify-end overflow-hidden px-4 pb-16 pt-24 sm:px-8 sm:pb-20">
        {/* Foto de Fundo com Fade Suave */}
        <div className="absolute inset-0 z-0">
          <Image
            src={event.welcomePhoto || "/assets/casal.jpg"}
            alt={event.name}
            fill
            className="object-cover object-[center_28%] filter brightness-[0.42] transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-[#0C0A09]/50 to-black/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(12,10,9,0.85)_100%)]" />
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          {/* Kicker Dourado com Ornamento */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/30 bg-black/60 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#D3B47C] animate-pulse" />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#D3B47C]">
              CELEBRAÇÃO OFICIAL • DÚNIA CITY HALL
            </span>
          </div>

          {/* Nome dos Anfitriões */}
          <h1 className="mt-6 font-serif text-5xl font-normal leading-tight text-white sm:text-7xl lg:text-8xl">
            {event.name}
          </h1>

          {/* Data e Local */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#ABA29A] sm:text-sm">
            <span>{formatEventDate(event.date)}</span>
            <span>•</span>
            <span>{event.time}</span>
            <span>•</span>
            <span className="text-[#D3B47C] font-semibold">{event.venue}</span>
          </div>

          {/* CONTAGEM REGRESSIVA EM ESTILO CRONÔMETRO DE LUXO */}
          <div className="mt-8 inline-grid grid-cols-4 gap-2.5 rounded-2xl border border-white/15 bg-black/65 p-3.5 backdrop-blur-md sm:gap-6 sm:p-5 shadow-2xl">
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
              href="#qrcode-section"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-[#D3B47C] hover:bg-white/10"
            >
              <Camera className="h-4 w-4 text-[#D3B47C]" />
              <span>Enviar Fotos da Mesa</span>
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

      {/* 3. MENSAGEM DOS ANFITRIÕES & NOSSA HISTÓRIA */}
      <section className="relative z-10 border-t border-white/10 bg-[#100E0D] py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-center">
            <Heart className="mx-auto mb-4 h-7 w-7 text-[#D3B47C]" />
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              O SENTIMENTO POR TRÁS DA CELEBRAÇÃO
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal leading-relaxed text-white sm:text-4xl lg:text-5xl">
              &ldquo;{event.message}&rdquo;
            </h2>
            <p className="mt-4 text-xs sm:text-sm text-[#ABA29A] max-w-2xl mx-auto leading-relaxed">
              Cada detalhe no Dúnia City Hall foi pensado para criar memórias vivas, acolhedoras e inesquecíveis. A sua presença é o que torna esse dia completo.
            </p>
          </div>

          {/* Grid de 3 Marcos da História */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 text-center transition hover:border-[#D3B47C]/40">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">01 • O ENCONTRO</span>
              <h3 className="mt-2 font-serif text-lg text-white">Onde Tudo Começou</h3>
              <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
                Um olhar entre amigos em Brasília que se transformou na história mais bonita das nossas vidas.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 text-center transition hover:border-[#D3B47C]/40">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">02 • O PEDIDO</span>
              <h3 className="mt-2 font-serif text-lg text-white">O Sim Inesquecível</h3>
              <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
                Ao pôr do sol, uma promessa sincera de construir juntos um caminho repleto de amor e cumplicidade.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 text-center transition hover:border-[#D3B47C]/40">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">03 • O GRANDE DIA</span>
              <h3 className="mt-2 font-serif text-lg text-white">No Dúnia City Hall</h3>
              <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
                Reunindo quem mais amamos no salão mais distinto do Lago Sul para uma celebração épica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. O DESTAQUE PRINCIPAL: DISPLAY DE MESA INTERATIVO & QR CODE AO VIVO */}
      <section id="qrcode-section" className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-24">
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
                <div className="relative mx-auto my-4 w-56 h-56 rounded-2xl border-2 border-[#D3B47C] bg-white p-3 shadow-inner">
                  <img
                    src={qrCodeImageUrl}
                    alt="QR Code Álbum do Evento"
                    width={220}
                    height={220}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 pointer-events-none rounded-xl ring-1 ring-black/10" />
                </div>

                <div className="mt-4 space-y-1">
                  <p className="font-serif text-lg font-normal text-white">
                    Compartilhe Sua Perspectiva
                  </p>
                  <p className="text-[0.72rem] text-[#D3B47C] font-medium leading-relaxed">
                    Aponte a câmera do celular para enviar fotos diretamente ao Telão Dúnia!
                  </p>
                </div>

                {/* Status Ao Vivo */}
                <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-black/60 py-2 px-3 border border-white/10 text-xs">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[0.68rem] font-semibold text-emerald-300 uppercase tracking-wider">
                    Transmissão Ativa no Salão
                  </span>
                </div>

                {/* Ações Rápidas do Display */}
                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#D3B47C]/40 bg-[#D3B47C]/10 py-2.5 px-2 text-[0.68rem] font-bold uppercase tracking-wider text-[#D3B47C] transition hover:bg-[#D3B47C]/20"
                  >
                    <Maximize2 className="h-3 w-3" />
                    <span>Ampliar QR</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 py-2.5 px-2 text-[0.68rem] font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
                  >
                    {copiedLink ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedLink ? "Copiado!" : "Copiar Link"}</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowPrintModal(true)}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-black/40 py-2 text-[0.65rem] font-medium text-white/70 hover:text-white transition"
                >
                  <Printer className="h-3 w-3 text-[#D3B47C]" />
                  <span>Imprimir Modelo de Display de Mesa</span>
                </button>
              </div>
            </div>

            {/* LADO DIREITO: DEMO DO TELÃO AO VIVO & FOTOS ENVIADAS */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card de Explicação do Fluxo */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 sm:p-8">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                  COMO FUNCIONA A EXPERIÊNCIA
                </span>
                <h3 className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                  Sem download de aplicativo. Apenas aponte e compartilhe.
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <span className="font-serif text-2xl text-[#D3B47C]">01</span>
                    <h4 className="mt-1 text-xs font-bold uppercase text-white">Escaneie o QR</h4>
                    <p className="mt-1 text-[0.7rem] text-[#ABA29A] leading-relaxed">
                      Cada convidado usa sua própria câmera do celular na mesa.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                    <span className="font-serif text-2xl text-[#D3B47C]">02</span>
                    <h4 className="mt-1 text-xs font-bold uppercase text-white">Tire a Foto</h4>
                    <p className="mt-1 text-[0.7rem] text-[#ABA29A] leading-relaxed">
                      Adicione um recado carinhoso aos noivos ou anfitriões.
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

      {/* 5. PROGRAMAÇÃO & ROTEIRO DA CELEBRAÇÃO */}
      <section className="relative z-10 border-t border-white/10 bg-[#100E0D] py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              CADA INSTANTE IMPORTA
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white sm:text-5xl">
              Roteiro da Noite
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A]">
              Preparamos momentos emocionantes para você viver conosco do início ao fim.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Ato 1 */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161311] transition hover:border-[#D3B47C]/40">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/galeria/Dunia-24-06-23-144.jpg"
                  alt="Welcome Drink"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-mono font-bold text-[#D3B47C]">
                  18:00
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-[#D3B47C] text-xs font-semibold">
                  <Wine className="h-3.5 w-3.5" />
                  <span>BOAS-VINDAS</span>
                </div>
                <h3 className="mt-2 font-serif text-lg text-white">Welcome Cocktail</h3>
                <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                  Recepção no Foyer e Jardim com música acústica ao vivo e espumantes gelados.
                </p>
              </div>
            </div>

            {/* Ato 2 */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161311] transition hover:border-[#D3B47C]/40">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/assets/salao.jpg"
                  alt="A Cerimônia"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-mono font-bold text-[#D3B47C]">
                  19:00
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-[#D3B47C] text-xs font-semibold">
                  <Heart className="h-3.5 w-3.5" />
                  <span>A CERIMÔNIA</span>
                </div>
                <h3 className="mt-2 font-serif text-lg text-white">O Momento do Sim</h3>
                <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                  Celebração emocionante na nave principal sob o brilho dos lustres de cristal.
                </p>
              </div>
            </div>

            {/* Ato 3 */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161311] transition hover:border-[#D3B47C]/40">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/assets/mesa.jpg"
                  alt="O Jantar"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-mono font-bold text-[#D3B47C]">
                  20:30
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-[#D3B47C] text-xs font-semibold">
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  <span>GASTRONOMIA</span>
                </div>
                <h3 className="mt-2 font-serif text-lg text-white">Banquete Dúnia</h3>
                <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                  Menu autoral exclusivo com alta gastronomia, doces finos e mesa de antepastos.
                </p>
              </div>
            </div>

            {/* Ato 4 */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#161311] transition hover:border-[#D3B47C]/40">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/assets/festa.jpg"
                  alt="A Pista de Dança"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-mono font-bold text-[#D3B47C]">
                  22:00
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-[#D3B47C] text-xs font-semibold">
                  <Music className="h-3.5 w-3.5" />
                  <span>A FESTA</span>
                </div>
                <h3 className="mt-2 font-serif text-lg text-white">Pista & Telão</h3>
                <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                  DJ ao vivo, iluminação cênica de ponta, bar de drinks autorais e fotos dos convidados.
                </p>
              </div>
            </div>
          </div>

          {/* Card de Dress Code / Traje */}
          <div className="mt-8 rounded-2xl border border-[#D3B47C]/25 bg-[#D3B47C]/5 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                GUIA DE ESTILO & CONFORTO
              </span>
              <h3 className="font-serif text-2xl text-white">Traje: Passeio Completo / Black Tie Opcional</h3>
              <p className="text-xs text-[#ABA29A] max-w-xl">
                O salão é 100% climatizado. Para os cavalheiros: terno clássico. Para as damas: vestidos elegantes longos ou midi sofisticados.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#1A1817] border border-white/20" title="Preto Clássico" />
              <div className="h-8 w-8 rounded-full bg-[#2A3439] border border-white/20" title="Azul Noturno" />
              <div className="h-8 w-8 rounded-full bg-[#3D2F28] border border-white/20" title="Mogno Nobre" />
              <div className="h-8 w-8 rounded-full bg-[#D3B47C] border border-[#D3B47C]" title="Toques Dourados" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. LOCALIZAÇÃO & COMO CHEGAR */}
      <section id="localizacao" className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Foto e Card de Endereço */}
            <div className="lg:col-span-6 relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
              <Image
                src="/images/galeria/Destaque-Casamento-2.jpg"
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

      {/* 7. CONFIRMAÇÃO DE PRESENÇA (RSVP DIGITAL DE LUXO) */}
      <section id="rsvp-section" className="relative z-10 border-t border-white/10 bg-[#100E0D] py-24">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              SUA PRESENÇA É NOSSO MAIOR PRESENTE
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white sm:text-5xl">
              Confirmação de Presença
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A] max-w-md mx-auto">
              Digite o código individual impresso no seu convite para confirmar a sua presença e dos seus acompanhantes.
            </p>
          </div>

          {/* Pílulas de Códigos de Demonstração Rápida */}
          <div className="mt-8 rounded-2xl border border-dashed border-[#D3B47C]/40 bg-[#D3B47C]/10 p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#D3B47C] uppercase tracking-wider block">
                  Códigos de Teste Rápido (Demonstração):
                </span>
                <p className="text-[0.7rem] text-white/70">Clique em qualquer um para auto-preencher:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectDemoGuest("DUNIA-001")}
                  className="rounded-lg border border-[#D3B47C]/40 bg-black/40 px-2.5 py-1 text-xs font-mono text-[#D3B47C] hover:bg-[#D3B47C] hover:text-[#100E0D] transition"
                >
                  DUNIA-001 (Ana)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoGuest("DUNIA-002")}
                  className="rounded-lg border border-[#D3B47C]/40 bg-black/40 px-2.5 py-1 text-xs font-mono text-[#D3B47C] hover:bg-[#D3B47C] hover:text-[#100E0D] transition"
                >
                  DUNIA-002 (Pedro)
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectDemoGuest("DUNIA-003")}
                  className="rounded-lg border border-[#D3B47C]/40 bg-black/40 px-2.5 py-1 text-xs font-mono text-[#D3B47C] hover:bg-[#D3B47C] hover:text-[#100E0D] transition"
                >
                  DUNIA-003 (Mariana)
                </button>
              </div>
            </div>
          </div>

          {/* FORMULÁRIO */}
          <form
            onSubmit={handleRsvpSubmit}
            className="mt-6 space-y-5 rounded-3xl border border-white/10 bg-[#161311] p-6 sm:p-8 shadow-2xl"
          >
            <div>
              <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                Código do Convite
              </label>
              <input
                type="text"
                required
                value={rsvpCode}
                onChange={(e) => setRsvpCode(e.target.value.toUpperCase())}
                placeholder="Ex: DUNIA-001"
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3.5 font-mono text-base uppercase text-white placeholder-white/20 transition focus:border-[#D3B47C] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[#ABA29A]">
                Confirmação
              </label>
              <select
                value={rsvpStatus}
                onChange={(e) => setRsvpStatus(e.target.value as "confirmed" | "declined")}
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#1C1816] px-4 py-3.5 text-sm text-white transition focus:border-[#D3B47C] focus:outline-none"
              >
                <option value="confirmed">Sim, estarei presente com muita alegria! ✓</option>
                <option value="declined">Infelizmente não poderei comparecer ✕</option>
              </select>
            </div>

            <div>
              <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[#ABA29A]">
                Restrição Alimentar (Buffet Dúnia)
              </label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#1C1816] px-4 py-3 text-sm text-white transition focus:border-[#D3B47C] focus:outline-none"
              >
                <option value="padrao">Nenhuma restrição (Menu Completo)</option>
                <option value="vegetariano">Opção Vegetariana</option>
                <option value="vegano">Opção Vegana</option>
                <option value="sem-gluten">Sem Glúten (Celíaco)</option>
                <option value="sem-lactose">Sem Lactose</option>
              </select>
            </div>

            <div>
              <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[#ABA29A]">
                Mensagem aos Anfitriões (opcional)
              </label>
              <textarea
                value={rsvpMessage}
                onChange={(e) => setRsvpMessage(e.target.value)}
                rows={3}
                placeholder="Deixe uma mensagem especial de carinho aos anfitriões..."
                className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-sm text-white placeholder-white/20 transition focus:border-[#D3B47C] focus:outline-none"
              />
            </div>

            {/* FEEDBACK */}
            {rsvpFeedback && (
              <div
                className={`flex items-start gap-3 rounded-xl p-4 text-xs sm:text-sm ${
                  rsvpFeedback.type === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {rsvpFeedback.type === "success" ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-400" />
                )}
                <span>{rsvpFeedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] py-4 text-xs font-bold uppercase tracking-widest text-[#100E0D] shadow-lg transition hover:scale-[1.01] hover:opacity-95"
            >
              ENVIAR CONFIRMAÇÃO
            </button>
          </form>
        </div>
      </section>

      {/* 8. LISTA DE PRESENTES & COTAS DE LUA DE MEL */}
      <section className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <Gift className="mx-auto mb-3 h-7 w-7 text-[#D3B47C]" />
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
            COTAS DE LUA DE MEL & GENTILEZAS
          </span>
          <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
            Presenteie os Anfitriões
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#ABA29A] max-w-xl mx-auto">
            Sua presença é nossa maior celebração! Caso deseje nos presentear, criamos cotas simbólicas para nossa viagem dos sonhos.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 text-left">
            <div className="rounded-2xl border border-white/10 bg-[#161311] p-4 transition hover:border-[#D3B47C]">
              <span className="text-xl">🥂</span>
              <h4 className="mt-2 text-xs font-bold text-white">Brinde em Paris</h4>
              <p className="text-xs text-[#D3B47C] font-mono mt-1 font-bold">R$ 150,00</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161311] p-4 transition hover:border-[#D3B47C]">
              <span className="text-xl">🎈</span>
              <h4 className="mt-2 text-xs font-bold text-white">Balão na Capadócia</h4>
              <p className="text-xs text-[#D3B47C] font-mono mt-1 font-bold">R$ 350,00</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161311] p-4 transition hover:border-[#D3B47C]">
              <span className="text-xl">🍽️</span>
              <h4 className="mt-2 text-xs font-bold text-white">Jantar à Beira-Mar</h4>
              <p className="text-xs text-[#D3B47C] font-mono mt-1 font-bold">R$ 250,00</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#161311] p-4 transition hover:border-[#D3B47C]">
              <span className="text-xl">🏨</span>
              <h4 className="mt-2 text-xs font-bold text-white">Diária Resort Grécia</h4>
              <p className="text-xs text-[#D3B47C] font-mono mt-1 font-bold">R$ 500,00</p>
            </div>
          </div>

          {/* CHAVE PIX DOS NOIVOS */}
          <div className="mt-8 inline-flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-[#D3B47C]/40 bg-[#D3B47C]/10 p-4">
            <div className="text-xs text-left">
              <span className="font-bold text-[#D3B47C] block uppercase tracking-wider">Chave PIX Oficial:</span>
              <span className="font-mono text-white/90">financeiro@duniacityhall.com.br</span>
            </div>
            <button
              onClick={handleCopyPix}
              className="rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
            >
              {copiedPix ? "Chave Copiada! ✓" : "Copiar Chave PIX"}
            </button>
          </div>
        </div>
      </section>

      {/* 9. ÁLBUM OFICIAL & GALERIA DE FOTOGRAFIAS DO DÚNIA */}
      <section className="relative z-10 border-t border-white/10 bg-[#100E0D] py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              DÚNIA MEMORIES • COBERTURA OFICIAL
            </span>
            <h2 className="mt-2 font-serif text-3xl text-white sm:text-5xl">
              Fragmentos de Uma Noite Única
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#ABA29A]">
              Clique em qualquer imagem para ver em tela cheia os detalhes deste grande momento.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:gap-4">
            {officialGallery.map((foto, idx) => (
              <div
                key={idx}
                onClick={() => setLightboxPhoto(foto.src)}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-black/40 cursor-pointer"
              >
                <Image
                  src={foto.src}
                  alt={foto.caption}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                <div className="absolute bottom-3 left-3 right-3 text-xs opacity-0 group-hover:opacity-100 transition duration-300">
                  <span className="text-[#D3B47C] font-semibold text-[0.7rem] block">{foto.caption}</span>
                  <small className="text-white/60 text-[0.6rem]">Ver em alta resolução ↗</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. RODAPÉ INSTITUCIONAL */}
      <footer className="relative z-10 border-t border-white/10 bg-[#0C0A09] py-14 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <Image
            src="/assets/logo.png"
            alt="Dúnia City Hall"
            width={160}
            height={45}
            className="mx-auto h-9 w-auto object-contain opacity-85"
          />
          <p className="mt-3 font-serif text-sm italic text-[#D3B47C]">
            &ldquo;O lugar onde grandes histórias acontecem.&rdquo;
          </p>
          <p className="mt-1 text-xs text-[#ABA29A]">
            SHIS QI 15 Lote J/K, Lago Sul • Brasília – DF • (61) 3366-2008
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-5 text-xs text-white/50">
            <Link href="/" className="hover:text-white transition">
              Página Principal Dúnia
            </Link>
            <span>•</span>
            <Link href="/evento/fotos" className="hover:text-white transition">
              Enviar Fotos do Evento
            </Link>
            <span>•</span>
            <Link href="/evento/telao" target="_blank" className="hover:text-white transition">
              Telão ao Vivo
            </Link>
            <span>•</span>
            <Link href="/painel" className="hover:text-white transition">
              Painel do Anfitrião
            </Link>
          </div>
        </div>
      </footer>

      {/* MODAL 1: QR CODE EM TELA CHEIA (PARA ESCANEAR DO MONITOR) */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md rounded-3xl border-2 border-[#D3B47C] bg-[#120F0D] p-6 text-center shadow-2xl">
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              aria-label="Fechar modal"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              DÚNIA LIVE MEMORIES
            </span>
            <h3 className="mt-1 font-serif text-2xl text-white">Escanear com Celular</h3>
            <p className="mt-1 text-xs text-[#ABA29A]">
              Aponte a câmera do seu smartphone diretamente para este QR Code:
            </p>

            <div className="mx-auto my-5 w-64 h-64 rounded-2xl bg-white p-3 shadow-lg">
              <img
                src={qrCodeImageUrl}
                alt="QR Code Gigante"
                width={250}
                height={250}
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-[#D3B47C] font-mono break-all px-2">
              {guestUploadUrl}
            </p>

            <div className="mt-5 flex gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 rounded-xl bg-[#D3B47C] py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
              >
                {copiedLink ? "Link Copiado!" : "Copiar Link"}
              </button>
              <Link
                href="/evento/fotos"
                className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition flex items-center justify-center"
              >
                Abrir Envio ↗
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: PRÉ-VISUALIZAÇÃO DE DISPLAY DE MESA PARA IMPRESSÃO */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-[#161311] p-6 sm:p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowPrintModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              ARTE DE IMPRESSÃO
            </span>
            <h3 className="mt-1 font-serif text-2xl text-white">Totem de Mesa para Gráfica</h3>
            <p className="mt-1 text-xs text-[#ABA29A]">
              Modelo pronto para confecção em acrílico 10x15cm para posicionar nas mesas dos convidados.
            </p>

            {/* Cartão de Mesa Simulado */}
            <div className="my-6 mx-auto max-w-xs rounded-2xl border-2 border-[#D3B47C] bg-white p-6 text-[#100E0D] shadow-2xl">
              <div className="border-b border-[#D3B47C]/30 pb-3">
                <span className="font-serif text-sm font-bold tracking-widest text-[#8C6D37] uppercase block">
                  DÚNIA CITY HALL
                </span>
                <span className="text-[0.65rem] text-neutral-500 font-sans tracking-wider uppercase">
                  {event.name}
                </span>
              </div>

              <div className="my-4 mx-auto w-40 h-40 border border-neutral-300 rounded-xl p-1 bg-white">
                <img
                  src={qrCodeImageUrl}
                  alt="QR Code Totem"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>

              <p className="font-serif text-base font-semibold text-[#100E0D]">
                Compartilhe Suas Fotos!
              </p>
              <p className="text-[0.65rem] text-neutral-600 mt-1 leading-snug">
                Aponte a câmera do seu celular e veja suas fotos aparecerem ao vivo no Telão do salão.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
              >
                <Printer className="h-4 w-4" />
                <span>Imprimir Arte</span>
              </button>

              <button
                onClick={() => setShowPrintModal(false)}
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md cursor-pointer animate-fadeIn"
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full h-[75vh]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={lightboxPhoto}
              alt="Foto Dúnia Lightbox"
              fill
              className="object-contain"
            />
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white border border-white/20 hover:bg-white/20 transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
