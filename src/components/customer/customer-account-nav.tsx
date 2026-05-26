'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/customer/account', label: 'Calendar', exact: true },
  { href: '/customer/account/messages', label: 'Messages', exact: false },
] as const

export function CustomerAccountNav() {
  const pathname = usePathname()

  return (
    <nav
      className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-black/8 bg-white p-1.5 shadow-sm shadow-black/[0.04]"
      aria-label="Account"
    >
      {LINKS.map(({ href, label, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition-colors',
              active
                ? 'bg-[var(--foreground)] text-white shadow-sm'
                : 'text-[var(--foreground)]/70 hover:bg-black/[0.04] hover:text-[var(--foreground)]',
            ].join(' ')}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
