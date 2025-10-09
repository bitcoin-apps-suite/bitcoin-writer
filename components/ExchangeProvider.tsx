'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { ExchangeService, Market, Order, Balance, Trade, OrderBook, ExchangeConfig } from '../src/lib/exchange-service'

interface ExchangeContextType {
  exchange: ExchangeService | null
  markets: Market[]
  selectedMarket: Market | null
  orders: Order[]
  balances: Balance[]
  trades: Trade[]
  orderBook: OrderBook | null
  isConnected: boolean
  isLoading: boolean
  error: Error | null
  
  // Actions
  selectMarket: (marketId: string) => void
  placeOrder: (order: Partial<Order>) => Promise<Order | null>
  cancelOrder: (orderId: string) => Promise<boolean>
  refreshBalances: () => Promise<void>
  refreshOrders: () => Promise<void>
  refreshMarkets: () => Promise<void>
}

const ExchangeContext = createContext<ExchangeContextType | undefined>(undefined)

export interface ExchangeProviderProps {
  children: React.ReactNode
  config?: ExchangeConfig
  autoConnect?: boolean
}

export const ExchangeProvider: React.FC<ExchangeProviderProps> = ({
  children,
  config,
  autoConnect = true
}) => {
  const [exchange] = useState<ExchangeService>(() => new ExchangeService({
    ...config,
    autoConnect: false // We'll handle connection in the provider
  }))
  
  const [markets, setMarkets] = useState<Market[]>([])
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [balances, setBalances] = useState<Balance[]>([])
  const [trades, setTrades] = useState<Trade[]>([])
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize exchange connection
  useEffect(() => {
    if (!exchange || !autoConnect) return

    const initializeExchange = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        await exchange.connect()
        
        // Load initial data
        const marketsData = await exchange.loadMarkets()
        setMarkets(marketsData)
        
        if (marketsData.length > 0) {
          setSelectedMarket(marketsData[0])
        }
        
        const balancesData = await exchange.loadBalances()
        setBalances(balancesData)
        
        const ordersData = await exchange.getOrders()
        setOrders(ordersData)
        
        setIsConnected(true)
      } catch (err) {
        setError(err as Error)
        console.error('Failed to initialize exchange:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // Set up event listeners
    const handleConnected = () => setIsConnected(true)
    const handleDisconnected = () => setIsConnected(false)
    const handleMarketUpdate = (market: Market) => {
      setMarkets(prev => prev.map(m => m.id === market.id ? market : m))
      if (selectedMarket?.id === market.id) {
        setSelectedMarket(market)
      }
    }
    const handleOrderUpdate = (order: Order) => {
      setOrders(prev => {
        const index = prev.findIndex(o => o.id === order.id)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = order
          return updated
        }
        return [...prev, order]
      })
    }
    const handleBalanceUpdate = (balance: Balance) => {
      setBalances(prev => {
        const index = prev.findIndex(b => b.asset === balance.asset)
        if (index >= 0) {
          const updated = [...prev]
          updated[index] = balance
          return updated
        }
        return [...prev, balance]
      })
    }
    const handleTradeNew = (trade: Trade) => {
      setTrades(prev => [trade, ...prev].slice(0, 100)) // Keep last 100 trades
    }
    const handleOrderBookUpdate = (ob: OrderBook) => {
      setOrderBook(ob)
    }
    const handleError = (err: Error) => {
      setError(err)
      console.error('Exchange error:', err)
    }

    exchange.on('connected', handleConnected)
    exchange.on('disconnected', handleDisconnected)
    exchange.on('market:update', handleMarketUpdate)
    exchange.on('order:update', handleOrderUpdate)
    exchange.on('balance:update', handleBalanceUpdate)
    exchange.on('trade:new', handleTradeNew)
    exchange.on('orderbook:update', handleOrderBookUpdate)
    exchange.on('error', handleError)

    initializeExchange()

    return () => {
      exchange.off('connected', handleConnected)
      exchange.off('disconnected', handleDisconnected)
      exchange.off('market:update', handleMarketUpdate)
      exchange.off('order:update', handleOrderUpdate)
      exchange.off('balance:update', handleBalanceUpdate)
      exchange.off('trade:new', handleTradeNew)
      exchange.off('orderbook:update', handleOrderBookUpdate)
      exchange.off('error', handleError)
      
      exchange.disconnect()
    }
  }, [exchange, autoConnect])

  // Load order book when market changes
  useEffect(() => {
    if (!selectedMarket || !exchange) return

    const loadOrderBook = async () => {
      const ob = await exchange.getOrderBook(selectedMarket.id)
      if (ob) {
        setOrderBook(ob)
      }
    }

    loadOrderBook()
    
    // Subscribe to market updates
    exchange.subscribeToMarket(selectedMarket.id)

    return () => {
      exchange.unsubscribeFromMarket(selectedMarket.id)
    }
  }, [selectedMarket, exchange])

  // Actions
  const selectMarket = useCallback((marketId: string) => {
    const market = markets.find(m => m.id === marketId)
    if (market) {
      setSelectedMarket(market)
    }
  }, [markets])

  const placeOrder = useCallback(async (order: Partial<Order>) => {
    if (!exchange) return null
    
    try {
      const newOrder = await exchange.placeOrder(order)
      if (newOrder) {
        setOrders(prev => [...prev, newOrder])
        // Refresh balances after placing order
        await refreshBalances()
      }
      return newOrder
    } catch (err) {
      setError(err as Error)
      return null
    }
  }, [exchange])

  const cancelOrder = useCallback(async (orderId: string) => {
    if (!exchange) return false
    
    try {
      const success = await exchange.cancelOrder(orderId)
      if (success) {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: 'cancelled' } : o
        ))
        // Refresh balances after cancelling order
        await refreshBalances()
      }
      return success
    } catch (err) {
      setError(err as Error)
      return false
    }
  }, [exchange])

  const refreshBalances = useCallback(async () => {
    if (!exchange) return
    
    try {
      const balancesData = await exchange.loadBalances()
      setBalances(balancesData)
    } catch (err) {
      setError(err as Error)
    }
  }, [exchange])

  const refreshOrders = useCallback(async () => {
    if (!exchange) return
    
    try {
      const ordersData = await exchange.getOrders()
      setOrders(ordersData)
    } catch (err) {
      setError(err as Error)
    }
  }, [exchange])

  const refreshMarkets = useCallback(async () => {
    if (!exchange) return
    
    try {
      const marketsData = await exchange.loadMarkets()
      setMarkets(marketsData)
    } catch (err) {
      setError(err as Error)
    }
  }, [exchange])

  const value: ExchangeContextType = {
    exchange,
    markets,
    selectedMarket,
    orders,
    balances,
    trades,
    orderBook,
    isConnected,
    isLoading,
    error,
    selectMarket,
    placeOrder,
    cancelOrder,
    refreshBalances,
    refreshOrders,
    refreshMarkets
  }

  return (
    <ExchangeContext.Provider value={value}>
      {children}
    </ExchangeContext.Provider>
  )
}

// Hook to use exchange context
export const useExchangeContext = () => {
  const context = useContext(ExchangeContext)
  if (!context) {
    throw new Error('useExchangeContext must be used within ExchangeProvider')
  }
  return context
}

// Convenience hooks for specific exchange features
export const useMarkets = () => {
  const { markets, selectedMarket, selectMarket } = useExchangeContext()
  return { markets, selectedMarket, selectMarket }
}

export const useOrders = () => {
  const { orders, placeOrder, cancelOrder, refreshOrders } = useExchangeContext()
  return { orders, placeOrder, cancelOrder, refreshOrders }
}

export const useBalances = () => {
  const { balances, refreshBalances } = useExchangeContext()
  return { balances, refreshBalances }
}

export const useTrades = () => {
  const { trades } = useExchangeContext()
  return trades
}

export const useOrderBook = () => {
  const { orderBook } = useExchangeContext()
  return orderBook
}

export const useExchangeStatus = () => {
  const { isConnected, isLoading, error } = useExchangeContext()
  return { isConnected, isLoading, error }
}