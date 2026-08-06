import { useEffect, useRef, useState } from 'react'
import { MessageCircle, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { BRAND_NAME, CTA_HREF } from '@/lib/constants'
import logoW3 from '@/assets/logo-w3.svg'

const NAV_ITEMS = [
  { label: "Metodologia", href: "#metodologia" },
  { label: "Resultados", href: "#resultados" },
  { label: "Diagnóstico", href: "#depoimentos" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
]

export function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // anima o pill interno (não o <nav>, que é centralizado via transform)
      gsap.fromTo(
        '.nav-pill',
        { y: -80, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out', delay: 0.5 }
      )

      ScrollTrigger.create({
        start: 'top -60px',
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      })
    }, navRef)

    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={navRef}
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[min(1200px,calc(100vw-32px))] transition-all duration-300 ${
        scrolled ? 'top-2' : 'top-4'
      }`}
    >
      <div className={`nav-pill liquid-glass rounded-full px-3 py-2 flex items-center justify-between ${
        scrolled ? 'backdrop-blur-xl' : ''
      }`}>
        <a href="/" className="flex items-center shrink-0 px-2" aria-label={`${BRAND_NAME} — início`}>
          <img src={logoW3} alt={BRAND_NAME} width={195} height={26} className="h-4 md:h-5 w-auto" />
        </a>

        <nav aria-label="Seções da página" className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-foreground/75 hover:text-foreground transition-colors font-body"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="hero" size="sm" asChild>
            <a href={CTA_HREF} aria-label="Ir para o formulário de diagnóstico">
              <MessageCircle className="size-4" />
              <span className="hidden sm:inline">{BRAND_NAME.split(' ')[0]} Contato</span>
            </a>
          </Button>
          <button
            type="button"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-foreground/80 hover:text-foreground transition-colors"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden liquid-glass rounded-2xl mt-2 py-2 backdrop-blur-xl bg-black/70">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block px-5 py-3 font-body text-base text-foreground/85 hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
