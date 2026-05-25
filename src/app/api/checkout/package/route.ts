import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getPackageBySlug } from '@/lib/packages-store'
import { siteOrigin } from '@/lib/site-url'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  return new Stripe(key)
}

export async function POST(request: Request) {
  const body = (await request.json()) as { packageSlug?: string }
  const slug = body.packageSlug?.trim()
  if (!slug) {
    return NextResponse.json({ error: 'packageSlug required' }, { status: 400 })
  }

  const pkg = await getPackageBySlug(slug)
  if (!pkg) {
    return NextResponse.json({ error: 'Package not found' }, { status: 404 })
  }

  const stripe = getStripe()
  const siteUrl = siteOrigin(request)

  if (!stripe) {
    return NextResponse.json(
      {
        error:
          'Stripe is not configured. Add STRIPE_SECRET_KEY to .env.local (see .env.local.example).',
      },
      { status: 503 },
    )
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: pkg.stripePriceId
      ? [{ price: pkg.stripePriceId, quantity: 1 }]
      : [
          {
            price_data: {
              currency: 'aud',
              product_data: {
                name: `myklen ${pkg.name} Package`,
                description: pkg.description,
              },
              unit_amount: Math.round(pkg.priceAud * 100),
            },
            quantity: 1,
          },
        ],
    success_url: `${siteUrl}/checkout/success?package=${pkg.slug}`,
    cancel_url: `${siteUrl}/packages/${pkg.slug}`,
    metadata: { packageSlug: pkg.slug, packageId: pkg.id },
  })

  if (!session.url) {
    return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 })
  }

  return NextResponse.json({ url: session.url })
}
