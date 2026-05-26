'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Bump when replacing hero-scene*.mp4 so browsers skip cached old files */
const HERO_VIDEO_CACHE_VERSION = 'running-v3'

const VIDEO_DESKTOP = `/hero/hero-scene.mp4?v=${HERO_VIDEO_CACHE_VERSION}`
const VIDEO_MOBILE = `/hero/hero-scene-mobile.mp4?v=${HERO_VIDEO_CACHE_VERSION}`

type Props = {
  children: ReactNode
}

function pickVideoSrc() {
  if (typeof window === 'undefined') return VIDEO_DESKTOP
  return window.matchMedia('(max-width: 767px)').matches ? VIDEO_MOBILE : VIDEO_DESKTOP
}

export function HeroVideoScroll({ children }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoSrc, setVideoSrc] = useState(VIDEO_DESKTOP)

  useEffect(() => {
    const apply = () => setVideoSrc(pickVideoSrc())
    apply()
    const mq = window.matchMedia('(max-width: 767px)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      video.muted = true
      video.defaultMuted = true
      void video.play().catch(() => {})
    }

    video.addEventListener('canplay', play)
    video.addEventListener('loadeddata', play)

    const onGesture = () => play()
    window.addEventListener('pointerdown', onGesture, { passive: true })
    window.addEventListener('scroll', onGesture, { passive: true })

    play()
    void video.load()

    return () => {
      video.removeEventListener('canplay', play)
      video.removeEventListener('loadeddata', play)
      window.removeEventListener('pointerdown', onGesture)
      window.removeEventListener('scroll', onGesture)
    }
  }, [videoSrc])

  return (
    <section
      id="home-hero"
      className="relative z-0 flex min-h-[100dvh] max-h-[52rem] items-center justify-center overflow-hidden supports-[min-height:100svh]:min-h-[100svh]"
    >
      <div className="pointer-events-none absolute inset-0 size-full overflow-hidden" aria-hidden>
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
        />

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
