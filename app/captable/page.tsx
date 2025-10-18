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
        holderAddress: '1HNcvDZNosbxWeB9grD769u3bAKYNKRHTs',
        holderName: 'Platform Founder',
        currentBalance: 30000000,
        totalAllocated: 30000000,
        percentage: 3.0,
        category: 'Founder',
        firstAllocation: '2025-10-17T19:30:35.552Z',
        lastUpdate: '2025-10-17T19:30:35.552Z',
        isFounder: true
      },
      {
        holderAddress: 'bounty_pool',
        holderName: 'Developer Bounty Pool',
        currentBalance: 400000000,
        totalAllocated: 400000000,
        percentage: 40.0,
        category: 'Bounty Pool',
        firstAllocation: '2025-10-17T19:30:35.551Z',
        lastUpdate: '2025-10-17T19:30:35.551Z',
        isFounder: false
      },
      {
        holderAddress: 'treasury',
        holderName: 'Platform Treasury',
        currentBalance: 300000000,
        totalAllocated: 300000000,
        percentage: 30.0,
        category: 'Treasury',
        firstAllocation: '2025-10-17T19:30:35.551Z',
        lastUpdate: '2025-10-17T19:30:35.551Z',
        isFounder: false
      },
      {
        holderAddress: 'community_pool',
        holderName: 'Community Rewards',
        currentBalance: 270000000,
        totalAllocated: 270000000,
        percentage: 27.0,
        category: 'Community',
        firstAllocation: '2025-10-17T19:30:35.551Z',
        lastUpdate: '2025-10-17T19:30:35.551Z',
        isFounder: false
      }
    ];

    const metrics: TokenMetrics = {
      totalSupply: 1000000000,
      circulatingSupply: 30000000, // Only founder allocation circulating
      allocatedTokens: 1000000000,
      treasuryBalance: 300000000,
      bountyPoolBalance: 400000000
    };

    const allocations: TokenAllocation[] = [
      {
        recipientAddress: '1HNcvDZNosbxWeB9grD769u3bAKYNKRHTs',
        recipientName: 'Platform Founder',
        amount: 30000000,
        percentage: 3.0,
        category: 'founder',
        reason: 'Platform development, blockchain infrastructure, and core feature implementation',
        txId: '2af7cc345b97f87ad6b587e1a3a6b3ce589510bc103d3915cc083556574873d5',
        allocatedAt: '2025-10-17T19:30:35.552Z'
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
            <h1>$BWRITER <span style={{color: '#F7931E'}}>Cap Table</span></h1>
            <p className="captable-tagline">
              Transparent token distribution and equity allocation
            </p>
            <div className="captable-badge">BLOCKCHAIN VERIFIED</div>
          </section>

          {/* Token Metrics */}
          {tokenMetrics && (
            <section className="token-metrics">
              <div className="metrics-grid">
                <div className="metric-card">
                  <span className="metric-value">{formatNumber(tokenMetrics.totalSupply)}</span>
                  <span className="metric-label">Total Supply</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{formatNumber(tokenMetrics.circulatingSupply)}</span>
                  <span className="metric-label">Circulating</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{formatNumber(tokenMetrics.bountyPoolBalance)}</span>
                  <span className="metric-label">Bounty Pool</span>
                </div>
                <div className="metric-card">
                  <span className="metric-value">{formatNumber(tokenMetrics.treasuryBalance)}</span>
                  <span className="metric-label">Treasury</span>
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
                Cap Table Overview
              </button>
              <button 
                className={activeTab === 'allocations' ? 'active' : ''}
                onClick={() => setActiveTab('allocations')}
              >
                Recent Allocations
              </button>
              <button 
                className={activeTab === 'transactions' ? 'active' : ''}
                onClick={() => setActiveTab('transactions')}
              >
                Blockchain Transactions
              </button>
            </div>
          </section>

          {/* Cap Table Overview */}
          {activeTab === 'overview' && (
            <section className="cap-table-section">
              <div className="cap-table-header">
                <h2>Token Distribution</h2>
                <p>Real-time allocation of all $BWRITER tokens</p>
              </div>
              
              <div className="cap-table">
                <div className="table-header">
                  <div className="col-holder">Holder</div>
                  <div className="col-balance">Balance</div>
                  <div className="col-percentage">Percentage</div>
                  <div className="col-category">Category</div>
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
                      <span className="balance-symbol">BWRITER</span>
                    </div>
                    <div className="col-percentage">
                      <span className="percentage-value">{formatPercentage(entry.percentage)}</span>
                    </div>
                    <div className="col-category">
                      <span 
                        className="category-badge"
                        style={{ backgroundColor: getCategoryColor(entry.category) }}
                      >
                        {entry.category}
                      </span>
                    </div>
                    <div className="col-status">
                      <span className={`status-badge ${entry.isFounder ? 'allocated' : 'reserved'}`}>
                        {entry.isFounder ? 'Allocated' : 'Reserved'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Allocations */}
          {activeTab === 'allocations' && (
            <section className="allocations-section">
              <div className="allocations-header">
                <h2>Recent Token Allocations</h2>
                <p>Latest token distributions and equity grants</p>
              </div>
              
              <div className="allocations-list">
                {recentAllocations.map((allocation, index) => (
                  <div key={index} className="allocation-card">
                    <div className="allocation-header">
                      <span className="allocation-recipient">{allocation.recipientName}</span>
                      <span className="allocation-amount">
                        {formatNumber(allocation.amount)} BWRITER
                      </span>
                    </div>
                    <div className="allocation-details">
                      <p className="allocation-reason">{allocation.reason}</p>
                      <div className="allocation-meta">
                        <span className={`allocation-category category-${allocation.category}`}>
                          {allocation.category.toUpperCase()}
                        </span>
                        <span className="allocation-date">
                          {new Date(allocation.allocatedAt).toLocaleDateString()}
                        </span>
                        <span className="allocation-percentage">
                          {formatPercentage(allocation.percentage)}
                        </span>
                      </div>
                    </div>
                    <div className="allocation-proof">
                      <a 
                        href={`https://whatsonchain.com/tx/${allocation.txId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proof-link"
                      >
                        View Blockchain Proof →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Blockchain Transactions */}
          {activeTab === 'transactions' && (
            <section className="transactions-section">
              <div className="transactions-header">
                <h2>Blockchain Transactions</h2>
                <p>All token operations recorded on BSV blockchain</p>
              </div>
              
              <div className="transaction-list">
                <div className="transaction-card completed">
                  <div className="tx-header">
                    <span className="tx-type">Token Deployment</span>
                    <span className="tx-status success">✅ Confirmed</span>
                  </div>
                  <div className="tx-details">
                    <p><strong>Transaction ID:</strong> f3aef54490331015e3e88bef6413930afff8d80b55cb67168449d420ad193ca9</p>
                    <p><strong>Block Height:</strong> 820152</p>
                    <p><strong>Timestamp:</strong> 2025-10-17T19:30:35.551Z</p>
                    <p><strong>Total Supply:</strong> 1,000,000,000 BWRITER</p>
                  </div>
                  <a href="https://whatsonchain.com/tx/f3aef54490331015e3e88bef6413930afff8d80b55cb67168449d420ad193ca9" target="_blank" className="tx-link">View on Blockchain →</a>
                </div>
                
                <div className="transaction-card completed">
                  <div className="tx-header">
                    <span className="tx-type">Founder Allocation</span>
                    <span className="tx-status success">✅ Confirmed</span>
                  </div>
                  <div className="tx-details">
                    <p><strong>Transaction ID:</strong> 2af7cc345b97f87ad6b587e1a3a6b3ce589510bc103d3915cc083556574873d5</p>
                    <p><strong>Block Height:</strong> 820156</p>
                    <p><strong>Recipient:</strong> 1HNcvDZNosbxWeB9grD769u3bAKYNKRHTs</p>
                    <p><strong>Amount:</strong> 30,000,000 BWRITER (3.0%)</p>
                  </div>
                  <a href="https://whatsonchain.com/tx/2af7cc345b97f87ad6b587e1a3a6b3ce589510bc103d3915cc083556574873d5" target="_blank" className="tx-link">View on Blockchain →</a>
                </div>
              </div>
            </section>
          )}

          {/* Footer */}
          <section className="captable-footer">
            <div className="footer-content">
              <h3>Transparency Commitment</h3>
              <p>All $BWRITER token allocations are recorded on the BSV blockchain for complete transparency and immutability.</p>
              <div className="footer-links">
                <a href="/contracts" className="footer-link">
                  View Contracts
                </a>
                <a href="/contributions" className="footer-link">
                  Earn Tokens
                </a>
                <a href="https://whatsonchain.com" target="_blank" rel="noopener noreferrer" className="footer-link">
                  BSV Explorer
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}