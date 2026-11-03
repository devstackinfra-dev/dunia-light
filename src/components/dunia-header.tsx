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
  const [commercialMode, setCommercialMode] = useState<DuniaCommercialMode>("full")

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
  // No Hero da Home, o menu fica oculto para dar destaque total ao hero.
  // Ele aparece ao rolar a página (scrolled) OU ao passar o mouse no topo (isHovered).
  // Nas demais páginas (!isHome), o menu permanece sempre visível.
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
      {/* SENSOR DE HOVER NO TOPO DO HERO (REVELA O MENU AO APROXIMAR O CURSOR) */}
      {isHome && !scrolled && (
        <div
          onMouseEnter={() => setIsHovered(true)}
          onTouchStart={() => setIsHovered(true)}
          className="fixed top-0 inset-x-0 h-16 z-[99] pointer-events-auto bg-transparent"
          aria-hidden="true"
        />
      )}

      {/* BACKDROP DIMMER QUANDO CELEBRAÇÕES ESTÁ ABERTO (EVITA QUALQUER COLISÃO COM TEXTO DO HERO) */}
      {celebrationsOpen && (
        <div
          className="fixed inset-0 z-[101] bg-black/75 backdrop-blur-sm transition-opacity duration-300 pointer-events-auto"
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
            ? "bg-[#0C0A09]/95 py-3.5 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.88)] border-b border-white/[0.08]"
            : "bg-gradient-to-b from-[#0C0A09]/95 via-[#0C0A09]/75 to-transparent py-5 sm:py-6 border-b border-white/[0.04]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* 1. BRAND LOGO (SEMPRE VISÍVEL NO HEADER QUANDO ELE ESTIVER ATIVO) */}
          <div className="flex items-center shrink-0 min-w-[130px] sm:min-w-[190px]">
            <Link
              href="/"
              className="flex items-center gap-3 transition-all duration-300 ease-out hover:scale-[1.02]"
              aria-label="Dúnia City Hall — Início"
            >
              <Image
                src="/assets/logo.png"
                alt="Dúnia City Hall"
                width={260}
                height={90}
                priority
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain transition-all duration-300 drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
              />
            </Link>
          </div>

          {/* 2. MENU PRINCIPAL DESKTOP (AUMENTADO, REFINADO & EQUILIBRADO) */}
          <nav className="hidden items-center gap-4 xl:gap-7 lg:flex" aria-label="Navegação Principal">
            {/* A Experiência */}
            <Link
              href={isHome ? "#story" : "/#story"}
              className="text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] text-white/85 transition-colors hover:text-[#D3B47C] whitespace-nowrap"
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
                className="flex items-center gap-1.5 py-2 text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] text-white/85 transition-colors hover:text-[#D3B47C] whitespace-nowrap cursor-pointer"
                onClick={() => setCelebrationsOpen(!celebrationsOpen)}
                aria-expanded={celebrationsOpen}
                aria-haspopup="true"
              >
                <span>CELEBRAÇÕES</span>
                <ChevronDown
                  className={`h-4 w-4 text-[#D3B47C] transition-transform duration-200 ${
                    celebrationsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Painel Suspenso Luxuoso */}
              {celebrationsOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-2 z-[110] w-[560px] max-w-[calc(100vw-2rem)] animate-fadeIn">
                  <div
                    style={{ backgroundColor: "#14110F" }}
                    className="rounded-2xl border-2 border-[#D3B47C]/40 bg-[#14110F] p-4 sm:p-5 shadow-[0_30px_70px_rgba(0,0,0,0.98),0_0_35px_rgba(211,180,124,0.15)] ring-1 ring-black/80"
                  >
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3.5 px-2">
                      <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                        CENÁRIOS & EXPERIÊNCIAS DÚNIA
                      </span>
                      <span className="text-[0.65rem] text-[#ABA29A]">
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
                                ? "bg-white/10 border-[#D3B47C]/50"
                                : "border-transparent hover:bg-white/[0.06] hover:border-white/15"
                            }`}
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#D3B47C]/15 text-[#D3B47C] group-hover:bg-[#D3B47C] group-hover:text-[#100E0D] transition">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-serif text-sm font-normal text-white group-hover:text-[#D3B47C] transition truncate">
                                  {item.title}
                                </h4>
                              </div>
                              <p className="text-[0.68rem] text-[#ABA29A] leading-tight line-clamp-1 mt-0.5">
                                {item.subtitle}
                              </p>
                              <span className="mt-1 inline-block text-[0.6rem] font-semibold text-[#D3B47C]/90 uppercase tracking-wider">
                                {item.tag}
                              </span>
                            </div>
                          </Link>
                        )
                      })}
                    </div>

                    <div className="mt-3.5 flex items-center justify-between border-t border-white/10 pt-3 px-2 text-xs">
                      <Link
                        href="/sobre"
                        onClick={() => setCelebrationsOpen(false)}
                        className="text-[0.7rem] text-white/70 hover:text-[#D3B47C] transition flex items-center gap-1.5"
                      >
                        <Castle className="h-3.5 w-3.5 text-[#D3B47C]" />
                        <span>Conhecer o Salão (2.500 m²)</span>
                      </Link>
                      <Link
                        href={isHome ? "#celebrations" : "/#celebrations"}
                        onClick={() => setCelebrationsOpen(false)}
                        className="text-[0.7rem] text-[#D3B47C] font-semibold hover:underline flex items-center gap-1"
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
              className="text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] text-white/85 transition-colors hover:text-[#D3B47C] whitespace-nowrap"
            >
              GALERIA 35MM
            </Link>

            {/* O Salão */}
            <Link
              href="/sobre"
              className={`text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] transition-colors whitespace-nowrap ${
                currentPage === "/sobre"
                  ? "text-[#D3B47C]"
                  : "text-white/85 hover:text-[#D3B47C]"
              }`}
            >
              O SALÃO
            </Link>

            {/* Revista Dúnia */}
            <Link
              href={isHome ? "#journal" : "/#journal"}
              className="text-[0.78rem] xl:text-[0.84rem] font-semibold uppercase tracking-[0.18em] xl:tracking-[0.22em] text-white/85 transition-colors hover:text-[#D3B47C] whitespace-nowrap"
            >
              REVISTA DÚNIA
            </Link>
          </nav>

          {/* 3. AÇÕES RÁPIDAS (DIREITA - VISIVELMENTE MAIORES & PROPORCIONAIS) */}
          <div className="hidden items-center gap-3.5 sm:flex">
            {/* Botão Mini-Site Convite (Apenas no Modo Full) */}
            {commercialMode !== "light" && (
              <>
                <Link
                  href="/evento"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 text-[0.72rem] xl:text-[0.76rem] font-semibold uppercase tracking-wider text-white/85 backdrop-blur-sm transition hover:border-[#D3B47C]/70 hover:bg-white/[0.08] hover:text-white whitespace-nowrap"
                >
                  <span>MINI-SITE</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#D3B47C]" />
                </Link>

                {/* Separador fino */}
                <div className="h-5 w-[1px] bg-white/20" />
              </>
            )}

            {/* Botão Principal: Agendar Visita VIP */}
            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] px-5 sm:px-6 py-2.5 text-[0.74rem] sm:text-[0.78rem] font-bold uppercase tracking-[0.16em] text-[#120F0D] shadow-[0_4px_22px_rgba(211,180,124,0.3)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_6px_28px_rgba(211,180,124,0.5)] whitespace-nowrap"
            >
              <Calendar className="h-4 w-4" />
              <span>AGENDAR VISITA</span>
            </a>
          </div>

          {/* 4. BOTÃO HAMBÚRGUER MOBILE */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/[0.05] text-white transition hover:border-[#D3B47C] lg:hidden"
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Linha de Progresso Dourada na borda inferior do Header (Discreta e Elegante) */}
        <div
          className="absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D3B47C] to-transparent transition-all duration-150 opacity-80"
          style={{ width: `${scrollProgress}%` }}
        />
      </header>

      {/* MENU MOBILE EXPANDIDO EM TELA CHEIA */}
      {mobileMenuOpen && (
        <div
          style={{ backgroundColor: "#0C0A09" }}
          className="fixed inset-0 z-[95] flex flex-col justify-between bg-[#0C0A09] pt-24 pb-8 px-6 backdrop-blur-2xl lg:hidden overflow-y-auto animate-fadeIn"
        >
          <div>
            <div className="mb-6 pb-4 border-b border-white/10 text-center">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                NAVEGAÇÃO PRINCIPAL
              </span>
            </div>

            <nav className="flex flex-col space-y-4 text-center">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-white hover:text-[#D3B47C] transition"
              >
                Início
              </Link>
              <Link
                href={isHome ? "#story" : "/#story"}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-white hover:text-[#D3B47C] transition"
              >
                A Experiência
              </Link>

              {/* Celebrações no Mobile */}
              <div className="py-2 border-y border-white/10 my-2">
                <span className="block text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C] mb-3">
                  Celebrações & Espaços
                </span>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {celebrations.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-xl border border-white/10 bg-white/5 p-2.5 hover:border-[#D3B47C] transition"
                    >
                      <span className="font-serif text-sm text-white block">{c.title}</span>
                      <span className="text-[0.6rem] text-[#ABA29A] block">{c.tag}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href={isHome ? "#film" : "/#film"}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-white hover:text-[#D3B47C] transition"
              >
                Galeria 35mm
              </Link>
              <Link
                href="/sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-white hover:text-[#D3B47C] transition"
              >
                O Salão (2.500 m²)
              </Link>
              <Link
                href={isHome ? "#journal" : "/#journal"}
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-xl text-white hover:text-[#D3B47C] transition"
              >
                Revista Dúnia
              </Link>
            </nav>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            {commercialMode !== "light" ? (
              <Link
                href="/evento"
                target="_blank"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold uppercase tracking-wider text-white"
              >
                <span>Ver Mini-Site Demo</span>
                <ExternalLink className="h-3.5 w-3.5 text-[#D3B47C]" />
              </Link>
            ) : (
              <Link
                href="/admin/experiencias"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-3 text-xs font-bold uppercase tracking-wider text-[#D3B47C]"
              >
                <span>Central do Salão Dúnia</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}

            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20ao%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow-lg"
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
