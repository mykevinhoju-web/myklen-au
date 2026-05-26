'use client'

import Link from 'next/link'
import { HeroSubhead } from '@/components/hero-subhead'
import { HeroVideoScroll } from '@/components/hero-video-scroll'
import { btnAccentHover, btnHover } from '@/lib/motion-classes'
import { sitePositioning } from '@/lib/site-content'

export function HomeHero() {
  return (
    <HeroVideoScroll>
      {sitePositioning.tagline ? (
        <p className="type-eyebrow text-[var(--hero-accent)]">{sitePositioning.tagline}</p>
      ) : null}
      <h1
        className={`type-display w-full text-[2.125rem] text-[var(--foreground)] sm:text-5xl lg:text-[3.5rem] ${sitePositioning.tagline ? 'mt-4' : 'mt-0'}`}
      >
        {sitePositioning.headlineLines.map((line, i) => (
          <span key={line.accent} className={i > 0 ? 'mt-1 block' : 'block'}>
            {line.lead}
            <span className="text-[var(--hero-accent)]">{line.accent}</span>
          </span>
        ))}
      </h1>
      <HeroSubhead blocks={sitePositioning.subhead} />
      <div className="hero-cta-row">
        <Link
          href="/packages"
          className={`rounded-full bg-[var(--hero-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-[#e85a4f]/20 hover:bg-[var(--hero-accent-hover)] ${btnAccentHover}`}
        >
          Start your business
        </Link>
        <Link
          href="/#how-it-works"
          className={`rounded-full border border-[var(--foreground)]/18 bg-white/80 px-6 py-3 text-sm font-semibold text-[var(--foreground)] backdrop-blur-sm hover:bg-white ${btnHover}`}
        >
          See how it works
        </Link>
      </div>
    </HeroVideoScroll>
  )
}
