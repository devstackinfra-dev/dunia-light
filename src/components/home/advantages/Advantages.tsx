"use client"

import { HomeIcon } from "@/components/home/shared/HomeIcon"
import { SectionHeader } from "@/components/home/shared/SectionHeader"
import { useHome } from "@/components/home/shared/ConteudoProvider"

/** Diferenciais do negócio — textos em `home-content.ts`. */
export function Advantages() {
  // Textos deste cliente (banco) sobre o padrão da vertical
  const HOME = useHome()
  const { badge, title, subtitle, cards } = HOME.diferenciais

  return (
    <section id="diferenciais" className="relative w-full scroll-mt-24 bg-marca-tinta py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <SectionHeader badge={badge} title={title} subtitle={subtitle} />

        <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="border-t border-marca-latao/50 pt-6">
              <HomeIcon name={card.icon} className="mb-4 h-5 w-5 text-marca-latao" />
              <h3 className="font-titulo text-xl text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-marca-nevoa">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
