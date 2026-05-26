'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppointmentForm } from '@/components/schedule/AppointmentForm'
import { CleaningCalendar } from '@/components/schedule/CleaningCalendar'
import { VisitNotesPanel } from '@/components/schedule/VisitNotesPanel'
import {
  draftFromAppointment,
  draftToPayload,
  emptyAppointmentDraft,
  type AppointmentDraft,
} from '@/lib/appointment-draft'
import { showAlertForAdmin } from '@/lib/appointment-notes'
import { dateKeyFromYMD, pickVisitOnDay } from '@/lib/calendar-utils'
import type { CleaningAppointment, ClientUserPublic } from '@/lib/types'

type ScheduleView =
  | { kind: 'idle' }
  | { kind: 'thread'; visitId: string }
  | { kind: 'edit'; draft: AppointmentDraft }

export default function AdminAppointmentsPage() {
  const [users, setUsers] = useState<ClientUserPublic[]>([])
  const [appointments, setAppointments] = useState<CleaningAppointment[]>([])
  const [view, setView] = useState<ScheduleView>({ kind: 'idle' })
  const [message, setMessage] = useState<string | null>(null)

  const usersById = useMemo(() => {
    const map: Record<string, ClientUserPublic> = {}
    for (const u of users) map[u.id] = u
    return map
  }, [users])

  const load = useCallback(async () => {
    const [usersRes, aptRes] = await Promise.all([
      fetch('/api/admin/users'),
      fetch('/api/appointments'),
    ])
    if (usersRes.ok) setUsers(await usersRes.json())
    if (aptRes.ok) setAppointments(await aptRes.json())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const threadVisit = useMemo(() => {
    if (view.kind !== 'thread') return null
    return appointments.find((a) => a.id === view.visitId) ?? null
  }, [appointments, view])

  const editDraft = view.kind === 'edit' ? view.draft : null
  const selectedId =
    view.kind === 'thread' ? view.visitId : view.kind === 'edit' && !view.draft.isNew ? view.draft.id : null

  function openThread(apt: CleaningAppointment) {
    setView({ kind: 'thread', visitId: apt.id })
  }

  function openEdit(apt: CleaningAppointment) {
    setView({ kind: 'edit', draft: draftFromAppointment(apt) })
  }

  function openNewDraft(date?: Date) {
    setView({ kind: 'edit', draft: emptyAppointmentDraft(date) })
  }

  const handleAppointmentUpdated = useCallback((apt: CleaningAppointment) => {
    setAppointments((list) => list.map((a) => (a.id === apt.id ? apt : a)))
  }, [])

  async function save() {
    if (view.kind !== 'edit') return
    const draft = view.draft
    setMessage(null)

    if (!draft.userId || !draft.title.trim()) {
      setMessage('Client and title are required')
      return
    }

    const payload = draftToPayload(draft)

    const res = await fetch(
      draft.isNew ? '/api/appointments' : `/api/appointments/${draft.id}`,
      {
        method: draft.isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    )
    if (!res.ok) {
      const err = (await res.json()) as { error?: string }
      setMessage(err.error ?? 'Save failed')
      return
    }

    const saved = (await res.json()) as CleaningAppointment
    setAppointments((list) => {
      if (draft.isNew) {
        return [...list, saved].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
      }
      return list.map((a) => (a.id === saved.id ? saved : a))
    })

    setMessage('Saved')
    setView({ kind: 'idle' })
  }

  async function remove(id: string) {
    if (!confirm('Delete this appointment?')) return
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    setAppointments((list) => list.filter((a) => a.id !== id))
    setView({ kind: 'idle' })
  }

  function selectDay(date: Date) {
    const dateKey = dateKeyFromYMD(date.getFullYear(), date.getMonth(), date.getDate())
    const visit = pickVisitOnDay(appointments, dateKey, showAlertForAdmin)
    if (visit) {
      openThread(visit)
    } else {
      openNewDraft(date)
    }
  }

  const unreadClientNotes = appointments.filter(showAlertForAdmin).length

  return (
    <div>
      <div className="schedule-page__header">
        <div>
          <h1 className="admin-page-title">Cleaning schedule</h1>
          <p className="admin-page-lead">
            Click a day or visit for messages. Empty day = new visit. <strong>!</strong> = unread
            (clears when opened).
            {unreadClientNotes > 0 && (
              <>
                {' '}
                <span className="text-amber-300">{unreadClientNotes} unread</span>
              </>
            )}
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openNewDraft()}
          disabled={users.length === 0}
        >
          Add appointment
        </button>
      </div>

      {users.length === 0 && (
        <p className="admin-page-lead mb-6">
          Create a client under <strong className="text-slate-200">Clients</strong> before scheduling
          visits.
        </p>
      )}

      {message && <p className="admin-feedback">{message}</p>}

      <div className="admin-schedule-surface">
        <CleaningCalendar
          appointments={appointments}
          mode="admin"
          usersById={usersById}
          selectedAppointmentId={selectedId}
          onDayClick={selectDay}
          onAppointmentClick={openThread}
        />

        <div className="admin-schedule-detail">
          {view.kind === 'thread' && threadVisit && (
            <VisitNotesPanel
              key={`thread-${threadVisit.id}`}
              appointment={threadVisit}
              mode="admin"
              clientDisplayName={
                usersById[threadVisit.userId]?.displayName ??
                usersById[threadVisit.userId]?.username
              }
              onUpdated={handleAppointmentUpdated}
              onEditSchedule={() => openEdit(threadVisit)}
            />
          )}

          {view.kind === 'edit' && editDraft && (
            <div key={`edit-${editDraft.id}`} className="schedule-page__panel">
              <AppointmentForm
                draft={editDraft}
                users={users}
                onChange={(next) => setView({ kind: 'edit', draft: next })}
                onSave={save}
                onCancel={() => {
                  if (editDraft.isNew) {
                    setView({ kind: 'idle' })
                  } else {
                    const apt = appointments.find((a) => a.id === editDraft.id)
                    if (apt) openThread(apt)
                    else setView({ kind: 'idle' })
                  }
                }}
                onDelete={editDraft.isNew ? undefined : () => remove(editDraft.id)}
              />
            </div>
          )}

          {view.kind === 'idle' && (
            <p className="admin-schedule-detail__hint">
              Select a day or visit on the calendar.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
