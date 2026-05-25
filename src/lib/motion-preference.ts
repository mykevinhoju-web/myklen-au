/** True when OS/browser requests reduced motion (unless force override is on). */
export function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  if (document.documentElement.dataset.forceMotion === 'true') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function shouldForceMotion(): boolean {
  if (typeof window === 'undefined') return false
  if (process.env.NEXT_PUBLIC_FORCE_MOTION === '1') return true
  try {
    return localStorage.getItem('myklen-force-motion') === '1'
  } catch {
    return false
  }
}
