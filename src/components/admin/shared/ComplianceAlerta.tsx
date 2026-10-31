"use client"

import { useMemo } from "react"
import { AlertTriangle, CheckCircle2, Lightbulb, ShieldAlert } from "lucide-react"
import { BRAND } from "@/config/brand"
import {
  BLOQUEIO_DE_PUBLICACAO_ATIVO,
  normalizarSeveridade,
  verificarTexto,
  type Achado,
} from "@/lib/compliance"

/** Campos a verificar: { "Resumo": "texto…", "Situações": "…" } */
export type TextosVerificados = Record<string, string | undefined>

/** Achados de todos os campos, sem os informativos. Só faz sentido no jurídico. */
export function verificarCampos(textos: TextosVerificados): Achado[] {
  if (BRAND.vertical !== "juridico") return []
  return Object.entries(textos).flatMap(([campo, texto]) =>
    texto ? verificarTexto(texto, campo).filter((a) => normalizarSeveridade(a.regra.severidade) !== "INFO") : []
  )
}

/**
 * Antes de salvar: devolve true se pode seguir. Com o bloqueio ligado, uma
 * vedação BLOCKER impede; desligado, pede confirmação de quem está salvando.
 */
export function confirmarCompliance(achados: Achado[]): boolean {
  const bloqueios = achados.filter((a) => normalizarSeveridade(a.regra.severidade) === "BLOCKER")
  if (bloqueios.length === 0) return true
  const lista = bloqueios.map((a) => `• "${a.trecho}" — ${a.regra.rotulo}`).join("\n")
  if (BLOQUEIO_DE_PUBLICACAO_ATIVO) {
    window.alert(`Este texto não pode ser publicado (Provimento 205/2021 da OAB):\n\n${lista}\n\nAjuste os trechos e salve de novo.`)
    return false
  }
  return window.confirm(
    `Possíveis vedações do Provimento 205/2021 da OAB:\n\n${lista}\n\n` +
      "A responsabilidade pelo conteúdo é do advogado. Salvar mesmo assim?"
  )
}

const ESTILO = {
  BLOCKER: { icone: ShieldAlert, cor: "border-red-200 bg-red-50 text-red-800", titulo: "Vedação" },
  WARNING: { icone: AlertTriangle, cor: "border-amber-200 bg-amber-50 text-amber-800", titulo: "Revisar" },
  RECOMMENDATION: { icone: Lightbulb, cor: "border-sky-200 bg-sky-50 text-sky-800", titulo: "Sugestão" },
  INFO: { icone: Lightbulb, cor: "border-slate-200 bg-slate-50 text-slate-700", titulo: "Nota" },
} as const

/**
 * Painel de compliance publicitário (Provimento 205/2021) para formulários do
 * painel. Atualiza enquanto o texto é digitado. Fora da vertical jurídica não
 * aparece.
 */
export function ComplianceAlerta({ textos }: { textos: TextosVerificados }) {
  const achados = useMemo(() => verificarCampos(textos), [textos])
  if (BRAND.vertical !== "juridico") return null

  if (achados.length === 0) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-emerald-700">
        <CheckCircle2 className="h-3.5 w-3.5" /> Nenhuma vedação do Provimento 205/2021 encontrada.
      </p>
    )
  }

  return (
    <div className="space-y-2" aria-live="polite">
      <p className="text-xs font-bold text-slate-700">Publicidade da advocacia — Provimento 205/2021</p>
      <ul className="space-y-1.5">
        {achados.map((a, i) => {
          const sev = normalizarSeveridade(a.regra.severidade)
          const { icone: Icone, cor, titulo } = ESTILO[sev]
          return (
            <li key={`${a.regra.id}-${a.campo}-${i}`} className={`flex gap-2 rounded-lg border p-2.5 text-xs ${cor}`}>
              <Icone className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              <span>
                <strong>{titulo}{a.campo ? ` em ${a.campo}` : ""}:</strong> “{a.trecho}” — {a.regra.rotulo}.{" "}
                <span className="opacity-90">{a.regra.sugestao}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
