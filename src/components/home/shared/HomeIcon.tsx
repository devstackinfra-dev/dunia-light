import {
  Award, Calendar, Check, Clock, FileText, HeartHandshake as Handshake, MessageSquare, Package,
  Scale, Search, Shield, Star, Truck, Users, type LucideIcon,
} from "lucide-react"
import type { IconName } from "@/config/home-content"

/** Ícones citados por nome em `home-content.ts`, para o conteúdo não importar React. */
const ICONES: Record<IconName, LucideIcon> = {
  shield: Shield,
  clock: Clock,
  message: MessageSquare,
  award: Award,
  users: Users,
  file: FileText,
  scale: Scale,
  handshake: Handshake,
  search: Search,
  calendar: Calendar,
  package: Package,
  truck: Truck,
  star: Star,
  check: Check,
}

/** Nomes válidos, na ordem em que aparecem no seletor do painel. */
export const ICONES_DISPONIVEIS = Object.keys(ICONES) as IconName[]

export function HomeIcon({ name, className }: { name: IconName; className?: string }) {
  const Icone = ICONES[name] ?? Check
  return <Icone className={className} />
}
