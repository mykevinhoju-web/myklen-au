import Link from 'next/link'
import '../portal.css'

export default function CustomerPortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-shell min-h-full bg-[var(--canvas)]">
      <header className="border-b border-black/8 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-brand text-[#0a0a0a]">
            myklen
          </Link>
          <span className="text-xs font-medium uppercase tracking-wider text-[#5c5c5c]">
            Customer portal
          </span>
        </div>
      </header>
      {children}
    </div>
  )
}
