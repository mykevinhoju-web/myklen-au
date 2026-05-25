import { MotionFallback } from '@/components/motion-fallback'
import { MotionPreferenceBoot } from '@/components/motion-preference-boot'
import { ScrollHeroBleed } from '@/components/scroll-hero-bleed'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { ScrollMascotProvider } from '@/context/scroll-mascot'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ScrollMascotProvider>
      <ScrollHeroBleed />
      <MotionPreferenceBoot />
      <MotionFallback />
      <SiteHeader />
      <main className="site-main flex-1">{children}</main>
      <SiteFooter />
    </ScrollMascotProvider>
  )
}
