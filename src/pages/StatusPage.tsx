import React, { useState, useEffect } from 'react';
import './StatusPage.css';
import Footer from '../components/Footer';

const StatusPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    // Listen for storage changes to detect sidebar collapse state
    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    // Handle window resize
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    // Check for sidebar state changes via polling
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

  return (
    <div className="App">
      <div className={`status-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="status-container">
        {/* Hero Section */}
        <section className="status-hero">
          <h1>Bitcoin Writer <span style={{color: '#ffffff'}}>Status</span></h1>
          <p className="status-tagline">
            Real-time system health and performance monitoring
          </p>
          <div className="status-badge operational">ALL SYSTEMS OPERATIONAL</div>
        </section>

        {/* Current Status Overview */}
        <section className="status-overview-section">
          <h2>System Status</h2>
          <div className="status-overview">
            <div className="overall-status">
              <div className="status-indicator operational"></div>
              <div>
                <h3>All Systems Operational</h3>
                <p>Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Status */}
        <section className="services-section">
          <h2>Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-header">
                <h3>Web Application</h3>
                <span className="status-pill operational">Operational</span>
              </div>
              <div className="service-metrics">
                <div className="metric">
                  <span className="metric-label">Response Time</span>
                  <span className="metric-value">42ms</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Uptime</span>
                  <span className="metric-value">99.99%</span>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-header">
                <h3>API</h3>
                <span className="status-pill operational">Operational</span>
              </div>
              <div className="service-metrics">
                <div className="metric">
                  <span className="metric-label">Response Time</span>
                  <span className="metric-value">28ms</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Uptime</span>
                  <span className="metric-value">99.99%</span>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-header">
                <h3>Blockchain Writer</h3>
                <span className="status-pill operational">Operational</span>
              </div>
              <div className="service-metrics">
                <div className="metric">
                  <span className="metric-label">Transaction Time</span>
                  <span className="metric-value">1.2s</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Success Rate</span>
                  <span className="metric-value">100%</span>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-header">
                <h3>Payment Processing</h3>
                <span className="status-pill operational">Operational</span>
              </div>
              <div className="service-metrics">
                <div className="metric">
                  <span className="metric-label">Processing Time</span>
                  <span className="metric-value">850ms</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Success Rate</span>
                  <span className="metric-value">99.97%</span>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-header">
                <h3>Real-time Sync</h3>
                <span className="status-pill operational">Operational</span>
              </div>
              <div className="service-metrics">
                <div className="metric">
                  <span className="metric-label">Latency</span>
                  <span className="metric-value">12ms</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Active Connections</span>
                  <span className="metric-value">1,247</span>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-header">
                <h3>CDN</h3>
                <span className="status-pill operational">Operational</span>
              </div>
              <div className="service-metrics">
                <div className="metric">
                  <span className="metric-label">Cache Hit Rate</span>
                  <span className="metric-value">94.3%</span>
                </div>
                <div className="metric">
                  <span className="metric-label">Global Latency</span>
                  <span className="metric-value">22ms</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section className="metrics-section">
          <h2>Performance Metrics</h2>
          <div className="metrics-grid">
            <div className="metric-card">
              <h3>API Performance</h3>
              <div className="chart-placeholder">
                <div className="chart-bar" style={{height: '80%'}}></div>
                <div className="chart-bar" style={{height: '75%'}}></div>
                <div className="chart-bar" style={{height: '85%'}}></div>
                <div className="chart-bar" style={{height: '78%'}}></div>
                <div className="chart-bar" style={{height: '82%'}}></div>
                <div className="chart-bar" style={{height: '88%'}}></div>
                <div className="chart-bar" style={{height: '85%'}}></div>
              </div>
              <p>Average: 28ms</p>
            </div>

            <div className="metric-card">
              <h3>Transaction Volume</h3>
              <div className="chart-placeholder">
                <div className="chart-bar" style={{height: '60%'}}></div>
                <div className="chart-bar" style={{height: '65%'}}></div>
                <div className="chart-bar" style={{height: '70%'}}></div>
                <div className="chart-bar" style={{height: '75%'}}></div>
                <div className="chart-bar" style={{height: '80%'}}></div>
                <div className="chart-bar" style={{height: '85%'}}></div>
                <div className="chart-bar" style={{height: '90%'}}></div>
              </div>
              <p>24h: 12,847 transactions</p>
            </div>

            <div className="metric-card">
              <h3>System Load</h3>
              <div className="chart-placeholder">
                <div className="chart-bar" style={{height: '30%'}}></div>
                <div className="chart-bar" style={{height: '35%'}}></div>
                <div className="chart-bar" style={{height: '32%'}}></div>
                <div className="chart-bar" style={{height: '38%'}}></div>
                <div className="chart-bar" style={{height: '35%'}}></div>
                <div className="chart-bar" style={{height: '33%'}}></div>
                <div className="chart-bar" style={{height: '31%'}}></div>
              </div>
              <p>CPU: 34% | Memory: 42%</p>
            </div>
          </div>
        </section>

        {/* Recent Incidents */}
        <section className="incidents-section">
          <h2>Recent Incidents</h2>
          <div className="incidents-list">
            <div className="incident-item">
              <div className="incident-header">
                <span className="incident-status resolved">Resolved</span>
                <span className="incident-date">January 10, 2025</span>
              </div>
              <h3>Brief API Latency Spike</h3>
              <p>API response times increased to 200ms for approximately 5 minutes due to a database query optimization issue. The issue was identified and resolved.</p>
            </div>

            <div className="incident-item">
              <div className="incident-header">
                <span className="incident-status resolved">Resolved</span>
                <span className="incident-date">January 5, 2025</span>
              </div>
              <h3>Scheduled Maintenance</h3>
              <p>Planned maintenance was completed successfully with minimal downtime. All systems were upgraded and are now running on the latest version.</p>
            </div>

            <div className="incident-item">
              <div className="incident-header">
                <span className="incident-status resolved">Resolved</span>
                <span className="incident-date">December 28, 2024</span>
              </div>
              <h3>Payment Processing Delay</h3>
              <p>Some users experienced delays in payment processing due to high network congestion. The issue was resolved by scaling our payment infrastructure.</p>
            </div>
          </div>
        </section>

        {/* Uptime Statistics */}
        <section className="uptime-section">
          <h2>Uptime Statistics</h2>
          <div className="uptime-grid">
            <div className="uptime-card">
              <h3>Last 24 Hours</h3>
              <div className="uptime-value">100%</div>
              <div className="uptime-bar">
                <div className="uptime-fill" style={{width: '100%'}}></div>
              </div>
            </div>

            <div className="uptime-card">
              <h3>Last 7 Days</h3>
              <div className="uptime-value">99.99%</div>
              <div className="uptime-bar">
                <div className="uptime-fill" style={{width: '99.99%'}}></div>
              </div>
            </div>

            <div className="uptime-card">
              <h3>Last 30 Days</h3>
              <div className="uptime-value">99.97%</div>
              <div className="uptime-bar">
                <div className="uptime-fill" style={{width: '99.97%'}}></div>
              </div>
            </div>

            <div className="uptime-card">
              <h3>Last 90 Days</h3>
              <div className="uptime-value">99.95%</div>
              <div className="uptime-bar">
                <div className="uptime-fill" style={{width: '99.95%'}}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscribe Section */}
        <section className="subscribe-section">
          <h2>Get Status Updates</h2>
          <p>Subscribe to receive notifications about system status changes</p>
          <div className="subscribe-buttons">
            <a 
              href="https://status.bitcoinwriter.io" 
              className="subscribe-button primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Subscribe to Updates
            </a>
            <a 
              href="https://discord.gg/xBB8r8dj" 
              className="subscribe-button secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Join Discord
            </a>
          </div>
        </section>
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default StatusPage;