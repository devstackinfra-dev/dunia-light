"use client"

import type { ReactNode } from "react"
import { useLandingSettings } from "@/hooks/useLandingSettings"
import { Navbar } from "@/components/home/navbar/Navbar"
import { Footer } from "@/components/home/footer/Footer"
import { AvisoPrivacidade } from "@/components/home/privacidade/AvisoPrivacidade"

/** Moldura das páginas públicas internas: o mesmo menu, rodapé e aviso da home. */
export function PaginaPublica({ children }: { children: ReactNode }) {
  const { landingSettings } = useLandingSettings()
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-marca-tinta font-corpo text-slate-900 antialiased">
      <Navbar landingSettings={landingSettings} />
      <main className="flex-1">{children}</main>
      <Footer />
      <AvisoPrivacidade />
    </div>
  )
}
