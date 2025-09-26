import React, { useState, useEffect } from 'react';
import './LegalPages.css';
import Footer from '../components/Footer';

const ContactPage: React.FC = () => {
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

  const contactMethods = [
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#f7931a">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12C22 6.48 17.52 2 12 2Z"/>
        </svg>
      ),
      title: "GitHub Issues",
      description: "Report bugs, request features, or ask technical questions",
      link: "https://github.com/bitcoin-writer/bitcoin-writer/issues",
      buttonText: "Open Issue"
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#f7931a">
          <path d="M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4M20 8L12 13L4 8V6L12 11L20 6V8Z"/>
        </svg>
      ),
      title: "Email Support",
      description: "For private inquiries or sensitive issues",
      link: "mailto:support@bitcoin-writer.com",
      buttonText: "Send Email"
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#f7931a">
          <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2M11 19.93C7.05 19.44 4 16.08 4 12C4 11.38 4.08 10.79 4.21 10.21L9 15V16C9 17.1 9.9 18 11 18M17.9 17.39C17.64 16.58 16.9 16 16 16H15V13C15 12.45 14.55 12 14 12H8V10H10C10.55 10 11 9.55 11 9V7H13C14.1 7 15 6.1 15 5V4.59C17.93 5.78 20 8.65 20 12C20 14.08 19.2 15.97 17.9 17.39Z"/>
        </svg>
      ),
      title: "Community Forum",
      description: "Join discussions with other Bitcoin Writer users",
      link: "https://community.bitcoin-writer.com",
      buttonText: "Visit Forum"
    },
    {
      icon: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#f7931a">
          <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10C2.38 10 2.38 10 2.38 10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.74 21 8.23 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z"/>
        </svg>
      ),
      title: "Twitter/X",
      description: "Follow us for updates and announcements",
      link: "https://twitter.com/bitcoinwriter",
      buttonText: "Follow Us"
    }
  ];

  const faqs = [
    {
      question: "How quickly can I expect a response?",
      answer: "We typically respond to GitHub issues within 24-48 hours. Email support may take 2-3 business days. For urgent technical issues, GitHub is the fastest way to get help from our team and community."
    },
    {
      question: "What information should I include when reporting a bug?",
      answer: "Please include: (1) Steps to reproduce the issue, (2) Expected vs actual behavior, (3) Browser and OS information, (4) Screenshots if relevant, (5) Any error messages from the console."
    },
    {
      question: "Can I contribute to Bitcoin Writer?",
      answer: "Yes! Bitcoin Writer is open-source. Check our GitHub repository for contribution guidelines. We welcome code contributions, documentation improvements, and feature suggestions."
    },
    {
      question: "Is there a Discord or Telegram community?",
      answer: "We're primarily active on GitHub Discussions and our community forum. These platforms provide better long-term documentation and searchability for technical discussions."
    },
    {
      question: "How do I request a new feature?",
      answer: "Open a GitHub issue with the 'feature request' label. Describe your use case, the problem it solves, and any implementation ideas. Community discussion helps prioritize new features."
    },
    {
      question: "What about security vulnerabilities?",
      answer: "For security issues, please email us directly at security@bitcoin-writer.com instead of creating a public issue. We take security seriously and will respond promptly."
    }
  ];

  return (
    <div className={`legal-page ${!isMobile ? (devSidebarCollapsed ? 'with-sidebar-collapsed' : 'with-sidebar-expanded') : ''}`}>
      {/* Hero Section */}
      <div className="legal-hero">
        <div className="legal-badge">Support</div>
        <h1>Contact Us</h1>
        <p className="legal-tagline">
          We're here to help. Choose the best way to reach us.
        </p>
      </div>

      {/* Main Content */}
      <div className="legal-container">
        <section className="legal-section">
          <h2>Get in Touch</h2>
          <p>
            Whether you need technical support, want to report a bug, or have suggestions for improvement, 
            we're here to listen. Choose the contact method that works best for you.
          </p>
        </section>

        {/* Contact Methods Grid */}
        <div className="contact-grid">
          {contactMethods.map((method, index) => (
            <div key={index} className="contact-card">
              <div className="contact-icon">{method.icon}</div>
              <h3>{method.title}</h3>
              <p>{method.description}</p>
              <a 
                href={method.link} 
                className="contact-button"
                target="_blank"
                rel="noopener noreferrer"
              >
                {method.buttonText}
              </a>
            </div>
          ))}
        </div>

        {/* Response Times */}
        <section className="legal-section">
          <h2>Response Times</h2>
          <ul>
            <li><strong>Critical Issues:</strong> Within 24 hours via GitHub</li>
            <li><strong>Feature Requests:</strong> Reviewed weekly</li>
            <li><strong>General Inquiries:</strong> 2-3 business days</li>
            <li><strong>Security Issues:</strong> Within 12 hours via security email</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="legal-section contact-faq">
          <h2>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h4>{faq.question}</h4>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>

        {/* Additional Resources */}
        <section className="legal-section">
          <h2>Additional Resources</h2>
          <ul>
            <li><a href="/docs">Documentation</a> - Comprehensive guides and tutorials</li>
            <li><a href="/encrypt">Encryption Guide</a> - Learn about NoteSV encryption</li>
            <li><a href="/import">Import Guide</a> - How to import from other platforms</li>
            <li><a href="/privacy">Privacy Policy</a> - How we protect your data</li>
            <li><a href="https://github.com/bitcoin-writer/bitcoin-writer" target="_blank" rel="noopener noreferrer">Source Code</a> - View and contribute on GitHub</li>
          </ul>
        </section>

        {/* Developer Contact */}
        <section className="legal-section">
          <h2>For Developers</h2>
          <p>
            If you're interested in integrating with Bitcoin Writer or building on our platform:
          </p>
          <ul>
            <li><strong>API Documentation:</strong> Available on our GitHub Wiki</li>
            <li><strong>Developer Discord:</strong> Join technical discussions</li>
            <li><strong>Integration Support:</strong> developer@bitcoin-writer.com</li>
          </ul>
        </section>

        {/* Business Inquiries */}
        <section className="legal-section">
          <h2>Business Inquiries</h2>
          <p>
            For partnerships, enterprise solutions, or media inquiries:
          </p>
          <ul>
            <li><strong>Partnerships:</strong> partnerships@bitcoin-writer.com</li>
            <li><strong>Enterprise:</strong> enterprise@bitcoin-writer.com</li>
            <li><strong>Media/Press:</strong> press@bitcoin-writer.com</li>
          </ul>
        </section>

        {/* Emergency Contact */}
        <section className="legal-section">
          <div className="privacy-warning">
            <p><strong>⚠️ Security Issues:</strong></p>
            <p>
              If you discover a security vulnerability, please DO NOT create a public issue. 
              Email us directly at <strong>security@bitcoin-writer.com</strong> with details. 
              We offer bug bounties for responsibly disclosed vulnerabilities.
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;