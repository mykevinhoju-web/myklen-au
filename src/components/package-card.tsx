import Link from 'next/link'
import { btnHover, cardHover } from '@/lib/motion-classes'
import type { StarterPackage } from '@/lib/types'

export function PackageCard({ pkg, heroTint = false }: { pkg: StarterPackage; heroTint?: boolean }) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-black/8 bg-[#fafafa] p-6 ${cardHover} ${heroTint ? 'home-tint-card' : ''} ${
        pkg.featured ? 'ring-1 ring-[#0a0a0a]/10' : ''
      }`}
    >
      {pkg.featured && (
        <span className="mb-4 w-fit rounded-full bg-[#0a0a0a] px-3 py-1 text-xs font-medium text-white">
          Most popular
        </span>
      )}
      <h3 className="text-xl font-medium tracking-tight">{pkg.name}</h3>
      <p className="mt-3 text-3xl font-light tracking-tight text-[#0a0a0a]">
        ${pkg.priceAud.toLocaleString('en-AU')}
        <span className="text-base font-normal text-[#5c5c5c]"> AUD</span>
      </p>
      <p className="type-lead mt-4 flex-1 text-base">{pkg.description}</p>
      <ul className="mt-5 space-y-2 text-sm text-[#5c5c5c]">
        {pkg.highlights.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="text-[#0a0a0a]">—</span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
      <Link
        href={`/packages/${pkg.slug}`}
        className={`mt-8 block rounded-full py-3 text-center text-sm font-medium ${btnHover} ${
          pkg.featured
            ? 'bg-[#0a0a0a] text-white hover:bg-[#1a1a1a]'
            : 'border border-black/15 bg-white text-[#0a0a0a] hover:bg-black/[0.03]'
        }`}
      >
        Choose {pkg.name}
      </Link>
    </article>
  )
}
