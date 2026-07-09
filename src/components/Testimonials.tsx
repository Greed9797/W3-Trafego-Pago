import { useEffect } from 'react'
import { HelpCircle, MessageCircle } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { SplitHeading } from './SplitHeading'
import { Button } from '@/components/ui/button'
import { CTA_HREF } from '@/lib/constants'

// Copy real do site w3trafegopago.com.br (seção "Você já se perguntou...")
const QUESTIONS = [
  'Se os seus anúncios estão realmente entregando todo o potencial do seu e-commerce?',
  'Se o maior gargalo está no tráfego… ou em algo dentro do seu site?',
  'Por que o seu concorrente consegue mais resultado que você?',
]

export function Testimonials() {
  useEffect(() => {
    gsap.from('.ask-card', {
      opacity: 0,
      y: 40,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: { trigger: '.ask-grid', start: 'top 78%' },
    })
  }, [])

  return (
    <section
      id="depoimentos"
      className="relative py-16 md:py-24 bg-background overflow-hidden"
      data-section="testimonials"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_60%,hsl(25_95%_53%_/_0.1),transparent_70%)]" />

      <div className="relative z-10 max-w-[var(--max)] mx-auto px-5 md:px-[var(--gutter)]">
        <div className="text-center mb-10 md:mb-16">
          <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">
            Diagnóstico
          </span>
          <SplitHeading
            text="Você já se perguntou…"
            className="mt-3 md:mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight"
          />
        </div>

        <div className="ask-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {QUESTIONS.map((q, i) => (
            <div
              key={i}
              className="ask-card liquid-glass rounded-2xl p-6 md:p-7 flex flex-col gap-4 min-h-[180px]"
            >
              <div className="liquid-glass rounded-full w-10 h-10 flex items-center justify-center">
                <HelpCircle className="size-5 text-primary" />
              </div>
              <p className="font-body text-base md:text-lg text-foreground/85 leading-relaxed">{q}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 md:mt-6 liquid-glass rounded-2xl p-7 md:p-10 text-center orange-glow">
          <p className="font-display font-bold text-xl md:text-3xl tracking-tight text-foreground leading-snug max-w-3xl mx-auto">
            Então saiba: há grandes chances de existir um{' '}
            <span className="text-primary">ponto cego</span> no seu e-commerce.
          </p>
          <p className="mt-3 font-body text-sm md:text-base text-foreground/65 max-w-2xl mx-auto">
            Uma falha invisível na sua operação que faz você perder vendas e dinheiro. A gente encontra — e corrige.
          </p>
          <Button variant="hero" asChild className="mt-7">
            <a href={CTA_HREF} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 size-4" /> Quero meu diagnóstico
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
