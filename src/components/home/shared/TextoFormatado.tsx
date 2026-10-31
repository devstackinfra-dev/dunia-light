import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * Renderiza o texto das publicações com uma marcação simples:
 *
 *   ## Título          ### Subtítulo        > citação
 *   - item de lista    1. item numerado
 *   **negrito**   *itálico*   [texto do link](https://…)
 *
 * Parágrafos são separados por linha em branco. Tudo vira elemento React —
 * nada é inserido como HTML —, e links só aceitam http(s), mailto, tel ou
 * caminhos do próprio site: um "javascript:" digitado vira texto comum.
 */

type Bloco =
  | { tipo: "h2" | "h3" | "p" | "quote"; texto: string }
  | { tipo: "ul" | "ol"; itens: string[] }

function blocos(texto: string): Bloco[] {
  const saida: Bloco[] = []
  let paragrafo: string[] = []
  let lista: { tipo: "ul" | "ol"; itens: string[] } | null = null

  const fecharParagrafo = () => {
    if (paragrafo.length) saida.push({ tipo: "p", texto: paragrafo.join(" ") })
    paragrafo = []
  }
  const fecharLista = () => {
    if (lista) saida.push(lista)
    lista = null
  }

  for (const bruta of texto.replace(/\r\n/g, "\n").split("\n")) {
    const linha = bruta.trim()
    const ul = linha.match(/^[-*]\s+(.*)$/)
    const ol = linha.match(/^\d+[.)]\s+(.*)$/)

    if (!linha) {
      fecharParagrafo()
      fecharLista()
    } else if (linha.startsWith("### ")) {
      fecharParagrafo(); fecharLista()
      saida.push({ tipo: "h3", texto: linha.slice(4) })
    } else if (linha.startsWith("## ")) {
      fecharParagrafo(); fecharLista()
      saida.push({ tipo: "h2", texto: linha.slice(3) })
    } else if (linha.startsWith("> ")) {
      fecharParagrafo(); fecharLista()
      saida.push({ tipo: "quote", texto: linha.slice(2) })
    } else if (ul || ol) {
      fecharParagrafo()
      const tipo = ul ? "ul" : "ol"
      if (!lista || lista.tipo !== tipo) {
        fecharLista()
        lista = { tipo, itens: [] }
      }
      lista.itens.push((ul ?? ol)![1])
    } else {
      fecharLista()
      paragrafo.push(linha)
    }
  }
  fecharParagrafo()
  fecharLista()
  return saida
}

function hrefSeguro(url: string): string | null {
  if (/^(https?:\/\/|mailto:|tel:)/i.test(url)) return url
  if (url.startsWith("/") && !url.startsWith("//")) return url
  if (url.startsWith("#")) return url
  return null
}

/** **negrito**, *itálico* e [link](url) dentro de uma linha. */
function inline(texto: string): ReactNode[] {
  const partes = texto.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\)|\*[^*\s][^*]*\*)/g)
  return partes.map((parte, i) => {
    if (parte.startsWith("**") && parte.endsWith("**") && parte.length > 4) {
      return <strong key={i} className="font-semibold text-marca-tinta">{parte.slice(2, -2)}</strong>
    }
    const link = parte.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link) {
      const href = hrefSeguro(link[2])
      if (!href) return link[1]
      const externo = /^https?:\/\//i.test(href)
      return (
        <a key={i} href={href} {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="font-medium text-marca-tinta underline decoration-marca-latao decoration-2 underline-offset-4 hover:text-marca-latao">
          {link[1]}
        </a>
      )
    }
    if (parte.startsWith("*") && parte.endsWith("*") && parte.length > 2) {
      return <em key={i}>{parte.slice(1, -1)}</em>
    }
    return parte
  })
}

export function TextoFormatado({ texto, className }: { texto: string; className?: string }) {
  return (
    <div className={cn("space-y-5 text-[1.05rem] leading-[1.8] text-slate-700", className)}>
      {blocos(texto).map((b, i) => {
        switch (b.tipo) {
          case "h2":
            return <h2 key={i} className="!mt-12 font-titulo text-2xl leading-snug text-marca-tinta md:text-3xl">{inline(b.texto)}</h2>
          case "h3":
            return <h3 key={i} className="!mt-8 font-titulo text-xl leading-snug text-marca-tinta">{inline(b.texto)}</h3>
          case "quote":
            return <blockquote key={i} className="border-l-2 border-marca-latao pl-5 font-titulo text-xl italic leading-relaxed text-marca-tinta">{inline(b.texto)}</blockquote>
          case "ul":
            return (
              <ul key={i} className="space-y-2 pl-1">
                {b.itens.map((item, j) => (
                  <li key={j} className="flex gap-3">
                    <span aria-hidden className="mt-[0.85em] h-px w-3 shrink-0 bg-marca-latao" />
                    <span>{inline(item)}</span>
                  </li>
                ))}
              </ul>
            )
          case "ol":
            return (
              <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-marca-latao">
                {b.itens.map((item, j) => <li key={j}>{inline(item)}</li>)}
              </ol>
            )
          default:
            return <p key={i}>{inline(b.texto)}</p>
        }
      })}
    </div>
  )
}
