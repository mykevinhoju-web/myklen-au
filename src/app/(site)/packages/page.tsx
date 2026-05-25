import { LayerSection } from '@/components/layer-section'
import { PackageCard } from '@/components/package-card'
import { getActivePackages } from '@/lib/packages-store'

export const metadata = {
  title: 'Packages',
}

export default async function PackagesPage() {
  const packages = await getActivePackages()

  return (
    <div className="site-stack mx-auto w-full max-w-[90rem] px-3 py-3 sm:px-4 md:px-5">
      <LayerSection className="layer-inner">
        <p className="type-eyebrow">Launch packages</p>
        <h1 className="type-display mt-3 text-3xl sm:text-4xl lg:text-5xl">Start with the right tier</h1>
        <p className="type-lead mt-4 max-w-2xl">
          Starter builds your foundation. Growth adds professional branding and local marketing. Premium
          is for serious operators who want onboarding, advanced tools, and maximum support.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      </LayerSection>
    </div>
  )
}
