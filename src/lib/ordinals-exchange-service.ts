// Ordinals & BRC-100 Exchange Service
// Integrates 1sat ordinals and BRC-100 protocol for Bitcoin OS

import { EventEmitter } from 'events'

// Ordinals types based on 1sat ordinals and ordinals protocol
export interface Ordinal {
  id: string
  number: number
  satoshi: number
  content: string
  contentType: string
  inscriptionId: string
  owner: string
  genesis: {
    height: number
    fee: number
    timestamp: number
  }
  location: string
  output: string
  offset: number
}

export interface BRC100Token {
  tick: string
  max: string
  lim: string
  dec: number
  minted: string
  holders: number
  inscriptionNumber: number
  inscriptionId: string
}

export interface OrdinalListing {
  id: string
  ordinal: Ordinal
  price: number
  seller: string
  currency: 'BSV' | 'BTC' | 'USD' | 'SATS'
  timestamp: Date
  status: 'active' | 'sold' | 'cancelled'
  brc100?: BRC100Token
}

export interface InscriptionRequest {
  content: string | Buffer
  contentType: string
  destination?: string
  feeRate?: number
  metaData?: Record<string, any>
  brc100?: {
    op: 'deploy' | 'mint' | 'transfer'
    tick?: string
    amt?: string
    max?: string
    lim?: string
    dec?: number
  }
}

export interface OrdinalMarketStats {
  floor: number
  volume24h: number
  sales24h: number
  listings: number
  owners: number
  totalSupply: number
}

// Ordinals Exchange Service
export class OrdinalsExchangeService extends EventEmitter {
  private apiUrl: string
  private wsUrl: string
  private isConnected: boolean = false
  private listings: Map<string, OrdinalListing> = new Map()
  private collections: Map<string, OrdinalMarketStats> = new Map()
  private ws: WebSocket | null = null

  constructor(config?: {
    apiUrl?: string
    wsUrl?: string
    network?: 'mainnet' | 'testnet'
  }) {
    super()
    this.apiUrl = config?.apiUrl || 'https://api.1satordinals.com/v1'
    this.wsUrl = config?.wsUrl || 'wss://stream.1satordinals.com'
  }

  // Connection management
  async connect(): Promise<void> {
    if (this.isConnected) return

    try {
      // Connect to 1sat ordinals WebSocket
      if (typeof WebSocket !== 'undefined') {
        this.ws = new WebSocket(this.wsUrl)
        this.setupWebSocketHandlers()
      }

      // Load initial market data
      await this.loadMarketplace()
      
      this.isConnected = true
      this.emit('connected')
    } catch (error) {
      this.emit('error', error)
      throw error
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isConnected = false
    this.emit('disconnected')
  }

  private setupWebSocketHandlers(): void {
    if (!this.ws) return

    this.ws.onopen = () => {
      console.log('Connected to 1sat ordinals stream')
      // Subscribe to market updates
      this.ws?.send(JSON.stringify({
        type: 'subscribe',
        channels: ['marketplace', 'inscriptions', 'brc100']
      }))
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleStreamMessage(data)
      } catch (error) {
        console.error('Failed to parse ordinals stream message:', error)
      }
    }

    this.ws.onerror = (error) => {
      console.error('Ordinals WebSocket error:', error)
      this.emit('error', new Error('WebSocket connection error'))
    }

    this.ws.onclose = () => {
      this.isConnected = false
      this.emit('disconnected')
      // Auto-reconnect after 5 seconds
      setTimeout(() => this.connect(), 5000)
    }
  }

  private handleStreamMessage(data: any): void {
    switch (data.type) {
      case 'listing:new':
        this.addListing(data.listing)
        break
      case 'listing:sold':
        this.updateListingStatus(data.listingId, 'sold')
        break
      case 'listing:cancelled':
        this.updateListingStatus(data.listingId, 'cancelled')
        break
      case 'inscription:new':
        this.emit('inscription:new', data.inscription)
        break
      case 'brc100:activity':
        this.emit('brc100:activity', data.activity)
        break
      case 'stats:update':
        this.updateCollectionStats(data.collection, data.stats)
        break
    }
  }

  // Inscription methods
  async inscribe(request: InscriptionRequest): Promise<{
    orderId: string
    inscriptionAddress: string
    fee: number
  }> {
    try {
      const response = await fetch(`${this.apiUrl}/inscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Inscription failed')
      }

      return data.result
    } catch (error) {
      this.emit('error', error)
      throw error
    }
  }

  async getInscription(inscriptionId: string): Promise<Ordinal | null> {
    try {
      const response = await fetch(`${this.apiUrl}/inscription/${inscriptionId}`)
      const data = await response.json()
      
      if (data.success) {
        return data.inscription
      }
      
      return null
    } catch (error) {
      this.emit('error', error)
      return null
    }
  }

  async getInscriptionContent(inscriptionId: string): Promise<Buffer | null> {
    try {
      const response = await fetch(`${this.apiUrl}/content/${inscriptionId}`)
      
      if (response.ok) {
        const buffer = await response.arrayBuffer()
        return Buffer.from(buffer)
      }
      
      return null
    } catch (error) {
      this.emit('error', error)
      return null
    }
  }

  // BRC-100 methods
  async deployBRC100Token(params: {
    tick: string
    max: string
    lim: string
    dec?: number
  }): Promise<string> {
    const inscriptionRequest: InscriptionRequest = {
      content: JSON.stringify({
        p: 'brc-100',
        op: 'deploy',
        tick: params.tick,
        max: params.max,
        lim: params.lim,
        dec: params.dec || 18
      }),
      contentType: 'application/json',
      brc100: {
        op: 'deploy',
        ...params
      }
    }

    const result = await this.inscribe(inscriptionRequest)
    return result.orderId
  }

  async mintBRC100(tick: string, amount: string): Promise<string> {
    const inscriptionRequest: InscriptionRequest = {
      content: JSON.stringify({
        p: 'brc-100',
        op: 'mint',
        tick: tick,
        amt: amount
      }),
      contentType: 'application/json',
      brc100: {
        op: 'mint',
        tick,
        amt: amount
      }
    }

    const result = await this.inscribe(inscriptionRequest)
    return result.orderId
  }

  async transferBRC100(tick: string, amount: string, to: string): Promise<string> {
    const inscriptionRequest: InscriptionRequest = {
      content: JSON.stringify({
        p: 'brc-100',
        op: 'transfer',
        tick: tick,
        amt: amount
      }),
      contentType: 'application/json',
      destination: to,
      brc100: {
        op: 'transfer',
        tick,
        amt: amount
      }
    }

    const result = await this.inscribe(inscriptionRequest)
    return result.orderId
  }

  async getBRC100Balance(address: string, tick?: string): Promise<{
    tick: string
    available: string
    transferable: string
    total: string
  }[]> {
    try {
      const url = tick 
        ? `${this.apiUrl}/brc100/balance/${address}/${tick}`
        : `${this.apiUrl}/brc100/balance/${address}`
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.success) {
        return data.balances
      }
      
      return []
    } catch (error) {
      this.emit('error', error)
      return []
    }
  }

  // Marketplace methods
  async loadMarketplace(): Promise<OrdinalListing[]> {
    try {
      const response = await fetch(`${this.apiUrl}/marketplace/listings`)
      const data = await response.json()
      
      if (data.success && data.listings) {
        data.listings.forEach((listing: OrdinalListing) => {
          this.listings.set(listing.id, listing)
        })
        return data.listings
      }
      
      return []
    } catch (error) {
      this.emit('error', error)
      return []
    }
  }

  async listOrdinal(params: {
    inscriptionId: string
    price: number
    currency: 'BSV' | 'BTC' | 'USD' | 'SATS'
  }): Promise<OrdinalListing | null> {
    try {
      const response = await fetch(`${this.apiUrl}/marketplace/list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })

      const data = await response.json()
      
      if (data.success && data.listing) {
        this.addListing(data.listing)
        return data.listing
      }
      
      throw new Error(data.error || 'Failed to list ordinal')
    } catch (error) {
      this.emit('error', error)
      return null
    }
  }

  async buyOrdinal(listingId: string): Promise<{
    txid: string
    ordinalId: string
  } | null> {
    try {
      const response = await fetch(`${this.apiUrl}/marketplace/buy/${listingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })

      const data = await response.json()
      
      if (data.success) {
        this.updateListingStatus(listingId, 'sold')
        return data.result
      }
      
      throw new Error(data.error || 'Failed to buy ordinal')
    } catch (error) {
      this.emit('error', error)
      return null
    }
  }

  async cancelListing(listingId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/marketplace/cancel/${listingId}`, {
        method: 'POST'
      })

      const data = await response.json()
      
      if (data.success) {
        this.updateListingStatus(listingId, 'cancelled')
        return true
      }
      
      return false
    } catch (error) {
      this.emit('error', error)
      return false
    }
  }

  // Collection methods
  async getCollectionStats(collectionId: string): Promise<OrdinalMarketStats | null> {
    try {
      const response = await fetch(`${this.apiUrl}/collection/${collectionId}/stats`)
      const data = await response.json()
      
      if (data.success) {
        this.collections.set(collectionId, data.stats)
        return data.stats
      }
      
      return null
    } catch (error) {
      this.emit('error', error)
      return null
    }
  }

  async getCollectionOrdinals(collectionId: string, params?: {
    offset?: number
    limit?: number
    sort?: 'number' | 'price' | 'rarity'
  }): Promise<Ordinal[]> {
    try {
      const queryParams = new URLSearchParams({
        offset: String(params?.offset || 0),
        limit: String(params?.limit || 50),
        sort: params?.sort || 'number'
      })
      
      const response = await fetch(
        `${this.apiUrl}/collection/${collectionId}/ordinals?${queryParams}`
      )
      const data = await response.json()
      
      if (data.success) {
        return data.ordinals
      }
      
      return []
    } catch (error) {
      this.emit('error', error)
      return []
    }
  }

  // Search methods
  async searchOrdinals(query: string, filters?: {
    contentType?: string
    minNumber?: number
    maxNumber?: number
    owner?: string
  }): Promise<Ordinal[]> {
    try {
      const params = new URLSearchParams({ q: query })
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, String(value))
          }
        })
      }
      
      const response = await fetch(`${this.apiUrl}/search?${params}`)
      const data = await response.json()
      
      if (data.success) {
        return data.results
      }
      
      return []
    } catch (error) {
      this.emit('error', error)
      return []
    }
  }

  // Helper methods
  private addListing(listing: OrdinalListing): void {
    this.listings.set(listing.id, listing)
    this.emit('listing:new', listing)
  }

  private updateListingStatus(listingId: string, status: 'sold' | 'cancelled'): void {
    const listing = this.listings.get(listingId)
    if (listing) {
      listing.status = status
      this.emit(`listing:${status}`, listing)
    }
  }

  private updateCollectionStats(collectionId: string, stats: OrdinalMarketStats): void {
    this.collections.set(collectionId, stats)
    this.emit('collection:stats', { collectionId, stats })
  }

  // Getters
  getListings(): OrdinalListing[] {
    return Array.from(this.listings.values())
      .filter(l => l.status === 'active')
  }

  getListing(id: string): OrdinalListing | undefined {
    return this.listings.get(id)
  }

  getCollectionStatsCache(collectionId: string): OrdinalMarketStats | undefined {
    return this.collections.get(collectionId)
  }
}

// Singleton instance
let ordinalsExchangeInstance: OrdinalsExchangeService | null = null

export const getOrdinalsExchange = (config?: any): OrdinalsExchangeService => {
  if (!ordinalsExchangeInstance) {
    ordinalsExchangeInstance = new OrdinalsExchangeService(config)
  }
  return ordinalsExchangeInstance
}

export default OrdinalsExchangeService