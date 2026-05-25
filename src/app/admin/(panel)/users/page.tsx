'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ClientUserPublic } from '@/lib/types'

type Draft = {
  id: string
  username: string
  password: string
  displayName: string
  active: boolean
  isNew: boolean
}

function emptyDraft(): Draft {
  return {
    id: `new-${Date.now()}`,
    username: '',
    password: '',
    displayName: '',
    active: true,
    isNew: true,
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ClientUserPublic[]>([])
  const [draft, setDraft] = useState<Draft | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/users')
    if (res.ok) setUsers(await res.json())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function save() {
    if (!draft) return
    setMessage(null)

    if (!draft.username.trim() || !draft.displayName.trim()) {
      setMessage('Username and display name are required')
      return
    }
    if (draft.isNew && !draft.password.trim()) {
      setMessage('Password is required for new clients')
      return
    }

    if (draft.isNew) {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: draft.username.trim(),
          password: draft.password,
          displayName: draft.displayName.trim(),
          active: draft.active,
        }),
      })
      if (!res.ok) {
        const err = (await res.json()) as { error?: string }
        setMessage(err.error ?? 'Save failed')
        return
      }
    } else {
      const res = await fetch(`/api/admin/users/${draft.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: draft.username.trim(),
          password: draft.password || undefined,
          displayName: draft.displayName.trim(),
          active: draft.active,
        }),
      })
      if (!res.ok) {
        const err = (await res.json()) as { error?: string }
        setMessage(err.error ?? 'Save failed')
        return
      }
    }

    setMessage('Saved')
    setDraft(null)
    load()
  }

  async function remove(id: string) {
    if (!confirm('Delete this client account?')) return
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    setDraft(null)
    load()
  }

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Client logins</h1>
          <p className="admin-page-lead">
            Clients use <strong className="text-slate-200">/customer/login</strong> to see their
            calendar and send you messages.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setDraft(emptyDraft())}>
          Add client
        </button>
      </div>

      {message && <p className="admin-feedback">{message}</p>}

      {draft && (
        <div key={draft.id} className="admin-surface mb-8">
          <h2 className="admin-surface__title">{draft.isNew ? 'New client' : 'Edit client'}</h2>
          <div className="form-field">
            <label htmlFor="client-username">Username</label>
            <input
              id="client-username"
              name="username"
              value={draft.username}
              onChange={(e) => setDraft({ ...draft, username: e.target.value })}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              dir="ltr"
            />
          </div>
          <div className="form-field">
            <label htmlFor="client-display-name">Display name</label>
            <input
              id="client-display-name"
              name="displayName"
              value={draft.displayName}
              onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
              autoComplete="name"
              dir="ltr"
            />
          </div>
          <div className="form-field">
            <label htmlFor="client-password">
              {draft.isNew ? 'Password' : 'New password (leave blank to keep)'}
            </label>
            <input
              id="client-password"
              name="password"
              type="password"
              value={draft.password}
              onChange={(e) => setDraft({ ...draft, password: e.target.value })}
              autoComplete={draft.isNew ? 'new-password' : 'off'}
              dir="ltr"
            />
          </div>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
            />
            Account active
          </label>
          <div className="admin-form-actions">
            <button type="button" className="btn-primary" onClick={save}>
              Save
            </button>
            <button type="button" className="btn-secondary" onClick={() => setDraft(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <p className="admin-page-lead">No clients yet. Click Add client to create the first login.</p>
      ) : (
        <table className="admin-data-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Name</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.displayName}</td>
                <td>{u.active ? 'Active' : 'Disabled'}</td>
                <td className="admin-table-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ marginRight: '0.5rem' }}
                    onClick={() =>
                      setDraft({
                        id: u.id,
                        username: u.username,
                        password: '',
                        displayName: u.displayName,
                        active: u.active,
                        isNew: false,
                      })
                    }
                  >
                    Edit
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => remove(u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
