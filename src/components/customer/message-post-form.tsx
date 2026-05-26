'use client'

import { useState } from 'react'
import { dateInputFromIso } from '@/lib/messages-mutate'

type Props = {
  authorName: string
  initial?: {
    title: string
    content: string
    postedAt: string
  }
  submitLabel: string
  onSubmit: (values: { title: string; content: string; date: string }) => Promise<void>
  onCancel?: () => void
}

export function MessagePostForm({ authorName, initial, submitLabel, onSubmit, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [date, setDate] = useState(
    initial?.postedAt ? dateInputFromIso(initial.postedAt) : dateInputFromIso(new Date().toISOString()),
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      await onSubmit({ title, content, date })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-black/8 bg-white p-6 shadow-sm shadow-black/[0.04] sm:p-8"
    >
      <div>
        <label htmlFor="msg-title" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
          Title
        </label>
        <input
          id="msg-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-[var(--foreground)] outline-none ring-[var(--hero-accent)]/30 focus:border-[var(--hero-accent)]/50 focus:ring-2"
          required
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="msg-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
          Date
        </label>
        <input
          id="msg-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full max-w-xs rounded-xl border border-black/10 px-4 py-2.5 text-[var(--foreground)] outline-none ring-[var(--hero-accent)]/30 focus:border-[var(--hero-accent)]/50 focus:ring-2"
          required
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="msg-author" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
          Author
        </label>
        <input
          id="msg-author"
          value={authorName}
          readOnly
          className="w-full max-w-md rounded-xl border border-black/8 bg-[#f7f7f5] px-4 py-2.5 text-[var(--foreground)]/80"
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="msg-content" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
          Content
        </label>
        <textarea
          id="msg-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full resize-y rounded-xl border border-black/10 px-4 py-3 text-[var(--foreground)] outline-none ring-[var(--hero-accent)]/30 focus:border-[var(--hero-accent)]/50 focus:ring-2"
          required
          dir="ltr"
        />
      </div>

      {error && <p className="text-sm text-[#b91c1c]">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-[var(--hero-accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hero-accent-hover)] disabled:opacity-60"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-black/12 bg-white px-6 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:bg-black/[0.03]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
