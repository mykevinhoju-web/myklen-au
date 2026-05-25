'use client'

import { useEffect, useState } from 'react'

const SPRITE = '/hero/logo-frames.png'
const FRAME_COUNT = 4
/** 419×152 sprite → one frame */
const FRAME_W = 419 / FRAME_COUNT
const FRAME_H = 152

type Props = {
  /** 0 = first frame (shhh), 1 = last frame (big smile) */
  reveal: number
  className?: string
}

export function MascotLogo({ reveal, className = '' }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const onChange = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const clamped = Math.min(1, Math.max(0, reveal))
  const progress = reduceMotion ? (clamped >= 0.5 ? 1 : 0) : clamped
  /** Slide strip: 0% → 75% of sprite width (4 frames) */
  const shiftPercent = progress * ((FRAME_COUNT - 1) / FRAME_COUNT) * 100

  return (
    <span
      className={`relative inline-block h-16 shrink-0 overflow-hidden sm:h-[4.5rem] md:h-20 ${className}`}
      style={{ aspectRatio: `${FRAME_W} / ${FRAME_H}` }}
      role="img"
      aria-label="MyKlen logo"
    >
      {/* Native img: reliable strip scroll (no CSS background crop) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SPRITE}
        alt=""
        width={419}
        height={152}
        className="absolute top-0 left-0 h-full max-w-none will-change-transform"
        style={{
          width: `${FRAME_COUNT * 100}%`,
          transform: `translate3d(-${shiftPercent}%, 0, 0)`,
        }}
        draggable={false}
        aria-hidden
      />
    </span>
  )
}
