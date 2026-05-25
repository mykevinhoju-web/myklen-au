import Link from 'next/link'

export default function ManagerPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full bg-teal-950 text-teal-50">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <span className="font-semibold">Manager</span>
          <Link href="/manager/app" className="text-sm text-teal-200 hover:text-white">
            Dashboard
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  )
}
