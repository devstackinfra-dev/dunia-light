import Link from "next/link"
import Image from "next/image"
import DuniaGalleryViewer from "@/components/dunia-gallery-viewer"
import { Sparkles, Heart, CheckCircle2, ArrowRight, ExternalLink, ShieldCheck, Clock, Users } from "lucide-react"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"

export const metadata = {
  title: "Casamento dos Sonhos no Lago Sul | Dúnia City Hall Brasília",
  description: "Desde 2008, eternizamos momentos especiais com elegância. Conceito clássico e romântico, Espaço da Noiva exclusivo e cenografia monumental.",
}

export default function CasamentoPage() {
  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      <DuniaHeader currentPage="/casamento" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#ABA29A]">
          <Link href="/" className="hover:text-white transition">Início</Link>
          <span>/</span>
          <span className="text-[#D3B47C]">Casamento</span>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161311] shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <Image
              src="/images/dunia/casamento-hero.jpg"
              alt="Casamento no Dúnia City Hall"
              fill
              priority
              className="object-cover filter brightness-[0.45] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] w-fit">
                <Heart className="h-3 w-3 fill-current" />
                CONCEITO CLÁSSICO & ROMÂNTICO
              </span>
              <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
                O Cenário dos Sonhos<br />
                Para o Seu <em className="italic text-[#D3B47C]">Casamento</em>
              </h1>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                Desde 2008 realizando sonhos e eternizando o amor no endereço mais nobre de Brasília.
              </p>
            </div>
          </div>
        </section>

        {/* TEXTO OFICIAL DO SITE */}
        <section className="my-12 rounded-3xl bg-[#F3EEE6] p-8 sm:p-14 text-[#271E17] shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D37]">
              DÚNIA CITY HALL • DESDE 2008
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal leading-snug sm:text-4xl">
              Eternizando momentos especiais com elegância
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              No Dúnia City Hall, desde 2008, eternizamos momentos especiais com elegância. Nosso conceito clássico e romântico transforma cada detalhe, tornando seu casamento um conto de fadas mágico.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              Nossa decoração elegante em tons suaves, com paleta de cores delicadas, transforma cada celebração em um ambiente suave e memorável. No Dúnia City Hall, a magia dos detalhes é prioridade.
            </p>
            <div className="mt-6 font-serif italic text-lg text-[#8C6D37]">
              &ldquo;Venha fazer parte desta história de amor.&rdquo;
            </div>
          </div>
        </section>

        {/* DIFERENCIAIS ESPECÍFICOS: ESPAÇO DA NOIVA & AMBIENTAÇÃO */}
        <section className="my-12 grid gap-8 md:grid-cols-2">
          {/* Espaço da Noiva */}
          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-2xl text-white">
                Espaço da Noiva Exclusivo
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#ABA29A]">
                Oferecemos um espaço da noiva exclusivo, projetado para conforto e tranquilidade. Cada detalhe, desde a iluminação até os espaços funcionais, garante que a noiva se sinta única e confiante. Sorrisos que irradiam alegria preenchem nossos eventos, celebrando o amor.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                  <span>Camarim privativo com iluminação de camarim profissional</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                  <span>Ambiente climatizado com total privacidade para noiva e madrinhas</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                  <span>Acesso direto ao salão principal para uma entrada triunfal</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-[#D3B47C]">
              Tranquilidade e conforto antes do sim
            </div>
          </div>

          {/* Cenografia e Gastronomia */}
          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-serif text-2xl text-white">
                Decoração Clássica e Romântica
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#ABA29A]">
                Lustres clássicos de cristal, pé-direito suntuoso e paleta de cores personalizada. Cada arranjo floral e ponto de luz é desenhado para valorizar a fotografia e criar uma atmosfera inesquecível para os convidados.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-white/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                  <span>Salão modular com capacidade para até 1.200 convidados</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                  <span>Buffet Dúnia autoral com cozinha internacional e finger foods</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                  <span>Acústica de alto desempenho para orquestra e banda</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 text-xs text-[#D3B47C]">
              2.500 m² de sofisticação no Lago Sul
            </div>
          </div>
        </section>

        {/* FERRAMENTA DE GALERIA COMPLETA */}
        <DuniaGalleryViewer
          initialCategory="casamento"
          title="Galeria de Casamentos Reais"
          subtitle="O SIM NO LAGO SUL"
          showFilmReel={true}
          itemsPerPage={12}
        />

        {/* INTEGRAÇÃO DÚNIA EXPERIENCE OS */}
        <section className="my-12 rounded-3xl border border-[#D3B47C]/30 bg-gradient-to-br from-[#221B13] via-[#161311] to-[#100E0D] p-8 sm:p-12 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                EXCLUSIVIDADE DIGITAL DO SALÃO
              </span>
              <h3 className="font-serif text-3xl text-white">
                Dúnia Experience OS Incluso no Seu Casamento
              </h3>
              <p className="text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                Ao celebrar seu casamento no Dúnia, o casal recebe gratuitamente um <strong>Mini-site Personalizado</strong> para os convidados com contagem regressiva, rotas Waze/Maps, confirmação de presença (RSVP) por código, e o <strong>Painel do Casal</strong> para acompanhamento em tempo real e portaria com QR Code.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/evento"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#D3B47C] bg-[#D3B47C]/10 px-4 py-2.5 text-xs font-bold text-[#D3B47C] transition hover:bg-[#D3B47C] hover:text-[#100E0D]"
                >
                  <span>Ver Mini-site Demonstrativo</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/painel"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  <span>Acessar Painel do Casal</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <div className="text-center md:text-right shrink-0">
              <div className="font-serif text-4xl text-[#D3B47C]">100%</div>
              <div className="text-xs text-[#ABA29A] uppercase tracking-wider">Integrado ao Salão</div>
            </div>
          </div>
        </section>

        {/* CTA FINAL ORÇAMENTO */}
        <section className="my-12 text-center py-10 px-6 rounded-3xl bg-[#161311] border border-white/10">
          <h3 className="font-serif text-3xl text-white">
            Planeje o Casamento dos Seus Sonhos
          </h3>
          <p className="mt-3 max-w-lg mx-auto text-xs sm:text-sm text-[#ABA29A]">
            Nossa equipe de concierge está pronta para apresentar o salão, o camarim da noiva e as opções gastronômicas do Buffet Dúnia.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20meu%20Casamento%20no%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#D3B47C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
            >
              SOLICITAR ORÇAMENTO DE CASAMENTO
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
