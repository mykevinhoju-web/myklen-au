'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatMessageDate, formatSchedule } from '@/lib/format-datetime'
import type { ClientMessage, ClientUserPublic } from '@/lib/types'

export function AdminClientMessages() {
  const [users, setUsers] = useState<ClientUserPublic[]>([])
  const [messages, setMessages] = useState<ClientMessage[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
    return u ? u.displayName : userId
  }

  async function openMessage(m: ClientMessage) {
    setExpandedId(m.id)
    setReplyDraft('')
    if (!m.readByAdmin) {
      await fetch(`/api/messages/${m.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ readByAdmin: true }),
      })
      load()
    }
  }

  async function sendReply(id: string) {
    const text = replyDraft.trim()
    if (!text) return
    setSaving(true)
    const res = await fetch(`/api/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addReply: text }),
    })
    setSaving(false)
    if (res.ok) {
      setReplyDraft('')
      load()
    }
  }

  const unreadCount = messages.filter((m) => !m.readByAdmin).length
  const sorted = [...messages].sort(
    (a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime(),
  )

  if (loading) {
    return <p className="admin-page-lead">Loading messages…</p>
  }

  if (messages.length === 0) {
    return (
      <p className="admin-page-lead mt-4">
        No client messages yet. Clients can post from{' '}
        <strong className="font-medium text-slate-200">Messages</strong> in their account.
      </p>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {unreadCount > 0 && (
        <p className="text-sm font-medium text-amber-300">{unreadCount} unread</p>
      )}

      <ul className="flex flex-col gap-4">
        {sorted.map((m) => {
          const open = expandedId === m.id
          return (
            <li
              key={m.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: m.readByAdmin ? 'transparent' : 'var(--hero-accent, #e85a4f)',
              }}
            >
              <button
                type="button"
                className="w-full text-left"
                onClick={() => (open ? setExpandedId(null) : openMessage(m))}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <strong className="text-base text-white">{m.title}</strong>
                    <p className="mt-1 text-sm text-slate-400">
                      {userLabel(m.userId)} · {formatMessageDate(m.postedAt)} · posted by {m.authorName}
                    </p>
                  </div>
                  <span
                    className="rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide"
                    style={{
                      borderColor: m.readByAdmin ? 'var(--admin-line)' : 'var(--hero-accent, #e85a4f)',
                      color: m.readByAdmin ? 'var(--admin-muted)' : 'var(--hero-accent, #e85a4f)',
                    }}
                  >
                    {m.readByAdmin ? 'Read' : 'New'}
                  </span>
                </div>
                {!open && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-300">{m.content}</p>
                )}
              </button>

              {open && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{m.content}</p>

                  {m.replies.length > 0 && (
                    <ul className="mt-5 space-y-3">
                      {m.replies.map((reply) => (
                        <li
                          key={reply.id}
                          className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3"
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300/90">
                            Admin
                          </p>
                          <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200">{reply.body}</p>
                          <p className="mt-2 text-xs text-slate-500">{formatSchedule(reply.createdAt)}</p>
                        </li>
                      ))}
                    </ul>
                  )}

                  <form
                    className="mt-5 space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault()
                      sendReply(m.id)
                    }}
                  >
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Reply as Admin
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
                      rows={3}
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      placeholder="Write a reply…"
                      dir="ltr"
                      required
                    />
                    <button type="submit" className="btn-primary" disabled={saving || !replyDraft.trim()}>
                      {saving ? 'Sending…' : 'Send reply'}
                    </button>
                  </form>
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
