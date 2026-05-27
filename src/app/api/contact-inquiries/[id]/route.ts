import { NextResponse } from 'next/server'
import { isAdminAuthenticated } from '@/lib/auth'
import { newContactInquiryReply } from '@/lib/contact-inquiries-mutate'
import { loadContactInquiries, saveContactInquiries } from '@/lib/contact-inquiries-store'
import type { ContactInquiryStatus } from '@/lib/types'

type Params = { params: Promise<{ id: string }> }

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  const inquiries = await loadContactInquiries()
  const inquiry = inquiries.find((x) => x.id === id)
  if (!inquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(inquiry)
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = (await request.json()) as {
    status?: ContactInquiryStatus
    markRead?: boolean
    addReply?: string
  }

  const inquiries = await loadContactInquiries()
  const index = inquiries.findIndex((x) => x.id === id)
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const inquiry = inquiries[index]!

  if (body.markRead === true && inquiry.status === 'new') inquiry.status = 'read'

  if (body.status === 'new' || body.status === 'read' || body.status === 'replied') {
    inquiry.status = body.status
  }

  if (body.addReply !== undefined) {
    const text = body.addReply.trim()
    if (!text) return NextResponse.json({ error: 'Reply is required' }, { status: 400 })
    inquiry.replies = [...inquiry.replies, newContactInquiryReply(text)]
    inquiry.status = 'replied'
  }

  inquiries[index] = inquiry
  await saveContactInquiries(inquiries)
  return NextResponse.json(inquiry)
}

