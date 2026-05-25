import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LayerSection } from '@/components/layer-section'
import { getPackageBySlug } from '@/lib/packages-store'
import { PackageCheckoutButton } from './checkout-button'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  return { title: pkg?.name ?? 'Package' }
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params
  const pkg = await getPackageBySlug(slug)
  if (!pkg) notFound()

  return (
    <div className="site-stack mx-auto w-full max-w-[90rem] px-3 py-3 sm:px-4 md:px-5">
      <LayerSection className="layer-inner mx-auto max-w-3xl">
        <Link
          href="/packages"
          className="text-sm font-medium text-[#5c5c5c] underline decoration-black/15 underline-offset-4 hover:text-[#0a0a0a]"
        >
          ← All packages
        </Link>
        <h1 className="type-display mt-8 text-3xl sm:text-4xl">{pkg.name}</h1>
        <p className="mt-3 text-3xl font-light tracking-tight">
          ${pkg.priceAud.toLocaleString('en-AU')}{' '}
          <span className="text-base font-normal text-[#5c5c5c]">AUD</span>
        </p>
        <p className="type-lead mt-5">{pkg.description}</p>
        <ul className="mt-8 space-y-3 border-t border-black/8 pt-8">
          {pkg.highlights.map((line) => (
            <li key={line} className="flex gap-3 text-[#0a0a0a]/85">
              <span>—</span>
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-10 rounded-2xl border border-black/8 bg-[#fafafa] p-6">
          <h2 className="text-lg font-medium">Purchase</h2>
          <p className="type-lead mt-2 text-base">
            Secure checkout via Stripe. After payment you will receive manager onboarding (portal access
            in Phase 2).
          </p>
          <PackageCheckoutButton packageSlug={pkg.slug} />
        </div>
      </LayerSection>
    </div>
  )
}
