/**
 * Identidade do cliente — o ÚNICO lugar a editar ao iniciar um projeto novo.
 *
 * Configurado oficialmente para o DÚNIA CITY HALL - Lago Sul, Brasília.
 * Utiliza todos os dados reais extraídos diretamente de https://duniacityhall.com.br
 */

export type VerticalPreset = "eventos" | "juridico" | "catalogo" | "generico"

const VERTICAL: VerticalPreset = (process.env.NEXT_PUBLIC_VERTICAL as VerticalPreset) || "eventos"

/**
 * Paleta padrão de cada vertical. O preset "eventos" (Dúnia) usa a estética
 * de luxo com Obsidian profundo (#100E0D), painéis em carvão aquecido (#1A1715),
 * ouro champagne envelhecido (#D3B47C) e papel seda creme (#FAF8F5).
 */
const PALETAS: Record<VerticalPreset, {
  ink: string; panel: string; accent: string; surface: string; muted: string
  titleFont: "serif" | "sans"
}> = {
  eventos: { ink: "#FAF7F2", panel: "#FFFFFF", accent: "#5A1827", surface: "#F4ECE1", muted: "#8E682E", titleFont: "serif" },
  juridico: { ink: "#0A131F", panel: "#121F33", accent: "#B8925A", surface: "#F8FAFC", muted: "#9AA7B6", titleFont: "serif" },
  catalogo: { ink: "#0E1726", panel: "#15243A", accent: "#F2A33C", surface: "#F7F8FA", muted: "#94A3B8", titleFont: "sans" },
  generico: { ink: "#0E1726", panel: "#15243A", accent: "#0F9F8F", surface: "#F4F6F8", muted: "#94A3B8", titleFont: "sans" },
}

const PALETA = PALETAS[VERTICAL] ?? PALETAS.eventos

export const BRAND = {
  /** Vertical do projeto */
  vertical: VERTICAL,

  /** Nome oficial da marca */
  name: process.env.NEXT_PUBLIC_BRAND_NAME || "Dúnia City Hall",

  /** Razão social */
  legalName: process.env.NEXT_PUBLIC_BRAND_LEGAL_NAME || "Dunia Decorações LTDA",

  /** Frase síntese do salão */
  tagline: process.env.NEXT_PUBLIC_BRAND_TAGLINE || "O Salão de Festas Mais Elegante de Brasília",

  /** Descrição oficial completa para SEO e compartilhamento */
  description:
    process.env.NEXT_PUBLIC_BRAND_DESCRIPTION ||
    "Realize seu evento em grande estilo no Dúnia City Hall, salão de festas no Lago Sul, Brasília. Perfeito para casamentos, eventos corporativos, festas de 15 anos, formaturas e muito mais. Elegância e infraestrutura completa para momentos inesquecíveis!",

  /** Endereço público do site */
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || "https://duniacityhall.com.br").replace(/\/+$/, ""),

  contact: {
    whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || "5561974017544",
    whatsappFormatted: "(61) 97401-7544",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "(61) 3686-5339",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contato@duniacityhall.com.br",
    address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "SHIS QI 15 Lote J/K, Lago Sul, Brasília – DF, 71.600-700",
    city: "Brasília",
    state: "DF",
    neighborhood: "Lago Sul",
  },

  /**
   * Imagens oficiais da marca, locais em public/images/dunia/
   */
  assets: {
    logo: "/images/dunia/logo-dunia-preta.png",
    logoLight: "/images/dunia/logo-dunia-preta.png",
    logoPreta: "/images/dunia/logo-dunia-preta.png",
    favicon: "/images/dunia/logo.png",
    ogImage: "/images/dunia/salao-principal.jpg",
    salaoPrincipal: "/images/dunia/salao-principal.jpg",
    casamentoHero: "/images/dunia/casamento-hero.jpg",
    debutanteHero: "/images/dunia/debutante-hero.jpg",
    corporativoHero: "/images/dunia/corporativo-hero.jpg",
    buffetHero: "/images/dunia/buffet-hero.jpg",
    decoracaoHero: "/images/dunia/decoracao-hero.jpg",
  },

  theme: {
    ink: process.env.NEXT_PUBLIC_THEME_INK || PALETA.ink,
    panel: process.env.NEXT_PUBLIC_THEME_PANEL || PALETA.panel,
    accent: process.env.NEXT_PUBLIC_THEME_ACCENT || PALETA.accent,
    surface: process.env.NEXT_PUBLIC_THEME_SURFACE || PALETA.surface,
    muted: process.env.NEXT_PUBLIC_THEME_MUTED || PALETA.muted,
    titleFont: PALETA.titleFont,
    fonts: process.env.NEXT_PUBLIC_THEME_FONTS || "cormorant-dmsans",
  },

  professional: {
    name: "Dúnia City Hall",
    registration: "Lago Sul — Brasília/DF",
    city: "Brasília — DF",
    photo: "/images/dunia/salao-principal.jpg",
    photoAbout: "/images/dunia/salao-versao-03.jpg",
    heroPhoto: "/images/dunia/salao-principal.jpg",
  },

  /** Fotos para carrosséis e película de 35mm */
  parallax: [
    "/images/dunia/salao-principal.jpg",
    "/images/dunia/casamento-hero.jpg",
    "/images/dunia/debutante-hero.jpg",
    "/images/dunia/buffet-hero.jpg",
    "/images/dunia/jardim-galeria.jpg",
    "/images/dunia/cerimonias-galeria.jpg"
  ],

  social: {
    instagram: "https://www.instagram.com/duniacityhalldf/",
    facebook: "https://www.facebook.com/duniacityhalldf/",
    linkedin: "",
    youtube: "https://www.youtube.com/channel/UCL0mrw5FCAcrxcDsB68Nb4Q",
    whatsapp: "https://api.whatsapp.com/send?phone=5561974017544&text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20um%20or%C3%A7amento%20para%20o%20D%C3%BAnia%20City%20Hall",
  },
} as const

const VOCABULARIO: Record<VerticalPreset, Record<string, string>> = {
  eventos: {
    item: "Celebração",
    itemPlural: "Celebrações",
    catalogo: "Espaços & Salões",
    pedido: "Orçamento / Visita",
    pedidoPlural: "Orçamentos",
    cliente: "Anfitrião / Casal",
    clientePlural: "Anfitriões",
  },
  juridico: {
    item: "Serviço",
    itemPlural: "Serviços",
    catalogo: "Áreas de atuação",
    pedido: "Caso",
    pedidoPlural: "Casos",
    cliente: "Cliente",
    clientePlural: "Clientes",
  },
  catalogo: {
    item: "Produto",
    itemPlural: "Produtos",
    catalogo: "Catálogo",
    pedido: "Pedido",
    pedidoPlural: "Pedidos",
    cliente: "Cliente",
    clientePlural: "Clientes",
  },
  generico: {
    item: "Item",
    itemPlural: "Itens",
    catalogo: "Catálogo",
    pedido: "Solicitação",
    pedidoPlural: "Solicitações",
    cliente: "Contato",
    clientePlural: "Contatos",
  },
}

export function termo(chave: keyof (typeof VOCABULARIO)["generico"]): string {
  const dicionario = VOCABULARIO[BRAND.vertical] ?? VOCABULARIO.eventos
  return dicionario[chave] ?? VOCABULARIO.eventos[chave]
}

export function whatsappLink(mensagem?: string): string {
  const numero = BRAND.contact.whatsapp.replace(/\D/g, "")
  if (!numero) return "#"
  const texto = mensagem || "Olá! Gostaria de agendar uma visita e solicitar um orçamento no Dúnia City Hall."
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}
