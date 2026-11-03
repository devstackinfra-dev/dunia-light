import type React from "react"
import "@/app/globals.css"
import "@/styles/dunia-experience.css"
import type { Metadata, Viewport } from "next"
import { Cormorant_Garamond, DM_Sans, Libre_Caslon_Text, Open_Sans, Playfair_Display, Public_Sans } from "next/font/google"
import WhatsAppNotification from "@/components/whatsapp-notification"
import { BRAND } from "@/config/brand"
import { getConteudo } from "@/lib/conteudo"
import { getSetting } from "@/lib/db/settings"
import type { LandingSettings } from "@/types/landing"
import { ConteudoProvider } from "@/components/home/shared/ConteudoProvider"
import DuniaBackground from "@/components/dunia-background"

// Cormorant Garamond: a serifa nobre e cinematográfica oficial do Dúnia City Hall
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
})

// DM Sans: moderna, fluida e de altíssima legibilidade para o corpo
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dmsans",
  display: "swap",
})

// Caslon: a serifa clássica da impressão jurídica
const serifa = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-serifa",
  display: "swap",
})

// Public Sans: sóbria e institucional
const sans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
  preload: false,
})

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-opensans",
  display: "swap",
  preload: false,
})

const PARES_DE_FONTES = {
  "cormorant-dmsans": { titulo: "var(--font-cormorant)", corpo: "var(--font-dmsans)" },
  "caslon-publicsans": { titulo: "var(--font-serifa)", corpo: "var(--font-sans)" },
  "playfair-opensans": { titulo: "var(--font-playfair)", corpo: "var(--font-opensans)" },
} as const

const fontes = PARES_DE_FONTES[BRAND.theme.fonts as keyof typeof PARES_DE_FONTES] ?? PARES_DE_FONTES["cormorant-dmsans"]

/** "#0E1B2B" → "14 27 43", o formato que o Tailwind combina com opacidade. */
function rgb(hex: string): string {
  const limpo = hex.replace("#", "")
  const cheio = limpo.length === 3 ? limpo.split("").map((c) => c + c).join("") : limpo
  const n = parseInt(cheio, 16)
  if (Number.isNaN(n)) return "0 0 0"
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`
}

const temaCss = {
  "--marca-tinta": rgb(BRAND.theme.ink),
  "--marca-painel": rgb(BRAND.theme.panel),
  "--marca-latao": rgb(BRAND.theme.accent),
  "--marca-papel": rgb(BRAND.theme.surface),
  "--marca-nevoa": rgb(BRAND.theme.muted),
  "--font-titulo": BRAND.theme.titleFont === "serif" ? fontes.titulo : fontes.corpo,
  "--font-corpo": fontes.corpo,
} as React.CSSProperties

export const viewport: Viewport = {
  themeColor: BRAND.theme.ink,
  width: "device-width",
  initialScale: 1,
  // Sem `maximumScale`/`userScalable`: travar o zoom quebra a acessibilidade
  // e faz o iOS ampliar a página sozinho ao focar inputs pequenos.
}

export async function generateMetadata(): Promise<Metadata> {
  let settings: LandingSettings | null = null
  try {
    settings = await getSetting<LandingSettings>("landing_settings")
  } catch {
    // fallback se o banco estiver indisponível
  }

  const titulo = settings?.seoTitle || (BRAND.tagline ? `${BRAND.name} — ${BRAND.tagline}` : BRAND.name)
  const descricao = settings?.seoDescription || BRAND.description
  const ogImg = settings?.ogImage || BRAND.assets.ogImage || BRAND.professional.photo

  return {
    metadataBase: new URL(BRAND.siteUrl),
    title: {
      default: titulo,
      template: `%s | ${BRAND.name}`,
    },
    description: descricao,
    keywords: settings?.seoKeywords ? settings.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean) : undefined,
    verification: settings?.googleVerification ? { google: settings.googleVerification } : undefined,
    openGraph: {
      siteName: BRAND.name,
      locale: "pt_BR",
      type: "website",
      title: titulo,
      description: descricao,
      images: ogImg ? [{ url: ogImg }] : undefined,
    },
  }
}

// Textos editados no painel chegam ao site em até 5 minutos
export const revalidate = 300

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Textos deste cliente (banco), sobre o padrão da vertical
  const conteudo = await getConteudo()

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${dmSans.variable} ${serifa.variable} ${sans.variable} ${playfair.variable} ${openSans.variable}`} style={temaCss}>
      <body className="font-corpo antialiased selection:bg-marca-latao/30 selection:text-marca-tinta bg-[#0A0807] text-[#F3EEE6] overflow-x-hidden relative min-h-screen">
        {process.env.NODE_ENV !== "production" && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                try {
                  if (typeof window !== "undefined" && "serviceWorker" in navigator && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
                    navigator.serviceWorker.getRegistrations().then(function(regs) {
                      for (var r of regs) { r.unregister(); }
                    });
                    if ("caches" in window) {
                      caches.keys().then(function(keys) {
                        for (var k of keys) { caches.delete(k); }
                      });
                    }
                  }
                } catch(e) {}
              `,
            }}
          />
        )}
        <DuniaBackground />
        <ConteudoProvider conteudo={conteudo}>
          {children}
          {/* <WhatsAppNotification /> */}
        </ConteudoProvider>
      </body>
    </html>
  )
}
