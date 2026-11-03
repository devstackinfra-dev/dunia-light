"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Users,
  Calendar,
  Edit3,
  QrCode,
  CheckCircle,
  Clock,
  Sparkles,
  Download,
  Plus,
  Search,
  ExternalLink,
  Menu,
  X,
  Copy,
  DollarSign,
  Camera,
  AlertTriangle,
  MapPin,
  Tv,
  Printer,
  Eye,
  EyeOff,
  Trash2,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  Sliders,
  Radio,
  MessageSquare,
  Send,
  Phone,
  UploadCloud,
  CheckCheck,
  FileText,
  ShieldCheck,
  RefreshCw,
  Layers,
  BookOpen,
  Crown,
  Palette,
  UtensilsCrossed,
} from "lucide-react"
import PainelStorytellingTab from "@/components/painel/painel-storytelling-tab"
import PainelCorteTab from "@/components/painel/painel-corte-tab"
import PainelEstiloTab from "@/components/painel/painel-estilo-tab"
import PainelMesasTab from "@/components/painel/painel-mesas-tab"
import PainelBuffetDietaryCard from "@/components/painel/painel-buffet-dietary-card"
import {
  getStoredArticles,
  createNewEvent,
  DEFAULT_EVENT_MODULES,
  DEFAULT_OPERATIONAL_INFO,
  type DuniaArticle,
  getActiveEventId,
  setActiveEventId,
  getStoredEvents,
  getEventState,
  saveEventState,
  formatEventDate,
  togglePhotoApproval,
  deleteGuestPhoto,
  getTelaoSettings,
  updateTelaoSettings,
  sendTelaoCommand,
  markGuestInvited,
  batchImportGuests,
  DEFAULT_TELAO_SETTINGS,
  getCommercialMode,
  setCommercialMode,
  type DuniaCommercialMode,
  type DuniaEventState,
  type DuniaGuest,
  type DuniaEvent,
  type DuniaTelaoSettings,
  getStoredCelebrationCards,
  saveStoredCelebrationCards,
  updateCelebrationCard,
  createNewCelebrationCard,
  deleteCelebrationCard,
  resetCelebrationCards,
  DEFAULT_CELEBRATION_CARDS,
  ACERVO_DUNIA_PHOTOS,
  type DuniaCelebrationCard,
  type DuniaAcervoPhoto,
} from "@/lib/dunia-store"

type TabKey = "overview" | "guests" | "storytelling" | "corte" | "estilo" | "mesas" | "album" | "checkin" | "editor" | "business" | "revista" | "criador"

export default function PainelCasalPage() {
  const [mounted, setMounted] = useState(false)
  const [commercialMode, setCommercialModeState] = useState<DuniaCommercialMode>("full")
  const [activeTab, setActiveTab] = useState<TabKey>("overview")
  const [state, setState] = useState<DuniaEventState | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Filtros de convidados
  const [guestSearch, setGuestSearch] = useState("")
  const [guestFilter, setGuestFilter] = useState<string>("all")

  // Novo convidado
  const [newName, setNewName] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newSeats, setNewSeats] = useState(2)

  // Automação de Convites & WhatsApp
  const [showBatchModal, setShowBatchModal] = useState(false)
  const [batchText, setBatchText] = useState("")
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showAutomationServiceModal, setShowAutomationServiceModal] = useState(false)
  const [showBulkSendModal, setShowBulkSendModal] = useState(false)
  const [bulkSending, setBulkSending] = useState(false)
  const [bulkSendProgress, setBulkSendProgress] = useState(0)
  const [selectedGuestForPhone, setSelectedGuestForPhone] = useState<DuniaGuest | null>(null)
  const [quickPhoneInput, setQuickPhoneInput] = useState("")

  const [inviteTemplate, setInviteTemplate] = useState<string>(
    `Olá, {nome}! É com imensa alegria que convidamos você para celebrar conosco o momento mais especial de nossas vidas: o casamento de {evento} no Dúnia City Hall! ✨\n\nSeu convite exclusivo com {vagas} vaga(s) já está reservado.\nCódigo individual de confirmação: *{codigo}*\n\nPor favor, confirme sua presença pelo link abaixo:\n{link_rsvp}\n\nLocal: {local}\nData: {data} às {horario}\n\nSerá uma honra imensa ter você conosco!`
  )

  // Modal de Convite & QR Code
  const [selectedGuestQr, setSelectedGuestQr] = useState<DuniaGuest | null>(null)
  const [copiedCode, setCopiedCode] = useState(false)

  // Check-in
  const [checkinCode, setCheckinCode] = useState("")
  const [checkinFeedback, setCheckinFeedback] = useState<{ type: "success" | "error" | "warning"; text: string } | null>(null)

  // Editor
  const [editNames, setEditNames] = useState("")
  const [editDate, setEditDate] = useState("")
  const [editTime, setEditTime] = useState("")
  const [editVenue, setEditVenue] = useState("")
  const [editMessage, setEditMessage] = useState("")
  const [editExtra, setEditExtra] = useState("")
  const [editTheme, setEditTheme] = useState<"gold" | "rose" | "olive">("gold")

  // Simulador de negócios
  const [simMonth, setSimMonth] = useState(8)
  const [simRate, setSimRate] = useState(35)
  const [simTicket, setSimTicket] = useState(1800)

  // Controle Remoto do Telão
  const [telaoSettings, setTelaoSettings] = useState<DuniaTelaoSettings>(DEFAULT_TELAO_SETTINGS)

  // Criador de Celebrações no Painel
  const [criadorName, setCriadorName] = useState("")
  const [criadorCategory, setCriadorCategory] = useState<"Casamento" | "15 Anos" | "Corporativo / Gala" | "Bodas">("Casamento")
  const [criadorDate, setCriadorDate] = useState("2027-05-22")
  const [criadorTime, setCriadorTime] = useState("18:30")
  const [criadorVenue, setCriadorVenue] = useState("Salão Imperial")
  const [criadorGuests, setCriadorGuests] = useState(250)
  const [criadorCerimonial, setCriadorCerimonial] = useState("Cerimonial Dúnia Excellence")
  const [selectedArticleModal, setSelectedArticleModal] = useState<DuniaArticle | null>(null)

  // Tipos de Celebrações (Home) & Acervo de Imagens
  const [celebrationCards, setCelebrationCards] = useState<DuniaCelebrationCard[]>(DEFAULT_CELEBRATION_CARDS)
  const [editingCard, setEditingCard] = useState<DuniaCelebrationCard | null>(null)
  const [isCreatingCard, setIsCreatingCard] = useState(false)
  const [selectedPhotoCategory, setSelectedPhotoCategory] = useState<string>("all")
  const [customPhotoInput, setCustomPhotoInput] = useState("")

  // Revista Dúnia Tab
  const [journalArticles, setJournalArticles] = useState<DuniaArticle[]>([])
  const [journalFilter, setJournalFilter] = useState<string>("all")

  useEffect(() => {
    setMounted(true)
    setCommercialModeState(getCommercialMode())
    let activeId = getActiveEventId()
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const paramEvent = urlParams.get("evento")
      if (paramEvent) {
        setActiveEventId(paramEvent)
        activeId = paramEvent
      }
    }
    const current = getEventState(activeId)
    setState(current)

    // Preenche editor
    setEditNames(current.event.name)
    setEditDate(current.event.date)
    setEditTime(current.event.time)
    setEditVenue(current.event.venue)
    setEditMessage(current.event.message)
    setEditExtra(current.event.extra)
    setEditTheme(current.event.theme || "gold")

    const currentTelao = getTelaoSettings(activeId)
    setTelaoSettings(currentTelao)

    const loadCards = () => {
      setCelebrationCards(getStoredCelebrationCards())
    }
    loadCards()
    window.addEventListener("dunia-celebrations-change", loadCards)

    const loadArticles = () => {
      setJournalArticles(getStoredArticles())
    }
    loadArticles()
    window.addEventListener("dunia-articles-change", loadArticles)

    return () => {
      window.removeEventListener("dunia-celebrations-change", loadCards)
      window.removeEventListener("dunia-articles-change", loadArticles)
    }
  }, [])

  const handleSaveCelebrationCard = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!editingCard) return
    if (!editingCard.title.trim()) {
      notify("Informe o título da celebração.")
      return
    }
    if (isCreatingCard) {
      const created = createNewCelebrationCard(editingCard)
      setCelebrationCards(getStoredCelebrationCards())
      notify(`Tipo de celebração '${created.title}' criado com sucesso na Home!`)
    } else {
      updateCelebrationCard(editingCard.id, editingCard)
      setCelebrationCards(getStoredCelebrationCards())
      notify(`Card '${editingCard.title}' atualizado com sucesso na Home!`)
    }
    setEditingCard(null)
    setIsCreatingCard(false)
  }

  const handleToggleCardActive = (id: string, active: boolean) => {
    updateCelebrationCard(id, { active })
    setCelebrationCards(getStoredCelebrationCards())
    notify(active ? "Card ativado e visível na Home!" : "Card ocultado da Home.")
  }

  const handleDeleteCard = (id: string) => {
    if (celebrationCards.length <= 1) {
      notify("Você deve manter pelo menos um tipo de celebração.")
      return
    }
    if (typeof window !== "undefined" && window.confirm("Deseja realmente remover este tipo de celebração da Home?")) {
      deleteCelebrationCard(id)
      setCelebrationCards(getStoredCelebrationCards())
      notify("Tipo de celebração removido da Home.")
    }
  }

  const handleResetCelebrationCards = () => {
    if (typeof window !== "undefined" && window.confirm("Deseja restaurar os 6 cards originais do Dúnia (Casamento, Debutante, Corporativo, Buffet, Embaixadas e Jardim)?")) {
      const reset = resetCelebrationCards()
      setCelebrationCards(reset)
      notify("Cards da Home restaurados para o padrão original Dúnia!")
    }
  }

  const handleCreateCelebrationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!criadorName.trim() || !criadorDate) return
    const created = createNewEvent({
      name: criadorName.trim(),
      date: criadorDate,
      time: criadorTime,
      venue: `Dúnia City Hall — ${criadorVenue}`,
      plan: "Guest OS + Memories",
      theme: "gold",
      category: criadorCategory,
      hostAccessCode: criadorName.trim().substring(0, 4).toUpperCase() + "26",
      maxGuests: criadorGuests,
      whatsappQuota: 350,
      modules: { ...DEFAULT_EVENT_MODULES },
      operational: {
        ...DEFAULT_OPERATIONAL_INFO,
        espaco: criadorVenue as any,
        tipoEvento: criadorCategory as any,
        horarioInicio: criadorTime,
        qtdConvidadosPrevistos: criadorGuests,
        cerimonialista: criadorCerimonial,
      },
    })
    setActiveEventId(created.id)
    const nextState = getEventState(created.id)
    setState(nextState)
    setCriadorName("")
    notify(`Celebração '${created.name}' cadastrada com sucesso na agenda!`)
    setActiveTab("overview")
  }

  const notify = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  if (!mounted || !state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#100E0D] text-[#D3B47C]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D3B47C] border-t-transparent" />
          <p className="font-serif text-lg">Carregando painel...</p>
        </div>
      </div>
    )
  }

  const { event, guests, album } = state

  // Métricas
  const totalGuests = guests.length
  const confirmedGuests = guests.filter((g) => g.status === "confirmed").length
  const pendingGuests = guests.filter((g) => g.status === "pending").length
  const declinedGuests = guests.filter((g) => g.status === "declined").length
  const checkedInGuests = guests.filter((g) => g.checkedIn).length
  const totalPeopleExpected = guests
    .filter((g) => g.status === "confirmed")
    .reduce((acc, g) => acc + (Number(g.seats) || 1), 0)

  // Filtragem de convidados
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
      g.code.toLowerCase().includes(guestSearch.toLowerCase())
    const matchesStatus = guestFilter === "all" || g.status === guestFilter
    return matchesSearch && matchesStatus
  })


  // Atualiza configurações do Telão em tempo real e sincroniza
  const handleUpdateTelao = (newProps: Partial<DuniaTelaoSettings>) => {
    if (!state?.event?.id) return
    const updated = updateTelaoSettings(state.event.id, newProps)
    setTelaoSettings(updated)
    const nextState = getEventState(state.event.id)
    setState(nextState)
    notify("Configurações do Telão sincronizadas em tempo real!")
  }

  // Comandos manuais para o Telão (Próxima / Anterior / Play / Pause)
  const handleTriggerTelaoCommand = (action: "next" | "prev") => {
    if (!state?.event?.id) return
    sendTelaoCommand(state.event.id, action)
    notify(action === "next" ? "▶ Próxima foto enviada ao telão" : "◀ Foto anterior enviada ao telão")
  }

  // Adicionar Convidado
  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const nextId = guests.reduce((max, g) => Math.max(max, Number(g.id) || 0), 0) + 1
    const formattedId = String(nextId).padStart(3, "0")
    const newGuest: DuniaGuest = {
      id: nextId,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim() ? newPhone.replace(/\D/g, "") : undefined,
      seats: Number(newSeats) || 1,
      status: "pending",
      checkedIn: false,
      code: `DUNIA-${formattedId}`,
      updatedAt: Date.now(),
      invitationStatus: "nao_enviado",
    }

    const nextState: DuniaEventState = {
      ...state,
      guests: [newGuest, ...guests],
    }

    setState(nextState)
    saveEventState(event.id, nextState)
    setNewName("")
    setNewEmail("")
    setNewPhone("")
    setNewSeats(2)
    notify(`Convite DUNIA-${formattedId} criado com sucesso!`)
  }

  // Alternar Status do Convidado
  const handleToggleStatus = (id: number) => {
    const updated = guests.map((g) => {
      if (g.id !== id) return g
      const nextStatus: "confirmed" | "pending" | "declined" =
        g.status === "pending" ? "confirmed" : g.status === "confirmed" ? "declined" : "pending"
      return {
        ...g,
        status: nextStatus,
        checkedIn: nextStatus === "confirmed" ? g.checkedIn : false,
        updatedAt: Date.now(),
      }
    })

    const nextState = { ...state, guests: updated }
    setState(nextState)
    saveEventState(event.id, nextState)
    notify("Status do convidado atualizado.")
  }

  // Excluir Convidado
  const handleDeleteGuest = (id: number, name: string) => {
    if (!confirm(`Deseja remover ${name} da lista de convidados?`)) return
    const updated = guests.filter((g) => g.id !== id)
    const nextState = { ...state, guests: updated }
    setState(nextState)
    saveEventState(event.id, nextState)
    notify("Convidado removido.")
  }


  // Monta mensagem personalizada para o convidado
  const buildPersonalizedMessage = (guest: DuniaGuest) => {
    if (!state) return ""
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
    const linkRsvp = `${origin}/evento#rsvp-section`
    return inviteTemplate
      .replace(/{nome}/g, guest.name)
      .replace(/{codigo}/g, guest.code)
      .replace(/{vagas}/g, String(guest.seats))
      .replace(/{evento}/g, state.event.name)
      .replace(/{data}/g, formatEventDate(state.event.date))
      .replace(/{horario}/g, state.event.time)
      .replace(/{local}/g, state.event.venue)
      .replace(/{link_rsvp}/g, linkRsvp)
  }

  // Disparo Individual de WhatsApp via Web/App
  const handleSendSingleWhatsApp = (guest: DuniaGuest) => {
    if (!guest.phone) {
      setSelectedGuestForPhone(guest)
      setQuickPhoneInput("")
      return
    }
    const cleanPhone = guest.phone.replace(/\D/g, "")
    const text = buildPersonalizedMessage(guest)
    const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`
    const waUrl = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(text)}`
    window.open(waUrl, "_blank")

    markGuestInvited(state!.event.id, guest.id, "whatsapp", "enviado")
    const updated = getEventState(state!.event.id)
    setState(updated)
    notify(`WhatsApp aberto para ${guest.name}! Status atualizado para Enviado.`)
  }

  // Salvar telefone rápido e já disparar
  const handleSavePhoneAndSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGuestForPhone || !quickPhoneInput.trim() || !state) return
    const cleanPhone = quickPhoneInput.replace(/\D/g, "")
    const updatedGuests = state.guests.map((g) => {
      if (g.id === selectedGuestForPhone.id) {
        return { ...g, phone: cleanPhone }
      }
      return g
    })
    const nextState = { ...state, guests: updatedGuests }
    saveEventState(state.event.id, nextState)
    setState(nextState)

    const updatedGuest = updatedGuests.find((g) => g.id === selectedGuestForPhone.id)!
    setSelectedGuestForPhone(null)
    handleSendSingleWhatsApp(updatedGuest)
  }

  // Importar Convidados em Lote (colando lista)
  const handleProcessBatchImport = () => {
    if (!batchText.trim() || !state) return
    const lines = batchText.split("\n").map((l) => l.trim()).filter(Boolean)
    const parsed: { name: string; phone?: string; email?: string; seats: number }[] = []

    lines.forEach((line) => {
      // Formatos aceitos: "Nome, Telefone, Vagas" ou "Nome; Telefone; Vagas" ou apenas "Nome"
      const parts = line.split(/[,;\t]/).map((p) => p.trim())
      const name = parts[0]
      if (!name) return

      let phone = ""
      let seats = 1

      if (parts[1]) {
        const p1 = parts[1].replace(/\D/g, "")
        if (p1.length >= 8) {
          phone = p1
        } else if (!isNaN(Number(parts[1]))) {
          seats = Number(parts[1])
        }
      }

      if (parts[2] && !isNaN(Number(parts[2]))) {
        seats = Number(parts[2])
      }

      parsed.push({ name, phone: phone || undefined, seats })
    })

    if (parsed.length === 0) {
      notify("Nenhum convidado reconhecido. Verifique o formato.")
      return
    }

    batchImportGuests(state.event.id, parsed)
    const updated = getEventState(state.event.id)
    setState(updated)
    setShowBatchModal(false)
    setBatchText("")
    notify(`${parsed.length} convidados importados com códigos exclusivos gerados!`)
  }

  // Disparo em Massa Inteligente (Simulado com Webhook / Queue)
  const handleStartBulkSend = async () => {
    const uninvited = guests.filter((g) => !g.invitationStatus || g.invitationStatus === "nao_enviado")
    if (uninvited.length === 0) {
      notify("Todos os convidados já receberam o convite!")
      return
    }

    setBulkSending(true)
    setBulkSendProgress(0)

    for (let i = 0; i < uninvited.length; i++) {
      const g = uninvited[i]
      await new Promise((resolve) => setTimeout(resolve, 800))
      markGuestInvited(state!.event.id, g.id, "whatsapp", "enviado")
      setBulkSendProgress(Math.round(((i + 1) / uninvited.length) * 100))
    }

    const updated = getEventState(state!.event.id)
    setState(updated)
    setBulkSending(false)
    setShowBulkSendModal(false)
    notify(`Sucesso! ${uninvited.length} convites disparados com sucesso via WhatsApp!`)
  }

  // Exportar CSV
  const handleExportCsv = () => {
    const headers = ["Nome", "E-mail", "Codigo", "Vagas", "Status", "Check-in", "Mensagem"]
    const rows = guests.map((g) => [
      g.name,
      g.email || "",
      g.code,
      g.seats,
      g.status === "confirmed" ? "Confirmado" : g.status === "declined" ? "Não irá" : "Pendente",
      g.checkedIn ? "Sim" : "Não",
      g.message || "",
    ])
    const csvContent =
      "\ufeff" +
      [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
        .join("\r\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `convidados-${event.name.toLowerCase().replace(/\s+/g, "-")}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    notify("Planilha CSV baixada com sucesso!")
  }

  // Check-in Process
  // Atualizar Mesa do Convidado
  const handleUpdateGuestTable = (guestId: number, table: string) => {
    if (!state) return
    const updated = state.guests.map((g) => (g.id === guestId ? { ...g, table } : g))
    const nextState = { ...state, guests: updated }
    setState(nextState)
    saveEventState(event.id, nextState)
    notify("Mesa do convidado atualizada com sucesso!")
  }

  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanCode = checkinCode.trim().toUpperCase()
    if (!cleanCode) return

    const guest = guests.find((g) => g.code.toUpperCase() === cleanCode)

    if (!guest) {
      setCheckinFeedback({ type: "error", text: "Código de convite não encontrado no sistema." })
      return
    }

    if (guest.status !== "confirmed") {
      setCheckinFeedback({
        type: "warning",
        text: `Atenção: ${guest.name} (${guest.code}) ainda consta como '${
          guest.status === "declined" ? "Não irá" : "Pendente"
        }'. Deseja autorizar mesmo assim?`,
      })
      return
    }

    if (guest.checkedIn) {
      setCheckinFeedback({
        type: "error",
        text: `ALERTA DE SEGURANÇA: Entrada já registrada para ${guest.name}! Duplicidade bloqueada.`,
      })
      return
    }

    const updated = guests.map((g) => (g.id === guest.id ? { ...g, checkedIn: true, checkedAt: Date.now() } : g))
    const nextState = { ...state, guests: updated }
    setState(nextState)
    saveEventState(event.id, nextState)
    setCheckinCode("")
    setCheckinFeedback({
      type: "success",
      text: `✓ Entrada AUTORIZADA com sucesso para ${guest.name} (+${guest.seats} vagas). Seja bem-vindo(a)!`,
    })
    notify(`Check-in de ${guest.name} realizado!`)
  }

  // Acoes do Album Dunia Memories & Telao
  const handleTogglePhotoApproval = (photoId: string) => {
    togglePhotoApproval(event.id, photoId)
    const updated = getEventState(event.id)
    setState(updated)
    notify("Status da foto no telão atualizado!")
  }

  const handleDeletePhoto = (photoId: string) => {
    deleteGuestPhoto(event.id, photoId)
    const updated = getEventState(event.id)
    setState(updated)
    notify("Foto removida do acervo.")
  }

  const handleCopyUploadLink = () => {
    if (typeof window === "undefined") return
    const link = `${window.location.origin}/evento/fotos`
    navigator.clipboard?.writeText(link)
    notify("Link de upload copiado para a área de transferência!")
  }

  const handlePrintTableCard = () => {
    if (typeof window === "undefined") return
    window.print()
  }

  const handleDownloadZip = () => {
    notify("Preparando download de todas as fotos em alta resolução...")
    setTimeout(() => {
      notify("Download do arquivo fotos-convidados.zip iniciado!")
    }, 1500)
  }

  // Salvar Editor
  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedEvent = {
      ...event,
      name: editNames.trim(),
      date: editDate,
      time: editTime,
      venue: editVenue.trim(),
      message: editMessage.trim(),
      extra: editExtra.trim(),
      theme: editTheme,
    }

    const nextState = { ...state, event: updatedEvent }
    setState(nextState)
    saveEventState(event.id, nextState)
    notify("Mini-site atualizado com sucesso!")
  }

  // Toggle Álbum
  const handleToggleAlbum = (published: boolean) => {
    const updatedAlbum = { ...album, published }
    const nextState = { ...state, album: updatedAlbum }
    setState(nextState)
    saveEventState(event.id, nextState)
    notify(published ? "Álbum ativado no mini-site!" : "Álbum ocultado.")
  }

  return (
    <div className="relative z-10 flex min-h-screen bg-[#0C0A09] text-[#F3EEE6] antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-[#D3B47C]/40 bg-[#1A1715] px-5 py-3 text-xs font-semibold text-[#D3B47C] shadow-2xl backdrop-blur-md">
          <Sparkles className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-white/10 bg-[#100E0D] p-6 lg:flex overflow-y-auto">
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
              EVENTO ATIVO
            </span>
            <select
              value={event.id}
              onChange={(e) => {
                const nextId = e.target.value
                setActiveEventId(nextId)
                const next = getEventState(nextId)
                setState(next)
                setEditNames(next.event.name)
                setEditDate(next.event.date)
                setEditTime(next.event.time)
                setEditVenue(next.event.venue)
                setEditMessage(next.event.message)
                setEditExtra(next.event.extra)
                setEditTheme(next.event.theme || "gold")
                const ts = getTelaoSettings(nextId)
                setTelaoSettings(ts)
                notify(`Alternado para: ${next.event.name}`)
              }}
              className="mt-1 w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs font-serif text-white focus:border-[#D3B47C] focus:outline-none"
            >
              {getStoredEvents().map((ev: DuniaEvent) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.date.split("-")[2]}/{ev.date.split("-")[1]})
                </option>
              ))}
            </select>
            <p className="text-[0.65rem] text-[#ABA29A] mt-1 truncate">
              {formatEventDate(event.date)} · {event.operational?.espaco || event.venue}
            </p>
          </div>

          <nav className="space-y-1.5">
            {[
              ...(commercialMode === "light"
                ? [
                    { key: "album", label: "Galeria de Fotos", icon: Camera, enabled: true, highlight: false },
                    { key: "revista", label: "Revista Dúnia", icon: BookOpen, enabled: true, highlight: false },
                    { key: "criador", label: "Criador de Celebrações", icon: Plus, enabled: true, highlight: true },
                    { key: "overview", label: "Resumo da Celebração", icon: Calendar, enabled: true, highlight: false },
                    { key: "guests", label: "Convidados & RSVP", icon: Users, enabled: false, badge: "Experience OS" },
                    { key: "mesas", label: "Mapa de Mesas & QR", icon: QrCode, enabled: false, badge: "Experience OS" },
                    { key: "editor", label: "Editor do Mini-site", icon: Edit3, enabled: false, badge: "Experience OS" },
                    { key: "checkin", label: "Controle de Portaria", icon: CheckCircle, enabled: false, badge: "Experience OS" },
                  ]
                : [
                    { key: "overview", label: "Visão Geral", icon: Calendar, enabled: true },
                    { key: "guests", label: "Convidados & RSVP", icon: Users, enabled: event.modules?.rsvpWhatsApp !== false },
                    { key: "mesas", label: "Mapa de Mesas & Totens", icon: QrCode, enabled: true },
                    { key: "storytelling", label: "Storytelling & Livro", icon: BookOpen, enabled: true },
                    { key: "corte", label: "Corte de Honra", icon: Crown, enabled: true },
                    { key: "estilo", label: "Guia de Estilo & Traje", icon: Palette, enabled: true },
                    { key: "editor", label: "Editor do Mini-site", icon: Edit3, enabled: true },
                    { key: "checkin", label: "Controle de Entrada", icon: CheckCircle, enabled: event.modules?.receptionCheckin !== false },
                    { key: "album", label: "Dúnia Memories", icon: Camera, enabled: event.modules?.guestAlbum !== false || event.modules?.liveTelao !== false },
                    { key: "revista", label: "Revista Dúnia", icon: BookOpen, enabled: true },
                    { key: "criador", label: "Criador de Celebrações", icon: Plus, enabled: true },
                    { key: "business", label: "Módulos & Upgrades", icon: Sparkles, enabled: true },
                  ]),
            ].map(({ key, label, icon: Icon, enabled, badge, highlight }: any) => (
              <button
                key={key}
                onClick={() => {
                  if (!enabled) {
                    notify(`O módulo '${label}' é exclusivo do plano Experience OS. Disponível mediante upgrade.`)
                    return
                  }
                  setActiveTab(key as TabKey)
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-xs font-semibold tracking-wider transition ${
                  activeTab === key
                    ? "bg-[#D3B47C] text-[#100E0D] shadow"
                    : !enabled
                    ? "text-white/30 hover:bg-white/[0.02]"
                    : "text-[#ABA29A] hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </div>
                {!enabled && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[0.55rem] uppercase text-amber-300 border border-amber-500/20">
                    {badge || "Bloqueado"}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-3 pt-6 border-t border-white/10">
          <Link
            href="/evento"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white/80 transition hover:border-[#D3B47C] hover:text-white"
          >
            <span>Ver Mini-site</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/admin"
            className="block text-center text-[0.7rem] uppercase tracking-wider text-[#ABA29A] transition hover:text-[#D3B47C]"
          >
            Central do Salão Dúnia ↗
          </Link>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Top Header Mobile */}
        <header className="flex items-center justify-between border-b border-white/10 bg-[#100E0D] px-6 py-4 lg:hidden">
          <Image src="/assets/logo.png" alt="Dúnia" width={120} height={35} className="h-8 w-auto object-contain" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg border border-white/15 p-2 text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-white/10 bg-[#141110] p-6 lg:hidden">
            <nav className="space-y-2">
              {[
                { key: "overview", label: "Visão Geral", icon: Calendar },
                { key: "guests", label: "Convidados & RSVP", icon: Users },
                { key: "mesas", label: "Mapa de Mesas", icon: QrCode },
                { key: "storytelling", label: "Storytelling & Livro", icon: BookOpen },
                { key: "corte", label: "Corte de Honra", icon: Crown },
                { key: "estilo", label: "Guia de Estilo & Traje", icon: Palette },
                { key: "editor", label: "Editor do Mini-site", icon: Edit3 },
                { key: "checkin", label: "Controle de Entrada", icon: CheckCircle },
                { key: "album", label: "Dúnia Memories", icon: Camera },
                { key: "business", label: "Serviços & Upgrades", icon: DollarSign },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    setActiveTab(key as TabKey)
                    setMobileMenuOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold ${
                    activeTab === key ? "bg-[#D3B47C] text-[#100E0D]" : "text-[#ABA29A]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
              <div className="pt-4">
                <Link
                  href="/evento"
                  target="_blank"
                  className="block rounded-xl border border-white/20 p-3 text-center text-xs font-bold text-white"
                >
                  Ver Mini-site do Evento ↗
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* Top Header Desktop com Título da Tab */}
        <header className="hidden items-center justify-between border-b border-white/10 bg-[#100E0D]/50 px-10 py-5 backdrop-blur-sm lg:flex">
          <div>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
              PAINEL DO ORGANIZADOR
            </span>
            <h1 className="font-serif text-2xl text-white">
              {activeTab === "overview" && "Visão Geral da Celebração"}
              {activeTab === "guests" && "Gestão de Convidados & RSVP"}
              {activeTab === "mesas" && "Mapa de Mesas & Totens QR de Luxo"}
              {activeTab === "storytelling" && "Storytelling, Capítulos & Livro de Ouro"}
              {activeTab === "corte" && "Corte de Honra · Pais, Padrinhos & Damas"}
              {activeTab === "estilo" && "Guia de Estilo, Traje & Paleta Oficial"}
              {activeTab === "editor" && "Editor do Mini-site"}
              {activeTab === "checkin" && "Controle de Entrada & Recepção"}
              {activeTab === "album" && "Dúnia Memories (Álbum de Fotos)"}
              {activeTab === "business" && "Módulos Contratados & Upgrades da Celebração"}
              {activeTab === "revista" && "Revista Dúnia — Inspiração & Histórias"}
              {activeTab === "criador" && "Tipos de Celebrações (Home) & Criador"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {commercialMode !== "light" ? (
              <Link
                href="/evento"
                target="_blank"
                className="flex items-center gap-2 rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:opacity-90"
              >
                <span>Abrir Mini-site</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                href="/admin/experiencias"
                className="flex items-center gap-2 rounded-xl border border-[#D3B47C]/40 bg-[#161311] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#D3B47C] shadow transition hover:bg-[#D3B47C]/10"
              >
                <span>Central do Salão Dúnia ↗</span>
              </Link>
            )}
          </div>
        </header>

        {/* Corpo da Tab */}
        <main className="flex-1 p-6 lg:p-10">
          {commercialMode === "light" && (
            <div className="mb-8 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-300">MODALIDADE LIGHT • PAINEL DESIDRATADO DO ANFITRIÃO</h4>
                  <p className="text-xs text-[#ABA29A] mt-0.5 leading-relaxed">
                    Você tem acesso liberado à <strong>Galeria de Fotos</strong>, <strong>Revista Dúnia</strong> e <strong>Criador de Celebrações</strong>. Módulos avançados de RSVP, mapa de mesas e mini-sites pertencem ao plano <strong>Experience OS</strong>.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setCommercialMode("full")
                  setCommercialModeState("full")
                  notify("Modo Experience OS ativado para demonstração!")
                }}
                className="shrink-0 rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
              >
                Ativar Demo Experience OS
              </button>
            </div>
          )}
          {/* TAB 1: VISÃO GERAL */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Cards de Métricas */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">Convites</span>
                  <div className="mt-2 font-serif text-4xl text-white">{totalGuests}</div>
                  <small className="mt-1 block text-xs text-[#ABA29A]">Códigos individuais emitidos</small>
                </div>

                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Confirmados</span>
                  <div className="mt-2 font-serif text-4xl text-white">{confirmedGuests}</div>
                  <small className="mt-1 block text-xs text-emerald-300">+{totalPeopleExpected} pessoas previstas</small>
                </div>

                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Aguardando</span>
                  <div className="mt-2 font-serif text-4xl text-white">{pendingGuests}</div>
                  <small className="mt-1 block text-xs text-amber-300">Respostas pendentes</small>
                </div>

                <div className="rounded-2xl border border-[#D3B47C]/20 bg-[#D3B47C]/[0.04] p-6 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D3B47C]">Check-ins</span>
                  <div className="mt-2 font-serif text-4xl text-white">{checkedInGuests}</div>
                  <small className="mt-1 block text-xs text-[#D3B47C]">Entradas no salão</small>
                </div>
              </div>

              {/* Informações do Evento e Ações Rápidas */}
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 lg:col-span-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <h3 className="font-serif text-lg text-white">Resumo do Evento</h3>
                    <button
                      onClick={() => setActiveTab("editor")}
                      className="text-xs font-semibold text-[#D3B47C] hover:underline"
                    >
                      Editar Informações →
                    </button>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
                    <div>
                      <span className="text-xs uppercase text-[#ABA29A]">Data</span>
                      <p className="mt-1 font-semibold text-white">{formatEventDate(event.date)}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase text-[#ABA29A]">Horário</span>
                      <p className="mt-1 font-semibold text-white">{event.time}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase text-[#ABA29A]">Local</span>
                      <p className="mt-1 font-semibold text-white">{event.venue}</p>
                    </div>
                  </div>
                  <div className="mt-6 rounded-xl border border-white/10 bg-black/40 p-4">
                    <span className="text-xs uppercase text-[#D3B47C]">Mensagem aos Convidados:</span>
                    <p className="mt-1 text-sm italic text-white/90">&ldquo;{event.message}&rdquo;</p>
                  </div>
                </div>

                {/* Últimos Retornos de RSVP */}
                <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
                  <h3 className="font-serif text-lg text-white">Últimas Respostas</h3>
                  <div className="mt-4 space-y-3">
                    {guests.slice(0, 5).map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3"
                      >
                        <div>
                          <p className="text-sm font-semibold text-white">{g.name}</p>
                          <span className="font-mono text-xs text-[#ABA29A]">{g.code}</span>
                        </div>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                            g.status === "confirmed"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : g.status === "declined"
                              ? "bg-rose-500/20 text-rose-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {g.status === "confirmed" ? "Confirmado" : g.status === "declined" ? "Não irá" : "Pendente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RELATÓRIO DE BUFFET & RESTRIÇÕES ALIMENTARES · ALTA GASTRONOMIA DÚNIA */}
              <PainelBuffetDietaryCard event={event} guests={guests} onNotify={notify} />
            </div>
          )}

          {/* TAB 2: CONVIDADOS, RSVP & AUTOMAÇÃO WHATSAPP */}
          {activeTab === "guests" && (
            <div className="space-y-8">
              {/* BANNER MASTER: CENTRAL DE AUTOMAÇÃO DE DISPAROS DE CONVITES */}
              <div className="rounded-3xl border-2 border-[#D3B47C]/40 bg-gradient-to-b from-[#1E1916] via-[#161311] to-[#120F0D] p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-[#D3B47C]/20 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-400">
                      <MessageSquare className="h-3 w-3" />
                      <span>AUTOMAÇÃO WHATSAPP • GUEST OS VIP</span>
                    </div>
                    <h3 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                      Disparo Inteligente de Convites
                    </h3>
                    <p className="mt-1 text-xs text-[#ABA29A] max-w-xl">
                      Envie convites nominais com código de confirmação individual via WhatsApp em 1 clique ou por automação em massa.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setShowBulkSendModal(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:scale-105"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Disparar Pendentes em Massa</span>
                    </button>

                    <button
                      onClick={() => setShowBatchModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition hover:border-[#D3B47C]"
                    >
                      <UploadCloud className="h-3.5 w-3.5 text-[#D3B47C]" />
                      <span>Importar Lista em Lote</span>
                    </button>

                    <button
                      onClick={() => setShowTemplateModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition hover:border-[#D3B47C]"
                    >
                      <FileText className="h-3.5 w-3.5 text-[#D3B47C]" />
                      <span>Editar Mensagem</span>
                    </button>

                    <button
                      onClick={() => setShowAutomationServiceModal(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-4 py-3 text-xs font-bold text-[#D3B47C] transition hover:bg-[#D3B47C] hover:text-[#100E0D]"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Ferramentas & Pacotes Dúnia</span>
                    </button>
                  </div>
                </div>

                {/* MÉTRICAS DE DISPARO */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block">
                      Total na Lista
                    </span>
                    <span className="font-serif text-3xl font-light text-white mt-1 block">
                      {totalGuests}
                    </span>
                    <small className="text-[0.65rem] text-[#D3B47C]">{totalPeopleExpected} vagas reservadas</small>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block">
                      Convites Enviados
                    </span>
                    <span className="font-serif text-3xl font-light text-emerald-400 mt-1 block">
                      {guests.filter((g) => g.invitationStatus && g.invitationStatus !== "nao_enviado").length}
                    </span>
                    <small className="text-[0.65rem] text-emerald-300">WhatsApp / E-mail</small>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block">
                      Pendentes de Envio
                    </span>
                    <span className="font-serif text-3xl font-light text-amber-400 mt-1 block">
                      {guests.filter((g) => !g.invitationStatus || g.invitationStatus === "nao_enviado").length}
                    </span>
                    <small className="text-[0.65rem] text-amber-300">Prontos para disparar</small>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                    <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block">
                      Presença Confirmada
                    </span>
                    <span className="font-serif text-3xl font-light text-white mt-1 block">
                      {confirmedGuests}
                    </span>
                    <small className="text-[0.65rem] text-emerald-400">
                      {Math.round((confirmedGuests / (totalGuests || 1)) * 100)}% de confirmação
                    </small>
                  </div>
                </div>
              </div>

              {/* Formulário de Adicionar Convidado (com WhatsApp) */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
                <h3 className="font-serif text-lg text-white">Cadastrar Convidado Individual</h3>
                <form onSubmit={handleAddGuest} className="mt-4 grid gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      placeholder="Nome completo (ex: Família Carvalho)"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#D3B47C] focus:outline-none"
                      required
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="tel"
                      placeholder="WhatsApp (ex: 61 99123-4567)"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#D3B47C] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="email"
                      placeholder="E-mail (opcional)"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-[#D3B47C] focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={newSeats}
                      onChange={(e) => setNewSeats(Number(e.target.value))}
                      className="w-full rounded-xl border border-white/15 bg-black/40 px-2 py-2.5 text-center text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                      title="Número de vagas"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center rounded-xl bg-[#D3B47C] py-2.5 text-xs font-bold text-[#100E0D] shadow transition hover:bg-[#D3B47C]/90"
                      title="Cadastrar e gerar convite"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Filtros e Tabela */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-1 items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#ABA29A]" />
                      <input
                        type="text"
                        placeholder="Buscar por nome ou código..."
                        value={guestSearch}
                        onChange={(e) => setGuestSearch(e.target.value)}
                        className="w-full rounded-xl border border-white/15 bg-black/40 py-2.5 pl-10 pr-4 text-xs text-white placeholder-white/20 focus:border-[#D3B47C] focus:outline-none"
                      />
                    </div>
                    <select
                      value={guestFilter}
                      onChange={(e) => setGuestFilter(e.target.value)}
                      className="rounded-xl border border-white/15 bg-[#1C1816] px-3 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                    >
                      <option value="all">Todos os Status</option>
                      <option value="confirmed">Confirmados</option>
                      <option value="pending">Pendentes</option>
                      <option value="declined">Não irão</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExportCsv}
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
                  >
                    <Download className="h-4 w-4 text-[#D3B47C]" />
                    <span>EXPORTAR CSV</span>
                  </button>
                </div>

                {/* Tabela de Convidados */}
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-[0.7rem] uppercase tracking-wider text-[#ABA29A]">
                        <th className="pb-3">Convidado & Contato</th>
                        <th className="pb-3">Código</th>
                        <th className="pb-3 text-center">Vagas</th>
                        <th className="pb-3">Envio Convite</th>
                        <th className="pb-3">Status RSVP</th>
                        <th className="pb-3 text-right">Disparo & Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredGuests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-sm text-[#ABA29A]">
                            Nenhum convidado encontrado com os filtros atuais.
                          </td>
                        </tr>
                      ) : (
                        filteredGuests.map((g) => (
                          <tr key={g.id} className="transition hover:bg-white/[0.02]">
                            <td className="py-3.5">
                              <strong className="block text-white">{g.name}</strong>
                              <div className="flex items-center gap-2 mt-0.5 text-xs text-[#ABA29A]">
                                {g.phone ? (
                                  <span className="text-emerald-400 font-mono text-[0.7rem] flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {g.phone}
                                  </span>
                                ) : (
                                  <span className="text-white/40 text-[0.7rem]">Sem telefone</span>
                                )}
                                {g.email && <span className="text-white/30">• {g.email}</span>}
                              </div>
                            </td>
                            <td className="py-3.5">
                              <code className="rounded bg-black/50 px-2 py-1 text-xs text-[#D3B47C]">{g.code}</code>
                            </td>
                            <td className="py-3.5 text-center text-white font-mono">{g.seats}</td>
                            <td className="py-3.5">
                              <span
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider ${
                                  g.invitationStatus === "lido"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : g.invitationStatus === "entregue"
                                    ? "bg-emerald-500/15 text-emerald-400"
                                    : g.invitationStatus === "enviado"
                                    ? "bg-sky-500/20 text-sky-300"
                                    : "bg-white/5 text-white/50"
                                }`}
                              >
                                {g.invitationStatus === "lido" ? (
                                  <>
                                    <CheckCheck className="h-3 w-3 text-emerald-400" />
                                    <span>Lido</span>
                                  </>
                                ) : g.invitationStatus === "entregue" ? (
                                  <>
                                    <CheckCheck className="h-3 w-3 text-emerald-400" />
                                    <span>Entregue</span>
                                  </>
                                ) : g.invitationStatus === "enviado" ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 text-sky-400" />
                                    <span>Enviado</span>
                                  </>
                                ) : (
                                  <span>Pendente</span>
                                )}
                              </span>
                            </td>
                            <td className="py-3.5">
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                                  g.status === "confirmed"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : g.status === "declined"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : "bg-amber-500/20 text-amber-300"
                                }`}
                              >
                                {g.status === "confirmed" ? "Confirmado ✓" : g.status === "declined" ? "Não irá ✕" : "Pendente"}
                              </span>
                            </td>
                            <td className="py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* BOTÃO DE DISPARO WHATSAPP 1-CLIQUE */}
                                <button
                                  onClick={() => handleSendSingleWhatsApp(g)}
                                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
                                  title="Enviar convite personalizado via WhatsApp"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  <span>WhatsApp</span>
                                </button>

                                <button
                                  onClick={() => setSelectedGuestQr(g)}
                                  className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs font-semibold text-white transition hover:border-[#D3B47C] hover:text-[#D3B47C]"
                                  title="Ver QR Code do Convite"
                                >
                                  QR
                                </button>

                                <button
                                  onClick={() => handleToggleStatus(g.id)}
                                  className="rounded-lg border border-white/15 bg-white/5 px-2 py-1 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                                  title="Alternar Status de Confirmação"
                                >
                                  Status
                                </button>

                                <button
                                  onClick={() => handleDeleteGuest(g.id, g.name)}
                                  className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-2 py-1 text-xs text-rose-400 transition hover:bg-rose-500/20"
                                  title="Remover da Lista"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB NOVA: STORYTELLING & LIVRO DE OURO */}
          {activeTab === "storytelling" && (
            <PainelStorytellingTab eventId={event.id} onNotify={notify} />
          )}

          {/* TAB NOVA: CORTE DE HONRA */}
          {activeTab === "corte" && (
            <PainelCorteTab eventId={event.id} onNotify={notify} />
          )}

          {/* TAB NOVA: GUIA DE ESTILO & PLAYLIST */}
          {activeTab === "estilo" && (
            <PainelEstiloTab eventId={event.id} onNotify={notify} />
          )}

          {/* TAB NOVA: MAPA DE MESAS & TOTENS QR */}
          {activeTab === "mesas" && (
            <PainelMesasTab
              event={event}
              guests={guests}
              onUpdateGuestTable={handleUpdateGuestTable}
              onNotify={notify}
            />
          )}

          {/* TAB 3: EDITOR DO MINI-SITE */}
          {activeTab === "editor" && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 lg:col-span-7">
                <h3 className="font-serif text-lg text-white">Personalizar Mini-site</h3>
                <form onSubmit={handleSaveEditor} className="mt-6 space-y-5">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Nomes dos Anfitriões
                    </label>
                    <input
                      type="text"
                      value={editNames}
                      onChange={(e) => setEditNames(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                        Data do Evento
                      </label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                        Horário de Início
                      </label>
                      <input
                        type="text"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        placeholder="18:00"
                        className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Local / Salão
                    </label>
                    <input
                      type="text"
                      value={editVenue}
                      onChange={(e) => setEditVenue(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Mensagem de Boas-Vindas
                    </label>
                    <textarea
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      rows={3}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Orientações Extras (Traje, Horário, Vallet)
                    </label>
                    <textarea
                      value={editExtra}
                      onChange={(e) => setEditExtra(e.target.value)}
                      rows={2}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                    />
                  </div>

                  {/* Seleção de Tema Cromático */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Estilo Cromático
                    </label>
                    <div className="mt-2 flex gap-3">
                      {[
                        { key: "gold", label: "Ouro Champagne", color: "bg-[#D3B47C]" },
                        { key: "rose", label: "Rosé Gold", color: "bg-[#E2B0AD]" },
                        { key: "olive", label: "Oliva Imperial", color: "bg-[#BFCE9E]" },
                      ].map(({ key, label, color }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setEditTheme(key as any)}
                          className={`flex items-center gap-2.5 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                            editTheme === key
                              ? "border-white bg-white/10 text-white"
                              : "border-white/10 text-[#ABA29A] hover:bg-white/5"
                          }`}
                        >
                          <span className={`h-3 w-3 rounded-full ${color}`} />
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#D3B47C] py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:opacity-90"
                  >
                    SALVAR ALTERAÇÕES
                  </button>
                </form>
              </div>

              {/* Pré-Visualização */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 lg:col-span-5">
                <h3 className="font-serif text-lg text-white">Prévia em Tempo Real</h3>
                <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-[#0C0A09] p-6 shadow-xl">
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                    MINI-SITE OFICIAL
                  </span>
                  <h4 className="mt-2 font-serif text-3xl text-white">{editNames || "Nome do Casal"}</h4>
                  <p className="mt-1 text-xs text-[#ABA29A]">
                    {formatEventDate(editDate)} · {editTime}
                  </p>
                  <div className="mt-4 border-t border-white/10 pt-4">
                    <p className="font-serif text-sm italic text-white/90">
                      &ldquo;{editMessage || "Mensagem de boas-vindas aos convidados..."}&rdquo;
                    </p>
                  </div>
                  <div className="mt-4 rounded-lg bg-white/5 p-3 text-xs text-[#ABA29A]">
                    <MapPin className="mb-1 inline h-3.5 w-3.5 text-[#D3B47C]" /> {editVenue}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONTROLE DE ENTRADA / CHECK-IN */}
          {activeTab === "checkin" && (
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 lg:col-span-5">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                  PORTARIA & RECEPÇÃO
                </span>
                <h3 className="mt-1 font-serif text-2xl text-white">Registrar Entrada</h3>
                <p className="mt-2 text-xs text-[#ABA29A]">
                  Digite o código do convite ou posicione o leitor de QR Code. O sistema valida na hora e bloqueia duplicidade de acesso.
                </p>

                <form onSubmit={handleCheckinSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Código do Convite
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: DUNIA-001"
                      value={checkinCode}
                      onChange={(e) => setCheckinCode(e.target.value.toUpperCase())}
                      className="mt-2 w-full rounded-xl border border-white/20 bg-black/60 px-4 py-3.5 font-mono text-lg uppercase text-white focus:border-[#D3B47C] focus:outline-none"
                      autoFocus
                    />
                  </div>

                  {checkinFeedback && (
                    <div
                      className={`rounded-xl p-4 text-xs font-medium ${
                        checkinFeedback.type === "success"
                          ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : checkinFeedback.type === "warning"
                          ? "border border-amber-500/30 bg-amber-500/10 text-amber-300"
                          : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                      }`}
                    >
                      {checkinFeedback.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#D3B47C] py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:bg-[#D3B47C]/90"
                  >
                    REGISTRAR ENTRADA
                  </button>
                </form>
              </div>

              {/* Lista de Entradas em Tempo Real */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 lg:col-span-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h3 className="font-serif text-lg text-white">Convidados que Já Entraram</h3>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    {checkedInGuests} entradas
                  </span>
                </div>

                <div className="mt-6 space-y-3">
                  {guests
                    .filter((g) => g.checkedIn)
                    .sort((a, b) => (b.checkedAt || 0) - (a.checkedAt || 0))
                    .map((g) => (
                      <div
                        key={g.id}
                        className="flex items-center justify-between rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4"
                      >
                        <div>
                          <p className="font-semibold text-white">{g.name}</p>
                          <span className="font-mono text-xs text-[#D3B47C]">{g.code}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-emerald-400">✓ Entrada Autorizada</span>
                          <span className="block text-[0.65rem] text-[#ABA29A]">
                            {g.checkedAt ? new Date(g.checkedAt).toLocaleTimeString("pt-BR") : "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  {checkedInGuests === 0 && (
                    <div className="py-12 text-center text-xs text-[#ABA29A]">
                      Nenhuma entrada registrada até o momento.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DÚNIA MEMORIES / ÁLBUM AO VIVO & DISPLAY DE MESA */}
          {activeTab === "album" && (
            <div className="space-y-8">
              {/* MASTER CONTROL ROOM: CONTROLE REMOTO DO TELÃO AO VIVO */}
              <div className="rounded-3xl border-2 border-[#D3B47C]/40 bg-gradient-to-b from-[#1E1916] via-[#161311] to-[#120F0D] p-6 sm:p-8 shadow-[0_20px_50px_rgba(211,180,124,0.12)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[#D3B47C]/20 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-400">
                      <Radio className="h-3 w-3 animate-pulse" />
                      <span>SALA DE CONTROLE MASTER • TELÃO AO VIVO</span>
                    </div>
                    <h3 className="mt-2 font-serif text-2xl text-white sm:text-3xl">
                      Central do Telão & Efeitos
                    </h3>
                    <p className="mt-1 text-xs text-[#ABA29A]">
                      Controle remotamente a música, transições, velocidade e reprodução do telão projetado no salão.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      href="/evento/telao"
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow-lg transition hover:scale-105"
                    >
                      <Tv className="h-4 w-4" />
                      <span>Abrir Telão do Salão ↗</span>
                    </Link>

                    <button
                      onClick={handleCopyUploadLink}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition hover:border-[#D3B47C]"
                    >
                      <Copy className="h-3.5 w-3.5 text-[#D3B47C]" />
                      <span>Copiar Link dos Convidados</span>
                    </button>
                  </div>
                </div>

                {/* GRID DE CONTROLES: REPRODUÇÃO, TEMPO, EFEITOS E MÚSICA */}
                <div className="mt-6 grid gap-6 lg:grid-cols-12">
                  {/* BLOCO 1: CONTROLES DE REPRODUÇÃO REMOTA (PLAY/PAUSE & NAVEGAÇÃO) */}
                  <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/40 p-5 space-y-4">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C] flex items-center gap-1.5">
                      <Sliders className="h-3.5 w-3.5" />
                      CONTROLE DE SLIDES AO VIVO
                    </span>

                    <div className="flex items-center justify-between gap-2 pt-2">
                      <button
                        onClick={() => handleTriggerTelaoCommand("prev")}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10 hover:border-[#D3B47C] transition"
                        title="Voltar slide anterior no telão"
                      >
                        <SkipBack className="h-4 w-4 text-[#D3B47C]" />
                        <span>Anterior</span>
                      </button>

                      <button
                        onClick={() => handleUpdateTelao({ isPlaying: !telaoSettings.isPlaying })}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs font-bold uppercase tracking-wider transition ${
                          telaoSettings.isPlaying
                            ? "bg-[#D3B47C] text-[#100E0D] shadow-lg"
                            : "border border-amber-500/40 bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {telaoSettings.isPlaying ? (
                          <>
                            <Pause className="h-4 w-4" />
                            <span>Pausar</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            <span>Rodar</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleTriggerTelaoCommand("next")}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold text-white hover:bg-white/10 hover:border-[#D3B47C] transition"
                        title="Avançar próximo slide no telão"
                      >
                        <span>Próxima</span>
                        <SkipForward className="h-4 w-4 text-[#D3B47C]" />
                      </button>
                    </div>

                    {/* TEMPO DE TRANSIÇÃO (VELOCIDADE) */}
                    <div className="pt-2">
                      <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-[#ABA29A] mb-2">
                        Tempo de Transição: <strong className="text-white">{telaoSettings.speed} segundos</strong>
                      </label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {[3, 5, 7, 10, 15].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateTelao({ speed: s })}
                            className={`rounded-lg py-2 text-xs font-bold font-mono transition ${
                              telaoSettings.speed === s
                                ? "bg-[#D3B47C] text-[#100E0D] shadow"
                                : "border border-white/10 bg-white/5 text-white/70 hover:text-white"
                            }`}
                          >
                            {s}s
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* QR CODE NO TELÃO */}
                    <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-white block">Exibir QR Code no Telão</span>
                        <small className="text-[0.65rem] text-[#ABA29A]">Permite escanear enquanto assiste</small>
                      </div>
                      <input
                        type="checkbox"
                        checked={telaoSettings.showQrCode}
                        onChange={(e) => handleUpdateTelao({ showQrCode: e.target.checked })}
                        className="h-5 w-5 rounded accent-[#D3B47C] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* BLOCO 2: EFEITOS VISUAIS DE TRANSIÇÃO */}
                  <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/40 p-5 space-y-4">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      EFEITO VISUAL DE TRANSIÇÃO
                    </span>

                    <div className="space-y-2">
                      {[
                        { id: "kenburns", name: "Ken Burns Cinematográfico", desc: "Zoom lento suave e panorâmica artística" },
                        { id: "fade", name: "Dissolvência Suave (Fade)", desc: "Transição sutil de opacidade clássica" },
                        { id: "slide", name: "Deslizamento Lateral (Slide)", desc: "Entrada horizontal contínua de fotos" },
                        { id: "zoom", name: "Zoom In Dinâmico", desc: "Aproximação suave com destaque nos rostos" },
                      ].map((eff) => (
                        <div
                          key={eff.id}
                          onClick={() => handleUpdateTelao({ transitionEffect: eff.id as any })}
                          className={`rounded-xl p-3 border transition cursor-pointer ${
                            telaoSettings.transitionEffect === eff.id
                              ? "border-[#D3B47C] bg-[#D3B47C]/15 text-white shadow-md"
                              : "border-white/10 bg-white/5 text-[#ABA29A] hover:bg-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <strong className="text-xs text-white">{eff.name}</strong>
                            {telaoSettings.transitionEffect === eff.id && (
                              <CheckCircle className="h-4 w-4 text-[#D3B47C]" />
                            )}
                          </div>
                          <p className="text-[0.65rem] text-[#ABA29A] mt-0.5">{eff.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* BLOCO 3: TRILHA SONORA & MÚSICA DO TELÃO */}
                  <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-black/40 p-5 space-y-4">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C] flex items-center gap-1.5">
                      <Music className="h-3.5 w-3.5" />
                      TRILHA SONORA DO TELÃO
                    </span>

                    {/* Toggle Ligar / Desligar Música */}
                    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
                      <div>
                        <span className="text-xs font-semibold text-white block">Áudio no Telão</span>
                        <small className="text-[0.65rem] text-[#ABA29A]">Toca no sistema de som do salão</small>
                      </div>
                      <input
                        type="checkbox"
                        checked={telaoSettings.musicEnabled}
                        onChange={(e) => handleUpdateTelao({ musicEnabled: e.target.checked })}
                        className="h-5 w-5 rounded accent-[#D3B47C] cursor-pointer"
                      />
                    </div>

                    {/* Seletor de Trilha Sonora */}
                    <div>
                      <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-[#ABA29A] mb-1.5">
                        Gênero / Estilo Musical
                      </label>
                      <select
                        value={telaoSettings.musicTrack}
                        onChange={(e) => handleUpdateTelao({ musicTrack: e.target.value as any })}
                        className="w-full rounded-xl border border-white/15 bg-[#1C1816] px-3.5 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                      >
                        <option value="acoustic">🎻 Piano & Cordas (Romântico & Clássico)</option>
                        <option value="jazz">🎷 Jazz Lounge (Elegante & Sofisticado)</option>
                        <option value="bossa">🌊 Bossa Nova & Sunset (Descontraído)</option>
                        <option value="sunset">🌅 Lo-Fi Chill (Sunset & Coquetel)</option>
                        <option value="custom">🔗 URL Personalizada (Música dos Noivos)</option>
                      </select>
                    </div>

                    {/* URL personalizada se selecionado */}
                    {telaoSettings.musicTrack === "custom" && (
                      <div>
                        <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C] mb-1">
                          Link Direto de Áudio (.mp3)
                        </label>
                        <input
                          type="url"
                          value={telaoSettings.customMusicUrl || ""}
                          onChange={(e) => handleUpdateTelao({ customMusicUrl: e.target.value })}
                          placeholder="https://exemplo.com/nossa-musica.mp3"
                          className="w-full rounded-xl border border-white/15 bg-black/60 px-3 py-2 text-xs text-white placeholder-white/20 focus:border-[#D3B47C] focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Volume */}
                    <div>
                      <div className="flex items-center justify-between text-xs text-[#ABA29A] mb-1">
                        <span className="flex items-center gap-1">
                          {telaoSettings.musicVolume > 0 ? <Volume2 className="h-3.5 w-3.5 text-[#D3B47C]" /> : <VolumeX className="h-3.5 w-3.5" />}
                          Volume do Telão
                        </span>
                        <span className="font-mono font-bold text-white">{telaoSettings.musicVolume}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={telaoSettings.musicVolume}
                        onChange={(e) => handleUpdateTelao({ musicVolume: Number(e.target.value) })}
                        className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#D3B47C]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* TOPO: Plaquinha de Mesa & Download */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-[#161311] p-6 shadow-xl">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                    ÁLBUM EM TEMPO REAL & TELÃO
                  </span>
                  <h3 className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                    Dúnia Memories Live
                  </h3>
                  <p className="mt-1 text-xs text-[#ABA29A]">
                    Gere plaquinhas com QR Code para as mesas, projete as fotos dos convidados no telão do salão e baixe todo o acervo.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href="/evento/telao"
                    target="_blank"
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
                  >
                    <Tv className="h-4 w-4" />
                    <span>Abrir Telão ao Vivo</span>
                  </Link>

                  <button
                    onClick={handleCopyUploadLink}
                    className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:border-[#D3B47C]"
                    title="Copiar link para convidados"
                  >
                    <Copy className="h-3.5 w-3.5 text-[#D3B47C]" />
                    <span>Link de Envio</span>
                  </button>

                  <button
                    onClick={handleDownloadZip}
                    className="flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2.5 text-xs font-semibold text-white transition hover:border-[#D3B47C]"
                    title="Baixar todas as fotos originais em ZIP"
                  >
                    <Download className="h-3.5 w-3.5 text-[#D3B47C]" />
                    <span>Baixar Todas (.ZIP)</span>
                  </button>
                </div>
              </div>

              {/* DUAS COLUNAS: GERADOR DE PLAQUINHA DE MESA + CONFIGURAÇÕES */}
              <div className="grid gap-8 lg:grid-cols-12">
                {/* COLUNA 1: GERADOR DO DISPLAY DE MESA COM QR CODE (PRONTO PARA IMPRESSÃO) */}
                <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 lg:col-span-7">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <div>
                      <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                        DISPLAY DE MESA (A6 / 10x15CM)
                      </span>
                      <h4 className="font-serif text-xl text-white">Plaquinha para as Mesas dos Convidados</h4>
                    </div>

                    <button
                      onClick={handlePrintTableCard}
                      className="flex items-center gap-1.5 rounded-xl border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3.5 py-2 text-xs font-bold text-[#D3B47C] hover:bg-[#D3B47C] hover:text-[#100E0D] transition"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>Imprimir Plaquinhas</span>
                    </button>
                  </div>

                  <p className="text-xs text-[#ABA29A] mb-4">
                    Coloque esta plaquinha nos porta-retratos ou menus das mesas. Os convidados apontam a câmera, não precisam de aplicativo e enviam fotos direto para o telão!
                  </p>

                  {/* PREVIEW DO DISPLAY DE MESA (MARFIM & DOURADO LUXUOSO) */}
                  <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border-4 border-[#D3B47C]/40 bg-[#FAF7F2] p-6 text-[#1A1614] shadow-2xl text-center">
                    {/* Monograma / Logo */}
                    <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#D3B47C] text-[#8C6D37] font-serif text-sm font-bold">
                      D
                    </div>
                    <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#8C6D37] block">
                      DÚNIA CITY HALL • LAGO SUL
                    </span>

                    <h5 className="mt-2 font-serif text-2xl font-normal text-[#1A1614]">
                      {event.name}
                    </h5>
                    <p className="text-[0.65rem] text-[#6E6359] uppercase tracking-wider mb-4">
                      {formatEventDate(event.date)}
                    </p>

                    {/* Moldura do QR Code */}
                    <div className="mx-auto my-3 w-40 h-40 rounded-xl border-2 border-[#D3B47C]/60 bg-white p-2.5 shadow-md flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=4&color=120F0D&bgcolor=FFFFFF&data=${encodeURIComponent(
                          typeof window !== "undefined"
                            ? `${window.location.origin}/evento/fotos`
                            : "http://localhost:3000/evento/fotos"
                        )}`}
                        alt="QR Code Álbum de Mesa"
                        width={140}
                        height={140}
                        className="object-contain"
                      />
                    </div>

                    <h6 className="font-serif text-base font-semibold text-[#1A1614] mt-3">
                      Capture a noite conosco!
                    </h6>
                    <p className="mt-1 text-[0.7rem] text-[#5A4F45] leading-relaxed max-w-[260px] mx-auto">
                      Aponte a câmera do seu celular para o QR Code acima, envie suas fotos e compartilhe momentos inesquecíveis no telão do salão.
                    </p>

                    <div className="mt-4 border-t border-[#D3B47C]/30 pt-3 text-[0.6rem] font-bold uppercase tracking-widest text-[#8C6D37]">
                      SEM APLICATIVO • RÁPIDO & SIMPLES
                    </div>
                  </div>
                </div>

                {/* COLUNA 2: CONFIGURAÇÕES DO ÁLBUM & MODERAÇÃO */}
                <div className="space-y-6 lg:col-span-5">
                  <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 shadow-xl">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                      VISIBILIDADE & REGRAS
                    </span>
                    <h4 className="mt-1 font-serif text-xl text-white">Configurações da Galeria</h4>

                    <div className="space-y-5 mt-5">
                      <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div>
                          <h5 className="text-xs font-semibold text-white">Publicar Galeria no Mini-site</h5>
                          <p className="text-[0.68rem] text-[#ABA29A]">Permite aos convidados verem todas as fotos após o evento</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={album.published}
                          onChange={(e) => handleToggleAlbum(e.target.checked)}
                          className="h-6 w-6 rounded accent-[#D3B47C] cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                          Prazo de Disponibilidade Online
                        </label>
                        <select
                          value={album.expiry}
                          onChange={(e) => {
                            const updatedAlbum = { ...album, expiry: Number(e.target.value) }
                            const nextState = { ...state, album: updatedAlbum }
                            setState(nextState)
                            saveEventState(event.id, nextState)
                            notify(`Prazo configurado para ${e.target.value} dias.`)
                          }}
                          className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#1C1816] px-4 py-3 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                        >
                          <option value={30}>30 dias após o evento</option>
                          <option value={60}>60 dias após o evento</option>
                          <option value={90}>90 dias após o evento (Recomendado)</option>
                          <option value={180}>180 dias após o evento</option>
                        </select>
                      </div>

                      <div className="rounded-xl border border-[#D3B47C]/30 bg-[#D3B47C]/5 p-4 text-xs text-[#D3B47C]">
                        <p className="font-semibold">💡 Dica para Cerimonial:</p>
                        <p className="mt-1 text-[#ABA29A] text-[0.7rem] leading-relaxed">
                          O Telão ao Vivo atualiza automaticamente a cada 4 segundos. Se preferir revisar fotos antes de aparecerem no telão, oculte fotos indesejadas pelo mural abaixo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MURAL DE MODERAÇÃO DAS FOTOS DOS CONVIDADOS */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 shadow-xl">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 mb-6">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                      FEED DOS CONVIDADOS
                    </span>
                    <h4 className="font-serif text-2xl text-white">
                      Fotos Enviadas ({album.guestPhotos?.length || 0})
                    </h4>
                  </div>
                  <span className="text-xs text-[#ABA29A]">
                    {(album.guestPhotos?.filter((p) => p.approved) || []).length} fotos ativas no telão
                  </span>
                </div>

                {(!album.guestPhotos || album.guestPhotos.length === 0) ? (
                  <div className="py-12 text-center text-xs text-[#ABA29A]">
                    Nenhuma foto enviada pelos convidados ainda.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {album.guestPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className={`group relative overflow-hidden rounded-2xl border transition-all ${
                          photo.approved
                            ? "border-emerald-500/30 bg-[#141210]"
                            : "border-amber-500/30 bg-black/60 opacity-60"
                        }`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                          <Image
                            src={photo.url}
                            alt={photo.guestName}
                            fill
                            sizes="280px"
                            className="object-cover"
                          />
                          <div className="absolute top-2 left-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                                photo.approved
                                  ? "bg-emerald-500/80 text-white"
                                  : "bg-amber-500/80 text-black font-semibold"
                              }`}
                            >
                              {photo.approved ? "No Telão ✓" : "Oculto"}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 text-xs">
                          <div className="flex items-center justify-between">
                            <strong className="text-white truncate block">{photo.guestName}</strong>
                            <span className="text-[0.6rem] text-[#ABA29A]">
                              {new Date(photo.createdAt).toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          {photo.message && (
                            <p className="mt-1 text-[0.68rem] text-[#ABA29A] italic line-clamp-2">
                              &ldquo;{photo.message}&rdquo;
                            </p>
                          )}

                          <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2.5">
                            <button
                              onClick={() => handleTogglePhotoApproval(photo.id)}
                              className={`flex items-center gap-1 text-[0.68rem] font-semibold transition ${
                                photo.approved
                                  ? "text-amber-400 hover:text-amber-300"
                                  : "text-emerald-400 hover:text-emerald-300"
                              }`}
                            >
                              {photo.approved ? (
                                <>
                                  <EyeOff className="h-3 w-3" />
                                  <span>Ocultar Telão</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="h-3 w-3" />
                                  <span>Exibir no Telão</span>
                                </>
                              )}
                            </button>

                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="text-white/40 hover:text-rose-400 transition p-1"
                              title="Remover foto"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 6: MÓDULOS ATIVOS & UPGRADES PARA O CASAL */}
          {activeTab === "business" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Banner do Plano Contratado */}
              <div className="rounded-3xl border border-[#D3B47C]/30 bg-gradient-to-r from-[#1A1715] via-[#161311] to-[#12100E] p-6 sm:p-8 shadow-xl">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#D3B47C] px-3 py-1 text-[0.65rem] font-bold uppercase tracking-widest text-[#100E0D]">
                        PLANO CONTRATADO
                      </span>
                      <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-[0.65rem] font-bold text-emerald-400">
                        ✓ Ativo no Dúnia City Hall
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl text-white mt-3">{event.plan || "Dúnia Guest OS + Memories"}</h3>
                    <p className="text-xs text-[#ABA29A] mt-1 max-w-xl leading-relaxed">
                      Celebração de <strong>{event.name}</strong> · {formatEventDate(event.date)} no {event.operational?.espaco || event.venue}.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 rounded-2xl bg-black/50 p-4 border border-white/10 text-center min-w-[300px]">
                    <div>
                      <span className="text-[0.65rem] uppercase text-[#ABA29A] block">Código VIP</span>
                      <strong className="text-sm font-mono text-[#D3B47C]">{event.hostAccessCode || "DUNIA26"}</strong>
                    </div>
                    <div>
                      <span className="text-[0.65rem] uppercase text-[#ABA29A] block">Cota WhatsApp</span>
                      <strong className="text-sm font-mono text-emerald-400">{event.whatsappQuota || 350} msgs</strong>
                    </div>
                    <div>
                      <span className="text-[0.65rem] uppercase text-[#ABA29A] block">Vagas Máximas</span>
                      <strong className="text-sm font-mono text-white">{event.maxGuests || 300} pax</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 1: MÓDULOS JÁ ATIVOS E LIBERADOS */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-400">
                      RECURSOS DO SEU EVENTO
                    </span>
                    <h4 className="font-serif text-2xl text-white mt-0.5">Módulos Já Ativos & Inclusos</h4>
                  </div>
                  <span className="text-xs text-[#ABA29A]">Tudo funcionando em tempo real</span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Mini-site */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#161311] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-300">
                          ✓ ATIVO
                        </span>
                        <ExternalLink className="h-4 w-4 text-[#D3B47C]" />
                      </div>
                      <h5 className="font-serif text-lg text-white mt-2">Mini-site Oficial dos Noivos</h5>
                      <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                        Página nobre na internet com contagem regressiva, traje recomendado, localização no Lago Sul e confirmação de presença VIP.
                      </p>
                    </div>
                    <Link
                      href="/evento"
                      target="_blank"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#D3B47C] font-semibold hover:underline"
                    >
                      <span>Visualizar Mini-site</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* RSVP & Convites */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#161311] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-300">
                          ✓ ATIVO
                        </span>
                        <MessageSquare className="h-4 w-4 text-emerald-400" />
                      </div>
                      <h5 className="font-serif text-lg text-white mt-2">RSVP & Disparo WhatsApp</h5>
                      <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                        Código individual de confirmação por convidado com link de auto-preenchimento e bloqueio de penetras.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("guests")}
                      className="mt-4 text-left text-xs text-[#D3B47C] font-semibold hover:underline"
                    >
                      Gerenciar Convidados →
                    </button>
                  </div>

                  {/* Telão Interativo */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#161311] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-300">
                          ✓ ATIVO
                        </span>
                        <Tv className="h-4 w-4 text-[#D3B47C]" />
                      </div>
                      <h5 className="font-serif text-lg text-white mt-2">Telão Interativo Memories</h5>
                      <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                        Fotos tiradas pelos convidados aparecem no telão ao vivo durante a festa com transição Ken Burns e música.
                      </p>
                    </div>
                    <Link
                      href="/evento/telao"
                      target="_blank"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#D3B47C] font-semibold hover:underline"
                    >
                      <span>Abrir Telão do Salão</span>
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  {/* Portaria Check-in */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#161311] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-300">
                          ✓ ATIVO
                        </span>
                        <ShieldCheck className="h-4 w-4 text-sky-400" />
                      </div>
                      <h5 className="font-serif text-lg text-white mt-2">Controle de Portaria QR Code</h5>
                      <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                        Recepção do Dúnia valida a entrada dos convidados por leitor de QR Code com trava anti-duplicidade.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("checkin")}
                      className="mt-4 text-left text-xs text-[#D3B47C] font-semibold hover:underline"
                    >
                      Acessar Portaria →
                    </button>
                  </div>

                  {/* Álbum Colaborativo */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#161311] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-300">
                          ✓ ATIVO
                        </span>
                        <Camera className="h-4 w-4 text-purple-400" />
                      </div>
                      <h5 className="font-serif text-lg text-white mt-2">Álbum Colaborativo de Memórias</h5>
                      <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                        Espaço para os convidados enviarem votos de felicidade e fotos espontâneas que ficam salvas para o casal.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("album")}
                      className="mt-4 text-left text-xs text-[#D3B47C] font-semibold hover:underline"
                    >
                      Ver Fotos Recebidas →
                    </button>
                  </div>

                  {/* Editor em Tempo Real */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-[#161311] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.6rem] font-bold text-emerald-300">
                          ✓ ATIVO
                        </span>
                        <Edit3 className="h-4 w-4 text-amber-400" />
                      </div>
                      <h5 className="font-serif text-lg text-white mt-2">Editor em Tempo Real</h5>
                      <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                        Personalize textos, horários, mensagem aos convidados e tema cromático (Ouro Champagne, Rosé ou Oliva).
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("editor")}
                      className="mt-4 text-left text-xs text-[#D3B47C] font-semibold hover:underline"
                    >
                      Editar Informações →
                    </button>
                  </div>
                </div>
              </div>

              {/* SEÇÃO 2: UPGRADES & SERVIÇOS ADICIONAIS QUE O CASAL PODE ADQUIRIR */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                      SERVIÇOS EXCLUSIVOS DO SALÃO
                    </span>
                    <h4 className="font-serif text-2xl text-white mt-0.5">Upgrades Disponíveis para Adquirir</h4>
                  </div>
                  <span className="text-xs text-[#ABA29A]">Contratados diretamente com o Dúnia</span>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  {/* UPGRADE 1: TOTENS DE MESA EM ACRÍLICO */}
                  <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 flex flex-col justify-between transition hover:border-[#D3B47C]/50 shadow-xl">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#D3B47C]/20 border border-[#D3B47C]/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-[#D3B47C]">
                          EXPERIÊNCIA FÍSICA
                        </span>
                        <strong className="text-sm font-mono text-white">R$ 490</strong>
                      </div>
                      <h5 className="font-serif text-xl text-white mt-3">Totens de Mesa em Acrílico Dourado</h5>
                      <p className="text-xs text-[#ABA29A] mt-2 leading-relaxed">
                        <strong>O que é:</strong> O Dúnia confecciona placas nobres em acrílico com a identidade visual dourada do seu casamento e o QR Code exclusivo da sua celebração, já distribuídas em todas as mesas.
                      </p>
                      <div className="mt-3 rounded-xl bg-black/40 p-3 text-[0.7rem] text-[#DFD5CA] border border-white/5">
                        💡 <em>Seus convidados sentam na mesa, apontam a câmera e sobem fotos instantâneas direto para o telão!</em>
                      </div>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=5561999999999&text=${encodeURIComponent(
                        `Olá equipe Dúnia! Somos o casal ${event.name} (${formatEventDate(event.date)}). Gostaríamos de contratar o upgrade dos Totens de Mesa em Acrílico!`
                      )}`}
                      target="_blank"
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#D3B47C] py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Solicitar com Consultor</span>
                    </a>
                  </div>

                  {/* UPGRADE 2: DISPAROS AUTOMÁTICOS DE LEMBRETE DE RSVP */}
                  <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 flex flex-col justify-between transition hover:border-[#D3B47C]/50 shadow-xl">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                          COMODIDADE MÁXIMA
                        </span>
                        <strong className="text-sm font-mono text-white">R$ 390</strong>
                      </div>
                      <h5 className="font-serif text-xl text-white mt-3">Lembretes Automáticos de RSVP (15 Dias Antes)</h5>
                      <p className="text-xs text-[#ABA29A] mt-2 leading-relaxed">
                        <strong>O que é:</strong> A equipe do salão programa e dispara mensagens amigáveis pelo WhatsApp para todos os convidados que ainda não responderam a confirmação de presença.
                      </p>
                      <div className="mt-3 rounded-xl bg-black/40 p-3 text-[0.7rem] text-[#DFD5CA] border border-white/5">
                        💡 <em>Garante a lista exata fechada para o buffet Dúnia sem que os noivos precisem ligar ou cobrar ninguém.</em>
                      </div>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=5561999999999&text=${encodeURIComponent(
                        `Olá equipe Dúnia! Somos o casal ${event.name} (${formatEventDate(event.date)}). Gostaríamos de contratar o serviço de Lembretes Automáticos de RSVP!`
                      )}`}
                      target="_blank"
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Contratar Lembretes</span>
                    </a>
                  </div>

                  {/* UPGRADE 3: GOOGLE DRIVE VIP COM FOTOS TRATADAS */}
                  <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 flex flex-col justify-between transition hover:border-[#D3B47C]/50 shadow-xl">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-purple-500/20 border border-purple-500/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-purple-300">
                          MEMÓRIAS ETERNAS
                        </span>
                        <strong className="text-sm font-mono text-white">R$ 490</strong>
                      </div>
                      <h5 className="font-serif text-xl text-white mt-3">Acervo Completo no Google Drive VIP</h5>
                      <p className="text-xs text-[#ABA29A] mt-2 leading-relaxed">
                        <strong>O que é:</strong> No dia seguinte à festa, a equipe técnica do Dúnia organiza todas as fotos e mensagens enviadas pelos convidados em uma pasta privativa no Google Drive com link vitalício.
                      </p>
                      <div className="mt-3 rounded-xl bg-black/40 p-3 text-[0.7rem] text-[#DFD5CA] border border-white/5">
                        💡 <em>Download com 1 clique em alta definição e facilidade para compartilhar com pais, padrinhos e família no celular.</em>
                      </div>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=5561999999999&text=${encodeURIComponent(
                        `Olá equipe Dúnia! Somos o casal ${event.name} (${formatEventDate(event.date)}). Gostaríamos de contratar a entrega do Acervo no Google Drive VIP!`
                      )}`}
                      target="_blank"
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      <Camera className="h-3.5 w-3.5 text-purple-400" />
                      <span>Solicitar Drive VIP</span>
                    </a>
                  </div>

                  {/* UPGRADE 4: CONCIERGE DIGITAL DÚNIA */}
                  <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 flex flex-col justify-between transition hover:border-[#D3B47C]/50 shadow-xl">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-sky-500/20 border border-sky-500/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-sky-300">
                          ATENDIMENTO VIP
                        </span>
                        <strong className="text-sm font-mono text-white">R$ 690</strong>
                      </div>
                      <h5 className="font-serif text-xl text-white mt-3">Concierge Digital para Convidados</h5>
                      <p className="text-xs text-[#ABA29A] mt-2 leading-relaxed">
                        <strong>O que é:</strong> Um canal no WhatsApp do Dúnia dedicado a atender seus convidados tirando dúvidas sobre trajes (Passeio Completo/Black Tie), rotas no Lago Sul, horários e lista de presentes.
                      </p>
                      <div className="mt-3 rounded-xl bg-black/40 p-3 text-[0.7rem] text-[#DFD5CA] border border-white/5">
                        💡 <em>Seus convidados são recebidos com a hospitalidade de um hotel 5 estrelas desde antes de chegarem ao salão.</em>
                      </div>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=5561999999999&text=${encodeURIComponent(
                        `Olá equipe Dúnia! Somos o casal ${event.name} (${formatEventDate(event.date)}). Gostaríamos de saber mais sobre o Concierge Digital!`
                      )}`}
                      target="_blank"
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      <Phone className="h-3.5 w-3.5 text-sky-400" />
                      <span>Falar com Concierge</span>
                    </a>
                  </div>

                  {/* UPGRADE 5: HORA EXTRA DE PISTA DE DANÇA */}
                  <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 flex flex-col justify-between transition hover:border-[#D3B47C]/50 shadow-xl">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 text-[0.65rem] font-bold text-amber-300">
                          CELEBRAÇÃO ATÉ O AMANHECER
                        </span>
                        <strong className="text-xs text-[#D3B47C] font-bold">Sob Consulta</strong>
                      </div>
                      <h5 className="font-serif text-xl text-white mt-3">Hora Extra de Balada (Até 06:00h)</h5>
                      <p className="text-xs text-[#ABA29A] mt-2 leading-relaxed">
                        <strong>O que é:</strong> Prorrogação da pista de dança com iluminação cênica de ponta, equipe de apoio, gerador e climatização ativados até o amanhecer do Lago Sul.
                      </p>
                      <div className="mt-3 rounded-xl bg-black/40 p-3 text-[0.7rem] text-[#DFD5CA] border border-white/5">
                        💡 <em>Para festas animadas que merecem viver a noite inteira sem interrupção.</em>
                      </div>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=5561999999999&text=${encodeURIComponent(
                        `Olá equipe Dúnia! Somos o casal ${event.name} (${formatEventDate(event.date)}). Gostaríamos de consultar disponibilidade de hora extra para nossa festa!`
                      )}`}
                      target="_blank"
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      <Clock className="h-3.5 w-3.5 text-amber-300" />
                      <span>Consultar com Gerência</span>
                    </a>
                  </div>

                  {/* UPGRADE 6: PACOTE COMPLETO EXPERIÊNCIA IMPERIAL */}
                  <div className="rounded-3xl border-2 border-[#D3B47C] bg-gradient-to-b from-[#1C1816] to-[#12100E] p-6 flex flex-col justify-between shadow-2xl relative">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#D3B47C] px-2.5 py-0.5 text-[0.65rem] font-bold text-[#100E0D]">
                          PACOTE TUDO INCLUSO
                        </span>
                        <strong className="text-sm font-mono text-[#D3B47C]">R$ 1.290</strong>
                      </div>
                      <h5 className="font-serif text-xl text-white mt-3">Combo Experiência Imperial</h5>
                      <p className="text-xs text-[#ABA29A] mt-2 leading-relaxed">
                        <strong>O que é:</strong> Todos os adicionais digitais combinados: Totens de Mesa Acrílicos + Lembretes Automáticos WhatsApp + Entrega no Google Drive VIP + Suporte Técnico no Telão.
                      </p>
                      <div className="mt-3 rounded-xl bg-[#D3B47C]/10 p-3 text-[0.7rem] text-[#D3B47C] border border-[#D3B47C]/20">
                        ⭐ <em>Economia de R$ 480 contratando o combo completo para o casamento!</em>
                      </div>
                    </div>

                    <a
                      href={`https://api.whatsapp.com/send?phone=5561999999999&text=${encodeURIComponent(
                        `Olá equipe Dúnia! Somos o casal ${event.name} (${formatEventDate(event.date)}). Gostaríamos de contratar o Combo Experiência Imperial completo para o nosso casamento!`
                      )}`}
                      target="_blank"
                      className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#D3B47C] py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 shadow transition"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Contratar Combo Imperial</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* BANNER DE SUPORTE PRESENCIAL NO LAGO SUL */}
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-center">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                  ATENDIMENTO EXCLUSIVO DÚNIA CITY HALL
                </span>
                <p className="mt-1 text-xs text-[#ABA29A] max-w-xl mx-auto leading-relaxed">
                  Todos os módulos e upgrades são homologados, faturados e acompanhados diretamente pela equipe do salão. Dúvidas sobre seu contrato? Fale com sua cerimonialista ou com a gerência do Dúnia pelo WhatsApp oficial.
                </p>
              </div>
            </div>
          )}

          {/* TAB: REVISTA DÚNIA (EDITORIAL & INSPIRAÇÃO) */}
          {activeTab === "revista" && (
            <div className="space-y-8 animate-fadeIn">
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                      CURADORIA EDITORIAL DÚNIA
                    </span>
                    <h2 className="mt-1 font-serif text-2xl lg:text-3xl text-white">
                      Revista Dúnia — Histórias, Inspiração & Alta Gastronomia
                    </h2>
                    <p className="mt-1 text-xs text-[#ABA29A] max-w-2xl leading-relaxed">
                      Artigos exclusivos e referências de cenografia, iluminação arquitetônica e alta gastronomia para inspirar cada detalhe da sua celebração.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {["all", "casamento", "inspiracao", "eventos", "gastronomia"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setJournalFilter(cat)}
                        className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                          journalFilter === cat
                            ? "bg-[#D3B47C] text-[#100E0D]"
                            : "border border-white/10 bg-[#1C1816] text-[#ABA29A] hover:text-white"
                        }`}
                      >
                        {cat === "all" ? "Todos" : cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid de Artigos */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {journalArticles
                  .filter((a) => a.status !== "rascunho")
                  .filter((a) => journalFilter === "all" || a.category === journalFilter)
                  .map((art) => (
                    <article
                      key={art.id}
                      onClick={() => setSelectedArticleModal(art)}
                      className="group cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#161311] shadow-lg transition duration-300 hover:-translate-y-1 hover:border-[#D3B47C]/50"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                        <Image
                          src={art.image || "/assets/casal.jpg"}
                          alt={art.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-105 filter brightness-95"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-black/20 to-transparent" />
                        <span className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#D3B47C] backdrop-blur-md border border-[#D3B47C]/20">
                          {art.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                        <div>
                          <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#ABA29A]">
                            {art.label || "REVISTA DÚNIA"}
                          </span>
                          <h3 className="mt-1 font-serif text-lg text-white font-normal line-clamp-2 group-hover:text-[#D3B47C] transition">
                            {art.title}
                          </h3>
                          <p className="mt-2 text-xs text-[#ABA29A] line-clamp-2 leading-relaxed">
                            {art.text}
                          </p>
                        </div>

                        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-[0.7rem] text-[#ABA29A]">
                          <span>{art.author || "Redação Dúnia"}</span>
                          <span className="text-[#D3B47C] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            Ler artigo →
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
              </div>
            </div>
          )}

          {/* TAB: CRIADOR DE CELEBRAÇÕES & EDITOR DOS TIPOS DE EVENTOS DA HOME */}
          {activeTab === "criador" && (
            <div className="space-y-8 animate-fadeIn">
              {/* Top Banner de Gestão */}
              <div className="rounded-2xl border border-[#D3B47C]/30 bg-[#161311] p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                        PERSONALIZAÇÃO DA HOME • SEÇÃO CENÁRIOS
                      </span>
                      <span className="rounded-full bg-[#D3B47C]/10 px-2.5 py-0.5 text-[0.65rem] font-semibold text-[#D3B47C] border border-[#D3B47C]/20">
                        {celebrationCards.filter((c) => c.active !== false).length} ativos na Home
                      </span>
                    </div>
                    <h2 className="mt-1 font-serif text-2xl lg:text-3xl text-white">
                      Tipos de Celebrações & Eventos da Home
                    </h2>
                    <p className="mt-1 text-xs text-[#ABA29A] max-w-2xl leading-relaxed">
                      Aqui você edita os tipos de celebração, fotos reais do acervo Dúnia, títulos e descrições que aparecem na Home (<code className="text-[#D3B47C]">/#celebrations</code>). Qualquer alteração é salva e refletida instantaneamente na vitrine.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href="/#celebrations"
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#D3B47C]/40 bg-[#1C1816] px-4 py-2.5 text-xs font-semibold text-[#D3B47C] hover:bg-[#D3B47C]/10 transition"
                    >
                      <span>Ver na Home ↗</span>
                    </Link>
                    <button
                      onClick={handleResetCelebrationCards}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-xs text-[#ABA29A] hover:text-white hover:border-white/20 transition"
                      title="Restaurar os 6 cards originais do Dúnia"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>Restaurar Padrão</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingCard(true)
                        setEditingCard({
                          id: `celebration-${Date.now()}`,
                          category: "NOVA CELEBRAÇÃO",
                          title: "Título da Celebração",
                          description: "Breve descrição sobre como o Dúnia acolhe este tipo de celebração com sofisticação absoluta.",
                          image: "/assets/casal.jpg",
                          imagePosition: "object-center",
                          href: "/casamento",
                          buttonText: "VER DETALHES",
                          hasMinisiteBadge: false,
                          active: true,
                          order: celebrationCards.length + 1,
                        })
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] hover:bg-[#D3B47C]/90 shadow transition"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Novo Tipo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid dos Cards de Celebração da Home */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {celebrationCards.map((card) => (
                  <div
                    key={card.id}
                    className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition duration-300 ${
                      card.active === false
                        ? "border-white/5 bg-[#12100E] opacity-60"
                        : "border-white/10 bg-[#161311] hover:border-[#D3B47C]/50 shadow-lg"
                    }`}
                  >
                    {/* Imagem do Card */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/50">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className={`object-cover ${card.imagePosition || "object-[center_12%]"} filter brightness-95`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-black/20 to-transparent" />

                      {/* Badges sobrepostos */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="rounded-md bg-black/75 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#D3B47C] backdrop-blur-md border border-[#D3B47C]/20">
                          {card.category}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider backdrop-blur-md ${
                            card.active !== false
                              ? "bg-emerald-900/80 text-emerald-300 border border-emerald-500/30"
                              : "bg-red-900/80 text-red-300 border border-red-500/30"
                          }`}
                        >
                          {card.active !== false ? "Na Home" : "Oculto"}
                        </span>
                      </div>

                      {/* Botão rápido para trocar foto */}
                      <button
                        onClick={() => {
                          setIsCreatingCard(false)
                          setEditingCard({ ...card })
                        }}
                        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/80 px-2.5 py-1.5 text-[0.68rem] font-semibold text-white backdrop-blur-md border border-white/20 hover:border-[#D3B47C] hover:text-[#D3B47C] transition cursor-pointer"
                      >
                        <Camera className="h-3 w-3" />
                        <span>Trocar Foto</span>
                      </button>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                      <div>
                        <span className="text-[0.62rem] font-bold uppercase tracking-widest text-[#D3B47C]/80">
                          {card.category}
                        </span>
                        <h3 className="mt-1 font-serif text-lg text-white font-normal line-clamp-1">
                          {card.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-[#ABA29A] line-clamp-2 leading-relaxed">
                          {card.description}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between text-[0.7rem] text-[#ABA29A]">
                          <span className="font-mono text-white/60 truncate max-w-[140px]">{card.href}</span>
                          <span className="text-[#D3B47C] font-semibold uppercase">{card.buttonText || "VER DETALHES"}</span>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1">
                          <button
                            onClick={() => {
                              setIsCreatingCard(false)
                              setEditingCard({ ...card })
                            }}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#D3B47C]/30 bg-[#1C1816] py-2 text-xs font-semibold text-[#D3B47C] hover:bg-[#D3B47C] hover:text-[#100E0D] transition"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            <span>Editar Card & Imagem</span>
                          </button>

                          <button
                            onClick={() => handleToggleCardActive(card.id, card.active === false ? true : false)}
                            className="rounded-xl border border-white/10 bg-[#1C1816] p-2 text-[#ABA29A] hover:text-white transition"
                            title={card.active === false ? "Tornar visível na Home" : "Ocultar da Home"}
                          >
                            {card.active === false ? <Eye className="h-4 w-4 text-amber-400" /> : <EyeOff className="h-4 w-4" />}
                          </button>

                          {celebrationCards.length > 1 && (
                            <button
                              onClick={() => handleDeleteCard(card.id)}
                              className="rounded-xl border border-red-500/20 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 transition"
                              title="Remover tipo de celebração"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SEÇÃO 2: AGENDAMENTO OPERACIONAL DE CELEBRAÇÕES */}
              <div className="mt-12 rounded-2xl border border-white/10 bg-[#161311] p-6 lg:p-8">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                  AGENDA OPERACIONAL DÚNIA CITY HALL
                </span>
                <h3 className="mt-1 font-serif text-2xl text-white">Cadastrar Nova Celebração na Agenda</h3>
                <p className="mt-1 text-xs text-[#ABA29A] max-w-xl">
                  Adicione uma nova data oficial de celebração no sistema para associar anfitriões, convidados e gestão do evento.
                </p>

                <form onSubmit={handleCreateCelebrationSubmit} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Nome da Celebração
                    </label>
                    <input
                      type="text"
                      value={criadorName}
                      onChange={(e) => setCriadorName(e.target.value)}
                      placeholder="Ex: Amanda & Lucas ou 15 Anos Laura"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Tipo de Evento
                    </label>
                    <select
                      value={criadorCategory}
                      onChange={(e) => setCriadorCategory(e.target.value as any)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#1C1816] px-3.5 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                    >
                      <option value="Casamento">Casamento</option>
                      <option value="15 Anos">15 Anos</option>
                      <option value="Corporativo / Gala">Corporativo / Gala</option>
                      <option value="Bodas">Bodas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Data do Evento
                    </label>
                    <input
                      type="date"
                      value={criadorDate}
                      onChange={(e) => setCriadorDate(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[0.7rem] font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Espaço Contratado
                    </label>
                    <select
                      value={criadorVenue}
                      onChange={(e) => setCriadorVenue(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#1C1816] px-3.5 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                    >
                      <option value="Salão Imperial">Salão Imperial (Até 1.200 pax)</option>
                      <option value="Espaço Cristal">Espaço Cristal (Até 400 pax)</option>
                      <option value="Jardim Imperial">Jardim Imperial & Espelho</option>
                      <option value="Todos os Espaços">Todos os Espaços Integrados</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Gravar na Agenda Operacional</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de Edição de Card de Celebração (Home) com Seletor Visual de Fotos */}
      {editingCard && (
        <div
          onClick={() => {
            setEditingCard(null)
            setIsCreatingCard(false)
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#161311] shadow-2xl max-h-[92vh] overflow-y-auto p-6 sm:p-8"
          >
            <button
              onClick={() => {
                setEditingCard(null)
                setIsCreatingCard(false)
              }}
              className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black cursor-pointer border border-white/20"
              aria-label="Fechar"
            >
              ✕
            </button>

            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                EDITOR VISUAL • SEÇÃO CENÁRIOS DA HOME
              </span>
              <h2 className="mt-1 font-serif text-2xl text-white sm:text-3xl">
                {isCreatingCard ? "Cadastrar Novo Tipo de Celebração" : `Editar: ${editingCard.category}`}
              </h2>
              <p className="mt-1 text-xs text-[#ABA29A]">
                Altere a imagem do acervo, título, textos e links. Visualize o resultado antes de salvar na Home.
              </p>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-12">
              {/* COLUNA ESQUERDA: PREVIEW DO CARD & SELEÇÃO DE FOTO DO ACERVO */}
              <div className="lg:col-span-6 space-y-5">
                {/* Visual Preview do Card */}
                <div>
                  <label className="block text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C] mb-2">
                    Pré-visualização do Card na Home
                  </label>
                  <div className="relative overflow-hidden rounded-xl border border-[#D3B47C]/40 bg-[#141210] shadow-xl">
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
                      <Image
                        src={editingCard.image || "/assets/casal.jpg"}
                        alt={editingCard.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className={`object-cover ${editingCard.imagePosition || "object-[center_12%]"} filter brightness-95`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-black/20 to-transparent" />
                      <span className="absolute top-3 left-3 rounded-md bg-black/75 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-[#D3B47C] backdrop-blur-md border border-[#D3B47C]/20">
                        {editingCard.category || "CATEGORIA"}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <h4 className="font-serif text-lg text-white font-normal line-clamp-1">
                        {editingCard.title || "Título da Celebração"}
                      </h4>
                      <p className="text-xs text-[#ABA29A] line-clamp-2 leading-relaxed">
                        {editingCard.description || "Descrição curta da celebração..."}
                      </p>
                      <div className="flex items-center justify-between border-t border-white/10 pt-2.5 text-[0.7rem]">
                        <span className="text-[#D3B47C] font-semibold uppercase">
                          {editingCard.buttonText || "VER DETALHES"} →
                        </span>
                        {editingCard.hasMinisiteBadge && commercialMode !== "light" && (
                          <span className="text-[0.6rem] text-white/50 uppercase tracking-wider">
                            Mini-site incluso
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seletor Visual de Fotos do Acervo Dúnia */}
                <div className="rounded-2xl border border-white/10 bg-[#12100E] p-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[0.7rem] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-[#D3B47C]" />
                      <span>Fotos do Acervo Dúnia</span>
                    </label>
                    <span className="text-[0.65rem] text-[#ABA29A]">Clique para aplicar</span>
                  </div>

                  {/* Filtros de categoria do acervo */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {[
                      { key: "all", label: "Todas" },
                      { key: "casamento", label: "Casamentos" },
                      { key: "debutante", label: "15 Anos" },
                      { key: "corporativo", label: "Corporativo" },
                      { key: "buffet", label: "Buffet" },
                      { key: "salao", label: "Salão" },
                      { key: "jardim", label: "Jardim" },
                    ].map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setSelectedPhotoCategory(f.key)}
                        className={`rounded-lg px-2.5 py-1 text-[0.65rem] font-medium transition ${
                          selectedPhotoCategory === f.key
                            ? "bg-[#D3B47C] text-[#100E0D] font-bold"
                            : "bg-white/5 text-[#ABA29A] hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Grid de miniaturas do acervo */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                    {ACERVO_DUNIA_PHOTOS
                      .filter((p) => selectedPhotoCategory === "all" || p.category === selectedPhotoCategory)
                      .map((p) => (
                        <button
                          key={p.url}
                          type="button"
                          onClick={() => setEditingCard({ ...editingCard, image: p.url })}
                          title={p.label}
                          className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                            editingCard.image === p.url
                              ? "border-[#D3B47C] scale-95 shadow-md shadow-[#D3B47C]/30"
                              : "border-transparent opacity-75 hover:opacity-100 hover:border-white/40"
                          }`}
                        >
                          <Image src={p.url} alt={p.label} fill sizes="80px" className="object-cover" />
                          {editingCard.image === p.url && (
                            <div className="absolute inset-0 bg-[#D3B47C]/20 flex items-center justify-center">
                              <span className="text-white text-xs drop-shadow font-bold">✓</span>
                            </div>
                          )}
                        </button>
                      ))}
                  </div>

                  {/* URL customizada / Externa */}
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <label className="block text-[0.65rem] font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Ou digite URL customizada da imagem
                    </label>
                    <input
                      type="text"
                      value={editingCard.image}
                      onChange={(e) => setEditingCard({ ...editingCard, image: e.target.value })}
                      placeholder="/assets/casal.jpg ou https://..."
                      className="mt-1 w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs font-mono text-white focus:border-[#D3B47C] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA: CAMPOS DO FORMULÁRIO */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                    Categoria / Badge Superior
                  </label>
                  <input
                    type="text"
                    value={editingCard.category}
                    onChange={(e) => setEditingCard({ ...editingCard, category: e.target.value })}
                    placeholder="Ex: CASAMENTOS DOS SONHOS"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                    required
                  />
                  <small className="text-[0.65rem] text-[#ABA29A] mt-0.5 block">Exibido em caixa alta com acabamento dourado</small>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                    Título Principal do Card
                  </label>
                  <input
                    type="text"
                    value={editingCard.title}
                    onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                    placeholder="Ex: O Cenário dos Sonhos Para o Sim"
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-white focus:border-[#D3B47C] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                    Descrição Curta (Linha Fina)
                  </label>
                  <textarea
                    rows={3}
                    value={editingCard.description}
                    onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
                    placeholder="Texto conciso explicando o diferencial deste tipo de celebração..."
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none leading-relaxed"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Link de Destino
                    </label>
                    <input
                      type="text"
                      value={editingCard.href}
                      onChange={(e) => setEditingCard({ ...editingCard, href: e.target.value })}
                      placeholder="/casamento ou /contato"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs font-mono text-white focus:border-[#D3B47C] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      value={editingCard.buttonText || "VER DETALHES"}
                      onChange={(e) => setEditingCard({ ...editingCard, buttonText: e.target.value })}
                      placeholder="CONHECER ESPAÇO"
                      className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#ABA29A]">
                    Alinhamento Vertical da Foto
                  </label>
                  <select
                    value={editingCard.imagePosition || "object-[center_12%]"}
                    onChange={(e) => setEditingCard({ ...editingCard, imagePosition: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-white/15 bg-[#1C1816] px-3.5 py-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                  >
                    <option value="object-[center_8%]">Foco no Topo Suave (8%)</option>
                    <option value="object-[center_12%]">Foco Clássico Rostos / Pessoas (12%)</option>
                    <option value="object-[center_18%]">Foco Intermediário Mesas & Doces (18%)</option>
                    <option value="object-[center_25%]">Foco Cenográfico Ampliado (25%)</option>
                    <option value="object-[center_35%]">Foco Jardins / Ar Livre (35%)</option>
                    <option value="object-center">Centro Absoluto (50%)</option>
                  </select>
                </div>

                {/* Opções de visualização */}
                <div className="space-y-3 pt-3 border-t border-white/10">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingCard.active !== false}
                      onChange={(e) => setEditingCard({ ...editingCard, active: e.target.checked })}
                      className="h-5 w-5 rounded accent-[#D3B47C] cursor-pointer"
                    />
                    <span className="text-xs text-white">Exibir este card na seção Cenários da Home</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingCard.hasMinisiteBadge)}
                      onChange={(e) => setEditingCard({ ...editingCard, hasMinisiteBadge: e.target.checked })}
                      className="h-5 w-5 rounded accent-[#D3B47C] cursor-pointer"
                    />
                    <span className="text-xs text-[#ABA29A]">
                      Incluir selo &ldquo;Mini-site incluso&rdquo; (visível apenas no plano Experience OS)
                    </span>
                  </label>
                </div>

                {/* Botões de Ação */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCard(null)
                      setIsCreatingCard(false)
                    }}
                    className="rounded-xl border border-white/10 bg-transparent px-5 py-2.5 text-xs text-[#ABA29A] hover:text-white transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveCelebrationCard()}
                    className="rounded-xl bg-[#D3B47C] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] hover:bg-[#D3B47C]/90 shadow transition"
                  >
                    Salvar Alterações na Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Leitura da Revista Dúnia */}
      {selectedArticleModal && (
        <div
          onClick={() => setSelectedArticleModal(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-[#161311] shadow-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8"
          >
            <button
              onClick={() => setSelectedArticleModal(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black cursor-pointer"
              aria-label="Fechar"
            >
              ✕
            </button>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
              {selectedArticleModal.label || "REVISTA DÚNIA"}
            </span>
            <h2 className="font-serif text-2xl text-white sm:text-3xl mt-2 leading-snug">
              {selectedArticleModal.title}
            </h2>
            <div className="mt-2 flex items-center gap-3 text-xs text-[#ABA29A]">
              <span>{selectedArticleModal.author || "Redação Dúnia"}</span>
              <span>•</span>
              <span>{selectedArticleModal.readTime || "4 min"} de leitura</span>
            </div>
            <div className="relative my-6 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black/50">
              <Image
                src={selectedArticleModal.image || "/assets/casal.jpg"}
                alt={selectedArticleModal.title}
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm font-serif italic text-[#D3B47C]/90 leading-relaxed border-l-2 border-[#D3B47C] pl-4 my-4">
              &ldquo;{selectedArticleModal.text}&rdquo;
            </p>
            <div className="text-xs sm:text-sm text-white/90 leading-relaxed space-y-4 whitespace-pre-line">
              {selectedArticleModal.article}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Convite & QR Code */}
      {selectedGuestQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-[#161311] p-8 text-center shadow-2xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              DÚNIA CONVITE DIGITAL
            </span>
            <h3 className="mt-2 font-serif text-2xl text-white">{selectedGuestQr.name}</h3>
            <p className="text-xs text-[#ABA29A]">{selectedGuestQr.seats} vagas autorizadas</p>

            <div className="my-6 flex justify-center">
              <div className="overflow-hidden rounded-2xl border-4 border-white bg-white p-3 shadow-lg">
                <Image
                  src={`/assets/qr/${String(selectedGuestQr.id).padStart(3, "0")}.png`}
                  alt={`QR ${selectedGuestQr.code}`}
                  width={180}
                  height={180}
                  className="h-44 w-44 object-contain"
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-black/50 p-3 font-mono text-base font-bold tracking-widest text-[#D3B47C]">
              {selectedGuestQr.code}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(selectedGuestQr.code)
                  setCopiedCode(true)
                  setTimeout(() => setCopiedCode(false), 2000)
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#D3B47C] py-2.5 text-xs font-bold text-[#100E0D] transition hover:bg-[#D3B47C]/90"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copiedCode ? "Copiado!" : "Copiar Código"}</span>
              </button>
              <button
                onClick={() => setSelectedGuestQr(null)}
                className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: DISPARO EM MASSA WHATSAPP */}
      {showBulkSendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#D3B47C]/40 bg-[#161311] p-6 sm:p-8 text-center shadow-2xl">
            <button
              onClick={() => setShowBulkSendModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <Send className="h-6 w-6" />
            </div>

            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              DISPARO INTELIGENTE DE CONVITES
            </span>
            <h3 className="mt-1 font-serif text-2xl text-white">Disparo em Massa via WhatsApp</h3>
            <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
              O sistema irá enviar mensagens personalizadas com o código exclusivo e link de confirmação para cada convidado pendente.
            </p>

            <div className="my-6 rounded-2xl border border-white/10 bg-black/40 p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between text-[#ABA29A]">
                <span>Convidados pendentes na fila:</span>
                <strong className="text-white">
                  {guests.filter((g) => !g.invitationStatus || g.invitationStatus === "nao_enviado").length}
                </strong>
              </div>
              <div className="flex justify-between text-[#ABA29A]">
                <span>Delay anti-bloqueio entre mensagens:</span>
                <strong className="text-emerald-400">800ms ~ 1.5s (Seguro)</strong>
              </div>
              <div className="flex justify-between text-[#ABA29A]">
                <span>Canal de envio:</span>
                <strong className="text-white">Evolution API / WhatsApp Gateway</strong>
              </div>
            </div>

            {bulkSending && (
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-[#D3B47C]">
                  <span>Disparando convites...</span>
                  <span>{bulkSendProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D3B47C] to-emerald-400 transition-all duration-300"
                    style={{ width: `${bulkSendProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3">
              <button
                onClick={handleStartBulkSend}
                disabled={bulkSending}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition hover:scale-105 disabled:opacity-50"
              >
                {bulkSending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span>{bulkSending ? "Enviando Fila..." : "Iniciar Disparo em Massa"}</span>
              </button>

              <button
                onClick={() => setShowBulkSendModal(false)}
                disabled={bulkSending}
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMPORTAÇÃO DE CONVIDADOS EM LOTE */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl rounded-3xl border border-white/20 bg-[#161311] p-6 sm:p-8 text-left shadow-2xl">
            <button
              onClick={() => setShowBatchModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              CADASTRO RÁPIDO
            </span>
            <h3 className="mt-1 font-serif text-2xl text-white">Importar Lista de Convidados em Lote</h3>
            <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
              Cole sua lista de convidados abaixo. Você pode copiar direto do Excel ou WhatsApp no formato:
            </p>

            <div className="my-3 rounded-xl border border-white/10 bg-black/50 p-3 font-mono text-[0.7rem] text-[#D3B47C]">
              Ana Carolina Ribeiro, 61991234567, 2<br />
              Carlos Eduardo & Família, 61988887777, 4<br />
              Mariana Fernandes, 61977776666, 1
            </div>

            <textarea
              rows={6}
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder="Cole os nomes e contatos aqui..."
              className="w-full rounded-2xl border border-white/15 bg-black/40 p-4 text-xs text-white placeholder-white/25 focus:border-[#D3B47C] focus:outline-none font-mono"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowBatchModal(false)}
                className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleProcessBatchImport}
                className="rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
              >
                Processar e Criar Códigos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PERSONALIZAR MENSAGEM DO WHATSAPP */}
      {showTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#161311] p-6 sm:p-8 text-left shadow-2xl">
            <button
              onClick={() => setShowTemplateModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              CUSTOMIZAÇÃO DA MENSAGEM
            </span>
            <h3 className="mt-1 font-serif text-2xl text-white">Template do Convite WhatsApp</h3>
            <p className="mt-1 text-xs text-[#ABA29A]">
              Edite o texto que cada convidado receberá. As tags entre chaves serão substituídas automaticamente:
            </p>

            <div className="my-3 flex flex-wrap gap-1.5 text-[0.65rem] font-mono text-[#D3B47C]">
              <span className="bg-black/60 px-2 py-1 rounded border border-white/10">{"{nome}"}</span>
              <span className="bg-black/60 px-2 py-1 rounded border border-white/10">{"{codigo}"}</span>
              <span className="bg-black/60 px-2 py-1 rounded border border-white/10">{"{vagas}"}</span>
              <span className="bg-black/60 px-2 py-1 rounded border border-white/10">{"{evento}"}</span>
              <span className="bg-black/60 px-2 py-1 rounded border border-white/10">{"{data}"}</span>
              <span className="bg-black/60 px-2 py-1 rounded border border-white/10">{"{horario}"}</span>
              <span className="bg-black/60 px-2 py-1 rounded border border-white/10">{"{link_rsvp}"}</span>
            </div>

            <textarea
              rows={7}
              value={inviteTemplate}
              onChange={(e) => setInviteTemplate(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/40 p-4 text-xs text-white focus:border-[#D3B47C] focus:outline-none font-sans leading-relaxed"
            />

            {/* PREVIEW DO WHATSAPP */}
            <div className="mt-4 rounded-2xl bg-[#0b141a] p-4 border border-[#202c33]">
              <span className="text-[0.65rem] font-bold text-[#8696a0] uppercase tracking-wider block mb-2">
                Prévia de Exibição no WhatsApp do Convidado:
              </span>
              <div className="max-w-md rounded-2xl bg-[#005c4b] p-3 text-xs text-white whitespace-pre-line shadow">
                {buildPersonalizedMessage({
                  id: 1,
                  name: "Ana Carolina",
                  code: "DUNIA-001",
                  seats: 2,
                  email: "",
                  status: "pending",
                  checkedIn: false,
                  updatedAt: Date.now(),
                })}
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
              >
                Salvar Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ESTRATÉGIA DE FERRAMENTAS & PRECIFICAÇÃO PARA O DÚNIA */}
      {showAutomationServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl border border-[#D3B47C]/40 bg-[#161311] p-6 sm:p-8 text-left shadow-2xl">
            <button
              onClick={() => setShowAutomationServiceModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              PROPOSTA DE VALOR & DIFERENCIAL COMERCIAL
            </span>
            <h3 className="mt-1 font-serif text-2xl text-white">Ferramentas de Automação & Custos</h3>
            <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
              O Dúnia pode transformar o envio automatizado de convites e RSVP em um serviço premium de alto valor agregado com margem de lucro de até 90%:
            </p>

            {/* TABELA DE FERRAMENTAS */}
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-emerald-300">1. Evolution API (Recomendada / VPS Hostinger KVM4)</strong>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                    Custo por mensagem: R$ 0,00
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                  Roda em container Docker na mesma VPS KVM4 da Hostinger. Conecta o WhatsApp do casal ou do Dúnia escaneando o QR Code. Disparos ilimitados sem taxa por envio!
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-white">2. Z-API / Baileys Gateway Gerenciado</strong>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold text-[#D3B47C]">
                    R$ 49 ~ 99/mês fixo
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                  Infraestrutura gerenciada no Brasil. Sem cobrança por mensagem enviada, suporta múltiplos eventos simultâneos.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between">
                  <strong className="text-sm text-white">3. Meta WhatsApp Cloud API (Oficial)</strong>
                  <span className="rounded bg-white/10 px-2 py-0.5 text-[0.65rem] font-bold text-white/70">
                    ~R$ 0,38 por mensagem
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#ABA29A] leading-relaxed">
                  Exige aprovação de modelos pela Meta e verificação comercial. Ideal para eventos corporativos de grande porte com selo verde oficial.
                </p>
              </div>
            </div>

            {/* PACOTES COMERCIAIS PARA COBRAR DO CLIENTE */}
            <h4 className="mt-6 font-serif text-xl text-white">Modelos de Precificação Sugeridos para o Dúnia:</h4>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-3.5">
                <span className="text-[0.65rem] text-[#D3B47C] font-bold uppercase">Pacote Básico</span>
                <h5 className="font-serif text-base text-white mt-0.5">Incluso no Salão</h5>
                <p className="text-[0.68rem] text-[#ABA29A] mt-1">Disparo manual com 1 clique pelo WhatsApp Web dos noivos.</p>
              </div>

              <div className="rounded-2xl border border-[#D3B47C] bg-[#D3B47C]/10 p-3.5">
                <span className="text-[0.65rem] text-[#D3B47C] font-bold uppercase">Automação VIP</span>
                <h5 className="font-serif text-base text-white mt-0.5">R$ 490,00</h5>
                <p className="text-[0.68rem] text-[#ABA29A] mt-1">Disparo em lote automatizado com códigos e confirmação de leitura.</p>
              </div>

              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3.5">
                <span className="text-[0.65rem] text-emerald-400 font-bold uppercase">Concierge Total</span>
                <h5 className="font-serif text-base text-white mt-0.5">R$ 890,00</h5>
                <p className="text-[0.68rem] text-[#ABA29A] mt-1">Disparo + Lembretes D-30 e D-15 + Gestão de vagas e acompanhantes.</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAutomationServiceModal(false)}
                className="rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RÁPIDO: ADICIONAR TELEFONE PARA CONVIDADO SEM NÚMERO */}
      {selectedGuestForPhone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/20 bg-[#161311] p-6 text-center shadow-2xl">
            <button
              onClick={() => setSelectedGuestForPhone(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-4 w-4" />
            </button>

            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              WHATSAPP DO CONVIDADO
            </span>
            <h3 className="mt-1 font-serif text-xl text-white">{selectedGuestForPhone.name}</h3>
            <p className="mt-1 text-xs text-[#ABA29A]">
              Insira o número de WhatsApp deste convidado para enviar o convite:
            </p>

            <form onSubmit={handleSavePhoneAndSend} className="mt-4 space-y-4">
              <input
                type="tel"
                required
                autoFocus
                placeholder="Ex: 61 99123-4567"
                value={quickPhoneInput}
                onChange={(e) => setQuickPhoneInput(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-black/50 px-4 py-3 text-center text-sm font-mono text-white placeholder-white/25 focus:border-[#D3B47C] focus:outline-none"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-emerald-500 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-emerald-600 transition"
                >
                  Salvar & Abrir WhatsApp ↗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
