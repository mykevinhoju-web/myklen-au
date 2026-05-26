'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { isReducedMotion } from '@/lib/motion-preference'

const VIDEO_DESKTOP = '/hero/hero-scene.mp4'
const VIDEO_MOBILE = '/hero/hero-scene-mobile.mp4'
const POSTER_SRC = '/hero/hero-poster.png'

type Props = {
  children: ReactNode
}

function pickVideoSrc() {
  if (typeof window === 'undefined') return VIDEO_DESKTOP
  return window.matchMedia('(max-width: 767px)').matches ? VIDEO_MOBILE : VIDEO_DESKTOP
}

export function HeroVideoScroll({ children }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoSrc, setVideoSrc] = useState(VIDEO_DESKTOP)
  const showPoster = reduceMotion || videoFailed || !videoReady

  useEffect(() => {
    const sync = () => setReduceMotion(isReducedMotion())
    sync()
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    mq.addEventListener('change', sync)
    window.addEventListener('storage', sync)
    return () => {
      mq.removeEventListener('change', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    const apply = () => setVideoSrc(pickVideoSrc())
    apply()
    const mq = window.matchMedia('(max-width: 767px)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduceMotion) return

    setVideoReady(false)
    setVideoFailed(false)

    const onReady = () => setVideoReady(true)

    const play = () => {
      void video.play().catch(() => {})
    }

    video.addEventListener('loadeddata', onReady, { once: true })
    video.addEventListener('loadeddata', play, { once: true })
    video.addEventListener('canplay', play, { once: true })

    const prime = () => {
      if (video.readyState < 1) void video.load()
      else play()
    }

    window.addEventListener('touchstart', prime, { once: true, passive: true })
    if (video.readyState >= 2) {
      onReady()
      play()
    } else {
      void video.load()
    }

    return () => {
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('loadeddata', play)
      video.removeEventListener('canplay', play)
      window.removeEventListener('touchstart', prime)
    }
  }, [reduceMotion, videoSrc])

  return (
    <section
      id="home-hero"
      className="relative z-0 flex min-h-[100dvh] max-h-[52rem] items-center justify-center overflow-hidden supports-[min-height:100svh]:min-h-[100svh]"
    >
      <div className="pointer-events-none absolute inset-0 size-full overflow-hidden" aria-hidden>
        {!reduceMotion && (
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ opacity: videoReady && !videoFailed ? 1 : 0 }}
          >
            <video
              key={videoSrc}
              ref={videoRef}
              className="absolute inset-0 size-full object-cover"
              src={videoSrc}
              muted
              playsInline
              autoPlay
              loop
              preload="auto"
              disablePictureInPicture
              poster={POSTER_SRC}
              onError={() => setVideoFailed(true)}
            />
          </div>
        )}

        {showPoster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={POSTER_SRC}
            alt=""
            className="absolute inset-0 size-full object-cover"
            aria-hidden
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/38 to-white/28 opacity-[0.46]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-12 text-center max-md:pt-20 sm:px-8 sm:py-16">
        {children}
      </div>
    </section>
  )
}
