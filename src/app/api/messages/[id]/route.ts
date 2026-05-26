import { NextResponse } from 'next/server'
import { getCurrentClientUser, isAdminAuthenticated } from '@/lib/auth'
import { newMessageReply, postedAtFromDateInput } from '@/lib/messages-mutate'
import { loadMessages, saveMessages } from '@/lib/messages-store'

type Params = { params: Promise<{ id: string }> }

async function getAuthorizedMessage(id: string) {
  const admin = await isAdminAuthenticated()
  const user = await getCurrentClientUser()
  if (!admin && !user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const messages = await loadMessages()
  const index = messages.findIndex((m) => m.id === id)
  if (index === -1) {
    return { error: NextResponse.json({ error: 'Not found' }, { status: 404 }) }
  }

  const message = messages[index]
  if (!admin && message.userId !== user!.id) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { admin, user, messages, index, message }
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const result = await getAuthorizedMessage(id)
  if ('error' in result && result.error) return result.error
  return NextResponse.json(result.message)
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const result = await getAuthorizedMessage(id)
  if ('error' in result && result.error) return result.error

  const { admin, user, messages, index, message } = result
  const body = (await request.json()) as {
    readByAdmin?: boolean
    addReply?: string
    title?: string
    content?: string
    postedAt?: string
    date?: string
  }

  if (body.addReply !== undefined) {
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const text = body.addReply.trim()
    if (!text) {
      return NextResponse.json({ error: 'Reply is required' }, { status: 400 })
    }
    message.replies = [...message.replies, newMessageReply(text)]
    message.readByAdmin = true
  }

  if (body.readByAdmin !== undefined) {
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    message.readByAdmin = body.readByAdmin
  }

  if (body.title !== undefined || body.content !== undefined || body.postedAt !== undefined || body.date !== undefined) {
    if (admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    if (body.title !== undefined) {
      const title = body.title.trim()
      if (!title) {
        return NextResponse.json({ error: 'Title is required' }, { status: 400 })
      }
      message.title = title
    }
    if (body.content !== undefined) {
      const content = body.content.trim()
      if (!content) {
        return NextResponse.json({ error: 'Content is required' }, { status: 400 })
      }
      message.content = content
    }
    if (body.postedAt !== undefined || body.date !== undefined) {
      const dateVal = body.date ?? body.postedAt?.slice(0, 10) ?? ''
      message.postedAt = postedAtFromDateInput(dateVal)
    }
    message.authorName = user!.displayName
  }

  messages[index] = message
  await saveMessages(messages)
  return NextResponse.json(message)
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params
  const result = await getAuthorizedMessage(id)
  if ('error' in result && result.error) return result.error

  const { admin, user, messages, message } = result
  if (!admin && message.userId !== user!.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const next = messages.filter((m) => m.id !== id)
  await saveMessages(next)
  return NextResponse.json({ ok: true })
}
