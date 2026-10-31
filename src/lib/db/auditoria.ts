import { supabase } from "@/lib/supabase"
import type { AuditLogRow } from "@/types/database"

/** Registro da trilha de auditoria (tabela `audit_log`, migration 0009). */
export interface RegistroAuditoria {
  id: number
  createdAt: string
  entidade: string
  registroId: string
  acao: AuditLogRow["acao"]
  camposAlterados: string[]
  autorNome: string
}

/**
 * Últimos registros, do mais novo para o mais antigo. Só o super admin
 * recebe linhas — para os demais o RLS devolve lista vazia.
 */
export async function listarAuditoria(
  { entidade, registroId, limite = 200 }: { entidade?: string; registroId?: string; limite?: number } = {}
): Promise<RegistroAuditoria[]> {
  let query = supabase
    .from("audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limite)
  if (entidade) query = query.eq("entidade", entidade)
  if (registroId) query = query.eq("registro_id", registroId)

  const { data, error } = await query
  if (error) throw error
  return ((data ?? []) as AuditLogRow[]).map((r) => ({
    id: r.id,
    createdAt: r.created_at,
    entidade: r.entidade,
    registroId: r.registro_id,
    acao: r.acao,
    camposAlterados: r.campos_alterados ?? [],
    autorNome: r.autor_nome,
  }))
}
