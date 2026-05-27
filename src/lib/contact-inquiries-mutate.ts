import type { ContactInquiry, ContactInquiryReply } from './types'
import { postedAtFromDateInput } from './messages-mutate'

export { dateInputFromIso, postedAtFromDateInput } from './messages-mutate'

export function newContactInquiryReply(body: string): ContactInquiryReply {
  return {
    id: `contact-reply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author: 'admin',
    body,
    createdAt: new Date().toISOString(),
  }
}

export function createContactInquiry(input: {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  date: string
}): ContactInquiry {
  const now = new Date().toISOString()
  return {
    id: `contact-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
    inquiryDate: postedAtFromDateInput(input.date),
    createdAt: now,
    status: 'new',
    replies: [],
  }
}

export function contactInquiryStatusLabel(status: ContactInquiry['status']) {
  if (status === 'read') return 'Read'
  if (status === 'replied') return 'Replied'
  return 'New'
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export function isValidEmail(email: string) {
  return EMAIL_RE.test(email.trim())
}

// Loose AU-friendly phone check: digits/spaces/+()- allowed, must contain >= 8 digits
export function isValidPhone(phone: string) {
  const trimmed = phone.trim()
  if (!trimmed) return false
  if (!/^[0-9+()\-\s.]+$/.test(trimmed)) return false
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 8
}

