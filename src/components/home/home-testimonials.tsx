import { LayerSection } from '@/components/layer-section'
import { Reveal } from '@/components/reveal'
import { homeTestimonials } from '@/lib/site-content'

function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5 text-[var(--hero-accent)]" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} aria-hidden>
          ★
        </span>
      ))}
    </span>
  )
}

export function HomeTestimonials() {
  return (
    <LayerSection className="home-tint-section layer-inner">
      <Reveal>
        <p className="type-eyebrow">Stories</p>
        <h2 className="type-display mt-3 text-3xl sm:text-4xl">Managers who started with myklen</h2>
        <p className="type-lead mt-3 max-w-xl">Placeholder testimonials — replace with real reviews as you onboard partners.</p>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
        {homeTestimonials.map((item, index) => (
          <Reveal key={item.name} stagger={Math.min(index + 1, 3) as 1 | 2 | 3}>
            <figure className="home-tint-card hover-lift-card flex h-full flex-col rounded-2xl border border-black/8 bg-[#fafafa] p-6">
              <Stars count={item.stars} />
              <blockquote className="type-lead mt-4 flex-1 text-base leading-relaxed">&ldquo;{item.quote}&rdquo;</blockquote>
              <figcaption className="mt-5 border-t border-black/8 pt-4">
                <p className="font-semibold text-[#0a0a0a]">{item.name}</p>
                <p className="text-sm text-[#5c5c5c]">{item.role}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </LayerSection>
  )
}
