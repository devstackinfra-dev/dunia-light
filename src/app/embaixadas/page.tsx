import Link from "next/link"
import Image from "next/image"
import { Globe2, ShieldCheck, Crown, Landmark, CheckCircle2, ArrowRight } from "lucide-react"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"

export const metadata = {
  title: "Embaixadas e Recepções Diplomáticas no Lago Sul | Dúnia City Hall",
  description: "A excelência diplomática a seu alcance. Luxo, tradição, segurança e celebrações interculturais para corpos diplomáticos e representações internacionais.",
}

export default function EmbaixadasPage() {
  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      <DuniaHeader currentPage="/embaixadas" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#ABA29A]">
          <Link href="/" className="hover:text-white transition">Início</Link>
          <span>/</span>
          <span className="text-[#D3B47C]">Embaixadas & Diplomacia</span>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161311] shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <Image
              src="/images/dunia/embaixadas-galeria.jpg"
              alt="Recepção Diplomática no Dúnia City Hall"
              fill
              priority
              className="object-cover filter brightness-[0.45] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] w-fit">
                <Globe2 className="h-3 w-3" />
                DIPLOMACIA & REPRESENTAÇÕES INTERNACIONAIS
              </span>
              <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
                A Excelência Diplomática<br />
                A seu <em className="italic text-[#D3B47C]">Alcance</em>
              </h1>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                Reconhecimento global em acolhimento a datas nacionais, comemorações consulares e recepções de chefes de Estado.
              </p>
            </div>
          </div>
        </section>

        {/* TEXTO OFICIAL DO SITE */}
        <section className="my-12 rounded-3xl bg-[#F3EEE6] p-8 sm:p-14 text-[#271E17] shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D37]">
              SOFISTICAÇÃO & PROTOCOLO
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal leading-snug sm:text-4xl">
              Onde a diplomacia encontra sofisticação
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              No Dúnia City Hall, a diplomacia encontra sofisticação em um ambiente que celebra a importância de momentos únicos. Nossa reputação como o local de escolha para embaixadas e representações internacionais é um testemunho de nossa excelência reconhecida globalmente.
            </p>
            <div className="mt-6 font-serif italic text-lg text-[#8C6D37]">
              &ldquo;Cada cultura é honrada em um cenário de requinte e aconchego, tornando o Dúnia a escolha perfeita para embaixadas e consulados que desejam celebrar com excelência.&rdquo;
            </div>
          </div>
        </section>

        {/* OS 3 PILARES DIPLOMÁTICOS (TEXTO OFICIAL DO SITE) */}
        <section className="my-12">
          <div className="grid gap-6 md:grid-cols-3">
            {/* 1 */}
            <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
                <Crown className="h-6 w-6" />
              </div>
              <span className="mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                DIFERENCIAL 01
              </span>
              <h4 className="mt-1 font-serif text-2xl text-white">
                Luxo e Tradição em um Só Lugar
              </h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                O Dúnia é sinônimo de luxo e tradição em Brasília, tornando-se o destino preferido para eventos de prestígio. Cada detalhe é meticulosamente planejado para superar expectativas, transformando momentos especiais em memórias inesquecíveis.
              </p>
            </div>

            {/* 2 */}
            <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
                <Landmark className="h-6 w-6" />
              </div>
              <span className="mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                DIFERENCIAL 02
              </span>
              <h4 className="mt-1 font-serif text-2xl text-white">
                Elegância em Cada Detalhe
              </h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                Nossos eventos são uma combinação harmoniosa de decorações sofisticadas e mesas impecavelmente arranjadas. Cada detalhe reflete a grandeza e importância do momento, honrando a tradição de embaixadas e consulados.
              </p>
            </div>

            {/* 3 */}
            <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
                <Globe2 className="h-6 w-6" />
              </div>
              <span className="mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                DIFERENCIAL 03
              </span>
              <h4 className="mt-1 font-serif text-2xl text-white">
                Ambientes Interculturais
              </h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                Celebramos eventos com ambientes personalizados que respeitam e homenageiam as tradições de cada país. Com nossa expertise, proporcionamos uma experiência única onde os convidados se sentem verdadeiramente em casa.
              </p>
            </div>
          </div>
        </section>

        {/* PROTOCOLO E SEGURANÇA */}
        <section className="my-12 rounded-3xl border border-white/10 bg-[#161311] p-8 sm:p-10 shadow-xl">
          <div className="grid gap-6 md:grid-cols-2 items-center">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                DISCRIÇÃO & SEGURANÇA
              </span>
              <h3 className="mt-2 font-serif text-3xl text-white">
                Padrão de Atendimento Diplomático
              </h3>
              <p className="mt-3 text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                Nossa equipe é altamente treinada em protocolo cerimonial, segurança privada, controle rigoroso de acesso e coordenação com batedores e comitivas oficiais.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                  <span>Acesso VIP reservado para veículos de embaixadores e comitivas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                  <span>Sala de apoio e espera para corpo de segurança diplomática</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                  <span>Menus adaptados conforme diretrizes alimentares e culturais</span>
                </li>
              </ul>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
              <Image
                src="/assets/mesa.jpg"
                alt="Banquete diplomático no Dúnia"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="my-12 text-center py-10 px-6 rounded-3xl bg-[#161311] border border-white/10">
          <h3 className="font-serif text-3xl text-white">
            Planeje sua Recepção com Excelência Diplomática
          </h3>
          <p className="mt-3 max-w-lg mx-auto text-xs sm:text-sm text-[#ABA29A]">
            Atendimento exclusivo para adidos culturais, cônsules e encarregados de negócios para celebrações de datas nacionais e bilaterais.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20um%20atendimento%20diplom%C3%A1tico/consular%20com%20o%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#D3B47C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
            >
              FALAR COM CONCIERGE DIPLOMÁTICO
            </a>
            <Link
              href="/"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white transition hover:bg-white/10"
            >
              Voltar ao Início
            </Link>
          </div>
        </section>
      </main>

      <DuniaFooter />
    </div>
  )
}
