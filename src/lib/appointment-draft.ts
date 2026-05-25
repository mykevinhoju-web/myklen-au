import { datetimeLocalForDate, toDatetimeLocal } from './calendar-utils'
import type { AppointmentStatus, CleaningAppointment } from './types'

export type AppointmentDraft = {
  id: string
  userId: string
  title: string
  scheduledAtLocal: string
  status: AppointmentStatus
  location: string
  notes: string
  isNew: boolean
}

export function emptyAppointmentDraft(date?: Date): AppointmentDraft {
  const base = date ?? new Date()
  if (!date) {
    base.setDate(base.getDate() + 1)
  }
  return {
    id: `new-${Date.now()}`,
    userId: '',
    title: 'Cleaning visit',
    scheduledAtLocal: datetimeLocalForDate(base, 9, 0),
    status: 'scheduled',
    location: '',
    notes: '',
    isNew: true,
  }
}

export function draftFromAppointment(a: CleaningAppointment): AppointmentDraft {
  return {
    id: a.id,
    userId: a.userId,
    title: a.title,
    scheduledAtLocal: toDatetimeLocal(a.scheduledAt),
    status: a.status,
    location: a.location,
    notes: a.notes,
    isNew: false,
  }
}

export function draftToPayload(draft: AppointmentDraft) {
  return {
    userId: draft.userId,
    title: draft.title,
    scheduledAt: new Date(draft.scheduledAtLocal).toISOString(),
    status: draft.status as AppointmentStatus,
    location: draft.location,
    notes: draft.notes,
  }
}
