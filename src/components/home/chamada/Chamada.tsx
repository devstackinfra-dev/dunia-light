"use client"

import Link from "next/link"
import { ArrowRight, MessageSquare, PhoneCall, ShieldCheck } from "lucide-react"
import { BRAND, whatsappLink } from "@/config/brand"
import { useHome } from "@/components/home/shared/ConteudoProvider"

/**
 * Chamada de Conversão com estética solene e acolhedora.
 * Posicionada estrategicamente antes do formulário e das dúvidas.
 */
export function Chamada() {
  // Textos deste cliente (banco) sobre o padrão da vertical
  const HOME = useHome()
  const { title, text, ctaText } = HOME.chamada
  const temWhatsapp = Boolean(BRAND.contact.whatsapp)

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-marca-tinta via-marca-painel to-marca-tinta py-24 lg:py-28 text-white border-y border-white/10">
      {/* Luz ambiente central */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-marca-latao/10 blur-[130px]" />

      <div className="container relative mx-auto max-w-4xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-marca-latao/30 bg-marca-latao/10 px-4 py-1.5 backdrop-blur-md mb-6">
          <ShieldCheck className="h-4 w-4 text-marca-latao" />
          <span className="text-xs font-semibold uppercase tracking-widest text-marca-latao">
            Orientação Jurídica Segura
          </span>
        </div>

        <h2 className="font-titulo text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-300 md:text-lg">
          {text}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={temWhatsapp ? whatsappLink(`Olá! Vim pelo site do ${BRAND.name} e gostaria de orientação para o meu caso.`) : "/#contato"}
            target={temWhatsapp ? "_blank" : undefined}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-xl bg-marca-latao px-8 py-4 text-sm font-bold text-marca-tinta shadow-xl shadow-marca-latao/20 transition-all hover:bg-marca-latao/90 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marca-latao"
          >
            <MessageSquare className="h-4 w-4" />
            {ctaText}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/#contato"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-marca-latao hover:bg-white/[0.08] hover:text-marca-latao"
          >
            <PhoneCall className="h-4 w-4" />
            Preencher Formulário de Contato
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-400">
          Atendimento presencial em escritório ou online por videoconferência com total sigilo.
        </p>
      </div>
    </section>
  )
}
