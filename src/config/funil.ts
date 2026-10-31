import { BRAND } from "@/config/brand"
import type { LeadStatus } from "@/types/database"

/**
 * Etapas do funil por vertical — fonte única para quadro, lista e ficha.
 *
 * O banco tem um conjunto só de status; cada vertical escolhe quais usa, em
 * que ordem e com que nome. O jurídico segue o atendimento de um escritório
 * (do projeto de referência): nova → em análise → qualificada → contato →
 * em atendimento → cliente, com duas saídas (sem prosseguimento, descartada).
 */
export interface EtapaFunil {
  id: LeadStatus
  label: string
  shortLabel: string
  /** Classes de cor do selo/coluna */
  cor: string
  /** Etapa de saída: fica fora do quadro principal */
  final?: boolean
}

const JURIDICO: EtapaFunil[] = [
  { id: "new",        label: "Nova / não lida",       shortLabel: "Nova",       cor: "border-sky-200 bg-sky-50 text-sky-700" },
  { id: "analysis",   label: "Em análise técnica",    shortLabel: "Análise",    cor: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  { id: "qualified",  label: "Qualificada",           shortLabel: "Qualificada", cor: "border-violet-200 bg-violet-50 text-violet-700" },
  { id: "contacted",  label: "Contato realizado",     shortLabel: "Contato",    cor: "border-amber-200 bg-amber-50 text-amber-700" },
  { id: "scheduled",  label: "Em atendimento",        shortLabel: "Atendimento", cor: "border-orange-200 bg-orange-50 text-orange-700" },
  { id: "converted",  label: "Cliente",               shortLabel: "Cliente",    cor: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { id: "lost",       label: "Sem prosseguimento",    shortLabel: "Encerrada",  cor: "border-slate-200 bg-slate-50 text-slate-600", final: true },
  { id: "discarded",  label: "Descartada (spam / fora do escopo)", shortLabel: "Descartada", cor: "border-red-200 bg-red-50 text-red-700", final: true },
]

const COMERCIAL: EtapaFunil[] = [
  { id: "new",         label: "Novo lead",     shortLabel: "Novo",        cor: "border-sky-200 bg-sky-50 text-sky-700" },
  { id: "contacted",   label: "Contatado",     shortLabel: "Contatado",   cor: "border-indigo-200 bg-indigo-50 text-indigo-700" },
  { id: "negotiating", label: "Em negociação", shortLabel: "Negociação",  cor: "border-amber-200 bg-amber-50 text-amber-700" },
  { id: "scheduled",   label: "Agendado",      shortLabel: "Agendado",    cor: "border-orange-200 bg-orange-50 text-orange-700" },
  { id: "converted",   label: "Convertido",    shortLabel: "Convertido",  cor: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  { id: "lost",        label: "Perdido",       shortLabel: "Perdido",     cor: "border-slate-200 bg-slate-50 text-slate-600", final: true },
]

export const FUNIL: EtapaFunil[] = BRAND.vertical === "juridico" ? JURIDICO : COMERCIAL

/** Rótulo de um status; status de outra vertical (lead antigo) cai no nome cru. */
export function etapa(status: LeadStatus | string | undefined): EtapaFunil {
  return (
    FUNIL.find((e) => e.id === status) ??
    JURIDICO.concat(COMERCIAL).find((e) => e.id === status) ??
    { id: (status || "new") as LeadStatus, label: status || "—", shortLabel: status || "—", cor: "border-slate-200 bg-slate-50 text-slate-600" }
  )
}

/** Pedidos do titular (LGPD, art. 18) — rótulos para a ficha. */
export const PEDIDOS_TITULAR = [
  { id: "none", label: "Nenhum" },
  { id: "access", label: "Acesso / cópia dos dados" },
  { id: "correction", label: "Correção" },
  { id: "deletion", label: "Eliminação / oposição" },
] as const
