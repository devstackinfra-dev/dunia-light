import { BRAND } from "@/config/brand"
import { cn } from "@/lib/utils"

function iniciais(nome: string): string {
  const partes = nome
    .split(/\s+/)
    .filter((p) => p.length > 2 && !/^(advocacia|advogados?|associados|sociedade|de|da|do|e|dr|dra)$/i.test(p))
  return (partes[0]?.[0] ?? "") + (partes[1]?.[0] ?? "")
}

interface RetratoProps {
  src?: string
  plaqueta?: boolean
  className?: string
  prioridade?: boolean
  /** Sobrepõem o nome e o registro das variáveis de ambiente (ex.: perfil do banco) */
  nome?: string
  registro?: string
}

/**
 * Retrato institucional de prestígio: moldura deslocada em latão/dourado,
 * sombra difusa e plaqueta de identificação com OAB.
 */
export function Retrato({ src, plaqueta = true, className, prioridade, nome: nomeProp, registro: registroProp }: RetratoProps) {
  const nome = nomeProp || BRAND.professional.name || BRAND.name
  const registro = registroProp ?? BRAND.professional.registration

  return (
    <figure className={cn("relative w-full max-w-[24rem]", className)}>
      <div className="relative">
        {/* Moldura deslocada em latão refinado */}
        <div
          aria-hidden
          className="absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border-2 border-marca-latao/40 md:translate-x-5 md:translate-y-5"
        />

        {/* Recipiente da Foto */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-marca-painel shadow-2xl border border-white/10">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`Retrato de ${nome}`}
              loading={prioridade ? "eager" : "lazy"}
              className="h-full w-full object-cover object-top filter brightness-[1.02] contrast-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-marca-tinta to-marca-painel">
              <span className="font-titulo text-8xl text-marca-latao/80">{iniciais(nome) || "§"}</span>
            </div>
          )}

          {/* Gradiente sutil na base da foto para contraste */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-marca-tinta/90 via-marca-tinta/30 to-transparent" />
          {/* Sem selo de "referência" sobre a foto: autoelogio é vedado pelo
              Provimento 205/2021 (art. 3º, IV) e apareceria para todo cliente. */}
        </div>
      </div>

      {plaqueta && (
        <figcaption className="relative mt-7 rounded-xl border-l-4 border-marca-latao bg-marca-painel/95 px-6 py-4 shadow-xl backdrop-blur-md border border-white/10">
          <span className="block font-titulo text-xl font-normal text-white">{nome}</span>
          {registro && (
            <span className="mt-1 block text-xs font-semibold uppercase tracking-[0.16em] text-marca-latao">
              {registro}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  )
}
