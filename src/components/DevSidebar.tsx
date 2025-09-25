import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Code, 
  GitBranch, 
  Bug, 
  FileText, 
  DollarSign, 
  Users, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Zap,
  Package,
  Terminal,
  Activity
} from 'lucide-react';
import './DevSidebar.css';

interface DevSidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

const DevSidebar: React.FC<DevSidebarProps> = ({ onCollapsedChange }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('devSidebarCollapsed');
    // Default to collapsed if no preference is saved
    return saved !== null ? saved === 'true' : true;
  });
  const [issueCount, setIssueCount] = useState<number>(0);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('devSidebarCollapsed', isCollapsed.toString());
    onCollapsedChange?.(isCollapsed);
  }, [isCollapsed, onCollapsedChange]);

  useEffect(() => {
    // Fetch GitHub issue count
    fetch('https://api.github.com/repos/bitcoin-apps-suite/bitcoin-writer/issues?state=open')
      .then(res => res.json())
      .then(issues => setIssueCount(Array.isArray(issues) ? issues.length : 0))
      .catch(() => setIssueCount(0));
  }, []);

  const menuItems: Array<{
    path?: string;
    icon?: any;
    label?: string;
    badge?: string;
    divider?: boolean;
    external?: boolean;
  }> = [
    { path: '/tasks', icon: Terminal, label: 'Tasks', badge: issueCount > 0 ? String(issueCount) : '0' },
    { path: '/contracts', icon: FileText, label: 'Contracts', badge: issueCount > 0 ? String(issueCount) : '0' },
    { path: '/contributions', icon: Users, label: 'Contributors', badge: '2' },
    { path: '/docs', icon: BookOpen, label: 'Documentation' },
    { path: '/token', icon: DollarSign, label: '$BWRITER', badge: 'NEW' },
    { divider: true },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-writer', icon: GitBranch, label: 'GitHub', external: true },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues', icon: Bug, label: 'Issues', external: true, badge: issueCount > 0 ? String(issueCount) : undefined },
    { path: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/pulls', icon: Code, label: 'Pull Requests', external: true },
    { divider: true },
    { path: '/api', icon: Package, label: 'API Reference' },
    { path: '/changelog', icon: FileText, label: 'Changelog' },
    { path: '/status', icon: Activity, label: 'Status', badge: '🟢' }
  ];

  const stats = {
    totalTokens: '1,000,000,000',
    distributed: '650,000',
    contributors: '2',
    openTasks: '30+'
  };

  return (
    <div className={`dev-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="dev-sidebar-header">
        {!isCollapsed && (
          <div className="dev-sidebar-title">
            <Zap className="dev-sidebar-logo" />
            <span>Developer Hub</span>
          </div>
        )}
        <button 
          className="dev-sidebar-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="dev-sidebar-nav">
        {menuItems.map((item, index) => {
          if (item.divider) {
            return <div key={index} className="dev-sidebar-divider" />;
          }

          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          if (item.external) {
            return (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className={`dev-sidebar-item ${isActive ? 'active' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon size={20} />
                {!isCollapsed && (
                  <>
                    <span className="dev-sidebar-label">{item.label}</span>
                    {item.badge && <span className="dev-sidebar-badge">{item.badge}</span>}
                  </>
                )}
              </a>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path || '/'}
              className={`dev-sidebar-item ${isActive ? 'active' : ''}`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={20} />
              {!isCollapsed && (
                <>
                  <span className="dev-sidebar-label">{item.label}</span>
                  {item.badge && <span className="dev-sidebar-badge">{item.badge}</span>}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="dev-sidebar-stats">
          <h4>Token Stats</h4>
          <div className="dev-stat">
            <span className="dev-stat-label">Total Supply</span>
            <span className="dev-stat-value">{stats.totalTokens}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Distributed</span>
            <span className="dev-stat-value">{stats.distributed}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Contributors</span>
            <span className="dev-stat-value">{stats.contributors}</span>
          </div>
          <div className="dev-stat">
            <span className="dev-stat-label">Open Tasks</span>
            <span className="dev-stat-value">{stats.openTasks}</span>
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div className="dev-sidebar-footer">
          <div className="dev-sidebar-cta">
            <p>Start Contributing</p>
            <Link to="/tasks" className="dev-sidebar-cta-button">
              View Tasks
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevSidebar;