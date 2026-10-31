/**
 * Cria o primeiro super_admin de um projeto (ou promove um usuário existente).
 *
 *   node scripts/criar-super-admin.mjs email@cliente.com.br "Nome Completo"
 *
 * Lê NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY do .env.local — ou
 * seja, age no banco que estiver configurado ali. Confira antes de rodar.
 *
 * A senha é gerada aleatoriamente e exibida UMA vez. Nunca há senha fixa no
 * código: uma senha escrita aqui viraria porta dos fundos em todo cliente.
 * Usuário que já existe NÃO tem a senha trocada; use "Esqueci minha senha".
 */
import fs from "fs"
import path from "path"
import { randomBytes } from "crypto"
import { createClient } from "@supabase/supabase-js"

const envPath = path.resolve(process.cwd(), ".env.local")
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8")
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=")
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim()
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "")
        if (!process.env[key]) process.env[key] = val
      }
    }
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const email = (process.argv[2] || "").trim().toLowerCase()
const nome = (process.argv[3] || "").trim() || "Administrador"

if (!supabaseUrl || !serviceKey) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY ausentes no .env.local")
  process.exit(1)
}

if (!email || !email.includes("@")) {
  console.error('Uso: node scripts/criar-super-admin.mjs email@cliente.com.br "Nome Completo"')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
})

async function buscarPorEmail(alvo) {
  // listUsers é paginado; procura página a página
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    const achado = data.users.find((u) => u.email?.toLowerCase() === alvo)
    if (achado || data.users.length < 200) return achado ?? null
  }
  return null
}

async function run() {
  console.log(`🔍 Projeto: ${new URL(supabaseUrl).hostname}`)

  let usuario = await buscarPorEmail(email)
  let senhaGerada = null

  if (!usuario) {
    senhaGerada = randomBytes(12).toString("base64url") + "A1!"
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: senhaGerada,
      email_confirm: true,
      user_metadata: { display_name: nome },
    })
    if (error || !data.user) {
      console.error("❌ Erro ao criar usuário:", error?.message)
      process.exit(1)
    }
    usuario = data.user
    console.log("✅ Usuário criado no Supabase Auth.")
  } else {
    console.log("ℹ️ Usuário já existe no Auth — senha mantida.")
  }

  const { error: perfilErr } = await supabase.from("admin_users").upsert({
    id: usuario.id,
    email,
    display_name: nome,
    role: "super_admin",
    active: true,
  })
  if (perfilErr) {
    console.error("❌ Erro ao gravar perfil em admin_users:", perfilErr.message)
    process.exit(1)
  }
  console.log("✅ Perfil super_admin ativo em admin_users.")

  if (senhaGerada) {
    console.log("\n==========================================")
    console.log(`   E-mail: ${email}`)
    console.log(`   Senha temporária: ${senhaGerada}`)
    console.log("   Entregue por canal seguro e peça para trocar")
    console.log("   no primeiro acesso (Esqueci minha senha).")
    console.log("==========================================")
  }
}

run().catch((err) => {
  console.error("❌ Falha:", err?.message || err)
  process.exit(1)
})
