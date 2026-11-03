import Link from "next/link"
import Image from "next/image"
import DuniaGalleryViewer from "@/components/dunia-gallery-viewer"
import { Sparkles, Star, CheckCircle2, ArrowRight, ExternalLink, Music, Heart } from "lucide-react"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"

export const metadata = {
  title: "Festa de Debutante e 15 Anos no Lago Sul | Dúnia City Hall Brasília",
  description: "Transformando sonhos em memórias inesquecíveis. Pista de dança monumental, entrada triunfal e cenografia mágica para a festa de 15 anos da sua filha.",
}

export default function DebutantePage() {
  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      <DuniaHeader currentPage="/debutante" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#ABA29A]">
          <Link href="/" className="hover:text-white transition">Início</Link>
          <span>/</span>
          <span className="text-[#D3B47C]">Debutante & 15 Anos</span>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161311] shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <Image
              src="/images/dunia/debutante-hero.jpg"
              alt="Festa de Debutante no Dúnia City Hall"
              fill
              priority
              className="object-cover filter brightness-[0.45] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] w-fit">
                <Star className="h-3 w-3 fill-current" />
                CELEBRAÇÃO DOS 15 ANOS
              </span>
              <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
                Transformando Sonhos em<br />
                <em className="italic text-[#D3B47C]">Memórias Inesquecíveis</em>
              </h1>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                Mais do que um evento: uma jornada única celebrada com magia, significado e cuidado.
              </p>
            </div>
          </div>
        </section>

        {/* TEXTO OFICIAL DO SITE */}
        <section className="my-12 rounded-3xl bg-[#F3EEE6] p-8 sm:p-14 text-[#271E17] shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D37]">
              UMA JORNADA ÚNICA
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal leading-snug sm:text-4xl">
              Honrando a jornada de transformação com elegância
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              No Dúnia City Hall, acreditamos que a festa de debutante é mais do que um evento; é uma jornada única que merece ser celebrada com magia, significado e cuidado.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              Compartilhamos momentos de cumplicidade, valorizando a conexão entre a família, criando um ambiente onde essas relações especiais são fortalecidas. A preparação conjunta para o evento torna a experiência ainda mais significativa.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              A festa de debutante no Dúnia é um marco na vida da jovem, uma celebração que honra a sua jornada de transformação. Cada detalhe, desde a decoração até a entrada triunfal, expressa sua personalidade e estilo únicos, celebrando a transição com elegância.
            </p>
            <div className="mt-6 font-serif italic text-lg text-[#8C6D37]">
              &ldquo;Venha compartilhar essa experiência conosco e faça da festa de debutante de sua filha um evento que ela lembrará para o resto da vida.&rdquo;
            </div>
          </div>
        </section>

        {/* PILARES DA FESTA DE 15 ANOS */}
        <section className="my-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-serif text-2xl text-white">
              Entrada Triunfal
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
              Cenografia monumental com escadaria e pontos de iluminação cênica para a descida da debutante, momento da valsa com o pai e a troca de vestidos com total serenidade.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
              <Music className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-serif text-2xl text-white">
              Pista & Tecnologia
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
              Pista de dança espaçosa com som de alta fidelidade acústica, robôs de LED, telões e efeitos para os DJs garantirem a melhor balada para a jovem e seus amigos.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-serif text-2xl text-white">
              Gastronomia Jovem
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
              Ilhas de hambúrgueres gourmet, milk-shakes, mocktails temáticos, além do jantar completo para os familiares e convidados de honra com o padrão Buffet Dúnia.
            </p>
          </div>
        </section>

        {/* FERRAMENTA DE GALERIA COMPLETA */}
        <DuniaGalleryViewer
          initialCategory="debutante"
          title="Galeria de 15 Anos & Debutantes"
          subtitle="TRANSFORMAÇÃO & BALADA"
          showFilmReel={true}
          itemsPerPage={12}
        />

        {/* CTA FINAL */}
        <section className="my-12 text-center py-10 px-6 rounded-3xl bg-[#161311] border border-white/10">
          <h3 className="font-serif text-3xl text-white">
            Faça da Festa da Sua Filha um Momento Inesquecível
          </h3>
          <p className="mt-3 max-w-lg mx-auto text-xs sm:text-sm text-[#ABA29A]">
            Venha conhecer o salão com sua família e planejar cada detalhe com nossa equipe de especialistas em celebrações de 15 anos.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20para%20uma%20Festa%20de%2015%20Anos%20(Debutante)%20no%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#D3B47C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
            >
              SOLICITAR ORÇAMENTO DE 15 ANOS
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
