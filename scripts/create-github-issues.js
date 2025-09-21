#!/usr/bin/env node

const { execSync } = require('child_process');

const tasks = [
  // We already created issues 1-3, starting from 4
  {
    id: '4',
    title: 'Share Token Creation System',
    description: 'Implement document share tokens as separate inscriptions for granular access control and monetization',
    difficulty: 'hard',
    tokenReward: 0.3,
    category: 'Blockchain'
  },
  {
    id: '5',
    title: 'Document Encryption/Decryption',
    description: 'Implement client-side AES encryption and decryption for documents before blockchain storage. Critical for privacy.',
    difficulty: 'hard',
    tokenReward: 0.25,
    category: 'Security',
    references: ['src/App.tsx:333 (TODO: Implement Encrypt)', 'src/App.tsx:340 (TODO: Implement Decrypt)']
  },
  {
    id: '6',
    title: 'Document Publishing Pipeline',
    description: 'Build complete publishing flow from draft to blockchain-inscribed final document with metadata',
    difficulty: 'hard',
    tokenReward: 0.25,
    category: 'Core Feature',
    references: ['src/App.tsx:362 (TODO: Implement Publish)']
  },
  {
    id: '7',
    title: 'Paywall System Implementation',
    description: 'Create paywall functionality for monetizing documents with BSV micropayments. Enable creators to earn from their content.',
    difficulty: 'hard',
    tokenReward: 0.3,
    category: 'Monetization',
    references: ['src/App.tsx:355 (TODO: Implement Paywall)']
  },
  {
    id: '8',
    title: 'Document Tokenization Logic',
    description: 'Implement actual tokenization logic in DocumentEditor.tsx to create tradeable document shares',
    difficulty: 'hard',
    tokenReward: 0.25,
    category: 'Monetization',
    references: ['src/components/DocumentEditor.tsx:554 (TODO: Implement actual tokenization logic)']
  },
  {
    id: '9',
    title: 'Real BSV Price Feed Integration',
    description: 'Replace mock pricing (currently returns $30) with CoinGecko or similar API for real-time BSV/USD rates',
    difficulty: 'easy',
    tokenReward: 0.1,
    category: 'Integration',
    references: ['src/utils/pricingCalculator.ts:88 (TODO: Fetch from a real API)']
  },
  {
    id: '10',
    title: 'Bitcoin Writer Exchange',
    description: 'Build decentralized exchange for trading document shares and NFTs with order book and liquidity pools',
    difficulty: 'expert',
    tokenReward: 0.5,
    category: 'Exchange'
  },
  {
    id: '11',
    title: 'Document NFT Marketplace',
    description: 'Create marketplace for buying/selling document NFTs with royalty distribution',
    difficulty: 'hard',
    tokenReward: 0.3,
    category: 'Marketplace'
  },
  {
    id: '12',
    title: 'Enhance AI Assistant',
    description: 'Improve AI chat with document context awareness, auto-suggestions, and writing style learning',
    difficulty: 'medium',
    tokenReward: 0.2,
    category: 'AI'
  },
  {
    id: '13',
    title: 'AI Model Fine-tuning',
    description: 'Fine-tune language models for specific writing tasks and document types',
    difficulty: 'hard',
    tokenReward: 0.25,
    category: 'AI'
  },
  {
    id: '14',
    title: 'Real-time Collaborative Editing',
    description: 'Add real-time collaborative editing using WebRTC and CRDTs for multiple users',
    difficulty: 'expert',
    tokenReward: 0.35,
    category: 'Collaboration'
  },
  {
    id: '15',
    title: 'Comment & Review System',
    description: 'Implement commenting, suggestions, and review workflow for documents',
    difficulty: 'medium',
    tokenReward: 0.2,
    category: 'Collaboration'
  },
  {
    id: '16',
    title: 'IPFS Storage Integration',
    description: 'Add IPFS as an alternative storage backend for documents, with pinning service integration',
    difficulty: 'hard',
    tokenReward: 0.2,
    category: 'Storage'
  },
  {
    id: '17',
    title: 'Optimize Performance',
    description: 'Improve document loading times, reduce bundle size by 30%, implement code splitting',
    difficulty: 'hard',
    tokenReward: 0.175,
    category: 'Performance'
  },
  {
    id: '18',
    title: 'Markdown Import/Export',
    description: 'Enable users to import and export documents as Markdown files with proper formatting',
    difficulty: 'easy',
    tokenReward: 0.075,
    category: 'Features'
  },
  {
    id: '19',
    title: 'PDF Import/Export',
    description: 'Enable users to import PDF documents for editing and export as PDF',
    difficulty: 'medium',
    tokenReward: 0.15,
    category: 'Features'
  },
  {
    id: '20',
    title: 'MS Word Import/Export',
    description: 'Add support for .docx file import and export with formatting preservation',
    difficulty: 'hard',
    tokenReward: 0.2,
    category: 'Features'
  },
  {
    id: '21',
    title: 'React Native Mobile App',
    description: 'Build React Native mobile app for iOS and Android with full feature parity',
    difficulty: 'expert',
    tokenReward: 0.4,
    category: 'Mobile'
  },
  {
    id: '22',
    title: 'Browser Extension',
    description: 'Build Chrome/Firefox extension for quick document creation and web clipping',
    difficulty: 'hard',
    tokenReward: 0.2,
    category: 'Extensions'
  },
  {
    id: '23',
    title: 'Document Template Library',
    description: 'Create template library for contracts, letters, resumes, invoices, and more',
    difficulty: 'medium',
    tokenReward: 0.125,
    category: 'Features'
  },
  {
    id: '24',
    title: 'Smart Contract Templates',
    description: 'Create reusable smart contract templates for document agreements and escrow',
    difficulty: 'expert',
    tokenReward: 0.25,
    category: 'Blockchain'
  },
  {
    id: '25',
    title: 'Document Analytics Dashboard',
    description: 'Add analytics for document views, shares, earnings, and reader engagement',
    difficulty: 'medium',
    tokenReward: 0.125,
    category: 'Analytics'
  },
  {
    id: '26',
    title: 'Writing Analytics',
    description: 'Track writing productivity, word count goals, and writing streaks',
    difficulty: 'easy',
    tokenReward: 0.1,
    category: 'Analytics'
  },
  {
    id: '27',
    title: 'Multi-language Support (i18n)',
    description: 'Implement internationalization for UI in Spanish, Chinese, Japanese, French, German',
    difficulty: 'medium',
    tokenReward: 0.125,
    category: 'UI/UX'
  },
  {
    id: '28',
    title: 'Accessibility Improvements',
    description: 'Ensure WCAG 2.1 AA compliance, screen reader support, keyboard navigation',
    difficulty: 'medium',
    tokenReward: 0.15,
    category: 'UI/UX'
  },
  {
    id: '29',
    title: 'Voice Dictation & Commands',
    description: 'Implement voice-to-text and voice commands using Web Speech API',
    difficulty: 'medium',
    tokenReward: 0.15,
    category: 'Features'
  },
  {
    id: '30',
    title: 'E-Signature Integration',
    description: 'Add legally binding e-signature functionality with blockchain verification',
    difficulty: 'hard',
    tokenReward: 0.225,
    category: 'Blockchain'
  },
  {
    id: '31',
    title: 'Version Control UI',
    description: 'Build UI for document version history, diffs, and rollback functionality',
    difficulty: 'medium',
    tokenReward: 0.175,
    category: 'UI/UX'
  },
  {
    id: '32',
    title: 'API Documentation',
    description: 'Write comprehensive API documentation with OpenAPI spec and SDK guides',
    difficulty: 'medium',
    tokenReward: 0.1,
    category: 'Documentation'
  },
  {
    id: '33',
    title: 'End-to-End Testing Suite',
    description: 'Implement Cypress E2E tests for critical user flows',
    difficulty: 'medium',
    tokenReward: 0.15,
    category: 'Testing'
  },
  {
    id: '34',
    title: 'Unit Test Coverage',
    description: 'Achieve 80% unit test coverage with Jest and React Testing Library',
    difficulty: 'medium',
    tokenReward: 0.125,
    category: 'Testing'
  },
  {
    id: '35',
    title: 'Security Audit',
    description: 'Conduct comprehensive security audit and implement recommendations',
    difficulty: 'hard',
    tokenReward: 0.2,
    category: 'Security'
  },
  {
    id: '36',
    title: 'Two-Factor Authentication',
    description: 'Add 2FA support for enhanced account security',
    difficulty: 'medium',
    tokenReward: 0.15,
    category: 'Security'
  }
];

const getDifficultyEmoji = (difficulty) => {
  switch(difficulty) {
    case 'easy': return '🟢';
    case 'medium': return '🟡';
    case 'hard': return '🟠';
    case 'expert': return '🔴';
    default: return '⚪';
  }
};

const getCategoryEmoji = (category) => {
  const emojis = {
    'Blockchain': '⛓️',
    'Security': '🔒',
    'Core Feature': '📝',
    'Monetization': '💰',
    'Exchange': '💱',
    'Marketplace': '🛍️',
    'AI': '🤖',
    'Collaboration': '👥',
    'Storage': '💾',
    'Performance': '⚡',
    'Features': '✨',
    'Mobile': '📱',
    'Extensions': '🔌',
    'Analytics': '📊',
    'UI/UX': '🎨',
    'Documentation': '📚',
    'Testing': '🧪'
  };
  return emojis[category] || '📌';
};

tasks.forEach((task, index) => {
  const difficultyEmoji = getDifficultyEmoji(task.difficulty);
  const categoryEmoji = getCategoryEmoji(task.category);
  const tokenAmount = (task.tokenReward * 10000000).toLocaleString();
  
  const referencesSection = task.references ? 
    `\n## Code References\n${task.references.map(ref => `- ${ref}`).join('\n')}` : '';
  
  const body = `## Description
${task.description}

## Token Reward
🪙 **${task.tokenReward}% of $BWRITER tokens** (${tokenAmount} tokens)

## Difficulty
${difficultyEmoji} **${task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}**

## Category
${categoryEmoji} ${task.category}
${referencesSection}

## Requirements
- Fork the repository
- Implement the feature following best practices
- Include tests where applicable
- Update documentation
- Submit a pull request

## How to Claim This Task
1. Click "Claim Task" on https://bitcoin-writer.vercel.app/contributions#tasks
2. Sign in with GitHub OAuth
3. Sign the smart contract with your HandCash wallet
4. Complete the work within the deadline
5. Submit PR and get it merged
6. Receive tokens automatically

## Discussion
Join our Discord for technical discussion: https://discord.gg/xBB8r8dj

## Issue ID
Task #${task.id}`;

  const title = `${difficultyEmoji} ${task.title} - ${task.tokenReward}% Bounty`;
  
  const command = `gh issue create --repo bitcoin-apps-suite/bitcoin-writer --title "${title}" --body "${body.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`;
  
  console.log(`Creating issue #${parseInt(task.id) + 3}: ${task.title}`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ Created issue for: ${task.title}`);
    // Add delay to avoid rate limiting
    execSync('sleep 2');
  } catch (error) {
    console.error(`❌ Failed to create issue for: ${task.title}`);
    console.error(error.message);
  }
});

console.log('\n✨ All issues created successfully!');
console.log('View them at: https://github.com/bitcoin-apps-suite/bitcoin-writer/issues');