import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { isAuthRetryableFetchError } from "@supabase/supabase-js"

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const CHAVE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

/**
 * Porteiro do painel.
 *
 * Roda antes de qualquer página de /admin: renova o token quando está perto de
 * vencer (gravando os cookies novos na resposta) e manda para o /login quem
 * não tem sessão. Assim o painel já chega ao navegador autenticado, sem spinner
 * de "verificando" e sem cada componente decidir sozinho quando redirecionar.
 *
 * Só cuida de SESSÃO. Perfil desativado ou sem acesso é tratado no painel —
 * redirecionar daqui viraria ping-pong com o /login.
 */
export async function middleware(request: NextRequest) {
  // Permite acesso direto ao Dúnia Experience OS (/admin/experiencias)
  if (request.nextUrl.pathname.startsWith("/admin/experiencias")) {
    return NextResponse.next()
  }
  // Template recém-clonado, sem .env.local: deixa a página mostrar o erro de configuração.
  if (!URL_SUPABASE || !CHAVE_ANON) return NextResponse.next()

  let response = NextResponse.next({ request })

  const supabase = createServerClient(URL_SUPABASE, CHAVE_ANON, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookies) {
        // Repassa ao request (para quem renderiza depois) e à resposta (para o navegador)
        cookies.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
      },
    },
  })

  // getClaims valida o JWT e renova a sessão quando necessário. Nada pode
  // rodar entre a criação do cliente e esta chamada.
  const { data, error } = await supabase.auth.getClaims()

  // Supabase fora do ar ou rede instável não significa "deslogado": deixa
  // passar e o painel tenta de novo. Os dados continuam protegidos pelo RLS.
  if (error && isAuthRetryableFetchError(error)) return response

  if (!data?.claims) {
    const login = request.nextUrl.clone()
    login.pathname = "/login"
    login.search = ""
    const redirect = NextResponse.redirect(login)
    // Leva junto os cookies limpos de uma sessão inválida
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie))
    return redirect
  }

  return response
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
