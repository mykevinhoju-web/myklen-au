'use client'

import Link from 'next/link'
import { HeroSubhead } from '@/components/hero-subhead'
import { HeroVideoScroll } from '@/components/hero-video-scroll'
import { btnAccentHover, btnHover } from '@/lib/motion-classes'
import { koSite } from '@/lib/site-content-ko'

export function HomeHeroKo() {
  const { hero } = koSite
  return (
    <HeroVideoScroll>
      <h1 className="type-display w-full text-[2.125rem] text-[var(--foreground)] sm:text-5xl lg:text-[3.5rem]">
        {hero.headlineLines.map((line, i) => (
          <span key={line.accent} className={i > 0 ? 'mt-1 block' : 'block'}>
            {line.lead}
            <span className="text-[var(--hero-accent)]">{line.accent}</span>
          </span>
        ))}
      </h1>
      <HeroSubhead blocks={hero.subhead} lang="ko" />
      <div className="hero-cta-row">
        <Link
          href="/ko#packages"
          className={`rounded-full bg-[var(--hero-accent)] px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-[#e85a4f]/20 hover:bg-[var(--hero-accent-hover)] ${btnAccentHover}`}
        >
          {hero.ctaPrimary}
        </Link>
        <Link
          href="/ko#how-it-works"
          className={`rounded-full border border-[var(--foreground)]/18 bg-white/80 px-6 py-3 text-sm font-semibold text-[var(--foreground)] backdrop-blur-sm hover:bg-white ${btnHover}`}
        >
          {hero.ctaSecondary}
        </Link>
      </div>
    </HeroVideoScroll>
  )
}
