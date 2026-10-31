"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

const CHAVE = "aviso_privacidade_v1"

/**
 * Aviso de privacidade (LGPD). O site público não usa cookies de rastreamento
 * nem publicidade — só armazenamento essencial (cache do conteúdo público) —,
 * então é um aviso informativo, não um pedido de consentimento. Se um dia
 * entrar Google Analytics, Pixel ou similar, isto precisa virar consentimento
 * de verdade, com opção de recusar antes de carregar o script.
 */
export function AvisoPrivacidade() {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(CHAVE)) setVisivel(true)
    } catch {
      // Armazenamento bloqueado: não insiste em mostrar a cada página
    }
  }, [])

  if (!visivel) return null

  const fechar = () => {
    setVisivel(false)
    try {
      localStorage.setItem(CHAVE, "1")
    } catch {}
  }

  return (
    <div
      role="region"
      aria-label="Aviso de privacidade"
      className="fixed inset-x-4 bottom-4 z-40 max-w-md border border-white/10 bg-marca-painel p-5 text-sm text-marca-nevoa shadow-2xl sm:left-6 sm:right-auto"
    >
      <p className="leading-relaxed">
        Este site usa apenas armazenamento essencial para funcionar. Não usamos cookies de
        publicidade nem de rastreamento.{" "}
        <Link href="/privacidade" className="text-white underline underline-offset-2 hover:text-marca-latao">
          Política de privacidade
        </Link>
      </p>
      <button
        onClick={fechar}
        className="mt-4 rounded-sm bg-marca-latao px-4 py-2 text-xs font-semibold text-marca-tinta hover:bg-marca-latao/90"
      >
        Entendi
      </button>
    </div>
  )
}
