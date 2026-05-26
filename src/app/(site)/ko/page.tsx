import Link from 'next/link'
import { HomeLaunchBoard } from '@/components/home/home-launch-board'
import { HomeHeroKo } from '@/components/ko/home-hero-ko'
import { PackageCardKo } from '@/components/ko/package-card-ko'
import { HeroImageLayer } from '@/components/hero-image-layer'
import { LayerSection } from '@/components/layer-section'
import { Reveal } from '@/components/reveal'
import { btnHover } from '@/lib/motion-classes'
import { koSite } from '@/lib/site-content-ko'
import { getActivePackages } from '@/lib/packages-store'

const ABOUT_BG = '/hero/about-building.png'

export const metadata = {
  title: 'myklen — 청소 사업 런칭 플랫폼',
  description:
    '교육, 브랜딩, 예약 도구로 호주에서 홈 클리닝 사업을 시작하세요. 예약 사이트가 아닌 사업 런칭 플랫폼입니다.',
}

export default async function KoreanHomePage() {
  const packages = await getActivePackages()
  const preview = packages.find((p) => p.featured) ?? packages[0]

  return (
    <div lang="ko">
      <HomeHeroKo />

      <div className="site-stack mx-auto w-full max-w-[90rem] px-3 sm:px-4 md:px-5">
        {/* Offerings */}
        <LayerSection className="home-tint-section layer-inner">
          <Reveal>
            <p className="type-eyebrow">{koSite.offerings.eyebrow}</p>
            <h2 className="type-display mt-3 text-3xl sm:text-4xl">{koSite.offerings.title}</h2>
            <p className="type-lead mt-3 max-w-2xl">{koSite.offerings.lead}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {koSite.offerings.items.map((item, index) => (
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

        {/* Opportunity */}
        <LayerSection className="home-tint-section layer-inner">
          <Reveal>
            <p className="type-eyebrow">{koSite.opportunity.eyebrow}</p>
            <h2 className="type-display mt-3 max-w-3xl text-3xl sm:text-4xl">{koSite.opportunity.title}</h2>
            <p className="type-lead mt-5 max-w-2xl">{koSite.opportunity.lead}</p>
          </Reveal>
          <Reveal stagger={2}>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {koSite.opportunity.bullets.map((item) => (
                <li
                  key={item}
                  className="flex gap-3 rounded-xl border border-black/8 bg-white px-4 py-3.5 text-[0.9375rem] leading-relaxed text-[#1a1a1a]/90"
                >
                  <span className="mt-0.5 font-semibold text-[var(--myklen-teal)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-lg font-medium tracking-tight text-[#0a0a0a]">{koSite.opportunity.closing}</p>
          </Reveal>
        </LayerSection>

        <HomeLaunchBoard content={koSite.launchBoard} lang="ko" />

        {/* Steps */}
        <div id="how-it-works">
          <LayerSection className="home-tint-section layer-inner">
            <Reveal>
              <p className="type-eyebrow">{koSite.steps.eyebrow}</p>
              <h2 className="type-display mt-3 text-3xl sm:text-4xl">{koSite.steps.title}</h2>
              <p className="type-lead mt-3 max-w-2xl">{koSite.steps.lead}</p>
            </Reveal>
            <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {koSite.steps.items.map((item, index) => (
                <Reveal key={item.step} stagger={Math.min((index % 3) + 1, 3) as 1 | 2 | 3}>
                  <li className="home-tint-card flex h-full flex-col rounded-2xl border border-black/8 bg-[#fafafa] p-6">
                    <span className="font-brand text-[var(--myklen-teal)]">단계 {item.step}</span>
                    <h3 className="mt-2 text-lg font-semibold tracking-tight">{item.title}</h3>
                    <p className="type-lead mt-3 flex-1 text-base">{item.body}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </LayerSection>
        </div>

        {/* Testimonials */}
        <LayerSection className="home-tint-section layer-inner">
          <Reveal>
            <p className="type-eyebrow">{koSite.testimonials.eyebrow}</p>
            <h2 className="type-display mt-3 text-3xl sm:text-4xl">{koSite.testimonials.title}</h2>
            <p className="type-lead mt-3 max-w-xl">{koSite.testimonials.lead}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
            {koSite.testimonials.items.map((item, index) => (
              <Reveal key={item.name} stagger={Math.min(index + 1, 3) as 1 | 2 | 3}>
                <figure className="home-tint-card hover-lift-card flex h-full flex-col rounded-2xl border border-black/8 bg-[#fafafa] p-6">
                  <span className="inline-flex gap-0.5 text-[var(--hero-accent)]" aria-hidden>
                    {'★'.repeat(item.stars)}
                  </span>
                  <blockquote className="type-lead mt-4 flex-1 text-base leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 border-t border-black/8 pt-4">
                    <p className="font-semibold text-[#0a0a0a]">{item.name}</p>
                    <p className="text-sm text-[#5c5c5c]">{item.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </LayerSection>

        {/* Packages */}
        <LayerSection id="packages" className="home-tint-section layer-inner">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="type-eyebrow">{koSite.packages.eyebrow}</p>
                <h2 className="type-display mt-3 text-3xl sm:text-4xl">{koSite.packages.title}</h2>
                <p className="type-lead mt-3 max-w-xl">{koSite.packages.lead}</p>
              </div>
              <Link
                href="/packages"
                className="text-sm font-semibold text-[#0a0a0a] underline decoration-black/20 underline-offset-4 hover:decoration-black/50"
              >
                {koSite.packages.compare}
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-4 md:grid-cols-3 md:gap-5">
            {packages.map((pkg, index) => (
              <Reveal key={pkg.id} stagger={Math.min(index + 1, 3) as 1 | 2 | 3}>
                <PackageCardKo pkg={pkg} heroTint />
              </Reveal>
            ))}
          </div>
        </LayerSection>

        {/* About */}
        <LayerSection
          id="about"
          className="layer-section--flush !border-0 !bg-transparent !shadow-none"
        >
          <HeroImageLayer
            imageSrc={ABOUT_BG}
            unoptimized
            scrim="none"
            showBottomBorder={false}
            imagePosition="object-cover object-[72%_center] sm:object-[right_center]"
            className="min-h-[300px] sm:min-h-[360px]"
            innerClassName="layer-inner flex max-w-xl flex-col justify-end sm:max-w-lg"
          >
            <p className="type-eyebrow !text-[var(--hero-accent)]">{koSite.about.eyebrow}</p>
            <h2 className="type-display mt-3 text-3xl text-[#0a0a0a] sm:text-4xl">{koSite.about.title}</h2>
            {koSite.about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="type-lead mt-5 text-[#1a1a1a]/90 first:mt-5">
                {p}
              </p>
            ))}
          </HeroImageLayer>
        </LayerSection>

        {/* Booking link */}
        <LayerSection className="home-tint-section layer-inner">
          <Reveal>
            <p className="type-eyebrow">{koSite.bookingLink.eyebrow}</p>
            <h2 className="type-display mt-3 text-3xl sm:text-4xl">{koSite.bookingLink.title}</h2>
            <p className="type-lead mt-4 max-w-2xl">
              {koSite.bookingLink.lead}
              <code className="rounded-md bg-black/5 px-2 py-0.5 text-[0.9em] font-medium">
                myklen.com.au/m/your-business
              </code>
              , 이후{' '}
              <code className="rounded-md bg-black/5 px-2 py-0.5 text-[0.9em] font-medium">
                yourname.myklen.com.au
              </code>
              , 프리미엄은 자체 도메인도 가능합니다.
            </p>
            {preview && (
              <p className="mt-5 text-sm text-[#5c5c5c]">
                {koSite.bookingLink.exampleNote}:{' '}
                <span className="font-mono text-[#0a0a0a]">/m/{preview.slug}-demo</span>
              </p>
            )}
          </Reveal>
        </LayerSection>

        {/* Partner */}
        <LayerSection className="home-tint-section layer-inner">
          <Reveal>
            <p className="type-eyebrow">{koSite.partner.eyebrow}</p>
            <h2 className="type-display mt-3 max-w-3xl text-3xl sm:text-4xl">{koSite.partner.title}</h2>
            <p className="type-lead mt-5 max-w-2xl">{koSite.partner.lead}</p>
          </Reveal>
          <Reveal stagger={2}>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {koSite.partner.includes.map((item) => (
                <li
                  key={item}
                  className="flex gap-2 rounded-lg border border-black/8 bg-white px-4 py-3 text-[0.9375rem] text-[#1a1a1a]/90"
                >
                  <span className="font-semibold text-[var(--myklen-teal)]">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/partner"
              className={`mt-8 inline-flex rounded-full bg-[#0a0a0a] px-6 py-3 text-sm font-medium text-white hover:bg-[#1a1a1a] ${btnHover}`}
            >
              {koSite.partner.cta}
            </Link>
          </Reveal>
        </LayerSection>

        {/* Customers */}
        <LayerSection className="home-tint-section layer-inner">
          <Reveal>
            <p className="type-eyebrow">{koSite.customers.eyebrow}</p>
            <h2 className="type-display mt-3 text-3xl sm:text-4xl">{koSite.customers.title}</h2>
            <p className="type-lead mt-5 max-w-2xl">{koSite.customers.lead}</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {koSite.customers.services.map((item, index) => (
              <Reveal key={item.title} stagger={Math.min((index % 2) + 1, 2) as 1 | 2}>
                <article className="rounded-2xl border border-black/8 bg-[#fafafa] p-6">
                  <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
                  <p className="type-lead mt-3 text-base">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <ul className="mt-10 max-w-2xl space-y-3">
            {koSite.customers.trust.map((item) => (
              <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-[#1a1a1a]/90">
                <span className="font-semibold text-[var(--myklen-teal)]">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href="/for-customers"
            className={`mt-8 inline-flex rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-medium text-[#0a0a0a] hover:bg-black/[0.03] ${btnHover}`}
          >
            {koSite.customers.cta}
          </Link>
        </LayerSection>

        {/* CTA */}
        <LayerSection className="home-tint-section layer-inner text-center">
          <Reveal>
            <h2 className="type-display text-3xl sm:text-4xl">{koSite.cta.title}</h2>
            <p className="type-lead mx-auto mt-4 max-w-xl">{koSite.cta.body}</p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/packages"
                className={`rounded-full bg-[var(--hero-accent)] px-8 py-3.5 text-sm font-semibold text-white hover:bg-[#a81832] ${btnHover}`}
              >
                {koSite.cta.primary}
              </Link>
              <Link
                href="/partner"
                className={`rounded-full border border-[#0a0a0a]/15 bg-white px-8 py-3.5 text-sm font-semibold text-[#0a0a0a] hover:bg-black/[0.03] ${btnHover}`}
              >
                {koSite.cta.secondary}
              </Link>
            </div>
          </Reveal>
        </LayerSection>
      </div>
    </div>
  )
}
