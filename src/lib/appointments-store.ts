import { normalizeAppointment } from './appointment-notes'
import { loadJson, saveJson } from './json-store'
import type { CleaningAppointment } from './types'

const FILE = 'appointments.json'

/** In-memory cache — avoids re-reading/parsing JSON on every API call (main slowdown as data grows). */
let cached: CleaningAppointment[] | null = null

function hydrate(list: CleaningAppointment[]) {
  cached = list.map(normalizeAppointment)
  return cached
}

export async function loadAppointments() {
  if (cached) return cached
  const raw = await loadJson<CleaningAppointment[]>(FILE)
  return hydrate(raw)
}

export async function saveAppointments(appointments: CleaningAppointment[]) {
  cached = appointments.map(normalizeAppointment)
  await saveJson(FILE, cached, { compact: true })
}

export function invalidateAppointmentsCache() {
  cached = null
}

export async function listAppointmentsForUser(userId: string) {
  const all = await loadAppointments()
  return all
    .filter((a) => a.userId === userId)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
}
