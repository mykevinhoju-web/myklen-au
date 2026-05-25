import { NextResponse } from 'next/server'
import { isAdminAuthenticated, toPublicClientUser } from '@/lib/auth'
import { loadClientUsers, saveClientUsers } from '@/lib/client-users-store'
import { hashPassword } from '@/lib/password'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json()) as {
    username?: string
    password?: string
    displayName?: string
    active?: boolean
  }

  const users = await loadClientUsers()
  const index = users.findIndex((u) => u.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const current = users[index]

  if (body.username !== undefined) {
    const username = body.username.trim().toLowerCase()
    if (!username) {
      return NextResponse.json({ error: 'Username required' }, { status: 400 })
    }
    if (users.some((u) => u.username === username && u.id !== id)) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
    }
    current.username = username
  }

  if (body.displayName !== undefined) {
    const displayName = body.displayName.trim()
    if (!displayName) {
      return NextResponse.json({ error: 'Display name required' }, { status: 400 })
    }
    current.displayName = displayName
  }

  if (body.password !== undefined && body.password.length > 0) {
    if (body.password.length < 4) {
      return NextResponse.json(
        { error: 'Password must be at least 4 characters' },
        { status: 400 },
      )
    }
    current.passwordHash = await hashPassword(body.password)
  }

  if (body.active !== undefined) {
    current.active = body.active
  }

  users[index] = current
  await saveClientUsers(users)
  return NextResponse.json(toPublicClientUser(current))
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const users = await loadClientUsers()
  const next = users.filter((u) => u.id !== id)
  if (next.length === users.length) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }
  await saveClientUsers(next)
  return NextResponse.json({ ok: true })
}
