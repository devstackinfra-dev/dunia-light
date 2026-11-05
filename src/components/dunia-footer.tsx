import Link from "next/link"
import Image from "next/image"
import { MapPin, Phone, MessageSquare, Castle } from "lucide-react"

export default function DuniaFooter() {
  return (
    <footer className="border-t border-[#5A1827]/12 bg-[#FAF7F2] text-[#3D2E30]">
      <div className="mx-auto max-w-[1380px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Coluna Marca */}
          <div className="space-y-4 md:col-span-4">
            <Link href="/" aria-label="Dúnia City Hall" className="inline-flex items-center rounded-xl bg-[#120B08] px-3.5 py-1.5 border border-[#BD9463]/40 shadow-sm transition hover:scale-[1.02]">
              <Image
                src="/images/dunia/logo-dunia-hd.png"
                alt="Dúnia City Hall"
                width={180}
                height={60}
                className="h-8 w-auto object-contain"
              />
            </Link>
            <p className="text-xs leading-relaxed text-[#5C4D4C] max-w-xs">
              O salão de festas mais elegante de Brasília. Desde 2008 transformando sonhos em momentos inesquecíveis no Lago Sul.
            </p>
            <div className="pt-2 text-xs text-[#201215]">
              <span className="font-semibold text-[#5A1827]">2.500 m² de Área Nobre</span> • Até 1.200 Convidados
            </div>
          </div>

          {/* Coluna Celebrações */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A1827]">Celebrações</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/casamento" className="hover:text-[#5A1827] transition">Casamentos dos Sonhos</Link>
              </li>
              <li>
                <Link href="/debutante" className="hover:text-[#5A1827] transition">Debutantes & 15 Anos</Link>
              </li>
              <li>
                <Link href="/corporativo" className="hover:text-[#5A1827] transition">Eventos Corporativos</Link>
              </li>
              <li>
                <Link href="/embaixadas" className="hover:text-[#5A1827] transition">Embaixadas & Diplomacia</Link>
              </li>
              <li>
                <Link href="/buffet" className="hover:text-[#5A1827] transition">Buffet Dúnia Autoral</Link>
              </li>
              <li>
                <Link href="/jardim" className="hover:text-[#5A1827] transition">Jardim & Áreas Verdes</Link>
              </li>
            </ul>
          </div>

          {/* Coluna O Salão Dúnia (Institucional Light) */}
          <div className="space-y-3 md:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A1827]">O Salão Dúnia</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/admin/experiencias" className="hover:text-[#5A1827] font-semibold transition">Central do Salão ↗</Link>
              </li>
              <li>
                <Link href="/sobre" className="hover:text-[#5A1827] transition">Sobre a Estrutura (2.500 m²)</Link>
              </li>
              <li>
                <Link href="/#film" className="hover:text-[#5A1827] transition">Galeria 35mm</Link>
              </li>
              <li>
                <Link href="/#journal" className="hover:text-[#5A1827] transition">Revista Dúnia</Link>
              </li>
              <li>
                <Link href="/painel" className="hover:text-[#5A1827] transition">Painel Administrativo</Link>
              </li>
            </ul>
          </div>

          {/* Coluna Contato */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#5A1827]">Concierge VIP</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#5A1827] mt-0.5" />
                <span>SHIS QI 15 - Lago Sul, Brasília - DF, 71635-200</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#5A1827]" />
                <a href="tel:5561974017544" className="hover:text-[#5A1827] transition">(61) 97401-7544</a>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 shrink-0 text-[#5A1827]" />
                <a
                  href="https://wa.me/5561974017544?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20no%20D%C3%BAnia%20City%20Hall."
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#5A1827] hover:underline"
                >
                  WhatsApp Orçamentos VIP
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Linha Final */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#5A1827]/10 pt-6 text-[0.7rem] sm:flex-row text-[#5C4D4C]">
          <p>© {new Date().getFullYear()} Dúnia City Hall. Todos os direitos reservados.</p>
          <p className="text-[#5A1827] font-medium">Brasília • Lago Sul • Tradição e Elegância desde 2008</p>
        </div>
      </div>
    </footer>
  )
}
