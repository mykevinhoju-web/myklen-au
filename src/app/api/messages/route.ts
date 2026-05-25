import { NextResponse } from 'next/server'
import { getCurrentClientUser, isAdminAuthenticated } from '@/lib/auth'
import { loadMessages, saveMessages } from '@/lib/messages-store'
import type { ClientMessage } from '@/lib/types'

export async function GET() {
  const admin = await isAdminAuthenticated()
  const user = await getCurrentClientUser()

  if (!admin && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const all = await loadMessages()
  const sorted = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  if (admin) {
    return NextResponse.json(sorted)
  }

  return NextResponse.json(sorted.filter((m) => m.userId === user!.id))
}

export async function POST(request: Request) {
  const user = await getCurrentClientUser()
  if (!user) {
    return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  }

  const body = (await request.json()) as { subject?: string; body?: string }
  const text = body.body?.trim()

  if (!text) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const message: ClientMessage = {
    id: `msg-${Date.now()}`,
    userId: user.id,
    subject: body.subject?.trim() || 'Note for myklen',
    body: text,
    createdAt: new Date().toISOString(),
    readByAdmin: false,
  }

  const messages = await loadMessages()
  messages.push(message)
  await saveMessages(messages)
  return NextResponse.json(message, { status: 201 })
}
