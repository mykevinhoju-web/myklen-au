/** Stable viewport height for scroll math (iOS address bar). */
export function getViewportHeight() {
  if (typeof window === 'undefined') return 0
  return window.visualViewport?.height ?? window.innerHeight
}
