'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  ArrowLeft, 
  Download, 
  Printer, 
  AlertTriangle,
  Calendar,
  Building2,
  Eye,
  Search,
  FileText,
  Globe,
  Lock,
  UserCheck
} from 'lucide-react';
import '../legal-docs.css';

export default function AMLCompliancePage() {
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
              <Shield size={32} />
              <h1>Anti-Money Laundering (AML) Policy</h1>
              <div className="document-meta">
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Updated: October 21, 2025</span>
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
                <h3>Compliance Framework</h3>
                <p>
                  Bitcoin Writer Inc. maintains a comprehensive Anti-Money Laundering (AML) program in compliance 
                  with the Bank Secrecy Act, USA PATRIOT Act, and applicable international AML regulations. 
                  All investors are subject to these compliance requirements.
                </p>
              </div>
            </div>

            {/* Document Sections */}
            <div className="document-body">
              <section className="legal-section">
                <h2>1. AML PROGRAM OVERVIEW</h2>
                <div className="subsection">
                  <h3>1.1 Policy Statement</h3>
                  <p>
                    Bitcoin Writer Inc. is committed to preventing the use of our platform and token offerings 
                    for money laundering, terrorist financing, and other illicit activities. Our AML program 
                    is designed to detect, prevent, and report suspicious activities in accordance with 
                    applicable laws and regulations.
                  </p>
                </div>

                <div className="subsection">
                  <h3>1.2 Regulatory Framework</h3>
                  <p>Our AML program complies with:</p>
                  <ul>
                    <li><strong>Bank Secrecy Act (BSA):</strong> 31 U.S.C. 5311 et seq.</li>
                    <li><strong>USA PATRIOT Act:</strong> Sections 314(a), 314(b), and 326</li>
                    <li><strong>FinCEN Regulations:</strong> 31 CFR Chapter X</li>
                    <li><strong>OFAC Sanctions:</strong> Office of Foreign Assets Control requirements</li>
                    <li><strong>FATF Guidelines:</strong> Financial Action Task Force recommendations</li>
                    <li><strong>State Money Transmission Laws:</strong> Where applicable</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>1.3 Program Components</h3>
                  <p>Our comprehensive AML program includes:</p>
                  <div className="definitions-box">
                    <h3>Core AML Components</h3>
                    <table className="legal-table">
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Description</th>
                          <th>Implementation</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Customer Due Diligence (CDD)</td>
                          <td>Identity verification and risk assessment</td>
                          <td>KYC procedures and ongoing monitoring</td>
                        </tr>
                        <tr>
                          <td>Sanctions Screening</td>
                          <td>OFAC and international sanctions list checking</td>
                          <td>Real-time screening and periodic updates</td>
                        </tr>
                        <tr>
                          <td>Transaction Monitoring</td>
                          <td>Detection of unusual or suspicious patterns</td>
                          <td>Automated systems and manual review</td>
                        </tr>
                        <tr>
                          <td>Suspicious Activity Reporting</td>
                          <td>Filing SARs with FinCEN when required</td>
                          <td>Timely reporting within regulatory deadlines</td>
                        </tr>
                        <tr>
                          <td>Record Keeping</td>
                          <td>Maintaining compliance documentation</td>
                          <td>Secure storage with required retention periods</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section className="legal-section">
                <h2>2. CUSTOMER DUE DILIGENCE (CDD)</h2>
                <div className="subsection">
                  <h3>2.1 Risk-Based Assessment</h3>
                  <p>
                    All investors undergo risk assessment based on multiple factors to determine the 
                    appropriate level of due diligence required:
                  </p>
                  <ul>
                    <li><strong>Low Risk:</strong> Domestic investors with verified identity and clean background</li>
                    <li><strong>Medium Risk:</strong> Foreign investors from low-risk jurisdictions</li>
                    <li><strong>High Risk:</strong> PEPs, high-risk jurisdictions, or complex ownership structures</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>2.2 Enhanced Due Diligence (EDD)</h3>
                  <p>Enhanced due diligence is required for high-risk customers, including:</p>
                  <ul>
                    <li>Politically Exposed Persons (PEPs) and their associates</li>
                    <li>Customers from high-risk or non-cooperative jurisdictions</li>
                    <li>Customers with complex ownership or control structures</li>
                    <li>Customers conducting large or frequent transactions</li>
                    <li>Customers in high-risk business sectors</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>2.3 Beneficial Ownership Identification</h3>
                  <p>
                    For corporate and institutional investors, we identify and verify beneficial owners 
                    who directly or indirectly own 25% or more of the entity, including:
                  </p>
                  <ul>
                    <li>Individual ownership percentages and control structures</li>
                    <li>Senior managing officials for entities without qualifying beneficial owners</li>
                    <li>Trust beneficiaries and settlement arrangements</li>
                    <li>Ultimate controlling parties in complex structures</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>3. SANCTIONS SCREENING</h2>
                <div className="subsection">
                  <h3>3.1 Screening Lists</h3>
                  <p>All customers and transactions are screened against comprehensive sanctions lists:</p>
                  <table className="legal-table">
                    <thead>
                      <tr>
                        <th>Authority</th>
                        <th>List Type</th>
                        <th>Update Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>OFAC (US Treasury)</td>
                        <td>SDN, Sectoral Sanctions, Non-SDN</td>
                        <td>Daily</td>
                      </tr>
                      <tr>
                        <td>United Nations</td>
                        <td>Security Council Consolidated List</td>
                        <td>Weekly</td>
                      </tr>
                      <tr>
                        <td>European Union</td>
                        <td>EU Consolidated Sanctions List</td>
                        <td>Weekly</td>
                      </tr>
                      <tr>
                        <td>Other Jurisdictions</td>
                        <td>UK, Canada, Australia sanctions</td>
                        <td>Weekly</td>
                      </tr>
                      <tr>
                        <td>PEP Lists</td>
                        <td>Politically Exposed Persons</td>
                        <td>Monthly</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="subsection">
                  <h3>3.2 Screening Process</h3>
                  <p>Sanctions screening occurs at multiple points:</p>
                  <ul>
                    <li><strong>Onboarding:</strong> Initial customer screening during KYC process</li>
                    <li><strong>Transaction Processing:</strong> Real-time screening of all transactions</li>
                    <li><strong>Periodic Review:</strong> Regular rescreening of existing customers</li>
                    <li><strong>List Updates:</strong> Immediate screening when sanctions lists are updated</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>3.3 Match Resolution</h3>
                  <p>
                    When potential sanctions matches are identified, our compliance team follows a 
                    structured resolution process:
                  </p>
                  <ul>
                    <li>Immediate transaction suspension pending review</li>
                    <li>Manual review of customer information and match quality</li>
                    <li>False positive determination or match confirmation</li>
                    <li>Account blocking and regulatory reporting for true matches</li>
                    <li>Documentation of all resolution decisions</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>4. TRANSACTION MONITORING</h2>
                <div className="subsection">
                  <h3>4.1 Monitoring Systems</h3>
                  <p>
                    Automated transaction monitoring systems analyze all customer activities for 
                    potentially suspicious patterns:
                  </p>
                  <ul>
                    <li>Large cash transactions exceeding reporting thresholds</li>
                    <li>Structuring activities to avoid reporting requirements</li>
                    <li>Unusual transaction patterns inconsistent with customer profile</li>
                    <li>Rapid movement of funds through multiple accounts</li>
                    <li>Transactions with high-risk jurisdictions or entities</li>
                    <li>Transactions that may indicate trade-based money laundering</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>4.2 Alert Generation and Review</h3>
                  <p>The monitoring system generates alerts based on:</p>
                  <table className="legal-table">
                    <thead>
                      <tr>
                        <th>Alert Type</th>
                        <th>Threshold/Trigger</th>
                        <th>Review Timeline</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Large Transaction</td>
                        <td>$10,000+ in single transaction</td>
                        <td>24 hours</td>
                      </tr>
                      <tr>
                        <td>Velocity Alert</td>
                        <td>High volume in short timeframe</td>
                        <td>48 hours</td>
                      </tr>
                      <tr>
                        <td>Jurisdictional Risk</td>
                        <td>High-risk country involvement</td>
                        <td>72 hours</td>
                      </tr>
                      <tr>
                        <td>Pattern Alert</td>
                        <td>Unusual behavioral patterns</td>
                        <td>5 business days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="subsection">
                  <h3>4.3 Investigation Process</h3>
                  <p>When alerts are generated, our compliance team conducts thorough investigations:</p>
                  <ul>
                    <li>Review of customer transaction history and profile</li>
                    <li>Analysis of transaction purpose and business rationale</li>
                    <li>Enhanced due diligence on counterparties</li>
                    <li>Documentation of findings and conclusions</li>
                    <li>Escalation to senior management for significant concerns</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>5. SUSPICIOUS ACTIVITY REPORTING</h2>
                <div className="subsection">
                  <h3>5.1 SAR Filing Requirements</h3>
                  <p>
                    Suspicious Activity Reports (SARs) are filed with FinCEN when transactions or 
                    patterns meet reporting criteria:
                  </p>
                  <ul>
                    <li>Transactions of $5,000+ involving known or suspected criminal activity</li>
                    <li>Transactions designed to evade reporting requirements</li>
                    <li>Transactions with no apparent lawful purpose</li>
                    <li>Transactions involving suspected terrorist financing</li>
                    <li>Computer intrusion activities</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>5.2 Filing Timeline and Process</h3>
                  <p>SAR filings follow strict regulatory deadlines:</p>
                  <ul>
                    <li><strong>Initial Detection:</strong> Suspicious activity identified</li>
                    <li><strong>Investigation Period:</strong> 30 days maximum for investigation</li>
                    <li><strong>Filing Deadline:</strong> 30 days from completion of investigation</li>
                    <li><strong>Supporting Documentation:</strong> Maintained for 5 years minimum</li>
                    <li><strong>Continuing Activity:</strong> Additional SARs filed every 90 days if ongoing</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>5.3 Confidentiality Requirements</h3>
                  <p>
                    SAR filings and related information are strictly confidential:
                  </p>
                  <ul>
                    <li>No disclosure to customers or unauthorized personnel</li>
                    <li>Limited access on need-to-know basis</li>
                    <li>Secure storage of SAR-related documentation</li>
                    <li>Protection from discovery in civil litigation</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>6. RECORD KEEPING AND RETENTION</h2>
                <div className="subsection">
                  <h3>6.1 Required Records</h3>
                  <p>The following records are maintained in accordance with regulatory requirements:</p>
                  <table className="legal-table">
                    <thead>
                      <tr>
                        <th>Record Type</th>
                        <th>Retention Period</th>
                        <th>Storage Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Customer Identification</td>
                        <td>5 years after account closure</td>
                        <td>Encrypted digital storage</td>
                      </tr>
                      <tr>
                        <td>Transaction Records</td>
                        <td>5 years from transaction date</td>
                        <td>Blockchain and database records</td>
                      </tr>
                      <tr>
                        <td>SARs and Supporting Documents</td>
                        <td>5 years from filing date</td>
                        <td>Secure digital archive</td>
                      </tr>
                      <tr>
                        <td>AML Training Records</td>
                        <td>5 years from training date</td>
                        <td>HR system and compliance database</td>
                      </tr>
                      <tr>
                        <td>Sanctions Screening Records</td>
                        <td>5 years from screening date</td>
                        <td>Compliance monitoring system</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="subsection">
                  <h3>6.2 Record Accessibility</h3>
                  <p>
                    All records are maintained in a format that ensures:
                  </p>
                  <ul>
                    <li>Immediate availability for regulatory examination</li>
                    <li>Searchable and sortable formats</li>
                    <li>Complete audit trail maintenance</li>
                    <li>Protection against unauthorized access or modification</li>
                  </ul>
                </div>
              </section>

              <section className="legal-section">
                <h2>7. TRAINING AND COMPLIANCE</h2>
                <div className="subsection">
                  <h3>7.1 Staff Training Program</h3>
                  <p>
                    All personnel receive comprehensive AML training covering:
                  </p>
                  <ul>
                    <li>AML laws and regulations</li>
                    <li>Company policies and procedures</li>
                    <li>Red flag identification</li>
                    <li>Sanctions screening procedures</li>
                    <li>Suspicious activity detection and reporting</li>
                    <li>Customer due diligence requirements</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>7.2 Training Schedule</h3>
                  <ul>
                    <li><strong>New Employee Training:</strong> Within 30 days of hire</li>
                    <li><strong>Annual Refresher Training:</strong> All staff annually</li>
                    <li><strong>Specialized Training:</strong> Role-specific training for compliance staff</li>
                    <li><strong>Update Training:</strong> When regulations or procedures change</li>
                  </ul>
                </div>

                <div className="subsection">
                  <h3>7.3 Testing and Auditing</h3>
                  <p>
                    The AML program is subject to regular testing and independent auditing:
                  </p>
                  <ul>
                    <li>Annual independent AML audit by qualified external firm</li>
                    <li>Quarterly internal compliance testing</li>
                    <li>Monthly transaction monitoring effectiveness reviews</li>
                    <li>Annual board reporting on AML program effectiveness</li>
                  </ul>
                </div>
              </section>
            </div>

            {/* Footer Notice */}
            <div className="document-footer">
              <p>
                <strong>Compliance Notice:</strong> This AML policy is subject to change based on regulatory 
                developments and program enhancements. All investors and platform users are bound by the 
                current version of this policy and must cooperate with all compliance requirements.
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
              Start Investment Process
              <UserCheck size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}