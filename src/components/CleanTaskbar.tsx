import React, { useState, useRef, useEffect } from 'react';
import { BitcoinAppEvents, openBitcoinApp } from '../utils/appEvents';
import PreferencesModal from './modals/PreferencesModal';
import EncryptionSettingsModal from './modals/EncryptionSettingsModal';
import StorageCalculatorModal from './modals/StorageCalculatorModal';
import KeyboardShortcutsModal from './modals/KeyboardShortcutsModal';
import APIDocumentationModal from './modals/APIDocumentationModal';
import { HandCashService } from '../services/HandCashService';

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
  onToggleAIChat?: () => void;
}

const CleanTaskbar: React.FC<TaskbarProps> = ({ 
  isAuthenticated, 
  currentUser, 
  onLogout,
  onNewDocument,
  onSaveDocument,
  onOpenTokenizeModal,
  onOpenTwitterModal,
  documentService,
  onToggleAIChat
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showBitcoinSuite, setShowBitcoinSuite] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Modal states
  const [showPreferences, setShowPreferences] = useState(false);
  const [showEncryption, setShowEncryption] = useState(false);
  const [showStorageCalc, setShowStorageCalc] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showAPIDoc, setShowAPIDoc] = useState(false);

  const menus: MenuData[] = [
    {
      label: 'Bitcoin Writer',
      items: [
        { label: 'About Bitcoin Writer', action: () => alert('Bitcoin Writer v2.0\n\nDecentralized document writing on Bitcoin SV\n\n© 2025 The Bitcoin Corporation LTD\nAll rights reserved\n\nBuilt with HandCash integration') },
        { label: 'Features', action: () => {
          const event = new CustomEvent('showFeaturesPage');
          window.dispatchEvent(event);
        }},
        { divider: true },
        { label: 'Preferences...', shortcut: '⌘,', action: () => setShowPreferences(true) },
        { label: 'Encryption Settings...', action: () => setShowEncryption(true) },
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
        { label: 'Save to Blockchain', shortcut: '⌘B', action: () => {
          const event = new CustomEvent('openSaveToBlockchain');
          window.dispatchEvent(event);
        }},
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
        { label: 'Exchange', action: () => {
          const event = new CustomEvent('openDocumentExchange');
          window.dispatchEvent(event);
        }},
        { divider: true },
        { label: 'Publish to Chain', action: () => (document.querySelector('[title*="Publish"]') as HTMLElement)?.click() },
        { label: 'View on Explorer', href: 'https://whatsonchain.com' }
      ]
    },
    {
      label: 'Storage',
      items: [
        { label: 'Direct On-Chain', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
        }},
        { label: 'IPFS with Hash', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
        }},
        { label: 'Hybrid (Chain + IPFS)', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
        }},
        { divider: true },
        { label: 'Cloud Providers ▸', action: () => {} },
        { label: '  Google Drive', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
          setTimeout(() => {
            const cloudRadio = document.querySelector('input[value="cloud"]') as HTMLInputElement;
            if (cloudRadio) {
              cloudRadio.click();
              const select = document.querySelector('.cloud-options select') as HTMLSelectElement;
              if (select) select.value = 'googledrive';
            }
          }, 300);
        }},
        { label: '  AWS S3', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
          setTimeout(() => {
            const cloudRadio = document.querySelector('input[value="cloud"]') as HTMLInputElement;
            if (cloudRadio) {
              cloudRadio.click();
              const select = document.querySelector('.cloud-options select') as HTMLSelectElement;
              if (select) select.value = 'aws-s3';
            }
          }, 300);
        }},
        { label: '  Supabase Storage', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
          setTimeout(() => {
            const cloudRadio = document.querySelector('input[value="cloud"]') as HTMLInputElement;
            if (cloudRadio) {
              cloudRadio.click();
              const select = document.querySelector('.cloud-options select') as HTMLSelectElement;
              if (select) select.value = 'supabase';
            }
          }, 300);
        }},
        { label: '  Cloudflare R2', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
          setTimeout(() => {
            const cloudRadio = document.querySelector('input[value="cloud"]') as HTMLInputElement;
            if (cloudRadio) {
              cloudRadio.click();
              const select = document.querySelector('.cloud-options select') as HTMLSelectElement;
              if (select) select.value = 'cloudflare-r2';
            }
          }, 300);
        }},
        { label: '  Azure Blob', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
          setTimeout(() => {
            const cloudRadio = document.querySelector('input[value="cloud"]') as HTMLInputElement;
            if (cloudRadio) {
              cloudRadio.click();
              const select = document.querySelector('.cloud-options select') as HTMLSelectElement;
              if (select) select.value = 'azure-blob';
            }
          }, 300);
        }},
        { divider: true },
        { label: 'Storage Calculator', action: () => setShowStorageCalc(true) },
        { label: 'Storage Settings', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
        }}
      ]
    },
    {
      label: 'Social',
      items: [
        { label: 'Post to Twitter/X', action: onOpenTwitterModal || (() => console.log('Twitter')) },
        { label: 'Share on LinkedIn', action: () => console.log('Share on LinkedIn') },
        { label: 'Share on Facebook', action: () => console.log('Share on Facebook') },
        { label: 'Share on Substack', action: () => alert('Substack doesn\'t do OAuth!') },
        { label: 'Share on Medium', action: () => console.log('Share on Medium') },
        { divider: true },
        { label: 'Copy Share Link', action: () => {
          navigator.clipboard.writeText(window.location.href);
          alert('Link copied to clipboard!');
        }},
        { label: 'Generate QR Code', action: () => console.log('Generate QR code') },
        { divider: true },
        { label: 'Email via Gmail', action: () => console.log('Send via Gmail') },
        { label: 'Send to Telegram', action: () => console.log('Send to Telegram') },
        { label: 'Send to WhatsApp', action: () => console.log('Send to WhatsApp') },
        { divider: true },
        { label: 'Save to Google Drive', action: () => {
          const saveBtn = document.querySelector('.save-options-btn') as HTMLElement;
          saveBtn?.click();
          setTimeout(() => {
            const cloudRadio = document.querySelector('input[value="cloud"]') as HTMLInputElement;
            if (cloudRadio) {
              cloudRadio.click();
              const select = document.querySelector('.cloud-options select') as HTMLSelectElement;
              if (select) select.value = 'googledrive';
            }
          }, 300);
        }},
        { label: 'Export as PDF', action: () => window.print() },
        { divider: true },
        { label: 'Analytics Dashboard', action: () => console.log('Open analytics') },
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
        { label: 'GitHub Repository', href: 'https://github.com/bitcoin-apps-suite/bitcoin-writer' },
        { label: '$BWRITER Token', action: () => window.location.href = '/token' },
        { label: 'API Documentation', action: () => setShowAPIDoc(true) },
        { divider: true },
        { label: 'Bitcoin Spreadsheet', href: 'https://github.com/bitcoin-apps-suite/bitcoin-spreadsheet' },
        { label: 'Bitcoin Drive', href: 'https://github.com/bitcoin-apps-suite/bitcoin-drive' }
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
      label: 'Tools',
      items: [
        { label: 'AI Assistant', shortcut: '⌘⌥A', action: onToggleAIChat },
        { divider: true },
        { label: 'Storage Calculator', action: () => setShowStorageCalc(true) },
        { label: 'Create NFT', action: onOpenTokenizeModal },
        { label: 'Post to Twitter', action: onOpenTwitterModal },
        { divider: true },
        { label: 'API Documentation', action: () => setShowAPIDoc(true) },
        { label: 'Keyboard Shortcuts', shortcut: '⌘/', action: () => setShowKeyboardShortcuts(true) }
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
        { label: 'Platform Overview', href: '/platform' },
        { label: 'Bitcoin Writer Help', shortcut: '⌘?', action: () => alert('Bitcoin Writer v2.0\n\nWrite, encrypt, and store documents on the Bitcoin blockchain') },
        { label: 'Keyboard Shortcuts', action: () => setShowKeyboardShortcuts(true) },
        { divider: true },
        { label: 'Sign Up for Updates', href: '/signup' },
        { label: 'Release Notes', href: '/releases' },
        { label: 'What\'s New', action: () => alert('What\'s New in v2.0:\n\n• Multi-provider authentication\n• NFT tokenization\n• File shares\n• Twitter integration\n• Enhanced encryption') },
        { divider: true },
        { label: 'Report an Issue', href: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues' },
        { label: 'Contact @b0ase', href: 'https://twitter.com/b0ase' },
        { divider: true },
        { label: 'Follow @bitcoin_writer', href: 'https://x.com/bitcoin_writer' }
      ]
    }
  ];

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
        setShowBitcoinSuite(false);
        setShowMobileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
    <div 
      ref={menuRef}
      style={{
        display: 'flex',
        alignItems: 'center',
        height: '32px',
        background: 'linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)',
        borderBottom: '1px solid #1a1a1a',
        fontSize: '13px',
        fontWeight: '500',
        color: '#ffffff',
        userSelect: 'none',
        position: 'fixed',
        top: isMobile ? (window.innerWidth <= 480 ? '68px' : '72px') : '40px', // Responsive positioning
        left: 0,
        right: 0,
        zIndex: 10000
      }}
    >
      {/* Bitcoin Logo */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => {
            setShowBitcoinSuite(!showBitcoinSuite);
            setActiveMenu(null);
          }}
          style={{
            padding: '0 20px 0 18px', // Shifted right to align with collapsed sidebar
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#ff9500',
            display: 'flex',
            alignItems: 'center',
            height: '32px',
            background: showBitcoinSuite ? 'rgba(255, 149, 0, 0.1)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease'
          }}
          title="Bitcoin Suite Apps"
        >
          ₿
        </button>

        {/* Bitcoin Suite Dropdown */}
        {showBitcoinSuite && (
          <div style={{
            position: 'absolute',
            top: '32px',
            left: 0,
            minWidth: '280px',
            background: '#1a1a1a',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.8)',
            padding: '8px 0',
            zIndex: 1000
          }}>
            <button
              onClick={() => {
                // Trigger event to load Bitcoin Apps content in document editor
                const event = new CustomEvent('loadBitcoinApps');
                window.dispatchEvent(event);
                setShowBitcoinSuite(false);
              }}
              style={{
                width: '100%',
                padding: '8px 16px',
                fontSize: '12px',
                color: '#ff9500',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '4px',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: '600',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 149, 0, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              Bitcoin Apps
            </button>
            
            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#9b59b6', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Auth <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.7 }}>(Coming Soon)</span>
            </button>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#3498db', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Chat <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.7 }}>(Coming Soon)</span>
            </button>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#e74c3c', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Domains <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.7 }}>(Coming Soon)</span>
            </button>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#e67e22', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Draw <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.7 }}>(Coming Soon)</span>
            </button>

            <a
              href="https://bitcoin-drive.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#22c55e', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Drive
            </a>

            <a
              href="https://bitcoin-email.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onClick={() => setShowBitcoinSuite(false)}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#06b6d4', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Email
            </a>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#666666', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Exchange <span style={{ fontSize: '11px', marginLeft: '4px' }}>(Coming Soon)</span>
            </button>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#666666', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Music <span style={{ fontSize: '11px', marginLeft: '4px' }}>(Coming Soon)</span>
            </button>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#666666', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Paint <span style={{ fontSize: '11px', marginLeft: '4px' }}>(Coming Soon)</span>
            </button>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#f39c12', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Pics <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.7 }}>(Coming Soon)</span>
            </button>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#8e44ad', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Registry <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.7 }}>(Coming Soon)</span>
            </button>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#16a085', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Shares <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.7 }}>(Coming Soon)</span>
            </button>

            <a
              href="https://bitcoin-sheets.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background 0.15s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#3b82f6', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Spreadsheets
            </a>


            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#c0392b', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Video <span style={{ fontSize: '11px', marginLeft: '8px', opacity: 0.7 }}>(Coming Soon)</span>
            </button>

            <button
              onClick={() => {
                alert('Coming Soon!');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '6px 16px',
                color: 'rgba(255, 255, 255, 0.5)',
                background: 'transparent',
                border: 'none',
                width: '100%',
                textAlign: 'left',
                fontSize: '13px',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            >
              <span style={{ color: '#666666', marginRight: '12px', fontSize: '16px', fontWeight: 'bold' }}>₿</span>
              Bitcoin Wallet <span style={{ fontSize: '11px', marginLeft: '4px' }}>(Coming Soon)</span>
            </button>
          </div>
        )}
        
        {/* Mobile Menu */}
        {isMobile && showMobileMenu && (
          <div style={{
            position: 'fixed',
            top: '32px',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#1a1a1a',
            overflowY: 'auto',
            zIndex: 9999
          }}>
            <div style={{ padding: '16px' }}>
              {/* Quick Actions */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '14px', color: '#ff9500', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Quick Actions
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button onClick={() => { onNewDocument?.(); setShowMobileMenu(false); }} 
                    style={{ padding: '12px', background: 'rgba(255, 149, 0, 0.1)', border: '1px solid rgba(255, 149, 0, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '12px' }}>
                    📝 New
                  </button>
                  <button onClick={() => { onSaveDocument?.(); setShowMobileMenu(false); }} 
                    style={{ padding: '12px', background: 'rgba(255, 149, 0, 0.1)', border: '1px solid rgba(255, 149, 0, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '12px' }}>
                    💾 Save
                  </button>
                  <button onClick={() => { window.dispatchEvent(new CustomEvent('openDocumentExchange')); setShowMobileMenu(false); }} 
                    style={{ padding: '12px', background: 'rgba(255, 149, 0, 0.1)', border: '1px solid rgba(255, 149, 0, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '12px' }}>
                    🏪 Exchange
                  </button>
                  <button onClick={() => { onOpenTokenizeModal?.(); setShowMobileMenu(false); }} 
                    style={{ padding: '12px', background: 'rgba(255, 149, 0, 0.1)', border: '1px solid rgba(255, 149, 0, 0.3)', borderRadius: '6px', color: '#fff', fontSize: '12px' }}>
                    🎨 NFT
                  </button>
                </div>
              </div>
              
              {/* Menu Items */}
              {menus.map((menu) => (
                <div key={menu.label} style={{ marginBottom: '16px' }}>
                  <button
                    onClick={() => setActiveMenu(activeMenu === menu.label ? null : menu.label)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: activeMenu === menu.label ? 'rgba(255, 149, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    {menu.label}
                    <span style={{ fontSize: '10px', opacity: 0.5 }}>{activeMenu === menu.label ? '−' : '+'}</span>
                  </button>
                  
                  {activeMenu === menu.label && (
                    <div style={{ marginTop: '8px', paddingLeft: '12px' }}>
                      {menu.items.map((item, index) => (
                        item.divider ? (
                          <div key={index} style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '8px 0' }} />
                        ) : (
                          <button
                            key={index}
                            onClick={() => {
                              if (item.href) {
                                window.open(item.href, '_blank');
                              } else {
                                item.action?.();
                              }
                              setShowMobileMenu(false);
                            }}
                            style={{
                              display: 'block',
                              width: '100%',
                              padding: '8px',
                              background: 'transparent',
                              border: 'none',
                              color: 'rgba(255, 255, 255, 0.8)',
                              fontSize: '13px',
                              textAlign: 'left',
                              cursor: 'pointer'
                            }}
                          >
                            {item.label}
                          </button>
                        )
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Menu Items - Hidden on Mobile */}
      <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', height: '100%' }}>
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
                top: '32px',
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

      {/* Mobile Menu Button and Title - Show in center on mobile */}
      {isMobile && (
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            style={{
              padding: '6px 12px',
              background: showMobileMenu ? 'rgba(255, 149, 0, 0.1)' : 'transparent',
              border: '1px solid rgba(255, 149, 0, 0.3)',
              borderRadius: '4px',
              color: '#ff9500',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ fontSize: '16px' }}>☰</span>
            Menu
          </button>
        </div>
      )}
      
      {/* Right side - Navigation Icons and Authentication Status */}
      <div style={{
        marginLeft: isMobile ? '0' : 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingRight: '16px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.8)'
      }}>
        {/* Navigation Icons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Docs Icon */}
          <a
            href="/docs"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <svg height="16" width="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </a>

          {/* Token Icon */}
          <a
            href="/token"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            ₿
          </a>

          {/* Tasks Icon */}
          <a
            href="http://localhost:2010/contributions#tasks"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <svg height="16" width="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.13 22.19l-1.63-3.83c-.11-.27-.4-.46-.7-.46h-1.6c-.3 0-.59.19-.7.46l-1.63 3.83c-.14.33.05.71.4.71h5.46c.35 0 .54-.38.4-.71zM5.64 12.5l-1.39 3.84c-.14.33.05.71.4.71h2.95c.3 0 .59-.19.7-.46l1.63-3.83c.14-.33-.05-.71-.4-.71H5.64zM18.36 12.5h-3.89c-.35 0-.54.38-.4.71l1.63 3.83c.11.27.4.46.7.46h2.95c.35 0 .54-.38.4-.71l-1.39-3.84zM12 2L8.5 8.5h7L12 2z"/>
            </svg>
          </a>
          
          {/* GitHub Icon */}
          <a
            href="https://github.com/bitcoin-apps-suite/bitcoin-writer"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <svg height="16" width="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </a>

          {/* Twitter Icon */}
          <a
            href="https://twitter.com/bitcoin_writer"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <svg height="16" width="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          </a>

          {/* Discord Icon */}
          <a
            href="https://discord.gg/xBB8r8dj"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              textDecoration: 'none',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)';
            }}
          >
            <svg height="16" width="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0188 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9460 2.4189-2.1568 2.4189Z"/>
            </svg>
          </a>

        </div>

        {/* Authentication Status - Clickable to open HandCash connection */}
        <button
          onClick={() => {
            const handcashService = new HandCashService();
            handcashService.login();
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px',
            borderRadius: '4px',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          title={isAuthenticated ? 'Manage HandCash connection' : 'Connect with HandCash'}
        >
          <span>{isAuthenticated && currentUser ? (currentUser.handle || 'Connected') : (
            isMobile ? '' : 'Not Connected'
          )}</span>
          <span style={{ color: isAuthenticated ? '#00ff88' : '#ff4444', opacity: isAuthenticated ? 1 : 0.6 }}>
            {!isAuthenticated && isMobile ? '✕' : '●'}
          </span>
        </button>
      </div>
    </div>
    
    {/* Modals */}
    <PreferencesModal isOpen={showPreferences} onClose={() => setShowPreferences(false)} />
    <EncryptionSettingsModal isOpen={showEncryption} onClose={() => setShowEncryption(false)} />
    <StorageCalculatorModal isOpen={showStorageCalc} onClose={() => setShowStorageCalc(false)} />
    <KeyboardShortcutsModal isOpen={showKeyboardShortcuts} onClose={() => setShowKeyboardShortcuts(false)} />
    <APIDocumentationModal isOpen={showAPIDoc} onClose={() => setShowAPIDoc(false)} />
    </>
  );
};

export default CleanTaskbar;