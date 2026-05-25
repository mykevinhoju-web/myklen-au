'use client'

import Link from 'next/link'
import { HeroVideoScroll } from '@/components/hero-video-scroll'
import { btnHover } from '@/lib/motion-classes'
import { sitePositioning } from '@/lib/site-content'

export function HomeHero() {
  return (
    <HeroVideoScroll>
      <p className="type-eyebrow text-[var(--hero-accent)]">{sitePositioning.tagline}</p>
      <h1 className="type-display mt-6 max-w-4xl text-[2.125rem] text-[#0a0a0a] sm:text-5xl lg:text-[3.5rem]">
        {sitePositioning.headline}{' '}
        <span className="text-[var(--hero-accent)]">{sitePositioning.headlineAccent}</span>
      </h1>
      <p className="type-lead mx-auto mt-6 max-w-2xl text-[#1a1a1a]/90">{sitePositioning.subhead}</p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/packages"
          className={`rounded-full bg-[var(--hero-accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a81832] ${btnHover}`}
        >
          Start your business
        </Link>
        <Link
          href="/#how-it-works"
          className={`rounded-full border border-[#0a0a0a]/20 bg-white/75 px-6 py-3 text-sm font-semibold text-[#0a0a0a] backdrop-blur-sm hover:bg-white ${btnHover}`}
        >
          See how it works
        </Link>
      </div>
    </HeroVideoScroll>
  )
}
