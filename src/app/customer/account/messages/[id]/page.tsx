'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { MessagePostForm } from '@/components/customer/message-post-form'
import { formatMessageDate, formatSchedule } from '@/lib/format-datetime'
import type { ClientMessage, ClientUserPublic } from '@/lib/types'

export default function CustomerMessageDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<ClientUserPublic | null>(null)
  const [message, setMessage] = useState<ClientMessage | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    const [meRes, msgRes] = await Promise.all([
      fetch('/api/auth/me'),
      fetch(`/api/messages/${id}`),
    ])
    if (meRes.ok) {
      const me = (await meRes.json()) as { user: ClientUserPublic }
      setUser(me.user)
    }
    if (msgRes.ok) setMessage(await msgRes.json())
    setLoading(false)
  }, [id])

  useEffect(() => {
    load()
  }, [load])

  async function handleDelete() {
    if (!confirm('Delete this message?')) return
    setDeleting(true)
    const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' })
    setDeleting(false)
    if (res.ok) router.push('/customer/account/messages')
  }

  if (loading) {
    return <p className="lead">Loading…</p>
  }

  if (!message) {
    return (
      <p className="lead">
        Message not found.{' '}
        <Link href="/customer/account/messages" className="font-semibold underline">
          Back to messages
        </Link>
      </p>
    )
  }

  if (editing && user) {
    return (
      <section>
        <h2 className="mb-6 text-xl font-bold tracking-tight text-[var(--foreground)]">Edit message</h2>
        <MessagePostForm
          authorName={user.displayName}
          initial={{
            title: message.title,
            content: message.content,
            postedAt: message.postedAt,
          }}
          submitLabel="Save changes"
          onCancel={() => setEditing(false)}
          onSubmit={async (values) => {
            const res = await fetch(`/api/messages/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            })
            if (!res.ok) {
              const data = (await res.json()) as { error?: string }
              throw new Error(data.error ?? 'Could not save')
            }
            setMessage(await res.json())
            setEditing(false)
          }}
        />
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <Link
        href="/customer/account/messages"
        className="text-sm font-medium text-[#5c5c5c] underline underline-offset-4 hover:text-[var(--foreground)]"
      >
        ← All messages
      </Link>

      <article className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm shadow-black/[0.04] sm:p-8">
        <header className="border-b border-black/8 pb-5">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">{message.title}</h2>
          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">Date</dt>
              <dd className="font-medium text-[var(--foreground)]">{formatMessageDate(message.postedAt)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">Author</dt>
              <dd className="font-medium text-[var(--foreground)]">{message.authorName}</dd>
            </div>
          </dl>
        </header>

        <div className="pt-5">
          <p className="whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-[var(--foreground)]/90">
            {message.content}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-black/8 pt-6">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full border border-black/12 bg-white px-5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-black/[0.03]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full border border-[#b91c1c]/25 bg-white px-5 py-2 text-sm font-semibold text-[#b91c1c] transition hover:bg-[#b91c1c]/5 disabled:opacity-60"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </article>

      {message.replies.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[#5c5c5c]">Replies from myklen</h3>
          <ul className="flex flex-col gap-3">
            {message.replies.map((reply) => (
              <li
                key={reply.id}
                className="rounded-2xl border border-[var(--launch-olive)]/15 bg-[var(--launch-cream)] p-5"
              >
                <p className="mb-2 text-xs font-semibold text-[var(--launch-olive-deep)]">Admin</p>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--foreground)]/90">
                  {reply.body}
                </p>
                <p className="mt-3 text-xs text-[#5c5c5c]">{formatSchedule(reply.createdAt)}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}
