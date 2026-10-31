"use client"

import { useEffect, useMemo, useState } from "react"
import { ExternalLink, Save, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/toast-simple"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ComplianceAlerta, confirmarCompliance, verificarCampos } from "@/components/admin/shared/ComplianceAlerta"
import { MediaSelectorDialog } from "@/components/admin/shared/MediaSelectorDialog"
import { authFetch } from "@/lib/api-client"
import { getSetting, setSetting } from "@/lib/db/settings"
import { resolverConteudo, slugDoPerfil, type ConteudoSite, type Perfil } from "@/lib/conteudo-tipos"
import type { HomeContent, HomeSectionId } from "@/config/home-content"

const CHAVE = "conteudo_site"

/** Seções que o cliente pode ligar, na ordem em que aparecem na página. */
const ORDEM: { id: HomeSectionId; rotulo: string }[] = [
  { id: "campanha", rotulo: "Banner de campanha" },
  { id: "sobre", rotulo: "Sobre" },
  { id: "areas", rotulo: "Áreas de atuação" },
  { id: "catalogo", rotulo: "Catálogo" },
  { id: "diferenciais", rotulo: "Diferenciais" },
  { id: "como-funciona", rotulo: "Como funciona" },
  { id: "publicacoes", rotulo: "Publicações (blog)" },
  { id: "chamada", rotulo: "Chamada para contato" },
  { id: "depoimentos", rotulo: "Depoimentos" },
  { id: "faq", rotulo: "Perguntas frequentes" },
  { id: "contato", rotulo: "Contato" },
]

// ─── Conversões entre listas e texto de uma linha por item ────────────────────
const linhas = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean)
const paraLinhas = (itens: string[]) => itens.join("\n")
/** "Título — texto" por linha */
const paresParaTexto = (itens: { title: string; text: string }[]) => itens.map((i) => `${i.title} — ${i.text}`).join("\n")
const textoParaPares = (t: string) =>
  linhas(t).map((l) => {
    const [title, ...resto] = l.split(/\s+[—-]\s+/)
    return { title: title.trim(), text: resto.join(" — ").trim() }
  })
/** FAQ: "P: pergunta" e "R: resposta", blocos separados por linha em branco */
const faqParaTexto = (itens: { q: string; a: string }[]) => itens.map((i) => `P: ${i.q}\nR: ${i.a}`).join("\n\n")
const textoParaFaq = (t: string) =>
  t.split(/\n\s*\n/).map((bloco) => {
    const q = bloco.match(/^P:\s*(.+)$/m)?.[1]?.trim() ?? ""
    const a = bloco.match(/^R:\s*([\s\S]+)$/m)?.[1]?.trim() ?? ""
    return { q, a }
  }).filter((i) => i.q && i.a)
/** Links: "Rótulo | https://…" */
const linksParaTexto = (itens: Perfil["links"]) => itens.map((l) => `${l.rotulo} | ${l.url}`).join("\n")
const textoParaLinks = (t: string) =>
  linhas(t).map((l) => {
    const [rotulo, url] = l.split("|").map((x) => x.trim())
    return { rotulo, url }
  }).filter((l) => l.rotulo && /^https?:\/\//.test(l.url ?? ""))

/** Formulário em texto puro — o que cada campo mostra e grava. */
interface Formulario {
  sections: HomeSectionId[]
  hero: HomeContent["hero"] & { confiancaTexto: string }
  sobreBadge: string; sobreTitulo: string; sobreParagrafos: string; sobreValores: string
  difTitulo: string; difSubtitulo: string; difCards: string
  chamada: HomeContent["chamada"]
  faq: string
  contatoTitulo: string; contatoSubtitulo: string
  rodape: string; navCta: string
  perfil: Perfil & { formacaoTexto: string; atuacaoTexto: string; linksTexto: string }
}

function paraFormulario(home: HomeContent, perfil: Perfil): Formulario {
  return {
    sections: home.sections,
    hero: { ...home.hero, confiancaTexto: paraLinhas(home.hero.confianca) },
    sobreBadge: home.sobre.badge,
    sobreTitulo: home.sobre.title,
    sobreParagrafos: home.sobre.paragraphs.join("\n\n"),
    sobreValores: paresParaTexto(home.sobre.valores),
    difTitulo: home.diferenciais.title,
    difSubtitulo: home.diferenciais.subtitle,
    difCards: paresParaTexto(home.diferenciais.cards.map((c) => ({ title: c.title, text: c.text }))),
    chamada: home.chamada,
    faq: faqParaTexto(home.faq.items),
    contatoTitulo: home.contato.title,
    contatoSubtitulo: home.contato.subtitle,
    rodape: home.footer.about,
    navCta: home.navCta,
    perfil: {
      ...perfil,
      formacaoTexto: paraLinhas(perfil.formacao),
      atuacaoTexto: paraLinhas(perfil.atuacao),
      linksTexto: linksParaTexto(perfil.links),
    },
  }
}

function paraConteudo(f: Formulario, base: HomeContent): ConteudoSite {
  const { formacaoTexto, atuacaoTexto, linksTexto, ...perfil } = f.perfil
  const { confiancaTexto, ...hero } = f.hero
  return {
    home: {
      sections: ["hero", ...ORDEM.map((o) => o.id).filter((id) => f.sections.includes(id))],
      hero: { ...hero, confianca: linhas(confiancaTexto) },
      sobre: { badge: f.sobreBadge, title: f.sobreTitulo, paragraphs: f.sobreParagrafos.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean), valores: textoParaPares(f.sobreValores) },
      // Ícones dos diferenciais: mantém os do padrão, na ordem
      diferenciais: {
        title: f.difTitulo, subtitle: f.difSubtitulo,
        cards: textoParaPares(f.difCards).map((c, i) => ({ ...c, icon: base.diferenciais.cards[i % base.diferenciais.cards.length]?.icon ?? "check" })),
      },
      chamada: f.chamada,
      faq: { items: textoParaFaq(f.faq) },
      contato: { title: f.contatoTitulo, subtitle: f.contatoSubtitulo },
      footer: { about: f.rodape },
      navCta: f.navCta,
    },
    perfil: {
      ...perfil,
      formacao: linhas(formacaoTexto),
      atuacao: linhas(atuacaoTexto),
      links: textoParaLinks(linksTexto),
    },
  }
}

/**
 * Textos do site deste cliente: o que aparece na página inicial e na página
 * do profissional. Grava em `app_settings` (conteudo_site); o site atualiza
 * em até 5 minutos. Campos vazios voltam ao padrão da vertical.
 */
export function ConteudoSiteEditor() {
  const { success, error } = useToast()
  const [base, setBase] = useState<HomeContent | null>(null)
  const [form, setForm] = useState<Formulario | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [galeriaAberta, setGaleriaAberta] = useState(false)
  const [enviandoImagem, setEnviandoImagem] = useState(false)

  const uploadFotoPerfil = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !form) return
    const file = files[0]
    setEnviandoImagem(true)
    try {
      const cleanName = file.name.replace(/\s+/g, "_").replace(/[()]/g, "").toLowerCase()
      const remotePath = `perfil/${Date.now()}_${cleanName}`
      const formData = new FormData()
      formData.append("bucket", "banners")
      formData.append("path", remotePath)
      formData.append("file", file)
      const res = await authFetch("/api/media", { method: "POST", body: formData })
      const json = await res.json()
      if (!res.ok || json.error) {
        error("Erro no upload", json.error || "Não foi possível enviar a foto.")
      } else {
        setPerfil({ foto: json.url })
        success("Foto atualizada!", "Imagem enviada com sucesso.")
      }
    } catch {
      error("Erro no upload", "Falha de conexão ao enviar a imagem.")
    } finally {
      setEnviandoImagem(false)
      e.target.value = ""
    }
  }

  useEffect(() => {
    getSetting<ConteudoSite>(CHAVE, {})
      .then((bruto) => {
        const { home, perfil } = resolverConteudo(bruto)
        setBase(resolverConteudo(null).home)
        setForm(paraFormulario(home, perfil))
      })
      .catch(() => error("Erro de conexão", "Não foi possível carregar os textos do site."))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const textosVerificados = useMemo(() => form ? ({
    "hero": [form.hero.badge, form.hero.title, form.hero.glowTitle, form.hero.subtitle, form.hero.confiancaTexto].join(" \n"),
    "Sobre": [form.sobreTitulo, form.sobreParagrafos, form.sobreValores].join(" \n"),
    "Diferenciais": [form.difTitulo, form.difSubtitulo, form.difCards].join(" \n"),
    "Chamada": [form.chamada.title, form.chamada.text].join(" \n"),
    "Perguntas frequentes": form.faq,
    "Contato e rodapé": [form.contatoTitulo, form.contatoSubtitulo, form.rodape].join(" \n"),
    "Perfil": [form.perfil.cargo, form.perfil.resumo, form.perfil.biografia, form.perfil.formacaoTexto, form.perfil.atuacaoTexto, form.perfil.citacao].join(" \n"),
  }) : {}, [form])

  if (!form || !base) return <p className="text-sm text-slate-500">Carregando textos do site…</p>

  const set = <K extends keyof Formulario>(k: K, v: Formulario[K]) => setForm({ ...form, [k]: v })
  const setPerfil = (patch: Partial<Formulario["perfil"]>) => setForm({ ...form, perfil: { ...form.perfil, ...patch } })
  const setHero = (patch: Partial<Formulario["hero"]>) => setForm({ ...form, hero: { ...form.hero, ...patch } })

  const salvar = async () => {
    if (!confirmarCompliance(verificarCampos(textosVerificados))) return
    try {
      setSalvando(true)
      await setSetting(CHAVE, paraConteudo(form, base))
      success("Textos salvos", "O site atualiza em até 5 minutos.")
    } catch (err) {
      error("Não foi possível salvar", err instanceof Error ? err.message : "Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  const slug = slugDoPerfil(form.perfil)
  const bloco = "space-y-4 rounded-xl border border-slate-200 bg-white p-5"
  const titulo = "text-sm font-black uppercase tracking-wider text-slate-800"
  const ajuda = "text-[11px] text-slate-500"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Textos do site</h2>
          <p className="mt-1 text-sm text-slate-500">Página inicial e página do profissional. O site atualiza em até 5 minutos após salvar.</p>
        </div>
        <Button onClick={salvar} disabled={salvando} className="gap-2">
          <Save className="h-4 w-4" /> {salvando ? "Salvando…" : "Salvar textos"}
        </Button>
      </div>

      {/* Perfil */}
      <section className={bloco}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className={titulo}>Página do profissional</h3>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.perfil.ativo} onCheckedChange={(v) => setPerfil({ ativo: v })} />
            Publicar a página e o item no menu
          </label>
        </div>
        {form.perfil.ativo && slug && (
          <a href={`/${slug}`} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:underline">
            /{slug} <ExternalLink className="h-3 w-3" />
          </a>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1"><Label>Nome (vira o endereço e o item do menu)</Label>
            <Input value={form.perfil.nome} onChange={(e) => setPerfil({ nome: e.target.value })} /></div>
          <div className="space-y-1"><Label>Cargo</Label>
            <Input value={form.perfil.cargo ?? ""} placeholder="Advogada · Sócia fundadora" onChange={(e) => setPerfil({ cargo: e.target.value })} /></div>
          <div className="space-y-1"><Label>Registro</Label>
            <Input value={form.perfil.registro ?? ""} placeholder="OAB/DF 00.000" onChange={(e) => setPerfil({ registro: e.target.value })} /></div>
        </div>
        {/* Foto do Perfil com Upload e Galeria */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="font-semibold text-slate-800">
              Fotografia do Perfil (Dra. Samantha)
            </Label>
            {form.perfil.foto && (
              <button
                type="button"
                onClick={() => setPerfil({ foto: "" })}
                className="text-[11px] font-semibold text-red-600 hover:underline"
              >
                Restaurar padrão
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {form.perfil.foto ? (
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-300 bg-slate-900 shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.perfil.foto} alt="Prévia" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-400">
                <ImageIcon className="h-6 w-6 text-slate-300" />
              </div>
            )}

            <div className="flex-1 min-w-[200px] flex gap-2">
              <Input
                value={form.perfil.foto ?? ""}
                placeholder="URL da foto ou envie um arquivo…"
                onChange={(e) => setPerfil({ foto: e.target.value })}
                className="text-xs bg-white"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setGaleriaAberta(true)}
                className="shrink-0 gap-1.5 text-xs h-10 px-3 border-slate-300 bg-white hover:bg-slate-50"
              >
                <ImageIcon className="h-3.5 w-3.5 text-slate-600" />
                <span>Galeria</span>
              </Button>
              <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white px-3 h-10 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
                {enviandoImagem ? (
                  <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
                ) : (
                  <UploadCloud className="h-4 w-4 text-slate-600" />
                )}
                <span className="ml-1.5 hidden sm:inline">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={uploadFotoPerfil}
                  disabled={enviandoImagem}
                />
              </label>
            </div>
          </div>
          <p className="text-[11px] text-slate-500">
            A imagem é exibida na página pública <code>/{slug}</code> e nas seções institucionais.
          </p>
        </div>

        <div className="space-y-1">
          <Label>Frase em destaque (opcional)</Label>
          <Input value={form.perfil.citacao ?? ""} onChange={(e) => setPerfil({ citacao: e.target.value })} />
        </div>
        <div className="space-y-1"><Label>Apresentação curta</Label>
          <Textarea rows={2} value={form.perfil.resumo ?? ""} onChange={(e) => setPerfil({ resumo: e.target.value })} /></div>
        <div className="space-y-1"><Label>Trajetória</Label>
          <Textarea rows={8} value={form.perfil.biografia ?? ""} onChange={(e) => setPerfil({ biografia: e.target.value })} className="font-mono text-[13px]" />
          <p className={ajuda}>Mesma marcação do blog: parágrafos separados por linha em branco, **negrito**, - lista.</p></div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1"><Label>Formação (uma por linha)</Label>
            <Textarea rows={4} value={form.perfil.formacaoTexto} onChange={(e) => setPerfil({ formacaoTexto: e.target.value })} /></div>
          <div className="space-y-1"><Label>Atuação (uma por linha)</Label>
            <Textarea rows={4} value={form.perfil.atuacaoTexto} onChange={(e) => setPerfil({ atuacaoTexto: e.target.value })} /></div>
          <div className="space-y-1"><Label>Links (Rótulo | https://…)</Label>
            <Textarea rows={4} value={form.perfil.linksTexto} placeholder="LinkedIn | https://…" onChange={(e) => setPerfil({ linksTexto: e.target.value })} /></div>
        </div>
      </section>

      {/* Seções */}
      <section className={bloco}>
        <h3 className={titulo}>Seções da página inicial</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {ORDEM.map((s) => (
            <label key={s.id} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.sections.includes(s.id)}
                onChange={(e) => set("sections", e.target.checked ? [...form.sections, s.id] : form.sections.filter((x) => x !== s.id))} />
              {s.rotulo}
            </label>
          ))}
        </div>
        <p className={ajuda}>A ordem é fixa. No jurídico, depoimentos de clientes ficam desligados por padrão (Provimento 205/2021).</p>
      </section>

      {/* Hero */}
      <section className={bloco}>
        <h3 className={titulo}>Topo da página</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1"><Label>Rótulo</Label><Input value={form.hero.badge} onChange={(e) => setHero({ badge: e.target.value })} /></div>
          <div className="space-y-1"><Label>Título (1ª linha)</Label><Input value={form.hero.title} onChange={(e) => setHero({ title: e.target.value })} /></div>
          <div className="space-y-1"><Label>Título (2ª linha, em destaque)</Label><Input value={form.hero.glowTitle} onChange={(e) => setHero({ glowTitle: e.target.value })} /></div>
        </div>
        <div className="space-y-1"><Label>Subtítulo</Label><Textarea rows={2} value={form.hero.subtitle} onChange={(e) => setHero({ subtitle: e.target.value })} /></div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1"><Label>Botão principal</Label><Input value={form.hero.ctaText} onChange={(e) => setHero({ ctaText: e.target.value })} /></div>
          <div className="space-y-1"><Label>Botão secundário</Label><Input value={form.hero.secondaryText} onChange={(e) => setHero({ secondaryText: e.target.value })} /></div>
          <div className="space-y-1"><Label>Botão do menu</Label><Input value={form.navCta} onChange={(e) => set("navCta", e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label>Garantias curtas (uma por linha)</Label>
          <Textarea rows={3} value={form.hero.confiancaTexto} onChange={(e) => setHero({ confiancaTexto: e.target.value })} /></div>
      </section>

      {/* Sobre */}
      <section className={bloco}>
        <h3 className={titulo}>Sobre</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1"><Label>Rótulo</Label><Input value={form.sobreBadge} onChange={(e) => set("sobreBadge", e.target.value)} /></div>
          <div className="space-y-1"><Label>Título</Label><Input value={form.sobreTitulo} onChange={(e) => set("sobreTitulo", e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label>Texto (parágrafos separados por linha em branco)</Label>
          <Textarea rows={6} value={form.sobreParagrafos} onChange={(e) => set("sobreParagrafos", e.target.value)} /></div>
        <div className="space-y-1"><Label>Valores (um por linha: Título — texto)</Label>
          <Textarea rows={4} value={form.sobreValores} onChange={(e) => set("sobreValores", e.target.value)} /></div>
      </section>

      {/* Diferenciais */}
      <section className={bloco}>
        <h3 className={titulo}>Diferenciais</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1"><Label>Título</Label><Input value={form.difTitulo} onChange={(e) => set("difTitulo", e.target.value)} /></div>
          <div className="space-y-1"><Label>Subtítulo</Label><Input value={form.difSubtitulo} onChange={(e) => set("difSubtitulo", e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label>Itens (um por linha: Título — texto)</Label>
          <Textarea rows={4} value={form.difCards} onChange={(e) => set("difCards", e.target.value)} /></div>
      </section>

      {/* Chamada, FAQ, contato */}
      <section className={bloco}>
        <h3 className={titulo}>Chamada, perguntas e contato</h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-1"><Label>Chamada: título</Label><Input value={form.chamada.title} onChange={(e) => set("chamada", { ...form.chamada, title: e.target.value })} /></div>
          <div className="space-y-1 sm:col-span-2"><Label>Chamada: texto</Label><Input value={form.chamada.text} onChange={(e) => set("chamada", { ...form.chamada, text: e.target.value })} /></div>
        </div>
        <div className="space-y-1"><Label>Perguntas frequentes</Label>
          <Textarea rows={8} value={form.faq} onChange={(e) => set("faq", e.target.value)} className="font-mono text-[13px]" />
          <p className={ajuda}>Cada pergunta em um bloco: linha “P: …” e linha “R: …”, com uma linha em branco entre os blocos.</p></div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1"><Label>Contato: título</Label><Input value={form.contatoTitulo} onChange={(e) => set("contatoTitulo", e.target.value)} /></div>
          <div className="space-y-1"><Label>Contato: subtítulo</Label><Input value={form.contatoSubtitulo} onChange={(e) => set("contatoSubtitulo", e.target.value)} /></div>
        </div>
        <div className="space-y-1"><Label>Rodapé</Label><Textarea rows={2} value={form.rodape} onChange={(e) => set("rodape", e.target.value)} /></div>
      </section>

      <ComplianceAlerta textos={textosVerificados} />

      <div className="flex justify-end">
        <Button onClick={salvar} disabled={salvando} className="gap-2">
          <Save className="h-4 w-4" /> {salvando ? "Salvando…" : "Salvar textos"}
        </Button>
      </div>

      <MediaSelectorDialog
        open={galeriaAberta}
        onClose={() => setGaleriaAberta(false)}
        onSelect={(url) => {
          setPerfil({ foto: url })
          setGaleriaAberta(false)
        }}
        bucket="banners"
        title="Escolher Foto de Perfil"
      />
    </div>
  )
}
