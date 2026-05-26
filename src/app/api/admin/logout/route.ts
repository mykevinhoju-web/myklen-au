import { NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/auth'

/** Always redirect on the same host/port the user used (e.g. :3001 in dev). */
export async function POST(request: Request) {
  const res = NextResponse.redirect(new URL('/', request.url))
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
