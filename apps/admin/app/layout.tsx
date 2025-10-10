import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: {
    default: 'Elite Motion Rentals Admin',
    template: '%s | Elite Motion Rentals Admin',
  },
  description: 'Admin panel for Elite Motion Rentals',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-body antialiased bg-neutral-50">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
