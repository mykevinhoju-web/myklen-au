import type { ClientMessage, MessageReply } from './types'

export function newMessageReply(body: string): MessageReply {
  return {
    id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author: 'admin',
    body,
    createdAt: new Date().toISOString(),
  }
}

export function postedAtFromDateInput(dateValue: string) {
  if (!dateValue) return new Date().toISOString()
  const probe = new Date(`${dateValue}T12:00:00`)
  return Number.isNaN(probe.getTime()) ? new Date().toISOString() : probe.toISOString()
}

export function dateInputFromIso(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function createClientMessage(input: {
  userId: string
  authorName: string
  title: string
  content: string
  postedAt: string
}): ClientMessage {
  const now = new Date().toISOString()
  return {
    id: `msg-${Date.now()}`,
    userId: input.userId,
    title: input.title.trim(),
    content: input.content.trim(),
    authorName: input.authorName.trim() || 'Client',
    postedAt: input.postedAt,
    createdAt: now,
    readByAdmin: false,
    replies: [],
  }
}
