"use client"

import { SectionHeader } from "@/components/home/shared/SectionHeader"
import { Check } from "lucide-react"
import { useHome } from "@/components/home/shared/ConteudoProvider"

/**
 * Passo a passo do atendimento jurídico com visual de alto nível e clareza de processo.
 */
export function HowItWorks() {
  // Textos deste cliente (banco) sobre o padrão da vertical
  const HOME = useHome()
  const { badge, title, subtitle, steps } = HOME.comoFunciona

  return (
    <section id="como-funciona" className="relative w-full scroll-mt-24 bg-white py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionHeader badge={badge} title={title} subtitle={subtitle} tom="claro" />

        <div className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Linha conectora no desktop */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-12 right-12 top-7 hidden h-0.5 bg-gradient-to-r from-marca-latao/20 via-marca-latao to-marca-latao/20 lg:block"
          />

          {steps.map((step, idx) => (
            <div
              key={step.title}
              className="group relative flex flex-col rounded-2xl border border-slate-100 bg-slate-50/60 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-marca-latao/50 hover:bg-white hover:shadow-lg"
            >
              <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-marca-latao/40 bg-white font-titulo text-xl font-bold text-marca-tinta shadow-md group-hover:bg-marca-latao group-hover:text-marca-tinta transition-colors">
                0{idx + 1}
              </div>

              <h3 className="font-titulo text-xl font-medium tracking-tight text-slate-900 group-hover:text-marca-tinta">
                {step.title}
              </h3>

              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600">
                {step.text}
              </p>

              <div className="mt-6 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-marca-latao pt-4 border-t border-slate-200/50">
                <Check className="h-3.5 w-3.5" />
                <span>Etapa {idx + 1} de 4</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
