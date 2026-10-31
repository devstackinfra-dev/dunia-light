"use client"

import React, { useState } from "react"
import {
  Sparkles, Copy, Check, FileJson, Download, Upload, AlertCircle, RefreshCw, Code, BookOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CampaignSection } from "@/types/campaign-studio"
import { CampaignInput } from "@/lib/campaigns-crud"
import { useToast } from "@/components/ui/toast-simple"
import { BRAND } from "@/config/brand"

const JURIDICO_PROMPT_TEMPLATE = `Você é um Copywriter e Estrategista Jurídico de Elite para o escritório ${BRAND.name} (banca de advocacia estratégica e consultoria de alto padrão).

Sua tarefa é criar o conteúdo completo em JSON para uma Landing Page de Alta Conversão Jurídica e Captação Ética.

DIRETRIZES ÉTICAS E DE CONVERSÃO 4V:
- Vantagem: Diagnóstico preliminar e soluções jurídicas resolutivas com redução comprovada de passivos e custos fiscais.
- Valor: Confidencialidade e sigilo profissional absoluto, rigor técnico e atendimento direto por especialistas.
- Velocidade: Agilidade na análise contratual e plantão imediato para medidas liminares de urgência.
- Variedade: Atuação multidisciplinar em Direito Tributário, Trabalhista, Contratos, Civil e Societário.

FORMATO DE RESPOSTA (Retorne APENAS o JSON válido sem texto adicional):

{
  "name": "Planejamento Tributário Estratégico 2026",
  "headline": "Reduza a Carga Tributária da sua Empresa com Segurança Jurídica",
  "subheadline": "Diagnóstico fiscal especializado para recuperação de créditos indevidos e prevenção de autuações.",
  "slug": "planejamento-tributario",
  "theme": "navy",
  "sections": [
    {
      "id": "sec_hero",
      "type": "hero",
      "enabled": true,
      "order": 0,
      "title": "Recuperação Tributária e Gestão Fiscal de Alto Impacto",
      "subtitle": "Atuação técnica e personalizada para proteger a rentabilidade e o patrimônio da sua empresa.",
      "badgeText": "${BRAND.name} • Advocacia Estratégica",
      "primaryCtaText": "Agendar Consulta Confidencial",
      "primaryCtaUrl": "#cadastro",
      "showWhatsappBtn": true,
      "whatsappPhone": "${BRAND.contact.whatsapp || "5511999999999"}",
      "whatsappText": "Olá! Gostaria de agendar uma consulta sobre planejamento tributário."
    },
    {
      "id": "sec_context",
      "type": "context_empathy",
      "enabled": true,
      "order": 1,
      "title": "Soluções Desenvolvidas para os Desafios Reais do Empresário",
      "cards": [
        {
          "title": "Tributação Excessiva e Bitributação",
          "description": "Identificamos pagamentos a maior ou indevidos e estruturamos a compensação administrativa segura."
        },
        {
          "title": "Prevenção Contra Passivos e Execuções",
          "description": "Blindagem prévia em conformidade estrita com as normas da Receita Federal e jurisprudência pacificada."
        }
      ]
    },
    {
      "id": "sec_faq",
      "type": "faq_accordion",
      "enabled": true,
      "order": 2,
      "title": "Perguntas Frequentes",
      "items": [
        {
          "question": "Como funciona o sigilo das informações compartilhadas?",
          "answer": "Todos os documentos e dados fiscais são protegidos sob rigoroso sigilo profissional e normas éticas da OAB."
        },
        {
          "question": "Qual o tempo médio para o diagnóstico preliminar?",
          "answer": "Nossa equipe realiza a análise de viabilidade inicial em até 48 a 72 horas úteis."
        }
      ]
    },
    {
      "id": "sec_whatsapp",
      "type": "whatsapp_cta_banner",
      "enabled": true,
      "order": 3,
      "title": "Prefere conversar diretamente com nossa equipe jurídica?",
      "subtitle": "Atendimento rápido e consultivo pelo WhatsApp institucional.",
      "buttonText": "Falar pelo WhatsApp Agora"
    }
  ]
}`

const CATALOGO_PROMPT_TEMPLATE = `Você é um Copywriter especialista em Landing Pages 4V para o ${BRAND.name}.

Sua tarefa é criar o conteúdo completo em JSON para uma Landing Page de Alta Conversão.

FORMATO DE RESPOSTA (Retorne APENAS o JSON válido sem texto adicional):
{
  "name": "Destaque da Semana",
  "headline": "Oportunidades Exclusivas",
  "subheadline": "Condições especiais com suporte completo.",
  "slug": "destaque",
  "theme": "emerald",
  "sections": []
}`

const PROMPT_TEMPLATE = BRAND.vertical === "juridico" ? JURIDICO_PROMPT_TEMPLATE : CATALOGO_PROMPT_TEMPLATE

const JURIDICO_SAMPLE_JSON = {
  name: "Auditoria e Blindagem Contratual",
  headline: "Segurança Jurídica para sua Empresa e Seus Negócios",
  subheadline: "Revisão e elaboração de contratos comerciais com proteção preventiva de riscos.",
  slug: "auditoria-contratual",
  theme: "navy",
  sections: [
    {
      id: "sec_hero_1",
      type: "hero",
      enabled: true,
      order: 0,
      title: "Contratos Estratégicos com Rigor Técnico",
      subtitle: "Proteja sua operação e evite disputas judiciais desgastantes.",
      badgeText: `${BRAND.name} • Contratos`,
      primaryCtaText: "Solicitar Análise de Contratos",
      primaryCtaUrl: "#cadastro"
    }
  ]
}

const CATALOGO_SAMPLE_JSON = {
  name: "Destaque Comercial",
  headline: "Oportunidade da Semana",
  subheadline: "Condições especiais para contratação.",
  slug: "destaque-semana",
  theme: "navy",
  sections: []
}

const SAMPLE_JSON = BRAND.vertical === "juridico" ? JURIDICO_SAMPLE_JSON : CATALOGO_SAMPLE_JSON


interface JsonAiModalProps {
  open: boolean
  onClose: () => void
  mode: "create_campaign" | "import_sections"
  currentSections?: CampaignSection[]
  onImportCampaign?: (payload: { campaignInput: CampaignInput; sections: CampaignSection[] }) => void
  onImportSections?: (sections: CampaignSection[], append: boolean) => void
}

export function JsonAiModal({
  open,
  onClose,
  mode,
  currentSections = [],
  onImportCampaign,
  onImportSections
}: JsonAiModalProps) {
  const { success, error: showError } = useToast()
  const [jsonText, setJsonText] = useState("")
  const [copiedPrompt, setCopiedPrompt] = useState(false)
  const [copiedExport, setCopiedExport] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [appendMode, setAppendMode] = useState(true)

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(PROMPT_TEMPLATE)
      setCopiedPrompt(true)
      success("Prompt copiado!", "Cole no ChatGPT, Claude ou Gemini para gerar o JSON.")
      setTimeout(() => setCopiedPrompt(false), 2500)
    } catch {
      showError("Erro ao copiar", "Selecione o texto e copie manualmente.")
    }
  }

  const handleLoadSample = () => {
    setJsonText(JSON.stringify(SAMPLE_JSON, null, 2))
    setValidationError(null)
  }

  const handleValidateAndImport = () => {
    setValidationError(null)
    if (!jsonText.trim()) {
      setValidationError("Cole o código JSON no campo acima.")
      return
    }

    try {
      const parsed = JSON.parse(jsonText)

      // MODE 1: Creating full campaign
      if (mode === "create_campaign") {
        if (!parsed.name && !parsed.headline && !Array.isArray(parsed.sections)) {
          throw new Error("O JSON precisa ter 'name' ou 'headline' e a lista de 'sections'.")
        }

        const campaignInput: CampaignInput = {
          name: parsed.name || "Nova Campanha via IA",
          headline: parsed.headline || "Título da Campanha",
          subheadline: parsed.subheadline || "",
          slug: parsed.slug || "",
          theme: parsed.theme || "navy",
          status: "draft",
          highlights: parsed.highlights || [],
          ctaText: parsed.ctaText || "Quero me cadastrar"
        }

        const sections: CampaignSection[] = Array.isArray(parsed.sections) ? parsed.sections : []

        if (onImportCampaign) {
          onImportCampaign({ campaignInput, sections })
          success("Campanha importada!", `${sections.length} seções geradas a partir do JSON.`)
          onClose()
        }
      } 
      // MODE 2: Importing sections into active studio
      else {
        let sectionsToAdd: CampaignSection[] = []

        if (Array.isArray(parsed)) {
          sectionsToAdd = parsed
        } else if (Array.isArray(parsed.sections)) {
          sectionsToAdd = parsed.sections
        } else if (parsed.type) {
          sectionsToAdd = [parsed]
        } else {
          throw new Error("O JSON precisa conter uma lista de seções ou um objeto de seção válido com campo 'type'.")
        }

        if (onImportSections) {
          onImportSections(sectionsToAdd, appendMode)
          success(
            appendMode ? "Seções adicionadas!" : "Seções substituídas!",
            `${sectionsToAdd.length} seções importadas com sucesso.`
          )
          onClose()
        }
      }
    } catch (err: any) {
      setValidationError(err?.message || "Erro de sintaxe JSON. Verifique vírgulas e aspas duplas.")
    }
  }

  const handleExportCurrentJson = async () => {
    const dataToExport = mode === "import_sections" 
      ? currentSections 
      : { sections: currentSections }

    const str = JSON.stringify(dataToExport, null, 2)
    try {
      await navigator.clipboard.writeText(str)
      setCopiedExport(true)
      success("JSON copiado!", "Estrutura copiada para a área de transferência.")
      setTimeout(() => setCopiedExport(false), 2000)
    } catch {
      showError("Erro ao copiar", "Não foi possível copiar o JSON.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 text-white border-slate-800 p-0 overflow-hidden shadow-2xl">
        <DialogHeader className="p-5 border-b border-slate-800 bg-slate-950/60">
          <DialogTitle className="flex items-center gap-2 text-base font-black text-amber-400">
            <Sparkles className="h-5 w-5 fill-amber-400" />
            {mode === "create_campaign"
              ? "Criar Landing Page via JSON / IA"
              : "Importar & Adicionar Seções via JSON / IA"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Peça para qualquer Inteligência Artificial (ChatGPT, Claude, Gemini, DeepSeek) criar a página em formato JSON e cole abaixo.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="import" className="w-full">
          <div className="px-5 pt-3 border-b border-slate-800 bg-slate-950/30">
            <TabsList className="bg-slate-800/80 border border-slate-700/80 p-1">
              <TabsTrigger value="import" className="text-xs font-bold gap-1.5 data-[state=active]:bg-amber-400 data-[state=active]:text-slate-950">
                <Upload className="h-3.5 w-3.5" /> Colar JSON da LLM
              </TabsTrigger>
              <TabsTrigger value="prompt" className="text-xs font-bold gap-1.5 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                <BookOpen className="h-3.5 w-3.5 text-amber-400" /> Copiar Prompt Mestre
              </TabsTrigger>
              {currentSections.length > 0 && (
                <TabsTrigger value="export" className="text-xs font-bold gap-1.5 data-[state=active]:bg-slate-700 data-[state=active]:text-white">
                  <Download className="h-3.5 w-3.5 text-sky-400" /> Exportar JSON Atual
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* TAB 1: IMPORT JSON */}
          <TabsContent value="import" className="p-5 space-y-4 m-0">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Code className="h-4 w-4 text-amber-400" />
                Código JSON da Landing Page / Seção:
              </label>

              <button
                onClick={handleLoadSample}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Carregar Exemplo de Teste
              </button>
            </div>

            <Textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='Cole aqui o JSON gerado pela IA, ex: { "name": "...", "sections": [...] }'
              className="font-mono text-xs h-64 bg-slate-950 border-slate-800 text-amber-200 placeholder:text-slate-600 focus:border-amber-400 focus:ring-amber-400/20"
            />

            {validationError && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/40 p-3 text-xs font-bold text-red-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                {validationError}
              </div>
            )}

            {mode === "import_sections" && (
              <div className="flex items-center gap-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800 text-xs">
                <span className="font-bold text-slate-300">Modo de Inserção:</span>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="appendMode"
                    checked={appendMode}
                    onChange={() => setAppendMode(true)}
                    className="accent-amber-400"
                  />
                  Adicionar às seções existentes
                </label>
                <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer font-semibold">
                  <input
                    type="radio"
                    name="appendMode"
                    checked={!appendMode}
                    onChange={() => setAppendMode(false)}
                    className="accent-amber-400"
                  />
                  Substituir todas as seções
                </label>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <Button onClick={onClose} variant="ghost" className="text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800">
                Cancelar
              </Button>
              <Button
                onClick={handleValidateAndImport}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs h-10 px-5 rounded-xl shadow-lg gap-2"
              >
                <Sparkles className="h-4 w-4 fill-slate-950" />
                {mode === "create_campaign" ? "Criar Landing Page do JSON" : "Inserir Seções do JSON"}
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: PROMPT TEMPLATE */}
          <TabsContent value="prompt" className="p-5 space-y-4 m-0">
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Instruções para a Inteligência Artificial
              </h4>
              <p className="text-xs text-slate-300">
                Copie o prompt abaixo e cole no ChatGPT, Claude ou Gemini. Ele já contém a Bíblia Criativa 4V e a estrutura JSON que o sistema lê automaticamente.
              </p>
            </div>

            <div className="relative">
              <Textarea
                readOnly
                value={PROMPT_TEMPLATE}
                className="font-mono text-[11px] h-64 bg-slate-950 border-slate-800 text-slate-300 select-all"
              />
              <Button
                onClick={handleCopyPrompt}
                className="absolute top-3 right-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs h-8 px-3 rounded-lg shadow-sm gap-1.5"
              >
                {copiedPrompt ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedPrompt ? "Copiado!" : "Copiar Prompt Mestre"}
              </Button>
            </div>
          </TabsContent>

          {/* TAB 3: EXPORT CURRENT */}
          {currentSections.length > 0 && (
            <TabsContent value="export" className="p-5 space-y-4 m-0">
              <div className="space-y-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-sky-400">
                  Exportar Estrutura JSON Atual
                </h4>
                <p className="text-xs text-slate-300">
                  Use esta estrutura como backup ou envie para a LLM para fazer modificações avançadas.
                </p>
              </div>

              <Textarea
                readOnly
                value={JSON.stringify(mode === "import_sections" ? currentSections : { sections: currentSections }, null, 2)}
                className="font-mono text-[11px] h-64 bg-slate-950 border-slate-800 text-emerald-400"
              />

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleExportCurrentJson}
                  className="bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs h-9 px-4 rounded-xl gap-1.5"
                >
                  {copiedExport ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedExport ? "JSON Copiado!" : "Copiar JSON Completo"}
                </Button>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
