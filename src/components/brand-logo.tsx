/** Bust cache after wordmark art updates */
const LOGO_SRC = '/brand/myklen-wordmark.png?v=4'

type Props = {
  className?: string
  priority?: boolean
}

/** Green wordmark PNG — beside scroll mascot in header. */
export function BrandLogo({ className = '', priority = false }: Props) {
  return (
    // Native img: always serves from /public (no Next image cache surprises).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_SRC}
      alt="myklen"
      width={400}
      height={100}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      className={`h-7 w-auto max-w-[8rem] object-contain object-left sm:h-8 sm:max-w-[9rem] ${className}`}
    />
  )
}
