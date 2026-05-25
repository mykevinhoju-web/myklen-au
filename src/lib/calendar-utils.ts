import type { CleaningAppointment } from './types'

const BRISBANE = 'Australia/Brisbane'

export function dateKeyInBrisbane(iso: string) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: BRISBANE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso))
}

export function timeInBrisbane(iso: string) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: BRISBANE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(iso))
}

export function monthLabel(year: number, month: number) {
  return new Intl.DateTimeFormat('en-AU', {
    timeZone: BRISBANE,
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month, 1))
}

export type CalendarDay = {
  date: Date
  dateKey: string
  inMonth: boolean
  isToday: boolean
}

/** Brisbane calendar date key (YYYY-MM-DD) for grid cells */
export function dateKeyFromYMD(year: number, monthIndex: number, day: number) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const probe = new Date(`${year}-${pad(monthIndex + 1)}-${pad(day)}T12:00:00+10:00`)
  return dateKeyInBrisbane(probe.toISOString())
}

export function buildMonthGrid(year: number, month: number): CalendarDay[] {
  const todayKey = dateKeyInBrisbane(new Date().toISOString())
  const first = new Date(year, month, 1)
  const startOffset = (first.getDay() + 6) % 7
  const gridStart = new Date(year, month, 1 - startOffset)

  const days: CalendarDay[] = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
    const y = date.getFullYear()
    const m = date.getMonth()
    const d = date.getDate()
    const dateKey = dateKeyFromYMD(y, m, d)
    days.push({
      date,
      dateKey,
      inMonth: m === month,
      isToday: dateKey === todayKey,
    })
  }
  return days
}

export function appointmentsOnDay(appointments: CleaningAppointment[], dateKey: string) {
  return appointments
    .filter((a) => dateKeyInBrisbane(a.scheduledAt) === dateKey)
    .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
}

/** Prefer a visit with an alert (!), otherwise the earliest visit that day. */
export function pickVisitOnDay(
  appointments: CleaningAppointment[],
  dateKey: string,
  prefer?: (apt: CleaningAppointment) => boolean,
) {
  const list = appointmentsOnDay(appointments, dateKey)
  if (list.length === 0) return null
  if (prefer) {
    const highlighted = list.find(prefer)
    if (highlighted) return highlighted
  }
  return list[0]
}

export function groupAppointmentsByDay(appointments: CleaningAppointment[]) {
  const map = new Map<string, CleaningAppointment[]>()
  for (const apt of appointments) {
    const key = dateKeyInBrisbane(apt.scheduledAt)
    const list = map.get(key) ?? []
    list.push(apt)
    map.set(key, list)
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
  }
  return map
}

export function toDatetimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function fromDatetimeLocal(value: string) {
  return new Date(value).toISOString()
}

export function datetimeLocalForDate(date: Date, hour = 9, minute = 0) {
  const d = new Date(date)
  d.setHours(hour, minute, 0, 0)
  return toDatetimeLocal(d.toISOString())
}
