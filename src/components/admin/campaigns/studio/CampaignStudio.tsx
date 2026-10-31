"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import {
  ArrowLeft, Monitor, Smartphone, Tablet, Save, Rocket, ExternalLink,
  Plus, Trash2, Copy, ArrowUp, ArrowDown, Eye, EyeOff, Edit3, X,
  Sparkles, Layers, Image as ImageIcon, Share2, HelpCircle, Check,
  Fuel, ShieldCheck, CheckCircle2, ChevronRight, Phone, Car, Sliders,
  Settings, RefreshCw, UploadCloud, Info
} from "lucide-react"
import { Campaign, CampaignTheme, CAMPAIGN_THEMES } from "@/types/campaign"
import {
  CampaignSection, SectionType, DEFAULT_4V_SECTIONS, DEFAULT_JURIDICO_4V_SECTIONS,
  HeroSectionConfig, ProductSpotlightSectionConfig, ContextEmpathySectionConfig,
  Diferenciais4VSectionConfig, EarningsCalculatorSectionConfig, FaqAccordionSectionConfig,
  LeadFormSectionConfig, WhatsAppCtaSectionConfig, HowItWorksSectionConfig, TestimonialsSectionConfig
} from "@/types/campaign-studio"
import { DynamicLandingRenderer } from "@/components/public/campaign-sections/DynamicLandingRenderer"
import { updateCampaign } from "@/lib/campaigns-crud"
import { extrairTexto } from "@/lib/compliance"
import { confirmarCompliance, verificarCampos } from "@/components/admin/shared/ComplianceAlerta"
import { useToast } from "@/components/ui/toast-simple"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { BRAND } from "@/config/brand"
import { cn } from "@/lib/utils"
import { LOGO_IMAGES } from "@/lib/supabase"
import { JsonAiModal } from "../JsonAiModal"
import { ImageSelectorField, LOCAL_CAR_PRESETS } from "./ImageSelectorField"
import { MediaSelectorDialog } from "@/components/admin/shared/MediaSelectorDialog"

interface CampaignStudioProps {
  campaign: Campaign
  onCampaignUpdated: () => void
  onClose?: () => void
}

export function CampaignStudio({ campaign, onCampaignUpdated, onClose }: CampaignStudioProps) {
  const { success, error: showError } = useToast()

  // Estado da Página e Seções
  const [pageName, setPageName] = useState(campaign.name)
  const [currentTheme, setCurrentTheme] = useState<CampaignTheme>(campaign.theme || "editorial")
  const [sections, setSections] = useState<CampaignSection[]>(() => {
    if (campaign.sections && campaign.sections.length > 0) {
      return campaign.sections
    }
    return DEFAULT_4V_SECTIONS
  })

  const [saving, setSaving] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(sections[0]?.id || null)
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop")

  // Modais de Apoio
  const [catalogModalOpen, setCatalogModalOpen] = useState(false)
  const [structureModalOpen, setStructureModalOpen] = useState(false)
  const [jsonModalOpen, setJsonModalOpen] = useState(false)
  const [galleryModalOpen, setGalleryModalOpen] = useState(false)
  const [utmModalOpen, setUtmModalOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)

  // UTM Generator State
  const [utmSource, setUtmSource] = useState("facebook")
  const [utmMedium, setUtmMedium] = useState("cpc")
  const [utmCampaign, setUtmCampaign] = useState(campaign.slug)
  const [copiedUtm, setCopiedUtm] = useState(false)

  const activeSection = useMemo(
    () => sections.find((s) => s.id === activeSectionId) || sections[0],
    [sections, activeSectionId]
  )

  const activeSectionIndex = useMemo(
    () => sections.findIndex((s) => s.id === activeSection?.id),
    [sections, activeSection]
  )

  // Salvar no Banco (Supabase)
  const handleSave = async (publish = false) => {
    // Provimento 205/2021: confere o texto das seções visíveis antes de gravar
    const achados = verificarCampos({
      "nome da página": pageName,
      "seções": extrairTexto(sections.filter((s) => s.enabled)),
    })
    if (!confirmarCompliance(achados)) return

    try {
      setSaving(true)
      const updates: Partial<Campaign> = {
        name: pageName,
        theme: currentTheme,
        sections: sections,
      }
      if (publish) {
        updates.status = "active"
      }
      await updateCampaign(campaign.id, updates)
      setIsDirty(false)
      success(
        publish ? "Campanha Publicada!" : "Landing Page Salva!",
        publish ? "A página está no ar com status ativo." : "Todas as alterações foram salvas com sucesso."
      )
      onCampaignUpdated()
    } catch (err: any) {
      console.error(err)
      showError("Erro ao salvar", err?.message || "Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  // Mover Seção
  const moveSection = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= sections.length) return

    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[targetIdx]
    newSections[targetIdx] = temp

    const ordered = newSections.map((sec, idx) => ({ ...sec, order: idx }))
    setSections(ordered)
    setIsDirty(true)
  }

  // Alternar Visibilidade
  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    )
    setIsDirty(true)
  }

  // Duplicar Seção
  const duplicateSection = (sec: CampaignSection) => {
    const newSec: CampaignSection = {
      ...JSON.parse(JSON.stringify(sec)),
      id: `sec_${sec.type}_${Date.now()}`,
      order: sections.length,
    }
    setSections([...sections, newSec])
    setActiveSectionId(newSec.id)
    setIsDirty(true)
    success("Seção duplicada", "Novo bloco adicionado à página.")
  }

  // Excluir Seção
  const deleteSection = (id: string) => {
    if (sections.length <= 1) {
      showError("Atenção", "A landing page precisa ter pelo menos uma seção.")
      return
    }
    const filtered = sections.filter((s) => s.id !== id)
    setSections(filtered)
    if (activeSectionId === id) {
      setActiveSectionId(filtered[0]?.id || null)
    }
    setIsDirty(true)
  }

  // Adicionar Nova Seção do Catálogo
  const addSection = (type: SectionType) => {
    const newSec = createDefaultSection(type, sections.length)
    setSections([...sections, newSec])
    setActiveSectionId(newSec.id)
    setIsDirty(true)
    setCatalogModalOpen(false)
    setRightPanelOpen(true)
    success("Seção adicionada", `Bloco '${getSectionLabel(type)}' adicionado.`)
  }

  // Atualizar Campo da Seção Ativa
  const updateActiveSectionField = (field: string, value: any) => {
    if (!activeSection) return
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === activeSection.id) {
          return { ...s, [field]: value }
        }
        return s
      })
    )
    setIsDirty(true)
  }

  // Importar JSON
  const handleImportSections = (newSections: CampaignSection[], append: boolean) => {
    const formatted = newSections.map((sec, idx) => ({
      ...sec,
      id: sec.id || `sec_${sec.type || "custom"}_${Date.now()}_${idx}`,
      enabled: sec.enabled !== undefined ? sec.enabled : true,
    }))

    if (append) {
      setSections((prev) => {
        const startIdx = prev.length
        const reordered = formatted.map((s, i) => ({ ...s, order: startIdx + i }))
        const next = [...prev, ...reordered]
        if (reordered[0]) setActiveSectionId(reordered[0].id)
        return next
      })
    } else {
      const reordered = formatted.map((s, i) => ({ ...s, order: i }))
      setSections(reordered)
      if (reordered[0]) setActiveSectionId(reordered[0].id)
    }
    setIsDirty(true)
  }

  // Campanha Simulada para Prévia em Tempo Real
  const previewCampaign: Campaign = useMemo(
    () => ({
      ...campaign,
      name: pageName,
      theme: currentTheme,
      sections: sections,
    }),
    [campaign, pageName, currentTheme, sections]
  )

  // URL UTM Gerada
  const generatedUtmUrl = useMemo(() => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://grupoempresa.vercel.app"
    const url = new URL(`/c/${campaign.slug}`, baseUrl)
    if (utmSource) url.searchParams.set("utm_source", utmSource)
    if (utmMedium) url.searchParams.set("utm_medium", utmMedium)
    if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign)
    return url.toString()
  }, [campaign.slug, utmSource, utmMedium, utmCampaign])

  const copyUtmLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedUtmUrl)
      setCopiedUtm(true)
      success("Link de Anúncio Copiado!", "Cole diretamente nos anúncios do Facebook Ads / Instagram Ads.")
      setTimeout(() => setCopiedUtm(false), 2500)
    } catch {
      showError("Erro ao copiar", "Copie o link manualmente.")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f1117] text-slate-100 antialiased overflow-hidden select-none font-sans">
      
      {/* ── TOP BAR / CABEÇALHO DO ESTÚDIO ──────────────────────────────────────── */}
      <header className="h-14 shrink-0 border-b border-slate-800 bg-[#161922] px-4 flex items-center justify-between z-30">
        {/* Lado Esquerdo: Voltar + Logo + Nome da Página */}
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Painel Geral</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Logo Sua Empresa */}
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_IMAGES.banner} alt="Sua Empresa" className="h-6 w-auto object-contain" />
          </div>

          <div className="h-5 w-[1px] bg-slate-800" />

          {/* Input com Nome da Página e Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold hidden md:inline">Página:</span>
            <input
              type="text"
              value={pageName}
              onChange={(e) => {
                setPageName(e.target.value)
                setIsDirty(true)
              }}
              className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:border-amber-400 focus:outline-none w-48 sm:w-64 truncate"
              placeholder="Nome da Landing Page"
            />
            {isDirty ? (
              <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                ● Não salvo
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Check className="h-3 w-3" /> Salvo no banco
              </span>
            )}
          </div>
        </div>

        {/* Centro: Controles de Dispositivo (Desktop / Tablet / Mobile) */}
        <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => setPreviewDevice("desktop")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all",
              previewDevice === "desktop"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setPreviewDevice("tablet")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all",
              previewDevice === "tablet"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Tablet className="h-3.5 w-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setPreviewDevice("mobile")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all",
              previewDevice === "mobile"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Lado Direito: Ações (Selo, Preview, Salvar, Publicar) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Frota 45 Anos OK
          </span>

          <a
            href={`/c/${campaign.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs font-bold text-slate-200 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Preview</span>
          </a>

          <Button
            onClick={() => handleSave(false)}
            disabled={saving}
            variant="outline"
            className="h-8 gap-1.5 border-slate-700 bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold rounded-xl"
          >
            <Save className="h-3.5 w-3.5" />
            <span>{saving ? "Salvando..." : "Salvar"}</span>
          </Button>

          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="h-8 gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-black px-4 rounded-xl shadow-md shadow-violet-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <Rocket className="h-3.5 w-3.5" />
            <span>Publicar</span>
          </Button>
        </div>
      </header>

      {/* ── CORPO PRINCIPAL DO ESTÚDIO (3 COLUNAS) ──────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── 1. COLUNA DA ESQUERDA (CONFIGURAÇÃO GERAL & NAVEGAÇÃO) ─────────────── */}
        <aside className="w-64 xl:w-72 shrink-0 border-r border-slate-800 bg-[#13151e] flex flex-col justify-between overflow-y-auto z-20">
          <div className="p-4 space-y-6">

            {/* Bloco: Página Atual */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                Página Atual
              </span>
              <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate max-w-[180px]">{pageName}</span>
                  <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                    Ativa
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px] text-amber-300">/c/{campaign.slug}</span>
                  <a
                    href={`/c/${campaign.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet-400 hover:text-violet-300"
                    title="Abrir página pública"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bloco: Composição Visual */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                Composição Visual
              </span>

              <div className="space-y-1.5">
                <button
                  onClick={() => setCatalogModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-black transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Plus className="h-4 w-4 text-amber-400" />
                    Adicionar Seção
                  </span>
                  <span className="text-[9px] font-black uppercase bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-200">
                    Catálogo
                  </span>
                </button>

                <button
                  onClick={() => setStructureModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-slate-400" />
                    Estrutura da Página
                  </span>
                  <span className="text-[10px] font-bold bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 border border-slate-700">
                    {sections.length}
                  </span>
                </button>

                <button
                  onClick={() => setJsonModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-400" />
                    Importar / IA (JSON)
                  </span>
                  <span className="text-[9px] font-black uppercase bg-violet-600/20 text-violet-300 px-1.5 py-0.5 rounded">
                    IA
                  </span>
                </button>

                <button
                  onClick={() => setGalleryModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-emerald-400" />
                    Acervo de Imagens
                  </span>
                  <span className="text-[9px] font-black uppercase bg-emerald-600/20 text-emerald-300 px-1.5 py-0.5 rounded">
                    Galeria
                  </span>
                </button>
              </div>
            </div>

            {/* Bloco: Tema & Fundo da Página (Dinâmico) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Tema & Fundo da Página
                </span>
                <span className="text-[9px] font-black text-amber-400 uppercase">Dinâmico</span>
              </div>

              <div className="space-y-1">
                {[
                  { id: "claro", label: "Claro Neutro (Branco & Cinza)", color: "bg-white", border: "border-slate-300" },
                  { id: "verde_claro", label: "Verde Claro (Sálvia & Eco)", color: "bg-emerald-300", border: "border-emerald-400" },
                  { id: "creme", label: "Creme Nobre (Institucional)", color: "bg-amber-100", border: "border-amber-300" },
                  { id: "navy", label: "Azul Sua Empresa (Céu & Marinho)", color: "bg-blue-600", border: "border-blue-600" },
                  { id: "editorial", label: "Editorial Dark (Ouro & Preto)", color: "bg-amber-500", border: "border-amber-500" },
                  { id: "emerald", label: "Tons de Verde (Economia & Frota)", color: "bg-emerald-500", border: "border-emerald-500" },
                  { id: "amber", label: "Ouro & Âmbar (Urgência Feirão)", color: "bg-orange-500", border: "border-orange-500" },
                  { id: "violet", label: "Violeta Tecnológico (Moderno)", color: "bg-purple-600", border: "border-purple-600" },
                  { id: "minimal", label: "Minimal Sofisticado (Carvão)", color: "bg-slate-300", border: "border-slate-300" },
                ].map((t) => {
                  const isSelected = currentTheme === t.id
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        setCurrentTheme(t.id as CampaignTheme)
                        setIsDirty(true)
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left text-xs font-bold transition-all",
                        isSelected
                          ? "bg-slate-800 border border-slate-700 text-white shadow-sm"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/60"
                      )}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={cn("h-3 w-3 rounded-full shrink-0 border border-black/20", t.color)} />
                        <span className="truncate">{t.label}</span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Bloco: Painel de Ajustes & UTM */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
                Painel de Ajustes
              </span>

              <div className="space-y-1.5">
                <button
                  onClick={() => setRightPanelOpen(!rightPanelOpen)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-slate-400" />
                    Propriedades do Bloco
                  </span>
                  <span className={cn(
                    "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                    rightPanelOpen
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border-slate-700"
                  )}>
                    {rightPanelOpen ? "Aberto" : "Oculto"}
                  </span>
                </button>

                <button
                  onClick={() => setUtmModalOpen(true)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Share2 className="h-4 w-4 text-amber-400" />
                    Links de Tráfego (UTMs)
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              </div>
            </div>

          </div>

          {/* Rodapé da Coluna Esquerda */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
            <button
              onClick={onClose}
              className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Gerenciar Todas as Campanhas</span>
            </button>
          </div>
        </aside>

        {/* ── 2. CANVAS CENTRAL (VISUAL LIVE CANVAS INTERATIVO) ────────────────────── */}
        <main className="flex-1 bg-[#0b0c11] overflow-y-auto flex flex-col items-center p-4 sm:p-6 lg:p-8 relative">
          
          {/* Container Responsivo do Dispositivo */}
          <div
            className={cn(
              "transition-all duration-300 origin-top shadow-2xl relative",
              previewDevice === "desktop" && "w-full max-w-5xl",
              previewDevice === "tablet" && "w-[768px] rounded-3xl border-8 border-slate-800 shadow-2xl overflow-hidden",
              previewDevice === "mobile" && "w-[390px] rounded-[44px] border-[10px] border-slate-800 shadow-2xl overflow-hidden ring-1 ring-white/10"
            )}
          >
            {/* Mockup da barra de status no modo Mobile */}
            {previewDevice === "mobile" && (
              <div className="h-6 bg-slate-950 flex items-center justify-between px-6 text-[10px] font-bold text-slate-400 z-30">
                <span>9:41</span>
                <div className="h-3 w-16 bg-slate-800 rounded-full" />
                <span>5G 100%</span>
              </div>
            )}

            {/* Container da Página Real onde cada bloco é clicável para edição */}
            <div className="relative">
              <InteractiveCanvasRenderer
                campaign={previewCampaign}
                sections={sections}
                activeSectionId={activeSectionId}
                previewDevice={previewDevice}
                onSelectSection={(id) => {
                  setActiveSectionId(id)
                  setRightPanelOpen(true)
                }}
                onMoveSection={moveSection}
                onDuplicateSection={duplicateSection}
                onDeleteSection={deleteSection}
              />
            </div>
          </div>
        </main>

        {/* ── 3. COLUNA DA DIREITA (PROPRIEDADES DO BLOCO SELECIONADO) ─────────────── */}
        {rightPanelOpen && activeSection && (
          <aside className="w-80 sm:w-96 shrink-0 border-l border-slate-800 bg-[#141722] flex flex-col justify-between overflow-y-auto z-20 animate-in slide-in-from-right-4 duration-200">
            <div className="p-5 space-y-6">

              {/* Cabeçalho do Bloco Ativo */}
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">
                      {getSectionLabel(activeSection.type)}
                    </h3>
                    <span className="text-[10px] font-bold bg-violet-600/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                      Bloco #{activeSectionIndex + 1}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {getSectionDescription(activeSection.type)}
                  </p>
                </div>

                <button
                  onClick={() => setRightPanelOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Formulário de Propriedades do Bloco */}
              <SectionPropertyEditor
                section={activeSection}
                onChange={updateActiveSectionField}
              />

            </div>

            {/* Rodapé da Coluna Direita com Ações Rápidas */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 truncate">ID: {activeSection.id}</span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => moveSection(activeSectionIndex, "up")}
                  disabled={activeSectionIndex === 0}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Subir seção"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(activeSectionIndex, "down")}
                  disabled={activeSectionIndex === sections.length - 1}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white disabled:opacity-30"
                  title="Descer seção"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => duplicateSection(activeSection)}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-violet-400"
                  title="Duplicar seção"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => deleteSection(activeSection.id)}
                  className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-rose-400"
                  title="Excluir seção"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        )}

      </div>

      {/* ── MODAIS DE APOIO ──────────────────────────────────────────────────────── */}

      {/* 1. Catálogo de Seções */}
      <Dialog open={catalogModalOpen} onOpenChange={setCatalogModalOpen}>
        <DialogContent className="max-w-2xl bg-[#161922] border-slate-800 text-white p-6">
          <DialogHeader className="border-b border-slate-800 pb-3">
            <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
              <Plus className="h-5 w-5 text-amber-400" />
              Catálogo de Blocos 4V
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Escolha um novo bloco estratégico para adicionar à sua landing page.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 max-h-[60vh] overflow-y-auto">
            {AVAILABLE_SECTIONS.map((sec) => (
              <button
                key={sec.type}
                onClick={() => addSection(sec.type)}
                className="flex flex-col text-left p-4 rounded-2xl border border-slate-800 bg-slate-900/80 hover:border-amber-400/50 hover:bg-slate-800/80 transition-all group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-black text-white group-hover:text-amber-300 transition-colors">
                    {sec.title}
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider bg-slate-800 group-hover:bg-amber-400/20 text-slate-400 group-hover:text-amber-300 px-2 py-0.5 rounded-full border border-slate-700">
                    {sec.tag}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                  {sec.description}
                </p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Modal de Estrutura da Página */}
      <Dialog open={structureModalOpen} onOpenChange={setStructureModalOpen}>
        <DialogContent className="max-w-md bg-[#161922] border-slate-800 text-white p-6">
          <DialogHeader className="border-b border-slate-800 pb-3">
            <DialogTitle className="text-base font-black text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-400" />
              Estrutura das Seções ({sections.length})
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Reordene, duplique ou alterne a visibilidade das seções da página.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-3 max-h-[55vh] overflow-y-auto">
            {sections.map((sec, idx) => {
              const isSelected = sec.id === activeSectionId
              return (
                <div
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id)
                    setStructureModalOpen(false)
                    setRightPanelOpen(true)
                  }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                    isSelected
                      ? "border-violet-500 bg-violet-600/10 text-white"
                      : "border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                    <span className="truncate">{getSectionLabel(sec.type)}</span>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleSection(sec.id)}
                      className="p-1 text-slate-400 hover:text-white"
                      title={sec.enabled ? "Ocultar seção" : "Exibir seção"}
                    >
                      {sec.enabled ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <button
                      onClick={() => moveSection(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveSection(idx, "down")}
                      disabled={idx === sections.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => duplicateSection(sec)}
                      className="p-1 text-slate-400 hover:text-violet-400"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => deleteSection(sec.id)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Modal de Acervo Geral da Frota */}
      <Dialog open={galleryModalOpen} onOpenChange={setGalleryModalOpen}>
        <DialogContent className="max-w-3xl bg-[#161922] border-slate-800 text-white p-6">
          <DialogHeader className="border-b border-slate-800 pb-3">
            <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
              <Car className="h-5 w-5 text-emerald-400" />
              Acervo de Fotos Oficiais da Frota ({LOCAL_CAR_PRESETS.length} Modelos)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Todos os modelos da frota possuem imagem com fundo transparente otimizado.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 max-h-[60vh] overflow-y-auto">
            {LOCAL_CAR_PRESETS.map((car) => (
              <div
                key={car.file}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-2 flex flex-col items-center text-center"
              >
                <div className="h-24 w-full bg-slate-950 rounded-xl p-2 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={car.file} alt={car.name} className="h-full w-full object-contain" />
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">
                    {car.category}
                  </span>
                  <h5 className="text-xs font-black text-white truncate max-w-[180px]">{car.name}</h5>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (activeSection) {
                      updateActiveSectionField("imageUrl", car.file)
                      setGalleryModalOpen(false)
                      success("Imagem atribuída!", `Aplicado ao bloco '${getSectionLabel(activeSection.type)}'.`)
                    }
                  }}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-violet-600 text-xs font-bold text-slate-200 hover:text-white transition-colors"
                >
                  Usar no Bloco Selecionado
                </button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. Modal Gerador de Links UTM para Tráfego */}
      <Dialog open={utmModalOpen} onOpenChange={setUtmModalOpen}>
        <DialogContent className="max-w-md bg-[#161922] border-slate-800 text-white p-6 space-y-4">
          <DialogHeader className="border-b border-slate-800 pb-3">
            <DialogTitle className="text-base font-black text-amber-400 flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Links Parametrizados (Facebook / Instagram Ads)
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Cole este link no botão de anúncio para rastrear cliques e conversões.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Origem (utm_source)</label>
              <Input
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                placeholder="facebook"
                className="bg-slate-900 border-slate-700 text-white text-xs h-9 mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Meio (utm_medium)</label>
              <Input
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                placeholder="cpc"
                className="bg-slate-900 border-slate-700 text-white text-xs h-9 mt-1"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Campanha (utm_campaign)</label>
              <Input
                value={utmCampaign}
                onChange={(e) => setUtmCampaign(e.target.value)}
                placeholder="hibridos"
                className="bg-slate-900 border-slate-700 text-white text-xs h-9 mt-1"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Link Final Gerado</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={generatedUtmUrl}
                className="flex-1 bg-slate-950 border border-slate-800 text-amber-300 font-mono text-[11px] px-3 py-2 rounded-xl"
              />
              <Button
                onClick={copyUtmLink}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 rounded-xl shrink-0"
              >
                {copiedUtm ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 5. Modal de Criação / Importação via IA JSON */}
      <JsonAiModal
        open={jsonModalOpen}
        onClose={() => setJsonModalOpen(false)}
        mode="import_sections"
        currentSections={sections}
        onImportSections={handleImportSections}
      />

    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RENDERIZADOR DO CANVAS INTERATIVO COM FRAMES SELECIONÁVEIS
// ─────────────────────────────────────────────────────────────────────────────
function InteractiveCanvasRenderer({
  campaign,
  sections,
  activeSectionId,
  previewDevice = "desktop",
  onSelectSection,
  onMoveSection,
  onDuplicateSection,
  onDeleteSection,
}: {
  campaign: Campaign
  sections: CampaignSection[]
  activeSectionId: string | null
  previewDevice?: "desktop" | "tablet" | "mobile"
  onSelectSection: (id: string) => void
  onMoveSection: (index: number, direction: "up" | "down") => void
  onDuplicateSection: (sec: CampaignSection) => void
  onDeleteSection: (id: string) => void
}) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800/80">
      <DynamicLandingRenderer
        campaign={{ ...campaign, sections }}
        isEditor={true}
        previewDevice={previewDevice}
        activeSectionId={activeSectionId}
        onSelectSection={onSelectSection}
        onMoveSection={onMoveSection}
        onDuplicateSection={onDuplicateSection}
        onDeleteSection={onDeleteSection}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EDITOR DE PROPRIEDADES DO BLOCO ATIVO (PAINEL LATERAL DIREITO)
// ─────────────────────────────────────────────────────────────────────────────
function SectionPropertyEditor({
  section,
  onChange,
}: {
  section: CampaignSection
  onChange: (field: string, val: any) => void
}) {
  switch (section.type) {
    case "hero": {
      const s = section as any
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Variante de Abertura
            </label>
            <select
              value={s.variant || "problem_match"}
              onChange={(e) => onChange("variant", e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-bold text-white focus:border-violet-500 focus:outline-none"
            >
              <option value="problem_match">Problema / Dúvida (Problem Match)</option>
              <option value="benefit_direct">Benefício Direto (Economia)</option>
              <option value="spotlight_car">Destaque de Frota (Veículo Oficial)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Eyebrow (Linha de Apoio / Selo)
            </label>
            <Input
              value={s.badgeText || ""}
              onChange={(e) => onChange("badgeText", e.target.value)}
              placeholder="Ex: FROTA PRÓPRIA SUA EMPRESA"
              className="bg-slate-900 border-slate-700 text-white text-xs h-9"
            />
          </div>

          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Pergunta / Headline Principal
            </label>
            <Input
              value={s.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              placeholder="Ex: Aluguel de Corolla Cross Híbrido em SP"
              className="bg-slate-900 border-slate-700 text-white text-xs h-9"
            />
          </div>

          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Subtítulo Explicativo
            </label>
            <Textarea
              value={s.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              placeholder="Explicação clara sobre requisitos, economia e vantagens..."
              className="bg-slate-900 border-slate-700 text-white text-xs min-h-[75px]"
            />
          </div>

          {/* Imagem do Hero */}
          <div className="pt-2 border-t border-slate-800">
            <ImageSelectorField
              label="Fotografia / Imagem do Hero"
              value={s.imageUrl || ""}
              onChange={(url) => onChange("imageUrl", url)}
              helperText="Recomendado: Imagem PNG transparente de veículo da frota ou banner oficial."
            />
          </div>

          {/* Botões CTA */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Texto do Botão CTA
              </label>
              <Input
                value={s.primaryCtaText || ""}
                onChange={(e) => onChange("primaryCtaText", e.target.value)}
                placeholder="Quero me cadastrar"
                className="bg-slate-900 border-slate-700 text-white text-xs h-9"
              />
            </div>
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Link do Botão CTA
              </label>
              <Input
                value={s.primaryCtaUrl || ""}
                onChange={(e) => onChange("primaryCtaUrl", e.target.value)}
                placeholder="#cadastro"
                className="bg-slate-900 border-slate-700 text-white text-xs h-9"
              />
            </div>
          </div>
        </div>
      )
    }

    case "product_spotlight": {
      const s = section as any
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Nome do Veículo
            </label>
            <Input
              value={s.productName || ""}
              onChange={(e) => onChange("productName", e.target.value)}
              placeholder="Ex: Toyota Corolla Cross Híbrido 2026"
              className="bg-slate-900 border-slate-700 text-white text-xs h-9"
            />
          </div>

          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Categoria / Selo
            </label>
            <Input
              value={s.productCategory || ""}
              onChange={(e) => onChange("productCategory", e.target.value)}
              placeholder="SUV Híbrido · Uber Black & Comfort"
              className="bg-slate-900 border-slate-700 text-white text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Diária (R$)
              </label>
              <Input
                type="number"
                value={s.dailyRate || ""}
                onChange={(e) => onChange("dailyRate", Number(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white text-xs h-9"
              />
            </div>
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Semanal (R$)
              </label>
              <Input
                type="number"
                value={s.weeklyRate || ""}
                onChange={(e) => onChange("weeklyRate", Number(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white text-xs h-9"
              />
            </div>
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Mensal (R$)
              </label>
              <Input
                type="number"
                value={s.monthlyRate || ""}
                onChange={(e) => onChange("monthlyRate", Number(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white text-xs h-9"
              />
            </div>
          </div>

          <ImageSelectorField
            label="Foto Oficial do Veículo"
            value={s.imageUrl || ""}
            onChange={(url) => onChange("imageUrl", url)}
            helperText="Selecione na galeria de 28 modelos locais com fundo transparente."
          />
        </div>
      )
    }

    case "context_empathy": {
      const s = section as any
      const cards = s.cards || []
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Título da Seção
            </label>
            <Input
              value={s.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white text-xs h-9"
            />
          </div>
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Subtítulo de Empatia
            </label>
            <Textarea
              value={s.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white text-xs min-h-[60px]"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
              Cards de Problemas / Dores ({cards.length})
            </span>
            {cards.map((c: any, i: number) => (
              <div key={i} className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400">Card #{i + 1}</span>
                </div>
                <Input
                  value={c.title || ""}
                  onChange={(e) => {
                    const next = [...cards]
                    next[i] = { ...next[i], title: e.target.value }
                    onChange("cards", next)
                  }}
                  placeholder="Título do problema"
                  className="bg-slate-950 border-slate-800 text-white text-xs h-8"
                />
                <Textarea
                  value={c.description || ""}
                  onChange={(e) => {
                    const next = [...cards]
                    next[i] = { ...next[i], description: e.target.value }
                    onChange("cards", next)
                  }}
                  placeholder="Descrição da dor ou situação..."
                  className="bg-slate-950 border-slate-800 text-white text-xs min-h-[50px]"
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    case "diferenciais_4v": {
      const s = section as any
      const items = s.items || []
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Título dos 4Vs
            </label>
            <Input
              value={s.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white text-xs h-9"
            />
          </div>
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Subtítulo
            </label>
            <Textarea
              value={s.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white text-xs min-h-[60px]"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
              Itens dos 4Vs ({items.length})
            </span>
            {items.map((it: any, i: number) => (
              <div key={i} className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400">{it.highlight || `V${i+1}`}</span>
                </div>
                <Input
                  value={it.title || ""}
                  onChange={(e) => {
                    const next = [...items]
                    next[i] = { ...next[i], title: e.target.value }
                    onChange("items", next)
                  }}
                  placeholder="Título do pilar"
                  className="bg-slate-950 border-slate-800 text-white text-xs h-8"
                />
                <Textarea
                  value={it.description || ""}
                  onChange={(e) => {
                    const next = [...items]
                    next[i] = { ...next[i], description: e.target.value }
                    onChange("items", next)
                  }}
                  placeholder="Explicação do diferencial..."
                  className="bg-slate-950 border-slate-800 text-white text-xs min-h-[50px]"
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    case "earnings_calculator": {
      const s = section as any
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Título do Simulador
            </label>
            <Input
              value={s.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white text-xs h-9"
            />
          </div>
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Km/Dia Padrão
            </label>
            <Input
              type="number"
              value={s.defaultKmPerDay || 200}
              onChange={(e) => onChange("defaultKmPerDay", Number(e.target.value))}
              className="bg-slate-900 border-slate-700 text-white text-xs h-9"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Consumo Híbrido (km/l)
              </label>
              <Input
                type="number"
                step="0.1"
                value={s.hybridAvgKmPerLiter || 19.5}
                onChange={(e) => onChange("hybridAvgKmPerLiter", Number(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white text-xs h-9"
              />
            </div>
            <div>
              <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                Consumo Flex (km/l)
              </label>
              <Input
                type="number"
                step="0.1"
                value={s.flexAvgKmPerLiter || 9.8}
                onChange={(e) => onChange("flexAvgKmPerLiter", Number(e.target.value))}
                className="bg-slate-900 border-slate-700 text-white text-xs h-9"
              />
            </div>
          </div>
        </div>
      )
    }

    default: {
      const s = section as any
      return (
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Título da Seção
            </label>
            <Input
              value={s.title || ""}
              onChange={(e) => onChange("title", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white text-xs h-9"
            />
          </div>
          <div>
            <label className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Subtítulo / Descrição
            </label>
            <Textarea
              value={s.subtitle || ""}
              onChange={(e) => onChange("subtitle", e.target.value)}
              className="bg-slate-900 border-slate-700 text-white text-xs min-h-[70px]"
            />
          </div>
          <ImageSelectorField
            label="Imagem da Seção (Opcional)"
            value={s.imageUrl || ""}
            onChange={(url) => onChange("imageUrl", url)}
          />
        </div>
      )
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// METADADOS E AUXILIARES DO CATÁLOGO DE BLOCOS
// ─────────────────────────────────────────────────────────────────────────────
const AVAILABLE_SECTIONS = BRAND.vertical === "juridico"
  ? [
      {
        type: "hero" as SectionType,
        title: "Hero Jurídico (Abertura & V1)",
        tag: "Abertura",
        description: "Chamada principal com posicionamento de autoridade, áreas de destaque e CTAs de consulta.",
      },
      {
        type: "product_spotlight" as SectionType,
        title: "Especialidade em Destaque (V1/V3)",
        tag: "Prática",
        description: "Apresentação da área de atuação especializada (Tributário, Trabalhista, Contratos, etc.).",
      },
      {
        type: "context_empathy" as SectionType,
        title: "Contexto & Desafios do Cliente (V2)",
        tag: "Vínculo",
        description: "Cards com riscos jurídicos reais e como a assessoria estratégica resguarda seu patrimônio.",
      },
      {
        type: "diferenciais_4v" as SectionType,
        title: "Os 4 Pilares da Advocacia (V1/V2)",
        tag: "Autoridade",
        description: "Metodologia jurídica exclusiva: Rigor Técnico, Sigilo, Velocidade e Abordagem Resolutiva.",
      },
      {
        type: "how_it_works" as SectionType,
        title: "Jornada de Atendimento (V3)",
        tag: "Processo",
        description: "4 passos claros do primeiro contato até o plano estratégico de ação jurídica.",
      },
      {
        type: "testimonials" as SectionType,
        title: "Depoimentos & Casos de Sucesso (V3)",
        tag: "Prova Social",
        description: "Recomendações e avaliações de clientes satisfeitos com a atuação do escritório.",
      },
      {
        type: "faq_accordion" as SectionType,
        title: "Dúvidas Frequentes FAQ (V4)",
        tag: "Esclarecimentos",
        description: "Respostas transparentes sobre honorários, etapas processuais e sigilo.",
      },
      {
        type: "lead_form" as SectionType,
        title: "Agendamento de Consulta (V4)",
        tag: "Captação",
        description: "Formulário de triagem jurídica direto no painel com sigilo profissional.",
      },
      {
        type: "whatsapp_cta_banner" as SectionType,
        title: "Plantão Jurídico WhatsApp (V4)",
        tag: "Urgência",
        description: "Contato imediato para medidas cautelares, liminares e plantão.",
      },
    ]
  : [
      {
        type: "hero" as SectionType,
        title: "Hero Veículo (Atenção & V1)",
        tag: "Abertura",
        description: "Chamada principal com título de alto impacto, foto ampla do carro e CTAs diretos.",
      },
      {
        type: "product_spotlight" as SectionType,
        title: "Veículo em Destaque (V1/V3)",
        tag: "Oferta",
        description: "Exposição detalhada do veículo oficial, valores de diária/semanal e itens inclusos.",
      },
      {
        type: "context_empathy" as SectionType,
        title: "Contexto & Empatia (V2)",
        tag: "Vínculo",
        description: "3 cards de problemas reais vividos por motoristas e a solução da plataforma.",
      },
      {
        type: "diferenciais_4v" as SectionType,
        title: "Os 4Vs da Plataforma (V1/V2)",
        tag: "Autoridade",
        description: "Pilares oficiais da Bíblia 4V: Valor, Vínculo, Validação e Velocidade.",
      },
      {
        type: "earnings_calculator" as SectionType,
        title: "Simulador de Economia (V1)",
        tag: "Conversão",
        description: "Calculadora interativa que compara economia diária e mensal de híbridos vs flex.",
      },
      {
        type: "how_it_works" as SectionType,
        title: "Como Funciona (V3)",
        tag: "Processo",
        description: "4 passos simples do envio de documentos até a retirada em até 24 horas.",
      },
      {
        type: "testimonials" as SectionType,
        title: "Depoimentos Reais (V3)",
        tag: "Prova Social",
        description: "Avaliações com 5 estrelas e depoimentos de motoristas parceiros.",
      },
      {
        type: "faq_accordion" as SectionType,
        title: "Perguntas Frequentes FAQ (V4)",
        tag: "Dúvidas",
        description: "Accordion com as dúvidas mais comuns para eliminar objeções antes do cadastro.",
      },
      {
        type: "lead_form" as SectionType,
        title: "Formulário de Cadastro (V4)",
        tag: "Captação",
        description: "Formulário direto de conversão integrado com o CRM de leads do painel.",
      },
      {
        type: "whatsapp_cta_banner" as SectionType,
        title: "Banner WhatsApp Plantão (V4)",
        tag: "Plantão",
        description: "Chamada em destaque para conversar imediatamente com um consultor humano.",
      },
    ]

function getSectionLabel(type: SectionType): string {
  const isJuridico = BRAND.vertical === "juridico"
  switch (type) {
    case "hero": return isJuridico ? "Hero Jurídico (Atenção & V1)" : "Hero Veículo (Atenção & V1)"
    case "context_empathy": return isJuridico ? "Contexto & Riscos do Cliente (V2)" : "Contexto & Empatia (V2)"
    case "diferenciais_4v": return isJuridico ? "Os 4 Pilares da Atuação Jurídica (V1/V2)" : "Os 4Vs da Plataforma (V1/V2)"
    case "product_spotlight": return isJuridico ? "Especialidade em Destaque (V1/V3)" : "Veículo em Destaque (V1/V3)"
    case "how_it_works": return isJuridico ? "Jornada de Atendimento (V3)" : "Como Funciona em 4 Passos (V3)"
    case "testimonials": return isJuridico ? "Depoimentos & Avaliações (V3)" : "Depoimentos & Prova Social (V3)"
    case "earnings_calculator": return "Simulador de Economia (V1)"
    case "faq_accordion": return isJuridico ? "Dúvidas Frequentes FAQ (V4)" : "Perguntas Frequentes FAQ (V4)"
    case "lead_form": return isJuridico ? "Formulário de Atendimento (V4)" : "Formulário de Cadastro (V4)"
    case "whatsapp_cta_banner": return isJuridico ? "Banner Plantão Jurídico (V4)" : "Banner WhatsApp Plantão (V4)"
    default: return "Seção Customizada"
  }
}

function getSectionDescription(type: SectionType): string {
  const isJuridico = BRAND.vertical === "juridico"
  switch (type) {
    case "hero": return isJuridico ? "Abertura com posicionamento de autoridade, especialidade jurídica e CTAs." : "Abertura com proposta de valor, headline, selos e fotografia de destaque."
    case "product_spotlight": return isJuridico ? "Vitrine da especialidade jurídica com escopo de atuação e atendimento." : "Vitrine técnica do carro com preços, pacote de benefícios e reserva."
    case "context_empathy": return isJuridico ? "Conexão com os desafios, riscos contratuais ou tributários do cliente." : "Conexão empática com os desafios da rotina operacional."
    case "diferenciais_4v": return isJuridico ? "Pilares comprovados da atuação jurídica, ética OAB e metodologia resolutiva." : "Pilares oficiais de experiência e confiabilidade."
    case "earnings_calculator": return "Simulador interativo de economia."
    case "how_it_works": return isJuridico ? "Jornada simples de 4 etapas do primeiro contato à condução estratégica do caso." : "Jornada simples de 4 etapas para aprovação e retirada em 24h."
    case "testimonials": return isJuridico ? "Depoimentos e avaliações de clientes atendidos pelo escritório." : "Prova social autêntica de parceiros em atividade."
    case "faq_accordion": return isJuridico ? "Respostas diretas sobre honorários, prazos processuais e confidencialidade." : "Respostas diretas para as principais dúvidas e regras de locação."
    case "lead_form": return isJuridico ? "Captura confidencial de nome, WhatsApp e demanda jurídica para o CRM." : "Captura de nome, WhatsApp e modelo diretamente no CRM."
    case "whatsapp_cta_banner": return isJuridico ? "Acesso imediato ao plantão do escritório para agendamento de consultas." : "Acesso imediato ao atendimento comercial no WhatsApp."
    default: return "Configurações gerais do bloco."
  }
}

function createDefaultSection(type: SectionType, order: number): CampaignSection {
  const base = { id: `sec_${type}_${Date.now()}`, type, enabled: true, order }
  const isJuridico = BRAND.vertical === "juridico"

  if (isJuridico) {
    const foundJuridico = DEFAULT_JURIDICO_4V_SECTIONS.find(s => s.type === type)
    if (foundJuridico) {
      return {
        ...foundJuridico,
        id: `sec_${type}_${Date.now()}`,
        order,
      } as CampaignSection
    }
  }

  switch (type) {
    case "hero":
      return {
        ...base,
        type: "hero",
        title: "Aluguel de Corolla Cross Híbrido em SP",
        subtitle: "Economize até 50% de combustível no trânsito de São Paulo. Retirada em até 24 horas sem consulta impeditiva de score.",
        badgeText: "FROTA PRÓPRIA · PRONTA ENTREGA",
        imageUrl: "/images/cars/cross.png",
        primaryCtaText: "Quero Alugar Agora",
        primaryCtaUrl: "#cadastro",
        showWhatsappBtn: true,
      }
    case "context_empathy":
      return {
        ...base,
        type: "context_empathy",
        title: "Sabemos o que você enfrenta nas ruas de SP",
        subtitle: "Preço alto de combustível, carros que quebram e burocracia de locadoras tradicionais comem o seu lucro.",
        cards: [
          { title: "Combustível caro demais", description: "Metade do que você fatura vai direto para o posto de gasolina." },
          { title: "Manutenções surpresa", description: "Carros velhos que te deixam na mão e dias parados sem faturar." },
          { title: "Burocracia sem fim", description: "Exigências absurdas de score que bloqueiam quem quer trabalhar." },
        ],
      }
    case "diferenciais_4v":
      return {
        ...base,
        type: "diferenciais_4v",
        title: "A Diferença em 4 Pilares",
        subtitle: "Não somos apenas uma plataforma. Somos parceiros do seu resultado.",
        items: [
          { vKey: "valor", highlight: "V1 · VALOR REAL", title: "Economia Real", description: "Resultados consistentes e previsibilidade para você." },
          { vKey: "vantagem", highlight: "V2 · VÍNCULO DIRETO", title: "Atendimento Humanizado", description: "Você fala com pessoas reais e experientes." },
          { vKey: "variedade", highlight: "V3 · VALIDAÇÃO", title: "Tradição & Ética", description: "Experiência comprovada de mercado." },
          { vKey: "velocidade", highlight: "V4 · VELOCIDADE", title: "Agilidade", description: "Atendimento dinâmico e resposta rápida." },
        ],
      }
    case "product_spotlight":
      return {
        ...base,
        type: "product_spotlight",
        title: "Destaque Principal",
        subtitle: "Conheça nossa principal solução em destaque.",
        productName: "Serviço Especializado",
        productCategory: "Consultoria & Estratégia",
        dailyRate: 0,
        weeklyRate: 0,
        monthlyRate: 0,
        imageUrl: "/images/sobre/escritorio.jpg",
        features: [
          "Atendimento especializado",
          "Acompanhamento personalizado",
          "Plantão ágil e transparente",
          "Suporte completo",
        ],
      }
    case "earnings_calculator":
      return {
        ...base,
        type: "earnings_calculator",
        title: "Simule Quanto Você Vai Economizar",
        subtitle: "Veja a diferença real no bolso ao comparar os custos.",
        defaultKmPerDay: 200,
        fuelPricePerLiter: 5.89,
        hybridAvgKmPerLiter: 19.5,
        flexAvgKmPerLiter: 9.8,
      }
    case "how_it_works":
      return {
        ...base,
        type: "how_it_works",
        title: "Como Funciona o Atendimento em 4 Passos",
        subtitle: "Processo rápido, transparente e 100% descomplicado.",
        steps: [
          { number: 1, title: "Envie seus dados", description: "Preencha o formulário rápido com seu contato." },
          { number: 2, title: "Análise Preliminar", description: "Avaliamos sua demanda com total confidencialidade." },
          { number: 3, title: "Planejamento", description: "Apresentamos a estratégia sob medida para você." },
          { number: 4, title: "Execução", description: "Início imediato com acompanhamento contínuo." },
        ],
      }
    case "testimonials":
      return {
        ...base,
        type: "testimonials",
        title: "Depoimentos de Quem Já Confia em Nós",
        subtitle: "Veja a experiência de quem já foi atendido por nossa equipe.",
        items: [
          { name: "Carlos M.", role: "Cliente Corporativo", testimony: "Atendimento impecável e clareza em todas as etapas.", rating: 5 },
          { name: "Roberto S.", role: "Cliente", testimony: "Excelente retorno e dedicação total à nossa demanda.", rating: 5 },
          { name: "Fernanda L.", role: "Cliente", testimony: "O suporte é rápido e humano. Recomendo com segurança.", rating: 5 },
        ],
      }
    case "faq_accordion":
      return {
        ...base,
        type: "faq_accordion",
        title: "Perguntas Frequentes (FAQ)",
        subtitle: "Tudo o que você precisa saber antes de iniciar o atendimento.",
        items: [
          { question: "Como funciona o atendimento?", answer: "Analisamos sua demanda de forma individualizada com retorno rápido." },
          { question: "O primeiro contato tem compromisso?", answer: "Não, nossa avaliação preliminar é para entender o cenário e indicar os melhores caminhos." },
          { question: "Qual o prazo médio de resposta?", answer: "Respondemos em até 24 horas úteis pelo WhatsApp ou e-mail." },
        ],
      }
    case "lead_form":
      return {
        ...base,
        type: "lead_form",
        title: "Solicite seu Atendimento Hoje Mesmo",
        subtitle: "Preencha seus dados abaixo para receber o contato da nossa equipe em minutos.",
        buttonText: "Enviar Solicitação",
        successMessage: "Recebemos sua mensagem! Nossa equipe entrará em contato em breve.",
      }
    case "whatsapp_cta_banner":
      return {
        ...base,
        type: "whatsapp_cta_banner",
        title: "Prefere Tirar Dúvidas Direto no WhatsApp?",
        subtitle: "Nosso plantão de atendimento está disponível para responder suas perguntas.",
        buttonText: "Falar no WhatsApp",
        phone: BRAND.contact.whatsapp || "5511999999999",
        customMessage: "Olá! Gostaria de mais informações sobre o atendimento.",
      }
    default:
      return {
        ...base,
        type: "hero",
        title: "Novo Bloco",
        subtitle: "Descrição do bloco.",
      }
  }
}
