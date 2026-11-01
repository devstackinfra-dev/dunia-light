import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, MessageSquare, Sparkles } from "lucide-react"

export default function DuniaFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0807] text-[#ABA29A]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Coluna Marca */}
          <div className="space-y-4 md:col-span-4">
            <Link href="/" aria-label="Dúnia City Hall">
              <Image
                src="/assets/logo.png"
                alt="Dúnia City Hall"
                width={160}
                height={55}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-xs leading-relaxed text-[#ABA29A] max-w-xs">
              O salão de festas mais elegante de Brasília. Desde 2008 transformando sonhos em momentos inesquecíveis no Lago Sul.
            </p>
            <div className="pt-2 text-xs text-white/80">
              <span className="font-semibold text-[#D3B47C]">2.500 m² de Área Nobre</span> • Até 1.200 Convidados
            </div>
          </div>

          {/* Coluna Celebrações */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D3B47C]">Celebrações</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/casamento" className="hover:text-white transition">Casamentos dos Sonhos</Link>
              </li>
              <li>
                <Link href="/debutante" className="hover:text-white transition">Debutantes & 15 Anos</Link>
              </li>
              <li>
                <Link href="/corporativo" className="hover:text-white transition">Eventos Corporativos</Link>
              </li>
              <li>
                <Link href="/embaixadas" className="hover:text-white transition">Embaixadas & Diplomacia</Link>
              </li>
              <li>
                <Link href="/buffet" className="hover:text-white transition">Buffet Dúnia Autoral</Link>
              </li>
              <li>
                <Link href="/jardim" className="hover:text-white transition">Jardim & Áreas Verdes</Link>
              </li>
            </ul>
          </div>

          {/* Coluna Tecnologia & OS */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D3B47C]">Dúnia OS</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/evento" target="_blank" className="hover:text-white transition">Mini-site Demo ↗</Link>
              </li>
              <li>
                <Link href="/painel" className="hover:text-white transition">Painel do Casal</Link>
              </li>
              <li>
                <Link href="/admin/experiencias" className="hover:text-white transition">Central do Salão</Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-white transition">Sobre a Estrutura</Link>
              </li>
            </ul>
          </div>

          {/* Coluna Contato */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#D3B47C]">Concierge VIP</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#D3B47C] mt-0.5" />
                <span>SHIS QI 15 - Lago Sul, Brasília - DF, 71635-200</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#D3B47C]" />
                <a href="tel:5561974017544" className="hover:text-white transition">(61) 97401-7544</a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 shrink-0 text-[#D3B47C]" />
                <a
                  href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20no%20D%C3%BAnia%20City%20Hall."
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition"
                >
                  WhatsApp Orçamentos VIP
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Final */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[0.7rem] sm:flex-row">
          <p>© {new Date().getFullYear()} Dúnia City Hall. Todos os direitos reservados.</p>
          <p className="text-[#8C7A68]">Brasília • Lago Sul • Tradição desde 2008</p>
        </div>
      </div>
    </footer>
  )
}
