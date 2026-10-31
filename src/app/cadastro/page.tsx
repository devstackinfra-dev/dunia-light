import { redirect } from "next/navigation"

/**
 * /cadastro existia como formulário do projeto original (motoristas de táxi,
 * com CNH e dados do nicho). Slides, campanhas e links antigos ainda apontam
 * para cá, então a rota continua viva: leva ao formulário de contato da home
 * e repassa os parâmetros de campanha, que o formulário grava no lead.
 */
export default function Cadastro({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const params = new URLSearchParams()
  for (const chave of ["campaignId", "campaignName", "itemInterest", "product", "utm_source", "utm_medium", "utm_campaign"]) {
    const valor = searchParams[chave]
    if (typeof valor === "string" && valor) params.set(chave, valor.slice(0, 200))
  }
  const query = params.toString()
  redirect(`/${query ? `?${query}` : ""}#contato`)
}
