import React, { useState, useRef, useEffect } from 'react';
import './Taskbar.css';

interface DropdownItem {
  label?: string;
  action?: () => void;
  href?: string;
  divider?: boolean;
  shortcut?: string;
  icon?: string;
}

interface DropdownMenu {
  label: string;
  items: DropdownItem[];
}

interface TaskbarProps {
  isAuthenticated: boolean;
  currentUser: any;
  onLogout: () => void;
  onNewDocument?: () => void;
  onSaveDocument?: () => void;
  onOpenTokenizeModal?: () => void;
  onOpenTwitterModal?: () => void;
  onToggleAIChat?: () => void;
}

const Taskbar: React.FC<TaskbarProps> = ({
  isAuthenticated,
  currentUser,
  onLogout,
  onNewDocument,
  onSaveDocument,
  onOpenTokenizeModal,
  onOpenTwitterModal,
  onToggleAIChat
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showBAppsMenu, setShowBAppsMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const bitcoinApps = [
    { name: 'Bitcoin Apps Store', color: '#f97316', url: 'https://www.bitcoinapps.store/' },
    { name: 'Bitcoin Auth', color: '#ef4444', url: '#', disabled: true },
    { name: 'Bitcoin Calendar', color: '#d946ef', url: 'https://bitcoin-calendar.vercel.app' },
    { name: 'Bitcoin Chat', color: '#ff6500', url: '#', disabled: true },
    { name: 'Bitcoin Code', color: '#06b6d4', url: 'https://bitcoin-code.vercel.app/' },
    { name: 'Bitcoin Domains', color: '#eab308', url: '#', disabled: true },
    { name: 'Bitcoin Draw', color: '#10b981', url: '#', disabled: true },
    { name: 'Bitcoin Drive', color: '#22c55e', url: 'https://bitcoin-drive.vercel.app' },
    { name: 'Bitcoin Email', color: '#06b6d4', url: 'https://bitcoin-email.vercel.app' },
    { name: 'Bitcoin Exchange', color: '#10b981', url: 'https://bitcoin-exchange.vercel.app' },
    { name: 'Bitcoin Jobs', color: '#6b7280', url: 'https://bitcoin-jobs.vercel.app/' },
    { name: 'Bitcoin Music', color: '#8b5cf6', url: 'https://bitcoin-music.vercel.app' },
    { name: 'Bitcoin Paint', color: '#a855f7', url: 'https://bitcoin-paint.vercel.app' },
    { name: 'Bitcoin Pics', color: '#ec4899', url: '#', disabled: true },
    { name: 'Bitcoin Registry', color: '#f43f5e', url: '#', disabled: true },
    { name: 'Bitcoin Search', color: '#6b7280', url: 'https://bitcoin-search.vercel.app' },
    { name: 'Bitcoin Shares', color: '#f43f5e', url: 'https://bitcoin-shares.vercel.app' },
    { name: 'Bitcoin Spreadsheets', color: '#3b82f6', url: 'https://bitcoin-spreadsheet.vercel.app' },
    { name: 'Bitcoin Video', color: '#65a30d', url: 'https://bitcoin-video-nine.vercel.app' },
    { name: 'Bitcoin Wallet', color: '#f59e0b', url: 'https://bitcoin-wallet-sable.vercel.app' },
    { name: 'Bitcoin Writer', color: '#ff9500', url: '#', current: true }
  ];

  const menus: DropdownMenu[] = [
    {
      label: 'Bitcoin Writer',
      items: [
        { 
          label: 'Home', 
          shortcut: '⌘⇧H',
          action: () => window.location.href = '/'
        },
        { divider: true },
        { 
          label: 'About Bitcoin Writer', 
          action: () => alert('Bitcoin Writer v2.0\n\nDecentralized document writing on Bitcoin SV\n\n© 2025 The Bitcoin Corporation LTD\nRegistered in England and Wales • Company No. 16735102\n\nBuilt with HandCash integration') 
        },
        { divider: true },
        { 
          label: 'Preferences...', 
          shortcut: '⌘,', 
          action: () => console.log('Preferences') 
        },
        { divider: true },
        { 
          label: 'Hide Bitcoin Writer', 
          shortcut: '⌘H', 
          action: () => console.log('Hide') 
        },
        { 
          label: 'Hide Others', 
          shortcut: '⌥⌘H', 
          action: () => console.log('Hide Others') 
        },
        { divider: true },
        ...(isAuthenticated ? [
          { 
            label: 'Sign Out', 
            shortcut: '⌘Q', 
            action: onLogout 
          }
        ] : [
          { 
            label: 'Sign In', 
            action: () => document.querySelector<HTMLButtonElement>('.sign-in-btn')?.click()
          }
        ])
      ]
    },
    {
      label: 'File',
      items: [
        { 
          label: 'New Document', 
          shortcut: '⌘N', 
          action: onNewDocument 
        },
        { 
          label: 'Open...', 
          shortcut: '⌘O', 
          action: () => alert('Open functionality coming soon') 
        },
        { divider: true },
        { 
          label: 'Save', 
          shortcut: '⌘S', 
          action: onSaveDocument 
        },
        { 
          label: 'Save As...', 
          shortcut: '⇧⌘S', 
          action: () => alert('Save As functionality coming soon') 
        },
        { divider: true },
        { 
          label: 'Export as PDF', 
          action: () => console.log('Export PDF') 
        },
        { 
          label: 'Export as Word', 
          action: () => console.log('Export Word') 
        },
        { divider: true },
        { 
          label: 'Close', 
          shortcut: '⌘W', 
          action: () => console.log('Close') 
        }
      ]
    },
    {
      label: 'Edit',
      items: [
        { 
          label: 'Undo', 
          shortcut: '⌘Z', 
          action: () => document.execCommand('undo') 
        },
        { 
          label: 'Redo', 
          shortcut: '⇧⌘Z', 
          action: () => document.execCommand('redo') 
        },
        { divider: true },
        { 
          label: 'Cut', 
          shortcut: '⌘X', 
          action: () => document.execCommand('cut') 
        },
        { 
          label: 'Copy', 
          shortcut: '⌘C', 
          action: () => document.execCommand('copy') 
        },
        { 
          label: 'Paste', 
          shortcut: '⌘V', 
          action: () => document.execCommand('paste') 
        },
        { divider: true },
        { 
          label: 'Select All', 
          shortcut: '⌘A', 
          action: () => document.execCommand('selectAll') 
        },
        { 
          label: 'Find...', 
          shortcut: '⌘F', 
          action: () => console.log('Find') 
        },
        { 
          label: 'Replace...', 
          shortcut: '⌥⌘F', 
          action: () => console.log('Replace') 
        }
      ]
    },
    {
      label: 'Format',
      items: [
        { 
          label: 'Bold', 
          shortcut: '⌘B', 
          action: () => document.execCommand('bold') 
        },
        { 
          label: 'Italic', 
          shortcut: '⌘I', 
          action: () => document.execCommand('italic') 
        },
        { 
          label: 'Underline', 
          shortcut: '⌘U', 
          action: () => document.execCommand('underline') 
        }
      ]
    },
    {
      label: 'Tools',
      items: [
        {
          label: 'AI Assistant',
          icon: '🤖',
          shortcut: '⌘⌥A',
          action: onToggleAIChat
        },
        { divider: true },
        { 
          label: 'Save to Blockchain', 
          action: () => console.log('Save to blockchain') 
        },
        { 
          label: 'Encrypt Document', 
          action: () => (document.querySelector('[title*="Encrypt"]') as HTMLElement)?.click() 
        },
        { divider: true },
        { 
          label: 'Create NFT', 
          action: onOpenTokenizeModal 
        },
        { 
          label: 'Set Paywall', 
          action: () => (document.querySelector('[title*="Set price"]') as HTMLElement)?.click() 
        },
        { divider: true },
        { 
          label: 'Post to Twitter', 
          action: onOpenTwitterModal 
        }
      ]
    },
    {
      label: 'View',
      items: [
        { 
          label: 'Enter Full Screen', 
          shortcut: '⌃⌘F', 
          action: () => document.documentElement.requestFullscreen() 
        },
        { divider: true },
        { 
          label: 'Actual Size', 
          shortcut: '⌘0', 
          action: () => (document.body.style as any).zoom = '100%' 
        },
        { 
          label: 'Zoom In', 
          shortcut: '⌘+', 
          action: () => (document.body.style as any).zoom = '110%' 
        },
        { 
          label: 'Zoom Out', 
          shortcut: '⌘-', 
          action: () => (document.body.style as any).zoom = '90%' 
        }
      ]
    },
    {
      label: 'Window',
      items: [
        { 
          label: 'Minimize', 
          shortcut: '⌘M', 
          action: () => console.log('Minimize') 
        },
        { 
          label: 'Zoom', 
          action: () => console.log('Zoom') 
        },
        { divider: true },
        { 
          label: 'Bring All to Front', 
          action: () => console.log('Bring to front') 
        }
      ]
    },
    {
      label: 'Help',
      items: [
        { 
          label: 'Bitcoin Writer Help', 
          shortcut: '⌘?', 
          action: () => alert('Bitcoin Writer v2.0\n\nWrite, encrypt, and store documents on the Bitcoin blockchain') 
        },
        { divider: true },
        { 
          label: 'Report an Issue', 
          href: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues' 
        }
      ]
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setShowMobileMenu(false);
        setShowBAppsMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setShowMobileMenu(false);
        setShowBAppsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div 
      ref={menuRef}
      className="bitcoin-writer-taskbar"
    >
      {/* bApps Menu Button */}
      <button
        className="bapps-menu-btn"
        onClick={() => {
          setShowBAppsMenu(!showBAppsMenu);
          setActiveMenu(null);
        }}
        title="Bitcoin Apps"
      >
        <span className="bitcoin-logo">B</span>
      </button>

      {/* bApps Dropdown */}
      {showBAppsMenu && (
        <div className="bapps-menu-dropdown">
          <div className="bapps-menu-header">
            Bitcoin Apps Suite
          </div>
          {bitcoinApps.map((app) => (
            <div
              key={app.name}
              className={`bapps-menu-item ${app.current ? 'current' : ''} ${app.disabled ? 'disabled' : ''}`}
              onClick={() => {
                if (!app.disabled && !app.current && app.url !== '#') {
                  window.location.href = app.url;
                }
              }}
            >
              <span className="bapps-menu-icon" style={{ color: app.color }}>₿</span>
              <span className="bapps-menu-name">{app.name}</span>
              {app.current && <span className="bapps-menu-badge">Current</span>}
              {app.disabled && <span className="bapps-menu-badge">Soon</span>}
            </div>
          ))}
        </div>
      )}

      {/* Bitcoin Logo */}
      <div 
        className="taskbar-logo"
        onDoubleClick={() => window.location.href = '/'}
        title="Double-click to go home"
      >
        <span className="bitcoin-symbol">₿</span>
      </div>

      {/* Mobile: Center title */}
      <button 
        className="mobile-title"
        onClick={() => {
          // Navigate to home
          window.location.href = '/';
        }}
        title="Bitcoin Writer - Tap to go home"
      >
        <span className="bitcoin-symbol">₿</span>
        <span>Bitcoin Writer</span>
      </button>

      {/* Menu Items */}
      <div className="taskbar-menus">
        {menus.map((menu) => (
          <div key={menu.label} className="menu-container">
            <button
              className={`menu-button ${activeMenu === menu.label ? 'active' : ''}`}
              onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
              onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
            >
              {menu.label}
            </button>

            {/* Dropdown Menu */}
            {activeMenu === menu.label && (
              <div className="dropdown-menu">
                {menu.items.map((item, index) => (
                  item.divider ? (
                    <div key={index} className="menu-divider" />
                  ) : item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="menu-item"
                      onClick={() => setActiveMenu(null)}
                    >
                      <span className="menu-item-content">
                        {item.icon && <span className="menu-icon">{item.icon}</span>}
                        <span className="menu-label">{item.label}</span>
                      </span>
                      {item.shortcut && (
                        <span className="menu-shortcut">{item.shortcut}</span>
                      )}
                    </a>
                  ) : (
                    <button
                      key={index}
                      className="menu-item"
                      onClick={() => {
                        item.action?.();
                        setActiveMenu(null);
                      }}
                    >
                      <span className="menu-item-content">
                        {item.icon && <span className="menu-icon">{item.icon}</span>}
                        <span className="menu-label">{item.label}</span>
                      </span>
                      {item.shortcut && (
                        <span className="menu-shortcut">{item.shortcut}</span>
                      )}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side - Status items */}
      <div className="taskbar-status">
        {isAuthenticated && currentUser ? (
          <>
            <span className="status-text">
              {currentUser.handle ? `$${currentUser.handle}` : 'Connected'}
            </span>
            <span className="status-indicator connected">●</span>
          </>
        ) : (
          <>
            <span className="status-text">Not Connected</span>
            <span className="status-indicator disconnected">●</span>
          </>
        )}
        <a 
          href="https://x.com/bitcoin_writer" 
          target="_blank" 
          rel="noopener noreferrer"
          className="twitter-link"
          aria-label="Follow on X"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        aria-label="Toggle menu"
      >
        {showMobileMenu ? '✕' : '☰'}
      </button>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-content">
            {/* User Status */}
            <div style={{
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              {isAuthenticated && currentUser ? (
                <>
                  <span style={{ color: '#ffffff', fontSize: '14px' }}>
                    {currentUser.handle ? `$${currentUser.handle}` : 'Connected'}
                  </span>
                  <span style={{ color: '#30d158' }}>●</span>
                </>
              ) : (
                <>
                  <span style={{ color: '#ffffff', fontSize: '14px' }}>Not Connected</span>
                  <span style={{ color: '#ff3b30', opacity: 0.6 }}>●</span>
                </>
              )}
            </div>

            {/* Menu Sections */}
            {menus.map((menu) => (
              <div key={menu.label} className="mobile-menu-section">
                <div className="mobile-menu-header">
                  {menu.label}
                </div>
                <div style={{ padding: '8px' }}>
                  {menu.items.map((item, index) => (
                    item.divider ? (
                      <div 
                        key={index}
                        style={{
                          height: '1px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          margin: '8px 0'
                        }}
                      />
                    ) : item.href ? (
                      <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mobile-menu-item"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        key={index}
                        className="mobile-menu-item"
                        onClick={() => {
                          item.action?.();
                          setShowMobileMenu(false);
                        }}
                      >
                        {item.label}
                      </button>
                    )
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Taskbar;