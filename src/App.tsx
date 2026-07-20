import { useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Methodology } from '@/components/Methodology'
import { Stats } from '@/components/Stats'
import { Testimonials } from '@/components/Testimonials'
import { SuccessCases } from '@/components/SuccessCases'
import { Faq } from '@/components/Faq'
import { CtaFooter } from '@/components/CtaFooter'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function App() {
  useEffect(() => {
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
  }, [])

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Methodology />
        <Stats />
        <Testimonials />
        <SuccessCases />
        <Faq />
        <CtaFooter />
      </main>
    </div>
  )
}
