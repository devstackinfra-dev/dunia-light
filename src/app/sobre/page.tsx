import Link from "next/link"
import Image from "next/image"
import DuniaGalleryViewer from "@/components/dunia-gallery-viewer"
import { Building, Sparkles, Award, Users, CheckCircle2, Crown, Shield } from "lucide-react"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"

export const metadata = {
  title: "Sobre a Estrutura do Salão | Dúnia City Hall Lago Sul Brasília",
  description: "2.500 m² de arquitetura suntuosa, duas opções luxuosas de salões, capacidade para até 1.200 convidados e histórico de autoridades ilustres e do Rei Pelé.",
}

export default function SobrePage() {
  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      <DuniaHeader currentPage="/sobre" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#ABA29A]">
          <Link href="/" className="hover:text-white transition">Início</Link>
          <span>/</span>
          <span className="text-[#D3B47C]">O Salão • Sobre</span>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161311] shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <Image
              src="/images/dunia/salao-principal.jpg"
              alt="Salão Dúnia City Hall"
              fill
              priority
              className="object-cover filter brightness-[0.45] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] w-fit">
                <Building className="h-3 w-3" />
                ARQUITETURA & SUNTUOSIDADE
              </span>
              <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
                O Salão Mais Elegante<br />
                de <em className="italic text-[#D3B47C]">Brasília</em>
              </h1>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                Situado em área nobre do Lago Sul, desenhado para cerimônias de alto padrão e celebrações memoráveis.
              </p>
            </div>
          </div>
        </section>

        {/* TEXTO OFICIAL DO SITE */}
        <section className="my-12 rounded-3xl bg-[#F3EEE6] p-8 sm:p-14 text-[#271E17] shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D37]">
              DÚNIA CITY HALL • LAGO SUL
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal leading-snug sm:text-4xl">
              A beleza em forma arquitetônica e luxo em ambientação
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              Com aproximadamente <strong>2.500 m²</strong>, o Dúnia possui duas luxuosas opções de salões e você poderá receber até <strong>1.200 convidados</strong>, que estarão deslumbrados com cada detalhe da sua festa.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              O nosso espaço já recebeu a visita de grandes autoridades internacionais e também brasileiras. Entre eles estão: Ex-Presidente Lula, Ex-Presidente Temer, a Primeira-Dama Michelle Bolsonaro, autoridades dos Três Poderes e famosos como o <strong>Rei Pelé</strong>.
            </p>
            <div className="mt-6 font-serif italic text-lg text-[#8C6D37]">
              &ldquo;Temos a beleza em forma arquitetônica. Luxo em sua ambientação. Qualidade no atendimento. Tudo para eternizar a realização do seu sonho!&rdquo;
            </div>
          </div>
        </section>

        {/* NÚMEROS E CAPACIDADE */}
        <section className="my-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-center">
            <div className="font-serif text-3xl sm:text-4xl text-[#D3B47C]">2.500 m²</div>
            <div className="mt-2 text-xs text-[#ABA29A] uppercase tracking-wider">Área Nobre Lago Sul</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-center">
            <div className="font-serif text-3xl sm:text-4xl text-[#D3B47C]">1.200</div>
            <div className="mt-2 text-xs text-[#ABA29A] uppercase tracking-wider">Convidados no Máximo</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-center">
            <div className="font-serif text-3xl sm:text-4xl text-[#D3B47C]">2 Salões</div>
            <div className="mt-2 text-xs text-[#ABA29A] uppercase tracking-wider">Modulares & Acústicos</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-center">
            <div className="font-serif text-3xl sm:text-4xl text-[#D3B47C]">+15 anos</div>
            <div className="mt-2 text-xs text-[#ABA29A] uppercase tracking-wider">Desde 2008</div>
          </div>
        </section>

        {/* DETALHAMENTO DOS ESPAÇOS */}
        <section className="my-12 grid gap-8 md:grid-cols-2">
          {/* Salão Principal */}
          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
            <h3 className="font-serif text-2xl text-white">Dois Salões Luxuosos Integrados</h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
              Paredes acústicas retráteis permitem modular o espaço de acordo com o tamanho da sua celebração — seja um jantar intimista para 100 convidados ou uma grande solenidade para até 1.200 pessoas.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                <span>Pé-direito duplo imponente com lustres clássicos de cristal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                <span>Tratamento termoacústico para conforto absoluto</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                <span>Climatização central automatizada de alta vazão</span>
              </li>
            </ul>
          </div>

          {/* Infraestrutura e Segurança */}
          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
            <h3 className="font-serif text-2xl text-white">Infraestrutura e Segurança Privativa</h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
              Projetado para acolher chefes de Estado, autoridades e famílias com a máxima discrição, segurança e estabilidade operacional.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                <span>Gerador próprio de energia de alta capacidade</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                <span>Espaço da Noiva exclusivo com camarim privativo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#D3B47C]" />
                <span>Estacionamento privativo com serviço de valet</span>
              </li>
            </ul>
          </div>
        </section>

        {/* FERRAMENTA DE GALERIA COMPLETA */}
        <DuniaGalleryViewer
          initialCategory="salao"
          title="Estrutura, Salões & Detalhes"
          subtitle="2.500 M² NO LAGO SUL"
          showFilmReel={true}
          itemsPerPage={12}
        />

        {/* CTA FINAL */}
        <section className="my-12 text-center py-10 px-6 rounded-3xl bg-[#161311] border border-white/10">
          <h3 className="font-serif text-3xl text-white">
            Conheça o Dúnia City Hall Pessoalmente
          </h3>
          <p className="mt-3 max-w-lg mx-auto text-xs sm:text-sm text-[#ABA29A]">
            Agende uma visita VIP guiada para vivenciar a grandiosidade da nossa arquitetura e planejar sua celebração.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20VIP%20para%20conhecer%20a%20estrutura%20do%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#D3B47C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
            >
              AGENDAR VISITA VIP GUIADA
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
