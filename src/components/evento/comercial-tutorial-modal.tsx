"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Sparkles,
  X,
  Tv,
  QrCode,
  CheckCircle2,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  Calendar,
  Heart,
  MessageSquare,
  Award,
  Shield,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Play,
  Layers,
} from "lucide-react"

interface CommercialTutorialModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchEvent?: (eventId: string) => void
  onOpenRsvp?: () => void
}

export default function CommercialTutorialModal({
  isOpen,
  onClose,
  onSwitchEvent,
  onOpenRsvp,
}: CommercialTutorialModalProps) {
  const [activeTab, setActiveTab] = useState<"tutorial" | "pitch" | "jornada">("tutorial")

  if (!isOpen) return null

  const items = [
    {
      id: "seletor",
      badge: "01. SELETOR DE EVENTOS",
      title: "Pílulas dos Anfitriões (Juliana, Clarice, Sofia, Dra., Prêmio)",
      description:
        "Alterna instantaneamente a identidade do mini-site entre os 5 nichos mais lucrativos de Brasília: Casamento de Luxo (Juliana), 15 Anos & Debutante (Clarice), Bodas Íntimas (Sofia), Formaturas & Posses Diplomáticas (Dra.) e Galas Corporativas (Prêmio).",
      pitchTip:
        "💡 Como apresentar: 'O Dúnia não entrega um modelo engessado; o sistema adapta cores, narrativa, corte de honra e dress code para cada anfitrião.'",
      actionLabel: "Testar Juliana (Casamento)",
      actionEventId: "ev-jm",
      icon: Users,
    },
    {
      id: "telao",
      badge: "02. TELÃO AO VIVO",
      title: "Telão ao Vivo / Live Memories (/evento/telao)",
      description:
        "Interface de projeção cinematográfica em tempo real sincronizada com o salão. Durante a festa, fotos tiradas pelos convidados nas mesas sobem direto para os telões de LED com moderação visual, QR code fixo e animações de brinde.",
      pitchTip:
        "💡 Como apresentar: 'Nenhum outro espaço em Brasília tem isso nativo. Os noivos economizam na contratação de totem externo e o salão vira uma experiência interativa viva.'",
      actionLabel: "Abrir Telão ao Vivo ↗",
      actionUrl: "/evento/telao",
      icon: Tv,
    },
    {
      id: "qrcode",
      badge: "03. QR CODE DE MESA",
      title: "QR Code de Mesa / Totem Digital (/evento/fotos)",
      description:
        "Simula o que o convidado vive ao se sentar à mesa no Dúnia. Ele apenas aponta a câmera do celular para o QR Code no porta-guardanapo: entra sem baixar nenhum aplicativo, identifica sua mesa, posta selfies no telão e escreve no Livro de Ouro.",
      pitchTip:
        "💡 Como apresentar: 'Zero atrito. O convidado de 80 anos ou de 15 anos usa com a mesma facilidade em 3 segundos.'",
      actionLabel: "Ir para Seção do Totem",
      actionAnchor: "#qrcode-section",
      icon: QrCode,
    },
    {
      id: "rsvp",
      badge: "04. RSVP INTELIGENTE",
      title: "Confirmar Presença (Formulário VIP de Confirmação)",
      description:
        "Mecanismo de confirmação com código exclusivo por família, controle de assentos por convite e coleta de restrições alimentares (celíaco, vegetariano, alergias) sincronizado em tempo real com o Painel do Casal e com a cozinha do Buffet.",
      pitchTip:
        "💡 Como apresentar: 'Evita o temido no-show de até 20% e economiza milhares de reais em pratos desperdiçados no buffet.'",
      actionLabel: "Testar Formulário RSVP",
      actionRsvp: true,
      icon: CheckCircle2,
    },
    {
      id: "painel",
      badge: "05. PAINEL DO ANFITRIÃO",
      title: "Central de Gestão do Casal & Cerimonial (/painel)",
      description:
        "O cockpit executivo dos noivos: acompanhamento da lista de convidados em tempo real, confirmações no WhatsApp, aprovação de fotos para o telão, download de planilhas e controle financeiro de presentes recebidos via PIX.",
      pitchTip:
        "💡 Como apresentar: 'Uma plataforma SaaS completa que o cerimonial e os noivos pagariam caro por fora e que o Dúnia oferece como valor agregado irresistível.'",
      actionLabel: "Acessar Painel Casal ↗",
      actionUrl: "/painel",
      icon: SlidersHorizontal,
    },
    {
      id: "sobre360",
      badge: "06. TOUR 360° & ENGENHARIA",
      title: "Tour Virtual 360° & Ficha Técnica (/sobre)",
      description:
        "Tour panorâmico imersivo pelos 2.500 m² (Salão Imperial, Espaço Cristal, Espaço da Noiva, Jardim Imperial e Foyer), com tabela comparativa de layouts e especificações técnicas de engenharia (gerador 250 kVA, chiller 120 TR, acústica 48dB).",
      pitchTip:
        "💡 Como apresentar: 'Permite fechar contratos à distância com embaixadas, multinacionais e noivos que moram fora de Brasília sem precisar de visita presencial imediata.'",
      actionLabel: "Ver Tour 360° ↗",
      actionUrl: "/sobre#tour360",
      icon: Compass,
    },
  ]

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4 sm:p-6 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl border-2 border-[#D3B47C]/50 bg-[#120F0D] shadow-[0_30px_90px_rgba(0,0,0,0.99),0_0_50px_rgba(211,180,124,0.2)] text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOPO COM IDENTIDADE EXECUTIVA */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#161311]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D3B47C] text-[#120F0D] shadow">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                GUIA DE DEMONSTRAÇÃO COMERCIAL · DÚNIA CITY HALL
              </span>
              <h3 className="font-serif text-lg sm:text-xl text-white font-normal">
                Como Apresentar Esta Plataforma Para Fechar Contratos
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white transition"
            aria-label="Fechar guia comercial"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVEGAÇÃO ENTRE ABAS */}
        <div className="flex border-b border-white/10 bg-[#14110F] px-6">
          <button
            onClick={() => setActiveTab("tutorial")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
              activeTab === "tutorial"
                ? "border-[#D3B47C] text-[#D3B47C]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            1. O Que Cada Botão Faz (Tutorial)
          </button>
          <button
            onClick={() => setActiveTab("pitch")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
              activeTab === "pitch"
                ? "border-[#D3B47C] text-[#D3B47C]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            2. Roteiro Comercial de 3 Minutos
          </button>
          <button
            onClick={() => setActiveTab("jornada")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider transition border-b-2 ${
              activeTab === "jornada"
                ? "border-[#D3B47C] text-[#D3B47C]"
                : "border-transparent text-white/60 hover:text-white"
            }`}
          >
            3. A Jornada do Convidado (Fluxo)
          </button>
        </div>

        {/* CORPO DO CONTEÚDO COM SCROLL */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* ABA 1: TUTORIAL DOS BOTÕES */}
          {activeTab === "tutorial" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#D3B47C]/30 bg-[#161311] p-4 text-xs text-[#DFD5CA] leading-relaxed flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎯</span>
                  <span>
                    <strong>Dica de Venda:</strong> Durante a reunião, abra o mini-site no telão ou notebook e clique nos botões indicados abaixo na sequência. Cada clique gera um efeito &quot;uau&quot; no cliente.
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/10 bg-[#161311] p-5 shadow-lg flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                            {item.badge}
                          </span>
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/5 text-[#D3B47C]">
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                        </div>

                        <h4 className="font-serif text-base text-white font-normal">
                          {item.title}
                        </h4>

                        <p className="text-xs text-[#ABA29A] leading-relaxed">
                          {item.description}
                        </p>

                        <div className="rounded-xl border border-white/10 bg-black/40 p-2.5 text-[0.72rem] text-[#E2C799] italic">
                          {item.pitchTip}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        {item.actionUrl && (
                          <Link
                            href={item.actionUrl}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D3B47C] hover:underline"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        )}

                        {item.actionAnchor && (
                          <a
                            href={item.actionAnchor}
                            onClick={onClose}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D3B47C] hover:underline"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        )}

                        {item.actionRsvp && onOpenRsvp && (
                          <button
                            onClick={() => {
                              onClose()
                              onOpenRsvp()
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D3B47C] hover:underline"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}

                        {item.actionEventId && onSwitchEvent && (
                          <button
                            onClick={() => {
                              onSwitchEvent(item.actionEventId!)
                              onClose()
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#D3B47C] hover:underline"
                          >
                            <span>{item.actionLabel}</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ABA 2: ROTEIRO DE VENDAS (PITCH DE 3 MINUTOS) */}
          {activeTab === "pitch" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 space-y-4">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                  ETAPA 1 · MINUTO 01
                </span>
                <h4 className="font-serif text-xl text-white">
                  Abertura: Transformando o Espaço em Experiência
                </h4>
                <div className="text-xs sm:text-sm text-[#DFD5CA] leading-relaxed space-y-2 font-sans bg-black/40 p-4 rounded-xl border border-white/10">
                  <p>
                    &ldquo;Hoje todos os salões de Brasília vendem metros quadrados e lustres. Mas o convidado de vocês começa a viver o evento no instante em que recebe o convite. O Dúnia City Hall é o único complexo de eventos do Distrito Federal que entrega um <strong>Ecossistema Digital Próprio</strong>.&rdquo;
                  </p>
                  <p className="text-[#D3B47C]">
                    &ldquo;Seus convidados não recebem um link feio de WhatsApp. Eles recebem uma página editorial digna da Vogue, com a história de vocês, a música do casal, o guia de roupas e confirmação instantânea.&rdquo;
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#D3B47C]/40 bg-[#161311] p-6 space-y-4 shadow-xl">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                  ETAPA 2 · MINUTO 02
                </span>
                <h4 className="font-serif text-xl text-white">
                  Demonstração Prática: O Efeito &quot;Uau&quot; do Telão ao Vivo
                </h4>
                <div className="text-xs sm:text-sm text-[#DFD5CA] leading-relaxed space-y-2 font-sans bg-black/40 p-4 rounded-xl border border-white/10">
                  <p>
                    &ldquo;Vejam como funciona no dia da festa: seus amigos sentam nas mesas do Dúnia, apontam a câmera pro porta-guardanapo e postam fotos. Em 2 segundos, a foto sobe automaticamente para os telões de LED gigantes do salão, com as mensagens de carinho que eles escreveram.&rdquo;
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/evento/telao"
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#D3B47C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#120F0D] hover:bg-[#E2C799] transition shadow"
                    >
                      <Tv className="h-4 w-4" />
                      <span>Abrir Demonstração do Telão Agora</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161311] p-6 space-y-4">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-[#D3B47C]">
                  ETAPA 3 · MINUTO 03
                </span>
                <h4 className="font-serif text-xl text-white">
                  Fechamento & Economia Real: O Valor que se Paga Sozinho
                </h4>
                <div className="text-xs sm:text-sm text-[#DFD5CA] leading-relaxed space-y-2 font-sans bg-black/40 p-4 rounded-xl border border-white/10">
                  <p>
                    &ldquo;Além de encantar os convidados, o sistema economiza dinheiro de vocês. O RSVP com controle de acompanhantes e restrições alimentares evita pagar pratos de quem não vai, gerando uma economia que muitas vezes passa de R$ 10.000 no buffet.&rdquo;
                  </p>
                  <p className="text-emerald-400 font-semibold">
                    &ldquo;Ao fechar a data conosco hoje, este sistema completo já está incluso no pacote da celebração de vocês.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABA 3: FLUXO DA JORNADA */}
          {activeTab === "jornada" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-5 text-center">
                {[
                  { step: "01", title: "O Convite", desc: "Link VIP no WhatsApp com contagem regressiva e música autoral" },
                  { step: "02", title: "RSVP Seguro", desc: "Confirmação com acompanhantes e restrições alimentares" },
                  { step: "03", title: "Chegada no Salão", desc: "Guarita blindada, valet e mapa interativo pelo Waze" },
                  { step: "04", title: "Na Mesa", desc: "QR Code escaneado pelo celular sem baixar nenhum app" },
                  { step: "05", title: "No Telão", desc: "Fotos e homenagens ao vivo nos painéis de LED do Dúnia" },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="rounded-2xl border border-white/10 bg-[#161311] p-4 flex flex-col justify-between"
                  >
                    <div>
                      <span className="font-serif text-xl font-light text-[#D3B47C]">{s.step}</span>
                      <h5 className="font-serif text-sm text-white mt-1">{s.title}</h5>
                      <p className="text-[0.68rem] text-[#ABA29A] mt-1.5 leading-tight">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botões Rápidos de Navegação Comercial */}
              <div className="rounded-2xl border border-white/10 bg-black/40 p-5 mt-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif text-base text-white">Pronto para Apresentar?</h4>
                  <p className="text-xs text-[#ABA29A]">Abra as telas em abas separadas para alternar durante a apresentação.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/evento/telao"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:border-[#D3B47C] transition"
                  >
                    <Tv className="h-3.5 w-3.5 text-[#D3B47C]" />
                    <span>Telão ao Vivo</span>
                  </Link>

                  <Link
                    href="/painel"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:border-[#D3B47C] transition"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#D3B47C]" />
                    <span>Painel do Casal</span>
                  </Link>

                  <Link
                    href="/sobre#tour360"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white hover:border-[#D3B47C] transition"
                  >
                    <Compass className="h-3.5 w-3.5 text-[#D3B47C]" />
                    <span>Tour 360°</span>
                  </Link>

                  <Link
                    href="/apresentacao"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#D3B47C] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#120F0D] hover:bg-[#E2C799] transition shadow"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Deck de Slides</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RODAPÉ DO MODAL */}
        <div className="border-t border-white/10 px-6 py-3.5 bg-[#141210] flex items-center justify-between">
          <span className="text-[0.68rem] text-[#ABA29A]">
            Dúnia Experience OS · SHIS QI 15 Lago Sul, Brasília - DF
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-4 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition"
          >
            Fechar Tutorial
          </button>
        </div>
      </div>
    </div>
  )
}
