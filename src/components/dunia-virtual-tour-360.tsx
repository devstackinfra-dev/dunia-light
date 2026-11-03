"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import {
  Compass,
  Maximize2,
  Minimize2,
  RotateCcw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Info,
  X,
  Building,
  Eye,
} from "lucide-react"

export interface TourScene {
  id: string
  name: string
  tagline: string
  area: string
  capacity: string
  image: string
  thumbnail: string
  initialAngle: number
  hotspots: {
    id: string
    angle: number // 0 a 360 graus
    y: number // porcentagem vertical (ex: 35)
    title: string
    badge: string
    description: string
  }[]
}

const TOUR_SCENES: TourScene[] = [
  {
    id: "salao-imperial",
    name: "Salão Imperial — Nave Central",
    tagline: "Vão livre monumental de 2.500 m² sob o brilho de lustres clássicos de cristal",
    area: "2.500 m²",
    capacity: "Até 1.200 convidados",
    image: "/images/acervo/03-casamento/Decoracao-31.jpg",
    thumbnail: "/images/dunia/salao-principal.jpg",
    initialAngle: 45,
    hotspots: [
      {
        id: "hs-lustres",
        angle: 60,
        y: 28,
        title: "Lustres de Cristal Baccarat",
        badge: "CENOGRAFIA NOBRE",
        description: "Conjunto monumental de lustres clássicos com dimerização computadorizada suave para criar a transição perfeita do jantar para o baile.",
      },
      {
        id: "hs-pe-direito",
        angle: 150,
        y: 20,
        title: "Pé-Direito Duplo de 7 Metros",
        badge: "AMPLITUDE ESPACIAL",
        description: "Espaço aéreo generoso permitindo naves florais suspensas, cenografias tridimensionais monumentais e iluminação computadorizada móvel.",
      },
      {
        id: "hs-divisorias",
        angle: 240,
        y: 52,
        title: "Divisórias Acústicas Retráteis",
        badge: "MODULAÇÃO DINÂMICA",
        description: "Paredes móveis com isolamento acústico de 48dB que permitem subdividir o espaço para jantares de 100 convidados ou integrar para 1.200.",
      },
      {
        id: "hs-piso",
        angle: 320,
        y: 72,
        title: "Piso Nobre Polido",
        badge: "ACABAMENTO DE LUXO",
        description: "Superfície polida contínua de altíssima resistência e conforto térmico, ideal para dança, cortejos e passadeiras espelhadas.",
      },
    ],
  },
  {
    id: "espaco-cristal",
    name: "Espaço Cristal & Salão Modular B",
    tagline: "Ambiente sofisticado para jantares intimistas, casamentos civis e eventos corporativos",
    area: "850 m²",
    capacity: "100 a 450 convidados",
    image: "/images/acervo/11-servicos/salao-de-festa/salao-01.jpg",
    thumbnail: "/images/acervo/11-servicos/salao-de-festa/salao-01.jpg",
    initialAngle: 30,
    hotspots: [
      {
        id: "hs-som-cristal",
        angle: 80,
        y: 35,
        title: "Sonorização Setorizada High-End",
        badge: "ENGENHARIA ACÚSTICA",
        description: "Pressão sonora uniforme sem reflexões incômodas, perfeita para discursos solenes e apresentações musicais acústicas.",
      },
      {
        id: "hs-mesas-cristal",
        angle: 210,
        y: 60,
        title: "Layout de Mesas Redondas & Bistrôs",
        badge: "VERSATILIDADE",
        description: "Disposição ampla com circulação ergonômica planejada para garçons e equipes de cerimonial.",
      },
    ],
  },
  {
    id: "espaco-noiva",
    name: "Espaço da Noiva & Camarim Privativo",
    tagline: "80 m² de puro conforto térmico, hidromassagem e iluminação profissional de maquiagem",
    area: "80 m²",
    capacity: "Noiva, família e madrinhas",
    image: "/images/acervo/11-servicos/salao-de-festa/salao-02.jpg",
    thumbnail: "/images/acervo/11-servicos/salao-de-festa/salao-02.jpg",
    initialAngle: 0,
    hotspots: [
      {
        id: "hs-bancada-noiva",
        angle: 45,
        y: 45,
        title: "Bancada de Maquiagem & Luz Camarim",
        badge: "ILUMINAÇÃO PROFISSIONAL",
        description: "Espelhos cenográficos com temperatura de cor ajustável de 3.200K a 5.600K para fotos e maquiagem de alta definição sem distorções.",
      },
      {
        id: "hs-lounge-noiva",
        angle: 180,
        y: 55,
        title: "Lounge VIP & Bar Privativo",
        badge: "ACOLHIMENTO",
        description: "Sofás aveludados, adega climatizada para espumantes e tranquilidade absoluta antes da grande entrada.",
      },
      {
        id: "hs-acesso-altar",
        angle: 280,
        y: 40,
        title: "Acesso Direto e Discreto à Nave",
        badge: "EXCLUSIVIDADE",
        description: "Porta privativa que conecta o camarim diretamente ao foyer sem que nenhum convidado veja a noiva antes da marcha.",
      },
    ],
  },
  {
    id: "jardim-imperial",
    name: "Jardim Imperial & Espelho D'Água",
    tagline: "450 m² ao ar livre com palmeiras maduras, espelho d'água e brisa do Lago Sul",
    area: "450 m²",
    capacity: "Até 350 convidados ao ar livre",
    image: "/images/acervo/09-jardim/dunia-20-08-36-of-36.jpg",
    thumbnail: "/images/acervo/09-jardim/Dunia-24-06-23-144.jpg",
    initialAngle: 90,
    hotspots: [
      {
        id: "hs-espelho-agua",
        angle: 100,
        y: 65,
        title: "Espelho D'Água com Passarela de Vidro",
        badge: "CENÁRIO INESQUECÍVEL",
        description: "Reflexos deslumbrantes da iluminação cênica noturna e possibilidade de montagem de passarela flutuante para cortejos.",
      },
      {
        id: "hs-palmeiras",
        angle: 200,
        y: 35,
        title: "Paisagismo Maduro & Palmeiras Nobres",
        badge: "NATUREZA PRESERVADA",
        description: "Vegetação exuberante iluminada com uplighting dourado que emoldura cerimônias ao pôr do sol em Brasília.",
      },
      {
        id: "hs-lounge-externo",
        angle: 310,
        y: 58,
        title: "Lounge Externo de Coquetel",
        badge: "WELCOME DRINK",
        description: "Espaço perfeito para receber convidados com taças de champanhe e música acústica antes da abertura do salão principal.",
      },
    ],
  },
  {
    id: "foyer-fachada",
    name: "Foyer Monumental & Guarita Valet",
    tagline: "Entrada imponente com porte-cochère coberta, segurança e serviço de manobrista",
    area: "350 m²",
    capacity: "Fluxo contínuo com guarita privativa",
    image: "/images/acervo/13-institucionais/20211002_171118.jpg",
    thumbnail: "/images/acervo/13-institucionais/20211002_171118.jpg",
    initialAngle: 120,
    hotspots: [
      {
        id: "hs-guarita",
        angle: 80,
        y: 48,
        title: "Guarita de Segurança & Controle de Acesso",
        badge: "SEGURANÇA PRIVATIVA",
        description: "Controle blindado de entrada, cancela privativa e estrutura desenhada para a recepção de chefes de Estado e autoridades.",
      },
      {
        id: "hs-valet",
        angle: 220,
        y: 60,
        title: "Porte-Cochère & Valet Parking",
        badge: "CONFORTO CLIMÁTICO",
        description: "Desembarque totalmente coberto com equipe de até 15 manobristas simultâneos para conforto em qualquer clima.",
      },
    ],
  },
]

export default function DuniaVirtualTour360() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [rotationAngle, setRotationAngle] = useState(TOUR_SCENES[0].initialAngle)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startAngle, setStartAngle] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [activeHotspot, setActiveHotspot] = useState<TourScene["hotspots"][0] | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const currentScene = TOUR_SCENES[activeSceneIndex]

  // Auto-rotação contínua e suave
  useEffect(() => {
    if (!isAutoRotating || isDragging || activeHotspot) return

    const interval = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.15) % 360)
    }, 30)

    return () => clearInterval(interval)
  }, [isAutoRotating, isDragging, activeHotspot])

  // Troca de cena
  const handleSelectScene = (index: number) => {
    setActiveSceneIndex(index)
    setRotationAngle(TOUR_SCENES[index].initialAngle)
    setActiveHotspot(null)
    setZoomLevel(1)
  }

  // Mouse & Touch Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.clientX)
    setStartAngle(rotationAngle)
    setHasInteracted(true)
  }

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - startX
      const angleDelta = (deltaX / (containerRef.current?.clientWidth || 800)) * 180
      const newAngle = (startAngle - angleDelta + 360) % 360
      setRotationAngle(newAngle)
    },
    [isDragging, startX, startAngle]
  )

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
    setStartAngle(rotationAngle)
    setHasInteracted(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return
    const deltaX = e.touches[0].clientX - startX
    const angleDelta = (deltaX / (containerRef.current?.clientWidth || 400)) * 180
    const newAngle = (startAngle - angleDelta + 360) % 360
    setRotationAngle(newAngle)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  // Teclado (setas esquerda/direita)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setRotationAngle((prev) => (prev - 5 + 360) % 360)
        setHasInteracted(true)
      } else if (e.key === "ArrowRight") {
        setRotationAngle((prev) => (prev + 5) % 360)
        setHasInteracted(true)
      } else if (e.key === "Escape") {
        setActiveHotspot(null)
        if (isFullscreen) setIsFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isFullscreen])

  // Rótulo da bússola em graus
  const getCompassHeading = (deg: number) => {
    const norm = Math.round(deg) % 360
    if (norm >= 338 || norm < 23) return `N • ${norm}°`
    if (norm >= 23 && norm < 68) return `NE • ${norm}°`
    if (norm >= 68 && norm < 113) return `L • ${norm}°`
    if (norm >= 113 && norm < 158) return `SE • ${norm}°`
    if (norm >= 158 && norm < 203) return `S • ${norm}°`
    if (norm >= 203 && norm < 248) return `SO • ${norm}°`
    if (norm >= 248 && norm < 293) return `O • ${norm}°`
    return `NO • ${norm}°`
  }

  // Posição de fundo baseada no ângulo 0-360
  const bgPositionPercent = (rotationAngle / 360) * 100

  return (
    <div
      className={`relative transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-[#0A0807] p-2 sm:p-6"
          : "my-12"
      }`}
    >
      {/* TÍTULO E HEADER DO COMPONENTE */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3.5 py-1 text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#D3B47C]">
            <Compass className="h-3.5 w-3.5 animate-spin-slow" />
            <span>EXPERIÊNCIA IMERSIVA • TOUR 360° DO DÚNIA</span>
          </div>
          <h2 className="mt-2 font-serif text-3xl font-normal text-white sm:text-4xl lg:text-5xl">
            Explore Cada Espaço em 360°
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#ABA29A] max-w-xl leading-relaxed">
            Navegue interativamente pela arquitetura, pé-direito e cenografia do salão mais sofisticado de Brasília.
          </p>
        </div>

        {/* CONTROLES SUPERIORES */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              isAutoRotating
                ? "border-[#D3B47C] bg-[#D3B47C]/15 text-[#D3B47C]"
                : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
            }`}
            title={isAutoRotating ? "Pausar giro automático" : "Iniciar giro automático"}
          >
            {isAutoRotating ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isAutoRotating ? "Giro Automático" : "Girar"}</span>
          </button>

          <button
            onClick={() => setZoomLevel((prev) => (prev >= 1.4 ? 1 : prev + 0.2))}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2 text-white/80 hover:bg-white/10 transition"
            title="Ajustar zoom"
          >
            {zoomLevel > 1 ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setRotationAngle(currentScene.initialAngle)}
            className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 p-2 text-white/80 hover:bg-white/10 transition"
            title="Resetar orientação da câmera"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-3 py-2 text-xs font-bold text-[#D3B47C] hover:bg-[#D3B47C]/20 transition"
            title={isFullscreen ? "Sair da tela cheia" : "Modo tela cheia"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? "Minimizar" : "Tela Cheia"}</span>
          </button>
        </div>
      </div>

      {/* VIEWPORT 360° INTERATIVO */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`group relative overflow-hidden rounded-3xl border border-[#D3B47C]/40 bg-black shadow-2xl select-none ${
          isFullscreen ? "flex-1 min-h-[500px]" : "aspect-[16/9] sm:aspect-[21/9] min-h-[380px]"
        } ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {/* IMAGEM PANORÂMICA REPETIDA EM 360° */}
        <div
          className="absolute inset-0 transition-transform duration-100 ease-out"
          style={{
            backgroundImage: `url(${currentScene.image})`,
            backgroundPosition: `${bgPositionPercent}% center`,
            backgroundSize: `${280 * zoomLevel}% auto`,
            backgroundRepeat: "repeat-x",
            filter: "contrast(1.08) brightness(0.88)",
          }}
        />

        {/* VINHETA CÊNICA E SOMBRAS DE LUXO */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-black/60" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(10,8,7,0.75)_100%)]" />

        {/* HUD SUPERIOR: BÚSSOLA & ESPAÇO ATUAL */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs pointer-events-none">
          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 py-1.5 backdrop-blur-md shadow-lg pointer-events-auto">
            <span className="h-2 w-2 rounded-full bg-[#D3B47C] animate-pulse" />
            <span className="font-serif text-sm font-medium text-white">{currentScene.name}</span>
            <span className="text-[#D3B47C]">•</span>
            <span className="font-mono text-[0.65rem] uppercase text-[#D3B47C] font-semibold">
              {currentScene.area}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/70 px-3.5 py-1.5 backdrop-blur-md shadow-lg pointer-events-auto">
            <Compass
              className="h-4 w-4 text-[#D3B47C] transition-transform duration-200"
              style={{ transform: `rotate(${rotationAngle}deg)` }}
            />
            <span className="font-mono text-xs font-bold text-white">
              {getCompassHeading(rotationAngle)}
            </span>
          </div>
        </div>

        {/* PONTOS DE INTERESSE (HOTSPOTS 360°) */}
        {currentScene.hotspots.map((hs) => {
          // Calcula se o hotspot está visível na janela atual de visualização (FOV de aprox. 90 graus)
          const diff = ((hs.angle - rotationAngle + 540) % 360) - 180
          const isVisible = Math.abs(diff) <= 55

          if (!isVisible) return null

          // Mapeia o ângulo visível para a coordenada horizontal X de 0 a 100%
          const screenX = 50 + (diff / 55) * 45

          return (
            <div
              key={hs.id}
              style={{
                left: `${screenX}%`,
                top: `${hs.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-20 transition-all duration-150"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveHotspot(activeHotspot?.id === hs.id ? null : hs)
                }}
                className="group/btn relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#D3B47C] bg-black/80 text-[#D3B47C] shadow-[0_0_20px_rgba(211,180,124,0.4)] transition hover:scale-125 hover:bg-[#D3B47C] hover:text-[#100E0D]"
                title={hs.title}
              >
                <Sparkles className="h-4 w-4" />
                <span className="absolute -inset-1 rounded-full border border-[#D3B47C]/40 animate-ping opacity-60 pointer-events-none" />
              </button>
            </div>
          )
        })}

        {/* MODAL / POPOVER DO HOTSPOT ATIVO */}
        {activeHotspot && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-4 right-4 bottom-16 sm:left-auto sm:right-6 sm:bottom-16 sm:max-w-sm z-30 rounded-2xl border border-[#D3B47C]/50 bg-[#161311]/95 p-5 shadow-2xl backdrop-blur-xl animate-fadeIn"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="rounded-full border border-[#D3B47C]/30 bg-[#D3B47C]/10 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-[#D3B47C]">
                  {activeHotspot.badge}
                </span>
                <h4 className="mt-2 font-serif text-lg font-medium text-white">
                  {activeHotspot.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveHotspot(null)}
                className="rounded-full bg-white/10 p-1 text-white/70 hover:bg-white/20 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[#D6CEBE]/90 font-light">
              {activeHotspot.description}
            </p>
          </div>
        )}

        {/* DICA DE INTERAÇÃO FLUTUANTE (FADE OUT APÓS INTERAÇÃO) */}
        {!hasInteracted && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/20 bg-black/75 px-4 py-2 text-xs text-white/90 backdrop-blur-md shadow-xl animate-bounce">
            <Compass className="h-4 w-4 text-[#D3B47C]" />
            <span>Clique e arraste para explorar o espaço em 360°</span>
          </div>
        )}

        {/* BADGE DE CAPACIDADE NO RODAPÉ DO TOUR */}
        <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-3 text-xs text-[#ABA29A] pointer-events-none">
          <span className="flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1 border border-white/10 backdrop-blur-sm">
            <Building className="h-3.5 w-3.5 text-[#D3B47C]" />
            <strong className="text-white">Capacidade:</strong> {currentScene.capacity}
          </span>
        </div>
      </div>

      {/* SELETOR DE CENAS EM MINIATURAS (CARROSSEL DE ESPAÇOS 360°) */}
      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
        {TOUR_SCENES.map((scene, idx) => {
          const isActive = activeSceneIndex === idx
          return (
            <button
              key={scene.id}
              onClick={() => handleSelectScene(idx)}
              className={`group relative flex flex-col overflow-hidden rounded-2xl border p-2 text-left transition-all ${
                isActive
                  ? "border-[#D3B47C] bg-[#1C1815] shadow-lg ring-1 ring-[#D3B47C]/40"
                  : "border-white/10 bg-[#14110F] hover:border-white/30 hover:bg-[#181412]"
              }`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-black">
                <Image
                  src={scene.thumbnail}
                  alt={scene.name}
                  fill
                  className={`object-cover transition duration-500 group-hover:scale-105 ${
                    isActive ? "brightness-105" : "brightness-75"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-1.5 left-2 font-mono text-[0.6rem] font-bold text-[#D3B47C]">
                  {scene.area}
                </span>
              </div>

              <div className="mt-2 px-1">
                <h4 className="font-serif text-xs font-medium text-white truncate">
                  {scene.name.split("—")[0].trim()}
                </h4>
                <p className="text-[0.62rem] text-[#ABA29A] truncate mt-0.5">
                  {scene.capacity}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
