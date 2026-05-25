'use client'

import { useCallback, useEffect, useState } from 'react'
import { CleaningCalendar } from '@/components/schedule/CleaningCalendar'
import { VisitNotesPanel } from '@/components/schedule/VisitNotesPanel'
import { ClientLogout } from '@/components/ClientLogout'
import { hasUnreadAdminNote } from '@/lib/appointment-notes'
import { dateKeyFromYMD, pickVisitOnDay } from '@/lib/calendar-utils'
import type { CleaningAppointment, ClientUserPublic } from '@/lib/types'

export default function CustomerAccountPage() {
  const [user, setUser] = useState<ClientUserPublic | null>(null)
  const [appointments, setAppointments] = useState<CleaningAppointment[]>([])
  const [selected, setSelected] = useState<CleaningAppointment | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const meRes = await fetch('/api/auth/me')
      if (!meRes.ok) {
        window.location.href = '/customer/login?from=/customer/account'
        return
      }
      const me = (await meRes.json()) as { user: ClientUserPublic }
      setUser(me.user)

      const aptRes = await fetch('/api/appointments')
      const apts: CleaningAppointment[] = aptRes.ok ? await aptRes.json() : []
      setAppointments(apts)
      setSelected((prev) => {
        if (!prev) return null
        return apts.find((a) => a.id === prev.id) ?? null
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleAppointmentUpdated = useCallback((apt: CleaningAppointment) => {
    setAppointments((list) => list.map((a) => (a.id === apt.id ? apt : a)))
    setSelected(apt)
  }, [])

  const selectDay = useCallback(
    (date: Date) => {
      const dateKey = dateKeyFromYMD(date.getFullYear(), date.getMonth(), date.getDate())
      const visit = pickVisitOnDay(appointments, dateKey, hasUnreadAdminNote)
      setSelected(visit)
    },
    [appointments],
  )

  const selectVisit = useCallback((apt: CleaningAppointment) => {
    setSelected(apt)
  }, [])

  if (loading) {
    return (
      <div className="page page-narrow">
        <p className="lead">Loading your account…</p>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="schedule-page__header">
        <div>
          <p className="eyebrow">My page</p>
          <h1 className="display-title text-3xl" style={{ marginBottom: '8px' }}>
            Hello, {user?.displayName}
          </h1>
          <p className="lead" style={{ margin: 0 }}>
            Tap a day or visit on the calendar — only that visit&apos;s notes appear below.
          </p>
        </div>
        <ClientLogout />
      </div>

      <section className="customer-calendar-section">
        <h2 className="display-title mb-3 text-xl">Your cleaning calendar</h2>
        <CleaningCalendar
          appointments={appointments}
          mode="client"
          selectedAppointmentId={selected?.id ?? null}
          onDayClick={selectDay}
          onAppointmentClick={selectVisit}
        />
      </section>

      {selected ? (
        <VisitNotesPanel
          key={selected.id}
          appointment={selected}
          mode="client"
          onUpdated={handleAppointmentUpdated}
        />
      ) : (
        <p className="mt-6 text-sm text-[#5c5c5c]">
          Select a visit on the calendar to read your manager&apos;s reply or leave a note.
        </p>
      )}

      {appointments.length === 0 && (
        <p className="mb-10 text-sm text-[#5c5c5c]">
          No cleaning visits scheduled yet. Your manager will add dates here.
        </p>
      )}
    </div>
  )
}
