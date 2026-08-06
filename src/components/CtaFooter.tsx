import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SplitHeading } from './SplitHeading'
import { CTA_HREF } from '@/lib/constants'
import logoW3 from '@/assets/logo-w3.svg'

export function CtaFooter() {
  return (
    <>
      <section className="relative py-20 md:py-32 overflow-hidden" data-section="cta">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,hsl(25_95%_53%_/_0.25),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,hsl(var(--background))_100%)]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-5">
          <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">Próximo passo</span>
          <SplitHeading
            text="Pronto para escalar suas vendas?"
            className="mt-4 md:mt-6 font-display font-bold text-[clamp(36px,8vw,110px)] leading-[0.9] tracking-[-0.03em]"
          />
          <p className="mt-6 md:mt-8 font-body text-sm md:text-lg text-foreground/65 max-w-xl mx-auto">
            Fale com nosso time hoje. Diagnóstico gratuito do seu tráfego em até 24 horas.
          </p>
          <div className="mt-8 md:mt-12 flex items-center justify-center gap-3 md:gap-4 flex-wrap">
            <Button variant="hero" asChild>
              <a href={CTA_HREF}>
                <MessageCircle className="mr-2 size-4" /> Falar com Especialista
              </a>
            </Button>
            <Button variant="heroGlass" asChild>
              <a href="#metodologia">Nossa metodologia</a>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/30 py-6 md:py-8">
        <div className="max-w-[var(--max)] mx-auto px-5 md:px-[var(--gutter)] flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
          <img src={logoW3} alt="W3 Tráfego Pago" width={195} height={26} className="h-5 md:h-6 w-auto opacity-70" />
          <span className="font-body text-[10px] md:text-xs text-foreground/60">© 2026 W3 Tráfego Pago. Todos os direitos reservados.</span>
          <nav className="flex gap-4 md:gap-6">
            {[
              { label: "Blog", href: "/blog" },
              { label: "W3 Pagamentos", href: "#" },
              { label: "Quem Somos", href: "https://w3ecommerce.com.br/" },
            ].map(l => (
              <a
                key={l.label}
                href={l.href}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="font-body text-[10px] md:text-xs text-foreground/60 hover:text-foreground/90 transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </>
  )
}
