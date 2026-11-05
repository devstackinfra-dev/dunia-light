"use client"

import { useState, useEffect, useRef } from "react"
import { getCommercialMode, type DuniaCommercialMode } from "@/lib/dunia-store"
import Link from "next/link"
import Image from "next/image"
import {
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Heart,
  UtensilsCrossed,
  Building2,
  Globe,
  Trees,
  Castle,
  ExternalLink,
  Calendar,
  ArrowRight,
} from "lucide-react"

interface DuniaHeaderProps {
  currentPage?: string
}

export default function DuniaHeader({ currentPage = "/" }: DuniaHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [celebrationsOpen, setCelebrationsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [commercialMode, setCommercialMode] = useState<DuniaCommercialMode>("light")

  useEffect(() => {
    setCommercialMode(getCommercialMode())
    const onModeChange = (e: any) => {
      if (e.detail) setCommercialMode(e.detail)
    }
    window.addEventListener("dunia-mode-change", onModeChange)
    return () => window.removeEventListener("dunia-mode-change", onModeChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? (y / max) * 100 : 0)
      setScrolled(y > 50)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fechar dropdown ao clicar fora ou pressionar Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCelebrationsOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCelebrationsOpen(false)
      }
    }

    if (celebrationsOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [celebrationsOpen])

  const isHome = currentPage === "/"
  // No Hero da Home, o menu surge suavemente ao rolar ou passar o mouse
  const isHeaderVisible = !isHome || scrolled || isHovered || celebrationsOpen || mobileMenuOpen

  const celebrations = [
    {
      title: "Casamentos dos Sonhos",
      subtitle: "O clássico & romântico no Lago Sul",
      href: "/casamento",
      icon: Heart,
      tag: "Espaço da Noiva",
    },
    {
      title: "15 Anos & Debutantes",
      subtitle: "Noite mágica com pista monumental",
      href: "/debutante",
      icon: Sparkles,
      tag: "Luz & Som High-Tech",
    },
    {
      title: "Buffet & Gastronomia",
      subtitle: "A culinária como linguagem do afeto",
      href: "/buffet",
      icon: UtensilsCrossed,
      tag: "Menu Autoral",
    },
    {
      title: "Corporativo & Galas",
      subtitle: "Distinção para grandes marcas",
      href: "/corporativo",
      icon: Building2,
      tag: "Infraestrutura",
    },
    {
      title: "Recepções Diplomáticas",
      subtitle: "Acolhendo o mundo na capital",
      href: "/embaixadas",
      icon: Globe,
      tag: "Protocolo Oficial",
    },
    {
      title: "O Jardim & Cerimônias",
      subtitle: "Celebrações ao ar livre",
      href: "/jardim",
      icon: Trees,
      tag: "Natureza & Lago",
    },
  ]

  return (
    <>
      {/* SENSOR DE HOVER NO TOPO DO HERO */}
      {isHome && !scrolled && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onTouchStart={() => setIsHovered(true)}
          className="fixed top-0 inset-x-0 h-16 z-[99] pointer-events-auto bg-transparent"
          aria-hidden="true"
        />
      )}

      {/* BACKDROP DIMMER QUANDO CELEBRAÇÕES ESTÁ ABERTO */}
      {celebrationsOpen && (
        <div
          className="fixed inset-0 z-[101] bg-black/40 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
          onClick={() => setCelebrationsOpen(false)}
          aria-hidden="true"
        />
      )}

      <header
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          if (!celebrationsOpen) {
            setIsHovered(false)
          }
        }}
        className={`fixed inset-x-0 top-0 z-[105] transition-all duration-500 ease-out ${
          isHeaderVisible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-full pointer-events-none"
        } ${
          scrolled
            ? "bg-[#F7EFE6]/95 py-3.5 backdrop-blur-xl shadow-[0_8px_30px_rgba(84,23,37,0.06)] border-b border-[#D7B78D]/35"
            : "bg-gradient-to-b from-[#F7EFE6]/95 via-[#F7EFE6]/75 to-transparent py-4 sm:py-5 border-b border-[#D7B78D]/20"
        }`}
      >
        <div className="mx-auto flex w-full max-w-[1380px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* 1. BRAND LOGO COM CONTRASTE ELEGANTE NATIVO (SEM CAIXA PRETA NO HEADER CHAMPANHE) */}
          <div className="flex items-center shrink-0 min-w-[130px] sm:min-w-[180px]">
            <Link
              href="/"
              className="flex items-center transition-all duration-300 ease-out hover:scale-[1.02]"
              aria-label="Dúnia City Hall — Início"
            >
              <Image
                src="/images/dunia/logo-dunia-preta.png"
                alt="Dúnia City Hall"
                width={240}
                height={84}
                priority
                className="h-8 sm:h-9 lg:h-9.5 w-auto object-contain transition-all duration-300"
              />
            </Link>
          </div>

          {/* 2. MENU PRINCIPAL DESKTOP (ALTO CONTRASTE CHAMPANHE & BORDÔ) */}
          <nav className="hidden items-center gap-4 xl:gap-7 lg:flex" aria-label="Navegação Principal">
            {/* A Experiência */}
            <Link
              href={isHome ? "#story" : "/#story"}
              className="text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] text-[#30221D]/85 transition-colors hover:text-[#741F32] whitespace-nowrap"
            >
              A EXPERIÊNCIA
            </Link>

            {/* CELEBRAÇÕES (COM MEGA-DROPDOWN LUXUOSO) */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setCelebrationsOpen(true)}
              onMouseLeave={() => setCelebrationsOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1.5 py-2 text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] text-[#30221D]/85 transition-colors hover:text-[#741F32] whitespace-nowrap cursor-pointer"
                onClick={() => setCelebrationsOpen(!celebrationsOpen)}
                aria-expanded={celebrationsOpen}
                aria-haspopup="true"
              >
                <span>CELEBRAÇÕES</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#741F32] transition-transform duration-200 ${
                    celebrationsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Painel Suspenso Luxuoso Claro */}
              {celebrationsOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 z-[110] w-[560px] max-w-[calc(100vw-2rem)] animate-fadeIn">
                  <div
                    style={{ backgroundColor: "#F2E4D5" }}
                    className="rounded-2xl border border-[#D7B78D]/60 bg-[#F2E4D5] p-4 sm:p-5 shadow-[0_20px_50px_rgba(84,23,37,0.12)] ring-1 ring-[#D7B78D]/20"
                  >
                    <div className="flex items-center justify-between border-b border-[#D7B78D]/40 pb-3 mb-3.5 px-2">
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#741F32]">
                        CENÁRIOS & EXPERIÊNCIAS DÚNIA
                      </span>
                      <span className="text-[0.65rem] text-[#77665D]">
                        Lago Sul • Brasília
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {celebrations.map((item) => {
                        const Icon = item.icon
                        const isActive = currentPage === item.href
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setCelebrationsOpen(false)}
                            className={`group flex items-start gap-3 rounded-xl p-2.5 transition border ${
                              isActive
                                ? "bg-[#741F32]/10 border-[#741F32]/40"
                                : "border-transparent hover:bg-[#FAF4ED] hover:border-[#D7B78D]/40"
                            }`}
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#741F32]/10 text-[#741F32] group-hover:bg-[#741F32] group-hover:text-white transition">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-serif text-sm font-semibold text-[#30221D] group-hover:text-[#741F32] transition truncate">
                                  {item.title}
                                </h4>
                              </div>
                              <p className="text-[0.68rem] text-[#77665D] leading-tight line-clamp-1 mt-0.5">
                                {item.subtitle}
                              </p>
                              <span className="mt-1 inline-block text-[0.6rem] font-semibold text-[#741F32] uppercase tracking-wider">
                                {item.tag}
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>

                    <div className="mt-3.5 flex items-center justify-between border-t border-[#D7B78D]/30 pt-3 px-2 text-xs">
                      <Link
                        href="/sobre"
                        onClick={() => setCelebrationsOpen(false)}
                        className="text-[0.7rem] text-[#30221D]/80 hover:text-[#741F32] transition flex items-center gap-1.5"
                      >
                        <Castle className="h-3.5 w-3.5 text-[#741F32]" />
                        <span>Conhecer o Salão (2.500 m²)</span>
                      </Link>
                      <Link
                        href={isHome ? "#celebrations" : "/#celebrations"}
                        onClick={() => setCelebrationsOpen(false)}
                        className="text-[0.7rem] text-[#741F32] font-semibold hover:underline flex items-center gap-1"
                      >
                        <span>Ver todas as áreas</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Galeria 35mm */}
            <Link
              href={isHome ? "#film" : "/#film"}
              className="text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] text-[#30221D]/85 transition-colors hover:text-[#741F32] whitespace-nowrap"
            >
              GALERIA 35MM
            </Link>

            {/* O Salão */}
            <Link
              href="/sobre"
              className={`text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] transition-colors whitespace-nowrap ${
                currentPage === "/sobre"
                  ? "text-[#741F32] font-bold"
                  : "text-[#30221D]/85 hover:text-[#741F32]"
              }`}
            >
              O SALÃO
            </Link>

            {/* Revista Dúnia */}
            <Link
              href={isHome ? "#journal" : "/#journal"}
              className="text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] text-[#30221D]/85 transition-colors hover:text-[#741F32] whitespace-nowrap"
            >
              REVISTA DÚNIA
            </Link>
          </nav>

          {/* 3. AÇÕES RÁPIDAS (DIREITA - BORDÔ REAL & OURO) */}
          <div className="hidden items-center gap-3.5 sm:flex">
            {/* Botão Mini-Site Convite (Exibido APENAS se explicitamente no modo full) */}
            {commercialMode === "full" && (
              <>
                <Link
                  href="/evento"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#5A1827]/20 bg-[#FAF7F2] px-4 py-2 text-[0.72rem] xl:text-[0.76rem] font-semibold uppercase tracking-wider text-[#5A1827] transition hover:border-[#5A1827] hover:bg-[#5A1827]/05 whitespace-nowrap"
                >
                  <span>MINI-SITE</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#5A1827]" />
                </Link>
                <div className="h-5 w-[1px] bg-[#5A1827]/20" />
              </>
            )}

            {/* Botão Principal: Agendar Visita VIP em Bordô Real */}
            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-[#741F32] hover:bg-[#541725] px-5 sm:px-6 py-2.5 text-[0.74rem] sm:text-[0.78rem] font-bold uppercase tracking-[0.16em] text-white shadow-[0_4px_22px_rgba(116,31,50,0.28)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(116,31,50,0.38)] whitespace-nowrap"
            >
              <Calendar className="h-4 w-4" />
              <span>AGENDAR VISITA</span>
            </a>
          </div>

          {/* 4. BOTÃO HAMBÚRGUER MOBILE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D7B78D]/40 bg-[#F2E4D5] text-[#741F32] transition hover:border-[#741F32] lg:hidden"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Linha de Progresso Bordô na borda inferior do Header */}
        <div
          className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#741F32] to-transparent transition-all duration-150 opacity-80"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* MENU MOBILE EXPANDIDO EM TELA CHEIA (TEMA CLARO PRESTIGE) */}
      {mobileMenuOpen && (
        <div
          style={{ backgroundColor: "#F7EFE6" }}
          className="fixed inset-0 z-[95] flex flex-col justify-between bg-[#F7EFE6] pt-24 pb-8 px-6 backdrop-blur-2xl lg:hidden overflow-y-auto animate-fadeIn"
        >
          <div>
            <div className="mb-6 pb-4 border-b border-[#D7B78D]/30 text-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#741F32]">
                NAVEGAÇÃO PRINCIPAL
              </span>
            </div>

            <nav className="flex flex-col space-y-4 text-center">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-[#30221D] hover:text-[#741F32] transition"
              >
                Início
              </Link>
              <Link
                href={isHome ? "#story" : "/#story"}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-[#30221D] hover:text-[#741F32] transition"
              >
                A Experiência
              </Link>

              {/* Celebrações no Mobile */}
              <div className="py-2 border-y border-[#D7B78D]/30 my-2">
                <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#741F32] mb-3">
                  Celebrações & Espaços
                </span>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {celebrations.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl border border-[#D7B78D]/40 bg-[#F2E4D5] p-2.5 hover:border-[#741F32] transition shadow-sm"
                    >
                      <span className="font-serif text-sm text-[#30221D] block font-semibold">{c.title}</span>
                      <span className="text-[0.6rem] text-[#77665D] block">{c.tag}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={isHome ? "#film" : "/#film"}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-[#30221D] hover:text-[#741F32] transition"
              >
                Galeria 35mm
              </Link>
              <Link
                href="/sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-[#30221D] hover:text-[#741F32] transition"
              >
                O Salão (2.500 m²)
              </Link>
              <Link
                href={isHome ? "#journal" : "/#journal"}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-[#30221D] hover:text-[#741F32] transition"
              >
                Revista Dúnia
              </Link>
            </nav>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/admin/experiencias"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#D7B78D]/50 bg-[#F2E4D5] py-3 text-xs font-bold uppercase tracking-wider text-[#741F32] shadow-sm"
            >
              <span>Central do Salão Dúnia</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#741F32] hover:bg-[#541725] py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg"
            >
              <Calendar className="h-4 w-4" />
              <span>AGENDAR VISITA VIP</span>
            </a>
          </div>
        </div>
      )}
    </>
  )
}
