import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_COOKIE, CUSTOMER_COOKIE, MANAGER_COOKIE } from '@/lib/auth-cookies'
import { CLIENT_USER_COOKIE, parseClientSessionToken } from '@/lib/client-session'
import { resolveTenantFromRequest, slugFromPath } from '@/lib/tenant'

const TENANT_HEADER = 'x-myklen-tenant-slug'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get('host') ?? 'localhost'

  const tenant = resolveTenantFromRequest(hostname, pathname)
  const requestHeaders = new Headers(request.headers)
  if (tenant) {
    requestHeaders.set(TENANT_HEADER, tenant.slug)
  }

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next()
    const session = request.cookies.get(ADMIN_COOKIE)?.value
    if (session === '1') return NextResponse.next()
    const login = new URL('/admin/login', request.url)
    login.searchParams.set('from', pathname)
    return NextResponse.redirect(login)
  }

  if (pathname.startsWith('/customer/account')) {
    const userId = await parseClientSessionToken(
      request.cookies.get(CLIENT_USER_COOKIE)?.value,
    )
    if (userId) {
      return NextResponse.next({ request: { headers: requestHeaders } })
    }
    const login = new URL('/customer/login', request.url)
    login.searchParams.set('from', pathname)
    return NextResponse.redirect(login)
  }

  if (pathname.startsWith('/manager/app')) {
    const managerId = request.cookies.get(MANAGER_COOKIE)?.value
    if (managerId) {
      return NextResponse.next({ request: { headers: requestHeaders } })
    }
    const login = new URL('/manager/login', request.url)
    login.searchParams.set('from', pathname)
    return NextResponse.redirect(login)
  }

  const tenantSlug = tenant?.slug ?? slugFromPath(pathname)
  if (tenantSlug && pathname.startsWith(`/m/${tenantSlug}`)) {
    const isPublic =
      pathname === `/m/${tenantSlug}` ||
      pathname === `/m/${tenantSlug}/login` ||
      pathname.startsWith(`/m/${tenantSlug}/api/`)

    if (isPublic) {
      return NextResponse.next({ request: { headers: requestHeaders } })
    }

    const raw = request.cookies.get(CUSTOMER_COOKIE)?.value
    const [slug] = raw?.split(':') ?? []
    if (slug === tenantSlug) {
      return NextResponse.next({ request: { headers: requestHeaders } })
    }

    const login = new URL(`/m/${tenantSlug}/login`, request.url)
    login.searchParams.set('from', pathname)
    return NextResponse.redirect(login)
  }

  if (tenant) {
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/manager/:path*', '/m/:path*', '/customer/account', '/customer/account/:path*'],
}
