"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { CheckCircle2, Mail, MapPin, Phone, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BRAND, whatsappLink } from "@/config/brand"
import { createLead } from "@/lib/db/leads"
import { listActiveAreas, areasPadrao } from "@/lib/db/areas"
import { SectionHeader } from "@/components/home/shared/SectionHeader"
import { useHome } from "@/components/home/shared/ConteudoProvider"

interface Origem {
  campaignId?: string
  campaignName?: string
  itemInterest?: string
  areaSlug?: string
  utm?: { source?: string; medium?: string; campaign?: string; content?: string; term?: string }
}

function lerOrigem(): Origem {
  const p = new URLSearchParams(window.location.search)
  const pega = (k: string) => p.get(k)?.slice(0, 200) || undefined
  const utm = {
    source: pega("utm_source"), medium: pega("utm_medium"), campaign: pega("utm_campaign"),
    content: pega("utm_content"), term: pega("utm_term"),
  }
  return {
    campaignId: pega("campaignId"),
    campaignName: pega("campaignName"),
    itemInterest: pega("itemInterest") || pega("product"),
    areaSlug: pega("area"),
    utm: Object.values(utm).some(Boolean) ? utm : undefined,
  }
}

/** Opção do seletor de área. `doBanco` = o slug existe na tabela e pode ir no lead. */
type OpcaoArea = { slug: string; nome: string; doBanco: boolean }

/**
 * Formulário de contato de alto padrão com integração ao funil de CRM e fast-lane WhatsApp.
 */
/** `areaInicial`: slug já escolhido no seletor (usado na página de cada área). */
export function Contact({ areaInicial }: { areaInicial?: string } = {}) {
  // Textos deste cliente (banco) sobre o padrão da vertical
  const HOME = useHome()
  const c = HOME.contato
  const vazio = { nome: "", telefone: "", email: "", mensagem: "", area: "" }
  const [form, setForm] = useState(vazio)
  const [consentimento, setConsentimento] = useState(false)
  const [isca, setIsca] = useState("")
  const [origem, setOrigem] = useState<Origem>({})
  // Começa com as áreas padrão (só como rótulo) e troca pelas do banco quando chegarem
  const [areas, setAreas] = useState<OpcaoArea[]>(() =>
    areasPadrao().map((a) => ({ slug: a.slug, nome: a.nome, doBanco: false }))
  )
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState("")

  useEffect(() => {
    const o = lerOrigem()
    setOrigem(o)
    const area = areaInicial || o.areaSlug
    if (area) setForm((f) => ({ ...f, area }))
    listActiveAreas()
      .then((lista) => {
        if (lista.length) setAreas(lista.map((a) => ({ slug: a.slug, nome: a.nome, doBanco: true })))
      })
      .catch(() => {
        // Banco indisponível: seguem as áreas padrão, enviadas só como texto
      })
  }, [areaInicial])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isca) {
      setEnviado(true)
      return
    }
    if (!form.nome.trim() || form.telefone.replace(/\D/g, "").length < 10) {
      setErro("Informe seu nome completo e um telefone com DDD válido.")
      return
    }
    if (!form.mensagem.trim()) {
      setErro("Conte brevemente a sua situação para que possamos retornar.")
      return
    }
    if (!consentimento) {
      setErro("Para enviar, marque a concordância com a política de privacidade.")
      return
    }
    const area = areas.find((a) => a.slug === form.area)
    setErro("")
    setEnviando(true)
    try {
      await createLead({
        fullName: form.nome.trim(),
        phone: form.telefone.trim(),
        email: form.email.trim() || undefined,
        message: form.mensagem.trim().slice(0, 5000),
        areaSlug: area?.doBanco ? area.slug : undefined,
        itemInterest: area?.nome ?? origem.itemInterest,
        consent: consentimento,
        website: isca,
        source: "Site — Formulário Contato",
        campaignId: origem.campaignId,
        campaignName: origem.campaignName,
        utm: origem.utm,
      })
      setEnviado(true)
      setForm(vazio)
      setConsentimento(false)
    } catch (err) {
      console.error("[Contato] Falha ao enviar:", err)
      setErro(err instanceof Error ? err.message : "Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.")
    } finally {
      setEnviando(false)
    }
  }

  const { phone, email, address, whatsapp } = BRAND.contact

  return (
    <section id="contato" className="relative w-full scroll-mt-24 bg-marca-tinta py-24 lg:py-32 text-white">
      {/* Luz ambiente de fundo */}
      <div className="pointer-events-none absolute left-0 bottom-0 h-96 w-96 rounded-full bg-marca-latao/5 blur-[120px]" />

      <div className="container relative mx-auto px-6 lg:px-12">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Lado Esquerdo: Dados de Contato e Fast-Lane */}
          <div className="lg:col-span-5">
            <SectionHeader badge={c.badge} title={c.title} subtitle={c.subtitle} align="left" />

            <div className="mt-8 space-y-4">
              {phone && (
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-marca-latao/15 text-marca-latao border border-marca-latao/30">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Atendimento Telefônico</span>
                    <p className="text-sm font-semibold text-white">{phone}</p>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-marca-latao/15 text-marca-latao border border-marca-latao/30">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Correio Eletrônico</span>
                    <p className="text-sm font-semibold text-white">{email}</p>
                  </div>
                </div>
              )}

              {address && (
                <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
                  <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-marca-latao/15 text-marca-latao border border-marca-latao/30">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sede do Escritório</span>
                    <p className="text-sm font-semibold text-white leading-relaxed">{address}</p>
                  </div>
                </div>
              )}

              {whatsapp && (
                <div className="mt-6 rounded-2xl border border-marca-latao/40 bg-gradient-to-br from-marca-latao/15 via-white/[0.03] to-transparent p-5">
                  <div className="flex items-center gap-2 text-marca-latao text-xs font-bold uppercase tracking-wider mb-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Preferência por agilidade?</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    Inicie uma conversa direta pelo WhatsApp com nosso atendimento para tirar dúvidas imediatas.
                  </p>
                  <Link
                    href={whatsappLink(`Olá! Vim pelo formulário do site ${BRAND.name} e gostaria de agendar uma conversa.`)}
                    target="_blank"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-marca-latao py-3 text-xs font-bold text-marca-tinta shadow-md transition-all hover:bg-marca-latao/90"
                  >
                    Chamar no WhatsApp <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Lado Direito: Card do Formulário */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-2xl lg:col-span-7">
            {enviado ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-titulo text-2xl font-medium text-slate-900">Mensagem Enviada</h3>
                <p className="max-w-md text-sm text-slate-600 leading-relaxed">{c.successText}</p>
                <Button
                  variant="outline"
                  onClick={() => setEnviado(false)}
                  className="mt-4 rounded-xl border-slate-300 font-semibold"
                >
                  Enviar outra mensagem
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={isca}
                  onChange={(e) => setIsca(e.target.value)}
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                <div className="space-y-1.5">
                  <Label htmlFor="contato-nome" className="text-xs font-bold text-slate-800">
                    Nome Completo *
                  </Label>
                  <Input
                    id="contato-nome"
                    autoComplete="name"
                    placeholder="Seu nome completo"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="h-12 rounded-xl border-slate-200 text-slate-900 focus:border-marca-latao focus:ring-marca-latao"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="contato-telefone" className="text-xs font-bold text-slate-800">
                      Telefone / WhatsApp *
                    </Label>
                    <Input
                      id="contato-telefone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="(11) 90000-0000"
                      value={form.telefone}
                      onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                      className="h-12 rounded-xl border-slate-200 text-slate-900 focus:border-marca-latao focus:ring-marca-latao"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contato-email" className="text-xs font-bold text-slate-800">
                      E-mail (opcional)
                    </Label>
                    <Input
                      id="contato-email"
                      type="email"
                      autoComplete="email"
                      placeholder="seu@email.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-12 rounded-xl border-slate-200 text-slate-900 focus:border-marca-latao focus:ring-marca-latao"
                    />
                  </div>
                </div>

                {areas.length > 0 && (
                  <div className="space-y-1.5">
                    <Label htmlFor="contato-area" className="text-xs font-bold text-slate-800">
                      {HOME.areas.badge} (opcional)
                    </Label>
                    <select
                      id="contato-area"
                      value={form.area}
                      onChange={(e) => setForm({ ...form, area: e.target.value })}
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-marca-latao focus:outline-none focus:ring-1 focus:ring-marca-latao"
                    >
                      <option value="">Não sei / outro assunto</option>
                      {areas.map((a) => (
                        <option key={a.slug} value={a.slug}>{a.nome}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="contato-mensagem" className="text-xs font-bold text-slate-800">
                    {c.messageLabel} *
                  </Label>
                  <Textarea
                    id="contato-mensagem"
                    rows={4}
                    placeholder={c.messagePlaceholder}
                    value={form.mensagem}
                    onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    className="rounded-xl border-slate-200 text-slate-900 focus:border-marca-latao focus:ring-marca-latao leading-relaxed"
                  />
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-slate-600">
                  <input
                    type="checkbox"
                    checked={consentimento}
                    onChange={(e) => setConsentimento(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-[rgb(var(--marca-tinta))]"
                  />
                  <span>
                    Concordo com o tratamento dos meus dados para o retorno deste contato, conforme a{" "}
                    <Link href="/privacidade" target="_blank" className="underline underline-offset-2 hover:text-slate-900">
                      política de privacidade
                    </Link>
                    . *
                  </span>
                </label>

                {erro && <p role="alert" className="text-xs font-semibold text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">{erro}</p>}

                <Button
                  type="submit"
                  disabled={enviando}
                  className="h-12 w-full rounded-xl bg-marca-latao text-sm font-bold text-marca-tinta shadow-md transition-all hover:bg-marca-latao/90 hover:shadow-lg"
                >
                  {enviando ? "Registrando mensagem..." : c.submitText}
                </Button>

                <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-marca-latao" />
                  <span>
                    Atendimento sob sigilo profissional.{" "}
                    <Link href="/privacidade" className="underline underline-offset-2 hover:text-slate-800">
                      Política de privacidade
                    </Link>
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
