"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Calendar,
  CalendarDays,
  Layers,
  PlusCircle,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Lock,
  Server,
  Zap,
  SlidersHorizontal,
  ToggleLeft,
  ToggleRight,
  Clock,
  MapPin,
  Users,
  QrCode,
  MessageSquare,
  Gift,
  Camera,
  Tv,
  Music,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit3,
  Trash2,
  Filter,
  Eye,
  Settings2,
  AlertCircle,
  Utensils,
  Wine,
  Phone,
} from "lucide-react"
import {
  getStoredEvents,
  saveStoredEvents,
  createNewEvent,
  updateEvent,
  updateEventModules,
  updateEventOperational,
  setActiveEventId,
  getActiveEventId,
  formatEventDate,
  type DuniaEvent,
  type DuniaEventModules,
  type DuniaEventOperational,
  DEFAULT_EVENT_MODULES,
  DEFAULT_OPERATIONAL_INFO,
  getCommercialMode,
  setCommercialMode,
  type DuniaCommercialMode,
} from "@/lib/dunia-store"

type AdminTab = "overview" | "calendar" | "modules" | "events" | "create" | "catalog" | "operations"

export default function AdminExperienciasPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [events, setEvents] = useState<DuniaEvent[]>([])
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [commercialMode, setCommercialModeState] = useState<DuniaCommercialMode>("full")

  // Seleção de evento para Módulos e Detalhes
  const [selectedEventId, setSelectedEventId] = useState<string>("")

  // Estado da Agenda / Calendário
  const [currentYear, setCurrentYear] = useState(2026)
  const [currentMonth, setCurrentMonth] = useState(10) // 10 = Novembro (0-indexed)
  const [calendarViewMode, setCalendarViewMode] = useState<"month" | "timeline">("month")
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>("2026-11-21")
  const [spaceFilter, setSpaceFilter] = useState<string>("all")

  // Formulário de Criação
  const [newName, setNewName] = useState("")
  const [newDate, setNewDate] = useState("2027-04-18")
  const [newTime, setNewTime] = useState("18:30")
  const [newVenue, setNewVenue] = useState("Salão Imperial")
  const [newPlan, setNewPlan] = useState("Guest OS + Memories")
  const [newTheme, setNewTheme] = useState<"gold" | "rose" | "olive">("gold")
  const [newCategory, setNewCategory] = useState<"Casamento" | "15 Anos" | "Corporativo / Gala" | "Bodas">("Casamento")
  const [newCerimoniaTime, setNewCerimoniaTime] = useState("19:00")
  const [newGuestsExpected, setNewGuestsExpected] = useState(280)
  const [newCerimonial, setNewCerimonial] = useState("Cerimonial Dúnia Excellence")

  // Simulador de receita
  const [calcEvents, setCalcEvents] = useState(12)
  const [calcRate, setCalcRate] = useState(40)
  const [calcTicket, setCalcTicket] = useState(2200)

  useEffect(() => {
    setMounted(true)
    const stored = getStoredEvents()
    setEvents(stored)
    setCommercialModeState(getCommercialMode())
    if (stored.length > 0) {
      setSelectedEventId(stored[0].id)
    }
  }, [])

    const handleToggleCommercialMode = (mode: DuniaCommercialMode) => {
    setCommercialMode(mode)
    setCommercialModeState(mode)
    notify(
      mode === "light"
        ? "Modo Comercial: LIGHT (Apenas Hotsite Institucional. Mini-sites e painéis desativados)."
        : "Modo Comercial: EXPERIENCE OS ATIVO (Mini-sites, Painel dos Noivos e Telão Liberados)!"
    )
  }

  const notify = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }


  const totalEvents = events.length
  const publishedEvents = events.filter((e) => e.status === "Publicado").length

  // Evento selecionado atual
  const currentSelectedEvent = events.find((e) => e.id === selectedEventId) || events[0] || null

  const handleOpenEvent = (id: string, mode: "site" | "panel") => {
    setActiveEventId(id)
    if (mode === "site") {
      window.open("/evento", "_blank")
    } else {
      window.location.href = "/painel"
    }
  }

  const handleSelectEventForModules = (id: string) => {
    setSelectedEventId(id)
    setActiveTab("modules")
  }

  // Toggle individual de módulo
  const handleToggleModule = (moduleKey: keyof DuniaEventModules) => {
    if (!currentSelectedEvent) return
    const currentModules = currentSelectedEvent.modules || DEFAULT_EVENT_MODULES
    const updatedValue = !currentModules[moduleKey]
    const nextModules = { ...currentModules, [moduleKey]: updatedValue }

    updateEventModules(currentSelectedEvent.id, nextModules)
    const refreshed = getStoredEvents()
    setEvents(refreshed)
    notify(`Módulo '${moduleKey}' ${updatedValue ? "ativado" : "desativado"} com sucesso!`)
  }

  // Atualizar parâmetros operacionais do evento
  const handleUpdateOperationalStatus = (
    eventId: string,
    newStatus: "Agendado" | "Confirmado" | "Em Montagem" | "Em Andamento" | "Concluido"
  ) => {
    updateEventOperational(eventId, { statusOperacional: newStatus })
    const refreshed = getStoredEvents()
    setEvents(refreshed)
    notify(`Status operacional atualizado para: ${newStatus}`)
  }

  // Salvar credenciais e limites do evento
  const handleSaveHostSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!currentSelectedEvent) return
    const formData = new FormData(e.currentTarget)
    const accessCode = (formData.get("hostAccessCode") as string) || "DUNIA2026"
    const whatsappQuota = Number(formData.get("whatsappQuota")) || 300
    const maxGuests = Number(formData.get("maxGuests")) || 350

    updateEvent(currentSelectedEvent.id, {
      hostAccessCode: accessCode.trim().toUpperCase(),
      whatsappQuota,
      maxGuests,
    })
    const refreshed = getStoredEvents()
    setEvents(refreshed)
    notify("Configurações e limites do anfitrião salvos com sucesso!")
  }

  const handleCopyHostLink = () => {
    if (typeof window === "undefined" || !currentSelectedEvent) return
    const link = `${window.location.origin}/painel?evento=${currentSelectedEvent.id}&code=${currentSelectedEvent.hostAccessCode || "DUNIA"}`
    navigator.clipboard?.writeText(link)
    notify("Link de acesso exclusivo copiado! Envie aos anfitriões via WhatsApp.")
  }

  // Submissão de novo evento
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newDate) return

    const created = createNewEvent({
      name: newName.trim(),
      date: newDate,
      time: newTime,
      venue: `Dúnia City Hall — ${newVenue}`,
      plan: newPlan,
      theme: newTheme,
      category: newCategory,
      hostAccessCode: newName.trim().substring(0, 4).toUpperCase() + "26",
      maxGuests: newGuestsExpected,
      whatsappQuota: 350,
      modules: { ...DEFAULT_EVENT_MODULES },
      operational: {
        ...DEFAULT_OPERATIONAL_INFO,
  getCommercialMode,
  setCommercialMode,
  type DuniaCommercialMode,
        espaco: newVenue as any,
        tipoEvento: newCategory as any,
        horarioInicio: newTime,
        horarioCerimonia: newCerimoniaTime,
        qtdConvidadosPrevistos: newGuestsExpected,
        cerimonialista: newCerimonial,
      },
    })

    const updated = getStoredEvents()
    setEvents(updated)
    setSelectedEventId(created.id)
    setSelectedCalendarDate(newDate)
    setNewName("")
    notify(`Evento '${created.name}' provisionado e agendado com sucesso!`)
    setActiveTab("calendar")
  }

  // Cálculos do Calendário
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ]

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay() // 0 = Domingo, 1 = Segunda...

  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayNumber: number; isCurrentMonth: boolean; events: DuniaEvent[] }[] = []
    
    // Dias do mês anterior para preencher a primeira semana
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate()
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i
      const m = currentMonth === 0 ? 12 : currentMonth
      const y = currentMonth === 0 ? currentYear - 1 : currentYear
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`
      days.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        events: events.filter((e) => e.date === dateStr),
      })
    }

    // Dias do mês atual
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      let matchedEvents = events.filter((e) => e.date === dateStr)
      if (spaceFilter !== "all") {
        matchedEvents = matchedEvents.filter(
          (e) => e.operational?.espaco === spaceFilter || e.venue.includes(spaceFilter)
        )
      }
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        events: matchedEvents,
      })
    }

    // Completar última semana se necessário
    const remaining = (7 - (days.length % 7)) % 7
    for (let r = 1; r <= remaining; r++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2
      const y = currentMonth === 11 ? currentYear + 1 : currentYear
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(r).padStart(2, "0")}`
      days.push({
        dateStr,
        dayNumber: r,
        isCurrentMonth: false,
        events: events.filter((e) => e.date === dateStr),
      })
    }

    return days
  }, [currentYear, currentMonth, events, spaceFilter, firstDayOfWeek, daysInMonth])

  // Eventos na data selecionada
  const selectedDayEvents = events.filter((e) => e.date === selectedCalendarDate)

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else {
      setCurrentMonth((m) => m - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth((m) => m + 1)
    }
  }

  const handleTodayMonth = () => {
    setCurrentYear(2026)
    setCurrentMonth(10) // Nov 2026
    setSelectedCalendarDate("2026-11-21")
  }

  const calculatedRevenue = (calcEvents * calcRate * calcTicket) / 100

  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-[#0C0A09] text-[#F3EEE6] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-[#D3B47C]/40 bg-[#1A1715]/95 px-5 py-3.5 text-xs font-semibold text-[#D3B47C] shadow-2xl backdrop-blur-xl animate-fadeIn">
          <Sparkles className="h-4 w-4 shrink-0 text-[#D3B47C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar do Salão */}
      <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-white/10 bg-[#100E0D] p-6">
        <div className="space-y-8">
          <Link href="/" className="block">
            <Image
              src="/assets/logo.png"
              alt="Dúnia City Hall"
              width={160}
              height={45}
              className="h-10 w-auto object-contain"
            />
          </Link>

          <div>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
              CONTROLE CENTRAL
            </span>
            <h2 className="mt-1 font-serif text-lg text-white">Dúnia Experience OS</h2>
            <p className="text-xs text-[#ABA29A]">Plataforma Digital de Eventos</p>
          </div>

          <nav className="space-y-1.5">
            {[
              { key: "overview", label: "Visão do Negócio", icon: TrendingUp },
              { key: "calendar", label: "Agenda de Eventos", icon: CalendarDays, badge: `${events.length}` },
              { key: "modules", label: "Módulos do Casal", icon: SlidersHorizontal, highlight: true },
              { key: "events", label: "Eventos & Mini-sites", icon: Layers },
              { key: "create", label: "Criar Mini-site", icon: PlusCircle },
              { key: "catalog", label: "Catálogo & Receita", icon: Sparkles },
              { key: "operations", label: "Operações & LGPD", icon: ShieldCheck },
            ].map(({ key, label, icon: Icon, badge, highlight }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as AdminTab)}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-semibold tracking-wider transition ${
                  activeTab === key
                    ? "bg-[#D3B47C] text-[#100E0D] shadow"
                    : highlight
                    ? "text-amber-200 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20"
                    : "text-[#ABA29A] hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
            {/* Seletor do Modelo Comercial: Full vs Light */}
            <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/60 p-1">
              <button
                onClick={() => handleToggleCommercialMode("full")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  commercialMode === "full"
                    ? "bg-[#D3B47C] text-[#100E0D] font-bold shadow"
                    : "text-[#ABA29A] hover:text-white"
                }`}
                title="Hotsite + Mini-sites + Painel do Casal + Telão Interativo"
              >
                ● Experience OS (Completo)
              </button>
              <button
                onClick={() => handleToggleCommercialMode("light")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  commercialMode === "light"
                    ? "bg-amber-400 text-[#100E0D] font-bold shadow"
                    : "text-[#ABA29A] hover:text-white"
                }`}
                title="Apenas Hotsite Institucional. Mini-sites e Painéis Desativados."
              >
                ○ Modo Light (Apenas Hotsite)
              </button>
            </div>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${
                      activeTab === key ? "bg-black/20 text-[#100E0D]" : "bg-white/10 text-white"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/10">
          <Link
            href="/painel"
            className="flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/80 transition hover:border-[#D3B47C] hover:text-white"
          >
            <span>Painel do Casal</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/admin"
            className="block text-center text-[0.7rem] uppercase tracking-wider text-[#ABA29A] hover:text-white"
          >
            Painel CRM Geral ↗
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-x-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#100E0D]/60 px-10 py-5 backdrop-blur-md">
          <div>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
              DÚNIA EXPERIENCE OS / ADMINISTRAÇÃO
            </span>
            <h1 className="font-serif text-2xl text-white">
              {activeTab === "overview" && "Visão Geral do Negócio"}
              {activeTab === "calendar" && "Agenda Operacional de Eventos — Dúnia City Hall"}
              {activeTab === "modules" && "Configurador de Módulos & Recursos do Anfitrião"}
              {activeTab === "events" && "Inventário de Experiências & Mini-sites"}
              {activeTab === "create" && "Provisionar Novo Mini-site & Experiência"}
              {activeTab === "catalog" && "Catálogo de Produtos Digitais & Simulador"}
              {activeTab === "operations" && "Arquitetura Operacional, Segurança & LGPD"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {activeTab !== "create" && (
              <button
                onClick={() => setActiveTab("create")}
                className="flex items-center gap-2 rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:opacity-90"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Novo Evento</span>
              </button>
            )}
          </div>
        </header>

        {/* Tab Content */}
        <main className="flex-1 p-10">
          {/* ========================================================= */}
          {/* TAB: CALENDAR (AGENDA DE EVENTOS) */}
          {/* ========================================================= */}
          {activeTab === "calendar" && (
            <div className="space-y-6 animate-fadeIn">
              {/* Barra de Controles da Agenda */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/10 bg-[#161311] p-5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/40 p-1">
                    <button
                      onClick={handlePrevMonth}
                      className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
                      title="Mês anterior"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="min-w-[170px] text-center font-serif text-lg font-light text-white">
                      {monthNames[currentMonth]} {currentYear}
                    </span>
                    <button
                      onClick={handleNextMonth}
                      className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white transition"
                      title="Próximo mês"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleTodayMonth}
                    className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10"
                  >
                    Hoje
                  </button>
                </div>

                {/* Filtros de Espaço e Visualização */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-3.5 w-3.5 text-[#D3B47C]" />
                    <span className="text-xs text-[#ABA29A]">Espaço:</span>
                    <select
                      value={spaceFilter}
                      onChange={(e) => setSpaceFilter(e.target.value)}
                      className="rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                    >
                      <option value="all">Todos os Espaços</option>
                      <option value="Salão Imperial">Salão Imperial</option>
                      <option value="Espaço Cristal">Espaço Cristal</option>
                      <option value="Jardim Imperial">Jardim Imperial</option>
                      <option value="Lounge Nobre">Lounge Nobre</option>
                    </select>
                  </div>

                  <div className="flex rounded-xl border border-white/15 bg-black/40 p-1">
                    <button
                      onClick={() => setCalendarViewMode("month")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        calendarViewMode === "month"
                          ? "bg-[#D3B47C] text-[#100E0D]"
                          : "text-[#ABA29A] hover:text-white"
                      }`}
                    >
                      Mês (Grade)
                    </button>
                    <button
                      onClick={() => setCalendarViewMode("timeline")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        calendarViewMode === "timeline"
                          ? "bg-[#D3B47C] text-[#100E0D]"
                          : "text-[#ABA29A] hover:text-white"
                      }`}
                    >
                      Linha do Tempo
                    </button>
                  </div>
                </div>
              </div>

              {/* MODO GRADE MENSAL */}
              {calendarViewMode === "month" && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  {/* Grade dos Dias */}
                  <div className="xl:col-span-8 rounded-2xl border border-white/10 bg-[#161311] p-6 shadow-xl">
                    {/* Cabeçalho dos Dias da Semana */}
                    <div className="grid grid-cols-7 gap-2 pb-3 border-b border-white/10 text-center text-[0.7rem] font-bold uppercase tracking-wider text-[#D3B47C]">
                      <span>Dom</span>
                      <span>Seg</span>
                      <span>Ter</span>
                      <span>Qua</span>
                      <span>Qui</span>
                      <span>Sex</span>
                      <span>Sáb</span>
                    </div>

                    {/* Grade de Células */}
                    <div className="mt-3 grid grid-cols-7 gap-2">
                      {calendarDays.map((day, idx) => {
                        const isSelected = day.dateStr === selectedCalendarDate
                        const hasEvents = day.events.length > 0

                        return (
                          <div
                            key={idx}
                            onClick={() => setSelectedCalendarDate(day.dateStr)}
                            className={`min-h-[96px] rounded-xl p-2 cursor-pointer transition flex flex-col justify-between border ${
                              isSelected
                                ? "border-[#D3B47C] bg-[#D3B47C]/15 ring-1 ring-[#D3B47C]"
                                : hasEvents
                                ? "border-white/15 bg-white/[0.04] hover:bg-white/[0.07]"
                                : day.isCurrentMonth
                                ? "border-white/5 bg-black/20 hover:bg-white/[0.02]"
                                : "border-transparent bg-transparent opacity-30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-xs font-mono font-bold ${
                                  isSelected
                                    ? "text-[#D3B47C]"
                                    : hasEvents
                                    ? "text-white"
                                    : "text-[#ABA29A]"
                                }`}
                              >
                                {day.dayNumber}
                              </span>
                              {hasEvents && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#D3B47C]" />
                              )}
                            </div>

                            {/* Mini-cards de eventos no dia */}
                            <div className="space-y-1 mt-1">
                              {day.events.slice(0, 2).map((ev) => (
                                <div
                                  key={ev.id}
                                  className={`truncate rounded px-1.5 py-0.5 text-[0.62rem] font-semibold ${
                                    ev.category === "15 Anos"
                                      ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                                      : ev.category === "Corporativo / Gala"
                                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                      : "bg-[#D3B47C]/20 text-[#D3B47C] border border-[#D3B47C]/30"
                                  }`}
                                  title={`${ev.name} (${ev.time})`}
                                >
                                  {ev.name}
                                </div>
                              ))}
                              {day.events.length > 2 && (
                                <span className="block text-[0.58rem] text-white/50">
                                  +{day.events.length - 2} mais
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Detalhes do Dia Selecionado */}
                  <div className="xl:col-span-4 rounded-2xl border border-white/10 bg-[#161311] p-6 flex flex-col justify-between shadow-xl">
                    <div>
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                            PAINEL OPERACIONAL DA DATA
                          </span>
                          <h3 className="font-serif text-xl text-white mt-1">
                            {formatEventDate(selectedCalendarDate)}
                          </h3>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-mono text-white">
                          {selectedDayEvents.length} {selectedDayEvents.length === 1 ? "Evento" : "Eventos"}
                        </span>
                      </div>

                      {/* Lista de eventos na data */}
                      <div className="mt-5 space-y-4">
                        {selectedDayEvents.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-8 text-center text-[#ABA29A]">
                            <Calendar className="h-8 w-8 mx-auto text-white/20 mb-2" />
                            <p className="text-sm font-semibold text-white/60">Salão Disponível nesta data</p>
                            <p className="text-xs text-[#ABA29A] mt-1">
                              Nenhum evento agendado para o dia selecionado.
                            </p>
                            <button
                              onClick={() => {
                                setNewDate(selectedCalendarDate)
                                setActiveTab("create")
                              }}
                              className="mt-4 rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90"
                            >
                              + Agendar para esta data
                            </button>
                          </div>
                        ) : (
                          selectedDayEvents.map((ev) => {
                            const op = ev.operational || DEFAULT_OPERATIONAL_INFO

                            return (
                              <div
                                key={ev.id}
                                className="rounded-2xl border border-white/15 bg-black/40 p-4 space-y-3"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <span
                                      className={`inline-block rounded px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider ${
                                        ev.category === "15 Anos"
                                          ? "bg-fuchsia-500/20 text-fuchsia-300"
                                          : ev.category === "Corporativo / Gala"
                                          ? "bg-emerald-500/20 text-emerald-300"
                                          : "bg-[#D3B47C]/20 text-[#D3B47C]"
                                      }`}
                                    >
                                      {ev.category || "Casamento"}
                                    </span>
                                    <h4 className="font-serif text-lg text-white mt-1">{ev.name}</h4>
                                    <p className="text-xs text-[#ABA29A] flex items-center gap-1 mt-0.5">
                                      <MapPin className="h-3 w-3 text-[#D3B47C]" />
                                      {op.espaco}
                                    </p>
                                  </div>

                                  <select
                                    value={op.statusOperacional}
                                    onChange={(e) =>
                                      handleUpdateOperationalStatus(ev.id, e.target.value as any)
                                    }
                                    className="rounded-lg border border-white/20 bg-[#1C1816] px-2 py-1 text-[0.65rem] font-bold text-white focus:outline-none"
                                  >
                                    <option value="Agendado">Agendado</option>
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="Em Montagem">Em Montagem</option>
                                    <option value="Em Andamento">Em Andamento</option>
                                    <option value="Concluido">Concluído</option>
                                  </select>
                                </div>

                                {/* Grade de Horários */}
                                <div className="grid grid-cols-3 gap-2 rounded-xl bg-white/[0.02] p-2.5 text-center text-[0.65rem] border border-white/5">
                                  <div>
                                    <span className="text-[#ABA29A] block">Montagem</span>
                                    <strong className="text-white font-mono">{op.horarioMontagem}</strong>
                                  </div>
                                  <div>
                                    <span className="text-[#ABA29A] block">Cerimônia/Início</span>
                                    <strong className="text-[#D3B47C] font-mono">{op.horarioInicio}</strong>
                                  </div>
                                  <div>
                                    <span className="text-[#ABA29A] block">Término</span>
                                    <strong className="text-white font-mono">{op.horarioTermino}</strong>
                                  </div>
                                </div>

                                {/* Fornecedores e Equipe */}
                                <div className="space-y-1 text-xs text-[#ABA29A] pt-1">
                                  <div className="flex items-center justify-between">
                                    <span>Buffet:</span>
                                    <strong className="text-white/80 font-normal truncate max-w-[200px]">
                                      {op.buffetResponsavel}
                                    </strong>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Cerimonial:</span>
                                    <strong className="text-white/80 font-normal">{op.cerimonialista}</strong>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Decoração:</span>
                                    <strong className="text-white/80 font-normal">{op.decorador}</strong>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span>Convidados:</span>
                                    <strong className="text-[#D3B47C] font-mono">
                                      {op.qtdConvidadosPrevistos} previstos
                                    </strong>
                                  </div>
                                </div>

                                {/* Ações do Evento */}
                                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                  <button
                                    onClick={() => handleSelectEventForModules(ev.id)}
                                    className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-[#D3B47C] py-2 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
                                  >
                                    <SlidersHorizontal className="h-3.5 w-3.5" />
                                    <span>Módulos</span>
                                  </button>
                                  <button
                                    onClick={() => handleOpenEvent(ev.id, "site")}
                                    className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                                    title="Abrir Mini-site"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEvent(ev.id, "panel")}
                                    className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                                    title="Abrir Painel do Casal"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 text-center">
                      <p className="text-[0.65rem] text-[#ABA29A]">
                        Horário limite de desmontagem no Dúnia: <strong>07:30 da manhã seguinte</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* MODO LINHA DO TEMPO */}
              {calendarViewMode === "timeline" && (
                <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 space-y-4 shadow-xl">
                  <h3 className="font-serif text-xl text-white">Cronograma Completo de Celebrações</h3>
                  <div className="divide-y divide-white/5">
                    {events.map((ev) => {
                      const op = ev.operational || DEFAULT_OPERATIONAL_INFO

                      return (
                        <div
                          key={ev.id}
                          className="py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 transition hover:bg-white/[0.01]"
                        >
                          <div className="flex items-start gap-4">
                            <div className="rounded-xl border border-[#D3B47C]/30 bg-[#D3B47C]/10 p-3 text-center min-w-[70px]">
                              <span className="block text-[0.65rem] uppercase font-bold text-[#D3B47C]">
                                {ev.date.split("-")[1]}/{ev.date.split("-")[0]}
                              </span>
                              <strong className="block font-serif text-2xl text-white">
                                {ev.date.split("-")[2]}
                              </strong>
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif text-lg text-white">{ev.name}</h4>
                                <span className="rounded bg-white/10 px-2 py-0.5 text-[0.6rem] font-bold text-[#D3B47C]">
                                  {op.espaco}
                                </span>
                              </div>
                              <p className="text-xs text-[#ABA29A] mt-0.5">
                                Cerimonial: {op.cerimonialista} · Buffet: {op.buffetResponsavel} · {op.qtdConvidadosPrevistos} convidados
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400">
                              {op.statusOperacional}
                            </span>
                            <button
                              onClick={() => handleSelectEventForModules(ev.id)}
                              className="rounded-xl bg-[#D3B47C] px-3.5 py-2 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90"
                            >
                              Configurar Módulos
                            </button>
                            <button
                              onClick={() => handleOpenEvent(ev.id, "panel")}
                              className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                            >
                              Painel Casal ↗
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: MODULES (CONFIGURADOR DE MÓDULOS DO ANFITRIÃO) */}
          {/* ========================================================= */}
          {activeTab === "modules" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Seletor de Evento */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 shadow-xl">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                      PERSONALIZAÇÃO POR ANFITRIÃO
                    </span>
                    <h3 className="font-serif text-2xl text-white mt-1">
                      Selecione o Evento para Gerenciar Recursos
                    </h3>
                    <p className="text-xs text-[#ABA29A] mt-1">
                      Ative ou desative módulos individuais para o painel do casal no Dúnia City Hall.
                    </p>
                  </div>

                  <div className="min-w-[280px]">
                    <label className="block text-[0.65rem] uppercase font-bold text-[#ABA29A] mb-1.5">
                      Evento Selecionado:
                    </label>
                    <select
                      value={selectedEventId}
                      onChange={(e) => setSelectedEventId(e.target.value)}
                      className="w-full rounded-xl border border-[#D3B47C]/40 bg-[#1C1816] px-4 py-2.5 text-sm font-semibold text-white focus:border-[#D3B47C] focus:outline-none"
                    >
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.name} — {formatEventDate(ev.date)} ({ev.plan})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Banner do Evento Ativo */}
                {currentSelectedEvent && (
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#D3B47C]/20 bg-[#D3B47C]/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-[#D3B47C]/20 p-2 text-[#D3B47C]">
                        <SlidersHorizontal className="h-5 w-5" />
                      </div>
                      <div>
                        <strong className="block text-white text-base font-serif">
                          {currentSelectedEvent.name}
                        </strong>
                        <span className="text-xs text-[#ABA29A]">
                          Plano: <span className="text-[#D3B47C] font-semibold">{currentSelectedEvent.plan}</span> · Tema: {currentSelectedEvent.theme} · Código de Acesso: <code className="text-emerald-400 font-mono">{currentSelectedEvent.hostAccessCode || "DUNIA26"}</code>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyHostLink}
                        className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition"
                      >
                        <Copy className="h-3.5 w-3.5 text-[#D3B47C]" />
                        <span>Copiar Link dos Noivos</span>
                      </button>
                      <button
                        onClick={() => handleOpenEvent(currentSelectedEvent.id, "panel")}
                        className="flex items-center gap-1.5 rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Abrir Painel Deste Evento</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Grade de Módulos Modulares */}
              {currentSelectedEvent && (
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Coluna 1: Módulos de Comunicação & Convidados */}
                  <div className="space-y-4">
                    <h4 className="font-serif text-lg text-white flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-[#D3B47C]" />
                      <span>Comunicação, Convidados & RSVP</span>
                    </h4>

                    {/* Módulo WhatsApp */}
                    <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 transition hover:border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20">
                            <MessageSquare className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-sm text-white">Automação de Convites & WhatsApp</strong>
                              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-300">
                                Alta Conversão
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                              Disparos personalizados 1-clique com link direto de confirmação ({`{link_rsvp}`}), gerador de códigos VIP e disparo em lote.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleModule("rsvpWhatsApp")}
                          className="shrink-0 text-[#D3B47C] hover:opacity-80 transition"
                          title="Ligar/Desligar módulo"
                        >
                          {(currentSelectedEvent.modules?.rsvpWhatsApp ?? true) ? (
                            <ToggleRight className="h-8 w-8 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-8 w-8 text-white/30" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Módulo Portaria & Check-in */}
                    <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 transition hover:border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-sky-500/10 p-2.5 text-sky-400 border border-sky-500/20">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-sm text-white">Portaria & Check-in Anti-Duplicidade</strong>
                              <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[0.6rem] font-bold text-sky-300">
                                Segurança Dúnia
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                              Recepção escaneia QR Code ou digita código na entrada. Bloqueia tentativas de duplicidade e penetras no salão.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleModule("receptionCheckin")}
                          className="shrink-0 text-[#D3B47C] hover:opacity-80 transition"
                        >
                          {(currentSelectedEvent.modules?.receptionCheckin ?? true) ? (
                            <ToggleRight className="h-8 w-8 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-8 w-8 text-white/30" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Módulo Totem / Display de Mesa */}
                    <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 transition hover:border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/20">
                            <QrCode className="h-5 w-5" />
                          </div>
                          <div>
                            <strong className="text-sm text-white">Display & Totem de Mesa com QR Code</strong>
                            <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                              Gerador de cartões de mesa elegantes para impressão em acrílico, permitindo que os convidados subam fotos direto da mesa.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleModule("tableQrCode")}
                          className="shrink-0 text-[#D3B47C] hover:opacity-80 transition"
                        >
                          {(currentSelectedEvent.modules?.tableQrCode ?? true) ? (
                            <ToggleRight className="h-8 w-8 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-8 w-8 text-white/30" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Módulo Save the Date */}
                    <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 transition hover:border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-rose-500/10 p-2.5 text-rose-400 border border-rose-500/20">
                            <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                            <strong className="text-sm text-white">Lembrete & Save the Date Antecipado</strong>
                            <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                              Permite aos anfitriões dispararem aviso formal até 12 meses antes para reserva de agenda na capital.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleModule("saveTheDate")}
                          className="shrink-0 text-[#D3B47C] hover:opacity-80 transition"
                        >
                          {(currentSelectedEvent.modules?.saveTheDate ?? true) ? (
                            <ToggleRight className="h-8 w-8 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-8 w-8 text-white/30" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Coluna 2: Módulos de Experiência & Salão */}
                  <div className="space-y-4">
                    <h4 className="font-serif text-lg text-white flex items-center gap-2">
                      <Tv className="h-4 w-4 text-[#D3B47C]" />
                      <span>Experiência no Salão & Multimídia</span>
                    </h4>

                    {/* Módulo Telão Interativo */}
                    <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 transition hover:border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-[#D3B47C]/10 p-2.5 text-[#D3B47C] border border-[#D3B47C]/20">
                            <Tv className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <strong className="text-sm text-white">Telão Interativo (Dúnia Memories)</strong>
                              <span className="rounded bg-[#D3B47C]/20 px-2 py-0.5 text-[0.6rem] font-bold text-[#D3B47C]">
                                Experiência 360°
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                              Exibição ao vivo no telão do salão com transições Ken Burns, seleção de trilha sonora, volume e aprovação instantânea de fotos.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleModule("liveTelao")}
                          className="shrink-0 text-[#D3B47C] hover:opacity-80 transition"
                        >
                          {(currentSelectedEvent.modules?.liveTelao ?? true) ? (
                            <ToggleRight className="h-8 w-8 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-8 w-8 text-white/30" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Módulo Álbum dos Convidados */}
                    <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 transition hover:border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-purple-500/10 p-2.5 text-purple-400 border border-purple-500/20">
                            <Camera className="h-5 w-5" />
                          </div>
                          <div>
                            <strong className="text-sm text-white">Álbum Colaborativo de Memórias</strong>
                            <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                              Área exclusiva onde convidados sobem fotos da festa, mensagens de carinho e baixam em alta definição pós-evento.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleModule("guestAlbum")}
                          className="shrink-0 text-[#D3B47C] hover:opacity-80 transition"
                        >
                          {(currentSelectedEvent.modules?.guestAlbum ?? true) ? (
                            <ToggleRight className="h-8 w-8 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-8 w-8 text-white/30" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Módulo Presentes com Pix */}
                    <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 transition hover:border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20">
                            <Gift className="h-5 w-5" />
                          </div>
                          <div>
                            <strong className="text-sm text-white">Lista de Presentes com Chave Pix</strong>
                            <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                              Permite ao casal cadastrar cotas de lua de mel ou presentes simbólicos com recebimento 100% direto na conta bancária via Pix.
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleModule("giftListPix")}
                          className="shrink-0 text-[#D3B47C] hover:opacity-80 transition"
                        >
                          {(currentSelectedEvent.modules?.giftListPix ?? true) ? (
                            <ToggleRight className="h-8 w-8 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-8 w-8 text-white/30" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Módulo Cronograma */}
                    <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 transition hover:border-white/20">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="rounded-xl bg-amber-500/10 p-2.5 text-amber-400 border border-amber-500/20">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <strong className="text-sm text-white">Cronograma & Roteiro dos Noivos</strong>
                            <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                              Timeline do evento para cerimonial e anfitriões (Entrada, Valsa, Brinde, Jantar, Pista de Dança).
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleModule("schedule")}
                          className="shrink-0 text-[#D3B47C] hover:opacity-80 transition"
                        >
                          {(currentSelectedEvent.modules?.schedule ?? true) ? (
                            <ToggleRight className="h-8 w-8 text-emerald-400" />
                          ) : (
                            <ToggleLeft className="h-8 w-8 text-white/30" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Limites e Credenciais do Anfitrião */}
              {currentSelectedEvent && (
                <div className="rounded-2xl border border-white/10 bg-[#161311] p-8 shadow-xl">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                    GOVERNANÇA & TRAVAS COMERCIAIS
                  </span>
                  <h4 className="font-serif text-2xl text-white mt-1">Limites & Acesso do Anfitrião</h4>
                  <p className="text-xs text-[#ABA29A] mt-1">
                    Defina cotas contratuais para evitar sobrecarga e manter a governança do salão.
                  </p>

                  <form onSubmit={handleSaveHostSettings} className="mt-6 grid gap-6 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                        Código de Acesso do Casal
                      </label>
                      <input
                        type="text"
                        name="hostAccessCode"
                        defaultValue={currentSelectedEvent.hostAccessCode || "DUNIA26"}
                        className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm font-mono uppercase text-[#D3B47C] focus:border-[#D3B47C] focus:outline-none"
                        required
                      />
                      <small className="text-[0.65rem] text-[#ABA29A] mt-1 block">
                        Senha para o anfitrião entrar no `/painel`
                      </small>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                        Cota de Disparos WhatsApp
                      </label>
                      <select
                        name="whatsappQuota"
                        defaultValue={currentSelectedEvent.whatsappQuota || 350}
                        className="mt-2 w-full rounded-xl border border-white/15 bg-[#1C1816] px-4 py-2.5 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                      >
                        <option value={150}>150 mensagens (Pacote Básico)</option>
                        <option value={350}>350 mensagens (Padrão Casamento)</option>
                        <option value={600}>600 mensagens (Grandes Eventos)</option>
                        <option value={1000}>1.000 mensagens (Corporativo/Gala)</option>
                      </select>
                      <small className="text-[0.65rem] text-[#ABA29A] mt-1 block">
                        Limite de envios permitidos neste workspace
                      </small>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                        Capacidade Máxima de Convidados
                      </label>
                      <input
                        type="number"
                        name="maxGuests"
                        min={50}
                        max={1200}
                        defaultValue={currentSelectedEvent.maxGuests || 350}
                        className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white font-mono focus:border-[#D3B47C] focus:outline-none"
                        required
                      />
                      <small className="text-[0.65rem] text-[#ABA29A] mt-1 block">
                        Bloqueia cadastros acima da lotação contratada
                      </small>
                    </div>

                    <div className="sm:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="flex items-center gap-2 rounded-xl bg-[#D3B47C] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:opacity-90"
                      >
                        <Check className="h-4 w-4" />
                        <span>Salvar Configurações do Anfitrião</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 1: VISÃO GERAL */}
          {/* ========================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Cards de Métricas */}
              <div className="grid grid-cols-4 gap-6">
                <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">Eventos Cadastrados</span>
                  <div className="mt-2 font-serif text-4xl text-white">{totalEvents}</div>
                  <small className="mt-1 block text-xs text-[#ABA29A]">Total na plataforma</small>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Mini-sites Publicados</span>
                  <div className="mt-2 font-serif text-4xl text-white">{publishedEvents}</div>
                  <small className="mt-1 block text-xs text-emerald-300">Páginas ativas online</small>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Workspaces Ativos</span>
                  <div className="mt-2 font-serif text-4xl text-white">{totalEvents}</div>
                  <small className="mt-1 block text-xs text-amber-300">Painéis de casais/anfitriões</small>
                </div>

                <div className="rounded-2xl border border-[#D3B47C]/20 bg-[#D3B47C]/[0.04] p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D3B47C]">Produtos Digitais</span>
                  <div className="mt-2 font-serif text-4xl text-white">3</div>
                  <small className="mt-1 block text-xs text-[#D3B47C]">Invite · Guest OS · Memories</small>
                </div>
              </div>

              {/* Últimos Eventos */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-serif text-lg text-white">Celebrações em Destaque na Agenda</h3>
                  <button onClick={() => setActiveTab("calendar")} className="text-xs font-semibold text-[#D3B47C] hover:underline">
                    Abrir Agenda Completa →
                  </button>
                </div>

                <div className="mt-6 space-y-3">
                  {events.slice(0, 4).map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:bg-white/[0.04]"
                    >
                      <div>
                        <strong className="block text-base text-white">{e.name}</strong>
                        <span className="text-xs text-[#ABA29A]">
                          {formatEventDate(e.date)} · {e.operational?.espaco || e.venue} · Plano: {e.plan}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSelectEventForModules(e.id)}
                          className="rounded-lg border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3 py-1.5 text-xs font-semibold text-[#D3B47C] transition hover:bg-[#D3B47C] hover:text-[#100E0D]"
                        >
                          MÓDULOS
                        </button>
                        <button
                          onClick={() => handleOpenEvent(e.id, "site")}
                          className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[#D3B47C]"
                        >
                          MINI-SITE
                        </button>
                        <button
                          onClick={() => handleOpenEvent(e.id, "panel")}
                          className="rounded-lg bg-[#D3B47C] px-3 py-1.5 text-xs font-bold text-[#100E0D] transition hover:bg-[#D3B47C]/90"
                        >
                          PAINEL CASAL
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: EVENTOS & MINI-SITES */}
          {/* ========================================================= */}
          {activeTab === "events" && (
            <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-serif text-xl text-white">Inventário de Eventos & Workspaces</h3>
                  <p className="text-xs text-[#ABA29A]">Gerencie todos os mini-sites e acessos do salão</p>
                </div>
                <button
                  onClick={() => setActiveTab("create")}
                  className="rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold text-[#100E0D]"
                >
                  + Novo Evento
                </button>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-[0.7rem] uppercase tracking-wider text-[#ABA29A]">
                      <th className="pb-3">Celebração / Salão</th>
                      <th className="pb-3">Data & Espaço</th>
                      <th className="pb-3">Plano Contratado</th>
                      <th className="pb-3">Módulos Ativos</th>
                      <th className="pb-3">Status Operacional</th>
                      <th className="pb-3 text-right">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.map((e) => {
                      const op = e.operational || DEFAULT_OPERATIONAL_INFO
                      const mod = e.modules || DEFAULT_EVENT_MODULES
                      const activeModulesCount = Object.values(mod).filter(Boolean).length

                      return (
                        <tr key={e.id} className="transition hover:bg-white/[0.02]">
                          <td className="py-4">
                            <strong className="block text-white">{e.name}</strong>
                            <span className="text-xs text-[#ABA29A]">{e.category || "Casamento"}</span>
                          </td>
                          <td className="py-4">
                            <span className="block text-white/90">{formatEventDate(e.date)}</span>
                            <span className="text-xs text-[#D3B47C]">{op.espaco}</span>
                          </td>
                          <td className="py-4">
                            <span className="rounded-lg border border-[#D3B47C]/30 bg-[#D3B47C]/10 px-2.5 py-1 text-xs text-[#D3B47C]">
                              {e.plan}
                            </span>
                          </td>
                          <td className="py-4">
                            <button
                              onClick={() => handleSelectEventForModules(e.id)}
                              className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white hover:bg-[#D3B47C] hover:text-[#100E0D] transition"
                            >
                              <SlidersHorizontal className="h-3 w-3" />
                              <span>{activeModulesCount}/9 ativos</span>
                            </button>
                          </td>
                          <td className="py-4">
                            <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-emerald-300">
                              {op.statusOperacional}
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleSelectEventForModules(e.id)}
                                className="rounded-lg border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3 py-1.5 text-xs font-semibold text-[#D3B47C] transition hover:bg-[#D3B47C] hover:text-[#100E0D]"
                              >
                                MÓDULOS
                              </button>
                              <button
                                onClick={() => handleOpenEvent(e.id, "site")}
                                className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-[#D3B47C]"
                              >
                                MINI-SITE
                              </button>
                              <button
                                onClick={() => handleOpenEvent(e.id, "panel")}
                                className="rounded-lg bg-[#D3B47C] px-3 py-1.5 text-xs font-bold text-[#100E0D] transition hover:bg-[#D3B47C]/90"
                              >
                                PAINEL CASAL
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CRIAR MINI-SITE */}
          {/* ========================================================= */}
          {activeTab === "create" && (
            <div className="max-w-3xl rounded-2xl border border-white/10 bg-[#161311] p-8 animate-fadeIn">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                PROVISIONAMENTO INSTANTÂNEO & AGENDAMENTO
              </span>
              <h3 className="mt-1 font-serif text-3xl text-white">Criar Novo Mini-site & Experiência</h3>
              <p className="mt-2 text-xs text-[#ABA29A]">
                Provisione uma nova experiência digital para o anfitrião com endereço exclusivo, controle de convidados, módulos contratados e agenda operacional integrada.
              </p>

              <form onSubmit={handleCreateSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Nomes da Celebração
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Ex: Beatriz & Felipe ou 15 Anos Yasmin"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Tipo de Celebração
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-[#1C1816] px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                    >
                      <option value="Casamento">Casamento</option>
                      <option value="15 Anos">15 Anos (Debutante)</option>
                      <option value="Corporativo / Gala">Corporativo / Gala</option>
                      <option value="Bodas">Bodas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Data do Evento
                    </label>
                    <input
                      type="date"
                      value={newDate}
                      onChange={(e) => setNewDate(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Horário Recepção
                    </label>
                    <input
                      type="text"
                      value={newTime}
                      onChange={(e) => setNewTime(e.target.value)}
                      placeholder="18:30"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Horário Cerimônia
                    </label>
                    <input
                      type="text"
                      value={newCerimoniaTime}
                      onChange={(e) => setNewCerimoniaTime(e.target.value)}
                      placeholder="19:00"
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Espaço no Dúnia City Hall
                    </label>
                    <select
                      value={newVenue}
                      onChange={(e) => setNewVenue(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-[#1C1816] px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                    >
                      <option value="Salão Imperial">Salão Imperial (Lago Sul)</option>
                      <option value="Espaço Cristal">Espaço Cristal</option>
                      <option value="Jardim Imperial">Jardim Imperial</option>
                      <option value="Lounge Nobre">Lounge Nobre</option>
                      <option value="Todos os Espaços">Todos os Espaços (Exclusividade Total)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Convidados Previstos
                    </label>
                    <input
                      type="number"
                      value={newGuestsExpected}
                      onChange={(e) => setNewGuestsExpected(Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Plano Digital Contratado
                    </label>
                    <select
                      value={newPlan}
                      onChange={(e) => setNewPlan(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-[#1C1816] px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                    >
                      <option value="Dúnia Invite">Dúnia Invite (R$ 800)</option>
                      <option value="Guest OS">Guest OS Completo (R$ 1.800)</option>
                      <option value="Guest OS + Memories">Guest OS + Memories (R$ 2.400)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Tema Cromático
                    </label>
                    <select
                      value={newTheme}
                      onChange={(e) => setNewTheme(e.target.value as any)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-[#1C1816] px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                    >
                      <option value="gold">Ouro Champagne (Dourado clássico)</option>
                      <option value="rose">Rosé Gold (Debutantes e romântico)</option>
                      <option value="olive">Oliva Imperial (Diplomático e botânico)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#D3B47C] py-4 text-xs font-bold uppercase tracking-widest text-[#100E0D] shadow transition hover:opacity-90"
                >
                  PROVISIONAR MINI-SITE & AGENDAR NO CALENDÁRIO
                </button>
              </form>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB: CATÁLOGO & SIMULADOR */}
          {/* ========================================================= */}
          {activeTab === "catalog" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Produtos Digitais do Salão */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">PLANO BÁSICO</span>
                  <h4 className="mt-2 font-serif text-2xl text-white">Dúnia Invite</h4>
                  <div className="mt-3 font-serif text-3xl font-light text-white">R$ 800</div>
                  <ul className="mt-6 space-y-2.5 text-xs text-[#ABA29A]">
                    <li>✓ Mini-site com fotos dos anfitriões</li>
                    <li>✓ Contagem regressiva em tempo real</li>
                    <li>✓ Endereço e mapa para convidados</li>
                    <li>✓ Informações de traje e horários</li>
                  </ul>
                </div>

                <div className="rounded-2xl border-2 border-[#D3B47C] bg-gradient-to-b from-[#1C1816] to-[#12100E] p-6 shadow-2xl">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">O MAIS VENDIDO</span>
                  <h4 className="mt-2 font-serif text-2xl text-white">Dúnia Guest OS</h4>
                  <div className="mt-3 font-serif text-3xl font-light text-white">R$ 1.800</div>
                  <ul className="mt-6 space-y-2.5 text-xs text-[#ABA29A]">
                    <li>✓ Tudo do plano Invite</li>
                    <li>✓ <strong>RSVP individual por código</strong></li>
                    <li>✓ <strong>Convite digital com QR Code</strong></li>
                    <li>✓ Painel do casal para gestão de convidados</li>
                    <li>✓ Controle de portaria com bloqueio de duplicidade</li>
                    <li>✓ Exportação de relatórios em CSV</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">EXPERIÊNCIA COMPLETA</span>
                  <h4 className="mt-2 font-serif text-2xl text-white">Dúnia Memories</h4>
                  <div className="mt-3 font-serif text-3xl font-light text-white">R$ 2.400</div>
                  <ul className="mt-6 space-y-2.5 text-xs text-[#ABA29A]">
                    <li>✓ Tudo do plano Guest OS</li>
                    <li>✓ Álbum digital pós-evento para convidados</li>
                    <li>✓ Download de memórias em alta resolução</li>
                    <li>✓ Prazo de exibição configurável (até 90 dias)</li>
                    <li>✓ Moderação de fotos pela equipe do salão</li>
                  </ul>
                </div>
              </div>

              {/* Simulador de Rentabilidade para o Salão */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-8">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                  RECEITA DO SALÃO
                </span>
                <h3 className="font-serif text-3xl text-white">Simulador Comercial</h3>
                <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-center">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-white">
                        <span>Eventos realizados por mês no Dúnia</span>
                        <span className="text-[#D3B47C]">{calcEvents} eventos</span>
                      </div>
                      <input
                        type="range"
                        min={2}
                        max={30}
                        value={calcEvents}
                        onChange={(e) => setCalcEvents(Number(e.target.value))}
                        className="mt-2 w-full accent-[#D3B47C]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-white">
                        <span>Taxa de adesão dos anfitriões ao produto</span>
                        <span className="text-[#D3B47C]">{calcRate}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        step={5}
                        value={calcRate}
                        onChange={(e) => setCalcRate(Number(e.target.value))}
                        className="mt-2 w-full accent-[#D3B47C]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-white">
                        <span>Ticket médio contratado</span>
                        <span className="text-[#D3B47C]">
                          {calcTicket.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={800}
                        max={4000}
                        step={100}
                        value={calcTicket}
                        onChange={(e) => setCalcTicket(Number(e.target.value))}
                        className="mt-2 w-full accent-[#D3B47C]"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#D3B47C]/30 bg-black/60 p-8 text-center">
                    <span className="text-xs uppercase tracking-widest text-[#D3B47C]">
                      LUCRO ADICIONAL ESTIMADO (MENSAL)
                    </span>
                    <div className="mt-4 font-serif text-5xl text-white">
                      {calculatedRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 })}
                    </div>
                    <p className="mt-2 text-xs text-[#ABA29A]">
                      Potencial anualizado:{" "}
                      <strong className="text-[#D3B47C]">
                        {(calculatedRevenue * 12).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                          maximumFractionDigits: 0,
                        })}
                      </strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: OPERAÇÕES & LGPD */}
          {/* ========================================================= */}
          {activeTab === "operations" && (
            <div className="max-w-4xl space-y-6 animate-fadeIn">
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-8">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                  GOVERNANÇA & SEGURANÇA
                </span>
                <h3 className="font-serif text-3xl text-white">Arquitetura de Produção e LGPD</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#ABA29A]">
                  O Dúnia Experience OS foi projetado desde a concepção para garantir total segurança de dados, privacidade dos convidados e confiabilidade na recepção.
                </p>

                <div className="mt-8 grid gap-6 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                    <Lock className="h-6 w-6 text-[#D3B47C]" />
                    <h4 className="mt-3 font-semibold text-white">Isolamento Atômico de Dados</h4>
                    <p className="mt-1 text-xs text-[#ABA29A]">
                      Cada evento possui seu próprio token criptográfico e isolamento de permissões. Convidados não acessam dados de outros eventos.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                    <Server className="h-6 w-6 text-[#D3B47C]" />
                    <h4 className="mt-3 font-semibold text-white">Infraestrutura Recomendada</h4>
                    <p className="mt-1 text-xs text-[#ABA29A]">
                      VPS Hostinger KVM 2 / KVM 4 com Next.js, PostgreSQL e Redis para gerenciar picos de check-in com zero latência.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                    <Zap className="h-6 w-6 text-[#D3B47C]" />
                    <h4 className="mt-3 font-semibold text-white">Check-in Anti-Duplicidade</h4>
                    <p className="mt-1 text-xs text-[#ABA29A]">
                      Chave de idempotência única por convite. A portaria identifica tentativas de reutilização do mesmo QR code instantaneamente.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/40 p-5">
                    <CheckCircle2 className="h-6 w-6 text-[#D3B47C]" />
                    <h4 className="mt-3 font-semibold text-white">Conformidade LGPD</h4>
                    <p className="mt-1 text-xs text-[#ABA29A]">
                      Política de consentimento no RSVP, expiração automatizada de fotos pós-evento e direito de exclusão simplificado.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
