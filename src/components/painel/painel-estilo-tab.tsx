"use client"

import { useState, useEffect } from "react"
import {
  Palette,
  Music,
  Plus,
  Trash2,
  CheckCircle,
  Play,
  Pause,
  Sparkles,
  Volume2,
  Sliders,
  Scissors,
  Save,
} from "lucide-react"
import {
  getStorytellingForEvent,
  saveStorytellingForEvent,
  type EventStorytelling,
  type PlaylistItem,
} from "@/config/event-storytelling"

interface PainelEstiloTabProps {
  eventId: string
  onNotify: (msg: string) => void
}

export default function PainelEstiloTab({ eventId, onNotify }: PainelEstiloTabProps) {
  const [story, setStory] = useState<EventStorytelling | null>(null)
  const [playingTrack, setPlayingTrack] = useState<number | null>(null)

  // Dress code form
  const [styleName, setStyleName] = useState("")
  const [styleTagline, setStyleTagline] = useState("")
  const [styleDesc, setStyleDesc] = useState("")
  const [forHer, setForHer] = useState("")
  const [forHim, setForHim] = useState("")
  const [caution, setCaution] = useState("")

  // New color form
  const [newColorName, setNewColorName] = useState("")
  const [newColorHex, setNewColorHex] = useState("#D3B47C")

  useEffect(() => {
    const current = getStorytellingForEvent(eventId)
    setStory(current)
    setStyleName(current.dressCode.style)
    setStyleTagline(current.dressCode.tagline)
    setStyleDesc(current.dressCode.description)
    setForHer(current.dressCode.forHer)
    setForHim(current.dressCode.forHim)
    setCaution(current.dressCode.caution)
  }, [eventId])

  if (!story) return null

  // Salvar Dress Code
  const handleSaveDressCode = () => {
    const updated: EventStorytelling = {
      ...story,
      dressCode: {
        ...story.dressCode,
        style: styleName.trim(),
        tagline: styleTagline.trim(),
        description: styleDesc.trim(),
        forHer: forHer.trim(),
        forHim: forHim.trim(),
        caution: caution.trim(),
      },
    }

    setStory(updated)
    saveStorytellingForEvent(eventId, updated)
    onNotify("Guia de Estilo & Dress Code salvo e sincronizado com o Mini-site!")
  }

  // Adicionar Cor à Paleta
  const handleAddColor = () => {
    if (!newColorName.trim()) return

    const updatedPalette = [
      ...story.dressCode.palette,
      { name: newColorName.trim(), hex: newColorHex },
    ]

    const updated: EventStorytelling = {
      ...story,
      dressCode: {
        ...story.dressCode,
        palette: updatedPalette,
      },
    }

    setStory(updated)
    saveStorytellingForEvent(eventId, updated)
    setNewColorName("")
    onNotify(`Cor ${newColorName} adicionada à paleta oficial!`)
  }

  // Remover Cor da Paleta
  const handleDeleteColor = (idx: number) => {
    const updatedPalette = [...story.dressCode.palette]
    updatedPalette.splice(idx, 1)

    const updated: EventStorytelling = {
      ...story,
      dressCode: {
        ...story.dressCode,
        palette: updatedPalette,
      },
    }

    setStory(updated)
    saveStorytellingForEvent(eventId, updated)
    onNotify("Cor removida da paleta.")
  }

  return (
    <div className="space-y-8">
      {/* HEADER DA SEÇÃO */}
      <div className="border-b border-white/10 pb-5">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
          ESTÉTICA & IDENTIDADE
        </span>
        <h2 className="font-serif text-2xl text-white mt-1 flex items-center gap-2">
          <Palette className="h-6 w-6 text-[#D3B47C]" />
          <span>Guia de Estilo, Paleta de Cores & Trilha Sonora</span>
        </h2>
        <p className="text-xs text-[#ABA29A] mt-1">
          Defina o dress code dos convidados, a paleta harmoniosa das madrinhas e a trilha musical de cada ato da celebração.
        </p>
      </div>

      {/* BLOCO 1: DRESS CODE & PALETA DE CORES */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* FORMULÁRIO DRESS CODE */}
        <div className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#14110F] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-serif text-lg text-white font-normal flex items-center gap-2">
              <Scissors className="h-4 w-4 text-[#D3B47C]" />
              <span>Configuração do Dress Code</span>
            </h3>
            <span className="text-xs text-[#D3B47C] font-semibold">{styleName}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">
                Traje Oficial do Evento
              </label>
              <select
                value={styleName}
                onChange={(e) => setStyleName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 p-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none font-serif"
              >
                <option value="Black Tie Tradicional">Black Tie Tradicional</option>
                <option value="Passeio Completo Nobre">Passeio Completo Nobre</option>
                <option value="Esporte Fino Elegante">Esporte Fino Elegante</option>
                <option value="Smoking & Gala Diplomática">Smoking & Gala Diplomática</option>
                <option value="Fluido & Pôr do Sol">Fluido & Pôr do Sol (Jardim)</option>
              </select>
            </div>

            <div>
              <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">
                Slogan / Tagline do Traje
              </label>
              <input
                type="text"
                value={styleTagline}
                onChange={(e) => setStyleTagline(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 p-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">
              Descrição Geral do Conceito
            </label>
            <textarea
              rows={2}
              value={styleDesc}
              onChange={(e) => setStyleDesc(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/50 p-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">
                Para Elas (Vestidos & Joias)
              </label>
              <textarea
                rows={2}
                value={forHer}
                onChange={(e) => setForHer(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">
                Para Eles (Costumes & Calçados)
              </label>
              <textarea
                rows={2}
                value={forHim}
                onChange={(e) => setForHim(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 p-2 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1 text-amber-300">
              Aviso Especial / O que evitar
            </label>
            <input
              type="text"
              value={caution}
              onChange={(e) => setCaution(e.target.value)}
              className="w-full rounded-xl border border-amber-500/30 bg-black/50 p-2 text-xs text-amber-200"
            />
          </div>

          <button
            onClick={handleSaveDressCode}
            className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#120F0D] hover:bg-[#E2C799] transition shadow"
          >
            <Save className="h-4 w-4" />
            <span>Salvar Guia de Estilo</span>
          </button>
        </div>

        {/* GESTÃO DA PALETA DE CORES DAS MADRINHAS */}
        <div className="lg:col-span-5 rounded-2xl border border-[#D3B47C]/30 bg-[#14110F] p-6 shadow-xl space-y-4">
          <div className="border-b border-white/10 pb-3">
            <h3 className="font-serif text-lg text-white font-normal flex items-center gap-2">
              <Palette className="h-4 w-4 text-[#D3B47C]" />
              <span>Paleta Cromática Oficial</span>
            </h3>
            <p className="text-xs text-[#ABA29A] mt-0.5">
              Cores sugeridas para as madrinhas e detalhes decorativos.
            </p>
          </div>

          {/* AMOSTRAS EM EXIBIÇÃO */}
          <div className="grid grid-cols-2 gap-2.5">
            {story.dressCode.palette.map((color, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-black/40 p-2.5 group hover:border-[#D3B47C]/40 transition"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-7 w-7 rounded-full border border-white/20 shadow-md shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div>
                    <span className="text-xs text-white font-serif block leading-tight">{color.name}</span>
                    <span className="text-[0.6rem] text-[#ABA29A] font-mono">{color.hex}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteColor(idx)}
                  className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-400 transition"
                  title="Remover cor"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* ADICIONAR NOVA COR */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            <span className="text-[0.65rem] text-[#ABA29A] uppercase block">
              Adicionar Nova Cor
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="h-9 w-10 cursor-pointer rounded-lg border-0 bg-transparent p-0"
              />
              <input
                type="text"
                placeholder="Nome da cor (ex: Azul Serenity)"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                className="flex-1 rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white"
              />
              <button
                onClick={handleAddColor}
                className="rounded-xl bg-[#D3B47C] px-3.5 py-2 text-xs font-bold text-[#120F0D] hover:bg-[#E2C799]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BLOCO 2: TRILHA SONORA DOS NOIVOS */}
      <div className="rounded-2xl border border-white/10 bg-[#14110F] p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div>
            <h3 className="font-serif text-lg text-white font-normal flex items-center gap-2">
              <Music className="h-4 w-4 text-[#D3B47C]" />
              <span>Trilha Sonora & Momentos Musicais</span>
            </h3>
            <p className="text-xs text-[#ABA29A] mt-0.5">
              As músicas que embalam os momentos mais marcantes da celebração no Dúnia.
            </p>
          </div>
          <span className="rounded-full bg-[#D3B47C]/15 border border-[#D3B47C]/30 px-3 py-1 text-xs text-[#D3B47C] font-semibold">
            {story.playlist.tracks.length} Músicas Oficiais
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {story.playlist.tracks.map((track, idx) => {
            const isPlaying = playingTrack === idx
            return (
              <div
                key={idx}
                className={`rounded-2xl border p-4 transition flex flex-col justify-between space-y-3 ${
                  isPlaying
                    ? "border-[#D3B47C] bg-[#181512] shadow-[0_0_20px_rgba(211,180,124,0.2)]"
                    : "border-white/10 bg-black/40 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[#D3B47C] block">
                      {track.mood}
                    </span>
                    <h5 className="font-serif text-base text-white mt-1">{track.title}</h5>
                    <span className="text-xs text-[#ABA29A]">{track.artist}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (isPlaying) {
                        setPlayingTrack(null)
                        onNotify("Música pausada.")
                      } else {
                        setPlayingTrack(idx)
                        onNotify(`Tocando prévia: ${track.title} (${track.artist})`)
                      }
                    }}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                      isPlaying
                        ? "bg-[#D3B47C] text-[#120F0D]"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                  </button>
                </div>

                <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[0.65rem] text-[#ABA29A]">
                  <span className="italic line-clamp-1">{track.note}</span>
                  <span className="font-mono">{track.duration}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
