import { Lead, DocCategory } from "@/types/lead"
import { CAMPOS_QUALIFICACAO, PONTUACAO_MAXIMA, CampoQualificacao } from "@/config/lead-fields"

/**
 * Score de qualificação do lead.
 *
 * Os critérios NÃO estão escritos aqui: vêm de `src/config/lead-fields.ts`, que
 * muda conforme a vertical do cliente. Este arquivo só sabe somar pontos e
 * explicar o resultado — é o que permite o mesmo painel servir um catálogo de
 * vendas e um escritório jurídico sem reescrever código.
 */

export interface LeadScoreInfo {
  score: number
  level: "priority" | "hot" | "warm" | "cold"
  color: string
  label: string
  labelEmoji: string
  /** Detalhamento por critério — permite explicar o número e agir sobre ele. */
  criteria: ScoreCriterion[]
  /** Pontos ainda disponíveis (soma dos critérios não atendidos). */
  missingPoints: number
}

export interface ScoreCriterion {
  id: string
  /** Rótulo curto exibido na ficha */
  label: string
  /** Quanto o critério vale */
  points: number
  /** Se o lead atende ao critério */
  met: boolean
  /**
   * O que pedir ao contato quando o critério não é atendido.
   * `null` quando não há ação possível de nossa parte.
   */
  actionHint: string | null
  /** Documento correspondente, quando a pendência se resolve com um anexo. */
  docCategory?: DocCategory
}

/** Rótulos e cores das categorias de documento anexável à ficha. */
export const DOC_CATEGORIES: Record<DocCategory, { label: string; color: string }> = {
  documento:    { label: "Documento",        color: "bg-sky-50 text-sky-700 border-sky-200" },
  identidade:   { label: "Identidade",       color: "bg-purple-50 text-purple-700 border-purple-200" },
  residencia:   { label: "Comp. Residência", color: "bg-amber-50 text-amber-700 border-amber-200" },
  foto:         { label: "Foto",             color: "bg-slate-50 text-slate-700 border-slate-200" },
  consulta_cpf: { label: "Consulta CPF",     color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  contrato:     { label: "Contrato",         color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  outros:       { label: "Outros",           color: "bg-slate-50 text-slate-600 border-slate-200" },
}

/** Valor respondido para um campo, lido de `lead.customFields`. */
function resposta(lead: Lead, campoId: string): unknown {
  return (lead.customFields ?? {})[campoId]
}

/** Converte um campo configurado em critério de score para este lead. */
function avaliarCampo(lead: Lead, campo: CampoQualificacao): ScoreCriterion {
  const valor = resposta(lead, campo.id)
  const preenchido =
    valor !== undefined &&
    valor !== null &&
    valor !== "" &&
    !(Array.isArray(valor) && valor.length === 0)

  // Campo de escolha: vale os pontos da opção marcada, e o teto é a melhor opção
  if (campo.opcoes?.length) {
    const escolhida = campo.opcoes.find((o) => o.valor === valor)
    const maximo = Math.max(...campo.opcoes.map((o) => o.pontos ?? 0))
    return {
      id: campo.id,
      label: campo.rotulo,
      points: maximo,
      met: Boolean(escolhida && (escolhida.pontos ?? 0) >= maximo && maximo > 0),
      actionHint: campo.acaoSeVazio ?? null,
    }
  }

  return {
    id: campo.id,
    label: campo.rotulo,
    points: campo.pontos ?? 0,
    met: preenchido,
    actionHint: campo.acaoSeVazio ?? null,
  }
}

/** Critérios estruturais, válidos em qualquer vertical. */
function criteriosBase(lead: Lead): ScoreCriterion[] {
  const digitos = (lead.phone || "").replace(/\D/g, "")
  return [
    {
      id: "contato",
      label: "Telefone informado",
      points: 10,
      met: digitos.length >= 10,
      actionHint: "Confirmar um telefone com DDD para contato.",
    },
    {
      id: "interesse",
      label: "Interesse definido",
      points: 10,
      met: Boolean(lead.itemInterest && lead.itemInterest !== "A definir"),
      actionHint: "Ajudar o contato a definir o que procura.",
    },
  ]
}

export function calculateLeadScore(lead: Lead): LeadScoreInfo {
  const criteria = [
    ...criteriosBase(lead),
    ...CAMPOS_QUALIFICACAO.map((campo) => avaliarCampo(lead, campo)),
  ]

  const conquistados = criteria.reduce((soma, c) => (c.met ? soma + c.points : soma), 0)
  const total = criteria.reduce((soma, c) => soma + c.points, 0) || PONTUACAO_MAXIMA || 1

  // Normaliza em 0–100 para que a faixa (frio/morno/quente) não dependa de
  // quantos critérios a vertical configurou.
  const score = Math.min(100, Math.max(0, Math.round((conquistados / total) * 100)))
  const missingPoints = criteria.reduce((soma, c) => (c.met ? soma : soma + c.points), 0)

  const base = { score, criteria, missingPoints }

  if (score >= 90) {
    return { ...base, level: "priority", color: "text-purple-700 bg-purple-50 border-purple-300", label: "Prioritário", labelEmoji: "🔥🔥" }
  }
  if (score >= 70) {
    return { ...base, level: "hot", color: "text-red-600 bg-red-50 border-red-300", label: "Quente", labelEmoji: "🔥" }
  }
  if (score >= 40) {
    return { ...base, level: "warm", color: "text-amber-600 bg-amber-50 border-amber-300", label: "Morno", labelEmoji: "🌡️" }
  }
  return { ...base, level: "cold", color: "text-sky-600 bg-sky-50 border-sky-300", label: "Frio", labelEmoji: "❄️" }
}
