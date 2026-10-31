"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle2, MessageSquare, Award, Landmark, Sparkles, MapPin } from "lucide-react"
import { BRAND, whatsappLink } from "@/config/brand"
import { Eyebrow } from "@/components/home/shared/SectionHeader"
import { cn } from "@/lib/utils"
import { useHome } from "@/components/home/shared/ConteudoProvider"

/**
 * Seção Sobre o Dúnia City Hall com Sticky Scroll cinematográfico.
 * No desktop, a fotografia arquitetônica do salão fica fixa e imponente
 * enquanto a história de mais de 15 anos, autoridades recebidas e valores deslizam com elegância.
 */
export function Sobre() {
  const HOME = useHome()
  const { badge, title, paragraphs, valores } = HOME.sobre

  const foto = BRAND.professional.photoAbout || "/images/dunia/salao-versao-03.jpg"
  const temWhatsapp = Boolean(BRAND.contact.whatsapp)

  return (
    <section id="sobre" className="relative w-full scroll-mt-24 bg-[#100E0D] py-24 lg:py-36 overflow-hidden text-white border-b border-marca-latao/20">
      {/* 1. Iluminação de Fundo de Alto Luxo */}
      <div className="pointer-events-none absolute -left-48 top-1/4 h-[600px] w-[600px] rounded-full bg-marca-latao/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-48 bottom-12 h-[550px] w-[550px] rounded-full bg-amber-950/20 blur-[150px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,transparent_60%,#100E0D_100%)] opacity-70" />

      <div className="container relative mx-auto px-6 lg:px-12">
        {/* Layout de 12 colunas: Coluna Esquerda Sticky + Coluna Direita Scroll */}
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          
          {/* LADO ESQUERDO: Fotografia Arquitetônica Sticky (Fixa enquanto o texto rola) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              
              {/* Moldura dourada de latão deslocada com efeito de profundidade */}
              <div className="absolute -inset-3 rounded-3xl border border-marca-latao/30 bg-marca-latao/5 -rotate-1 hidden sm:block pointer-events-none" />
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-marca-latao/20 via-transparent to-white/10 blur-sm pointer-events-none" />

              {/* Container Principal da Fotografia */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/20 bg-[#161311] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={foto}
                  alt="Dúnia City Hall - Salão Nobre no Lago Sul"
                  loading="lazy"
                  className="h-full w-full object-cover object-center filter brightness-[0.92] contrast-[1.05] transition-transform duration-700 hover:scale-105"
                />

                {/* Degradê sutil de fusão com a base */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#100E0D] via-[#100E0D]/30 to-transparent" />

                {/* Placa de Identificação e Autoridade em Vidro Fosco */}
                <div className="absolute bottom-5 inset-x-5 rounded-xl border border-marca-latao/30 bg-black/75 p-4.5 backdrop-blur-md shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-titulo text-lg font-medium tracking-wide text-white">
                        Dúnia City Hall
                      </p>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E5C992] mt-0.5">
                        Desde 2008 · Lago Sul, Brasília
                      </p>
                    </div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-marca-latao/20 border border-marca-latao/40 text-marca-latao">
                      <Landmark className="h-4 w-4" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-2.5 text-[11px] text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>2.500 m² de Área Nobre • Capacidade até 1.200 Convidados</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* LADO DIREITO: Texto Editorial, Métricas e Valores */}
          <div className="lg:col-span-7 space-y-12">
            
            {/* Bloco 1: Cabeçalho & Manifesto */}
            <div>
              <Eyebrow className="mb-4">{badge}</Eyebrow>
              <h2 className="font-titulo text-3xl font-normal leading-[1.14] text-white sm:text-4xl lg:text-[2.75rem] tracking-tight">
                {title}
              </h2>
              
              <div className="mt-8 space-y-5 text-base sm:text-lg leading-relaxed text-slate-200 font-corpo font-light">
                {paragraphs.map((p, idx) => (
                  <p key={idx} className={idx === 0 ? "text-lg sm:text-xl text-white font-normal leading-relaxed border-l-2 border-marca-latao pl-4" : ""}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            {/* Bloco 2: Métricas de Autoridade */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 border-y border-white/10 py-8">
              <div className="flex flex-col border-r border-white/10 pr-4">
                <span className="font-titulo text-3xl sm:text-4xl lg:text-5xl font-light text-marca-latao">
                  2.500 m²
                </span>
                <span className="text-xs uppercase tracking-wider text-slate-300 mt-1 font-semibold">
                  Área Construída Nobre
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  No coração do Lago Sul
                </span>
              </div>

              <div className="flex flex-col pl-2 sm:pl-4">
                <span className="font-titulo text-3xl sm:text-4xl lg:text-5xl font-light text-marca-latao">
                  1.200
                </span>
                <span className="text-xs uppercase tracking-wider text-slate-300 mt-1 font-semibold">
                  Capacidade Máxima
                </span>
                <span className="text-xs text-slate-400 mt-0.5">
                  Dois luxuosos salões integrados
                </span>
              </div>
            </div>

            {/* Bloco 3: Pilares & Valores da Casa */}
            {valores && valores.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#E5C992]">
                  Diferenciais do Espaço
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {valores.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-xl border border-white/10 bg-[#161311]/80 p-5 backdrop-blur-sm transition-all hover:border-marca-latao/40"
                    >
                      <h4 className="font-titulo text-lg font-medium text-white flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-marca-latao shrink-0" />
                        {item.title}
                      </h4>
                      <p className="mt-2 text-xs leading-relaxed text-slate-300 font-corpo">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bloco 4: Ação de Agendamento */}
            <div className="rounded-2xl border border-marca-latao/30 bg-gradient-to-br from-[#1C1713] to-[#120F0D] p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <h4 className="font-titulo text-2xl font-normal text-white">
                    Venha tomar um café conosco no Lago Sul
                  </h4>
                  <p className="mt-2 text-sm text-slate-300 font-corpo">
                    Nossa equipe de concierge está à disposição para apresentar os salões e o jardim.
                  </p>
                </div>
                <Link
                  href={
                    temWhatsapp
                      ? whatsappLink("Olá! Gostaria de agendar uma visita VIP para conhecer os salões do Dúnia City Hall.")
                      : "/#contato"
                  }
                  target={temWhatsapp ? "_blank" : undefined}
                  className="inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#C29D5C] via-[#D3B47C] to-[#C29D5C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow-lg transition-all hover:scale-105"
                >
                  <MessageSquare className="h-4 w-4" />
                  Agendar Visita
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
