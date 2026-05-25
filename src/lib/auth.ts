import { cookies } from 'next/headers'
import {
  CLIENT_USER_COOKIE,
  clientUserCookieOptions,
  createClientSessionToken,
  parseClientSessionToken,
} from '@/lib/client-session'
import { findClientUserById } from '@/lib/client-users-store'
import {
  ADMIN_COOKIE,
  CUSTOMER_COOKIE,
  MANAGER_COOKIE,
  cookieOptions,
} from '@/lib/auth-cookies'
import type { ClientUser, ClientUserPublic } from '@/lib/types'

export { ADMIN_COOKIE, MANAGER_COOKIE, CUSTOMER_COOKIE, cookieOptions } from '@/lib/auth-cookies'
export { CLIENT_USER_COOKIE, createClientSessionToken, clientUserCookieOptions } from '@/lib/client-session'

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? 'admin',
    password: process.env.ADMIN_PASSWORD ?? 'changeme',
  }
}

export async function isAdminAuthenticated() {
  const store = await cookies()
  return store.get(ADMIN_COOKIE)?.value === '1'
}

export async function getManagerSessionId() {
  const store = await cookies()
  const id = store.get(MANAGER_COOKIE)?.value
  return id && id.length > 0 ? id : null
}

export async function getCustomerSession(managerSlug: string) {
  const store = await cookies()
  const raw = store.get(CUSTOMER_COOKIE)?.value
  if (!raw) return null
  const [slug, customerId] = raw.split(':')
  if (slug !== managerSlug || !customerId) return null
  return { slug, customerId }
}

export async function getCurrentClientUserId() {
  const store = await cookies()
  return parseClientSessionToken(store.get(CLIENT_USER_COOKIE)?.value)
}

export async function getCurrentClientUser(): Promise<ClientUserPublic | null> {
  const userId = await getCurrentClientUserId()
  if (!userId) return null
  const user = await findClientUserById(userId)
  if (!user || !user.active) return null
  return toPublicClientUser(user)
}

export function toPublicClientUser(user: ClientUser): ClientUserPublic {
  const { passwordHash: _, ...publicUser } = user
  return publicUser
}
