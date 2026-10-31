import Image from "next/image"
import { BRAND } from "@/config/brand"
import { cn } from "@/lib/utils"

const logoClaro = process.env.NEXT_PUBLIC_BRAND_LOGO_LIGHT || BRAND.assets.logoLight || ""
const logoPadrao = process.env.NEXT_PUBLIC_BRAND_LOGO || BRAND.assets.logo || ""

// SVG não passa pelo otimizador de imagens do Next (que recusa SVG por segurança)
const ehSvg = (src: string) => /\.svg(\?|$)/i.test(src)

export function BrandLogo({ className, priority }: { className?: string; priority?: boolean }) {
  if (logoClaro) {
    return (
      <Image
        src={logoClaro}
        alt={BRAND.name}
        width={200}
        height={40}
        priority={priority}
        unoptimized={ehSvg(logoClaro)}
        className={cn("h-8 w-auto object-contain sm:h-9", className)}
      />
    )
  }

  if (logoPadrao) {
    return (
      <span className={cn("inline-flex rounded-sm bg-white px-3 py-1.5", className)}>
        <Image
          src={logoPadrao}
          alt={BRAND.name}
          width={160}
          height={40}
          priority={priority}
          unoptimized={ehSvg(logoPadrao)}
          className="h-8 w-auto object-contain"
        />
      </span>
    )
  }

  // Sem logo: monograma com a inicial, em vez da balança (clichê da advocacia)
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center border border-marca-latao/60 font-titulo text-lg text-marca-latao sm:h-9 sm:w-9">
        {BRAND.name.trim().charAt(0)}
      </span>
      <span className="font-titulo text-lg font-medium leading-tight tracking-tight text-white sm:text-2xl">
        {BRAND.name}
      </span>
    </span>
  )
}
