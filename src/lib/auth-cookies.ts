export const ADMIN_COOKIE = 'myklen_admin'
export const MANAGER_COOKIE = 'myklen_manager'
export const CUSTOMER_COOKIE = 'myklen_customer'

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}
