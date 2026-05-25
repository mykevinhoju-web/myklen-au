import { NextResponse } from 'next/server'
import { CLIENT_USER_COOKIE } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(CLIENT_USER_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
