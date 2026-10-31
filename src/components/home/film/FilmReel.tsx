"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { Sparkles, Film } from "lucide-react"

interface FilmFrame {
  id: string
  frameNumber: string
  act: string
  title: string
  image: string
  alt: string
}

const FRAMES: FilmFrame[] = [
  {
    id: "01",
    frameNumber: "FRAME 001",
    act: "A EXPECTATIVA",
    title: "O cenário",
    image: "/images/dunia/salao-principal.jpg",
    alt: "Salão Imperial Dúnia City Hall iluminado",
  },
  {
    id: "02",
    frameNumber: "FRAME 002",
    act: "O DETALHE",
    title: "O cuidado",
    image: "/images/dunia/decoracao-hero.jpg",
    alt: "Decoração clássica e arranjos de flores",
  },
  {
    id: "03",
    frameNumber: "FRAME 003",
    act: "O ENCONTRO",
    title: "O sim",
    image: "/images/dunia/casamento-hero.jpg",
    alt: "Casamento emocionante no Dúnia City Hall",
  },
  {
    id: "04",
    frameNumber: "FRAME 004",
    act: "A DESCOBERTA",
    title: "O começo",
    image: "/images/dunia/debutante-hero.jpg",
    alt: "Festa de 15 anos com pista de dança e luzes",
  },
  {
    id: "05",
    frameNumber: "FRAME 005",
    act: "OS SABORES",
    title: "A celebração",
    image: "/images/dunia/buffet-hero.jpg",
    alt: "Buffet Dúnia e alta gastronomia",
  },
  {
    id: "06",
    frameNumber: "FRAME 006",
    act: "A NATUREZA",
    title: "O encanto",
    image: "/images/dunia/jardim-galeria.jpg",
    alt: "Jardim integrado para cerimônias ao ar livre",
  },
  {
    id: "07",
    frameNumber: "FRAME 007",
    act: "O PRESTÍGIO",
    title: "A conexão",
    image: "/images/dunia/corporativo-hero.jpg",
    alt: "Evento corporativo e recepções diplomáticas",
  },
]

export function FilmReel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Transforma o scroll vertical de 0 a 1 em deslocamento horizontal de 0% até -68%
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-68%"])
  const progressoBarra = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <div id="galeria-35mm" className="relative bg-[#080706] text-white">
      {/* 1. Cabeçalho de Introdução da Película */}
      <div className="container mx-auto px-6 pt-24 pb-12 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-marca-latao/30 bg-marca-latao/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#E5C992]">
              <Film className="h-3.5 w-3.5 text-marca-latao" />
              <span>Memórias em Movimento • 35mm</span>
            </div>
            <h2 className="mt-4 font-titulo text-4xl sm:text-5xl lg:text-6xl font-normal leading-none tracking-tight text-white">
              A Película do <span className="italic text-marca-latao">Dúnia</span>
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base font-light text-slate-300 font-corpo leading-relaxed">
            Cada celebração no Lago Sul é registrada como uma obra de arte. Role a página para percorrer os fotogramas que marcaram a nossa história.
          </p>
        </div>
      </div>

      {/* 2. Seção de Scroll com Sticky Pin (Película 35mm) */}
      <div ref={containerRef} className="relative h-[280vh]">
        <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
          
          {/* Fundo Atmosférico */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#2A1B12,#080706_75%)] opacity-80 pointer-events-none" />

          {/* Fita de Filme 35mm com Perfurações */}
          <motion.div
            style={reduzir ? undefined : { x }}
            className="relative flex gap-6 px-12 md:px-20 py-10 flex-none will-change-transform"
          >
            {/* Perfuração superior da película */}
            <div className="absolute top-1 left-0 right-0 h-4 bg-repeat-x pointer-events-none opacity-60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent 0px, transparent 14px, #D3B47C 14px, #D3B47C 32px, transparent 32px, transparent 46px)",
              }}
            />

            {/* Fotogramas */}
            {FRAMES.map((frame, index) => (
              <div
                key={frame.id}
                className="group relative h-[52vh] min-h-[380px] max-h-[580px] w-[75vw] sm:w-[50vw] lg:w-[42vw] max-w-[650px] flex-none overflow-hidden rounded-xl border border-[#4B3824] bg-[#120F0D] shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frame.image}
                  alt={frame.alt}
                  loading="lazy"
                  className="h-full w-full object-cover object-center filter saturate-[0.85] contrast-[1.08] transition-all duration-700 group-hover:scale-105 group-hover:saturate-100"
                />

                {/* Sombra de Vinheta */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                {/* Informações do Frame */}
                <div className="absolute bottom-6 left-6 right-6 z-10 flex items-end justify-between">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E5C992]">
                      {frame.frameNumber} / {frame.act}
                    </span>
                    <strong className="block font-titulo text-3xl sm:text-4xl lg:text-5xl font-normal text-white mt-1">
                      {frame.title}
                    </strong>
                  </div>
                  <span className="text-xs font-mono text-white/50 tracking-widest hidden sm:inline-block">
                    35MM • 0{index + 1}
                  </span>
                </div>
              </div>
            ))}

            {/* Perfuração inferior da película */}
            <div className="absolute bottom-1 left-0 right-0 h-4 bg-repeat-x pointer-events-none opacity-60"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(90deg, transparent 0px, transparent 14px, #D3B47C 14px, #D3B47C 32px, transparent 32px, transparent 46px)",
              }}
            />
          </motion.div>

          {/* Barra de Progresso e Guia de Navegação Inferior */}
          <div className="absolute bottom-6 inset-x-8 md:inset-x-16 z-20 flex items-center justify-between gap-8 pointer-events-none">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E5C992] flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-marca-latao inline" />
              <span>Role para desenrolar a história</span>
              <span className="text-base">→</span>
            </p>

            <div className="h-[2px] w-48 sm:w-72 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                style={reduzir ? undefined : { width: progressoBarra }}
                className="h-full bg-gradient-to-r from-marca-latao via-[#F4E3BE] to-marca-latao"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
