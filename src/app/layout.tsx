import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import { TawkTo } from '@/components/tawk-to'
import './globals.css'

const sans = DM_Sans({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'myklen — Start your cleaning business',
    template: '%s | myklen',
  },
  description:
    'Launch your own home cleaning business in Australia — booking tools, training, branding, uniforms, and growth support. Not a generic marketplace.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-AU" className={`${sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <TawkTo />
      </body>
    </html>
  )
}
