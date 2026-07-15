import { useEffect } from 'react'
import { TrendingUp, Quote } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { SplitHeading } from './SplitHeading'
import rosaDoDeserto from '@/assets/clientes/rosa-do-deserto.png'
import soulHype from '@/assets/clientes/soul-hype.png'
import candyStore from '@/assets/clientes/candy-store.png'

interface SuccessCase {
  logo: string
  brand: string
  metric: string
  metricLabel: string
  quote: string
}

const CASES: SuccessCase[] = [
  {
    logo: rosaDoDeserto,
    brand: 'GM Rosa do Deserto',
    metric: '20k',
    metricLabel: 'por semana',
    quote: 'Não estamos nem dando conta do trabalho. Continuamos em crescimento — passamos a bater 20 mil por semana com o tráfego rodando.',
  },
  {
    logo: soulHype,
    brand: 'Soul Hype',
    metric: '3,8x',
    metricLabel: 'de ROI',
    quote: 'Reestruturaram todas as campanhas do zero. Hoje a gente escala com previsibilidade e sabe exatamente quanto cada real investido volta.',
  },
  {
    logo: candyStore,
    brand: 'Candy Store',
    metric: '+112%',
    metricLabel: 'em faturamento',
    quote: 'Saímos de vendas travadas para um crescimento constante. O acompanhamento diário e os ajustes de campanha mudaram o jogo.',
  },
]

export function SuccessCases() {
  useEffect(() => {
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
          {CASES.map((c, i) => (
            <div key={i} className="case-card liquid-glass rounded-2xl p-6 md:p-7 flex flex-col gap-5">
              <div className="flex items-center justify-between gap-4">
                <div className="bg-white/95 rounded-xl px-3 py-2 flex items-center justify-center h-12 md:h-14">
                  <img src={c.logo} alt={c.brand} className="max-h-8 md:max-h-10 w-auto object-contain" loading="lazy" />
                </div>
                <Quote className="size-6 text-primary/30 shrink-0" />
              </div>

              <div className="flex items-end gap-2">
                <span className="font-display font-bold text-4xl md:text-5xl text-primary leading-none">{c.metric}</span>
                <span className="font-body text-xs md:text-sm text-foreground/60 pb-1">{c.metricLabel}</span>
              </div>

              <p className="font-body text-sm md:text-base text-foreground/80 leading-relaxed">"{c.quote}"</p>

              <div className="mt-auto flex items-center gap-2 pt-2">
                <TrendingUp className="size-4 text-primary" />
                <span className="font-body text-xs md:text-sm font-medium text-foreground/70">{c.brand}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
