'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MessagePostForm } from '@/components/customer/message-post-form'
import type { ClientUserPublic } from '@/lib/types'

export default function NewCustomerMessagePage() {
  const router = useRouter()
  const [user, setUser] = useState<ClientUserPublic | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then(async (res) => {
        if (!res.ok) {
          window.location.href = '/customer/login?from=/customer/account/messages/new'
          return
        }
        const me = (await res.json()) as { user: ClientUserPublic }
        setUser(me.user)
      })
      .catch(() => {})
  }, [])

  if (!user) {
    return <p className="lead">Loading…</p>
  }

  return (
    <section>
      <h2 className="mb-6 text-xl font-bold tracking-tight text-[var(--foreground)]">New message</h2>
      <MessagePostForm
        authorName={user.displayName}
        submitLabel="Post message"
        onCancel={() => router.push('/customer/account/messages')}
        onSubmit={async (values) => {
          const res = await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          })
          if (!res.ok) {
            const data = (await res.json()) as { error?: string }
            throw new Error(data.error ?? 'Could not post')
          }
          const created = (await res.json()) as { id: string }
          router.push(`/customer/account/messages/${created.id}`)
        }}
      />
    </section>
  )
}
