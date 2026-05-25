const LOGO_SRC = '/brand/myklen-wordmark.png'

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
      className={`h-8 w-auto max-w-[9.5rem] object-contain object-left sm:h-9 sm:max-w-[10.5rem] ${className}`}
    />
  )
}
