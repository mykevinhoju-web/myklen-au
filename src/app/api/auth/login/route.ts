import { NextResponse } from 'next/server'
import {
  CLIENT_USER_COOKIE,
  createClientSessionToken,
  clientUserCookieOptions,
  toPublicClientUser,
} from '@/lib/auth'
import { findClientUserByUsername } from '@/lib/client-users-store'
import { verifyPassword } from '@/lib/password'

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string }
  const username = body.username?.trim()
  const password = body.password

  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
  }

  const user = await findClientUserByUsername(username)
  if (!user || !user.active) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  const valid = await verifyPassword(password, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true, user: toPublicClientUser(user) })
  res.cookies.set(CLIENT_USER_COOKIE, await createClientSessionToken(user.id), clientUserCookieOptions)
  return res
}
