'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  ExternalLink,
  Code,
  PenTool,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Wallet,
  RefreshCw
} from 'lucide-react';
import './gallery.css';

interface Grant {
  id: string;
  type: 'developer' | 'author' | 'publisher';
  title: string;
  description: string;
  tokenReward: number;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
}

interface GrantsResponse {
  grants: Grant[];
  total: number;
  hasMore: boolean;
  pagination: {
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
  };
}

export default function GrantsGalleryPage() {
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const ITEMS_PER_PAGE = 12;

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

  useEffect(() => {
    fetchGrants();
  }, [currentPage, typeFilter, statusFilter]);

  const fetchGrants = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: ITEMS_PER_PAGE.toString(),
        offset: ((currentPage - 1) * ITEMS_PER_PAGE).toString()
      });

      if (typeFilter) params.append('type', typeFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/grants/list?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch grants');
      }

      const data: GrantsResponse = await response.json();
      setGrants(data.grants);
      setTotal(data.total);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Error fetching grants:', error);
      setError('Failed to load grants. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredGrants = grants.filter(grant => 
    grant.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grant.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'developer': return <Code size={16} />;
      case 'author': return <PenTool size={16} />;
      case 'publisher': return <Building2 size={16} />;
      default: return <Eye size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'developer': return '#f7931a';
      case 'author': return '#3b82f6';
      case 'publisher': return '#10b981';
      default: return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle size={16} />;
      case 'under_review': return <Clock size={16} />;
      case 'pending': return <Clock size={16} />;
      case 'rejected': return <AlertTriangle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#22c55e';
      case 'under_review': return '#f59e0b';
      case 'pending': return '#6b7280';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTokenAmount = (amount: number) => {
    if (amount === 0) return 'TBD';
    return amount.toLocaleString();
  };

  return (
    <div className="App">
      <div className={`grants-gallery-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="grants-gallery-container">
          {/* Header */}
          <section className="gallery-header">
            <div className="header-content">
              <h1>Grant Discovery Gallery</h1>
              <p>Explore all submitted grant applications. Discover projects seeking funding and connect with innovative builders, writers, and publishers.</p>
              
              <div className="header-stats">
                <div className="stat">
                  <div className="stat-number">{total}</div>
                  <div className="stat-label">Total Applications</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{grants.filter(g => g.status === 'approved').length}</div>
                  <div className="stat-label">Approved Projects</div>
                </div>
                <div className="stat">
                  <div className="stat-number">{grants.filter(g => g.status === 'under_review').length}</div>
                  <div className="stat-label">Under Review</div>
                </div>
              </div>
            </div>
          </section>

          {/* Controls */}
          <section className="gallery-controls">
            <div className="controls-row">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Search grants by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="filters">
                <div className="filter-group">
                  <Filter size={16} />
                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Types</option>
                    <option value="developer">Developer</option>
                    <option value="author">Author</option>
                    <option value="publisher">Publisher</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <button 
                  className="refresh-btn"
                  onClick={fetchGrants}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                </button>
              </div>
            </div>
          </section>

          {/* Results */}
          <section className="gallery-results">
            {loading ? (
              <div className="loading-state">
                <RefreshCw size={32} className="spinning" />
                <p>Loading grants...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <AlertTriangle size={32} />
                <p>{error}</p>
                <button onClick={fetchGrants} className="retry-btn">
                  Try Again
                </button>
              </div>
            ) : filteredGrants.length === 0 ? (
              <div className="empty-state">
                <Eye size={32} />
                <h3>No grants found</h3>
                <p>Try adjusting your search terms or filters</p>
                <Link href="/grants" className="apply-btn">
                  Submit Your Grant Application
                </Link>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <h3>
                    Showing {filteredGrants.length} of {total} grants
                    {searchTerm && ` matching "${searchTerm}"`}
                  </h3>
                </div>

                <div className="grants-grid">
                  {filteredGrants.map((grant) => (
                    <div key={grant.id} className="grant-card">
                      <div className="grant-header">
                        <div className="grant-type" style={{color: getTypeColor(grant.type)}}>
                          {getTypeIcon(grant.type)}
                          <span>{grant.type}</span>
                        </div>
                        <div className="grant-status" style={{color: getStatusColor(grant.status)}}>
                          {getStatusIcon(grant.status)}
                          <span>{grant.status.replace('_', ' ')}</span>
                        </div>
                      </div>

                      <div className="grant-content">
                        <h4 className="grant-title">{grant.title}</h4>
                        <p className="grant-description">{grant.description}</p>
                      </div>

                      <div className="grant-footer">
                        <div className="grant-meta">
                          <div className="meta-item">
                            <Calendar size={14} />
                            <span>{formatDate(grant.submittedAt)}</span>
                          </div>
                          <div className="meta-item">
                            <DollarSign size={14} />
                            <span>{formatTokenAmount(grant.tokenReward)} BWRITER</span>
                          </div>
                        </div>
                        
                        <div className="grant-actions">
                          <button className="view-btn">
                            <Eye size={14} />
                            View Details
                          </button>
                          {grant.status === 'approved' && (
                            <button className="fund-btn">
                              <Wallet size={14} />
                              Fund Project
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="page-btn"
                    >
                      Previous
                    </button>
                    
                    <div className="page-info">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="page-btn"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </section>

          {/* CTA Section */}
          <section className="gallery-cta">
            <div className="cta-content">
              <h2>Have a Project Idea?</h2>
              <p>Submit your own grant application and join the discovery gallery</p>
              <div className="cta-buttons">
                <Link href="/developers/grants" className="cta-btn developer">
                  Apply as Developer
                </Link>
                <Link href="/authors/grants" className="cta-btn author">
                  Apply as Author  
                </Link>
                <Link href="/publishers/grants" className="cta-btn publisher">
                  Apply as Publisher
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}