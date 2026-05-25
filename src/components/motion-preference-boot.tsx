'use client'

import { useLayoutEffect } from 'react'
import { shouldForceMotion } from '@/lib/motion-preference'

/** Enables CSS/JS motion when Windows “Show animations” is off but you still want site motion. */
export function MotionPreferenceBoot() {
  useLayoutEffect(() => {
    if (shouldForceMotion()) {
      document.documentElement.dataset.forceMotion = 'true'
    }
  }, [])

  return null
}
