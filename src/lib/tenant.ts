/**
 * Resolve manager tenant from hostname or path.
 * Phase 1: path `/m/{slug}` only.
 * Phase 2+: `{slug}.myklen.com.au` and custom domains.
 */

const PLATFORM_HOSTS = new Set([
  'myklen.com.au',
  'www.myklen.com.au',
  'localhost',
  '127.0.0.1',
])

const SUBDOMAIN_SUFFIX = '.myklen.com.au'

export function isPlatformHost(hostname: string) {
  const host = hostname.split(':')[0].toLowerCase()
  return PLATFORM_HOSTS.has(host)
}

/** Extract slug from subdomain e.g. jane-clean.myklen.com.au */
export function slugFromSubdomain(hostname: string): string | null {
  const host = hostname.split(':')[0].toLowerCase()
  if (!host.endsWith(SUBDOMAIN_SUFFIX)) return null
  const sub = host.slice(0, -SUBDOMAIN_SUFFIX.length)
  if (!sub || sub.includes('.')) return null
  return sub
}

export function slugFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/m\/([^/]+)/)
  return match?.[1] ?? null
}

export type TenantResolution = {
  slug: string
  source: 'path' | 'subdomain' | 'custom-domain'
}

export function resolveTenantFromRequest(hostname: string, pathname: string): TenantResolution | null {
  const fromPath = slugFromPath(pathname)
  if (fromPath) return { slug: fromPath, source: 'path' }

  const fromSub = slugFromSubdomain(hostname)
  if (fromSub) return { slug: fromSub, source: 'subdomain' }

  // Phase 3: lookup custom domain in DB — not implemented yet
  return null
}
