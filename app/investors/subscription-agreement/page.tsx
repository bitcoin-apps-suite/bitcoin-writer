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
              <FileText size={32} />
              <h1>Subscription Agreement</h1>
              <div className="document-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Effective Date: January 15, 2025</span>
                </div>
                <div className="meta-item">
                  <Building2 size={16} />
                  <span>Bitcoin Writer Inc.</span>
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
                  This Subscription Agreement ("Agreement") is entered into between <strong>Bitcoin Writer Inc.</strong>, 
                  a corporation organized under the laws of Delaware ("Company"), and the individual or entity 
                  executing this Agreement ("Subscriber" or "Investor").
                </p>
              </section>

              <section className="legal-section">
                <h2>2. SUBSCRIPTION FOR BWRITER TOKENS</h2>
                <div className="subsection">
                  <h3>2.1 Token Subscription</h3>
                  <p>
                    Subject to the terms and conditions of this Agreement, the Subscriber hereby subscribes for 
                    and agrees to purchase $BWRITER utility tokens ("Tokens") from the Company in accordance 
                    with the pricing and allocation terms set forth in the Term Sheet.
                  </p>
                </div>
                
                <div className="subsection">
                  <h3>2.2 Purchase Price</h3>
                  <p>
                    The purchase price for the Tokens shall be determined based on the current market valuation 
                    and pricing structure as outlined in the accompanying Term Sheet, payable in Bitcoin SV (BSV) 
                    or other acceptable digital assets as specified by the Company.
                  </p>
                </div>

                <div className="subsection">
                  <h3>2.3 Payment Terms</h3>
                  <p>
                    Payment must be made in full upon execution of this Agreement via transfer to the Company's 
                    designated BSV wallet address. Token allocation will be processed within 48 hours of confirmed 
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
                    <li>It is duly organized and validly existing under Delaware law</li>
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
                <h2>5. TOKEN RIGHTS AND RESTRICTIONS</h2>
                <div className="subsection">
                  <h3>5.1 Utility Rights</h3>
                  <p>
                    $BWRITER tokens provide holders with utility rights within the Bitcoin Writer platform, 
                    including but not limited to:
                  </p>
                  <ul>
                    <li>Platform governance voting rights</li>
                    <li>Revenue sharing distributions</li>
                    <li>Access to premium platform features</li>
                    <li>Content monetization capabilities</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>5.2 Transfer Restrictions</h3>
                  <p>
                    Tokens may be subject to transfer restrictions and lock-up periods as specified in the 
                    Shareholder Agreement. Any transfers must comply with applicable securities laws and 
                    platform governance requirements.
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
                    <li><strong>Volatility Risk:</strong> Token values may fluctuate significantly</li>
                    <li><strong>Technology Risk:</strong> Smart contract and blockchain technology risks</li>
                    <li><strong>Regulatory Risk:</strong> Potential changes in cryptocurrency regulations</li>
                    <li><strong>Liquidity Risk:</strong> Limited secondary markets for tokens</li>
                    <li><strong>Platform Risk:</strong> Success dependent on platform adoption</li>
                    <li><strong>Total Loss Risk:</strong> Investment may result in total loss of capital</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>7. GOVERNING LAW AND DISPUTE RESOLUTION</h2>
                <div className="subsection">
                  <h3>7.1 Governing Law</h3>
                  <p>
                    This Agreement shall be governed by and construed in accordance with the laws of the State 
                    of Delaware, without regard to its conflict of laws principles.
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
                  <h4>BITCOIN WRITER INC.</h4>
                  <div className="signature-line">
                    <p>By: _________________________________</p>
                    <p>Name: [Chief Executive Officer]</p>
                    <p>Title: Chief Executive Officer</p>
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