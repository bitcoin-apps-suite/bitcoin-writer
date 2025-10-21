'use client';

import React, { useState, useEffect } from 'react';
import './captable.css';

interface CapTableEntry {
  holderAddress: string;
  holderName: string;
  currentBalance: number;
  totalAllocated: number;
  percentage: number;
  category: string;
  firstAllocation: string;
  lastUpdate: string;
  isFounder: boolean;
}

interface TokenAllocation {
  recipientAddress: string;
  recipientName: string;
  amount: number;
  percentage: number;
  category: 'founder' | 'bounty' | 'treasury' | 'community';
  reason: string;
  txId: string;
  allocatedAt: string;
}

interface TokenMetrics {
  totalSupply: number;
  circulatingSupply: number;
  allocatedTokens: number;
  treasuryBalance: number;
  bountyPoolBalance: number;
}

export default function CapTablePage() {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [capTable, setCapTable] = useState<CapTableEntry[]>([]);
  const [recentAllocations, setRecentAllocations] = useState<TokenAllocation[]>([]);
  const [tokenMetrics, setTokenMetrics] = useState<TokenMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'allocations' | 'transactions'>('overview');

  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      setDevSidebarCollapsed(localStorage.getItem('devSidebarCollapsed') === 'true');
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
    }

    // Load cap table data
    loadCapTableData();
  }, []);

  const loadCapTableData = () => {
    // Initial cap table based on token deployment
    const initialCapTable: CapTableEntry[] = [
      {
        holderAddress: '@b0ase',
        holderName: 'Platform Founder',
        currentBalance: 900000000,
        totalAllocated: 900000000,
        percentage: 90.0,
        category: 'Founder',
        firstAllocation: '2025-10-21T00:00:00.000Z',
        lastUpdate: '2025-10-21T00:00:00.000Z',
        isFounder: true
      },
      {
        holderAddress: 'seed_investors',
        holderName: 'Seed Investors (Tranche 1)',
        currentBalance: 0,
        totalAllocated: 100000000,
        percentage: 10.0,
        category: 'Investment',
        firstAllocation: 'TBD',
        lastUpdate: 'TBD',
        isFounder: false
      }
    ];

    const metrics: TokenMetrics = {
      totalSupply: 1000000000,
      circulatingSupply: 0, // No shares circulating yet
      allocatedTokens: 900000000,
      treasuryBalance: 0,
      bountyPoolBalance: 100000000 // Reserved for seed round
    };

    const allocations: TokenAllocation[] = [
      {
        recipientAddress: '@b0ase',
        recipientName: 'Platform Founder',
        amount: 900000000,
        percentage: 90.0,
        category: 'founder',
        reason: 'Founder equity allocation in bWriter Shares with 48-month vesting, 12-month cliff',
        txId: 'Equity-based allocation',
        allocatedAt: '2025-10-21T00:00:00.000Z'
      }
    ];

    setCapTable(initialCapTable);
    setTokenMetrics(metrics);
    setRecentAllocations(allocations);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`;
  };

  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'founder': return '#F7931E';
      case 'bounty pool': return '#22c55e';
      case 'treasury': return '#3b82f6';
      case 'community': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (!mounted) {
    return (
      <div className="App">
        <div className="captable-page">
          <div className="captable-container">
            <section className="captable-hero">
              <h1>$BWRITER <span style={{color: '#F7931E'}}>Cap Table</span></h1>
              <p className="captable-tagline">
                Transparent token distribution and equity allocation
              </p>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className={`captable-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="captable-container">
          {/* Hero Section */}
          <section className="captable-hero">
            <h1>bWriter Shares <span style={{color: '#F7931E'}}>Cap Table</span></h1>
            <p className="captable-tagline">
              Equity ownership and share distribution for Bitcoin Writer platform
            </p>
            <div className="captable-badge">LIVE EQUITY STRUCTURE</div>
          </section>

          {/* Token Metrics */}
          {tokenMetrics && (
            <section className="token-metrics">
              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-value">{formatNumber(tokenMetrics.totalSupply)}</span>
                  <span className="metric-label">Authorized Shares</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{formatNumber(tokenMetrics.allocatedTokens)}</span>
                  <span className="metric-label">Issued Shares</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">$0.0001</span>
                  <span className="metric-label">Price per Share</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">$100K</span>
                  <span className="metric-label">Post-Money Valuation</span>
                </div>
              </div>
            </section>
          )}

          {/* Tab Navigation */}
          <section className="captable-tabs-section">
            <div className="captable-tabs">
              <button 
                className={activeTab === 'overview' ? 'active' : ''}
                onClick={() => setActiveTab('overview')}
              >
                Ownership Overview
              </button>
              <button 
                className={activeTab === 'allocations' ? 'active' : ''}
                onClick={() => setActiveTab('allocations')}
              >
                Share Details
              </button>
              <button 
                className={activeTab === 'transactions' ? 'active' : ''}
                onClick={() => setActiveTab('transactions')}
              >
                Valuation & Metrics
              </button>
            </div>
          </section>

          {/* Cap Table Overview */}
          {activeTab === 'overview' && (
            <section className="cap-table-section">
              <div className="cap-table-header">
                <h2>Current Ownership Structure</h2>
                <p>Real-time distribution of bWriter Shares in The Bitcoin Corporation LTD</p>
              </div>
              
              <div className="cap-table">
                <div className="table-header">
                  <div className="col-holder">Shareholder</div>
                  <div className="col-balance">Shares Held</div>
                  <div className="col-percentage">Ownership %</div>
                  <div className="col-category">Value</div>
                  <div className="col-status">Status</div>
                </div>
                
                {capTable.map((entry, index) => (
                  <div key={index} className="table-row">
                    <div className="col-holder">
                      <div className="holder-info">
                        <span className="holder-name">{entry.holderName}</span>
                        <span className="holder-address">{entry.holderAddress}</span>
                      </div>
                    </div>
                    <div className="col-balance">
                      <span className="balance-amount">{formatNumber(entry.currentBalance)}</span>
                      <span className="balance-symbol">bWriter Shares</span>
                    </div>
                    <div className="col-percentage">
                      <span className="percentage-value">{formatPercentage(entry.percentage)}</span>
                    </div>
                    <div className="col-category">
                      <span className="value-amount">${(entry.currentBalance * 0.0001).toLocaleString()}</span>
                    </div>
                    <div className="col-status">
                      <span className={`status-badge ${entry.isFounder ? 'vesting' : 'reserved'}`}>
                        {entry.isFounder ? 'Vesting' : 'Reserved'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Share Details */}
          {activeTab === 'allocations' && (
            <section className="allocations-section">
              <div className="allocations-header">
                <h2>Share Class Details</h2>
                <p>Comprehensive breakdown of bWriter Shares structure</p>
              </div>
              
              <div className="share-class-card">
                <h3>bWriter Shares</h3>
                <div className="share-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Share Class:</span>
                    <span className="detail-value">bWriter Shares</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Rights:</span>
                    <span className="detail-value">Bitcoin Writer platform revenue, governance, premium features</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Voting Rights:</span>
                    <span className="detail-value">1 vote per share on platform matters</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Dividend Rights:</span>
                    <span className="detail-value">25% of net Bitcoin Writer platform revenue</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Transfer Restrictions:</span>
                    <span className="detail-value">Subject to vesting schedules and right of first refusal</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Liquidation Preference:</span>
                    <span className="detail-value">Pro-rata distribution upon liquidation</span>
                  </div>
                </div>
              </div>

              <div className="vesting-schedule">
                <h3>Vesting Schedule</h3>
                <div className="vesting-grid">
                  <div className="vesting-item">
                    <span className="vesting-label">Founder Shares:</span>
                    <span className="vesting-value">48 months vesting, 12 month cliff</span>
                  </div>
                  <div className="vesting-item">
                    <span className="vesting-label">Investor Shares:</span>
                    <span className="vesting-value">24 months vesting, 6 month cliff</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Valuation & Metrics */}
          {activeTab === 'transactions' && (
            <section className="transactions-section">
              <div className="transactions-header">
                <h2>Valuation & Financial Metrics</h2>
                <p>Current valuation and share pricing information</p>
              </div>
              
              <div className="valuation-cards">
                <div className="valuation-card">
                  <h3>Current Round (Seed Tranche 1)</h3>
                  <div className="valuation-details">
                    <div className="valuation-item">
                      <span className="valuation-label">Pre-Money Valuation:</span>
                      <span className="valuation-value">$90,000</span>
                    </div>
                    <div className="valuation-item">
                      <span className="valuation-label">Investment Amount:</span>
                      <span className="valuation-value">$10,000</span>
                    </div>
                    <div className="valuation-item">
                      <span className="valuation-label">Post-Money Valuation:</span>
                      <span className="valuation-value">$100,000</span>
                    </div>
                    <div className="valuation-item">
                      <span className="valuation-label">Price per Share:</span>
                      <span className="valuation-value">$0.0001</span>
                    </div>
                    <div className="valuation-item">
                      <span className="valuation-label">Shares Offered:</span>
                      <span className="valuation-value">100,000,000 (10%)</span>
                    </div>
                  </div>
                </div>

                <div className="valuation-card">
                  <h3>Share Allocation Breakdown</h3>
                  <div className="allocation-chart">
                    <div className="allocation-item">
                      <div className="allocation-bar">
                        <div className="allocation-fill founder" style={{width: '90%'}}></div>
                      </div>
                      <span className="allocation-label">Founder: 90% (900M shares)</span>
                    </div>
                    <div className="allocation-item">
                      <div className="allocation-bar">
                        <div className="allocation-fill investor" style={{width: '10%'}}></div>
                      </div>
                      <span className="allocation-label">Seed Round: 10% (100M shares)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="investment-summary">
                <h3>Investment Opportunity</h3>
                <p>
                  The Bitcoin Corporation LTD is offering 10% of bWriter Shares (100,000,000 shares) 
                  at $0.0001 per share, raising $10,000 for Bitcoin Writer platform development.
                </p>
                <div className="investment-actions">
                  <a href="/investors" className="investment-btn primary">
                    View Investor Information
                  </a>
                  <a href="/investors/term-sheet" className="investment-btn secondary">
                    Download Term Sheet
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Footer */}
          <section className="captable-footer">
            <div className="footer-content">
              <h3>Legal Structure</h3>
              <p>
                bWriter Shares represent equity ownership in The Bitcoin Corporation LTD (Company No. 16735102), 
                specifically tied to the Bitcoin Writer platform's performance and governance.
              </p>
              <div className="footer-links">
                <a href="/investors/shareholder-agreement" className="footer-link">
                  Shareholder Agreement
                </a>
                <a href="/investors/subscription-agreement" className="footer-link">
                  Subscription Agreement
                </a>
                <a href="/token" className="footer-link">
                  View $BWRITER Token
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}