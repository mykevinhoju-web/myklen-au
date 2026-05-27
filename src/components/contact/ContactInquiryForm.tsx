'use client'

import { useState } from 'react'
import { dateInputFromIso } from '@/lib/contact-inquiries-mutate'

export function ContactInquiryForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [date, setDate] = useState(dateInputFromIso(new Date().toISOString()))
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [sent, setSent] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const res = await fetch('/api/contact-inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, subject, message, date }),
    })

    setSaving(false)

    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Could not send inquiry')
      return
    }

    setSent(true)
    setName('')
    setEmail('')
    setPhone('')
    setSubject('')
    setMessage('')
    setDate(dateInputFromIso(new Date().toISOString()))
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-[var(--launch-sage)]/40 bg-[var(--launch-sage)]/15 px-6 py-8 text-center sm:px-8">
        <p className="text-lg font-semibold text-[var(--launch-olive-deep)]">Thanks — we got it</p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--foreground)]/80">
          Your message has been sent. We will contact you using the email or phone number you provided.
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false)
            setError(null)
          }}
          className="mt-5 rounded-full border border-black/12 bg-white px-5 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:bg-black/[0.03]"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-5 rounded-2xl border border-black/8 bg-white p-6 shadow-sm shadow-black/[0.04] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
            Name
          </label>
          <input
            id="contact-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-[var(--foreground)] outline-none ring-[var(--hero-accent)]/30 focus:border-[var(--hero-accent)]/50 focus:ring-2"
            required
            autoComplete="name"
            dir="ltr"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-[var(--foreground)] outline-none ring-[var(--hero-accent)]/30 focus:border-[var(--hero-accent)]/50 focus:ring-2"
            required
            autoComplete="email"
            dir="ltr"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
            Phone
          </label>
          <input
            id="contact-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-[var(--foreground)] outline-none ring-[var(--hero-accent)]/30 focus:border-[var(--hero-accent)]/50 focus:ring-2"
            required
            autoComplete="tel"
            dir="ltr"
          />
        </div>
        <div>
          <label htmlFor="contact-date" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
            Date
          </label>
          <input
            id="contact-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-[var(--foreground)] outline-none ring-[var(--hero-accent)]/30 focus:border-[var(--hero-accent)]/50 focus:ring-2"
            required
            dir="ltr"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
          Subject
        </label>
        <input
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-xl border border-black/10 px-4 py-2.5 text-[var(--foreground)] outline-none ring-[var(--hero-accent)]/30 focus:border-[var(--hero-accent)]/50 focus:ring-2"
          required
          dir="ltr"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#5c5c5c]">
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          className="w-full resize-y rounded-xl border border-black/10 px-4 py-3 text-[var(--foreground)] outline-none ring-[var(--hero-accent)]/30 focus:border-[var(--hero-accent)]/50 focus:ring-2"
          required
          placeholder="How can we help?"
          dir="ltr"
        />
      </div>

      {error && <p className="text-sm text-[#b91c1c]">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-[var(--hero-accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--hero-accent-hover)] disabled:opacity-60"
      >
        {saving ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}

