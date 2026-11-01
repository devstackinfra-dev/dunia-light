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
  Check,
  Server,
  Zap,
  Clock,
  Award,
} from "lucide-react"

export default function ApresentacaoProprietarioPage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: "capa",
      tag: "APRESENTAÇÃO EXECUTIVA COMERCIAL · DIRETORIA DÚNIA CITY HALL",
      title: "Transformação Digital & Modelos de Negócio",
      subtitle:
        "Proposta de Implantação, Manutenção, SLA e Roadmap Comercial para o Salão Mais Elegante de Brasília.",
      content: (
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#D3B47C]/30 bg-[#161311] p-6 text-left shadow-xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C]">MODELO 1 · LIGHT</span>
            <h4 className="font-serif text-lg text-white mt-1">Hotsite Institucional Nobre</h4>
            <div className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
              Setup: <strong className="text-white">R$ 2.800</strong> · Mensalidade: <strong className="text-[#D3B47C]">R$ 300/mês</strong>. Vitrine aristocrática, Acervo 35mm com 340+ fotos e captação contínua de visitas VIP no Lago Sul.
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-500/30 bg-[#161311] p-6 text-left shadow-xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-400">MODELO 2 · EXPERIENCE OS</span>
            <h4 className="font-serif text-lg text-white mt-1">Plataforma Completa + Telão</h4>
            <div className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
              Setup: <strong className="text-white">R$ 4.800</strong> · Manutenção: <strong className="text-emerald-400">R$ 650/mês</strong>. Mini-sites de noivos, WhatsApp RSVP, Telão ao vivo, Portaria QR e Agenda de Eventos.
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 text-left shadow-xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-300">BUSINESS CASE</span>
            <h4 className="font-serif text-lg text-white mt-1">+R$ 80.000 a 100.000/Ano</h4>
            <div className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
              O Dúnia revende os pacotes digitais aos noivos (R$ 1.200 a R$ 2.400/evento). Com 3 a 4 eventos/mês, paga a manutenção e gera lucro puro com margem de 95%+.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "proposta-precos",
      tag: "PROPOSTA COMERCIAL · INVESTIMENTO & MANUTENÇÃO",
      title: "Tabela de Valores & O Que Está Incluso",
      subtitle:
        "Dois formatos desenhados sob medida para a decisão estratégica do proprietário.",
      content: (
        <div className="mt-8 grid gap-8 lg:grid-cols-2 text-left">
          {/* PACOTE 1: LIGHT */}
          <div className="rounded-3xl border border-white/15 bg-black/40 p-8 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-bold uppercase text-white/80">
                  MODO LIGHT (HOTSITE PURO)
                </span>
                <span className="text-xs text-[#ABA29A]">Foco em Captação</span>
              </div>
              <h3 className="mt-3 font-serif text-3xl text-white">Hotsite Institucional Nobre</h3>
              
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-light text-white">R$ 2.800</span>
                <span className="text-xs text-[#ABA29A]">(setup / implantação única)</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-xl font-bold text-[#D3B47C]">+ R$ 300</span>
                <span className="text-xs text-[#ABA29A]">/ mês (hospedagem & manutenção)</span>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-[#D3B47C] block mb-2">
                  ITENS INCLUSOS:
                </span>
                <ul className="space-y-2 text-xs text-[#DFD5CA]">
                  <li className="flex items-center gap-2">✓ Hotsite responsivo institucional de altíssimo padrão</li>
                  <li className="flex items-center gap-2">✓ Acervo fotográfico 35mm com 340+ fotos catalogadas</li>
                  <li className="flex items-center gap-2">✓ Apresentação dos 3 espaços: Salão Imperial, Cristal e Jardim</li>
                  <li className="flex items-center gap-2">✓ Formulário VIP de agendamento de visita no Lago Sul</li>
                  <li className="flex items-center gap-2">✓ Otimização SEO para buscas de casamentos em Brasília</li>
                  <li className="flex items-center gap-2">✓ Hospedagem dedicada na Hostinger KVM4 com SSL e CDN</li>
                  <li className="flex items-center gap-2">✓ <strong>SLA 99.8%</strong> e suporte técnico com resposta em até 24h</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-white/[0.03] p-3 text-center border border-white/5">
              <span className="text-[0.7rem] text-[#ABA29A]">Configuração com 1 chave no .env (`NEXT_PUBLIC_DUNIA_MODE=light`)</span>
            </div>
          </div>

          {/* PACOTE 2: FULL EXPERIENCE OS */}
          <div className="rounded-3xl border-2 border-[#D3B47C] bg-gradient-to-b from-[#1C1816] to-[#12100E] p-8 shadow-2xl relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#D3B47C] px-3 py-1 text-[0.65rem] font-bold uppercase text-[#100E0D]">
                  EXPERIENCE OS (PLATAFORMA COMPLETA)
                </span>
                <span className="text-xs text-[#D3B47C] font-bold">Mais Vendido & Mais Lucrativo</span>
              </div>
              <h3 className="mt-3 font-serif text-3xl text-white">Ecossistema Digital de Eventos</h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-3xl font-light text-white">R$ 4.800</span>
                <span className="text-xs text-[#ABA29A]">(setup / implantação em até 2x)</span>
              </div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-xl font-bold text-emerald-400">+ R$ 650</span>
                <span className="text-xs text-[#ABA29A]">/ mês (infraestrutura, plantão e suporte)</span>
              </div>

              <div className="mt-6 border-t border-white/10 pt-4">
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                  TUDO DO MODO LIGHT E MAIS:
                </span>
                <ul className="space-y-2 text-xs text-[#DFD5CA]">
                  <li className="flex items-center gap-2">✓ Gerador ilimitado de Mini-sites para noivos e debutantes</li>
                  <li className="flex items-center gap-2">✓ Painel dos Anfitriões com disparos WhatsApp e lista Pix</li>
                  <li className="flex items-center gap-2">✓ Telão Interativo Memories 4K ao vivo com controle remoto</li>
                  <li className="flex items-center gap-2">✓ Portaria digital anti-duplicidade com leitor de QR Code</li>
                  <li className="flex items-center gap-2">✓ Central Administrativa com Agenda de Eventos dos 3 salões</li>
                  <li className="flex items-center gap-2">✓ Entrega automatizada do acervo em pasta Google Drive VIP</li>
                  <li className="flex items-center gap-2">✓ <strong>SLA 99.9%</strong> com <strong>Plantão Prioritário nos dias de evento</strong></li>
                  <li className="flex items-center gap-2">✓ Backup diário automático e isolamento total LGPD</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-[#D3B47C]/10 p-3 text-center border border-[#D3B47C]/30">
              <span className="text-xs text-[#D3B47C] font-bold">O salão revende por R$ 1.800/casamento (Lucro Limpo!)</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "business-case",
      tag: "RETORNO SOBRE O INVESTIMENTO · ROI DO PROPRIETÁRIO",
      title: "Como a Plataforma se Paga no Primeiro Mês",
      subtitle:
        "O salão cobra diretamente dos anfitriões no contrato de locação, criando uma fonte recorrente de alta margem.",
      content: (
        <div className="mt-8 grid gap-8 lg:grid-cols-2 text-left items-center">
          <div className="rounded-3xl border border-white/10 bg-[#161311] p-6 space-y-4">
            <h4 className="font-serif text-xl text-white">Simulação Conservadora de Vendas:</h4>
            <div className="divide-y divide-white/10 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span>Eventos realizados por mês no Dúnia:</span>
                <strong className="text-white font-mono">12 festas</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Adesão estimada de noivos ao pacote digital:</span>
                <strong className="text-[#D3B47C] font-mono">35% (apenas 4 casais)</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span>Valor cobrado pelo salão por pacote:</span>
                <strong className="text-white font-mono">R$ 1.800 / evento</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="font-semibold text-white">Receita Bruta Gerada para o Dúnia:</span>
                <strong className="text-emerald-400 font-mono text-sm">+ R$ 7.200 / mês</strong>
              </div>
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#ABA29A]">Custo da Manutenção e Suporte:</span>
                <strong className="text-rose-400 font-mono">- R$ 650 / mês</strong>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-emerald-500/10 p-3 border border-emerald-500/30 text-xs text-emerald-300 text-center font-semibold">
              Lucro Líquido Mensal: + R$ 6.550 / mês no bolso do salão!
            </div>
          </div>

          <div className="rounded-3xl border-2 border-[#D3B47C] bg-black/60 p-8 text-center shadow-2xl">
            <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#D3B47C]">
              LUCRO LÍQUIDO ANUAL PARA O DÚNIA
            </span>
            <div className="mt-3 font-serif text-5xl text-white font-normal">
              + R$ 78.600 <span className="text-lg font-sans text-[#ABA29A]">a</span> R$ 110.000
            </div>
            <p className="mt-2 text-xs text-[#ABA29A] leading-relaxed">
              O investimento inicial de setup (R$ 4.800) se paga inteiramente nas primeiras 3 vendas! A partir do segundo mês, é receita 95%+ líquida.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 text-center text-xs">
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <span className="text-[#ABA29A] block text-[0.65rem]">Custo Operacional</span>
                <strong className="text-white font-mono">Quase Zero</strong>
              </div>
              <div className="rounded-xl bg-white/5 p-3 border border-white/10">
                <span className="text-[#ABA29A] block text-[0.65rem]">Cobrança</span>
                <strong className="text-emerald-400 font-mono">100% Fora da Plataforma</strong>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "roadmap",
      tag: "ROADMAP DE DESENVOLVIMENTO & ENTREGAS",
      title: "Cronograma de Evolução & O Que Já Foi Entregue",
      subtitle:
        "Tudo o que foi planejado já está 100% desenvolvido, testado e pronto para homologação imediata.",
      content: (
        <div className="mt-8 space-y-4 text-left">
          <div className="grid gap-4 md:grid-cols-3">
            {/* FASE 1 */}
            <div className="rounded-2xl border border-emerald-500/40 bg-[#161311] p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                  FASE 1 · 100% ENTREGUE
                </span>
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <h4 className="font-serif text-lg text-white mt-2">Hotsite Nobre & Acervo 35mm</h4>
              <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                Arquitetura clássica contemporânea em ouro champagne e preto ébano. 340+ fotos reais catalogadas. Formulário VIP de agendamento no Lago Sul e Revista Dúnia Editorial (CMS para publicações de casamentos reais e alta gastronomia).
              </p>
            </div>

            {/* FASE 2 */}
            <div className="rounded-2xl border border-emerald-500/40 bg-[#161311] p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                  FASE 2 · 100% ENTREGUE
                </span>
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <h4 className="font-serif text-lg text-white mt-2">Ecossistema do Casal & WhatsApp</h4>
              <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                Mini-site dos noivos, importador de listas Excel, disparador de convites 1-clique pelo WhatsApp, QR Code individual e lista Pix sem taxas.
              </p>
            </div>

            {/* FASE 3 */}
            <div className="rounded-2xl border border-emerald-500/40 bg-[#161311] p-5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-300">
                  FASE 3 · 100% ENTREGUE
                </span>
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <h4 className="font-serif text-lg text-white mt-2">Telão Memories & Agenda do Salão</h4>
              <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
                Transmissão ao vivo de fotos no telão com sincronização em tempo real. Agenda dos 3 salões e controle de módulos por contrato.
              </p>
            </div>
          </div>

          {/* FASE 4 FUTURA */}
          <div className="rounded-2xl border border-[#D3B47C]/30 bg-black/40 p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="rounded bg-[#D3B47C]/20 px-2 py-0.5 text-[0.65rem] font-bold text-[#D3B47C]">
                FASE 4 · ROADMAP DE EXPANSÕES FUTURAS (OPCIONAL)
              </span>
              <Sparkles className="h-4 w-4 text-[#D3B47C]" />
            </div>
            <div className="mt-2 grid gap-4 sm:grid-cols-3 text-xs text-[#ABA29A]">
              <div>
                <strong className="text-white block font-serif text-sm">Totens Físicos em Acrílico</strong>
                Produção das placas físicas com a marca Dúnia e corte a laser para as mesas de convidados.
              </div>
              <div>
                <strong className="text-white block font-serif text-sm">API Direta com WhatsApp Business</strong>
                Disparo via container Docker Evolution API na VPS Hostinger para automações sem QR code manual.
              </div>
              <div>
                <strong className="text-white block font-serif text-sm">Concierge Digital com IA</strong>
                Tira-dúvidas automatizado sobre trajes, horários de vallet e rotas no Lago Sul.
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sla-seguranca",
      tag: "INFRAESTRUTURA & GOVERNANÇA · SLA DE ALTO NÍVEL",
      title: "Estabilidade, Escala & Segurança dos Dados",
      subtitle:
        "Toda a infraestrutura foi projetada para garantir zero falhas nos dias de festa e conformidade total com a LGPD.",
      content: (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
            <Server className="h-5 w-5 text-[#D3B47C]" />
            <h5 className="font-serif text-base text-white mt-2">Hospedagem Hostinger KVM4</h5>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              Servidor dedicado de alto desempenho no Brasil com baixa latência, certificado SSL Cloudflare e cache CDN global.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
            <Clock className="h-5 w-5 text-emerald-400" />
            <h5 className="font-serif text-base text-white mt-2">SLA de 99.9% + Plantão</h5>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              Disponibilidade ininterrupta com plantão técnico prioritário nos horários nobres de evento (sextas, sábados e domingos).
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
            <Lock className="h-5 w-5 text-sky-400" />
            <h5 className="font-serif text-base text-white mt-2">Segurança & LGPD</h5>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              Isolamento atômico entre celebrações. Fotos e convidados de um casamento não são acessíveis por outras festas.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
            <Zap className="h-5 w-5 text-amber-300" />
            <h5 className="font-serif text-base text-white mt-2">Alta Escala de Check-in</h5>
            <p className="text-xs text-[#ABA29A] mt-1 leading-relaxed">
              Leitura instantânea de QR Code na portaria, suportando centenas de convidados chegando simultaneamente sem filas.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "demonstracao",
      tag: "HOMOLOGAÇÃO AO VIVO · EXPERIMENTE AGORA",
      title: "Pronto para a Reunião com a Diretoria",
      subtitle:
        "Todos os módulos estão no ar e sincronizados. Clique abaixo para abrir e demonstrar cada tela em tempo real.",
      content: (
        <div className="mt-8 space-y-6">
          <p className="text-sm text-[#DFD5CA] max-w-2xl mx-auto leading-relaxed">
            A decisão entre o <strong>Modo Light</strong> (R$ 2.800 setup + R$ 300/mês) ou o <strong>Experience OS Completo</strong> (R$ 4.800 setup + R$ 650/mês) é 100% configurável via arquivo de ambiente (`.env`), sem retrabalho ou custo extra.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/"
              target="_blank"
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              1. Hotsite Institucional Dúnia ↗
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
              3. Painel do Casal & Módulos ↗
            </Link>
            <Link
              href="/evento"
              target="_blank"
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              4. Mini-site da Celebração ↗
            </Link>
            <Link
              href="/evento/telao"
              target="_blank"
              className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              5. Telão Interativo 4K ao Vivo ↗
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
      <main className="my-auto py-8 max-w-5xl mx-auto w-full text-center animate-fadeIn">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C] block mb-2">
          {slide.tag}
        </span>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-white leading-tight">
          {slide.title}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#ABA29A] max-w-2xl mx-auto leading-relaxed">
          {slide.subtitle}
        </p>

        {slide.content}
      </main>

      {/* Bottom Controls */}
      <footer className="flex items-center justify-between border-t border-white/10 pt-6">
        <div className="text-xs text-[#ABA29A]">
          Navegação: <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-white">←</kbd>{" "}
          <kbd className="rounded bg-white/10 px-2 py-0.5 font-mono text-white">→</kbd> ou botões ao lado
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
