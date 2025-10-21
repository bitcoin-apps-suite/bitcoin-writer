'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ArrowLeft, 
  Download, 
  Printer, 
  Vote,
  Calendar,
  Building2,
  Shield,
  Gavel,
  FileText
} from 'lucide-react';
import '../legal-docs.css';

export default function ShareholderAgreementPage() {
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
              <Users size={32} />
              <h1>Shareholder Agreement</h1>
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

            {/* Important Notice */}
            <div className="legal-notice">
              <Shield size={24} />
              <div>
                <h3>Governance Agreement</h3>
                <p>
                  This Shareholder Agreement establishes the governance framework for $BWRITER token holders 
                  and defines rights, obligations, and decision-making processes within the Bitcoin Writer ecosystem.
                </p>
              </div>
            </div>

            {/* Document Sections */}
            <div className="document-body">
              <section className="legal-section">
                <h2>1. DEFINITIONS</h2>
                <div className="definitions-box">
                  <dl>
                    <dt>Company</dt>
                    <dd>The Bitcoin Corporation LTD, a company incorporated in England and Wales (Company No. 16735102)</dd>
                    
                    <dt>Shares</dt>
                    <dd>Ordinary shares in The Bitcoin Corporation LTD</dd>
                    
                    <dt>Shareholder</dt>
                    <dd>Any person or entity holding ordinary shares in the Company</dd>
                    
                    <dt>Board</dt>
                    <dd>Board of Directors of The Bitcoin Corporation LTD</dd>
                    
                    <dt>Voting Rights</dt>
                    <dd>Rights to vote on company matters proportional to shareholding</dd>
                    
                    <dt>Dividend Distribution</dt>
                    <dd>Distribution of company profits to shareholders as declared by the Board</dd>
                  </dl>
                </div>
              </section>

              <section className="legal-section">
                <h2>2. GOVERNANCE STRUCTURE</h2>
                <div className="subsection">
                  <h3>2.1 Corporate Governance</h3>
                  <p>
                    The Company operates under standard English company law governance structures. 
                    Shareholders participate in company governance through voting at general meetings 
                    and through elected board representation.
                  </p>
                </div>

                <div className="subsection">
                  <h3>2.2 Voting Rights</h3>
                  <p>Shareholders receive voting rights proportional to their shareholding according to the following structure:</p>
                  <ul>
                    <li>1 ordinary share = 1 vote on company resolutions</li>
                    <li>Minimum holding of 1% required to submit shareholder resolutions</li>
                    <li>Voting by proxy permitted with proper authorization</li>
                    <li>Special resolutions require 75% majority vote</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>2.3 Governance Proposals</h3>
                  <p>Token holders may vote on the following categories of proposals:</p>
                  <table className="legal-table">
                    <thead>
                      <tr>
                        <th>Proposal Type</th>
                        <th>Approval Threshold</th>
                        <th>Quorum Requirement</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Platform Features</td>
                        <td>Simple Majority (51%)</td>
                        <td>15% of total supply</td>
                      </tr>
                      <tr>
                        <td>Fee Structure Changes</td>
                        <td>Supermajority (67%)</td>
                        <td>25% of total supply</td>
                      </tr>
                      <tr>
                        <td>Revenue Distribution</td>
                        <td>Supermajority (67%)</td>
                        <td>30% of total supply</td>
                      </tr>
                      <tr>
                        <td>Constitutional Changes</td>
                        <td>Special Majority (75%)</td>
                        <td>40% of total supply</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="legal-section">
                <h2>3. SHAREHOLDER RIGHTS</h2>
                <div className="subsection">
                  <h3>3.1 Economic Rights</h3>
                  <p>$BWRITER token holders are entitled to the following economic benefits:</p>
                  <ul>
                    <li><strong>Revenue Sharing:</strong> Quarterly distribution of 25% of net platform revenue</li>
                    <li><strong>Staking Rewards:</strong> Additional tokens for participating in network security</li>
                    <li><strong>Fee Discounts:</strong> Reduced transaction fees for platform usage</li>
                    <li><strong>Premium Access:</strong> Enhanced features and priority support</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>3.2 Information Rights</h3>
                  <p>Token holders holding 1% or more of outstanding tokens are entitled to:</p>
                  <ul>
                    <li>Quarterly financial reports and platform metrics</li>
                    <li>Annual audited financial statements</li>
                    <li>Access to board meeting minutes (non-confidential portions)</li>
                    <li>Material contract and partnership information</li>
                    <li>Technology roadmap and development updates</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>3.3 Inspection Rights</h3>
                  <p>
                    Major token holders (5% or more) may inspect Company books and records upon reasonable 
                    notice and for proper business purposes, subject to confidentiality agreements.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>4. TRANSFER RESTRICTIONS</h2>
                <div className="subsection">
                  <h3>4.1 General Transfer Rights</h3>
                  <p>
                    $BWRITER tokens are generally transferable on secondary markets and decentralized exchanges, 
                    subject to applicable securities laws and the restrictions outlined in this Agreement.
                  </p>
                </div>

                <div className="subsection">
                  <h3>4.2 Restricted Transfers</h3>
                  <p>The following transfers are subject to additional restrictions:</p>
                  <ul>
                    <li>Transfers to competitors or conflicting business interests</li>
                    <li>Transfers exceeding 5% of total supply in a single transaction</li>
                    <li>Transfers to sanctioned individuals or entities</li>
                    <li>Transfers during lock-up periods (as defined in vesting schedules)</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>4.3 Right of First Refusal</h3>
                  <p>
                    For transfers of 1% or more of outstanding tokens, the Company and existing shareholders 
                    maintain a right of first refusal to purchase the tokens on the same terms as offered 
                    to third parties.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>5. BOARD REPRESENTATION</h2>
                <div className="subsection">
                  <h3>5.1 Token Holder Representatives</h3>
                  <p>
                    Token holders collectively holding 10% or more of outstanding tokens may nominate 
                    one representative to serve as an observer to the Company's Board of Directors.
                  </p>
                </div>

                <div className="subsection">
                  <h3>5.2 Advisory Roles</h3>
                  <p>
                    Large token holders may be invited to participate in advisory committees for:
                  </p>
                  <ul>
                    <li>Technology and product development</li>
                    <li>Business development and partnerships</li>
                    <li>Tokenomics and governance evolution</li>
                    <li>Risk management and compliance</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>6. REVENUE DISTRIBUTION</h2>
                <div className="subsection">
                  <h3>6.1 Distribution Schedule</h3>
                  <p>
                    Revenue distributions to token holders occur quarterly, typically within 45 days 
                    of each quarter end. Distributions are calculated based on:
                  </p>
                  <ul>
                    <li>Net platform revenue (gross revenue minus operating expenses)</li>
                    <li>25% allocation to token holder distributions</li>
                    <li>Pro-rata distribution based on token holdings</li>
                    <li>Minimum distribution threshold of $100,000 per quarter</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>6.2 Distribution Method</h3>
                  <p>
                    Distributions are made in BSV or $BWRITER tokens at the Company's discretion, 
                    directly to token holders' wallet addresses via smart contract execution.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>7. PROTECTIVE PROVISIONS</h2>
                <div className="subsection">
                  <h3>7.1 Supermajority Approval Required</h3>
                  <p>The following actions require approval of 67% of outstanding tokens:</p>
                  <ul>
                    <li>Issuance of additional tokens beyond approved allocation</li>
                    <li>Material changes to revenue sharing percentage</li>
                    <li>Merger, acquisition, or sale of substantially all assets</li>
                    <li>Changes to core platform governance mechanisms</li>
                    <li>Dissolution or liquidation of the Company</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>7.2 Veto Rights</h3>
                  <p>
                    Token holders collectively holding 25% or more may veto certain actions that 
                    materially affect token holder rights or platform governance structure.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>8. DISPUTE RESOLUTION</h2>
                <div className="subsection">
                  <h3>8.1 Governance Disputes</h3>
                  <p>
                    Disputes related to governance proposals or voting outcomes shall be resolved through 
                    the platform's built-in dispute resolution mechanisms, including:
                  </p>
                  <ul>
                    <li>Community mediation and discussion forums</li>
                    <li>Appeals process for contested votes</li>
                    <li>Independent arbitration for material disputes</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>8.2 Legal Disputes</h3>
                  <p>
                    Other disputes shall be resolved through binding arbitration under English Arbitration Rules, 
                    with proceedings conducted in England.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>9. AMENDMENT AND TERMINATION</h2>
                <div className="subsection">
                  <h3>9.1 Agreement Amendments</h3>
                  <p>
                    This Agreement may be amended with the approval of 75% of outstanding token holders, 
                    provided that amendments do not materially impair existing token holder rights 
                    without individual consent.
                  </p>
                </div>

                <div className="subsection">
                  <h3>9.2 Termination Events</h3>
                  <p>This Agreement terminates upon:</p>
                  <ul>
                    <li>Dissolution of the Company</li>
                    <li>Sale of all Company assets</li>
                    <li>Unanimous consent of all token holders</li>
                    <li>Court order or regulatory requirement</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Footer Notice */}
            <div className="document-footer">
              <p>
                <strong>Legal Disclaimer:</strong> This Shareholder Agreement is a binding legal contract. 
                Token holders should consult with qualified legal counsel before accepting these terms. 
                Governance participation is voluntary but subject to these binding provisions.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="document-navigation">
            <Link href="/investors" className="nav-btn secondary">
              <ArrowLeft size={16} />
              Back to Investor Center
            </Link>
            <Link href="/investors/kyc-compliance" className="nav-btn primary">
              View KYC Requirements
              <Shield size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}