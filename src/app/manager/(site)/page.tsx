import Link from 'next/link'

export default function ManagerLandingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold text-teal-950">Manager portal</h1>
      <p className="mt-4 text-teal-900/80">
        After you purchase a package, you will sign in here to manage your booking link, schedule, and
        customers. Full login ships in <strong>Phase 2</strong>; architecture and routes are ready.
      </p>
      <Link
        href="/manager/login"
        className="mt-8 inline-block rounded-full bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white"
      >
        Manager login
      </Link>
      <p className="mt-6 text-sm text-teal-700/70">
        Your customer link format: <code className="rounded bg-teal-100 px-1">/m/your-slug</code>
      </p>
    </div>
  )
}
