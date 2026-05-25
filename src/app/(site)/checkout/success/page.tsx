import Link from 'next/link'

type Props = { searchParams: Promise<{ package?: string }> }

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { package: pkg } = await searchParams

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-teal-950">Thank you</h1>
      <p className="mt-4 text-teal-900/80">
        {pkg
          ? `Your ${pkg} package payment was received. We will email manager onboarding steps.`
          : 'Payment received. We will be in touch with next steps.'}
      </p>
      <Link href="/" className="mt-8 inline-block text-teal-700 font-semibold hover:underline">
        Back to home
      </Link>
    </div>
  )
}
