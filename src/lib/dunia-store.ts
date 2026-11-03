export interface DuniaGuest {
  id: number
  name: string
  email: string
  phone?: string
  seats: number
  status: "confirmed" | "pending" | "declined"
  checkedIn: boolean
  checkedAt?: number
  code: string
  updatedAt: number
  message?: string
  invitedVia?: "whatsapp" | "email" | "manual"
  invitedAt?: number
  invitationStatus?: "nao_enviado" | "enviado" | "entregue" | "lido"
  table?: string
  dietary?: "padrao" | "vegetariano" | "vegano" | "celiaco" | "sem_lactose" | "kids"
}

export interface DuniaEventModules {
  rsvpWhatsApp: boolean        // Disparo e gestão de convites WhatsApp
  liveTelao: boolean           // Telão interativo e controle remoto
  giftListPix: boolean         // Lista de presentes com chave Pix
  guestAlbum: boolean          // Álbum colaborativo dos convidados (Memories)
  schedule: boolean            // Cronograma & Roteiro dos Noivos
  tableQrCode: boolean         // Totem / Display QR Code nas mesas
  receptionCheckin: boolean    // Portaria & Check-in Anti-duplicidade
  musicPlaylist: boolean       // Trilha sonora e playlist dos noivos
  saveTheDate: boolean         // Lembrete e Save the Date antecipado
}

export interface DuniaEventOperational {
  espaco: "Salão Imperial" | "Espaço Cristal" | "Jardim Imperial" | "Lounge Nobre" | "Todos os Espaços"
  tipoEvento: "Casamento" | "15 Anos" | "Corporativo / Gala" | "Bodas" | "Formatura"
  horarioMontagem: string      // ex: "08:00"
  horarioInicio: string        // ex: "19:00"
  horarioCerimonia?: string    // ex: "19:30"
  horarioTermino: string       // ex: "04:00"
  horarioDesmontagem: string   // ex: "06:00"
  buffetResponsavel: string    // ex: "Buffet Dúnia Alta Gastronomia"
  cerimonialista: string       // ex: "Yasmin Cerimonial"
  decorador: string           // ex: "Valéria Leão Bittar"
  qtdConvidadosPrevistos: number
  observacoesInternas?: string
  statusOperacional: "Agendado" | "Confirmado" | "Em Montagem" | "Em Andamento" | "Concluido"
}

export const DEFAULT_EVENT_MODULES: DuniaEventModules = {
  rsvpWhatsApp: true,
  liveTelao: true,
  giftListPix: true,
  guestAlbum: true,
  schedule: true,
  tableQrCode: true,
  receptionCheckin: true,
  musicPlaylist: true,
  saveTheDate: true,
}

export const DEFAULT_OPERATIONAL_INFO: DuniaEventOperational = {
  espaco: "Salão Imperial",
  tipoEvento: "Casamento",
  horarioMontagem: "08:00",
  horarioInicio: "19:00",
  horarioCerimonia: "19:30",
  horarioTermino: "04:00",
  horarioDesmontagem: "06:00",
  buffetResponsavel: "Buffet Dúnia Alta Gastronomia",
  cerimonialista: "Cerimonial Dúnia Excellence",
  decorador: "Cenografia Dúnia & Parceiros",
  qtdConvidadosPrevistos: 250,
  observacoesInternas: "Vallet com 8 manobristas. Degustação de espumantes aprovada.",
  statusOperacional: "Confirmado",
}

export interface DuniaEvent {
  id: string
  name: string
  date: string
  time: string
  venue: string
  plan: string
  theme: "gold" | "rose" | "olive"
  status: "Publicado" | "Rascunho" | "Finalizado"
  created: number
  message: string
  extra: string
  welcomePhoto?: string
  salaoPhoto?: string
  modules?: DuniaEventModules
  operational?: DuniaEventOperational
  hostAccessCode?: string
  whatsappQuota?: number
  maxGuests?: number
  category?: "Casamento" | "15 Anos" | "Corporativo / Gala" | "Bodas" | "Formatura"
}

export interface DuniaGuestPhoto {
  id: string
  url: string
  guestName: string
  message?: string
  createdAt: number
  approved: boolean
}

export interface DuniaTelaoSettings {
  speed: number // em segundos: 3, 5, 7, 10, 15
  transitionEffect: "fade" | "kenburns" | "slide" | "zoom"
  musicEnabled: boolean
  musicTrack: "acoustic" | "jazz" | "bossa" | "sunset" | "custom"
  customMusicUrl?: string
  musicVolume: number // 0 a 100
  isPlaying: boolean
  showQrCode: boolean
  qrPosition: "bottom-right" | "bottom-left" | "hidden"
  layout: "cinematic" | "polaroid" | "split"
  autoApprove: boolean
  manualCommand?: {
    action: "next" | "prev" | "jump"
    timestamp: number
    targetIndex?: number
  }
}

export const DEFAULT_TELAO_SETTINGS: DuniaTelaoSettings = {
  speed: 6,
  transitionEffect: "kenburns",
  musicEnabled: false,
  musicTrack: "acoustic",
  musicVolume: 60,
  isPlaying: true,
  showQrCode: true,
  qrPosition: "bottom-right",
  layout: "cinematic",
  autoApprove: true,
}

export interface DuniaAlbum {
  published: boolean
  expiry: number
  photos?: string[]
  guestPhotos?: DuniaGuestPhoto[]
  liveSlideShowSpeed?: number
  telaoSettings?: DuniaTelaoSettings
}

export interface DuniaEventState {
  event: DuniaEvent
  guests: DuniaGuest[]
  album: DuniaAlbum
}

const STORE_EVENTS_KEY = "dunia-v7-venue-events"
const STORE_ACTIVE_ID_KEY = "dunia-v7-active-id"
const STORE_STATE_PREFIX = "dunia-v7-state-"
const LEGACY_ACTIVE_KEY = "dunia-experience-v6-local"

export const SEED_EVENTS: DuniaEvent[] = [
  {
    id: "ev-jm",
    name: "Juliana & Marcos",
    date: "2026-11-21",
    time: "18:00",
    venue: "Dúnia City Hall — Lago Sul",
    plan: "Guest OS + Memories",
    theme: "gold",
    status: "Publicado",
    created: 1730380800000,
    message: "A vida nos trouxe até aqui. Agora queremos viver esse momento com você no Dúnia City Hall.",
    extra: "Chegue com antecedência para compartilhar cada instante conosco. Traje: Passeio Completo / Black Tie opcional.",
    welcomePhoto: "/assets/casal.jpg",
    salaoPhoto: "/assets/salao.jpg",
    category: "Casamento",
    hostAccessCode: "JM2026",
    whatsappQuota: 350,
    maxGuests: 300,
    modules: {
      rsvpWhatsApp: true,
      liveTelao: true,
      giftListPix: true,
      guestAlbum: true,
      schedule: true,
      tableQrCode: true,
      receptionCheckin: true,
      musicPlaylist: true,
      saveTheDate: true,
    },
    operational: {
      espaco: "Salão Imperial",
      tipoEvento: "Casamento",
      horarioMontagem: "07:00",
      horarioInicio: "18:00",
      horarioCerimonia: "18:30",
      horarioTermino: "04:00",
      horarioDesmontagem: "06:30",
      buffetResponsavel: "Buffet Dúnia Alta Gastronomia (Menu Prestige)",
      cerimonialista: "Yasmin Cerimonial & Eventos",
      decorador: "Valéria Leão Bittar Decorações",
      qtdConvidadosPrevistos: 280,
      observacoesInternas: "Lustres de cristal com dimerização suave às 21h. Climatização reforçada.",
      statusOperacional: "Confirmado",
    },
  },
  {
    id: "ev-clarice",
    name: "Clarice & Gustavo",
    date: "2026-11-28",
    time: "17:30",
    venue: "Dúnia City Hall — Jardim Imperial & Salão",
    plan: "Guest OS + Memories",
    theme: "gold",
    status: "Publicado",
    created: 1730381200000,
    message: "Celebrando o amor ao entardecer no Dúnia City Hall.",
    extra: "Cerimônia ao ar livre no jardim seguida de recepção no Salão Principal.",
    welcomePhoto: "/assets/casal.jpg",
    salaoPhoto: "/assets/salao.jpg",
    category: "Casamento",
    hostAccessCode: "CG2026",
    whatsappQuota: 400,
    maxGuests: 350,
    modules: {
      rsvpWhatsApp: true,
      liveTelao: true,
      giftListPix: true,
      guestAlbum: true,
      schedule: true,
      tableQrCode: true,
      receptionCheckin: true,
      musicPlaylist: true,
      saveTheDate: true,
    },
    operational: {
      espaco: "Jardim Imperial",
      tipoEvento: "Casamento",
      horarioMontagem: "06:00",
      horarioInicio: "17:30",
      horarioCerimonia: "18:00",
      horarioTermino: "03:30",
      horarioDesmontagem: "06:00",
      buffetResponsavel: "Buffet Dúnia (Estação de Frutos do Mar & Risotos)",
      cerimonialista: "César Serra Assessoria",
      decorador: "Maurício Côrtes Cenografia",
      qtdConvidadosPrevistos: 320,
      observacoesInternas: "Passarela de vidro no espelho d'água. Gerador de energia em stand-by às 16h.",
      statusOperacional: "Confirmado",
    },
  },
  {
    id: "ev-sb",
    name: "Sofia 15 Anos",
    date: "2026-12-05",
    time: "20:00",
    venue: "Dúnia City Hall — Espaço Cristal",
    plan: "Guest OS",
    theme: "rose",
    status: "Publicado",
    created: 1730381800000,
    message: "Uma noite inesquecível para celebrar meus 15 anos com quem faz parte da minha história!",
    extra: "Pista de dança com iluminação de última geração e buffet especial.",
    welcomePhoto: "/assets/debutante.jpg",
    salaoPhoto: "/assets/festa.jpg",
    category: "15 Anos",
    hostAccessCode: "SOFIA15",
    whatsappQuota: 250,
    maxGuests: 220,
    modules: {
      rsvpWhatsApp: true,
      liveTelao: true,
      giftListPix: false,
      guestAlbum: true,
      schedule: true,
      tableQrCode: true,
      receptionCheckin: true,
      musicPlaylist: true,
      saveTheDate: true,
    },
    operational: {
      espaco: "Espaço Cristal",
      tipoEvento: "15 Anos",
      horarioMontagem: "09:00",
      horarioInicio: "20:00",
      horarioCerimonia: "22:00",
      horarioTermino: "05:00",
      horarioDesmontagem: "07:30",
      buffetResponsavel: "Buffet Dúnia Teen (Ilha Gastronômica & Mocktails)",
      cerimonialista: "Paula Santana Cerimonial",
      decorador: "Luiz Pedro Decorações Modernas",
      qtdConvidadosPrevistos: 220,
      observacoesInternas: "Controle rígido de entrada com pulseiras de LED e QR Code individual.",
      statusOperacional: "Agendado",
    },
  },
  {
    id: "ev-bruno",
    name: "Dra. Helena & Dr. Bruno",
    date: "2026-12-14",
    time: "19:00",
    venue: "Dúnia City Hall — Salão Imperial",
    plan: "Guest OS + Memories",
    theme: "gold",
    status: "Publicado",
    created: 1730382200000,
    message: "Unindo vidas, propósitos e amigos na noite mais esperada do ano.",
    extra: "Traje: Black Tie.",
    welcomePhoto: "/assets/casal.jpg",
    salaoPhoto: "/assets/salao.jpg",
    category: "Casamento",
    hostAccessCode: "HB2026",
    whatsappQuota: 500,
    maxGuests: 400,
    modules: {
      rsvpWhatsApp: true,
      liveTelao: true,
      giftListPix: true,
      guestAlbum: true,
      schedule: true,
      tableQrCode: true,
      receptionCheckin: true,
      musicPlaylist: true,
      saveTheDate: true,
    },
    operational: {
      espaco: "Salão Imperial",
      tipoEvento: "Casamento",
      horarioMontagem: "06:30",
      horarioInicio: "19:00",
      horarioCerimonia: "19:45",
      horarioTermino: "05:00",
      horarioDesmontagem: "07:00",
      buffetResponsavel: "Buffet Dúnia Alta Gastronomia (Menu Degustação 7 Tempos)",
      cerimonialista: "Dúnia Exclusive VIP",
      decorador: "Kaka Fagundes Decorações",
      qtdConvidadosPrevistos: 380,
      observacoesInternas: "VIP Lounge com bar de charutos e uísque 18 anos.",
      statusOperacional: "Agendado",
    },
  },
  {
    id: "ev-corp",
    name: "Prêmio Empresarial Apex 2026",
    date: "2026-12-19",
    time: "19:30",
    venue: "Dúnia City Hall — Todos os Espaços",
    plan: "Guest OS Completo",
    theme: "olive",
    status: "Publicado",
    created: 1730382800000,
    message: "Reunindo líderes e parceiros para celebrar conquistas em uma noite memorável de alta gastronomia.",
    extra: "Vallet exclusivo e recepção com coquetel de boas-vindas.",
    welcomePhoto: "/assets/corporativo.jpg",
    salaoPhoto: "/assets/mesa.jpg",
    category: "Corporativo / Gala",
    hostAccessCode: "APEX2026",
    whatsappQuota: 600,
    maxGuests: 500,
    modules: {
      rsvpWhatsApp: true,
      liveTelao: true,
      giftListPix: false,
      guestAlbum: true,
      schedule: true,
      tableQrCode: true,
      receptionCheckin: true,
      musicPlaylist: false,
      saveTheDate: true,
    },
    operational: {
      espaco: "Todos os Espaços",
      tipoEvento: "Corporativo / Gala",
      horarioMontagem: "05:00",
      horarioInicio: "19:30",
      horarioCerimonia: "20:30",
      horarioTermino: "02:00",
      horarioDesmontagem: "05:00",
      buffetResponsavel: "Buffet Dúnia Executivo & Finger Foods Premium",
      cerimonialista: "Apex Marketing & Eventos",
      decorador: "Dúnia Corporate Staging",
      qtdConvidadosPrevistos: 450,
      observacoesInternas: "Transmissão simultânea em 6 telões e som setorizado.",
      statusOperacional: "Agendado",
    },
  },
  {
    id: "ev-reveillon",
    name: "Réveillon dos Embaixadores Dúnia 2027",
    date: "2026-12-31",
    time: "21:00",
    venue: "Dúnia City Hall — Lago Sul",
    plan: "Guest OS + Memories",
    theme: "gold",
    status: "Publicado",
    created: 1730383400000,
    message: "A virada de ano mais exclusiva e elegante de Brasília.",
    extra: "Ceia internacional, queima de fogos privativa sobre o lago e atrações nacionais.",
    welcomePhoto: "/assets/festa.jpg",
    salaoPhoto: "/assets/salao.jpg",
    category: "Corporativo / Gala",
    hostAccessCode: "REVEILLON27",
    whatsappQuota: 1000,
    maxGuests: 600,
    modules: {
      rsvpWhatsApp: true,
      liveTelao: true,
      giftListPix: false,
      guestAlbum: true,
      schedule: true,
      tableQrCode: true,
      receptionCheckin: true,
      musicPlaylist: true,
      saveTheDate: true,
    },
    operational: {
      espaco: "Todos os Espaços",
      tipoEvento: "Corporativo / Gala",
      horarioMontagem: "06:00",
      horarioInicio: "21:00",
      horarioCerimonia: "00:00",
      horarioTermino: "06:00",
      horarioDesmontagem: "12:00",
      buffetResponsavel: "Buffet Dúnia Ceia de Réveillon & Champagne Bar",
      cerimonialista: "Diretoria Dúnia City Hall",
      decorador: "Cenografia Ouro & Cristais Dúnia",
      qtdConvidadosPrevistos: 550,
      observacoesInternas: "Segurança armada externa e brigadistas em tempo integral.",
      statusOperacional: "Confirmado",
    },
  },
]

export const SEED_GUESTS: DuniaGuest[] = [
  {
    id: 1,
    name: "Ana Carolina Ribeiro",
    email: "ana@exemplo.com",
    seats: 2,
    status: "confirmed",
    checkedIn: false,
    code: "DUNIA-001",
    updatedAt: Date.now() - 1000 * 60 * 120,
    message: "Que alegria imensa participar desse momento tão especial com vocês!",
  },
  {
    id: 2,
    name: "Pedro Henrique Silva",
    email: "pedro@exemplo.com",
    seats: 2,
    status: "pending",
    checkedIn: false,
    code: "DUNIA-002",
    updatedAt: Date.now() - 1000 * 60 * 240,
    message: "",
  },
  {
    id: 3,
    name: "Mariana Fernandes",
    email: "mariana@exemplo.com",
    seats: 1,
    status: "confirmed",
    checkedIn: false,
    code: "DUNIA-003",
    updatedAt: Date.now() - 1000 * 60 * 360,
    message: "Presença confirmadíssima! Não vejo a hora.",
  },
  {
    id: 4,
    name: "Lucas Oliveira",
    email: "lucas@exemplo.com",
    seats: 1,
    status: "declined",
    checkedIn: false,
    code: "DUNIA-004",
    updatedAt: Date.now() - 1000 * 60 * 480,
    message: "Infelizmente estarei em viagem profissional, mas estarei torcendo por vocês de coração!",
  },
]

export const SEED_GUEST_PHOTOS: DuniaGuestPhoto[] = [
  {
    id: "gp-1",
    url: "/assets/casal.jpg",
    guestName: "Mariana Fernandes & Família",
    message: "Que noite emocionante! Toda a felicidade do mundo aos noivos!",
    createdAt: Date.now() - 1000 * 60 * 45,
    approved: true,
  },
  {
    id: "gp-2",
    url: "/assets/mesa.jpg",
    guestName: "Pedro Henrique Silva",
    message: "A decoração do Dúnia está espetacular! Que capricho em cada detalhe!",
    createdAt: Date.now() - 1000 * 60 * 30,
    approved: true,
  },
  {
    id: "gp-3",
    url: "/assets/festa.jpg",
    guestName: "Camila & Turma",
    message: "A pista de dança está fervendo! Parabéns pela festa inesquecível!",
    createdAt: Date.now() - 1000 * 60 * 15,
    approved: true,
  },
  {
    id: "gp-4",
    url: "/assets/salao.jpg",
    guestName: "Roberto & Cristina",
    message: "Lugar deslumbrante, arquitetura nobre e gastronomia impecável.",
    createdAt: Date.now() - 1000 * 60 * 5,
    approved: true,
  },
]

export function getStoredEvents(): DuniaEvent[] {
  if (typeof window === "undefined") return SEED_EVENTS
  try {
    const raw = localStorage.getItem(STORE_EVENTS_KEY)
    if (!raw) {
      localStorage.setItem(STORE_EVENTS_KEY, JSON.stringify(SEED_EVENTS))
      return SEED_EVENTS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_EVENTS
  } catch {
    return SEED_EVENTS
  }
}

export function saveStoredEvents(events: DuniaEvent[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORE_EVENTS_KEY, JSON.stringify(events))
  } catch (e) {
    console.warn("Erro ao salvar eventos no localStorage:", e)
  }
}

export function getActiveEventId(): string {
  if (typeof window === "undefined") return SEED_EVENTS[0].id
  return localStorage.getItem(STORE_ACTIVE_ID_KEY) || SEED_EVENTS[0].id
}

export function setActiveEventId(id: string): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORE_ACTIVE_ID_KEY, id)
}

export function getEventState(eventId: string): DuniaEventState {
  const events = getStoredEvents()
  const currentEvent = events.find((e) => e.id === eventId) || events[0] || SEED_EVENTS[0]

  if (typeof window === "undefined") {
    return {
      event: currentEvent,
      guests: SEED_GUESTS,
      album: { published: true, expiry: 30 },
    }
  }

  // Tenta carregar estado específico do evento
  try {
    const stateKey = STORE_STATE_PREFIX + currentEvent.id
    const raw = localStorage.getItem(stateKey)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && parsed.event && Array.isArray(parsed.guests)) {
        if (!parsed.album) parsed.album = { published: true, expiry: 30 }
        if (!parsed.album.guestPhotos || !Array.isArray(parsed.album.guestPhotos)) {
          parsed.album.guestPhotos = SEED_GUEST_PHOTOS
        }
        return parsed
      }
    }

    // Tenta fallback para chave compatível
    const legacyRaw = localStorage.getItem(LEGACY_ACTIVE_KEY)
    if (legacyRaw && currentEvent.id === getActiveEventId()) {
      const parsed = JSON.parse(legacyRaw)
      if (parsed && parsed.event && Array.isArray(parsed.guests)) {
        if (!parsed.album) parsed.album = { published: true, expiry: 30 }
        if (!parsed.album.guestPhotos || !Array.isArray(parsed.album.guestPhotos)) {
          parsed.album.guestPhotos = SEED_GUEST_PHOTOS
        }
        return parsed
      }
    }
  } catch (e) {
    console.warn("Erro ao ler estado do evento:", e)
  }

  // Estado padrão se ainda não existir
  const defaultState: DuniaEventState = {
    event: currentEvent,
    guests: SEED_GUESTS.map((g) => ({ ...g })),
    album: { published: true, expiry: 30, guestPhotos: SEED_GUEST_PHOTOS },
  }

  saveEventState(currentEvent.id, defaultState)
  return defaultState
}

export function saveEventState(eventId: string, state: DuniaEventState): void {
  if (typeof window === "undefined") return
  try {
    const stateKey = STORE_STATE_PREFIX + eventId
    localStorage.setItem(stateKey, JSON.stringify(state))
    if (eventId === getActiveEventId()) {
      localStorage.setItem(LEGACY_ACTIVE_KEY, JSON.stringify(state))
    }
  } catch (e) {
    console.warn("Erro ao salvar estado do evento:", e)
  }
}

export function addGuestPhoto(
  eventId: string,
  photo: { url: string; guestName: string; message?: string }
): DuniaGuestPhoto {
  const state = getEventState(eventId)
  const newPhoto: DuniaGuestPhoto = {
    id: "gp-" + Date.now().toString(36),
    createdAt: Date.now(),
    approved: true,
    ...photo,
  }
  const currentPhotos = state.album.guestPhotos || []
  const updatedPhotos = [newPhoto, ...currentPhotos]
  const updatedAlbum = { ...state.album, guestPhotos: updatedPhotos }
  const nextState = { ...state, album: updatedAlbum }
  saveEventState(eventId, nextState)
  return newPhoto
}

export function togglePhotoApproval(eventId: string, photoId: string): void {
  const state = getEventState(eventId)
  const currentPhotos = state.album.guestPhotos || []
  const updatedPhotos = currentPhotos.map((p) =>
    p.id === photoId ? { ...p, approved: !p.approved } : p
  )
  const updatedAlbum = { ...state.album, guestPhotos: updatedPhotos }
  const nextState = { ...state, album: updatedAlbum }
  saveEventState(eventId, nextState)
}

export function deleteGuestPhoto(eventId: string, photoId: string): void {
  const state = getEventState(eventId)
  const currentPhotos = state.album.guestPhotos || []
  const updatedPhotos = currentPhotos.filter((p) => p.id !== photoId)
  const updatedAlbum = { ...state.album, guestPhotos: updatedPhotos }
  const nextState = { ...state, album: updatedAlbum }
  saveEventState(eventId, nextState)
}

export function createNewEvent(payload: Partial<DuniaEvent>): DuniaEvent {
  const events = getStoredEvents()
  const id = "ev-" + Date.now().toString(36)
  const newEvent: DuniaEvent = {
    id,
    name: payload.name || "Novo Evento",
    date: payload.date || "2027-03-15",
    time: payload.time || "19:00",
    venue: payload.venue || "Dúnia City Hall — Lago Sul",
    plan: payload.plan || "Guest OS",
    theme: payload.theme || "gold",
    status: "Publicado",
    created: Date.now(),
    message: payload.message || "Uma grande celebração para eternizar momentos inesquecíveis.",
    extra: payload.extra || "Aguardamos você com muito carinho para compartilhar esse dia único.",
    welcomePhoto: payload.welcomePhoto || "/assets/casal.jpg",
    salaoPhoto: payload.salaoPhoto || "/assets/salao.jpg",
  }

  events.push(newEvent)
  saveStoredEvents(events)

  const initialState: DuniaEventState = {
    event: newEvent,
    guests: [
      {
        id: 1,
        name: "Convidado de Honra",
        email: "convidado@dunia.com.br",
        seats: 2,
        status: "pending",
        checkedIn: false,
        code: "DUNIA-001",
        updatedAt: Date.now(),
      },
    ],
    album: { published: false, expiry: 30 },
  }

  saveEventState(id, initialState)
  setActiveEventId(id)
  return newEvent
}

export function formatEventDate(dateStr: string): string {
  if (!dateStr) return "—"
  try {
    const [y, m, d] = dateStr.split("-").map(Number)
    const dt = new Date(y, m - 1, d)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(dt)
  } catch {
    return dateStr
  }
}

export function getTelaoSettings(eventId: string): DuniaTelaoSettings {
  const state = getEventState(eventId)
  return state.album?.telaoSettings || DEFAULT_TELAO_SETTINGS
}

export function updateTelaoSettings(
  eventId: string,
  settings: Partial<DuniaTelaoSettings>
): DuniaTelaoSettings {
  const state = getEventState(eventId)
  const current = state.album?.telaoSettings || DEFAULT_TELAO_SETTINGS
  const updated: DuniaTelaoSettings = { ...current, ...settings }
  const nextState: DuniaEventState = {
    ...state,
    album: {
      ...state.album,
      telaoSettings: updated,
    },
  }
  saveEventState(eventId, nextState)

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("dunia-telao-sync-trigger", JSON.stringify({ eventId, timestamp: Date.now(), updated }))
      window.dispatchEvent(new CustomEvent("dunia-telao-update", { detail: updated }))
      if ("BroadcastChannel" in window) {
        const bc = new BroadcastChannel("dunia-telao-sync")
        bc.postMessage({ eventId, settings: updated })
        bc.close()
      }
    } catch {
      // ignore
    }
  }

  return updated
}

export function sendTelaoCommand(
  eventId: string,
  action: "next" | "prev" | "jump",
  targetIndex?: number
): void {
  updateTelaoSettings(eventId, {
    manualCommand: {
      action,
      timestamp: Date.now(),
      targetIndex,
    },
  })
}

export function markGuestInvited(
  eventId: string,
  guestId: number,
  via: "whatsapp" | "email" = "whatsapp",
  status: "enviado" | "entregue" | "lido" = "enviado"
): void {
  const state = getEventState(eventId)
  const updatedGuests = state.guests.map((g) => {
    if (g.id === guestId) {
      return {
        ...g,
        invitedVia: via,
        invitedAt: Date.now(),
        invitationStatus: status,
      }
    }
    return g
  })
  saveEventState(eventId, { ...state, guests: updatedGuests })
}

export function batchImportGuests(
  eventId: string,
  rawList: { name: string; phone?: string; email?: string; seats?: number }[]
): DuniaGuest[] {
  const state = getEventState(eventId)
  let currentMaxId = state.guests.reduce((max, g) => Math.max(max, Number(g.id) || 0), 0)
  
  const newGuests: DuniaGuest[] = rawList.map((item) => {
    currentMaxId += 1
    const formattedId = String(currentMaxId).padStart(3, "0")
    return {
      id: currentMaxId,
      name: item.name.trim(),
      phone: item.phone ? item.phone.replace(/\D/g, "") : undefined,
      email: item.email?.trim() || "",
      seats: Number(item.seats) || 1,
      status: "pending",
      checkedIn: false,
      code: `DUNIA-${formattedId}`,
      updatedAt: Date.now(),
      invitationStatus: "nao_enviado",
    }
  })

  const merged = [...state.guests, ...newGuests]
  saveEventState(eventId, { ...state, guests: merged })
  return newGuests
}

export function updateEvent(eventId: string, patch: Partial<DuniaEvent>): DuniaEvent {
  const events = getStoredEvents()
  const index = events.findIndex((e) => e.id === eventId)
  if (index === -1) {
    throw new Error(`Evento ${eventId} não encontrado`)
  }
  const current = events[index]
  const updated: DuniaEvent = {
    ...current,
    ...patch,
    modules: patch.modules ? { ...(current.modules || DEFAULT_EVENT_MODULES), ...patch.modules } : current.modules,
    operational: patch.operational ? { ...(current.operational || DEFAULT_OPERATIONAL_INFO), ...patch.operational } : current.operational,
  }
  events[index] = updated
  saveStoredEvents(events)

  // Sincroniza também com o estado isolado do evento
  const state = getEventState(eventId)
  saveEventState(eventId, { ...state, event: updated })
  return updated
}

export function updateEventModules(eventId: string, modules: Partial<DuniaEventModules>): DuniaEventModules {
  const events = getStoredEvents()
  const current = events.find((e) => e.id === eventId)
  const currentModules = current?.modules || DEFAULT_EVENT_MODULES
  const merged: DuniaEventModules = { ...currentModules, ...modules }
  updateEvent(eventId, { modules: merged })
  return merged
}

export function updateEventOperational(eventId: string, operational: Partial<DuniaEventOperational>): DuniaEventOperational {
  const events = getStoredEvents()
  const current = events.find((e) => e.id === eventId)
  const currentOp = current?.operational || DEFAULT_OPERATIONAL_INFO
  const merged: DuniaEventOperational = { ...currentOp, ...operational }
  updateEvent(eventId, { operational: merged })
  return merged
}

export function deleteEvent(eventId: string): void {
  const events = getStoredEvents()
  const filtered = events.filter((e) => e.id !== eventId)
  saveStoredEvents(filtered)
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORE_STATE_PREFIX + eventId)
    } catch {}
  }
}

const STORE_MODE_KEY = "dunia-commercial-mode"

export type DuniaCommercialMode = "full" | "light"

export function getCommercialMode(): DuniaCommercialMode {
  // 1. Prioriza a configuração fixa do .env / .env.local
  const envMode = process.env.NEXT_PUBLIC_DUNIA_MODE
  if (envMode === "light") return "light"
  if (envMode === "full") return "full"

  // 2. Fallback para localStorage ou padrão 'full'
  if (typeof window === "undefined") return "full"
  try {
    const val = localStorage.getItem(STORE_MODE_KEY)
    return val === "light" ? "light" : "full"
  } catch {
    return "full"
  }
}

export function setCommercialMode(mode: DuniaCommercialMode): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORE_MODE_KEY, mode)
    window.dispatchEvent(new CustomEvent("dunia-mode-change", { detail: mode }))
  } catch (e) {
    console.warn("Erro ao salvar modo comercial:", e)
  }
}


// ==========================================
// MÓDULO REVISTA DÚNIA (EDITORIAL & ARTIGOS)
// ==========================================

export interface DuniaArticle {
  id: number | string
  category: "casamento" | "inspiracao" | "eventos" | "gastronomia"
  label: string
  title: string
  subtitle?: string
  text: string
  image: string
  article: string
  author?: string
  date?: string
  readTime?: string
  featured?: boolean
  status: "publicado" | "rascunho"
}

export const DEFAULT_DUNIA_ARTICLES: DuniaArticle[] = [
  {
    id: 1,
    category: "casamento",
    label: "CASAMENTOS • PLANEJAMENTO",
    title: "Antes do sim: os detalhes que fazem uma história única",
    text: "Da escolha do cenário à última dança, tudo começa pelas emoções que vocês querem viver.",
    image: "/assets/casal.jpg",
    author: "Redação Dúnia",
    date: "Novembro, 2026",
    readTime: "4 min",
    status: "publicado",
    featured: true,
    article:
      "Um grande casamento não se mede apenas pela decoração ou pelo número de convidados. Ele se revela nas escolhas que dizem algo sobre o casal: uma música, uma memória, uma mesa preparada para alguém especial. No Dúnia City Hall, o planejamento ganha vida com nossa cenografia monumental e o Espaço da Noiva exclusivo para preparar esse momento com serenidade.",
  },
  {
    id: 2,
    category: "inspiracao",
    label: "INSPIRAÇÃO • CENOGRAFIA",
    title: "A luz certa transforma um espaço em memória",
    text: "Velas, flores e atmosferas que fazem cada convidado sentir que chegou a um lugar especial.",
    image: "/assets/mesa.jpg",
    author: "Equipe de Iluminação Cenográfica",
    date: "Outubro, 2026",
    readTime: "3 min",
    status: "publicado",
    featured: false,
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
    author: "Diretoria de Operações",
    date: "Setembro, 2026",
    readTime: "5 min",
    status: "publicado",
    featured: true,
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
    author: "Curadoria Jovem",
    date: "Agosto, 2026",
    readTime: "4 min",
    status: "publicado",
    featured: false,
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
    author: "Comitê de Relações Corporativas",
    date: "Julho, 2026",
    readTime: "3 min",
    status: "publicado",
    featured: false,
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
    author: "Cerimonial & Recepção",
    date: "Junho, 2026",
    readTime: "4 min",
    status: "publicado",
    featured: false,
    article:
      "Uma confirmação de presença clara facilita decisões sobre equipe, mesas e buffet. O Dúnia Experience OS entrega ao casal um painel em tempo real onde cada confirmação é atualizada instantaneamente e a portaria valida os acessos por QR Code com bloqueio de duplicidade.",
  },
  {
    id: 7,
    category: "gastronomia",
    label: "GASTRONOMIA • ALTA COZINHA",
    title: "A arte de encantar pelo paladar em grandes banquetes",
    text: "Menus autorais e harmonizações desenhadas para emocionar os convidados mais exigentes.",
    image: "/assets/mesa.jpg",
    author: "Chef Executivo Dúnia",
    date: "Novembro, 2026",
    readTime: "5 min",
    status: "publicado",
    featured: true,
    article:
      "A alta gastronomia do Dúnia City Hall une a precisão da culinária clássica internacional com toques contemporâneos da rica identidade brasileira. Desde as ilhas de antepastos refinadas até os pratos principais empratados à francesa, cada detalhe é desenhado para transformar o jantar em uma experiência multissensorial inesquecível.",
  },
]

const STORE_ARTICLES_KEY = "dunia-editorial-articles"

export function getStoredArticles(): DuniaArticle[] {
  if (typeof window === "undefined") return DEFAULT_DUNIA_ARTICLES
  try {
    const raw = localStorage.getItem(STORE_ARTICLES_KEY)
    if (!raw) {
      localStorage.setItem(STORE_ARTICLES_KEY, JSON.stringify(DEFAULT_DUNIA_ARTICLES))
      return DEFAULT_DUNIA_ARTICLES
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DUNIA_ARTICLES
  } catch {
    return DEFAULT_DUNIA_ARTICLES
  }
}

export function saveStoredArticles(articles: DuniaArticle[]): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORE_ARTICLES_KEY, JSON.stringify(articles))
    window.dispatchEvent(new CustomEvent("dunia-articles-change", { detail: articles }))
  } catch (e) {
    console.warn("Erro ao salvar artigos da revista:", e)
  }
}

export function createNewArticle(data: Omit<DuniaArticle, "id">): DuniaArticle {
  const articles = getStoredArticles()
  const newArticle: DuniaArticle = {
    ...data,
    id: `art-${Date.now()}`,
    date: data.date || new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" }),
    status: data.status || "publicado",
  }
  const updated = [newArticle, ...articles]
  saveStoredArticles(updated)
  return newArticle
}

export function updateArticle(id: number | string, updates: Partial<DuniaArticle>): DuniaArticle | null {
  const articles = getStoredArticles()
  const idx = articles.findIndex((a) => String(a.id) === String(id))
  if (idx === -1) return null
  const updated = { ...articles[idx], ...updates }
  articles[idx] = updated
  saveStoredArticles(articles)
  return updated
}

export function deleteArticle(id: number | string): void {
  const articles = getStoredArticles()
  const filtered = articles.filter((a) => String(a.id) !== String(id))
  saveStoredArticles(filtered)
}
