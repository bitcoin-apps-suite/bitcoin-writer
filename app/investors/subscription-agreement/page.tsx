'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Printer, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  DollarSign,
  Scale,
  Building2
} from 'lucide-react';
import '../legal-docs.css';

export default function SubscriptionAgreementPage() {
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
              <button 
                className="action-btn"
                onClick={() => window.open('/api/pdf/subscription-agreement', '_blank')}
              >
                <Download size={18} />
                <span>Download PDF</span>
              </button>
              <button 
                className="action-btn"
                onClick={() => window.print()}
              >
                <Printer size={18} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="document-content">
            <div className="document-title">
              <FileText size={32} />
              <h1>Subscription Agreement</h1>
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
              <AlertTriangle size={24} />
              <div>
                <h3>Important Legal Notice</h3>
                <p>
                  This Subscription Agreement contains legally binding terms and conditions. Please read carefully 
                  and consult with qualified legal and financial advisors before proceeding with any investment.
                </p>
              </div>
            </div>

            {/* Document Sections */}
            <div className="document-body">
              <section className="legal-section">
                <h2>1. PARTIES</h2>
                <p>
                  This Subscription Agreement ("Agreement") is entered into between <strong>The Bitcoin Corporation LTD</strong>, 
                  a company incorporated in England and Wales with company number 16735102 ("Company"), and the individual or entity 
                  executing this Agreement ("Subscriber" or "Investor").
                </p>
              </section>

              <section className="legal-section">
                <h2>2. SUBSCRIPTION FOR bWRITER SHARES</h2>
                <div className="subsection">
                  <h3>2.1 bWriter Share Subscription</h3>
                  <p>
                    Subject to the terms and conditions of this Agreement, the Subscriber hereby subscribes for 
                    and agrees to purchase bWriter Shares ("bWriter Shares") from the Company at $0.0001 per share 
                    in accordance with the pricing and allocation terms set forth in the Term Sheet.
                  </p>
                  <p>
                    <strong>Share Class Definition:</strong> bWriter Shares represent a specific class of shares in 
                    The Bitcoin Corporation LTD that provide rights related to the Bitcoin Writer platform, including 
                    revenue sharing, governance participation, and platform-specific benefits.
                  </p>
                </div>
                
                <div className="subsection">
                  <h3>2.2 Purchase Price</h3>
                  <p>
                    The purchase price for the bWriter Shares is $0.0001 per share as outlined in the Term Sheet. 
                    Payment shall be made in GBP, USD, or Bitcoin SV (BSV) as specified by the Company. 
                    Minimum investment is $250 USD (2,500,000 bWriter shares).
                  </p>
                </div>

                <div className="subsection">
                  <h3>2.3 Payment Terms</h3>
                  <p>
                    Payment must be made in full upon execution of this Agreement via bank transfer to the Company's 
                    designated account or BSV wallet address. bWriter share certificates will be issued within 48 hours of confirmed 
                    payment receipt and completion of all compliance requirements.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>3. REPRESENTATIONS AND WARRANTIES</h2>
                <div className="subsection">
                  <h3>3.1 Subscriber Representations</h3>
                  <p>The Subscriber represents and warrants that:</p>
                  <ul>
                    <li>They have full legal capacity and authority to enter into this Agreement</li>
                    <li>They are an accredited investor as defined under applicable securities laws</li>
                    <li>They have conducted their own due diligence regarding the investment</li>
                    <li>They understand the risks associated with cryptocurrency investments</li>
                    <li>They are not a resident of any jurisdiction where token sales are prohibited</li>
                    <li>All information provided is accurate and complete</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>3.2 Company Representations</h3>
                  <p>The Company represents and warrants that:</p>
                  <ul>
                    <li>It is duly incorporated and validly existing under the laws of England and Wales</li>
                    <li>It has full corporate power and authority to issue the Tokens</li>
                    <li>The execution and delivery of this Agreement has been duly authorized</li>
                    <li>All material information has been disclosed to the Subscriber</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>4. COMPLIANCE AND REGULATORY MATTERS</h2>
                <div className="subsection">
                  <h3>4.1 KYC/AML Compliance</h3>
                  <p>
                    The Subscriber acknowledges that completion of Know Your Customer (KYC) and Anti-Money 
                    Laundering (AML) procedures is a prerequisite to token issuance. The Company reserves 
                    the right to reject any subscription that does not meet compliance requirements.
                  </p>
                </div>

                <div className="subsection">
                  <h3>4.2 Securities Law Compliance</h3>
                  <p>
                    This offering is intended to comply with applicable securities laws. The Tokens are being 
                    offered and sold in reliance on exemptions from registration under the Securities Act of 1933 
                    and applicable state securities laws.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>5. SHARE RIGHTS AND RESTRICTIONS</h2>
                <div className="subsection">
                  <h3>5.1 Shareholder Rights</h3>
                  <p>
                    Ordinary shares provide holders with standard equity rights, including but not limited to:
                  </p>
                  <ul>
                    <li>Voting rights (one vote per share)</li>
                    <li>Dividend distribution rights</li>
                    <li>Pre-emption rights on future equity raises</li>
                    <li>Information rights and access to company records</li>
                    <li>Liquidation distribution rights</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>5.2 Transfer Restrictions</h3>
                  <p>
                    Shares may be subject to transfer restrictions and lock-up periods as specified in the 
                    Shareholder Agreement. Any transfers must comply with applicable securities laws and 
                    require board approval for transfers exceeding 1% of issued share capital.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>6. RISK DISCLOSURE</h2>
                <div className="risk-box">
                  <h3>Investment Risks</h3>
                  <p>
                    The Subscriber acknowledges and accepts the following risks:
                  </p>
                  <ul>
                    <li><strong>Early Stage Risk:</strong> Company is in early development stage</li>
                    <li><strong>Market Risk:</strong> Technology platform success dependent on market adoption</li>
                    <li><strong>Regulatory Risk:</strong> Changes in software and blockchain regulations</li>
                    <li><strong>Liquidity Risk:</strong> No public market for shares; limited exit opportunities</li>
                    <li><strong>Dilution Risk:</strong> Future fundraising may dilute shareholding percentage</li>
                    <li><strong>Total Loss Risk:</strong> Investment may result in total loss of capital</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>7. GOVERNING LAW AND DISPUTE RESOLUTION</h2>
                <div className="subsection">
                  <h3>7.1 Governing Law</h3>
                  <p>
                    This Agreement shall be governed by and construed in accordance with the laws of 
                    England and Wales, without regard to its conflict of laws principles.
                  </p>
                </div>

                <div className="subsection">
                  <h3>7.2 Arbitration</h3>
                  <p>
                    Any disputes arising under this Agreement shall be resolved through binding arbitration 
                    administered by the American Arbitration Association in accordance with its Commercial 
                    Arbitration Rules.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>8. MISCELLANEOUS</h2>
                <div className="subsection">
                  <h3>8.1 Entire Agreement</h3>
                  <p>
                    This Agreement, together with the Term Sheet and other transaction documents, constitutes 
                    the entire agreement between the parties regarding the subject matter hereof.
                  </p>
                </div>

                <div className="subsection">
                  <h3>8.2 Amendments</h3>
                  <p>
                    This Agreement may only be amended in writing and signed by both parties.
                  </p>
                </div>

                <div className="subsection">
                  <h3>8.3 Severability</h3>
                  <p>
                    If any provision of this Agreement is deemed invalid or unenforceable, the remaining 
                    provisions shall continue in full force and effect.
                  </p>
                </div>
              </section>
            </div>

            {/* Signature Section */}
            <div className="signature-section">
              <h2>SIGNATURE PAGE</h2>
              <p>
                By executing this Agreement, the parties acknowledge that they have read, understood, and 
                agree to be bound by all terms and conditions contained herein.
              </p>
              
              <div className="signature-blocks">
                <div className="signature-block">
                  <h4>THE BITCOIN CORPORATION LTD</h4>
                  <div className="signature-line">
                    <p>By: _________________________________</p>
                    <p>Name: [Director]</p>
                    <p>Title: Director</p>
                    <p>Date: _________________________________</p>
                  </div>
                </div>

                <div className="signature-block">
                  <h4>SUBSCRIBER</h4>
                  <div className="signature-line">
                    <p>Signature: _________________________________</p>
                    <p>Print Name: _________________________________</p>
                    <p>Date: _________________________________</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="document-footer">
              <p>
                <strong>Legal Disclaimer:</strong> This document is provided for informational purposes only 
                and does not constitute legal advice. Prospective investors should consult with qualified 
                legal counsel before executing any investment agreements.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="document-navigation">
            <Link href="/investors" className="nav-btn secondary">
              <ArrowLeft size={16} />
              Back to Investor Center
            </Link>
            <Link href="/investors/term-sheet" className="nav-btn primary">
              View Term Sheet
              <FileText size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}