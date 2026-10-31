import type { Metadata } from "next"
import Link from "next/link"
import { BRAND } from "@/config/brand"

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: `Como o ${BRAND.name} trata os dados pessoais recebidos pelo site.`,
}

/**
 * Política de privacidade — MODELO.
 *
 * Descreve o que o template de fato faz (formulário de contato, WhatsApp,
 * armazenamento essencial, Supabase e Vercel como operadores). O texto final é
 * responsabilidade do cliente: revise com ele antes do go-live (ver
 * docs/NOVO-CLIENTE.md) e ajuste se o site ganhar analytics, newsletter etc.
 */
export default function Privacidade() {
  const controlador = BRAND.legalName || BRAND.name
  const contato = BRAND.contact.email
  const atualizacao = "outubro de 2026"

  const secoes: { titulo: string; corpo: React.ReactNode }[] = [
    {
      titulo: "Quem trata os seus dados",
      corpo: (
        <p>
          O controlador dos dados é <strong>{controlador}</strong>. Para qualquer assunto sobre os seus dados,
          fale conosco {contato ? <>pelo e-mail <a href={`mailto:${contato}`}>{contato}</a></> : "pelos canais indicados no site"}.
        </p>
      ),
    },
    {
      titulo: "Quais dados recebemos",
      corpo: (
        <p>
          Apenas os que você nos envia: nome, telefone, e-mail (opcional) e o relato que escrever no formulário de
          contato, ou as mensagens que trocar conosco pelo WhatsApp. Também registramos de qual campanha ou página
          você chegou, quando houver, para saber como nos encontrou.
        </p>
      ),
    },
    {
      titulo: "Para que usamos",
      corpo: (
        <p>
          Para responder ao seu contato, entender a sua situação e, se você quiser, apresentar uma proposta de
          atendimento. A base legal é a adoção de procedimentos preliminares a um contrato, a seu pedido
          (art. 7º, V, da LGPD). Não vendemos nem cedemos seus dados, e não os usamos para publicidade.
        </p>
      ),
    },
    {
      titulo: "Sigilo",
      corpo: (
        <p>
          Informações sobre a sua situação jurídica são tratadas com o sigilo profissional exigido da advocacia e
          acessadas apenas por quem atua no seu atendimento.
        </p>
      ),
    },
    {
      titulo: "Onde os dados ficam",
      corpo: (
        <p>
          Em serviços de infraestrutura contratados por nós, que atuam como operadores: banco de dados
          (Supabase) e hospedagem do site (Vercel). O acesso é restrito por senha e permissões individuais.
        </p>
      ),
    },
    {
      titulo: "Por quanto tempo",
      corpo: (
        <p>
          Enquanto forem necessários para o atendimento e, depois disso, pelo prazo exigido por obrigações legais
          ou para o exercício de direitos. Contatos que não evoluem para atendimento são descartados periodicamente.
        </p>
      ),
    },
    {
      titulo: "Seus direitos",
      corpo: (
        <p>
          Você pode pedir a confirmação de que tratamos seus dados, acesso, correção, eliminação ou informações
          sobre compartilhamento, nos termos do art. 18 da LGPD, pelo contato indicado acima.
        </p>
      ),
    },
    {
      titulo: "Cookies e armazenamento",
      corpo: (
        <p>
          O site usa apenas armazenamento essencial no seu navegador, para carregar o conteúdo mais rápido.
          Não usamos cookies de publicidade nem ferramentas de rastreamento.
        </p>
      ),
    },
  ]

  return (
    <main className="min-h-screen bg-marca-papel font-corpo text-slate-700">
      <div className="bg-marca-tinta">
        <div className="container mx-auto max-w-3xl px-6 py-6">
          <Link href="/" className="font-titulo text-xl text-white">{BRAND.name}</Link>
        </div>
      </div>

      <article className="container mx-auto max-w-3xl px-6 py-16">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-marca-tinta/60">
          <span aria-hidden className="font-titulo text-base normal-case tracking-normal">§ </span>
          Atualizada em {atualizacao}
        </p>
        <h1 className="mt-4 font-titulo text-4xl text-marca-tinta md:text-5xl">Política de privacidade</h1>

        <div className="mt-12 space-y-10 leading-relaxed [&_a]:text-marca-tinta [&_a]:underline">
          {secoes.map((s) => (
            <section key={s.titulo}>
              <h2 className="font-titulo text-2xl text-marca-tinta">{s.titulo}</h2>
              <div className="mt-3">{s.corpo}</div>
            </section>
          ))}
        </div>

        <Link href="/" className="mt-16 inline-block text-sm font-semibold text-marca-tinta underline decoration-marca-latao decoration-2 underline-offset-[6px]">
          Voltar ao site
        </Link>
      </article>
    </main>
  )
}
