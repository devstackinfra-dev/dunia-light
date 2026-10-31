import { supabase } from "@/lib/supabase"
import type { LeadRow, LeadInteractionRow, LeadDocumentRow, DocCategoryDb } from "@/types/database"
import type { Lead, LeadInteraction, CreditCheckRecord, DocCategory } from "@/types/lead"

/**
 * Repositório de leads.
 *
 * Toda tradução entre o banco (snake_case) e a aplicação (camelCase) mora aqui.
 * Nenhum componente deve montar query própria: assim uma mudança de coluna se
 * resolve num arquivo só.
 *
 * Diferença importante em relação ao Firestore: `interactions` e `attachedDocs`
 * eram arrays dentro do documento e agora são tabelas. Ler um lead "completo"
 * significa juntar as três — por isso `fetchLead` existe separado de `listLeads`,
 * que traz só o essencial para o board.
 */

// ─── Tradução ─────────────────────────────────────────────────────────────────

export function rowToLead(
  row: LeadRow,
  interactions: LeadInteractionRow[] = [],
  documents: LeadDocumentRow[] = []
): Lead {
  return {
    id: row.id,
    fullName: row.full_name,
    phone: row.phone,
    whatsapp: row.whatsapp ?? undefined,
    email: row.email ?? undefined,
    cpf: row.cpf ?? undefined,
    rg: row.rg ?? undefined,
    protocol: row.protocol ?? undefined,

    cep: row.cep ?? undefined,
    address: row.address ?? undefined,
    addressStreet: row.address_street ?? undefined,
    addressNumber: row.address_number ?? undefined,
    addressComplement: row.address_complement ?? undefined,
    addressNeighborhood: row.address_neighborhood ?? undefined,
    addressCity: row.address_city ?? undefined,
    addressState: row.address_state ?? undefined,
    addressNotes: row.address_notes ?? undefined,
    messageName1: row.message_name_1 ?? undefined,
    messagePhone1: row.message_phone_1 ?? undefined,
    messageName2: row.message_name_2 ?? undefined,
    messagePhone2: row.message_phone_2 ?? undefined,

    source: row.source,
    itemInterest: row.item_interest ?? "",
    campaignId: row.campaign_id ?? undefined,
    campaignName: row.campaign_name ?? undefined,
    utm: (row.utm as Lead["utm"]) ?? undefined,

    status: row.status,
    contacted: row.contacted,
    whatsappSent: row.whatsapp_sent,
    archived: row.archived,
    assignedTo: row.assigned_to ?? undefined,
    notes: row.notes ?? undefined,

    customFields: (row.custom_fields as Record<string, unknown>) ?? {},

    registrationStatus: row.registration_status ?? undefined,
    needsMoreData: row.needs_more_data,
    contactedForData: row.contacted_for_data,
    creditAnalysisStatus: row.credit_analysis_status,
    creditCheck: (row.credit_check as CreditCheckRecord | null) ?? undefined,
    approvalStatus: row.approval_status,
    approvedBy: row.approved_by ?? undefined,
    approvalDate: row.approval_date ?? undefined,
    authorizedBy: row.authorized_by ?? undefined,
    authorizationDate: row.authorization_date ?? undefined,
    leadScore: row.lead_score ?? undefined,

    areaSlug: row.area_slug ?? undefined,
    areaName: row.area_name ?? undefined,
    clientMessage: row.client_message ?? undefined,
    tags: row.tags ?? [],
    nextContactAt: row.next_contact_at ?? undefined,
    firstContactAt: row.first_contact_at ?? undefined,
    landingPage: row.landing_page ?? undefined,
    referrer: row.referrer ?? undefined,
    consentAt: row.consent_at ?? undefined,
    consentVersion: row.consent_version ?? undefined,
    consentSource: row.consent_source ?? undefined,
    retentionReviewAt: row.retention_review_at ?? undefined,
    dataSubjectRequest: row.data_subject_request ?? "none",

    createdAt: row.created_at,
    updatedAt: row.updated_at,

    interactions: interactions.map((i) => ({
      id: i.id,
      type: i.type,
      agentName: i.agent_name,
      content: i.content,
      createdAt: i.created_at,
    })),

    attachedDocs: documents.map((d) => ({
      name: d.name,
      url: d.url,
      path: d.storage_path ?? undefined,
      uploadedAt: d.created_at,
      category: d.category as DocCategory,
      uploadedBy: d.uploaded_by ?? undefined,
    })),
  }
}

/**
 * Converte um patch da aplicação em colunas do banco.
 * Só inclui chaves presentes — assim um update parcial não sobrescreve o resto.
 */
export function leadToRow(lead: Partial<Lead>): Partial<LeadRow> {
  const map: Array<[keyof Lead, keyof LeadRow]> = [
    ["fullName", "full_name"], ["phone", "phone"], ["whatsapp", "whatsapp"],
    ["email", "email"], ["cpf", "cpf"], ["rg", "rg"], ["protocol", "protocol"],
    ["cep", "cep"], ["address", "address"], ["addressStreet", "address_street"],
    ["addressNumber", "address_number"], ["addressComplement", "address_complement"],
    ["addressNeighborhood", "address_neighborhood"], ["addressCity", "address_city"],
    ["addressState", "address_state"], ["addressNotes", "address_notes"],
    ["messageName1", "message_name_1"], ["messagePhone1", "message_phone_1"],
    ["messageName2", "message_name_2"], ["messagePhone2", "message_phone_2"],
    ["source", "source"], ["itemInterest", "item_interest"],
        ["campaignId", "campaign_id"], ["campaignName", "campaign_name"], ["utm", "utm"],
    ["status", "status"], ["contacted", "contacted"], ["whatsappSent", "whatsapp_sent"],
    ["archived", "archived"], ["assignedTo", "assigned_to"], ["notes", "notes"],
    ["customFields", "custom_fields"],
    ["registrationStatus", "registration_status"], ["needsMoreData", "needs_more_data"],
    ["contactedForData", "contacted_for_data"],
    ["creditAnalysisStatus", "credit_analysis_status"], ["creditCheck", "credit_check"],
    ["approvalStatus", "approval_status"], ["approvedBy", "approved_by"],
    ["approvalDate", "approval_date"], ["authorizedBy", "authorized_by"],
    ["authorizationDate", "authorization_date"],
    ["leadScore", "lead_score"],
    // Relato e consentimento ficam de fora de propósito: são gravados uma vez,
    // na criação, e o banco recusa qualquer alteração posterior.
    ["areaSlug", "area_slug"], ["areaName", "area_name"], ["tags", "tags"],
    ["nextContactAt", "next_contact_at"], ["firstContactAt", "first_contact_at"],
    ["retentionReviewAt", "retention_review_at"], ["dataSubjectRequest", "data_subject_request"],
  ]

  const row: Record<string, unknown> = {}
  for (const [appKey, dbKey] of map) {
    if (appKey in lead) row[dbKey] = lead[appKey] ?? null
  }
  return row as Partial<LeadRow>
}

// ─── Leitura ──────────────────────────────────────────────────────────────────

/** Lista para o board/dashboard. Não traz interações nem anexos (peso à toa). */
export async function listLeads({ includeArchived = false } = {}): Promise<Lead[]> {
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false })
  if (!includeArchived) query = query.eq("archived", false)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map((row) => rowToLead(row as LeadRow))
}

/** Lead completo, com histórico e anexos — usado ao abrir a ficha. */
export async function fetchLead(id: string): Promise<Lead | null> {
  const [leadRes, interactionsRes, docsRes] = await Promise.all([
    supabase.from("leads").select("*").eq("id", id).maybeSingle(),
    supabase.from("lead_interactions").select("*").eq("lead_id", id)
      .order("created_at", { ascending: true }),
    supabase.from("lead_documents").select("*").eq("lead_id", id)
      .order("created_at", { ascending: true }),
  ])

  if (leadRes.error) throw leadRes.error
  if (!leadRes.data) return null

  return rowToLead(
    leadRes.data as LeadRow,
    (interactionsRes.data ?? []) as LeadInteractionRow[],
    (docsRes.data ?? []) as LeadDocumentRow[]
  )
}

// ─── Escrita ──────────────────────────────────────────────────────────────────

/** Dados que um formulário público envia. Tudo o mais o servidor decide. */
export interface NovoLeadPublico {
  fullName: string
  phone: string
  email?: string
  /** Slug da área escolhida (jurídico) */
  areaSlug?: string
  /** Relato do titular — gravado como relato original, imutável */
  message?: string
  /** O titular marcou a caixa de consentimento da política de privacidade */
  consent: boolean
  source?: string
  itemInterest?: string
  campaignId?: string
  campaignName?: string
  utm?: Lead["utm"] & { content?: string; term?: string }
  /** Campo-isca contra robôs: tem de chegar vazio */
  website?: string
}

/**
 * Criação pelo formulário público.
 *
 * Não grava direto no banco: o visitante anônimo não tem mais permissão de
 * insert. Vai para /api/leads, que valida, exige consentimento, limita envios
 * repetidos e registra a prova de consentimento (LGPD).
 *
 * @throws Error com mensagem pronta para exibir ao visitante
 */
export async function createLead(lead: NovoLeadPublico): Promise<void> {
  const res = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...lead,
      landingPage: typeof window !== "undefined" ? window.location.pathname : undefined,
      referrer: typeof document !== "undefined" ? document.referrer || undefined : undefined,
    }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body?.error || "Não foi possível enviar agora. Tente novamente em instantes.")
  }
}

/**
 * Criação a partir do painel, por usuário autenticado.
 *
 * Aqui o `.select()` é seguro — o admin tem policy de leitura em leads — e o
 * retorno é necessário para inserir o card no funil sem recarregar a lista.
 */
export async function createLeadAsAdmin(
  lead: Partial<Lead> & Pick<Lead, "fullName" | "phone">
): Promise<Lead> {
  const payload = {
    ...leadToRow(lead),
    full_name: lead.fullName,
    phone: lead.phone,
  }
  const { data, error } = await supabase.from("leads").insert(payload).select().single()
  if (error) throw error
  return rowToLead(data as LeadRow)
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Atualiza o lead. Se o patch trouxer `interactions`, as entradas criadas na
 * tela (id provisório, não-UUID) são gravadas em `lead_interactions` — antes
 * elas só existiam em memória e sumiam ao recarregar, levando junto o
 * histórico de etapas e decisões.
 */
export async function updateLead(id: string, patch: Partial<Lead>): Promise<void> {
  const row = leadToRow(patch)
  if (Object.keys(row).length > 0) {
    const { error } = await supabase.from("leads").update(row).eq("id", id)
    if (error) throw error
  }

  const novas = (patch.interactions ?? []).filter((i) => !UUID.test(i.id))
  for (const i of novas) {
    await addInteraction(id, { type: i.type, agentName: i.agentName, content: i.content })
  }
}

export async function deleteLead(id: string): Promise<void> {
  // interactions e documents caem junto pelo `on delete cascade`
  const { error } = await supabase.from("leads").delete().eq("id", id)
  if (error) throw error
}

// ─── Histórico ────────────────────────────────────────────────────────────────

export async function addInteraction(
  leadId: string,
  interaction: Omit<LeadInteraction, "id" | "createdAt">
): Promise<LeadInteraction> {
  const { data, error } = await supabase
    .from("lead_interactions")
    .insert({
      lead_id: leadId,
      type: interaction.type,
      agent_name: interaction.agentName,
      content: interaction.content,
    })
    .select()
    .single()

  if (error) throw error
  const row = data as LeadInteractionRow
  return {
    id: row.id,
    type: row.type,
    agentName: row.agent_name,
    content: row.content,
    createdAt: row.created_at,
  }
}

// ─── Anexos ───────────────────────────────────────────────────────────────────

export async function addDocument(
  leadId: string,
  doc: { name: string; url: string; path?: string; category?: DocCategory; uploadedBy?: string }
): Promise<void> {
  const { error } = await supabase.from("lead_documents").insert({
    lead_id: leadId,
    name: doc.name,
    url: doc.url,
    storage_path: doc.path ?? null,
    category: (doc.category ?? "outros") as DocCategoryDb,
    uploaded_by: doc.uploadedBy ?? null,
  })
  if (error) throw error
}

export async function deleteDocumentByUrl(leadId: string, url: string): Promise<void> {
  const { error } = await supabase
    .from("lead_documents")
    .delete()
    .eq("lead_id", leadId)
    .eq("url", url)
  if (error) throw error
}

// ─── Tempo real ───────────────────────────────────────────────────────────────

/**
 * Avisa quando um lead novo entra — substitui o `onSnapshot` do Firestore.
 * Devolve a função de cancelamento.
 */
export function subscribeToNewLeads(onInsert: (lead: Lead) => void): () => void {
  const channel = supabase
    .channel("leads-novos")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "leads" },
      (payload) => onInsert(rowToLead(payload.new as LeadRow))
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
