// Pricing Calculator for Blockchain Storage
// Business model: Charge 2x the actual blockchain cost

export interface StorageOption {
  id: string;
  name: string;
  description: string;
  baseRatePerByte: number; // in satoshis
  features: string[];
  icon: string;
}

export interface PricingBreakdown {
  wordCount: number;
  characterCount: number;
  byteSize: number;
  baseCostSatoshis: number;
  serviceFee: number; // Our 2x markup
  totalCostSatoshis: number;
  totalCostUSD: number;
  costPerWord: number;
}

// Storage options available to users
export const STORAGE_OPTIONS: StorageOption[] = [
  {
    id: 'op_pushdata4',
    name: 'OP_PUSHDATA4',
    description: 'Massive data storage - up to 4GB per transaction on Bitcoin SV',
    baseRatePerByte: 0.5, // satoshis per byte
    features: [
      'Up to 4GB per transaction',
      'Permanent storage',
      'Low cost per byte',
      'Best for large documents'
    ],
    icon: '📚'
  },
  {
    id: 'op_return',
    name: 'OP_RETURN',
    description: 'Standard data storage for documents',
    baseRatePerByte: 0.5, // satoshis per byte
    features: [
      'Unlimited size on BSV',
      'Permanent storage',
      'Quick confirmation',
      'Best for text documents'
    ],
    icon: '📝'
  },
  {
    id: 'encrypted_data',
    name: 'Encrypted Data Transaction',
    description: 'Maximum security with client-side encryption',
    baseRatePerByte: 0.75, // satoshis per byte
    features: [
      'End-to-end encryption',
      'Private by default',
      'Recoverable with key',
      'Best for sensitive content'
    ],
    icon: '🔐'
  },
  {
    id: 'metanet',
    name: 'Metanet Protocol',
    description: 'Structured data storage with versioning and linking',
    baseRatePerByte: 0.8, // satoshis per byte
    features: [
      'Version history',
      'Linked documents',
      'Structured metadata',
      'Graph-based storage'
    ],
    icon: '🌐'
  }
];

// Constants for pricing calculations
const SATOSHIS_PER_BITCOIN = 100_000_000;
const CENTS_PER_CHARACTER = 0.000001; // 1/100,000th of a penny per character = $0.00000001
const SERVICE_MULTIPLIER = 2; // We charge 2x the base cost
// const BYTES_PER_CHARACTER = 1; // Rough estimate for UTF-8 text - unused

// Get current Bitcoin price (mock - in production, fetch from API)
export const getBitcoinPriceUSD = async (): Promise<number> => {
  // TODO: Fetch from a real API like CoinGecko
  // For now, return a mock value
  return 30000; // $30,000 per BTC
};

// Calculate the size of a document in bytes
export const calculateDocumentSize = (content: string): number => {
  // More accurate byte calculation for UTF-8
  const blob = new Blob([content]);
  return blob.size;
};

// Calculate pricing for a document
export const calculatePricing = async (
  content: string,
  storageOption: StorageOption,
  btcPriceUSD?: number
): Promise<PricingBreakdown> => {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const characterCount = content.length;
  const byteSize = calculateDocumentSize(content);
  
  // Calculate base cost in USD (1/100,000th of a penny per character = $0.00000001)
  const baseCostUSD = characterCount * CENTS_PER_CHARACTER;
  
  // Apply our service fee (2x markup)
  const totalCostUSD = baseCostUSD * SERVICE_MULTIPLIER;
  const serviceFeeUSD = totalCostUSD - baseCostUSD;
  
  // Convert to satoshis for display
  const btcPrice = btcPriceUSD || await getBitcoinPriceUSD();
  const totalCostBTC = totalCostUSD / btcPrice;
  const totalCostSatoshis = totalCostBTC * SATOSHIS_PER_BITCOIN;
  const baseCostSatoshis = (baseCostUSD / btcPrice) * SATOSHIS_PER_BITCOIN;
  const serviceFeeSatoshis = (serviceFeeUSD / btcPrice) * SATOSHIS_PER_BITCOIN;
  
  // Calculate cost per word
  const costPerWord = wordCount > 0 ? totalCostUSD / wordCount : 0;
  
  return {
    wordCount,
    characterCount,
    byteSize,
    baseCostSatoshis: Math.round(baseCostSatoshis),
    serviceFee: Math.round(serviceFeeSatoshis),
    totalCostSatoshis: Math.round(totalCostSatoshis),
    totalCostUSD,
    costPerWord
  };
};

// Format satoshis to a readable string
export const formatSatoshis = (satoshis: number): string => {
  if (satoshis < 1000) {
    return `${satoshis} sats`;
  } else if (satoshis < 1_000_000) {
    return `${(satoshis / 1000).toFixed(2)}k sats`;
  } else {
    return `${(satoshis / 1_000_000).toFixed(4)} BTC`;
  }
};

// Format USD price - always show full dollar amount
export const formatUSD = (usd: number): string => {
  if (usd === 0) {
    return '$0.00';
  } else if (usd < 0.01) {
    // Show full precision for small amounts
    return `$${usd.toFixed(8)}`;
  } else if (usd < 1) {
    return `$${usd.toFixed(4)}`;
  } else {
    return `$${usd.toFixed(2)}`;
  }
};

// Estimate transaction confirmation time based on fee
export const estimateConfirmationTime = (satoshisPerByte: number): string => {
  if (satoshisPerByte >= 2) {
    return '~10 minutes';
  } else if (satoshisPerByte >= 1) {
    return '~30 minutes';
  } else if (satoshisPerByte >= 0.5) {
    return '~1 hour';
  } else {
    return '~2-6 hours';
  }
};

// Get a fun fact about the cost
export const getCostComparison = (usdCost: number): string => {
  if (usdCost === 0) {
    return "Free! Start writing! ✍️";
  } else if (usdCost < 0.00001) {
    return "Practically free! 🎁";
  } else if (usdCost < 0.0001) {
    return "Less than a dust particle! ✨";
  } else if (usdCost < 0.001) {
    return "Cheaper than a grain of sand! 🏖️";
  } else if (usdCost < 0.01) {
    return "Less than a penny! 🪙";
  } else if (usdCost < 0.10) {
    return "Cheaper than a gumball! 🍬";
  } else if (usdCost < 0.50) {
    return "Less than a postage stamp! 📮";
  } else if (usdCost < 1.00) {
    return "Less than a coffee! ☕";
  } else if (usdCost < 5.00) {
    return "About a fancy coffee! ☕";
  } else {
    return "Worth it for permanent storage! 💎";
  }
};