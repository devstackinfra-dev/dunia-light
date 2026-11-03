"use client"

import {
  UtensilsCrossed,
  Share2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { type DuniaGuest, type DuniaEvent } from "@/lib/dunia-store"

interface PainelBuffetDietaryCardProps {
  event: DuniaEvent
  guests: DuniaGuest[]
  onNotify: (msg: string) => void
}

export default function PainelBuffetDietaryCard({
  event,
  guests,
  onNotify,
}: PainelBuffetDietaryCardProps) {
  const confirmed = guests.filter((g) => g.status === "confirmed")
  const totalSeats = confirmed.reduce((acc, g) => acc + (Number(g.seats) || 1), 0)

  // Distribuição de restrições alimentares
  const celiacos = confirmed.filter((g) => g.dietary === "celiaco").length
  const vegetarianos = confirmed.filter((g) => g.dietary === "vegetariano").length
  const veganos = confirmed.filter((g) => g.dietary === "vegano").length
  const semLactose = confirmed.filter((g) => g.dietary === "sem_lactose").length
  const kids = confirmed.filter((g) => g.dietary === "kids").length
  const padrao = Math.max(0, totalSeats - (celiacos + vegetarianos + veganos + semLactose + kids))

  const handleShareWhatsAppChef = () => {
    let msg = `👨‍🍳 *RELATÓRIO DE COZINHA & RESTRIÇÕES · BUFFET DÚNIA*\n`
    msg += `Evento: ${event.name}\n`
    msg += `Data: ${event.date} · Local: ${event.venue}\n\n`
    msg += `📊 *Contagem Consolidada de Pratos:*\n`
    msg += `• Total Confirmados: *${totalSeats} pessoas*\n`
    msg += `• Menu Tradicional: *${padrao} pratos*\n`
    msg += `• Celíacos (Sem Glúten): *${celiacos} pratos*\n`
    msg += `• Vegetarianos: *${vegetarianos} pratos*\n`
    msg += `• Veganos: *${veganos} pratos*\n`
    msg += `• Intolerantes a Lactose: *${semLactose} pratos*\n`
    msg += `• Menu Kids: *${kids} pratos*\n\n`
    msg += `Documento oficial gerado via Dúnia Experience OS.`

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
    onNotify("Relatório enviado para o WhatsApp do Chef do Buffet!")
  }

  return (
    <div className="rounded-2xl border border-[#D3B47C]/40 bg-[#161311] p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D3B47C]/15 text-[#D3B47C]">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              BUFFET DÚNIA · ALTA GASTRONOMIA
            </span>
            <h4 className="font-serif text-lg text-white font-normal">
              Controle de Restrições Alimentares & Cozinha
            </h4>
          </div>
        </div>

        <button
          onClick={handleShareWhatsAppChef}
          className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#120F0D] hover:bg-[#E2C799] transition shadow"
        >
          <Share2 className="h-3.5 w-3.5" />
          <span>Enviar para Chef do Buffet</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
        <div className="rounded-xl border border-white/10 bg-black/40 p-3">
          <span className="text-xl sm:text-2xl font-serif text-white block">{totalSeats}</span>
          <span className="text-[0.62rem] text-[#ABA29A] uppercase tracking-wider">Total Pratos</span>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/40 p-3">
          <span className="text-xl sm:text-2xl font-serif text-emerald-400 block">{padrao}</span>
          <span className="text-[0.62rem] text-[#ABA29A] uppercase tracking-wider">Padrão</span>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3">
          <span className="text-xl sm:text-2xl font-serif text-amber-300 block">{celiacos}</span>
          <span className="text-[0.62rem] text-amber-300 uppercase tracking-wider">Sem Glúten</span>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3">
          <span className="text-xl sm:text-2xl font-serif text-emerald-300 block">{vegetarianos}</span>
          <span className="text-[0.62rem] text-emerald-300 uppercase tracking-wider">Vegetarianos</span>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-3">
          <span className="text-xl sm:text-2xl font-serif text-cyan-300 block">{semLactose}</span>
          <span className="text-[0.62rem] text-cyan-300 uppercase tracking-wider">Sem Lactose</span>
        </div>

        <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-3">
          <span className="text-xl sm:text-2xl font-serif text-purple-300 block">{kids}</span>
          <span className="text-[0.62rem] text-purple-300 uppercase tracking-wider">Menu Kids</span>
        </div>
      </div>
    </div>
  )
}
