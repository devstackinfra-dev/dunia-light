import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import { getAdminClient } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Validade do link assinado: o bastante para abrir, curto demais para circular. */
const VALIDADE_SEGUNDOS = 60

/**
 * GET /api/lead-docs?path=leads_docs/<lead>/<arquivo>
 *
 * Abre um documento do bucket privado `lead-docs`. É usada direto em `<a href>`,
 * então a sessão vem do cookie (não do cabeçalho Authorization). Confere que
 * quem pede é admin ativo e redireciona para uma URL assinada de 60 segundos.
 * O link guardado na ficha do lead nunca expõe o arquivo por si só.
 */
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") || ""
  if (!path.startsWith("leads_docs/") || path.includes("..")) {
    return NextResponse.json({ error: "Documento inválido." }, { status: 400 })
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  if (!url || !anon) {
    return NextResponse.json({ error: "Supabase não configurado no servidor." }, { status: 503 })
  }

  const cookieStore = cookies()
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      // Só leitura: renovar o token é papel do middleware do /admin.
      setAll: () => {},
    },
  })

  // getUser valida o token no Supabase Auth — não confia só no cookie.
  const { data: userData } = await supabase.auth.getUser()
  const user = userData?.user
  if (!user) {
    return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 })
  }

  try {
    const admin = getAdminClient()

    const { data: perfil } = await admin
      .from("admin_users")
      .select("active")
      .eq("id", user.id)
      .maybeSingle()
    if (!perfil?.active) {
      return NextResponse.json({ error: "Sem permissão para abrir documentos." }, { status: 403 })
    }

    const { data, error } = await admin.storage
      .from("lead-docs")
      .createSignedUrl(path, VALIDADE_SEGUNDOS)
    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: "Documento não encontrado." }, { status: 404 })
    }

    const resposta = NextResponse.redirect(data.signedUrl, 302)
    resposta.headers.set("Cache-Control", "no-store")
    return resposta
  } catch (err) {
    console.error("[lead-docs] Falha ao abrir documento:", err)
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 })
  }
}
