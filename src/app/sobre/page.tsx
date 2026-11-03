import Link from "next/link"
import Image from "next/image"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"
import DuniaGalleryViewer from "@/components/dunia-gallery-viewer"
import DuniaVirtualTour360 from "@/components/dunia-virtual-tour-360"
import SobreSpacesDetails from "@/components/sobre/sobre-spaces-details"
import {
  Building,
  Sparkles,
  Award,
  Users,
  CheckCircle2,
  Crown,
  Shield,
  Compass,
  Zap,
  ArrowRight,
  PhoneCall,
  Calendar,
} from "lucide-react"

export const metadata = {
  title: "Sobre a Estrutura do Salão & Tour 360° | Dúnia City Hall Lago Sul Brasília",
  description: "2.500 m² de arquitetura suntuosa, pé-direito duplo de 7 metros, tour virtual 360° interativo, capacidade de até 1.200 convidados e histórico de autoridades ilustres e do Rei Pelé.",
}

export default function SobrePage() {
  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      <DuniaHeader currentPage="/sobre" />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#ABA29A]">
          <Link href="/" className="hover:text-white transition">Início</Link>
          <span>/</span>
          <span className="text-[#D3B47C]">O Salão • Sobre & Tour 360°</span>
        </div>

        {/* 1. HERO EDITORIAL COM FOTO PANORÂMICA */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161311] shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <Image
              src="/images/acervo/03-casamento/Decoracao-31.jpg"
              alt="Salão Dúnia City Hall Lago Sul"
              fill
              priority
              className="object-cover filter brightness-[0.40] contrast-[1.08]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3.5 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] w-fit backdrop-blur-md">
                <Building className="h-3 w-3" />
                ARQUITETURA, SUNTUOSIDADE & ENGENHARIA
              </span>
              <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
                O Salão Mais Elegante<br />
                de <em className="italic text-[#D3B47C]">Brasília</em>
              </h1>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                2.500 m² de infraestrutura nobre no Lago Sul, pé-direito duplo de 7 metros, lustres clássicos de cristal, tour virtual 360° e acolhimento para celebrações de até 1.200 convidados.
              </p>

              {/* Botões Rápidos de Navegação Interna */}
              <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">
                <a
                  href="#tour-360"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#D3B47C] px-4 py-2.5 text-[#100E0D] font-bold uppercase hover:bg-[#D3B47C]/90 transition shadow-lg"
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>Explorar Tour 360°</span>
                </a>
                <a
                  href="#espacos-detalhes"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white hover:bg-white/20 transition backdrop-blur-sm"
                >
                  <span>Divisão dos Espaços</span>
                </a>
                <a
                  href="#capacidade-layout"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-white hover:bg-white/20 transition backdrop-blur-sm"
                >
                  <span>Capacidade & Layouts</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 2. NÚMEROS E CAPACIDADE ESTRUTURAL */}
        <section className="my-12 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 text-center transition hover:border-[#D3B47C]/40">
            <div className="font-serif text-2xl sm:text-3xl text-[#D3B47C]">2.500 m²</div>
            <div className="mt-1 text-[0.65rem] text-[#ABA29A] uppercase tracking-wider">Área Privativa Nobre</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 text-center transition hover:border-[#D3B47C]/40">
            <div className="font-serif text-2xl sm:text-3xl text-[#D3B47C]">7 Metros</div>
            <div className="mt-1 text-[0.65rem] text-[#ABA29A] uppercase tracking-wider">Pé-Direito Duplo</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 text-center transition hover:border-[#D3B47C]/40">
            <div className="font-serif text-2xl sm:text-3xl text-[#D3B47C]">1.200</div>
            <div className="mt-1 text-[0.65rem] text-[#ABA29A] uppercase tracking-wider">Capacidade Máxima</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 text-center transition hover:border-[#D3B47C]/40">
            <div className="font-serif text-2xl sm:text-3xl text-[#D3B47C]">2 Salões</div>
            <div className="mt-1 text-[0.65rem] text-[#ABA29A] uppercase tracking-wider">Modulares & Acústicos</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 text-center transition hover:border-[#D3B47C]/40">
            <div className="font-serif text-2xl sm:text-3xl text-[#D3B47C]">250 kVA</div>
            <div className="mt-1 text-[0.65rem] text-[#ABA29A] uppercase tracking-wider">Gerador de Emergência</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5 text-center transition hover:border-[#D3B47C]/40">
            <div className="font-serif text-2xl sm:text-3xl text-[#D3B47C]">48 dB</div>
            <div className="mt-1 text-[0.65rem] text-[#ABA29A] uppercase tracking-wider">Isolamento Acústico</div>
          </div>
        </section>

        {/* 3. TOUR VIRTUAL 360° INTERATIVO */}
        <section id="tour-360">
          <DuniaVirtualTour360 />
        </section>

        {/* 4. DETALHAMENTO DOS ESPAÇOS, CAPACIDADES & FICHA TÉCNICA */}
        <section id="espacos-detalhes">
          <SobreSpacesDetails />
        </section>

        {/* 5. HISTÓRICO DE PRESTÍGIO, AUTORIDADES E O REI PELÉ */}
        <section className="my-16 rounded-3xl border border-white/10 bg-gradient-to-b from-[#181412] to-[#12100E] p-8 sm:p-14 shadow-2xl">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/10 text-[#D3B47C]">
              <Crown className="h-6 w-6" />
            </div>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#D3B47C]">
              TRADIÇÃO & PRESTÍGIO EM BRASÍLIA
            </span>
            <h3 className="font-serif text-3xl font-normal leading-snug text-white sm:text-4xl">
              O Palco das Celebrações Mais Ilustres da Capital
            </h3>
            <div className="mx-auto h-px w-20 bg-gradient-to-r from-transparent via-[#D3B47C]/60 to-transparent" />
            <p className="text-xs sm:text-sm leading-relaxed text-[#ABA29A] pt-2">
              Desde 2008, o Dúnia City Hall é a escolha definitiva de famílias tradicionais, embaixadas, entidades internacionais e grandes personalidades brasileiras.
            </p>
            <p className="text-xs sm:text-sm leading-relaxed text-[#D6CEBE]/90 font-light">
              Nosso espaço já teve a honra de receber autoridades dos Três Poderes, diplomatas e ícones mundiais como o <strong>Rei Pelé</strong>, todos acolhidos com a máxima discrição, segurança e alta gastronomia.
            </p>
            <div className="pt-4 font-serif italic text-base sm:text-lg text-[#D3B47C]">
              &ldquo;Temos a beleza em forma arquitetônica. Luxo em sua ambientação. Rigor técnico em cada detalhe. Tudo para eternizar o seu momento mais importante.&rdquo;
            </div>
          </div>
        </section>

        {/* 6. GALERIA COMPLETA DE FOTOGRAFIAS DO SALÃO */}
        <section className="my-16">
          <DuniaGalleryViewer
            initialCategory="salao"
            title="Acervo Fotográfico de Arquitetura & Salões"
            subtitle="2.500 M² DE DETALHES & DISTINÇÃO"
            showFilmReel={true}
            itemsPerPage={12}
          />
        </section>

        {/* 7. CTA DE AGENDAMENTO DE VISITA TÉCNICA VIP */}
        <section className="my-16 text-center py-12 px-6 rounded-3xl bg-[#161311] border border-[#D3B47C]/30 shadow-2xl">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              ATENDIMENTO EXCLUSIVO
            </span>
            <h3 className="font-serif text-3xl text-white sm:text-4xl">
              Agende uma Visita Técnica Guiada
            </h3>
            <p className="text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
              Traga o seu cerimonialista ou decorador para vivenciar a acústica, medir os vãos cenográficos e conhecer pessoalmente a infraestrutura do Dúnia City Hall.
            </p>
            <div className="pt-6 flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20t%C3%A9cnica%20VIP%20no%20D%C3%BAnia%20City%20Hall%20para%20conhecer%20a%20estrutura%20completa%20e%20o%20sal%C3%A3o."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D3B47C] via-[#E2C799] to-[#C49A61] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow-lg transition hover:scale-105"
              >
                <Calendar className="h-4 w-4" />
                <span>Agendar Visita VIP Guiada</span>
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                <span>Voltar à Página Inicial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <DuniaFooter />
    </div>
  )
}
