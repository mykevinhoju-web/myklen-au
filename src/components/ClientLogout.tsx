'use client'

import { useRouter } from 'next/navigation'

export function ClientLogout() {
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <button type="button" className="btn-secondary" onClick={logout}>
      Sign out
    </button>
  )
}
