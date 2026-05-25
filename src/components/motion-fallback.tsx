'use client'

import { useEffect } from 'react'
import { isReducedMotion } from '@/lib/motion-preference'

/** Firefox etc.: scroll reveal when `animation-timeline: view()` is unavailable */
export function MotionFallback() {
  useEffect(() => {
    const reduced = isReducedMotion()
    if (
      !reduced &&
      typeof CSS !== 'undefined' &&
      CSS.supports('animation-timeline: view()')
    ) {
      return
    }
    const nodes = document.querySelectorAll<HTMLElement>('.reveal-on-scroll')
    if (!nodes.length) return

    nodes.forEach((el) => el.classList.add('reveal-fallback'))

    if (reduced) {
      nodes.forEach((el) => el.classList.add('reveal-visible'))
      return
    }

    const show = (el: HTMLElement) => {
      el.classList.add('reveal-visible')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          show(entry.target as HTMLElement)
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px 5% 0px' },
    )

    nodes.forEach((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
        show(el)
      } else {
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
  }, [])

  return null
}
