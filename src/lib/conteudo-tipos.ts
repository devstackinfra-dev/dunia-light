import { BRAND } from "@/config/brand"
import { HOME, type HomeContent } from "@/config/home-content"
import { slugify } from "@/lib/db/areas"

/**
 * Conteúdo do site POR CLIENTE, guardado em `app_settings` na chave
 * `conteudo_site` (leitura pública: é texto do site). Só o que o cliente mudou
 * fica lá; o resto vem do padrão da vertical em src/config/home-content.ts.
 *
 * Este arquivo não acessa o banco, para poder ser importado tanto no
 * servidor quanto no navegador.
 */

/** Página do profissional (ex.: /samantha-louzeiro). */
export interface Perfil {
  /** Mostra a página e o item no menu */
  ativo: boolean
  nome: string
  /** Ex.: "Advogada · Sócia fundadora" */
  cargo?: string
  /** Ex.: "OAB/DF 00.000" */
  registro?: string
  foto?: string
  /** Segunda foto (escritório, atendimento), opcional */
  fotoSecundaria?: string
  /** Uma ou duas frases de apresentação, no topo da página */
  resumo?: string
  /** Texto longo, com a marcação simples do blog */
  biografia?: string
  formacao: string[]
  /** Onde atua: tribunais, órgãos, conselhos */
  atuacao: string[]
  /** Frase em destaque (dela), opcional */
  citacao?: string
  links: { rotulo: string; url: string }[]
}

export interface ConteudoSite {
  home?: Partial<{ [K in keyof HomeContent]: Partial<HomeContent[K]> | HomeContent[K] }>
  perfil?: Partial<Perfil>
}

const ehObjeto = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v)

/**
 * Sobrepõe o conteúdo do cliente ao padrão: objetos mesclam um nível
 * (hero.title muda sem apagar hero.subtitle); listas e textos substituem.
 */
export function mesclarHome(base: HomeContent, extra?: ConteudoSite["home"]): HomeContent {
  if (!extra) return base
  const saida: Record<string, unknown> = { ...base }
  for (const [chave, valor] of Object.entries(extra)) {
    if (valor === undefined || valor === null) continue
    const atual = (base as unknown as Record<string, unknown>)[chave]
    saida[chave] = ehObjeto(atual) && ehObjeto(valor) ? { ...atual, ...valor } : valor
  }
  return saida as unknown as HomeContent
}

export function perfilCompleto(extra?: Partial<Perfil>): Perfil {
  return {
    ativo: false,
    nome: BRAND.professional.name,
    registro: BRAND.professional.registration || undefined,
    foto: BRAND.professional.photo || undefined,
    formacao: [],
    atuacao: [],
    links: [],
    ...extra,
  }
}

/** Endereço da página do profissional: o nome dele, ex. /samantha-louzeiro */
export function slugDoPerfil(perfil: Perfil): string {
  return slugify(perfil.nome || "")
}

/** O que o site usa de fato: conteúdo do cliente sobre o padrão da vertical. */
export interface ConteudoResolvido {
  home: HomeContent
  perfil: Perfil
}

export function resolverConteudo(bruto?: ConteudoSite | null): ConteudoResolvido {
  const ehDeOutraMarca =
    Boolean(bruto?.perfil?.nome?.toLowerCase().includes('louzeiro')) ||
    (BRAND.vertical === 'eventos' &&
      Boolean((bruto?.home?.hero as any)?.badge?.toLowerCase().includes('advocacia')))

  const dadosValidos = ehDeOutraMarca ? null : bruto

  return {
    home: mesclarHome(HOME, dadosValidos?.home),
    perfil: perfilCompleto(dadosValidos?.perfil),
  }
}

/** Item de menu da página do profissional, se ela estiver ativa. */
export function itemDoPerfil(perfil: Perfil) {
  const slug = slugDoPerfil(perfil)
  return perfil.ativo && slug ? { rotulo: perfil.nome, href: `/${slug}` } : null
}
