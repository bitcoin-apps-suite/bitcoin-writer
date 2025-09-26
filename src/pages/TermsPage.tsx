import React, { useEffect, useState } from 'react';
import './TermsPage.css';
import Footer from '../components/Footer';

const TermsPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    // Listen for storage changes to detect sidebar collapse state
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Check for sidebar state changes via polling
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkSidebarState);
    };
  }, []);

  return (
    <div className={`terms-page ${!isMobile ? (devSidebarCollapsed ? 'with-sidebar-collapsed' : 'with-sidebar-expanded') : ''}`}>
      <div className="terms-container">
        <div className="terms-header">
          <h1>Terms of Service</h1>
          <p className="terms-update">Last Updated: January 26, 2025</p>
        </div>

        <div className="terms-content">
          <section className="terms-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              These Terms of Service ("Terms", "Agreement") govern your relationship with the Bitcoin Writer service 
              ("Service") operated by Bitcoin Corp LTD ("us", "we", or "our"). By accessing or using the Service, 
              you agree to be bound by these Terms and accept all legal consequences. If you do not agree to these 
              terms, please do not use the Service.
            </p>
          </section>

          <section className="terms-section">
            <h2>2. Service Description</h2>
            <p>
              Bitcoin Writer is a decentralized document creation and management platform that enables:
            </p>
            <ul>
              <li>Document creation, editing, and storage</li>
              <li>Blockchain-based document verification and immutability</li>
              <li>Encryption using industry-standard protocols including NoteSV methodology</li>
              <li>Monetization through NFT minting and selective access control</li>
              <li>Integration with BSV blockchain for permanent storage</li>
              <li>HandCash wallet integration for payments and authentication</li>
            </ul>
            <p>
              All rights, title, and interest in and to the Service (excluding user content) remain with 
              Bitcoin Corp LTD.
            </p>
          </section>

          <section className="terms-section">
            <h2>3. User Accounts and Authentication</h2>
            <h3>3.1 Account Creation</h3>
            <p>
              Users may create accounts using Google OAuth or HandCash authentication. You are responsible for 
              maintaining the confidentiality of your account credentials and for all activities that occur 
              under your account.
            </p>
            
            <h3>3.2 HandCash Integration</h3>
            <p>
              For blockchain functionality, users must connect their HandCash wallet. You acknowledge that:
            </p>
            <ul>
              <li>You are solely responsible for your HandCash wallet security</li>
              <li>Bitcoin Writer never has access to your private keys</li>
              <li>All blockchain transactions are final and irreversible</li>
              <li>You must maintain sufficient BSV balance for transaction fees</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>4. Blockchain Usage and Data Permanence</h2>
            <h3>4.1 Immutability</h3>
            <p>
              <strong>WARNING:</strong> Once data is committed to the BSV blockchain, it becomes permanent and 
              cannot be deleted or modified. You understand and accept that:
            </p>
            <ul>
              <li>Uploaded content becomes publicly accessible on the blockchain</li>
              <li>Encrypted content remains encrypted but the encrypted data is public</li>
              <li>You are fully responsible for the content you upload</li>
              <li>We cannot remove or alter blockchain data once uploaded</li>
            </ul>

            <h3>4.2 Encryption</h3>
            <p>
              We offer multiple encryption methods including NoteSV protocol (AES-256 with PBKDF2). While we 
              implement industry-standard encryption, you acknowledge that:
            </p>
            <ul>
              <li>Lost passwords cannot be recovered</li>
              <li>Encryption keys are your sole responsibility</li>
              <li>We cannot decrypt your encrypted content</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>5. Fees and Payments</h2>
            <h3>5.1 Transaction Fees</h3>
            <p>
              Each blockchain operation incurs fees including:
            </p>
            <ul>
              <li>BSV network miner fees (variable based on data size)</li>
              <li>Service fees (2x markup on miner fees)</li>
              <li>Encryption premium (50% additional for encrypted storage)</li>
              <li>NFT minting fees (when applicable)</li>
            </ul>

            <h3>5.2 Payment Terms</h3>
            <p>
              All fees are:
            </p>
            <ul>
              <li>Calculated in real-time based on current BSV rates</li>
              <li>Deducted from your connected HandCash wallet</li>
              <li>Non-refundable once a transaction is broadcast</li>
              <li>Subject to change with notice</li>
            </ul>

            <h3>5.3 Auto-Save Budget</h3>
            <p>
              Default auto-save budget is $0.01 USD. You may adjust this limit, but be aware that larger 
              documents require higher budgets.
            </p>
          </section>

          <section className="terms-section">
            <h2>6. User Content and Intellectual Property</h2>
            <h3>6.1 Your Content</h3>
            <p>
              You retain all rights to content you create ("Your Content"). By using the Service, you grant us 
              a limited license to:
            </p>
            <ul>
              <li>Store and display Your Content within the Service</li>
              <li>Process Your Content for encryption and blockchain storage</li>
              <li>Create previews for monetized content (if enabled)</li>
            </ul>

            <h3>6.2 Prohibited Content</h3>
            <p>
              You agree not to upload content that:
            </p>
            <ul>
              <li>Violates any applicable laws or regulations</li>
              <li>Infringes on intellectual property rights</li>
              <li>Contains malware, viruses, or harmful code</li>
              <li>Is defamatory, obscene, or hateful</li>
              <li>Violates the privacy rights of others</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>7. NFT and Monetization Features</h2>
            <p>
              When using NFT minting and monetization features:
            </p>
            <ul>
              <li>You warrant that you have the right to tokenize the content</li>
              <li>NFT ownership does not transfer copyright unless explicitly stated</li>
              <li>Revenue sharing and royalty percentages are enforced by smart contracts</li>
              <li>We are not responsible for NFT market value or liquidity</li>
              <li>Trading of shares/tokens must comply with applicable securities laws</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>8. Privacy and Data Protection</h2>
            <p>
              We collect and process data as described in our Privacy Policy. Key points:
            </p>
            <ul>
              <li>We use cookies for authentication and user preferences</li>
              <li>Google Analytics may collect usage statistics</li>
              <li>Your documents are stored locally and optionally on blockchain</li>
              <li>We do not sell personal data to third parties</li>
              <li>Blockchain data is public and permanent</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>9. Third-Party Services</h2>
            <p>
              The Service integrates with third-party services including:
            </p>
            <ul>
              <li>HandCash for payments and authentication</li>
              <li>Google OAuth for authentication</li>
              <li>BSV blockchain network</li>
              <li>IPFS for distributed storage (optional)</li>
            </ul>
            <p>
              We are not responsible for the availability, accuracy, or reliability of third-party services.
            </p>
          </section>

          <section className="terms-section">
            <h2>10. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul>
              <li>The Service is provided "AS IS" without warranties of any kind</li>
              <li>We are not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability shall not exceed fees paid in the past 12 months</li>
              <li>We are not responsible for blockchain network issues or delays</li>
              <li>We are not liable for lost or stolen cryptocurrency</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Bitcoin Corp LTD, its officers, directors, employees, 
              and agents from any claims, damages, losses, or expenses arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your Content uploaded to the blockchain</li>
            </ul>
          </section>

          <section className="terms-section">
            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice, for:
            </p>
            <ul>
              <li>Breach of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Harm to other users or the Service</li>
              <li>Extended periods of inactivity</li>
            </ul>
            <p>
              Upon termination, your right to use the Service will cease immediately. Blockchain data will 
              remain permanent regardless of account status.
            </p>
          </section>

          <section className="terms-section">
            <h2>13. Governing Law and Disputes</h2>
            <p>
              These Terms are governed by the laws of [Jurisdiction]. Any disputes shall be resolved through 
              binding arbitration, except where prohibited by law. You waive any right to a jury trial or 
              class action lawsuit.
            </p>
          </section>

          <section className="terms-section">
            <h2>14. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of material 
              changes via email or Service notification. Continued use after changes constitutes acceptance 
              of new Terms.
            </p>
          </section>

          <section className="terms-section">
            <h2>15. Additional Provisions</h2>
            <h3>15.1 Export Compliance</h3>
            <p>
              You agree to comply with all applicable export and import laws, including U.S. export 
              controls and sanctions.
            </p>

            <h3>15.2 Entire Agreement</h3>
            <p>
              These Terms constitute the entire agreement between you and Bitcoin Corp LTD regarding the 
              Service and supersede all prior agreements.
            </p>

            <h3>15.3 Severability</h3>
            <p>
              If any provision of these Terms is found unenforceable, the remaining provisions will 
              continue in full force.
            </p>

            <h3>15.4 No Waiver</h3>
            <p>
              Our failure to enforce any provision shall not constitute a waiver of that or any other 
              provision.
            </p>
          </section>

          <section className="terms-section">
            <h2>16. Contact Information</h2>
            <p>
              For questions about these Terms, please contact us at:
            </p>
            <div className="contact-info">
              <p><strong>Bitcoin Corp LTD</strong></p>
              <p>Email: legal@bitcoin-writer.io</p>
              <p>Website: https://bitcoin-writer.vercel.app</p>
            </div>
          </section>

          <section className="terms-section acknowledgment">
            <h2>Acknowledgment</h2>
            <p>
              By using Bitcoin Writer, you acknowledge that you have read, understood, and agree to be 
              bound by these Terms of Service. You specifically acknowledge the permanent nature of 
              blockchain transactions and accept full responsibility for content you upload.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;