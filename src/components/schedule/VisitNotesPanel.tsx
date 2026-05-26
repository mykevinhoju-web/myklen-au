'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { formatSchedule, statusLabel } from '@/lib/format-datetime'
import {
  hasUnreadAdminNote,
  hasUnreadClientNote,
} from '@/lib/appointment-notes'
import { buildVisitThread } from '@/lib/visit-thread'
import type { CleaningAppointment } from '@/lib/types'

type VisitNotesPanelProps = {
  appointment: CleaningAppointment
  mode: 'admin' | 'client'
  /** Admin view: client name shown in header and on client messages */
  clientDisplayName?: string
  onUpdated: (apt: CleaningAppointment) => void
  onEditSchedule?: () => void
}

function threadAuthorLabel(
  author: 'client' | 'admin',
  mode: 'admin' | 'client',
  clientDisplayName?: string,
): string {
  if (author === 'admin') return 'Admin'
  if (mode === 'client') return 'You'
  return clientDisplayName ?? 'Client'
}

export function VisitNotesPanel({
  appointment,
  mode,
  clientDisplayName,
  onUpdated,
  onEditSchedule,
}: VisitNotesPanelProps) {
  const thread = useMemo(
    () => buildVisitThread(appointment),
    [appointment.id, appointment.visitThread, appointment.clientNote, appointment.notes],
  )

  const statusBadgeClass =
    appointment.status === 'cancelled'
      ? 'account-badge--cancelled'
      : appointment.status === 'completed'
        ? 'account-badge--completed'
        : 'account-badge--scheduled'

  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const onUpdatedRef = useRef(onUpdated)
  onUpdatedRef.current = onUpdated

  const markedReadForIdRef = useRef<string | null>(null)

  useEffect(() => {
    setDraft('')
    setError(null)
    markedReadForIdRef.current = null
  }, [appointment.id])

  const unreadAdminReply = hasUnreadAdminNote(appointment)
  const unreadClientNote = hasUnreadClientNote(appointment)

  useEffect(() => {
    const shouldMark =
      (mode === 'client' && unreadAdminReply) || (mode === 'admin' && unreadClientNote)
    if (!shouldMark) return
    if (markedReadForIdRef.current === appointment.id) return

    const body =
      mode === 'client'
        ? { markAdminNoteRead: true }
        : { markClientNoteRead: true }

    let cancelled = false
    markedReadForIdRef.current = appointment.id

    fetch(`/api/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (res.ok && !cancelled) onUpdatedRef.current(await res.json())
      })
      .catch(() => {
        if (!cancelled) markedReadForIdRef.current = null
      })

    return () => {
      cancelled = true
    }
  }, [appointment.id, mode, unreadAdminReply, unreadClientNote])

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await fetch(`/api/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ addMessage: draft }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Could not send')
      return
    }
    onUpdatedRef.current((await res.json()) as CleaningAppointment)
    setDraft('')
  }

  async function deleteMessage(messageId: string) {
    setSaving(true)
    setError(null)
    const res = await fetch(`/api/appointments/${appointment.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deleteMessageId: messageId }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = (await res.json()) as { error?: string }
      setError(data.error ?? 'Could not delete')
      return
    }
    onUpdatedRef.current((await res.json()) as CleaningAppointment)
  }

  const canDelete = (author: 'client' | 'admin') =>
    mode === 'client' ? author === 'client' : author === 'admin'

  return (
    <section className="schedule-page__panel visit-notes-panel">
      <header className="visit-notes-panel__head">
        <div className="visit-notes-panel__head-row">
          <div className="visit-notes-panel__title-wrap">
            <h2 className="visit-notes-panel__title">{appointment.title}</h2>
            {mode === 'admin' && clientDisplayName ? (
              <p className="visit-notes-panel__client-name">{clientDisplayName}</p>
            ) : null}
          </div>
          {mode === 'admin' && onEditSchedule && (
            <button type="button" className="visit-notes-panel__edit-link" onClick={onEditSchedule}>
              Edit schedule
            </button>
          )}
        </div>
        <p className="visit-notes-panel__meta">
          {formatSchedule(appointment.scheduledAt)}
          <span className={['account-badge ml-3', statusBadgeClass].join(' ')}>
            {statusLabel(appointment.status)}
          </span>
        </p>
      </header>

      <ul className="visit-thread">
        {thread.length === 0 && (
          <li className="visit-thread__empty">No messages yet.</li>
        )}
        {thread.map((msg) => {
          const label = threadAuthorLabel(msg.author, mode, clientDisplayName)
          const isAdminMsg = msg.author === 'admin'

          return (
            <li
              key={msg.id}
              className={[
                'visit-thread__item',
                isAdminMsg && 'visit-thread__item--reply',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <div className="visit-thread__content">
                <div className="visit-thread__meta">
                  <p className="visit-thread__text">{msg.body}</p>
                  <span
                    className={[
                      'visit-thread__author',
                      isAdminMsg && 'visit-thread__author--admin',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {label}
                  </span>
                </div>
              </div>
              {canDelete(msg.author) && (
                <button
                  type="button"
                  className="visit-thread__del"
                  onClick={() => deleteMessage(msg.id)}
                  disabled={saving}
                >
                  del
                </button>
              )}
            </li>
          )
        })}
      </ul>

      <form className="visit-thread__compose" onSubmit={sendMessage}>
        <textarea
          className="visit-thread__input"
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={mode === 'client' ? 'Leave a message' : 'Reply'}
          dir="ltr"
          required
        />
        {error && <p className="visit-thread__error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={saving || !draft.trim()}>
          {saving ? '…' : 'Send'}
        </button>
      </form>
    </section>
  )
}
