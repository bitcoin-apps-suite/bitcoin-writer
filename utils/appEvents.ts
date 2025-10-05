// Bitcoin App Event Names
export const BitcoinAppEvents = {
  AUTH: 'openBitcoinAuth',
  CHAT: 'openBitcoinChat',
  DOMAINS: 'openBitcoinDomains',
  DRAW: 'openBitcoinDraw',
  EMAIL: 'openBitcoinEmail',
  EXCHANGE: 'openDocumentExchange', // Already exists
  MUSIC: 'openBitcoinMusic',
  PAINT: 'openBitcoinPaint',
  PICS: 'openBitcoinPics',
  REGISTRY: 'openBitcoinRegistry',
  SHARES: 'openBitcoinShares',
  VIDEO: 'openBitcoinVideo',
  WALLET: 'openBitcoinWallet',
  APPS: 'loadBitcoinApps' // Main apps overview
};

// Helper function to dispatch app events
export const openBitcoinApp = (eventName: string) => {
  const event = new CustomEvent(eventName);
  window.dispatchEvent(event);
};