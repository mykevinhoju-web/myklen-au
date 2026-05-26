import type { ClientMessage, MessageReply } from './types'

function normalizeReply(raw: unknown): MessageReply | null {
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

/** Maps legacy subject/body records to the current shape. */
export function normalizeMessage(raw: unknown): ClientMessage | null {
  if (!raw || typeof raw !== 'object') return null
  const m = raw as Record<string, unknown>
  if (typeof m.id !== 'string' || typeof m.userId !== 'string') return null

  const createdAt = String(m.createdAt ?? new Date().toISOString())
  const title = String(m.title ?? m.subject ?? 'Message')
  const content = String(m.content ?? m.body ?? '')
  const replies = Array.isArray(m.replies)
    ? m.replies.map(normalizeReply).filter((r): r is MessageReply => r !== null)
    : []

  return {
    id: m.id,
    userId: m.userId,
    title,
    content,
    authorName: String(m.authorName ?? 'Client'),
    postedAt: String(m.postedAt ?? createdAt),
    createdAt,
    readByAdmin: Boolean(m.readByAdmin),
    replies,
  }
}

export function normalizeMessages(raw: unknown): ClientMessage[] {
  if (!Array.isArray(raw)) return []
  return raw.map(normalizeMessage).filter((m): m is ClientMessage => m !== null)
}
