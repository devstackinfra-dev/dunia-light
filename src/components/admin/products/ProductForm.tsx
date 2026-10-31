"use client"

import { useState, useEffect } from "react"
import { Product } from "@/types/product"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ProductGallery } from "./ProductGallery"
import { ChevronLeft, Save } from "lucide-react"
import { BRAND, termo } from "@/config/brand"

interface ProductFormProps {
  product: Product | null
  onSave: (productData: Partial<Product>) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const isJuridico = BRAND.vertical === "juridico"

  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    slug: "",
    category: isJuridico ? "tributario" : "dtaxi",
    brand: isJuridico ? "" : "Toyota",
    year: isJuridico ? "" : "2024",
    transmission: "automatic",
    fuelType: "flex",
    isHybrid: false,
    hasGNV: false,
    isDTaxiApproved: false,
    isAccessible: false,
    isAtendeApproved: false,
    hasRadioAssociation: false,
    isDTPApproved: false,
    hasDTPCourseSupport: false,
    shortDescription: "",
    fullDescription: "",
    monthlyPrice: 0,
    weeklyPrice: 0,
    dailyPrice: 0,
    status: "active",
    available: true,
    featured: false,
    catalogFeatured: true,
    catalogOrder: 0,
    thumbnail: "",
    images: [],
    specs: [],
    tags: [],
    positivePoints: [],
    highlights: [],
    seoTitle: "",
    seoDescription: ""
  })

  // Populate data when editing
  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        weeklyPrice: product.weeklyPrice || (product.monthlyPrice ? Math.round(product.monthlyPrice / 4) : 0),
        images: product.images || [],
        specs: product.specs || [],
        tags: product.tags || [],
        positivePoints: product.positivePoints || [],
        highlights: product.highlights || [],
        isAccessible: product.isAccessible || false,
        isAtendeApproved: product.isAtendeApproved || false,
        hasRadioAssociation: product.hasRadioAssociation || false,
        isDTPApproved: product.isDTPApproved || false,
        hasDTPCourseSupport: product.hasDTPCourseSupport || false
      })
    }
  }, [product])

  // Dynamic price calculation handlers
  const handleDailyPriceChange = (val: number) => {
    setFormData(prev => {
      const weekly = val * 6
      const monthly = weekly * 4 // Equivalência para 4 semanas (24 diárias)
      return {
        ...prev,
        dailyPrice: val,
        weeklyPrice: weekly,
        monthlyPrice: monthly
      }
    })
  }

  const handleWeeklyPriceChange = (val: number) => {
    setFormData(prev => {
      const daily = Math.round(val / 6)
      const monthly = val * 4
      return {
        ...prev,
        dailyPrice: daily,
        weeklyPrice: val,
        monthlyPrice: monthly
      }
    })
  }

  const handleMonthlyPriceChange = (val: number) => {
    setFormData(prev => {
      const weekly = Math.round(val / 4)
      const daily = Math.round(weekly / 6)
      return {
        ...prev,
        dailyPrice: daily,
        weeklyPrice: weekly,
        monthlyPrice: val
      }
    })
  }

  // Automatically compute slug on name change
  const handleNameChange = (val: string) => {
    const computedSlug = val
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9\s-]/g, "") // Remove spec chars
      .replace(/[\s-]+/g, "-") // Replace spaces/hyphens with a single hyphen

    setFormData(prev => ({
      ...prev,
      name: val,
      slug: computedSlug
    }))
  }

  // Handle saving the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  // Helper arrays parsing (comma separated text helper)
  const handleArrayStringChange = (field: keyof Product, val: string) => {
    const arr = val.split(",").map(item => item.trim()).filter(Boolean)
    setFormData(prev => ({ ...prev, [field]: arr }))
  }

  return (
    <div className="space-y-6">
      
      {/* Header Controls */}
      <div className="flex items-center gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-slate-200 hover:border-slate-300 text-slate-700 bg-white h-9 px-3 shadow-sm hover:bg-slate-50 transition-all"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Voltar
        </Button>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {product ? `Editar ${product.name}` : "Cadastrar Novo Veículo"}
          </h2>
          <p className="text-xs text-slate-500">Preencha os dados e gerencie a galeria comercial do veículo.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        
        {/* GALERIA E IMAGENS */}
        <div className="space-y-2.5">
          <Label className="text-xs font-bold text-slate-700">Galeria de Imagens & Capa</Label>
          <ProductGallery 
            images={formData.images || []}
            thumbnail={formData.thumbnail || ""}
            slug={formData.slug || ""}
            onChange={(imgs, thumb) => setFormData(prev => ({ ...prev, images: imgs, thumbnail: thumb }))}
          />
        </div>

        <div className="h-px bg-slate-100" />

        {/* DADOS BÁSICOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-slate-700">
              {isJuridico ? "Nome da Especialidade / Serviço" : "Nome do Produto"}
            </Label>
            <Input 
              id="name" 
              value={formData.name || ""} 
              onChange={(e) => handleNameChange(e.target.value)} 
              placeholder={isJuridico ? "Ex: Consultoria Tributária & Planejamento Fiscal" : "Ex: Corolla Cross D-TAXI"}
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="slug" className="text-xs font-bold text-slate-700">Slug (URL Amigável)</Label>
            <Input 
              id="slug" 
              value={formData.slug || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder={isJuridico ? "ex-consultoria-tributaria" : "ex-corolla-cross"}
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Categoria</Label>
            <Select 
              value={formData.category} 
              onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}
            >
              <SelectTrigger className="bg-white border-slate-200 text-slate-800">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-700">
                {isJuridico ? (
                  <>
                    <SelectItem value="tributario">Direito Tributário</SelectItem>
                    <SelectItem value="trabalhista">Direito Trabalhista Empresarial</SelectItem>
                    <SelectItem value="civil">Direito Civil & Contratos</SelectItem>
                    <SelectItem value="societario">Direito Societário & Negócios</SelectItem>
                    <SelectItem value="consultoria">Consultoria Preventiva</SelectItem>
                    <SelectItem value="contencioso">Contencioso Estratégico</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="dtaxi">D-TAXI (Aeroporto Congonhas)</SelectItem>
                    <SelectItem value="hibridos">Híbridos (Combustível Híbrido)</SelectItem>
                    <SelectItem value="sedans">Sedans (Executivo)</SelectItem>
                    <SelectItem value="hatches">Compactos</SelectItem>
                    <SelectItem value="acessivel">Táxi Acessível (Adaptado) ♿</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="brand" className="text-xs font-bold text-slate-700">Marca</Label>
            <Input 
              id="brand" 
              value={formData.brand || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              placeholder="Ex: Toyota"
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="year" className="text-xs font-bold text-slate-700">Ano Fabricação</Label>
            <Input 
              id="year" 
              value={formData.year || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
              placeholder="Ex: 2024"
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Câmbio</Label>
            <Select 
              value={formData.transmission} 
              onValueChange={(val: any) => setFormData(prev => ({ ...prev, transmission: val }))}
            >
              <SelectTrigger className="bg-white border-slate-200 text-slate-800">
                <SelectValue placeholder="Câmbio" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-700">
                <SelectItem value="automatic">Automático</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-700">Combustível</Label>
            <Select 
              value={formData.fuelType} 
              onValueChange={(val: any) => setFormData(prev => ({ ...prev, fuelType: val }))}
            >
              <SelectTrigger className="bg-white border-slate-200 text-slate-800">
                <SelectValue placeholder="Combustível" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200 text-slate-700">
                <SelectItem value="flex">Flex (Álcool/Gasolina)</SelectItem>
                <SelectItem value="hybrid">Híbrido</SelectItem>
                <SelectItem value="electric">Elétrico</SelectItem>
                <SelectItem value="gasoline">Gasolina</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* PARTE DE PRECIFICAÇÃO E ORDENAÇÃO */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="dailyPrice" className="text-xs font-bold text-slate-700">Preço Diário Médio (R$)</Label>
            <Input 
              id="dailyPrice" 
              type="number"
              value={formData.dailyPrice || 0} 
              onChange={(e) => handleDailyPriceChange(Number(e.target.value))}
              placeholder="Ex: 85"
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="weeklyPrice" className="text-xs font-bold text-slate-700">Preço Semanal (R$)</Label>
            <Input 
              id="weeklyPrice" 
              type="number"
              value={formData.weeklyPrice || 0} 
              onChange={(e) => handleWeeklyPriceChange(Number(e.target.value))}
              placeholder="Ex: 510"
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="monthlyPrice" className="text-xs font-bold text-slate-700">Preço Mensal (R$)</Label>
            <Input 
              id="monthlyPrice" 
              type="number"
              value={formData.monthlyPrice || 0} 
              onChange={(e) => handleMonthlyPriceChange(Number(e.target.value))}
              placeholder="Ex: 2600"
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="catalogOrder" className="text-xs font-bold text-slate-700">Ordem Catalog (Exibição)</Label>
            <Input 
              id="catalogOrder" 
              type="number"
              value={formData.catalogOrder || 0} 
              onChange={(e) => setFormData(prev => ({ ...prev, catalogOrder: Number(e.target.value) }))}
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {/* FLAGS DO VEÍCULO */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {!isJuridico && (
            <>
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="isHybrid" 
                  checked={formData.isHybrid || false} 
                  onChange={(e) => setFormData(prev => ({ ...prev, isHybrid: e.target.checked }))}
                  className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="isHybrid" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Híbrido 🔋</label>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="hasGNV" 
                  checked={formData.hasGNV || false} 
                  onChange={(e) => setFormData(prev => ({ ...prev, hasGNV: e.target.checked }))}
                  className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="hasGNV" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Kit GNV ⛽</label>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="isDTaxiApproved" 
                  checked={formData.isDTaxiApproved || false} 
                  onChange={(e) => setFormData(prev => ({ ...prev, isDTaxiApproved: e.target.checked }))}
                  className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <label htmlFor="isDTaxiApproved" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">D-TAXI Aeroporto ✈️</label>
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="featured" 
              checked={formData.featured || false} 
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <label htmlFor="featured" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Destaque Geral ★</label>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="catalogFeatured" 
              checked={formData.catalogFeatured || false} 
              onChange={(e) => setFormData(prev => ({ ...prev, catalogFeatured: e.target.checked }))}
              className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <label htmlFor="catalogFeatured" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Menu Catalog</label>
          </div>

          <div className="flex items-center gap-3">
            <input 
              type="checkbox" 
              id="available" 
              checked={formData.available || false} 
              onChange={(e) => setFormData(prev => ({ ...prev, available: e.target.checked }))}
              className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <label htmlFor="available" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Disponível Locação</label>
          </div>
        </div>

        <div className="h-px bg-slate-100" />

        {!isJuridico && (
          <>
            {/* PARÂMETROS DE ACESSIBILIDADE E HOMOLOGAÇÃO */}
            <div className="space-y-3">
              <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>Parâmetros de Acessibilidade & Homologação ♿</span>
                <span className="text-[10px] text-slate-400 font-semibold">(Preencha estes campos adicionais caso o veículo seja adaptado)</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 bg-slate-50/50 p-4 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isAccessible" 
                    checked={formData.isAccessible || false} 
                    onChange={(e) => setFormData(prev => {
                      const updated = { ...prev, isAccessible: e.target.checked }
                      if (e.target.checked) {
                        updated.category = "acessivel"
                      }
                      return updated;
                    })}
                    className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <label htmlFor="isAccessible" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Táxi Acessível Adaptado ♿</label>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isAtendeApproved" 
                    checked={formData.isAtendeApproved || false} 
                    onChange={(e) => setFormData(prev => ({ ...prev, isAtendeApproved: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <label htmlFor="isAtendeApproved" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Homologado no ATENDE ♿</label>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="hasRadioAssociation" 
                    checked={formData.hasRadioAssociation || false} 
                    onChange={(e) => setFormData(prev => ({ ...prev, hasRadioAssociation: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <label htmlFor="hasRadioAssociation" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Associação com Rádio 📻</label>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isDTPApproved" 
                    checked={formData.isDTPApproved || false} 
                    onChange={(e) => setFormData(prev => ({ ...prev, isDTPApproved: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <label htmlFor="isDTPApproved" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Credenciado DTP / DETAXI 🏢</label>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="hasDTPCourseSupport" 
                    checked={formData.hasDTPCourseSupport || false} 
                    onChange={(e) => setFormData(prev => ({ ...prev, hasDTPCourseSupport: e.target.checked }))}
                    className="h-4.5 w-4.5 rounded border-slate-200 bg-white text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <label htmlFor="hasDTPCourseSupport" className="text-xs font-semibold text-slate-700 cursor-pointer select-none">Suporte Curso Mobilidade 🎓</label>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />
          </>
        )}

        {/* DESCRIÇÃO E DETALHES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="shortDescription" className="text-xs font-bold text-slate-700">
              {isJuridico ? "Resumo do Serviço / Atuação" : "Descrição Curta (Catalog Card)"}
            </Label>
            <Textarea 
              id="shortDescription" 
              value={formData.shortDescription || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
              placeholder={isJuridico
                ? "Ex: Defesa especializada em autuações fiscais, recuperação tributária e blindagem patrimonial preventiva."
                : "Ex: Corolla Cross com kit GNV homologado para a fila de Congonhas. Diárias a partir de R$ 85."}
              className="bg-white border-slate-200 text-slate-800 min-h-[80px] focus-visible:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="fullDescription" className="text-xs font-bold text-slate-700">
              {isJuridico ? "Detalhamento e Escopo Jurídico" : "Descrição Completa (Ficha Técnica)"}
            </Label>
            <Textarea 
              id="fullDescription" 
              value={formData.fullDescription || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
              placeholder={isJuridico
                ? "Ex: Assessoria completa em processos administrativos e judiciais, auditoria de balanços e emissão de pareceres."
                : "Ex: Ficha técnica completa do veículo..."}
              className="bg-white border-slate-200 text-slate-800 min-h-[80px] focus-visible:ring-sky-500"
            />
          </div>
        </div>

        {/* ARRAYS DE DIFERENCIAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="positivePoints" className="text-xs font-bold text-slate-700">Pontos Positivos (Separados por vírgula)</Label>
            <Input 
              id="positivePoints" 
              value={formData.positivePoints?.join(", ") || ""} 
              onChange={(e) => handleArrayStringChange("positivePoints", e.target.value)}
              placeholder="Isenção de rodízio, Consumo eco-híbrido, Espaço família..."
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="highlights" className="text-xs font-bold text-slate-700">Diferenciais Premium (Separados por vírgula)</Label>
            <Input 
              id="highlights" 
              value={formData.highlights?.join(", ") || ""} 
              onChange={(e) => handleArrayStringChange("highlights", e.target.value)}
              placeholder="Bancos em couro, Câmbio borboleta, Faróis LED..."
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>
        </div>

        {/* SPECS E TAGS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="specs" className="text-xs font-bold text-slate-700">Especificações Técnicas (Separados por vírgula)</Label>
            <Input 
              id="specs" 
              value={formData.specs?.join(", ") || ""} 
              onChange={(e) => handleArrayStringChange("specs", e.target.value)}
              placeholder="Espaçoso, Econômico, Seguro..."
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="tags" className="text-xs font-bold text-slate-700">Tags Comerciais (Separados por vírgula)</Label>
            <Input 
              id="tags" 
              value={formData.tags?.join(", ") || ""} 
              onChange={(e) => handleArrayStringChange("tags", e.target.value)}
              placeholder="Mais Alugado, Novidade, Super Econômico..."
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>
        </div>

        {/* SEO CONFIG */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <Label htmlFor="seoTitle" className="text-xs font-bold text-slate-700">Título de SEO (Google Meta Title)</Label>
            <Input 
              id="seoTitle" 
              value={formData.seoTitle || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
              placeholder={isJuridico ? `Assessoria Jurídica Especializada | ${BRAND.name}` : `Aluguel de Veículos | ${BRAND.name}`}
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="seoDescription" className="text-xs font-bold text-slate-700">Descrição de SEO (Meta Description)</Label>
            <Input 
              id="seoDescription" 
              value={formData.seoDescription || ""} 
              onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
              placeholder={isJuridico ? `Atuação jurídica de alta complexidade em ${BRAND.professional.city || BRAND.name}...` : `Melhores condições de locação com suporte 24h...`}
              className="bg-white border-slate-200 text-slate-800 focus-visible:ring-sky-500"
            />
          </div>
        </div>

        {/* SUBMIT ACTIONS */}
        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Save className="h-4 w-4" /> Salvar Veículo
          </Button>
        </div>

      </form>
    </div>
  )
}
