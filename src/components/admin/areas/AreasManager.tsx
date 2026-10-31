"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff, Pencil, Plus, RefreshCw, Star, Trash2, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/toast-simple"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HomeIcon, ICONES_DISPONIVEIS } from "@/components/home/shared/HomeIcon"
import { ComplianceAlerta, confirmarCompliance, verificarCampos } from "@/components/admin/shared/ComplianceAlerta"
import { MediaSelectorDialog } from "@/components/admin/shared/MediaSelectorDialog"
import { authFetch } from "@/lib/api-client"
import { termo } from "@/config/brand"
import { areasPadrao, createArea, deleteArea, listAllAreas, slugify, updateArea } from "@/lib/db/areas"
import type { Area, ServicoArea } from "@/types/area"
import type { IconName } from "@/config/home-content"

type Rascunho = Omit<Area, "id"> & { id?: string }

const NOVA: Rascunho = {
  slug: "", nome: "", resumo: "", contexto: "", icone: "file", imagem: "",
  situacoes: [], servicos: [], ordem: 0, ativo: true, destaque: false,
}

/** Serviços no formulário: uma linha por serviço, "Nome — o que envolve". */
function servicosParaTexto(servicos: ServicoArea[]): string {
  return servicos.map((s) => (s.detalhe ? `${s.item} — ${s.detalhe}` : s.item)).join("\n")
}
function textoParaServicos(texto: string): ServicoArea[] {
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [item, ...resto] = l.split(/\s+[—-]\s+/)
      const detalhe = resto.join(" — ").trim()
      return detalhe ? { item: item.trim(), detalhe } : { item: item.trim() }
    })
}
const linhas = (texto: string) => texto.split("\n").map((l) => l.trim()).filter(Boolean)

/**
 * Áreas de atuação (jurídico) ou linhas de serviço: o que aparece na seção
 * "Áreas" do site e no seletor do formulário de contato.
 */
export function AreasManager() {
  const { success, error } = useToast()
  const [areas, setAreas] = useState<Area[]>([])
  const [carregando, setCarregando] = useState(true)
  const [rascunho, setRascunho] = useState<Rascunho | null>(null)
  const [situacoesTexto, setSituacoesTexto] = useState("")
  const [servicosTexto, setServicosTexto] = useState("")
  const [slugEditado, setSlugEditado] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [galeriaAberta, setGaleriaAberta] = useState(false)
  const [enviandoImagem, setEnviandoImagem] = useState(false)

  const uploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !rascunho) return
    const file = files[0]
    setEnviandoImagem(true)
    try {
      const cleanName = file.name.replace(/\s+/g, "_").replace(/[()]/g, "").toLowerCase()
      const remotePath = `areas/${Date.now()}_${cleanName}`
      const formData = new FormData()
      formData.append("bucket", "banners")
      formData.append("path", remotePath)
      formData.append("file", file)
      const res = await authFetch("/api/media", { method: "POST", body: formData })
      const json = await res.json()
      if (!res.ok || json.error) {
        error("Erro no upload", json.error || "Não foi possível enviar a imagem.")
      } else {
        setRascunho({ ...rascunho, imagem: json.url })
        success("Foto atualizada!", "Imagem salva com sucesso.")
      }
    } catch {
      error("Erro no upload", "Falha de conexão ao enviar a imagem.")
    } finally {
      setEnviandoImagem(false)
      e.target.value = ""
    }
  }

  const rotulo = termo("catalogo")

  // O que vai a público nesta área, para o verificador do Provimento 205/2021
  const textosVerificados = {
    Nome: rascunho?.nome,
    Resumo: rascunho?.resumo,
    Situações: situacoesTexto,
    Serviços: servicosTexto,
    Contexto: rascunho?.contexto,
  }

  const carregar = async () => {
    try {
      setCarregando(true)
      setAreas(await listAllAreas())
    } catch (err) {
      console.error("[AreasManager] Falha ao carregar:", err)
      error("Erro de conexão", "Não foi possível carregar as áreas.")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const abrir = (area?: Area) => {
    const base: Rascunho = area ? { ...area } : { ...NOVA, ordem: (areas.at(-1)?.ordem ?? 0) + 10 }
    setRascunho(base)
    setSituacoesTexto(base.situacoes.join("\n"))
    setServicosTexto(servicosParaTexto(base.servicos))
    setSlugEditado(Boolean(area))
  }

  const salvar = async () => {
    if (!rascunho) return
    const nome = rascunho.nome.trim()
    const slug = slugify(rascunho.slug || nome)
    if (nome.length < 2) return error("Nome obrigatório", "Dê um nome à área.")
    if (!slug) return error("Endereço inválido", "Use letras e números no endereço da área.")
    if (areas.some((a) => a.slug === slug && a.id !== rascunho.id)) {
      return error("Endereço repetido", `Já existe uma área com o endereço "${slug}".`)
    }
    if (!confirmarCompliance(verificarCampos(textosVerificados))) return

    const dados: Omit<Area, "id"> = {
      ...rascunho,
      nome,
      slug,
      resumo: rascunho.resumo.trim(),
      contexto: rascunho.contexto?.trim() || undefined,
      imagem: rascunho.imagem?.trim() || undefined,
      situacoes: linhas(situacoesTexto),
      servicos: textoParaServicos(servicosTexto),
    }

    try {
      setSalvando(true)
      if (rascunho.id) {
        await updateArea(rascunho.id, dados)
        success("Área atualizada", `"${nome}" foi salva.`)
      } else {
        await createArea(dados)
        success("Área criada", `"${nome}" já aparece no site${dados.ativo ? "" : " quando for ativada"}.`)
      }
      setRascunho(null)
      carregar()
    } catch (err) {
      console.error("[AreasManager] Falha ao salvar:", err)
      error("Não foi possível salvar", err instanceof Error ? err.message : "Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  const alternar = async (area: Area, campo: "ativo" | "destaque") => {
    try {
      await updateArea(area.id, { [campo]: !area[campo] })
      carregar()
    } catch {
      error("Não foi possível alterar", "Tente novamente.")
    }
  }

  const excluir = async (area: Area) => {
    if (!confirm(`Excluir "${area.nome}"? Leads já recebidos mantêm o nome da área, mas perdem o vínculo.`)) return
    try {
      await deleteArea(area.id)
      success("Área excluída", `"${area.nome}" foi removida.`)
      carregar()
    } catch {
      error("Não foi possível excluir", "Tente novamente.")
    }
  }

  const carregarPadrao = async () => {
    try {
      setSalvando(true)
      for (const area of areasPadrao()) await createArea(area)
      success("Áreas carregadas", "As áreas padrão foram criadas. Edite os textos para o escritório.")
      carregar()
    } catch (err) {
      error("Não foi possível carregar", err instanceof Error ? err.message : "Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">{rotulo}</h2>
          <p className="mt-1 text-sm text-slate-500">
            O que aparece na seção do site e no seletor do formulário de contato. Desativar esconde do site sem apagar.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={carregar} disabled={carregando} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Atualizar
          </Button>
          <Button onClick={() => abrir()} className="gap-2">
            <Plus className="h-4 w-4" /> Nova área
          </Button>
        </div>
      </div>

      {!carregando && areas.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-semibold text-slate-800">Nenhuma área cadastrada.</p>
          <p className="mt-1 text-sm text-slate-500">
            Enquanto isso, o site mostra as áreas padrão. Carregue-as aqui para editar os textos do escritório.
          </p>
          <Button onClick={carregarPadrao} disabled={salvando} className="mt-4">
            Carregar áreas padrão
          </Button>
        </div>
      )}

      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {areas.map((area) => (
          <li key={area.id} className="flex flex-wrap items-center gap-4 p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
              <HomeIcon name={area.icone} className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 font-semibold text-slate-900">
                {area.nome}
                {area.destaque && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-label="Destaque" />}
                {!area.ativo && <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-500">Oculta</span>}
              </p>
              <p className="truncate text-xs text-slate-500">
                <a href={`/areas-de-atuacao/${area.slug}`} target="_blank" rel="noopener" className="underline-offset-2 hover:underline">
                  /areas-de-atuacao/{area.slug}
                </a>{" "}
                · {area.situacoes.length} situações · {area.servicos.length} serviços
              </p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => alternar(area, "destaque")} aria-label="Alternar destaque">
                <Star className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => alternar(area, "ativo")} aria-label={area.ativo ? "Ocultar do site" : "Mostrar no site"}>
                {area.ativo ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => abrir(area)} aria-label="Editar">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => excluir(area)} aria-label="Excluir" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <Dialog open={rascunho !== null} onOpenChange={(aberto) => !aberto && setRascunho(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{rascunho?.id ? "Editar área" : "Nova área"}</DialogTitle>
            <DialogDescription>
              Escreva para quem tem o problema, sem prometer resultado (Provimento 205/2021 da OAB).
            </DialogDescription>
          </DialogHeader>

          {rascunho && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="area-nome">Nome</Label>
                  <Input id="area-nome" value={rascunho.nome} maxLength={120}
                    onChange={(e) => setRascunho({ ...rascunho, nome: e.target.value, slug: slugEditado ? rascunho.slug : slugify(e.target.value) })} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="area-slug">Endereço</Label>
                  <Input id="area-slug" value={rascunho.slug} maxLength={80}
                    onChange={(e) => { setSlugEditado(true); setRascunho({ ...rascunho, slug: e.target.value }) }} />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="area-resumo">Resumo</Label>
                <Textarea id="area-resumo" rows={2} maxLength={400} value={rascunho.resumo}
                  onChange={(e) => setRascunho({ ...rascunho, resumo: e.target.value })} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="area-situacoes">Situações comuns <span className="font-normal text-slate-500">(uma por linha)</span></Label>
                <Textarea id="area-situacoes" rows={4} value={situacoesTexto} onChange={(e) => setSituacoesTexto(e.target.value)}
                  placeholder={"Separação ou divórcio\nGuarda e pensão dos filhos"} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="area-servicos">Serviços <span className="font-normal text-slate-500">(um por linha: Nome — o que envolve)</span></Label>
                <Textarea id="area-servicos" rows={4} value={servicosTexto} onChange={(e) => setServicosTexto(e.target.value)}
                  placeholder="Divórcio consensual — acordo entre as partes, em cartório ou na Justiça" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="area-contexto">Contexto <span className="font-normal text-slate-500">(a situação de quem procura, em primeira pessoa)</span></Label>
                <Textarea id="area-contexto" rows={3} maxLength={2000} value={rascunho.contexto ?? ""}
                  onChange={(e) => setRascunho({ ...rascunho, contexto: e.target.value })} />
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_6rem]">
                <div className="space-y-1.5">
                  <Label htmlFor="area-icone">Ícone</Label>
                  <select id="area-icone" value={rascunho.icone}
                    onChange={(e) => setRascunho({ ...rascunho, icone: e.target.value as IconName })}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-sm">
                    {ICONES_DISPONIVEIS.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="area-ordem">Ordem</Label>
                  <Input id="area-ordem" type="number" value={rascunho.ordem}
                    onChange={(e) => setRascunho({ ...rascunho, ordem: Number(e.target.value) || 0 })} />
                </div>
              </div>

              {/* Foto do Card da Área com Upload & Galeria */}
              <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="area-imagem" className="font-semibold text-slate-800">
                    Foto do Card (Escritório ou Temática)
                  </Label>
                  {rascunho.imagem && (
                    <button
                      type="button"
                      onClick={() => setRascunho({ ...rascunho, imagem: "" })}
                      className="text-[11px] font-semibold text-red-600 hover:underline"
                    >
                      Restaurar foto padrão do escritório
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {rascunho.imagem ? (
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-300 bg-slate-900 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rascunho.imagem} alt="Prévia da foto" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400">
                      <ImageIcon className="h-5 w-5 text-slate-300" />
                      <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Padrão</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-[200px] flex gap-2">
                    <Input
                      id="area-imagem"
                      value={rascunho.imagem ?? ""}
                      placeholder="URL da imagem ou clique em Galeria / Upload…"
                      onChange={(e) => setRascunho({ ...rascunho, imagem: e.target.value })}
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
                        onChange={uploadFoto}
                        disabled={enviandoImagem}
                      />
                    </label>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  {rascunho.imagem
                    ? "✓ Foto personalizada ativa para este card no site."
                    : "ℹ️ Usando a fotografia cinematográfica do escritório Louzeiro. Envie uma nova foto para personalizar."}
                </p>
              </div>

              <ComplianceAlerta textos={textosVerificados} />

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={rascunho.ativo} onCheckedChange={(v) => setRascunho({ ...rascunho, ativo: v })} />
                  Visível no site
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={rascunho.destaque} onCheckedChange={(v) => setRascunho({ ...rascunho, destaque: v })} />
                  Destaque
                </label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setRascunho(null)}>Cancelar</Button>
            <Button onClick={salvar} disabled={salvando}>{salvando ? "Salvando…" : "Salvar área"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaSelectorDialog
        open={galeriaAberta}
        onClose={() => setGaleriaAberta(false)}
        onSelect={(url) => {
          if (rascunho) setRascunho({ ...rascunho, imagem: url })
          setGaleriaAberta(false)
        }}
        bucket="banners"
        title="Escolher Foto da Área de Atuação"
      />
    </div>
  )
}
