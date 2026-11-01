"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Camera,
  Upload,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  X,
  Heart,
  Image as ImageIcon,
  Send,
  Tv,
} from "lucide-react"
import {
  getActiveEventId,
  getEventState,
  addGuestPhoto,
  type DuniaEventState,
  type DuniaGuestPhoto,
} from "@/lib/dunia-store"

export default function GuestPhotoUploadPage() {
  const [mounted, setMounted] = useState(false)
  const [state, setState] = useState<DuniaEventState | null>(null)
  const [guestName, setGuestName] = useState("")
  const [message, setMessage] = useState("")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    const activeId = getActiveEventId()
    const current = getEventState(activeId)
    setState(current)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg("")
    const file = e.target.files?.[0]
    if (!file) return

    // Verifica tamanho máximo de 10MB
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("A foto é muito grande. Escolha uma imagem de até 10MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!previewUrl) {
      setErrorMsg("Por favor, tire uma foto ou selecione uma imagem da sua galeria.")
      return
    }
    if (!guestName.trim()) {
      setErrorMsg("Por favor, digite seu nome para que os anfitriões saibam quem enviou.")
      return
    }

    if (!state?.event?.id) return

    setIsSubmitting(true)
    setTimeout(() => {
      // Salva a foto no store
      addGuestPhoto(state.event.id, {
        url: previewUrl,
        guestName: guestName.trim(),
        message: message.trim() || undefined,
      })

      // Atualiza o estado local
      const updated = getEventState(state.event.id)
      setState(updated)

      setIsSubmitting(false)
      setSubmittedSuccess(true)
      setPreviewUrl(null)
      setMessage("")
    }, 700)
  }

  if (!mounted || !state) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0C0A09] text-[#D3B47C]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D3B47C] border-t-transparent" />
          <p className="font-serif text-sm tracking-wider">Preparando álbum do evento...</p>
        </div>
      </div>
    )
  }

  const { event, album } = state
  const guestPhotos = album.guestPhotos || []

  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      {/* Topo / Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#120F0D]/95 px-4 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-xl items-center justify-between">
          <Link
            href="/evento"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/70 hover:text-[#D3B47C] transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar ao Evento</span>
          </Link>

          <Link href="/evento/telao" target="_blank" className="flex items-center gap-1.5 text-xs text-[#D3B47C] hover:underline">
            <Tv className="h-3.5 w-3.5" />
            <span>Ver Telão ao Vivo</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8">
        {/* Banner do Evento */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-[#D3B47C]">
            <Sparkles className="h-3 w-3" />
            <span>DÚNIA MEMORIES • ÁLBUM AO VIVO</span>
          </div>

          <h1 className="mt-3 font-serif text-3xl font-normal text-white sm:text-4xl">
            {event.name}
          </h1>
          <p className="mt-1 text-xs text-[#ABA29A]">
            {event.venue} • Compartilhe suas fotos e apareça no telão!
          </p>
        </div>

        {/* FEEDBACK DE SUCESSO APÓS ENVIO */}
        {submittedSuccess ? (
          <div className="mb-8 rounded-3xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center animate-fadeIn">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-2xl text-white">Foto Enviada com Sucesso!</h3>
            <p className="mt-2 text-xs text-emerald-200/90 leading-relaxed max-w-md mx-auto">
              Sua lembrança foi salva no acervo dos anfitriões e já está liberada para o telão oficial do Dúnia City Hall!
            </p>
            <button
              onClick={() => setSubmittedSuccess(false)}
              className="mt-5 rounded-full bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
            >
              + Enviar Outra Foto
            </button>
          </div>
        ) : (
          /* FORMULÁRIO DE ENVIO */
          <form
            onSubmit={handleSubmit}
            className="mb-10 rounded-3xl border border-white/10 bg-[#161311] p-6 sm:p-8 shadow-2xl"
          >
            {/* Input Oculto de Câmera Nativa */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Input Oculto de Galeria */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* ÁREA DE SELEÇÃO / PREVIEW DA FOTO */}
            {previewUrl ? (
              <div className="relative mb-6 overflow-hidden rounded-2xl border-2 border-[#D3B47C]/60 bg-black aspect-[4/3] w-full">
                <Image
                  src={previewUrl}
                  alt="Prévia da foto"
                  fill
                  className="object-contain"
                />
                <button
                  type="button"
                  onClick={() => setPreviewUrl(null)}
                  className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/80 text-white border border-white/20 transition hover:bg-rose-600"
                  aria-label="Remover foto"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-3 left-3 rounded-md bg-black/70 px-2.5 py-1 text-[0.65rem] font-bold text-[#D3B47C]">
                  ✓ Foto Pronta para Envio
                </div>
              </div>
            ) : (
              <div className="mb-6 grid grid-cols-2 gap-3">
                {/* Botão 1: Tirar Foto com a Câmera */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D3B47C]/40 bg-[#D3B47C]/5 p-6 text-center transition hover:border-[#D3B47C] hover:bg-[#D3B47C]/10 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#D3B47C] text-[#100E0D] shadow-lg">
                    <Camera className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white block">
                      Tirar Foto
                    </span>
                    <small className="text-[0.65rem] text-[#ABA29A]">Câmera do Celular</small>
                  </div>
                </button>

                {/* Botão 2: Escolher da Galeria */}
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-6 text-center transition hover:border-white/30 hover:bg-white/10 hover:scale-[1.02] cursor-pointer"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white block">
                      Da Galeria
                    </span>
                    <small className="text-[0.65rem] text-[#ABA29A]">Fotos Salvas</small>
                  </div>
                </button>
              </div>
            )}

            {/* MENSAGEM DE ERRO SE HOUVER */}
            {errorMsg && (
              <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-xs text-rose-300">
                {errorMsg}
              </div>
            )}

            {/* CAMPOS DE IDENTIFICAÇÃO */}
            <div className="space-y-4">
              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                  Seu Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Ex: Mariana Fernandes"
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#D3B47C] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.7rem] font-bold uppercase tracking-widest text-[#ABA29A]">
                  Mensagem aos Anfitriões / Telão (opcional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  placeholder="Deixe um recado especial de carinho..."
                  className="mt-1.5 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/25 focus:border-[#D3B47C] focus:outline-none"
                />
              </div>
            </div>

            {/* BOTÃO DE SUBMISSÃO */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#100E0D] shadow-[0_4px_25px_rgba(211,180,124,0.3)] transition hover:scale-[1.02] disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Enviando Foto...</span>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  <span>Enviar ao Álbum & Telão</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* FEED AO VIVO DAS FOTOS JÁ ENVIADAS PELOS CONVIDADOS */}
        <section className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                MURAL DA NOITE
              </span>
              <h3 className="font-serif text-xl text-white">
                Fotos dos Convidados ({guestPhotos.length})
              </h3>
            </div>
            <span className="text-[0.65rem] text-[#ABA29A]">Atualizado em tempo real</span>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {guestPhotos.map((photo) => (
              <div
                key={photo.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#161311] shadow-lg"
              >
                <div className="relative aspect-square overflow-hidden bg-black/40">
                  <Image
                    src={photo.url}
                    alt={photo.guestName}
                    fill
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs">
                    <span className="text-[0.65rem] font-bold text-[#D3B47C] block truncate">
                      {photo.guestName}
                    </span>
                    {photo.message && (
                      <p className="text-[0.68rem] text-white/90 line-clamp-2 mt-0.5 font-serif italic">
                        &ldquo;{photo.message}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
