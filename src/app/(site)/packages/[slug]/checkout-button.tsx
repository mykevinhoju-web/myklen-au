'use client'

import { btnHover } from '@/lib/motion-classes'
import { useState } from 'react'

export function PackageCheckoutButton({ packageSlug }: { packageSlug: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function checkout() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/package', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageSlug }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Checkout failed')
      if (data.url) window.location.href = data.url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={checkout}
        disabled={loading}
        className={`rounded-full bg-[#0a0a0a] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1a1a1a] disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none ${btnHover}`}
      >
        {loading ? 'Redirecting…' : 'Buy with Stripe'}
      </button>
      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
    </div>
  )
}
