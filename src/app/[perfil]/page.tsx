import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BRAND } from "@/config/brand"
import { getConteudo, slugDoPerfil } from "@/lib/conteudo"
import { getPostsPublicos } from "@/lib/posts-publicos"
import { PaginaPublica } from "@/components/home/shared/PaginaPublica"
import { PerfilImersivo } from "@/components/perfil/PerfilImersivo"

// Perfil editado no painel aparece em até 5 minutos
export const revalidate = 300

type Props = { params: { perfil: string } }

/**
 * Página do profissional, no endereço do próprio nome (ex.: /samantha-azevedo-louzeiro).
 * Qualquer outro endereço de um nível que não exista em outra rota cai aqui e
 * devolve 404 — a página só responde ao nome do perfil ativo.
 */
async function perfilDoEndereco(slug: string) {
  const { perfil } = await getConteudo()
  return perfil.ativo && slugDoPerfil(perfil) === slug ? perfil : null
}

export async function generateStaticParams() {
  const { perfil } = await getConteudo()
  return perfil.ativo && slugDoPerfil(perfil) ? [{ perfil: slugDoPerfil(perfil) }] : []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const perfil = await perfilDoEndereco(params.perfil)
  if (!perfil) return {}
  const descricao = perfil.resumo || `${perfil.nome}${perfil.registro ? `, ${perfil.registro}` : ""} — ${BRAND.name}.`
  return {
    title: `${perfil.nome} | Advocacia Estratégica`,
    description: descricao,
    alternates: { canonical: `/${params.perfil}` },
    openGraph: {
      type: "profile",
      title: `${perfil.nome} | ${BRAND.name}`,
      description: descricao,
      images: ["/clientes/louzeiro/samantha-perfil-imersivo.webp"],
    },
  }
}

export default async function PerfilPage({ params }: Props) {
  const perfil = await perfilDoEndereco(params.perfil)
  if (!perfil) notFound()

  // Publicações assinadas por ela/ele
  const publicacoes = (await getPostsPublicos())
    .filter((p) => p.autor && p.autor.trim().toLowerCase() === perfil.nome.trim().toLowerCase())
    .slice(0, 3)

  const pessoa = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: perfil.nome,
    jobTitle: perfil.cargo || undefined,
    image: `${BRAND.siteUrl}/clientes/louzeiro/samantha-perfil-imersivo.webp`,
    worksFor: { "@type": "LegalService", name: BRAND.name, url: BRAND.siteUrl },
    sameAs: perfil.links.map((l) => l.url).filter((u) => /^https?:\/\//.test(u)),
  }

  return (
    <PaginaPublica>
      <PerfilImersivo perfil={perfil} publicacoes={publicacoes} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pessoa).replace(/</g, "\\u003c") }}
      />
    </PaginaPublica>
  )
}
