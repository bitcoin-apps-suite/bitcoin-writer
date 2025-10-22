'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UserCheck, 
  ArrowLeft, 
  Download, 
  Printer, 
  Shield,
  Calendar,
  Building2,
  CheckCircle,
  AlertCircle,
  FileText,
  Camera,
  CreditCard,
  Home,
  Phone
} from 'lucide-react';
import '../legal-docs.css';

export default function KYCCompliancePage() {
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
              <a href="/api/pdf/kyc-compliance" className="action-btn" target="_blank">
                <Download size={18} />
                <span>Download PDF</span>
              </a>
              <button className="action-btn" onClick={() => window.print()}>
                <Printer size={18} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Document Content */}
          <div className="document-content">
            <div className="document-title">
              <UserCheck size={32} />
              <h1>KYC Compliance Requirements</h1>
              <div className="document-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Updated: October 21, 2025</span>
                </div>
                <div className="meta-item">
                  <Building2 size={16} />
                  <span>The Bitcoin Corporation LTD</span>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="legal-notice">
              <AlertCircle size={24} />
              <div>
                <h3>Mandatory Compliance</h3>
                <p>
                  Know Your Customer (KYC) verification is mandatory for all investors and must be completed 
                  before token purchase. This process ensures compliance with anti-money laundering regulations 
                  and securities laws.
                </p>
              </div>
            </div>

            {/* Document Sections */}
            <div className="document-body">
              <section className="legal-section">
                <h2>1. KYC OVERVIEW</h2>
                <div className="subsection">
                  <h3>1.1 Purpose and Requirements</h3>
                  <p>
                    Know Your Customer (KYC) procedures are mandatory compliance requirements designed to verify 
                    investor identity, assess risk profiles, and ensure compliance with applicable financial regulations. 
                    The Bitcoin Corporation LTD implements comprehensive KYC procedures in accordance with:
                  </p>
                  <ul>
                    <li>Financial Conduct Authority (FCA) regulations</li>
                    <li>Money Laundering, Terrorist Financing and Transfer of Funds Regulations 2017</li>
                    <li>Proceeds of Crime Act 2002</li>
                    <li>Financial Services and Markets Act 2000 (FSMA)</li>
                    <li>International anti-money laundering (AML) standards</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>1.2 Verification Process Timeline</h3>
                  <p>
                    KYC verification typically takes 3-5 business days from submission of complete documentation. 
                    Incomplete or unclear documentation may extend the review period. Token purchase cannot 
                    proceed until KYC approval is granted.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>2. REQUIRED DOCUMENTATION</h2>
                <div className="subsection">
                  <h3>2.1 Individual Investors</h3>
                  <p>Individual investors must provide the following documentation:</p>
                  
                  <table className="legal-table">
                    <thead>
                      <tr>
                        <th>Document Type</th>
                        <th>Acceptable Forms</th>
                        <th>Requirements</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Government-Issued ID</td>
                        <td>Passport, Driver's License, State ID</td>
                        <td>Clear, color scan, not expired</td>
                      </tr>
                      <tr>
                        <td>Proof of Address</td>
                        <td>Utility bill, Bank statement, Lease</td>
                        <td>Issued within last 3 months</td>
                      </tr>
                      <tr>
                        <td>Selfie Verification</td>
                        <td>Photo holding ID document</td>
                        <td>Clear, well-lit, ID readable</td>
                      </tr>
                      <tr>
                        <td>Accredited Investor</td>
                        <td>Financial statements, CPA letter</td>
                        <td>Meeting FCA sophisticated investor criteria</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="subsection">
                  <h3>2.2 Corporate/Institutional Investors</h3>
                  <p>Corporate and institutional investors must provide:</p>
                  <ul>
                    <li><strong>Certificate of Incorporation:</strong> Filed with appropriate jurisdiction</li>
                    <li><strong>Board Resolution:</strong> Authorizing the investment and signatory authority</li>
                    <li><strong>Beneficial Ownership:</strong> Identification of all individuals owning 25% or more</li>
                    <li><strong>Authorized Signatory ID:</strong> Government-issued identification for signing officers</li>
                    <li><strong>Good Standing Certificate:</strong> From jurisdiction of incorporation</li>
                    <li><strong>Operating Agreement/Bylaws:</strong> Current organizational documents</li>
                    <li><strong>Tax Identification:</strong> EIN or equivalent tax identifier</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>3. VERIFICATION PROCESS</h2>
                <div className="subsection">
                  <h3>3.1 Document Submission</h3>
                  <p>All KYC documents must be submitted through our secure online portal with the following specifications:</p>
                  <ul>
                    <li>High-resolution color scans or photographs</li>
                    <li>All text clearly readable and legible</li>
                    <li>Complete document visible (no cropping of edges)</li>
                    <li>File formats: PDF, JPG, PNG (max 10MB per file)</li>
                    <li>No filters, editing, or alterations applied</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>3.2 Identity Verification Steps</h3>
                  <div className="definitions-box">
                    <h3>Verification Workflow</h3>
                    <table className="legal-table">
                      <thead>
                        <tr>
                          <th>Step</th>
                          <th>Process</th>
                          <th>Timeline</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1. Document Upload</td>
                          <td>Submit required documents via secure portal</td>
                          <td>Immediate</td>
                        </tr>
                        <tr>
                          <td>2. Automated Review</td>
                          <td>AI-powered document verification and fraud detection</td>
                          <td>1-2 hours</td>
                        </tr>
                        <tr>
                          <td>3. Manual Review</td>
                          <td>Human review of flagged or complex cases</td>
                          <td>1-3 business days</td>
                        </tr>
                        <tr>
                          <td>4. Background Check</td>
                          <td>Sanctions screening and PEP (Politically Exposed Person) check</td>
                          <td>1-2 business days</td>
                        </tr>
                        <tr>
                          <td>5. Final Approval</td>
                          <td>Compliance officer final review and approval</td>
                          <td>1 business day</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="subsection">
                  <h3>3.3 Enhanced Due Diligence</h3>
                  <p>Additional verification may be required for:</p>
                  <ul>
                    <li>High-value investments exceeding $500,000</li>
                    <li>Investors from high-risk jurisdictions</li>
                    <li>Politically Exposed Persons (PEPs) or their associates</li>
                    <li>Complex corporate structures or beneficial ownership</li>
                    <li>Unusual transaction patterns or funding sources</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>4. ACCREDITED INVESTOR VERIFICATION</h2>
                <div className="subsection">
                  <h3>4.1 Income-Based Qualification</h3>
                  <p>
                    Individuals qualifying based on income must demonstrate earnings exceeding $200,000 
                    (or $300,000 joint with spouse) for the past two years with reasonable expectation 
                    of similar income in the current year.
                  </p>
                  <p><strong>Required Documentation:</strong></p>
                  <ul>
                    <li>Tax returns for the past two years</li>
                    <li>W-2 forms or 1099s for the past two years</li>
                    <li>Current pay stubs or employment verification letter</li>
                    <li>CPA verification letter (recommended)</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>4.2 Net Worth-Based Qualification</h3>
                  <p>
                    Individuals with net worth exceeding $1,000,000 (excluding primary residence) 
                    may qualify as sophisticated investors under FCA regulations.
                  </p>
                  <p><strong>Required Documentation:</strong></p>
                  <ul>
                    <li>Personal financial statement</li>
                    <li>Bank statements for all accounts</li>
                    <li>Investment account statements</li>
                    <li>Real estate appraisals (excluding primary residence)</li>
                    <li>CPA verification letter or audited financial statements</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>4.3 Professional Qualifications</h3>
                  <p>
                    Individuals holding certain professional certifications may qualify as sophisticated investors:
                  </p>
                  <ul>
                    <li>Series 7, 65, or 82 securities licenses</li>
                    <li>Knowledgeable employees of private funds</li>
                    <li>Directors, executive officers, or general partners of the issuer</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>5. DATA PROTECTION AND PRIVACY</h2>
                <div className="subsection">
                  <h3>5.1 Information Security</h3>
                  <p>
                    All KYC information is protected using industry-standard security measures:
                  </p>
                  <ul>
                    <li>256-bit SSL encryption for data transmission</li>
                    <li>AES-256 encryption for data storage</li>
                    <li>Multi-factor authentication for portal access</li>
                    <li>SOC 2 Type II certified data centers</li>
                    <li>Regular security audits and penetration testing</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>5.2 Data Retention and Disposal</h3>
                  <p>
                    KYC information is retained in accordance with regulatory requirements:
                  </p>
                  <ul>
                    <li>Minimum retention period of 5 years after account closure</li>
                    <li>Secure deletion using DoD 5220.22-M standards</li>
                    <li>Annual review of stored information necessity</li>
                    <li>Right to request data deletion where legally permissible</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>5.3 Information Sharing</h3>
                  <p>
                    KYC information may be shared only in the following circumstances:
                  </p>
                  <ul>
                    <li>Regulatory examinations and compliance requests</li>
                    <li>Law enforcement investigations with proper legal authority</li>
                    <li>Court orders or subpoenas</li>
                    <li>Third-party verification services (limited scope)</li>
                    <li>With investor consent for specific purposes</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>6. PROHIBITED JURISDICTIONS</h2>
                <div className="risk-box">
                  <h3>Restricted Countries and Territories</h3>
                  <p>
                    Token sales are prohibited to residents or citizens of the following jurisdictions:
                  </p>
                  <ul>
                    <li>Countries subject to comprehensive U.S. sanctions (OFAC list)</li>
                    <li>Countries with prohibitions on cryptocurrency transactions</li>
                    <li>Jurisdictions where token sales would violate local securities laws</li>
                    <li>High-risk jurisdictions identified by FATF</li>
                  </ul>
                  <p>
                    <strong>Current restrictions include but are not limited to:</strong> North Korea, Iran, 
                    Syria, Cuba, Crimea, and other sanctioned territories. This list is subject to change 
                    based on regulatory developments.
                  </p>
                </div>
              </section>

              <section className="legal-section">
                <h2>7. ONGOING MONITORING</h2>
                <div className="subsection">
                  <h3>7.1 Periodic Reviews</h3>
                  <p>
                    KYC information is subject to periodic review and updates:
                  </p>
                  <ul>
                    <li>Annual review of investor information</li>
                    <li>Transaction monitoring for unusual patterns</li>
                    <li>Sanctions list screening updates</li>
                    <li>Beneficial ownership verification for corporate accounts</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>7.2 Information Updates</h3>
                  <p>
                    Investors must promptly notify The Bitcoin Corporation LTD of any material changes:
                  </p>
                  <ul>
                    <li>Changes in personal information (address, name, etc.)</li>
                    <li>Changes in sophisticated investor status</li>
                    <li>Changes in beneficial ownership (corporate accounts)</li>
                    <li>Changes in control or management (institutional accounts)</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Footer Notice */}
            <div className="document-footer">
              <p>
                <strong>Privacy Notice:</strong> All personal information collected through the KYC process 
                is handled in accordance with our Privacy Policy and applicable data protection laws. 
                Information is used solely for compliance purposes and account verification.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="document-navigation">
            <Link href="/investors" className="nav-btn secondary">
              <ArrowLeft size={16} />
              Back to Investor Center
            </Link>
            <Link href="/investors/aml-compliance" className="nav-btn primary">
              View AML Compliance
              <Shield size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}