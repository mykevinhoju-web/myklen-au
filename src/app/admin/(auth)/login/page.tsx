'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') ?? '/admin'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) {
      setError('Invalid credentials')
      return
    }
    router.push(from)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <label className="block text-sm">
        Username
        <input
          className="mt-1 w-full rounded-lg border border-teal-900/20 px-3 py-2 text-left text-teal-950"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          dir="ltr"
        />
      </label>
      <label className="block text-sm">
        Password
        <input
          type="password"
          className="mt-1 w-full rounded-lg border border-teal-900/20 px-3 py-2 text-left text-teal-950"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          dir="ltr"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        className="w-full rounded-full bg-teal-700 py-2.5 text-sm font-semibold text-white"
      >
        Sign in
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-bold text-teal-950">Admin login</h1>
      <p className="mt-2 text-sm text-teal-900/70">Platform operator only.</p>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
