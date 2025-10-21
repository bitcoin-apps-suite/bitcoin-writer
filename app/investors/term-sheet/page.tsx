'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  DollarSign, 
  ArrowLeft, 
  Download, 
  Printer, 
  TrendingUp,
  Calendar,
  Building2,
  Percent,
  Clock,
  Users
} from 'lucide-react';
import '../legal-docs.css';

export default function TermSheetPage() {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      <div className={`legal-document-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="legal-document-container">
          {/* Header */}
          <div className="document-header">
            <Link href="/investors" className="back-link">
              <ArrowLeft size={20} />
              <span>Back to Investor Center</span>
            </Link>
            
            <div className="document-actions">
              <button className="action-btn">
                <Download size={18} />
                <span>Download PDF</span>
              </button>
              <button className="action-btn">
                <Printer size={18} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="document-content">
            <div className="document-title">
              <DollarSign size={32} />
              <h1>Investment Term Sheet</h1>
              <div className="document-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Effective Date: October 21, 2025</span>
                </div>
                <div className="meta-item">
                  <Building2 size={16} />
                  <span>The Bitcoin Corporation LTD</span>
                </div>
              </div>
            </div>

            {/* Key Terms Summary */}
            <div className="definitions-box">
              <h3>Key Investment Terms Summary</h3>
              <table className="legal-table">
                <tbody>
                  <tr>
                    <td><strong>Company:</strong></td>
                    <td>The Bitcoin Corporation LTD (England & Wales, Co. No. 16735102)</td>
                  </tr>
                  <tr>
                    <td><strong>Token:</strong></td>
                    <td>$BWRITER Utility Token</td>
                  </tr>
                  <tr>
                    <td><strong>Blockchain:</strong></td>
                    <td>Bitcoin SV (BSV)</td>
                  </tr>
                  <tr>
                    <td><strong>Token Type:</strong></td>
                    <td>Utility Token with Governance Rights</td>
                  </tr>
                  <tr>
                    <td><strong>Total Supply:</strong></td>
                    <td>1,000,000,000 $BWRITER</td>
                  </tr>
                  <tr>
                    <td><strong>Founder Allocation:</strong></td>
                    <td>10.125% (101,250,000 tokens to @b0ase)</td>
                  </tr>
                  <tr>
                    <td><strong>Current Valuation:</strong></td>
                    <td>$0 USD (Pre-token sale)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Document Sections */}
            <div className="document-body">
              <section className="legal-section">
                <h2>1. OFFERING OVERVIEW</h2>
                <div className="subsection">
                  <h3>1.1 Token Sale Structure</h3>
                  <p>
                    The Bitcoin Corporation LTD is conducting a private token sale of $BWRITER utility tokens to 
                    accredited investors. The tokens provide utility rights within the Bitcoin Writer platform 
                    ecosystem and governance participation rights.
                  </p>
                </div>

                <div className="subsection">
                  <h3>1.2 Use of Proceeds</h3>
                  <p>Funds raised will be allocated as follows:</p>
                  <ul>
                    <li>40% - Platform development and technology enhancement</li>
                    <li>25% - Marketing and user acquisition</li>
                    <li>20% - Operations and team expansion</li>
                    <li>10% - Legal and compliance</li>
                    <li>5% - Reserve fund</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>2. PRICING AND ALLOCATION</h2>
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Round</th>
                      <th>Price per Token</th>
                      <th>Allocation</th>
                      <th>Minimum Investment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Seed Round</td>
                      <td>$0.025 USD</td>
                      <td>100,000,000 tokens</td>
                      <td>$25,000 USD</td>
                    </tr>
                    <tr>
                      <td>Series A</td>
                      <td>$0.050 USD</td>
                      <td>200,000,000 tokens</td>
                      <td>$50,000 USD</td>
                    </tr>
                    <tr>
                      <td>Public Sale</td>
                      <td>$0.100 USD</td>
                      <td>300,000,000 tokens</td>
                      <td>$1,000 USD</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="legal-section">
                <h2>3. TOKEN RIGHTS AND GOVERNANCE</h2>
                <div className="subsection">
                  <h3>3.1 Utility Rights</h3>
                  <p>$BWRITER token holders receive the following platform utility rights:</p>
                  <ul>
                    <li><strong>Revenue Sharing:</strong> Quarterly distribution of 25% of platform revenue</li>
                    <li><strong>Governance Voting:</strong> Participation in platform governance decisions</li>
                    <li><strong>Premium Features:</strong> Access to advanced platform functionalities</li>
                    <li><strong>Content Monetization:</strong> Enhanced content creation and monetization tools</li>
                    <li><strong>Staking Rewards:</strong> Additional rewards for token staking participation</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>3.2 Governance Structure</h3>
                  <p>
                    Token holders participate in platform governance through a decentralized autonomous 
                    organization (DAO) structure. Voting power is proportional to token holdings, with 
                    proposals requiring a minimum 25% quorum and 51% approval threshold.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>4. VESTING AND LOCK-UP TERMS</h2>
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Stakeholder</th>
                      <th>Vesting Period</th>
                      <th>Cliff Period</th>
                      <th>Release Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Founders</td>
                      <td>48 months</td>
                      <td>12 months</td>
                      <td>Monthly after cliff</td>
                    </tr>
                    <tr>
                      <td>Team</td>
                      <td>36 months</td>
                      <td>6 months</td>
                      <td>Monthly after cliff</td>
                    </tr>
                    <tr>
                      <td>Seed Investors</td>
                      <td>24 months</td>
                      <td>6 months</td>
                      <td>Quarterly after cliff</td>
                    </tr>
                    <tr>
                      <td>Series A Investors</td>
                      <td>18 months</td>
                      <td>3 months</td>
                      <td>Quarterly after cliff</td>
                    </tr>
                    <tr>
                      <td>Public Sale</td>
                      <td>No vesting</td>
                      <td>No cliff</td>
                      <td>Immediate</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="legal-section">
                <h2>5. COMPANY INFORMATION</h2>
                <div className="subsection">
                  <h3>5.1 Business Model</h3>
                  <p>
                    Bitcoin Writer operates a decentralized content monetization platform that enables 
                    writers, publishers, and content creators to monetize their work through blockchain 
                    technology and micropayments.
                  </p>
                </div>

                <div className="subsection">
                  <h3>5.2 Revenue Streams</h3>
                  <ul>
                    <li>Platform transaction fees (2.5% per transaction)</li>
                    <li>Premium subscription services</li>
                    <li>Content marketplace commissions</li>
                    <li>Enterprise licensing and API access</li>
                    <li>NFT marketplace transaction fees</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>5.3 Market Opportunity</h3>
                  <p>
                    The global content creation market is valued at $13.9 billion and growing at 13.4% CAGR. 
                    Bitcoin Writer addresses the monetization challenges faced by content creators through 
                    blockchain-based micropayments and revenue sharing.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>6. RISK FACTORS</h2>
                <div className="risk-box">
                  <h3>Investment Risks</h3>
                  <ul>
                    <li><strong>Market Risk:</strong> Cryptocurrency market volatility may affect token value</li>
                    <li><strong>Technology Risk:</strong> Smart contract vulnerabilities and blockchain risks</li>
                    <li><strong>Regulatory Risk:</strong> Changing regulations may impact token classification</li>
                    <li><strong>Competition Risk:</strong> Established platforms may develop competing solutions</li>
                    <li><strong>Adoption Risk:</strong> Platform success depends on user and creator adoption</li>
                    <li><strong>Liquidity Risk:</strong> Limited secondary markets for token trading</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>7. CLOSING CONDITIONS</h2>
                <div className="subsection">
                  <h3>7.1 Investor Requirements</h3>
                  <ul>
                    <li>Completion of KYC/AML verification procedures</li>
                    <li>Accredited investor status verification</li>
                    <li>Execution of Subscription Agreement</li>
                    <li>Execution of Shareholder Agreement</li>
                    <li>Payment in full via BSV blockchain transfer</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>7.2 Company Requirements</h3>
                  <ul>
                    <li>Board approval of token issuance</li>
                    <li>Legal counsel review and approval</li>
                    <li>Compliance with applicable securities laws</li>
                    <li>Smart contract deployment and testing</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>8. TIMELINE AND NEXT STEPS</h2>
                <table className="legal-table">
                  <thead>
                    <tr>
                      <th>Milestone</th>
                      <th>Target Date</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Term Sheet Execution</td>
                      <td>November 2025</td>
                      <td>Finalize investment terms</td>
                    </tr>
                    <tr>
                      <td>Due Diligence</td>
                      <td>December 2025</td>
                      <td>Investor KYC and legal review</td>
                    </tr>
                    <tr>
                      <td>Legal Documentation</td>
                      <td>January 2026</td>
                      <td>Execute subscription agreements</td>
                    </tr>
                    <tr>
                      <td>Token Issuance</td>
                      <td>February 2026</td>
                      <td>Deploy smart contracts and distribute tokens</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </div>

            {/* Footer Notice */}
            <div className="document-footer">
              <p>
                <strong>Legal Disclaimer:</strong> This term sheet is non-binding and for discussion purposes only. 
                Final investment terms will be governed by definitive legal agreements. This document does not 
                constitute an offer to sell securities.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="document-navigation">
            <Link href="/investors" className="nav-btn secondary">
              <ArrowLeft size={16} />
              Back to Investor Center
            </Link>
            <Link href="/investors/subscription-agreement" className="nav-btn primary">
              View Subscription Agreement
              <Users size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}