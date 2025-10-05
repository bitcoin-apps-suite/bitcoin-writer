/**
 * Bitcoin OS React Hook
 * Use this in your React apps to integrate with Bitcoin OS
 */

import { useEffect, useState, useCallback } from 'react'

interface BitcoinOSConfig {
  theme?: 'light' | 'dark'
  appName?: string
  [key: string]: any
}

export function useBitcoinOS() {
  const [isInOS, setIsInOS] = useState(false)
  const [config, setConfig] = useState<BitcoinOSConfig>({})
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Check if running inside Bitcoin OS
    const checkOS = () => {
      try {
        return window.parent !== window && window.parent.location.href.includes('bitcoin-os')
      } catch (e) {
        return window.parent !== window
      }
    }

    setIsInOS(checkOS())

    if (!checkOS()) return

    // Handle messages from OS
    const handleMessage = (event: MessageEvent) => {
      const { type, ...data } = event.data

      switch (type) {
        case 'os-config':
          setConfig(data)
          if (data.theme) {
            setTheme(data.theme)
            document.documentElement.setAttribute('data-theme', data.theme)
          }
          break
        case 'theme-change':
          setTheme(data.theme)
          document.documentElement.setAttribute('data-theme', data.theme)
          break
      }
    }

    window.addEventListener('message', handleMessage)

    // Notify OS that app is ready
    window.parent.postMessage({
      type: 'app-ready',
      app: window.location.hostname
    }, '*')

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [])

  const sendToOS = useCallback((type: string, data: any = {}) => {
    if (!isInOS) return
    
    window.parent.postMessage({
      type,
      ...data
    }, '*')
  }, [isInOS])

  const navigateHome = useCallback(() => {
    sendToOS('navigate-home')
  }, [sendToOS])

  const openApp = useCallback((appName: string) => {
    sendToOS('open-app', { app: appName })
  }, [sendToOS])

  const showNotification = useCallback((title: string, message: string) => {
    sendToOS('notification', { title, message })
  }, [sendToOS])

  const setTitle = useCallback((title: string) => {
    sendToOS('set-title', { title })
  }, [sendToOS])

  return {
    isInOS,
    config,
    theme,
    navigateHome,
    openApp,
    showNotification,
    setTitle,
    sendToOS
  }
}