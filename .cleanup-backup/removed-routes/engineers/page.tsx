'use client'

import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Database, 
  DollarSign, 
  GitBranch, 
  Users, 
  Calculator,
  TrendingUp,
  Shield,
  Zap,
  FileCode,
  ExternalLink
} from 'lucide-react';
import './engineers.css';

export default function EngineersPage() {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    setMounted(true);
    
    const saved = localStorage.getItem('devSidebarCollapsed');
    setDevSidebarCollapsed(saved === 'true');
    setIsMobile(window.innerWidth <= 768);

    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  return (
    <div className="App">
      <div className={`engineers-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="engineers-container">
          {/* Hero Section */}
          <section className="engineers-hero">
            <div className="engineers-hero-icon">
              <Code size={64} />
            </div>
            <h1>Bitcoin Writer <span style={{color: '#FF6B35'}}>Engineers Specification</span></h1>
            <p className="engineers-tagline">
              Technical specification for the $BWRITER token dividend distribution system
            </p>
            <div className="engineers-badge">TECHNICAL SPEC v1.0</div>
          </section>

          {/* Navigation */}
          <section className="engineers-nav-section">
            <div className="engineers-nav">
              <button 
                className={activeSection === 'overview' ? 'active' : ''}
                onClick={() => setActiveSection('overview')}
              >
                <Database size={16} />
                Overview
              </button>
              <button 
                className={activeSection === 'schema' ? 'active' : ''}
                onClick={() => setActiveSection('schema')}
              >
                <FileCode size={16} />
                Dividend Schema
              </button>
              <button 
                className={activeSection === 'calculation' ? 'active' : ''}
                onClick={() => setActiveSection('calculation')}
              >
                <Calculator size={16} />
                Calculation Logic
              </button>
              <button 
                className={activeSection === 'implementation' ? 'active' : ''}
                onClick={() => setActiveSection('implementation')}
              >
                <Code size={16} />
                Implementation
              </button>
              <button 
                className={activeSection === 'api' ? 'active' : ''}
                onClick={() => setActiveSection('api')}
              >
                <Zap size={16} />
                API Reference
              </button>
            </div>
          </section>

          {/* Overview Section */}
          {activeSection === 'overview' && (
            <section className="engineers-section">
              <h2><Database size={24} style={{marginRight: '8px', verticalAlign: 'middle'}} />System Overview</h2>
              <p>
                The Bitcoin Writer dividend distribution system is built on BSV blockchain technology, 
                enabling automatic revenue sharing with $BWRITER token holders based on platform performance.
              </p>
              
              <div className="system-architecture">
                <h3>Architecture Components</h3>
                <div className="arch-grid">
                  <div className="arch-component">
                    <Shield size={32} />
                    <h4>Token Contract</h4>
                    <p>BSV-21 compliant smart contract managing $BWRITER token supply and holders</p>
                  </div>
                  <div className="arch-component">
                    <DollarSign size={32} />
                    <h4>Revenue Engine</h4>
                    <p>Aggregates platform revenue from subscriptions, exchange fees, and marketplace transactions</p>
                  </div>
                  <div className="arch-component">
                    <Calculator size={32} />
                    <h4>Distribution Logic</h4>
                    <p>Calculates dividend amounts based on token holdings and distribution schedule</p>
                  </div>
                  <div className="arch-component">
                    <TrendingUp size={32} />
                    <h4>Payment System</h4>
                    <p>Executes micropayment distributions to token holders via BSV transactions</p>
                  </div>
                </div>
              </div>

              <div className="key-principles">
                <h3>Key Design Principles</h3>
                <ul>
                  <li><strong>Transparency:</strong> All dividend distributions are recorded on-chain</li>
                  <li><strong>Proportionality:</strong> Dividends distributed based on token ownership percentage</li>
                  <li><strong>Efficiency:</strong> Batched micropayments minimize transaction costs</li>
                  <li><strong>Automation:</strong> Smart contracts handle distribution without manual intervention</li>
                  <li><strong>Compliance:</strong> Adheres to regulatory frameworks for digital securities</li>
                </ul>
              </div>
            </section>
          )}

          {/* Schema Section */}
          {activeSection === 'schema' && (
            <section className="engineers-section">
              <h2><FileCode size={24} style={{marginRight: '8px', verticalAlign: 'middle'}} />Dividend Schema</h2>
              
              <div className="schema-overview">
                <p>
                  The dividend distribution system uses a structured data schema to track revenue, 
                  token holdings, and payment distributions.
                </p>
              </div>

              <div className="schema-section">
                <h3>Revenue Collection Schema</h3>
                <div className="code-block">
                  <pre>{`interface RevenueRecord {
  id: string;                    // Unique identifier
  timestamp: number;             // Unix timestamp
  source: 'subscription' | 'exchange' | 'marketplace' | 'other';
  amount: number;                // Amount in satoshis
  currency: 'BSV' | 'USD';       // Revenue currency
  transactionId?: string;        // BSV transaction hash if applicable
  metadata: {
    userId?: string;             // Contributing user ID
    planType?: string;           // Subscription plan type
    exchangePair?: string;       // Trading pair for exchange fees
    listingId?: string;          // Marketplace listing ID
  };
}`}</pre>
                </div>
              </div>

              <div className="schema-section">
                <h3>Token Holder Schema</h3>
                <div className="code-block">
                  <pre>{`interface TokenHolder {
  address: string;               // BSV address holding tokens
  balance: number;               // Token balance
  lastUpdated: number;           // Last balance update timestamp
  joinedAt: number;              // First token acquisition timestamp
  totalReceived: number;         // Total dividends received (satoshis)
  isActive: boolean;             // Whether address is eligible for dividends
}`}</pre>
                </div>
              </div>

              <div className="schema-section">
                <h3>Dividend Distribution Schema</h3>
                <div className="code-block">
                  <pre>{`interface DividendDistribution {
  id: string;                    // Distribution ID
  timestamp: number;             // Distribution timestamp
  totalRevenue: number;          // Total revenue period (satoshis)
  totalTokens: number;           // Total token supply at snapshot
  distributionRate: number;      // Percentage of revenue distributed
  recipientCount: number;        // Number of eligible token holders
  payments: DividendPayment[];   // Individual payments
  transactionId: string;         // BSV transaction ID
  status: 'pending' | 'completed' | 'failed';
}

interface DividendPayment {
  address: string;               // Recipient BSV address
  tokenBalance: number;          // Token balance at snapshot
  dividendAmount: number;        // Dividend amount (satoshis)
  percentage: number;            // Percentage of total distribution
}`}</pre>
                </div>
              </div>

              <div className="schema-section">
                <h3>Distribution Schedule Schema</h3>
                <div className="code-block">
                  <pre>{`interface DistributionSchedule {
  frequency: 'weekly' | 'monthly' | 'quarterly';
  nextDistribution: number;      // Next scheduled distribution timestamp
  minimumRevenue: number;        // Minimum revenue threshold (satoshis)
  distributionPercentage: number; // Percentage of revenue to distribute (0-100)
  gasReserve: number;            // Reserved amount for transaction fees
  lastDistribution?: string;     // ID of last completed distribution
}`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* Calculation Logic Section */}
          {activeSection === 'calculation' && (
            <section className="engineers-section">
              <h2><Calculator size={24} style={{marginRight: '8px', verticalAlign: 'middle'}} />Calculation Logic</h2>
              
              <div className="calculation-overview">
                <p>
                  Dividend calculations follow a proportional distribution model based on token ownership 
                  percentage at the time of distribution snapshot.
                </p>
              </div>

              <div className="calculation-section">
                <h3>Basic Distribution Formula</h3>
                <div className="formula-block">
                  <div className="formula">
                    <code>
                      Individual Dividend = (Token Balance / Total Supply) × Distributable Revenue
                    </code>
                  </div>
                  <p>Where Distributable Revenue = Total Period Revenue × Distribution Percentage</p>
                </div>
              </div>

              <div className="calculation-section">
                <h3>Revenue Aggregation</h3>
                <div className="code-block">
                  <pre>{`function calculatePeriodRevenue(
  startTimestamp: number,
  endTimestamp: number
): number {
  const subscriptionRevenue = aggregateRevenue('subscription', startTimestamp, endTimestamp);
  const exchangeRevenue = aggregateRevenue('exchange', startTimestamp, endTimestamp);
  const marketplaceRevenue = aggregateRevenue('marketplace', startTimestamp, endTimestamp);
  
  return subscriptionRevenue + exchangeRevenue + marketplaceRevenue;
}

function aggregateRevenue(
  source: RevenueSource,
  start: number,
  end: number
): number {
  return revenueRecords
    .filter(record => 
      record.source === source &&
      record.timestamp >= start &&
      record.timestamp <= end
    )
    .reduce((total, record) => total + record.amount, 0);
}`}</pre>
                </div>
              </div>

              <div className="calculation-section">
                <h3>Token Snapshot Logic</h3>
                <div className="code-block">
                  <pre>{`function takeTokenSnapshot(): TokenSnapshot {
  const snapshot: TokenSnapshot = {
    timestamp: Date.now(),
    totalSupply: getCurrentTotalSupply(),
    holders: []
  };

  // Get all token holders at current block
  const holders = getTokenHolders();
  
  for (const holder of holders) {
    const balance = getTokenBalance(holder.address);
    if (balance > 0) {
      snapshot.holders.push({
        address: holder.address,
        balance: balance,
        percentage: (balance / snapshot.totalSupply) * 100
      });
    }
  }

  return snapshot;
}`}</pre>
                </div>
              </div>

              <div className="calculation-section">
                <h3>Distribution Calculation</h3>
                <div className="code-block">
                  <pre>{`function calculateDividends(
  totalRevenue: number,
  snapshot: TokenSnapshot,
  distributionRate: number = 0.25 // 25% of revenue
): DividendPayment[] {
  const distributableAmount = totalRevenue * distributionRate;
  const payments: DividendPayment[] = [];

  for (const holder of snapshot.holders) {
    const dividendAmount = Math.floor(
      (holder.balance / snapshot.totalSupply) * distributableAmount
    );
    
    if (dividendAmount > 0) {
      payments.push({
        address: holder.address,
        tokenBalance: holder.balance,
        dividendAmount: dividendAmount,
        percentage: (holder.balance / snapshot.totalSupply) * 100
      });
    }
  }

  return payments;
}`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* Implementation Section */}
          {activeSection === 'implementation' && (
            <section className="engineers-section">
              <h2><Code size={24} style={{marginRight: '8px', verticalAlign: 'middle'}} />Implementation Details</h2>
              
              <div className="implementation-overview">
                <p>
                  The dividend system is implemented using TypeScript/Node.js backend services 
                  with BSV blockchain integration for transparent, automated distributions.
                </p>
              </div>

              <div className="implementation-section">
                <h3>Core Service Architecture</h3>
                <div className="code-block">
                  <pre>{`// services/DividendService.ts
export class DividendService {
  private revenueCollector: RevenueCollector;
  private tokenTracker: TokenTracker;
  private paymentProcessor: PaymentProcessor;
  private distributionScheduler: DistributionScheduler;

  constructor() {
    this.revenueCollector = new RevenueCollector();
    this.tokenTracker = new TokenTracker();
    this.paymentProcessor = new PaymentProcessor();
    this.distributionScheduler = new DistributionScheduler();
  }

  async processScheduledDistribution(): Promise<DividendDistribution> {
    // 1. Calculate period revenue
    const revenue = await this.revenueCollector.getPeriodRevenue();
    
    // 2. Take token holder snapshot
    const snapshot = await this.tokenTracker.takeSnapshot();
    
    // 3. Calculate dividend payments
    const payments = this.calculateDividends(revenue, snapshot);
    
    // 4. Execute blockchain payments
    const txId = await this.paymentProcessor.distributePayments(payments);
    
    // 5. Record distribution
    return this.recordDistribution(revenue, snapshot, payments, txId);
  }
}`}</pre>
                </div>
              </div>

              <div className="implementation-section">
                <h3>BSV Integration</h3>
                <div className="code-block">
                  <pre>{`// services/BSVIntegration.ts
import { PrivateKey, Transaction, P2PKH } from '@bsv/sdk';

export class BSVPaymentProcessor {
  private privateKey: PrivateKey;

  async distributeDividends(payments: DividendPayment[]): Promise<string> {
    const tx = new Transaction();
    
    // Add inputs (platform wallet UTXOs)
    const utxos = await this.getAvailableUTXOs();
    for (const utxo of utxos) {
      tx.addInput(utxo);
    }

    // Add dividend payment outputs
    for (const payment of payments) {
      const script = new P2PKH().lock(payment.address);
      tx.addOutput({
        script: script,
        satoshis: payment.dividendAmount
      });
    }

    // Add change output
    const change = this.calculateChange(utxos, payments);
    if (change > 0) {
      tx.addOutput({
        script: new P2PKH().lock(this.getChangeAddress()),
        satoshis: change
      });
    }

    // Sign and broadcast
    tx.sign();
    const txId = await this.broadcastTransaction(tx);
    
    return txId;
  }
}`}</pre>
                </div>
              </div>

              <div className="implementation-section">
                <h3>Database Schema (PostgreSQL)</h3>
                <div className="code-block">
                  <pre>{`-- Revenue tracking table
CREATE TABLE revenue_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp BIGINT NOT NULL,
  source VARCHAR(50) NOT NULL,
  amount BIGINT NOT NULL,
  currency VARCHAR(10) NOT NULL,
  transaction_id VARCHAR(64),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Token holder tracking
CREATE TABLE token_holders (
  address VARCHAR(64) PRIMARY KEY,
  balance BIGINT NOT NULL,
  last_updated BIGINT NOT NULL,
  joined_at BIGINT NOT NULL,
  total_received BIGINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

-- Dividend distributions
CREATE TABLE dividend_distributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp BIGINT NOT NULL,
  total_revenue BIGINT NOT NULL,
  total_tokens BIGINT NOT NULL,
  distribution_rate DECIMAL(5,4) NOT NULL,
  recipient_count INTEGER NOT NULL,
  transaction_id VARCHAR(64),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Individual dividend payments
CREATE TABLE dividend_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  distribution_id UUID REFERENCES dividend_distributions(id),
  address VARCHAR(64) NOT NULL,
  token_balance BIGINT NOT NULL,
  dividend_amount BIGINT NOT NULL,
  percentage DECIMAL(10,8) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)`}</pre>
                </div>
              </div>
            </section>
          )}

          {/* API Reference Section */}
          {activeSection === 'api' && (
            <section className="engineers-section">
              <h2><Zap size={24} style={{marginRight: '8px', verticalAlign: 'middle'}} />API Reference</h2>
              
              <div className="api-overview">
                <p>
                  RESTful API endpoints for interacting with the dividend distribution system.
                  All endpoints require appropriate authentication and authorization.
                </p>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/dividends/schedule</span>
                </div>
                <div className="endpoint-description">
                  Get current dividend distribution schedule
                </div>
                <div className="code-block">
                  <pre>
                    curl -X GET https://api.bitcoinwriter.com/dividends/schedule \<br />
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                  </pre>
                </div>
                <div className="response-example">
                  <h4>Response:</h4>
                  <div className="code-block">
                    <pre>
                      &#123;<br />
                      &nbsp;&nbsp;"frequency": "monthly",<br />
                      &nbsp;&nbsp;"nextDistribution": 1706832000,<br />
                      &nbsp;&nbsp;"minimumRevenue": 100000000,<br />
                      &nbsp;&nbsp;"distributionPercentage": 25,<br />
                      &nbsp;&nbsp;"lastDistribution": "550e8400-e29b-41d4-a716-446655440000"<br />
                      &#125;
                    </pre>
                  </div>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/dividends/history</span>
                </div>
                <div className="endpoint-description">
                  Get historical dividend distributions
                </div>
                <div className="code-block">
                  <pre>
                    curl -X GET https://api.bitcoinwriter.com/dividends/history?limit=10 \<br />
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                  </pre>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/dividends/address/:address</span>
                </div>
                <div className="endpoint-description">
                  Get dividend history for specific address
                </div>
                <div className="code-block">
                  <pre>
                    curl -X GET https://api.bitcoinwriter.com/dividends/address/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa \<br />
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                  </pre>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method post">POST</span>
                  <span className="endpoint-url">/api/dividends/simulate</span>
                </div>
                <div className="endpoint-description">
                  Simulate dividend distribution with given parameters
                </div>
                <div className="code-block">
                  <pre>
                    curl -X POST https://api.bitcoinwriter.com/dividends/simulate \<br />
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
                    &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
                    &nbsp;&nbsp;-d '&#123;<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;"totalRevenue": 500000000,<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;"distributionRate": 0.25<br />
                    &nbsp;&nbsp;&#125;'
                  </pre>
                </div>
              </div>

              <div className="api-endpoint">
                <div className="endpoint-header">
                  <span className="method get">GET</span>
                  <span className="endpoint-url">/api/revenue/summary</span>
                </div>
                <div className="endpoint-description">
                  Get revenue summary for current period
                </div>
                <div className="code-block">
                  <pre>
                    curl -X GET https://api.bitcoinwriter.com/revenue/summary \<br />
                    &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY"
                  </pre>
                </div>
              </div>
            </section>
          )}

          {/* Quick Links */}
          <section className="quick-links">
            <h2>Quick Links</h2>
            <div className="links-grid">
              <a href="/api" className="quick-link">
                <Zap size={20} />
                <span>Full API Documentation</span>
                <ExternalLink size={16} />
              </a>
              <a href="https://github.com/bitcoin-apps-suite/bitcoin-writer" target="_blank" rel="noopener noreferrer" className="quick-link">
                <GitBranch size={20} />
                <span>Source Code</span>
                <ExternalLink size={16} />
              </a>
              <a href="/token" className="quick-link">
                <DollarSign size={20} />
                <span>$BWRITER Token Info</span>
                <ExternalLink size={16} />
              </a>
              <a href="/contracts" className="quick-link">
                <Users size={20} />
                <span>Development Contracts</span>
                <ExternalLink size={16} />
              </a>
            </div>
          </section>

          {/* Footer Note */}
          <section className="footer-note">
            <p>
              <strong>Note:</strong> This specification is subject to updates as the Bitcoin Writer platform evolves. 
              For the latest implementation details, refer to the source code repository and API documentation.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}