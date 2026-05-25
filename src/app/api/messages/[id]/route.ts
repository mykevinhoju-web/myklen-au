import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { loadMessages, saveMessages } from '@/lib/messages-store'

type Params = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json()) as { readByAdmin?: boolean }

  const messages = await loadMessages()
  const index = messages.findIndex((m) => m.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (body.readByAdmin !== undefined) {
    messages[index].readByAdmin = body.readByAdmin
  }

  await saveMessages(messages)
  return NextResponse.json(messages[index])
}
