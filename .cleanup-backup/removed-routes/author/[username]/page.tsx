'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import './author-profile.css';

interface WritingOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  deliverables: string[];
  timeline: string;
  priceInBWRITER: string;
  authorName: string;
  authorEmail: string;
  githubUsername: string;
  handCashHandle: string;
  samples: string;
  expertise: string[];
  createdAt: string;
  status: string;
}

interface AuthorProfile {
  username: string;
  name: string;
  bio: string;
  email: string;
  githubUsername: string;
  handCashHandle: string;
  portfolio: string;
  expertise: string[];
  joinedDate: string;
  totalOffers: number;
  completedProjects: number;
  rating: number;
}

const AuthorProfilePage: React.FC = () => {
  const params = useParams();
  const username = params.username as string;
  
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);
  const [authorOffers, setAuthorOffers] = useState<WritingOffer[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    setMounted(true);
    
    // Initialize state after mounting
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

    // Load author profile and offers
    loadAuthorData();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, [username]);

  const loadAuthorData = () => {
    // Mock author profile (in production, fetch from database)
    const mockProfile: AuthorProfile = {
      username: username,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      bio: "Experienced blockchain and technical writer specializing in cryptocurrency, DeFi, and developer documentation.",
      email: `${username}@example.com`,
      githubUsername: username,
      handCashHandle: `$${username}`,
      portfolio: `https://${username}.dev`,
      expertise: ['Technical Writing', 'Blockchain', 'API Documentation'],
      joinedDate: '2024-01-15',
      totalOffers: 5,
      completedProjects: 23,
      rating: 4.8
    };

    setAuthorProfile(mockProfile);

    // Load offers from localStorage or mock data
    const storedOffers = JSON.parse(localStorage.getItem('writing_offers') || '[]');
    const userOffers = storedOffers.filter((offer: WritingOffer) => 
      offer.githubUsername === username || offer.authorName.toLowerCase() === username.toLowerCase()
    );

    // If no stored offers, create some mock ones for demonstration
    if (userOffers.length === 0) {
      const mockOffers: WritingOffer[] = [
        {
          id: `${username}_offer_1`,
          title: "I will write a comprehensive blockchain whitepaper",
          description: "I'll create a detailed, professional whitepaper for your blockchain project including technical architecture, tokenomics, and market analysis. Perfect for ICOs, DeFi projects, or enterprise blockchain solutions.",
          category: "White Papers",
          deliverables: ["Written Document", "Research & Sources", "Revisions Included", "Executive Summary"],
          timeline: "2 weeks",
          priceInBWRITER: "15000",
          authorName: mockProfile.name,
          authorEmail: mockProfile.email,
          githubUsername: username,
          handCashHandle: mockProfile.handCashHandle,
          samples: "Previous whitepapers: Bitcoin SV Enterprise Guide, DeFi Protocol Analysis",
          expertise: ["Technical Writing", "Blockchain"],
          createdAt: new Date().toISOString(),
          status: "active"
        },
        {
          id: `${username}_offer_2`,
          title: "I will create complete API documentation for your project",
          description: "Comprehensive API documentation including endpoint descriptions, code examples in multiple languages, authentication guides, and integration tutorials. Perfect for developer-focused products.",
          category: "API Documentation",
          deliverables: ["Written Document", "Research & Sources", "Revisions Included"],
          timeline: "1 week",
          priceInBWRITER: "8000",
          authorName: mockProfile.name,
          authorEmail: mockProfile.email,
          githubUsername: username,
          handCashHandle: mockProfile.handCashHandle,
          samples: "API docs for major exchanges and blockchain platforms",
          expertise: ["API Documentation", "Technical Writing"],
          createdAt: new Date().toISOString(),
          status: "active"
        }
      ];

      setAuthorOffers(mockOffers);
    } else {
      setAuthorOffers(userOffers);
    }
  };

  const categories = ['all', 'Technical Writing', 'API Documentation', 'White Papers', 'Marketing Copy', 'Blog Posts'];

  const filteredOffers = selectedCategory === 'all' 
    ? authorOffers 
    : authorOffers.filter(offer => offer.category === selectedCategory);

  const handlePurchaseOffer = (offerId: string) => {
    alert(`Purchasing offer ${offerId}! Integration with payment system coming soon.`);
  };

  if (!authorProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-wrapper">
      <div className={`author-profile-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        
        {/* Author Profile Header */}
        <div className="author-profile-header">
          <div className="author-info-section">
            <div className="author-avatar">
              {authorProfile.name.charAt(0)}
            </div>
            <div className="author-details">
              <h1>{authorProfile.name}</h1>
              <p className="author-username">@{authorProfile.username}</p>
              <p className="author-bio">{authorProfile.bio}</p>
              
              <div className="author-stats">
                <div className="stat">
                  <span className="stat-number">{authorProfile.totalOffers}</span>
                  <span className="stat-label">Active Offers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{authorProfile.completedProjects}</span>
                  <span className="stat-label">Completed</span>
                </div>
                <div className="stat">
                  <span className="stat-number">⭐ {authorProfile.rating}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>

              <div className="author-expertise">
                {authorProfile.expertise.map((skill, index) => (
                  <span key={index} className="expertise-tag">{skill}</span>
                ))}
              </div>

              <div className="author-contact">
                <div className="contact-info">
                  <span>📧 {authorProfile.email}</span>
                  <span>💼 {authorProfile.portfolio}</span>
                  <span>💰 {authorProfile.handCashHandle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="author-profile-container">
          {/* Filters */}
          <div className="offers-filters">
            <h2>Writing Offers</h2>
            <div className="category-filter">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-button ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'all' ? 'All Offers' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Offers Grid */}
          <div className="offers-grid">
            {filteredOffers.length === 0 ? (
              <div className="no-offers">
                <h3>No offers available</h3>
                <p>This author hasn't created any offers in this category yet.</p>
              </div>
            ) : (
              filteredOffers.map(offer => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-header">
                    <h3>{offer.title}</h3>
                    <div className="offer-category">{offer.category}</div>
                  </div>

                  <p className="offer-description">{offer.description}</p>

                  <div className="offer-deliverables">
                    <h4>What you'll get:</h4>
                    <ul>
                      {offer.deliverables.map((deliverable, index) => (
                        <li key={index}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="offer-timeline">
                    <span>⏰ Delivery: {offer.timeline}</span>
                  </div>

                  <div className="offer-footer">
                    <div className="offer-price">
                      {parseInt(offer.priceInBWRITER).toLocaleString()} $BWRITER
                    </div>
                    <button 
                      type="button"
                      className="purchase-button"
                      onClick={() => handlePurchaseOffer(offer.id)}
                    >
                      Purchase Offer →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfilePage;