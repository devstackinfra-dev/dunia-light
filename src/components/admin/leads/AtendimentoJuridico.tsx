"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarClock, FileLock2, Lock, Save, ShieldAlert, ShieldCheck, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/toast-simple"
import { listAllAreas } from "@/lib/db/areas"
import { updateLead } from "@/lib/db/leads"
import { PEDIDOS_TITULAR } from "@/config/funil"
import type { Area } from "@/types/area"
import type { DataSubjectRequest, Lead } from "@/types/lead"

interface Props {
  lead: Lead
  /** Nome de quem está logado — vai para o histórico */
  usuario: string
  onSalvo: (lead: Lead) => void
}

/** ISO → valor de <input type="datetime-local"> no fuso do navegador */
function paraInputDataHora(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}
const deInputDataHora = (v: string) => (v ? new Date(v).toISOString() : undefined)
const formatar = (iso?: string) =>
  iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—"

/**
 * Painel de atendimento jurídico da ficha do lead: área, relato original,
 * prazos, tags, origem e governança LGPD. Cada alteração salva entra no
 * histórico do lead com o nome de quem fez.
 */
export function AtendimentoJuridico({ lead, usuario, onSalvo }: Props) {
  const { success, error } = useToast()
  const [areas, setAreas] = useState<Area[]>([])
  const [salvando, setSalvando] = useState(false)

  const inicial = useMemo(() => ({
    areaSlug: lead.areaSlug ?? "",
    tags: (lead.tags ?? []).join(", "),
    proximo: paraInputDataHora(lead.nextContactAt),
    primeiro: paraInputDataHora(lead.firstContactAt),
    retencao: lead.retentionReviewAt ?? "",
    pedido: (lead.dataSubjectRequest ?? "none") as DataSubjectRequest,
  }), [lead])
  const [form, setForm] = useState(inicial)

  useEffect(() => setForm(inicial), [inicial])

  useEffect(() => {
    listAllAreas().then(setAreas).catch(() => setAreas([]))
  }, [])

  const alterado = JSON.stringify(form) !== JSON.stringify(inicial)

  const salvar = async (sobrescrever?: Partial<typeof form>) => {
    const f = { ...form, ...sobrescrever }
    const area = areas.find((a) => a.slug === f.areaSlug)
    const tags = Array.from(new Set(
      f.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).map((t) => t.slice(0, 40))
    )).slice(0, 20)

    const patch: Partial<Lead> = {
      areaSlug: f.areaSlug || undefined,
      areaName: f.areaSlug ? area?.nome ?? lead.areaName : undefined,
      tags,
      nextContactAt: deInputDataHora(f.proximo),
      firstContactAt: deInputDataHora(f.primeiro),
      retentionReviewAt: f.retencao || undefined,
      dataSubjectRequest: f.pedido,
    }

    // O que mudou, em linguagem de gente, para o histórico
    const mudancas: string[] = []
    if (f.areaSlug !== inicial.areaSlug) mudancas.push(`área: ${patch.areaName || "nenhuma"}`)
    if (f.tags !== inicial.tags) mudancas.push(`tags: ${tags.join(", ") || "nenhuma"}`)
    if (f.proximo !== inicial.proximo) mudancas.push(`próximo contato: ${formatar(patch.nextContactAt)}`)
    if (f.primeiro !== inicial.primeiro) mudancas.push(`primeiro contato: ${formatar(patch.firstContactAt)}`)
    if (f.retencao !== inicial.retencao) mudancas.push(`revisão de retenção: ${f.retencao || "sem data"}`)
    if (f.pedido !== inicial.pedido) {
      mudancas.push(`pedido do titular: ${PEDIDOS_TITULAR.find((p) => p.id === f.pedido)?.label}`)
    }
    if (mudancas.length === 0) return

    const entrada = {
      id: Math.random().toString(36).slice(2, 9),
      type: "note" as const,
      agentName: usuario,
      content: `Atendimento atualizado — ${mudancas.join("; ")}.`,
      createdAt: new Date().toISOString(),
    }

    try {
      setSalvando(true)
      await updateLead(lead.id, { ...patch, interactions: [...(lead.interactions ?? []), entrada] })
      onSalvo({ ...lead, ...patch, interactions: [...(lead.interactions ?? []), entrada], updatedAt: new Date().toISOString() })
      success("Atendimento salvo", mudancas.join("; "))
    } catch (err) {
      console.error("[Atendimento] Falha ao salvar:", err)
      error("Não foi possível salvar", err instanceof Error ? err.message : "Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  const rotulo = "text-[10px] font-bold uppercase tracking-wide text-slate-500"
  const bloco = "space-y-3 rounded-xl border border-slate-200 bg-white p-4"
  const utm = lead.utm as Record<string, string | undefined> | undefined

  return (
    <div className="space-y-5">
      {/* Relato original */}
      <section className={bloco}>
        <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900">
          <FileLock2 className="h-4 w-4 text-sky-600" /> Relato do titular
        </h3>
        {lead.clientMessage ? (
          <>
            <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-800">{lead.clientMessage}</p>
            <p className="flex items-center gap-1 text-[11px] text-slate-500">
              <Lock className="h-3 w-3" /> Texto original enviado pelo site. Não pode ser editado; use as notas para complementar.
            </p>
          </>
        ) : (
          <p className="text-sm text-slate-500">Sem relato registrado (contato antigo ou criado pelo painel).</p>
        )}
      </section>

      {/* Triagem */}
      <section className={bloco}>
        <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900">
          <Tag className="h-4 w-4 text-sky-600" /> Triagem
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="at-area" className={rotulo}>Área de atuação</label>
            <select
              id="at-area"
              value={form.areaSlug}
              onChange={(e) => setForm({ ...form, areaSlug: e.target.value })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-800"
            >
              <option value="">Não definida</option>
              {areas.map((a) => (
                <option key={a.id} value={a.slug}>{a.nome}{a.ativo ? "" : " (oculta)"}</option>
              ))}
            </select>
            {lead.areaName && !areas.some((a) => a.slug === lead.areaSlug) && (
              <p className="text-[11px] text-slate-500">Registrada no contato: {lead.areaName}</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="at-tags" className={rotulo}>Tags (separadas por vírgula)</label>
            <Input id="at-tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="retorno, documento-pendente" className="h-9 text-xs" />
            <p className="text-[11px] text-slate-500">Sem dados sensíveis nas tags.</p>
          </div>
        </div>
      </section>

      {/* Prazos */}
      <section className={bloco}>
        <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900">
          <CalendarClock className="h-4 w-4 text-sky-600" /> Prazos do atendimento
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="at-proximo" className={rotulo}>Próximo contato / prazo</label>
            <Input id="at-proximo" type="datetime-local" value={form.proximo}
              onChange={(e) => setForm({ ...form, proximo: e.target.value })} className="h-9 text-xs" />
          </div>
          <div className="space-y-1">
            <label htmlFor="at-primeiro" className={rotulo}>Primeiro contato realizado em</label>
            <div className="flex gap-2">
              <Input id="at-primeiro" type="datetime-local" value={form.primeiro}
                onChange={(e) => setForm({ ...form, primeiro: e.target.value })} className="h-9 text-xs" />
              {!form.primeiro && (
                <Button type="button" variant="outline" size="sm" className="h-9 shrink-0 text-xs"
                  onClick={() => salvar({ primeiro: paraInputDataHora(new Date().toISOString()) })}>
                  Agora
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LGPD */}
      <section className={bloco}>
        <h3 className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-900">
          <ShieldCheck className="h-4 w-4 text-sky-600" /> LGPD
        </h3>
        {lead.consentAt ? (
          <p className="text-xs text-slate-700">
            Consentimento em <strong>{formatar(lead.consentAt)}</strong>, política versão{" "}
            <strong>{lead.consentVersion}</strong> ({lead.consentSource}).
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <ShieldAlert className="h-4 w-4" /> Sem registro de consentimento (contato anterior ao formulário com LGPD ou criado no painel).
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label htmlFor="at-retencao" className={rotulo}>Revisar retenção em</label>
            <Input id="at-retencao" type="date" value={form.retencao}
              onChange={(e) => setForm({ ...form, retencao: e.target.value })} className="h-9 text-xs" />
            <p className="text-[11px] text-slate-500">Lembrete conforme a política do escritório; não apaga nada sozinho.</p>
          </div>
          <div className="space-y-1">
            <label htmlFor="at-pedido" className={rotulo}>Pedido do titular</label>
            <select id="at-pedido" value={form.pedido}
              onChange={(e) => setForm({ ...form, pedido: e.target.value as DataSubjectRequest })}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-800">
              {PEDIDOS_TITULAR.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
            </select>
          </div>
        </div>
      </section>

      {/* Origem */}
      <section className={bloco}>
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Origem do contato</h3>
        <dl className="grid gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
          {[
            ["Canal", lead.source],
            ["Página", lead.landingPage],
            ["Campanha", lead.campaignName],
            ["Veio de", lead.referrer],
            ["UTM", utm ? Object.entries(utm).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(" · ") : undefined],
          ].filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <dt className="shrink-0 font-semibold text-slate-500">{k}:</dt>
              <dd className="truncate text-slate-800" title={v}>{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="flex justify-end">
        <Button onClick={() => salvar()} disabled={!alterado || salvando} className="gap-2">
          <Save className="h-4 w-4" /> {salvando ? "Salvando…" : "Salvar atendimento"}
        </Button>
      </div>
    </div>
  )
}
