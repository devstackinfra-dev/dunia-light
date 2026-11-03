import Link from "next/link"
import Image from "next/image"
import DuniaGalleryViewer from "@/components/dunia-gallery-viewer"
import { Building2, Award, Users, Network, CheckCircle2, ArrowRight } from "lucide-react"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"

export const metadata = {
  title: "Eventos Corporativos e Congressos no Lago Sul | Dúnia City Hall Brasília",
  description: "Excelência para seu evento corporativo. Três pilares essenciais: motivação e reconhecimento, espírito de equipe e networking para até 1.200 participantes.",
}

export default function CorporativoPage() {
  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      <DuniaHeader currentPage="/corporativo" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#ABA29A]">
          <Link href="/" className="hover:text-white transition">Início</Link>
          <span>/</span>
          <span className="text-[#D3B47C]">Corporativo & Convenções</span>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161311] shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <Image
              src="/images/dunia/corporativo-hero.jpg"
              alt="Evento Corporativo no Dúnia City Hall"
              fill
              priority
              className="object-cover filter brightness-[0.45] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] w-fit">
                <Building2 className="h-3 w-3" />
                CONVENÇÕES, CONGRESSOS & GALAS
              </span>
              <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
                Excelência para Seu<br />
                <em className="italic text-[#D3B47C]">Evento Corporativo</em>
              </h1>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                Estrutura modular de até 2.500 m² no Lago Sul, acolhendo de 100 a 1.200 participantes com acústica impecável e alta gastronomia executiva.
              </p>
            </div>
          </div>
        </section>

        {/* TEXTO OFICIAL DO SITE */}
        <section className="my-12 rounded-3xl bg-[#F3EEE6] p-8 sm:p-14 text-[#271E17] shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D37]">
              ESTRATÉGIA & IMPACTO
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal leading-snug sm:text-4xl">
              Um parceiro comprometido com o sucesso da sua empresa
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              No Dúnia City Hall, oferecemos a excelência para o sucesso do seu evento corporativo. Baseado em três pilares essenciais, nossa abordagem se concentra na motivação e reconhecimento da equipe, no fortalecimento do espírito de equipe e na promoção do networking e colaboração.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              Escolher o Dúnia City Hall é escolher um parceiro comprometido em fazer do seu evento corporativo um sucesso, cuidando de cada detalhe, desde a escolha do espaço até a experiência gastronômica. Valorize sua equipe e faça a escolha certa para seus eventos corporativos. Venha celebrar o sucesso e o trabalho em equipe conosco!
            </p>
          </div>
        </section>

        {/* OS 3 PILARES ESSENCIAIS (TEXTO OFICIAL DO SITE) */}
        <section className="my-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              METODOLOGIA CORPORATIVA
            </span>
            <h3 className="mt-2 font-serif text-3xl text-white">
              Os Três Pilares Essenciais
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Pilar 1 */}
            <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
                <Award className="h-6 w-6" />
              </div>
              <span className="mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                PILAR 01
              </span>
              <h4 className="mt-1 font-serif text-2xl text-white">
                Motivação e Reconhecimento
              </h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                Nossos eventos são projetados para elevar a motivação e reconhecimento, aumentando a produtividade e criando um ambiente de trabalho inspirador para suas lideranças e colaboradores.
              </p>
            </div>

            {/* Pilar 2 */}
            <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
                <Users className="h-6 w-6" />
              </div>
              <span className="mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                PILAR 02
              </span>
              <h4 className="mt-1 font-serif text-2xl text-white">
                Espírito de Equipe
              </h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                O fortalecimento do espírito de equipe é cultivado através de momentos de descontração, interação e aprendizagem entre os participantes em um ambiente com infraestrutura impecável.
              </p>
            </div>

            {/* Pilar 3 */}
            <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
                <Network className="h-6 w-6" />
              </div>
              <span className="mt-4 block text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                PILAR 03
              </span>
              <h4 className="mt-1 font-serif text-2xl text-white">
                Networking & Colaboração
              </h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                Nosso ambiente propicia oportunidades de networking e colaboração entre equipes e parceiros de negócios, fomentando sinergia, conexões duradouras e inovação.
              </p>
            </div>
          </div>
        </section>

        {/* ESTRUTURA TÉCNICA */}
        <section className="my-12 rounded-3xl border border-white/10 bg-[#161311] p-8 sm:p-10 shadow-xl">
          <h3 className="font-serif text-2xl text-white mb-6">Infraestrutura Técnica Completa</h3>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="border-l-2 border-[#D3B47C] pl-4">
              <strong className="block text-white text-sm">Até 1.200 Pessoas</strong>
              <small className="text-[#ABA29A] text-xs">Formato auditório ou banquete</small>
            </div>
            <div className="border-l-2 border-[#D3B47C] pl-4">
              <strong className="block text-white text-sm">Divisórias Acústicas</strong>
              <small className="text-[#ABA29A] text-xs">Salões modulares independentes</small>
            </div>
            <div className="border-l-2 border-[#D3B47C] pl-4">
              <strong className="block text-white text-sm">Gerador de Alta Potência</strong>
              <small className="text-[#ABA29A] text-xs">Segurança total sem interrupções</small>
            </div>
            <div className="border-l-2 border-[#D3B47C] pl-4">
              <strong className="block text-white text-sm">Estacionamento & Valet</strong>
              <small className="text-[#ABA29A] text-xs">Ampla área privativa no Lago Sul</small>
            </div>
          </div>
        </section>

        {/* FERRAMENTA DE GALERIA COMPLETA */}
        <DuniaGalleryViewer
          initialCategory="corporativo"
          title="Galeria de Solenidades & Congressos"
          subtitle="EXCELÊNCIA CORPORATIVA"
          showFilmReel={true}
          itemsPerPage={12}
        />

        {/* CTA FINAL */}
        <section className="my-12 text-center py-10 px-6 rounded-3xl bg-[#161311] border border-white/10">
          <h3 className="font-serif text-3xl text-white">
            Realize o Próximo Grande Evento da Sua Empresa
          </h3>
          <p className="mt-3 max-w-lg mx-auto text-xs sm:text-sm text-[#ABA29A]">
            Nossos consultores executivos oferecem propostas customizadas para convenções, workshops, premiações de fim de ano e simpósios.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20uma%20proposta%20para%20Evento%20Corporativo%20no%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#D3B47C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
            >
              SOLICITAR PROPOSTA CORPORATIVA
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
