"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Grid,
  Film,
  Sparkles,
  Download,
  Eye,
} from "lucide-react"
import { ALL_PHOTOS, GALLERY_CATEGORIES, GalleryPhoto } from "@/config/gallery-data"

interface DuniaGalleryViewerProps {
  initialCategory?: string
  title?: string
  subtitle?: string
  showFilmReel?: boolean
  itemsPerPage?: number
  limit?: number
}

export default function DuniaGalleryViewer({
  initialCategory = "all",
  title = "Não são fotos. São fragmentos de vidas.",
  subtitle = "ARQUIVO DE EMOÇÕES • DÚNIA CITY HALL",
  showFilmReel = true,
  itemsPerPage = 12,
  limit,
}: DuniaGalleryViewerProps) {
  const [activeCategory, setActiveCategory] = useState<string>(initialCategory)
  const [viewMode, setViewMode] = useState<"reel" | "grid">(showFilmReel ? "reel" : "grid")
  const [visibleCount, setVisibleCount] = useState<number>(itemsPerPage)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState<boolean>(true)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const filmTrackRef = useRef<HTMLDivElement>(null)
  const thumbnailTrackRef = useRef<HTMLDivElement>(null)
  const animFrameRef = useRef<number | null>(null)

  // Filtragem
  const filteredPhotos =
    activeCategory === "all"
      ? ALL_PHOTOS
      : ALL_PHOTOS.filter((p) => p.category === activeCategory)

  const displayPhotos = limit ? filteredPhotos.slice(0, limit) : filteredPhotos.slice(0, visibleCount)
  const hasMore = !limit && visibleCount < filteredPhotos.length

  // Rolar esteira 35mm manualmente
  const scrollFilm = (direction: "left" | "right") => {
    if (!filmTrackRef.current) return
    const scrollAmount = 360
    filmTrackRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    })
  }

  // Auto-scroll contínuo e cinematográfico como carrossel de película 35mm (rodando bem devagar)
  useEffect(() => {
    if (viewMode !== "reel" || !isAutoScrolling || isHovered || selectedPhotoIndex !== null) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      return
    }

    const track = filmTrackRef.current
    if (!track) return

    let lastTime = performance.now()
    const speed = 32 // 32 pixels por segundo (movimento suave e cinematográfico)

    const step = (now: number) => {
      const delta = (now - lastTime) / 1000
      lastTime = now

      if (track) {
        track.scrollLeft += speed * delta

        // Loop infinito contínuo quando atinge a metade da fita duplicada
        const halfWidth = track.scrollWidth / 2
        if (halfWidth > 0 && track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth
        }
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
  }, [viewMode, isAutoScrolling, isHovered, selectedPhotoIndex, activeCategory])

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

  // Variáveis para o Rolo de Filme do Lightbox (Anterior, Atual, Próximo)
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
    <section id="film" className="my-14 rounded-3xl border border-white/10 bg-[#0C0A09] p-5 sm:p-8 lg:p-10 shadow-2xl">
      {/* CABEÇALHO DA GALERIA */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
            {subtitle}
          </span>
          <h2 className="mt-1 font-serif text-2xl text-white sm:text-4xl">
            {title}
          </h2>
          <p className="mt-1 text-xs text-[#ABA29A]">
            Acervo oficial com {ALL_PHOTOS.length} fotografias do Dúnia City Hall
          </p>
        </div>

        {/* Alternador de Modo de Visualização */}
        <div className="flex items-center gap-2">
          {showFilmReel && (
            <button
              onClick={() => setViewMode("reel")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wider transition ${
                viewMode === "reel"
                  ? "bg-[#D3B47C] text-[#100E0D] shadow"
                  : "border border-white/10 bg-white/5 text-[#ABA29A] hover:text-white"
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              <span>Película 35mm</span>
            </button>
          )}

          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold tracking-wider transition ${
              viewMode === "grid"
                ? "bg-[#D3B47C] text-[#100E0D] shadow"
                : "border border-white/10 bg-white/5 text-[#ABA29A] hover:text-white"
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>Mosaico</span>
          </button>

          {viewMode === "reel" && (
            <div className="ml-2 flex items-center gap-1.5">
              <button
                onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold tracking-wider transition ${
                  isAutoScrolling
                    ? "border-[#D3B47C]/40 bg-[#D3B47C]/10 text-[#D3B47C]"
                    : "border-white/10 bg-white/5 text-[#ABA29A] hover:text-white"
                }`}
                title={isAutoScrolling ? "Pausar carrossel automático" : "Iniciar carrossel automático"}
                aria-label={isAutoScrolling ? "Pausar carrossel" : "Iniciar carrossel"}
              >
                {isAutoScrolling ? (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-[#D3B47C] animate-pulse" />
                    <span className="hidden sm:inline text-[0.68rem]">Auto 35mm</span>
                  </>
                ) : (
                  <>
                    <span className="inline-block h-2 w-2 rounded-full bg-white/40" />
                    <span className="hidden sm:inline text-[0.68rem]">Pausado</span>
                  </>
                )}
              </button>

              <button
                onClick={() => scrollFilm("left")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:border-[#D3B47C]"
                aria-label="Rolar para esquerda"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => scrollFilm("right")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:border-[#D3B47C]"
                aria-label="Rolar para direita"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BARRA DE FILTROS POR CATEGORIA */}
      <div className="mt-6 flex flex-wrap gap-2 overflow-x-auto pb-2 no-scrollbar">
        {GALLERY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id)
              setVisibleCount(itemsPerPage)
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wider transition flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === cat.id
                ? "bg-[#D3B47C] text-[#100E0D] shadow"
                : "border border-white/10 bg-white/5 text-[#ABA29A] hover:text-white hover:border-white/20"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[0.65rem] ${
                activeCategory === cat.id
                  ? "bg-[#100E0D]/20 text-[#100E0D]"
                  : "bg-white/10 text-[#ABA29A]"
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* MODO 1: PELÍCULA 35MM ANALÓGICA (CARROSSEL AUTOMÁTICO SUAVE) */}
      {viewMode === "reel" && (
        <div
          className="relative mt-8 overflow-hidden rounded-2xl border border-[#4B3824] bg-[#080706] p-4 sm:p-6 shadow-inner"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => {
            setTimeout(() => setIsHovered(false), 2500)
          }}
        >
          {/* Perfurações de Filme no Topo */}
          <div className="mb-4 flex justify-between overflow-hidden opacity-30 select-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="inline-block h-3 w-2 rounded-sm bg-[#D3B47C]" />
            ))}
          </div>

          {/* Trilho de Película com Scroll Suave Contínuo */}
          <div
            ref={filmTrackRef}
            className="dunia-scrollbar flex gap-5 overflow-x-auto pb-3 pt-1"
            style={{
              scrollSnapType: isHovered ? "x mandatory" : "none",
              willChange: "scroll-position",
            }}
          >
            {/* Duplicamos os frames para um looping contínuo infinito e sem saltos visuais */}
            {[...filteredPhotos.slice(0, 30), ...filteredPhotos.slice(0, 30)].map((photo, index) => {
              const originalIndex = index % Math.min(filteredPhotos.length, 30)
              return (
                <div
                  key={`${photo.id || originalIndex}-${index}`}
                  onClick={() => setSelectedPhotoIndex(originalIndex)}
                  className="group relative w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-xl border border-[#4B3824] bg-[#161311] shadow-xl transition-all duration-300 hover:border-[#D3B47C] hover:scale-[1.02] sm:w-[340px]"
                  style={{ scrollSnapAlign: "start" }}
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      fill
                      sizes="340px"
                      className="object-cover transition duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute top-2.5 right-2.5 rounded-lg bg-black/60 p-1.5 text-white/70 opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                      <Maximize2 className="h-3.5 w-3.5" />
                    </div>
                  </div>

                  <div className="p-3.5">
                    <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                      FRAME 0{String((originalIndex % 99) + 1).padStart(2, "0")} • {photo.label}
                    </span>
                    <h4 className="mt-1 font-serif text-sm font-normal text-white truncate">
                      {photo.title}
                    </h4>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Perfurações de Filme na Base */}
          <div className="mt-4 flex justify-between overflow-hidden opacity-30 select-none">
            {Array.from({ length: 30 }).map((_, i) => (
              <span key={i} className="inline-block h-3 w-2 rounded-sm bg-[#D3B47C]" />
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[0.7rem] text-[#ABA29A]">
            <span className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${isAutoScrolling && !isHovered ? "bg-[#D3B47C] animate-pulse" : "bg-white/30"}`} />
              <span>CARROSSEL 35MM CONTÍNUO • PASSE O MOUSE PARA PAUSAR E EXPLORAR</span>
            </span>
            <span className="hidden sm:inline">CLIQUE NO QUADRO PARA AMPLIAR EM ALTA RESOLUÇÃO ↗</span>
          </div>
        </div>
      )}

      {/* MODO 2: MOSAICO / GRADE FOTOGRÁFICA EDITORIAL */}
      {viewMode === "grid" && (
        <div className="mt-8">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayPhotos.map((photo, index) => (
              <div
                key={photo.id || index}
                onClick={() => setSelectedPhotoIndex(index)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#161311] shadow-lg transition duration-300 hover:border-[#D3B47C] hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs text-white opacity-0 transition group-hover:opacity-100">
                    <span className="text-[0.65rem] font-semibold text-[#D3B47C] uppercase tracking-wider block">
                      {photo.label}
                    </span>
                    <span className="font-serif text-sm truncate block">{photo.title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FERRAMENTA DE CARREGAMENTO DINÂMICO ("CARREGAR MAIS FOTOS") */}
          {hasMore && (
            <div className="mt-10 flex flex-col items-center justify-center gap-3 border-t border-white/10 pt-8">
              <p className="text-xs text-[#ABA29A]">
                Exibindo <strong className="text-white">{displayPhotos.length}</strong> de{" "}
                <strong className="text-white">{filteredPhotos.length}</strong> fotografias
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 16)}
                  className="rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
                >
                  Carregar Mais Fotos (+16)
                </button>
                <button
                  onClick={() => setVisibleCount(filteredPhotos.length)}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  Carregar Todas ({filteredPhotos.length})
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* LIGHTBOX / ZOOM MODAL EM TELA CHEIA - EXPERIÊNCIA ROLO DE FILME 35MM */}
      {selectedPhotoIndex !== null && currentPhoto && (
        <div className="fixed inset-0 z-[200] flex flex-col justify-between bg-black/95 p-3 sm:p-5 backdrop-blur-xl overflow-hidden animate-fadeIn">
          {/* TOPO: Identificação e Botão Fechar */}
          <div className="flex w-full items-center justify-between border-b border-white/10 pb-3 px-2 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="rounded-md border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                ROLO 35MM • NEGATIVO
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-[#ABA29A] uppercase tracking-wider">
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

          {/* PALCO CENTRAL: O ROLO DE FILME (ANTERIOR + PRINCIPAL + PRÓXIMO) */}
          <div className="relative flex-1 flex flex-col items-center justify-center my-auto w-full max-w-7xl mx-auto py-2">
            {/* Perfurações de Filme no Topo */}
            <div className="w-full flex items-center justify-between px-2 sm:px-6 py-1 opacity-25 select-none overflow-hidden max-w-5xl">
              {Array.from({ length: 36 }).map((_, i) => (
                <span key={i} className="inline-block h-2 w-1.5 rounded-[1px] bg-[#D3B47C] mx-0.5 shrink-0" />
              ))}
            </div>

            {/* Trilho de Quadros do Rolo */}
            <div className="relative w-full flex items-center justify-center gap-3 sm:gap-6 lg:gap-8 my-auto">
              {/* BOTÃO SETA ANTERIOR */}
              <button
                onClick={() => prevIndex !== null && setSelectedPhotoIndex(prevIndex)}
                className="absolute left-2 sm:left-4 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/90 shadow-xl transition hover:border-[#D3B47C] hover:bg-[#D3B47C] hover:text-[#100E0D] hover:scale-105"
                aria-label="Foto anterior"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              {/* FOTO ANTERIOR (Antes - mais fraca, efeito rolo de filme, clicável) */}
              {prevPhoto && prevIndex !== null && (
                <div
                  onClick={() => setSelectedPhotoIndex(prevIndex)}
                  className="group relative hidden md:flex flex-col items-center justify-center shrink-0 w-[16vw] lg:w-[20vw] max-w-[260px] h-[48vh] sm:h-[56vh] max-h-[500px] rounded-xl overflow-hidden border border-[#D3B47C]/25 bg-[#120F0D] opacity-30 hover:opacity-85 transition-all duration-300 scale-90 hover:scale-95 cursor-pointer filter brightness-70 hover:brightness-100 select-none shadow-xl"
                  title={`Ir para foto anterior: ${prevPhoto.title}`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={prevPhoto.src}
                      alt={prevPhoto.title}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 group-hover:from-black/60 group-hover:via-transparent transition" />

                    {/* Tag do Frame */}
                    <div className="absolute top-2.5 left-2.5 rounded bg-black/70 px-2 py-0.5 text-[0.6rem] font-mono text-[#D3B47C]">
                      FRAME 0{String((prevIndex % 99) + 1).padStart(2, "0")}
                    </div>

                    {/* Destaque ao passar mouse */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                      <ChevronLeft className="h-8 w-8 text-[#D3B47C] mb-1 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition" />
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C] line-clamp-1">
                        {prevPhoto.label}
                      </span>
                      <p className="font-serif text-xs text-white/80 line-clamp-2 mt-0.5">
                        {prevPhoto.title}
                      </p>
                      <span className="mt-2 text-[0.6rem] uppercase tracking-widest text-[#ABA29A] opacity-0 group-hover:opacity-100 transition">
                        ← Clique para ver
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* FOTO PRINCIPAL (Em Alto Destaque, iluminada, borda dourada elegante) */}
              <div className="relative shrink-0 flex flex-col items-center justify-center w-full max-w-[92vw] sm:max-w-[58vw] lg:max-w-[720px] h-[54vh] sm:h-[64vh] max-h-[600px] rounded-2xl overflow-hidden border-2 border-[#D3B47C]/70 bg-[#0C0A09] shadow-[0_0_60px_rgba(211,180,124,0.25)] z-10 transition-all duration-300">
                <div className="relative w-full h-full flex items-center justify-center bg-black/80">
                  <Image
                    src={currentPhoto.src}
                    alt={currentPhoto.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 95vw, 720px"
                    className="object-contain filter contrast-[1.03] select-none"
                  />
                  {/* Tag do Frame Destaque */}
                  <div className="absolute top-3 left-3 rounded-lg bg-black/80 border border-[#D3B47C]/40 px-2.5 py-1 text-[0.65rem] font-mono font-bold text-[#D3B47C] backdrop-blur-md">
                    FRAME 0{String((currentIndex % 99) + 1).padStart(2, "0")} • DESTAQUE
                  </div>
                </div>
              </div>

              {/* FOTO POSTERIOR (Depois - mais fraca, efeito rolo de filme, clicável) */}
              {nextPhoto && nextIndex !== null && (
                <div
                  onClick={() => setSelectedPhotoIndex(nextIndex)}
                  className="group relative hidden md:flex flex-col items-center justify-center shrink-0 w-[16vw] lg:w-[20vw] max-w-[260px] h-[48vh] sm:h-[56vh] max-h-[500px] rounded-xl overflow-hidden border border-[#D3B47C]/25 bg-[#120F0D] opacity-30 hover:opacity-85 transition-all duration-300 scale-90 hover:scale-95 cursor-pointer filter brightness-70 hover:brightness-100 select-none shadow-xl"
                  title={`Ir para próxima foto: ${nextPhoto.title}`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={nextPhoto.src}
                      alt={nextPhoto.title}
                      fill
                      sizes="260px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60 group-hover:from-black/60 group-hover:via-transparent transition" />

                    {/* Tag do Frame */}
                    <div className="absolute top-2.5 right-2.5 rounded bg-black/70 px-2 py-0.5 text-[0.6rem] font-mono text-[#D3B47C]">
                      FRAME 0{String((nextIndex % 99) + 1).padStart(2, "0")}
                    </div>

                    {/* Destaque ao passar mouse */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
                      <ChevronRight className="h-8 w-8 text-[#D3B47C] mb-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition" />
                      <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C] line-clamp-1">
                        {nextPhoto.label}
                      </span>
                      <p className="font-serif text-xs text-white/80 line-clamp-2 mt-0.5">
                        {nextPhoto.title}
                      </p>
                      <span className="mt-2 text-[0.6rem] uppercase tracking-widest text-[#ABA29A] opacity-0 group-hover:opacity-100 transition">
                        Clique para ver →
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* BOTÃO SETA PRÓXIMA */}
              <button
                onClick={() => nextIndex !== null && setSelectedPhotoIndex(nextIndex)}
                className="absolute right-2 sm:right-4 z-30 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/90 shadow-xl transition hover:border-[#D3B47C] hover:bg-[#D3B47C] hover:text-[#100E0D] hover:scale-105"
                aria-label="Próxima foto"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Perfurações de Filme na Base */}
            <div className="w-full flex items-center justify-between px-2 sm:px-6 py-1 opacity-25 select-none overflow-hidden max-w-5xl">
              {Array.from({ length: 36 }).map((_, i) => (
                <span key={i} className="inline-block h-2 w-1.5 rounded-[1px] bg-[#D3B47C] mx-0.5 shrink-0" />
              ))}
            </div>
          </div>

          {/* BASE: Legenda, Navegação e Mini-Rolo de Miniaturas */}
          <div className="w-full max-w-5xl mx-auto border-t border-white/10 pt-2 px-2 sm:px-4">
            <div className="flex items-center justify-between text-xs text-[#ABA29A] pb-2">
              <div className="truncate">
                <span className="font-bold text-[#D3B47C] uppercase tracking-widest mr-2">
                  {currentPhoto.label}
                </span>
                <span className="font-serif text-white text-sm sm:text-base">
                  {currentPhoto.title}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <span className="hidden md:inline text-[0.7rem] text-[#ABA29A]/80">
                  Use as setas ← → ou clique nas fotos laterais
                </span>
                <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-white text-xs font-bold">
                  <span className="text-[#D3B47C]">{currentIndex + 1}</span> / {totalPhotos}
                </div>
              </div>
            </div>

            {/* Mini-Rolo de Miniaturas (Thumbnails) Rolável */}
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
                      ? "border-[#D3B47C] ring-2 ring-[#D3B47C]/50 opacity-100 scale-105 shadow-md"
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
                    <div className="absolute inset-0 bg-[#D3B47C]/20 border-t-2 border-[#D3B47C]" />
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
