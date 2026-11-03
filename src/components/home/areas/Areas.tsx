"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, MessageSquare } from "lucide-react"
import { type HomeCard } from "@/config/home-content"
import { HomeIcon } from "@/components/home/shared/HomeIcon"
import { SectionHeader } from "@/components/home/shared/SectionHeader"
import { useHome } from "@/components/home/shared/ConteudoProvider"
import { BRAND, whatsappLink } from "@/config/brand"

/**
 * Seção de Celebrações & Espaços do Dúnia City Hall.
 * Fotografia de fundo panorâmica do salão com véu escuro e cards em vidro
 * com as fotos reais de cada tipo de evento (Casamentos, 15 Anos, Corporativo, etc.).
 */
export function Areas() {
  const HOME = useHome()
  const { badge, title, subtitle } = HOME.areas
  const [cards] = useState<HomeCard[]>(HOME.areas.cards)

  const fotoFundo = "/images/dunia/salao-principal.jpg"
  const temWhatsapp = Boolean(BRAND.contact.whatsapp)

  if (cards.length === 0) return null

  return (
    <section id="areas" className="relative w-full scroll-mt-24 overflow-hidden bg-[#100E0D] py-24 lg:py-32 text-white border-b border-marca-latao/20">
      {/* 1. Fotografia Panorâmica como Fundo da Seção */}
      {fotoFundo && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoFundo}
            alt=""
            className="h-full w-full object-cover object-center filter brightness-[0.25] contrast-[1.1] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#100E0D]/95 via-[#100E0D]/90 to-[#100E0D]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#100E0D_100%)] opacity-80" />
        </div>
      )}

      {/* 2. Conteúdo e Cards com Efeito Glassmorphism */}
      <div className="container relative z-10 mx-auto px-6 lg:px-12">
        <SectionHeader badge={badge} title={title} subtitle={subtitle} tom="escuro" />

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, idx) => {
            const fotoCard = card.image || "/images/dunia/salao-principal.jpg"
            const indice = String(idx + 1).padStart(2, "0")
            const msgWhatsapp = `Olá! Gostaria de solicitar um orçamento e consultar datas para ${card.title} no Dúnia City Hall.`
            const linkHref = temWhatsapp ? whatsappLink(msgWhatsapp) : "/#contato"

            return (
              <article
                key={card.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#161311]/90 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-marca-latao/60 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
              >
                <div>
                  {/* Topo com Foto Real do Evento */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={fotoCard}
                      alt={card.title}
                      loading="lazy"
                      className="h-full w-full object-cover object-center filter brightness-[0.92] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />
                    
                    {/* Badge sobre a imagem com ícone e numeração */}
                    <div className="absolute bottom-3 left-4 flex items-center gap-2.5 rounded-lg border border-white/15 bg-black/60 px-3 py-1.5 backdrop-blur-md">
                      <HomeIcon name={card.icon} className="h-4 w-4 text-marca-latao" />
                      <span className="font-titulo text-[11px] font-semibold tracking-[0.2em] text-[#E5C992]">
                        {indice}
                      </span>
                    </div>
                  </div>

                  {/* Corpo do Card */}
                  <div className="p-6 sm:p-7">
                    <h3 className="font-titulo text-2xl font-normal leading-snug tracking-tight text-white transition-colors group-hover:text-marca-latao">
                      {card.title}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-slate-300 font-corpo">
                      {card.text}
                    </p>

                    {/* Destaques / Situações do Evento */}
                    {card.situacoes && card.situacoes.length > 0 && (
                      <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
                        {card.situacoes.map((s) => (
                          <li key={s} className="flex items-start gap-2.5 text-xs text-slate-300 font-corpo">
                            <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-marca-latao" />
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Rodapé do Card com Ação */}
                <div className="px-6 pb-6 pt-0 sm:px-7 sm:pb-7">
                  <div className="border-t border-white/10 pt-4">
                    <Link
                      href={linkHref}
                      target={temWhatsapp ? "_blank" : undefined}
                      className="flex items-center justify-between group/link"
                    >
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-marca-latao transition-colors group-hover/link:text-white">
                        <MessageSquare className="h-3.5 w-3.5" />
                        Solicitar Orçamento
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/link:translate-x-1" />
                      </span>
                      <span className="h-2 w-2 rounded-full bg-marca-latao/40 transition-colors duration-300 group-hover/link:bg-marca-latao" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
