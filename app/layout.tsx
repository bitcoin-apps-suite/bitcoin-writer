import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bitcoin Writer',
  description: 'Encrypt, publish and sell shares in your work',
  keywords: ['bitcoin', 'writing', 'blockchain', 'handcash', 'bsv'],
  authors: [{ name: 'The Bitcoin Corporation LTD' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}