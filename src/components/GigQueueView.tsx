import React, { useState, useEffect } from 'react';
import { BlockchainDocumentService } from '../services/BlockchainDocumentService';
import './GigQueueView.css';

interface WritingGig {
  id: string;
  title: string;
  description: string;
  publisher: string;
  wordCount: {
    min: number;
    max: number;
  };
  compensation: {
    amount: number;
    currency: 'BSV' | 'USD' | 'TOKENS';
    symbol?: string;
  };
  deadline: string;
  topics: string[];
  requirements: string[];
  status: 'available' | 'accepted' | 'completed' | 'expired';
  publishedAt: string;
}

interface GigQueueViewProps {
  documentService: BlockchainDocumentService | null;
  isAuthenticated: boolean;
  onAcceptGig: (gig: WritingGig) => void;
}

const GigQueueView: React.FC<GigQueueViewProps> = ({
  documentService,
  isAuthenticated,
  onAcceptGig
}) => {
  const [gigs, setGigs] = useState<WritingGig[]>([]);
  const [selectedGig, setSelectedGig] = useState<WritingGig | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'my-gigs'>('available');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadGigs();
  }, [filter]);

  const loadGigs = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - this would come from blockchain/API
      const mockGigs: WritingGig[] = [
        {
          id: '1',
          title: 'Bitcoin Mining Article',
          description: 'Write a comprehensive guide on Bitcoin mining for beginners, covering hardware requirements, profitability calculations, and environmental considerations.',
          publisher: 'CryptoMag',
          wordCount: { min: 1500, max: 2000 },
          compensation: { amount: 0.005, currency: 'BSV' },
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          topics: ['Bitcoin', 'Mining', 'Technology'],
          requirements: ['Technical knowledge', 'Clear explanations', 'Original content'],
          status: 'available',
          publishedAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'DeFi Protocol Review',
          description: 'Review and analyze a new DeFi protocol, explaining its mechanics, risks, and potential returns.',
          publisher: 'DeFi Daily',
          wordCount: { min: 800, max: 1200 },
          compensation: { amount: 50, currency: 'USD' },
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          topics: ['DeFi', 'Finance', 'Blockchain'],
          requirements: ['Financial background', 'Risk analysis', 'Neutral tone'],
          status: 'available',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: 'NFT Market Analysis',
          description: 'Analyze current NFT market trends, including sales data, popular collections, and future predictions.',
          publisher: 'Digital Art Weekly',
          wordCount: { min: 2000, max: 2500 },
          compensation: { amount: 100, currency: 'TOKENS', symbol: 'DAW' },
          deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          topics: ['NFTs', 'Digital Art', 'Markets'],
          requirements: ['Data analysis', 'Chart creation', 'Market research'],
          status: 'available',
          publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        }
      ];

      // Filter based on selected filter
      let filteredGigs = mockGigs;
      if (filter === 'available') {
        filteredGigs = mockGigs.filter(g => g.status === 'available');
      } else if (filter === 'my-gigs') {
        filteredGigs = mockGigs.filter(g => g.status === 'accepted');
      }

      setGigs(filteredGigs);
    } catch (error) {
      console.error('Failed to load gigs:', error);
      setGigs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCompensation = (comp: WritingGig['compensation']) => {
    if (comp.currency === 'USD') {
      return `$${comp.amount}`;
    } else if (comp.currency === 'BSV') {
      return `${comp.amount} BSV`;
    } else {
      return `${comp.amount} ${comp.symbol || comp.currency}`;
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days < 0) return 'Expired';
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  const handleAcceptGig = (gig: WritingGig) => {
    if (!isAuthenticated) {
      alert('Please sign in to accept gigs');
      return;
    }
    
    // Show confirmation
    if (window.confirm(`Accept gig: "${gig.title}"?\n\nCompensation: ${formatCompensation(gig.compensation)}\nDeadline: ${formatDeadline(gig.deadline)}`)) {
      onAcceptGig(gig);
      setSelectedGig(null);
    }
  };

  return (
    <div className="gig-queue-container">
      <div className="gig-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Gigs
        </button>
        <button 
          className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
          onClick={() => setFilter('available')}
        >
          Available
        </button>
        <button 
          className={`filter-btn ${filter === 'my-gigs' ? 'active' : ''}`}
          onClick={() => setFilter('my-gigs')}
        >
          My Gigs
        </button>
      </div>

      {isLoading ? (
        <div className="gig-loading">Loading gigs...</div>
      ) : gigs.length === 0 ? (
        <div className="gig-empty">
          No gigs available at the moment. Check back later!
        </div>
      ) : (
        <div className="gig-list">
          {gigs.map(gig => (
            <div 
              key={gig.id} 
              className={`gig-item ${selectedGig?.id === gig.id ? 'selected' : ''}`}
              onClick={() => setSelectedGig(gig)}
            >
              <div className="gig-header">
                <h4 className="gig-title">{gig.title}</h4>
                <span className="gig-compensation">{formatCompensation(gig.compensation)}</span>
              </div>
              
              <div className="gig-meta">
                <span className="gig-publisher">📢 {gig.publisher}</span>
                <span className="gig-deadline">⏰ {formatDeadline(gig.deadline)}</span>
                <span className="gig-words">📝 {gig.wordCount.min}-{gig.wordCount.max} words</span>
              </div>

              {selectedGig?.id === gig.id && (
                <div className="gig-details">
                  <p className="gig-description">{gig.description}</p>
                  
                  <div className="gig-topics">
                    <strong>Topics:</strong>
                    <div className="topic-tags">
                      {gig.topics.map(topic => (
                        <span key={topic} className="topic-tag">{topic}</span>
                      ))}
                    </div>
                  </div>

                  <div className="gig-requirements">
                    <strong>Requirements:</strong>
                    <ul>
                      {gig.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="gig-actions">
                    <button 
                      className="accept-gig-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptGig(gig);
                      }}
                    >
                      Accept Gig
                    </button>
                    <button 
                      className="details-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedGig(null);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GigQueueView;