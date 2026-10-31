"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { MessageCircle, Package } from "lucide-react"
import { listProducts, incrementProductClicks } from "@/lib/db/products"
import { optimizeImageUrl } from "@/lib/supabase"
import { BRAND, whatsappLink } from "@/config/brand"
import { Product } from "@/types/product"
import { SectionHeader } from "@/components/home/shared/SectionHeader"
import { cn } from "@/lib/utils"
import { useHome } from "@/components/home/shared/ConteudoProvider"

const TODOS = "__todos__"

/**
 * Vitrine dos itens cadastrados no painel. Sem item ativo, a seção não aparece:
 * um template novo não deve exibir produto de exemplo de outro cliente.
 */
export function Catalog() {
  // Textos deste cliente (banco) sobre o padrão da vertical
  const HOME = useHome()
  const [products, setProducts] = useState<Product[]>([])
  const [categoria, setCategoria] = useState(TODOS)
  const { badge, title, subtitle, showPrice, ctaText, whatsappMessage } = HOME.catalogo

  useEffect(() => {
    listProducts()
      .then((list) => {
        const ativos = list
          .filter((p) => p.status === "active" && p.available !== false)
          .sort((a, b) => (a.catalogOrder ?? 0) - (b.catalogOrder ?? 0))
        setProducts(ativos)
      })
      .catch((err) => console.warn("[Catálogo] Erro ao carregar itens:", err))
  }, [])

  const categorias = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter((c): c is string => Boolean(c)))),
    [products]
  )

  const visiveis = categoria === TODOS ? products : products.filter((p) => p.category === categoria)

  if (products.length === 0) return null

  const temWhatsapp = Boolean(BRAND.contact.whatsapp)

  return (
    <section id="catalogo" className="relative w-full bg-transparent py-20 lg:py-32 select-none">
      <div className="container mx-auto px-6">
        <SectionHeader badge={badge} title={title} subtitle={subtitle} />

        {categorias.length > 1 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {[TODOS, ...categorias].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoria(cat)}
                className={cn(
                  "rounded-full border px-4 py-2 text-xs font-bold transition-colors",
                  categoria === cat
                    ? "border-sky-500 bg-sky-500 text-white"
                    : "border-white/15 bg-white/5 text-sky-100 hover:bg-white/10"
                )}
              >
                {cat === TODOS ? "Todos" : cat}
              </button>
            ))}
          </div>
        )}

        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visiveis.map((item) => {
            const imagem = item.thumbnail || item.image || item.images?.[0]
            const mensagem = whatsappMessage.replace("{item}", item.name)
            return (
              <article
                key={item.id ?? item.name}
                className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center bg-slate-100">
                  {imagem ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={optimizeImageUrl(imagem)} alt={item.name} loading="lazy" className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-10 w-10 text-slate-300" />
                  )}
                  {item.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-sky-700 shadow-sm">
                      {item.tag}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 text-lg font-black text-slate-800">{item.name}</h3>
                  {item.shortDescription && (
                    <p className="mb-4 flex-1 text-sm font-medium leading-relaxed text-slate-600">{item.shortDescription}</p>
                  )}
                  {showPrice && item.price && (
                    <p className="mb-4 text-xl font-black text-slate-900">{item.price}</p>
                  )}
                  <Link
                    href={temWhatsapp ? whatsappLink(mensagem) : "/#contato"}
                    target={temWhatsapp ? "_blank" : undefined}
                    onClick={() => {
                      if (item.id) incrementProductClicks(item.id).catch(() => {})
                    }}
                    className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-bold text-white transition-colors hover:bg-sky-500"
                  >
                    <MessageCircle className="h-4 w-4" /> {ctaText}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
