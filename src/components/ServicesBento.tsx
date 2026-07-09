import { useEffect } from 'react'
import { Target, Search, BarChart2, Workflow } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { SplitHeading } from './SplitHeading'

const SERVICES = [
  { icon: Target, title: "Gestão de Meta Ads", body: "Campanhas de Facebook e Instagram com estruturas validadas em e-commerces de diversos nichos. Do criativo à segmentação, tudo otimizado para ROAS." },
  { icon: Search, title: "Google Ads para E-commerce", body: "Shopping, Performance Max e Search configurados para capturar intenção de compra no momento certo." },
  { icon: Workflow, title: "Funil Completo", body: "Topo, meio e fundo integrados. Nenhum lead perdido, nenhum remarketing esquecido." },
  { icon: BarChart2, title: "Relatórios e Inteligência", body: "Dashboard semanal com os números que importam: ROAS, CPA, receita atribuída. Sem jargão, com decisão." },
]

export function ServicesBento() {
  useEffect(() => {
    gsap.from('.service-card', {
      opacity: 0,
      y: 60,
      scale: 0.96,
      duration: 0.6,
      ease: 'power2.out',
      stagger: 0.08,
      scrollTrigger: {
        trigger: '.services-grid',
        start: 'top 75%',
      },
    })
  }, [])

  return (
    <section id="servicos" className="relative py-16 md:py-24 bg-background" data-section="services">
      <div className="max-w-[var(--max)] mx-auto px-5 md:px-[var(--gutter)]">
        <div className="text-center mb-10 md:mb-16">
          <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">Nossos Serviços</span>
          <SplitHeading text="Tudo que seu e-commerce precisa para escalar" className="mt-3 md:mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight max-w-3xl mx-auto" />
        </div>

        <div className="services-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {SERVICES.map((service, i) => {
            const Icon = service.icon
            return (
              <div
                key={i}
                className={`service-card liquid-glass rounded-2xl relative overflow-hidden group p-5 md:p-6 ${
                  i === 0 ? 'md:row-span-2 md:p-8 md:min-h-[480px]' : ''
                } ${i === 3 ? 'md:col-span-2' : ''}`}
              >
                <div className={`liquid-glass rounded-full flex items-center justify-center mb-3 md:mb-4 ${
                  i === 0 ? 'w-12 h-12 md:w-14 md:h-14' : 'w-9 h-9 md:w-10 md:h-10'
                }`}>
                  <Icon className={`text-primary ${i === 0 ? 'size-6 md:size-7' : 'size-4 md:size-5'}`} />
                </div>
                <h3 className={`font-display font-bold tracking-tight mb-2 ${
                  i === 0 ? 'text-xl md:text-2xl' : 'text-base md:text-lg'
                }`}>{service.title}</h3>
                <p className="font-body text-xs md:text-sm text-foreground/60 leading-relaxed">{service.body}</p>
                <div className="mt-auto h-px w-12 bg-gradient-to-r from-primary to-transparent absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
