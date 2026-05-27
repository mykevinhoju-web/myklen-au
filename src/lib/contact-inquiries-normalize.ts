import type { ContactInquiry, ContactInquiryReply, ContactInquiryStatus } from './types'

function normalizeStatus(raw: unknown): ContactInquiryStatus {
  if (raw === 'read' || raw === 'replied') return raw
  return 'new'
}

function normalizeReply(raw: unknown): ContactInquiryReply | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (r.author !== 'admin' || typeof r.body !== 'string') return null
  return {
    id: String(r.id ?? `reply-${Date.now()}`),
    author: 'admin',
    body: r.body,
    createdAt: String(r.createdAt ?? new Date().toISOString()),
  }
}

export function normalizeContactInquiry(raw: unknown): ContactInquiry | null {
  if (!raw || typeof raw !== 'object') return null
  const i = raw as Record<string, unknown>
  if (typeof i.id !== 'string') return null

  const createdAt = String(i.createdAt ?? new Date().toISOString())
  const replies = Array.isArray(i.replies)
    ? i.replies.map(normalizeReply).filter((r): r is ContactInquiryReply => r !== null)
    : []

  let status = normalizeStatus(i.status)
  if (replies.length > 0 && status !== 'replied') status = 'replied'

  return {
    id: i.id,
    name: String(i.name ?? ''),
    email: String(i.email ?? ''),
    phone: String(i.phone ?? ''),
    subject: String(i.subject ?? ''),
    message: String(i.message ?? ''),
    inquiryDate: String(i.inquiryDate ?? createdAt),
    createdAt,
    status,
    replies,
  }
}

export function normalizeContactInquiries(raw: unknown): ContactInquiry[] {
  if (!Array.isArray(raw)) return []
  return raw.map(normalizeContactInquiry).filter((i): i is ContactInquiry => i !== null)
}

