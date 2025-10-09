import React, { useState, useEffect } from 'react';
import { BlockchainDocumentService } from '../services/BlockchainDocumentService';
import './GigQueueView.css';

interface WritingJob {
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
  onAcceptGig: (job: WritingJob) => void;
}

const GigQueueView: React.FC<GigQueueViewProps> = ({
  documentService,
  isAuthenticated,
  onAcceptGig
}) => {
  const [jobs, setJobs] = useState<WritingJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<WritingJob | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'my-jobs'>('available');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      // Mock data for now - this would come from blockchain/API
      const mockJobs: WritingJob[] = [
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
      let filteredJobs = mockJobs;
      if (filter === 'available') {
        filteredJobs = mockJobs.filter(j => j.status === 'available');
      } else if (filter === 'my-jobs') {
        filteredJobs = mockJobs.filter(j => j.status === 'accepted');
      }

      setJobs(filteredJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCompensation = (comp: WritingJob['compensation']) => {
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

  const handleAcceptJob = (job: WritingJob) => {
    if (!isAuthenticated) {
      alert('Please sign in to accept jobs');
      return;
    }
    
    // Show confirmation
    if (window.confirm(`Accept job: "${job.title}"?\n\nCompensation: ${formatCompensation(job.compensation)}\nDeadline: ${formatDeadline(job.deadline)}`)) {
      onAcceptGig(job);
      setSelectedJob(null);
    }
  };

  return (
    <div className="gig-queue-container">
      <div className="gig-filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Jobs
        </button>
        <button 
          className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
          onClick={() => setFilter('available')}
        >
          Available
        </button>
        <button 
          className={`filter-btn ${filter === 'my-jobs' ? 'active' : ''}`}
          onClick={() => setFilter('my-jobs')}
        >
          My Jobs
        </button>
      </div>

      {isLoading ? (
        <div className="gig-loading">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="gig-empty">
          No jobs available at the moment. Check back later!
        </div>
      ) : (
        <div className="gig-list">
          {jobs.map(job => (
            <div 
              key={job.id} 
              className={`gig-item ${selectedJob?.id === job.id ? 'selected' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <div className="gig-header">
                <h4 className="gig-title">{job.title}</h4>
                <span className="gig-compensation">{formatCompensation(job.compensation)}</span>
              </div>
              
              <div className="gig-meta">
                <span className="gig-publisher">📢 {job.publisher}</span>
                <span className="gig-deadline">⏰ {formatDeadline(job.deadline)}</span>
                <span className="gig-words">📝 {job.wordCount.min}-{job.wordCount.max} words</span>
              </div>

              {selectedJob?.id === job.id && (
                <div className="gig-details">
                  <p className="gig-description">{job.description}</p>
                  
                  <div className="gig-topics">
                    <strong>Topics:</strong>
                    <div className="topic-tags">
                      {job.topics.map(topic => (
                        <span key={topic} className="topic-tag">{topic}</span>
                      ))}
                    </div>
                  </div>

                  <div className="gig-requirements">
                    <strong>Requirements:</strong>
                    <ul>
                      {job.requirements.map((req, idx) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="gig-actions">
                    <button 
                      className="accept-gig-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptJob(job);
                      }}
                    >
                      Accept Job
                    </button>
                    <button 
                      className="details-close-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedJob(null);
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