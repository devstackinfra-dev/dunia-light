import type { IconName } from "@/config/home-content"

/** Serviço dentro de uma área: o nome e, opcionalmente, o que ele envolve. */
export interface ServicoArea {
  item: string
  detalhe?: string
}

/** Área de atuação (jurídico) ou linha de serviço (outras verticais). */
export interface Area {
  id: string
  slug: string
  nome: string
  resumo: string
  /** A situação de quem procura a área, em primeira pessoa, sem prometer resultado. */
  contexto?: string
  icone: IconName
  /** Foto de topo do card (URL do Storage do cliente) */
  imagem?: string
  situacoes: string[]
  servicos: ServicoArea[]
  ordem: number
  ativo: boolean
  destaque: boolean
}
