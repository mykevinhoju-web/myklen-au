export type HeroSubheadBlock = string | readonly string[]

type Props = {
  blocks: readonly HeroSubheadBlock[]
  lang?: string
}

export function HeroSubhead({ blocks, lang }: Props) {
  return (
    <div className="hero-subhead mx-auto mt-7 w-full max-w-[34rem] sm:mt-8 sm:max-w-[38rem]" lang={lang}>
      {blocks.map((block, blockIndex) => {
        if (typeof block === 'string') {
          return (
            <p key={block} className="hero-subhead__line">
              {block}
            </p>
          )
        }

        return (
          <div key={`group-${blockIndex}`} className="hero-subhead__group">
            {block.map((line) => (
              <p key={line} className="hero-subhead__line">
                {line}
              </p>
            ))}
          </div>
        )
      })}
    </div>
  )
}
