"use client"

import Link from "next/link"
import Image from "next/image"
import { Globe, Users, QrCode, Camera, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react"

export function ExperienceProduct() {
  return (
    <section id="experience" className="border-b border-[#D3B47C]/20 bg-[#0C0A09] py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          {/* Lado Esquerdo: Apresentação e Recursos */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D3B47C]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>TECNOLOGIA EXCLUSIVA DÚNIA</span>
            </div>

            <h2 className="font-serif text-4xl font-normal text-white sm:text-6xl">
              Dúnia Experience OS
            </h2>

            <p className="text-base leading-relaxed text-[#ABA29A] sm:text-lg">
              Além do cenário mais deslumbrante de Brasília, agora oferecemos uma plataforma digital completa que acompanha seus anfitriões e convidados do convite ao álbum pós-evento.
            </p>

            {/* Grid de 4 Pilares */}
            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
                <Globe className="h-6 w-6 text-[#D3B47C]" />
                <h3 className="mt-3 font-semibold text-white">Mini-site do Evento</h3>
                <p className="mt-1 text-xs text-[#ABA29A]">
                  Página cinematográfica com contagem regressiva, mapas, rotas Waze e traje.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
                <Users className="h-6 w-6 text-[#D3B47C]" />
                <h3 className="mt-3 font-semibold text-white">RSVP Inteligente</h3>
                <p className="mt-1 text-xs text-[#ABA29A]">
                  Confirmação por código individual e mensagens aos anfitriões em tempo real.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
                <QrCode className="h-6 w-6 text-[#D3B47C]" />
                <h3 className="mt-3 font-semibold text-white">QR Code & Check-in</h3>
                <p className="mt-1 text-xs text-[#ABA29A]">
                  Recepção ágil sem filas com validação atômica e bloqueio de duplicidade.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#161311] p-5">
                <Camera className="h-6 w-6 text-[#D3B47C]" />
                <h3 className="mt-3 font-semibold text-white">Dúnia Memories</h3>
                <p className="mt-1 text-xs text-[#ABA29A]">
                  Galeria de fotos pós-evento para convidados reviverem e baixarem as memórias.
                </p>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4 pt-6">
              <Link
                href="/evento"
                target="_blank"
                className="flex items-center gap-2 rounded-xl bg-[#D3B47C] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#100E0D] shadow transition hover:opacity-90"
              >
                <span>VER MINI-SITE DEMO</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/painel"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                <span>PAINEL DO CASAL</span>
              </Link>

              <Link
                href="/admin/experiencias"
                className="flex items-center gap-2 rounded-xl border border-[#D3B47C]/40 bg-[#D3B47C]/10 px-6 py-3.5 text-xs font-semibold text-[#D3B47C] transition hover:bg-[#D3B47C]/20"
              >
                <span>CENTRAL DO SALÃO</span>
              </Link>
            </div>
          </div>

          {/* Lado Direito: Visual e Demonstração */}
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/20 bg-[#161311] shadow-2xl">
              <Image
                src="/assets/mesa.jpg"
                alt="Detalhes e Cenografia Dúnia City Hall"
                fill
                className="object-cover brightness-[0.85] contrast-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/15 bg-black/75 p-5 backdrop-blur-md">
                <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D3B47C]">
                  EXPERIÊNCIA COMPLETA
                </span>
                <h4 className="mt-1 font-serif text-xl text-white">Dúnia City Hall</h4>
                <p className="mt-1 text-xs text-[#ABA29A]">
                  Lago Sul • Brasília/DF • 2.500 m² de sofisticação e tecnologia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
