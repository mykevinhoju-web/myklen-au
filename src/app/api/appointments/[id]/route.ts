import { NextResponse } from 'next/server'
import { getCurrentClientUser, isAdminAuthenticated } from '@/lib/auth'
import { loadAppointments, saveAppointments } from '@/lib/appointments-store'
import { normalizeAppointment } from '@/lib/appointment-notes'
import {
  buildVisitThread,
  newThreadMessage,
  syncLegacyNoteFields,
} from '@/lib/visit-thread'
import type { CleaningAppointment } from '@/lib/types'

type Params = { params: Promise<{ id: string }> }

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json()) as Partial<CleaningAppointment>

  const appointments = await loadAppointments()
  const index = appointments.findIndex((a) => a.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const current = appointments[index]

  if (body.userId !== undefined) current.userId = body.userId
  if (body.title !== undefined) current.title = body.title.trim()
  if (body.scheduledAt !== undefined) current.scheduledAt = body.scheduledAt
  if (body.status !== undefined) current.status = body.status
  if (body.location !== undefined) current.location = body.location.trim()

  appointments[index] = current
  await saveAppointments(appointments)
  return NextResponse.json(normalizeAppointment(current))
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params
  const body = (await request.json()) as {
    addMessage?: string
    deleteMessageId?: string
    markAdminNoteRead?: boolean
    markClientNoteRead?: boolean
  }

  const admin = await isAdminAuthenticated()
  const user = await getCurrentClientUser()
  if (!admin && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const appointments = await loadAppointments()
  const index = appointments.findIndex((a) => a.id === id)
  if (index === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const current = normalizeAppointment(appointments[index])

  if (!admin && current.userId !== user!.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let thread = buildVisitThread(current)

  if (body.addMessage !== undefined) {
    const text = body.addMessage.trim()
    if (!text) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (admin) {
      thread = [...thread, newThreadMessage('admin', text)]
      current.adminNoteReadByClient = false
    } else {
      thread = [...thread, newThreadMessage('client', text)]
      current.clientNoteReadByAdmin = false
    }
    syncLegacyNoteFields(current, thread)
  }

  if (body.deleteMessageId !== undefined) {
    const msg = thread.find((m) => m.id === body.deleteMessageId)
    if (!msg) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    if (msg.author === 'client') {
      if (!user || admin) {
        return NextResponse.json({ error: 'Clients only' }, { status: 403 })
      }
    } else if (!admin) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    thread = thread.filter((m) => m.id !== body.deleteMessageId)
    syncLegacyNoteFields(current, thread)

    if (!thread.some((m) => m.author === 'client')) {
      current.clientNoteReadByAdmin = true
    }
    if (!thread.some((m) => m.author === 'admin')) {
      current.adminNoteReadByClient = true
    }
  }

  if (body.markAdminNoteRead === true) {
    if (!user || admin) {
      return NextResponse.json({ error: 'Clients only' }, { status: 403 })
    }
    current.adminNoteReadByClient = true
  }

  if (body.markClientNoteRead === true) {
    if (!admin) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }
    current.clientNoteReadByAdmin = true
  }

  appointments[index] = current
  await saveAppointments(appointments)
  return NextResponse.json(normalizeAppointment(current))
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const appointments = await loadAppointments()
  const next = appointments.filter((a) => a.id !== id)
  if (next.length === appointments.length) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  await saveAppointments(next)
  return NextResponse.json({ ok: true })
}
