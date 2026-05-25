'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatSchedule } from '@/lib/format-datetime'
import type { ClientMessage, ClientUserPublic } from '@/lib/types'

export function AdminClientMessages() {
  const [users, setUsers] = useState<ClientUserPublic[]>([])
  const [messages, setMessages] = useState<ClientMessage[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const [usersRes, msgRes] = await Promise.all([
      fetch('/api/admin/users'),
      fetch('/api/messages'),
    ])
    if (usersRes.ok) setUsers(await usersRes.json())
    if (msgRes.ok) setMessages(await msgRes.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function userLabel(userId: string) {
    const u = users.find((x) => x.id === userId)
    return u ? `${u.displayName} (${u.username})` : userId
  }

  async function markRead(id: string, readByAdmin: boolean) {
    await fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ readByAdmin }),
    })
    load()
  }

  const unreadCount = messages.filter((m) => !m.readByAdmin).length
  const sorted = [...messages].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (loading) {
    return <p className="admin-page-lead mt-10">Loading client messages…</p>
  }

  if (messages.length === 0) {
    return (
      <section className="mt-10">
        <h2 className="text-lg font-semibold text-white">Client messages</h2>
        <p className="admin-page-lead mt-2">No messages yet. Clients can send notes from their account page.</p>
      </section>
    )
  }

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Client messages</h2>
        {unreadCount > 0 && (
          <span className="text-sm font-medium text-amber-300">{unreadCount} unread</span>
        )}
      </div>
      <ul className="flex flex-col gap-3">
        {sorted.map((m) => (
          <li
            key={m.id}
            className="admin-surface"
            style={{
              borderLeftWidth: '4px',
              borderLeftColor: m.readByAdmin ? 'transparent' : 'var(--hero-accent, #c41e3a)',
            }}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <strong className="text-base">{m.subject}</strong>
                <p className="mt-1 text-sm" style={{ color: 'var(--admin-muted)' }}>
                  {userLabel(m.userId)} · {formatSchedule(m.createdAt)}
                </p>
              </div>
              <span
                className="rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
                style={{
                  borderColor: m.readByAdmin ? 'var(--admin-line)' : 'var(--hero-accent, #c41e3a)',
                  color: m.readByAdmin ? 'var(--admin-muted)' : 'var(--hero-accent, #c41e3a)',
                }}
              >
                {m.readByAdmin ? 'Read' : 'New'}
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{m.body}</p>
            <div className="admin-form-actions">
              {m.readByAdmin ? (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => markRead(m.id, false)}
                >
                  Mark unread
                </button>
              ) : (
                <button type="button" className="btn-primary" onClick={() => markRead(m.id, true)}>
                  Mark read
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
