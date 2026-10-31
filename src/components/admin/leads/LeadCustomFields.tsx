"use client"

import { Lead } from "@/types/lead"
import { CAMPOS_QUALIFICACAO, CampoQualificacao } from "@/config/lead-fields"

/**
 * Exibe as respostas de qualificação da ficha.
 *
 * Antes esta área era um bloco fixo com as perguntas de um nicho só. Agora ela
 * se desenha a partir de `src/config/lead-fields.ts`: trocar a vertical do
 * cliente troca as perguntas aqui, sem tocar neste componente.
 */

function formatar(campo: CampoQualificacao, valor: unknown): string {
  if (valor === undefined || valor === null || valor === "") return "—"

  if (campo.tipo === "booleano") return valor ? "Sim" : "Não"

  if (Array.isArray(valor)) {
    if (valor.length === 0) return "—"
    return valor
      .map((v) => campo.opcoes?.find((o) => o.valor === v)?.rotulo ?? String(v))
      .join(", ")
  }

  // Campo de escolha: mostra o rótulo legível, não o valor cru
  const opcao = campo.opcoes?.find((o) => o.valor === valor)
  return opcao?.rotulo ?? String(valor)
}

export function LeadCustomFields({ lead }: { lead: Lead }) {
  const respostas = lead.customFields ?? {}

  if (CAMPOS_QUALIFICACAO.length === 0) {
    return (
      <p className="text-xs font-semibold text-slate-400">
        Nenhuma pergunta de qualificação configurada para esta vertical.
      </p>
    )
  }

  const respondidas = CAMPOS_QUALIFICACAO.filter(
    (c) => respostas[c.id] !== undefined && respostas[c.id] !== ""
  ).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
          Qualificação
        </p>
        <span className="text-[10px] font-bold text-slate-400">
          {respondidas} de {CAMPOS_QUALIFICACAO.length} respondidas
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CAMPOS_QUALIFICACAO.map((campo) => {
          const valor = respostas[campo.id]
          const vazio = valor === undefined || valor === null || valor === ""

          return (
            <div
              key={campo.id}
              className="rounded-xl border border-slate-200 bg-white p-3"
            >
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {campo.rotulo}
              </span>
              <p
                className={`mt-0.5 text-xs font-bold ${
                  vazio ? "text-slate-300" : "text-slate-700"
                }`}
              >
                {formatar(campo, valor)}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
