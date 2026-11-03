"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Plus,
  Trash2,
  Heart,
  Share2,
  Phone,
  CheckCircle,
  Sparkles,
  Award,
  Crown,
} from "lucide-react"
import {
  getStorytellingForEvent,
  saveStorytellingForEvent,
  type EventStorytelling,
  type HonorMember,
} from "@/config/event-storytelling"

interface PainelCorteTabProps {
  eventId: string
  onNotify: (msg: string) => void
}

export default function PainelCorteTab({ eventId, onNotify }: PainelCorteTabProps) {
  const [story, setStory] = useState<EventStorytelling | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // New member form
  const [targetCategory, setTargetCategory] = useState<"parents" | "witnesses">("witnesses")
  const [newName, setNewName] = useState("")
  const [newRole, setNewRole] = useState("Padrinho dos Noivos")
  const [newDesc, setNewDesc] = useState("")

  useEffect(() => {
    const current = getStorytellingForEvent(eventId)
    setStory(current)
  }, [eventId])

  if (!story) return null

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newRole.trim()) return

    const newMember: HonorMember = {
      name: newName.trim(),
      role: newRole.trim(),
      description: newDesc.trim() || "Presença de honra e apoio incondicional na história dos anfitriões.",
    }

    const updatedHonorCourt = {
      ...story.honorCourt,
      [targetCategory]: [...(story.honorCourt[targetCategory] || []), newMember],
    }

    const updated: EventStorytelling = {
      ...story,
      honorCourt: updatedHonorCourt,
    }

    setStory(updated)
    saveStorytellingForEvent(eventId, updated)
    setNewName("")
    setNewDesc("")
    setShowAddModal(false)
    onNotify(`${newMember.name} adicionado(a) à Corte de Honra com sucesso!`)
  }

  const handleDeleteMember = (category: "parents" | "witnesses", index: number) => {
    const list = [...(story.honorCourt[category] || [])]
    const removed = list.splice(index, 1)[0]

    const updatedHonorCourt = {
      ...story.honorCourt,
      [category]: list,
    }

    const updated: EventStorytelling = {
      ...story,
      honorCourt: updatedHonorCourt,
    }

    setStory(updated)
    saveStorytellingForEvent(eventId, updated)
    onNotify(`${removed?.name || "Membro"} removido(a) da Corte de Honra.`)
  }

  // Exportar para WhatsApp do Cerimonial
  const handleExportWhatsApp = () => {
    let msg = `⚜️ *CORTE DE HONRA • DÚNIA CITY HALL*\n`
    msg += `Evento: ${story.heroTagline || "Celebração Oficial"}\n\n`

    if (story.honorCourt.parents && story.honorCourt.parents.length > 0) {
      msg += `*👨‍👩‍👧 PAIS & FAMÍLIA DE HONRA:*\n`
      story.honorCourt.parents.forEach((m, idx) => {
        msg += `${idx + 1}. *${m.name}* (${m.role})\n   Nota: ${m.description}\n`
      })
      msg += `\n`
    }

    if (story.honorCourt.witnesses && story.honorCourt.witnesses.length > 0) {
      msg += `*✨ PADRINHOS & TESTEMUNHAS:*\n`
      story.honorCourt.witnesses.forEach((m, idx) => {
        msg += `${idx + 1}. *${m.name}* (${m.role})\n   Nota: ${m.description}\n`
      })
      msg += `\n`
    }

    msg += `Documento gerado pelo Dúnia Experience OS.`

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
  }

  const parentsList = story.honorCourt?.parents || []
  const witnessesList = story.honorCourt?.witnesses || []

  return (
    <div className="space-y-8">
      {/* HEADER DA SEÇÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
            CORTEJO & PROTOCOLO
          </span>
          <h2 className="font-serif text-2xl text-white mt-1 flex items-center gap-2">
            <Crown className="h-6 w-6 text-[#D3B47C]" />
            <span>Corte de Honra · Pais, Padrinhos & Damas</span>
          </h2>
          <p className="text-xs text-[#ABA29A] mt-1">
            Organize os homenageados que estarão no altar, na nave e nos cortejos oficiais do salão.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportWhatsApp}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:border-[#D3B47C] transition"
          >
            <Share2 className="h-3.5 w-3.5 text-[#D3B47C]" />
            <span>Enviar ao Cerimonial</span>
          </button>

          <button
            onClick={() => {
              setTargetCategory("witnesses")
              setNewRole("Padrinho dos Noivos")
              setShowAddModal(true)
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#120F0D] hover:bg-[#E2C799] transition shadow"
          >
            <Plus className="h-4 w-4" />
            <span>Adicionar Homenageado</span>
          </button>
        </div>
      </div>

      {/* SEÇÃO 1: PAIS & FAMÍLIA DE HONRA */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-[#D3B47C]" />
            <h3 className="font-serif text-lg text-white">Pais & Família de Honra</h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] text-[#DFD5CA]">
              {parentsList.length} pessoas
            </span>
          </div>

          <button
            onClick={() => {
              setTargetCategory("parents")
              setNewRole("Pai do Noivo")
              setShowAddModal(true)
            }}
            className="text-xs text-[#D3B47C] hover:underline flex items-center gap-1 font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar Pai/Mãe
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {parentsList.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-xs text-[#ABA29A]">
              Nenhum membro da família adicionado. Clique no botão acima para adicionar.
            </div>
          ) : (
            parentsList.map((member, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#14110F] p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#D3B47C]/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#D3B47C]/15 border border-[#D3B47C]/30 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C]">
                      {member.role}
                    </span>
                    <button
                      onClick={() => handleDeleteMember("parents", idx)}
                      className="text-white/40 hover:text-red-400 transition"
                      title="Remover da corte"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h4 className="font-serif text-lg text-white font-normal mt-3">
                    {member.name}
                  </h4>

                  <p className="mt-1.5 text-xs text-[#ABA29A] leading-relaxed italic font-serif">
                    &ldquo;{member.description}&rdquo;
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[0.65rem] text-[#DFD5CA]">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle className="h-3 w-3" /> No Altar
                  </span>
                  <span className="text-white/40">Posição 0{idx + 1}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SEÇÃO 2: PADRINHOS & TESTEMUNHAS */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-[#D3B47C]" />
            <h3 className="font-serif text-lg text-white">Padrinhos, Madrinhas & Damas</h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] text-[#DFD5CA]">
              {witnessesList.length} casais / pessoas
            </span>
          </div>

          <button
            onClick={() => {
              setTargetCategory("witnesses")
              setNewRole("Padrinho dos Noivos")
              setShowAddModal(true)
            }}
            className="text-xs text-[#D3B47C] hover:underline flex items-center gap-1 font-semibold"
          >
            <Plus className="h-3.5 w-3.5" /> Adicionar Padrinho/Madrinha
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {witnessesList.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center text-xs text-[#ABA29A]">
              Nenhum padrinho ou testemunha cadastrado. Clique no botão acima para adicionar.
            </div>
          ) : (
            witnessesList.map((member, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-[#14110F] p-5 shadow-lg flex flex-col justify-between space-y-4 hover:border-[#D3B47C]/40 transition"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#D3B47C]/15 border border-[#D3B47C]/30 px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C]">
                      {member.role}
                    </span>
                    <button
                      onClick={() => handleDeleteMember("witnesses", idx)}
                      className="text-white/40 hover:text-red-400 transition"
                      title="Remover da corte"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h4 className="font-serif text-lg text-white font-normal mt-3">
                    {member.name}
                  </h4>

                  <p className="mt-1.5 text-xs text-[#ABA29A] leading-relaxed italic font-serif">
                    &ldquo;{member.description}&rdquo;
                  </p>
                </div>

                <div className="border-t border-white/10 pt-3 flex items-center justify-between text-[0.65rem] text-[#DFD5CA]">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle className="h-3 w-3" /> No Altar / Cortejo
                  </span>
                  <span className="text-white/40">Posição 0{idx + 1}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL PARA ADICIONAR NOVO MEMBRO */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md">
          <form
            onSubmit={handleAddMember}
            className="w-full max-w-lg rounded-3xl border border-[#D3B47C]/40 bg-[#161311] p-6 shadow-2xl space-y-4 text-left"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-serif text-lg text-white">Adicionar Membro à Corte de Honra</h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">Categoria de Entrada</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetCategory("parents")}
                  className={`rounded-xl border p-2.5 text-xs font-semibold transition ${
                    targetCategory === "parents"
                      ? "border-[#D3B47C] bg-[#D3B47C]/20 text-[#D3B47C]"
                      : "border-white/15 bg-black/40 text-[#ABA29A]"
                  }`}
                >
                  Pais & Família
                </button>
                <button
                  type="button"
                  onClick={() => setTargetCategory("witnesses")}
                  className={`rounded-xl border p-2.5 text-xs font-semibold transition ${
                    targetCategory === "witnesses"
                      ? "border-[#D3B47C] bg-[#D3B47C]/20 text-[#D3B47C]"
                      : "border-white/15 bg-black/40 text-[#ABA29A]"
                  }`}
                >
                  Padrinhos & Damas
                </button>
              </div>
            </div>

            <div>
              <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">Nome Completo</label>
              <input
                type="text"
                required
                placeholder="ex: Dr. Rodrigo & Beatriz Fonseca"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 p-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">Papel / Título na Cerimônia</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 p-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none font-serif"
              >
                {targetCategory === "parents" ? (
                  <>
                    <option value="Pai do Noivo">Pai do Noivo</option>
                    <option value="Mãe do Noivo">Mãe do Noivo</option>
                    <option value="Pai da Noiva">Pai da Noiva</option>
                    <option value="Mãe da Noiva">Mãe da Noiva</option>
                    <option value="Avós de Honra">Avós de Honra</option>
                    <option value="Irmãos de Honra">Irmãos de Honra</option>
                  </>
                ) : (
                  <>
                    <option value="Padrinhos dos Noivos">Padrinhos dos Noivos</option>
                    <option value="Madrinha de Honra">Madrinha de Honra</option>
                    <option value="Padrinho de Honra">Padrinho de Honra</option>
                    <option value="Dama de Honra / Demoiselle">Dama de Honra / Demoiselle</option>
                    <option value="Pajem & Daminha">Pajem & Daminha</option>
                    <option value="Celebrante de Honra">Celebrante de Honra</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label className="text-[0.65rem] text-[#ABA29A] uppercase block mb-1">Homenagem ou Papel Especial</label>
              <textarea
                rows={3}
                placeholder="Descreva a importância desta pessoa para a celebração..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 p-2.5 text-xs text-white focus:border-[#D3B47C] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="rounded-xl border border-white/15 px-4 py-2 text-xs text-white hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-xl bg-[#D3B47C] px-5 py-2 text-xs font-bold text-[#120F0D] hover:bg-[#E2C799]"
              >
                Confirmar e Inserir
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
