import { LayerSection } from '@/components/layer-section'
import { Reveal } from '@/components/reveal'
import { homeOfferings } from '@/lib/site-content'

export function HomeOfferings() {
  return (
    <LayerSection className="home-tint-section layer-inner">
      <Reveal>
        <p className="type-eyebrow">What you get</p>
        <h2 className="type-display mt-3 text-3xl sm:text-4xl">Everything to launch and grow</h2>
        <p className="type-lead mt-3 max-w-2xl">
          A complete business-in-a-box — not just a mop and a phone number. Systems, brand, and education
          work together so you look professional from day one.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {homeOfferings.map((item, index) => (
          <Reveal key={item.title} stagger={Math.min((index % 3) + 1, 3) as 1 | 2 | 3}>
            <div className="home-tint-card hover-lift-card h-full rounded-2xl border border-black/8 bg-[#fafafa] p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--myklen-teal)]/10 text-sm font-bold text-[var(--myklen-teal)]">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="type-lead mt-3 text-base">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </LayerSection>
  )
}
