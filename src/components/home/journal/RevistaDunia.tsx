"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { REVISTA_ARTICLES, type RevistaArticle } from "@/data/revista-posts"

export function RevistaDunia() {
  const [filter, setFilter] = useState<"all" | "casamento" | "inspiracao" | "eventos">("all")
  const [showAll, setShowAll] = useState(false)

  const filtered = REVISTA_ARTICLES.filter((a) => filter === "all" || a.category === filter)
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

        {/* Grid de Artigos Conectados Diretamente às Páginas Completas */}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <Link
              key={article.id}
              href={`/revista/${article.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#161311] shadow-2xl transition duration-500 hover:-translate-y-1.5 hover:border-[#D3B47C]/60"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
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
                  <p className="mt-3 text-xs leading-relaxed text-[#ABA29A] line-clamp-3">
                    {article.resumo}
                  </p>
                </div>

                <div className="pt-6 flex items-center justify-between border-t border-white/10 mt-4">
                  <span className="text-[0.7rem] font-mono text-[#D3B47C]/70">
                    {article.readingTime}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D3B47C] transition group-hover:translate-x-1">
                    <span>LER MATÉRIA COMPLETA</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Botão Ver Todas as Matérias na Página da Revista */}
        <div className="mt-12 text-center flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="rounded-xl border border-white/15 bg-white/5 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-[#D3B47C] hover:text-[#D3B47C]"
          >
            {showAll ? "VER MENOS MATÉRIAS ↑" : "VER MAIS NESTA PÁGINA ▾"}
          </button>
          
          <Link
            href="/revista"
            className="inline-flex items-center gap-2 rounded-xl border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-8 py-3 text-xs font-bold uppercase tracking-wider text-[#D3B47C] transition hover:bg-[#D3B47C] hover:text-[#100E0D]"
          >
            <span>ACESSAR O BLOG COMPLETO</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
