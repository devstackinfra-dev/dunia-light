"use client"

import { useState, useEffect } from "react"
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
  Eye,
} from "lucide-react"

export interface SpaceGalleryItem {
  src: string
  title: string
  caption: string
}

export interface SpaceItem {
  id: string
  number: string
  name: string
  shortDesc: string
  fullDesc: string
  badge: string
  specs: string[]
  icon: typeof Heart
  coverImage: string
  gallery: SpaceGalleryItem[]
}

const CENOGRAFIA_SPACES: SpaceItem[] = [
  {
    id: "espaco-noiva",
    number: "01",
    name: "Espaço da Noiva",
    shortDesc: "Camarim privativo climatizado com conforto térmico e espelho cenográfico.",
    fullDesc:
      "Um refúgio exclusivo de serenidade e requinte projetado para o dia da noiva e madrinhas. Conta com bancadas de maquiagem profissionais com iluminação de estúdio calibrada para foto e vídeo (3.200K a 5.600K), banheira de hidromassagem em mármore nobre, lounge privativo com bar de champanhe e porta de acesso secreta com saída direta à nave.",
    badge: "CAMARIM VIP PRIVATIVO",
    specs: ["80 m² privativos", "Banheira de hidromassagem", "Luz de estúdio calibrada", "Acesso secreto ao altar"],
    icon: Heart,
    coverImage: "/images/acervo/11-servicos/salao-de-festa/salao-02.jpg",
    gallery: [
      {
        src: "/images/acervo/11-servicos/salao-de-festa/salao-02.jpg",
        title: "Bancadas de Maquiagem & Espelho Cenográfico",
        caption: "Iluminação de estúdio profissional calibrada para fotografia e maquiagem de alta definição sem distorção de cores.",
      },
      {
        src: "/images/acervo/13-institucionais/salao-versao-03.jpg",
        title: "Lounge de Estar da Noiva & Madrinhas",
        caption: "Suíte privativa climatizada com sofás confortáveis, frigobar e bar de champanhe para relaxamento da família.",
      },
      {
        src: "/assets/casal.jpg",
        title: "Preparativos e Emoção Antes do Sim",
        caption: "Ambiente reservado e tranquilo para acolher a noiva e suas pessoas mais queridas no grande dia.",
      },
    ],
  },
  {
    id: "saloes-modulares",
    number: "02",
    name: "Salões Modulares",
    shortDesc: "Divisórias acústicas retráteis para receber de 100 até 1.200 convidados.",
    fullDesc:
      "Vão livre monumental de até 1.400 m² sem colunas para obstruir a vista dos convidados, com pé-direito duplo de 7 metros e pontos de rigging aéreo homologados para 500 kg cada. Suas divisórias retráteis acústicas alemãs (atenuação 48dB) permitem transformar o espaço em múltiplos ambientes simultâneos sem vazamento de som.",
    badge: "1.400 M² DE VÃO LIVRE",
    specs: ["100 a 1.200 convidados", "Pé-direito de 7 metros", "Divisórias acústicas 48dB", "Rigging aéreo 500 kg/ponto"],
    icon: Layers,
    coverImage: "/images/acervo/03-casamento/Decoracao-31.jpg",
    gallery: [
      {
        src: "/images/acervo/03-casamento/Decoracao-31.jpg",
        title: "Nave Monumental com Lustres Clássicos",
        caption: "Vão livre absoluto de 1.400 m² sem colunas centrais, proporcionando visão desobstruída do palco e altares.",
      },
      {
        src: "/images/dunia/salao-principal.jpg",
        title: "Salão Principal em Configuração de Banquete",
        caption: "Piso nobre polido de alta resistência e climatização central computadorizada de alta vazão.",
      },
      {
        src: "/images/acervo/11-servicos/salao-de-festa/salao-01.jpg",
        title: "Espaço Cristal Modulado",
        caption: "Ambiente elegante para mini-weddings, jantares íntimos ou celebrações corporativas de gala.",
      },
      {
        src: "/images/acervo/11-servicos/salao-de-festa/salao-04.jpg",
        title: "Iluminação Cênica Computadorizada",
        caption: "Controle setorizado de intensidade de luz com dimerização suave para transição de jantares para a balada.",
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
    specs: ["450 m² ao ar livre", "Espelho d'água cristalino", "Passarela sobre as águas", "Iluminação de palmeiras"],
    icon: Trees,
    coverImage: "/images/acervo/09-jardim/dunia-20-08-36-of-36.jpg",
    gallery: [
      {
        src: "/images/acervo/09-jardim/dunia-20-08-36-of-36.jpg",
        title: "Jardim Imperial & Espelho D'Água",
        caption: "Cenário ao ar livre com palmeiras e espelho d'água sob o céu inconfundível de Brasília.",
      },
      {
        src: "/images/acervo/09-jardim/Dunia-24-06-23-144.jpg",
        title: "Varanda Integrada ao Jardim",
        caption: "Portas pivotantes de vidro que conectam o conforto climatizado interno à brisa externa do cerrado.",
      },
      {
        src: "/images/acervo/09-jardim/Dunia-24-06-23-145.jpg",
        title: "Pergolado e Iluminação Noturna",
        caption: "Iluminação cênica nas copas das árvores que transforma o jardim em uma experiência cinematográfica à noite.",
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
    coverImage: "/images/acervo/13-institucionais/20211002_171118.jpg",
    gallery: [
      {
        src: "/images/acervo/13-institucionais/20211002_171118.jpg",
        title: "Porte-Cochère Coberta & Fachada Monumental",
        caption: "Desembarque VIP protegido da chuva e do sol, com acesso nivelado e acessibilidade total para todos os convidados.",
      },
      {
        src: "/images/acervo/13-institucionais/dunia-20-08-17-of-36-1-scaled.jpg",
        title: "Foyer Nobre de Recepção com Mármore",
        caption: "Hall de entrada de alto padrão com chapelaria climatizada, banheiros nobres e serviço ágil de manobristas.",
      },
    ],
  },
]

export default function CenografiaSpacesInteractive() {
  const [modalSpaceId, setModalSpaceId] = useState<string | null>(null)
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0)

  const activeModalSpace = CENOGRAFIA_SPACES.find((s) => s.id === modalSpaceId) || null

  const openSpaceModal = (spaceId: string, index: number = 0) => {
    setModalSpaceId(spaceId)
    setModalPhotoIndex(index)
  }

  const closeModal = () => {
    setModalSpaceId(null)
  }

  // Fechar com tecla Escape e navegar com setas
  useEffect(() => {
    if (!modalSpaceId || !activeModalSpace) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal()
      } else if (e.key === "ArrowLeft") {
        setModalPhotoIndex((prev) =>
          prev > 0 ? prev - 1 : activeModalSpace.gallery.length - 1
        )
      } else if (e.key === "ArrowRight") {
        setModalPhotoIndex((prev) =>
          prev < activeModalSpace.gallery.length - 1 ? prev + 1 : 0
        )
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [modalSpaceId, activeModalSpace])

  return (
    <div>
      {/* GRID COM OS 4 ESPAÇOS: FOTOGRAFIA REAL + HOVER INTERATIVO + CLIQUE PARA AMPLIAR */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {CENOGRAFIA_SPACES.map((space) => {
          return (
            <div
              key={space.id}
              onClick={() => openSpaceModal(space.id, 0)}
              className="group cursor-pointer rounded-2xl border border-[#5A1827]/12 bg-white p-3.5 sm:p-4 transition-all duration-500 hover:-translate-y-1.5 hover:border-[#5A1827]/50 hover:bg-[#FAF7F2] hover:shadow-[0_20px_45px_rgba(90,24,39,0.12)] flex flex-col justify-between text-left shadow-sm"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  openSpaceModal(space.id, 0)
                }
              }}
              aria-label={`Ver fotos e detalhes de ${space.name}`}
            >
              <div>
                {/* 1. FOTO REAL DO ESPAÇO COM ZOOM NO HOVER & BADGE */}
                <div className="relative aspect-[16/11] w-full overflow-hidden rounded-xl bg-black shadow-inner">
                  <Image
                    src={space.coverImage}
                    alt={space.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-center filter brightness-[0.92] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-108 group-hover:brightness-105"
                  />
                  {/* Gradiente sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                  {/* Número Dourado no Canto Superior Esquerdo da Foto */}
                  <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 rounded-lg border border-white/20 bg-black/70 px-2.5 py-1 backdrop-blur-md">
                    <span className="font-serif text-xs font-semibold text-[#C5A265]">
                      {space.number}
                    </span>
                    <span className="text-[0.6rem] font-bold uppercase tracking-wider text-white/80">
                      FOTOS
                    </span>
                  </div>

                  {/* Overlay Hover: "Ver Espaço" com efeito de vidro */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5A1827] px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-white shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                      <Eye className="h-3.5 w-3.5" />
                      <span>Ver {space.name.replace("Espaço da ", "")}</span>
                    </span>
                  </div>
                </div>

                {/* 2. TEXTO E IDENTIFICAÇÃO DO ESPAÇO */}
                <div className="pt-4 pb-2 px-1">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg font-semibold text-[#5A1827] group-hover:translate-x-0.5 transition-transform">
                      {space.number}
                    </span>
                    <span className="text-[0.6rem] font-semibold text-[#5A1827]/80 uppercase tracking-widest">
                      {space.gallery.length} fotos
                    </span>
                  </div>

                  <h3 className="mt-1 font-serif text-base sm:text-lg font-normal text-[#201215] group-hover:text-[#5A1827] transition-colors">
                    {space.name}
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-[#4A3E3D] line-clamp-2">
                    {space.shortDesc}
                  </p>
                </div>
              </div>

              {/* 3. BOTÃO DE AÇÃO NO RODAPÉ */}
              <div className="border-t border-[#5A1827]/10 pt-3 mt-2 px-1 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold uppercase tracking-wider text-[#5A1827] group-hover:text-[#732032] transition-colors">
                  <span>Explorar Espaço</span>
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#5A1827]/40 group-hover:bg-[#5A1827] transition-colors" />
              </div>
            </div>
          )
        })}
      </div>

      {/* MODAL LIGHTBOX EM TELA CHEIA (AO CLICAR EM QUALQUER ESPAÇO) */}
      {modalSpaceId && activeModalSpace && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-3 sm:p-6 backdrop-blur-xl animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative flex flex-col w-full max-w-5xl max-h-[94vh] overflow-hidden rounded-3xl border border-[#D3B47C]/40 bg-[#120F0D] shadow-[0_30px_90px_rgba(0,0,0,0.99)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Topbar do Modal */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-3.5 bg-[#141210]">
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg font-light text-[#D3B47C]">
                  {activeModalSpace.number}
                </span>
                <div>
                  <h4 className="font-serif text-base sm:text-xl text-white font-normal">
                    {activeModalSpace.name}
                  </h4>
                  <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C] block sm:inline sm:ml-2">
                    • {activeModalSpace.badge}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-white/60">
                  {modalPhotoIndex + 1} de {activeModalSpace.gallery.length}
                </span>
                <button
                  onClick={closeModal}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/80 hover:bg-white/20 hover:text-white transition"
                  aria-label="Fechar galeria"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Imagem Principal em Alta Resolução com Navegação */}
            <div className="relative flex-1 min-h-[320px] sm:min-h-[480px] bg-black flex items-center justify-center select-none">
              <Image
                src={activeModalSpace.gallery[modalPhotoIndex]?.src || activeModalSpace.coverImage}
                alt={activeModalSpace.gallery[modalPhotoIndex]?.title || activeModalSpace.name}
                fill
                className="object-contain"
                priority
              />

              {/* Botão Anterior */}
              {activeModalSpace.gallery.length > 1 && (
                <button
                  onClick={() =>
                    setModalPhotoIndex((prev) =>
                      prev > 0 ? prev - 1 : activeModalSpace.gallery.length - 1
                    )
                  }
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md hover:bg-[#D3B47C] hover:text-[#120F0D] hover:border-[#D3B47C] transition shadow-2xl"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="h-5 sm:h-6 w-5 sm:w-6" />
                </button>
              )}

              {/* Botão Próximo */}
              {activeModalSpace.gallery.length > 1 && (
                <button
                  onClick={() =>
                    setModalPhotoIndex((prev) =>
                      prev < activeModalSpace.gallery.length - 1 ? prev + 1 : 0
                    )
                  }
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/70 text-white backdrop-blur-md hover:bg-[#D3B47C] hover:text-[#120F0D] hover:border-[#D3B47C] transition shadow-2xl"
                  aria-label="Próxima foto"
                >
                  <ChevronRight className="h-5 sm:h-6 w-5 sm:w-6" />
                </button>
              )}
            </div>

            {/* Rodapé do Modal: Legenda da Foto Atual, Miniaturas e Ações */}
            <div className="border-t border-white/10 p-4 sm:p-5 bg-[#141210] space-y-3">
              {/* Informações da Foto */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h5 className="font-serif text-sm sm:text-base text-white">
                    {activeModalSpace.gallery[modalPhotoIndex]?.title}
                  </h5>
                  <p className="text-xs text-[#ABA29A] leading-relaxed">
                    {activeModalSpace.gallery[modalPhotoIndex]?.caption}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href="/sobre#tour360"
                    onClick={closeModal}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3 py-1.5 text-xs font-semibold text-[#D3B47C] hover:bg-[#D3B47C] hover:text-[#120F0D] transition"
                  >
                    <Compass className="h-3.5 w-3.5" />
                    <span>Ver no Tour 360°</span>
                  </Link>
                </div>
              </div>

              {/* Miniaturas das Fotos para Navegação Rápida */}
              <div className="flex items-center gap-2 overflow-x-auto pt-1">
                {activeModalSpace.gallery.map((g, idx) => (
                  <button
                    key={idx}
                    onClick={() => setModalPhotoIndex(idx)}
                    className={`relative h-12 w-16 sm:h-14 sm:w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                      modalPhotoIndex === idx
                        ? "border-[#D3B47C] scale-105 shadow-[0_0_12px_rgba(211,180,124,0.4)]"
                        : "border-white/15 opacity-60 hover:opacity-100 hover:border-white/40"
                    }`}
                  >
                    <Image src={g.src} alt={g.title} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
