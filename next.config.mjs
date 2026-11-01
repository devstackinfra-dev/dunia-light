import withPWAInit from "@ducanh2912/next-pwa";

/**
 * PWA restrito ao painel administrativo.
 *
 * `register: false` impede o next-pwa de injetar o registro do service worker em
 * todas as páginas — quem registra é o <AdminPWA/>, com escopo "/admin/". Assim o
 * site institucional continua sendo um site comum (sem SW, sem manifest, sem
 * prompt de instalação) e só a intranet funciona como app instalável.
 */
const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: false,
  scope: "/admin/",
  // A nova versão fica em "waiting" até o usuário confirmar no aviso do painel,
  // em vez de recarregar a intranet sozinha no meio de um formulário. Com este
  // valor o next-pwa injeta no sw.js o listener da mensagem SKIP_WAITING, que é
  // o que o botão "Atualizar" do <AdminPWA/> dispara.
  skipWaiting: false,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  // O precache é do painel, não do site: as imagens institucionais somam
  // dezenas de MB de PNG e nenhuma delas é usada pela intranet.
  publicExcludes: [
    "!images/**/*",
    "!icons/**/*",
    "!*.webmanifest",
  ],
  workboxOptions: {
    // Precisa ser repetido aqui: o `skipWaiting` de nível superior não chega ao
    // workbox-build, que por padrão emitiria `self.skipWaiting()` no bundle.
    skipWaiting: false,
    clientsClaim: false,
    // Sem fallback de navegação: o painel exige rede para autenticar, e um
    // shell offline serviria uma tela de login que não funciona.
    navigateFallback: undefined,
    exclude: [/\.map$/, /^manifest.*\.js$/],
    runtimeCaching: [
      {
        // Rotas internas e dados do Supabase (REST, auth, URLs assinadas):
        // nunca em cache — dado de lead não pode ficar guardado no aparelho.
        urlPattern: /^https:\/\/[a-z0-9]+\.supabase\.co\/(rest|auth|storage\/v1\/object\/sign)\/.*/i,
        handler: "NetworkOnly",
      },
      {
        urlPattern: /\/api\/.*/i,
        handler: "NetworkOnly",
      },
      {
        // Imagens do Supabase Storage: cache longo, revalidando em segundo plano
        urlPattern: /^https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "supabase-media",
          expiration: { maxEntries: 200, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
    ],
  },
});

/**
 * Host do Supabase do cliente, lido do ambiente. Cada advogado tem o próprio
 * projeto, então o domínio das imagens não pode ficar escrito aqui.
 */
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname
  } catch {
    return ""
  }
})()

/** Cabeçalhos de segurança aplicados a todo o site. */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Ninguém embute o site em iframe (clickjacking)
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Imagens do Storage do cliente e banco fotográfico de alta resolução (Unsplash)
    remotePatterns: [
      ...(supabaseHost
        ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
        : []),
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "duniacityhall.com.br", pathname: "/**" },
      { protocol: "https", hostname: "www.duniacityhall.com.br", pathname: "/**" },
      { protocol: "https", hostname: "api.qrserver.com", pathname: "/**" },
    ],
    // Formatos modernos para melhor performance
    formats: ["image/avif", "image/webp"],
    // Cache de imagens por 1 hora
    minimumCacheTTL: 3600,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // O painel nunca deve ser indexado, embutido nem guardado em cache
        // compartilhado (proxy, CDN) — é sempre da sessão de quem está logado.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default withPWA(nextConfig);
