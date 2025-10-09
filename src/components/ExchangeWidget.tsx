'use client'

import React, { useState } from 'react'
import { useExchangeContext, useMarkets, useBalances, useOrders } from './ExchangeProvider'
import { TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpDown } from 'lucide-react'

export interface ExchangeWidgetProps {
  compact?: boolean
  showBalances?: boolean
  showOrders?: boolean
  className?: string
}

export const ExchangeWidget: React.FC<ExchangeWidgetProps> = ({
  compact = false,
  showBalances = true,
  showOrders = true,
  className = ''
}) => {
  const { isConnected, isLoading, error } = useExchangeContext()
  const { markets, selectedMarket, selectMarket } = useMarkets()
  const { balances } = useBalances()
  const { orders, placeOrder, cancelOrder } = useOrders()
  
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy')
  const [orderPrice, setOrderPrice] = useState('')
  const [orderQuantity, setOrderQuantity] = useState('')
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const handlePlaceOrder = async () => {
    if (!selectedMarket || !orderPrice || !orderQuantity) return
    
    setIsPlacingOrder(true)
    try {
      await placeOrder({
        market: selectedMarket.id,
        type: 'limit',
        side: orderSide,
        price: parseFloat(orderPrice),
        quantity: parseFloat(orderQuantity)
      })
      
      // Reset form
      setOrderPrice('')
      setOrderQuantity('')
    } catch (err) {
      console.error('Failed to place order:', err)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`bg-gray-900 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-8 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-red-900/20 border border-red-500 rounded-lg p-4 ${className}`}>
        <p className="text-red-400 text-sm">Exchange connection error</p>
      </div>
    )
  }

  if (compact) {
    // Compact view - just show selected market price
    return (
      <div className={`bg-gray-900 rounded-lg p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <select
            value={selectedMarket?.id || ''}
            onChange={(e) => selectMarket(e.target.value)}
            className="bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
          >
            {markets.map(market => (
              <option key={market.id} value={market.id}>
                {market.id}
              </option>
            ))}
          </select>
          
          {selectedMarket && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-white">
                ${selectedMarket.price.toFixed(2)}
              </span>
              <span className={`flex items-center text-xs ${
                selectedMarket.change24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {selectedMarket.change24h >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(selectedMarket.change24h).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Full widget view
  return (
    <div className={`bg-gray-900 rounded-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-orange-500" />
            Exchange
          </h3>
          <div className={`flex items-center gap-1 ${isConnected ? 'text-green-500' : 'text-gray-500'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-xs">{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>

        {/* Market selector */}
        <select
          value={selectedMarket?.id || ''}
          onChange={(e) => selectMarket(e.target.value)}
          className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700"
        >
          {markets.map(market => (
            <option key={market.id} value={market.id}>
              {market.id}
            </option>
          ))}
        </select>

        {/* Market info */}
        {selectedMarket && (
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div>
              <span className="text-gray-400">Price:</span>
              <span className="ml-2 font-mono text-white">
                ${selectedMarket.price.toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-400">24h:</span>
              <span className={`ml-2 ${
                selectedMarket.change24h >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {selectedMarket.change24h >= 0 ? '+' : ''}{selectedMarket.change24h.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-gray-400">Volume:</span>
              <span className="ml-2 font-mono text-white">
                ${(selectedMarket.volume24h / 1000).toFixed(1)}K
              </span>
            </div>
            <div>
              <span className="text-gray-400">Spread:</span>
              <span className="ml-2 font-mono text-white">
                ${(selectedMarket.ask - selectedMarket.bid).toFixed(2)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Trading Interface */}
      <div className="p-4">
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setOrderSide('buy')}
            className={`flex-1 py-2 rounded font-medium transition-colors ${
              orderSide === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setOrderSide('sell')}
            className={`flex-1 py-2 rounded font-medium transition-colors ${
              orderSide === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Sell
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Price</label>
            <input
              type="number"
              value={orderPrice}
              onChange={(e) => setOrderPrice(e.target.value)}
              placeholder={selectedMarket?.price.toFixed(2)}
              className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Quantity</label>
            <input
              type="number"
              value={orderQuantity}
              onChange={(e) => setOrderQuantity(e.target.value)}
              placeholder="0.00"
              className="w-full bg-gray-800 text-white rounded px-3 py-2 border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Total</label>
            <div className="bg-gray-800 text-white rounded px-3 py-2 border border-gray-700">
              {orderPrice && orderQuantity 
                ? `$${(parseFloat(orderPrice) * parseFloat(orderQuantity)).toFixed(2)}`
                : '$0.00'
              }
            </div>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={!orderPrice || !orderQuantity || isPlacingOrder}
          className={`w-full mt-4 py-2 rounded font-medium transition-colors ${
            orderSide === 'buy'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isPlacingOrder ? 'Placing Order...' : `Place ${orderSide} Order`}
        </button>
      </div>

      {/* Balances */}
      {showBalances && balances.length > 0 && (
        <div className="border-t border-gray-800 p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Balances
          </h4>
          <div className="space-y-2">
            {balances.map(balance => (
              <div key={balance.asset} className="flex justify-between text-sm">
                <span className="text-gray-400">{balance.asset}:</span>
                <span className="font-mono text-white">
                  {balance.available.toFixed(8)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders */}
      {showOrders && orders.length > 0 && (
        <div className="border-t border-gray-800 p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Open Orders</h4>
          <div className="space-y-2">
            {orders
              .filter(o => o.status === 'open' || o.status === 'partial')
              .map(order => (
                <div key={order.id} className="bg-gray-800 rounded p-2">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className={order.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
                        {order.side.toUpperCase()}
                      </span>
                      <span className="text-gray-400 ml-2">{order.market}</span>
                    </div>
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {order.quantity} @ ${order.price}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ExchangeWidget