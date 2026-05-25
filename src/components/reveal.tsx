import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  /** 1–3 for staggered scroll range (CSS) */
  stagger?: 0 | 1 | 2 | 3
}

const staggerClass: Record<number, string> = {
  0: '',
  1: 'reveal-stagger-1',
  2: 'reveal-stagger-2',
  3: 'reveal-stagger-3',
}

/** Scroll reveal — CSS `animation-timeline: view()` (+ JS fallback in layout) */
export function Reveal({ children, className = '', stagger = 0 }: Props) {
  return (
    <div className={`reveal-on-scroll ${staggerClass[stagger] ?? ''} ${className}`.trim()}>
      {children}
    </div>
  )
}
