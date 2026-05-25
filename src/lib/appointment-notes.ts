import type { CleaningAppointment } from './types'
import { buildVisitThread, syncLegacyNoteFields } from './visit-thread'

export function normalizeAppointment(raw: CleaningAppointment): CleaningAppointment {
  const thread = buildVisitThread(raw)
  const apt: CleaningAppointment = {
    ...raw,
    notes: raw.notes ?? '',
    clientNote: raw.clientNote ?? '',
    visitThread: thread,
    clientNoteReadByAdmin:
      raw.clientNoteReadByAdmin ??
      !thread.some((m) => m.author === 'client'),
    adminNoteReadByClient:
      raw.adminNoteReadByClient ?? !thread.some((m) => m.author === 'admin'),
  }
  syncLegacyNoteFields(apt, thread)
  return apt
}

export function hasUnreadAdminNote(apt: CleaningAppointment): boolean {
  if (apt.adminNoteReadByClient) return false
  if (apt.visitThread?.some((m) => m.author === 'admin')) return true
  return !!apt.notes?.trim()
}

export function hasUnreadClientNote(apt: CleaningAppointment): boolean {
  if (apt.clientNoteReadByAdmin) return false
  if (apt.visitThread?.some((m) => m.author === 'client')) return true
  return !!apt.clientNote?.trim()
}

export function showAlertForClient(apt: CleaningAppointment): boolean {
  return hasUnreadAdminNote(apt)
}

export function showAlertForAdmin(apt: CleaningAppointment): boolean {
  return hasUnreadClientNote(apt)
}
