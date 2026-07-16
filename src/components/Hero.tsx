import { useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import SplitType from 'split-type'
import { Button } from '@/components/ui/button'
import dashboardW3 from '@/assets/dashboard-w3.webp'
import { gsap } from '@/lib/gsap'
import { CTA_HREF } from '@/lib/constants'

const STATS = [
  { value: "+R$200M", label: "Gerados com anúncios" },
  { value: "+100", label: "Clientes satisfeitos" },
  { value: "+20", label: "Nichos atendidos" },
]

const PARTNERS = ["Meta Ads", "Google Ads"]

export function Hero() {
  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 })
    let split: SplitType | null = null

    gsap.set('.hero-shot', { y: 40, rotateX: 12, transformPerspective: 1400, transformOrigin: 'center top' })

    const headlineEl = document.querySelector('.hero-headline')
    if (headlineEl) {
      split = new SplitType(headlineEl as HTMLElement, { types: 'chars,words' })
      tl.from(split.chars, {
        opacity: 0,
        yPercent: 100,
        rotateX: -30,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.018,
      })
    }

    tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      // LCP: hero-sub nunca fica opacity-0 — só desliza (texto pintado no primeiro paint)
      .from('.hero-sub', { y: 16, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .to('.hero-ctas', { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to('.hero-stats', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .to('.hero-shot', { opacity: 1, y: 0, rotateX: 0, duration: 0.9, ease: 'power3.out' }, '-=0.35')

    return () => {
      tl.kill()
      split?.revert()
    }
  }, [])

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-background" data-section="hero">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(25_95%_53%_/_0.18),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-5 pt-24 pb-10 md:pt-32 md:pb-20 max-w-5xl mx-auto">
        <div className="hero-badge liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 mb-6 md:mb-8 inline-flex items-center gap-2 opacity-0">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-body text-[10px] md:text-xs text-foreground/80 tracking-wide uppercase">Agência parceira Meta · Google</span>
        </div>

        <h1 className="hero-headline font-display font-bold text-[clamp(36px,7vw,104px)] leading-[0.95] tracking-[-0.03em] text-foreground max-w-[18ch] mb-4 md:mb-6">
          Seu e-commerce vendendo todos os dias
        </h1>

        <p className="hero-sub font-body text-sm md:text-lg text-foreground/65 max-w-2xl leading-relaxed mb-8 md:mb-10">
          Gerenciamos seus anúncios com estrutura milionária, validada em +100 e-commerces de todos os nichos. Você foca no produto, a gente traz o cliente.
        </p>

        <div className="hero-ctas flex items-center gap-3 md:gap-4 flex-wrap justify-center opacity-0">
          <Button variant="hero" asChild>
            <a href={CTA_HREF} target="_blank" rel="noopener noreferrer">
              Quero mais vendas <ArrowUpRight className="ml-1.5 size-4" />
            </a>
          </Button>
          <Button variant="heroGlass" asChild>
            <a href="#metodologia">Ver nossa metodologia</a>
          </Button>
        </div>
      </div>

      <div className="hero-stats relative z-10 w-full max-w-4xl mx-auto px-5 pb-10 md:pb-16 opacity-0">
        <div className="liquid-glass rounded-2xl p-4 md:p-6 grid grid-cols-3 gap-3 md:gap-6 divide-x divide-border/40">
          {STATS.map((s, i) => (
            <div key={i} className="text-center px-2 md:px-4">
              <div className="font-display font-bold text-xl md:text-3xl lg:text-4xl text-primary leading-none mb-1">{s.value}</div>
              <div className="font-body text-[10px] md:text-xs text-foreground/55">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-shot relative z-10 w-full max-w-5xl mx-auto px-5 pb-12 md:pb-20 opacity-0">
        <div className="relative liquid-glass rounded-xl md:rounded-2xl p-1.5 md:p-2 orange-glow">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
            <span className="w-2.5 h-2.5 rounded-full bg-primary/60" />
          </div>
          <div className="rounded-lg md:rounded-xl border border-border/40 overflow-hidden">
            <img
              src={dashboardW3}
              alt="Painel de relatórios da W3 com faturamento, valor investido, custo de mídia e vendas por estado"
              width={1600}
              height={683}
              className="w-full h-auto block"
            />
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="relative z-10 w-full pb-8 md:pb-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex animate-[marquee_32s_linear_infinite] gap-8 md:gap-12 w-max">
          {Array(8).fill(PARTNERS).flat().map((p, i) => (
            <span key={i} className="font-display font-semibold text-base md:text-xl text-foreground/30 whitespace-nowrap tracking-tight">{p}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
