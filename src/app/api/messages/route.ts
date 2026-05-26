import { NextResponse } from 'next/server'
import { getCurrentClientUser, isAdminAuthenticated } from '@/lib/auth'
import { createClientMessage, postedAtFromDateInput } from '@/lib/messages-mutate'
import { loadMessages, saveMessages } from '@/lib/messages-store'

export async function GET() {
  const admin = await isAdminAuthenticated()
  const user = await getCurrentClientUser()

  if (!admin && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const all = await loadMessages()
  const sorted = [...all].sort((a, b) => b.postedAt.localeCompare(a.postedAt))

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

  const body = (await request.json()) as {
    title?: string
    content?: string
    postedAt?: string
    date?: string
  }

  const title = body.title?.trim()
  const content = body.content?.trim()

  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!content) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  const postedAt = body.postedAt
    ? postedAtFromDateInput(body.postedAt.slice(0, 10))
    : postedAtFromDateInput(body.date ?? '')

  const message = createClientMessage({
    userId: user.id,
    authorName: user.displayName,
    title,
    content,
    postedAt,
  })

  const messages = await loadMessages()
  messages.push(message)
  await saveMessages(messages)
  return NextResponse.json(message, { status: 201 })
}
