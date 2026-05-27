'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatMessageDate, formatSchedule } from '@/lib/format-datetime'
import { contactInquiryStatusLabel } from '@/lib/contact-inquiries-mutate'
import type { ContactInquiry, ContactInquiryStatus } from '@/lib/types'

function statusBadgeClass(status: ContactInquiryStatus) {
  if (status === 'replied') return 'border-emerald-400/40 text-emerald-300'
  if (status === 'read') return 'border-white/20 text-slate-400'
  return 'border-[var(--hero-accent,#e85a4f)] text-[var(--hero-accent,#e85a4f)]'
}

export function AdminContactInquiries() {
  const [items, setItems] = useState<ContactInquiry[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const res = await fetch('/api/contact-inquiries')
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function open(inq: ContactInquiry) {
    setExpandedId(inq.id)
    setReplyDraft('')
    if (inq.status === 'new') {
      await fetch(`/api/contact-inquiries/${inq.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markRead: true }),
      })
      load()
    }
  }

  async function saveReply(id: string) {
    const text = replyDraft.trim()
    if (!text) return
    setSaving(true)
    const res = await fetch(`/api/contact-inquiries/${id}`, {
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

  const newCount = items.filter((i) => i.status === 'new').length
  const sorted = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (loading) return <p className="admin-page-lead">Loading contact inquiries…</p>

  if (items.length === 0) {
    return <p className="admin-page-lead mt-4">No contact inquiries yet.</p>
  }

  return (
    <div className="mt-6 space-y-4">
      {newCount > 0 && (
        <p className="text-sm font-medium text-amber-300">
          {newCount} new {newCount === 1 ? 'inquiry' : 'inquiries'}
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {sorted.map((inq) => {
          const isOpen = expandedId === inq.id
          return (
            <li
              key={inq.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              style={{
                borderLeftWidth: '4px',
                borderLeftColor: inq.status === 'new' ? 'var(--hero-accent, #e85a4f)' : 'transparent',
              }}
            >
              <button type="button" className="w-full text-left" onClick={() => (isOpen ? setExpandedId(null) : open(inq))}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <strong className="text-base text-white">{inq.subject}</strong>
                    <p className="mt-1 text-sm text-slate-400">
                      {inq.name} · {inq.email} · {inq.phone}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {formatMessageDate(inq.inquiryDate)} · received {formatSchedule(inq.createdAt)}
                    </p>
                  </div>
                  <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ${statusBadgeClass(inq.status)}`}>
                    {contactInquiryStatusLabel(inq.status)}
                  </span>
                </div>
                {!isOpen && <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-300">{inq.message}</p>}
              </button>

              {isOpen && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <dl className="grid gap-2 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
                      <dd>
                        <a href={`mailto:${inq.email}`} className="text-slate-200 underline underline-offset-2">
                          {inq.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</dt>
                      <dd>
                        <a href={`tel:${inq.phone}`} className="text-slate-200 underline underline-offset-2">
                          {inq.phone}
                        </a>
                      </dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Date</dt>
                      <dd className="text-slate-200">{formatMessageDate(inq.inquiryDate)}</dd>
                    </div>
                  </dl>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{inq.message}</p>

                  {inq.replies.length > 0 && (
                    <ul className="mt-5 space-y-3">
                      {inq.replies.map((reply) => (
                        <li key={reply.id} className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-300/90">Reply</p>
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
                      saveReply(inq.id)
                    }}
                  >
                    <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Reply note (status becomes Replied)
                    </label>
                    <textarea
                      className="w-full rounded-xl border border-white/15 bg-slate-900/80 px-3 py-2.5 text-sm text-white outline-none focus:border-white/30"
                      rows={3}
                      value={replyDraft}
                      onChange={(e) => setReplyDraft(e.target.value)}
                      placeholder="Write a reply note…"
                      dir="ltr"
                      required
                    />
                    <button type="submit" className="btn-primary" disabled={saving || !replyDraft.trim()}>
                      {saving ? 'Saving…' : 'Save reply'}
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

