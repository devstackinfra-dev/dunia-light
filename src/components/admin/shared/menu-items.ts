import {
  LayoutDashboard,
  Target,
  Megaphone,
  Monitor,
  Package,
  Briefcase,
  Layers,
  BarChart3,
  Settings,
  Users,
  Sliders,
  Newspaper,
  MessageSquare,
  CalendarDays,
  LucideIcon,
} from "lucide-react"
import { TabId } from "@/lib/permissions"
import { BRAND, termo } from "@/config/brand"

export interface MenuItem {
  id: TabId
  label: string
  /** Rótulo curto para a barra inferior no mobile */
  shortLabel: string
  icon: LucideIcon
}

// Adapta ícone e rótulo do catálogo/serviços de acordo com a vertical configurada
const ITEM_ICON: LucideIcon =
  BRAND.vertical === "juridico"
    ? Briefcase
    : BRAND.vertical === "catalogo"
    ? Package
    : Layers

const ITEM_LABEL = termo("catalogo")
const ITEM_SHORT_LABEL = termo("itemPlural")

const BASE_MENU_ITEMS: MenuItem[] = [
  { id: "dashboard",     label: "Dashboard",         shortLabel: "Início",     icon: LayoutDashboard },
  { id: "leads",         label: "Leads Funil",       shortLabel: "Leads",      icon: Target },
  { id: "agenda",        label: "Agenda",            shortLabel: "Agenda",     icon: CalendarDays },
  { id: "campanhas",     label: "Campanhas",         shortLabel: "Campanhas",  icon: Megaphone },
  { id: "landing",       label: "Página Inicial (Home Page)", shortLabel: "Home Page", icon: Monitor },
  { id: "depoimentos",   label: "Depoimentos",       shortLabel: "Avaliações", icon: MessageSquare },
  { id: "blog",          label: "Blog / Publicações", shortLabel: "Blog",      icon: Newspaper },
  { id: "frota",         label: ITEM_LABEL,          shortLabel: ITEM_SHORT_LABEL, icon: ITEM_ICON },
  { id: "operacao",      label: "Operação & Preços", shortLabel: "Operação",   icon: Sliders },
  { id: "analytics",     label: "Analytics",         shortLabel: "Métricas",   icon: BarChart3 },
  { id: "usuarios",      label: "Usuários",          shortLabel: "Usuários",   icon: Users },
  { id: "configuracoes", label: "Configurações",     shortLabel: "Config",     icon: Settings },
]

/**
 * Fonte única do menu do painel.
 * Se a vertical for 'juridico', esconde 'operacao' (que é simulador de locação/rodízio veicular).
 */
export const ADMIN_MENU_ITEMS: MenuItem[] =
  BRAND.vertical === "juridico"
    ? BASE_MENU_ITEMS.filter((item) => item.id !== "operacao")
    : BASE_MENU_ITEMS

export const MOBILE_PRIMARY_TABS: TabId[] = [
  "dashboard",
  "leads",
  "agenda",
  BRAND.vertical === "juridico" ? "landing" : "frota",
]

