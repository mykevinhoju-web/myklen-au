'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Invalid username or password')
      setLoading(false)
      return
    }

    const from = searchParams.get('from') ?? '/customer/account'
    router.push(from)
    router.refresh()
  }

  return (
    <div className="page page-narrow">
      <div className="text-center" style={{ marginBottom: '2.5rem' }}>
        <p className="eyebrow">Customer portal</p>
        <h1 className="display-title mt-3 text-3xl">Log in</h1>
        <p className="lead mt-4">
          Use the username and password your cleaning manager gave you to view your schedule and
          send messages.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            dir="ltr"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            dir="ltr"
            required
          />
        </div>
        {error && (
          <p className="mb-4 text-sm text-[var(--hero-accent)]">{error}</p>
        )}
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#5c5c5c]">
        <Link href="/" className="underline decoration-black/20 underline-offset-4">
          Back to myklen.com.au
        </Link>
      </p>
    </div>
  )
}

export default function CustomerLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
