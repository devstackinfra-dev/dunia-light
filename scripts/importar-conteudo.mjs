/**
 * Importa o conteúdo de um cliente para o banco DELE.
 *
 *   node scripts/importar-conteudo.mjs clientes/<cliente>/conteudo.json             (só confere)
 *   node scripts/importar-conteudo.mjs clientes/<cliente>/conteudo.json --aplicar   (grava)
 *
 * O arquivo traz `conteudo_site` (textos da home e perfil do profissional) e
 * `areas` (áreas de atuação). Antes de qualquer coisa, todo o texto passa pelo
 * verificador do Provimento 205/2021; com vedação grave, nada é gravado.
 *
 * Grava no projeto do .env.local (NEXT_PUBLIC_SUPABASE_URL +
 * SUPABASE_SERVICE_ROLE_KEY). O script mostra qual é — confira antes.
 */
import fs from "node:fs"
import path from "node:path"
import { pathToFileURL } from "node:url"
import { createClient } from "@supabase/supabase-js"

const { verificarTexto, normalizarSeveridade } = await import(
  pathToFileURL(path.resolve("src/lib/compliance.ts")).href
)

const envPath = path.resolve(".env.local")
if (fs.existsSync(envPath)) {
  for (const linha of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const l = linha.trim()
    const i = l.indexOf("=")
    if (l && !l.startsWith("#") && i > 0) {
      const chave = l.slice(0, i).trim()
      if (!process.env[chave]) process.env[chave] = l.slice(i + 1).trim().replace(/^["']|["']$/g, "")
    }
  }
}

const arquivo = process.argv[2]
const aplicar = process.argv.includes("--aplicar")
if (!arquivo || !fs.existsSync(arquivo)) {
  console.error("Uso: node scripts/importar-conteudo.mjs clientes/<cliente>/conteudo.json [--aplicar]")
  process.exit(1)
}

const dados = JSON.parse(fs.readFileSync(arquivo, "utf-8"))

// ─── 1. Verificador da OAB sobre todo o texto ─────────────────────────────────
const textos = []
const coletar = (valor, caminho) => {
  if (typeof valor === "string") textos.push([caminho, valor])
  else if (Array.isArray(valor)) valor.forEach((v, i) => coletar(v, `${caminho}[${i}]`))
  else if (valor && typeof valor === "object") {
    for (const [k, v] of Object.entries(valor)) {
      // URLs, slugs, ícones e cores não são texto publicitário
      if (!["url", "slug", "icone", "icon", "foto", "imagem", "sections"].includes(k)) coletar(v, `${caminho}.${k}`)
    }
  }
}
coletar(dados.conteudo_site, "conteudo_site")
coletar(dados.areas, "areas")

let bloqueios = 0
for (const [campo, texto] of textos) {
  for (const a of verificarTexto(texto, campo)) {
    const sev = normalizarSeveridade(a.regra.severidade)
    if (sev === "INFO") continue
    if (sev === "BLOCKER") bloqueios++
    console.log(`${sev.padEnd(14)} ${campo}: "${a.trecho}" — ${a.regra.rotulo}`)
  }
}
console.log(`\nVerificador OAB: ${textos.length} textos, ${bloqueios} vedação(ões) grave(s).`)
if (bloqueios > 0) {
  console.error("Corrija as vedações antes de importar.")
  process.exit(1)
}
if (!aplicar) {
  console.log("Conferência concluída. Para gravar, rode de novo com --aplicar.")
  process.exit(0)
}

// ─── 2. Gravação ──────────────────────────────────────────────────────────────
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const chave = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !chave) {
  console.error("NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são necessárias no .env.local")
  process.exit(1)
}
console.log(`\nGravando no projeto: ${new URL(url).hostname}`)
const supabase = createClient(url, chave, { auth: { persistSession: false } })

if (dados.conteudo_site) {
  const { error } = await supabase.from("app_settings").upsert({ key: "conteudo_site", value: dados.conteudo_site })
  if (error) { console.error("Textos do site:", error.message); process.exit(1) }
  console.log("✓ Textos do site e perfil")
}

for (const area of dados.areas ?? []) {
  const { error } = await supabase.from("areas").upsert({
    slug: area.slug, nome: area.nome, resumo: area.resumo ?? "", contexto: area.contexto ?? null,
    icone: area.icone ?? "file", imagem: area.imagem ?? null, situacoes: area.situacoes ?? [],
    servicos: area.servicos ?? [], ordem: area.ordem ?? 0, ativo: area.ativo ?? true, destaque: area.destaque ?? false,
  }, { onConflict: "slug" })
  if (error) { console.error(`Área ${area.slug}:`, error.message); process.exit(1) }
  console.log(`✓ Área ${area.nome}`)
}

console.log("\nPronto. O site mostra o conteúdo novo em até 5 minutos.")
if (dados.variaveis_vercel) {
  console.log("\nVariáveis para a Vercel deste cliente:")
  for (const [k, v] of Object.entries(dados.variaveis_vercel)) console.log(`  ${k}=${v}`)
}
