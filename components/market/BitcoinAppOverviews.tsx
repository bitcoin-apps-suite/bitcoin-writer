import React from 'react';
import AppOverviewTemplate from '../AppOverviewTemplate';
import { BitcoinAppEvents } from '../../utils/appEvents';

interface AppOverviewsProps {
  activeApp: string | null;
  onClose: () => void;
}

const appConfigs = {
  [BitcoinAppEvents.AUTH]: {
    appName: 'Bitcoin Auth',
    tagline: 'Decentralized Identity & Authentication',
    description: 'Bitcoin Auth provides a secure, decentralized authentication system built on Bitcoin SV. Eliminate passwords and centralized identity providers with cryptographic proof of identity.',
    icon: '🔐',
    color: '#ef4444',
    features: [
      { icon: '🔑', title: 'Passwordless Login', description: 'Use Bitcoin keys for authentication without passwords' },
      { icon: '🛡️', title: 'Self-Sovereign Identity', description: 'Own and control your digital identity' },
      { icon: '🔗', title: 'Cross-App SSO', description: 'Single sign-on across all Bitcoin apps' },
      { icon: '✅', title: 'Verifiable Credentials', description: 'Issue and verify credentials on-chain' }
    ],
    useCases: [
      'Secure login to decentralized applications',
      'Identity verification for financial services',
      'Academic credential verification',
      'Professional certification management'
    ]
  },
  [BitcoinAppEvents.CHAT]: {
    appName: 'Bitcoin Chat',
    tagline: 'Encrypted Messaging on the Blockchain',
    description: 'Bitcoin Chat enables secure, private messaging with end-to-end encryption and Bitcoin micropayments for spam prevention.',
    icon: '💬',
    color: '#ff6500',
    features: [
      { icon: '🔒', title: 'E2E Encryption', description: 'Messages encrypted with Bitcoin keys' },
      { icon: '💰', title: 'Micropayment Filters', description: 'Eliminate spam with payment requirements' },
      { icon: '📱', title: 'Cross-Platform', description: 'Chat from any device with key sync' },
      { icon: '👥', title: 'Group Chats', description: 'Create encrypted group conversations' }
    ]
  },
  [BitcoinAppEvents.DOMAINS]: {
    appName: 'Bitcoin Domains',
    tagline: 'Decentralized Domain Name System',
    description: 'Register and manage domain names on the Bitcoin blockchain. No more domain seizures or censorship.',
    icon: '🌐',
    color: '#eab308',
    features: [
      { icon: '📝', title: 'Permanent Ownership', description: 'Own your domain forever on-chain' },
      { icon: '🔄', title: 'Instant Updates', description: 'Update DNS records in real-time' },
      { icon: '💎', title: 'NFT Domains', description: 'Trade domains as digital assets' },
      { icon: '🌍', title: 'Global Resolution', description: 'Resolve domains from anywhere' }
    ]
  },
  [BitcoinAppEvents.DRAW]: {
    appName: 'Bitcoin Draw',
    tagline: 'Vector Graphics & Design Tools',
    description: 'Professional vector graphics editor with blockchain storage and NFT minting capabilities.',
    icon: '✏️',
    color: '#10b981',
    features: [
      { icon: '🎨', title: 'Vector Editor', description: 'Professional design tools in browser' },
      { icon: '☁️', title: 'Chain Storage', description: 'Store designs permanently on-chain' },
      { icon: '🖼️', title: 'NFT Minting', description: 'Mint artwork directly as NFTs' },
      { icon: '👥', title: 'Collaboration', description: 'Real-time collaborative editing' }
    ]
  },
  [BitcoinAppEvents.EMAIL]: {
    appName: 'Bitcoin Email',
    tagline: 'Encrypted Email on Bitcoin',
    description: 'Send and receive encrypted emails stored on the Bitcoin blockchain with micropayment spam prevention.',
    icon: '📧',
    color: '#06b6d4',
    features: [
      { icon: '🔐', title: 'End-to-End Encryption', description: 'Emails encrypted with recipient keys' },
      { icon: '💾', title: 'Permanent Storage', description: 'Emails stored forever on-chain' },
      { icon: '💰', title: 'Spam Prevention', description: 'Micropayments eliminate spam' },
      { icon: '📎', title: 'File Attachments', description: 'Attach files with IPFS integration' }
    ]
  },
  [BitcoinAppEvents.MUSIC]: {
    appName: 'Bitcoin Music',
    tagline: 'Decentralized Music Streaming',
    description: 'Stream music with direct artist payments. No middlemen, just artists and fans.',
    icon: '🎵',
    color: '#8b5cf6',
    features: [
      { icon: '🎧', title: 'Stream & Earn', description: 'Artists earn per stream instantly' },
      { icon: '💿', title: 'NFT Albums', description: 'Release albums as collectible NFTs' },
      { icon: '🎤', title: 'Direct Tips', description: 'Tip artists directly while listening' },
      { icon: '📊', title: 'Fair Revenue', description: '95% of revenue goes to artists' }
    ]
  },
  [BitcoinAppEvents.PAINT]: {
    appName: 'Bitcoin Paint',
    tagline: 'Digital Art Creation Platform',
    description: 'Create digital art with professional painting tools and mint directly to the blockchain.',
    icon: '🎨',
    color: '#a855f7',
    features: [
      { icon: '🖌️', title: 'Pro Brushes', description: 'Professional brush engine' },
      { icon: '🎨', title: 'Layer Support', description: 'Advanced layer management' },
      { icon: '🖼️', title: 'NFT Minting', description: 'Mint artwork instantly' },
      { icon: '📐', title: 'Precision Tools', description: 'Vector and raster tools' }
    ]
  },
  [BitcoinAppEvents.PICS]: {
    appName: 'Bitcoin Pics',
    tagline: 'Decentralized Image Storage',
    description: 'Store, share, and monetize images on the Bitcoin blockchain with automatic backups.',
    icon: '📸',
    color: '#ec4899',
    features: [
      { icon: '☁️', title: 'Permanent Storage', description: 'Images stored forever on-chain' },
      { icon: '🔒', title: 'Private Albums', description: 'Encrypted private photo albums' },
      { icon: '💰', title: 'Sell Photos', description: 'Monetize images with paywalls' },
      { icon: '🔍', title: 'Smart Search', description: 'AI-powered image search' }
    ]
  },
  [BitcoinAppEvents.REGISTRY]: {
    appName: 'Bitcoin Registry',
    tagline: 'Decentralized Asset Registry',
    description: 'Register and verify ownership of any asset on the Bitcoin blockchain.',
    icon: '📋',
    color: '#f43f5e',
    features: [
      { icon: '📜', title: 'Asset Registration', description: 'Register any asset on-chain' },
      { icon: '✅', title: 'Verification', description: 'Instant ownership verification' },
      { icon: '🔄', title: 'Transfer History', description: 'Complete chain of custody' },
      { icon: '🏛️', title: 'Legal Framework', description: 'Legally recognized records' }
    ]
  },
  [BitcoinAppEvents.SHARES]: {
    appName: 'Bitcoin Shares',
    tagline: 'Digital Equity Platform',
    description: 'Issue, trade, and manage digital shares of any asset or company on Bitcoin.',
    icon: '📜',
    color: '#f43f5e',
    features: [
      { icon: '📊', title: 'Share Issuance', description: 'Issue digital equity tokens' },
      { icon: '💹', title: 'Trading Engine', description: 'Built-in DEX for share trading' },
      { icon: '🗳️', title: 'Voting Rights', description: 'On-chain governance voting' },
      { icon: '💵', title: 'Dividends', description: 'Automatic dividend distribution' }
    ]
  },
  [BitcoinAppEvents.VIDEO]: {
    appName: 'Bitcoin Video',
    tagline: 'Decentralized Video Platform',
    description: 'Upload, stream, and monetize videos without censorship or demonetization.',
    icon: '🎬',
    color: '#65a30d',
    features: [
      { icon: '📹', title: 'HD Streaming', description: 'High-quality video streaming' },
      { icon: '💰', title: 'Creator Revenue', description: 'Direct monetization for creators' },
      { icon: '🚫', title: 'No Censorship', description: 'Uncensorable content platform' },
      { icon: '📺', title: 'Live Streaming', description: 'Live broadcast with tips' }
    ]
  },
  [BitcoinAppEvents.WALLET]: {
    appName: 'Bitcoin Wallet',
    tagline: 'Professional Bitcoin SV Wallet',
    description: 'Secure, feature-rich wallet for Bitcoin SV with NFT support and DeFi integration.',
    icon: '👛',
    color: '#f59e0b',
    features: [
      { icon: '🔐', title: 'Secure Storage', description: 'Military-grade encryption' },
      { icon: '🖼️', title: 'NFT Gallery', description: 'View and manage NFTs' },
      { icon: '🔄', title: 'Token Swaps', description: 'Built-in DEX integration' },
      { icon: '📱', title: 'Mobile First', description: 'Optimized for mobile devices' }
    ]
  }
};

const BitcoinAppOverviews: React.FC<AppOverviewsProps> = ({ activeApp, onClose }) => {
  if (!activeApp || !appConfigs[activeApp]) return null;

  const config = appConfigs[activeApp];
  
  return (
    <AppOverviewTemplate
      isOpen={true}
      onClose={onClose}
      {...config}
    />
  );
};

export default BitcoinAppOverviews;