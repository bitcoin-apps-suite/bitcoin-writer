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
}

const Taskbar: React.FC<TaskbarProps> = ({
  isAuthenticated,
  currentUser,
  onLogout,
  onNewDocument,
  onSaveDocument,
  onOpenTokenizeModal,
  onOpenTwitterModal
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const menus: DropdownMenu[] = [
    {
      label: 'Bitcoin Writer',
      items: [
        { 
          label: 'About Bitcoin Writer', 
          action: () => alert('Bitcoin Writer v2.0\n\nDecentralized document writing on Bitcoin SV\n\n© @b0ase 2025\nBuilt with HandCash integration') 
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
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
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
      {/* Bitcoin Logo */}
      <div className="taskbar-logo">
        <span className="bitcoin-symbol">₿</span>
      </div>

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
    </div>
  );
};

export default Taskbar;