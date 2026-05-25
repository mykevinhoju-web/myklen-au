import { NextResponse } from 'next/server'
import { getCurrentClientUser } from '@/lib/auth'

export async function GET() {
  const user = await getCurrentClientUser()
  if (!user) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 })
  }
  return NextResponse.json({ user })
}
