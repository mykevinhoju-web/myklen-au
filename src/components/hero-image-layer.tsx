import Image from 'next/image'
import type { ReactNode } from 'react'

type Props = {
  id?: string
  children: ReactNode
  overlay?: ReactNode
  className?: string
  innerClassName?: string
  priority?: boolean
  imagePosition?: string
  imageSrc?: string
  showBottomBorder?: boolean
  /** Dark gradient for light hero typography (bou-style) */
  scrim?: 'dark' | 'light' | 'none'
  /** Skip Next image optimizer — use when replacing static assets (avoids stale cache) */
  unoptimized?: boolean
}

export function HeroImageLayer({
  id,
  children,
  overlay,
  className = '',
  innerClassName = 'mx-auto max-w-6xl px-4 py-10 sm:py-12 md:py-14',
  priority = false,
  imagePosition = 'object-cover object-[70%_center] sm:object-[right_center]',
  imageSrc = '/hero/hero-bg.png',
  showBottomBorder = false,
  scrim = 'dark',
  unoptimized = false,
}: Props) {
  const scrimClass =
    scrim === 'dark'
      ? 'bg-gradient-to-b from-black/45 via-black/25 to-black/55'
      : scrim === 'light'
        ? 'bg-gradient-to-b from-white/70 via-white/30 to-white/60'
        : ''

  return (
    <section
      id={id}
      className={`relative overflow-hidden ${showBottomBorder ? 'border-b border-black/8' : ''} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {unoptimized ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            className={`absolute inset-0 size-full ${imagePosition}`}
            draggable={false}
            decoding="async"
          />
        ) : (
          <Image
            src={imageSrc}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className={imagePosition}
            draggable={false}
          />
        )}
        {scrim !== 'none' && <div className={`absolute inset-0 ${scrimClass}`} />}
      </div>
      {overlay}
      <div className={`relative z-10 ${innerClassName}`}>{children}</div>
    </section>
  )
}
