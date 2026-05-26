'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { formatMessageDate } from '@/lib/format-datetime'
import type { ClientMessage, ClientUserPublic } from '@/lib/types'

export default function CustomerMessagesPage() {
  const [user, setUser] = useState<ClientUserPublic | null>(null)
  const [messages, setMessages] = useState<ClientMessage[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [meRes, msgRes] = await Promise.all([fetch('/api/auth/me'), fetch('/api/messages')])
    if (meRes.ok) {
      const me = (await meRes.json()) as { user: ClientUserPublic }
      setUser(me.user)
    }
    if (msgRes.ok) setMessages(await msgRes.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return <p className="lead">Loading messages…</p>
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[var(--foreground)]">Messages</h2>
          <p className="mt-1 text-sm text-[#5c5c5c]">Posts you share with myklen. Replies appear on each message.</p>
        </div>
        <Link
          href="/customer/account/messages/new"
          className="rounded-full bg-[var(--hero-accent)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hero-accent-hover)]"
        >
          New message
        </Link>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/12 bg-white px-6 py-12 text-center">
          <p className="text-sm text-[#5c5c5c]">No messages yet.</p>
          <Link
            href="/customer/account/messages/new"
            className="mt-4 inline-block text-sm font-semibold text-[var(--hero-accent)] underline underline-offset-4"
          >
            Write your first message
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((m) => (
            <li key={m.id}>
              <Link
                href={`/customer/account/messages/${m.id}`}
                className="block rounded-2xl border border-black/8 bg-white p-5 shadow-sm shadow-black/[0.04] transition hover:border-black/14 hover:shadow-md"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold text-[var(--foreground)]">{m.title}</h3>
                  {m.replies.length > 0 && (
                    <span className="rounded-full bg-[var(--launch-sage)] px-2.5 py-0.5 text-xs font-semibold text-[var(--launch-olive-deep)]">
                      {m.replies.length} {m.replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--foreground)]/75">
                  {m.content}
                </p>
                <p className="mt-3 text-xs font-medium text-[#5c5c5c]">
                  {formatMessageDate(m.postedAt)} · {m.authorName}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {!user && <p className="mt-4 text-sm text-[#b91c1c]">Could not load your profile.</p>}
    </section>
  )
}
