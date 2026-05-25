import Link from 'next/link'
import { LayerSection } from '@/components/layer-section'
import { Reveal } from '@/components/reveal'
import { btnHover } from '@/lib/motion-classes'
import { homeCta } from '@/lib/site-content'

export function HomeCta() {
  return (
    <LayerSection className="home-tint-section layer-inner text-center">
      <Reveal>
        <h2 className="type-display text-3xl sm:text-4xl">{homeCta.title}</h2>
        <p className="type-lead mx-auto mt-4 max-w-xl">{homeCta.body}</p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/packages"
            className={`rounded-full bg-[var(--hero-accent)] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#a81832] ${btnHover}`}
          >
            {homeCta.primary}
          </Link>
          <Link
            href="/partner"
            className={`rounded-full border border-[#0a0a0a]/15 bg-white px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] hover:bg-black/[0.03] ${btnHover}`}
          >
            {homeCta.secondary}
          </Link>
        </div>
      </Reveal>
    </LayerSection>
  )
}
