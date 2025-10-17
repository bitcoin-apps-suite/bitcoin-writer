'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './enterprise.css';

const EnterprisePage: React.FC = () => {
  const router = useRouter();
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
    <div className="app-wrapper">
      <div className={`enterprise-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        
        <div className="enterprise-header">
          <h1><span style={{color: '#f7931a'}}>Bitcoin Writer</span> Enterprise</h1>
          <p className="tagline">Custom Blockchain Publishing Solutions for Your Organization</p>
        </div>

        <section className="enterprise-section">
          <h2>Enterprise-Grade Document Management</h2>
          <p>
            Transform your organization's document workflow with blockchain-powered immutability, 
            cryptographic verification, and permanent timestamping. Bitcoin Writer Enterprise 
            provides the security and auditability your business demands.
          </p>
        </section>

        <section className="enterprise-section">
          <h2>Why Choose Enterprise?</h2>
          <div className="enterprise-benefits-grid">
            <div className="benefit">
              <div className="benefit-icon">🏢</div>
              <h3>Custom Deployment</h3>
              <p>
                White-label solutions tailored to your brand and requirements. Deploy on-premises 
                or in your preferred cloud environment with full control.
              </p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">🔐</div>
              <h3>Enhanced Security</h3>
              <p>
                Enterprise-grade encryption, multi-factor authentication, and blockchain 
                immutability ensure your documents are protected forever.
              </p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">⚡</div>
              <h3>Scalable Infrastructure</h3>
              <p>
                Handle thousands of documents with automatic scaling, load balancing, 
                and optimized blockchain integration for peak performance.
              </p>
            </div>
            <div className="benefit">
              <div className="benefit-icon">📊</div>
              <h3>Advanced Analytics</h3>
              <p>
                Comprehensive dashboards, audit trails, and reporting tools to track 
                document usage, compliance, and blockchain verification.
              </p>
            </div>
          </div>
        </section>

        <section className="enterprise-section">
          <h2>Implementation Process</h2>
          <div className="implementation-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Discovery & Planning</h3>
              <p>
                Our team works with you to understand your specific requirements, 
                compliance needs, and integration goals.
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Custom Development</h3>
              <p>
                We customize the platform to match your workflows, branding, and 
                technical specifications while maintaining blockchain integrity.
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Testing & Deployment</h3>
              <p>
                Comprehensive testing in staging environments followed by secure 
                deployment to your production infrastructure.
              </p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Training & Support</h3>
              <p>
                Complete user training, documentation, and ongoing technical support 
                to ensure successful adoption across your organization.
              </p>
            </div>
          </div>
        </section>

        <section className="enterprise-section">
          <h2>Enterprise Features</h2>
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <h3>Single Sign-On (SSO)</h3>
              <p>Integrate with your existing identity management systems</p>
            </div>
            <div className="feature">
              <div className="feature-icon">📋</div>
              <h3>Compliance Tools</h3>
              <p>Built-in compliance reporting for SOX, GDPR, HIPAA, and more</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔧</div>
              <h3>API Integration</h3>
              <p>RESTful APIs for seamless integration with existing systems</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🏆</div>
              <h3>SLA Guarantees</h3>
              <p>99.9% uptime SLA with dedicated support and monitoring</p>
            </div>
            <div className="feature">
              <div className="feature-icon">👥</div>
              <h3>Role-Based Access</h3>
              <p>Granular permissions and role management for team collaboration</p>
            </div>
            <div className="feature">
              <div className="feature-icon">🔄</div>
              <h3>Workflow Automation</h3>
              <p>Custom approval workflows and automated document processing</p>
            </div>
          </div>
        </section>

        <section className="enterprise-section">
          <h2>Industry Solutions</h2>
          <div className="industry-solutions">
            <div className="industry">
              <h3>🏦 Financial Services</h3>
              <p>Immutable audit trails for regulatory compliance and fraud prevention</p>
            </div>
            <div className="industry">
              <h3>⚖️ Legal & Government</h3>
              <p>Tamper-proof contracts and legal documents with cryptographic verification</p>
            </div>
            <div className="industry">
              <h3>🏥 Healthcare</h3>
              <p>HIPAA-compliant patient records with blockchain-verified authenticity</p>
            </div>
            <div className="industry">
              <h3>🎓 Education</h3>
              <p>Verifiable academic credentials and research with immutable timestamps</p>
            </div>
            <div className="industry">
              <h3>🏭 Manufacturing</h3>
              <p>Supply chain documentation and quality control with permanent records</p>
            </div>
            <div className="industry">
              <h3>📰 Media & Publishing</h3>
              <p>Content authenticity verification and automated royalty distribution</p>
            </div>
          </div>
        </section>

        <section className="enterprise-section">
          <h2>Technical Specifications</h2>
          <div className="tech-specs">
            <div className="spec-category">
              <h3>Infrastructure</h3>
              <ul>
                <li><strong>Cloud:</strong> AWS, Azure, Google Cloud, or on-premises</li>
                <li><strong>Scaling:</strong> Auto-scaling with load balancers</li>
                <li><strong>Storage:</strong> Encrypted at rest and in transit</li>
                <li><strong>Backup:</strong> Multi-region redundancy</li>
              </ul>
            </div>
            <div className="spec-category">
              <h3>Integration</h3>
              <ul>
                <li><strong>APIs:</strong> RESTful and GraphQL endpoints</li>
                <li><strong>SSO:</strong> SAML, OAuth, Active Directory</li>
                <li><strong>Webhooks:</strong> Real-time event notifications</li>
                <li><strong>SDK:</strong> JavaScript, Python, Java libraries</li>
              </ul>
            </div>
            <div className="spec-category">
              <h3>Security</h3>
              <ul>
                <li><strong>Encryption:</strong> AES-256 and end-to-end encryption</li>
                <li><strong>Blockchain:</strong> Bitcoin SV for immutable records</li>
                <li><strong>Compliance:</strong> SOC 2, ISO 27001 certified</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="enterprise-section cta-section">
          <h2>Ready to Get Started?</h2>
          <p>Schedule a consultation to discuss your enterprise blockchain publishing needs</p>
          <div className="cta-buttons">
            <button className="cta-button primary" onClick={() => router.push('/contact')}>
              Schedule Demo
            </button>
            <button className="cta-button secondary" onClick={() => router.push('/docs')}>
              Technical Documentation
            </button>
            <a href="mailto:enterprise@bitcoinwriter.com" className="cta-button secondary">
              Contact Sales
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default EnterprisePage;