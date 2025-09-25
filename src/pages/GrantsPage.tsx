import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flower2, DollarSign, Cpu, GraduationCap, Users, Wrench, Zap } from 'lucide-react';
import './GrantsPage.css';
import Footer from '../components/Footer';

const GrantsPage: React.FC = () => {
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    return saved === 'true';
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  return (
    <div className="App">
      <div className={`grants-page ${!isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${!isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="grants-container">
          {/* Hero Section */}
          <section className="grants-hero">
            <div className="tulip-hero-icon">
              <Flower2 size={64} />
            </div>
            <h1>Bitcoin Writer <span style={{color: '#FF6B35'}}>Grants</span></h1>
            <p className="grants-tagline">
              $BWRITER token awards for quality submissions, plus public discovery platform for independent Tulip funding
            </p>
            <div className="grants-badge">DUAL FUNDING PLATFORM</div>
          </section>

          {/* Dual System Section */}
          <section className="mission-section">
            <h2>Two Paths to Funding</h2>
            <div className="mission-content">
              <p className="mission-statement">
                Bitcoin Writer creates <strong>a unique funding ecosystem</strong> where quality work gets recognized through 
                $BWRITER token awards and becomes discoverable for potential independent Tulip funding:
              </p>
              
              <div className="mission-pillars">
                <div className="pillar">
                  <div className="pillar-icon"><DollarSign size={32} /></div>
                  <h3>Bitcoin Writer Curation</h3>
                  <p><strong>$BWRITER token awards for quality work</strong><br/>
                  We review submissions and award $BWRITER tokens to exceptional proposals, signaling their quality to the broader ecosystem.</p>
                </div>
                <div className="pillar">
                  <div className="pillar-icon"><Flower2 size={32} /></div>
                  <h3>Public Discovery Platform</h3>
                  <p><strong>Tulip funding through public discovery</strong><br/>
                  All submissions become publicly viewable with funding addresses, enabling direct discovery and independent Tulip funding.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Focus Areas */}
          <section className="focus-section">
            <h2>Focus Areas for Both Programs</h2>
            <div className="focus-content">
              <p className="focus-intro">
                Our platform showcases exceptional work across key innovation areas. Bitcoin Writer awards $BWRITER tokens 
                to signal quality, while independent Tulip funding can discover and support projects that align with their values:
              </p>
              
              <div className="focus-areas">
                <div className="focus-area">
                  <div className="focus-area-icon"><Wrench size={24} /></div>
                  <h4>Bitcoin Writer Platform Development</h4>
                  <ul>
                    <li>Enhance functionality and user experience</li>
                    <li>Create innovative content monetization features</li>
                    <li>Develop educational tools and resources</li>
                    <li>Build integrations with other BSV applications</li>
                  </ul>
                  <div style={{marginTop: '10px', fontSize: '12px', color: '#FF6B35'}}>
                    Bitcoin Writer awards $BWRITER for platform improvements
                  </div>
                </div>
                
                <div className="focus-area">
                  <div className="focus-area-icon"><Zap size={24} /></div>
                  <h4>BSV Ecosystem Infrastructure</h4>
                  <ul>
                    <li>Demonstrate real-world blockchain applications</li>
                    <li>Create developer tools and infrastructure</li>
                    <li>Research scalability and efficiency improvements</li>
                    <li>Build bridges to traditional industries</li>
                  </ul>
                  <div style={{marginTop: '10px', fontSize: '12px', color: '#FF6B35'}}>
                    Tulip funding may support infrastructure projects independently
                  </div>
                </div>
                
                <div className="focus-area">
                  <div className="focus-area-icon"><GraduationCap size={24} /></div>
                  <h4>STEM Education & Research</h4>
                  <ul>
                    <li>Develop interactive STEM learning platforms</li>
                    <li>Create open educational resources</li>
                    <li>Build tools for educators and researchers</li>
                    <li>Enable new forms of academic publishing</li>
                  </ul>
                  <div style={{marginTop: '10px', fontSize: '12px', color: '#FF6B35'}}>
                    $BWRITER curation signals attract Tulip funding attention
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Grant Categories */}
          <section className="categories-section">
            <h2>Apply by Role</h2>
            <p className="categories-intro">
              Choose your application path below. Submit your proposal as a public .nft file, compete for $BWRITER token awards, 
              and become discoverable for potential independent Tulip funding:
            </p>
            
            <div className="categories-grid">
              <Link to="/developers/grants" className="category-card developer-card">
                <div className="category-header">
                  <h3><Cpu size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Developer Grants</h3>
                  <div className="category-badge">APPLY NOW</div>
                </div>
                <p>
                  Building the infrastructure, tools, and applications that power the future of decentralized technology.
                </p>
                <div className="category-details">
                  <div className="detail">Infrastructure Development</div>
                  <div className="detail">Protocol Innovation</div>
                  <div className="detail">Developer Tooling</div>
                  <div className="detail">Research Projects</div>
                </div>
                <div className="category-cta">View Developer Opportunities →</div>
              </Link>

              <Link to="/authors/grants" className="category-card author-card">
                <div className="category-header">
                  <h3><Users size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Author Grants</h3>
                  <div className="category-badge">APPLY NOW</div>
                </div>
                <p>
                  Creating educational content, documentation, and research that advances knowledge and understanding.
                </p>
                <div className="category-details">
                  <div className="detail">Educational Content</div>
                  <div className="detail">Technical Documentation</div>
                  <div className="detail">Research Publications</div>
                  <div className="detail">Learning Resources</div>
                </div>
                <div className="category-cta">View Writing Opportunities →</div>
              </Link>

              <Link to="/publishers/grants" className="category-card publisher-card">
                <div className="category-header">
                  <h3><Flower2 size={20} style={{marginRight: '8px', verticalAlign: 'middle'}} />Publisher Grants</h3>
                  <div className="category-badge">APPLY NOW</div>
                </div>
                <p>
                  Scaling platforms, distribution networks, and publishing infrastructure for the decentralized future.
                </p>
                <div className="category-details">
                  <div className="detail">Platform Development</div>
                  <div className="detail">Content Distribution</div>
                  <div className="detail">Publishing Innovation</div>
                  <div className="detail">Infrastructure Scaling</div>
                </div>
                <div className="category-cta">View Publisher Opportunities →</div>
              </Link>
            </div>
          </section>

          {/* Impact Section */}
          <section className="impact-section">
            <h2>Creating Lasting Impact</h2>
            <div className="impact-content">
              <p>
                The Tulip Trust believes in nurturing ideas that bloom into transformative technologies and educational 
                resources. Their grants support projects that:
              </p>
              
              <div className="impact-points">
                <div className="impact-point">
                  <div className="impact-point-icon"><Flower2 size={24} /></div>
                  <h4>Plant Seeds of Innovation</h4>
                  <p>Support early-stage research and development that could reshape entire industries</p>
                </div>
                <div className="impact-point">
                  <div className="impact-point-icon"><Zap size={24} /></div>
                  <h4>Foster Growth</h4>
                  <p>Provide resources and mentorship to help promising projects reach their full potential</p>
                </div>
                <div className="impact-point">
                  <div className="impact-point-icon"><GraduationCap size={24} /></div>
                  <h4>Enable Flourishing</h4>
                  <p>Create sustainable ecosystems where innovation, education, and collaboration thrive</p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="cta-section">
            <div className="cta-content">
              <Flower2 size={48} />
              <h2>Ready to Make Your Mark?</h2>
              <p>
                Apply through Bitcoin Writer to join the Tulip Trust's mission of building a more educated, innovative, and connected world. 
                Whether you're a developer pushing technical boundaries, an author sharing knowledge, or a publisher scaling platforms—
                submit your proposal for grant consideration.
              </p>
              <div className="cta-buttons">
                <Link to="/developers/grants" className="cta-button developer">
                  Apply as Developer
                </Link>
                <Link to="/authors/grants" className="cta-button author">
                  Apply as Author
                </Link>
                <Link to="/publishers/grants" className="cta-button publisher">
                  Apply as Publisher
                </Link>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <section className="footer-note">
            <p>
              <strong>Note:</strong> Bitcoin Writer awards direct grants in $BWRITER tokens and also serves as an application 
              portal for the independent Tulip Trust (BSV funding). Each application form will guide you through both 
              funding options. Applications are reviewed on a rolling basis, with priority given to projects that demonstrate 
              clear potential for advancing STEM education, BSV blockchain technology, and decentralized publishing.
            </p>
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default GrantsPage;