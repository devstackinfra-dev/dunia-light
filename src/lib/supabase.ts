import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "@/types/database"

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const CHAVE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

/** Exposta para montar URLs de Storage. Vazia quando o ambiente não foi configurado. */
export const supabaseUrl = URL_SUPABASE

/** Cliente tipado pelo schema — `select` em coluna inexistente vira erro de compilação. */
export type TypedSupabaseClient = SupabaseClient<Database>

/** O ambiente está configurado? Útil para telas de diagnóstico. */
export function supabaseConfigurado(): boolean {
  return Boolean(URL_SUPABASE && CHAVE_ANON)
}

function exigirConfig() {
  if (!supabaseConfigurado()) {
    throw new Error(
      "Supabase não configurado. Copie .env.example para .env.local e preencha " +
        "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY."
    )
  }
}

/**
 * Singleton — uma única instância no browser.
 * Evita o aviso "Multiple GoTrueClient instances detected".
 */
let _instancia: TypedSupabaseClient | null = null

function criarCliente(): TypedSupabaseClient {
  if (_instancia) return _instancia
  exigirConfig()

  if (typeof window === "undefined") {
    // Algum módulo importado no servidor tocou o cliente. Lá não há sessão do
    // usuário — cria um cliente anônimo e descartável, como o de leitura abaixo.
    return createClient<Database>(URL_SUPABASE, CHAVE_ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }

  // A sessão vive em cookies, não no localStorage: o middleware consegue lê-la
  // e renová-la no servidor, e o iOS não a apaga após dias sem abrir o PWA.
  // O fluxo é PKCE (o link de redefinição de senha chega com ?code=...).
  _instancia = createBrowserClient<Database>(URL_SUPABASE, CHAVE_ANON)
  return _instancia
}

/**
 * Cliente público (browser-safe) — usa a anon key e respeita o RLS.
 *
 * É um Proxy de propósito: o cliente só é construído no primeiro acesso real.
 * Sem isso, `next build` quebra ao apenas IMPORTAR este módulo num ambiente sem
 * credenciais — que é exatamente o estado de um template recém-clonado.
 */
export const supabase: TypedSupabaseClient = new Proxy({} as TypedSupabaseClient, {
  get(_alvo, prop, receptor) {
    const cliente = criarCliente() as unknown as Record<string | symbol, unknown>
    const valor = Reflect.get(cliente, prop, receptor)
    return typeof valor === "function" ? valor.bind(cliente) : valor
  },
})

/**
 * Cliente de leitura para Server Components (ex.: metadata de /c/{slug}).
 *
 * Sem sessão: enxerga exatamente o que um visitante anônimo enxerga pelo RLS.
 * Não é singleton de propósito — cada render no servidor cria o seu, evitando
 * vazar estado entre requisições.
 */
export function createServerReadClient(): TypedSupabaseClient {
  exigirConfig()
  return createClient<Database>(URL_SUPABASE, CHAVE_ANON, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/**
 * Bucket names registrados no Supabase Storage
 */
export const BUCKETS = {
  products: "products",
  banners: "banners",
  logos: "logos",
} as const

/**
 * Base URL pública do Supabase Storage
 */
export const SUPABASE_STORAGE_BASE = `${supabaseUrl}/storage/v1/object/public`

/**
 * Gera a URL pública de uma imagem no Supabase Storage
 */
export function getSupabaseImageUrl(bucket: string, filename: string): string {
  return `${SUPABASE_STORAGE_BASE}/${bucket}/${filename}`
}

/**
 * Gera URL otimizada com transformação de imagem (redimensionamento + qualidade)
 * Requer que a feature de transformação esteja ativa no projeto Supabase.
 */
export function getOptimizedImageUrl(
  bucket: string,
  filename: string,
  width = 800,
  quality = 80
): string {
  // Fallback to direct public URL to avoid 403 transformation errors
  return getSupabaseImageUrl(bucket, filename)
}

/**
 * Tenta otimizar uma URL caso ela pertença ao Supabase Storage deste projeto.
 * Se não for do Supabase, retorna a URL original sem alterações.
 */
export function optimizeImageUrl(url: string, width = 600, quality = 80): string {
  // Always return direct URL to bypass paid Image Transformation 403 limitations
  return url
}

/**
 * URLs diretas das imagens de veículos já enviadas ao Supabase
 */
export const PRODUCT_IMAGES: Record<string, string> = {
  "corolla-cross":    getSupabaseImageUrl("products", "corolla-cross.png"),
  "corolla":          getSupabaseImageUrl("products", "corolla.png"),
  "prius":            getSupabaseImageUrl("products", "prius.png"),
  "ioniq":            getSupabaseImageUrl("products", "ioniq.png"),
  "dtaxi-spin":       getSupabaseImageUrl("products", "dtaxi-spin.png"),
  "spin-big":         getSupabaseImageUrl("products", "spin-big.png"),
  "virtus":           getSupabaseImageUrl("products", "virtus.png"),
  "onix-plus":        getSupabaseImageUrl("products", "onix-plus.png"),
  "polo":             getSupabaseImageUrl("products", "polo.png"),
  "logan":            getSupabaseImageUrl("products", "logan.png"),
  "cronos":           getSupabaseImageUrl("products", "cronos.png"),
  "gol":              getSupabaseImageUrl("products", "gol.png"),
  "versa":            getSupabaseImageUrl("products", "versa.png"),
  "voyage":           getSupabaseImageUrl("products", "voyage.png"),
  "c3":               getSupabaseImageUrl("products", "c3.png"),
  "c3-aircross":      getSupabaseImageUrl("products", "c3-aircross.png"),
}

export const BANNER_IMAGES: Record<string, string> = {
  "banner-1":          getSupabaseImageUrl("banners", "banner-1.png"),
  "banner-2":          getSupabaseImageUrl("banners", "banner-2.png"),
  "banner-3":          getSupabaseImageUrl("banners", "banner-3.png"),
  "dtaxi-partnership": getSupabaseImageUrl("banners", "dtaxi-partnership.png"),
  "novo-polo-2025":    getSupabaseImageUrl("banners", "novo-polo-2025.jpeg"),
}

export const LOGO_IMAGES = {
  primary:  getSupabaseImageUrl("logos", "logo.png"),
  banner:   getSupabaseImageUrl("logos", "logo-light.png"),
}
