import React, { useState, useEffect } from 'react';
import './LegalPages.css';
import Footer from '../components/Footer';

const PrivacyPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkSidebarState);
    };
  }, []);

  const lastUpdated = "January 26, 2025";

  return (
    <div className={`legal-page ${!isMobile ? (devSidebarCollapsed ? 'with-sidebar-collapsed' : 'with-sidebar-expanded') : ''}`}>
      {/* Hero Section */}
      <div className="legal-hero">
        <div className="legal-badge">Legal</div>
        <h1>Privacy Policy</h1>
        <p className="legal-tagline">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Main Content */}
      <div className="legal-container">
        <section className="legal-section">
          <h2>1. Introduction</h2>
          <p>
            Bitcoin Writer ("we", "our", or "the Service") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, and safeguard your information when you use our decentralized document platform.
          </p>
          <p>
            <strong>Key Privacy Principle:</strong> We follow a zero-knowledge architecture. Your documents and encryption 
            passwords never leave your device unencrypted, and we cannot access your encrypted content.
          </p>
        </section>

        <section className="legal-section">
          <h2>2. Information We Collect</h2>
          
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>OAuth Authentication:</strong> When you sign in with Google or other providers, we receive your 
            email address, name, and profile picture</li>
            <li><strong>HandCash Integration:</strong> Your HandCash handle and public wallet information (never private keys)</li>
            <li><strong>Document Metadata:</strong> Titles, tags, and creation timestamps (if not encrypted)</li>
          </ul>

          <h3>2.2 Automatically Collected Information</h3>
          <ul>
            <li><strong>Usage Analytics:</strong> Anonymous usage statistics to improve the Service</li>
            <li><strong>Error Logs:</strong> Technical errors and performance metrics (no personal data)</li>
            <li><strong>Local Storage:</strong> Preferences and settings stored in your browser</li>
          </ul>

          <h3>2.3 Information We Do NOT Collect</h3>
          <ul>
            <li>Your encryption passwords</li>
            <li>The content of encrypted documents</li>
            <li>Your BSV private keys</li>
            <li>Your browsing history outside our Service</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Authenticate your identity and provide access to the Service</li>
            <li>Display your documents and manage your document library</li>
            <li>Process blockchain transactions on your behalf</li>
            <li>Improve Service performance and user experience</li>
            <li>Communicate important Service updates</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>4. Data Storage and Security</h2>
          
          <h3>4.1 Where Your Data Lives</h3>
          <ul>
            <li><strong>Documents:</strong> Stored directly on the BSV blockchain (permanent and public if unencrypted)</li>
            <li><strong>Encryption:</strong> All encryption happens client-side in your browser</li>
            <li><strong>User Profiles:</strong> Minimal profile data stored in our secure database</li>
            <li><strong>Local Data:</strong> Preferences and drafts stored in your browser's local storage</li>
          </ul>

          <h3>4.2 Security Measures</h3>
          <ul>
            <li>Industry-standard AES-256 encryption for documents</li>
            <li>HTTPS encryption for all data transmission</li>
            <li>OAuth 2.0 for secure authentication</li>
            <li>Zero-knowledge architecture for sensitive data</li>
            <li>Regular security audits and updates</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>5. Blockchain Privacy Considerations</h2>
          <div className="privacy-warning">
            <p><strong>⚠️ Important:</strong> Content published to the BSV blockchain:</p>
            <ul>
              <li>Is permanently stored and cannot be deleted</li>
              <li>Is publicly visible if not encrypted</li>
              <li>Can be associated with your wallet address</li>
              <li>Becomes part of the immutable blockchain record</li>
            </ul>
          </div>
          <p>
            We strongly recommend encrypting sensitive documents before publishing them to the blockchain. 
            Once published, blockchain content cannot be modified or removed by anyone, including us.
          </p>
        </section>

        <section className="legal-section">
          <h2>6. Third-Party Services</h2>
          <p>We integrate with trusted third-party services:</p>
          
          <h3>6.1 Authentication Providers</h3>
          <ul>
            <li><strong>Google OAuth:</strong> For user authentication (<a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>)</li>
            <li><strong>Other OAuth Providers:</strong> Subject to their respective privacy policies</li>
          </ul>

          <h3>6.2 Blockchain Services</h3>
          <ul>
            <li><strong>HandCash:</strong> For BSV wallet integration (<a href="https://handcash.io/privacy" target="_blank" rel="noopener noreferrer">HandCash Privacy Policy</a>)</li>
            <li><strong>BSV Network:</strong> For blockchain transactions (public ledger)</li>
          </ul>

          <h3>6.3 Content Import Services</h3>
          <p>
            When you import content from third-party platforms (Google Docs, Notion, etc.), we access only the 
            specific documents you select, and we don't store your third-party credentials.
          </p>
        </section>

        <section className="legal-section">
          <h2>7. Data Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal information. We may share information only in these cases:</p>
          <ul>
            <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
            <li><strong>For Legal Compliance:</strong> When required by law or valid legal process</li>
            <li><strong>To Protect Rights:</strong> To protect our rights, property, or safety</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale (with notice)</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>8. Your Rights and Choices</h2>
          
          <h3>8.1 Your Rights</h3>
          <ul>
            <li><strong>Access:</strong> Request information about data we hold about you</li>
            <li><strong>Correction:</strong> Update or correct your profile information</li>
            <li><strong>Deletion:</strong> Delete your account and associated data (except blockchain data)</li>
            <li><strong>Portability:</strong> Export your documents and data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from non-essential communications</li>
          </ul>

          <h3>8.2 How to Exercise Your Rights</h3>
          <p>
            To exercise these rights, contact us through the in-app support feature or via our GitHub repository. 
            Note that blockchain data cannot be deleted once published.
          </p>
        </section>

        <section className="legal-section">
          <h2>9. Cookies and Tracking</h2>
          <h3>9.1 Essential Cookies</h3>
          <p>We use essential cookies for:</p>
          <ul>
            <li>User authentication and session management</li>
            <li>Storing user preferences</li>
            <li>Security features</li>
          </ul>

          <h3>9.2 Analytics</h3>
          <p>
            We use privacy-focused analytics to understand usage patterns. This data is anonymized and cannot 
            be linked to individual users.
          </p>

          <h3>9.3 Do Not Track</h3>
          <p>
            We respect Do Not Track browser settings and will not track users who have enabled this feature.
          </p>
        </section>

        <section className="legal-section">
          <h2>10. Children's Privacy</h2>
          <p>
            Bitcoin Writer is not intended for users under 13 years of age. We do not knowingly collect personal 
            information from children under 13. If we discover that we have collected information from a child 
            under 13, we will delete that information immediately.
          </p>
        </section>

        <section className="legal-section">
          <h2>11. International Data Transfers</h2>
          <p>
            Your information may be transferred to and processed in countries other than your own. The BSV 
            blockchain is a global, distributed network, and published content is replicated worldwide.
          </p>
        </section>

        <section className="legal-section">
          <h2>12. Data Retention</h2>
          <ul>
            <li><strong>Account Data:</strong> Retained while your account is active</li>
            <li><strong>Blockchain Data:</strong> Permanent and cannot be deleted</li>
            <li><strong>Local Storage:</strong> Controlled by your browser settings</li>
            <li><strong>Logs:</strong> Retained for 90 days for security purposes</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>13. Security Incidents</h2>
          <p>
            In the event of a data breach that affects your personal information, we will notify affected users 
            within 72 hours via email and provide information about the incident and recommended actions.
          </p>
        </section>

        <section className="legal-section">
          <h2>14. Changes to Privacy Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Changes will be posted on this page with an updated 
            "Last Updated" date. For significant changes, we will provide additional notice via email or in-app 
            notification.
          </p>
        </section>

        <section className="legal-section">
          <h2>15. Contact Information</h2>
          <p>For privacy-related questions or concerns:</p>
          <ul>
            <li><strong>GitHub Issues:</strong> <a href="https://github.com/bitcoin-writer" target="_blank" rel="noopener noreferrer">github.com/bitcoin-writer</a></li>
            <li><strong>In-App Support:</strong> Use the support feature within Bitcoin Writer</li>
          </ul>
          <p>
            When contacting us about privacy matters, please do not include sensitive personal information in 
            your initial communication.
          </p>
        </section>

        <section className="legal-section">
          <h2>16. California Privacy Rights</h2>
          <p>
            California residents have additional rights under the California Consumer Privacy Act (CCPA):
          </p>
          <ul>
            <li>Right to know what personal information is collected</li>
            <li>Right to know whether personal information is sold or disclosed</li>
            <li>Right to opt-out of the sale of personal information (we don't sell data)</li>
            <li>Right to non-discrimination for exercising privacy rights</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2>17. European Privacy Rights (GDPR)</h2>
          <p>
            If you are in the European Economic Area, you have additional rights under GDPR:
          </p>
          <ul>
            <li>Right to be informed about data processing</li>
            <li>Right to rectification of inaccurate data</li>
            <li>Right to erasure ("right to be forgotten") - except blockchain data</li>
            <li>Right to restrict processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
          </ul>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;