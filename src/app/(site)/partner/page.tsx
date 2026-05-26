import Link from 'next/link'
import { LayerSection } from '@/components/layer-section'
import { btnHover } from '@/lib/motion-classes'
import { partnerPage } from '@/lib/site-content'

export const metadata = {
  title: 'Become a partner',
  description: 'Start your own home cleaning business with training, branding, booking tools, and support from myklen.',
}

export default function PartnerPage() {
  return (
    <div className="site-stack mx-auto w-full max-w-[90rem] px-3 py-3 sm:px-4 md:px-5">
      <LayerSection className="layer-inner mx-auto max-w-3xl">
        <p className="type-eyebrow">Partner program</p>
        <h1 className="type-display mt-3 text-3xl sm:text-4xl lg:text-5xl">{partnerPage.title}</h1>
        <p className="type-lead mt-5">{partnerPage.lead}</p>

        <h2 className="mt-12 text-xl font-semibold tracking-tight">What&apos;s included</h2>
        <ul className="mt-6 space-y-3">
          {partnerPage.includes.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-black/8 bg-[#fafafa] px-4 py-3.5 text-[0.9375rem] leading-relaxed"
            >
              <span className="font-semibold text-[var(--myklen-teal)]">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/packages"
            className={`rounded-full bg-[var(--hero-accent)] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[var(--hero-accent-hover)] ${btnHover}`}
          >
            Apply via packages
          </Link>
          <Link
            href="/training"
            className={`rounded-full border border-black/15 bg-white px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] hover:bg-black/[0.03] ${btnHover}`}
          >
            Preview training
          </Link>
        </div>
      </LayerSection>
    </div>
  )
}
