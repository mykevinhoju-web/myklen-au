import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, cookieOptions, getAdminCredentials } from '@/lib/auth'

export async function POST(request: Request) {
  const body = (await request.json()) as { username?: string; password?: string }
  const { username, password } = getAdminCredentials()

  if (body.username !== username || body.password !== password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '1', cookieOptions)
  return res
}
