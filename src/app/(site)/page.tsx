import Link from 'next/link'
import { HomeAbout } from '@/components/home-about'
import { HomeCta } from '@/components/home/home-cta'
import { HomeHero } from '@/components/home-hero'
import { HomeOfferings } from '@/components/home/home-offerings'
import { HomeOpportunity } from '@/components/home/home-opportunity'
import { HomeSteps } from '@/components/home/home-steps'
import { HomeTestimonials } from '@/components/home/home-testimonials'
import { LayerSection } from '@/components/layer-section'
import { PackageCard } from '@/components/package-card'
import { Reveal } from '@/components/reveal'
import { getActivePackages } from '@/lib/packages-store'

export default async function HomePage() {
  const packages = await getActivePackages()
  const featured = packages.filter((p) => p.featured).slice(0, 1)
  const preview = featured.length > 0 ? featured : packages.slice(0, 1)

  return (
    <>
      <HomeHero />

      <div className="site-stack mx-auto w-full max-w-[90rem] px-3 sm:px-4 md:px-5">
        <HomeOfferings />
        <HomeOpportunity />
        <div id="how-it-works">
          <HomeSteps />
        </div>
        <HomeTestimonials />

        <LayerSection className="home-tint-section layer-inner">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="type-eyebrow">Packages</p>
                <h2 className="type-display mt-3 text-3xl sm:text-4xl">Choose your launch tier</h2>
                <p className="type-lead mt-3 max-w-xl">
                  Starter, Growth, and Premium — training depth, branding, and tools scale with your
                  ambition. Checkout available now; manager portal and customer booking roll out in phases.
                </p>
              </div>
              <Link
                href="/packages"
                className="text-sm font-semibold text-[#0a0a0a] underline decoration-black/20 underline-offset-4 hover:decoration-black/50"
              >
                Compare all packages
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
            {packages.map((pkg, index) => (
              <Reveal key={pkg.id} stagger={Math.min(index + 1, 3) as 1 | 2 | 3}>
                <PackageCard pkg={pkg} heroTint />
              </Reveal>
            ))}
          </div>
        </LayerSection>

        <HomeAbout />

        <LayerSection className="home-tint-section layer-inner">
          <Reveal>
            <p className="type-eyebrow">Your brand</p>
            <h2 className="type-display mt-3 text-3xl sm:text-4xl">Your own booking link</h2>
            <p className="type-lead mt-4 max-w-2xl">
              Every manager gets a unique URL for customers — starting as{' '}
              <code className="rounded-md bg-black/5 px-2 py-0.5 text-[0.9em] font-medium">
                myklen.com.au/m/your-business
              </code>
              , then{' '}
              <code className="rounded-md bg-black/5 px-2 py-0.5 text-[0.9em] font-medium">
                yourname.myklen.com.au
              </code>
              , and optionally your own domain on premium plans.
            </p>
            {preview[0] && (
              <p className="mt-5 text-sm text-[#5c5c5c]">
                Example after signup:{' '}
                <span className="font-mono text-[#0a0a0a]">/m/{preview[0].slug}-demo</span> (placeholder)
              </p>
            )}
          </Reveal>
        </LayerSection>

        <HomeCta />
      </div>
    </>
  )
}
