"use client"

import Link from "next/link"
import { MessageSquare, HelpCircle } from "lucide-react"
import { BRAND, whatsappLink } from "@/config/brand"
import { SectionHeader } from "@/components/home/shared/SectionHeader"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useHome } from "@/components/home/shared/ConteudoProvider"

/**
 * Seção de Perguntas Frequentes com design de cartões independentes e estilo editorial.
 */
export function FAQ() {
  // Textos deste cliente (banco) sobre o padrão da vertical
  const HOME = useHome()
  const { badge, title, subtitle, items } = HOME.faq

  return (
    <section id="faq" className="relative w-full scroll-mt-24 bg-marca-papel py-20 lg:py-28">
      <div className="container mx-auto grid items-start gap-12 px-6 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-5">
          <SectionHeader badge={badge} title={title} subtitle={subtitle} tom="claro" align="left" />
          
          {BRAND.contact.whatsapp && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2 text-marca-latao text-xs font-bold uppercase tracking-wider mb-2">
                <HelpCircle className="h-4 w-4" />
                <span>Não encontrou sua dúvida?</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Cada caso possui peculiaridades jurídicas. Fale diretamente com a equipe para uma análise individual.
              </p>
              <Link
                href={whatsappLink("Olá! Gostaria de esclarecer uma dúvida que não encontrei no site.")}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-xs font-bold text-white transition-all hover:bg-marca-latao hover:text-marca-tinta w-full"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Conversar pelo WhatsApp
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <Accordion type="single" collapsible className="space-y-3">
            {items.map((item, idx) => (
              <AccordionItem
                key={item.q}
                value={`item-${idx}`}
                className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white px-6 shadow-sm transition-all hover:border-marca-latao/40"
              >
                <AccordionTrigger className="py-5 text-left font-titulo text-lg font-medium text-slate-900 hover:text-marca-tinta hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-xs sm:text-sm leading-relaxed text-slate-600">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
