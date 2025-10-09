// Bitcoin OS Exchange Service
// Unified exchange backend for all bApps and Bitcoin OS

import { EventEmitter } from 'events'

// Exchange service types
export interface ExchangeConfig {
  apiUrl?: string
  wsUrl?: string
  network?: 'mainnet' | 'testnet'
  autoConnect?: boolean
}

export interface Market {
  id: string
  baseAsset: string
  quoteAsset: string
  price: number
  volume24h: number
  change24h: number
  high24h: number
  low24h: number
  bid: number
  ask: number
  lastTrade?: Trade
}

export interface OrderBook {
  bids: OrderBookLevel[]
  asks: OrderBookLevel[]
  timestamp: number
}

export interface OrderBookLevel {
  price: number
  quantity: number
  total: number
}

export interface Order {
  id: string
  market: string
  type: 'market' | 'limit'
  side: 'buy' | 'sell'
  price?: number
  quantity: number
  filled: number
  remaining: number
  status: 'open' | 'partial' | 'filled' | 'cancelled'
  timestamp: Date
  fee?: number
}

export interface Trade {
  id: string
  market: string
  price: number
  quantity: number
  side: 'buy' | 'sell'
  timestamp: Date
  fee?: number
  txid?: string
}

export interface Balance {
  asset: string
  available: number
  locked: number
  total: number
}

export interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'trade'
  asset: string
  amount: number
  status: 'pending' | 'confirmed' | 'failed'
  txid?: string
  timestamp: Date
  confirmations?: number
}

// Exchange service events
export interface ExchangeEvents {
  'connected': () => void
  'disconnected': () => void
  'market:update': (market: Market) => void
  'orderbook:update': (orderbook: OrderBook) => void
  'order:update': (order: Order) => void
  'trade:new': (trade: Trade) => void
  'balance:update': (balance: Balance) => void
  'error': (error: Error) => void
}

// Main Exchange Service Class
export class ExchangeService extends EventEmitter {
  private config: ExchangeConfig
  private ws: WebSocket | null = null
  private markets: Map<string, Market> = new Map()
  private orders: Map<string, Order> = new Map()
  private balances: Map<string, Balance> = new Map()
  private isConnected: boolean = false
  private reconnectTimer: NodeJS.Timeout | null = null
  private subscriptions: Set<string> = new Set()

  constructor(config: ExchangeConfig = {}) {
    super()
    this.config = {
      apiUrl: config.apiUrl || '/api/exchange',
      wsUrl: config.wsUrl || 'wss://exchange.bitcoinos.io',
      network: config.network || 'mainnet',
      autoConnect: config.autoConnect !== false
    }

    if (this.config.autoConnect && typeof window !== 'undefined') {
      this.connect()
    }
  }

  // Connection management
  async connect(): Promise<void> {
    if (this.isConnected) return

    try {
      // Initialize WebSocket connection for real-time updates
      if (typeof WebSocket !== 'undefined') {
        this.ws = new WebSocket(this.config.wsUrl!)
        this.setupWebSocketHandlers()
      }

      // Load initial market data
      await this.loadMarkets()
      await this.loadBalances()
      
      this.isConnected = true
      this.emit('connected')
    } catch (error) {
      this.handleError(error as Error)
      this.scheduleReconnect()
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.isConnected = false
    this.emit('disconnected')
  }

  private setupWebSocketHandlers(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('Exchange WebSocket connected')
      // Resubscribe to previous subscriptions
      this.subscriptions.forEach(sub => {
        this.ws?.send(JSON.stringify({ action: 'subscribe', channel: sub }))
      })
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleWebSocketMessage(data)
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error)
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.handleError(new Error('WebSocket connection error'))
    }

    this.ws.onclose = () => {
      console.log('Exchange WebSocket disconnected')
      this.isConnected = false
      this.emit('disconnected')
      this.scheduleReconnect()
    }
  }

  private handleWebSocketMessage(data: any): void {
    switch (data.type) {
      case 'market:update':
        this.updateMarket(data.market)
        break
      case 'orderbook:update':
        this.emit('orderbook:update', data.orderbook)
        break
      case 'order:update':
        this.updateOrder(data.order)
        break
      case 'trade:new':
        this.emit('trade:new', data.trade)
        break
      case 'balance:update':
        this.updateBalance(data.balance)
        break
      default:
        console.warn('Unknown WebSocket message type:', data.type)
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) return
    
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      if (!this.isConnected) {
        this.connect()
      }
    }, 5000)
  }

  // Market data methods
  async loadMarkets(): Promise<Market[]> {
    try {
      const response = await fetch(`${this.config.apiUrl}/markets`)
      const data = await response.json()
      
      if (data.success && data.markets) {
        data.markets.forEach((market: Market) => {
          this.markets.set(market.id, market)
        })
        return data.markets
      }
      
      throw new Error('Failed to load markets')
    } catch (error) {
      this.handleError(error as Error)
      return []
    }
  }

  getMarket(marketId: string): Market | undefined {
    return this.markets.get(marketId)
  }

  getAllMarkets(): Market[] {
    return Array.from(this.markets.values())
  }

  subscribeToMarket(marketId: string): void {
    if (!this.ws || !this.isConnected) return
    
    const channel = `market:${marketId}`
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.add(channel)
      this.ws.send(JSON.stringify({ action: 'subscribe', channel }))
    }
  }

  unsubscribeFromMarket(marketId: string): void {
    if (!this.ws || !this.isConnected) return
    
    const channel = `market:${marketId}`
    if (this.subscriptions.has(channel)) {
      this.subscriptions.delete(channel)
      this.ws.send(JSON.stringify({ action: 'unsubscribe', channel }))
    }
  }

  private updateMarket(market: Market): void {
    this.markets.set(market.id, market)
    this.emit('market:update', market)
  }

  // Order book methods
  async getOrderBook(marketId: string): Promise<OrderBook | null> {
    try {
      const response = await fetch(`${this.config.apiUrl}/orderbook/${marketId}`)
      const data = await response.json()
      
      if (data.success) {
        return data.orderbook
      }
      
      throw new Error('Failed to load order book')
    } catch (error) {
      this.handleError(error as Error)
      return null
    }
  }

  // Trading methods
  async placeOrder(order: Partial<Order>): Promise<Order | null> {
    try {
      const response = await fetch(`${this.config.apiUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'place_order', order })
      })
      
      const data = await response.json()
      
      if (data.success && data.order) {
        this.orders.set(data.order.id, data.order)
        return data.order
      }
      
      throw new Error(data.error || 'Failed to place order')
    } catch (error) {
      this.handleError(error as Error)
      return null
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.config.apiUrl}/orders/${orderId}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (data.success) {
        const order = this.orders.get(orderId)
        if (order) {
          order.status = 'cancelled'
          this.updateOrder(order)
        }
        return true
      }
      
      return false
    } catch (error) {
      this.handleError(error as Error)
      return false
    }
  }

  async getOrders(marketId?: string): Promise<Order[]> {
    try {
      const url = marketId 
        ? `${this.config.apiUrl}/orders?market=${marketId}`
        : `${this.config.apiUrl}/orders`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success && data.orders) {
        data.orders.forEach((order: Order) => {
          this.orders.set(order.id, order)
        })
        return data.orders
      }
      
      return []
    } catch (error) {
      this.handleError(error as Error)
      return []
    }
  }

  getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId)
  }

  private updateOrder(order: Order): void {
    this.orders.set(order.id, order)
    this.emit('order:update', order)
  }

  // Balance methods
  async loadBalances(): Promise<Balance[]> {
    try {
      const response = await fetch(`${this.config.apiUrl}/balances`)
      const data = await response.json()
      
      if (data.success && data.balances) {
        data.balances.forEach((balance: Balance) => {
          this.balances.set(balance.asset, balance)
        })
        return data.balances
      }
      
      return []
    } catch (error) {
      this.handleError(error as Error)
      return []
    }
  }

  getBalance(asset: string): Balance | undefined {
    return this.balances.get(asset)
  }

  getAllBalances(): Balance[] {
    return Array.from(this.balances.values())
  }

  private updateBalance(balance: Balance): void {
    this.balances.set(balance.asset, balance)
    this.emit('balance:update', balance)
  }

  // Transaction methods
  async deposit(asset: string, amount: number): Promise<Transaction | null> {
    try {
      const response = await fetch(`${this.config.apiUrl}/deposit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset, amount })
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.transaction
      }
      
      throw new Error(data.error || 'Failed to initiate deposit')
    } catch (error) {
      this.handleError(error as Error)
      return null
    }
  }

  async withdraw(asset: string, amount: number, address: string): Promise<Transaction | null> {
    try {
      const response = await fetch(`${this.config.apiUrl}/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset, amount, address })
      })
      
      const data = await response.json()
      
      if (data.success) {
        return data.transaction
      }
      
      throw new Error(data.error || 'Failed to initiate withdrawal')
    } catch (error) {
      this.handleError(error as Error)
      return null
    }
  }

  async getTransactionHistory(limit: number = 50): Promise<Transaction[]> {
    try {
      const response = await fetch(`${this.config.apiUrl}/transactions?limit=${limit}`)
      const data = await response.json()
      
      if (data.success) {
        return data.transactions || []
      }
      
      return []
    } catch (error) {
      this.handleError(error as Error)
      return []
    }
  }

  // Trade history
  async getTradeHistory(marketId?: string, limit: number = 50): Promise<Trade[]> {
    try {
      const url = marketId
        ? `${this.config.apiUrl}/trades?market=${marketId}&limit=${limit}`
        : `${this.config.apiUrl}/trades?limit=${limit}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        return data.trades || []
      }
      
      return []
    } catch (error) {
      this.handleError(error as Error)
      return []
    }
  }

  // Error handling
  private handleError(error: Error): void {
    console.error('Exchange service error:', error)
    this.emit('error', error)
  }

  // Utility methods
  calculateOrderValue(price: number, quantity: number): number {
    return price * quantity
  }

  calculateFee(value: number, feeRate: number = 0.002): number {
    return value * feeRate
  }

  formatPrice(price: number, decimals: number = 8): string {
    return price.toFixed(decimals)
  }

  formatQuantity(quantity: number, decimals: number = 8): string {
    return quantity.toFixed(decimals)
  }
}

// Singleton instance for global access
let exchangeInstance: ExchangeService | null = null

export const getExchangeService = (config?: ExchangeConfig): ExchangeService => {
  if (!exchangeInstance) {
    exchangeInstance = new ExchangeService(config)
  }
  return exchangeInstance
}

// React hooks for easy integration
export const useExchange = () => {
  return getExchangeService()
}

export default ExchangeService