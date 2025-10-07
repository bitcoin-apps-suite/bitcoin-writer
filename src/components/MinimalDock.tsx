import React, { useState, useEffect, useRef } from 'react';
import { Wallet, Mail, Music, FileText, HardDrive, Calendar, Search, Table, Share2, Briefcase, Store, Wifi, Volume2, Battery, Clock, TrendingUp, Building2, Shield, Video, Code2, Camera, MapPin, MessageCircle, Users, Gamepad2, BookOpen, Globe, Box, MoreHorizontal, Grid3X3 } from 'lucide-react';
import './MinimalDock.css';

interface DockApp {
  id?: string;
  name: string;
  icon: any;
  primaryColor: string;
  secondaryColor: string;
  url?: string;
  disabled?: boolean;
  current?: boolean;
  isImage?: boolean;
}

const MinimalDock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const [showMoreApps, setShowMoreApps] = useState(false);
  const moreAppsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle click outside to close more apps menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreAppsRef.current && !moreAppsRef.current.contains(event.target as Node)) {
        setShowMoreApps(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAppGradient = (primaryColor: string, secondaryColor: string): string => {
    return `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;
  };

  // Core/Most Popular Apps (12 apps - fits nicely in dock)
  const coreApps: DockApp[] = [
    { id: 'bapps-store', name: 'Bitcoin Apps Store', icon: Store, primaryColor: '#f7931a', secondaryColor: '#ff6b35', url: 'https://www.bitcoinapps.store/', isImage: true },
    { name: 'Bitcoin Wallet', icon: Wallet, primaryColor: '#f7931a', secondaryColor: '#fbbf24', url: 'https://bitcoin-wallet-sable.vercel.app' },
    { name: 'Bitcoin Email', icon: Mail, primaryColor: '#ff4444', secondaryColor: '#cc0000', url: 'https://bitcoin-email.vercel.app' },
    { name: 'Bitcoin Music', icon: Music, primaryColor: '#a855f7', secondaryColor: '#ec4899', url: 'https://bitcoin-music.vercel.app' },
    { name: 'Bitcoin Writer', icon: FileText, primaryColor: '#f7931a', secondaryColor: '#1a1a1a', url: 'https://bitcoin-writer.vercel.app', current: true },
    { name: 'Bitcoin Drive', icon: HardDrive, primaryColor: '#22c55e', secondaryColor: '#65a30d', url: 'https://bitcoin-drive.vercel.app' },
    { name: 'Bitcoin Calendar', icon: Calendar, primaryColor: '#1e3a8a', secondaryColor: '#87ceeb', url: 'https://bitcoin-calendar.vercel.app' },
    { name: 'Bitcoin Exchange', icon: TrendingUp, primaryColor: '#f7931a', secondaryColor: '#fbbf24', url: 'https://bitcoin-exchange-iota.vercel.app' },
    { name: 'Bitcoin Search', icon: Search, primaryColor: '#0d9488', secondaryColor: '#00ffff', url: 'https://bitcoin-search.vercel.app' },
    { name: 'Bitcoin Video', icon: Video, primaryColor: '#b91c1c', secondaryColor: '#ff6600', url: 'https://bitcoin-video-nine.vercel.app' },
    { name: 'Bitcoin Chat', icon: MessageCircle, primaryColor: '#7c3aed', secondaryColor: '#dda0dd', url: 'https://bitcoin-chat.vercel.app' },
    { name: 'Bitcoin Jobs', icon: Briefcase, primaryColor: '#1e40af', secondaryColor: '#22c55e', url: 'https://bitcoin-jobs.vercel.app/' },
  ];

  // All Apps (for future use - could be shown in Apps Store or right-click menu)
  const allApps: DockApp[] = [
    ...coreApps,
    { name: 'Bitcoin Code', icon: Code2, primaryColor: '#1e293b', secondaryColor: '#39ff14', url: 'https://bitcoin-code.vercel.app' },
    { name: 'Bitcoin Spreadsheet', icon: Table, primaryColor: '#16a34a', secondaryColor: '#50c878', url: 'https://bitcoin-spreadsheet.vercel.app' },
    { name: 'Bitcoin Photos', icon: Camera, primaryColor: '#4338ca', secondaryColor: '#87ceeb', url: 'https://bitcoin-photos.vercel.app' },
    { name: 'Bitcoin Maps', icon: MapPin, primaryColor: '#059669', secondaryColor: '#0077be', url: 'https://bitcoin-maps.vercel.app' },
    { name: 'Bitcoin Social', icon: Users, primaryColor: '#ec4899', secondaryColor: '#ff69b4', url: 'https://bitcoin-social.vercel.app' },
    { name: 'Bitcoin Games', icon: Gamepad2, primaryColor: '#ea580c', secondaryColor: '#ffff00', url: 'https://bitcoin-gaming.vercel.app' },
    { name: 'Bitcoin Books', icon: BookOpen, primaryColor: '#991b1b', secondaryColor: '#f5f5dc', url: 'https://bitcoin-books-bay.vercel.app' },
    { name: 'Bitcoin Domains', icon: Globe, primaryColor: '#0ea5e9', secondaryColor: '#10b981', url: 'https://bitcoin-dns.vercel.app' },
    { name: 'Bitcoin 3D', icon: Box, primaryColor: '#0f766e', secondaryColor: '#00ff9f', url: 'https://bitcoin-3d.vercel.app' },
    { name: 'Bitcoin AI', icon: Code2, primaryColor: '#7c2d92', secondaryColor: '#0080ff', url: 'https://bitcoin-ai.vercel.app' },
    { name: 'Bitcoin Browser', icon: Globe, primaryColor: '#4285f4', secondaryColor: '#c0c0c0', url: 'https://bitcoin-browser.vercel.app' },
    { name: 'Bitcoin Twitter', icon: MessageCircle, primaryColor: '#1da1f2', secondaryColor: '#add8e6', url: 'https://bitcoin-twitter.vercel.app' },
    { name: 'Bitcoin Art', icon: Camera, primaryColor: '#be185d', secondaryColor: '#ffd700', url: 'https://bitcoin-art.vercel.app' },
    { name: 'Bitcoin Paint', icon: Camera, primaryColor: '#8b5cf6', secondaryColor: '#ff6b35', url: 'https://bitcoin-paint.vercel.app' },
    { name: 'Bitcoin Education', icon: BookOpen, primaryColor: '#1d4ed8', secondaryColor: '#ffffe0', url: 'https://bitcoin-education.vercel.app' },
    { name: 'Bitcoin CRM', icon: Briefcase, primaryColor: '#6b7280', secondaryColor: '#fb923c', url: 'https://bitcoin-crm.vercel.app' },
    { name: 'Bitcoin CMS', icon: FileText, primaryColor: '#3b82f6', secondaryColor: '#ffffff', url: 'https://bitcoin-cms.vercel.app' },
    { name: 'Bitcoin Contracts', icon: FileText, primaryColor: '#1e293b', secondaryColor: '#fbbf24', url: 'https://bitcoin-contracts.vercel.app' },
    { name: 'Bitcoin Shares', icon: TrendingUp, primaryColor: '#15803d', secondaryColor: '#dc2626', url: 'https://bitcoin-shares.vercel.app' },
  ];

  const dockApps = coreApps; // Use core apps in dock

  const handleAppClick = (app: DockApp) => {
    if (!app.disabled && app.url && !app.current) {
      window.location.href = app.url;
    }
  };

  return (
    <div className="bitcoin-dock">
      <div className="dock-container">
        {/* App icons on the left */}
        <div className="dock-apps">
          {dockApps.map((app, index) => {
          const Icon = app.icon;
          return (
            <button
              key={app.name}
              className={`dock-app ${app.current ? 'active' : ''} ${app.disabled ? 'disabled' : ''}`}
              onClick={() => handleAppClick(app)}
              title={app.name}
              disabled={app.disabled}
            >
              {app.id === 'bapps-store' ? (
                <div className="dock-app-icon">
                  <img src="/bapps-icon.jpg" alt="BAPPS" className="dock-app-image" />
                </div>
              ) : (
                <div 
                  className="dock-app-icon-wrapper"
                  style={{
                    background: getAppGradient(app.primaryColor, app.secondaryColor),
                    borderRadius: '12px',
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    boxShadow: `0 4px 12px ${app.primaryColor}40`
                  }}
                >
                  <Icon 
                    className="dock-app-icon" 
                    size={20}
                    style={{ 
                      color: '#ffffff',
                      filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                    }} 
                  />
                </div>
              )}
              {app.current && <span className="dock-indicator" />}
            </button>
          );
        })}
        
        {/* More Apps Button */}
        <div className="dock-divider" />
        <div ref={moreAppsRef} style={{ position: 'relative' }}>
          <button
            className="dock-app"
            onClick={() => setShowMoreApps(!showMoreApps)}
            title="More Apps"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Grid3X3 
              className="dock-app-icon" 
              size={20}
              style={{ 
                color: '#ffffff',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
              }} 
            />
          </button>

          {/* More Apps Menu */}
          {showMoreApps && (
            <div
              style={{
                position: 'absolute',
                bottom: '70px',
                right: '0',
                background: 'rgba(22, 22, 22, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '16px',
                minWidth: '320px',
                maxHeight: '400px',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
                zIndex: 10000
              }}
            >
              <div style={{
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                All Bitcoin Apps
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px'
              }}>
                {allApps.filter(app => !coreApps.some(coreApp => coreApp.name === app.name)).map((app, index) => {
                  const Icon = app.icon;
                  return (
                    <button
                      key={app.name}
                      className="more-app-item"
                      onClick={() => {
                        handleAppClick(app);
                        setShowMoreApps(false);
                      }}
                      title={app.name}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '8px',
                        borderRadius: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        color: '#ffffff'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      <div 
                        style={{
                          background: getAppGradient(app.primaryColor, app.secondaryColor),
                          borderRadius: '10px',
                          padding: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '32px',
                          height: '32px',
                          boxShadow: `0 2px 8px ${app.primaryColor}40`
                        }}
                      >
                        <Icon 
                          size={16}
                          style={{ 
                            color: '#ffffff',
                            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                          }} 
                        />
                      </div>
                      <span style={{
                        fontSize: '10px',
                        textAlign: 'center',
                        lineHeight: '1.2',
                        maxWidth: '60px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {app.name.replace('Bitcoin ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
              
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                marginTop: '12px',
                paddingTop: '12px',
                textAlign: 'center'
              }}>
                <a
                  href="https://www.bitcoinapps.store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    padding: '8px',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Store size={14} />
                  Browse All Apps
                </a>
              </div>
            </div>
          )}
        </div>
        </div>
        
        {/* Status icons on the right */}
        <div className="dock-status">
          <div className="dock-divider" />
          <button 
            className="status-button" 
            title="Bitcoin Corporation"
            onClick={() => window.location.href = 'https://bitcoin-corp.vercel.app/'}
          >
            <Building2 className="status-icon" style={{ color: '#f7931a' }} />
          </button>
          <button 
            className="status-button" 
            title="Trust"
            onClick={() => window.location.href = 'https://bitcoin-corp.vercel.app/trust'}
          >
            <Shield className="status-icon" style={{ color: '#3b82f6' }} />
          </button>
          <button className="status-button" title="Connected">
            <Wifi className="status-icon connected" />
          </button>
          <button className="status-button" title="Volume">
            <Volume2 className="status-icon" />
          </button>
          <button className="status-button" title="Battery: 100%">
            <Battery className="status-icon connected" />
          </button>
          <div className="status-time" title={mounted ? currentTime.toLocaleDateString() : ''}>
            <Clock className="status-icon" />
            <span>{mounted ? currentTime.toLocaleTimeString() : '12:00:00 AM'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinimalDock;