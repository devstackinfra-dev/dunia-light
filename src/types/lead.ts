import type { LeadStatus, DataSubjectRequest } from "@/types/database"

export type { LeadStatus, DataSubjectRequest }

/** Categorias de documento que podem ser anexados à ficha do lead. */
export type DocCategory =
  | "documento"
  | "identidade"
  | "residencia"
  | "foto"
  | "consulta_cpf"
  | "contrato"
  | "outros"

/**
 * Registro de uma consulta de CPF / análise de crédito.
 *
 * Guardar apenas o status ("aprovada"/"reprovada") não sustenta auditoria: é
 * preciso saber quem consultou, quando, qual o resultado do birô e qual
 * documento embasou a decisão.
 *
 * Opcional por vertical: num escritório jurídico a consulta pode não existir,
 * e o bloco simplesmente não aparece na ficha.
 */
export interface CreditCheckRecord {
  result: "approved" | "rejected" | "restricted" | "inconclusive"
  /** Quem executou a consulta (displayName do operador) */
  checkedBy: string
  /** ISO date da consulta */
  checkedAt: string
  /** Birô utilizado (Serasa, SPC, Boa Vista...) */
  bureau?: string
  bureauScore?: number
  /** Restrições encontradas (protestos, negativações) */
  restrictions?: string
  notes?: string
  /** Comprovante da consulta anexado junto à decisão */
  documentUrl?: string
  documentPath?: string
  documentName?: string
}

export interface LeadInteraction {
  id: string
  type:
    | "whatsapp"
    | "note"
    | "status_change"
    | "credit_check"
    | "authorization"
    | "document_upload"
    | "appointment"
    | "decision"
    | "archive"
    | "score_update"
  agentName: string
  content: string
  createdAt: string
}

/**
 * Lead / contato comercial.
 *
 * Os campos aqui são os ESTRUTURAIS — os que existem em qualquer negócio.
 * Tudo que é específico da vertical (perguntas de qualificação, dados do setor)
 * vai em `customFields`, definido em `src/config/lead-fields.ts`. Assim incluir
 * uma pergunta nova não exige migração de banco nem alteração deste arquivo.
 */
export interface Lead {
  id: string

  // ── Identificação ──
  fullName: string
  phone: string
  whatsapp?: string
  email?: string
  cpf?: string
  rg?: string
  protocol?: string

  // ── Endereço (opcional em qualquer vertical) ──
  cep?: string
  address?: string
  addressStreet?: string
  addressNumber?: string
  addressComplement?: string
  addressNeighborhood?: string
  addressCity?: string
  addressState?: string
  addressNotes?: string

  // ── Contatos de recado (genérico: quem acionar se o titular não atender) ──
  messageName1?: string
  messagePhone1?: string
  messageName2?: string
  messagePhone2?: string

  // ── Origem e interesse ──
  source: string
  /** O que o contato procura: produto, serviço ou área de atuação. */
  itemInterest: string
  preferredContactTime?: string
  campaignId?: string
  campaignName?: string
  utm?: {
    source?: string
    medium?: string
    campaign?: string
  }

  // ── Funil ──
  /** Etapas válidas e rótulos por vertical: src/config/funil.ts */
  status: LeadStatus
  contacted: boolean
  whatsappSent: boolean
  archived?: boolean
  assignedTo?: string
  notes?: string

  /**
   * Respostas das perguntas de qualificação da vertical.
   * As chaves são os `id` definidos em `src/config/lead-fields.ts`.
   */
  customFields?: Record<string, unknown>

  // ── Avaliação e decisão ──
  registrationStatus?: "complete" | "incomplete" | "pending_contact"
  needsMoreData?: boolean
  contactedForData?: boolean
  creditAnalysisStatus?: "pending" | "approved" | "rejected" | "needs_authorization"
  /** Última consulta registrada (histórico completo em interactions) */
  creditCheck?: CreditCheckRecord
  approvalStatus?: "pending" | "approved" | "rejected"
  approvedBy?: string
  approvalDate?: string
  authorizedBy?: string
  /** Quem registrou a autorização, quando difere de quem autorizou */
  authorizationRecordedBy?: string
  authorizationDate?: string

  // ── Histórico e anexos ──
  interactions?: LeadInteraction[]
  attachedDocs?: {
    name: string
    url: string
    path?: string
    uploadedAt: string
    category?: DocCategory
    /** Quem anexou — necessário para auditar documentos sensíveis */
    uploadedBy?: string
  }[]

  // ── Score ──
  /** Score calculado em cache (o cálculo vive em lib/lead-score.ts) */
  leadScore?: number

  // ── Atendimento jurídico ──
  /** Área de interesse (slug da tabela `areas`) e o nome dela no momento do contato */
  areaSlug?: string
  areaName?: string
  /** Relato original do titular. Imutável: nunca vai em patch de atualização. */
  clientMessage?: string
  tags?: string[]
  nextContactAt?: string
  firstContactAt?: string
  landingPage?: string
  referrer?: string

  // ── LGPD ──
  consentAt?: string
  consentVersion?: string
  consentSource?: string
  retentionReviewAt?: string
  dataSubjectRequest?: DataSubjectRequest

  createdAt: any
  updatedAt?: any
}
