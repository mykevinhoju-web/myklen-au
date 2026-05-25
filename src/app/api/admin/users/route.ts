import { NextResponse } from 'next/server'
import { isAdminAuthenticated, toPublicClientUser } from '@/lib/auth'
import { loadClientUsers, saveClientUsers } from '@/lib/client-users-store'
import { hashPassword } from '@/lib/password'
import type { ClientUser } from '@/lib/types'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const users = await loadClientUsers()
  return NextResponse.json(users.map(toPublicClientUser))
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as {
    username?: string
    password?: string
    displayName?: string
    active?: boolean
  }

  const username = body.username?.trim().toLowerCase()
  const password = body.password
  const displayName = body.displayName?.trim()

  if (!username || !password || password.length < 4) {
    return NextResponse.json(
      { error: 'Username and password (min 4 characters) required' },
      { status: 400 },
    )
  }

  if (!displayName) {
    return NextResponse.json({ error: 'Display name required' }, { status: 400 })
  }

  const users = await loadClientUsers()
  if (users.some((u) => u.username === username)) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
  }

  const user: ClientUser = {
    id: `user-${Date.now()}`,
    username,
    passwordHash: await hashPassword(password),
    displayName,
    active: body.active !== false,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  await saveClientUsers(users)
  return NextResponse.json(toPublicClientUser(user), { status: 201 })
}
