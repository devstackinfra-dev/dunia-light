import { cache } from "react"
import { createServerReadClient } from "@/lib/supabase"
import { resolverConteudo, type ConteudoResolvido, type ConteudoSite } from "@/lib/conteudo-tipos"

export * from "@/lib/conteudo-tipos"

/** Chave em `app_settings` com os textos do cliente. */
export const CHAVE_CONTEUDO = "conteudo_site"

/**
 * Lê o conteúdo do cliente no servidor (uma vez por requisição). Banco fora
 * do ar ou sem conteúdo: vale o padrão da vertical, em até 3 s.
 */
export const getConteudo = cache(async (): Promise<ConteudoResolvido> => {
  try {
    const { data, error } = await createServerReadClient()
      .from("app_settings")
      .select("value")
      .eq("key", CHAVE_CONTEUDO)
      .abortSignal(AbortSignal.timeout(3000))
      .maybeSingle()
    if (error) throw error
    return resolverConteudo((data?.value as ConteudoSite | undefined) ?? null)
  } catch (err) {
    console.warn("[conteudo] Usando o padrão da vertical:", err instanceof Error ? err.message : err)
    return resolverConteudo(null)
  }
})
