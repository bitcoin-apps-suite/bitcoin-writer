'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export default function BitcoinOSBridge({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize Bitcoin OS Bridge when component mounts
    if (typeof window !== 'undefined' && (window as any).BitcoinOSBridge) {
      const bridge = (window as any).BitcoinOSBridge
      bridge.init({
        taskbar: true,
        devBar: true,
        dock: true,
        pocBar: true
      })
    }
  }, [])

  return (
    <>
      <Script
        src="https://unpkg.com/@bitcoin-os/bridge@latest/dist/index.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).BitcoinOSBridge) {
            const bridge = (window as any).BitcoinOSBridge
            bridge.init({
              taskbar: true,
              devBar: true,
              dock: true,
              pocBar: true
            })
          }
        }}
      />
      {children}
    </>
  )
}