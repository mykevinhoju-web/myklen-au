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
  bullets: readonly string[]
  cards: readonly BoardCard[]
}

const CARD_GRID_CLASS: Record<number, string> = {
  0: 'sm:col-start-1 sm:row-start-1',
  1: 'sm:col-start-2 sm:row-start-1 sm:row-span-2',
  2: 'sm:col-start-1 sm:row-start-2',
  3: 'sm:col-span-2 sm:row-start-3 lg:col-span-1 lg:col-start-2 lg:row-start-3',
}

function CheckIcon({ inverted }: { inverted?: boolean }) {
  return (
    <span
      className={`mb-4 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
        inverted ? 'bg-white/95 text-[var(--launch-olive-deep)]' : 'bg-[var(--launch-olive)] text-white'
      }`}
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
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
          className="overflow-hidden rounded-[1.25rem] bg-[var(--launch-cream)] p-6 sm:rounded-[1.5rem] sm:p-8 lg:p-10"
        >
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-14">
            {/* Left — copy, bullets, image */}
            <div className="flex flex-col">
              <p className="type-eyebrow !text-[var(--launch-olive)]">{content.eyebrow}</p>
              <h2 className="type-display mt-3 text-3xl text-[var(--foreground)] sm:text-4xl lg:text-[2.5rem]">
                {content.title}
              </h2>
              <p className={`type-lead mt-4 max-w-md text-left ${koCopy}`}>{content.lead}</p>

              <ul className="mt-6 space-y-3.5">
                {content.bullets.map((item) => (
                  <li
                    key={item}
                    className={`flex gap-3 text-[0.9375rem] font-medium leading-relaxed text-[var(--foreground)]/85 ${koCopy}`}
                  >
                    <span
                      className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--hero-accent)]"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_12px_40px_-16px_rgb(0_0_0_/_0.18)] ring-1 ring-black/[0.06] sm:mt-10 sm:rounded-[1.25rem]">
                <Image
                  src="/images/launch-planning.png"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Right — asymmetrical feature cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:grid-rows-3 sm:gap-4">
              {content.cards.map((card, index) => {
                const isDark = card.tone === 'dark'
                return (
                  <article
                    key={card.title}
                    className={[
                      'flex flex-col rounded-2xl p-6 text-left transition-shadow duration-300 hover:shadow-[0_16px_40px_-20px_rgb(0_0_0_/_0.2)]',
                      CARD_GRID_CLASS[index] ?? '',
                      isDark
                        ? 'bg-[var(--launch-olive)] text-white shadow-[0_10px_32px_-14px_rgb(58_79_58_/_0.45)] sm:min-h-[13.5rem]'
                        : 'bg-white text-[var(--foreground)] shadow-[0_4px_20px_-8px_rgb(0_0_0_/_0.1)] ring-1 ring-black/[0.05]',
                    ].join(' ')}
                  >
                    <CheckIcon inverted={isDark} />
                    <h3 className="text-lg font-bold tracking-tight">{card.title}</h3>
                    <p
                      className={`mt-2.5 text-[0.9375rem] font-medium leading-relaxed ${koCopy} ${
                        isDark ? 'text-white/88' : 'text-[var(--foreground)]/78'
                      }`}
                    >
                      {card.body}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </Reveal>
    </LayerSection>
  )
}
