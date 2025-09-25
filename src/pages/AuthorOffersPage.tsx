import React, { useState, useEffect } from 'react';
import './AuthorOffersPage.css';
import Footer from '../components/Footer';
import ContactAuthorModal from '../components/ContactAuthorModal';

interface AuthorOffer {
  id: string;
  name: string;
  expertise: string[];
  rate: string;
  availability: string;
  portfolio: string;
  rating: number;
  completedProjects: number;
  bio: string;
}

const AuthorOffersPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<{ name: string; id: string } | null>(null);

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

  const authorOffers: AuthorOffer[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      expertise: ['Technical Writing', 'API Documentation', 'Tutorials'],
      rate: '150 $BWRITER/hour',
      availability: 'Available Now',
      portfolio: 'https://portfolio.example.com/sarah',
      rating: 4.9,
      completedProjects: 47,
      bio: 'Specializing in developer documentation and technical content for blockchain projects.'
    },
    {
      id: '2',
      name: 'Michael Torres',
      expertise: ['White Papers', 'Research', 'Academic Writing'],
      rate: '200 $BWRITER/hour',
      availability: '2 days',
      portfolio: 'https://portfolio.example.com/michael',
      rating: 4.8,
      completedProjects: 32,
      bio: 'PhD in Computer Science. Expert in blockchain technology and distributed systems.'
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      expertise: ['Blog Posts', 'SEO Content', 'Marketing Copy'],
      rate: '100 $BWRITER/hour',
      availability: 'Available Now',
      portfolio: 'https://portfolio.example.com/emily',
      rating: 4.7,
      completedProjects: 89,
      bio: 'Creating engaging content that drives traffic and converts readers into users.'
    },
    {
      id: '4',
      name: 'David Kim',
      expertise: ['Smart Contracts', 'Code Documentation', 'Technical Guides'],
      rate: '250 $BWRITER/hour',
      availability: '1 week',
      portfolio: 'https://portfolio.example.com/david',
      rating: 5.0,
      completedProjects: 23,
      bio: 'Solidity developer turned technical writer. Making complex code understandable.'
    },
    {
      id: '5',
      name: 'Jessica Wang',
      expertise: ['Case Studies', 'User Stories', 'Product Documentation'],
      rate: '120 $BWRITER/hour',
      availability: 'Available Now',
      portfolio: 'https://portfolio.example.com/jessica',
      rating: 4.6,
      completedProjects: 55,
      bio: 'Telling your product\'s story through compelling narratives and clear documentation.'
    },
    {
      id: '6',
      name: 'Robert Martinez',
      expertise: ['Grant Proposals', 'Business Plans', 'Pitch Decks'],
      rate: '180 $BWRITER/hour',
      availability: '3 days',
      portfolio: 'https://portfolio.example.com/robert',
      rating: 4.9,
      completedProjects: 41,
      bio: 'Helping startups secure funding with persuasive proposals and presentations.'
    }
  ];

  const categories = [
    { value: 'all', label: 'All Writers' },
    { value: 'technical', label: 'Technical Writing' },
    { value: 'marketing', label: 'Marketing & SEO' },
    { value: 'academic', label: 'Academic & Research' },
    { value: 'business', label: 'Business Writing' }
  ];

  const filteredOffers = selectedCategory === 'all' 
    ? authorOffers 
    : authorOffers.filter(offer => {
        if (selectedCategory === 'technical') return offer.expertise.some(e => e.includes('Technical') || e.includes('API') || e.includes('Code'));
        if (selectedCategory === 'marketing') return offer.expertise.some(e => e.includes('Blog') || e.includes('SEO') || e.includes('Marketing'));
        if (selectedCategory === 'academic') return offer.expertise.some(e => e.includes('Research') || e.includes('Academic') || e.includes('White'));
        if (selectedCategory === 'business') return offer.expertise.some(e => e.includes('Grant') || e.includes('Business') || e.includes('Pitch'));
        return false;
      });

  return (
    <div className="App">
      <div className={`author-offers-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        
        {/* Hero Section */}
        <div className="author-offers-hero">
          <h1>Find Professional Writers</h1>
          <p>Connect with experienced writers ready to work on your blockchain projects</p>
          <div className="author-offers-badge">12 WRITERS AVAILABLE</div>
        </div>

        <div className="author-offers-container">
          {/* Filters */}
          <div className="author-offers-filters">
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
          </div>

          {/* Authors Grid */}
          <div className="author-offers-grid">
            {filteredOffers.map(offer => (
              <div key={offer.id} className="author-offer-card">
                <div className="author-header">
                  <div className="author-info">
                    <h3>{offer.name}</h3>
                    <div className="author-stats">
                      <span className="rating">⭐ {offer.rating}</span>
                      <span className="projects">{offer.completedProjects} projects</span>
                    </div>
                  </div>
                  <div className={`availability ${offer.availability === 'Available Now' ? 'available' : 'busy'}`}>
                    {offer.availability === 'Available Now' ? 'AVAILABLE' : 'IN ' + offer.availability.toUpperCase()}
                  </div>
                </div>

                <p className="author-bio">{offer.bio}</p>

                <div className="expertise-tags">
                  {offer.expertise.map((skill, index) => (
                    <span key={index} className="expertise-tag">{skill}</span>
                  ))}
                </div>

                <div className="author-footer">
                  <div className="rate">{offer.rate}</div>
                  <button 
                    className="hire-author-button"
                    onClick={() => {
                      setSelectedAuthor({ name: offer.name, id: offer.id });
                      setContactModalOpen(true);
                    }}
                  >
                    Hire This Writer →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="author-offers-cta">
            <h2>Looking to Offer Your Writing Services?</h2>
            <p>Join our network of professional writers and connect with publishers looking for quality content.</p>
            <button className="create-offer-button" onClick={() => window.location.href = '/author/offer'}>
              Create Your Writer Profile →
            </button>
          </div>
        </div>
        <Footer />
      </div>
      
      {selectedAuthor && (
        <ContactAuthorModal
          isOpen={contactModalOpen}
          onClose={() => {
            setContactModalOpen(false);
            setSelectedAuthor(null);
          }}
          authorName={selectedAuthor.name}
          authorId={selectedAuthor.id}
        />
      )}
    </div>
  );
};

export default AuthorOffersPage;