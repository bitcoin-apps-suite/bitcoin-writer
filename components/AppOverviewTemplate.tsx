import React from 'react';
import './AppOverviewTemplate.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface AppOverviewProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  features: Feature[];
  useCases?: string[];
  technicalSpecs?: string[];
  roadmap?: string[];
}

const AppOverviewTemplate: React.FC<AppOverviewProps> = ({
  isOpen,
  onClose,
  appName,
  tagline,
  description,
  icon,
  color,
  features,
  useCases = [],
  technicalSpecs = [],
  roadmap = []
}) => {
  if (!isOpen) return null;

  return (
    <div className="app-overview">
      <div className="app-overview-header" style={{ borderBottomColor: color }}>
        <div className="app-header-content">
          <span className="app-icon-large" style={{ background: `${color}20` }}>
            {icon}
          </span>
          <div className="app-title-section">
            <h1>₿ {appName}</h1>
            <p className="app-tagline">{tagline}</p>
          </div>
        </div>
        <button className="overview-close" onClick={onClose} title={`Close ${appName}`}>
          ×
        </button>
      </div>

      <div className="app-overview-content">
        <section className="overview-section hero-section" style={{ borderLeftColor: color }}>
          <h2>Overview</h2>
          <p>{description}</p>
        </section>

        <section className="overview-section features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {useCases.length > 0 && (
          <section className="overview-section">
            <h2>Use Cases</h2>
            <ul className="use-cases-list">
              {useCases.map((useCase, index) => (
                <li key={index}>{useCase}</li>
              ))}
            </ul>
          </section>
        )}

        {technicalSpecs.length > 0 && (
          <section className="overview-section">
            <h2>Technical Specifications</h2>
            <div className="tech-specs">
              {technicalSpecs.map((spec, index) => (
                <div key={index} className="tech-spec-item">
                  <span className="spec-bullet" style={{ background: color }}>•</span>
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {roadmap.length > 0 && (
          <section className="overview-section">
            <h2>Development Roadmap</h2>
            <div className="roadmap-timeline">
              {roadmap.map((milestone, index) => (
                <div key={index} className="roadmap-item">
                  <div className="roadmap-marker" style={{ background: color }}></div>
                  <div className="roadmap-content">
                    <p>{milestone}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="overview-section status-section">
          <div className="status-card coming-soon">
            <h3>🚧 Coming Soon</h3>
            <p>This application is currently under development. Join our community to stay updated on the launch!</p>
          </div>
        </section>

        <footer className="overview-footer">
          <p>Built on Bitcoin SV | <strong>Scaling without limits</strong></p>
        </footer>
      </div>
    </div>
  );
};

export default AppOverviewTemplate;