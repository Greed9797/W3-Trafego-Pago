import { useEffect } from 'react'
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
    tag: '2024 · A origem',
    title: 'Nasce o Grupo W3',
    body: 'Fundado em Blumenau (SC) com um objetivo claro: ser o maior ecossistema de e-commerce do Brasil. Estrutura operacional de resultado, não de promessa.',
  },
  {
    tag: 'O case-mãe',
    title: 'Ame Kids, o laboratório real',
    body: 'Cofundada por Leonardo Ames, chega ao 3º maior e-commerce de moda infantil do Brasil, com múltiplos 7 dígitos por ano. A operação validada na prática.',
  },
  {
    tag: 'O método',
    title: 'Do zero ao topo vira método',
    body: 'A estrutura que levou a Ame Kids ao topo é sistematizada no método AMES — replicável para donos de e-commerce que já faturam e querem escalar com margem.',
    highlight: true,
  },
  {
    tag: 'Tráfego pago',
    title: 'Nasce a W3 Tráfego Pago',
    body: 'Gestão de mídia ponta a ponta: custo controlado, escala sustentável, estrutura de funil e ROAS consistente. Não é apertar botões — é vender ponta a ponta.',
  },
  {
    tag: 'Ecossistema',
    title: 'Mais que tráfego: um ecossistema',
    body: 'Marketplace, Pagamentos (parceria Appmax) e mais de 30 especialistas em operação nacional, com sede física em Blumenau e time 100% presente.',
  },
  {
    tag: 'Hoje',
    title: 'O ecossistema que mais transforma e-commerces',
    body: 'Transformamos vidas através do e-commerce — previsibilidade, margem e liberdade estratégica. Com o W3 Labs, tecnologia própria a caminho.',
    highlight: true,
  },
]

export function History() {
  useEffect(() => {
    const cards = gsap.utils.toArray('.milestone-card')
    gsap.from(cards, {
      opacity: 0,
      yPercent: 20,
      duration: 0.5,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: { trigger: '.timeline-grid', start: 'top 80%' },
    })
  }, [])

  return (
    <section id="historia" className="relative py-16 md:py-24 bg-background" data-section="history">
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

        <div className="timeline-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
          {MILESTONES.map((m, i) => (
            <div
              key={i}
              className={`milestone-card liquid-glass rounded-2xl p-5 md:p-6 flex flex-col gap-3 ${m.highlight ? 'orange-glow' : ''}`}
            >
              <span
                className={`font-display font-bold text-4xl md:text-5xl leading-none select-none ${m.highlight ? 'text-primary' : 'text-primary/20'}`}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-body text-[10px] md:text-xs font-semibold uppercase tracking-widest text-primary">{m.tag}</span>
              <h3 className="font-display font-bold text-base md:text-lg tracking-tight leading-snug">{m.title}</h3>
              <p className="font-body text-xs md:text-sm text-foreground/60 leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
