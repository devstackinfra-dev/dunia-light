"use client"

import { useEffect, useState, useRef } from "react"

export default function DuniaBackground() {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [isPhotoHovered, setIsPhotoHovered] = useState(false)
  const [isInteractiveHovered, setIsInteractiveHovered] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 1. Detecção de Movimento do Mouse para Holofote Cênico Interativo
    let animationFrameId: number

    const handlePointerMove = (e: PointerEvent) => {
      // Atualiza posição do holofote de fundo
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY })
      })

      // Atualiza anel fino de cursor
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`
        cursorRef.current.style.top = `${e.clientY}px`
        cursorRef.current.style.opacity = "0.75"
      }
    }

    const handlePointerLeave = () => {
      setMousePos(null)
      if (cursorRef.current) {
        cursorRef.current.style.opacity = "0"
      }
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    document.addEventListener("pointerleave", handlePointerLeave)

    // 2. Interação Dinâmica com Fotos e Elementos Clicáveis
    const checkHoverTarget = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (!target) return

      const isImg = !!target.closest("img, [data-interactive-photo], .celebration-card, .film-frame, .journal-card, article")
      const isInteractive = !!target.closest("a, button, input, textarea, select")

      setIsPhotoHovered(isImg)
      setIsInteractiveHovered(isInteractive)

      if (cursorRef.current) {
        if (isInteractive || isImg) {
          cursorRef.current.classList.add("grow")
        } else {
          cursorRef.current.classList.remove("grow")
        }
      }
    }

    document.addEventListener("mouseover", checkHoverTarget, { passive: true })

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      document.removeEventListener("pointerleave", handlePointerLeave)
      document.removeEventListener("mouseover", checkHoverTarget)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      {/* 1. ANEL DE CURSOR AMBIENTE BORDÔ & DOURADO DE ALTA-COSTURA */}
      <div
        id="ambient-cursor"
        ref={cursorRef}
        className="ambient-cursor hidden md:block !border-[#741F32]/40"
        aria-hidden="true"
      />

      {/* 2. TELA ATMOSFÉRICA FIXA: CHAMPANHE SEDA & BORDÔ DE ALTO CONTRASTE */}
      <div
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        aria-hidden="true"
      >
        {/* 2.1 BASE LUMINOSA CHAMPAGNE & MARFIM REAL */}
        <div className="absolute inset-0 bg-[#F7EFE6]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#F2E4D5_0%,_#F7EFE6_50%,_#E8D4BF_100%)] opacity-85" />

        {/* 2.2 HOLOFOTE CÊNICO INTERATIVO QUE REAGE AO CURSOR E ÀS FOTOS */}
        {mousePos && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
            style={{
              left: mousePos.x,
              top: mousePos.y,
              width: isPhotoHovered ? "720px" : "540px",
              height: isPhotoHovered ? "720px" : "540px",
              background: isPhotoHovered
                ? "radial-gradient(circle, rgba(116, 31, 50, 0.08) 0%, rgba(189, 148, 99, 0.08) 45%, transparent 70%)"
                : "radial-gradient(circle, rgba(116, 31, 50, 0.04) 0%, rgba(189, 148, 99, 0.05) 50%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        )}

        {/* 2.3 LUSTRES MONUMENTAIS: HALOS FIXOS DE ILUMINAÇÃO DE SALÃO (OURO CHAMPAGNE & BORDÔ SUAVE) */}
        {/* Lustre Principal de Cristal — Topo Direito */}
        <div className="absolute -top-48 right-[-10%] h-[900px] w-[900px] rounded-full bg-gradient-to-br from-[#BD9463]/14 via-[#741F32]/05 to-transparent blur-[160px]" />

        {/* Halo Âmbar Cálido de Velas — Topo Esquerdo */}
        <div className="absolute top-20 -left-40 h-[800px] w-[800px] rounded-full bg-gradient-to-br from-[#E8D4BF]/50 via-[#BD9463]/10 to-transparent blur-[150px]" />

        {/* Iluminação de Pista & Cenografia — Centro da Página */}
        <div className="absolute top-[42%] right-[10%] h-[700px] w-[700px] rounded-full bg-[#741F32]/03 blur-[160px]" />

        {/* Resplendor Champagne — Base Esquerda */}
        <div className="absolute bottom-10 -left-20 h-[800px] w-[800px] rounded-full bg-[#BD9463]/10 via-[#E8D4BF]/25 to-transparent blur-[170px]" />

        {/* 2.4 TEXTURA EDITORIAL DE CRISTAL & LINHO NOBRE */}
        <div className="absolute inset-0 bg-[radial-gradient(#741F32_0.65px,transparent_0.65px)] [background-size:48px_48px] opacity-[0.03]" />

        {/* 2.5 FEIXE DE LUZ CÊNICO SUPERIOR PERMANENTE */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[1100px] bg-[radial-gradient(ellipse_at_top,rgba(242,228,213,0.7),transparent_70%)] blur-2xl opacity-75" />

        {/* 2.6 PARTÍCULAS SUTIS DE BRILHO DOURADO / POEIRA DE CRISTAL */}
        <div className="ambient-particle top-[18%] left-[15%] h-2 w-2 opacity-35 bg-[#BD9463]" style={{ animationDelay: "0s", animationDuration: "9s" }} />
        <div className="ambient-particle top-[32%] right-[22%] h-1.5 w-1.5 opacity-35 bg-[#741F32]" style={{ animationDelay: "2s", animationDuration: "11s" }} />
        <div className="ambient-particle top-[48%] left-[28%] h-2 w-2 opacity-30 bg-[#BD9463]" style={{ animationDelay: "4s", animationDuration: "13s" }} />
        <div className="ambient-particle top-[65%] right-[18%] h-1.5 w-1.5 opacity-35 bg-[#741F32]" style={{ animationDelay: "1s", animationDuration: "10s" }} />
        <div className="ambient-particle top-[82%] left-[12%] h-2.5 w-2.5 opacity-30 bg-[#BD9463]" style={{ animationDelay: "3s", animationDuration: "12s" }} />
      </div>
    </>
  )
}
