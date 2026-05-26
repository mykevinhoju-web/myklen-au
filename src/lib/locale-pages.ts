/** Locale home pages — add entries here when new language sites ship */

export const localePages = [
  {
    id: 'en',
    href: '/',
    label: 'English',
    flag: '🇦🇺',
    flagLabel: 'Australia',
  },
  {
    id: 'ko',
    href: '/ko',
    label: '한국어',
    flag: '🇰🇷',
    flagLabel: 'South Korea',
  },
] as const

export type LocalePageId = (typeof localePages)[number]['id']

export function isKoreanSite(pathname: string) {
  return pathname === '/ko' || pathname.startsWith('/ko/')
}

/** Header language menu copy follows the current site locale */
export function getLocaleNavCopy(pathname: string) {
  if (isKoreanSite(pathname)) {
    return {
      menuLabel: '언어',
      panelHint: '사이트 언어를 선택하세요',
      ariaLabel: '사이트 언어 선택',
    }
  }
  return {
    menuLabel: 'Language',
    panelHint: 'Choose your site language',
    ariaLabel: 'Choose site language',
  }
}

export function getLocalePageDescription(pageId: LocalePageId, pathname: string) {
  if (isKoreanSite(pathname)) {
    return pageId === 'en' ? '호주 · 영문 사이트' : '통합 안내 페이지'
  }
  return pageId === 'en' ? 'Australia · marketing site' : 'Full overview in Korean'
}

export function isLocaleActive(pathname: string, href: string) {
  if (href === '/ko') return pathname === '/ko' || pathname.startsWith('/ko/')
  if (href === '/') return pathname !== '/ko' && !pathname.startsWith('/ko/')
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function localeHomeHref(pathname: string) {
  return pathname === '/ko' || pathname.startsWith('/ko/') ? '/ko' : '/'
}
