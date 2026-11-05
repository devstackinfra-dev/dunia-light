"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
  Grid,
  Film,
  Camera,
  Play,
  Pause,
  Heart,
  Hand,
} from "lucide-react"
import { ALL_PHOTOS, GALLERY_CATEGORIES, GalleryPhoto } from "@/config/gallery-data"

interface DuniaGalleryViewerProps {
  initialCategory?: string
  title?: string
  subtitle?: string
  description?: string
  showFilmReel?: boolean
  itemsPerPage?: number
  limit?: number
  scrollSpeed?: number
}

// 5 Categorias principais como no mockup de referência
const PRIMARY_CATEGORY_IDS = ["all", "casamento", "corporativo", "debutante", "buffet"]

export default function DuniaGalleryViewer({
  initialCategory = "all",
  title = "O tempo passa. As boas histórias ficam.",
  subtitle = "MEMÓRIAS DO DÚNIA · ACERVO FOTOGRÁFICO",
  description = "Reviva encontros, celebrações e momentos especiais que fizeram parte da nossa história.",
  showFilmReel = true,
  itemsPerPage = 12,
  limit,
  scrollSpeed = 10,
}: DuniaGalleryViewerProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [viewMode, setViewMode] = useState<"reel" | "grid">(showFilmReel ? "reel" : "grid")
  const [visibleCount, setVisibleCount] = useState<number>(itemsPerPage)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  
  // Movimento automático desativado por padrão (navegação manual como protagonista)
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(false)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false)
  const [customPhotos, setCustomPhotos] = useState<any[]>([])

  // Estado dos favoritos (corações nos cards)
  const [likedPhotos, setLikedPhotos] = useState<Record<string, boolean>>({})

  // Indicador de Progresso (5 pontos de paginação como no mockup)
  const [activeDotIndex, setActiveDotIndex] = useState<number>(0)

  // Controle de Arraste Manual com Mouse
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [scrollLeftState, setScrollLeftState] = useState<number>(0)
  const [dragDistance, setDragDistance] = useState<number>(0)

  const filmTrackRef = useRef<HTMLDivElement>(null)
  const thumbnailTrackRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const load = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("dunia-custom-gallery-photos-v1")
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed)) setCustomPhotos(parsed)
          } catch {}
        }
      }
    }
    load()
    window.addEventListener("dunia-gallery-change", load)
    return () => window.removeEventListener("dunia-gallery-change", load)
  }, [])

  const allCombinedPhotos = [...customPhotos, ...ALL_PHOTOS]

  // Categorias com contagens atualizadas
  const categoriesWithCounts = GALLERY_CATEGORIES.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? allCombinedPhotos.length
        : allCombinedPhotos.filter((p) => p.category === cat.id).length,
  }))

  const primaryCategories = categoriesWithCounts.filter((c) =>
    PRIMARY_CATEGORY_IDS.includes(c.id)
  )
  const moreCategories = categoriesWithCounts.filter(
    (c) => !PRIMARY_CATEGORY_IDS.includes(c.id)
  )

  const isMoreCategoryActive = moreCategories.some((c) => c.id === activeCategory)
  const activeMoreCategory = moreCategories.find((c) => c.id === activeCategory)

  // Filtragem
  const filteredPhotos =
    activeCategory === "all"
      ? allCombinedPhotos
      : allCombinedPhotos.filter((p) => p.category === activeCategory)

  const displayPhotos = limit
    ? filteredPhotos.slice(0, limit)
    : filteredPhotos.slice(0, visibleCount)
  const hasMore = !limit && visibleCount < filteredPhotos.length

  // Rolar esteira 35mm manualmente com setas
  const scrollFilm = (direction: "left" | "right") => {
    if (!filmTrackRef.current) return
    const scrollAmount = 400
    filmTrackRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    })
  }

  // Atualizar dot de paginação ativo ao rolar
  const handleScroll = useCallback(() => {
    const track = filmTrackRef.current
    if (!track) return
    const maxScroll = track.scrollWidth - track.clientWidth
    if (maxScroll <= 0) {
      setActiveDotIndex(0)
      return
    }
    const ratio = track.scrollLeft / maxScroll
    const dot = Math.min(4, Math.max(0, Math.round(ratio * 4)))
    setActiveDotIndex(dot)
  }, [])

  // Clicar em um ponto para navegar diretamente
  const scrollToDot = (dotIndex: number) => {
    const track = filmTrackRef.current
    if (!track) return
    const maxScroll = track.scrollWidth - track.clientWidth
    track.scrollTo({
      left: maxScroll * (dotIndex / 4),
      behavior: "smooth",
    })
  }

  // Handlers para Arraste Manual com Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!filmTrackRef.current) return
    setIsDragging(true)
    setDragDistance(0)
    setStartX(e.pageX - filmTrackRef.current.offsetLeft)
    setScrollLeftState(filmTrackRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !filmTrackRef.current) return
    e.preventDefault()
    const x = e.pageX - filmTrackRef.current.offsetLeft
    const distance = x - startX
    setDragDistance(Math.abs(distance))
    filmTrackRef.current.scrollLeft = scrollLeftState - distance * 1.3
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Alternar favorito de uma foto
  const toggleLike = (e: React.MouseEvent, photoId: string | number) => {
    e.stopPropagation()
    setLikedPhotos((prev) => ({
      ...prev,
      [photoId]: !prev[photoId],
    }))
  }

  // Auto-scroll contínuo quando ativado explicitamente pelo botão Auto
  useEffect(() => {
    if (viewMode !== "reel" || !isAutoScrolling || isHovered || isDragging || selectedPhotoIndex !== null) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      return
    }

    const track = filmTrackRef.current
    if (!track) return

    let lastTime = performance.now()
    const speed = scrollSpeed

    const step = (now: number) => {
      const delta = (now - lastTime) / 1000
      lastTime = now

      if (track) {
        track.scrollLeft += speed * delta
        const halfWidth = track.scrollWidth / 2
        if (halfWidth > 0 && track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth
        }
        handleScroll()
      }

      animFrameRef.current = requestAnimationFrame(step)
    }

    animFrameRef.current = requestAnimationFrame(step)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }
  }, [viewMode, isAutoScrolling, isHovered, isDragging, selectedPhotoIndex, activeCategory, scrollSpeed, handleScroll])

  // Teclado no Lightbox
  useEffect(() => {
    if (selectedPhotoIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhotoIndex(null)
      } else if (e.key === "ArrowLeft") {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev > 0 ? prev - 1 : filteredPhotos.length - 1) : null
        )
      } else if (e.key === "ArrowRight") {
        setSelectedPhotoIndex((prev) =>
          prev !== null ? (prev < filteredPhotos.length - 1 ? prev + 1 : 0) : null
        )
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedPhotoIndex, filteredPhotos.length])

  // Auto-scroll da fita de miniaturas para manter o quadro ativo visível
  useEffect(() => {
    if (selectedPhotoIndex === null || !thumbnailTrackRef.current) return
    const activeThumb = thumbnailTrackRef.current.children[selectedPhotoIndex] as HTMLElement
    if (activeThumb) {
      activeThumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [selectedPhotoIndex])

  const totalPhotos = filteredPhotos.length
  const currentIndex = selectedPhotoIndex !== null ? selectedPhotoIndex : 0
  const currentPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null

  const prevIndex =
    selectedPhotoIndex !== null && totalPhotos > 1
      ? selectedPhotoIndex > 0
        ? selectedPhotoIndex - 1
        : totalPhotos - 1
      : null

  const nextIndex =
    selectedPhotoIndex !== null && totalPhotos > 1
      ? selectedPhotoIndex < totalPhotos - 1
        ? selectedPhotoIndex + 1
        : 0
      : null

  const prevPhoto = prevIndex !== null ? filteredPhotos[prevIndex] : null
  const nextPhoto = nextIndex !== null ? filteredPhotos[nextIndex] : null

  return (
    <section
      id="film"
      className="my-16 rounded-[2.2rem] border border-[#D7B78D]/30 bg-gradient-to-b from-[#211813] via-[#1C1410] to-[#160E0A] p-6 sm:p-10 lg:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.6)] relative overflow-hidden"
    >
      {/* Halo de iluminação dourada e bokeh no topo direito (como no mockup) */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-[420px] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(215,183,141,0.18),transparent_65%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 w-[500px] h-[250px] bg-[radial-gradient(ellipse_at_center,rgba(116,31,50,0.08),transparent_70%)] blur-3xl" />

      {/* 1. CABEÇALHO EXATAMENTE COMO NO MOCKUP */}
      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between pb-7">
        {/* Lado Esquerdo: Identificação Editorial e Título Poético */}
        <div className="space-y-2.5 max-w-2xl text-left">
          <span className="text-[0.66rem] font-bold uppercase tracking-[0.26em] text-[#BD9463] block">
            {subtitle}
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-[2.75rem] text-white font-normal leading-[1.12]">
            O tempo passa. <em className="italic text-[#E8D4BF] font-normal">As boas histórias ficam.</em>
          </h2>
          <p className="text-xs sm:text-sm text-[#ABA29A] leading-relaxed max-w-xl">
            {description}
          </p>
          <div className="pt-1.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#D7B78D]/40 bg-white/[0.04] px-3.5 py-1 text-[0.7rem] font-medium text-[#BD9463] backdrop-blur-sm shadow-sm">
              <Camera className="h-3.5 w-3.5 text-[#BD9463]" />
              <span>{allCombinedPhotos.length} fotografias no acervo</span>
            </span>
          </div>
        </div>

        {/* Lado Direito: Switcher (Linha 1) e Controles de Navegação (Linha 2) */}
        <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
          {/* Linha 1: Seletor Segmentado [ Película | Mosaico ] */}
          <div className="inline-flex items-center rounded-2xl border border-white/10 bg-black/40 p-1 shadow-inner backdrop-blur-sm">
            {showFilmReel && (
              <button
                onClick={() => setViewMode("reel")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wider transition ${
                  viewMode === "reel"
                    ? "bg-[#E8D4BF] text-[#211813] font-bold shadow-md"
                    : "text-[#ABA29A] hover:text-white"
                }`}
                aria-label="Visualização em Película"
              >
                <Film className="h-3.5 w-3.5" />
                <span>Película</span>
              </button>
            )}

            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold tracking-wider transition ${
                viewMode === "grid"
                  ? "bg-[#E8D4BF] text-[#211813] font-bold shadow-md"
                  : "text-[#ABA29A] hover:text-white"
              }`}
              aria-label="Visualização em Mosaico"
            >
              <Grid className="h-3.5 w-3.5" />
              <span>Mosaico</span>
            </button>
          </div>

          {/* Linha 2: Setas Circulares < > e Botão Auto */}
          {viewMode === "reel" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => scrollFilm("left")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/90 hover:border-[#BD9463] hover:bg-[#BD9463] hover:text-[#211813] transition shadow-sm"
                aria-label="Rolar acervo para esquerda"
                title="Foto anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollFilm("right")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white/90 hover:border-[#BD9463] hover:bg-[#BD9463] hover:text-[#211813] transition shadow-sm"
                aria-label="Rolar acervo para direita"
                title="Próxima foto"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              {/* Botão Pill [ ▷ Auto ] como no mockup */}
              <button
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wider transition shadow-sm ${
                  isAutoScrolling
                    ? "border-[#BD9463] bg-[#BD9463]/25 text-[#E8D4BF]"
                    : "border-white/20 bg-white/5 text-white/90 hover:border-[#BD9463] hover:text-[#E8D4BF]"
                }`}
                title={isAutoScrolling ? "Pausar movimento contínuo" : "Ativar movimento contínuo"}
                aria-label="Alternar reprodução automática"
              >
                {isAutoScrolling ? (
                  <>
                    <Pause className="h-3 w-3 text-[#BD9463]" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-current text-white/80" />
                    <span>Auto</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. BARRA DE FILTROS: 5 PRINCIPAIS + MAIS CATEGORIAS COMO NO MOCKUP */}
      <div className="relative z-10 flex flex-wrap items-center gap-2.5 pt-2 pb-6">
        {primaryCategories.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id)
                setVisibleCount(itemsPerPage)
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition flex items-center gap-2 whitespace-nowrap shadow-sm ${
                isActive
                  ? "bg-[#E8D4BF] text-[#211813] font-bold shadow-md"
                  : "border border-[#D7B78D]/30 bg-black/30 text-[#ABA29A] hover:text-white hover:border-[#D7B78D]/60"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[0.62rem] font-mono ${
                  isActive
                    ? "bg-[#211813]/25 text-[#211813] font-bold"
                    : "bg-white/10 text-[#ABA29A]"
                }`}
              >
                {cat.count}
              </span>
            </button>
          )
        })}

        {/* Botão Expansor "Mais categorias ⌵" */}
        <button
          onClick={() => setShowMoreCategories(!showMoreCategories)}
          className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wider transition flex items-center gap-1.5 whitespace-nowrap shadow-sm ${
            isMoreCategoryActive
              ? "border border-[#BD9463] bg-[#BD9463]/25 text-[#E8D4BF] font-bold"
              : "border border-[#D7B78D]/30 bg-black/30 text-[#ABA29A] hover:text-white hover:border-[#D7B78D]/60"
          }`}
          aria-expanded={showMoreCategories}
        >
          <span>
            {isMoreCategoryActive && activeMoreCategory
              ? `${activeMoreCategory.label} (${activeMoreCategory.count})`
              : "Mais categorias"}
          </span>
          {showMoreCategories ? (
            <ChevronUp className="h-3.5 w-3.5 text-[#BD9463]" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-[#BD9463]" />
          )}
        </button>
      </div>

      {/* Lista Expandida de "Mais Categorias" */}
      {showMoreCategories && (
        <div className="relative z-10 mb-6 flex flex-wrap gap-2 rounded-2xl border border-[#D7B78D]/30 bg-black/50 p-3.5 backdrop-blur-md animate-fadeIn shadow-xl">
          {moreCategories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setVisibleCount(itemsPerPage)
                }}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wider transition flex items-center gap-1.5 whitespace-nowrap ${
                  isActive
                    ? "bg-[#E8D4BF] text-[#211813] font-bold shadow"
                    : "border border-white/10 bg-white/5 text-[#ABA29A] hover:text-white hover:border-[#D7B78D]/50"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[0.62rem] font-mono ${
                    isActive
                      ? "bg-[#211813]/25 text-[#211813] font-bold"
                      : "bg-white/10 text-[#ABA29A]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* 3. MODO 1: A PELÍCULA 35MM CONTÍNUA COM TRILHOS E PERFURAÇÕES INTEGRADOS */}
      {viewMode === "reel" && (
        <div
          className="relative z-10 my-3 select-none"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setIsDragging(false)
          }}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsHovered(false), 2500)
          }}
        >
          {/* CONTAINER DA PELÍCULA CONTÍNUA (UNIFICADO NO MESMO TOM #120B08, ENCAIXE PRECISO COM O CARRETEL) */}
          <div className="relative flex items-stretch overflow-hidden rounded-[2rem] border border-[#BD9463]/40 bg-[#120B08] p-2.5 sm:p-3 lg:p-3.5 shadow-[0_25px_80px_rgba(0,0,0,0.85)]">
            
            {/* 1. CARRETEL 3D DÚNIA INTEGRADO NA ORIGEM (SEM FUNDO DIVERGENTE, MESMO TOM #120B08, ENCAIXE MILIMÉTRICO COM A PELÍCULA) */}
            <div className="hidden md:flex shrink-0 items-center justify-center pl-1.5 pr-2.5 relative z-20 select-none">
              <div className="relative w-[145px] sm:w-[155px] lg:w-[168px] xl:w-[178px] flex flex-col items-center justify-center">
                <Image
                  src="/images/dunia/dunia-film-canister.png"
                  alt="Carretel de Filme Dúnia City Hall"
                  width={178}
                  height={370}
                  priority
                  className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
                />
                <span className="mt-1.5 text-[0.56rem] font-mono uppercase tracking-[0.22em] text-[#BD9463] text-center font-bold">
                  ORIGEM • 35MM
                </span>
              </div>
            </div>

            {/* 2. O CARROSSEL DE FITA CONTÍNUA (TRILHOS, PERFURAÇÕES E FOTOGRAMAS NO MESMO TOM E ALINHADOS) */}
            <div
              ref={filmTrackRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className={`dunia-scrollbar flex-1 flex items-stretch overflow-x-auto bg-[#120B08] rounded-xl ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              style={{
                scrollSnapType: !isDragging && isHovered ? "x mandatory" : "none",
                willChange: "scroll-position",
              }}
            >
              {/* Líder de Película 35MM saindo direto do Carretel */}
              <div className="shrink-0 w-6 sm:w-8 lg:w-10 flex flex-col justify-between bg-gradient-to-r from-[#2B180E] to-[#140D0A] border-y border-[#BD9463]/40 border-r border-[#BD9463]/30 select-none">
                <div className="h-8 bg-[#2B180E] border-b border-[#BD9463]/40 flex items-center justify-center">
                  <span className="h-2.5 w-3 rounded-[2px] bg-[#120B08] border border-[#BD9463]/70 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)]" />
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <span className="font-mono text-[0.52rem] uppercase tracking-widest text-[#BD9463]/75 -rotate-90 font-bold">
                    START
                  </span>
                </div>
                <div className="h-8 bg-[#2B180E] border-t border-[#BD9463]/40 flex items-center justify-center">
                  <span className="h-2.5 w-3 rounded-[2px] bg-[#120B08] border border-[#BD9463]/70 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)]" />
                </div>
              </div>

              {/* FOTOGRAMAS CONTÍNUOS DA PELÍCULA */}
              {[...filteredPhotos.slice(0, 30), ...filteredPhotos.slice(0, 30)].map((photo, index) => {
                const originalIndex = index % Math.min(filteredPhotos.length, 30)
                const frameNum = String((originalIndex % 999) + 1).padStart(3, "0")
                const isLiked = !!likedPhotos[photo.id || originalIndex]

                return (
                  <div
                    key={`${photo.id || originalIndex}-${index}`}
                    className="flex items-stretch shrink-0"
                  >
                    {/* BLOCO DO FOTOGRAMA UNIFICADO COM TRILHOS E PERFURAÇÕES */}
                    <div
                      onClick={() => {
                        if (dragDistance < 6) {
                          setSelectedPhotoIndex(originalIndex)
                        }
                      }}
                      className="group relative w-[300px] sm:w-[360px] md:w-[390px] lg:w-[415px] shrink-0 cursor-pointer flex flex-col bg-[#140D0A] transition-all duration-300 hover:brightness-[1.03]"
                      style={{ scrollSnapAlign: "start" }}
                    >
                      {/* TRILHO SUPERIOR INTEGRADO COM PERFURAÇÕES QUE ROLAM COM A FITA */}
                      <div className="h-8 bg-gradient-to-r from-[#2F1A0F] via-[#482A18] to-[#2F1A0F] border-b border-[#BD9463]/40 flex items-center justify-between px-3 select-none">
                        {/* Marcador do Quadro */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="font-mono text-[0.62rem] sm:text-[0.68rem] font-bold text-[#BD9463] tracking-widest flex items-center gap-1">
                            <span>▶</span> {frameNum}
                          </span>
                          <span className="text-[0.52rem] sm:text-[0.58rem] font-mono text-[#D7B78D]/60 uppercase tracking-widest hidden sm:inline">
                            DÚNIA 35MM
                          </span>
                        </div>

                        {/* Furos de Perfuração (Sprocket Holes) */}
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          {Array.from({ length: 6 }).map((_, spIdx) => (
                            <span
                              key={spIdx}
                              className="h-2.5 sm:h-3 w-3.5 sm:w-4 rounded-[2px] bg-[#0A0503] border border-[#BD9463]/70 shadow-[inset_0_1px_3px_rgba(0,0,0,0.95),0_0_5px_rgba(215,183,141,0.35)] shrink-0"
                            />
                          ))}
                        </div>

                        {/* Marcação de Borda */}
                        <span className="text-[0.52rem] font-mono text-[#D7B78D]/50 uppercase tracking-wider shrink-0">
                          ISO 400
                        </span>
                      </div>

                      {/* ÁREA ÚTIL: FOTOGRAFIA EM DESTAQUE COM ENCAIXE PERFEITO */}
                      <div className="relative aspect-[16/9.5] w-full overflow-hidden bg-black">
                        <Image
                          src={photo.src}
                          alt={photo.title}
                          fill
                          sizes="(max-width: 640px) 340px, (max-width: 1024px) 470px, 510px"
                          className="object-cover transition duration-500 group-hover:scale-105 filter brightness-100 contrast-[1.02]"
                          loading="lazy"
                        />

                        {/* Gradiente Inferior para Alto Contraste da Legenda Integrada */}
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

                        {/* Botão de Ampliação no Hover */}
                        <div className="absolute top-3 right-3 rounded-xl bg-black/60 p-2 text-white/90 opacity-0 backdrop-blur-md transition group-hover:opacity-100 shadow-md">
                          <Maximize2 className="h-4 w-4" />
                        </div>

                        {/* Legenda Integrada sobre a Foto (Sem roubar espaço da área útil) */}
                        <div className="absolute bottom-2.5 inset-x-3 flex items-end justify-between gap-3 text-white">
                          <div className="space-y-0.5 truncate flex-1">
                            <span className="text-[0.62rem] sm:text-[0.66rem] font-bold uppercase tracking-[0.2em] text-[#BD9463] block truncate drop-shadow-sm">
                              {photo.label}
                            </span>
                            <h4 className="font-serif text-sm sm:text-base lg:text-[1.12rem] font-normal text-white group-hover:text-[#E8D4BF] transition truncate leading-snug drop-shadow-md">
                              {photo.title}
                            </h4>
                          </div>

                          {/* Botão de Favoritar (Coração) */}
                          <button
                            onClick={(e) => toggleLike(e, photo.id || originalIndex)}
                            className="shrink-0 p-1.5 text-[#BD9463] hover:scale-115 transition active:scale-95 drop-shadow-md"
                            title={isLiked ? "Remover dos favoritos" : "Salvar inspiração"}
                            aria-label="Favoritar foto"
                          >
                            <Heart
                              className={`h-4 w-4 sm:h-4.5 sm:w-4.5 transition-colors ${
                                isLiked ? "fill-[#BD9463] text-[#BD9463]" : "text-[#BD9463]/75 hover:text-[#BD9463]"
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* TRILHO INFERIOR INTEGRADO COM PERFURAÇÕES QUE ROLAM COM A FITA */}
                      <div className="h-8 bg-gradient-to-r from-[#2F1A0F] via-[#482A18] to-[#2F1A0F] border-t border-[#BD9463]/40 flex items-center justify-between px-3 select-none">
                        {/* Código do Fotograma Inferior */}
                        <span className="font-mono text-[0.58rem] sm:text-[0.62rem] text-[#BD9463]/80 tracking-widest shrink-0">
                          {frameNum}A
                        </span>

                        {/* Furos de Perfuração Inferiores */}
                        <div className="flex items-center gap-2 sm:gap-2.5">
                          {Array.from({ length: 6 }).map((_, spIdx) => (
                            <span
                              key={spIdx}
                              className="h-2.5 sm:h-3 w-3.5 sm:w-4 rounded-[2px] bg-[#0A0503] border border-[#BD9463]/70 shadow-[inset_0_1px_3px_rgba(0,0,0,0.95),0_0_5px_rgba(215,183,141,0.35)] shrink-0"
                            />
                          ))}
                        </div>

                        {/* Marca d'água de fita */}
                        <span className="text-[0.52rem] font-mono text-[#D7B78D]/50 uppercase tracking-widest shrink-0 hidden sm:inline">
                          SAFETY FILM
                        </span>
                      </div>
                    </div>

                    {/* DIVISOR DE QUADRO 35MM (Separação contínua entre fotogramas) */}
                    <div className="w-2.5 sm:w-3 bg-[#120B08] border-x border-[#BD9463]/30 shrink-0" />
                  </div>
                )
              })}
            </div>

          </div>

          {/* 4. BARRA DE STATUS INFERIOR: [ARRASTE] · [PAGINAÇÃO 5 PONTOS] · [AMPLIAR] */}
          <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#ABA29A] px-3">
            {/* Esquerda: Instrução de Arraste */}
            <div className="flex items-center gap-2 text-[0.72rem]">
              <Hand className="h-3.5 w-3.5 text-[#BD9463]" />
              <span>Arraste para explorar o acervo</span>
            </div>

            {/* Centro: 5 Pontos de Paginação como no mockup */}
            <div className="flex items-center gap-2.5">
              {[0, 1, 2, 3, 4].map((dot) => (
                <button
                  key={dot}
                  onClick={() => scrollToDot(dot)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeDotIndex === dot
                      ? "w-6 bg-[#BD9463] shadow-[0_0_8px_rgba(189,148,99,0.8)]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                  }`}
                  aria-label={`Ir para seção ${dot + 1} do rolo`}
                />
              ))}
            </div>

            {/* Direita: Instrução de Ampliação */}
            <div className="flex items-center gap-2 text-[0.72rem] text-white/80">
              <Maximize2 className="h-3.5 w-3.5 text-[#BD9463]" />
              <span>Clique em qualquer quadro para ampliar</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODO 2: MOSAICO / GRADE FOTOGRÁFICA EDITORIAL */}
      {viewMode === "grid" && (
        <div className="relative z-10 mt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#160E0A] shadow-lg transition duration-300 hover:border-[#BD9463] hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105 filter brightness-100 contrast-[1.02]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-white opacity-0 transition group-hover:opacity-100">
                    <span className="text-[0.62rem] font-bold uppercase tracking-wider text-[#BD9463] block">
                      {photo.label}
                    </span>
                    <span className="font-serif text-sm truncate block mt-0.5">{photo.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Carregamento Dinâmico no Modo Mosaico */}
          {hasMore && (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-8">
              <p className="text-xs text-[#ABA29A]">
                Exibindo <strong className="text-white">{displayPhotos.length}</strong> de{" "}
                <strong className="text-white">{filteredPhotos.length}</strong> fotografias
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 16)}
                  className="rounded-full bg-[#E8D4BF] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#211813] shadow-md transition hover:scale-105"
                >
                  Carregar Mais Fotos (+16)
                </button>
                <button
                  onClick={() => setVisibleCount(filteredPhotos.length)}
                  className="rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Carregar Todas ({filteredPhotos.length})
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. LIGHTBOX EM TELA CHEIA (AMPLIAÇÃO CINEMATOGRÁFICA) */}
      {selectedPhotoIndex !== null && currentPhoto && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-between bg-black/95 p-3 sm:p-5 backdrop-blur-xl overflow-hidden animate-fadeIn">
          {/* Topo do Lightbox */}
          <div className="flex w-full items-center justify-between border-b border-white/10 pb-3 px-2 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-md border border-[#D7B78D]/40 bg-[#BD9463]/15 px-2.5 py-1 text-[0.65rem] font-bold tracking-[0.2em] text-[#BD9463]">
                ACERVO HISTÓRICO
              </span>
              <span className="hidden sm:inline text-xs font-medium text-[#ABA29A]">
                {currentPhoto.label}
              </span>
            </div>

            <div className="text-center truncate px-2 max-w-[40vw]">
              <span className="font-serif text-sm sm:text-base text-white/90 truncate block">
                {currentPhoto.title}
              </span>
            </div>

            <button
              onClick={() => setSelectedPhotoIndex(null)}
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/15 hover:text-white transition"
              aria-label="Fechar ampliação (ESC)"
            >
              <span className="hidden sm:inline text-[0.7rem] uppercase tracking-wider text-[#ABA29A]">Fechar</span>
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Palco Central */}
          <div className="relative flex-1 flex flex-col items-center justify-center my-auto w-full max-w-7xl mx-auto py-2">
            <div className="relative w-full flex items-center justify-center gap-3 sm:gap-6 lg:gap-8 my-auto">
              {/* Seta Anterior */}
              <button
                onClick={() => prevIndex !== null && setSelectedPhotoIndex(prevIndex)}
                className="absolute left-2 sm:left-4 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/90 shadow-xl transition hover:border-[#BD9463] hover:bg-[#BD9463] hover:text-[#211813] hover:scale-105"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* Foto Principal Ampliada */}
              <div className="relative shrink-0 flex flex-col items-center justify-center w-full max-w-[92vw] sm:max-w-[62vw] lg:max-w-[760px] h-[56vh] sm:h-[66vh] max-h-[640px] rounded-2xl overflow-hidden border-2 border-[#D7B78D]/60 bg-[#0C0A09] shadow-[0_0_60px_rgba(215,183,141,0.25)] z-10 transition-all duration-300">
                <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                  <Image
                    src={currentPhoto.src}
                    alt={currentPhoto.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 95vw, 760px"
                    className="object-contain filter contrast-[1.02] select-none"
                  />
                  <div className="absolute top-3 left-3 rounded-lg bg-black/75 border border-[#D7B78D]/30 px-3 py-1 text-[0.68rem] font-mono text-[#BD9463] backdrop-blur-md">
                    ▶ {String((currentIndex % 999) + 1).padStart(3, "0")} • {currentPhoto.label}
                  </div>
                </div>
              </div>

              {/* Seta Próxima */}
              <button
                onClick={() => nextIndex !== null && setSelectedPhotoIndex(nextIndex)}
                className="absolute right-2 sm:right-4 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/90 shadow-xl transition hover:border-[#BD9463] hover:bg-[#BD9463] hover:text-[#211813] hover:scale-105"
                aria-label="Próxima foto"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Base: Miniaturas */}
          <div className="w-full max-w-5xl mx-auto border-t border-white/10 pt-2 px-2 sm:px-4">
            <div className="flex items-center justify-between text-xs text-[#ABA29A] pb-2">
              <div className="truncate">
                <span className="font-bold text-[#BD9463] uppercase tracking-wider mr-2">
                  {currentPhoto.label}
                </span>
                <span className="font-serif text-white text-sm sm:text-base">
                  {currentPhoto.title}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-white text-xs font-bold">
                  <span className="text-[#BD9463]">{currentIndex + 1}</span> / {totalPhotos}
                </div>
              </div>
            </div>

            <div
              ref={thumbnailTrackRef}
              className="dunia-scrollbar flex gap-2 overflow-x-auto py-1.5 pb-2"
              style={{ maxHeight: "74px" }}
            >
              {filteredPhotos.map((photo, idx) => (
                <button
                  key={photo.id || idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`relative shrink-0 h-12 w-16 sm:h-14 sm:w-20 rounded-lg overflow-hidden border transition-all duration-200 cursor-pointer ${
                    idx === currentIndex
                      ? "border-[#BD9463] ring-2 ring-[#BD9463]/50 opacity-100 scale-105 shadow-md"
                      : "border-white/10 opacity-35 hover:opacity-80"
                  }`}
                  title={photo.title}
                >
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                  {idx === currentIndex && (
                    <div className="absolute inset-0 bg-[#BD9463]/20 border-t-2 border-[#BD9463]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
