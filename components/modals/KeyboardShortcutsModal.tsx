import React from 'react';
import './ModalStyles.css';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { category: 'File Operations', items: [
      { key: '⌘N', description: 'New Document' },
      { key: '⌘O', description: 'Open Document' },
      { key: '⌘S', description: 'Save Document' },
      { key: '⇧⌘S', description: 'Save As' },
      { key: '⌘B', description: 'Save to Blockchain' },
      { key: '⌘W', description: 'Close Document' }
    ]},
    { category: 'Editing', items: [
      { key: '⌘Z', description: 'Undo' },
      { key: '⇧⌘Z', description: 'Redo' },
      { key: '⌘X', description: 'Cut' },
      { key: '⌘C', description: 'Copy' },
      { key: '⌘V', description: 'Paste' },
      { key: '⌘A', description: 'Select All' },
      { key: '⌘F', description: 'Find' }
    ]},
    { category: 'Formatting', items: [
      { key: '⌘B', description: 'Bold' },
      { key: '⌘I', description: 'Italic' },
      { key: '⌘U', description: 'Underline' }
    ]},
    { category: 'Blockchain', items: [
      { key: '⌘L', description: 'Encrypt Document' },
      { key: '⌘K', description: 'Create NFT' },
      { key: '⌘P', description: 'Set Paywall' }
    ]},
    { category: 'View', items: [
      { key: '⌃⌘F', description: 'Full Screen' },
      { key: '⌘+', description: 'Zoom In' },
      { key: '⌘-', description: 'Zoom Out' },
      { key: '⌘0', description: 'Actual Size' },
      { key: '⌥⌘S', description: 'Toggle Sidebar' },
      { key: '⌥⌘D', description: 'Toggle Dark Mode' }
    ]},
    { category: 'Application', items: [
      { key: '⌘,', description: 'Preferences' },
      { key: '⌘H', description: 'Hide Bitcoin Writer' },
      { key: '⌘Q', description: 'Quit' },
      { key: '⌘?', description: 'Help' }
    ]}
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{maxWidth: '800px'}}>
        <div className="modal-header">
          <h2>Keyboard Shortcuts</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          {shortcuts.map((section, idx) => (
            <div key={idx} className="preference-section">
              <h3>{section.category}</h3>
              <div className="shortcuts-grid">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="shortcut-item">
                    <span className="shortcut-description">{item.description}</span>
                    <span className="shortcut-key">{item.key}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;