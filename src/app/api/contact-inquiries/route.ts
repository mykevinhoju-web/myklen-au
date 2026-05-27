import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { createContactInquiry, isValidEmail, isValidPhone } from '@/lib/contact-inquiries-mutate'
import { loadContactInquiries, saveContactInquiries } from '@/lib/contact-inquiries-store'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const all = await loadContactInquiries()
  const sorted = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return NextResponse.json(sorted)
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string
    email?: string
    phone?: string
    subject?: string
    message?: string
    date?: string
  }

  const name = body.name?.trim() ?? ''
  const email = body.email?.trim() ?? ''
  const phone = body.phone?.trim() ?? ''
  const subject = body.subject?.trim() ?? ''
  const message = body.message?.trim() ?? ''
  const date = body.date?.trim() ?? ''

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })
  if (!email || !isValidEmail(email)) return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  if (!phone || !isValidPhone(phone)) return NextResponse.json({ error: 'A valid phone is required' }, { status: 400 })
  if (!subject) return NextResponse.json({ error: 'Subject is required' }, { status: 400 })
  if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 })

  const inquiry = createContactInquiry({ name, email, phone, subject, message, date })

  const inquiries = await loadContactInquiries()
  inquiries.push(inquiry)
  await saveContactInquiries(inquiries)

  return NextResponse.json(inquiry, { status: 201 })
}

