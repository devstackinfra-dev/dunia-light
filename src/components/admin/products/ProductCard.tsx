"use client"

import { Product } from "@/types/product"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit3, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BRAND } from "@/config/brand"

interface ProductCardProps {
  product: Product
  onView: (product: Product) => void
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export function ProductCard({ product, onView, onEdit, onDelete }: ProductCardProps) {
  return (
    <Card className="bg-white border-slate-200 shadow-sm rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-300">
      
      {/* Thumbnail */}
      <div className="relative h-44 bg-slate-50 flex items-center justify-center overflow-hidden">
        {product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={product.thumbnail} 
            alt={product.name} 
            className="w-full h-full object-contain mix-blend-multiply p-4"
          />
        ) : (
          <div className="text-slate-400 text-xs font-bold uppercase">Sem Imagem</div>
        )}

        {/* Floating Badges */}
        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.category && (
            <Badge className="bg-slate-900/80 text-white text-[9px] font-bold uppercase py-0.5 px-2 shadow-sm">
              {product.category}
            </Badge>
          )}
          {BRAND.vertical === "catalogo" && product.isAccessible && (
            <Badge className="bg-violet-50 text-violet-700 border border-violet-200 text-[9px] font-black uppercase py-0.5 px-2 shadow-sm">
              ♿ Acessível
            </Badge>
          )}
          {BRAND.vertical === "catalogo" && product.isHybrid && (
            <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-black uppercase py-0.5 px-2 shadow-sm">
              🔋 Híbrido
            </Badge>
          )}
        </div>

        {/* Featured Flag */}
        {product.featured && (
          <Badge className="absolute top-2 right-2 bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-black uppercase py-0.5 px-2 shadow-sm">
            ★ Destaque
          </Badge>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {(product.brand || product.year) && (
            <div className="flex justify-between items-start">
              {product.brand ? (
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{product.brand}</span>
              ) : null}
              {product.year ? (
                <span className="text-[10px] text-slate-500 font-bold">Ano {product.year}</span>
              ) : null}
            </div>
          )}
          <CardTitle className="text-sm font-extrabold text-slate-900 mt-1 truncate">{product.name}</CardTitle>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-semibold">{product.shortDescription}</p>
        </div>

        {/* Price & Specs row */}
        {(product.dailyPrice || product.monthlyPrice || product.price) && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {product.dailyPrice ? (
              <div className="text-xs text-slate-600 font-bold">
                {BRAND.vertical === "juridico" ? "A partir de:" : "Diária:"}{" "}
                <span className="text-emerald-600 font-extrabold">R$ {product.dailyPrice.toLocaleString("pt-BR")}</span>
              </div>
            ) : product.price ? (
              <div className="text-xs text-slate-600 font-bold">
                Valor: <span className="text-emerald-600 font-extrabold">{product.price.startsWith("R$") ? product.price : `R$ ${product.price}`}</span>
              </div>
            ) : null}
            {product.monthlyPrice ? (
              <div className="text-xs text-slate-600 font-bold">
                {BRAND.vertical === "juridico" ? "Mensalidade:" : "Mensal:"}{" "}
                <span className="text-emerald-600 font-extrabold">R$ {product.monthlyPrice.toLocaleString("pt-BR")}</span>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>

      {/* Footer Actions */}
      <div className="bg-slate-50 border-t border-slate-100 p-3 flex justify-end gap-2">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onView(product)}
          className="text-slate-600 hover:text-slate-700 hover:bg-slate-100 h-8 px-2.5 flex items-center gap-1 font-bold rounded-lg text-xs"
        >
          <Eye className="h-3.5 w-3.5" /> Ver Dados
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onEdit(product)}
          className="text-sky-600 hover:text-sky-700 hover:bg-slate-100 h-8 px-2.5 flex items-center gap-1 font-bold rounded-lg text-xs"
        >
          <Edit3 className="h-3.5 w-3.5" /> Editar
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => product.id && onDelete(product.id)}
          className="text-red-600 hover:text-red-700 hover:bg-slate-100 h-8 px-2.5 flex items-center gap-1 font-bold rounded-lg text-xs"
        >
          <Trash2 className="h-3.5 w-3.5" /> Excluir
        </Button>
      </div>

    </Card>
  )
}
