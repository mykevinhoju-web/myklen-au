import Link from 'next/link'

type Props = { params: Promise<{ slug: string }> }

export default async function TenantHomePage({ params }: Props) {
  const { slug } = await params

  return (
    <>
      <h1 className="text-2xl font-bold text-teal-950">Book a clean</h1>
      <p className="mt-3 text-teal-900/75">
        This is your manager&apos;s customer portal at{' '}
        <code className="rounded bg-teal-100 px-1 text-sm">/m/{slug}</code>. Online booking and feedback
        arrive in Phase 3.
      </p>
      <Link
        href={`/m/${slug}/login`}
        className="mt-8 inline-block rounded-full bg-teal-700 px-5 py-2 text-sm font-semibold text-white"
      >
        Sign in to manage bookings
      </Link>
    </>
  )
}
