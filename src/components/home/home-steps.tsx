import { LayerSection } from '@/components/layer-section'
import { Reveal } from '@/components/reveal'
import { homeSteps } from '@/lib/site-content'

export function HomeSteps() {
  return (
    <LayerSection className="home-tint-section layer-inner">
      <Reveal>
        <p className="type-eyebrow">How it works</p>
        <h2 className="type-display mt-3 text-3xl sm:text-4xl">From signup to growing income</h2>
        <p className="type-lead mt-3 max-w-2xl">
          A clear path so you always know what to do next — built for conversion, not confusion.
        </p>
      </Reveal>
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {homeSteps.map((item, index) => (
          <Reveal key={item.step} stagger={Math.min((index % 3) + 1, 3) as 1 | 2 | 3}>
            <li className="home-tint-card flex h-full flex-col rounded-2xl border border-black/8 bg-[#fafafa] p-6">
              <span className="font-brand text-[var(--myklen-teal)]">Step {item.step}</span>
              <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="type-lead mt-3 flex-1 text-base">{item.body}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </LayerSection>
  )
}
