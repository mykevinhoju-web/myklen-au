import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  id?: string
}

/** Bou-style floating content panel on the page canvas */
export function LayerSection({ children, className = '', id }: Props) {
  return (
    <section id={id} className={`layer-section ${className}`.trim()}>
      {children}
    </section>
  )
}
