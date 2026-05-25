import { headers } from 'next/headers'
import Link from 'next/link'

type Props = { children: React.ReactNode; params: Promise<{ slug: string }> }

export default async function TenantLayout({ children, params }: Props) {
  const { slug } = await params
  const h = await headers()
  const resolved = h.get('x-myklen-tenant-slug') ?? slug

  return (
    <div className="min-h-full bg-white">
      <header className="border-b border-teal-900/10 bg-teal-50">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-teal-600">Powered by myklen</p>
            <p className="font-semibold text-teal-950">{resolved}</p>
          </div>
          <Link
            href={`/m/${resolved}/login`}
            className="text-sm font-medium text-teal-700 hover:underline"
          >
            Customer login
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  )
}
