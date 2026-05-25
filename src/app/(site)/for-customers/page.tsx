import { LayerSection } from '@/components/layer-section'
import { customersPage } from '@/lib/site-content'

export const metadata = {
  title: 'For customers',
  description: 'Book home cleaning through an independent myklen manager — trained, professional, and local.',
}

export default function ForCustomersPage() {
  return (
    <div className="site-stack mx-auto w-full max-w-[90rem] px-3 py-3 sm:px-4 md:px-5">
      <LayerSection className="layer-inner">
        <p className="type-eyebrow">For customers</p>
        <h1 className="type-display mt-3 max-w-3xl text-3xl sm:text-4xl lg:text-5xl">{customersPage.title}</h1>
        <p className="type-lead mt-5 max-w-2xl">{customersPage.lead}</p>

        <h2 className="type-display mt-14 text-2xl sm:text-3xl">Services</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {customersPage.services.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-black/8 bg-[#fafafa] p-6"
            >
              <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="type-lead mt-3 text-base">{item.body}</p>
            </article>
          ))}
        </div>

        <h2 className="type-display mt-14 text-2xl sm:text-3xl">Why book through a manager link</h2>
        <ul className="mt-6 max-w-2xl space-y-3">
          {customersPage.trust.map((item) => (
            <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-[#1a1a1a]/90">
              <span className="font-semibold text-[var(--myklen-teal)]">✓</span>
              {item}
            </li>
          ))}
        </ul>

        <p className="type-lead mt-10 max-w-xl text-base">
          Online booking on manager pages is rolling out in phases. Ask your local myklen partner for their
          booking link, or check back soon for public directory search.
        </p>
      </LayerSection>
    </div>
  )
}
