'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { BrandLogo } from '@/components/brand-logo'
import { MascotLogo } from '@/components/mascot-logo'
import { useScrollMascot } from '@/context/scroll-mascot'
import { btnAccentHover } from '@/lib/motion-classes'
import { isKoreanSite, localeHomeHref } from '@/lib/locale-pages'

const navLinks = [
  { href: '/packages', label: 'Packages' },
  { href: '/partner', label: 'Partner' },
  { href: '/training', label: 'Training' },
  { href: '/contact', label: 'Contact' },
] as const

function isNavActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({
  href,
  label,
  pathname,
  onNavigate,
}: {
  href: string
  label: string
  pathname: string
  onNavigate?: () => void
}) {
  const active = isNavActive(pathname, href)
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`whitespace-nowrap rounded-lg px-1.5 py-1 text-sm font-medium transition-colors xl:px-2 xl:text-[0.9375rem] ${
        active ? 'text-[var(--foreground)]' : 'text-[#5c5c5c] hover:text-[var(--foreground)]'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}

const localeFlagClass =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/10 transition hover:ring-black/20'

/** Korean flag asset includes its own circle, shadow, and padding — avoid extra chrome or cropping. */
const localeKrFlagLinkClass =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center transition-opacity hover:opacity-90'

function LocaleSwitchLink({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  if (isKoreanSite(pathname)) {
    return (
      <Link
        href="/"
        onClick={onNavigate}
        className={localeFlagClass}
        aria-label="English site"
        title="English"
      >
        <span className="text-xl leading-none" role="img" aria-hidden>
          🇦🇺
        </span>
      </Link>
    )
  }

  return (
    <Link
      href="/ko"
      onClick={onNavigate}
      className={localeKrFlagLinkClass}
      aria-label="한국어 사이트"
      title="한국어"
    >
      <Image
        src="/brand/flag-kr.png"
        alt=""
        width={200}
        height={200}
        className="h-8 w-8 object-contain"
        unoptimized
      />
    </Link>
  )
}

function FloatingNavPill({
  pathname,
  mascotReveal,
  menuOpen,
  setMenuOpen,
  menuId,
}: {
  pathname: string
  mascotReveal: number
  menuOpen: boolean
  setMenuOpen: (v: boolean | ((o: boolean) => boolean)) => void
  menuId: string
}) {
  const pillRef = useRef<HTMLDivElement>(null)
  const homeHref = localeHomeHref(pathname)

  useEffect(() => {
    if (!menuOpen) return
    const onPointerDown = (e: PointerEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [menuOpen, setMenuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div
      ref={pillRef}
      className={`site-header-bar nav-float-pill fixed left-1/2 z-50 w-[calc(100vw-1.25rem)] max-w-[26rem] -translate-x-1/2 overflow-hidden rounded-[1.35rem] border border-black/8 bg-white/94 backdrop-blur-xl transition-[box-shadow] duration-300 sm:max-w-[32rem] lg:w-[min(calc(100vw-2rem),56rem)] lg:max-w-none ${
        menuOpen ? 'nav-float-pill--open' : ''
      }`}
    >
      <div className="flex h-14 items-center gap-2 px-3 sm:gap-2.5 sm:px-3.5 lg:px-4">
        <Link
          href={homeHref}
          className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2"
          aria-label="myklen — home"
          onClick={closeMenu}
        >
          <MascotLogo reveal={mascotReveal} className="!h-10 sm:!h-11" />
          <BrandLogo
            priority
            className="!h-[1.375rem] !max-w-[6rem] sm:!h-[1.625rem] sm:!max-w-[7.25rem]"
          />
        </Link>

        <nav
          className="hidden flex-1 flex-nowrap items-center justify-center gap-0 lg:flex xl:gap-0.5"
          aria-label="Main"
        >
          {navLinks.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-1.5 lg:flex lg:pl-0.5">
          <Link
            href="/customer/login"
            className="whitespace-nowrap rounded-lg px-1.5 py-1 text-sm font-medium text-[#5c5c5c] hover:text-[var(--foreground)] xl:px-2 xl:text-[0.9375rem]"
          >
            Login
          </Link>
          <Link
            href="/packages"
            className={`whitespace-nowrap rounded-full bg-[var(--hero-accent)] px-3.5 py-1.5 text-sm font-medium text-white shadow-sm shadow-[#e85a4f]/15 hover:bg-[var(--hero-accent-hover)] xl:px-4 xl:py-2 xl:text-[0.9375rem] ${btnAccentHover}`}
          >
            Get started
          </Link>
          <LocaleSwitchLink pathname={pathname} />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:hidden">
          <LocaleSwitchLink pathname={pathname} onNavigate={closeMenu} />
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--foreground)] hover:bg-black/5"
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" className="text-current" aria-hidden>
              {menuOpen ? (
                <path
                  d="M4 4l8 8M12 4L4 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path d="M2 5h12M2 8h12M2 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`nav-float-panel grid transition-[grid-template-rows] duration-300 ease-out ${
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`transition-[opacity,filter,transform] duration-300 ease-out ${
              menuOpen
                ? 'opacity-100 blur-0 translate-y-0'
                : 'pointer-events-none opacity-0 blur-sm -translate-y-1'
            }`}
          >
            {menuOpen && (
              <nav id={menuId} className="border-t border-black/8 p-2.5 lg:hidden" aria-label="Mobile">
                <ul className="mb-2 flex flex-col gap-0.5">
                  {navLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        className={`block rounded-lg px-3 py-3 text-[0.9375rem] font-medium ${
                          isNavActive(pathname, item.href)
                            ? 'bg-black/5 text-[var(--foreground)]'
                            : 'text-[var(--foreground)]/90 hover:bg-black/5'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="space-y-1 border-t border-black/8 pt-2">
                  <Link
                    href="/customer/login"
                    className="block rounded-lg px-3 py-3 text-[0.9375rem] font-medium text-[var(--foreground)]/90 hover:bg-black/5"
                    onClick={closeMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/packages"
                    onClick={closeMenu}
                    className={`block rounded-full bg-[var(--hero-accent)] px-3 py-3 text-center text-[0.9375rem] font-medium text-white shadow-sm shadow-[#e85a4f]/15 hover:bg-[var(--hero-accent-hover)] ${btnAccentHover}`}
                  >
                    Get started
                  </Link>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function SiteHeader() {
  const { reveal, isHome } = useScrollMascot()
  const mascotReveal = isHome ? reveal : 0
  const pathname = usePathname()
  const menuId = useId()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      <div className="h-[4rem] shrink-0 sm:h-[4.35rem] lg:h-[5.1rem]" aria-hidden />
      <FloatingNavPill
        pathname={pathname}
        mascotReveal={mascotReveal}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        menuId={menuId}
      />
    </>
  )
}
