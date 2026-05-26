'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { isReducedMotion } from '@/lib/motion-preference'

/** Bump when replacing hero-scene*.mp4 so browsers skip cached old files */
const HERO_VIDEO_CACHE_VERSION = 'running-v2'

const VIDEO_DESKTOP = `/hero/hero-scene.mp4?v=${HERO_VIDEO_CACHE_VERSION}`
const VIDEO_MOBILE = `/hero/hero-scene-mobile.mp4?v=${HERO_VIDEO_CACHE_VERSION}`
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
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoSrc, setVideoSrc] = useState(VIDEO_DESKTOP)

  const showStillFallback = reduceMotion || videoFailed || !isPlaying

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
    const apply = () => {
      setIsPlaying(false)
      setVideoFailed(false)
      setVideoSrc(pickVideoSrc())
    }
    apply()
    const mq = window.matchMedia('(max-width: 767px)')
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [])

  const tryPlay = useCallback(async () => {
    const video = videoRef.current
    if (!video || reduceMotion) return false

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true

    try {
      await video.play()
      return !video.paused
    } catch {
      return false
    }
  }, [reduceMotion])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduceMotion) return

    setIsPlaying(false)
    setVideoFailed(false)

    let cancelled = false
    let retryTimer: ReturnType<typeof setInterval> | undefined

    const markPlaying = () => {
      if (!cancelled) setIsPlaying(true)
    }

    const onPlaying = () => markPlaying()
    const onError = () => {
      if (!cancelled) setVideoFailed(true)
    }

    const startPlayback = async () => {
      for (let attempt = 0; attempt < 8 && !cancelled; attempt += 1) {
        const ok = await tryPlay()
        if (ok) {
          markPlaying()
          return
        }
        await new Promise((r) => setTimeout(r, 200))
      }
    }

    video.addEventListener('playing', onPlaying)
    video.addEventListener('error', onError)
    video.addEventListener('canplay', () => void startPlayback())
    video.addEventListener('loadeddata', () => void startPlayback())

    retryTimer = setInterval(() => {
      if (!video.paused) {
        markPlaying()
        if (retryTimer) clearInterval(retryTimer)
        return
      }
      void startPlayback()
    }, 1200)

    const onUserGesture = () => {
      void startPlayback()
    }
    window.addEventListener('pointerdown', onUserGesture, { once: true, passive: true })
    window.addEventListener('scroll', onUserGesture, { once: true, passive: true })

    void video.load()
    void startPlayback()

    return () => {
      cancelled = true
      if (retryTimer) clearInterval(retryTimer)
      video.removeEventListener('playing', onPlaying)
      video.removeEventListener('error', onError)
      window.removeEventListener('pointerdown', onUserGesture)
      window.removeEventListener('scroll', onUserGesture)
    }
  }, [reduceMotion, videoSrc, tryPlay])

  return (
    <section
      id="home-hero"
      className="relative z-0 flex min-h-[100dvh] max-h-[52rem] items-center justify-center overflow-hidden supports-[min-height:100svh]:min-h-[100svh]"
    >
      <div className="pointer-events-none absolute inset-0 size-full overflow-hidden" aria-hidden>
        {!reduceMotion && (
          <video
            key={videoSrc}
            ref={videoRef}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
              isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            src={videoSrc}
            muted
            playsInline
            autoPlay
            loop
            preload="auto"
            disablePictureInPicture
            onError={() => setVideoFailed(true)}
          />
        )}

        {showStillFallback && (
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
