import { NextResponse } from "next/server"
import { getAdminClient, SupabaseAdminNotConfiguredError } from "@/lib/supabase-admin"
import { PRIVACY_POLICY_VERSION } from "@/config/privacidade"
import { BRAND } from "@/config/brand"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Envios do mesmo telefone aceitos dentro da janela abaixo. */
const LIMITE_POR_TELEFONE = 3
const JANELA_MINUTOS = 10

/** Limite por IP, por instância do servidor — barreira extra, não a principal. */
const LIMITE_POR_IP = 10
const enviosPorIp = new Map<string, number[]>()

function texto(valor: unknown, max: number): string | undefined {
  if (typeof valor !== "string") return undefined
  const limpo = valor.trim()
  return limpo ? limpo.slice(0, max) : undefined
}

function ipDe(request: Request): string {
  return (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "desconhecido"
}

function excedeuIp(ip: string): boolean {
  const agora = Date.now()
  const janela = JANELA_MINUTOS * 60 * 1000
  const recentes = (enviosPorIp.get(ip) || []).filter((t) => agora - t < janela)
  recentes.push(agora)
  enviosPorIp.set(ip, recentes)
  // Evita crescer sem limite numa instância que fica de pé por muito tempo
  if (enviosPorIp.size > 5000) enviosPorIp.clear()
  return recentes.length > LIMITE_POR_IP
}

const erro = (mensagem: string, status: number) =>
  NextResponse.json({ ok: false, error: mensagem }, { status })

/**
 * POST /api/leads — única porta de entrada de leads vindos do site.
 *
 * O visitante não grava mais direto no banco. Aqui o envio é validado, o
 * consentimento é exigido e registrado (LGPD: data, versão da política e
 * origem), envios repetidos são limitados e o insert sai com service_role.
 * O trigger do banco ainda saneia o que não é dado de contato.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return erro("Requisição inválida.", 400)
  }

  // Campo-isca preenchido: robô. Responde sucesso e não grava nada.
  if (texto(body.website, 200)) return NextResponse.json({ ok: true })

  const nome = texto(body.fullName, 200)
  const telefone = texto(body.phone, 40)
  const digitos = (telefone || "").replace(/\D/g, "")
  const email = texto(body.email, 200)
  const relato = texto(body.message, 5000)
  const areaSlug = texto(body.areaSlug, 80)

  if (!nome || nome.length < 2) return erro("Informe seu nome.", 400)
  if (digitos.length < 10 || digitos.length > 13) return erro("Informe um telefone com DDD.", 400)
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return erro("E-mail inválido.", 400)
  if (body.consent !== true) {
    return erro("Para enviar, é preciso concordar com a política de privacidade.", 400)
  }

  if (excedeuIp(ipDe(request))) {
    return erro("Muitos envios seguidos. Aguarde alguns minutos e tente de novo.", 429)
  }

  let admin
  try {
    admin = getAdminClient()
  } catch (err) {
    if (err instanceof SupabaseAdminNotConfiguredError) return erro("Servidor sem configuração.", 503)
    throw err
  }

  try {
    // Mesmo telefone várias vezes em poucos minutos: clique duplo ou abuso
    // (compara só os dígitos, em código: o telefone digitado nunca entra num filtro)
    const desde = new Date(Date.now() - JANELA_MINUTOS * 60 * 1000).toISOString()
    const { data: recentes } = await admin
      .from("leads")
      .select("phone")
      .gte("created_at", desde)
      .limit(500)
    const repetidos = (recentes ?? []).filter((r) => r.phone.replace(/\D/g, "") === digitos).length
    if (repetidos >= LIMITE_POR_TELEFONE) {
      return erro("Já recebemos o seu contato. Em breve retornaremos.", 429)
    }

    // A área precisa existir e estar ativa; o nome é copiado para o histórico
    let area: { slug: string; nome: string } | null = null
    if (areaSlug) {
      const { data } = await admin.from("areas").select("slug, nome").eq("slug", areaSlug).eq("ativo", true).maybeSingle()
      area = data
    }
    if (BRAND.vertical === "juridico" && areaSlug && !area) return erro("Área de atuação inválida.", 400)

    const utmBruto = (body.utm && typeof body.utm === "object" ? body.utm : {}) as Record<string, unknown>
    const utm = Object.fromEntries(
      ["source", "medium", "campaign", "content", "term"]
        .map((k) => [k, texto(utmBruto[k], 120)])
        .filter(([, v]) => v)
    )

    const { error } = await admin.from("leads").insert({
      full_name: nome,
      phone: telefone!,
      email: email ?? null,
      client_message: relato ?? null,
      area_slug: area?.slug ?? null,
      area_name: area?.nome ?? null,
      item_interest: area?.nome ?? texto(body.itemInterest, 300) ?? null,
      source: texto(body.source, 120) ?? "Site",
      campaign_id: texto(body.campaignId, 120) ?? null,
      campaign_name: texto(body.campaignName, 200) ?? null,
      utm,
      landing_page: texto(body.landingPage, 300) ?? null,
      referrer: texto(body.referrer, 300) ?? null,
      consent_at: new Date().toISOString(),
      consent_version: PRIVACY_POLICY_VERSION,
      consent_source: "formulario-site",
    })

    if (error) {
      console.error("[api/leads] Falha ao gravar lead:", error.message)
      return erro("Não foi possível enviar agora. Tente novamente em instantes.", 500)
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err) {
    console.error("[api/leads] Erro inesperado:", err)
    return erro("Não foi possível enviar agora. Tente novamente em instantes.", 500)
  }
}
