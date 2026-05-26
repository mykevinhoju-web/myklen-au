'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'
import { BrandLogo } from '@/components/brand-logo'
import { MascotLogo } from '@/components/mascot-logo'
import { useScrollMascot } from '@/context/scroll-mascot'
import { btnHover } from '@/lib/motion-classes'
import {
  getLocaleNavCopy,
  getLocalePageDescription,
  isLocaleActive,
  localeHomeHref,
  localePages,
} from '@/lib/locale-pages'

const navLinks = [
  { href: '/packages', label: 'Packages' },
  { href: '/partner', label: 'Partner' },
  { href: '/training', label: 'Training' },
  { href: 'about', label: 'About' },
] as const

function resolveNavHref(pathname: string, href: string) {
  if (href === 'about') return `${localeHomeHref(pathname)}#about`
  return href
}

function isNavActive(pathname: string, href: string) {
  if (href === 'about') return pathname === '/' || pathname === '/ko'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
      aria-hidden
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
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
      className={`whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-medium transition-colors xl:px-2.5 xl:text-[0.9375rem] ${
        active ? 'text-[#0a0a0a]' : 'text-[#5c5c5c] hover:text-[#0a0a0a]'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}

function LanguagePanel({
  pathname,
  onNavigate,
}: {
  pathname: string
  onNavigate?: () => void
}) {
  const navCopy = getLocaleNavCopy(pathname)
  return (
    <div className="p-2.5">
      <p className="px-3 pb-2 text-xs font-medium text-[#5c5c5c]">{navCopy.panelHint}</p>
      <div className="grid grid-cols-2 gap-2">
        {localePages.map((item) => {
          const active = isLocaleActive(pathname, item.href)
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              className={`flex flex-col items-center gap-2.5 rounded-xl px-3 py-5 transition-colors hover:bg-black/[0.03] ${
                active ? 'bg-black/[0.06] ring-1 ring-[#0a0a0a]/12' : 'bg-black/[0.04]'
              }`}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className="locale-flag flex h-11 w-11 items-center justify-center rounded-full bg-white text-[1.75rem] leading-none shadow-sm ring-1 ring-black/10"
                role="img"
                aria-label={item.flagLabel}
              >
                {item.flag}
              </span>
              <span className="flex flex-col items-center text-center">
                <span className="text-sm font-medium text-[#0a0a0a]">{item.label}</span>
                <span className="mt-0.5 text-xs font-medium text-[#5c5c5c]">
                  {getLocalePageDescription(item.id, pathname)}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function FloatingNavPill({
  pathname,
  mascotReveal,
  menuOpen,
  setMenuOpen,
  localeOpen,
  setLocaleOpen,
  menuId,
}: {
  pathname: string
  mascotReveal: number
  menuOpen: boolean
  setMenuOpen: (v: boolean | ((o: boolean) => boolean)) => void
  localeOpen: boolean
  setLocaleOpen: (v: boolean | ((o: boolean) => boolean)) => void
  menuId: string
}) {
  const expanded = menuOpen || localeOpen
  const pillRef = useRef<HTMLDivElement>(null)
  const homeHref = localeHomeHref(pathname)
  const localeNav = getLocaleNavCopy(pathname)

  useEffect(() => {
    if (!expanded) return
    const onPointerDown = (e: PointerEvent) => {
      if (!pillRef.current?.contains(e.target as Node)) {
        setLocaleOpen(false)
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [expanded, setLocaleOpen, setMenuOpen])

  const closeAll = () => {
    setLocaleOpen(false)
    setMenuOpen(false)
  }

  return (
    <div
      ref={pillRef}
      className={`site-header-bar nav-float-pill fixed left-1/2 z-50 w-[calc(100vw-1.25rem)] max-w-[26rem] -translate-x-1/2 overflow-hidden rounded-[1.35rem] border border-black/8 bg-white/94 shadow-lg shadow-black/8 backdrop-blur-xl transition-[box-shadow] duration-300 sm:max-w-[32rem] lg:w-[min(calc(100vw-2rem),56rem)] lg:max-w-none ${
        expanded ? 'nav-float-pill--open' : ''
      }`}
    >
      <div className="flex h-[3.75rem] items-center gap-2.5 px-3.5 sm:h-16 sm:gap-3 sm:px-4 lg:px-5">
        <Link
          href={homeHref}
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
          aria-label="myklen — home"
          onClick={closeAll}
        >
          <MascotLogo reveal={mascotReveal} className="!h-9 sm:!h-10" />
          <BrandLogo
            priority
            className="!h-5 !max-w-[5.5rem] sm:!h-6 sm:!max-w-[6.5rem]"
          />
        </Link>

        <nav
          className="hidden flex-1 flex-nowrap items-center justify-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Main"
        >
          <button
            type="button"
            className={`flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors xl:px-2.5 xl:text-[0.9375rem] ${
              localeOpen ? 'text-[#0a0a0a]' : 'text-[#5c5c5c] hover:text-[#0a0a0a]'
            }`}
            aria-expanded={localeOpen}
            aria-haspopup="true"
            aria-label={localeNav.ariaLabel}
            onClick={() => {
              setMenuOpen(false)
              setLocaleOpen((o) => !o)
            }}
          >
            {localeNav.menuLabel}
            <Chevron open={localeOpen} />
          </button>
          {navLinks.map((item) => (
            <NavLink
              key={item.href}
              href={resolveNavHref(pathname, item.href)}
              label={item.label}
              pathname={pathname}
            />
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex lg:pl-1">
          <Link
            href="/customer/login"
            className="whitespace-nowrap rounded-lg px-2 py-1.5 text-sm font-medium text-[#5c5c5c] hover:text-[#0a0a0a] xl:px-2.5 xl:text-[0.9375rem]"
          >
            Login
          </Link>
          <Link
            href="/packages"
            className={`whitespace-nowrap rounded-full bg-[#0a0a0a] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#1a1a1a] xl:px-4 xl:text-[0.9375rem] ${btnHover}`}
          >
            Get started
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#0a0a0a] hover:bg-black/5 lg:hidden"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => {
            setLocaleOpen(false)
            setMenuOpen((o) => !o)
          }}
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
              <>
                <path d="M2 5h12M2 8h12M2 11h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      <div
        className={`nav-float-panel grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`transition-[opacity,filter,transform] duration-300 ease-out ${
              expanded
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
                        href={resolveNavHref(pathname, item.href)}
                        onClick={closeAll}
                        className={`block rounded-lg px-3 py-3 text-[0.9375rem] font-medium ${
                          isNavActive(pathname, item.href)
                            ? 'bg-black/5 text-[#0a0a0a]'
                            : 'text-[#0a0a0a]/90 hover:bg-black/5'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="mb-2 flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[0.9375rem] font-medium text-[#0a0a0a] hover:bg-black/5"
                  aria-expanded={localeOpen}
                  aria-label={localeNav.ariaLabel}
                  onClick={() => setLocaleOpen((o) => !o)}
                >
                  {localeNav.menuLabel}
                  <Chevron open={localeOpen} />
                </button>
                {localeOpen && <LanguagePanel pathname={pathname} onNavigate={closeAll} />}
                <div className="mt-2 space-y-1 border-t border-black/8 pt-2">
                  <Link
                    href="/customer/login"
                    className="block rounded-lg px-3 py-3 text-[0.9375rem] font-medium text-[#0a0a0a]/90 hover:bg-black/5"
                    onClick={closeAll}
                  >
                    Login
                  </Link>
                  <Link
                    href="/packages"
                    onClick={closeAll}
                    className={`block rounded-full bg-[#0a0a0a] px-3 py-3 text-center text-[0.9375rem] font-medium text-white hover:bg-[#1a1a1a] ${btnHover}`}
                  >
                    Get started
                  </Link>
                </div>
              </nav>
            )}
            {localeOpen && !menuOpen && (
              <div className="hidden border-t border-black/8 lg:block">
                <LanguagePanel pathname={pathname} onNavigate={closeAll} />
              </div>
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
  const [localeOpen, setLocaleOpen] = useState(false)

  useEffect(() => {
    setMenuOpen(false)
    setLocaleOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        setLocaleOpen(false)
      }
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!localeOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLocaleOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [localeOpen])

  return (
    <>
      <div className="h-[4.5rem] shrink-0 sm:h-[4.85rem] lg:h-[5.75rem]" aria-hidden />
      <FloatingNavPill
        pathname={pathname}
        mascotReveal={mascotReveal}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        localeOpen={localeOpen}
        setLocaleOpen={setLocaleOpen}
        menuId={menuId}
      />
    </>
  )
}
