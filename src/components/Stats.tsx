import { SplitHeading } from './SplitHeading'
import { CountUp } from './CountUp'

const STATS = [
  { value: 200, prefix: "+R$", suffix: "M", label: "Gerados com anúncios", decimals: 0 },
  { value: 100, prefix: "+", suffix: "", label: "Clientes satisfeitos", decimals: 0 },
  { value: 20, prefix: "+", suffix: "", label: "Nichos atendidos", decimals: 0 },
]

export function Stats() {
  return (
    <section id="resultados" className="relative py-16 md:py-24 overflow-hidden bg-background" data-section="stats">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,hsl(25_95%_53%_/_0.12),transparent_70%)]" />
      <div className="orange-line absolute top-0 left-0 right-0" />
      <div className="orange-line absolute bottom-0 left-0 right-0" />

      <div className="relative z-10 max-w-[var(--max)] mx-auto px-5 md:px-[var(--gutter)]">
        <div className="text-center mb-10 md:mb-16">
          <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">Números Reais</span>
          <SplitHeading text="Resultados que falam por si" className="mt-3 md:mt-4 font-display font-bold text-3xl md:text-4xl lg:text-6xl tracking-tight" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="font-display font-bold text-3xl md:text-5xl lg:text-7xl leading-none text-foreground mb-2">
                <span className="text-primary">{s.prefix}</span>
                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <div className="font-body text-[11px] md:text-sm text-foreground/55">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
