'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { isReducedMotion } from '@/lib/motion-preference'

const HEADER_PX = 72

/** 0 = hero dominant, 1 = sky colour washed through page below */
function getHeroBleedTarget() {
  const hero = document.getElementById('home-hero')
  if (!hero) return 0

  const rect = hero.getBoundingClientRect()
  const h = Math.max(hero.offsetHeight, 280)
  const scrolled = HEADER_PX - rect.top
  const range = h * 1.05

  if (range <= 0) return 0
  return Math.min(1, Math.max(0, scrolled / range))
}

export function ScrollHeroBleed() {
  const pathname = usePathname()
  const display = useRef(0)
  const raf = useRef(0)

  useEffect(() => {
    const root = document.documentElement

    if (pathname !== '/' && pathname !== '/ko') {
      root.removeAttribute('data-hero-bleed')
      root.style.removeProperty('--hero-bleed')
      display.current = 0
      return
    }

    root.setAttribute('data-hero-bleed', 'active')
    display.current = getHeroBleedTarget()

    const tick = () => {
      const reduced = isReducedMotion()
      const target = getHeroBleedTarget()
      const smooth = reduced ? 1 : 0.09
      display.current += (target - display.current) * smooth
      root.style.setProperty('--hero-bleed', display.current.toFixed(3))
      raf.current = requestAnimationFrame(tick)
    }

    raf.current = requestAnimationFrame(tick)

    const onResize = () => {
      display.current = getHeroBleedTarget()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', onResize)
      root.removeAttribute('data-hero-bleed')
      root.style.removeProperty('--hero-bleed')
    }
  }, [pathname])

  return null
}
