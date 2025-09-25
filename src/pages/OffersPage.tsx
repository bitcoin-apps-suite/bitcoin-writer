import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OffersPage.css';
import Footer from '../components/Footer';

interface PublisherOffer {
  id: string;
  publisher: string;
  title: string;
  description: string;
  type: string;
  budget: string;
  currency: string;
  wordCount: string;
  deadline: string;
  status: 'open' | 'in_progress' | 'filled';
  applicants: number;
  escrowAmount: string;
  requirements: string[];
}

const OffersPage: React.FC = () => {
  const navigate = useNavigate();
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
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

  const publisherOffers: PublisherOffer[] = [
    {
      id: '1',
      publisher: 'CoinDesk Media',
      title: 'Bitcoin Halving Analysis Article Series',
      description: 'We need a comprehensive 5-part article series analyzing the upcoming Bitcoin halving event, its historical impact, and predictions for market behavior.',
      type: 'Article Series',
      budget: '2500',
      currency: '$BWRITER',
      wordCount: '10000',
      deadline: '2025-02-15',
      status: 'open',
      applicants: 3,
      escrowAmount: '2500 $BWRITER',
      requirements: ['Deep understanding of Bitcoin economics', 'Previous crypto writing samples', 'Ability to analyze on-chain data']
    },
    {
      id: '2',
      publisher: 'BSV Apps Inc',
      title: 'Technical Documentation for New SDK',
      description: 'Complete technical documentation for our new BSV development SDK, including API reference, tutorials, and integration guides.',
      type: 'Documentation',
      budget: '5000',
      currency: 'BSV',
      wordCount: '15000',
      deadline: '2025-03-01',
      status: 'open',
      applicants: 7,
      escrowAmount: '5000 BSV',
      requirements: ['Technical writing experience', 'Understanding of BSV architecture', 'Ability to create code examples']
    },
    {
      id: '3',
      publisher: 'Crypto Weekly',
      title: 'DeFi Protocol Deep Dive',
      description: 'In-depth analysis of emerging DeFi protocols on BSV, comparing features, security, and potential risks.',
      type: 'Research Report',
      budget: '1500',
      currency: '$BWRITER',
      wordCount: '5000',
      deadline: '2025-01-30',
      status: 'open',
      applicants: 5,
      escrowAmount: '1500 $BWRITER',
      requirements: ['DeFi expertise', 'Risk analysis skills', 'Data visualization capabilities']
    },
    {
      id: '4',
      publisher: 'Blockchain Education Hub',
      title: 'Beginner\'s Guide to Smart Contracts',
      description: 'Create an accessible, comprehensive guide for beginners learning about smart contracts on BSV.',
      type: 'Tutorial',
      budget: '800',
      currency: '$BWRITER',
      wordCount: '3000',
      deadline: '2025-02-10',
      status: 'open',
      applicants: 12,
      escrowAmount: '800 $BWRITER',
      requirements: ['Teaching/educational writing experience', 'Simple explanations of complex topics', 'Visual aids and diagrams']
    },
    {
      id: '5',
      publisher: 'Token Ventures',
      title: 'White Paper for New Token Launch',
      description: 'Professional white paper for our upcoming utility token launch, covering tokenomics, use cases, and technical architecture.',
      type: 'White Paper',
      budget: '8000',
      currency: 'BSV',
      wordCount: '12000',
      deadline: '2025-02-28',
      status: 'open',
      applicants: 2,
      escrowAmount: '8000 BSV',
      requirements: ['White paper writing experience', 'Tokenomics knowledge', 'Professional formatting']
    },
    {
      id: '6',
      publisher: 'Daily Crypto News',
      title: 'Weekly Market Commentary',
      description: 'Ongoing weekly market commentary and analysis pieces covering major cryptocurrency movements and trends.',
      type: 'Ongoing Content',
      budget: '300',
      currency: '$BWRITER',
      wordCount: '1500',
      deadline: 'Weekly',
      status: 'open',
      applicants: 18,
      escrowAmount: '300 $BWRITER/week',
      requirements: ['Fast turnaround', 'Market analysis skills', 'Consistent availability']
    }
  ];

  const categories = [
    { value: 'all', label: 'All Commissions' },
    { value: 'article', label: 'Articles' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'whitepaper', label: 'White Papers' },
    { value: 'research', label: 'Research' },
    { value: 'ongoing', label: 'Ongoing Work' }
  ];

  const filteredOffers = selectedCategory === 'all' 
    ? publisherOffers 
    : publisherOffers.filter(offer => {
        if (selectedCategory === 'article') return offer.type.toLowerCase().includes('article');
        if (selectedCategory === 'documentation') return offer.type.toLowerCase().includes('documentation');
        if (selectedCategory === 'whitepaper') return offer.type.toLowerCase().includes('white');
        if (selectedCategory === 'research') return offer.type.toLowerCase().includes('research');
        if (selectedCategory === 'ongoing') return offer.type.toLowerCase().includes('ongoing');
        return false;
      });

  return (
    <div className="App">
      <div className={`offers-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        
        {/* Hero Section */}
        <section className="offers-hero">
          <h1>Browse Publisher <span style={{color: '#4CAF50'}}>Commissions</span></h1>
          <p className="offers-tagline">
            Find writing opportunities with guaranteed BSV escrow payment
          </p>
          <div className="offers-badge">6 ACTIVE COMMISSIONS</div>
        </section>

        <div className="offers-container">
          {/* Author CTA */}
          <div className="publisher-cta-compact">
            <span className="cta-text">Want to offer your writing services?</span>
            <button className="commission-button-compact" onClick={() => navigate('/author/offer')}>
              Create Your Profile →
            </button>
          </div>

          {/* Filters */}
          <section className="offers-filters">
            <div className="category-filter">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  className={`filter-button ${selectedCategory === cat.value ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.value)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </section>

          {/* Commission Grid */}
          <section className="current-offers-section">
            <div className="offers-grid">
              {filteredOffers.map(offer => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-header">
                    <span className="offer-type">{offer.type}</span>
                    <span className={`offer-status ${offer.status}`}>
                      {offer.status === 'open' ? '🟢 OPEN' : offer.status === 'in_progress' ? '🟡 IN PROGRESS' : '🔴 FILLED'}
                    </span>
                  </div>
                  
                  <h3>{offer.title}</h3>
                  <p className="publisher-name">by {offer.publisher}</p>
                  <p>{offer.description}</p>
                  
                  <ul>
                    {offer.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>

                  <div className="offer-details-grid">
                    <div className="offer-detail">
                      <span className="detail-label">Budget</span>
                      <span className="detail-value">{offer.budget} {offer.currency}</span>
                    </div>
                    <div className="offer-detail">
                      <span className="detail-label">Words</span>
                      <span className="detail-value">{offer.wordCount}</span>
                    </div>
                    <div className="offer-detail">
                      <span className="detail-label">Deadline</span>
                      <span className="detail-value">{offer.deadline}</span>
                    </div>
                    <div className="offer-detail">
                      <span className="detail-label">Applicants</span>
                      <span className="detail-value">{offer.applicants}</span>
                    </div>
                  </div>

                  <div className="escrow-badge">
                    🔒 {offer.escrowAmount} locked in escrow
                  </div>

                  <div className="offer-cta">
                    <button className="apply-button">Apply for Commission →</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="benefits-section">
            <h2>Why Write for Publisher Commissions?</h2>
            <div className="benefits-grid">
              <div className="benefit">
                <div className="benefit-icon">🔒</div>
                <h3>Guaranteed Payment</h3>
                <p>Funds are locked in escrow before you start working</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">⚡</div>
                <h3>Instant Settlement</h3>
                <p>Get paid immediately upon work approval via BSV</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">📊</div>
                <h3>Build Reputation</h3>
                <p>Every completed commission builds your on-chain reputation</p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="how-it-works">
            <h2>How Commission Work Works</h2>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Browse & Apply</h3>
                <p>Find commissions that match your expertise and apply with your proposal</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <h3>Get Selected</h3>
                <p>Publishers review applications and select the best writer for their project</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <h3>Create Content</h3>
                <p>Work on the commission with funds securely locked in escrow</p>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <h3>Get Paid</h3>
                <p>Submit your work and receive instant payment when approved</p>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default OffersPage;