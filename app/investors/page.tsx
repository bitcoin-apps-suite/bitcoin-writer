'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Shield, 
  FileText, 
  Users, 
  DollarSign, 
  CheckCircle,
  Building2,
  Briefcase,
  Scale,
  UserCheck,
  AlertTriangle,
  Download,
  ExternalLink,
  Wallet
} from 'lucide-react';
import './investors.css';

export default function InvestorsPage() {
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

  const legalDocuments = [
    {
      title: 'Cap Table',
      description: 'Current ownership structure and equity distribution',
      icon: <TrendingUp size={24} />,
      href: '/captable',
      status: 'Overview',
      color: '#f7931a'
    },
    {
      title: 'Subscription Agreement',
      description: 'Investment terms and conditions for purchasing bWriter Shares',
      icon: <FileText size={24} />,
      href: '/investors/subscription-agreement',
      status: 'Required',
      color: '#3b82f6'
    },
    {
      title: 'Shareholder Agreement',
      description: 'Rights and obligations of shareholders and governance structure',
      icon: <Users size={24} />,
      href: '/investors/shareholder-agreement',
      status: 'Required',
      color: '#10b981'
    },
    {
      title: 'Term Sheet',
      description: 'Investment structure, valuation, and key commercial terms',
      icon: <DollarSign size={24} />,
      href: '/investors/term-sheet',
      status: 'Summary',
      color: '#f59e0b'
    },
    {
      title: 'KYC Compliance',
      description: 'Know Your Customer verification requirements and procedures',
      icon: <UserCheck size={24} />,
      href: '/investors/kyc-compliance',
      status: 'Mandatory',
      color: '#8b5cf6'
    },
    {
      title: 'AML Compliance',
      description: 'Anti-Money Laundering policies and compliance framework',
      icon: <Shield size={24} />,
      href: '/investors/aml-compliance',
      status: 'Mandatory',
      color: '#ef4444'
    },
    {
      title: 'Contracts Gallery',
      description: 'View all active smart contracts and GitHub integration bounties',
      icon: <Briefcase size={24} />,
      href: '/contracts',
      status: 'Reference',
      color: '#6b7280'
    }
  ];

  const investmentHighlights = [
    {
      metric: 'bWriter Shares',
      value: 'Equity Investment',
      description: 'Direct ownership in Bitcoin Writer platform'
    },
    {
      metric: '10%',
      value: 'Equity Offering',
      description: '$10,000 for 100M shares ($0.0001/share)'
    },
    {
      metric: 'Revenue',
      value: 'Share Model',
      description: 'Shareholders receive 25% of net platform revenue'
    },
    {
      metric: 'Governance',
      value: 'Voting Rights',
      description: 'Participate in platform decisions and governance'
    }
  ];

  return (
    <div className="App">
      <div className={`investors-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="investors-container">
          {/* Hero Section */}
          <section className="investors-hero">
            <div className="investors-hero-icon">
              <TrendingUp size={64} />
            </div>
            <h1><span style={{color: '#ffffff'}}>Bitcoin Writer</span> <span style={{color: '#f7931a'}}>Investor Center</span></h1>
            <p className="investors-tagline">
              Investment opportunities in the future of decentralized content monetization and blockchain publishing
            </p>
            <div className="investors-badge">INVESTOR RELATIONS</div>
          </section>

          {/* Investment Overview */}
          <section className="investment-overview">
            <h2>Investment Opportunity</h2>
            <div className="overview-content">
              <p className="overview-description">
                Bitcoin Writer represents a paradigm shift in content monetization, combining blockchain technology 
                with innovative revenue-sharing models. Our bWriter Shares provide investors with direct equity ownership 
                in the Bitcoin Writer platform, including governance rights and 25% of net platform revenue distribution.
              </p>
              
              <div className="investment-highlights">
                {investmentHighlights.map((highlight, index) => (
                  <div key={index} className="highlight-card">
                    <div className="highlight-metric">{highlight.metric}</div>
                    <div className="highlight-value">{highlight.value}</div>
                    <div className="highlight-description">{highlight.description}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Legal Documentation */}
          <section className="legal-documentation">
            <h2>Legal Documentation</h2>
            <p className="documentation-intro">
              Please review all legal documents carefully before proceeding with any investment. All documents 
              are prepared in compliance with applicable securities regulations and blockchain governance frameworks.
            </p>
            
            <div className="documents-grid">
              {legalDocuments.map((doc, index) => (
                <Link key={index} href={doc.href} className="document-card">
                  <div className="document-header">
                    <div className="document-icon" style={{color: doc.color}}>
                      {doc.icon}
                    </div>
                    <div className="document-status" style={{color: doc.color}}>
                      {doc.status}
                    </div>
                  </div>
                  
                  <div className="document-content">
                    <h3>{doc.title}</h3>
                    <p>{doc.description}</p>
                  </div>
                  
                  <div className="document-footer">
                    <div className="document-action">
                      <span>Review Document</span>
                      <ExternalLink size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Investment Process */}
          <section className="investment-process">
            <h2>Investment Process</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h4>Review Documentation</h4>
                  <p>Carefully read all legal documents including subscription agreement, term sheet, and compliance requirements</p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h4>Complete KYC/AML</h4>
                  <p>Submit required identity verification and anti-money laundering documentation for compliance</p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h4>Execute Agreements</h4>
                  <p>Sign subscription agreement and shareholder agreement with legal counsel review recommended</p>
                </div>
              </div>
              
              <div className="process-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h4>Fund Investment</h4>
                  <p>Transfer investment amount via bank transfer or BSV payment and receive bWriter Shares allocation</p>
                </div>
              </div>
            </div>
          </section>

          {/* Risk Disclosures */}
          <section className="risk-disclosures">
            <h2>Important Risk Disclosures</h2>
            <div className="risk-content">
              <div className="risk-warning">
                <AlertTriangle size={24} />
                <div>
                  <h4>Investment Risk Warning</h4>
                  <p>
                    Equity investments in technology companies carry significant risks including potential total loss of capital. 
                    The value of bWriter Shares may fluctuate substantially and past performance does not guarantee future results.
                  </p>
                </div>
              </div>
              
              <div className="risk-factors">
                <h4>Key Risk Factors:</h4>
                <ul>
                  <li>Regulatory uncertainty in cryptocurrency markets</li>
                  <li>Technology and smart contract risks</li>
                  <li>Market volatility and liquidity risks</li>
                  <li>Platform adoption and revenue generation risks</li>
                  <li>Competition from established platforms</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="investor-contact">
            <h2>Investor Relations Contact</h2>
            <div className="contact-content">
              <div className="contact-info">
                <div className="contact-item">
                  <Building2 size={20} />
                  <div>
                    <h4>Bitcoin Writer Inc.</h4>
                    <p>Investor Relations Department</p>
                  </div>
                </div>
                
                <div className="contact-item">
                  <Briefcase size={20} />
                  <div>
                    <h4>Legal Counsel</h4>
                    <p>Available for document review and legal questions</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-disclaimer">
                <p>
                  <strong>Legal Disclaimer:</strong> This information is for sophisticated investors only and does not 
                  constitute an offer to sell securities. All investments are subject to applicable securities laws 
                  and regulations. Please consult with qualified legal and financial advisors.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="investors-cta">
            <div className="cta-content">
              <Scale size={48} />
              <h2>Ready to Invest?</h2>
              <p>
                Begin your investment journey by reviewing our legal documentation and completing the required compliance procedures.
              </p>
              <div className="cta-buttons">
                <Link href="/investors/term-sheet" className="cta-btn primary">
                  <FileText size={20} />
                  Start with Term Sheet
                </Link>
                <Link href="/investors/kyc-compliance" className="cta-btn secondary">
                  <UserCheck size={20} />
                  Begin KYC Process
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}