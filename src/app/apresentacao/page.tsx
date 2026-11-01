"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Layers,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  Tv,
  Calendar,
  CheckCircle2,
  DollarSign,
  Maximize2,
  Eye,
  Camera,
  QrCode,
  Lock,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react"

export default function ApresentacaoProprietarioPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: "capa",
      tag: "APRESENTAÇÃO EXECUTIVA · DIRETORIA DÚNIA CITY HALL",
      title: "A Nova Era Digital do Dúnia City Hall",
      subtitle:
        "Estratégia de Posicionamento, Hotsite Institucional de Alta Costura e Modelos de Negócio Digitais para o Lago Sul de Brasília.",
      content: (
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#D3B47C]/30 bg-[#161311] p-6 text-left shadow-xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C]">01 · MARCA & VITRINE</span>
            <h4 className="font-serif text-lg text-white mt-1">Hotsite Institucional Nobre</h4>
            <p className="text-xs text-[#ABA29A] mt-2 leading-relaxed">
              Design clássico contemporâneo, Acervo 35mm com 340+ fotos reais dos salões e gastronomia para captação contínua de noivas e galas.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-left shadow-xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-300">02 · FLEXIBILIDADE</span>
            <h4 className="font-serif text-lg text-white mt-1">2 Modelos Comerciais</h4>
            <p className="text-xs text-[#ABA29A] mt-2 leading-relaxed">
              O salão pode optar pelo <strong>Modo Light</strong> (apenas Hotsite vitrine com zero operação) ou ativar o <strong>Experience OS</strong> para monetizar pacotes digitais.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-left shadow-xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-400">03 · RENTABILIDADE</span>
            <h4 className="font-serif text-lg text-white mt-1">+R$ 15.000 a 40.000/Mês</h4>
            <p className="text-xs text-[#ABA29A] mt-2 leading-relaxed">
              Potencial de faturamento adicional em vendas de mini-sites, telão interativo e WhatsApp com 98% de margem líquida.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "modelos",
      tag: "FLEXIBILIDADE ESTRATÉGICA · 2 MODELOS DE NEGÓCIO",
      title: "Qual Modelo o Dúnia Quer Adotar?",
      subtitle:
        "A plataforma foi construída para se adaptar à decisão do proprietário: foco 100% no espaço físico ou agregação de valor com tecnologia.",
      content: (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* MODELO LIGHT */}
          <div className="rounded-3xl border border-white/15 bg-black/40 p-8 text-left transition hover:border-[#D3B47C]/40">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-bold uppercase text-white/80">
                OPÇÃO 1 · LIGHT / ESSENCIAL
              </span>
              <span className="text-xs text-[#ABA29A]">Zero Esforço Operacional</span>
            </div>
            <h3 className="mt-4 font-serif text-2xl text-white">Apenas Hotsite Institucional</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#ABA29A]">
              O Dúnia utiliza o site apenas como vitrine nobre para atrair noivos e empresas. Mini-sites e painéis de convidados ficam <strong>100% desativados</strong>.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-[#ABA29A]">
              <li className="flex items-center gap-2 text-white">✓ Hotsite de alta conversão no ar 24h</li>
              <li className="flex items-center gap-2 text-white">✓ Galeria com 340+ fotos do salão real</li>
              <li className="flex items-center gap-2 text-white">✓ Formulário de agendamento de visitas VIP</li>
              <li className="flex items-center gap-2 text-white/60">✕ Sem gestão de convites de noivos</li>
              <li className="flex items-center gap-2 text-white/60">✕ Sem telão interativo no evento</li>
            </ul>
            <div className="mt-6 rounded-xl bg-white/[0.03] p-3 text-center border border-white/5">
              <span className="text-xs text-[#D3B47C] font-semibold">Custo adicional para o salão: R$ 0,00</span>
            </div>
          </div>

          {/* MODELO EXPERIENCE OS */}
          <div className="rounded-3xl border-2 border-[#D3B47C] bg-gradient-to-b from-[#1C1816] to-[#12100E] p-8 text-left shadow-2xl relative">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#D3B47C] px-3 py-1 text-[0.65rem] font-bold uppercase text-[#100E0D]">
                OPÇÃO 2 · EXPERIENCE OS (RECOMENDADO)
              </span>
              <span className="text-xs text-[#D3B47C] font-bold">Novo Centro de Lucro</span>
            </div>
            <h3 className="mt-4 font-serif text-2xl text-white">Plataforma Digital de Eventos</h3>
            <p className="mt-2 text-xs leading-relaxed text-[#ABA29A]">
              O salão vende o ecossistema digital para os casais (R$ 800 a R$ 2.400). Transforma o casamento em um espetáculo multimídia interativo.
            </p>
            <ul className="mt-6 space-y-2.5 text-xs text-[#ABA29A]">
              <li className="flex items-center gap-2 text-white">✓ Tudo do Hotsite Institucional</li>
              <li className="flex items-center gap-2 text-white">✓ Mini-site com RSVP e QR Code individual</li>
              <li className="flex items-center gap-2 text-white">✓ Disparos automáticos WhatsApp de convite</li>
              <li className="flex items-center gap-2 text-white">✓ Telão interativo transmitindo fotos ao vivo</li>
              <li className="flex items-center gap-2 text-white">✓ Portaria digital anti-duplicidade</li>
            </ul>
            <div className="mt-6 rounded-xl bg-[#D3B47C]/10 p-3 text-center border border-[#D3B47C]/30">
              <span className="text-xs text-[#D3B47C] font-bold">Lucro estimado: R$ 15.000 a R$ 35.000 / mês</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "hotsite",
      tag: "O SITE INSTITUCIONAL · VITRINE DE ALTA COSTURA",
      title: "Um Hotsite que Honra a Tradição do Lago Sul",
      subtitle:
        "Substituímos sites genéricos por uma experiência imersiva inspirada na nobreza e arquitetura monumental de Brasília.",
      content: (
        <div className="mt-8 grid gap-6 lg:grid-cols-3 text-left">
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
            <Camera className="h-6 w-6 text-[#D3B47C]" />
            <h4 className="font-serif text-lg text-white mt-3">Acervo Real 35mm</h4>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              Mais de <strong>340 fotografias em alta resolução</strong> organizadas em rolo cinematográfico: Casamentos, 15 Anos, Gastronomia, Lustres e Salões.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
            <Sparkles className="h-6 w-6 text-[#D3B47C]" />
            <h4 className="font-serif text-lg text-white mt-3">Identidade Visual Calibrada</h4>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              Tipografia editorial Cormorant Garamond, tons Dourado Champagne (`#D3B47C`) e Preto Ébano, criando contraste e distinção aristocrática.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
            <TrendingUp className="h-6 w-6 text-[#D3B47C]" />
            <h4 className="font-serif text-lg text-white mt-3">Conversão Máxima de Leads</h4>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              Formulário simplificado de agendamento de visita no Lago Sul, integração direta com WhatsApp comercial e mapa interativo.
            </p>
          </div>
          <div className="lg:col-span-3 text-center pt-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-6 py-3 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 shadow-xl transition"
            >
              <span>Abrir Hotsite Institucional em Nova Aba</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: "anfitriao",
      tag: "O ECOSSISTEMA DO CASAL · DIFERENCIAL COMPETITIVO",
      title: "Mini-site, Painel e WhatsApp dos Noivos",
      subtitle:
        "Em vez de pagar plataformas terceiras como iCasei e Casar.com, os casais usam o sistema oficial com a marca do Dúnia City Hall.",
      content: (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
            <span className="text-[0.65rem] text-[#D3B47C] font-bold uppercase">01 · MINI-SITE</span>
            <h4 className="font-serif text-base text-white mt-1">Mini-site do Evento</h4>
            <p className="text-xs text-[#ABA29A] mt-1">
              Contagem regressiva, história do casal, horologia em tempo real, traje e mapa.
            </p>
            <Link href="/evento" target="_blank" className="mt-4 block text-xs text-[#D3B47C] font-semibold hover:underline">
              Testar Mini-site →
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
            <span className="text-[0.65rem] text-emerald-400 font-bold uppercase">02 · WHATSAPP</span>
            <h4 className="font-serif text-base text-white mt-1">Disparos de Convite</h4>
            <p className="text-xs text-[#ABA29A] mt-1">
              Envio personalizado 1-clique com link direto de confirmação ({`{nome}`}, {`{codigo}`}).
            </p>
            <Link href="/painel" target="_blank" className="mt-4 block text-xs text-emerald-400 font-semibold hover:underline">
              Ver Painel →
            </Link>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
            <span className="text-[0.65rem] text-sky-400 font-bold uppercase">03 · PORTARIA</span>
            <h4 className="font-serif text-base text-white mt-1">Check-in Anti-Duplicidade</h4>
            <p className="text-xs text-[#ABA29A] mt-1">
              Validação por QR Code na entrada, bloqueando penetras e tentativas de duplicidade.
            </p>
            <span className="mt-4 block text-xs text-white/40">Segurança Total</span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
            <span className="text-[0.65rem] text-amber-300 font-bold uppercase">04 · TOTEM MESA</span>
            <h4 className="font-serif text-base text-white mt-1">Displays para Impressão</h4>
            <p className="text-xs text-[#ABA29A] mt-1">
              Placas para impressão em acrílico para mesas, com QR code para fotos da festa.
            </p>
            <span className="mt-4 block text-xs text-white/40">Acervo Colaborativo</span>
          </div>
        </div>
      ),
    },
    {
      id: "telao",
      tag: "EXPERIÊNCIA AO VIVO NO SALÃO · DÚNIA MEMORIES",
      title: "O Telão Interativo Sincronizado",
      subtitle:
        "Convidados tiram fotos na festa pelo celular e elas aparecem instantaneamente nos telões do Dúnia City Hall com efeitos e música.",
      content: (
        <div className="mt-8 grid gap-8 lg:grid-cols-2 text-left items-center">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
              <h4 className="font-serif text-lg text-white">Controle Remoto Pelo Painel do Casal</h4>
              <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                Os noivos controlam a velocidade das transições, o efeito Ken Burns, a aprovação de fotos e a trilha sonora de fundo sem sair da mesa.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
              <h4 className="font-serif text-lg text-white">Sincronização Instantânea com Zero Atraso</h4>
              <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                Utiliza a tecnologia de ponta <strong>BroadcastChannel</strong> e eventos em tempo real, transmitindo em 4K e Full HD para qualquer painel de LED ou projetor.
              </p>
            </div>
            <Link
              href="/evento/telao"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-5 py-3 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 shadow transition"
            >
              <span>Abrir Telão Interativo em Tela Cheia</span>
              <Tv className="h-4 w-4" />
            </Link>
          </div>

          <div className="rounded-3xl border border-[#D3B47C]/40 bg-black/60 p-6 text-center shadow-2xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              SIMULADOR DE IMPACTO NO SALÃO
            </span>
            <div className="mt-4 font-serif text-4xl text-white">94% de Engajamento</div>
            <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
              Média de <strong>300 a 600 fotos enviadas</strong> pelos convidados por festa, criando um arquivo emocional inesquecível que nenhum fotógrafo sozinho consegue registrar.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "admin",
      tag: "GESTÃO DO SALÃO · CONTROLE OPERACIONAL",
      title: "Central de Operações & Agenda de Eventos",
      subtitle:
        "O salão ganha uma agenda operacional completa para gerenciar o Salão Imperial, Espaço Cristal e Jardim Imperial.",
      content: (
        <div className="mt-8 grid gap-6 lg:grid-cols-3 text-left">
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
            <Calendar className="h-6 w-6 text-[#D3B47C]" />
            <h4 className="font-serif text-lg text-white mt-3">Agenda Operacional</h4>
            <p className="text-xs text-[#ABA29A] mt-1">
              Visualização por mês ou timeline com horários de montagem, cerimônia, término e desmontagem (limite 07:30h).
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
            <SlidersHorizontal className="h-6 w-6 text-[#D3B47C]" />
            <h4 className="font-serif text-lg text-white mt-3">Configurador de Módulos</h4>
            <p className="text-xs text-[#ABA29A] mt-1">
              O administrador liga ou desliga módulos específicos com 1 clique dependendo do que o cliente contratou.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
            <Lock className="h-6 w-6 text-[#D3B47C]" />
            <h4 className="font-serif text-lg text-white mt-3">Governança & Cotas</h4>
            <p className="text-xs text-[#ABA29A] mt-1">
              Trava de capacidade máxima de convidados e cotas de disparos WhatsApp para resguardar a infraestrutura.
            </p>
          </div>
          <div className="lg:col-span-3 text-center pt-2">
            <Link
              href="/admin/experiencias"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-6 py-3 text-xs font-bold text-[#D3B47C] hover:bg-[#D3B47C] hover:text-[#100E0D] shadow transition"
            >
              <span>Abrir Central de Operações & Agenda (`/admin/experiencias`)</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: "financeiro",
      tag: "MODELAGEM COMERCIAL · RETORNO FINANCEIRO",
      title: "Projeção de Lucro Adicional para o Dúnia",
      subtitle:
        "Toda a cobrança é realizada fisicamente pelo time comercial fora da plataforma. Lucro puro com infraestrutura já paga.",
      content: (
        <div className="mt-8 grid gap-8 lg:grid-cols-2 text-left items-center">
          <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 space-y-4">
            <h4 className="font-serif text-xl text-white">Pacotes Sugeridos de Venda:</h4>
            <div className="divide-y divide-white/10 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span>Dúnia Invite (Mini-site + Contagem + Mapa)</span>
                <strong className="text-white font-mono">R$ 800</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Guest OS (Invite + WhatsApp RSVP + Portaria QR)</span>
                <strong className="text-[#D3B47C] font-mono">R$ 1.800</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Guest OS + Memories (Tudo + Telão + Álbum Drive)</span>
                <strong className="text-emerald-400 font-mono">R$ 2.400</strong>
              </div>
            </div>
            <p className="text-[0.7rem] text-[#ABA29A] pt-2">
              * O cliente pode pagar parcelado junto ao contrato principal de locação do salão.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-[#D3B47C] bg-black/60 p-8 text-center shadow-2xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              RECEITA LÍQUIDA ESTIMADA (MENSAL)
            </span>
            <div className="mt-3 font-serif text-5xl text-white">R$ 22.000 / mês</div>
            <span className="mt-2 block text-xs text-[#ABA29A]">
              Considerando 12 festas/mês e adesão conservadora de 40% a 50%
            </span>
            <div className="mt-6 rounded-2xl bg-[#D3B47C]/15 p-4 border border-[#D3B47C]/30 text-xs text-white">
              Potencial Anual: <strong className="text-[#D3B47C] text-lg font-mono">R$ 264.000 / ano</strong> de lucro limpo para os sócios do Dúnia.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "seguranca",
      tag: "LGPD & SEGURANÇA · ENTREGA DAS MEMÓRIAS",
      title: "Privacidade dos Convidados & Entrega VIP",
      subtitle:
        "Segurança de dados blindada e entrega elegante das fotos como presente de casamento do Dúnia City Hall.",
      content: (
        <div className="mt-8 grid gap-6 sm:grid-cols-3 text-left">
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
            <ShieldCheck className="h-6 w-6 text-[#D3B47C]" />
            <h4 className="font-serif text-lg text-white mt-3">Isolamento Atômico</h4>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              Cada celebração possui isolamento criptográfico no banco de dados. Convidados de uma festa jamais acessam fotos de outra.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
            <Lock className="h-6 w-6 text-[#D3B47C]" />
            <h4 className="font-serif text-lg text-white mt-3">Conformidade LGPD</h4>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              Termos de consentimento claros e prazo de retenção de 45 dias para download, resguardando o salão juridicamente.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6">
            <Camera className="h-6 w-6 text-[#D3B47C]" />
            <h4 className="font-serif text-lg text-white mt-3">Presente no Google Drive</h4>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              As fotos são sincronizadas na pasta do casal no Google Drive em alta resolução, para que compartilhem com pais e padrinhos.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "conclusao",
      tag: "DEMONSTRAÇÃO AO VIVO · PRÓXIMOS PASSOS",
      title: "Pronto para Apresentação ao Proprietário",
      subtitle:
        "O sistema está 100% implementado, responsivo, com código limpo e pronto para homologação da diretoria.",
      content: (
        <div className="mt-8 space-y-6">
          <p className="text-sm text-[#DFD5CA] max-w-2xl mx-auto leading-relaxed">
            Seja para adotar o <strong>Modo Light</strong> (apenas Hotsite vitrine) ou o <strong>Experience OS</strong> (plataforma digital completa), o Dúnia City Hall agora possui a solução mais sofisticada de eventos da capital federal.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              target="_blank"
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              1. Hotsite Institucional ↗
            </Link>
            <Link
              href="/admin/experiencias"
              target="_blank"
              className="rounded-xl bg-[#D3B47C] px-5 py-3 text-xs font-bold text-[#100E0D] hover:bg-[#D3B47C]/90 shadow transition"
            >
              2. Agenda & Admin do Salão ↗
            </Link>
            <Link
              href="/painel"
              target="_blank"
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              3. Painel dos Noivos ↗
            </Link>
            <Link
              href="/evento"
              target="_blank"
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              4. Mini-site do Casal ↗
            </Link>
            <Link
              href="/evento/telao"
              target="_blank"
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              5. Telão Interativo ↗
            </Link>
          </div>
        </div>
      ),
    },
  ]

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))
      } else if (e.key === "ArrowLeft") {
        setCurrentSlide((prev) => Math.max(prev - 1, 0))
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [slides.length])

  const slide = slides[currentSlide]

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#0C0A09] text-[#F3EEE6] p-6 sm:p-12 antialiased select-none">
      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-white/10 pb-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo.png"
            alt="Dúnia City Hall"
            width={140}
            height={40}
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Slide Counter / Progress */}
        <div className="flex items-center gap-2">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === idx ? "w-8 bg-[#D3B47C]" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              title={`Slide ${idx + 1}: ${s.title}`}
            />
          ))}
          <span className="ml-3 font-mono text-xs text-[#ABA29A]">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </header>

      {/* Main Slide Content */}
      <main className="my-auto py-10 max-w-5xl mx-auto w-full text-center animate-fadeIn">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] block mb-2">
          {slide.tag}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          {slide.title}
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-[#ABA29A] max-w-2xl mx-auto leading-relaxed">
          {slide.subtitle}
        </p>

        {slide.content}
      </main>

      {/* Bottom Controls */}
      <footer className="flex items-center justify-between border-t border-white/10 pt-6">
        <div className="text-xs text-[#ABA29A]">
          Use as setas do teclado <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-white">←</kbd>{" "}
          <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-white">→</kbd> para navegar
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
            disabled={currentSlide === 0}
            className="flex items-center gap-1 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Anterior</span>
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, slides.length - 1))}
            disabled={currentSlide === slides.length - 1}
            className="flex items-center gap-1 rounded-xl bg-[#D3B47C] px-5 py-2.5 text-xs font-bold text-[#100E0D] transition hover:bg-[#D3B47C]/90 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span>Próximo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  )
}
