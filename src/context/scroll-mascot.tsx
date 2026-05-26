'use client'

import { usePathname } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

const HEADER_OFFSET = 72

/** 0 at top of page → 1 after scrolling through ~65% of hero height */
export function getHeroScrollProgress() {
  const hero = document.getElementById('home-hero')
  if (!hero) return 0

  const rect = hero.getBoundingClientRect()
  const h = Math.max(hero.offsetHeight, 280)
  const scrolled = HEADER_OFFSET - rect.top
  const distance = h * 0.65

  if (distance <= 0) return 0
  return Math.min(1, Math.max(0, scrolled / distance))
}

type ScrollMascotContextValue = {
  reveal: number
  isHome: boolean
}

const ScrollMascotContext = createContext<ScrollMascotContextValue>({
  reveal: 0,
  isHome: false,
})

export function useScrollMascot() {
  return useContext(ScrollMascotContext)
}

export function ScrollMascotProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isHome = pathname === '/' || pathname === '/ko'
  const [reveal, setReveal] = useState(0)

  const updateReveal = useCallback(() => {
    if (!isHome) {
      setReveal(0)
      return
    }
    setReveal(getHeroScrollProgress())
  }, [isHome])

  useEffect(() => {
    updateReveal()
    if (!isHome) return

    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(updateReveal)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isHome, updateReveal, pathname])

  return (
    <ScrollMascotContext.Provider value={{ reveal, isHome }}>
      {children}
    </ScrollMascotContext.Provider>
  )
}
