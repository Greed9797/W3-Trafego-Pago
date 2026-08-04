import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { prefersReducedMotion } from '@/lib/reduceMotion'

type Props = {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
  decimals?: number
  className?: string
}

export function CountUp({ to, prefix = '', suffix = '', duration = 1.8, decimals = 0, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const obj = useRef({ val: 0 })

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current

    if (prefersReducedMotion()) {
      el.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`
      return
    }

    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(obj.current, {
          val: to,
          duration,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = `${prefix}${obj.current.val.toFixed(decimals)}${suffix}`
          },
        })
      },
    })
  }, [to, prefix, suffix, duration, decimals])

  return (
    <span ref={ref} className={className}>
      {prefix}0{suffix}
    </span>
  )
}
