import { HeroImageLayer } from '@/components/hero-image-layer'
import { LayerSection } from '@/components/layer-section'

/** Decorative about background — bump when replacing the file */
const ABOUT_BG = '/hero/about-building.png'

export function HomeAbout() {
  return (
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
        <p className="type-eyebrow !text-[var(--hero-accent)]">About</p>
        <h2 className="type-display mt-3 text-3xl text-[#0a0a0a] sm:text-4xl">myklen</h2>
        <p className="type-lead mt-5 text-[#1a1a1a]/90">
          myklen is a <strong className="font-semibold text-[#0a0a0a]">cleaning business launch platform</strong>{' '}
          — not a national booking line. We help you create income and growth with systems, training, and brand
          support so you serve customers under your name.
        </p>
        <p className="type-lead mt-4 text-[#1a1a1a]/90">
          You become the manager: we equip you with know-how, marketing materials, supplies guidance, and booking
          tools. Your clients book through{' '}
          <strong className="font-semibold text-[var(--hero-accent)]">your</strong> link — you own the
          relationship.
        </p>
      </HeroImageLayer>
    </LayerSection>
  )
}
