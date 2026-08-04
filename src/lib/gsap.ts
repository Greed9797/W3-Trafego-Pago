import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { lenis } from './lenis'
import { prefersReducedMotion } from './reduceMotion'

gsap.registerPlugin(ScrollTrigger)

// Mobile/reduced-motion: sem smooth scroll (RAF contínuo é o maior custo de main-thread no celular).
if (prefersReducedMotion()) {
  lenis.destroy()
} else {
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

export { gsap, ScrollTrigger }
