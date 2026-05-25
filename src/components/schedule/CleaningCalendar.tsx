'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  buildMonthGrid,
  dateKeyInBrisbane,
  groupAppointmentsByDay,
  monthLabel,
} from '@/lib/calendar-utils'
import {
  showAlertForAdmin,
  showAlertForClient,
} from '@/lib/appointment-notes'
import type { CleaningAppointment, ClientUserPublic } from '@/lib/types'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

type CleaningCalendarProps = {
  appointments: CleaningAppointment[]
  mode: 'admin' | 'client'
  usersById?: Record<string, ClientUserPublic>
  onDayClick?: (date: Date) => void
  onAppointmentClick?: (appointment: CleaningAppointment) => void
  selectedAppointmentId?: string | null
}

export function CleaningCalendar({
  appointments,
  mode,
  usersById = {},
  onDayClick,
  onAppointmentClick,
  selectedAppointmentId,
}: CleaningCalendarProps) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [autoMonthDone, setAutoMonthDone] = useState(false)
  /** Client calendar: which grid row/column to enlarge on hover (that date's cross). */
  const [hoverLine, setHoverLine] = useState<{ row: number; col: number } | null>(null)
  const hoverLineRef = useRef<{ row: number; col: number } | null>(null)

  function enterHoverCell(row: number, col: number) {
    const prev = hoverLineRef.current
    if (prev?.row === row && prev?.col === col) return
    hoverLineRef.current = { row, col }
    setHoverLine({ row, col })
  }

  function clearHoverLine() {
    if (!hoverLineRef.current) return
    hoverLineRef.current = null
    setHoverLine(null)
  }

  const days = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])
  const byDay = useMemo(() => groupAppointmentsByDay(appointments), [appointments])
  const hasVisitsThisMonth = useMemo(
    () => days.some((day) => day.inMonth && (byDay.get(day.dateKey) ?? []).length > 0),
    [days, byDay],
  )

  useEffect(() => {
    if (autoMonthDone || appointments.length === 0) return
    const map = groupAppointmentsByDay(appointments)
    const inMonth = buildMonthGrid(viewYear, viewMonth).some(
      (day) => day.inMonth && (map.get(day.dateKey) ?? []).length > 0,
    )
    if (inMonth) {
      setAutoMonthDone(true)
      return
    }
    const earliest = [...appointments].sort((a, b) =>
      a.scheduledAt.localeCompare(b.scheduledAt),
    )[0]
    const key = dateKeyInBrisbane(earliest.scheduledAt)
    const [y, m] = key.split('-').map(Number)
    setViewYear(y)
    setViewMonth(m - 1)
    setAutoMonthDone(true)
  }, [appointments, autoMonthDone, viewYear, viewMonth])

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  function hasAlert(apt: CleaningAppointment) {
    return mode === 'admin' ? showAlertForAdmin(apt) : showAlertForClient(apt)
  }

  function eventTitle(apt: CleaningAppointment) {
    const title = apt.title.trim()
    return title || 'Cleaning visit'
  }

  function eventSub(apt: CleaningAppointment) {
    if (mode === 'admin') {
      return usersById[apt.userId]?.displayName ?? 'Client'
    }
    return null
  }

  const calendarClass = [
    'schedule-calendar',
    mode === 'client' && 'schedule-calendar--client',
    mode === 'admin' && 'schedule-calendar--admin',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={calendarClass}>
      <div className="schedule-calendar__scroll">
        <div className="schedule-calendar__toolbar">
          <button type="button" className="btn-secondary" onClick={prevMonth} aria-label="Previous month">
            ‹
          </button>
          <h2 className="schedule-calendar__month">{monthLabel(viewYear, viewMonth)}</h2>
          <button type="button" className="btn-secondary" onClick={nextMonth} aria-label="Next month">
            ›
          </button>
        </div>

        <div className="schedule-calendar__body">
          <div className="schedule-calendar__weekdays">
            {WEEKDAYS.map((d, col) => (
              <div
                key={d}
                className={[
                  'schedule-calendar__weekday',
                  mode === 'client' &&
                    hoverLine?.col === col &&
                    'schedule-calendar__weekday--hover-col',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {d}
              </div>
            ))}
          </div>

          <div
            className="schedule-calendar__grid"
            onMouseLeave={mode === 'client' ? clearHoverLine : undefined}
          >
          {days.map((day, index) => {
            const events = byDay.get(day.dateKey) ?? []
            const clickable = day.inMonth && !!onDayClick
            const dayHasUnreadNote = events.some(hasAlert)
            const row = Math.floor(index / 7)
            const col = index % 7
            const inHoverRow = mode === 'client' && hoverLine?.row === row
            const inHoverCol = mode === 'client' && hoverLine?.col === col

            return (
              <div
                key={day.dateKey}
                className={[
                  'schedule-calendar__cell',
                  !day.inMonth && 'schedule-calendar__cell--outside',
                  day.isToday && 'schedule-calendar__cell--today',
                  clickable && 'schedule-calendar__cell--clickable',
                  dayHasUnreadNote && 'schedule-calendar__cell--alert',
                  inHoverRow && 'schedule-calendar__cell--hover-row',
                  inHoverCol && 'schedule-calendar__cell--hover-col',
                  inHoverRow && inHoverCol && 'schedule-calendar__cell--hover-cross',
                ]
                  .filter(Boolean)
                  .join(' ')}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                onMouseEnter={
                  mode === 'client' ? () => enterHoverCell(row, col) : undefined
                }
                onClick={() => {
                  if (clickable) onDayClick(day.date)
                }}
                onKeyDown={(e) => {
                  if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onDayClick(day.date)
                  }
                }}
              >
                <span className="schedule-calendar__date">{day.date.getDate()}</span>
                <ul className="schedule-calendar__events">
                  {events.map((apt) => {
                    const alert = hasAlert(apt)
                    const title = eventTitle(apt)
                    const sub = eventSub(apt)
                    return (
                      <li key={apt.id}>
                        <button
                          type="button"
                          className={[
                            'schedule-calendar__event',
                            `schedule-calendar__event--${apt.status}`,
                            alert && 'schedule-calendar__event--alert',
                            selectedAppointmentId === apt.id && 'schedule-calendar__event--selected',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={(e) => {
                            e.stopPropagation()
                            onAppointmentClick?.(apt)
                          }}
                          aria-label={
                            alert ? `${title} — new note` : sub ? `${title} (${sub})` : title
                          }
                        >
                          {alert && (
                            <span className="schedule-calendar__alert" aria-hidden>
                              !
                            </span>
                          )}
                          <span className="schedule-calendar__event-label">{title}</span>
                          {sub && <span className="schedule-calendar__event-sub">{sub}</span>}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}
          </div>
        </div>
      </div>

      {appointments.length > 0 && !hasVisitsThisMonth && (
        <p className="schedule-calendar__hint schedule-calendar__hint--warn">
          Visits are in another month — use ‹ › above to find them.
        </p>
      )}

      {mode === 'admin' && onDayClick && (
        <p className="schedule-calendar__hint">
          Click a day or visit to read notes for that date. Empty day = add a visit.{' '}
          <strong>!</strong> = unread client note (clears when you open that visit).
        </p>
      )}
      {mode === 'client' && (
        <p className="schedule-calendar__hint">
          Click a day or visit to see notes for that date only. Hover a day to enlarge its row
          and column.{' '}
          <strong>!</strong> = new reply from your manager (clears when you open that visit).
        </p>
      )}
    </div>
  )
}

export function appointmentMatchesDay(apt: CleaningAppointment, date: Date) {
  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return dateKeyInBrisbane(apt.scheduledAt) === key
}
