import Link from "next/link"
import Image from "next/image"
import DuniaGalleryViewer from "@/components/dunia-gallery-viewer"
import { Trees, Sparkles, Church, Heart, CheckCircle2, ArrowRight } from "lucide-react"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"

export const metadata = {
  title: "Jardim e Cerimônias Externas | Dúnia City Hall Lago Sul Brasília",
  description: "Dê vida ao seu evento. O nosso jardim é uma extensão da natureza que abraça sua celebração, com conexão com as majestosas igrejas de Brasília.",
}

export default function JardimPage() {
  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      <DuniaHeader currentPage="/jardim" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#ABA29A]">
          <Link href="/" className="hover:text-white transition">Início</Link>
          <span>/</span>
          <span className="text-[#D3B47C]">Jardim & Cerimônias</span>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161311] shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <Image
              src="/images/dunia/jardim-galeria.jpg"
              alt="Jardim do Dúnia City Hall"
              fill
              priority
              className="object-cover filter brightness-[0.45] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] w-fit">
                <Trees className="h-3 w-3" />
                NATUREZA & ÁREAS AO AR LIVRE
              </span>
              <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
                Dê Vida ao Seu Evento:<br />
                <em className="italic text-[#D3B47C]">O Jardim Encantado</em>
              </h1>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                Mais do que um cenário encantador: uma extensão da natureza que abraça sua celebração no Lago Sul.
              </p>
            </div>
          </div>
        </section>

        {/* TEXTO OFICIAL DO SITE */}
        <section className="my-12 rounded-3xl bg-[#F3EEE6] p-8 sm:p-14 text-[#271E17] shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D37]">
              NATUREZA & ELEGÂNCIA INTEGRADA
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal leading-snug sm:text-4xl">
              A natureza que abraça sua celebração
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              O nosso jardim é mais do que um cenário encantador; é uma extensão da natureza que abraça o seu evento, criando uma atmosfera única.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              A decoração do nosso jardim é meticulosamente adaptada para complementar o tipo de evento que você imagina, seja um casamento romântico, uma festa de aniversário alegre ou um evento corporativo sofisticado. Cada detalhe é cuidadosamente pensado para trazer à vida a sua visão e tornar o momento inesquecível.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              O contato com a natureza se funde harmoniosamente com a elegância do local, criando uma experiência que transcende as expectativas. Venha descobrir a beleza de nosso jardim e dê vida aos seus sonhos em um ambiente onde a natureza se torna cúmplice das celebrações mais especiais da sua vida.
            </p>
          </div>
        </section>

        {/* CERIMÔNIAS EXTERNAS & AS IGREJAS DE BRASÍLIA */}
        <section className="my-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
              CERIMÔNIAS EXTERNAS
            </span>
            <h3 className="mt-2 font-serif text-3xl text-white">
              Celebre em Ambientes Icônicos: As Majestosas Igrejas de Brasília
            </h3>
            <p className="mt-3 text-xs sm:text-sm text-[#ABA29A]">
              Muitos noivos optam por realizar o enlace matrimonial nos templos sagrados de Brasília e em seguida receber seus convidados no requinte do Dúnia City Hall.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D3B47C]">OSCAR NIEMEYER</span>
              <h4 className="mt-1 font-serif text-2xl text-white">Catedral de Brasília</h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                Uma verdadeira joia da arquitetura modernista. Desenhada por Oscar Niemeyer, proporciona um ambiente celestial, amplificado por seus impressionantes vitrais de Marianne Peretti. Um local que transborda espiritualidade e arte.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D3B47C]">LUZ AZUL CELESTIAL</span>
              <h4 className="mt-1 font-serif text-2xl text-white">Santuário Dom Bosco</h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                Banhado por uma luminosidade azul proveniente de seus 80 vitrais em tons de azul, roxo e branco, este santuário proporciona uma atmosfera tranquila e sagrada, perfeita para momentos de profunda conexão espiritual.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D3B47C]">ATHOS BULCÃO</span>
              <h4 className="mt-1 font-serif text-2xl text-white">Igrejinha Nossa Senhora de Fátima</h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                O toque artístico de Athos Bulcão nos azulejos desta igreja traz um charme único, combinando a devoção religiosa com a beleza da arte modernista e a atmosfera acolhedora da primeira igreja de alvenaria erguida na capital.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-wider text-[#D3B47C]">MODERNIDADE & UNIÃO</span>
              <h4 className="mt-1 font-serif text-2xl text-white">Templo da Boa Vontade</h4>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
                Mais do que uma simples estrutura, este templo é um convite à reflexão e à união, independentemente da crença. Sua arquitetura contemporânea e espiral no piso faz dele um local inigualável para cerimônias que buscam ecumenismo.
              </p>
            </div>
          </div>
        </section>

        {/* FERRAMENTA DE GALERIA COMPLETA DE ÁREAS EXTERNAS & JARDIM */}
        <DuniaGalleryViewer
          initialCategory="all"
          title="Galeria de Ambientes & Cenários do Dúnia"
          subtitle="ÁREAS VERDES & ARQUITETURA NO LAGO SUL"
          showFilmReel={true}
          itemsPerPage={12}
        />

        {/* CTA FINAL */}
        <section className="my-12 text-center py-10 px-6 rounded-3xl bg-[#161311] border border-white/10">
          <h3 className="font-serif text-3xl text-white">
            Planeje sua Recepção com Jardim e Salão Integrados
          </h3>
          <p className="mt-3 max-w-lg mx-auto text-xs sm:text-sm text-[#ABA29A]">
            Venha conhecer o jardim e conferir como harmonizar a cerimônia religiosa com uma recepção inesquecível no Dúnia.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20evento%20com%20jardim%20no%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#D3B47C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
            >
              FALAR COM NOSSO CONCIERGE
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
