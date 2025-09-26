import React, { useState } from 'react';
import './EncryptPage.css';
import Footer from '../components/Footer';
import { NoteSVEncryption } from '../services/NoteSVEncryption';

const EncryptPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [testContent, setTestContent] = useState('');
  const [encryptedResult, setEncryptedResult] = useState<any>(null);
  const [decryptedResult, setDecryptedResult] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; feedback: string } | null>(null);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile] = useState(window.innerWidth <= 768);

  React.useEffect(() => {
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

  const handleEncrypt = () => {
    if (testContent && password) {
      const result = NoteSVEncryption.encrypt(testContent, password);
      setEncryptedResult(result);
    }
  };

  const handleDecrypt = () => {
    if (encryptedResult && password) {
      try {
        const decrypted = NoteSVEncryption.decrypt(encryptedResult, password);
        setDecryptedResult(decrypted);
      } catch (error) {
        setDecryptedResult('Decryption failed: Invalid password or corrupted data');
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);
    if (pwd) {
      setPasswordStrength(NoteSVEncryption.checkPasswordStrength(pwd));
    } else {
      setPasswordStrength(null);
    }
  };

  const algorithmSteps = [
    {
      title: "1. Key Derivation (PBKDF2)",
      code: `// Derive a 256-bit key from password
const key = PBKDF2(
  password,
  salt,           // 128-bit random salt
  iterations: 10000,
  keySize: 256,
  hasher: SHA256
);`,
      description: "Uses PBKDF2 with SHA-256 to derive a cryptographically secure key from the user's password, with 10,000 iterations to prevent brute-force attacks"
    },
    {
      title: "2. AES-256-CBC Encryption",
      code: `// Encrypt content using AES-256
const encrypted = AES.encrypt(
  content,
  key,            // 256-bit derived key
  mode: CBC,      // Cipher Block Chaining
  iv: random(128), // Random initialization vector
  padding: PKCS7
);`,
      description: "Industry-standard AES-256 encryption in CBC mode with PKCS7 padding, using a unique IV for each encryption"
    },
    {
      title: "3. HMAC Generation",
      code: `// Generate HMAC for integrity
const hmac = HMAC-SHA256(
  salt + iv + encryptedContent,
  key
);`,
      description: "Creates an HMAC signature to ensure data integrity and authenticate the encrypted content"
    },
    {
      title: "4. BSV Storage Format",
      code: `// Package for blockchain storage
{
  "version": "1.0",
  "encryption": {
    "encryptedContent": "...",
    "encryptionMethod": "NoteSV-AES256",
    "salt": "128-bit hex",
    "iv": "128-bit hex",
    "iterations": 10000,
    "hmac": "256-bit hex"
  },
  "metadata": {...}
}`,
      description: "Structured JSON format optimized for BSV blockchain storage with all necessary decryption parameters"
    }
  ];

  const features = [
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#f7931a">
          <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z"/>
        </svg>
      ),
      title: "Military-Grade Security",
      description: "AES-256-CBC encryption with PBKDF2 key derivation - the same standard used by governments and financial institutions"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#f7931a">
          <path d="M7,14L12,9L17,14M12,9V21"/>
        </svg>
      ),
      title: "BSV Optimized",
      description: "Lightweight encryption overhead designed specifically for efficient blockchain storage at minimal cost"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#f7931a">
          <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"/>
        </svg>
      ),
      title: "NoteSV Heritage",
      description: "Based on the proven encryption methodology from NOTE.SV, the trusted BSV password manager"
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#f7931a">
          <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
        </svg>
      ),
      title: "Zero-Knowledge",
      description: "Your password never leaves your device - all encryption happens client-side in your browser"
    }
  ];

  const securityFeatures = [
    "10,000 PBKDF2 iterations prevent brute-force attacks",
    "Unique salt for each encryption prevents rainbow table attacks",
    "HMAC-SHA256 ensures data integrity and authenticity",
    "CBC mode with random IV prevents pattern analysis",
    "Client-side encryption - we never see your passwords",
    "Open-source implementation for full transparency"
  ];

  return (
    <div className={`encrypt-page ${!isMobile ? (devSidebarCollapsed ? 'with-sidebar-collapsed' : 'with-sidebar-expanded') : ''}`}>
      {/* Hero Section */}
      <div id="hero" className="encrypt-hero">
        <div className="encrypt-badge">NoteSV Encryption</div>
        <h1>Military-Grade Document Encryption</h1>
        <p className="encrypt-tagline">
          Secure your documents with the same encryption technology used by NOTE.SV - 
          the trusted BSV password manager. AES-256 encryption optimized for blockchain storage.
        </p>
      </div>

      {/* Main Content */}
      <div className="encrypt-container">
        {/* Demo Section */}
        <section id="demo" className="encrypt-demo-section">
          <h2>Try It Yourself</h2>
          <p className="encrypt-section-subtitle">
            Test our NoteSV encryption implementation right here in your browser
          </p>
          <div className="encrypt-demo-card">
            <div className="encrypt-demo-grid">
              <div className="encrypt-demo-input">
                <label>Content to Encrypt</label>
                <textarea
                  value={testContent}
                  onChange={(e) => setTestContent(e.target.value)}
                  placeholder="Enter any text you want to encrypt..."
                  rows={4}
                />
              </div>
              <div className="encrypt-demo-input">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="Enter a strong password..."
                />
                {passwordStrength && (
                  <div className={`password-strength score-${Math.floor(passwordStrength.score / 20)}`}>
                    <div className="password-strength-bar">
                      <div className="password-strength-fill" style={{ width: `${passwordStrength.score}%` }} />
                    </div>
                    <span>{passwordStrength.feedback}</span>
                  </div>
                )}
              </div>
              <div className="encrypt-demo-buttons">
                <button onClick={handleEncrypt} className="encrypt-button">
                  Encrypt Content
                </button>
                <button onClick={handleDecrypt} className="decrypt-button" disabled={!encryptedResult}>
                  Decrypt Content
                </button>
                <button 
                  onClick={() => setPassword(NoteSVEncryption.generateStrongPassword())} 
                  className="generate-button"
                >
                  Generate Strong Password
                </button>
              </div>
            </div>
            {encryptedResult && (
              <div className="encrypt-result">
                <h4>Encrypted Result:</h4>
                <pre>{JSON.stringify(encryptedResult, null, 2)}</pre>
              </div>
            )}
            {decryptedResult && (
              <div className="decrypt-result">
                <h4>Decrypted Content:</h4>
                <pre>{decryptedResult}</pre>
              </div>
            )}
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="encrypt-features-section">
          <h2>Why NoteSV Encryption?</h2>
          <div className="encrypt-features-grid">
            {features.map((feature, index) => (
              <div key={index} className="encrypt-feature-card">
                <div className="encrypt-feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Algorithm Deep Dive */}
        <section id="algorithm" className="encrypt-algorithm-section">
          <h2>The NoteSV Algorithm</h2>
          <p className="encrypt-section-subtitle">
            A detailed look at our encryption implementation, inspired by NOTE.SV's proven methodology
          </p>
          <div className="encrypt-algorithm-steps">
            {algorithmSteps.map((step, index) => (
              <div key={index} className="algorithm-step">
                <h3>{step.title}</h3>
                <div className="algorithm-code">
                  <pre>{step.code}</pre>
                </div>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Specifications */}
        <section id="specs" className="encrypt-specs-section">
          <h2>Technical Specifications</h2>
          <div className="encrypt-specs-grid">
            <div className="spec-card">
              <h3>Encryption Standard</h3>
              <ul>
                <li>Algorithm: AES-256-CBC</li>
                <li>Key Size: 256 bits</li>
                <li>Block Size: 128 bits</li>
                <li>Mode: Cipher Block Chaining</li>
                <li>Padding: PKCS7</li>
              </ul>
            </div>
            <div className="spec-card">
              <h3>Key Derivation</h3>
              <ul>
                <li>Function: PBKDF2</li>
                <li>Hash: SHA-256</li>
                <li>Iterations: 10,000</li>
                <li>Salt Size: 128 bits</li>
                <li>Output: 256-bit key</li>
              </ul>
            </div>
            <div className="spec-card">
              <h3>Data Integrity</h3>
              <ul>
                <li>Method: HMAC-SHA256</li>
                <li>Coverage: Salt + IV + Ciphertext</li>
                <li>Key: Derived encryption key</li>
                <li>Size: 256 bits</li>
                <li>Verification: Pre-decryption</li>
              </ul>
            </div>
            <div className="spec-card">
              <h3>BSV Storage</h3>
              <ul>
                <li>Format: JSON</li>
                <li>Encoding: Base64 + Hex</li>
                <li>Overhead: ~33% + 128 bytes</li>
                <li>Cost: ~$0.01 per MB</li>
                <li>Permanence: Forever</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section id="security" className="encrypt-security-section">
          <h2>Security Features</h2>
          <div className="encrypt-security-list">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="security-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#4CAF50">
                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </section>

        {/* NoteSV Attribution */}
        <section id="attribution" className="encrypt-attribution-section">
          <h2>Built on NoteSV's Foundation</h2>
          <div className="attribution-content">
            <div className="attribution-text">
              <p>
                Our encryption implementation is inspired by and based on the open-source work of 
                <strong> NOTE.SV</strong>, the pioneering BSV password manager that demonstrated 
                how to combine strong encryption with blockchain permanence.
              </p>
              <p>
                We've adapted their proven encryption methodology specifically for document storage, 
                maintaining the same security standards while optimizing for larger content and 
                efficient blockchain storage.
              </p>
              <p>
                The NoteSV approach represents the gold standard for client-side encryption on BSV:
              </p>
              <ul>
                <li>Zero-knowledge architecture - your passwords never leave your device</li>
                <li>Industry-standard AES-256 encryption with proper key derivation</li>
                <li>Optimized for BSV's unique storage capabilities</li>
                <li>Open-source and fully auditable</li>
              </ul>
              <p>
                By building on NoteSV's foundation, we ensure that your documents receive the same 
                level of protection that users trust for their most sensitive passwords.
              </p>
            </div>
            <div className="attribution-comparison">
              <h3>Implementation Comparison</h3>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>NOTE.SV Original</th>
                    <th>Bitcoin Writer Implementation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Encryption</td>
                    <td>AES-256-CBC</td>
                    <td>AES-256-CBC (identical)</td>
                  </tr>
                  <tr>
                    <td>Key Derivation</td>
                    <td>PBKDF2 (10k iterations)</td>
                    <td>PBKDF2 (10k iterations)</td>
                  </tr>
                  <tr>
                    <td>Integrity</td>
                    <td>HMAC-SHA256</td>
                    <td>HMAC-SHA256</td>
                  </tr>
                  <tr>
                    <td>Use Case</td>
                    <td>Password storage</td>
                    <td>Document storage</td>
                  </tr>
                  <tr>
                    <td>Storage Size</td>
                    <td>Optimized for small entries</td>
                    <td>Optimized for large documents</td>
                  </tr>
                  <tr>
                    <td>Metadata</td>
                    <td>Password metadata</td>
                    <td>Document metadata + authorship</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="encrypt-use-cases-section">
          <h2>Perfect For</h2>
          <div className="use-cases-grid">
            <div className="use-case-card">
              <h3>Legal Documents</h3>
              <p>Contracts, agreements, and confidential legal papers secured on-chain</p>
            </div>
            <div className="use-case-card">
              <h3>Medical Records</h3>
              <p>Patient data and medical histories with HIPAA-level encryption</p>
            </div>
            <div className="use-case-card">
              <h3>Creative Works</h3>
              <p>Manuscripts, screenplays, and intellectual property with timestamped proof</p>
            </div>
            <div className="use-case-card">
              <h3>Business Documents</h3>
              <p>Financial reports, strategies, and proprietary information</p>
            </div>
            <div className="use-case-card">
              <h3>Personal Archives</h3>
              <p>Journals, letters, and family documents preserved forever</p>
            </div>
            <div className="use-case-card">
              <h3>Research Data</h3>
              <p>Academic papers and research with immutable timestamps</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="get-started" className="encrypt-cta-section">
          <h2>Start Encrypting Your Documents</h2>
          <p>Join thousands of users securing their documents with NoteSV encryption on the BSV blockchain</p>
          <button 
            className="encrypt-cta-button"
            onClick={() => window.location.href = '/'}
          >
            Create Encrypted Document
          </button>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default EncryptPage;