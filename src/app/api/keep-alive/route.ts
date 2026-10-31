import { NextResponse } from "next/server"
import { createServerReadClient, supabaseConfigurado } from "@/lib/supabase"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/**
 * GET /api/keep-alive
 *
 * Mantém acordado o projeto Supabase do cliente. No plano gratuito o Supabase
 * pausa o projeto após 7 dias sem atividade no banco — e site de escritório
 * com pouco tráfego chega lá fácil. Uma consulta real por dia basta.
 *
 * Quem chama é o cron do `vercel.json` (ou qualquer agendador externo). Com
 * CRON_SECRET definido, exige `Authorization: Bearer <CRON_SECRET>` — o mesmo
 * cabeçalho que o cron da Vercel envia sozinho.
 */
export async function GET(request: Request) {
  const segredo = process.env.CRON_SECRET
  if (segredo && request.headers.get("authorization") !== `Bearer ${segredo}`) {
    return NextResponse.json({ ok: false, error: "Não autorizado." }, { status: 401 })
  }

  if (!supabaseConfigurado()) {
    return NextResponse.json(
      { ok: false, code: "ENV_NOT_CONFIGURED", error: "Supabase não configurado." },
      { status: 503 }
    )
  }

  // Leitura pública (o RLS libera app_settings para anônimos): passa pela API
  // e chega ao Postgres, que é o que conta como atividade.
  const { error } = await createServerReadClient().from("app_settings").select("key").limit(1)

  if (error) {
    console.error("[keep-alive] Falha ao consultar o banco:", error.message)
    return NextResponse.json({ ok: false, error: "Falha ao consultar o banco." }, { status: 502 })
  }

  return NextResponse.json({ ok: true, at: new Date().toISOString() })
}
