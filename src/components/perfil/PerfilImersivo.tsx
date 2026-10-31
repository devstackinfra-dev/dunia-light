"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  ArrowRight,
  ChevronRight,
  GraduationCap,
  BookOpen,
  Target,
  Scale,
  Users,
  FileText,
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import { BRAND, whatsappLink } from "@/config/brand"
import { Eyebrow } from "@/components/home/shared/SectionHeader"
import { PostCard } from "@/components/home/blog/PostCard"
import { Contact } from "@/components/home/contact/Contact"
import type { Perfil } from "@/lib/conteudo-tipos"
import type { Post } from "@/types/post"
import { cn } from "@/lib/utils"

interface PerfilImersivoProps {
  perfil: Perfil
  publicacoes: Post[]
}

/**
 * Biografia Institucional Editorial da Dra. Samantha Azevedo Louzeiro.
 * Inspirada na direção criativa de perfis de revistas de prestígio:
 * Alternância de seções claras e escuras, fotografia em grande escala com
 * transição para preto e branco, narrativa biográfica em capítulos e linha do tempo real.
 */
export function PerfilImersivo({ perfil, publicacoes }: PerfilImersivoProps) {
  const reduzir = useReducedMotion()
  const temWhatsapp = Boolean(BRAND.contact.whatsapp)
  const [fotoPB, setFotoPB] = useState(false)

  const fotoOriginal = perfil.foto || BRAND.professional.photo || "/images/banners/banner-1.png"
  const fotoHeroEscritorio = perfil.fotoSecundaria || BRAND.professional.photoAbout || (BRAND.parallax.length > 0 ? BRAND.parallax[0] : fotoOriginal)
  const citacao = perfil.citacao || "A advocacia tem sentido quando impacta positivamente a vida das pessoas."

  const paragrafosBio = perfil.biografia
    ? perfil.biografia.split(/\n\s*\n/).filter(Boolean)
    : [
        "Desde o início da minha trajetória no Direito, sempre acreditei que a advocacia vai muito além de processos. É sobre pessoas, histórias, escolhas e consequências reais na vida de cada cliente.",
        "A base sólida de estudo e a determinação de construir soluções seguras orientam a condução ética e estratégica do nosso trabalho.",
        "Essa visão me acompanha em cada manifestação: atuando com estudo aprofundado, responsabilidade técnica e respeito incondicional às particularidades de quem nos confia sua causa.",
      ]

  const animFade = (delay = 0) =>
    reduzir
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-80px" },
          transition: { duration: 0.7, delay, ease: "easeOut" },
        }

  return (
    <article className="relative w-full bg-[#0A131F] font-corpo text-slate-100 selection:bg-marca-latao selection:text-marca-tinta antialiased">
      
      {/* ============================================================== */}
      {/* 1. A PROFISSIONAL — APRESENTAÇÃO IMPONENTE                    */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-[#0A131F] pt-28 sm:pt-36 pb-20 sm:pb-32 border-b border-white/10 text-white">
        {/* Luz ambiente de fundo */}
        <div className="pointer-events-none absolute -left-40 top-20 h-[600px] w-[600px] rounded-full bg-marca-latao/10 blur-[150px]" />
        <div className="pointer-events-none absolute -right-40 top-1/2 h-[500px] w-[500px] rounded-full bg-[#A35A3A]/10 blur-[160px]" />

        <div className="container relative mx-auto px-6 lg:px-12">
          {/* Navegação de Topo */}
          <nav className="mb-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
            <Link href="/" className="hover:text-marca-latao transition-colors">
              Início
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-600" />
            <span className="text-marca-latao font-semibold">Trajetória e Propósito</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Fotografia Principal em Grande Destaque */}
            <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1">
              <motion.div {...animFade(0.1)} className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Moldura deslocada de latão nobre */}
                <div className="absolute -inset-3 rounded-3xl border border-marca-latao/30 bg-marca-latao/5 -rotate-1 hidden sm:block pointer-events-none shadow-[0_0_40px_rgba(184,146,90,0.1)]" />
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-marca-latao/20 via-[#A35A3A]/15 to-white/10 blur-sm pointer-events-none" />

                <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/20 bg-slate-950 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoOriginal}
                    alt={`Dra. ${perfil.nome}`}
                    fetchPriority="high"
                    className="h-full w-full object-cover object-top filter brightness-[0.98] contrast-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A131F]/90 via-transparent to-transparent pointer-events-none" />

                  {/* Plaqueta clássica com o registro */}
                  <div className="absolute bottom-5 inset-x-5 rounded-xl border border-white/15 bg-[#0A131F]/80 p-4.5 backdrop-blur-md">
                    <p className="font-titulo text-lg font-medium tracking-wide text-white">
                      {perfil.nome}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-marca-latao mt-0.5">
                      {perfil.registro ? `${perfil.registro} · ` : ""}Advocacia Estratégica em Brasília
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Apresentação Editorial */}
            <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2 space-y-6">
              <motion.div {...animFade(0)}>
                <Eyebrow className="mb-4">Sobre a Advogada</Eyebrow>
                
                <h1 className="font-titulo text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] text-white tracking-tight">
                  {perfil.nome}
                </h1>

                {/* Linha de acento em terracota / latão */}
                <div className="mt-5 h-1 w-20 bg-gradient-to-r from-marca-latao to-[#A35A3A] rounded-full" />

                <div className="mt-8 space-y-6 text-base sm:text-lg leading-relaxed text-slate-200 font-corpo font-light">
                  <p className="text-xl sm:text-2xl text-slate-100 font-normal leading-relaxed">
                    Advogada, formada em Direito, com trajetória construída sobre estudo, ética e compromisso com pessoas e suas histórias.
                  </p>
                  <p className="text-slate-300">
                    Atua de forma estratégica e humanizada, sempre com foco na proteção de direitos, na segurança jurídica e em soluções alinhadas à realidade e aos objetivos legítimos de cada cliente.
                  </p>
                </div>

                {/* Ações Sutis e Institucionais */}
                <div className="mt-10 flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
                  <Link
                    href={
                      temWhatsapp
                        ? whatsappLink(`Olá, Dra. Samantha! Gostaria de agendar uma consulta sobre uma demanda jurídica.`)
                        : "#contato"
                    }
                    target={temWhatsapp ? "_blank" : undefined}
                    className="inline-flex items-center gap-2.5 rounded-xl bg-marca-latao px-7 py-3.5 text-sm font-bold text-marca-tinta shadow-lg shadow-marca-latao/20 transition-all hover:bg-marca-latao/90 hover:scale-[1.02]"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Agendar Consulta</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href="#trajetoria"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white hover:border-marca-latao transition-all"
                  >
                    <span>Conhecer Trajetória</span>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. A TRAJETÓRIA — TEXTO BIOGRÁFICO EM CAPÍTULOS COM PRETO & BRANCO */}
      {/* ============================================================== */}
      <section id="trajetoria" className="relative bg-[#FAF8F5] text-slate-900 py-24 sm:py-36 border-b border-stone-200 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            
            {/* Coluna da Esquerda: Capítulos da Carreira */}
            <div className="lg:col-span-7 space-y-10">
              <motion.div {...animFade(0)}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A35A3A]">
                  Trajetória
                </span>
                <h2 className="mt-3 font-titulo text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] text-slate-900">
                  Uma carreira construída com{" "}
                  <span className="italic text-[#A35A3A]">propósito.</span>
                </h2>
              </motion.div>

              <motion.div {...animFade(0.1)} className="space-y-6 text-base sm:text-lg leading-relaxed text-slate-700 font-corpo">
                {paragrafosBio.map((p, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? "text-xl sm:text-2xl text-slate-900 font-normal leading-relaxed border-l-2 border-[#A35A3A] pl-5"
                        : ""
                    }
                  >
                    {p}
                  </p>
                ))}
              </motion.div>

              {/* Controles discretos para alternar visual preto e branco */}
              <div className="pt-4 flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span>Modo fotográfico:</span>
                <button
                  type="button"
                  onClick={() => setFotoPB(false)}
                  className={cn(
                    "px-3 py-1 rounded-full border transition-all",
                    !fotoPB ? "border-[#A35A3A] bg-[#A35A3A]/10 text-[#A35A3A] font-bold" : "border-slate-300 text-slate-600"
                  )}
                >
                  Cor Original
                </button>
                <button
                  type="button"
                  onClick={() => setFotoPB(true)}
                  className={cn(
                    "px-3 py-1 rounded-full border transition-all",
                    fotoPB ? "border-slate-800 bg-slate-800 text-white font-bold" : "border-slate-300 text-slate-600"
                  )}
                >
                  Preto &amp; Branco Editorial
                </button>
              </div>
            </div>

            {/* Coluna da Direita: Retrato com Citação Imersiva */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
              <motion.div {...animFade(0.2)} className="relative">
                
                {/* Fotografia Artística (com transição suave para preto e branco) */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-stone-900 shadow-2xl border border-stone-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoOriginal}
                    alt={perfil.nome}
                    className={cn(
                      "h-full w-full object-cover object-top transition-all duration-700 ease-out",
                      fotoPB ? "grayscale contrast-125 brightness-95" : "brightness-[0.98] contrast-[1.03]"
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Grande Citação em Aspas Clássicas */}
                <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-7 sm:p-8 shadow-lg">
                  <span className="font-titulo text-5xl text-[#A35A3A]/40 block leading-none select-none">“</span>
                  <blockquote className="font-titulo text-xl sm:text-2xl italic leading-relaxed text-slate-800 mt-1">
                    {citacao}
                  </blockquote>
                  <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A35A3A]">
                      {perfil.nome}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Princípio Pessoal</span>
                  </div>
                </div>

              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. FORMAÇÃO E ESPECIALIZAÇÃO — DECISÕES MAIS SEGURAS          */}
      {/* ============================================================== */}
      <section className="relative bg-[#0B1524] text-white py-24 sm:py-36 border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Lado Esquerdo: Retrato de Ambiente no Escritório */}
            <div className="lg:col-span-5">
              <motion.div {...animFade(0.1)} className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoHeroEscritorio}
                    alt="Samantha Louzeiro no escritório"
                    className="h-full w-full object-cover object-center filter brightness-[0.92] contrast-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1524] via-transparent to-transparent" />
                </div>
              </motion.div>
            </div>

            {/* Lado Direito: Qualificações Reais Apresentadas de Forma Elegante */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div {...animFade(0)}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-marca-latao">
                  Formação e Especialização
                </span>
                
                <h2 className="mt-3 font-titulo text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.14] text-white">
                  Estudo contínuo para decisões{" "}
                  <span className="italic text-marca-latao">mais seguras.</span>
                </h2>

                <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-300 font-corpo font-light">
                  A formação acadêmica sólida e a busca constante por atualização permitem uma atuação técnica, moderna e alinhada às necessidades reais dos clientes. A especialização é parte essencial da minha trajetória e da qualidade do trabalho que entrego.
                </p>
              </motion.div>

              {/* 3 Pilares Estruturais da Atuação */}
              <motion.div {...animFade(0.2)} className="grid gap-4 sm:grid-cols-3 pt-4">
                
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-marca-latao/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-marca-latao/15 text-marca-latao mb-4">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <h3 className="font-titulo text-base font-semibold text-white">
                    Formação em Direito
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Base sólida pela Universidade Estadual do Piauí (UESPI, 2014) para atuação ética e responsável.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-marca-latao/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-marca-latao/15 text-marca-latao mb-4">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-titulo text-base font-semibold text-white">
                    Atualização constante
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Acompanhamento diário da evolução da legislação e da jurisprudência dos Tribunais Superiores.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm transition-all hover:border-marca-latao/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-marca-latao/15 text-marca-latao mb-4">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="font-titulo text-base font-semibold text-white">
                    Visão estratégica
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Análise técnica com foco preventivo, conciliação e soluções jurídicas sob medida.
                  </p>
                </div>

              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. LINHA DO TEMPO — MARCOS REAIS DA CARREIRA                  */}
      {/* ============================================================== */}
      <section className="relative bg-[#FAF9F7] text-slate-900 py-24 sm:py-36 border-b border-stone-200">
        <div className="container mx-auto px-6 lg:px-12">
          
          <motion.div {...animFade(0)} className="max-w-2xl mb-16">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A35A3A]">
              Linha do Tempo
            </span>
            <h2 className="mt-3 font-titulo text-3xl sm:text-4xl lg:text-5xl font-normal text-slate-900">
              Momentos da minha <span className="italic text-[#A35A3A]">trajetória.</span>
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-corpo">
              Uma caminhada construída com estudo, dedicação e experiências reais que fortalecem a minha atuação profissional.
            </p>
          </motion.div>

          {/* Timeline Horizontal no Desktop / Vertical no Mobile */}
          <div className="relative">
            {/* Linha contínua conectando os marcos */}
            <div className="hidden lg:block absolute top-6 inset-x-8 h-0.5 bg-gradient-to-r from-[#A35A3A]/30 via-[#A35A3A] to-[#A35A3A]/40" />

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
              
              {/* Marco 1 */}
              <motion.div {...animFade(0.1)} className="relative group">
                <div className="flex items-center gap-3 lg:block">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#A35A3A] bg-white text-[#A35A3A] shadow-md group-hover:scale-110 group-hover:bg-[#A35A3A] group-hover:text-white transition-all">
                    <span className="h-3 w-3 rounded-full bg-[#A35A3A] group-hover:bg-white" />
                  </div>
                  <span className="lg:mt-6 block font-titulo text-2xl font-bold text-[#A35A3A]">
                    2014
                  </span>
                </div>
                <h3 className="mt-3 font-titulo text-lg font-semibold text-slate-900">
                  Início da jornada
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-corpo">
                  Formação acadêmica em Direito pela UESPI e primeiros passos na advocacia técnica e consultiva.
                </p>
              </motion.div>

              {/* Marco 2 */}
              <motion.div {...animFade(0.2)} className="relative group">
                <div className="flex items-center gap-3 lg:block">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#A35A3A] bg-white text-[#A35A3A] shadow-md group-hover:scale-110 group-hover:bg-[#A35A3A] group-hover:text-white transition-all">
                    <span className="h-3 w-3 rounded-full bg-[#A35A3A] group-hover:bg-white" />
                  </div>
                  <span className="lg:mt-6 block font-titulo text-2xl font-bold text-[#A35A3A]">
                    2017
                  </span>
                </div>
                <h3 className="mt-3 font-titulo text-lg font-semibold text-slate-900">
                  Experiência prática
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-corpo">
                  Atuação em demandas jurídicas diversificadas, com foco em proximidade humana e rigor processual.
                </p>
              </motion.div>

              {/* Marco 3 */}
              <motion.div {...animFade(0.3)} className="relative group">
                <div className="flex items-center gap-3 lg:block">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#A35A3A] bg-white text-[#A35A3A] shadow-md group-hover:scale-110 group-hover:bg-[#A35A3A] group-hover:text-white transition-all">
                    <span className="h-3 w-3 rounded-full bg-[#A35A3A] group-hover:bg-white" />
                  </div>
                  <span className="lg:mt-6 block font-titulo text-2xl font-bold text-[#A35A3A]">
                    2020
                  </span>
                </div>
                <h3 className="mt-3 font-titulo text-lg font-semibold text-slate-900">
                  Especialização
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-corpo">
                  Aprofundamento técnico em contencioso recursal e ampliação da assessoria a empresas e pessoas físicas.
                </p>
              </motion.div>

              {/* Marco 4 */}
              <motion.div {...animFade(0.4)} className="relative group">
                <div className="flex items-center gap-3 lg:block">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#A35A3A] bg-white text-[#A35A3A] shadow-md group-hover:scale-110 group-hover:bg-[#A35A3A] group-hover:text-white transition-all">
                    <span className="h-3 w-3 rounded-full bg-[#A35A3A] group-hover:bg-white" />
                  </div>
                  <span className="lg:mt-6 block font-titulo text-2xl font-bold text-[#A35A3A]">
                    2023
                  </span>
                </div>
                <h3 className="mt-3 font-titulo text-lg font-semibold text-slate-900">
                  Consolidação
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-corpo">
                  Estabelecimento da Louzeiro Advocacia em Brasília, atuando perante Tribunais Superiores (STF/STJ) e TRFs.
                </p>
              </motion.div>

              {/* Marco 5 */}
              <motion.div {...animFade(0.5)} className="relative group">
                <div className="flex items-center gap-3 lg:block">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#A35A3A] bg-white text-[#A35A3A] shadow-md group-hover:scale-110 group-hover:bg-[#A35A3A] group-hover:text-white transition-all">
                    <Sparkles className="h-4 w-4 text-[#A35A3A] group-hover:text-white" />
                  </div>
                  <span className="lg:mt-6 block font-titulo text-2xl font-bold text-[#A35A3A]">
                    Hoje
                  </span>
                </div>
                <h3 className="mt-3 font-titulo text-lg font-semibold text-slate-900">
                  Compromisso contínuo
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600 font-corpo">
                  Estudo permanente, atendimento artesanal e dedicação diária à defesa dos interesses legítimos dos clientes.
                </p>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. FILOSOFIA DE TRABALHO — O QUE GUIA O MEU TRABALHO          */}
      {/* ============================================================== */}
      <section className="relative bg-[#0A131F] text-white py-24 sm:py-36 border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
            
            {/* Lado Esquerdo: O Princípio Fundamental */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div {...animFade(0)}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-marca-latao">
                  Princípios
                </span>
                
                <h2 className="mt-3 font-titulo text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.14] text-white">
                  O que guia o{" "}
                  <span className="italic text-marca-latao">meu trabalho.</span>
                </h2>

                <p className="mt-6 text-base sm:text-lg leading-relaxed text-slate-300 font-corpo font-light">
                  Cada caso é único e merece atenção, escuta e análise personalizada. Acredito em uma advocacia ética, transparente e próxima, com foco na segurança jurídica construída de forma sólida e responsável.
                </p>
              </motion.div>
            </div>

            {/* Lado Direito: Os 4 Pilares Deontológicos */}
            <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2">
              
              <motion.div {...animFade(0.1)} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-marca-latao/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-latao/15 text-marca-latao mb-4">
                  <Scale className="h-5 w-5" />
                </div>
                <h3 className="font-titulo text-lg font-medium text-white">Ética</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 font-corpo">
                  Atuação sempre pautada pela integridade, sobriedade e respeito irrestrito às normas deontológicas.
                </p>
              </motion.div>

              <motion.div {...animFade(0.2)} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-marca-latao/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-latao/15 text-marca-latao mb-4">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-titulo text-lg font-medium text-white">Compromisso</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 font-corpo">
                  Dedicação real a cada cliente e compreensão aprofundada da história e do contexto de cada demanda.
                </p>
              </motion.div>

              <motion.div {...animFade(0.3)} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-marca-latao/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-latao/15 text-marca-latao mb-4">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-titulo text-lg font-medium text-white">Transparência</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 font-corpo">
                  Informação clara, direta e acessível em todas as etapas processuais, sem promessas ilusórias.
                </p>
              </motion.div>

              <motion.div {...animFade(0.4)} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-all hover:border-marca-latao/40">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marca-latao/15 text-marca-latao mb-4">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-titulo text-lg font-medium text-white">Segurança Jurídica</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 font-corpo">
                  Estratégia jurídica preventiva e contenciosa fundamentada para orientar decisões com firmeza.
                </p>
              </motion.div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. A VISÃO DA ADVOGADA — PESSOAS, HISTÓRIAS E DIREITOS        */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-[#070E17] text-white py-24 sm:py-36">
        <div className="container mx-auto px-6 lg:px-12">
          
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-center">
            
            {/* Lado Esquerdo: Fotografia em Tela Cheia / Destaque */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <motion.div {...animFade(0.1)} className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/20 bg-slate-950 shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={fotoOriginal}
                    alt="Samantha Azevedo Louzeiro - Reflexão"
                    className="h-full w-full object-cover object-top filter brightness-[0.95] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070E17] via-transparent to-transparent pointer-events-none" />
                </div>
              </motion.div>
            </div>

            {/* Lado Direito: Encerramento com Reflexão Pessoal */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
              <motion.div {...animFade(0)}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A35A3A]">
                  Mais que Processos
                </span>
                
                <h2 className="mt-3 font-titulo text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.12] text-white">
                  Pessoas, histórias{" "}
                  <span className="italic text-marca-latao">e direitos.</span>
                </h2>

                <div className="mt-6 space-y-5 text-base sm:text-lg leading-relaxed text-slate-300 font-corpo font-light">
                  <p className="text-xl sm:text-2xl text-slate-100 font-normal leading-relaxed">
                    A minha atuação é guiada por pessoas. Cada cliente traz uma história, um contexto e um objetivo legítimo.
                  </p>
                  <p>
                    Meu papel é oferecer segurança jurídica, orientação clara e uma condução técnica que respeite a sua realidade. Mais do que representar em juízo, a advocacia que pratico visa restabelecer o equilíbrio e dar voz com dignidade àqueles que confiam em nosso trabalho.
                  </p>
                </div>

                {/* Reflexão de Grande Porte */}
                <div className="mt-8 rounded-2xl border-l-4 border-l-marca-latao bg-white/[0.03] p-6 backdrop-blur-sm">
                  <p className="font-titulo text-xl sm:text-2xl italic text-slate-100">
                    “O Direito ganha verdadeira nobreza quando exercido com respeito à dignidade humana.”
                  </p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-marca-latao">
                    Dra. {perfil.nome}
                  </p>
                </div>

                {/* Contato Institucional Discreto e Imponente */}
                <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4">
                  <Link
                    href={
                      temWhatsapp
                        ? whatsappLink(`Olá! Gostaria de conversar com a Dra. Samantha Azevedo Louzeiro sobre uma consulta.`)
                        : "#contato"
                    }
                    target={temWhatsapp ? "_blank" : undefined}
                    className="inline-flex items-center gap-2 rounded-xl bg-marca-latao px-7 py-4 text-sm font-bold text-marca-tinta shadow-xl shadow-marca-latao/25 hover:bg-marca-latao/90 transition-all hover:scale-[1.02]"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Entrar em Contato com a Advogada</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/areas-de-atuacao"
                    className="inline-flex items-center rounded-xl border border-white/20 bg-white/[0.03] px-6 py-4 text-sm font-semibold text-white hover:border-marca-latao hover:text-marca-latao transition-all"
                  >
                    Ver Áreas de Atuação
                  </Link>
                </div>
              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. PUBLICAÇÕES INFORMATIVAS ASSINADAS                          */}
      {/* ============================================================== */}
      {publicacoes.length > 0 && (
        <section className="relative border-t border-white/10 bg-[#0A131F] py-20 lg:py-28">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-marca-latao">
                  Produção Intelectual
                </span>
                <h2 className="mt-2 font-titulo text-3xl font-normal text-white sm:text-4xl">
                  Artigos e Pareceres de {perfil.nome.split(" ")[0]}
                </h2>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm font-semibold text-marca-latao hover:underline"
              >
                <span>Ver todas as publicações</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {publicacoes.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================================== */}
      {/* 8. CONTATO INSTITUCIONAL                                      */}
      {/* ============================================================== */}
      <div className="relative border-t border-white/10">
        <Contact />
      </div>

    </article>
  )
}
