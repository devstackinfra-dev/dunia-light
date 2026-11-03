import Link from "next/link"
import Image from "next/image"
import DuniaGalleryViewer from "@/components/dunia-gallery-viewer"
import { UtensilsCrossed, Sparkles, Heart, Wine, CheckCircle2, ArrowRight } from "lucide-react"
import DuniaHeader from "@/components/dunia-header"
import DuniaFooter from "@/components/dunia-footer"

export const metadata = {
  title: "Buffet Dúnia Autoral | Alta Gastronomia para Eventos no Lago Sul",
  description: "A gastronomia é a linguagem do afeto. Sabores inesquecíveis, cozinha internacional, ilhas gastronômicas e doces autorais no Dúnia City Hall.",
}

export default function BuffetPage() {
  return (
    <div className="relative z-10 min-h-screen bg-transparent text-[#F3EEE6] antialiased selection:bg-[#D3B47C]/30 selection:text-white">
      <DuniaHeader currentPage="/buffet" />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#ABA29A]">
          <Link href="/" className="hover:text-white transition">Início</Link>
          <span>/</span>
          <span className="text-[#D3B47C]">Buffet & Gastronomia</span>
        </div>

        {/* HERO */}
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#161311] shadow-2xl">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            <Image
              src="/images/dunia/buffet-hero.jpg"
              alt="Buffet Dúnia City Hall"
              fill
              priority
              className="object-cover filter brightness-[0.45] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#161311] via-[#161311]/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] w-fit">
                <UtensilsCrossed className="h-3 w-3" />
                GASTRONOMIA AUTORAL & AFETO
              </span>
              <h1 className="mt-3 font-serif text-3xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
                Sabores Inesquecíveis no<br />
                <em className="italic text-[#D3B47C]">Dúnia City Hall</em>
              </h1>
              <p className="mt-3 max-w-2xl text-xs sm:text-sm text-[#ABA29A] leading-relaxed">
                Acreditamos que a gastronomia é a expressão mais pura de amor, carinho e dedicação aos seus convidados.
              </p>
            </div>
          </div>
        </section>

        {/* TEXTO OFICIAL DO SITE */}
        <section className="my-12 rounded-3xl bg-[#F3EEE6] p-8 sm:p-14 text-[#271E17] shadow-xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#8C6D37]">
              A LINGUAGEM DO AFETO
            </span>
            <h2 className="mt-2 font-serif text-3xl font-normal leading-snug sm:text-4xl">
              Um menu que transcende o simples ato de alimentar
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              Todo evento merece um menu que transcenda o simples ato de alimentar e abrace o verdadeiro significado da celebração. No Dúnia City Hall, acreditamos que a gastronomia é a linguagem do afeto, a expressão de amor, carinho e dedicação aos convidados. Nossa missão é transformar sua festa em uma experiência memorável, encantando o paladar e celebrando os sabores da vida. Com um menu que surpreende e encanta, garantimos que cada mordida seja um momento de prazer, onde os sabores se entrelaçam em uma dança de doçura.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-[#5A4F45] sm:text-base">
              Nosso buffet é uma verdadeira viagem de sabores, capaz de conquistar todos os paladares. Dos pratos tradicionais aos internacionais, nossa seleção cuidadosamente pensada oferece opções para atender a todas as preferências e necessidades alimentares. Acreditamos que um menu encantador vai além da degustação; ele cria momentos de prazer, promove a interação entre os convidados e desperta memórias afetivas através de combinações de sabores únicos.
            </p>
            <div className="mt-6 font-serif italic text-lg text-[#8C6D37]">
              &ldquo;Desde os pratos clássicos aos mais criativos e nossos doces que são verdadeiros pedacinhos de felicidade, cada detalhe é cuidadosamente preparado para ser um verdadeiro deleite aos olhos e ao paladar.&rdquo;
            </div>
          </div>
        </section>

        {/* DIFERENCIAIS DO BUFFET */}
        <section className="my-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-serif text-2xl text-white">
              Ilhas Gastronômicas
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
              Estações de antepastos nobres, queijos finos, pães rústicos, ceviches, risotos preparados ao vivo e ilhas temáticas que incentivam a circulação e interação dos convidados.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-serif text-2xl text-white">
              Pratos Clássicos & Autorais
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
              Seleção de carnes nobres, peixes frescos, massas artesanais com molhos refinados e acompanhamentos preparados com ingredientes de altíssima procedência.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#161311] p-8 shadow-xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D3B47C]/10 text-[#D3B47C]">
              <Heart className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-serif text-2xl text-white">
              Doces: Pedacinhos de Felicidade
            </h3>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#ABA29A]">
              Mesa de doces finos elaborada artesanalmente, com texturas e sabores delicados, além de sobremesas empratadas que encerram a noite com perfeição.
            </p>
          </div>
        </section>

        {/* FERRAMENTA DE GALERIA COMPLETA DE BUFFET */}
        <DuniaGalleryViewer
          initialCategory="buffet"
          title="Galeria Gastronômica & Buffet Dúnia"
          subtitle="SABORES INESQUECÍVEIS • LAGO SUL"
          showFilmReel={true}
          itemsPerPage={16}
        />

        {/* CTA FINAL */}
        <section className="my-12 text-center py-10 px-6 rounded-3xl bg-[#161311] border border-white/10">
          <h3 className="font-serif text-3xl text-white">
            Agende uma Degustação Exclusiva
          </h3>
          <p className="mt-3 max-w-lg mx-auto text-xs sm:text-sm text-[#ABA29A]">
            Experimente nossos pratos autorais e monte o cardápio sob medida para o seu casamento, aniversário de 15 anos ou gala corporativa.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20degusta%C3%A7%C3%A3o%20do%20Buffet%20D%C3%BAnia%20City%20Hall."
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-[#D3B47C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:scale-105"
            >
              AGENDAR DEGUSTAÇÃO VIP
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
