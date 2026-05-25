import { headers } from 'next/headers'

export default async function ManagerAppPage() {
  const h = await headers()
  const slug = h.get('x-myklen-tenant-slug')

  return (
    <>
      <h1 className="text-2xl font-bold">Manager dashboard</h1>
      <p className="mt-2 text-teal-200/80">Phase 2 — schedule, CRM, and your booking link settings.</p>
      <dl className="mt-8 space-y-2 text-sm">
        <div>
          <dt className="text-teal-400">Customer booking URL (path)</dt>
          <dd className="font-mono">/m/{slug ?? 'your-slug'}</dd>
        </div>
        <div>
          <dt className="text-teal-400">Subdomain (Growth+)</dt>
          <dd className="font-mono">{slug ?? 'your-slug'}.myklen.com.au</dd>
        </div>
      </dl>
    </>
  )
}
