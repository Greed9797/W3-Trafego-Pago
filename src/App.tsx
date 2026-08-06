import { useEffect, useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { BlogPage } from '@/components/BlogPage'
import { Hero } from '@/components/Hero'
import { Methodology } from '@/components/Methodology'
import { Stats } from '@/components/Stats'
import { Testimonials } from '@/components/Testimonials'
import { SuccessCases } from '@/components/SuccessCases'
import { Faq } from '@/components/Faq'
import { CtaBand } from '@/components/CtaBand'
import { LeadForm } from '@/components/LeadForm'
import { CtaFooter } from '@/components/CtaFooter'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { updateDocumentMetadata } from '@/lib/seo'

function isBlogPath(pathname: string) {
  return pathname === '/blog' || pathname.startsWith('/blog/')
}

export default function App() {
  const [pathname] = useState(() => window.location.pathname)

  useEffect(() => {
    updateDocumentMetadata(pathname)
  }, [pathname])

  useEffect(() => {
    if (isBlogPath(pathname)) return

    gsap.config({ nullTargetWarn: false })

    // Recalcula posições dos triggers depois que fontes/imagens assentam o layout
    const refresh = () => ScrollTrigger.refresh()
    const id = window.setTimeout(refresh, 300)
    window.addEventListener('load', refresh)

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('load', refresh)
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [pathname])

  if (isBlogPath(pathname)) {
    return <BlogPage pathname={pathname} />
  }

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Methodology />
        <CtaBand
          eyebrow="Vamos conversar"
          title="Pronto para transformar seu tráfego em vendas?"
        />
        <Stats />
        <Testimonials />
        <SuccessCases />
        <CtaBand
          eyebrow="Sem enrolação"
          title="Peça seu diagnóstico gratuito agora"
          cta="Falar com especialista"
        />
        <Faq />
        <LeadForm />
        <CtaFooter />
      </main>
    </div>
  )
}
