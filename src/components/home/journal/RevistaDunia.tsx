"use client"

import { useState } from "react"
import Image from "next/image"
import { ArrowRight, BookOpen, X, Sparkles } from "lucide-react"

interface Article {
  id: number
  category: "all" | "casamento" | "inspiracao" | "eventos"
  label: string
  title: string
  text: string
  image: string
  article: string
}

const ARTICLES: Article[] = [
  {
    id: 1,
    category: "casamento",
    label: "CASAMENTOS • PLANEJAMENTO",
    title: "Antes do sim: os detalhes que fazem uma história única",
    text: "Da escolha do cenário à última dança, tudo começa pelas emoções que vocês querem viver.",
    image: "/assets/casal.jpg",
    article:
      "Um grande casamento não se mede apenas pela decoração ou pelo número de convidados. Ele se revela nas escolhas que dizem algo sobre o casal: uma música, uma memória, uma mesa preparada para alguém especial. No Dúnia City Hall, o planejamento ganha vida com nossa cenografia monumental e o Espaço da Noiva exclusivo para preparar esse momento com serenidade.",
  },
  {
    id: 2,
    category: "inspiracao",
    label: "INSPIRAÇÃO • DECORAÇÃO",
    title: "A luz certa transforma um espaço em memória",
    text: "Velas, flores e atmosferas que fazem cada convidado sentir que chegou a um lugar especial.",
    image: "/assets/mesa.jpg",
    article:
      "Iluminação não serve apenas para deixar o ambiente bonito. Ela define ritmo, intimidade e sensação. Nossos lustres clássicos de cristal combinados a pontos de destaque cenográficos valorizam as mesas e criam profundidade cinematográfica em cada fotografia.",
  },
  {
    id: 3,
    category: "eventos",
    label: "EVENTOS • EXPERIÊNCIA",
    title: "Receber bem começa muito antes das portas se abrirem",
    text: "Convites digitais, informações claras e uma jornada de convidados pensada com cuidado.",
    image: "/assets/salao.jpg",
    article:
      "O evento começa quando o convidado recebe o primeiro convite. Com o Dúnia Experience OS, oferecemos mini-sites personalizados, mapa interativo, RSVP instantâneo por código e QR Code de entrada, trazendo sofisticação digital desde o primeiro instante.",
  },
  {
    id: 4,
    category: "inspiracao",
    label: "INSPIRAÇÃO • 15 ANOS",
    title: "Uma festa de quinze anos que tem a sua assinatura",
    text: "O que faz uma celebração parecer única é a personalidade de quem está no centro dela.",
    image: "/assets/debutante.jpg",
    article:
      "Uma celebração marcante combina elementos que representam quem está vivendo o momento. No Dúnia, nossa pista de dança de última geração com tecnologia de ponta e ambientes instagramáveis transformam o baile de 15 anos em uma noite lendária.",
  },
  {
    id: 5,
    category: "eventos",
    label: "EVENTOS • CORPORATIVO",
    title: "Conexões que continuam depois do evento",
    text: "Quando um encontro corporativo é pensado para aproximar pessoas e criar significado.",
    image: "/assets/corporativo.jpg",
    article:
      "Os grandes encontros corporativos exigem distinção, acústica perfeita e segurança. Já recebemos autoridades dos Três Poderes, representantes de embaixadas e líderes globais, sempre com gastronomia impecável e estrutura modular para até 1.200 participantes.",
  },
  {
    id: 6,
    category: "casamento",
    label: "CASAMENTOS • CONVIDADOS",
    title: "Como organizar a confirmação de presença sem complicação",
    text: "Um RSVP simples é um gesto de cuidado com os convidados e com a organização.",
    image: "/assets/festa.jpg",
    article:
      "Uma confirmação de presença clara facilita decisões sobre equipe, mesas e buffet. O Dúnia Experience OS entrega ao casal um painel em tempo real onde cada confirmação é atualizada instantaneamente e a portaria valida os acessos por QR Code com bloqueio de duplicidade.",
  },
]

export function RevistaDunia() {
  const [filter, setFilter] = useState<"all" | "casamento" | "inspiracao" | "eventos">("all")
  const [showAll, setShowAll] = useState(false)
  const [activeArticle, setActiveArticle] = useState<Article | null>(null)

  const filtered = ARTICLES.filter((a) => filter === "all" || a.category === filter)
  const visible = showAll ? filtered : filtered.slice(0, 3)

  return (
    <section id="revista" className="border-b border-[#D3B47C]/20 bg-[#100E0D] py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              REVISTA DÚNIA • EDIÇÃO DIGITAL
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal text-white sm:text-5xl">
              Histórias, Inspirações & Sabores
            </h2>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: "all", label: "Todas" },
              { key: "casamento", label: "Casamentos" },
              { key: "inspiracao", label: "Inspiração" },
              { key: "eventos", label: "Eventos" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => {
                  setFilter(key as any)
                  setShowAll(false)
                }}
                className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wider transition ${
                  filter === key
                    ? "bg-[#D3B47C] text-[#100E0D]"
                    : "border border-white/10 bg-white/5 text-[#ABA29A] hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Artigos */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <article
              key={article.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161311] shadow-2xl transition duration-500 hover:-translate-y-1.5 hover:border-[#D3B47C]/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-transparent to-transparent" />
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                    {article.label}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-normal leading-snug text-white transition group-hover:text-[#D3B47C]">
                    {article.title}
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-[#ABA29A]">{article.text}</p>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => setActiveArticle(article)}
                    className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D3B47C] transition group-hover:translate-x-1"
                  >
                    <span>LER MATÉRIA</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Botão Ver Mais Histórias */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="rounded-xl border border-white/15 bg-white/5 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#D3B47C] hover:text-[#D3B47C]"
          >
            {showAll ? "VER MENOS MATÉRIAS ↑" : "VER MAIS HISTÓRIAS ↗"}
          </button>
        </div>
      </div>

      {/* Modal Leitor de Artigo */}
      {activeArticle && (
        <div
          onClick={() => setActiveArticle(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-[#161311] shadow-2xl"
          >
            <button
              onClick={() => setActiveArticle(null)}
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative aspect-[16/9] w-full">
              <Image src={activeArticle.image} alt={activeArticle.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-transparent to-transparent" />
            </div>

            <div className="p-8">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                {activeArticle.label}
              </span>
              <h3 className="mt-2 font-serif text-3xl font-normal text-white">{activeArticle.title}</h3>
              <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#ABA29A]">
                <p>{activeArticle.article}</p>
                <p className="border-t border-white/10 pt-4 text-xs italic text-white/50">
                  Dúnia City Hall — SHIS QI 15 Lago Sul, Brasília/DF. Realizando celebrações memoráveis desde 2008.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
