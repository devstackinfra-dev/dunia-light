"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Heart,
  Save,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Sparkles,
  BookOpen,
  Pin,
  Tv,
  MessageSquare,
  Clock,
  Calendar,
  Image as ImageIcon,
} from "lucide-react"
import {
  getStorytellingForEvent,
  saveStorytellingForEvent,
  type EventStorytelling,
  type StoryChapter,
  type GuestWish,
} from "@/config/event-storytelling"

interface PainelStorytellingTabProps {
  eventId: string
  onNotify: (msg: string) => void
}

export default function PainelStorytellingTab({
  eventId,
  onNotify,
}: PainelStorytellingTabProps) {
  const [story, setStory] = useState<EventStorytelling | null>(null)
  const [subTab, setSubTab] = useState<"carta" | "capitulos" | "votos">("carta")

  // Form states for letter
  const [letterKicker, setLetterKicker] = useState("")
  const [letterTitle, setLetterTitle] = useState("")
  const [letterSalutation, setLetterSalutation] = useState("")
  const [letterBody, setLetterBody] = useState("")
  const [letterSignature, setLetterSignature] = useState("")
  const [letterDateAndCity, setLetterDateAndCity] = useState("")

  // Form states for chapter editing
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null)
  const [chapterYear, setChapterYear] = useState("")
  const [chapterTitle, setChapterTitle] = useState("")
  const [chapterLocation, setChapterLocation] = useState("")
  const [chapterText, setChapterText] = useState("")
  const [chapterQuote, setChapterQuote] = useState("")
  const [chapterImage, setChapterImage] = useState("")

  // Form states for guest wishes
  const [newWishName, setNewWishName] = useState("")
  const [newWishRelation, setNewWishRelation] = useState("Amigo(a)")
  const [newWishText, setNewWishText] = useState("")

  useEffect(() => {
    const current = getStorytellingForEvent(eventId)
    setStory(current)
    setLetterKicker(current.openLetter.kicker)
    setLetterTitle(current.openLetter.title)
    setLetterSalutation(current.openLetter.salutation)
    setLetterBody(current.openLetter.paragraphs.join("\n\n"))
    setLetterSignature(current.openLetter.signature)
    setLetterDateAndCity(current.openLetter.dateAndCity)
  }, [eventId])

  if (!story) return null

  // Salvar Carta Aberta
  const handleSaveLetter = () => {
    const paragraphs = letterBody
      .split("\n\n")
      .map((p) => p.trim())
      .filter(Boolean)

    const updated: EventStorytelling = {
      ...story,
      openLetter: {
        ...story.openLetter,
        kicker: letterKicker.trim(),
        title: letterTitle.trim(),
        salutation: letterSalutation.trim(),
        paragraphs: paragraphs.length > 0 ? paragraphs : story.openLetter.paragraphs,
        signature: letterSignature.trim(),
        dateAndCity: letterDateAndCity.trim(),
      },
    }

    setStory(updated)
    saveStorytellingForEvent(eventId, updated)
    onNotify("Carta Aberta aos Convidados salva com sucesso e atualizada no Mini-site!")
  }

  // Iniciar Edição de Capítulo
  const handleStartEditChapter = (ch: StoryChapter) => {
    setEditingChapterId(ch.id)
    setChapterYear(ch.year)
    setChapterTitle(ch.title)
    setChapterLocation(ch.location)
    setChapterText(ch.text)
    setChapterQuote(ch.quote || "")
    setChapterImage(ch.image)
  }

  // Salvar Capítulo
  const handleSaveChapter = () => {
    if (!editingChapterId) return

    const updatedChapters = story.chapters.map((ch) => {
      if (ch.id === editingChapterId) {
        return {
          ...ch,
          year: chapterYear.trim() || ch.year,
          title: chapterTitle.trim() || ch.title,
          location: chapterLocation.trim() || ch.location,
          text: chapterText.trim() || ch.text,
          quote: chapterQuote.trim() || undefined,
          image: chapterImage.trim() || ch.image,
        }
      }
      return ch
    })

    const updated: EventStorytelling = {
      ...story,
      chapters: updatedChapters,
    }

    setStory(updated)
    saveStorytellingForEvent(eventId, updated)
    setEditingChapterId(null)
    onNotify("Capítulo da Linha do Tempo atualizado com sucesso!")
  }

  // Adicionar Voto / Mensagem no Livro de Ouro
  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWishName.trim() || !newWishText.trim()) return

    const newWish: GuestWish = {
      id: `gw-painel-${Date.now()}`,
      name: newWishName.trim(),
      relationship: newWishRelation.trim() || "Amigo(a)",
      text: newWishText.trim(),
      timeAgo: "agora mesmo",
    }

    const updated: EventStorytelling = {
      ...story,
      guestWishes: [newWish, ...story.guestWishes],
    }

    setStory(updated)
    saveStorytellingForEvent(eventId, updated)
    setNewWishName("")
    setNewWishText("")
    onNotify("Mensagem oficial adicionada ao Livro de Ouro!")
  }

  // Excluir Voto
  const handleDeleteWish = (id: string) => {
    const updated: EventStorytelling = {
      ...story,
      guestWishes: story.guestWishes.filter((w) => w.id !== id),
    }
    setStory(updated)
    saveStorytellingForEvent(eventId, updated)
    onNotify("Mensagem removida do Livro de Ouro.")
  }

  return (
    <div className="space-y-6">
      {/* HEADER DA SEÇÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
            EDITORIAL & EMOÇÕES
          </span>
          <h2 className="font-serif text-2xl text-white mt-1">
            Gestão de Storytelling & Livro de Ouro
          </h2>
          <p className="text-xs text-[#ABA29A] mt-1">
            Personalize a narrativa poética, os capítulos da história e modere os votos do Livro de Ouro.
          </p>
        </div>

        {/* SUB-TABS */}
        <div className="flex rounded-xl border border-white/10 bg-black/40 p-1 text-xs">
          <button
            onClick={() => setSubTab("carta")}
            className={`rounded-lg px-3.5 py-1.5 font-bold uppercase tracking-wider transition ${
              subTab === "carta" ? "bg-[#D3B47C] text-[#120F0D] shadow" : "text-white/60 hover:text-white"
            }`}
          >
            Carta Aberta
          </button>
          <button
            onClick={() => setSubTab("capitulos")}
            className={`rounded-lg px-3.5 py-1.5 font-bold uppercase tracking-wider transition ${
              subTab === "capitulos" ? "bg-[#D3B47C] text-[#120F0D] shadow" : "text-white/60 hover:text-white"
            }`}
          >
            Capítulos ({story.chapters.length})
          </button>
          <button
            onClick={() => setSubTab("votos")}
            className={`rounded-lg px-3.5 py-1.5 font-bold uppercase tracking-wider transition ${
              subTab === "votos" ? "bg-[#D3B47C] text-[#120F0D] shadow" : "text-white/60 hover:text-white"
            }`}
          >
            Livro de Ouro ({story.guestWishes.length})
          </button>
        </div>
      </div>

      {/* CONTEÚDO SUB-TAB: CARTA ABERTA */}
      {subTab === "carta" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* FORMULÁRIO DE EDIÇÃO */}
          <div className="lg:col-span-7 space-y-4 rounded-2xl border border-white/10 bg-[#14110F] p-6 shadow-xl">
            <h3 className="font-serif text-lg text-white font-normal flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-[#D3B47C]" />
              <span>Editar Carta Aberta aos Convidados</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block mb-1">
                  Kicker / Antetítulo
                </label>
                <input
                  type="text"
                  value={letterKicker}
                  onChange={(e) => setLetterKicker(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block mb-1">
                  Saudação Inicial
                </label>
                <input
                  type="text"
                  value={letterSalutation}
                  onChange={(e) => setLetterSalutation(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block mb-1">
                Título Principal da Carta
              </label>
              <input
                type="text"
                value={letterTitle}
                onChange={(e) => setLetterTitle(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs font-serif text-white focus:border-[#D3B47C] focus:outline-none text-base"
              />
            </div>

            <div>
              <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block mb-1">
                Texto da Carta (Separe os parágrafos com duas quebras de linha)
              </label>
              <textarea
                rows={7}
                value={letterBody}
                onChange={(e) => setLetterBody(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 p-3.5 text-xs leading-relaxed text-white focus:border-[#D3B47C] focus:outline-none font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block mb-1">
                  Assinatura dos Anfitriões
                </label>
                <input
                  type="text"
                  value={letterSignature}
                  onChange={(e) => setLetterSignature(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block mb-1">
                  Data e Cidade (Selo)
                </label>
                <input
                  type="text"
                  value={letterDateAndCity}
                  onChange={(e) => setLetterDateAndCity(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleSaveLetter}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#120F0D] hover:bg-[#E2C799] transition shadow-lg"
              >
                <Save className="h-4 w-4" />
                <span>Salvar e Publicar no Mini-Site</span>
              </button>
            </div>
          </div>

          {/* PRÉVIA EM TEMPO REAL ESTILO PAPEL NOBRE */}
          <div className="lg:col-span-5 rounded-2xl border border-[#D3B47C]/40 bg-[#120F0D] p-6 sm:p-7 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                  PRÉVIA NO MINI-SITE
                </span>
                <span className="text-[0.6rem] text-white/50">{letterDateAndCity || "Brasília • 2026"}</span>
              </div>

              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C] block">
                {letterKicker || "CARTA ABERTA DOS ANFITRIÕES"}
              </span>

              <h4 className="font-serif text-xl sm:text-2xl text-white font-normal leading-snug">
                {letterTitle || "Aos que tornam nosso mundo extraordinário"}
              </h4>

              <p className="text-xs text-[#E4C293] italic font-serif">
                {letterSalutation || "Queridos amigos e familiares,"}
              </p>

              <div className="text-xs text-[#DFD5CA] leading-relaxed space-y-2 italic font-serif opacity-90 line-clamp-8">
                {letterBody || "Escreva aqui as palavras que acolhem seus convidados..."}
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[0.6rem] text-[#ABA29A] block uppercase">Com amor & gratidão,</span>
                  <span className="font-serif text-lg text-[#E4C293] italic">
                    {letterSignature || "Juliana & Matheus"}
                  </span>
                </div>
                <div className="h-10 w-10 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/10 flex items-center justify-center text-[#D3B47C] font-serif text-sm">
                  ⚜️
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO SUB-TAB: CAPÍTULOS DA HISTÓRIA */}
      {subTab === "capitulos" && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {story.chapters.map((ch, idx) => (
              <div
                key={ch.id}
                className="rounded-2xl border border-white/10 bg-[#14110F] p-5 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                      CAPÍTULO 0{idx + 1} · {ch.year}
                    </span>
                    <button
                      onClick={() => handleStartEditChapter(ch)}
                      className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-[#D3B47C] hover:bg-white/10 transition"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Editar</span>
                    </button>
                  </div>

                  <h4 className="font-serif text-lg text-white font-normal mt-2">
                    {ch.title}
                  </h4>
                  <span className="text-xs text-[#ABA29A] block">{ch.location}</span>

                  <p className="mt-2 text-xs text-[#DFD5CA] leading-relaxed line-clamp-3">
                    {ch.text}
                  </p>

                  {ch.quote && (
                    <p className="mt-2 text-xs text-[#E2C799] italic border-l border-[#D3B47C]/40 pl-2.5">
                      &ldquo;{ch.quote}&rdquo;
                    </p>
                  )}
                </div>

                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black">
                  <Image src={ch.image} alt={ch.title} fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>

          {/* MODAL DE EDIÇÃO DE CAPÍTULO */}
          {editingChapterId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
              <div className="w-full max-w-xl rounded-3xl border border-[#D3B47C]/40 bg-[#161311] p-6 shadow-2xl space-y-4 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h4 className="font-serif text-lg text-white">Editar Capítulo</h4>
                  <button
                    onClick={() => setEditingChapterId(null)}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">Ano / Data</label>
                    <input
                      type="text"
                      value={chapterYear}
                      onChange={(e) => setChapterYear(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/50 p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">Local</label>
                    <input
                      type="text"
                      value={chapterLocation}
                      onChange={(e) => setChapterLocation(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-black/50 p-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">Título do Capítulo</label>
                  <input
                    type="text"
                    value={chapterTitle}
                    onChange={(e) => setChapterTitle(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/50 p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">História / Memória</label>
                  <textarea
                    rows={4}
                    value={chapterText}
                    onChange={(e) => setChapterText(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/50 p-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">Citação Poética (Opcional)</label>
                  <input
                    type="text"
                    value={chapterQuote}
                    onChange={(e) => setChapterQuote(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-black/50 p-2 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                  <button
                    onClick={() => setEditingChapterId(null)}
                    className="rounded-xl border border-white/15 px-4 py-2 text-xs text-white hover:bg-white/5"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveChapter}
                    className="rounded-xl bg-[#D3B47C] px-5 py-2 text-xs font-bold text-[#120F0D] hover:bg-[#E2C799]"
                  >
                    Salvar Capítulo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTEÚDO SUB-TAB: LIVRO DE OURO DIGITAL */}
      {subTab === "votos" && (
        <div className="space-y-6">
          {/* FORMULÁRIO RÁPIDO PARA O ANFITRIÃO OU CERIMONIAL ADICIONAR MENSAGEM */}
          <form
            onSubmit={handleAddWish}
            className="rounded-2xl border border-white/10 bg-[#14110F] p-5 shadow-lg space-y-3"
          >
            <h4 className="font-serif text-base text-white flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#D3B47C]" />
              <span>Publicar Agradecimento ou Voto no Livro de Ouro</span>
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Nome de quem assina (ex: Os Anfitriões, Tia Maria...)"
                value={newWishName}
                onChange={(e) => setNewWishName(e.target.value)}
                className="rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Relação (ex: Anfitriões, Padrinhos, Amigos de Brasília)"
                value={newWishRelation}
                onChange={(e) => setNewWishRelation(e.target.value)}
                className="rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
              />
            </div>

            <textarea
              rows={2}
              placeholder="Escreva a mensagem..."
              value={newWishText}
              onChange={(e) => setNewWishText(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
            />

            <button
              type="submit"
              className="rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#120F0D] hover:bg-[#E2C799] transition"
            >
              Publicar no Livro de Ouro
            </button>
          </form>

          {/* LISTAGEM DOS VOTOS */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {story.guestWishes.map((w) => (
              <div
                key={w.id}
                className="rounded-2xl border border-white/10 bg-[#161311] p-4 flex flex-col justify-between space-y-3 shadow"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-serif text-sm font-normal text-white">{w.name}</h5>
                      <span className="text-[0.62rem] text-[#D3B47C] block uppercase tracking-wider">
                        {w.relationship}
                      </span>
                    </div>
                    <span className="text-[0.62rem] text-white/40">{w.timeAgo}</span>
                  </div>

                  <p className="mt-2 text-xs text-[#DFD5CA] leading-relaxed italic font-serif">
                    &ldquo;{w.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-2 text-[0.65rem]">
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle className="h-3 w-3" /> Aprovado
                  </span>
                  <button
                    onClick={() => handleDeleteWish(w.id)}
                    className="text-white/40 hover:text-red-400 transition"
                    title="Excluir mensagem"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
