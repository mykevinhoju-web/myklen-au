import { LayerSection } from '@/components/layer-section'
import { Reveal } from '@/components/reveal'
import { homeOpportunity } from '@/lib/site-content'

export function HomeOpportunity() {
  return (
    <LayerSection className="home-tint-section layer-inner">
      <Reveal>
        <p className="type-eyebrow">{homeOpportunity.eyebrow}</p>
        <h2 className="type-display mt-3 max-w-3xl text-3xl sm:text-4xl">{homeOpportunity.title}</h2>
        <p className="type-lead mt-5 max-w-2xl">{homeOpportunity.lead}</p>
      </Reveal>
      <Reveal stagger={2}>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {homeOpportunity.bullets.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-xl border border-black/8 bg-white px-4 py-3.5 text-[0.9375rem] leading-relaxed text-[#1a1a1a]/90"
            >
              <span className="mt-0.5 font-semibold text-[var(--myklen-teal)]">✓</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-8 text-lg font-medium tracking-tight text-[#0a0a0a]">{homeOpportunity.closing}</p>
      </Reveal>
    </LayerSection>
  )
}
