import { normalizeAppointment } from './appointment-notes'
import { loadJson, saveJson, usesRemoteDataStore } from './json-store'
import type { CleaningAppointment } from './types'

const FILE = 'appointments.json'

/** In-memory cache — local dev only (serverless instances must read blob each time). */
let cached: CleaningAppointment[] | null = null

function hydrate(list: CleaningAppointment[]) {
  cached = list.map(normalizeAppointment)
  return cached
}

export async function loadAppointments() {
  if (!usesRemoteDataStore() && cached) return cached
  const raw = await loadJson<CleaningAppointment[]>(FILE)
  return hydrate(raw)
}

export async function saveAppointments(appointments: CleaningAppointment[]) {
  const normalized = appointments.map(normalizeAppointment)
  if (usesRemoteDataStore()) {
    await saveJson(FILE, normalized, { compact: true })
    return normalized
  }
  cached = normalized
  await saveJson(FILE, cached, { compact: true })
  return cached
}

export function invalidateAppointmentsCache() {
  cached = null
}
