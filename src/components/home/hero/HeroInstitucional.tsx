"use client"

import Link from "next/link"
import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, CheckCircle2, MessageSquare, Sparkles, MapPin } from "lucide-react"
import { BRAND, whatsappLink } from "@/config/brand"
import { HeroSlideType } from "@/types/hero-slide"
import { cn } from "@/lib/utils"
import { useHome } from "@/components/home/shared/ConteudoProvider"

interface HeroInstitucionalProps {
  slide: HeroSlideType
  paddingTop: string
}

/**
 * Hero Cinematográfico do Dúnia City Hall.
 * Fotografia de alta resolução do salão principal, iluminação atmosférica em
 * obsidian e ouro champagne, com selos de autoridade e tradição desde 2008.
 */
export function HeroInstitucional({ slide, paddingTop }: HeroInstitucionalProps) {
  const HOME = useHome()
  const reduzir = useReducedMotion()
  const entrada = (atraso: number) =>
    reduzir
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay: atraso, ease: "easeOut" },
        }

  const temWhatsapp = Boolean(BRAND.contact.whatsapp)
  const primeiraSecao = HOME.sections.find((s) => s === "areas" || s === "catalogo") ?? "areas"

  const fotoFundo = BRAND.assets.salaoPrincipal || "/images/dunia/salao-principal.jpg"

  const secaoRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: secaoRef, offset: ["start start", "end start"] })
  const fotoY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"])

  return (
    <section
      ref={secaoRef}
      className={cn(
        "relative overflow-hidden bg-[#100E0D] text-white min-h-[720px] lg:min-h-[820px] flex items-center border-b border-marca-latao/20",
        paddingTop,
      )}
    >
      {/* 1. Imagem de Fundo Panorâmica com Ken-Burns e Parallax */}
      <div className="absolute inset-0 z-0">
        <motion.div style={reduzir ? undefined : { y: fotoY }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoFundo}
            alt="Salão de Festas Dúnia City Hall no Lago Sul, Brasília"
            fetchPriority="high"
            className="h-full w-full object-cover object-center brightness-[0.75] contrast-[1.05]"
          />
        </motion.div>

        {/* Gradientes Luxo: Vinheta Obsidian + Ouro */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#100E0D] via-[#100E0D]/60 to-[#100E0D]/75 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#100E0D]/40 to-[#100E0D]/90 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#100E0D] to-transparent pointer-events-none" />
      </div>

      {/* 2. Conteúdo Central Imersivo */}
      <div className="container relative z-10 mx-auto px-6 py-16 lg:px-12 my-auto w-full text-center">
        <div className="mx-auto max-w-4xl flex flex-col items-center">
          
          {/* Badge de Tradição e Localização */}
          <motion.div {...entrada(0)}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-marca-latao/40 bg-black/50 px-5 py-2 backdrop-blur-md shadow-2xl">
              <Sparkles className="h-3.5 w-3.5 text-marca-latao animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E5C992]">
                {HOME.hero.badge || "Lago Sul • Brasília / DF"}
              </span>
              <span className="h-1 w-1 rounded-full bg-marca-latao/60" />
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-marca-latao inline" /> SHIS QI 15
              </span>
            </div>
          </motion.div>

          {/* Título Monumental em Serifa Editorial */}
          <motion.h1
            {...entrada(0.1)}
            className="mt-6 font-titulo text-3xl sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] font-normal leading-[1.08] text-white tracking-tight"
          >
            {slide.title || "O salão de festas mais elegante de Brasília,"}
            <br />
            <span className="italic bg-gradient-to-r from-[#D3B47C] via-[#F4E3BE] to-[#D3B47C] bg-clip-text text-transparent drop-shadow-sm">
              {slide.glowTitle || "perfeito para todos os tipos de eventos."}
            </span>
          </motion.h1>

          {/* Subtítulo Oficial com Dados Reais */}
          <motion.p
            {...entrada(0.2)}
            className="mt-6 max-w-2xl text-base sm:text-lg lg:text-xl leading-relaxed text-slate-200 font-corpo font-light"
          >
            {slide.subtitle ||
              "Desde 2008 eternizando momentos inesquecíveis com arquitetura monumental de 2.500 m², capacidade para até 1.200 convidados e gastronomia de padrão internacional."}
          </motion.p>

          {/* Botões de Ação */}
          <motion.div {...entrada(0.3)} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href={
                temWhatsapp
                  ? whatsappLink("Olá! Gostaria de agendar uma visita VIP e solicitar um orçamento no Dúnia City Hall.")
                  : "/#contato"
              }
              target={temWhatsapp ? "_blank" : undefined}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#C29D5C] via-[#D3B47C] to-[#C29D5C] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#100E0D] shadow-[0_0_30px_rgba(211,180,124,0.35)] transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(211,180,124,0.5)]"
            >
              <MessageSquare className="h-4 w-4" />
              {slide.ctaText || HOME.hero.ctaText || "Agendar Visita VIP"}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={`/#${primeiraSecao}`}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/25 bg-white/[0.06] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:border-marca-latao hover:text-marca-latao hover:bg-white/[0.1]"
            >
              {HOME.hero.secondaryText || "Conhecer as Celebrações"}
            </Link>
          </motion.div>

          {/* 3 Garantias / Selos */}
          <motion.ul
            {...entrada(0.4)}
            className="mt-12 flex flex-wrap justify-center items-center gap-y-3 gap-x-6 sm:gap-x-8 border-t border-white/10 pt-7 text-xs sm:text-sm text-slate-300 font-corpo"
          >
            {HOME.hero.confianca.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-marca-latao shrink-0" />
                <span className="tracking-wide">{item}</span>
              </li>
            ))}
          </motion.ul>

        </div>
      </div>
    </section>
  )
}
