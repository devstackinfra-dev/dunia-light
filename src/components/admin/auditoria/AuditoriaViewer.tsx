"use client"

import { useEffect, useState } from "react"
import { RefreshCw, ScrollText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { listarAuditoria, type RegistroAuditoria } from "@/lib/db/auditoria"

const ENTIDADES: Record<string, string> = {
  leads: "Leads",
  lead_documents: "Documentos de lead",
  appointments: "Agenda",
  admin_users: "Usuários do painel",
  areas: "Áreas de atuação",
  campaigns: "Campanhas",
  hero_slides: "Slides do hero",
  app_settings: "Configurações",
  testimonials: "Depoimentos",
  products: "Catálogo",
}

const ACAO: Record<RegistroAuditoria["acao"], string> = {
  criar: "text-emerald-700 bg-emerald-50 border-emerald-200",
  alterar: "text-amber-700 bg-amber-50 border-amber-200",
  excluir: "text-red-700 bg-red-50 border-red-200",
}

/**
 * Trilha de auditoria (somente super admin): quem fez o quê, quando e quais
 * campos mudaram. Os valores não são guardados — de propósito (LGPD).
 */
export function AuditoriaViewer() {
  const [registros, setRegistros] = useState<RegistroAuditoria[]>([])
  const [entidade, setEntidade] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const carregar = async () => {
    try {
      setCarregando(true)
      setErro("")
      setRegistros(await listarAuditoria({ entidade: entidade || undefined }))
    } catch (err) {
      console.error("[Auditoria] Falha ao carregar:", err)
      setErro("Não foi possível carregar a trilha de auditoria.")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entidade])

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
            <ScrollText className="h-4 w-4" /> Trilha de auditoria
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Quem criou, alterou ou excluiu o quê, e quando. Mostra os campos alterados, nunca os valores. Ninguém edita nem apaga estes registros.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={entidade}
            onChange={(e) => setEntidade(e.target.value)}
            aria-label="Filtrar por tipo de registro"
            className="h-9 rounded-md border border-slate-200 bg-white px-2 text-xs"
          >
            <option value="">Tudo</option>
            {Object.entries(ENTIDADES).map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
          </select>
          <Button variant="outline" size="sm" onClick={carregar} disabled={carregando} className="gap-1.5">
            <RefreshCw className="h-3.5 w-3.5" /> Atualizar
          </Button>
        </div>
      </div>

      {erro && <p className="text-xs font-semibold text-red-600">{erro}</p>}

      <div className="max-h-[480px] overflow-auto rounded-lg border border-slate-100">
        <table className="w-full text-left text-xs">
          <thead className="sticky top-0 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-3 py-2">Quando</th>
              <th className="px-3 py-2">Quem</th>
              <th className="px-3 py-2">Ação</th>
              <th className="px-3 py-2">Onde</th>
              <th className="px-3 py-2">Campos</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {registros.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-3 py-2 text-slate-600">
                  {new Date(r.createdAt).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="px-3 py-2 font-semibold text-slate-800">{r.autorNome}</td>
                <td className="px-3 py-2">
                  <span className={`rounded border px-1.5 py-0.5 font-bold ${ACAO[r.acao]}`}>{r.acao}</span>
                </td>
                <td className="px-3 py-2 text-slate-700">
                  {ENTIDADES[r.entidade] ?? r.entidade}
                  <span className="ml-1 font-mono text-[10px] text-slate-400">{r.registroId.slice(0, 8)}</span>
                </td>
                <td className="px-3 py-2 text-slate-600">{r.camposAlterados.join(", ") || "—"}</td>
              </tr>
            ))}
            {!carregando && registros.length === 0 && (
              <tr><td colSpan={5} className="px-3 py-6 text-center text-slate-500">Nenhum registro.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
