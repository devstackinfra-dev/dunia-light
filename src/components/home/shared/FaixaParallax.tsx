"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

/**
 * Faixa de foto entre seções: a imagem anda mais devagar que a página, como
 * se estivesse atrás do conteúdo. Sem texto por cima — é respiro visual.
 */
export function FaixaParallax({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduzir = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  // A imagem é 30% mais alta que a faixa (15% de folga em cima e embaixo). O
  // deslocamento é medido na altura da própria imagem: 11% dela ≈ 14% da faixa,
  // dentro da folga, então a borda nunca aparece.
  const y = useTransform(scrollYProgress, [0, 1], ["-11%", "11%"])

  return (
    <div ref={ref} aria-hidden className="relative h-[42vh] min-h-[280px] overflow-hidden bg-marca-tinta md:h-[60vh]">
      <motion.div style={reduzir ? undefined : { y }} className="absolute inset-x-0 -inset-y-[15%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </motion.div>
      {/* Véu na cor da marca: mantém a foto discreta e liga as seções */}
      <div className="absolute inset-0 bg-marca-tinta/20" />
    </div>
  )
}
