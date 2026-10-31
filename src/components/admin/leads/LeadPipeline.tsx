"use client"

import { Lead } from "@/types/lead"
import { LeadCard } from "./LeadCard"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { FUNIL } from "@/config/funil"

interface LeadPipelineProps {
  leads: Lead[]
  onLeadClick: (lead: Lead) => void
  onStatusChange: (leadId: string, newStatus: Lead["status"]) => void
}

/** Colunas do quadro: as etapas do funil da vertical (src/config/funil.ts). */
export const PIPELINE_COLUMNS = FUNIL.map((e) => ({ id: e.id, name: e.label, color: e.cor }))

export function LeadPipeline({ leads, onLeadClick, onStatusChange }: LeadPipelineProps) {
  const [dragOverCol, setDragOverCol] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent, colId: string) => {
    e.preventDefault()
    setDragOverCol(colId)
  }

  const handleDragLeave = () => {
    setDragOverCol(null)
  }

  const handleDrop = (e: React.DragEvent, colId: Lead["status"]) => {
    e.preventDefault()
    setDragOverCol(null)
    const leadId = e.dataTransfer.getData("text/plain")
    if (leadId) {
      onStatusChange(leadId, colId)
    }
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 select-none items-stretch min-h-[550px] scrollbar-thin scrollbar-thumb-slate-200">
      {PIPELINE_COLUMNS.map((col) => {
        const columnLeads = leads.filter((lead) => lead.status === col.id)
        const isDraggingOver = dragOverCol === col.id
        
        return (
          <div 
            key={col.id} 
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={cn(
              "flex-1 min-w-[280px] max-w-[320px] bg-white border border-slate-200 rounded-2xl p-4 flex flex-col space-y-4 shrink-0 transition-colors duration-300 shadow-sm",
              isDraggingOver && "bg-slate-50 border-sky-400"
            )}
          >
            {/* Header da Coluna */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <h3 className="font-bold text-sm text-slate-800">{col.name}</h3>
              </div>
              <Badge className={`${col.color} border text-[10px] font-black`}>
                {columnLeads.length}
              </Badge>
            </div>

            {/* Listagem de Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[600px] scrollbar-thin scrollbar-thumb-slate-200">
              {columnLeads.length === 0 ? (
                <div className="h-24 border border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400 font-semibold bg-slate-50/50">
                  Arraste os leads aqui
                </div>
              ) : (
                columnLeads.map((lead) => (
                  <LeadCard 
                    key={lead.id} 
                    lead={lead} 
                    onClick={onLeadClick} 
                  />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
