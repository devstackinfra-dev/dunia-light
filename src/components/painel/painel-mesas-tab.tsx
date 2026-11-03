"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Layers,
  Printer,
  QrCode,
  Users,
  Search,
  CheckCircle,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Download,
} from "lucide-react"
import { type DuniaGuest, type DuniaEvent } from "@/lib/dunia-store"

interface PainelMesasTabProps {
  event: DuniaEvent
  guests: DuniaGuest[]
  onUpdateGuestTable: (guestId: number, tableName: string) => void
  onNotify: (msg: string) => void
}

const DEFAULT_TABLES = [
  { id: "m-01", name: "Mesa 01 · Imperial (Família Noiva)", capacity: 10, zone: "Salão Imperial" },
  { id: "m-02", name: "Mesa 02 · Imperial (Família Noivo)", capacity: 10, zone: "Salão Imperial" },
  { id: "m-03", name: "Mesa 03 · Padrinhos & Madrinhas", capacity: 12, zone: "Salão Imperial" },
  { id: "m-04", name: "Mesa 04 · Padrinhos & Madrinhas", capacity: 12, zone: "Salão Imperial" },
  { id: "m-05", name: "Mesa 05 · Amigos de Infância", capacity: 8, zone: "Salão Imperial" },
  { id: "m-06", name: "Mesa 06 · Faculdade & Medicina", capacity: 8, zone: "Salão Imperial" },
  { id: "m-07", name: "Mesa 07 · Colegas de Trabalho", capacity: 8, zone: "Espaço Cristal" },
  { id: "m-08", name: "Mesa 08 · Convidados de Fora", capacity: 8, zone: "Espaço Cristal" },
  { id: "m-09", name: "Mesa 09 · Jovens & Solteiros", capacity: 10, zone: "Espaço Cristal" },
  { id: "m-10", name: "Mesa 10 · Espaço Kids & Babás", capacity: 8, zone: "Espaço Cristal" },
]

export default function PainelMesasTab({
  event,
  guests,
  onUpdateGuestTable,
  onNotify,
}: PainelMesasTabProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>("m-01")
  const [guestSearch, setGuestSearch] = useState("")

  const activeTable = DEFAULT_TABLES.find((t) => t.id === selectedTableId) || DEFAULT_TABLES[0]

  // Convidados da mesa selecionada
  const tableGuests = guests.filter((g) => (g.table || "Mesa 01 · Imperial (Família Noiva)") === activeTable.name)
  const totalOccupiedSeats = tableGuests.reduce((acc, g) => acc + (Number(g.seats) || 1), 0)

  // QR Code URL para a mesa
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"
  const tableQrUrl = `${origin}/evento/fotos?mesa=${encodeURIComponent(activeTable.name)}`
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=8&color=120F0D&bgcolor=FFFFFF&data=${encodeURIComponent(
    tableQrUrl
  )}`

  const handlePrintCard = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      {/* HEADER DA SEÇÃO */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
            ORGANIZAÇÃO DE ASSENTOS & DISPLAY
          </span>
          <h2 className="font-serif text-2xl text-white mt-1 flex items-center gap-2">
            <Layers className="h-6 w-6 text-[#D3B47C]" />
            <span>Mapeamento de Mesas & Totens QR Code</span>
          </h2>
          <p className="text-xs text-[#ABA29A] mt-1">
            Distribua os convidados nas mesas do salão e gere os totens com QR Code exclusivo para impressão.
          </p>
        </div>

        <button
          onClick={handlePrintCard}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#120F0D] hover:bg-[#E2C799] transition shadow"
        >
          <Printer className="h-4 w-4" />
          <span>Imprimir Totens de Mesa</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* COLUNA ESQUERDA: LISTA DE MESAS (SELEÇÃO) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-[#14110F] p-4 shadow-xl space-y-3">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#ABA29A] block">
              Salões & Mesas Cadastradas
            </span>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {DEFAULT_TABLES.map((tbl) => {
                const isSelected = tbl.id === selectedTableId
                const assigned = guests.filter(
                  (g) => (g.table || "Mesa 01 · Imperial (Família Noiva)") === tbl.name
                )
                const seatsCount = assigned.reduce((acc, g) => acc + (Number(g.seats) || 1), 0)

                return (
                  <div
                    key={tbl.id}
                    onClick={() => setSelectedTableId(tbl.id)}
                    className={`cursor-pointer rounded-xl border p-3.5 transition flex items-center justify-between ${
                      isSelected
                        ? "border-[#D3B47C] bg-[#1A1613] shadow-[0_0_15px_rgba(211,180,124,0.18)]"
                        : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div>
                      <h4 className="font-serif text-sm text-white font-normal">{tbl.name}</h4>
                      <span className="text-[0.62rem] text-[#ABA29A]">{tbl.zone}</span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`text-xs font-bold ${
                          seatsCount > tbl.capacity ? "text-amber-400" : "text-[#D3B47C]"
                        }`}
                      >
                        {seatsCount} / {tbl.capacity}
                      </span>
                      <span className="block text-[0.58rem] text-white/50 uppercase">lugares</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: PRÉVIA DO DISPLAY DE MESA (TOTEM GRÁFICO IMPRESSÃO) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-3xl border-2 border-[#D3B47C]/40 bg-[#120F0D] p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center space-y-5">
            {/* LOGOTIPO DÚNIA */}
            <div className="flex justify-center">
              <Image
                src="/assets/logo.png"
                alt="Dúnia City Hall"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* IDENTIFICAÇÃO DA MESA */}
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                {activeTable.zone} · BRASÍLIA
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mt-1">
                {activeTable.name}
              </h3>
              <p className="text-xs text-[#ABA29A] mt-1">
                Capacidade: {activeTable.capacity} lugares · Ocupados: {totalOccupiedSeats}
              </p>
            </div>

            {/* QR CODE DA MESA */}
            <div className="mx-auto flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#D3B47C]/40 w-[200px] shadow-xl">
              <img
                src={qrImageUrl}
                alt={`QR Code ${activeTable.name}`}
                className="h-44 w-44 object-contain"
              />
              <span className="text-[0.6rem] font-mono text-black font-semibold mt-1 uppercase tracking-wider">
                {activeTable.name.split("·")[0].trim()}
              </span>
            </div>

            {/* INSTRUÇÃO AO CONVIDADO */}
            <div className="max-w-md mx-auto text-xs text-[#DFD5CA] leading-relaxed italic font-serif">
              &ldquo;Aponte a câmera do seu celular para ver o menu autoral, enviar fotos para os telões de LED do salão e deixar uma mensagem eterna no Livro de Ouro dos anfitriões.&rdquo;
            </div>

            {/* LISTA DE CONVIDADOS NESTA MESA */}
            <div className="border-t border-white/10 pt-4 text-left">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C] block mb-2">
                Convidados Alocados Nesta Mesa ({tableGuests.length})
              </span>

              {tableGuests.length === 0 ? (
                <p className="text-xs text-[#ABA29A] italic">
                  Nenhum convidado alocado ainda nesta mesa. Selecione convidados na aba &quot;Convidados &amp; RSVP&quot;.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {tableGuests.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white flex items-center justify-between"
                    >
                      <span className="truncate">{g.name}</span>
                      <span className="text-[0.65rem] text-[#D3B47C] font-mono shrink-0">
                        +{g.seats}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
