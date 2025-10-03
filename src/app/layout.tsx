import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import BitcoinOSBridge from '@/components/BitcoinOSBridge'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bitcoin Twitter',
  description: 'A decentralized Twitter clone built on Bitcoin OS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <BitcoinOSBridge>
          <Providers>
            {children}
          </Providers>
        </BitcoinOSBridge>
      </body>
    </html>
  )
}