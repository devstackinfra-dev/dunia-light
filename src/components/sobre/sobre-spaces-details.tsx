"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Building,
  CheckCircle2,
  Maximize2,
  X,
  Users,
  Shield,
  Zap,
  Wind,
  Volume2,
  ChevronRight,
  Anchor,
  Sparkles,
  Download,
  Calendar,
  Layers,
} from "lucide-react"

export interface SpaceDetail {
  id: string
  name: string
  kicker: string
  area: string
  ceilingHeight: string
  capacityBanquet: string
  capacityCocktail: string
  capacityAuditorium: string
  description: string
  highlights: string[]
  image: string
  gallery: string[]
}

const SPACES_DATA: SpaceDetail[] = [
  {
    id: "salao-imperial",
    name: "Salão Imperial (Nave Monumental)",
    kicker: "O CORAÇÃO DO DÚNIA CITY HALL",
    area: "1.400 m² de vão livre",
    ceilingHeight: "7,00 metros",
    capacityBanquet: "800 pessoas sentadas",
    capacityCocktail: "1.200 pessoas",
    capacityAuditorium: "900 pessoas",
    description:
      "O espaço mais imponente do complexo, caracterizado por seu vão livre sem colunas centrais que obstruam a visão dos convidados. Dotado de lustres clássicos de cristal de grandes proporções com dimerização suave, piso nobre polido de alto tráfego e infraestrutura de rigging aéreo para montagens cenográficas monumentais.",
    highlights: [
      "Vão livre de 1.400 m² sem colunas centrais",
      "Pé-direito duplo de 7 metros com pontos de ancoragem para até 500 kg/ponto",
      "Lustres monumentais clássicos com controle computadorizado de intensidade",
      "Piso polido térmico de alta resistência adequado para naves espelhadas",
      "Climatização central com controle setorizado de temperatura",
    ],
    image: "/images/acervo/03-casamento/Decoracao-31.jpg",
    gallery: [
      "/images/dunia/salao-principal.jpg",
      "/images/acervo/11-servicos/salao-de-festa/salao-04.jpg",
      "/images/acervo/11-servicos/salao-de-festa/salao-05.jpg",
      "/images/acervo/11-servicos/salao-de-festa/salao-06.jpg",
    ],
  },
  {
    id: "espaco-cristal",
    name: "Espaço Cristal (Salão Modular B)",
    kicker: "SOFISTICAÇÃO & ACÚSTICA CONTROLADA",
    area: "850 m² moduláveis",
    ceilingHeight: "5,50 metros",
    capacityBanquet: "320 pessoas sentadas",
    capacityCocktail: "450 pessoas",
    capacityAuditorium: "350 pessoas",
    description:
      "Ambiente elegante e intimista com paredes acústicas retráteis alemãs de alta tecnologia (atenuação 48dB). Permite ser utilizado de forma independente para mini-weddings, jantares de gala corporativos, posses diplomáticas ou integrado ao Salão Imperial para celebrações épicas.",
    highlights: [
      "Divisórias retráteis acústicas com atenuação comprovada de 48dB",
      "Sonorização setorizada embutida para palestras e música ao vivo",
      "Acesso direto e nivelado ao Jardim Imperial e espelho d'água",
      "Entrada independente com recepção própria quando utilizado isolado",
      "Iluminação dimerizável em LED branco quente (3.000K)",
    ],
    image: "/images/acervo/11-servicos/salao-de-festa/salao-01.jpg",
    gallery: [
      "/images/acervo/11-servicos/salao-de-festa/salao-01.jpg",
      "/images/acervo/11-servicos/salao-de-festa/salao-03.jpg",
      "/images/acervo/11-servicos/salao-de-festa/sala-de-festa.jpg",
    ],
  },
  {
    id: "espaco-noiva",
    name: "Espaço da Noiva & Camarim Privativo",
    kicker: "CONFORTO TÉRMICO & PRIVACIDADE ABSOLUTA",
    area: "80 m² privativos",
    ceilingHeight: "3,20 metros",
    capacityBanquet: "Suíte privativa",
    capacityCocktail: "Noiva, família e madrinhas",
    capacityAuditorium: "Espaço exclusivo",
    description:
      "Projetado como um refúgio de tranquilidade e acolhimento para o grande dia. Conta com bancadas completas de maquiagem com espelhos iluminados na temperatura de cor ideal (luz dia), banheira de hidromassagem para relaxamento, sala de estar com bar de champanhe para a família e acesso direto e secreto ao altar.",
    highlights: [
      "Bancada de maquiagem com luzes calibradas para alta definição (3.200K - 5.600K)",
      "Banheira de hidromassagem e sala de banho em mármore nobre",
      "Lounge privativo com poltronas confortáveis, TV e frigobar",
      "Ar-condicionado independente com controle termostático digital",
      "Porta de acesso privativa à nave principal sem contato com convidados",
    ],
    image: "/images/acervo/11-servicos/salao-de-festa/salao-02.jpg",
    gallery: [
      "/images/acervo/11-servicos/salao-de-festa/salao-02.jpg",
      "/images/acervo/13-institucionais/salao-versao-03.jpg",
    ],
  },
  {
    id: "jardim-imperial",
    name: "Jardim Imperial & Espelho D'Água",
    kicker: "NATUREZA PRESERVADA NO LAGO SUL",
    area: "450 m² ao ar livre",
    ceilingHeight: "Céu aberto de Brasília",
    capacityBanquet: "220 pessoas sentadas",
    capacityCocktail: "350 pessoas",
    capacityAuditorium: "300 lugares",
    description:
      "Área verde privativa integrada aos salões, com palmeiras maduras, espelho d'água cristalino e pergolado para cerimônias ao pôr do sol. Perfeito para cortejos sobre as águas, coquetéis de boas-vindas sob a brisa do cerrado e ensaios fotográficos inesquecíveis.",
    highlights: [
      "Espelho d'água com possibilidade de passarela transparente para cortejos",
      "Iluminação cênica noturna nas copas das palmeiras e pergolados",
      "Sonorização ambiente externa discreta de alta fidelidade",
      "Piso antiderrapante e acessibilidade total para cadeirantes",
      "Integração imediata com o salão principal por portas de vidro pivotantes",
    ],
    image: "/images/acervo/09-jardim/dunia-20-08-36-of-36.jpg",
    gallery: [
      "/images/acervo/09-jardim/Dunia-24-06-23-144.jpg",
      "/images/acervo/09-jardim/dunia-20-08-36-of-36.jpg",
      "/images/acervo/09-jardim/Dunia-24-06-23-145.jpg",
      "/images/acervo/09-jardim/Dunia-24-06-23-178.jpg",
    ],
  },
  {
    id: "foyer-entrada",
    name: "Foyer Monumental & Guarita Valet",
    kicker: "SEGURANÇA DIPLOMÁTICA & ACOLHIMENTO",
    area: "350 m² cobertos",
    ceilingHeight: "6,00 metros",
    capacityBanquet: "Hall de Recepção",
    capacityCocktail: "Fluxo Contínuo",
    capacityAuditorium: "Credenciamento VIP",
    description:
      "Entrada nobre com porte-cochère coberta que protege os convidados de qualquer intempérie. Dispõe de guarita blindada com cancela privativa para controle rigoroso de acessos, chapelaria climatizada, banheiros nobres e serviço de valet com equipe de até 15 manobristas simultâneos.",
    highlights: [
      "Porte-cochère totalmente coberta para embarque e desembarque VIP",
      "Guarita blindada com controle de acesso para autoridades e celebridades",
      "Pátio interno de manobra e estacionamento privativo pavimentado",
      "Chapelaria organizada com sistema de fichas numeradas",
      "Circuito fechado de TV (CFTV) 24h com monitoramento constante",
    ],
    image: "/images/acervo/13-institucionais/20211002_171118.jpg",
    gallery: [
      "/images/acervo/13-institucionais/20211002_171118.jpg",
      "/images/acervo/13-institucionais/dunia-20-08-17-of-36-1-scaled.jpg",
    ],
  },
  {
    id: "cozinha-operacoes",
    name: "Cozinha Industrial & Logística Operacional",
    kicker: "ENGENHARIA GASTRONÔMICA DE ALTO PADRÃO",
    area: "200 m² de cozinha técnica",
    ceilingHeight: "3,80 metros",
    capacityBanquet: "Até 1.200 refeições simultâneas",
    capacityCocktail: "Capacidade contínua",
    capacityAuditorium: "Apoio total",
    description:
      "Área de retaguarda desenhada com rigor sanitário internacional. Composta por bancadas em aço inox escovado 304, câmara fria industrial, coifa de exaustão mecânica de alta vazão, gás canalizado certificado e doca de carga e descarga com entrada de serviço 100% independente dos convidados.",
    highlights: [
      "Cozinha industrial de 200 m² revestida em porcelanato hospitalar lavável",
      "Câmara frigorífica de grande capacidade para conservação de insumos",
      "Doca dedicada para caminhões de cenografia, buffet e equipamentos de som",
      "Fluxo em sentido único (marcha adiante) conforme normas sanitárias da Anvisa",
      "Vestiários e sanitários privativos para brigadas de garçons e fornecedores",
    ],
    image: "/assets/mesa.jpg",
    gallery: [
      "/assets/mesa.jpg",
      "/images/dunia/buffet-hero.jpg",
    ],
  },
]

export default function SobreSpacesDetails() {
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("salao-imperial")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const activeSpace = SPACES_DATA.find((s) => s.id === selectedSpaceId) || SPACES_DATA[0]

  return (
    <div className="space-y-16">
      {/* 1. SELETOR DE ESPAÇOS EM ABAS */}
      <section className="rounded-3xl border border-white/10 bg-[#161311] p-6 sm:p-10 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
            DIVISÃO ARQUITETÔNICA DO COMPLEXO
          </span>
          <h3 className="mt-2 font-serif text-2xl text-white sm:text-4xl">
            Estrutura Detalhada Espaço por Espaço
          </h3>
          <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
            Selecione uma área abaixo para conhecer suas dimensões, capacidades técnicas e acabamentos.
          </p>
        </div>

        {/* Abas com Pílulas Elegantes */}
        <div className="flex flex-wrap items-center justify-center gap-2 pb-6 border-b border-white/10">
          {SPACES_DATA.map((space) => {
            const isSelected = space.id === selectedSpaceId
            return (
              <button
                key={space.id}
                onClick={() => setSelectedSpaceId(space.id)}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-[#D3B47C] text-[#100E0D] shadow-lg scale-105"
                    : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:text-white"
                }`}
              >
                {space.name.split("(")[0].trim()}
              </button>
            )
          })}
        </div>

        {/* DETALHE DO ESPAÇO SELECIONADO */}
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-center">
          {/* Lado Esquerdo: Imagem com Badge e Mini-galeria */}
          <div className="lg:col-span-6 space-y-4">
            <div
              onClick={() => setLightboxImage(activeSpace.image)}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/15 bg-black/40 shadow-2xl cursor-pointer"
            >
              <Image
                src={activeSpace.image}
                alt={activeSpace.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent opacity-80 group-hover:opacity-95 transition" />
              <div className="absolute top-4 left-4 rounded-full border border-[#D3B47C]/40 bg-black/70 px-3 py-1 text-xs font-mono font-bold text-[#D3B47C] backdrop-blur-md">
                {activeSpace.area}
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                <span className="font-serif text-sm font-light truncate">{activeSpace.name}</span>
                <span className="inline-flex items-center gap-1 text-[0.65rem] text-[#D3B47C] font-semibold uppercase opacity-0 group-hover:opacity-100 transition">
                  Ampliar <Maximize2 className="h-3 w-3" />
                </span>
              </div>
            </div>

            {/* Miniaturas de Ângulos Adicionais */}
            <div className="grid grid-cols-4 gap-2">
              {activeSpace.gallery.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setLightboxImage(img)}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40 cursor-pointer"
                >
                  <Image
                    src={img}
                    alt={`${activeSpace.name} ângulo ${i + 1}`}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito: Especificações Técnicas & Vantagens */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
                {activeSpace.kicker}
              </span>
              <h4 className="mt-1 font-serif text-2xl sm:text-3xl text-white font-normal">
                {activeSpace.name}
              </h4>
              <p className="mt-3 text-xs sm:text-sm text-[#ABA29A] leading-relaxed font-light">
                {activeSpace.description}
              </p>
            </div>

            {/* Grid de Métricas do Espaço */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-black/40 p-4 text-center">
              <div>
                <span className="block text-[0.62rem] uppercase tracking-wider text-[#D3B47C]">Área</span>
                <span className="mt-1 font-serif text-sm sm:text-base text-white">{activeSpace.area.split(" ")[0]} m²</span>
              </div>
              <div className="border-x border-white/10">
                <span className="block text-[0.62rem] uppercase tracking-wider text-[#D3B47C]">Pé-Direito</span>
                <span className="mt-1 font-serif text-sm sm:text-base text-white">{activeSpace.ceilingHeight}</span>
              </div>
              <div>
                <span className="block text-[0.62rem] uppercase tracking-wider text-[#D3B47C]">Capacidade</span>
                <span className="mt-1 font-serif text-sm sm:text-base text-white">{activeSpace.capacityCocktail.split(" ")[1] || activeSpace.capacityCocktail}</span>
              </div>
            </div>

            {/* Lista de Diferenciais Técnicos */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white/90">
                Destaques da Engenharia & Acabamento:
              </span>
              <ul className="space-y-2 text-xs text-[#D6CEBE]/90">
                {activeSpace.highlights.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#D3B47C] mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TABELA COMPARATIVA DE CAPACIDADE POR FORMATO DE EVENTO */}
      <section className="rounded-3xl border border-white/10 bg-[#141210] p-6 sm:p-10 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
            PLANEJAMENTO DE CAPACIDADE
          </span>
          <h3 className="mt-2 font-serif text-2xl text-white sm:text-4xl">
            Capacidade por Formato de Layout
          </h3>
          <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
            Consulte a tabela oficial de montagem para o dimensionamento perfeito da sua lista de convidados.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#D3B47C]/30 text-[#D3B47C] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Formato de Montagem</th>
                <th className="py-3 px-4">Salão Imperial</th>
                <th className="py-3 px-4">Espaço Cristal</th>
                <th className="py-3 px-4">Jardim Imperial</th>
                <th className="py-3 px-4">Complexo Total Integrado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-white/90 font-light">
              <tr className="hover:bg-white/5 transition">
                <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D3B47C]" />
                  Banquete (Mesas Redondas 10 lugares)
                </td>
                <td className="py-3.5 px-4 font-mono">800 pessoas</td>
                <td className="py-3.5 px-4 font-mono">320 pessoas</td>
                <td className="py-3.5 px-4 font-mono">220 pessoas</td>
                <td className="py-3.5 px-4 font-mono text-[#D3B47C] font-semibold">Até 950 pessoas</td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D3B47C]" />
                  Coquetel & Recepção de Gala (com Lounges)
                </td>
                <td className="py-3.5 px-4 font-mono">900 pessoas</td>
                <td className="py-3.5 px-4 font-mono">450 pessoas</td>
                <td className="py-3.5 px-4 font-mono">350 pessoas</td>
                <td className="py-3.5 px-4 font-mono text-[#D3B47C] font-semibold">Até 1.200 pessoas</td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D3B47C]" />
                  Auditório / Plenária Solene
                </td>
                <td className="py-3.5 px-4 font-mono">850 lugares</td>
                <td className="py-3.5 px-4 font-mono">350 lugares</td>
                <td className="py-3.5 px-4 font-mono">300 lugares</td>
                <td className="py-3.5 px-4 font-mono text-[#D3B47C] font-semibold">Até 1.000 lugares</td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D3B47C]" />
                  Cerimônia Nupcial com Nave Central
                </td>
                <td className="py-3.5 px-4 font-mono">600 lugares</td>
                <td className="py-3.5 px-4 font-mono">250 lugares</td>
                <td className="py-3.5 px-4 font-mono">350 lugares</td>
                <td className="py-3.5 px-4 font-mono text-[#D3B47C] font-semibold">Até 950 lugares</td>
              </tr>
              <tr className="hover:bg-white/5 transition">
                <td className="py-3.5 px-4 font-medium text-white flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D3B47C]" />
                  Escolar / Seminário com Mesas
                </td>
                <td className="py-3.5 px-4 font-mono">450 lugares</td>
                <td className="py-3.5 px-4 font-mono">200 lugares</td>
                <td className="py-3.5 px-4 font-mono">—</td>
                <td className="py-3.5 px-4 font-mono text-[#D3B47C] font-semibold">Até 650 lugares</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. FICHA TÉCNICA OPERACIONAL DE ENGENHARIA */}
      <section className="rounded-3xl border border-white/10 bg-[#161311] p-6 sm:p-10 shadow-2xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
            SEGURANÇA & ESTABILIDADE OPERACIONAL
          </span>
          <h3 className="mt-2 font-serif text-2xl text-white sm:text-4xl">
            Ficha Técnica & Infraestrutura Completa
          </h3>
          <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
            Parâmetros de engenharia desenvolvidos para garantir que nenhuma celebração sofra interrupções.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Energia */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#D3B47C]">
              <Zap className="h-5 w-5" />
              <h4 className="font-serif text-base text-white">Gerador Próprio 250 kVA</h4>
            </div>
            <p className="text-xs text-[#ABA29A] leading-relaxed">
              Grupo moto-gerador trifásico com comutação automática em 3 segundos. Autonomia de combustível para 24 horas ininterruptas de operação a plena carga.
            </p>
          </div>

          {/* Card 2: Climatização */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#D3B47C]">
              <Wind className="h-5 w-5" />
              <h4 className="font-serif text-base text-white">Chiller Central de 120 TR</h4>
            </div>
            <p className="text-xs text-[#ABA29A] leading-relaxed">
              Sistema central de água gelada com dutos silenciosos perimetrais e renovação mecânica contínua de ar externo conforme normas da ABNT.
            </p>
          </div>

          {/* Card 3: Acústica */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#D3B47C]">
              <Volume2 className="h-5 w-5" />
              <h4 className="font-serif text-base text-white">Isolamento Acústico 48dB</h4>
            </div>
            <p className="text-xs text-[#ABA29A] leading-relaxed">
              Forro fonoabsorvente de alta densidade e divisórias retráteis alemãs com vedação acústica de 48dB, permitindo dois eventos simultâneos sem vazamento sonoro.
            </p>
          </div>

          {/* Card 4: Segurança */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#D3B47C]">
              <Shield className="h-5 w-5" />
              <h4 className="font-serif text-base text-white">Guarita Blindada & CFTV</h4>
            </div>
            <p className="text-xs text-[#ABA29A] leading-relaxed">
              Portaria com blindagem nível III-A, cancelas automáticas, 32 câmeras em circuito interno e sala de segurança dedicada a equipes de escolta oficial.
            </p>
          </div>

          {/* Card 5: Cargas e Rigging */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#D3B47C]">
              <Anchor className="h-5 w-5" />
              <h4 className="font-serif text-base text-white">Rigging para 500 kg/Ponto</h4>
            </div>
            <p className="text-xs text-[#ABA29A] leading-relaxed">
              Estrutura metálica de teto calculada para suportar naves de flores suspensas, treliças de iluminação cenográfica móvel e painéis de LED pesados.
            </p>
          </div>

          {/* Card 6: Acessibilidade */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-5 space-y-3">
            <div className="flex items-center gap-2 text-[#D3B47C]">
              <Sparkles className="h-5 w-5" />
              <h4 className="font-serif text-base text-white">100% Acessível PWD</h4>
            </div>
            <p className="text-xs text-[#ABA29A] leading-relaxed">
              Plataforma 100% plana sem degraus nas entradas nobres, rampas de inclinação suave NBR 9050, elevador panorâmico e sanitários adaptados.
            </p>
          </div>
        </div>
      </section>

      {/* MODAL LIGHTBOX DE FOTO EM ALTA RESOLUÇÃO */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute right-6 top-6 rounded-full bg-white/15 p-3 text-white hover:bg-white/30 transition"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[85vh] max-w-[90vw] overflow-hidden rounded-2xl border border-white/20 shadow-2xl"
          >
            <img
              src={lightboxImage}
              alt="Foto do Salão Dúnia Ampliada"
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  )
}
