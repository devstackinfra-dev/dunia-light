import { cn } from "@/lib/utils"

export type Tom = "escuro" | "claro"

interface SectionHeaderProps {
  badge: string
  title: string
  subtitle?: string
  align?: "center" | "left"
  /** Fundo da faixa onde o cabeçalho está: muda as cores do texto. */
  tom?: Tom
}

/**
 * Rótulo com § — o sinal de parágrafo dos códigos — marcando cada seção, como
 * num texto legal. É a assinatura visual do site; nas outras verticais o mesmo
 * marcador funciona como um simples indicador de seção.
 */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-marca-latao", className)}>
      <span aria-hidden className="font-titulo text-base normal-case leading-none tracking-normal">§</span>
      {children}
    </p>
  )
}

/** Rótulo, título e subtítulo no padrão das seções da home. */
export function SectionHeader({ badge, title, subtitle, align = "left", tom = "escuro" }: SectionHeaderProps) {
  return (
    <div className={cn("mb-14 max-w-2xl", align === "center" && "mx-auto text-center")}>
      <Eyebrow className={cn("mb-5", align === "center" && "justify-center")}>{badge}</Eyebrow>
      <h2
        className={cn(
          "font-titulo text-3xl font-normal leading-[1.12] md:text-5xl",
          tom === "escuro" ? "text-white" : "text-marca-tinta"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={cn("mt-5 text-base leading-relaxed md:text-lg", tom === "escuro" ? "text-marca-nevoa" : "text-slate-600")}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
