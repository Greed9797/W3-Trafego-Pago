import Lenis from '@studio-freight/lenis'

export const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
})

// raf loop é dirigido pelo gsap.ticker em lib/gsap.ts — não há loop próprio aqui.
