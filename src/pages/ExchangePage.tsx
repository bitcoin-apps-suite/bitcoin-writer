import React, { useEffect, useState } from 'react';
import { ExchangeProvider } from '../components/ExchangeProvider';
import ExchangeWidget from '../components/ExchangeWidget';
import { getOrdinalsExchange } from '../lib/ordinals-exchange-service';
import { TrendingUp, Package, DollarSign, Coins } from 'lucide-react';

export default function ExchangePage() {
  const [activeTab, setActiveTab] = useState<'exchange' | 'ordinals' | 'brc100'>('exchange');
  const [ordinalsExchange] = useState(() => getOrdinalsExchange());
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Connect to ordinals exchange
    const initOrdinals = async () => {
      try {
        await ordinalsExchange.connect();
        const marketListings = await ordinalsExchange.loadMarketplace();
        setListings(marketListings);
      } catch (error) {
        console.error('Failed to connect to ordinals exchange:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initOrdinals();

    return () => {
      ordinalsExchange.disconnect();
    };
  }, [ordinalsExchange]);

  return (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      {/* Header */}
      <div className="bg-black border-b border-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              Bitcoin Writer Exchange
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Powered by</span>
              <span className="text-orange-500 font-semibold">1sat ordinals</span>
              <span className="text-gray-400">&</span>
              <span className="text-blue-500 font-semibold">BRC-100</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('exchange')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'exchange'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Exchange
            </button>
            <button
              onClick={() => setActiveTab('ordinals')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'ordinals'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Package className="w-4 h-4" />
              Ordinals Market
            </button>
            <button
              onClick={() => setActiveTab('brc100')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'brc100'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <Coins className="w-4 h-4" />
              BRC-100 Tokens
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === 'exchange' && (
          <ExchangeProvider>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ExchangeWidget showBalances={true} showOrders={true} />
              </div>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    Quick Trade
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full py-2 bg-green-600 hover:bg-green-700 rounded text-white transition-colors">
                      Buy BSV
                    </button>
                    <button className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-white transition-colors">
                      Sell BSV
                    </button>
                    <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors">
                      Swap Tokens
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Exchange Features</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Real-time market data</li>
                    <li>• 1sat ordinals trading</li>
                    <li>• BRC-100 token support</li>
                    <li>• Document tokenization</li>
                    <li>• Instant settlements</li>
                    <li>• Low fees (0.2%)</li>
                  </ul>
                </div>
              </div>
            </div>
          </ExchangeProvider>
        )}

        {activeTab === 'ordinals' && (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {listings.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No ordinals listings available</p>
                    <button className="mt-4 px-6 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors">
                      List Your First Ordinal
                    </button>
                  </div>
                ) : (
                  listings.map((listing) => (
                    <div key={listing.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors">
                      <div className="aspect-square bg-gray-900 rounded-lg mb-3 flex items-center justify-center">
                        <Package className="w-12 h-12 text-gray-600" />
                      </div>
                      <h4 className="font-semibold truncate">{listing.ordinal.inscriptionId}</h4>
                      <p className="text-sm text-gray-400">#{listing.ordinal.number}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-orange-500 font-bold">
                          {listing.price} {listing.currency}
                        </span>
                        <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 rounded text-sm transition-colors">
                          Buy
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'brc100' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">BRC-100 Token Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Coins className="w-8 h-8 text-orange-500 mb-2" />
                  <p className="font-semibold">Deploy Token</p>
                  <p className="text-sm text-gray-400">Create new BRC-100 token</p>
                </button>
                <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <DollarSign className="w-8 h-8 text-green-500 mb-2" />
                  <p className="font-semibold">Mint Tokens</p>
                  <p className="text-sm text-gray-400">Mint existing tokens</p>
                </button>
                <button className="p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <TrendingUp className="w-8 h-8 text-blue-500 mb-2" />
                  <p className="font-semibold">Transfer</p>
                  <p className="text-sm text-gray-400">Send tokens to others</p>
                </button>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Your BRC-100 Tokens</h3>
              <div className="text-center py-8 text-gray-400">
                <Coins className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Connect wallet to view your tokens</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}