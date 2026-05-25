'use client'

import type { AppointmentDraft } from '@/lib/appointment-draft'
import type { AppointmentStatus, ClientUserPublic } from '@/lib/types'

export type { AppointmentDraft }

type AppointmentFormProps = {
  draft: AppointmentDraft
  users: ClientUserPublic[]
  onChange: (draft: AppointmentDraft) => void
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
}

export function AppointmentForm({
  draft,
  users,
  onChange,
  onSave,
  onCancel,
  onDelete,
}: AppointmentFormProps) {
  return (
    <div className="appointment-form">
      <h2 className="appointment-form__title">
        {draft.isNew ? 'New appointment' : 'Edit appointment'}
      </h2>
      <div className="form-field">
        <label>Client</label>
        <select
          value={draft.userId}
          onChange={(e) => onChange({ ...draft, userId: e.target.value })}
        >
          <option value="">Select client…</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.displayName} ({u.username})
            </option>
          ))}
        </select>
      </div>
      <div className="form-field">
        <label>Title</label>
        <input
          value={draft.title}
          onChange={(e) => onChange({ ...draft, title: e.target.value })}
          dir="ltr"
          autoComplete="off"
        />
      </div>
      <div className="form-field">
        <label>Date & time</label>
        <input
          type="datetime-local"
          value={draft.scheduledAtLocal}
          onChange={(e) => onChange({ ...draft, scheduledAtLocal: e.target.value })}
        />
      </div>
      <div className="form-field">
        <label>Status</label>
        <select
          value={draft.status}
          onChange={(e) =>
            onChange({ ...draft, status: e.target.value as AppointmentStatus })
          }
        >
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="form-field">
        <label>Location</label>
        <input
          value={draft.location}
          onChange={(e) => onChange({ ...draft, location: e.target.value })}
          placeholder="Address or site name"
          dir="ltr"
          autoComplete="off"
        />
      </div>
      <div className="appointment-form__actions">
        <button type="button" className="btn-primary" onClick={onSave}>
          Save
        </button>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        {!draft.isNew && onDelete && (
          <button type="button" className="btn-secondary appointment-form__delete" onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
