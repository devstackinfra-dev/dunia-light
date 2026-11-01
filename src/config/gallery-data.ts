import catalog from "./gallery-catalog.json"

export interface GalleryPhoto {
  id: number | string
  title: string
  label: string
  category: "all" | "casamento" | "buffet" | "debutante" | "corporativo" | "salao" | "decoracao" | "festas" | "jardim" | "embaixadas"
  src: string
  url: string
  width?: number
  height?: number
  isLocal?: boolean
}

export const ALL_PHOTOS: GalleryPhoto[] = catalog as GalleryPhoto[]

export const GALLERY_CATEGORIES = [
  { id: "all", label: "Todas as Fotos", count: ALL_PHOTOS.length },
  { id: "casamento", label: "Casamentos", count: ALL_PHOTOS.filter(p => p.category === "casamento").length },
  { id: "corporativo", label: "Corporativo & Galas", count: ALL_PHOTOS.filter(p => p.category === "corporativo").length },
  { id: "embaixadas", label: "Embaixadas & Solenidades", count: ALL_PHOTOS.filter(p => p.category === "embaixadas").length },
  { id: "debutante", label: "15 Anos & Debutantes", count: ALL_PHOTOS.filter(p => p.category === "debutante").length },
  { id: "buffet", label: "Buffet & Gastronomia", count: ALL_PHOTOS.filter(p => p.category === "buffet").length },
  { id: "salao", label: "O Salão & Espaços", count: ALL_PHOTOS.filter(p => p.category === "salao").length },
  { id: "jardim", label: "Jardim & Áreas Externas", count: ALL_PHOTOS.filter(p => p.category === "jardim").length },
  { id: "festas", label: "Pista & Balada", count: ALL_PHOTOS.filter(p => p.category === "festas").length },
  { id: "decoracao", label: "Cenografia & Decoração", count: ALL_PHOTOS.filter(p => p.category === "decoracao").length },
]

export function getPhotosByCategory(cat: string): GalleryPhoto[] {
  if (cat === "all") return ALL_PHOTOS
  return ALL_PHOTOS.filter(p => p.category === cat)
}
