import type { CleaningAppointment, VisitThreadMessage } from './types'

export function buildVisitThread(raw: CleaningAppointment): VisitThreadMessage[] {
  if (raw.visitThread && raw.visitThread.length > 0) {
    return [...raw.visitThread].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
  }

  const thread: VisitThreadMessage[] = []
  const fallbackTime = raw.createdAt

  if (raw.clientNote?.trim()) {
    thread.push({
      id: `legacy-c-${raw.id}`,
      author: 'client',
      body: raw.clientNote.trim(),
      createdAt: fallbackTime,
    })
  }
  if (raw.notes?.trim()) {
    thread.push({
      id: `legacy-a-${raw.id}`,
      author: 'admin',
      body: raw.notes.trim(),
      createdAt: fallbackTime,
    })
  }
  return thread
}

/** Keep legacy single fields in sync for older code paths. */
export function syncLegacyNoteFields(apt: CleaningAppointment, thread: VisitThreadMessage[]) {
  const clientMsgs = thread.filter((m) => m.author === 'client')
  const adminMsgs = thread.filter((m) => m.author === 'admin')
  apt.clientNote = clientMsgs.at(-1)?.body ?? ''
  apt.notes = adminMsgs.at(-1)?.body ?? ''
  apt.visitThread = thread
}

export function hasUnreadAdminMessages(apt: CleaningAppointment): boolean {
  if (apt.adminNoteReadByClient) return false
  if (apt.visitThread?.some((m) => m.author === 'admin')) return true
  return !!apt.notes?.trim()
}

export function hasUnreadClientMessages(apt: CleaningAppointment): boolean {
  if (apt.clientNoteReadByAdmin) return false
  if (apt.visitThread?.some((m) => m.author === 'client')) return true
  return !!apt.clientNote?.trim()
}

export function newThreadMessage(author: 'client' | 'admin', body: string): VisitThreadMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author,
    body,
    createdAt: new Date().toISOString(),
  }
}
