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
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#4285F4">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,13H16V14H10M10,16H16V17H10M10,10H16V11H10"/>
            </svg>
          ),
          action: () => handleServiceConnect('Google Docs')
        },
        {
          name: 'Microsoft Word',
          desc: 'Word Online & Desktop',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#2B579A">
              <path d="M15.5,2H8.5A1.5,1.5 0 0,0 7,3.5V20.5A1.5,1.5 0 0,0 8.5,22H18.5A1.5,1.5 0 0,0 20,20.5V6.5L15.5,2M17,20H10V19H17V20M17,17H10V16H17V17M14,9L17,6V9H14M11.7,12.2L12.4,15.3L13.1,12.2H14.3L13,16.8H11.8L11,13.9L10.2,16.8H9L7.7,12.2H8.9L9.6,15.3L10.3,12.2H11.7Z"/>
            </svg>
          ),
          action: () => handleFileImport('.docx,.doc')
        },
        {
          name: 'Dropbox Paper',
          desc: 'Collaborative Docs',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0061FF">
              <path d="M12,6.5L17,9.5L12,12.5L7,9.5L12,6.5M7,14.5L12,17.5L17,14.5L12,11.5L7,14.5M12,2L2,8L12,14L22,8L12,2M12,22L7,19L12,16L17,19L12,22Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Dropbox Paper')
        },
        {
          name: 'Quip',
          desc: 'Salesforce Docs',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#00D4AA">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20M10,13H16V14H10M10,16H14V17H10M10,10H16V11H10"/>
            </svg>
          ),
          action: () => handleServiceConnect('Quip')
        },
        {
          name: 'Scrivener',
          desc: 'Professional Writing',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#b8860b">
              <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M20,16H5.17L4,17.17V4H20V16M7,9H17V11H7V9M7,13H14V15H7V13M7,5H17V7H7V5Z"/>
            </svg>
          ),
          action: () => handleFileImport('.scriv,.rtf')
        },
        {
          name: 'Ulysses',
          desc: 'Mac/iOS Writing',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff5e5b">
              <path d="M3,3H21V5H3V3M3,7H21V9H3V7M3,11H21V13H3V11M3,15H21V17H3V15M3,19H21V21H3V19Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Ulysses')
        },
        {
          name: 'iA Writer',
          desc: 'Focused Writing',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#1e88e5">
              <path d="M5,3C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H11V19.5H5A0.5,0.5 0 0,1 4.5,19V5A0.5,0.5 0 0,1 5,4.5H19A0.5,0.5 0 0,1 19.5,5V9.5H21V5C21,3.89 20.11,3 19,3H5M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7M18.5,12C16,12 14,14 14,16.5C14,19 16,21 18.5,21C21,21 23,19 23,16.5C23,14 21,12 18.5,12M18.5,13.5A3,3 0 0,1 21.5,16.5A3,3 0 0,1 18.5,19.5A3,3 0 0,1 15.5,16.5A3,3 0 0,1 18.5,13.5M18.5,14.5A2,2 0 0,0 16.5,16.5A2,2 0 0,0 18.5,18.5A2,2 0 0,0 20.5,16.5A2,2 0 0,0 18.5,14.5Z"/>
            </svg>
          ),
          action: () => handleFileImport('.md,.txt')
        },
        {
          name: 'Hemingway',
          desc: 'Clear Writing',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#f39c12">
              <path d="M19,5V19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M7,7V9H17V7H7M7,11V13H17V11H7M7,15V17H14V15H7Z"/>
            </svg>
          ),
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
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.5,3H19.5A1.5,1.5 0 0,1 21,4.5V19.5A1.5,1.5 0 0,1 19.5,21H4.5A1.5,1.5 0 0,1 3,19.5V4.5A1.5,1.5 0 0,1 4.5,3M7.88,17.25L6.62,16L10.38,12.25L6.63,8.5L7.88,7.25L12.38,11.75V7H14.38V11.75L18.88,7.25L20.13,8.5L16.38,12.25L20.13,16L18.88,17.25L14.38,12.75V17.5H12.38V12.75L7.88,17.25Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Notion')
        },
        {
          name: 'Obsidian',
          desc: 'Markdown Notes',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#7C3AED">
              <path d="M12,2L2,12L12,22L22,12L12,2M12,4.5L19.5,12L12,19.5L4.5,12L12,4.5M12,7L7,12L12,17L17,12L12,7Z"/>
            </svg>
          ),
          action: () => handleFileImport('.md')
        },
        {
          name: 'Roam Research',
          desc: 'Networked Thought',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#206bc4">
              <path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Roam Research')
        },
        {
          name: 'Evernote',
          desc: 'Note Organization',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#2dbe60">
              <path d="M16,9H13V7L12,8L11,7V9H8L10,11H8V14H11V16L12,15L13,16V14H16V11H14L16,9M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5C3,3.89 3.9,3 5,3H9.18C9.6,1.84 10.7,1 12,1C13.3,1 14.4,1.84 14.82,3H19M12,3A1,1 0 0,0 11,4A1,1 0 0,0 12,5A1,1 0 0,0 13,4A1,1 0 0,0 12,3Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Evernote')
        },
        {
          name: 'OneNote',
          desc: 'Microsoft Notes',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#80397b">
              <path d="M17,20V9.5L11.5,4H6V20H17M14,2L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2H14M10,11L8,13L10,15V13H14V11H10Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('OneNote')
        },
        {
          name: 'Bear',
          desc: 'Beautiful Notes',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#cc5200">
              <path d="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22A10,10 0 0,0 22,12C22,6.47 17.5,2 12,2M8.5,9.5A1,1 0 0,1 9.5,8.5A1,1 0 0,1 10.5,9.5A1,1 0 0,1 9.5,10.5A1,1 0 0,1 8.5,9.5M16.5,9.5A1,1 0 0,1 15.5,10.5A1,1 0 0,1 14.5,9.5A1,1 0 0,1 15.5,8.5A1,1 0 0,1 16.5,9.5M12,17.5C9.67,17.5 7.69,16 6.89,14H17.11C16.31,16 14.33,17.5 12,17.5Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Bear')
        },
        {
          name: 'Craft',
          desc: 'Documents & Notes',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#e91e63">
              <path d="M12,2L2,7V12.5C2,18.5 12,22 12,22C12,22 22,18.5 22,12.5V7L12,2M12,4.5L19,8.25V12.5C19,16.43 14.42,19.15 12,19.9C9.58,19.15 5,16.43 5,12.5V8.25L12,4.5M12,7L7,10V12.5C7,15 10,16.5 12,17C14,16.5 17,15 17,12.5V10L12,7Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Craft')
        },
        {
          name: 'Logseq',
          desc: 'Privacy-first Notes',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#5c6bc0">
              <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
            </svg>
          ),
          action: () => handleFileImport('.md')
        },
        {
          name: 'Joplin',
          desc: 'Open Source Notes',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0277bd">
              <path d="M3,2A2,2 0 0,0 1,4V20A2,2 0 0,0 3,22H21A2,2 0 0,0 23,20V4A2,2 0 0,0 21,2H3M3,4H21V20H3V4M5,6V18H19V6H5M7,8H17V16H7V8M9,10V14H15V10H9Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Joplin')
        },
        {
          name: 'RemNote',
          desc: 'Spaced Repetition',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#5e35b1">
              <path d="M9,2V8L12,6L15,8V2H9M21,9H3V21H21V9M5,11H19V19H5V11M7,13V17H11V13H7M13,13V17H17V13H13Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('RemNote')
        },
        {
          name: 'Dendron',
          desc: 'Hierarchical Notes',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#388e3c">
              <path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V20H7L5,20V9H7V11H13V13Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Dendron')
        },
        {
          name: 'Apple Notes',
          desc: 'iCloud Notes',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ffa726">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
            </svg>
          ),
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
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#fdd835">
              <path d="M7.71,3.5L1.15,15L4.58,21L11.13,9.5M9.73,15L6.3,21H19.42L22.85,15M22.28,14L15.42,2H8.58L15.43,14H22.28Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Google Drive')
        },
        {
          name: 'OneDrive',
          desc: 'Microsoft Cloud',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0078d4">
              <path d="M12,5C15.5,5 18.45,7.34 19.46,10.5C21.5,10.94 23,12.62 23,14.65C23,17.06 21.06,19 18.65,19H6A4,4 0 0,1 2,15C2,12.8 3.8,11 6,11C6.07,11 6.13,11 6.2,11C6.07,10.5 6,10 6,9.5A6.5,6.5 0 0,1 12.5,3C12.67,3 12.83,3 13,3.03C12.67,3 12.33,3 12,3V5Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('OneDrive')
        },
        {
          name: 'Dropbox',
          desc: 'File Storage',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0061FF">
              <path d="M12,6.5L17,9.5L12,12.5L7,9.5L12,6.5M7,14.5L12,17.5L17,14.5L12,11.5L7,14.5M12,2L2,8L12,14L22,8L12,2M12,22L7,19L12,16L17,19L12,22Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Dropbox')
        },
        {
          name: 'Box',
          desc: 'Enterprise Storage',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0061d5">
              <path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M7,7V17H17V7H7M9,9H15V11H13V15H11V11H9V9Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Box')
        },
        {
          name: 'iCloud',
          desc: 'Apple Cloud',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#3693f3">
              <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,10.86 5.27,10.58 5.27,10.28C5.27,7.82 7.25,5.84 9.71,5.84C10.7,5.84 11.61,6.16 12.35,6.67C13.07,4.56 15.03,3 17.42,3C20.48,3 22.96,5.47 22.96,8.54C22.96,8.75 22.95,8.96 22.93,9.16C22.97,9.43 23,9.7 23,10C23,12.12 22,14 20.5,15.14L20.26,15L20.26,15C20.26,15 22,15.04 22,15.04Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('iCloud')
        },
        {
          name: 'pCloud',
          desc: 'Secure Storage',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#00bcd4">
              <path d="M19.36,10.04C18.67,6.59 15.65,4 12,4C9.11,4 6.6,5.64 5.36,8.04C2.35,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.36,10.04Z"/>
            </svg>
          ),
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
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#21759b">
              <path d="M12,2C6.5,2 2,6.5 2,12C2,17.5 6.5,22 12,22C17.5,22 22,17.5 22,12C22,6.5 17.5,2 12,2M3.6,12C3.6,10.6 4,9.2 4.7,8L8.1,18.1C5.4,16.7 3.6,14.5 3.6,12M12,20.4C11.1,20.4 10.2,20.2 9.4,19.9L12.3,11.1L15.2,19.5C15.2,19.5 15.2,19.6 15.2,19.6C14.2,20.1 13.1,20.4 12,20.4M13.4,7.3C14,7.3 14.5,7.2 14.5,7.2C15,7.1 15,6.4 14.5,6.5C14.5,6.5 13,6.6 12,6.6C11.1,6.6 9.5,6.5 9.5,6.5C9,6.4 9,7.2 9.5,7.2C9.5,7.2 10,7.3 10.6,7.3L11.9,10.8L10.1,16.3L6.8,7.3C7.4,7.3 7.9,7.2 7.9,7.2C8.4,7.1 8.4,6.4 7.9,6.5C7.9,6.5 6.4,6.6 5.4,6.6C5.2,6.6 5,6.6 4.7,6.6C6.5,4.1 9.1,2.4 12,2.4C14,2.4 15.9,3.1 17.5,4.3C17.4,4.3 17.4,4.3 17.3,4.3C16.4,4.3 15.8,5.1 15.8,5.9C15.8,6.6 16.2,7.3 16.7,8C17,8.6 17.4,9.4 17.4,10.5C17.4,11.3 17.1,12.3 16.6,13.6L15.8,16.3L13.4,7.3M16.1,18.8L19,10.2C19.5,9 19.7,7.9 19.7,7C19.7,6.6 19.7,6.2 19.6,5.9C20.2,7.1 20.5,8.5 20.5,10C20.5,13.9 18.5,17.3 15.5,19.1L16.1,18.8Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('WordPress')
        },
        {
          name: 'Medium',
          desc: 'Publishing Platform',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#000000">
              <path d="M4.37,7.3C4.4,7.05 4.3,6.81 4.12,6.65L2.25,4.4V4.06H8.05L12.53,13.89L16.47,4.06H22V4.4L20.4,5.93C20.27,6.03 20.2,6.21 20.22,6.38V17.62C20.2,17.79 20.27,17.97 20.4,18.07L21.96,19.6V19.94H14.12V19.6L15.73,18.03C15.89,17.88 15.89,17.83 15.89,17.59V8.5L11.4,19.9H10.8L5.57,8.5V16.14C5.5,16.46 5.63,16.78 5.86,17L7.96,19.57V19.9H2V19.57L4.1,17C4.33,16.78 4.43,16.46 4.37,16.14V7.3Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Medium')
        },
        {
          name: 'Substack',
          desc: 'Newsletter Platform',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff6719">
              <path d="M22,5V9L12,13L2,9V5L12,1L22,5M22,9V13L12,17L2,13V9L12,13L22,9M22,13V17L12,21L2,17V13L12,17L22,13Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Substack')
        },
        {
          name: 'Ghost',
          desc: 'Modern Publishing',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#738a94">
              <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.58,20 4,16.42 4,12C4,7.58 7.58,4 12,4C16.42,4 20,7.58 20,12C20,16.42 16.42,20 12,20M10.5,7.5A1.5,1.5 0 0,0 9,9A1.5,1.5 0 0,0 10.5,10.5A1.5,1.5 0 0,0 12,9A1.5,1.5 0 0,0 10.5,7.5M13.5,7.5A1.5,1.5 0 0,0 12,9A1.5,1.5 0 0,0 13.5,10.5A1.5,1.5 0 0,0 15,9A1.5,1.5 0 0,0 13.5,7.5M8,13C8,15.21 9.79,17 12,17C14.21,17 16,15.21 16,13H8Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Ghost')
        },
        {
          name: 'Confluence',
          desc: 'Team Wiki',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#172b4d">
              <path d="M2,21L12,16L22,21V3L12,8L2,3V21M4,5.45L11,8.95V17.15L4,13.65V5.45M20,13.65L13,17.15V8.95L20,5.45V13.65Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Confluence')
        },
        {
          name: 'Contentful',
          desc: 'Headless CMS',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#f7e018">
              <path d="M21.82,9L21,5L16.55,6.5L15.5,2L11.5,3.82L10,2L6,6L2.18,3L2,8L6.5,7.55L8,12L11.82,9L13,14L18,10L21.82,9M21,9.72V14L17,12L14,15V10.28L21,9.72M3,9.72L10,10.28V15L7,12L3,14V9.72Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Contentful')
        },
        {
          name: 'Strapi',
          desc: 'Open Source CMS',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#8e75ff">
              <path d="M7.42,10.05C7.15,10 7,9.85 7,9.58V5A1,1 0 0,1 8,4H19A1,1 0 0,1 20,5V15A1,1 0 0,1 19,16H15.58C15.3,16 15.15,15.85 15.1,15.58L14.32,11.9C14.27,11.72 14.12,11.57 13.95,11.5L10.28,10.73C10.1,10.68 9.95,10.53 9.9,10.35L9.1,6.68C9.03,6.4 8.78,6.15 8.5,6.1L7.42,5.9V10.05M5,10V19A1,1 0 0,0 6,20H16A1,1 0 0,0 17,19V18H8V9H7A1,1 0 0,0 6,10H5M9,12H15V18H9V12Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Strapi')
        },
        {
          name: 'Wix',
          desc: 'Website Builder',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#000000">
              <path d="M13.44,10L12.3,13L12,13.87L11.71,13L10.57,10H9.44L10.95,13.8C10.35,14.58 10,15.26 10,15.26C9.41,14.03 8.2,10.82 7.89,10.06C7.66,9.47 7.37,9 6.59,9C5.79,9 5.5,9.46 5.27,10.06C4.96,10.82 3.75,14 3.16,15.26L2,12.03L0.85,15.26C0.85,15.26 1.41,15.25 2.18,15.25C2.95,15.25 3.42,15.26 3.42,15.26L4.3,12.89L5.18,15.26C5.18,15.26 5.65,15.25 6.42,15.25C7.19,15.25 7.66,15.26 7.66,15.26L9.4,10.87C9.53,10.53 9.63,10.36 10,10.36C10.36,10.36 10.46,10.53 10.59,10.87L12,14.38L13.41,10.87C13.54,10.53 13.64,10.36 14,10.36C14.37,10.36 14.47,10.53 14.6,10.87L16.34,15.26C16.34,15.26 16.81,15.25 17.58,15.25C18.35,15.25 18.82,15.26 18.82,15.26L19.7,12.89L20.58,15.26C20.58,15.26 21.05,15.25 21.82,15.25C22.59,15.25 23.15,15.26 23.15,15.26L22,12.03L20.85,15.26C20.85,15.26 20.28,15.25 19.5,15.25C18.73,15.25 18.16,15.26 18.16,15.26C17.57,14.03 16.36,10.82 16.05,10.06C15.82,9.47 15.53,9 14.75,9C13.95,9 13.66,9.46 13.44,10.06"/>
            </svg>
          ),
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
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#0077b5">
              <path d="M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M18.5,18.5V13.2A3.26,3.26 0 0,0 15.24,9.94C14.39,9.94 13.4,10.46 12.92,11.24V10.13H10.13V18.5H12.92V13.57C12.92,12.8 13.54,12.17 14.31,12.17A1.4,1.4 0 0,1 15.71,13.57V18.5H18.5M6.88,8.56A1.68,1.68 0 0,0 8.56,6.88C8.56,5.95 7.81,5.19 6.88,5.19A1.69,1.69 0 0,0 5.19,6.88C5.19,7.81 5.95,8.56 6.88,8.56M8.27,18.5V10.13H5.5V18.5H8.27Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('LinkedIn')
        },
        {
          name: 'Twitter/X',
          desc: 'Threads & Posts',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#000000">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Twitter')
        },
        {
          name: 'Slack',
          desc: 'Team Messages',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#4a154b">
              <path d="M14.5,10C14.5,8.61 13.39,7.5 12,7.5C10.61,7.5 9.5,8.61 9.5,10V14.5H12C13.39,14.5 14.5,13.39 14.5,12V10M7.5,10C7.5,7.51 9.51,5.5 12,5.5C14.49,5.5 16.5,7.51 16.5,10V12C16.5,14.49 14.49,16.5 12,16.5H9.5V19C9.5,20.39 10.61,21.5 12,21.5C13.39,21.5 14.5,20.39 14.5,19V18H16.5V19C16.5,21.49 14.49,23.5 12,23.5C9.51,23.5 7.5,21.49 7.5,19V10M21.5,12C21.5,10.61 20.39,9.5 19,9.5H18V7.5H19C21.49,7.5 23.5,9.51 23.5,12C23.5,14.49 21.49,16.5 19,16.5C17.61,16.5 16.5,15.39 16.5,14C16.5,12.61 17.61,11.5 19,11.5H19.5V14C19.5,14.28 19.22,14.5 19,14.5C18.72,14.5 18.5,14.28 18.5,14V13H16.5V14C16.5,15.39 17.61,16.5 19,16.5C20.39,16.5 21.5,15.39 21.5,14V12M5,9.5C3.61,9.5 2.5,10.61 2.5,12C2.5,13.39 3.61,14.5 5,14.5H5.5V12C5.5,11.72 5.28,11.5 5,11.5C4.72,11.5 4.5,11.72 4.5,12V13H2.5V12C2.5,9.51 4.51,7.5 7,7.5H8V9.5H7C5.61,9.5 4.5,10.61 4.5,12C4.5,13.39 5.61,14.5 7,14.5C8.39,14.5 9.5,13.39 9.5,12C9.5,10.61 8.39,9.5 7,9.5H5Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Slack')
        },
        {
          name: 'Discord',
          desc: 'Community Chat',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#5865f2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Discord')
        },
        {
          name: 'Telegram',
          desc: 'Messages & Channels',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#26a5e4">
              <path d="M9.78,18.65L10.06,14.42L17.74,7.5C18.08,7.19 17.67,7.04 17.22,7.31L7.74,13.3L3.64,12C2.76,11.75 2.75,11.14 3.84,10.7L19.81,4.54C20.54,4.21 21.24,4.72 20.96,5.84L18.24,18.65C18.05,19.56 17.5,19.78 16.74,19.36L12.6,16.3L10.61,18.23C10.38,18.46 10.19,18.65 9.78,18.65Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Telegram')
        },
        {
          name: 'Reddit',
          desc: 'Posts & Comments',
          icon: (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#ff4500">
              <path d="M14.5,15.41C14.58,15.5 14.58,15.69 14.5,15.8C13.77,16.5 12.41,16.56 12,16.56C11.59,16.56 10.23,16.5 9.5,15.8C9.42,15.69 9.42,15.5 9.5,15.41C9.61,15.31 9.8,15.31 9.91,15.41C10.37,15.87 11.33,15.95 12,15.95C12.67,15.95 13.63,15.87 14.09,15.41C14.2,15.31 14.39,15.31 14.5,15.41M10.75,13.04C10.75,12.47 10.28,12 9.71,12C9.14,12 8.67,12.47 8.67,13.04C8.67,13.61 9.14,14.09 9.71,14.08C10.28,14.08 10.75,13.61 10.75,13.04M14.29,12C13.72,12 13.25,12.47 13.25,13.04C13.25,13.61 13.72,14.08 14.29,14.08C14.86,14.08 15.33,13.61 15.33,13.04C15.33,12.47 14.86,12 14.29,12M22,12C22,17.5 17.5,22 12,22C6.5,22 2,17.5 2,12C2,6.5 6.5,2 12,2C17.5,2 22,6.5 22,12M18.67,12C18.67,11.19 18,10.54 17.22,10.54C16.82,10.54 16.46,10.7 16.2,10.95C15.2,10.23 13.83,9.77 12.3,9.71L12.97,6.58L15.14,7.05C15.16,7.6 15.62,8.04 16.18,8.04C16.75,8.04 17.22,7.57 17.22,7C17.22,6.43 16.75,5.96 16.18,5.96C15.77,5.96 15.41,6.2 15.25,6.55L12.82,6.03C12.75,6 12.68,6.03 12.63,6.07C12.58,6.11 12.54,6.17 12.53,6.24L11.79,9.72C10.24,9.77 8.84,10.23 7.82,10.96C7.56,10.71 7.2,10.56 6.81,10.56C6,10.56 5.35,11.21 5.35,12C5.35,12.61 5.71,13.11 6.21,13.35C6.19,13.5 6.18,13.62 6.18,13.78C6.18,16 8.79,17.85 12,17.85C15.23,17.85 17.85,16.03 17.85,13.78C17.85,13.64 17.84,13.5 17.81,13.35C18.31,13.11 18.67,12.6 18.67,12Z"/>
            </svg>
          ),
          action: () => handleServiceConnect('Reddit')
        }
      ]
    }
  ];

  const filteredServices = activeCategory === 'all' 
    ? services.flatMap(cat => cat.items)
    : services.find(cat => cat.category === activeCategory)?.items || [];

  if (!isOpen) return null;

  return (
    <div 
      className="import-sources-modal-overlay" 
      onClick={onClose}
    >
      <div 
        className="import-sources-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="import-sources-header">
          <h2 className="import-sources-title">Import from Writing Platforms</h2>
          <button className="import-sources-close" onClick={onClose}>
            <svg width="28" height="28" viewBox="0 0 16 16" fill="none">
              <path d="M16 1.61L14.39 0L8 6.39L1.61 0L0 1.61L6.39 8L0 14.39L1.61 16L8 9.61L14.39 16L16 14.39L9.61 8L16 1.61Z" fill="currentColor"/>
            </svg>
          </button>
        </div>

        <div className="import-sources-categories">
          <button 
            className={`import-category-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All Sources
          </button>
          <button 
            className={`import-category-btn ${activeCategory === 'writing' ? 'active' : ''}`}
            onClick={() => setActiveCategory('writing')}
          >
            Writing Apps
          </button>
          <button 
            className={`import-category-btn ${activeCategory === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveCategory('notes')}
          >
            Note-taking
          </button>
          <button 
            className={`import-category-btn ${activeCategory === 'cloud' ? 'active' : ''}`}
            onClick={() => setActiveCategory('cloud')}
          >
            Cloud Storage
          </button>
          <button 
            className={`import-category-btn ${activeCategory === 'cms' ? 'active' : ''}`}
            onClick={() => setActiveCategory('cms')}
          >
            CMS & Blogs
          </button>
          <button 
            className={`import-category-btn ${activeCategory === 'social' ? 'active' : ''}`}
            onClick={() => setActiveCategory('social')}
          >
            Social
          </button>
        </div>

        <div className="import-sources-body">
        <div className="import-sources-content">
          <div className="import-sources-quick-section">
            <div className="import-sources-section-title">Quick Import</div>
            <div className="import-quick-buttons">
              <button 
                className="import-quick-btn"
                onClick={() => handleFileImport('.txt,.md,.rtf')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Text/Markdown
              </button>
              <button 
                className="import-quick-btn"
                onClick={() => handleFileImport('.docx,.doc')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
                Word Document
              </button>
              <button 
                className="import-quick-btn"
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
            <div className="import-sources-section-title">Connect to Services</div>
            <div className="import-sources-grid">
              {filteredServices.map((service, index) => (
                <div key={index} className="import-service-card" onClick={service.action}>
                  <div className="import-service-logo">
                    {service.icon ? service.icon : (
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                      </svg>
                    )}
                  </div>
                  <div className="import-service-name">{service.name}</div>
                  <div className="import-service-desc">{service.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ImportSourcesModal;