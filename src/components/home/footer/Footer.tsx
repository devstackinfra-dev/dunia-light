"use client"

import Link from "next/link"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react"
import { BRAND } from "@/config/brand"
import { BrandLogo } from "@/components/home/shared/BrandLogo"
import { useHome, useNavegacao } from "@/components/home/shared/ConteudoProvider"

/** Rodapé: tudo vem da marca (`brand.ts`) e das seções ligadas — nada fixo de cliente. */
export function Footer() {
  // Textos deste cliente (banco) sobre o padrão da vertical
  const HOME = useHome()
  const HOME_NAV = useNavegacao()
  const { phone, email, address } = BRAND.contact
  const { name: profissional, registration } = BRAND.professional
  const redes = [
    { href: BRAND.social.instagram, label: "Instagram", Icone: Instagram },
    { href: BRAND.social.facebook, label: "Facebook", Icone: Facebook },
    { href: (BRAND.social as any).youtube || "", label: "YouTube", Icone: Youtube },
    { href: BRAND.social.linkedin, label: "LinkedIn", Icone: Linkedin },
  ].filter((r) => r.href)
  const temContato = Boolean(phone || email || address)

  return (
    <footer className="border-t border-white/10 bg-marca-tinta py-20 text-slate-400">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="space-y-5 md:col-span-5">
            <BrandLogo />
            <p className="max-w-sm text-sm leading-relaxed text-slate-400">{HOME.footer.about}</p>
            {(profissional || registration) && (
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-marca-latao">
                {[profissional, registration].filter(Boolean).join(" · ")}
              </p>
            )}
            {redes.length > 0 && (
              <div className="flex gap-2.5 pt-2">
                {redes.map(({ href, label, Icone }) => (
                  <Link
                    key={label}
                    href={href}
                    target="_blank"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition-all hover:border-marca-latao/60 hover:text-marca-latao hover:scale-105"
                  >
                    <Icone className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {temContato && (
            <div className="space-y-5 md:col-span-4">
              <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-marca-latao">Contato</h4>
              <ul className="space-y-3 text-sm">
                {address && (
                  <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-marca-latao" /><span className="text-white/85">{address}</span></li>
                )}
                {phone && (
                  <li className="flex items-center gap-3"><Phone className="h-4 w-4 shrink-0 text-marca-latao" /><span className="text-white/85">{phone}</span></li>
                )}
                {email && (
                  <li className="flex items-center gap-3"><Mail className="h-4 w-4 shrink-0 text-marca-latao" /><span className="text-white/85">{email}</span></li>
                )}
              </ul>
            </div>
          )}

          <div className="space-y-5 md:col-span-3">
            <h4 className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-marca-latao">Navegação</h4>
            <ul className="space-y-2.5 text-sm">
              {HOME_NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {BRAND.legalName}. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/privacidade" className="hover:text-white">Política de privacidade</Link>
            <Link href="/login" className="hover:text-white">Área restrita</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
