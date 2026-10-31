"use client"

import { useEffect, useMemo, useState } from "react"
import { Eye, Pencil, Plus, RefreshCw, Star, Trash2, Image as ImageIcon, UploadCloud, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/toast-simple"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ComplianceAlerta, confirmarCompliance, verificarCampos } from "@/components/admin/shared/ComplianceAlerta"
import { MediaSelectorDialog } from "@/components/admin/shared/MediaSelectorDialog"
import { authFetch } from "@/lib/api-client"
import { TextoFormatado } from "@/components/home/shared/TextoFormatado"
import { BRAND } from "@/config/brand"
import { listAllAreas, slugify } from "@/lib/db/areas"
import { createPost, deletePost, listAllPosts, updatePost, formatarData, tempoDeLeitura } from "@/lib/db/posts"
import type { Area } from "@/types/area"
import type { Post } from "@/types/post"

type Rascunho = Omit<Post, "id"> & { id?: string }

const NOVO: Rascunho = {
  slug: "", titulo: "", resumo: "", conteudo: "", capa: "", areaSlug: "",
  autor: BRAND.professional.name || "", status: "rascunho", publicadoEm: "", destaque: false,
  seoTitulo: "", seoDescricao: "",
}

/** ISO → valor de <input type="datetime-local"> no fuso do navegador */
function paraInput(iso?: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

function situacao(p: Post): { rotulo: string; cor: string } {
  if (p.status === "rascunho") return { rotulo: "Rascunho", cor: "bg-slate-100 text-slate-600" }
  if (p.publicadoEm && new Date(p.publicadoEm) > new Date()) return { rotulo: "Agendada", cor: "bg-amber-50 text-amber-700" }
  return { rotulo: "Publicada", cor: "bg-emerald-50 text-emerald-700" }
}

const AJUDA_MARCACAO = "## Título · ### Subtítulo · - lista · 1. lista numerada · **negrito** · *itálico* · [texto](https://link) · > citação"

/**
 * Blog: artigos informativos. Rascunho só o painel vê; publicada aparece em
 * /blog, na página inicial e na página da área escolhida. Data no futuro agenda.
 */
export function PostsManager() {
  const { success, error } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [carregando, setCarregando] = useState(true)
  const [rascunho, setRascunho] = useState<Rascunho | null>(null)
  const [slugEditado, setSlugEditado] = useState(false)
  const [previa, setPrevia] = useState(false)
  const [salvando, setSalvando] = useState(false)
  const [galeriaAberta, setGaleriaAberta] = useState(false)
  const [enviandoImagem, setEnviandoImagem] = useState(false)

  const uploadCapa = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0 || !rascunho) return
    const file = files[0]
    setEnviandoImagem(true)
    try {
      const cleanName = file.name.replace(/\s+/g, "_").replace(/[()]/g, "").toLowerCase()
      const remotePath = `blog/${Date.now()}_${cleanName}`
      const formData = new FormData()
      formData.append("bucket", "banners")
      formData.append("path", remotePath)
      formData.append("file", file)
      const res = await authFetch("/api/media", { method: "POST", body: formData })
      const json = await res.json()
      if (!res.ok || json.error) {
        error("Erro no upload", json.error || "Não foi possível enviar a capa.")
      } else {
        setRascunho({ ...rascunho, capa: json.url })
        success("Capa atualizada!", "Imagem enviada com sucesso.")
      }
    } catch {
      error("Erro no upload", "Falha de conexão ao enviar a imagem.")
    } finally {
      setEnviandoImagem(false)
      e.target.value = ""
    }
  }

  const carregar = async () => {
    try {
      setCarregando(true)
      const [lista, todasAreas] = await Promise.all([listAllPosts(), listAllAreas().catch(() => [])])
      setPosts(lista)
      setAreas(todasAreas)
    } catch (err) {
      console.error("[Blog] Falha ao carregar:", err)
      error("Erro de conexão", "Não foi possível carregar as publicações.")
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const textosVerificados = useMemo(() => ({
    Título: rascunho?.titulo,
    Resumo: rascunho?.resumo,
    Texto: rascunho?.conteudo,
  }), [rascunho?.titulo, rascunho?.resumo, rascunho?.conteudo])

  const abrir = (post?: Post) => {
    setRascunho(post ? { ...post, publicadoEm: paraInput(post.publicadoEm) } : { ...NOVO })
    setSlugEditado(Boolean(post))
    setPrevia(false)
  }

  const salvar = async (publicar?: boolean) => {
    if (!rascunho) return
    const titulo = rascunho.titulo.trim()
    const slug = slugify(rascunho.slug || titulo)
    if (titulo.length < 3) return error("Título obrigatório", "Dê um título à publicação.")
    if (!slug) return error("Endereço inválido", "Use letras e números no endereço.")
    if (posts.some((p) => p.slug === slug && p.id !== rascunho.id)) {
      return error("Endereço repetido", `Já existe uma publicação com o endereço "${slug}".`)
    }

    const status = publicar ? "publicado" : rascunho.status
    // Publicar exige passar pelo verificador da OAB; rascunho pode ficar pendente
    if (status === "publicado" && !confirmarCompliance(verificarCampos(textosVerificados))) return

    const dados: Omit<Post, "id"> = {
      ...rascunho,
      titulo,
      slug,
      status,
      resumo: rascunho.resumo.trim(),
      publicadoEm: rascunho.publicadoEm
        ? new Date(rascunho.publicadoEm).toISOString()
        : status === "publicado" ? new Date().toISOString() : undefined,
    }

    try {
      setSalvando(true)
      if (rascunho.id) await updatePost(rascunho.id, dados)
      else await createPost(dados)
      success(status === "publicado" ? "Publicação salva" : "Rascunho salvo", `"${titulo}"`)
      setRascunho(null)
      carregar()
    } catch (err) {
      console.error("[Blog] Falha ao salvar:", err)
      error("Não foi possível salvar", err instanceof Error ? err.message : "Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  const excluir = async (post: Post) => {
    if (!confirm(`Excluir "${post.titulo}"? O endereço deixa de funcionar.`)) return
    try {
      await deletePost(post.id)
      success("Publicação excluída", `"${post.titulo}" foi removida.`)
      carregar()
    } catch {
      error("Não foi possível excluir", "Tente novamente.")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Blog / Publicações</h2>
          <p className="mt-1 text-sm text-slate-500">
            Artigos informativos. Publicados aparecem em /blog, na página inicial e na página da área escolhida.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={carregar} disabled={carregando} className="gap-2">
            <RefreshCw className="h-4 w-4" /> Atualizar
          </Button>
          <Button onClick={() => abrir()} className="gap-2">
            <Plus className="h-4 w-4" /> Nova publicação
          </Button>
        </div>
      </div>

      {!carregando && posts.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-semibold text-slate-800">Nenhuma publicação ainda.</p>
          <p className="mt-1 text-sm text-slate-500">Enquanto não houver publicações, a seção do blog não aparece no site.</p>
        </div>
      )}

      <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 bg-white">
        {posts.map((post) => {
          const s = situacao(post)
          return (
            <li key={post.id} className="flex flex-wrap items-center gap-4 p-4">
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-2 font-semibold text-slate-900">
                  {post.titulo}
                  {post.destaque && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-label="Destaque" />}
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${s.cor}`}>{s.rotulo}</span>
                </p>
                <p className="truncate text-xs text-slate-500">
                  /blog/{post.slug}
                  {post.publicadoEm && ` · ${formatarData(post.publicadoEm)}`}
                  {` · ${tempoDeLeitura(post.conteudo)} min de leitura`}
                  {post.areaSlug && ` · ${areas.find((a) => a.slug === post.areaSlug)?.nome ?? post.areaSlug}`}
                </p>
              </div>
              <div className="flex gap-1">
                {s.rotulo === "Publicada" && (
                  <Button size="icon" variant="ghost" asChild aria-label="Ver no site">
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener"><Eye className="h-4 w-4" /></a>
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => abrir(post)} aria-label="Editar">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => excluir(post)} aria-label="Excluir" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </li>
          )
        })}
      </ul>

      <Dialog open={rascunho !== null} onOpenChange={(aberto) => !aberto && setRascunho(null)}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{rascunho?.id ? "Editar publicação" : "Nova publicação"}</DialogTitle>
            <DialogDescription>
              Conteúdo informativo, sem promessa de resultado nem captação (Provimento 205/2021 da OAB).
            </DialogDescription>
          </DialogHeader>

          {rascunho && (
            <div className="grid gap-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="post-titulo">Título</Label>
                <Input id="post-titulo" value={rascunho.titulo} maxLength={160}
                  onChange={(e) => setRascunho({ ...rascunho, titulo: e.target.value, slug: slugEditado ? rascunho.slug : slugify(e.target.value) })} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="post-slug">Endereço</Label>
                  <Input id="post-slug" value={rascunho.slug} maxLength={80}
                    onChange={(e) => { setSlugEditado(true); setRascunho({ ...rascunho, slug: e.target.value }) }} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="post-area">Área relacionada</Label>
                  <select id="post-area" value={rascunho.areaSlug ?? ""}
                    onChange={(e) => setRascunho({ ...rascunho, areaSlug: e.target.value })}
                    className="h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-sm">
                    <option value="">Nenhuma</option>
                    {areas.map((a) => <option key={a.slug} value={a.slug}>{a.nome}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-resumo">Resumo <span className="font-normal text-slate-500">(aparece nos cards e no Google)</span></Label>
                <Textarea id="post-resumo" rows={2} maxLength={400} value={rascunho.resumo}
                  onChange={(e) => setRascunho({ ...rascunho, resumo: e.target.value })} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-conteudo">Texto</Label>
                  <button type="button" onClick={() => setPrevia(!previa)} className="text-xs font-semibold text-sky-700 hover:underline">
                    {previa ? "Editar texto" : "Ver como fica"}
                  </button>
                </div>
                {previa ? (
                  <div className="max-h-[420px] overflow-y-auto rounded-md border border-slate-200 bg-white p-5">
                    <TextoFormatado texto={rascunho.conteudo || "_Sem texto ainda._"} />
                  </div>
                ) : (
                  <Textarea id="post-conteudo" rows={14} maxLength={60000} value={rascunho.conteudo}
                    onChange={(e) => setRascunho({ ...rascunho, conteudo: e.target.value })}
                    className="font-mono text-[13px] leading-relaxed" />
                )}
                <p className="text-[11px] text-slate-500">{AJUDA_MARCACAO}</p>
              </div>

              {/* Imagem de Capa com Upload e Galeria */}
              <div className="space-y-1.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="post-capa" className="font-semibold text-slate-800">
                    Imagem de Capa da Publicação
                  </Label>
                  {rascunho.capa && (
                    <button
                      type="button"
                      onClick={() => setRascunho({ ...rascunho, capa: "" })}
                      className="text-[11px] font-semibold text-red-600 hover:underline"
                    >
                      Remover capa
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {rascunho.capa ? (
                    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-300 bg-slate-900 shadow-sm">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={rascunho.capa} alt="Prévia da capa" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-14 w-20 shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white text-slate-400">
                      <ImageIcon className="h-5 w-5 text-slate-300" />
                      <span className="text-[9px] uppercase font-bold text-slate-400 mt-0.5">Padrão</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-[200px] flex gap-2">
                    <Input
                      id="post-capa"
                      value={rascunho.capa ?? ""}
                      placeholder="URL da capa ou clique em Galeria / Upload…"
                      onChange={(e) => setRascunho({ ...rascunho, capa: e.target.value })}
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
                        onChange={uploadCapa}
                        disabled={enviandoImagem}
                      />
                    </label>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  {rascunho.capa
                    ? "✓ Capa personalizada ativa para o artigo."
                    : "ℹ️ Se deixar vazio, o artigo usará a imagem cinematográfica padrão do escritório."}
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="post-autor">Autoria</Label>
                <Input id="post-autor" value={rascunho.autor ?? ""} maxLength={120}
                  onChange={(e) => setRascunho({ ...rascunho, autor: e.target.value })} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="post-data">Data de publicação <span className="font-normal text-slate-500">(futura = agendar)</span></Label>
                  <Input id="post-data" type="datetime-local" value={rascunho.publicadoEm ?? ""}
                    onChange={(e) => setRascunho({ ...rascunho, publicadoEm: e.target.value })} />
                </div>
                <label className="flex items-center gap-2 self-end pb-2 text-sm">
                  <Switch checked={rascunho.destaque} onCheckedChange={(v) => setRascunho({ ...rascunho, destaque: v })} />
                  Destacar na página inicial
                </label>
              </div>

              <details className="rounded-md border border-slate-200 p-3">
                <summary className="cursor-pointer text-sm font-semibold text-slate-700">Google (opcional)</summary>
                <div className="mt-3 grid gap-3">
                  <Input placeholder="Título para o Google (até 70 caracteres)" maxLength={70} value={rascunho.seoTitulo ?? ""}
                    onChange={(e) => setRascunho({ ...rascunho, seoTitulo: e.target.value })} />
                  <Textarea placeholder="Descrição para o Google (até 170 caracteres)" rows={2} maxLength={170} value={rascunho.seoDescricao ?? ""}
                    onChange={(e) => setRascunho({ ...rascunho, seoDescricao: e.target.value })} />
                </div>
              </details>

              <ComplianceAlerta textos={textosVerificados} />
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRascunho(null)}>Cancelar</Button>
            {rascunho?.status === "publicado" ? (
              <>
                {/* Só troca o estado no formulário; vale ao clicar em "Salvar rascunho" */}
                <Button variant="outline" onClick={() => setRascunho({ ...rascunho, status: "rascunho" })} disabled={salvando}>
                  Despublicar
                </Button>
                <Button onClick={() => salvar()} disabled={salvando}>{salvando ? "Salvando…" : "Salvar publicação"}</Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => salvar()} disabled={salvando}>Salvar rascunho</Button>
                <Button onClick={() => salvar(true)} disabled={salvando}>{salvando ? "Salvando…" : "Publicar"}</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaSelectorDialog
        open={galeriaAberta}
        onClose={() => setGaleriaAberta(false)}
        onSelect={(url) => {
          if (rascunho) setRascunho({ ...rascunho, capa: url })
          setGaleriaAberta(false)
        }}
        bucket="banners"
        title="Escolher Capa da Publicação"
      />
    </div>
  )
}
