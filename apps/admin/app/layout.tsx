import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: {
    default: 'FlyRentals Admin',
    template: '%s | FlyRentals Admin',
  },
  description: 'Admin panel for FlyRentals',
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
