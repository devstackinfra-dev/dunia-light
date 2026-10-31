import { supabase } from "@/lib/supabase"
import type { AreaRow } from "@/types/database"
import type { Area } from "@/types/area"
import type { IconName } from "@/config/home-content"
import { HOME } from "@/config/home-content"

/**
 * Repositório de áreas de atuação (tabela `areas`).
 *
 * O site lê só as ativas (o RLS garante); o painel lê todas e edita.
 */

function rowToArea(row: AreaRow): Area {
  return {
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
  }
}

function areaToRow(area: Partial<Area>): Partial<AreaRow> {
  const row: Partial<AreaRow> = {}
  if (area.slug !== undefined) row.slug = area.slug
  if (area.nome !== undefined) row.nome = area.nome
  if (area.resumo !== undefined) row.resumo = area.resumo
  if (area.contexto !== undefined) row.contexto = area.contexto || null
  if (area.icone !== undefined) row.icone = area.icone
  if (area.imagem !== undefined) row.imagem = area.imagem || null
  if (area.situacoes !== undefined) row.situacoes = area.situacoes
  if (area.servicos !== undefined) row.servicos = area.servicos
  if (area.ordem !== undefined) row.ordem = area.ordem
  if (area.ativo !== undefined) row.ativo = area.ativo
  if (area.destaque !== undefined) row.destaque = area.destaque
  return row
}

/** "Direito de Família" → "direito-de-familia" */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}

/** Ativas, na ordem de exibição — para o site e o formulário de contato. */
export async function listActiveAreas(): Promise<Area[]> {
  const { data, error } = await supabase
    .from("areas")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true })
  if (error) throw error
  return (data ?? []).map((r) => rowToArea(r as AreaRow))
}

/** Todas, inclusive inativas — para o painel. */
export async function listAllAreas(): Promise<Area[]> {
  const { data, error } = await supabase
    .from("areas")
    .select("*")
    .order("ordem", { ascending: true })
    .order("nome", { ascending: true })
  if (error) throw error
  return (data ?? []).map((r) => rowToArea(r as AreaRow))
}

export async function createArea(area: Omit<Area, "id">): Promise<Area> {
  const { data, error } = await supabase.from("areas").insert(areaToRow(area) as AreaRow).select().single()
  if (error) throw error
  return rowToArea(data as AreaRow)
}

export async function updateArea(id: string, patch: Partial<Area>): Promise<void> {
  const { error } = await supabase.from("areas").update(areaToRow(patch)).eq("id", id)
  if (error) throw error
}

export async function deleteArea(id: string): Promise<void> {
  const { error } = await supabase.from("areas").delete().eq("id", id)
  if (error) throw error
}

/**
 * Áreas padrão da vertical (as de `home-content.ts`), no formato da tabela.
 * Usadas pelo botão "Carregar áreas padrão" do painel e como reserva do site
 * enquanto a tabela estiver vazia.
 */
export function areasPadrao(): Omit<Area, "id">[] {
  return HOME.areas.cards.map((card, i) => ({
    slug: slugify(card.title),
    nome: card.title,
    resumo: card.text,
    icone: card.icon,
    imagem: card.image,
    situacoes: card.situacoes ?? [],
    servicos: [],
    ordem: (i + 1) * 10,
    ativo: true,
    destaque: false,
  }))
}
