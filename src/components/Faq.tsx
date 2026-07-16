import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SplitHeading } from './SplitHeading'
import { CTA_HREF } from '@/lib/constants'

const FAQ_ITEMS = [
  { q: "Como começa o trabalho com a W3?", a: "Pelo planejamento. Analisamos os números do seu negócio — tráfego, site, concorrentes e comportamento do cliente — e transformamos tudo em um plano de ação claro antes de subir qualquer campanha." },
  { q: "Com quais plataformas vocês trabalham?", a: "Meta Ads (Facebook e Instagram) e Google Ads. As estruturas são montadas e adaptadas para o seu nicho e a realidade do seu e-commerce." },
  { q: "Como as campanhas são criadas?", a: "Com base em estruturas validadas em e-commerces de diversos nichos. Da segmentação ao criativo, tudo é planejado e adaptado para as individualidades do seu negócio." },
  { q: "Como acompanho os resultados?", a: "Com sistemas e relatórios simples para acompanhar cada campanha, resultado e investimento. Você tem clareza total sobre o retorno de cada real investido." },
  { q: "Vou ter acompanhamento de perto?", a: "Sim. Na W3 você não fica no escuro: nosso time acompanha de perto todos os dias, com análises e ajustes constantes." },
  { q: "Para que tipo de e-commerce a W3 é indicada?", a: "Para e-commerces que querem escalar com previsibilidade. Já são +100 clientes atendidos em +20 nichos, com +R$200 milhões gerados em anúncios." },
]

export function Faq() {
  return (
    <section id="faq" className="relative py-16 md:py-24 bg-background" data-section="faq">
      <div className="max-w-[var(--max)] mx-auto px-5 md:px-[var(--gutter)]">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 md:gap-16 items-start">
          <div className="md:sticky md:top-24">
            <span className="liquid-glass rounded-full px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-body uppercase tracking-widest text-foreground/60">Perguntas Frequentes</span>
            <SplitHeading text="Tire suas dúvidas" className="mt-3 md:mt-4 font-display font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight" />
            <p className="mt-4 md:mt-6 font-body text-sm md:text-base text-foreground/60 leading-relaxed">
              Encontre respostas para as perguntas mais comuns sobre nossos serviços e como podemos ajudar seu e-commerce a escalar.
            </p>
            <Button variant="hero" asChild className="mt-6 md:mt-8">
              <a href={CTA_HREF} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 size-4" />
                Falar com Especialista
              </a>
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-base md:text-lg">{item.q}</AccordionTrigger>
                <AccordionContent className="font-body text-xs md:text-sm text-foreground/60 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
