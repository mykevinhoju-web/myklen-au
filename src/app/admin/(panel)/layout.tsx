import Link from 'next/link'
import '../../portal.css'
import '../../admin.css'

const NAV = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/users', label: 'Clients' },
  { href: '/admin/appointments', label: 'Schedule' },
  { href: '/admin/messages', label: 'Messages' },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-shell admin-panel min-h-full bg-slate-950 text-slate-100">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/admin" className="font-semibold text-white">
            myklen Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
            {NAV.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-white">
                {label}
              </Link>
            ))}
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="hover:text-white">
                Log out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  )
}
