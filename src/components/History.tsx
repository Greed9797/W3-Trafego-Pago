import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { SplitHeading } from './SplitHeading'

interface Milestone {
  tag: string
  title: string
  body: string
  highlight?: boolean
}

const MILESTONES: Milestone[] = [
  {
    tag: 'O método',
    title: 'Do zero ao topo vira método',
    body: 'A estrutura que levou uma operação real ao topo do e-commerce é sistematizada em um método replicável — para donos de e-commerce que já faturam e querem escalar com margem.',
    highlight: true,
  },
  {
    tag: '2024 · A origem',
    title: 'Nasce o Grupo W3',
    body: 'Fundado em Blumenau (SC) com um objetivo claro: ser o maior ecossistema de e-commerce do Brasil. Estrutura operacional de resultado, não de promessa.',
  },
  {
    tag: 'Ecossistema',
    title: 'Mais que tráfego: um ecossistema',
    body: 'Marketplace e mais de 30 especialistas em operação nacional, com sede física em Blumenau e time 100% presente.',
  },
  {
    tag: 'Tráfego pago',
    title: 'Nasce a W3 Tráfego Pago',
    body: 'Gestão de mídia ponta a ponta: custo controlado, escala sustentável, estrutura de funil e ROAS consistente. Não é apertar botões — é vender ponta a ponta.',
  },
  {
    tag: 'Hoje',
    title: 'O ecossistema que mais transforma e-commerces',
    body: 'Transformamos vidas através do e-commerce — previsibilidade, margem e liberdade estratégica. Com o W3 Labs, tecnologia própria a caminho.',
    highlight: true,
  },
]

const GAP = 20 // px, precisa casar com gap-5 do track

export function History() {
  const pinRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pin = pinRef.current
    const track = trackRef.current
    if (!pin || !track) return

    const ctx = gsap.context(() => {
      // Scroll horizontal fixado só no desktop (>=768px). Mobile usa swipe nativo.
      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px)', () => {
        const distance = () => track.scrollWidth - pin.offsetWidth
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pin,
            start: 'center center',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
      })
    }, pinRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="historia" className="relative py-16 md:py-24 bg-background overflow-hidden" data-section="history">
      <div className="max-w-[var(--max)] mx-auto px-5 md:px-[var(--gutter)]">
        <div className="text-center mb-10 md:mb-16">
          <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">
            Nossa história
          </span>
          <SplitHeading
            text="De uma operação real ao maior ecossistema de e-commerce do Brasil"
            className="mt-3 md:mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-3xl mx-auto"
          />
        </div>
      </div>

      {/* Viewport fixado — no desktop trava e desliza os cards na horizontal */}
      <div ref={pinRef} className="overflow-x-auto md:overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-5 px-5 md:px-[var(--gutter)] snap-x snap-mandatory md:snap-none"
          style={{ ['--gap' as string]: `${GAP}px` }}
        >
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              className={`milestone-card liquid-glass rounded-2xl p-6 md:p-7 flex flex-col gap-3 shrink-0 snap-start w-[78vw] sm:w-[calc((100%-var(--gap))/2)] md:w-[340px] lg:w-[calc((100vw-2*var(--gutter)-3*var(--gap))/4)] min-h-[320px] md:min-h-[360px] ${m.highlight ? 'orange-glow' : ''}`}
            >
              <span
                className={`font-display font-bold text-5xl md:text-6xl leading-none select-none ${m.highlight ? 'text-primary' : 'text-primary/20'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-body text-[10px] md:text-xs font-semibold uppercase tracking-widest text-primary">{m.tag}</span>
              <h3 className="font-display font-bold text-lg md:text-xl tracking-tight leading-snug">{m.title}</h3>
              <p className="font-body text-xs md:text-sm text-foreground/60 leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
