'use client'

import Link from 'next/link'
import { HeroSubhead } from '@/components/hero-subhead'
import { HeroVideoScroll } from '@/components/hero-video-scroll'
import { btnHover } from '@/lib/motion-classes'
import { koSite } from '@/lib/site-content-ko'

export function HomeHeroKo() {
  const { hero } = koSite
  return (
    <HeroVideoScroll>
      <h1 className="type-display max-w-4xl text-[2.125rem] text-[#0a0a0a] sm:text-5xl lg:text-[3.5rem]">
        {hero.headlineLines.map((line, i) => (
          <span key={line.accent} className={i > 0 ? 'mt-1 block' : 'block'}>
            {line.lead}
            <span className="text-[var(--hero-accent)]">{line.accent}</span>
          </span>
        ))}
      </h1>
      <HeroSubhead blocks={hero.subhead} lang="ko" />
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/ko#packages"
          className={`rounded-full bg-[var(--hero-accent)] px-6 py-3 text-sm font-semibold text-white hover:bg-[#a81832] ${btnHover}`}
        >
          {hero.ctaPrimary}
        </Link>
        <Link
          href="/ko#how-it-works"
          className={`rounded-full border border-[#0a0a0a]/20 bg-white/75 px-6 py-3 text-sm font-semibold text-[#0a0a0a] backdrop-blur-sm hover:bg-white ${btnHover}`}
        >
          {hero.ctaSecondary}
        </Link>
      </div>
    </HeroVideoScroll>
  )
}
