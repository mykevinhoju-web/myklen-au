import { NextResponse } from 'next/server'
import { storageErrorResponse } from '@/lib/api-error'
import { getCurrentClientUser, isAdminAuthenticated } from '@/lib/auth'
import { loadAppointments, saveAppointments } from '@/lib/appointments-store'
import { normalizeAppointment } from '@/lib/appointment-notes'
import { findClientUserById } from '@/lib/client-users-store'
import type { CleaningAppointment } from '@/lib/types'

export async function GET() {
  const admin = await isAdminAuthenticated()
  const user = await getCurrentClientUser()

  if (!admin && !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const all = await loadAppointments()
    const sorted = [...all].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))

    if (admin) {
      return NextResponse.json(sorted)
    }

    return NextResponse.json(sorted.filter((a) => a.userId === user!.id))
  } catch (error) {
    return storageErrorResponse(error)
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as {
    userId?: string
    title?: string
    scheduledAt?: string
    status?: CleaningAppointment['status']
    location?: string
    notes?: string
  }

  if (!body.userId || !body.title?.trim() || !body.scheduledAt) {
    return NextResponse.json(
      { error: 'Client, title and date/time required' },
      { status: 400 },
    )
  }

  const client = await findClientUserById(body.userId)
  if (!client) {
    return NextResponse.json({ error: 'Client not found' }, { status: 404 })
  }

  const appointment: CleaningAppointment = {
    id: `apt-${Date.now()}`,
    userId: body.userId,
    title: body.title.trim(),
    scheduledAt: body.scheduledAt,
    status: body.status ?? 'scheduled',
    location: body.location?.trim() ?? '',
    visitThread: [],
    notes: '',
    clientNote: '',
    clientNoteReadByAdmin: true,
    adminNoteReadByClient: true,
    createdAt: new Date().toISOString(),
  }

  try {
    const appointments = await loadAppointments()
    appointments.push(appointment)
    await saveAppointments(appointments)
    return NextResponse.json(normalizeAppointment(appointment), { status: 201 })
  } catch (error) {
    return storageErrorResponse(error)
  }
}
