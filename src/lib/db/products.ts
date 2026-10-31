import { supabase } from "@/lib/supabase"
import type { ProductRow, ProductPricingRow } from "@/types/database"
import type { Product } from "@/types/product"

export function rowToProduct(row: ProductRow, pricingRow?: ProductPricingRow | null): Product {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug ?? undefined,
    category: row.category ?? undefined,
    brand: row.brand ?? undefined,
    year: row.year ?? undefined,
    transmission: (row.transmission as Product["transmission"]) ?? undefined,
    fuelType: (row.fuel_type as Product["fuelType"]) ?? undefined,
    isHybrid: row.is_hybrid,
    hasGNV: row.has_gnv,
    isDTaxiApproved: row.is_dtaxi_approved,
    isAccessible: row.is_accessible,
    isAtendeApproved: row.is_atende_approved,
    hasRadioAssociation: row.has_radio_association,
    isDTPApproved: row.is_dtp_approved,
    hasDTPCourseSupport: row.has_dtp_course_support,
    shortDescription: row.short_description ?? undefined,
    fullDescription: row.full_description ?? undefined,
    positivePoints: row.positive_points ?? [],
    highlights: row.highlights ?? [],
    status: (row.status as Product["status"]) ?? "active",
    available: row.available,
    featured: row.featured,
    catalogFeatured: row.catalog_featured,
    catalogOrder: row.catalog_order ?? undefined,
    leadCount: row.lead_count ?? 0,
    viewsCount: row.views_count ?? 0,
    clicksCount: row.clicks_count ?? 0,
    thumbnail: row.thumbnail ?? undefined,
    images: row.images ?? [],
    specs: row.specs ?? [],
    tags: row.tags ?? [],
    seoTitle: row.seo_title ?? undefined,
    seoDescription: row.seo_description ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    dailyPrice: pricingRow ? pricingRow.daily_rate : undefined,
    weeklyPrice: pricingRow ? pricingRow.weekly_rate : undefined,
    monthlyPrice: pricingRow ? pricingRow.monthly_rate : undefined,
    pricing: pricingRow
      ? {
          id: pricingRow.id,
          productId: pricingRow.product_id,
          dailyRate: pricingRow.daily_rate,
          weeklyRate: pricingRow.weekly_rate,
          monthlyRate: pricingRow.monthly_rate,
          weekendExempt: pricingRow.weekend_exempt,
          acceptedPayments: pricingRow.accepted_payments,
          active: pricingRow.active,
          promoCampaign: pricingRow.promo_campaign ?? undefined,
        }
      : undefined,
  }
}

export function productToRow(v: Partial<Product>): Partial<ProductRow> {
  const row: Partial<ProductRow> = {}
  if (v.name !== undefined) row.name = v.name
  if (v.slug !== undefined) row.slug = v.slug ?? null
  if (v.category !== undefined) row.category = v.category ?? null
  if (v.brand !== undefined) row.brand = v.brand ?? null
  if (v.year !== undefined) row.year = v.year ?? null
  if (v.transmission !== undefined) row.transmission = v.transmission ?? null
  if (v.fuelType !== undefined) row.fuel_type = v.fuelType ?? null
  if (v.isHybrid !== undefined) row.is_hybrid = v.isHybrid
  if (v.hasGNV !== undefined) row.has_gnv = v.hasGNV
  if (v.isDTaxiApproved !== undefined) row.is_dtaxi_approved = v.isDTaxiApproved
  if (v.isAccessible !== undefined) row.is_accessible = v.isAccessible
  if (v.isAtendeApproved !== undefined) row.is_atende_approved = v.isAtendeApproved
  if (v.hasRadioAssociation !== undefined) row.has_radio_association = v.hasRadioAssociation
  if (v.isDTPApproved !== undefined) row.is_dtp_approved = v.isDTPApproved
  if (v.hasDTPCourseSupport !== undefined) row.has_dtp_course_support = v.hasDTPCourseSupport
  if (v.shortDescription !== undefined) row.short_description = v.shortDescription ?? null
  if (v.fullDescription !== undefined) row.full_description = v.fullDescription ?? null
  if (v.positivePoints !== undefined) row.positive_points = v.positivePoints
  if (v.highlights !== undefined) row.highlights = v.highlights
  if (v.status !== undefined) row.status = v.status ?? "active"
  if (v.available !== undefined) row.available = v.available
  if (v.featured !== undefined) row.featured = v.featured
  if (v.catalogFeatured !== undefined) row.catalog_featured = v.catalogFeatured
  if (v.catalogOrder !== undefined) row.catalog_order = v.catalogOrder
  if (v.thumbnail !== undefined) row.thumbnail = v.thumbnail ?? null
  if (v.images !== undefined) row.images = v.images
  if (v.specs !== undefined) row.specs = v.specs
  if (v.tags !== undefined) row.tags = v.tags
  if (v.seoTitle !== undefined) row.seo_title = v.seoTitle ?? null
  if (v.seoDescription !== undefined) row.seo_description = v.seoDescription ?? null
  return row
}

export async function listProducts(): Promise<Product[]> {
  const [productsRes, pricingRes] = await Promise.all([
    supabase.from("products").select("*").order("catalog_order", { ascending: true }),
    supabase.from("product_pricing").select("*"),
  ])

  if (productsRes.error) throw productsRes.error

  const pricingMap = new Map<string, ProductPricingRow>()
  if (pricingRes.data) {
    for (const p of pricingRes.data as ProductPricingRow[]) {
      pricingMap.set(p.product_id, p)
    }
  }

  return (productsRes.data ?? []).map((row) =>
    rowToProduct(row as ProductRow, pricingMap.get(row.id))
  )
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const [vRes, pRes] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).maybeSingle(),
    supabase.from("product_pricing").select("*").eq("product_id", id).maybeSingle(),
  ])

  if (vRes.error) throw vRes.error
  if (!vRes.data) return null

  return rowToProduct(vRes.data as ProductRow, pRes.data as ProductPricingRow | null)
}

export async function createProduct(product: Partial<Product>): Promise<Product> {
  const row = productToRow(product)
  if (!row.name) throw new Error("Nome do veículo é obrigatório.")

  const { data, error } = await supabase.from("products").insert(row as any).select().single()
  if (error) throw error

  const createdRow = data as ProductRow
  let pricingRow: ProductPricingRow | null = null

  if (product.pricing || product.dailyPrice || product.weeklyPrice || product.monthlyPrice) {
    const p = product.pricing
    const pData = {
      product_id: createdRow.id,
      daily_rate: p?.dailyRate ?? product.dailyPrice ?? 0,
      weekly_rate: p?.weeklyRate ?? product.weeklyPrice ?? 0,
      monthly_rate: p?.monthlyRate ?? product.monthlyPrice ?? 0,
      weekend_exempt: p?.weekendExempt ?? false,
      accepted_payments: p?.acceptedPayments ?? ["pix", "cartao", "boleto"],
      active: p?.active ?? true,
      promo_campaign: p?.promoCampaign ?? null,
    }
    const { data: pRes } = await supabase.from("product_pricing").insert(pData).select().single()
    if (pRes) pricingRow = pRes as ProductPricingRow
  }

  return rowToProduct(createdRow, pricingRow)
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<void> {
  const row = productToRow(patch)
  if (Object.keys(row).length > 0) {
    const { error } = await supabase.from("products").update(row).eq("id", id)
    if (error) throw error
  }

  if (patch.pricing || patch.dailyPrice !== undefined || patch.weeklyPrice !== undefined || patch.monthlyPrice !== undefined) {
    const p = patch.pricing
    const pData: Partial<ProductPricingRow> = {}
    if (p?.dailyRate !== undefined || patch.dailyPrice !== undefined)
      pData.daily_rate = p?.dailyRate ?? patch.dailyPrice
    if (p?.weeklyRate !== undefined || patch.weeklyPrice !== undefined)
      pData.weekly_rate = p?.weeklyRate ?? patch.weeklyPrice
    if (p?.monthlyRate !== undefined || patch.monthlyPrice !== undefined)
      pData.monthly_rate = p?.monthlyRate ?? patch.monthlyPrice
    if (p?.weekendExempt !== undefined) pData.weekend_exempt = p.weekendExempt
    if (p?.acceptedPayments !== undefined) pData.accepted_payments = p.acceptedPayments
    if (p?.active !== undefined) pData.active = p.active
    if (p?.promoCampaign !== undefined) pData.promo_campaign = p.promoCampaign ?? null

    const { error: pErr } = await supabase
      .from("product_pricing")
      .upsert({ product_id: id, ...pData } as any, { onConflict: "product_id" })

    if (pErr) throw pErr
  }
}

export async function saveProduct(productData: Partial<Product>, oldId?: string): Promise<void> {
  const slug = productData.slug?.trim() || productData.id || oldId
  if (!slug) throw new Error("Slug ou ID do veículo é obrigatório.")

  if (oldId && oldId !== slug) {
    await deleteProduct(oldId)
  }

  const existing = await fetchProduct(slug)
  if (existing) {
    await updateProduct(slug, productData)
  } else {
    await createProduct({ ...productData, id: slug })
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}

export async function incrementProductViews(id: string): Promise<void> {
  const v = await fetchProduct(id)
  if (v) {
    const current = v.viewsCount || 0
    await supabase.from("products").update({ views_count: current + 1 }).eq("id", id)
  }
}

export async function incrementProductClicks(id: string): Promise<void> {
  const v = await fetchProduct(id)
  if (v) {
    const current = v.clicksCount || 0
    await supabase.from("products").update({ clicks_count: current + 1 }).eq("id", id)
  }
}
