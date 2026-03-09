'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './contracts.css';

interface Contract {
  id: string;
  githubIssueNumber: number;
  githubIssueUrl: string;
  title: string;
  description: string;
  reward: string;
  estimatedHours: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'available' | 'claimed' | 'in_progress' | 'submitted' | 'completed' | 'expired';
  category: 'developer' | 'writing';
  assignee?: {
    githubUsername: string;
    handcashHandle?: string;
    claimedAt: string;
    deadline: string;
  };
  pullRequest?: {
    number: number;
    url: string;
    status: 'open' | 'closed' | 'merged';
  };
  skills: string[];
  deliverables: string[];
}

const ContractsPage: React.FC = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [devSidebarCollapsed, setDevSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'developer' | 'writing' | 'contributors' | 'tokenomics'>('developer');
  
  const [claimForm, setClaimForm] = useState({
    githubUsername: '',
    handcashHandle: '',
    estimatedDays: 7
  });

  // Token distribution tracking
  const TOTAL_TOKENS = 1000000000; // 1 billion tokens
  const [tokenDistribution, setTokenDistribution] = useState({
    allocated: 10.125, // 7.8% initial + 2.325% for completed tasks by @b0ase
    reserved: 0,
    available: 89.875
  });

  // Contributors state
  const [contributors, setContributors] = useState<any[]>([]);

  // Completed tasks by @b0ase - total 10.125% allocation
  const completedTasksByFounder = [
    { task: 'Initial React app setup & configuration', allocation: 0.2 },
    { task: 'HandCash authentication integration', allocation: 0.4 },
    { task: 'Document editor with Quill.js', allocation: 0.5 },
    { task: 'BSV blockchain storage service', allocation: 0.3 },
    { task: 'NFT tokenization system', allocation: 0.4 },
    { task: 'Document exchange marketplace', allocation: 0.3 },
    { task: 'Clean taskbar navigation system', allocation: 0.2 },
    { task: 'GitHub OAuth authentication', allocation: 0.3 },
    { task: 'AI Chat Assistant with multiple providers', allocation: 0.6 },
    { task: 'Document versioning with Ordinals', allocation: 0.4 },
    { task: 'Features marketing page', allocation: 0.2 },
    { task: 'Token page & tokenomics design', allocation: 0.3 },
    { task: 'Contributions page & task system', allocation: 0.5 },
    { task: 'Smart contract integration', allocation: 0.4 },
    { task: 'Proof of concept banner', allocation: 0.1 },
    { task: 'Mobile responsive design', allocation: 0.3 },
    { task: 'Document encryption system', allocation: 0.3 },
    { task: 'Storage options (IPFS, Cloud)', allocation: 0.4 },
    { task: 'Social media integrations', allocation: 0.3 },
    { task: 'API documentation', allocation: 0.2 },
    { task: 'Testing & bug fixes', allocation: 0.5 },
    { task: 'Deployment configuration', allocation: 0.3 },
    { task: '✅ Document Persistence Bug Fix (#45)', allocation: 0.3 }
  ];

  useEffect(() => {
    setMounted(true);
    
    const saved = localStorage.getItem('devSidebarCollapsed');
    setDevSidebarCollapsed(saved === 'true');
    setIsMobile(window.innerWidth <= 768);

    // Handle hash-based navigation
    const hash = window.location.hash.slice(1);
    if (hash === 'contributors') {
      setActiveTab('contributors');
    } else if (hash === 'tokenomics') {
      setActiveTab('tokenomics');
    } else if (hash === 'writing') {
      setActiveTab('writing');
    } else if (hash === 'developer') {
      setActiveTab('developer');
    }

    const handleStorageChange = () => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('resize', handleResize);
    
    const checkSidebarState = setInterval(() => {
      const saved = localStorage.getItem('devSidebarCollapsed');
      setDevSidebarCollapsed(saved === 'true');
    }, 100);

    // Load sample contracts
    loadSampleContracts();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('resize', handleResize);
      clearInterval(checkSidebarState);
    };
  }, []);

  const loadSampleContracts = () => {
    const realGithubContracts: Contract[] = [
      {
        id: 'contract-47',
        githubIssueNumber: 47,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/47',
        title: 'Implement MAIP (Multi-Authoring in Public) Foundation',
        description: 'A revolutionary collaborative writing system where multiple authors work together in real-time on the blockchain. Every contribution is tracked and rewarded through micropayments.',
        reward: '8,000 BWRITER (0.8%)',
        estimatedHours: 320,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['TypeScript', 'React', 'Real-time collaboration', 'BSV Blockchain', 'AI Integration', 'Smart Contracts'],
        deliverables: ['Collaborative infrastructure', 'AI valuation system', 'Payment automation', 'Public collaboration features']
      },
      {
        id: 'contract-45',
        githubIssueNumber: 45,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/45',
        title: 'Enhance Document Persistence - Users Cannot Access Published Documents on Re-login',
        description: 'Currently, users cannot see their published documents when they log back into Bitcoin Writer. Published documents are not persisted in a way that allows retrieval across sessions.',
        reward: '3,000 BWRITER (0.3%)',
        estimatedHours: 24,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['TypeScript', 'LocalStorage', 'Blockchain Storage', 'Document Management'],
        deliverables: ['Enhanced document retrieval', 'Cross-session persistence', 'UI indicators', 'Sync functionality']
      },
      {
        id: 'contract-44',
        githubIssueNumber: 44,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/44',
        title: 'Replace deprecated execCommand with modern alternatives',
        description: 'The document.execCommand API is deprecated and will be removed from browsers. We need to replace all instances with modern ContentEditable APIs or custom implementations to ensure long-term compatibility.',
        reward: '4,000 BWRITER (0.0004%)',
        estimatedHours: 16,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['JavaScript', 'DOM APIs', 'Browser Compatibility', 'ContentEditable API'],
        deliverables: ['Modern API implementation', 'Browser testing', 'Backward compatibility', 'Performance optimization']
      },
      {
        id: 'contract-43',
        githubIssueNumber: 43,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/43',
        title: 'Implement Google Drive OAuth Integration',
        description: 'Enable users to save and load documents directly from their Google Drive, providing seamless cloud storage integration alongside blockchain storage.',
        reward: '5,000 BWRITER (0.5%)',
        estimatedHours: 20,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['OAuth 2.0', 'Google Drive API', 'Cloud Storage', 'File Management'],
        deliverables: ['OAuth authentication flow', 'Google Drive API integration', 'File picker UI', 'Save/Load functionality']
      },
      {
        id: 'contract-42',
        githubIssueNumber: 42,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/42',
        title: 'Implement Autosave Functionality',
        description: 'Automatically save documents as users type to prevent data loss. Implement intelligent autosave with conflict resolution.',
        reward: '2,500 BWRITER (0.25%)',
        estimatedHours: 12,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['JavaScript', 'Local Storage', 'Conflict Resolution', 'UX Design'],
        deliverables: ['Autosave functionality', 'Conflict resolution', 'Data recovery', 'User notifications']
      },
      {
        id: 'contract-41',
        githubIssueNumber: 41,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/41',
        title: 'Implement Token Distribution System',
        description: 'Create a comprehensive token distribution system for rewarding contributors, developers, and content creators with BWRITER tokens based on their contributions.',
        reward: '6,000 BWRITER (0.6%)',
        estimatedHours: 48,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Smart Contracts', 'Token Economics', 'Distribution Logic', 'Blockchain Integration'],
        deliverables: ['Token distribution system', 'Contribution tracking', 'Reward calculation', 'Automated payouts']
      },
      {
        id: 'contract-40',
        githubIssueNumber: 40,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/40',
        title: 'Implement Export to PDF',
        description: 'Add the ability to export documents as PDF files with proper formatting, images, and metadata preservation.',
        reward: '3,000 BWRITER (0.3%)',
        estimatedHours: 24,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['JavaScript', 'PDF Generation', 'Document Export', 'File Handling'],
        deliverables: ['PDF export functionality', 'Format preservation', 'Metadata embedding', 'Download implementation']
      },
      {
        id: 'contract-39',
        githubIssueNumber: 39,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/39',
        title: 'Integrate Micro-Ordinals for Document Inscription',
        description: 'Replace the current placeholder inscription system with actual micro-ordinals implementation. This will enable permanent, immutable document storage on the BSV blockchain using the ordinals protocol.',
        reward: '10,000 BWRITER (0.001%)',
        estimatedHours: 80,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['BSV Blockchain', 'Micro-ordinals', 'Inscription Protocol', 'Cryptography'],
        deliverables: ['Micro-ordinals integration', 'Inscription functionality', 'Fee calculation', 'Explorer links']
      },
      {
        id: 'contract-38',
        githubIssueNumber: 38,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/38',
        title: 'Implement Save As Functionality',
        description: 'The Save As feature allows users to save documents with a new name while preserving the original. This is essential for creating document copies and versions.',
        reward: '2,000 BWRITER (0.2%)',
        estimatedHours: 8,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['TypeScript', 'React', 'File Management', 'Document Handling'],
        deliverables: ['Save As dialog', 'Document copying', 'Version management', 'UI integration']
      },
      {
        id: 'contract-37',
        githubIssueNumber: 37,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/37',
        title: 'Implement Open Document from Blockchain',
        description: 'Currently, the Open functionality in the File menu shows a Coming soon alert. We need to implement the ability to open documents stored on the BSV blockchain.',
        reward: '5,000 BWRITER (0.5%)',
        estimatedHours: 40,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['BSV Blockchain', 'Document Retrieval', 'Encryption', 'File Management'],
        deliverables: ['Document browser', 'Transaction ID search', 'Document preview', 'Decryption handling']
      },
      {
        id: 'contract-36',
        githubIssueNumber: 36,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/36',
        title: 'Two-Factor Authentication',
        description: 'Add 2FA support for enhanced account security. Implement TOTP-based authentication with backup codes.',
        reward: '1,500 BWRITER (0.15%)',
        estimatedHours: 20,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Security', 'Authentication', 'Two-Factor Auth', 'User Management'],
        deliverables: ['2FA implementation', 'Security enhancements', 'User authentication', 'Account protection']
      },
      {
        id: 'contract-35',
        githubIssueNumber: 35,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/35',
        title: 'Security Audit',
        description: 'Conduct comprehensive security audit and implement recommendations. Focus on authentication, data protection, and smart contract security.',
        reward: '2,000 BWRITER (0.2%)',
        estimatedHours: 32,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Security Audit', 'Penetration Testing', 'Vulnerability Assessment', 'Security Best Practices'],
        deliverables: ['Security audit report', 'Vulnerability fixes', 'Security recommendations', 'Implementation guide']
      },
      {
        id: 'contract-34',
        githubIssueNumber: 34,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/34',
        title: 'Unit Test Coverage',
        description: 'Achieve 80% unit test coverage with Jest and React Testing Library. Write comprehensive tests for all core functionality.',
        reward: '1,250 BWRITER (0.125%)',
        estimatedHours: 40,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Jest', 'React Testing Library', 'Unit Testing', 'Test Coverage'],
        deliverables: ['Unit test suite', '80% test coverage', 'Testing documentation', 'CI integration']
      },
      {
        id: 'contract-33',
        githubIssueNumber: 33,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/33',
        title: 'End-to-End Testing Suite',
        description: 'Implement Cypress E2E tests for critical user flows including document creation, editing, publishing, and blockchain operations.',
        reward: '1,500 BWRITER (0.15%)',
        estimatedHours: 24,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Cypress', 'E2E Testing', 'Test Automation', 'Quality Assurance'],
        deliverables: ['E2E test suite', 'Critical flow coverage', 'Test automation', 'CI/CD integration']
      },
      {
        id: 'contract-32',
        githubIssueNumber: 32,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/32',
        title: 'API Documentation',
        description: 'Write comprehensive API documentation with OpenAPI spec and SDK guides. Document all endpoints, authentication, and blockchain interactions.',
        reward: '1,000 BWRITER (0.1%)',
        estimatedHours: 16,
        priority: 'Medium',
        status: 'available',
        category: 'writing',
        skills: ['Technical Writing', 'API Documentation', 'OpenAPI', 'SDK Documentation'],
        deliverables: ['API documentation', 'OpenAPI specification', 'SDK guides', 'Code examples']
      },
      {
        id: 'contract-31',
        githubIssueNumber: 31,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/31',
        title: 'Version Control UI',
        description: 'Build UI for document version history, diffs, and rollback functionality. Enable users to view and manage document versions.',
        reward: '1,750 BWRITER (0.175%)',
        estimatedHours: 28,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['React', 'UI/UX Design', 'Version Control', 'Git Integration'],
        deliverables: ['Version history UI', 'Diff visualization', 'Rollback functionality', 'User interface']
      },
      {
        id: 'contract-30',
        githubIssueNumber: 30,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/30',
        title: 'E-Signature Integration',
        description: 'Add legally binding e-signature functionality with blockchain verification. Enable document signing with cryptographic proof.',
        reward: '2,250 BWRITER (0.225%)',
        estimatedHours: 36,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['E-Signatures', 'Legal Compliance', 'Blockchain Verification', 'Cryptography'],
        deliverables: ['E-signature system', 'Legal compliance', 'Blockchain verification', 'Document signing']
      },
      {
        id: 'contract-29',
        githubIssueNumber: 29,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/29',
        title: 'Voice Dictation & Commands',
        description: 'Implement voice-to-text and voice commands using Web Speech API. Enable hands-free document creation and editing.',
        reward: '1,500 BWRITER (0.15%)',
        estimatedHours: 20,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Web Speech API', 'Voice Recognition', 'Audio Processing', 'Browser APIs'],
        deliverables: ['Voice dictation', 'Voice commands', 'Speech recognition', 'Audio controls']
      },
      {
        id: 'contract-28',
        githubIssueNumber: 28,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/28',
        title: 'Accessibility Improvements',
        description: 'Ensure WCAG 2.1 AA compliance, screen reader support, keyboard navigation, and proper ARIA labels throughout the application.',
        reward: '1,500 BWRITER (0.15%)',
        estimatedHours: 24,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Accessibility', 'WCAG Compliance', 'Screen Readers', 'Keyboard Navigation'],
        deliverables: ['WCAG compliance', 'Screen reader support', 'Keyboard navigation', 'Accessibility audit']
      },
      {
        id: 'contract-27',
        githubIssueNumber: 27,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/27',
        title: 'Multi-language Support (i18n)',
        description: 'Implement internationalization for UI in Spanish, Chinese, Japanese, French, German. Create translation framework and manage localized content.',
        reward: '1,250 BWRITER (0.125%)',
        estimatedHours: 32,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Internationalization', 'Localization', 'Multi-language', 'UI Translation'],
        deliverables: ['i18n framework', 'Language translations', 'Locale switching', 'Translation management']
      },
      {
        id: 'contract-26',
        githubIssueNumber: 26,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/26',
        title: 'Writing Analytics',
        description: 'Track writing productivity, word count goals, and writing streaks. Help users understand their writing patterns and improve productivity.',
        reward: '1,000 BWRITER (0.1%)',
        estimatedHours: 16,
        priority: 'Low',
        status: 'available',
        category: 'developer',
        skills: ['Analytics', 'Data Visualization', 'User Metrics', 'Progress Tracking'],
        deliverables: ['Analytics dashboard', 'Writing metrics', 'Goal tracking', 'Progress visualization']
      },
      {
        id: 'contract-25',
        githubIssueNumber: 25,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/25',
        title: 'Document Analytics Dashboard',
        description: 'Add analytics for document views, shares, earnings, and reader engagement. Provide authors with insights into their content performance.',
        reward: '1,250 BWRITER (0.125%)',
        estimatedHours: 20,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Analytics', 'Dashboard Development', 'Data Visualization', 'User Engagement'],
        deliverables: ['Analytics dashboard', 'View tracking', 'Engagement metrics', 'Revenue analytics']
      },
      {
        id: 'contract-24',
        githubIssueNumber: 24,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/24',
        title: 'Smart Contract Templates',
        description: 'Create reusable smart contract templates for document agreements and escrow. Enable automated contract execution and dispute resolution.',
        reward: '2,500 BWRITER (0.25%)',
        estimatedHours: 40,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['Smart Contracts', 'BSV Blockchain', 'Contract Templates', 'Escrow Systems'],
        deliverables: ['Contract templates', 'Escrow functionality', 'Agreement systems', 'Template library']
      },
      {
        id: 'contract-23',
        githubIssueNumber: 23,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/23',
        title: 'Document Template Library',
        description: 'Create template library for contracts, letters, resumes, invoices, and more. Enable users to start with professional document templates.',
        reward: '1,250 BWRITER (0.125%)',
        estimatedHours: 20,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Template System', 'Document Templates', 'UI Design', 'Content Management'],
        deliverables: ['Template library', 'Document templates', 'Template editor', 'Template management']
      },
      {
        id: 'contract-22',
        githubIssueNumber: 22,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/22',
        title: 'Browser Extension',
        description: 'Build Chrome/Firefox extension for quick document creation and web clipping. Enable users to capture web content and start writing.',
        reward: '2,000 BWRITER (0.2%)',
        estimatedHours: 32,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Browser Extensions', 'Chrome API', 'Firefox API', 'Web Clipping'],
        deliverables: ['Chrome extension', 'Firefox extension', 'Web clipping', 'Quick creation tools']
      },
      {
        id: 'contract-21',
        githubIssueNumber: 21,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/21',
        title: 'React Native Mobile App',
        description: 'Build React Native mobile app for iOS and Android with full feature parity. Enable mobile document creation and editing.',
        reward: '4,000 BWRITER (0.0004%)',
        estimatedHours: 80,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['React Native', 'Mobile Development', 'iOS', 'Android'],
        deliverables: ['iOS app', 'Android app', 'Feature parity', 'Mobile optimization']
      },
      {
        id: 'contract-20',
        githubIssueNumber: 20,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/20',
        title: 'MS Word Import/Export',
        description: 'Add support for .docx file import and export with formatting preservation. Enable seamless integration with Microsoft Office workflows.',
        reward: '2,000 BWRITER (0.2%)',
        estimatedHours: 28,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['File Processing', 'DOCX Format', 'Import/Export', 'Format Preservation'],
        deliverables: ['DOCX import', 'DOCX export', 'Format preservation', 'File conversion']
      },
      {
        id: 'contract-19',
        githubIssueNumber: 19,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/19',
        title: 'PDF Import/Export',
        description: 'Enable users to import PDF documents for editing and export as PDF. Maintain formatting and support text extraction from PDFs.',
        reward: '1,500 BWRITER (0.15%)',
        estimatedHours: 24,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['PDF Processing', 'Import/Export', 'Document Conversion', 'File Handling'],
        deliverables: ['PDF import', 'PDF export', 'Text extraction', 'Format conversion']
      },
      {
        id: 'contract-18',
        githubIssueNumber: 18,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/18',
        title: 'Implement Advanced Text Formatting',
        description: 'Add advanced text formatting options including tables, footnotes, headers/footers, page breaks, and custom styles.',
        reward: '2,500 BWRITER (0.25%)',
        estimatedHours: 32,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Rich Text Editing', 'Document Formatting', 'CSS Styling', 'Editor Plugins'],
        deliverables: ['Advanced formatting tools', 'Table editor', 'Style management', 'Layout controls']
      },
      {
        id: 'contract-17',
        githubIssueNumber: 17,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/17',
        title: 'Optimize Performance',
        description: 'Improve document loading times, reduce bundle size by 30%, implement code splitting, and optimize rendering performance.',
        reward: '1,750 BWRITER (0.175%)',
        estimatedHours: 32,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Performance Optimization', 'Code Splitting', 'Bundle Analysis', 'Loading Optimization'],
        deliverables: ['Performance improvements', 'Bundle size reduction', 'Code splitting', 'Loading optimization']
      },
      {
        id: 'contract-16',
        githubIssueNumber: 16,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/16',
        title: 'IPFS Storage Integration',
        description: 'Add IPFS as an alternative storage backend for documents, with pinning service integration for reliable decentralized storage.',
        reward: '2,000 BWRITER (0.2%)',
        estimatedHours: 28,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['IPFS', 'Decentralized Storage', 'Pinning Services', 'Storage Integration'],
        deliverables: ['IPFS integration', 'Storage backend', 'Pinning service', 'Document storage']
      },
      {
        id: 'contract-15',
        githubIssueNumber: 15,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/15',
        title: 'Comment & Review System',
        description: 'Implement commenting, suggestions, and review workflow for documents. Enable collaborative editing with feedback mechanisms.',
        reward: '2,000 BWRITER (0.2%)',
        estimatedHours: 32,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Collaboration Features', 'Comment System', 'Review Workflow', 'Real-time Updates'],
        deliverables: ['Comment system', 'Review workflow', 'Suggestions', 'Collaboration tools']
      },
      {
        id: 'contract-14',
        githubIssueNumber: 14,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/14',
        title: 'Real-time Collaborative Editing',
        description: 'Add real-time collaborative editing using WebRTC and CRDTs for multiple users. Enable Google Docs-style collaboration.',
        reward: '3,500 BWRITER (0.35%)',
        estimatedHours: 56,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['WebRTC', 'CRDTs', 'Real-time Collaboration', 'Conflict Resolution'],
        deliverables: ['Real-time editing', 'Collaborative features', 'Conflict resolution', 'Multi-user support']
      },
      {
        id: 'contract-13',
        githubIssueNumber: 13,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/13',
        title: 'AI Model Fine-tuning',
        description: 'Fine-tune language models for specific writing tasks and document types. Improve AI assistance for different writing styles.',
        reward: '2,500 BWRITER (0.25%)',
        estimatedHours: 40,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Machine Learning', 'AI Model Training', 'Natural Language Processing', 'Model Fine-tuning'],
        deliverables: ['Fine-tuned models', 'Training pipeline', 'Model optimization', 'AI integration']
      },
      {
        id: 'contract-12',
        githubIssueNumber: 12,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/12',
        title: 'Enhance AI Assistant',
        description: 'Improve AI chat with document context awareness, auto-suggestions, and writing style learning. Make AI more helpful and contextual.',
        reward: '2,000 BWRITER (0.2%)',
        estimatedHours: 32,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['AI Integration', 'Natural Language Processing', 'Context Awareness', 'Machine Learning'],
        deliverables: ['Enhanced AI assistant', 'Context awareness', 'Auto-suggestions', 'Style learning']
      },
      {
        id: 'contract-11',
        githubIssueNumber: 11,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/11',
        title: 'Document NFT Marketplace',
        description: 'Create marketplace for buying/selling document NFTs with royalty distribution. Enable creators to monetize their work as NFTs.',
        reward: '3,000 BWRITER (0.3%)',
        estimatedHours: 48,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['NFT Marketplace', 'Smart Contracts', 'Royalty Distribution', 'Blockchain Integration'],
        deliverables: ['NFT marketplace', 'Trading system', 'Royalty distribution', 'Document NFTs']
      },
      {
        id: 'contract-10',
        githubIssueNumber: 10,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/10',
        title: 'Bitcoin Writer Exchange',
        description: 'Build decentralized exchange for trading document shares and NFTs with order book and liquidity pools.',
        reward: '5,000 BWRITER (0.5%)',
        estimatedHours: 80,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['Decentralized Exchange', 'Order Book', 'Liquidity Pools', 'Trading Engine'],
        deliverables: ['DEX platform', 'Order book system', 'Liquidity pools', 'Trading interface']
      },
      {
        id: 'contract-9',
        githubIssueNumber: 9,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/9',
        title: 'Real BSV Price Feed Integration',
        description: 'Replace mock pricing (currently returns 0) with CoinGecko or similar API for real-time BSV/USD rates.',
        reward: '1,000 BWRITER (0.1%)',
        estimatedHours: 8,
        priority: 'Low',
        status: 'available',
        category: 'developer',
        skills: ['API Integration', 'Price Feeds', 'Real-time Data', 'Financial APIs'],
        deliverables: ['Price feed integration', 'Real-time rates', 'API connection', 'Rate display']
      },
      {
        id: 'contract-8',
        githubIssueNumber: 8,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/8',
        title: 'Document Tokenization Logic',
        description: 'Implement actual tokenization logic in DocumentEditor.tsx to create tradeable document shares.',
        reward: '2,500 BWRITER (0.25%)',
        estimatedHours: 40,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Tokenization', 'Smart Contracts', 'Document Shares', 'Blockchain Integration'],
        deliverables: ['Tokenization system', 'Document shares', 'Trading logic', 'Token management']
      },
      {
        id: 'contract-7',
        githubIssueNumber: 7,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/7',
        title: 'Paywall System Implementation',
        description: 'Create paywall functionality for monetizing documents with BSV micropayments. Enable creators to earn from their content.',
        reward: '3,000 BWRITER (0.3%)',
        estimatedHours: 48,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Payment Systems', 'BSV Micropayments', 'Monetization', 'Paywall Logic'],
        deliverables: ['Paywall system', 'Micropayments', 'Content monetization', 'Payment processing']
      },
      {
        id: 'contract-6',
        githubIssueNumber: 6,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/6',
        title: 'Implement Contract Management System',
        description: 'Build a comprehensive contract management system for handling development tasks, payments, and deliverables.',
        reward: '3,500 BWRITER (0.35%)',
        estimatedHours: 56,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Contract Management', 'Task Tracking', 'Payment Processing', 'Project Management'],
        deliverables: ['Contract system', 'Task management', 'Payment automation', 'Progress tracking']
      },
      {
        id: 'contract-5',
        githubIssueNumber: 5,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/5',
        title: 'Implement HandCash Signature Verification',
        description: 'Implement real HandCash cryptographic signature verification to secure contract claims and transactions. Currently using mock signatures which is a security risk.',
        reward: '4,000 BWRITER (0.0004%)',
        estimatedHours: 32,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['Cryptography', 'HandCash SDK', 'Security', 'Signature Verification'],
        deliverables: ['HandCash integration', 'Signature verification', 'Security audit', 'Documentation']
      },
      {
        id: 'contract-4',
        githubIssueNumber: 4,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/4',
        title: 'Share Token Creation System',
        description: 'Implement document share tokens as separate inscriptions for granular access control and monetization.',
        reward: '3,000 BWRITER (0.3%)',
        estimatedHours: 48,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Token Systems', 'Access Control', 'Blockchain Inscriptions', 'Granular Permissions'],
        deliverables: ['Share token system', 'Access control', 'Token inscriptions', 'Permission management']
      },
      {
        id: 'contract-3',
        githubIssueNumber: 3,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/3',
        title: 'Implement Document Sharing System',
        description: 'Create a comprehensive document sharing system with granular permissions, link sharing, and access controls.',
        reward: '2,500 BWRITER (0.25%)',
        estimatedHours: 40,
        priority: 'Medium',
        status: 'available',
        category: 'developer',
        skills: ['Sharing Systems', 'Access Control', 'Link Generation', 'Permissions Management'],
        deliverables: ['Sharing system', 'Permission controls', 'Link sharing', 'Access management']
      },
      {
        id: 'contract-2',
        githubIssueNumber: 2,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/2',
        title: 'Implement Document Encryption',
        description: 'Add end-to-end encryption for documents to ensure privacy and security. Implement client-side encryption before blockchain storage.',
        reward: '3,500 BWRITER (0.35%)',
        estimatedHours: 56,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Encryption', 'Cryptography', 'Security', 'Privacy Protection'],
        deliverables: ['Encryption system', 'Key management', 'Secure storage', 'Privacy controls']
      },
      {
        id: 'contract-1',
        githubIssueNumber: 1,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/1',
        title: '[CRITICAL] Implement Micro-Ordinals Inscription',
        description: 'Replace mock inscription with actual micro-ordinals implementation for document storage on BSV blockchain. Currently using localStorage as a placeholder.',
        reward: '5,000 BWRITER (0.5%)',
        estimatedHours: 60,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['Micro-ordinals', 'BSV Blockchain', 'Document Storage', 'Blockchain Infrastructure'],
        deliverables: ['Micro-ordinals implementation', 'Blockchain storage', 'Document inscription', 'Storage infrastructure']
      },
      {
        id: 'contract-exchange-1',
        githubIssueNumber: 48,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/48',
        title: 'Build BWRITER Token Exchange Frontend',
        description: 'Create a comprehensive trading interface for BWRITER tokens with real-time order book, price charts, wallet integration, and live market data. Replace 1sat.market dependency with native Bitcoin Writer exchange.',
        reward: '10,000 BWRITER (0.001%)',
        estimatedHours: 80,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['React', 'TypeScript', 'Trading UI', 'Real-time Data', 'BSV Integration', 'Chart Libraries'],
        deliverables: ['Trading interface', 'Order book UI', 'Price charts', 'Wallet connection', 'Market data dashboard']
      },
      {
        id: 'contract-exchange-2',
        githubIssueNumber: 49,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/49',
        title: 'Implement Exchange Backend APIs',
        description: 'Build robust backend infrastructure for the BWRITER token exchange including order management, market data aggregation, trade execution, and BSV blockchain integration.',
        reward: '10,000 BWRITER (0.001%)',
        estimatedHours: 100,
        priority: 'Critical',
        status: 'available',
        category: 'developer',
        skills: ['Node.js', 'API Development', 'Database Design', 'BSV SDK', 'Trading Engine', 'Real-time WebSockets'],
        deliverables: ['Order management API', 'Market data endpoints', 'Trade execution engine', 'Blockchain integration', 'WebSocket feeds']
      },
      {
        id: 'contract-exchange-3',
        githubIssueNumber: 50,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/50',
        title: 'Exchange Security & Testing Suite',
        description: 'Implement comprehensive security measures and testing for the Bitcoin Writer exchange including trade validation, wallet security, API rate limiting, and extensive test coverage.',
        reward: '8,000 BWRITER (0.8%)',
        estimatedHours: 64,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Security Testing', 'API Security', 'Trading System Testing', 'Penetration Testing', 'Jest', 'Cypress'],
        deliverables: ['Security audit', 'Test suite', 'Rate limiting', 'Input validation', 'Trade verification']
      },
      {
        id: 'contract-ordinals-1',
        githubIssueNumber: 51,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/51',
        title: 'Advanced Ordinals Integration',
        description: 'Enhance the ordinals system with batch inscription capabilities, metadata management, collection features, and integration with the BWRITER token ecosystem.',
        reward: '9,000 BWRITER (0.9%)',
        estimatedHours: 72,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Ordinals Protocol', 'BSV Blockchain', 'Batch Processing', 'Metadata Standards', 'NFT Technology'],
        deliverables: ['Batch inscription', 'Metadata system', 'Collection management', 'Ordinals explorer', 'Token integration']
      },
      {
        id: 'contract-ordinals-2',
        githubIssueNumber: 52,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/52',
        title: 'Ordinals Marketplace Integration',
        description: 'Create marketplace functionality for trading document ordinals and NFTs within the Bitcoin Writer ecosystem, with BWRITER token payment integration.',
        reward: '10,000 BWRITER (0.001%)',
        estimatedHours: 80,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['Marketplace Development', 'NFT Trading', 'Smart Contracts', 'Payment Processing', 'UI/UX Design'],
        deliverables: ['Marketplace interface', 'Trading system', 'Payment integration', 'Listing management', 'Transaction history']
      },
      {
        id: 'contract-exchange-4',
        githubIssueNumber: 53,
        githubIssueUrl: 'https://github.com/bitcoin-apps-suite/bitcoin-writer/issues/53',
        title: 'Exchange Deployment & Monitoring',
        description: 'Deploy the Bitcoin Writer exchange to production with monitoring, analytics, backup systems, and automated failover capabilities.',
        reward: '7,000 BWRITER (0.7%)',
        estimatedHours: 56,
        priority: 'High',
        status: 'available',
        category: 'developer',
        skills: ['DevOps', 'Production Deployment', 'Monitoring', 'Analytics', 'Backup Systems', 'Cloud Infrastructure'],
        deliverables: ['Production deployment', 'Monitoring dashboard', 'Analytics integration', 'Backup system', 'Performance optimization']
      }
    ];

    setContracts(realGithubContracts);
    setLoading(false);
  };

  const handleClaimContract = async () => {
    if (!selectedContract || !claimForm.githubUsername || !claimForm.handcashHandle) {
      alert('Please fill in all required fields');
      return;
    }
    
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + claimForm.estimatedDays);
    
    const contractClaim = {
      assignee: {
        githubUsername: claimForm.githubUsername,
        handcashHandle: claimForm.handcashHandle,
        claimedAt: new Date().toISOString(),
        deadline: deadline.toISOString()
      }
    };
    
    const updatedContracts = contracts.map(c => 
      c.id === selectedContract.id 
        ? { ...c, status: 'claimed' as Contract['status'], assignee: contractClaim.assignee }
        : c
    );
    setContracts(updatedContracts);
    
    setShowClaimModal(false);
    setSelectedContract(null);
    
    alert(`Contract claimed successfully! You have ${claimForm.estimatedDays} days to complete this task.`);
  };

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'claimed': return '#f59e0b';
      case 'in_progress': return '#3b82f6';
      case 'submitted': return '#8b5cf6';
      case 'completed': return '#6b7280';
      case 'expired': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days remaining`;
    if (hours > 0) return `${hours} hours remaining`;
    return 'Less than 1 hour';
  };

  const filteredContracts = contracts.filter(c => c.category === activeTab);

  return (
    <div className="app-wrapper">
      <div className={`contracts-page ${mounted && !isMobile && !devSidebarCollapsed ? 'with-sidebar-expanded' : ''} ${mounted && !isMobile && devSidebarCollapsed ? 'with-sidebar-collapsed' : ''}`}>
        <div className="contracts-container">
          {/* Hero Section */}
          <section className="contracts-hero">
            <h1><span style={{color: '#f7931a'}}>Bitcoin Writer</span> <span style={{color: '#ffffff'}}>Contracts</span></h1>
            <p className="contracts-tagline">
              {activeTab === 'developer' 
                ? 'Real GitHub issues as paid contracts. Claim tasks, submit PRs, earn BWRITER tokens.'
                : 'Create content, fulfill contracts, get paid in BWRITER'}
            </p>
            <div className="contracts-badge">CONTRACTS</div>
          </section>

          {/* Tab Navigation */}
          <section className="contracts-tabs-section">
            <div className="contracts-tabs">
              <button 
                className={activeTab === 'developer' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('developer');
                  window.history.pushState({}, '', '/contracts#developer');
                }}
              >
                Developer Contracts
              </button>
              <button 
                className={activeTab === 'writing' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('writing');
                  window.history.pushState({}, '', '/contracts#writing');
                }}
              >
                Writing Contracts
              </button>
              <button 
                className={activeTab === 'contributors' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('contributors');
                  window.history.pushState({}, '', '/contracts#contributors');
                }}
              >
                Contributors
              </button>
              <button 
                className={activeTab === 'tokenomics' ? 'active' : ''}
                onClick={() => {
                  setActiveTab('tokenomics');
                  window.history.pushState({}, '', '/contracts#tokenomics');
                }}
              >
                Tokenomics
              </button>
            </div>
          </section>

          {/* Stats Cards - only show for contracts tabs */}
          {(activeTab === 'developer' || activeTab === 'writing') && (
            <div className="contracts-stats">
              <div className="stat-card">
                <span className="stat-value">{filteredContracts.filter(c => c.status === 'available').length}</span>
                <span className="stat-label">Available</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{filteredContracts.filter(c => c.status === 'in_progress' || c.status === 'claimed').length}</span>
                <span className="stat-label">In Progress</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{filteredContracts.filter(c => c.status === 'submitted').length}</span>
                <span className="stat-label">Under Review</span>
              </div>
              <div className="stat-card">
                <span className="stat-value">{filteredContracts.filter(c => c.status === 'completed').length}</span>
                <span className="stat-label">Completed</span>
              </div>
            </div>
          )}

          {/* Contracts Grid - only show for contracts tabs */}
          {(activeTab === 'developer' || activeTab === 'writing') && (
            <>
              {loading ? (
                <div className="contracts-loading">Loading contracts...</div>
              ) : (
                <div className="contracts-grid">
                  {filteredContracts.map(contract => (
                <div 
                  key={contract.id} 
                  className={`contract-card ${contract.status !== 'available' ? 'contract-unavailable' : ''}`}
                  onClick={() => contract.status === 'available' && setSelectedContract(contract)}
                >
                  <div className="contract-header">
                    <h3>{contract.title}</h3>
                    <span 
                      className="contract-status"
                      style={{ background: getStatusColor(contract.status) }}
                    >
                      {contract.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="contract-description">{contract.description}</p>
                  
                  <div className="contract-meta">
                    <span className={`contract-priority priority-${contract.priority.toLowerCase()}`}>
                      {contract.priority}
                    </span>
                    <span className="contract-reward">{contract.reward}</span>
                    <span className="contract-time">{contract.estimatedHours}h</span>
                  </div>

                  {contract.assignee && (
                    <div className="contract-assignee">
                      <span className="assignee-label">Assigned to:</span>
                      <span className="assignee-name">@{contract.assignee.githubUsername}</span>
                      {contract.status === 'in_progress' && (
                        <span className="assignee-deadline">
                          {getTimeRemaining(contract.assignee.deadline)}
                        </span>
                      )}
                    </div>
                  )}

                  {contract.pullRequest && (
                    <div className="contract-pr">
                      <a 
                        href={contract.pullRequest.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        PR #{contract.pullRequest.number} ({contract.pullRequest.status})
                      </a>
                    </div>
                  )}
                </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Contributors Tab Content */}
          {activeTab === 'contributors' && (
            <div className="contributors-section">
              <div className="contributors-header">
                <h2>Contributors & Token Allocation</h2>
                <p>Track contributor progress and token distribution for Bitcoin Writer development</p>
              </div>
              
              <div className="token-stats">
                <div className="stat-card">
                  <span className="stat-value">{tokenDistribution.allocated.toFixed(3)}%</span>
                  <span className="stat-label">Allocated</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{tokenDistribution.reserved.toFixed(3)}%</span>
                  <span className="stat-label">Reserved</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{tokenDistribution.available.toFixed(3)}%</span>
                  <span className="stat-label">Available</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{completedTasksByFounder.length}</span>
                  <span className="stat-label">Tasks Completed</span>
                </div>
              </div>

              <div className="completed-tasks">
                <h3>Completed Tasks by Founder (@b0ase)</h3>
                <div className="tasks-grid">
                  {completedTasksByFounder.map((task, index) => (
                    <div key={index} className="task-card completed">
                      <div className="task-content">
                        <h4>{task.task}</h4>
                        <div className="task-meta">
                          <span className="task-allocation">{task.allocation}% allocation</span>
                          <span className="task-status">✅ Completed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tokenomics Tab Content */}
          {activeTab === 'tokenomics' && (
            <div className="tokenomics-section">
              <div className="tokenomics-header">
                <h2>BWRITER Token Distribution</h2>
                <p>Transparent allocation of 1 billion BWRITER tokens across the ecosystem</p>
              </div>

              <div className="token-overview">
                <div className="total-supply">
                  <h3>Total Supply: 1,000,000,000 BWRITER</h3>
                </div>
                
                <div className="distribution-chart">
                  <div className="distribution-item">
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill allocated" 
                        style={{ width: `${tokenDistribution.allocated}%` }}
                      ></div>
                    </div>
                    <div className="distribution-label">
                      <span className="label">Allocated ({tokenDistribution.allocated.toFixed(3)}%)</span>
                      <span className="amount">{(TOTAL_TOKENS * tokenDistribution.allocated / 100).toLocaleString()} tokens</span>
                    </div>
                  </div>
                  
                  <div className="distribution-item">
                    <div className="distribution-bar">
                      <div 
                        className="distribution-fill available" 
                        style={{ width: `${tokenDistribution.available}%` }}
                      ></div>
                    </div>
                    <div className="distribution-label">
                      <span className="label">Available for Contributors ({tokenDistribution.available.toFixed(3)}%)</span>
                      <span className="amount">{(TOTAL_TOKENS * tokenDistribution.available / 100).toLocaleString()} tokens</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="allocation-breakdown">
                <h3>Allocation Breakdown</h3>
                <div className="breakdown-grid">
                  <div className="breakdown-card">
                    <h4>Founder Development</h4>
                    <p>Initial platform development and setup</p>
                    <span className="breakdown-percentage">10.125%</span>
                  </div>
                  <div className="breakdown-card">
                    <h4>Community Contributors</h4>
                    <p>Open source development and improvements</p>
                    <span className="breakdown-percentage">89.875%</span>
                  </div>
                </div>
              </div>

              <div className="contract-info-section">
                <h3>Token Contract Information</h3>
                <div className="contract-info-grid">
                  <div className="contract-info-item">
                    <span className="contract-info-label">Contract ID:</span>
                    <span className="contract-info-value contract-id">
                      acc6543efc620d40895004acaefecbad7cabe9dc447a84342e149eac30d979d3_1
                    </span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Symbol:</span>
                    <span className="contract-info-value">$$bWriter</span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Blockchain:</span>
                    <span className="contract-info-value">Bitcoin SV (BSV-20)</span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Decimals:</span>
                    <span className="contract-info-value">0</span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">Total Supply:</span>
                    <span className="contract-info-value">1,000,000,000</span>
                  </div>
                  <div className="contract-info-item">
                    <span className="contract-info-label">1sat Market:</span>
                    <a 
                      href="https://1sat.market/market/bsv21/acc6543efc620d40895004acaefecbad7cabe9dc447a84342e149eac30d979d3_1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contract-info-link"
                    >
                      View on 1sat Market
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contract Details Modal */}
          {selectedContract && (
            <div className="contract-modal" onClick={() => setSelectedContract(null)}>
              <div className="contract-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={() => setSelectedContract(null)}>×</button>
                
                <h2>{selectedContract.title}</h2>
                
                <div className="contract-modal-meta">
                  <span className={`priority-badge priority-${selectedContract.priority.toLowerCase()}`}>
                    {selectedContract.priority} Priority
                  </span>
                  <span className="reward-badge">{selectedContract.reward}</span>
                  <span className="time-badge">{selectedContract.estimatedHours} hours</span>
                </div>

                <div className="contract-modal-section">
                  <h3>Description</h3>
                  <p>{selectedContract.description}</p>
                </div>

                <div className="contract-modal-section">
                  <h3>Required Skills</h3>
                  <div className="skills-list">
                    {selectedContract.skills.map(skill => (
                      <span key={skill} className="skill-badge">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="contract-modal-section">
                  <h3>Deliverables</h3>
                  <ul className="deliverables-list">
                    {selectedContract.deliverables.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="contract-actions">
                  <button 
                    className="claim-contract-button"
                    onClick={() => setShowClaimModal(true)}
                  >
                    Claim Contract
                  </button>
                  <a 
                    href={selectedContract.githubIssueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="github-button"
                  >
                    View on GitHub →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Claim Contract Modal */}
          {showClaimModal && (
            <div className="claim-modal" onClick={() => setShowClaimModal(false)}>
              <div className="claim-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={() => setShowClaimModal(false)}>×</button>
                
                <h2>Claim Contract</h2>
                <p>By claiming this contract, you agree to deliver the work within the specified timeframe.</p>
                
                <form onSubmit={(e) => { e.preventDefault(); handleClaimContract(); }}>
                  <div className="form-group">
                    <label>GitHub Username *</label>
                    <input
                      type="text"
                      value={claimForm.githubUsername}
                      onChange={(e) => setClaimForm({...claimForm, githubUsername: e.target.value})}
                      placeholder="your-github-username"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>HandCash Handle *</label>
                    <input
                      type="text"
                      value={claimForm.handcashHandle}
                      onChange={(e) => setClaimForm({...claimForm, handcashHandle: e.target.value})}
                      placeholder="$yourhandle"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Estimated Days to Complete *</label>
                    <select
                      value={claimForm.estimatedDays}
                      onChange={(e) => setClaimForm({...claimForm, estimatedDays: parseInt(e.target.value)})}
                    >
                      <option value={3}>3 days</option>
                      <option value={5}>5 days</option>
                      <option value={7}>7 days (default)</option>
                      <option value={14}>14 days</option>
                      <option value={30}>30 days</option>
                    </select>
                  </div>
                  
                  <div className="claim-terms">
                    <h4>Terms & Conditions:</h4>
                    <ul>
                      <li>You must submit a PR within the agreed timeframe</li>
                      <li>Code must meet all acceptance criteria</li>
                      <li>Token rewards are distributed upon PR merge</li>
                      <li>Inactive contracts may be reassigned after deadline</li>
                    </ul>
                  </div>
                  
                  <button type="submit" className="submit-claim-button">
                    Accept & Claim Contract
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractsPage;