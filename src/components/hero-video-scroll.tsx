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
      className="relative z-0 flex min-h-[100dvh] max-h-[52rem] items-center overflow-hidden supports-[min-height:100svh]:min-h-[100svh]"
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

        <div className="hero-video-warm-scrim absolute inset-0" aria-hidden />
      </div>

      <div className="hero-content relative z-10 flex flex-col px-5 py-12 max-md:pt-20 sm:px-8 sm:py-16 md:mr-auto md:ml-[clamp(2.5rem,9vw,6.5rem)] lg:ml-[clamp(3rem,11vw,7.5rem)]">
        {children}
      </div>
    </section>
  )
}
