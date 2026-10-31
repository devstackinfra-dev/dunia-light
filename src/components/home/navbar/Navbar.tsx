"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Lock, Menu } from "lucide-react"
import { LandingSettings } from "@/types/landing"
import { BRAND, whatsappLink } from "@/config/brand"
import { BrandLogo } from "@/components/home/shared/BrandLogo"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useHome, useNavegacao } from "@/components/home/shared/ConteudoProvider"

interface NavbarProps {
  landingSettings: LandingSettings
}

/** Menu derivado das seções ligadas em `home-content.ts` — seção desligada some daqui também. */
export function Navbar({ landingSettings }: NavbarProps) {
  // Textos deste cliente (banco) sobre o padrão da vertical
  const HOME = useHome()
  const HOME_NAV = useNavegacao()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const temWhatsapp = Boolean(BRAND.contact.whatsapp)
  const ctaHref = temWhatsapp ? whatsappLink(`Olá! Vim pelo site do ${BRAND.name}.`) : "/#contato"

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Faixa informativa configurada no painel */}
      {landingSettings.showCampaignBanner && landingSettings.campaignText && !scrolled && (
        <div className="bg-marca-latao px-4 py-2 text-center text-xs font-semibold text-marca-tinta">
          {landingSettings.campaignText}
        </div>
      )}

      <div
        className={cn(
          "transition-colors duration-300",
          scrolled ? "border-b border-white/10 bg-marca-tinta/95 backdrop-blur" : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container mx-auto flex items-center justify-between gap-6 px-6 py-4 lg:px-12 lg:py-5">
          <Link href="/" aria-label={`${BRAND.name} — início`} className="shrink-0">
            <BrandLogo priority />
          </Link>

          <nav aria-label="Seções" className="hidden items-center gap-6 xl:flex">
            {HOME_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm text-white/75 transition-colors hover:text-white focus-visible:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 xl:flex">
            <Link
              href={ctaHref}
              target={temWhatsapp ? "_blank" : undefined}
              className="whitespace-nowrap rounded-xl bg-marca-latao px-6 py-2.5 text-xs font-bold text-marca-tinta shadow-sm transition-all hover:bg-marca-latao/90 hover:scale-[1.02]"
            >
              {HOME.navCta}
            </Link>
            <Link
              href="/login"
              aria-label="Área restrita"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/70 backdrop-blur-sm transition-all hover:border-marca-latao/50 hover:text-white"
            >
              <Lock className="h-4 w-4" />
            </Link>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Abrir menu"
                className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 text-white xl:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-80 flex-col justify-between border-l border-white/10 bg-marca-tinta p-6 text-white">
              <div className="space-y-8">
                <SheetHeader className="border-b border-white/10 pb-5 text-left">
                  <SheetTitle className="font-titulo text-xl font-normal text-white">{BRAND.name}</SheetTitle>
                  {BRAND.professional.registration && (
                    <SheetDescription className="text-xs uppercase tracking-[0.18em] text-marca-nevoa">
                      {BRAND.professional.registration}
                    </SheetDescription>
                  )}
                </SheetHeader>

                <nav aria-label="Seções" className="flex flex-col">
                  {HOME_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="border-b border-white/10 py-3.5 font-titulo text-lg text-white/90 hover:text-marca-latao"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex flex-col gap-3 pt-6">
                <Link
                  href={ctaHref}
                  target={temWhatsapp ? "_blank" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-sm bg-marca-latao py-3 text-center text-sm font-semibold text-marca-tinta"
                >
                  {HOME.navCta}
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-sm border border-white/15 py-3 text-center text-sm text-white/70"
                >
                  Área restrita
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
