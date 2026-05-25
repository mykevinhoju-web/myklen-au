import { LayerSection } from '@/components/layer-section'

export const metadata = { title: 'Supplies shop' }

export default function ShopPage() {
  return (
    <div className="site-stack mx-auto w-full max-w-[90rem] px-3 py-3 sm:px-4 md:px-5">
      <LayerSection className="layer-inner mx-auto max-w-3xl">
        <p className="type-eyebrow">Shop</p>
        <h1 className="type-display mt-3 text-3xl sm:text-4xl">Supplies &amp; branded goods</h1>
        <p className="type-lead mt-5">
          Cleaning products, t-shirts, and print orders (business cards &amp; pamphlets) will live here.
          Managers can order after package purchase. Coming soon in Phase 1b.
        </p>
        <p className="type-lead mt-8 rounded-2xl border border-dashed border-black/12 bg-[#fafafa] p-6 text-base">
          Shop catalogue and cart will mirror the e-commerce pattern but stay separate from kshop-au.
        </p>
      </LayerSection>
    </div>
  )
}
