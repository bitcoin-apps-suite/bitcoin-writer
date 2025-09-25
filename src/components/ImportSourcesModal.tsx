import React, { useState } from 'react';
import './ImportSourcesModal.css';

interface ImportSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (source: string, data: any) => void;
}

const ImportSourcesModal: React.FC<ImportSourcesModalProps> = ({ isOpen, onClose, onImport }) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'writing' | 'notes' | 'cloud' | 'cms' | 'social'>('all');

  if (!isOpen) return null;

  const handleServiceConnect = async (serviceName: string) => {
    setIsLoading(serviceName);
    
    // Simulate connection process
    setTimeout(() => {
      setIsLoading(null);
      alert(`Import from ${serviceName} - Feature coming soon!`);
      // In real implementation, this would open specific import flows for each service
    }, 1500);
  };

  const handleFileImport = (acceptedFormats: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedFormats;
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onImport('file', { content: event.target?.result, fileName: file.name });
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const services = [
    // Writing & Document Platforms
    {
      category: 'writing',
      items: [
        {
          name: 'Google Docs',
          desc: 'Documents & Collaboration',
          logo: 'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_Docs_logo_%282014-2020%29.svg',
          action: () => handleServiceConnect('Google Docs')
        },
        {
          name: 'Microsoft Word',
          desc: 'Word Online & Desktop',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoftword.svg',
          filter: 'invert(44%) sepia(85%) saturate(1352%) hue-rotate(199deg) brightness(98%) contrast(98%)',
          action: () => handleFileImport('.docx,.doc')
        },
        {
          name: 'Dropbox Paper',
          desc: 'Collaborative Docs',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/dropbox.svg',
          filter: 'invert(44%) sepia(95%) saturate(2228%) hue-rotate(197deg) brightness(100%) contrast(102%)',
          action: () => handleServiceConnect('Dropbox Paper')
        },
        {
          name: 'Quip',
          desc: 'Salesforce Docs',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/salesforce.svg',
          filter: 'invert(51%) sepia(85%) saturate(1743%) hue-rotate(166deg) brightness(96%) contrast(101%)',
          action: () => handleServiceConnect('Quip')
        },
        {
          name: 'Scrivener',
          desc: 'Professional Writing',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/write.svg',
          filter: 'invert(1)',
          action: () => handleFileImport('.scriv,.rtf')
        },
        {
          name: 'Ulysses',
          desc: 'Mac/iOS Writing',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
          filter: 'invert(1)',
          action: () => handleServiceConnect('Ulysses')
        },
        {
          name: 'iA Writer',
          desc: 'Focused Writing',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/markdown.svg',
          filter: 'invert(1)',
          action: () => handleFileImport('.md,.txt')
        },
        {
          name: 'Hemingway',
          desc: 'Clear Writing',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/grammarly.svg',
          filter: 'invert(62%) sepia(88%) saturate(482%) hue-rotate(75deg) brightness(94%) contrast(89%)',
          action: () => handleServiceConnect('Hemingway')
        }
      ]
    },
    // Note-taking & Knowledge Management
    {
      category: 'notes',
      items: [
        {
          name: 'Notion',
          desc: 'All-in-one Workspace',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/notion.svg',
          filter: 'invert(1)',
          action: () => handleServiceConnect('Notion')
        },
        {
          name: 'Obsidian',
          desc: 'Markdown Notes',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/obsidian.svg',
          filter: 'invert(53%) sepia(85%) saturate(1832%) hue-rotate(234deg) brightness(98%) contrast(106%)',
          action: () => handleFileImport('.md')
        },
        {
          name: 'Roam Research',
          desc: 'Networked Thought',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/roamresearch.svg',
          filter: 'invert(44%) sepia(95%) saturate(2228%) hue-rotate(197deg) brightness(100%) contrast(102%)',
          action: () => handleServiceConnect('Roam Research')
        },
        {
          name: 'Evernote',
          desc: 'Note Organization',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/evernote.svg',
          filter: 'invert(44%) sepia(81%) saturate(542%) hue-rotate(91deg) brightness(96%) contrast(94%)',
          action: () => handleServiceConnect('Evernote')
        },
        {
          name: 'OneNote',
          desc: 'Microsoft Notes',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoftonenote.svg',
          filter: 'invert(36%) sepia(99%) saturate(1946%) hue-rotate(265deg) brightness(97%) contrast(102%)',
          action: () => handleServiceConnect('OneNote')
        },
        {
          name: 'Bear',
          desc: 'Beautiful Notes',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
          filter: 'invert(35%) sepia(82%) saturate(2512%) hue-rotate(343deg) brightness(102%) contrast(97%)',
          action: () => handleServiceConnect('Bear')
        },
        {
          name: 'Craft',
          desc: 'Documents & Notes',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/craft.svg',
          filter: 'invert(45%) sepia(89%) saturate(1108%) hue-rotate(341deg) brightness(101%) contrast(101%)',
          action: () => handleServiceConnect('Craft')
        },
        {
          name: 'Logseq',
          desc: 'Privacy-first Notes',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/logseq.svg',
          filter: 'invert(1)',
          action: () => handleFileImport('.md')
        },
        {
          name: 'Joplin',
          desc: 'Open Source Notes',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/joplin.svg',
          filter: 'invert(44%) sepia(95%) saturate(2228%) hue-rotate(197deg) brightness(100%) contrast(102%)',
          action: () => handleServiceConnect('Joplin')
        },
        {
          name: 'RemNote',
          desc: 'Spaced Repetition',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/notion.svg',
          filter: 'invert(53%) sepia(85%) saturate(1832%) hue-rotate(180deg) brightness(98%) contrast(106%)',
          action: () => handleServiceConnect('RemNote')
        },
        {
          name: 'Dendron',
          desc: 'Hierarchical Notes',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/visualstudiocode.svg',
          filter: 'invert(44%) sepia(95%) saturate(2228%) hue-rotate(197deg) brightness(100%) contrast(102%)',
          action: () => handleServiceConnect('Dendron')
        },
        {
          name: 'Apple Notes',
          desc: 'iCloud Notes',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/apple.svg',
          filter: 'invert(62%) sepia(88%) saturate(482%) hue-rotate(355deg) brightness(94%) contrast(89%)',
          action: () => handleServiceConnect('Apple Notes')
        }
      ]
    },
    // Cloud Storage
    {
      category: 'cloud',
      items: [
        {
          name: 'Google Drive',
          desc: 'Cloud Storage',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/googledrive.svg',
          filter: 'invert(62%) sepia(88%) saturate(482%) hue-rotate(75deg) brightness(94%) contrast(89%)',
          action: () => handleServiceConnect('Google Drive')
        },
        {
          name: 'OneDrive',
          desc: 'Microsoft Cloud',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/microsoftonedrive.svg',
          filter: 'invert(44%) sepia(95%) saturate(2228%) hue-rotate(197deg) brightness(100%) contrast(102%)',
          action: () => handleServiceConnect('OneDrive')
        },
        {
          name: 'Dropbox',
          desc: 'File Storage',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/dropbox.svg',
          filter: 'invert(44%) sepia(95%) saturate(2228%) hue-rotate(197deg) brightness(100%) contrast(102%)',
          action: () => handleServiceConnect('Dropbox')
        },
        {
          name: 'Box',
          desc: 'Enterprise Storage',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/box.svg',
          filter: 'invert(44%) sepia(95%) saturate(2228%) hue-rotate(197deg) brightness(100%) contrast(102%)',
          action: () => handleServiceConnect('Box')
        },
        {
          name: 'iCloud',
          desc: 'Apple Cloud',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/icloud.svg',
          filter: 'invert(1)',
          action: () => handleServiceConnect('iCloud')
        },
        {
          name: 'pCloud',
          desc: 'Secure Storage',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/pcloud.svg',
          filter: 'invert(58%) sepia(92%) saturate(1457%) hue-rotate(163deg) brightness(100%) contrast(95%)',
          action: () => handleServiceConnect('pCloud')
        }
      ]
    },
    // CMS & Publishing
    {
      category: 'cms',
      items: [
        {
          name: 'WordPress',
          desc: 'Blog & CMS',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/wordpress.svg',
          filter: 'invert(44%) sepia(85%) saturate(1352%) hue-rotate(178deg) brightness(98%) contrast(98%)',
          action: () => handleServiceConnect('WordPress')
        },
        {
          name: 'Medium',
          desc: 'Publishing Platform',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/medium.svg',
          filter: 'invert(1)',
          action: () => handleServiceConnect('Medium')
        },
        {
          name: 'Substack',
          desc: 'Newsletter Platform',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/substack.svg',
          filter: 'invert(62%) sepia(88%) saturate(3082%) hue-rotate(8deg) brightness(100%) contrast(101%)',
          action: () => handleServiceConnect('Substack')
        },
        {
          name: 'Ghost',
          desc: 'Modern Publishing',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/ghost.svg',
          filter: 'invert(1)',
          action: () => handleServiceConnect('Ghost')
        },
        {
          name: 'Confluence',
          desc: 'Team Wiki',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/confluence.svg',
          filter: 'invert(44%) sepia(95%) saturate(2228%) hue-rotate(197deg) brightness(100%) contrast(102%)',
          action: () => handleServiceConnect('Confluence')
        },
        {
          name: 'Contentful',
          desc: 'Headless CMS',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/contentful.svg',
          filter: 'invert(62%) sepia(88%) saturate(482%) hue-rotate(355deg) brightness(94%) contrast(89%)',
          action: () => handleServiceConnect('Contentful')
        },
        {
          name: 'Strapi',
          desc: 'Open Source CMS',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/strapi.svg',
          filter: 'invert(53%) sepia(85%) saturate(1832%) hue-rotate(234deg) brightness(98%) contrast(106%)',
          action: () => handleServiceConnect('Strapi')
        },
        {
          name: 'Wix',
          desc: 'Website Builder',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/wix.svg',
          filter: 'invert(1)',
          action: () => handleServiceConnect('Wix')
        }
      ]
    },
    // Social & Collaboration
    {
      category: 'social',
      items: [
        {
          name: 'LinkedIn',
          desc: 'Articles & Posts',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg',
          filter: 'invert(36%) sepia(99%) saturate(1946%) hue-rotate(178deg) brightness(97%) contrast(102%)',
          action: () => handleServiceConnect('LinkedIn')
        },
        {
          name: 'Twitter/X',
          desc: 'Threads & Posts',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg',
          filter: 'invert(1)',
          action: () => handleServiceConnect('Twitter')
        },
        {
          name: 'Slack',
          desc: 'Team Messages',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/slack.svg',
          filter: 'invert(45%) sepia(85%) saturate(1240%) hue-rotate(286deg) brightness(100%) contrast(95%)',
          action: () => handleServiceConnect('Slack')
        },
        {
          name: 'Discord',
          desc: 'Community Chat',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/discord.svg',
          filter: 'invert(40%) sepia(95%) saturate(1055%) hue-rotate(207deg) brightness(98%) contrast(102%)',
          action: () => handleServiceConnect('Discord')
        },
        {
          name: 'Telegram',
          desc: 'Messages & Channels',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/telegram.svg',
          filter: 'invert(44%) sepia(95%) saturate(2228%) hue-rotate(177deg) brightness(100%) contrast(102%)',
          action: () => handleServiceConnect('Telegram')
        },
        {
          name: 'Reddit',
          desc: 'Posts & Comments',
          logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/reddit.svg',
          filter: 'invert(45%) sepia(89%) saturate(1108%) hue-rotate(341deg) brightness(101%) contrast(101%)',
          action: () => handleServiceConnect('Reddit')
        }
      ]
    }
  ];

  const filteredServices = activeCategory === 'all' 
    ? services.flatMap(cat => cat.items)
    : services.find(cat => cat.category === activeCategory)?.items || [];

  return (
    <div 
      className="import-modal-backdrop" 
      onClick={onClose}
    >
      <div 
        className="import-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="import-modal-header">
          <h2>Import from Writing Platforms</h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M16 1.61L14.39 0L8 6.39L1.61 0L0 1.61L6.39 8L0 14.39L1.61 16L8 9.61L14.39 16L16 14.39L9.61 8L16 1.61Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Sources
          </button>
          <button 
            className={`tab-btn ${activeCategory === 'writing' ? 'active' : ''}`}
            onClick={() => setActiveCategory('writing')}
          >
            Writing Apps
          </button>
          <button 
            className={`tab-btn ${activeCategory === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveCategory('notes')}
          >
            Note-taking
          </button>
          <button 
            className={`tab-btn ${activeCategory === 'cloud' ? 'active' : ''}`}
            onClick={() => setActiveCategory('cloud')}
          >
            Cloud Storage
          </button>
          <button 
            className={`tab-btn ${activeCategory === 'cms' ? 'active' : ''}`}
            onClick={() => setActiveCategory('cms')}
          >
            CMS & Blogs
          </button>
          <button 
            className={`tab-btn ${activeCategory === 'social' ? 'active' : ''}`}
            onClick={() => setActiveCategory('social')}
          >
            Social
          </button>
        </div>

        <div className="import-modal-content">
          <div className="quick-import-section">
            <div className="section-label">Quick Import</div>
            <div className="quick-import-buttons">
              <button 
                className="quick-import-btn"
                onClick={() => handleFileImport('.txt,.md,.rtf')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Text/Markdown
              </button>
              <button 
                className="quick-import-btn"
                onClick={() => handleFileImport('.docx,.doc')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Word Document
              </button>
              <button 
                className="quick-import-btn"
                onClick={() => {
                  const text = prompt('Paste your content here:');
                  if (text) {
                    onImport('paste', { content: text });
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,20H5V4H7V7H17V4H19M12,2A1,1 0 0,1 13,3A1,1 0 0,1 12,4A1,1 0 0,1 11,3A1,1 0 0,1 12,2M19,2H14.82C14.4,0.84 13.3,0 12,0C10.7,0 9.6,0.84 9.18,2H5A2,2 0 0,0 3,4V20A2,2 0 0,0 5,22H19A2,2 0 0,0 21,20V4A2,2 0 0,0 19,2Z"/>
                </svg>
                Paste Text
              </button>
            </div>
          </div>

          <div className="services-section">
            <div className="section-label">Connect to Services</div>
            <div className="services-grid">
              {filteredServices.map((service, index) => (
                <div key={index} className="service-card">
                  {service.logo && (
                    <img 
                      src={service.logo}
                      alt={service.name}
                      className="service-logo"
                      style={service.filter ? { filter: service.filter } : {}}
                      onError={(e) => {
                        // Fallback to a generic icon if logo fails to load
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div className="service-info">
                    <div className="service-name">{service.name}</div>
                    <div className="service-desc">{service.desc}</div>
                  </div>
                  <button 
                    className="service-connect"
                    onClick={service.action}
                    disabled={isLoading === service.name}
                  >
                    {isLoading === service.name ? 'Connecting...' : 'Import'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportSourcesModal;