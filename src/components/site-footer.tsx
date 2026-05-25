import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="site-footer-dark mt-auto">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-5 py-14 md:grid-cols-3 md:px-8 md:py-16 lg:px-10">
        <div>
          <p className="font-brand text-base text-white">myklen</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/65">
            Australia&apos;s cleaning business launch platform — training, branding, booking tools,
            and support so managers grow under their own brand.
          </p>
        </div>
        <div className="text-sm">
          <p className="type-eyebrow !text-white/45">Explore</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/packages" className="text-white/75 transition-colors hover:text-white">
                Packages
              </Link>
            </li>
            <li>
              <Link href="/partner" className="text-white/75 transition-colors hover:text-white">
                Become a partner
              </Link>
            </li>
            <li>
              <Link href="/for-customers" className="text-white/75 transition-colors hover:text-white">
                For customers
              </Link>
            </li>
            <li>
              <Link href="/training" className="text-white/75 transition-colors hover:text-white">
                Training
              </Link>
            </li>
            <li>
              <Link href="/shop" className="text-white/75 transition-colors hover:text-white">
                Supplies shop
              </Link>
            </li>
            <li>
              <Link href="/#about" className="text-white/75 transition-colors hover:text-white">
                About
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="type-eyebrow !text-white/45">Portals</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href="/customer/login" className="text-white/75 transition-colors hover:text-white">
                Customer login
              </Link>
            </li>
            <li>
              <Link href="/manager/login" className="text-white/75 transition-colors hover:text-white">
                Manager login
              </Link>
            </li>
            <li>
              <Link href="/admin/login" className="text-white/75 transition-colors hover:text-white">
                Admin login
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="border-t border-white/10 py-5 text-center text-xs text-white/45">
        © {new Date().getFullYear()} myklen — independent from kshop
      </p>
    </footer>
  )
}
