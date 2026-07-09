import { useEffect, useRef } from 'react'
import SplitType from 'split-type'
import { gsap } from '@/lib/gsap'

type Props = {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
  delay?: number
  animType?: 'chars' | 'words' | 'lines'
}

export function SplitHeading({
  text,
  className = '',
  as: Tag = 'h2',
  delay = 0,
  animType = 'chars',
}: Props) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    // 'chars' sozinho deixa palavras quebrarem no meio ao rebentar linha — 'words' junto preserva o wrap
    const split = new SplitType(ref.current, { types: animType === 'chars' ? 'chars,words' : animType })
    const targets = animType === 'chars' ? split.chars : animType === 'words' ? split.words : split.lines

    gsap.fromTo(
      targets,
      { opacity: 0, yPercent: 110, rotateX: -20 },
      {
        opacity: 1,
        yPercent: 0,
        rotateX: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: animType === 'chars' ? 0.022 : 0.08,
        delay,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          once: true,
        },
      }
    )

    return () => {
      split.revert()
    }
  }, [text, delay, animType])

  return (
    <Tag ref={ref as never} className={`overflow-hidden ${className}`} style={{ perspective: '800px' }}>
      {text}
    </Tag>
  )
}
