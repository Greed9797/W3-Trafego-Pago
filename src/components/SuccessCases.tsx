import { useEffect } from 'react'
import { TrendingUp, ArrowRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/reduceMotion'
import { SplitHeading } from './SplitHeading'
import rosaDoDeserto from '@/assets/clientes/rosa-do-deserto.png'
import theGregs from '@/assets/clientes/the-gregs.png'
import brArtes from '@/assets/clientes/br-artes.png'

interface SuccessCase {
  brand: string
  segment: string
  metric: string
  metricLabel: string
  /** Antes → depois extraído do painel do cliente. Omitido quando não há print. */
  evidence?: { from: string; to: string; period: string }
  logo?: string
}

// Dados da apresentação comercial da W3 — números reais dos painéis dos clientes.
const CASES: SuccessCase[] = [
  {
    brand: "The Greg's",
    segment: 'Perfumaria',
    metric: '39x',
    metricLabel: 'de crescimento de faturamento com anúncios',
    logo: theGregs,
  },
  {
    brand: 'GM Rosa do Deserto',
    segment: 'Flores',
    metric: '+R$ 200K',
    metricLabel: 'de faturamento mensal',
    evidence: { from: 'R$ 199.038,32', to: 'R$ 406.165,90', period: 'mai/25 → mai/26' },
    logo: rosaDoDeserto,
  },
  {
    brand: 'BR Artes Decor',
    segment: 'Quadros e decoração',
    metric: 'Triplicou',
    metricLabel: 'de faturamento em 2 meses',
    evidence: { from: 'R$ 14.770,63', to: 'R$ 67.424,68', period: 'abr/26 → jun/26' },
    logo: brArtes,
  },
]

export function SuccessCases() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    const cards = gsap.utils.toArray('.case-card')
    gsap.from(cards, {
      opacity: 0,
      yPercent: 25,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: { trigger: '.cases-grid', start: 'top 78%' },
    })
  }, [])

  return (
    <section id="casos" className="relative py-16 md:py-24 bg-background" data-section="success-cases">
      <div className="max-w-[var(--max)] mx-auto px-5 md:px-[var(--gutter)]">
        <div className="text-center mb-10 md:mb-16">
          <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">
            Casos de Sucesso
          </span>
          <SplitHeading
            text="Marcas que escalaram com a W3"
            className="mt-3 md:mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-3xl mx-auto"
          />
        </div>

        <div className="cases-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {CASES.map((c) => (
            <div key={c.brand} className="case-card liquid-glass rounded-2xl p-6 md:p-7 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-body text-[10px] md:text-xs font-semibold uppercase tracking-widest text-primary">
                  Case
                </span>
                {c.logo && (
                  <div className="bg-white/95 rounded-lg px-2 py-1.5 flex items-center justify-center">
                    <img src={c.logo} alt={c.brand} className="max-h-7 w-auto object-contain" loading="lazy" />
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-display font-bold text-lg md:text-xl tracking-tight leading-snug">{c.brand}</h3>
                <p className="font-body text-xs md:text-sm text-foreground/50">{c.segment}</p>
              </div>

              <div className="mt-1">
                <span className="font-display font-bold text-4xl md:text-5xl text-primary leading-none">{c.metric}</span>
                <p className="mt-2 font-body text-xs md:text-sm text-foreground/70 leading-relaxed">{c.metricLabel}</p>
              </div>

              {c.evidence && (
                <div className="mt-auto pt-4 border-t border-border/40">
                  <div className="flex items-center gap-2 font-body text-xs md:text-sm">
                    <span className="text-foreground/45 line-through decoration-foreground/25">{c.evidence.from}</span>
                    <ArrowRight className="size-3.5 text-primary shrink-0" />
                    <span className="text-foreground font-semibold">{c.evidence.to}</span>
                  </div>
                  <span className="mt-1 block font-body text-[10px] md:text-xs text-foreground/40">{c.evidence.period}</span>
                </div>
              )}

              {!c.evidence && (
                <div className="mt-auto pt-4 border-t border-border/40 flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  <span className="font-body text-xs md:text-sm text-foreground/60">Crescimento com tráfego pago</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
