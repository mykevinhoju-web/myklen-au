/** Platform roles — keep auth surfaces separate per role */
export type UserRole = 'admin' | 'manager' | 'customer'

export type PackageTier = 'starter' | 'growth' | 'premium'

export type StarterPackage = {
  id: string
  slug: string
  name: string
  tier: PackageTier
  priceAud: number
  description: string
  highlights: string[]
  /** Stripe Price ID when configured */
  stripePriceId?: string
  featured: boolean
  active: boolean
}

/** Cleaning business owner (myklen B2B customer) */
export type Manager = {
  id: string
  slug: string
  businessName: string
  email: string
  passwordHash: string
  packageId?: string
  active: boolean
  /** Phase 3: verified custom hostname e.g. book.acme-clean.com.au */
  customDomain?: string
  createdAt: string
}

export type ManagerPublic = Omit<Manager, 'passwordHash'>

/** End customer of a specific manager */
export type TenantCustomer = {
  id: string
  managerId: string
  email: string
  passwordHash: string
  displayName: string
  active: boolean
  createdAt: string
}

export type BookingStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled'

/** Admin-created cleaning client (portal login) */
export type ClientUser = {
  id: string
  username: string
  passwordHash: string
  displayName: string
  active: boolean
  createdAt: string
}

export type ClientUserPublic = Omit<ClientUser, 'passwordHash'>

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled'

export type VisitThreadMessage = {
  id: string
  author: 'client' | 'admin'
  body: string
  createdAt: string
}

export type CleaningAppointment = {
  id: string
  userId: string
  title: string
  scheduledAt: string
  status: AppointmentStatus
  location: string
  /** Chronological messages for this visit (preferred). */
  visitThread?: VisitThreadMessage[]
  /** Latest admin reply — kept in sync with visitThread */
  notes: string
  /** Latest client note — kept in sync with visitThread */
  clientNote: string
  clientNoteReadByAdmin: boolean
  adminNoteReadByClient: boolean
  createdAt: string
}

export type MessageReply = {
  id: string
  author: 'admin'
  body: string
  createdAt: string
}

export type ClientMessage = {
  id: string
  userId: string
  title: string
  content: string
  /** Display name at time of posting */
  authorName: string
  /** User-facing date for the post */
  postedAt: string
  createdAt: string
  readByAdmin: boolean
  replies: MessageReply[]
}

export type ContactInquiryStatus = 'new' | 'read' | 'replied'

export type ContactInquiryReply = {
  id: string
  author: 'admin'
  body: string
  createdAt: string
}

/** Public contact inquiry (no login required). */
export type ContactInquiry = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  /** User-selected date for the inquiry */
  inquiryDate: string
  createdAt: string
  status: ContactInquiryStatus
  replies: ContactInquiryReply[]
}

/** Phase 3 — placeholder type for APIs */
export type Booking = {
  id: string
  managerId: string
  customerId: string
  scheduledAt: string
  status: BookingStatus
  notes: string
  createdAt: string
}
