'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { isReducedMotion } from '@/lib/motion-preference'
import { getViewportHeight } from '@/lib/viewport-height'

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

function getTrackProgress(track: HTMLElement) {
  const rect = track.getBoundingClientRect()
  const viewport = getViewportHeight()
  const scrollRange = track.offsetHeight - viewport
  if (scrollRange <= 0) return 0
  const scrolled = Math.max(0, -rect.top)
  return Math.min(1, scrolled / scrollRange)
}

/** Copy stays fully visible for most of the scroll, then fades out very slowly */
function heroCopyMotion(progress: number) {
  const fadeStart = 0.68
  const fadeEnd = 1
  if (progress <= fadeStart) {
    return { opacity: 1, y: 0 }
  }
  const t = Math.min(1, (progress - fadeStart) / (fadeEnd - fadeStart))
  const eased = 1 - Math.pow(1 - t, 5)
  return {
    opacity: Math.max(0, 1 - eased),
    y: eased * -20,
  }
}

export function HeroVideoScroll({ children }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const durationRef = useRef(0)
  const [progress, setProgress] = useState(0)
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

  const applyVideoFrame = (p: number) => {
    const video = videoRef.current
    if (!video || reduceMotion || !durationRef.current) return

    video.pause()
    const target = p * durationRef.current
    if (Math.abs(video.currentTime - target) > 0.04) {
      video.currentTime = target
    }
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video || reduceMotion) return

    setVideoReady(false)
    setVideoFailed(false)
    durationRef.current = 0

    const showFirstFrame = () => {
      setVideoReady(true)
      const track = trackRef.current
      if (track) applyVideoFrame(getTrackProgress(track))
    }

    const parkAtStart = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return
      durationRef.current = video.duration
      video.pause()
      video.addEventListener('seeked', showFirstFrame, { once: true })
      video.currentTime = 0
    }

    const onMeta = () => parkAtStart()

    const onLoadedData = () => {
      if (!videoReady && video.readyState >= 2) showFirstFrame()
    }

    const prime = () => {
      if (video.readyState < 1) void video.load()
    }

    video.addEventListener('loadedmetadata', onMeta, { once: true })
    video.addEventListener('loadeddata', onLoadedData, { once: true })
    window.addEventListener('touchstart', prime, { once: true, passive: true })
    if (video.readyState >= 1) onMeta()
    else void video.load()

    return () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('loadeddata', onLoadedData)
      window.removeEventListener('touchstart', prime)
    }
  }, [reduceMotion, videoSrc])

  useEffect(() => {
    const update = () => {
      const track = trackRef.current
      if (!track) return

      if (reduceMotion) {
        setProgress(0)
        return
      }

      const p = getTrackProgress(track)
      setProgress(p)
      applyVideoFrame(p)
    }

    update()
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    window.visualViewport?.addEventListener('resize', onScroll)
    window.visualViewport?.addEventListener('scroll', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('resize', onScroll)
      window.visualViewport?.removeEventListener('scroll', onScroll)
    }
  }, [reduceMotion, videoReady])

  const p = progress
  const copy = heroCopyMotion(p)
  const scale = 1 + p * 0.18
  const videoY = p * -12
  const lightWash = 0.42 + p * 0.08
  const contentY = copy.y
  const contentOpacity = copy.opacity
  const motionStyle = reduceMotion
    ? {}
    : {
        transform: `translate3d(0, ${videoY}%, 0) scale(${scale})`,
      }

  return (
    <div
      ref={trackRef}
      className="relative h-[125vh] max-md:min-h-0 md:h-[140vh] md:min-h-[640px] lg:h-[160vh]"
    >
      <section
        id="home-hero"
        className="sticky top-0 z-0 flex h-[100dvh] max-h-[52rem] min-h-[100dvh] items-center justify-center overflow-hidden supports-[height:100svh]:h-[100svh] supports-[height:100svh]:min-h-[100svh]"
      >
        <div className="pointer-events-none absolute inset-0 size-full overflow-hidden" aria-hidden>
          <div
            className="absolute inset-0 origin-center will-change-transform transition-opacity duration-300"
            style={{ ...motionStyle, opacity: videoReady && !videoFailed ? 1 : 0 }}
          >
            <video
              key={videoSrc}
              ref={videoRef}
              className="absolute inset-0 size-full object-cover"
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              poster={POSTER_SRC}
              onError={() => setVideoFailed(true)}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>

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
            className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/38 to-white/28"
            style={{ opacity: lightWash }}
            aria-hidden
          />
        </div>

        <div
          className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-12 text-center max-md:pt-20 sm:px-8 sm:py-16 will-change-[opacity,transform]"
          style={
            reduceMotion
              ? undefined
              : {
                  opacity: contentOpacity,
                  transform: `translate3d(0, ${contentY}px, 0)`,
                }
          }
        >
          {children}
        </div>
      </section>
    </div>
  )
}
