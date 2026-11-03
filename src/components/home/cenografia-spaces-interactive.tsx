"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  Layers,
  Trees,
  Shield,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Compass,
} from "lucide-react"

interface SpaceItem {
  id: string
  number: string
  name: string
  shortDesc: string
  fullDesc: string
  badge: string
  specs: string[]
  icon: typeof Heart
  image: string
  gallery: { src: string; caption: string }[]
}

const CENOGRAFIA_SPACES: SpaceItem[] = [
  {
    id: "espaco-noiva",
    number: "01",
    name: "Espaço da Noiva",
    shortDesc: "Camarim privativo climatizado com conforto térmico e espelho cenográfico.",
    fullDesc:
      "Um refúgio de serenidade e alta sofisticação projetado para o dia da noiva e madrinhas. Conta com bancadas de maquiagem com iluminação calibrada para fotografia profissional (3.200K a 5.600K), banheira de hidromassagem em mármore, lounge de estar privativo com bar de champanhe e porta de acesso secreta com saída direta à nave.",
    badge: "CAMARIM VIP PRIVATIVO",
    specs: ["80 m² privativos", "Banheira de hidromassagem", "Luz de estúdio calibrada", "Acesso secreto ao altar"],
    icon: Heart,
    image: "/images/acervo/11-servicos/salao-de-festa/salao-02.jpg",
    gallery: [
      {
        src: "/images/acervo/11-servicos/salao-de-festa/salao-02.jpg",
        caption: "Bancadas de maquiagem iluminadas e espelho cenográfico de corpo inteiro",
      },
      {
        src: "/images/acervo/13-institucionais/salao-versao-03.jpg",
        caption: "Suíte privativa com lounge de descanso e acolhimento familiar",
      },
      {
        src: "/assets/casal.jpg",
        caption: "Momentos íntimos e preparativos inesquecíveis antes do 'sim'",
      },
    ],
  },
  {
    id: "saloes-modulares",
    number: "02",
    name: "Salões Modulares",
    shortDesc: "Divisórias acústicas retráteis para receber de 100 até 1.200 convidados.",
    fullDesc:
      "Vão livre colossal de até 1.400 m² sem colunas para obstruir a vista dos convidados, com pé-direito duplo de 7 metros e pontos de rigging aéreo homologados para 500 kg cada. Suas divisórias retráteis acústicas alemãs (atenuação 48dB) permitem transformar o espaço em múltiplos ambientes simultâneos sem vazamento de som.",
    badge: "1.400 M² DE VÃO LIVRE",
    specs: ["100 a 1.200 convidados", "Pé-direito de 7 metros", "Divisórias acústicas 48dB", "Rigging aéreo cenográfico"],
    icon: Layers,
    image: "/images/acervo/03-casamento/Decoracao-31.jpg",
    gallery: [
      {
        src: "/images/acervo/03-casamento/Decoracao-31.jpg",
        caption: "Nave monumental com lustres de cristal e mesas de banquete",
      },
      {
        src: "/images/dunia/salao-principal.jpg",
        caption: "Vão livre sem pilares: visão total do palco e pista de dança",
      },
      {
        src: "/images/acervo/11-servicos/salao-de-festa/salao-01.jpg",
        caption: "Espaço Cristal modulado para jantares de gala e recepções",
      },
      {
        src: "/images/acervo/11-servicos/salao-de-festa/salao-04.jpg",
        caption: "Iluminação cênica computadorizada com dimerização suave",
      },
    ],
  },
  {
    id: "jardim-integrado",
    number: "03",
    name: "Jardim Integrado",
    shortDesc: "Área verde privativa para cerimônias ao pôr do sol e coquetéis ao ar livre.",
    fullDesc:
      "450 m² de paisagismo maduro preservado no coração do Lago Sul. Com espelho d'água cristalino onde é possível montar passarela transparente de cortejo, palmeiras imperiais iluminadas cenicamente e pergolados para celebrações ao ar livre conectadas aos salões climatizados.",
    badge: "NATUREZA NO LAGO SUL",
    specs: ["450 m² ao ar livre", "Espelho d'água cristalino", "Passarela sobre as águas", "Iluminação de árvores"],
    icon: Trees,
    image: "/images/acervo/09-jardim/dunia-20-08-36-of-36.jpg",
    gallery: [
      {
        src: "/images/acervo/09-jardim/dunia-20-08-36-of-36.jpg",
        caption: "Jardim Imperial com espelho d'água sob o céu de Brasília",
      },
      {
        src: "/images/acervo/09-jardim/Dunia-24-06-23-144.jpg",
        caption: "Área de coquetel externo integrada à varanda envidraçada",
      },
      {
        src: "/images/acervo/09-jardim/Dunia-24-06-23-145.jpg",
        caption: "Pergolado e palmeiras iluminadas ao entardecer",
      },
    ],
  },
  {
    id: "guarita-valet",
    number: "04",
    name: "Guarita & Vallet",
    shortDesc: "Acesso privativo com guarita, controle de segurança e estacionamento valet.",
    fullDesc:
      "Chegada triunfal com porte-cochère coberta que protege os anfitriões e convidados de qualquer chuva ou sol intenso. Guarita blindada com cancela privativa para controle rigoroso de acessos de autoridades e celebridades, além de amplo pátio com equipe de valet e monitoramento por CFTV 24 horas.",
    badge: "SEGURANÇA & DISTINÇÃO",
    specs: ["Porte-cochère coberta", "Guarita de segurança blindada", "Estacionamento privativo", "Valet simultâneo"],
    icon: Shield,
    image: "/images/acervo/13-institucionais/20211002_171118.jpg",
    gallery: [
      {
        src: "/images/acervo/13-institucionais/20211002_171118.jpg",
        caption: "Entrada monumental com porte-cochère para desembarque VIP",
      },
      {
        src: "/images/acervo/13-institucionais/dunia-20-08-17-of-36-1-scaled.jpg",
        caption: "Foyer nobre de recepção com acabamentos em mármore",
      },
    ],
  },
]

export default function CenografiaSpacesInteractive() {
  const [activeSpaceId, setActiveSpaceId] = useState<string>("espaco-noiva")
  const [modalOpen, setModalOpen] = useState(false)
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0)

  const activeSpace =
    CENOGRAFIA_SPACES.find((s) => s.id === activeSpaceId) || CENOGRAFIA_SPACES[0]

  const openModal = (index: number = 0) => {
    setModalPhotoIndex(index)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* 1. SELETOR DE ESPAÇOS: 4 CARDS INTERATIVOS (HOVER OU CLIQUE) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CENOGRAFIA_SPACES.map((space) => {
          const isActive = space.id === activeSpaceId
          const Icon = space.icon

          return (
            <div
              key={space.id}
              onMouseEnter={() => setActiveSpaceId(space.id)}
              onClick={() => setActiveSpaceId(space.id)}
              className={`group cursor-pointer rounded-2xl border p-5 sm:p-6 transition-all duration-300 text-left relative overflow-hidden ${
                isActive
                  ? "bg-[#181512] border-[#D3B47C] shadow-[0_12px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(211,180,124,0.18)] translate-y-[-2px]"
                  : "bg-[#141210]/90 border-white/10 hover:border-white/25 hover:bg-[#161311]"
              }`}
            >
              {/* Barra indicadora superior */}
              <div
                className={`absolute top-0 inset-x-0 h-1 transition-all duration-300 ${
                  isActive ? "bg-gradient-to-r from-[#D3B47C] to-[#E2C799]" : "bg-transparent group-hover:bg-white/20"
                }`}
              />

              <div className="flex items-center justify-between">
                <span
                  className={`font-serif text-2xl font-light transition-colors ${
                    isActive ? "text-[#D3B47C] font-normal" : "text-[#D3B47C]/60 group-hover:text-[#D3B47C]"
                  }`}
                >
                  {space.number}
                </span>

                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#D3B47C] text-[#120F0D]"
                      : "bg-white/5 text-[#ABA29A] group-hover:text-[#D3B47C] group-hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              <h3 className="mt-3 font-serif text-lg text-white group-hover:text-[#D3B47C] transition">
                {space.name}
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-[#ABA29A] line-clamp-2">
                {space.shortDesc}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                <span
                  className={`text-[0.68rem] font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                    isActive ? "text-[#D3B47C]" : "text-white/60 group-hover:text-white"
                  }`}
                >
                  <span>{isActive ? "Visualizando" : "Ver Espaço"}</span>
                  <ArrowRight className={`h-3 w-3 transition-transform ${isActive ? "translate-x-1" : "group-hover:translate-x-1"}`} />
                </span>

                {isActive && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D3B47C] animate-pulse" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 2. VITRINE VISUAL INTERATIVA DO ESPAÇO SELECIONADO */}
      <div className="overflow-hidden rounded-3xl border border-[#D3B47C]/30 bg-[#161311] shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* LADO DA FOTO: IMAGEM REAL EM ALTA RESOLUÇÃO COM BADGE & ZOOM */}
          <div
            onClick={() => openModal(0)}
            className="group relative lg:col-span-7 aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto lg:min-h-[460px] overflow-hidden bg-black cursor-pointer"
          >
            <Image
              src={activeSpace.image}
              alt={activeSpace.name}
              fill
              priority
              className="object-cover object-center filter brightness-[0.94] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-transparent to-black/30 opacity-70 group-hover:opacity-50 transition-opacity" />

            {/* Selo do Espaço */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-3.5 py-1.5 backdrop-blur-md">
              <span className="font-serif text-xs font-semibold text-[#D3B47C]">
                {activeSpace.number}
              </span>
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-white">
                {activeSpace.badge}
              </span>
            </div>

            {/* Botão Hover de Ampliar Fotos */}
            <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
              <div className="flex items-center gap-2 rounded-full bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#120F0D] shadow-2xl transition hover:scale-105">
                <Maximize2 className="h-4 w-4" />
                <span>Ampliar Fotos ({activeSpace.gallery.length})</span>
              </div>
            </div>

            {/* Rodapé da Foto com Legenda */}
            <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between text-xs text-white/80">
              <span className="bg-black/60 px-3 py-1 rounded-md backdrop-blur-sm text-[0.7rem] line-clamp-1 border border-white/10">
                {activeSpace.gallery[0]?.caption || activeSpace.name}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[0.68rem] text-[#D3B47C] font-semibold bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
                <Maximize2 className="h-3 w-3" /> Clique para expandir
              </span>
            </div>
          </div>

          {/* LADO DAS ESPECIFICAÇÕES & EXPERIÊNCIA DO ESPAÇO */}
          <div className="lg:col-span-5 p-6 sm:p-8 lg:p-9 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#D3B47C]" />
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                  {activeSpace.badge}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white">
                {activeSpace.name}
              </h3>

              <p className="text-xs sm:text-sm leading-relaxed text-[#DFD5CA] font-sans">
                {activeSpace.fullDesc}
              </p>

              {/* Destaques Técnicos do Espaço */}
              <div className="pt-2">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#ABA29A] block mb-2.5">
                  Destaques de Infraestrutura
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeSpace.specs.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/90"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D3B47C] shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Galeria de Thumbnails para Troca Rápida */}
              <div className="pt-3">
                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#ABA29A] block mb-2">
                  Ângulos do Espaço
                </span>
                <div className="flex gap-2">
                  {activeSpace.gallery.map((g, idx) => (
                    <button
                      key={idx}
                      onClick={() => openModal(idx)}
                      className="group/thumb relative h-14 w-20 overflow-hidden rounded-lg border border-white/20 hover:border-[#D3B47C] transition focus:outline-none"
                    >
                      <Image
                        src={g.src}
                        alt={g.caption}
                        fill
                        className="object-cover transition-transform group-hover/thumb:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Ações: Ver Fotos Expandidas & Tour 360 */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => openModal(0)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#D3B47C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-[#120F0D] transition hover:bg-[#E2C799] shadow-lg"
              >
                <Maximize2 className="h-4 w-4" />
                <span>Ver Fotos ({activeSpace.gallery.length})</span>
              </button>

              <Link
                href="/sobre#tour360"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:border-[#D3B47C] hover:bg-white/[0.08] transition"
              >
                <Compass className="h-4 w-4 text-[#D3B47C]" />
                <span>Tour 360°</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MODAL LIGHTBOX EM ALTA RESOLUÇÃO PARA VISUALIZAÇÃO COMPLETA */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 sm:p-8 backdrop-blur-xl animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative flex flex-col w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-3xl border border-[#D3B47C]/40 bg-[#120F0D] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topbar do Modal */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#141210]">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg text-[#D3B47C]">
                  {activeSpace.number}
                </span>
                <div>
                  <h4 className="font-serif text-base sm:text-lg text-white font-normal">
                    {activeSpace.name}
                  </h4>
                  <p className="text-[0.68rem] text-[#ABA29A] hidden sm:block">
                    {activeSpace.gallery[modalPhotoIndex]?.caption}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/60 mr-2">
                  {modalPhotoIndex + 1} / {activeSpace.gallery.length}
                </span>
                <button
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white transition"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Imagem Principal do Modal */}
            <div className="relative flex-1 min-h-[350px] sm:min-h-[500px] bg-black flex items-center justify-center">
              <Image
                src={activeSpace.gallery[modalPhotoIndex]?.src || activeSpace.image}
                alt={activeSpace.gallery[modalPhotoIndex]?.caption || activeSpace.name}
                fill
                className="object-contain"
                priority
              />

              {/* Botões Anterior / Próximo */}
              {activeSpace.gallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setModalPhotoIndex((prev) =>
                        prev > 0 ? prev - 1 : activeSpace.gallery.length - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md hover:bg-[#D3B47C] hover:text-[#120F0D] transition"
                    aria-label="Foto anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() =>
                      setModalPhotoIndex((prev) =>
                        prev < activeSpace.gallery.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md hover:bg-[#D3B47C] hover:text-[#120F0D] transition"
                    aria-label="Próxima foto"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Rodapé com Thumbnails e Navegação Direta */}
            <div className="border-t border-white/10 p-4 bg-[#141210] flex items-center justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto py-1">
                {activeSpace.gallery.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => setModalPhotoIndex(idx)}
                    className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      modalPhotoIndex === idx
                        ? "border-[#D3B47C] scale-105"
                        : "border-white/15 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={g.src} alt={g.caption} fill className="object-cover" />
                  </button>
                ))}
              </div>

              <Link
                href="/sobre"
                className="shrink-0 flex items-center gap-1.5 text-xs text-[#D3B47C] font-semibold hover:underline"
              >
                <span>Conhecer todos os 2.500 m²</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
