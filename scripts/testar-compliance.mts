/**
 * Roda o verificador de compliance da OAB sobre os textos padrão do site
 * (src/config/home-content.ts e componentes da home) e sobre casos de
 * calibragem — frases que DEVEM e que NÃO DEVEM ser apontadas.
 *
 *   node scripts/testar-compliance.mts
 *
 * Sai com código 1 se a calibragem falhar ou se o texto padrão do jurídico
 * tiver achado BLOCKER: o template não pode nascer violando o Provimento.
 */
import fs from "node:fs"
import path from "node:path"
import { verificarTexto, temBloqueio, normalizarSeveridade } from "../src/lib/compliance.ts"

let falhou = false

// ─── Calibragem ───────────────────────────────────────────────────────────────
const deveAcusar = [
  "Garantimos o resultado do seu processo",
  "Consulta gratuita para novos clientes",
  "O melhor escritório de advocacia da cidade",
  "95% de êxito nas ações",
  "Não perca o prazo, entre com a ação agora",
  "Especialista em direito de família",
  "O que dizem nossos clientes",
]
const naoDeveAcusar = [
  "Não garantimos resultado: cada caso depende das provas",
  "Atuação em direito de família, com foco em acordos",
  "Pedido de justiça gratuita para quem não pode arcar com custas",
  "A lei garante o direito à pensão?",
  "Desconto em folha de pagamento",
]

for (const frase of deveAcusar) {
  if (verificarTexto(frase).length === 0) { console.log(`✗ deveria acusar: "${frase}"`); falhou = true }
}
for (const frase of naoDeveAcusar) {
  const a = verificarTexto(frase).filter((x) => normalizarSeveridade(x.regra.severidade) !== "INFO")
  if (a.length) { console.log(`✗ não deveria acusar: "${frase}" (${a.map((x) => x.regra.id).join(", ")})`); falhou = true }
}
console.log(falhou ? "Calibragem: FALHOU" : `Calibragem: ok (${deveAcusar.length + naoDeveAcusar.length} frases)`)

// ─── Textos do site ───────────────────────────────────────────────────────────
const arquivos: string[] = []
const varrer = (dir: string) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name)
    if (f.isDirectory()) varrer(p)
    else if (/\.(tsx?|mts)$/.test(f.name)) arquivos.push(p)
  }
}
varrer(path.join(process.cwd(), "src/components/home"))
arquivos.push(path.join(process.cwd(), "src/config/home-content.ts"))
arquivos.push(path.join(process.cwd(), "src/app/privacidade/page.tsx"))

let bloqueiosNoSite = 0
for (const arquivo of arquivos) {
  // Comentários ficam de fora: o raciocínio sobre as vedações vive neles
  const texto = fs.readFileSync(arquivo, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ")
  const achados = verificarTexto(texto).filter((a) => normalizarSeveridade(a.regra.severidade) !== "INFO")
  if (!achados.length) continue
  console.log(`\n${path.relative(process.cwd(), arquivo)}`)
  for (const a of achados) {
    const sev = normalizarSeveridade(a.regra.severidade)
    if (sev === "BLOCKER") bloqueiosNoSite++
    console.log(`  ${sev === "BLOCKER" ? "!" : "~"} ${a.regra.rotulo}: "${a.trecho.slice(0, 60)}"`)
  }
}
console.log(`\nTextos do site: ${bloqueiosNoSite} vedação(ões) BLOCKER`)
if (bloqueiosNoSite > 0) falhou = true

process.exit(falhou ? 1 : 0)
