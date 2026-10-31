import { BRAND, VerticalPreset } from "@/config/brand"

/**
 * Perguntas de qualificação do lead — configuração, não código.
 *
 * Na versão original estas perguntas eram do nicho de táxi e estavam escritas
 * dentro do formulário e do cálculo de score. Aqui elas viraram dados: o
 * formulário público se desenha a partir desta lista, a ficha do painel exibe
 * as respostas, e o score soma os pontos de quem responde o que interessa.
 *
 * As respostas são gravadas em `leads.custom_fields` (JSONB), então incluir ou
 * remover uma pergunta NÃO exige migração de banco.
 */

export type TipoCampo = "texto" | "escolha" | "multipla" | "booleano" | "numero"

export interface OpcaoCampo {
  valor: string
  rotulo: string
  /** Pontos somados ao score quando esta opção é escolhida. */
  pontos?: number
}

export interface CampoQualificacao {
  /** Chave gravada em `custom_fields`. Use snake_case e não mude depois. */
  id: string
  rotulo: string
  tipo: TipoCampo
  /** Texto de apoio sob o campo. */
  ajuda?: string
  obrigatorio?: boolean
  opcoes?: OpcaoCampo[]
  /** Pontos de score por estar preenchido (campos de texto e número). */
  pontos?: number
  /**
   * O que pedir ao contato quando o campo está vazio.
   * Vira o botão “Solicitar” na ficha, que dispara a mensagem.
   */
  acaoSeVazio?: string
}

// ─── Presets por vertical ─────────────────────────────────────────────────────

const CATALOGO: CampoQualificacao[] = [
  {
    id: "tipo_comprador",
    rotulo: "Você compra para",
    tipo: "escolha",
    obrigatorio: true,
    opcoes: [
      { valor: "revenda", rotulo: "Revenda", pontos: 25 },
      { valor: "consumo", rotulo: "Consumo próprio", pontos: 10 },
      { valor: "presente", rotulo: "Brinde corporativo", pontos: 20 },
    ],
  },
  {
    id: "volume_mensal",
    rotulo: "Volume estimado por mês",
    tipo: "escolha",
    opcoes: [
      { valor: "ate_50", rotulo: "Até 50 unidades", pontos: 5 },
      { valor: "50_200", rotulo: "De 50 a 200", pontos: 15 },
      { valor: "200_mais", rotulo: "Acima de 200", pontos: 25 },
    ],
    acaoSeVazio: "Confirmar o volume que o cliente costuma comprar por mês.",
  },
  {
    id: "cnpj",
    rotulo: "CNPJ",
    tipo: "texto",
    ajuda: "Opcional — acelera a emissão da nota.",
    pontos: 20,
    acaoSeVazio: "Solicitar o CNPJ para emissão da nota fiscal.",
  },
  {
    id: "prazo",
    rotulo: "Prazo desejado",
    tipo: "escolha",
    opcoes: [
      { valor: "imediato", rotulo: "Imediato", pontos: 15 },
      { valor: "30_dias", rotulo: "Em até 30 dias", pontos: 10 },
      { valor: "pesquisando", rotulo: "Só pesquisando", pontos: 0 },
    ],
  },
]

const JURIDICO: CampoQualificacao[] = [
  {
    id: "area",
    rotulo: "Área do caso",
    tipo: "escolha",
    obrigatorio: true,
    opcoes: [
      { valor: "trabalhista", rotulo: "Trabalhista", pontos: 20 },
      { valor: "civel", rotulo: "Cível", pontos: 20 },
      { valor: "familia", rotulo: "Família", pontos: 20 },
      { valor: "empresarial", rotulo: "Empresarial", pontos: 25 },
      { valor: "outro", rotulo: "Outro", pontos: 10 },
    ],
  },
  {
    id: "urgencia",
    rotulo: "Há prazo correndo?",
    tipo: "escolha",
    obrigatorio: true,
    opcoes: [
      { valor: "sim_urgente", rotulo: "Sim, com urgência", pontos: 30 },
      { valor: "sim", rotulo: "Sim, mas sem urgência", pontos: 20 },
      { valor: "nao", rotulo: "Não sei dizer", pontos: 5 },
    ],
  },
  {
    id: "processo_existente",
    rotulo: "Já existe processo aberto?",
    tipo: "booleano",
    pontos: 15,
  },
  {
    id: "documentos",
    rotulo: "Tem a documentação em mãos?",
    tipo: "booleano",
    pontos: 20,
    acaoSeVazio: "Pedir os documentos do caso para a análise preliminar.",
  },
  {
    id: "resumo",
    rotulo: "Resuma o caso",
    tipo: "texto",
    ajuda: "Algumas linhas já ajudam a direcionar o atendimento.",
    pontos: 15,
    acaoSeVazio: "Solicitar um resumo do caso antes da consulta.",
  },
]

const GENERICO: CampoQualificacao[] = [
  {
    id: "assunto",
    rotulo: "Sobre o que é o contato",
    tipo: "texto",
    obrigatorio: true,
    pontos: 25,
  },
  {
    id: "prazo",
    rotulo: "Qual a urgência",
    tipo: "escolha",
    opcoes: [
      { valor: "alta", rotulo: "Preciso com urgência", pontos: 30 },
      { valor: "media", rotulo: "Nas próximas semanas", pontos: 15 },
      { valor: "baixa", rotulo: "Só me informando", pontos: 5 },
    ],
  },
]

const EVENTOS: CampoQualificacao[] = [
  {
    id: "tipo_evento",
    rotulo: "Tipo de Celebração",
    tipo: "escolha",
    obrigatorio: true,
    opcoes: [
      { valor: "casamento", rotulo: "Casamento", pontos: 30 },
      { valor: "debutante", rotulo: "Debutante / 15 Anos", pontos: 25 },
      { valor: "corporativo", rotulo: "Corporativo / Congresso", pontos: 25 },
      { valor: "embaixada", rotulo: "Embaixada / Diplomático", pontos: 30 },
      { valor: "festa_social", rotulo: "Aniversário / Bodas", pontos: 15 },
    ],
  },
  {
    id: "convidados",
    rotulo: "Número estimado de convidados",
    tipo: "escolha",
    obrigatorio: true,
    opcoes: [
      { valor: "ate_150", rotulo: "Até 150 convidados", pontos: 15 },
      { valor: "150_300", rotulo: "De 150 a 300 convidados", pontos: 25 },
      { valor: "300_600", rotulo: "De 300 a 600 convidados", pontos: 30 },
      { valor: "600_mais", rotulo: "Acima de 600 convidados", pontos: 35 },
    ],
  },
  {
    id: "previsao_data",
    rotulo: "Previsão de Data",
    tipo: "escolha",
    opcoes: [
      { valor: "proximos_6_meses", rotulo: "Nos próximos 6 meses", pontos: 25 },
      { valor: "este_ano", rotulo: "Ainda este ano", pontos: 20 },
      { valor: "proximo_ano", rotulo: "No próximo ano", pontos: 15 },
      { valor: "sem_data", rotulo: "Ainda definindo data", pontos: 5 },
    ],
  },
]

const POR_VERTICAL: Record<VerticalPreset, CampoQualificacao[]> = {
  eventos: EVENTOS,
  catalogo: CATALOGO,
  juridico: JURIDICO,
  generico: GENERICO,
}

/** Campos de qualificação da vertical configurada em BRAND.vertical. */
export const CAMPOS_QUALIFICACAO: CampoQualificacao[] =
  POR_VERTICAL[BRAND.vertical] ?? GENERICO

/** Soma máxima possível — usada para normalizar o score em 0–100. */
export const PONTUACAO_MAXIMA: number = CAMPOS_QUALIFICACAO.reduce((total, campo) => {
  if (campo.opcoes?.length) {
    return total + Math.max(...campo.opcoes.map((o) => o.pontos ?? 0))
  }
  return total + (campo.pontos ?? 0)
}, 0)
