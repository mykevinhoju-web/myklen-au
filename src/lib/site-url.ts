/**
 * Site origin for Stripe / external callbacks.
 * Prefer NEXT_PUBLIC_SITE_URL in production; otherwise use the incoming request (correct dev port).
 */
export function siteOrigin(request: Request): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  const fromRequest = new URL(request.url).origin
  if (!fromEnv) return fromRequest
  const normalized = fromEnv.replace(/\/$/, '')
  // In local dev, env often still says :3000 while the app runs on :3001 — trust the request.
  try {
    const envUrl = new URL(normalized)
    const reqUrl = new URL(fromRequest)
    const envIsLocal =
      envUrl.hostname === 'localhost' || envUrl.hostname === '127.0.0.1'
    const reqIsLocal =
      reqUrl.hostname === 'localhost' || reqUrl.hostname === '127.0.0.1'
    if (envIsLocal && reqIsLocal && envUrl.port !== reqUrl.port) {
      return fromRequest
    }
  } catch {
    return fromRequest
  }
  return normalized
}
