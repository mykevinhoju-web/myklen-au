import Image from 'next/image'
import { LayerSection } from '@/components/layer-section'
import { Reveal } from '@/components/reveal'
import { homeLaunchBoard } from '@/lib/site-content'

type BoardCard = {
  title: string
  body: string
  tone: 'light' | 'dark'
}

type BoardContent = {
  eyebrow: string
  title: string
  lead: string
  cards: readonly BoardCard[]
}

const COPY_MAX_W = 'max-w-[34rem]'

/** Per-card masonry tweaks: index 3 = Steady cash flow (taller, fills lower-right) */
const CARD_LAYOUT: Record<number, string> = {
  0: 'mb-3',
  1: 'mb-2.5',
  2: 'mb-2.5',
  3: 'mb-0 min-h-[12rem] sm:min-h-[13.75rem] lg:min-h-[15rem]',
}

function CheckIcon({ inverted, compact }: { inverted?: boolean; compact?: boolean }) {
  const size = compact ? 'h-5 w-5' : 'h-9 w-9'
  const icon = compact ? 10 : 14

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full ${size} ${
        inverted
          ? 'bg-white/95 text-[var(--launch-olive-deep)]'
          : 'bg-[var(--launch-olive)] text-white'
      }`}
      aria-hidden
    >
      <svg width={icon} height={icon} viewBox="0 0 14 14" fill="none">
        <path
          d="M3 7.2L5.8 10L11 4.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export function HomeLaunchBoard({
  content = homeLaunchBoard,
  lang,
}: {
  content?: BoardContent
  lang?: string
}) {
  const koCopy = lang === 'ko' ? '[word-break:keep-all]' : ''

  return (
    <LayerSection className="home-tint-section layer-inner">
      <Reveal>
        <div
          lang={lang}
          className="overflow-hidden rounded-[1.25rem] bg-[var(--launch-cream)] p-6 sm:rounded-[1.5rem] sm:p-8 lg:p-10 xl:p-12"
        >
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:items-stretch lg:gap-10 xl:gap-12">
            {/* Left — interlocked copy + anchored image */}
            <div className="relative flex flex-col">
              <div className="relative z-10 pt-2 sm:pt-4 lg:pt-5">
                <p className="type-eyebrow !text-[var(--launch-olive)]">{content.eyebrow}</p>
                <h2 className="type-display mt-3 text-3xl text-[var(--foreground)] sm:text-4xl lg:text-[2.5rem]">
                  {content.title}
                </h2>
                <p
                  className={`type-lead mt-4 ${COPY_MAX_W} text-left leading-[1.72] sm:mt-5 ${koCopy}`}
                >
                  {content.lead}
                </p>
              </div>

              <div className="relative z-0 mt-9 w-full sm:mt-10 lg:mt-11">
                <div className="relative aspect-[5/4] w-full min-h-[16.5rem] overflow-hidden rounded-2xl shadow-[0_18px_52px_-22px_rgb(0_0_0_/_0.17)] ring-1 ring-black/[0.06] sm:min-h-[18.5rem] sm:rounded-[1.25rem] lg:min-h-[20.5rem]">
                  <Image
                    src="/images/launch-planning.png"
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 46vw"
                    className="object-cover object-center scale-[1.05] transition-transform duration-500 hover:scale-[1.07]"
                  />
                </div>
              </div>
            </div>

            {/* Right — masonry columns, offset to align with image */}
            <div className="mt-8 w-full sm:mt-10 lg:mt-0 lg:flex lg:flex-col lg:justify-center lg:pt-14 xl:pt-16">
              <div className="columns-1 gap-3 sm:columns-2 sm:gap-4 w-full">
              {content.cards.map((card, index) => {
                const isDark = card.tone === 'dark'
                const isCashFlow = index === 3

                return (
                  <article
                    key={card.title}
                    className={[
                      'mb-3 break-inside-avoid',
                      CARD_LAYOUT[index] ?? 'mb-3',
                      'flex flex-col rounded-2xl text-left transition-[box-shadow,transform] duration-300 ease-out',
                      isDark ? 'p-5 sm:p-6' : 'p-5 sm:p-6',
                      isCashFlow && 'sm:pb-7',
                      isDark
                        ? 'bg-[var(--launch-olive)] text-white shadow-[0_8px_28px_-14px_rgb(58_79_58_/_0.38)] hover:shadow-[0_14px_36px_-16px_rgb(58_79_58_/_0.42)]'
                        : 'bg-white text-[var(--foreground)] shadow-[0_2px_16px_-6px_rgb(0_0_0_/_0.08),0_8px_24px_-12px_rgb(0_0_0_/_0.06)] ring-1 ring-black/[0.04] hover:shadow-[0_4px_24px_-8px_rgb(0_0_0_/_0.1),0_12px_32px_-14px_rgb(0_0_0_/_0.08)] hover:-translate-y-0.5',
                      index === 2 && 'sm:translate-y-0.5',
                    ].join(' ')}
                  >
                    <span className="mb-3.5 sm:mb-4">
                      <CheckIcon inverted={isDark} />
                    </span>
                    <h3 className="text-lg font-bold tracking-tight">{card.title}</h3>
                    <p
                      className={`mt-3 text-[0.9375rem] font-medium leading-[1.62] ${koCopy} ${
                        isDark ? 'text-white/88' : 'text-[var(--foreground)]/78'
                      } ${isCashFlow ? 'sm:max-w-[18rem]' : ''}`}
                    >
                      {card.body}
                    </p>
                  </article>
                )
              })}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </LayerSection>
  )
}
