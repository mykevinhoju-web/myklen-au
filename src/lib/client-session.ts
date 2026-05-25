/** Edge-safe client portal session (HMAC, no Node crypto) */

export const CLIENT_USER_COOKIE = 'myklen_client'

function sessionSecret() {
  return process.env.SESSION_SECRET ?? 'myklen-dev-session-change-in-production'
}

function timingSafeEqualHex(a: string, b: string) {
  if (a.length !== b.length) return false
  let out = 0
  for (let i = 0; i < a.length; i++) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return out === 0
}

async function hmacSha256Hex(message: string, secret: string) {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return Array.from(new Uint8Array(sig))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function createClientSessionToken(userId: string) {
  const sig = await hmacSha256Hex(userId, sessionSecret())
  return `${userId}.${sig}`
}

export async function parseClientSessionToken(token: string | undefined) {
  if (!token) return null
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return null
  const userId = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = await hmacSha256Hex(userId, sessionSecret())
  if (!timingSafeEqualHex(sig, expected)) return null
  return userId
}

export const clientUserCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
}
