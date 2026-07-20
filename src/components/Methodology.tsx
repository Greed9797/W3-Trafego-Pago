import { useEffect } from 'react'
import { gsap } from '@/lib/gsap'
import { SplitHeading } from './SplitHeading'
import metodologia1 from '@/assets/metodologia-1.webp'
import metodologia2 from '@/assets/metodologia-2.webp'
import metodologia3 from '@/assets/metodologia-3.webp'
import metodologia4 from '@/assets/metodologia-4.webp'

const REASONS = [
  { image: metodologia1, title: "Planejamento", body: "Analisamos os números do seu negócio: tráfego, site, concorrentes, comportamento do cliente. E transformamos tudo em um plano de ação claro. Você entende onde está perdendo dinheiro e o que precisa ajustar para crescer de forma previsível." },
  { image: metodologia2, title: "Execução de Alta Performance", body: "Criamos cada campanha com base em nossas estruturas milionárias, validadas em e-commerces de diversos nichos. Da segmentação ao criativo, tudo é planejado e adaptado para funcionar nas individualidades do seu negócio." },
  { image: metodologia3, title: "Organização", body: "Usamos sistemas e relatórios simples para acompanhar cada campanha, resultado e investimento. Assim, você tem clareza total sobre o retorno de cada real investido e transparência dos resultados." },
  { image: metodologia4, title: "Relacionamento", body: "Na W3, você não fica no escuro. Nosso time te acompanha de perto todos os dias, com análises e ajustes constantes. A nossa média de tempo de resposta no WhatsApp é menos de 10 minutos!" },
]

const PROCESS_STEPS = [
  { n: "01", title: "Diagnóstico Gratuito", body: "Entendemos o cenário do seu e-commerce, identificamos os gargalos que impedem seu crescimento e mapeamos as oportunidades reais de escala." },
  { n: "02", title: "Estratégia e Onboarding", body: "Montamos o plano de escala, estruturamos as campanhas do zero ou reestruturamos o que existe, auditamos seu site, frete, configurações e todo o necessário para você vender muito sem se preocupar." },
  { n: "03", title: "Gestão e Otimização", body: "Rodamos, medimos e otimizamos com acompanhamento próximo e ajustes constantes. Escalamos o que funciona, cortamos o que não converte." },
]

export function Methodology() {
  useEffect(() => {
    const cards = gsap.utils.toArray('.reason-card')
    gsap.from(cards, {
      opacity: 0,
      yPercent: 30,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.1,
      scrollTrigger: {
        trigger: '.reasons-grid',
        start: 'top 75%',
      },
    })

    const steps = gsap.utils.toArray('.process-step')
    gsap.from(steps, {
      opacity: 0,
      yPercent: 30,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.12,
      scrollTrigger: {
        trigger: '.process-grid',
        start: 'top 75%',
      },
    })

    gsap.from('.orange-line', {
      scaleX: 0,
      transformOrigin: 'left center',
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.orange-line', start: 'top 90%' },
    })
  }, [])

  return (
    <section id="metodologia" className="relative py-16 md:py-24 bg-background" data-section="methodology">
      <div className="max-w-[var(--max)] mx-auto px-5 md:px-[var(--gutter)]">
        <div className="text-center mb-10 md:mb-16">
          <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">Por que a W3</span>
          <SplitHeading text="Nossa metodologia é baseada em 4 pilares principais" className="mt-3 md:mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-3xl mx-auto" />
        </div>

        <div className="reasons-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mt-10 md:mt-16">
          {REASONS.map((r, i) => (
            <div key={i} className="reason-card liquid-glass rounded-2xl overflow-hidden flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={r.image} alt={r.title} width={700} height={525} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              </div>
              <div className="p-5 md:p-6 flex flex-col gap-2.5 md:gap-3 -mt-8 relative">
                <span className="font-display font-bold text-3xl md:text-4xl text-primary leading-none select-none">{`//${String(i + 1).padStart(2, '0')}`}</span>
                <h3 className="font-display font-bold text-lg md:text-xl tracking-tight">{r.title}</h3>
                <p className="font-body text-xs md:text-sm text-foreground/60 leading-relaxed">{r.body}</p>
                <div className="mt-auto pt-1 h-px w-12 bg-gradient-to-r from-primary to-transparent" />
              </div>
            </div>
          ))}
        </div>

        <div id="como-funciona" className="mt-16 md:mt-24">
          <div className="text-center mb-10 md:mb-16">
            <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">Como Funciona</span>
            <SplitHeading text="Do diagnóstico à escala" className="mt-3 md:mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight" />
          </div>

          <div className="process-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className={`process-step liquid-glass rounded-2xl p-6 md:p-7 flex flex-col gap-3 min-h-[280px] md:min-h-[320px] ${i === 2 ? 'orange-glow' : ''}`}>
                <span className={`font-display font-bold text-5xl md:text-6xl leading-none select-none ${i === 2 ? 'text-primary' : 'text-primary/20'}`}>{step.n}</span>
                <h3 className="font-display font-bold text-lg md:text-xl tracking-tight leading-snug">{step.title}</h3>
                <p className="font-body text-xs md:text-sm text-foreground/60 leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
