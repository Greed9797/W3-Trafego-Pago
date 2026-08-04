// Mobile e reduced-motion não rodam as animações pesadas (GSAP/SplitType/Lenis).
// Corta TBT no device real (celular lento); desktop mantém o polish.
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.innerWidth < 800
  )
}
