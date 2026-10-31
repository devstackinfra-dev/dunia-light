import { cache } from "react"
import { createServerReadClient } from "@/lib/supabase"
import { areasPadrao } from "@/lib/db/areas"
import type { AreaRow } from "@/types/database"
import type { Area } from "@/types/area"
import type { IconName } from "@/config/home-content"

/**
 * Áreas de atuação para as páginas públicas, lidas no servidor (SEO).
 *
 * Usa o cliente anônimo: o RLS entrega só as ativas. Sem banco configurado,
 * com a tabela vazia ou com o banco fora do ar, valem as áreas padrão da
 * vertical — o site nunca fica com a seção quebrada.
 */
// `cache`: metadados, página e lista de "outras áreas" fazem uma consulta só por requisição
export const getAreasPublicas = cache(async (): Promise<Area[]> => {
  try {
    const { data, error } = await createServerReadClient()
      .from("areas")
      .select("*")
      .eq("ativo", true)
      .order("ordem", { ascending: true })
      .order("nome", { ascending: true })
      // Banco fora do ar não pode segurar a página: em 3 s, valem as áreas padrão
      .abortSignal(AbortSignal.timeout(3000))
    if (error) throw error
    if (data && data.length > 0) {
      return (data as AreaRow[]).map((row) => ({
        id: row.id,
        slug: row.slug,
        nome: row.nome,
        resumo: row.resumo,
        contexto: row.contexto ?? undefined,
        icone: row.icone as IconName,
        imagem: row.imagem ?? undefined,
        situacoes: row.situacoes ?? [],
        servicos: Array.isArray(row.servicos) ? row.servicos : [],
        ordem: row.ordem,
        ativo: row.ativo,
        destaque: row.destaque,
      }))
    }
  } catch (err) {
    console.warn("[areas] Usando as áreas padrão da vertical:", err instanceof Error ? err.message : err)
  }
  return areasPadrao().map((a) => ({ ...a, id: a.slug }))
})

export async function getAreaPublica(slug: string): Promise<Area | null> {
  const areas = await getAreasPublicas()
  return areas.find((a) => a.slug === slug) ?? null
}
