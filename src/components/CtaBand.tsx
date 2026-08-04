import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CTA_HREF } from '@/lib/constants'

interface CtaBandProps {
  eyebrow?: string
  title: string
  cta?: string
}

/** Faixa de CTA reutilizável pro miolo da página. Abre o formulário (#diagnostico). */
export function CtaBand({ eyebrow, title, cta = 'Quero meu diagnóstico' }: CtaBandProps) {
  return (
    <section className="relative py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-5">
        <div className="liquid-glass relative overflow-hidden rounded-[24px] px-6 py-9 md:px-12 md:py-12 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_0%,hsl(25_95%_53%_/_0.12),transparent_70%)]" />
          <div className="relative z-10">
            {eyebrow && (
              <span className="font-body text-[10px] md:text-xs font-medium uppercase tracking-widest text-primary/80">
                {eyebrow}
              </span>
            )}
            <h2 className="mt-3 font-display font-bold text-[clamp(24px,4.5vw,42px)] leading-[1.05] tracking-[-0.02em] text-foreground">
              {title}
            </h2>
            <Button variant="hero" asChild className="mt-7">
              <a href={CTA_HREF}>
                {cta} <ArrowRight className="ml-2 size-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
