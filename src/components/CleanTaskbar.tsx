import React, { useState, useRef, useEffect } from 'react';

interface MenuItem {
  label?: string;
  action?: () => void;
  href?: string;
  divider?: boolean;
  shortcut?: string;
}

interface MenuData {
  label: string;
  items: MenuItem[];
}

interface TaskbarProps {
  isAuthenticated: boolean;
  currentUser: any;
  onLogout: () => void;
  onNewDocument?: () => void;
  onSaveDocument?: () => void;
  onOpenTokenizeModal?: () => void;
  onOpenTwitterModal?: () => void;
  documentService?: any;
}

const CleanTaskbar: React.FC<TaskbarProps> = ({ 
  isAuthenticated, 
  currentUser, 
  onLogout,
  onNewDocument,
  onSaveDocument,
  onOpenTokenizeModal,
  onOpenTwitterModal,
  documentService
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const menus: MenuData[] = [
    {
      label: 'Bitcoin Writer',
      items: [
        { label: 'About Bitcoin Writer', action: () => alert('Bitcoin Writer v2.0\n\nDecentralized document writing on Bitcoin SV\n\n© @b0ase 2025\nBuilt with HandCash integration') },
        { divider: true },
        { label: 'Preferences...', shortcut: '⌘,', action: () => console.log('Preferences') },
        { label: 'Encryption Settings...', action: () => console.log('Encryption Settings') },
        { divider: true },
        { label: 'Hide Bitcoin Writer', shortcut: '⌘H', action: () => console.log('Hide') },
        { label: 'Hide Others', shortcut: '⌥⌘H', action: () => console.log('Hide Others') },
        { divider: true },
        { label: isAuthenticated ? 'Sign Out' : 'Sign In', shortcut: '⌘Q', action: isAuthenticated ? onLogout : () => document.querySelector<HTMLButtonElement>('.sign-in-btn')?.click() }
      ]
    },
    {
      label: 'File',
      items: [
        { label: 'New Document', shortcut: '⌘N', action: onNewDocument || (() => console.log('New')) },
        { label: 'Open...', shortcut: '⌘O', action: () => console.log('Open') },
        { label: 'Open Recent', action: () => console.log('Recent') },
        { divider: true },
        { label: 'Close', shortcut: '⌘W', action: () => console.log('Close') },
        { label: 'Save', shortcut: '⌘S', action: onSaveDocument || (() => console.log('Save')) },
        { label: 'Save As...', shortcut: '⇧⌘S', action: () => console.log('Save As') },
        { label: 'Save to Blockchain', shortcut: '⌘B', action: () => console.log('Save to blockchain') },
        { divider: true },
        { label: 'Import from Word', action: () => console.log('Import Word') },
        { label: 'Export to PDF', action: () => console.log('Export PDF') },
        { label: 'Export to Word', action: () => console.log('Export Word') },
        { label: 'Export to HTML', action: () => console.log('Export HTML') }
      ]
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', action: () => document.execCommand('undo') },
        { label: 'Redo', shortcut: '⇧⌘Z', action: () => document.execCommand('redo') },
        { divider: true },
        { label: 'Cut', shortcut: '⌘X', action: () => document.execCommand('cut') },
        { label: 'Copy', shortcut: '⌘C', action: () => document.execCommand('copy') },
        { label: 'Paste', shortcut: '⌘V', action: () => document.execCommand('paste') },
        { label: 'Select All', shortcut: '⌘A', action: () => document.execCommand('selectAll') },
        { divider: true },
        { label: 'Find...', shortcut: '⌘F', action: () => console.log('Find') }
      ]
    },
    {
      label: 'Format',
      items: [
        { label: 'Bold', shortcut: '⌘B', action: () => document.execCommand('bold') },
        { label: 'Italic', shortcut: '⌘I', action: () => document.execCommand('italic') },
        { label: 'Underline', shortcut: '⌘U', action: () => document.execCommand('underline') },
        { divider: true },
        { label: 'Align Left', action: () => document.execCommand('justifyLeft') },
        { label: 'Align Center', action: () => document.execCommand('justifyCenter') },
        { label: 'Align Right', action: () => document.execCommand('justifyRight') },
        { label: 'Justify', action: () => document.execCommand('justifyFull') }
      ]
    },
    {
      label: 'Blockchain',
      items: [
        { label: 'Encrypt Document', shortcut: '⌘L', action: () => (document.querySelector('[title*="Encrypt"]') as HTMLElement)?.click() },
        { label: 'Decrypt Document', action: () => (document.querySelector('[title*="Decrypt"]') as HTMLElement)?.click() },
        { divider: true },
        { label: 'Create NFT', action: onOpenTokenizeModal || (() => console.log('Tokenize')) },
        { label: 'Issue File Shares', action: () => console.log('Issue shares') },
        { divider: true },
        { label: 'Set Paywall', action: () => (document.querySelector('[title*="Set price"]') as HTMLElement)?.click() },
        { label: 'Set Timelock', action: () => console.log('Set timelock') },
        { label: 'Set Multisig', action: () => console.log('Set multisig') },
        { divider: true },
        { label: 'Publish to Chain', action: () => (document.querySelector('[title*="Publish"]') as HTMLElement)?.click() },
        { label: 'View on Explorer', href: 'https://whatsonchain.com' }
      ]
    },
    {
      label: 'Storage',
      items: [
        { label: 'OP_RETURN (Metadata)', action: () => console.log('OP_RETURN storage') },
        { label: 'OP_PUSHDATA4 (Full)', action: () => console.log('OP_PUSHDATA4 storage') },
        { label: 'Multisig P2SH', action: () => console.log('Multisig storage') },
        { divider: true },
        { label: 'Storage Calculator', action: () => console.log('Calculate storage cost') },
        { label: 'Storage Settings', action: () => console.log('Storage settings') }
      ]
    },
    {
      label: 'Social',
      items: [
        { label: 'Post to Twitter/X', action: onOpenTwitterModal || (() => console.log('Twitter')) },
        { label: 'Share on Substack', action: () => alert('Substack doesn\'t do OAuth!') },
        { divider: true },
        { label: 'Email via Gmail', action: () => console.log('Send via Gmail') },
        { label: 'Save to Google Drive', action: () => console.log('Save to Drive') },
        { divider: true },
        { label: 'Create Calendar Event', action: () => console.log('Create event') }
      ]
    },
    {
      label: 'Developers',
      items: [
        { label: 'BAP Executive Summary', href: '/bitcoin-writer/bap' },
        { divider: true },
        { label: 'BSV SDK Docs', href: 'https://docs.bsvblockchain.org' },
        { label: 'HandCash SDK Docs', href: 'https://docs.handcash.io' },
        { divider: true },
        { label: 'GitHub Repository', href: 'https://github.com/b0ase/bitcoin-writer' },
        { label: 'API Documentation', action: () => alert('API Endpoints:\n• POST /api/documents\n• GET /api/documents\n• DELETE /api/documents/:id') },
        { divider: true },
        { label: 'Bitcoin Spreadsheet', href: 'https://github.com/b0ase/bitcoin-spreadsheet' },
        { label: 'Bitcoin Drive', href: 'https://github.com/b0ase/bitcoin-drive' }
      ]
    },
    {
      label: 'View',
      items: [
        { label: 'Toggle Sidebar', shortcut: '⌥⌘S', action: () => console.log('Toggle sidebar') },
        { label: 'Toggle Dark Mode', shortcut: '⌥⌘D', action: () => console.log('Toggle dark mode') },
        { divider: true },
        { label: 'Enter Full Screen', shortcut: '⌃⌘F', action: () => document.documentElement.requestFullscreen() },
        { divider: true },
        { label: 'Zoom In', shortcut: '⌘+', action: () => (document.body.style as any).zoom = '110%' },
        { label: 'Zoom Out', shortcut: '⌘-', action: () => (document.body.style as any).zoom = '90%' },
        { label: 'Actual Size', shortcut: '⌘0', action: () => (document.body.style as any).zoom = '100%' }
      ]
    },
    {
      label: 'Window',
      items: [
        { label: 'Minimize', shortcut: '⌘M', action: () => console.log('Minimize') },
        { label: 'Zoom', action: () => console.log('Zoom') },
        { divider: true },
        { label: 'Bring All to Front', action: () => console.log('Bring to front') }
      ]
    },
    {
      label: 'Help',
      items: [
        { label: 'Bitcoin Writer Help', shortcut: '⌘?', action: () => alert('Bitcoin Writer v2.0\n\nWrite, encrypt, and store documents on the Bitcoin blockchain') },
        { label: 'Keyboard Shortcuts', action: () => alert('Keyboard Shortcuts:\n\n⌘N - New Document\n⌘S - Save\n⌘B - Save to Blockchain\n⌘L - Encrypt\n⌘F - Find\n⌃⌘F - Full Screen') },
        { divider: true },
        { label: 'Release Notes', href: '/releases' },
        { label: 'What\'s New', action: () => alert('What\'s New in v2.0:\n\n• Multi-provider authentication\n• NFT tokenization\n• File shares\n• Twitter integration\n• Enhanced encryption') },
        { divider: true },
        { label: 'Report an Issue', href: 'https://github.com/b0ase/bitcoin-writer/issues' },
        { label: 'Contact @b0ase', href: 'https://twitter.com/b0ase' },
        { divider: true },
        { label: 'Follow @bitcoin_writer', href: 'https://x.com/bitcoin_writer' }
      ]
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={menuRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '28px',
        background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)',
        borderBottom: '1px solid #1a1a1a',
        fontSize: '13px',
        fontWeight: '500',
        color: '#ffffff',
        userSelect: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10000
      }}
    >
      {/* Bitcoin Logo */}
      <div style={{
        padding: '0 12px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#ff9500',
        display: 'flex',
        alignItems: 'center',
        height: '100%'
      }}>
        ₿
      </div>

      {/* Menu Items */}
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        {menus.map((menu) => (
          <div key={menu.label} style={{ position: 'relative' }}>
            <button
              onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
              onMouseEnter={() => activeMenu && setActiveMenu(menu.label)}
              style={{
                padding: '0 12px',
                height: '24px',
                background: activeMenu === menu.label ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.15s ease'
              }}
            >
              {menu.label}
            </button>

            {/* Dropdown Menu */}
            {activeMenu === menu.label && (
              <div style={{
                position: 'absolute',
                top: '28px',
                left: 0,
                minWidth: '200px',
                background: '#1a1a1a',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
                padding: '4px 0',
                zIndex: 9999,
                overflow: 'hidden'
              }}>
                {menu.items.map((item, index) => (
                  item.divider ? (
                    <div 
                      key={index}
                      style={{
                        height: '1px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        margin: '4px 0'
                      }}
                    />
                  ) : item.href ? (
                    <a
                      key={index}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 12px',
                        color: '#ffffff',
                        textDecoration: 'none',
                        fontSize: '13px',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 149, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span style={{ opacity: 0.6, fontSize: '12px' }}>{item.shortcut}</span>
                      )}
                    </a>
                  ) : (
                    <button
                      key={index}
                      onClick={() => {
                        item.action?.();
                        setActiveMenu(null);
                      }}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: '100%',
                        padding: '4px 12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '13px',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textAlign: 'left',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 149, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span style={{ opacity: 0.6, fontSize: '12px' }}>{item.shortcut}</span>
                      )}
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Right side - Status */}
      <div style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingRight: '16px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        {isAuthenticated && currentUser ? (
          <>
            <span>{currentUser.handle || 'Connected'}</span>
            <span style={{ color: '#00ff88' }}>●</span>
          </>
        ) : (
          <>
            <span>Not Connected</span>
            <span style={{ color: '#ff4444', opacity: 0.6 }}>●</span>
          </>
        )}
      </div>
    </div>
  );
};

export default CleanTaskbar;