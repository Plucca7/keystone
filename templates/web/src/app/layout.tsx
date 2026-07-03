import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'

import '@/styles/globals.css'
import { Providers } from './providers'

// Neutral default typeface. This is a white-label template, so it ships with
// no brand identity: Inter is a widely available, unopinionated sans that the
// project owner is expected to swap for their own typeface. It binds to the
// same --font CSS variable the design tokens read, so replacing it here (or
// dropping in a different next/font import) is the only change needed.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'App',
  description: 'Web application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
