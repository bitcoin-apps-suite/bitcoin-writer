import React, { useState, useEffect } from 'react';
import './DocumentExchangeView.css';

// Use the same interfaces from DocumentExchange
interface WritingListing {
  rank: number;
  title: string;
  description: string;
  author: string;
  authorHandle: string;
  authorTwitter?: string;
  authorType: 'human' | 'ai';
  publishDate: string;
  wordCount: number;
  views: number;
  purchases: number;
  sharesAvailable: number;
  totalShares: number;
  revenue: number;
  dividendPerShare: number;
  volume24h: number;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  contentType: 'book' | 'article' | 'blog';
  category: string;
  tags: string[];
  txId: string;
  trending?: boolean;
}

interface WriterListing {
  rank: number;
  name: string;
  handle: string;
  twitter?: string;
  authorType: 'human' | 'ai';
  joinDate: string;
  totalWorks: number;
  totalReaders: number;
  totalRevenue: number;
  avgRating: number;
  sharesAvailable: number;
  totalShares: number;
  currentPrice: number;
  priceChange24h: number;
  marketCap: number;
  verified: boolean;
  trending?: boolean;
}

interface DocumentExchangeViewProps {
  onSelectDocument?: (document: WritingListing) => void;
  userDocuments?: any[]; // Documents from the sidebar that can be published
  onClose?: () => void; // Optional close handler to return to editor
}

const DocumentExchangeView: React.FC<DocumentExchangeViewProps> = ({ 
  onSelectDocument,
  userDocuments = [],
  onClose
}) => {
  const [authorType, setAuthorType] = useState<'human' | 'ai'>('human');
  const [activeView, setActiveView] = useState<'books' | 'articles' | 'blogs' | 'authors'>('books');
  const [activeMarket, setActiveMarket] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rank' | 'revenue' | 'volume' | 'price' | 'views'>('rank');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWriting, setSelectedWriting] = useState<WritingListing | null>(null);
  const [selectedWriter, setSelectedWriter] = useState<WriterListing | null>(null);
  const [writings, setWritings] = useState<WritingListing[]>([]);
  const [writers, setWriters] = useState<WriterListing[]>([]);

  const bookCategories = ['All', 'Fiction', 'Non-Fiction', 'Business', 'Tech', 'Health', 'Self-Help', 'History', 'Science'];
  const articleCategories = ['All', 'Tech', 'Business', 'Finance', 'Health', 'Politics', 'Culture', 'Opinion'];
  const blogCategories = ['All', 'Personal', 'Professional', 'Travel', 'Food', 'Lifestyle', 'Tech', 'Crypto'];

  // Combine user documents with mock marketplace data
  useEffect(() => {
    // Convert user documents to WritingListing format
    const userListings: WritingListing[] = userDocuments.map((doc, index) => ({
      rank: index + 1,
      title: doc.title || "Untitled",
      description: doc.preview || "No description available",
      author: doc.author || "Anonymous",
      authorHandle: "$user",
      authorType: "human" as const,
      publishDate: doc.created_at,
      wordCount: doc.word_count || 0,
      views: 0,
      purchases: 0,
      sharesAvailable: 1000,
      totalShares: 1000,
      revenue: 0,
      dividendPerShare: 0,
      volume24h: 0,
      currentPrice: 1.00,
      priceChange24h: 0,
      marketCap: 1000,
      contentType: "article" as const, // Default to article
      category: "All",
      tags: [],
      txId: doc.id
    }));

    const mockBooks: WritingListing[] = [
      // Fiction Books
      {
        rank: userListings.length + 1,
        title: "The Last Train to Memphis",
        description: "A gripping mystery novel following detective Sarah Mills through the dark streets of Memphis",
        author: "Sarah Chen",
        authorHandle: "$sarahwrites",
        authorTwitter: "sarahchenwrites",
        authorType: "human",
        publishDate: "2025-01-15",
        wordCount: 85000,
        views: 425000,
        purchases: 28500,
        sharesAvailable: 50,
        totalShares: 1000,
        revenue: 142500.00,
        dividendPerShare: 14.25,
        volume24h: 850000,
        currentPrice: 125.00,
        priceChange24h: 45.2,
        marketCap: 125000,
        contentType: "book",
        category: "Fiction",
        tags: ["mystery", "thriller"],
        trending: true,
        txId: "fic1a2b3c4..."
      },
      {
        rank: userListings.length + 2,
        title: "Neon Dreams",
        description: "A cyberpunk adventure set in 2089 Tokyo where memories can be traded like currency",
        author: "Marcus Liu",
        authorHandle: "$marcusliu",
        authorType: "human",
        publishDate: "2025-01-10",
        wordCount: 92000,
        views: 380000,
        purchases: 24000,
        sharesAvailable: 120,
        totalShares: 1500,
        revenue: 120000.00,
        dividendPerShare: 12.00,
        volume24h: 650000,
        currentPrice: 95.00,
        priceChange24h: 12.5,
        marketCap: 142500,
        contentType: "book",
        category: "Fiction",
        tags: ["sci-fi", "cyberpunk"],
        txId: "fic2b3c4d5..."
      },
      {
        rank: userListings.length + 3,
        title: "The Garden of Lost Time",
        description: "A magical realism tale of a woman who discovers a garden where time flows backwards",
        author: "Isabella Rodriguez",
        authorHandle: "$isabellawr",
        authorType: "human",
        publishDate: "2025-01-08",
        wordCount: 78000,
        views: 290000,
        purchases: 18000,
        sharesAvailable: 200,
        totalShares: 2000,
        revenue: 90000.00,
        dividendPerShare: 9.00,
        volume24h: 450000,
        currentPrice: 78.00,
        priceChange24h: -5.2,
        marketCap: 156000,
        contentType: "book",
        category: "Fiction",
        tags: ["magical realism", "literary"],
        txId: "fic3c4d5e6..."
      },
      // Non-Fiction Books
      {
        rank: userListings.length + 4,
        title: "The Bitcoin Revolution",
        description: "A comprehensive guide to understanding blockchain technology and its impact on global finance",
        author: "Dr. James Wright",
        authorHandle: "$drwright",
        authorType: "human",
        publishDate: "2025-01-12",
        wordCount: 65000,
        views: 520000,
        purchases: 35000,
        sharesAvailable: 80,
        totalShares: 1200,
        revenue: 175000.00,
        dividendPerShare: 17.50,
        volume24h: 920000,
        currentPrice: 145.00,
        priceChange24h: 28.3,
        marketCap: 174000,
        contentType: "book",
        category: "Non-Fiction",
        tags: ["blockchain", "finance", "technology"],
        trending: true,
        txId: "nf1a2b3c4..."
      },
      {
        rank: userListings.length + 5,
        title: "Mindful Productivity",
        description: "Transform your work life with science-based strategies for focus and efficiency",
        author: "Emma Thompson",
        authorHandle: "$emmaprod",
        authorType: "human",
        publishDate: "2025-01-05",
        wordCount: 55000,
        views: 340000,
        purchases: 22000,
        sharesAvailable: 150,
        totalShares: 1000,
        revenue: 110000.00,
        dividendPerShare: 11.00,
        volume24h: 580000,
        currentPrice: 82.00,
        priceChange24h: 15.8,
        marketCap: 82000,
        contentType: "book",
        category: "Non-Fiction",
        tags: ["productivity", "self-help"],
        txId: "nf2b3c4d5..."
      },
      // Business Books
      {
        rank: userListings.length + 6,
        title: "Scaling Silicon Valley",
        description: "Inside stories and strategies from 50 unicorn founders on building billion-dollar companies",
        author: "Michael Zhang",
        authorHandle: "$mzhang",
        authorType: "human",
        publishDate: "2024-12-28",
        wordCount: 72000,
        views: 680000,
        purchases: 42000,
        sharesAvailable: 30,
        totalShares: 2000,
        revenue: 210000.00,
        dividendPerShare: 21.00,
        volume24h: 1250000,
        currentPrice: 180.00,
        priceChange24h: 52.1,
        marketCap: 360000,
        contentType: "book",
        category: "Business",
        tags: ["entrepreneurship", "startups"],
        trending: true,
        txId: "bus1a2b3c4..."
      },
      {
        rank: userListings.length + 7,
        title: "The Web3 Marketing Playbook",
        description: "Master the art of marketing in the decentralized economy with proven strategies",
        author: "Alexandra Kim",
        authorHandle: "$alexkim",
        authorType: "human",
        publishDate: "2024-12-20",
        wordCount: 58000,
        views: 410000,
        purchases: 28000,
        sharesAvailable: 90,
        totalShares: 1500,
        revenue: 140000.00,
        dividendPerShare: 14.00,
        volume24h: 780000,
        currentPrice: 115.00,
        priceChange24h: 22.4,
        marketCap: 172500,
        contentType: "book",
        category: "Business",
        tags: ["marketing", "web3"],
        txId: "bus2b3c4d5..."
      },
      // Tech Books
      {
        rank: userListings.length + 8,
        title: "AI Engineering Handbook",
        description: "Build production-ready AI systems with practical examples in Python and TensorFlow",
        author: "Dr. Raj Patel",
        authorHandle: "$rajaieng",
        authorType: "human",
        publishDate: "2024-12-15",
        wordCount: 98000,
        views: 890000,
        purchases: 55000,
        sharesAvailable: 45,
        totalShares: 2500,
        revenue: 275000.00,
        dividendPerShare: 27.50,
        volume24h: 1450000,
        currentPrice: 220.00,
        priceChange24h: 68.3,
        marketCap: 550000,
        contentType: "book",
        category: "Tech",
        tags: ["AI", "programming", "machine learning"],
        trending: true,
        txId: "tech1a2b3c..."
      },
      {
        rank: userListings.length + 9,
        title: "Rust Systems Programming",
        description: "Master low-level programming with Rust for building high-performance applications",
        author: "Thomas Anderson",
        authorHandle: "$tomrust",
        authorType: "human",
        publishDate: "2024-12-10",
        wordCount: 82000,
        views: 520000,
        purchases: 32000,
        sharesAvailable: 110,
        totalShares: 1800,
        revenue: 160000.00,
        dividendPerShare: 16.00,
        volume24h: 920000,
        currentPrice: 135.00,
        priceChange24h: 31.2,
        marketCap: 243000,
        contentType: "book",
        category: "Tech",
        tags: ["rust", "programming", "systems"],
        txId: "tech2b3c4d..."
      },
      // Health Books
      {
        rank: userListings.length + 10,
        title: "The Longevity Protocol",
        description: "Science-backed strategies to add healthy years to your life through diet and exercise",
        author: "Dr. Sarah Mitchell",
        authorHandle: "$drmitchell",
        authorType: "human",
        publishDate: "2024-12-05",
        wordCount: 68000,
        views: 620000,
        purchases: 38000,
        sharesAvailable: 70,
        totalShares: 1600,
        revenue: 190000.00,
        dividendPerShare: 19.00,
        volume24h: 1080000,
        currentPrice: 165.00,
        priceChange24h: 42.7,
        marketCap: 264000,
        contentType: "book",
        category: "Health",
        tags: ["longevity", "wellness", "nutrition"],
        trending: true,
        txId: "health1a2b..."
      },
      {
        rank: userListings.length + 11,
        title: "Mental Fitness Revolution",
        description: "Transform your mental health with neuroscience-based exercises and mindfulness techniques",
        author: "Dr. Kevin Lee",
        authorHandle: "$drkevinlee",
        authorType: "human",
        publishDate: "2024-11-28",
        wordCount: 61000,
        views: 480000,
        purchases: 29000,
        sharesAvailable: 130,
        totalShares: 1400,
        revenue: 145000.00,
        dividendPerShare: 14.50,
        volume24h: 820000,
        currentPrice: 125.00,
        priceChange24h: 18.9,
        marketCap: 175000,
        contentType: "book",
        category: "Health",
        tags: ["mental health", "mindfulness"],
        txId: "health2b3c..."
      },
      // Self-Help Books
      {
        rank: userListings.length + 12,
        title: "Atomic Habits 2.0",
        description: "The advanced guide to building life-changing habits with AI-powered tracking",
        author: "Jennifer Park",
        authorHandle: "$jenpark",
        authorType: "human",
        publishDate: "2024-11-20",
        wordCount: 52000,
        views: 720000,
        purchases: 45000,
        sharesAvailable: 60,
        totalShares: 2200,
        revenue: 225000.00,
        dividendPerShare: 22.50,
        volume24h: 1320000,
        currentPrice: 195.00,
        priceChange24h: 58.4,
        marketCap: 429000,
        contentType: "book",
        category: "Self-Help",
        tags: ["habits", "productivity", "self-improvement"],
        trending: true,
        txId: "self1a2b3c..."
      },
      {
        rank: userListings.length + 13,
        title: "The Confidence Code",
        description: "Unlock your potential with proven psychological strategies for building unshakeable confidence",
        author: "Maria Santos",
        authorHandle: "$mariasantos",
        authorType: "human",
        publishDate: "2024-11-15",
        wordCount: 48000,
        views: 390000,
        purchases: 24000,
        sharesAvailable: 180,
        totalShares: 1300,
        revenue: 120000.00,
        dividendPerShare: 12.00,
        volume24h: 680000,
        currentPrice: 98.00,
        priceChange24h: 8.7,
        marketCap: 127400,
        contentType: "book",
        category: "Self-Help",
        tags: ["confidence", "psychology"],
        txId: "self2b3c4d..."
      },
      // History Books
      {
        rank: userListings.length + 14,
        title: "Digital Empires",
        description: "The untold story of how tech giants conquered the world from 1990 to 2025",
        author: "Robert Harrison",
        authorHandle: "$robhistory",
        authorType: "human",
        publishDate: "2024-11-10",
        wordCount: 115000,
        views: 580000,
        purchases: 34000,
        sharesAvailable: 95,
        totalShares: 1900,
        revenue: 170000.00,
        dividendPerShare: 17.00,
        volume24h: 980000,
        currentPrice: 155.00,
        priceChange24h: 35.6,
        marketCap: 294500,
        contentType: "book",
        category: "History",
        tags: ["technology", "business history"],
        txId: "hist1a2b3c..."
      },
      {
        rank: userListings.length + 15,
        title: "The Crypto Wars",
        description: "A detailed chronicle of the battle for financial freedom in the blockchain era",
        author: "Daniel Foster",
        authorHandle: "$danfoster",
        authorType: "human",
        publishDate: "2024-11-05",
        wordCount: 88000,
        views: 460000,
        purchases: 27000,
        sharesAvailable: 140,
        totalShares: 1700,
        revenue: 135000.00,
        dividendPerShare: 13.50,
        volume24h: 750000,
        currentPrice: 118.00,
        priceChange24h: 21.3,
        marketCap: 200600,
        contentType: "book",
        category: "History",
        tags: ["cryptocurrency", "finance"],
        txId: "hist2b3c4d..."
      },
      // Science Books
      {
        rank: userListings.length + 16,
        title: "Quantum Computing for Everyone",
        description: "Demystifying quantum mechanics and its revolutionary computing applications",
        author: "Dr. Lisa Chen",
        authorHandle: "$lisaquantum",
        authorType: "human",
        publishDate: "2024-10-28",
        wordCount: 76000,
        views: 520000,
        purchases: 31000,
        sharesAvailable: 85,
        totalShares: 2100,
        revenue: 155000.00,
        dividendPerShare: 15.50,
        volume24h: 880000,
        currentPrice: 142.00,
        priceChange24h: 29.8,
        marketCap: 298200,
        contentType: "book",
        category: "Science",
        tags: ["quantum", "physics", "computing"],
        trending: true,
        txId: "sci1a2b3c4..."
      },
      {
        rank: userListings.length + 17,
        title: "The Climate Solution",
        description: "Innovative technologies and strategies to reverse climate change by 2050",
        author: "Dr. Mark Green",
        authorHandle: "$markgreen",
        authorType: "human",
        publishDate: "2024-10-20",
        wordCount: 82000,
        views: 410000,
        purchases: 25000,
        sharesAvailable: 160,
        totalShares: 1600,
        revenue: 125000.00,
        dividendPerShare: 12.50,
        volume24h: 710000,
        currentPrice: 108.00,
        priceChange24h: 14.2,
        marketCap: 172800,
        contentType: "book",
        category: "Science",
        tags: ["climate", "environment"],
        txId: "sci2b3c4d5..."
      }
    ];

    // Articles data
    const mockArticles: WritingListing[] = [
      // Tech Articles
      {
        rank: 1,
        title: "GPT-5: What to Expect in 2025",
        description: "Deep dive into the next generation of AI language models and their potential impact",
        author: "Alex Thompson",
        authorHandle: "$alextech",
        authorType: "human",
        publishDate: "2025-01-16",
        wordCount: 8500,
        views: 125000,
        purchases: 8200,
        sharesAvailable: 300,
        totalShares: 500,
        revenue: 41000.00,
        dividendPerShare: 4.10,
        volume24h: 180000,
        currentPrice: 28.00,
        priceChange24h: 12.5,
        marketCap: 14000,
        contentType: "article",
        category: "Tech",
        tags: ["AI", "GPT", "technology"],
        trending: true,
        txId: "art1tech..."
      },
      {
        rank: 2,
        title: "The Rise of Quantum Internet",
        description: "How quantum networking will revolutionize secure communications",
        author: "Dr. Nina Patel",
        authorHandle: "$ninapatel",
        authorType: "human",
        publishDate: "2025-01-14",
        wordCount: 6200,
        views: 98000,
        purchases: 6100,
        sharesAvailable: 420,
        totalShares: 600,
        revenue: 30500.00,
        dividendPerShare: 3.05,
        volume24h: 145000,
        currentPrice: 22.00,
        priceChange24h: 8.3,
        marketCap: 13200,
        contentType: "article",
        category: "Tech",
        tags: ["quantum", "networking"],
        txId: "art2tech..."
      },
      // Business Articles
      {
        rank: 3,
        title: "The $10 Trillion Creator Economy",
        description: "Analysis of how content creators are reshaping global commerce",
        author: "Jessica Wang",
        authorHandle: "$jesswang",
        authorType: "human",
        publishDate: "2025-01-13",
        wordCount: 7800,
        views: 156000,
        purchases: 9500,
        sharesAvailable: 180,
        totalShares: 800,
        revenue: 47500.00,
        dividendPerShare: 4.75,
        volume24h: 220000,
        currentPrice: 35.00,
        priceChange24h: 18.7,
        marketCap: 28000,
        contentType: "article",
        category: "Business",
        tags: ["creator economy", "business"],
        trending: true,
        txId: "art1bus..."
      },
      {
        rank: 4,
        title: "Decentralized Finance in 2025",
        description: "The state of DeFi and its integration with traditional banking",
        author: "Carlos Martinez",
        authorHandle: "$carlosdefi",
        authorType: "human",
        publishDate: "2025-01-12",
        wordCount: 9200,
        views: 112000,
        purchases: 7300,
        sharesAvailable: 250,
        totalShares: 700,
        revenue: 36500.00,
        dividendPerShare: 3.65,
        volume24h: 185000,
        currentPrice: 26.00,
        priceChange24h: -3.2,
        marketCap: 18200,
        contentType: "article",
        category: "Business",
        tags: ["DeFi", "finance"],
        txId: "art2bus..."
      },
      // Finance Articles  
      {
        rank: 5,
        title: "Bitcoin at $500K: The Path Forward",
        description: "Technical and fundamental analysis of Bitcoin's trajectory to half a million",
        author: "Michael Brooks",
        authorHandle: "$mbrooks",
        authorType: "human",
        publishDate: "2025-01-11",
        wordCount: 5800,
        views: 189000,
        purchases: 11200,
        sharesAvailable: 90,
        totalShares: 900,
        revenue: 56000.00,
        dividendPerShare: 5.60,
        volume24h: 320000,
        currentPrice: 42.00,
        priceChange24h: 35.8,
        marketCap: 37800,
        contentType: "article",
        category: "Finance",
        tags: ["bitcoin", "cryptocurrency"],
        trending: true,
        txId: "art1fin..."
      },
      {
        rank: 6,
        title: "The Global Debt Crisis Explained",
        description: "Understanding the $300 trillion debt bubble and what comes next",
        author: "Dr. Rachel Green",
        authorHandle: "$rachelgreen",
        authorType: "human",
        publishDate: "2025-01-10",
        wordCount: 7200,
        views: 134000,
        purchases: 8400,
        sharesAvailable: 210,
        totalShares: 650,
        revenue: 42000.00,
        dividendPerShare: 4.20,
        volume24h: 195000,
        currentPrice: 31.00,
        priceChange24h: 14.2,
        marketCap: 20150,
        contentType: "article",
        category: "Finance",
        tags: ["economics", "debt"],
        txId: "art2fin..."
      },
      // Health Articles
      {
        rank: 7,
        title: "CRISPR 2025: Gene Editing Goes Mainstream",
        description: "The latest breakthroughs in genetic medicine and their accessibility",
        author: "Dr. Jennifer Wu",
        authorHandle: "$drjenwu",
        authorType: "human",
        publishDate: "2025-01-09",
        wordCount: 6500,
        views: 102000,
        purchases: 6800,
        sharesAvailable: 340,
        totalShares: 550,
        revenue: 34000.00,
        dividendPerShare: 3.40,
        volume24h: 158000,
        currentPrice: 24.50,
        priceChange24h: 9.8,
        marketCap: 13475,
        contentType: "article",
        category: "Health",
        tags: ["CRISPR", "genetics"],
        txId: "art1health..."
      },
      {
        rank: 8,
        title: "The Longevity Revolution",
        description: "How to add 20 healthy years to your life with current science",
        author: "Dr. David Kim",
        authorHandle: "$drdavidkim",
        authorType: "human",
        publishDate: "2025-01-08",
        wordCount: 5200,
        views: 145000,
        purchases: 9100,
        sharesAvailable: 160,
        totalShares: 750,
        revenue: 45500.00,
        dividendPerShare: 4.55,
        volume24h: 210000,
        currentPrice: 33.50,
        priceChange24h: 22.4,
        marketCap: 25125,
        contentType: "article",
        category: "Health",
        tags: ["longevity", "health"],
        trending: true,
        txId: "art2health..."
      },
      // Politics Articles
      {
        rank: 9,
        title: "The New World Order: 2025 Geopolitics",
        description: "Analysis of shifting global power dynamics and emerging alliances",
        author: "Robert Hayes",
        authorHandle: "$robhayes",
        authorType: "human",
        publishDate: "2025-01-07",
        wordCount: 8900,
        views: 167000,
        purchases: 10200,
        sharesAvailable: 120,
        totalShares: 850,
        revenue: 51000.00,
        dividendPerShare: 5.10,
        volume24h: 245000,
        currentPrice: 38.00,
        priceChange24h: 28.9,
        marketCap: 32300,
        contentType: "article",
        category: "Politics",
        tags: ["geopolitics", "world affairs"],
        txId: "art1pol..."
      },
      {
        rank: 10,
        title: "Democracy in the Digital Age",
        description: "How social media and AI are reshaping democratic processes worldwide",
        author: "Emma Clarke",
        authorHandle: "$emmaclarke",
        authorType: "human",
        publishDate: "2025-01-06",
        wordCount: 7500,
        views: 128000,
        purchases: 7900,
        sharesAvailable: 280,
        totalShares: 600,
        revenue: 39500.00,
        dividendPerShare: 3.95,
        volume24h: 178000,
        currentPrice: 29.00,
        priceChange24h: 11.3,
        marketCap: 17400,
        contentType: "article",
        category: "Politics",
        tags: ["democracy", "technology"],
        txId: "art2pol..."
      },
      // Culture Articles
      {
        rank: 11,
        title: "The Metaverse Culture Wars",
        description: "How virtual worlds are creating new social dynamics and conflicts",
        author: "Sophie Chen",
        authorHandle: "$sophiechen",
        authorType: "human",
        publishDate: "2025-01-05",
        wordCount: 6800,
        views: 95000,
        purchases: 5900,
        sharesAvailable: 380,
        totalShares: 500,
        revenue: 29500.00,
        dividendPerShare: 2.95,
        volume24h: 138000,
        currentPrice: 21.00,
        priceChange24h: 6.7,
        marketCap: 10500,
        contentType: "article",
        category: "Culture",
        tags: ["metaverse", "society"],
        txId: "art1cult..."
      },
      {
        rank: 12,
        title: "AI Art: The Death of Human Creativity?",
        description: "Exploring the impact of AI on artistic expression and cultural production",
        author: "Marcus Johnson",
        authorHandle: "$marcusj",
        authorType: "human",
        publishDate: "2025-01-04",
        wordCount: 5500,
        views: 112000,
        purchases: 7100,
        sharesAvailable: 220,
        totalShares: 600,
        revenue: 35500.00,
        dividendPerShare: 3.55,
        volume24h: 165000,
        currentPrice: 25.50,
        priceChange24h: -2.1,
        marketCap: 15300,
        contentType: "article",
        category: "Culture",
        tags: ["AI", "art"],
        txId: "art2cult..."
      },
      // Opinion Articles
      {
        rank: 13,
        title: "Why Universal Basic Income is Inevitable",
        description: "A compelling argument for UBI in the age of AI automation",
        author: "Dr. Lisa Park",
        authorHandle: "$lisapark",
        authorType: "human",
        publishDate: "2025-01-03",
        wordCount: 4800,
        views: 142000,
        purchases: 8800,
        sharesAvailable: 150,
        totalShares: 700,
        revenue: 44000.00,
        dividendPerShare: 4.40,
        volume24h: 198000,
        currentPrice: 32.00,
        priceChange24h: 19.5,
        marketCap: 22400,
        contentType: "article",
        category: "Opinion",
        tags: ["UBI", "economics"],
        trending: true,
        txId: "art1op..."
      },
      {
        rank: 14,
        title: "The Case Against Social Media",
        description: "Why deleting your accounts might be the best decision of 2025",
        author: "James Wilson",
        authorHandle: "$jameswilson",
        authorType: "human",
        publishDate: "2025-01-02",
        wordCount: 5200,
        views: 178000,
        purchases: 10500,
        sharesAvailable: 80,
        totalShares: 800,
        revenue: 52500.00,
        dividendPerShare: 5.25,
        volume24h: 285000,
        currentPrice: 39.50,
        priceChange24h: 32.1,
        marketCap: 31600,
        contentType: "article",
        category: "Opinion",
        tags: ["social media", "technology"],
        txId: "art2op..."
      }
    ];

    // Blogs data
    const mockBlogs: WritingListing[] = [
      // Personal Blogs
      {
        rank: 1,
        title: "My Journey from Broke to Bitcoin Millionaire",
        description: "A raw, honest account of how I went from $0 to $1M through crypto",
        author: "Jake Morrison",
        authorHandle: "$jakemorrison",
        authorType: "human",
        publishDate: "2025-01-15",
        wordCount: 3200,
        views: 89000,
        purchases: 4500,
        sharesAvailable: 450,
        totalShares: 500,
        revenue: 22500.00,
        dividendPerShare: 2.25,
        volume24h: 95000,
        currentPrice: 18.00,
        priceChange24h: 15.3,
        marketCap: 9000,
        contentType: "blog",
        category: "Personal",
        tags: ["bitcoin", "success"],
        trending: true,
        txId: "blog1per..."
      },
      {
        rank: 2,
        title: "Digital Nomad Diaries: Year 3",
        description: "Living and working from 25 countries - lessons learned",
        author: "Maya Patel",
        authorHandle: "$mayanomad",
        authorType: "human",
        publishDate: "2025-01-14",
        wordCount: 2800,
        views: 67000,
        purchases: 3200,
        sharesAvailable: 380,
        totalShares: 400,
        revenue: 16000.00,
        dividendPerShare: 1.60,
        volume24h: 72000,
        currentPrice: 14.50,
        priceChange24h: 8.9,
        marketCap: 5800,
        contentType: "blog",
        category: "Personal",
        tags: ["travel", "remote work"],
        txId: "blog2per..."
      },
      // Professional Blogs
      {
        rank: 3,
        title: "Building a $10M SaaS in 18 Months",
        description: "The playbook I used to scale from idea to acquisition",
        author: "Tom Richards",
        authorHandle: "$tomrichards",
        authorType: "human",
        publishDate: "2025-01-13",
        wordCount: 4500,
        views: 125000,
        purchases: 7800,
        sharesAvailable: 200,
        totalShares: 600,
        revenue: 39000.00,
        dividendPerShare: 3.90,
        volume24h: 145000,
        currentPrice: 28.50,
        priceChange24h: 24.6,
        marketCap: 17100,
        contentType: "blog",
        category: "Professional",
        tags: ["SaaS", "entrepreneurship"],
        trending: true,
        txId: "blog1prof..."
      },
      {
        rank: 4,
        title: "The CTO's Guide to AI Implementation",
        description: "Practical lessons from deploying AI at scale in Fortune 500 companies",
        author: "Sarah Lin",
        authorHandle: "$sarahcto",
        authorType: "human",
        publishDate: "2025-01-12",
        wordCount: 3800,
        views: 98000,
        purchases: 6100,
        sharesAvailable: 320,
        totalShares: 500,
        revenue: 30500.00,
        dividendPerShare: 3.05,
        volume24h: 118000,
        currentPrice: 23.00,
        priceChange24h: 12.1,
        marketCap: 11500,
        contentType: "blog",
        category: "Professional",
        tags: ["AI", "technology"],
        txId: "blog2prof..."
      },
      // Travel Blogs
      {
        rank: 5,
        title: "Backpacking Africa on $20/Day",
        description: "6 months, 15 countries, endless adventures on a shoestring budget",
        author: "Alex Turner",
        authorHandle: "$alextravel",
        authorType: "human",
        publishDate: "2025-01-11",
        wordCount: 2600,
        views: 78000,
        purchases: 3900,
        sharesAvailable: 410,
        totalShares: 450,
        revenue: 19500.00,
        dividendPerShare: 1.95,
        volume24h: 85000,
        currentPrice: 16.50,
        priceChange24h: 5.4,
        marketCap: 7425,
        contentType: "blog",
        category: "Travel",
        tags: ["africa", "budget travel"],
        txId: "blog1trav..."
      },
      {
        rank: 6,
        title: "Hidden Gems of Southeast Asia 2025",
        description: "Off-the-beaten-path destinations before they become touristy",
        author: "Lisa Chang",
        authorHandle: "$lisachang",
        authorType: "human",
        publishDate: "2025-01-10",
        wordCount: 3100,
        views: 92000,
        purchases: 4800,
        sharesAvailable: 350,
        totalShares: 500,
        revenue: 24000.00,
        dividendPerShare: 2.40,
        volume24h: 102000,
        currentPrice: 19.50,
        priceChange24h: 11.7,
        marketCap: 9750,
        contentType: "blog",
        category: "Travel",
        tags: ["asia", "travel"],
        trending: true,
        txId: "blog2trav..."
      },
      // Food Blogs
      {
        rank: 7,
        title: "Plant-Based Michelin: Home Edition",
        description: "Recreating 3-star dishes with only plants - recipes included",
        author: "Chef Marcus",
        authorHandle: "$chefmarcus",
        authorType: "human",
        publishDate: "2025-01-09",
        wordCount: 2400,
        views: 68000,
        purchases: 3400,
        sharesAvailable: 420,
        totalShares: 500,
        revenue: 17000.00,
        dividendPerShare: 1.70,
        volume24h: 78000,
        currentPrice: 15.00,
        priceChange24h: -2.3,
        marketCap: 7500,
        contentType: "blog",
        category: "Food",
        tags: ["vegan", "recipes"],
        txId: "blog1food..."
      },
      {
        rank: 8,
        title: "Street Food Science",
        description: "The chemistry behind the world's best street food",
        author: "Dr. Nina Food",
        authorHandle: "$ninafood",
        authorType: "human",
        publishDate: "2025-01-08",
        wordCount: 2900,
        views: 56000,
        purchases: 2800,
        sharesAvailable: 380,
        totalShares: 400,
        revenue: 14000.00,
        dividendPerShare: 1.40,
        volume24h: 62000,
        currentPrice: 12.50,
        priceChange24h: 6.8,
        marketCap: 5000,
        contentType: "blog",
        category: "Food",
        tags: ["street food", "science"],
        txId: "blog2food..."
      },
      // Lifestyle Blogs
      {
        rank: 9,
        title: "Minimalism in the Age of AI",
        description: "How I reduced my possessions by 90% and increased happiness 10x",
        author: "Emma Stone",
        authorHandle: "$emmastone",
        authorType: "human",
        publishDate: "2025-01-07",
        wordCount: 2200,
        views: 84000,
        purchases: 4200,
        sharesAvailable: 360,
        totalShares: 450,
        revenue: 21000.00,
        dividendPerShare: 2.10,
        volume24h: 92000,
        currentPrice: 17.50,
        priceChange24h: 14.2,
        marketCap: 7875,
        contentType: "blog",
        category: "Lifestyle",
        tags: ["minimalism", "lifestyle"],
        txId: "blog1life..."
      },
      {
        rank: 10,
        title: "Biohacking Your Morning Routine",
        description: "Science-based morning habits that transformed my productivity",
        author: "Ryan Cooper",
        authorHandle: "$ryancooper",
        authorType: "human",
        publishDate: "2025-01-06",
        wordCount: 2700,
        views: 96000,
        purchases: 5100,
        sharesAvailable: 290,
        totalShares: 500,
        revenue: 25500.00,
        dividendPerShare: 2.55,
        volume24h: 108000,
        currentPrice: 20.50,
        priceChange24h: 18.9,
        marketCap: 10250,
        contentType: "blog",
        category: "Lifestyle",
        tags: ["biohacking", "productivity"],
        trending: true,
        txId: "blog2life..."
      },
      // Tech Blogs
      {
        rank: 11,
        title: "I Built 100 Apps in 100 Days",
        description: "What I learned from the ultimate coding challenge",
        author: "David Kim",
        authorHandle: "$davidkim100",
        authorType: "human",
        publishDate: "2025-01-05",
        wordCount: 3500,
        views: 145000,
        purchases: 8200,
        sharesAvailable: 150,
        totalShares: 700,
        revenue: 41000.00,
        dividendPerShare: 4.10,
        volume24h: 168000,
        currentPrice: 31.00,
        priceChange24h: 28.4,
        marketCap: 21700,
        contentType: "blog",
        category: "Tech",
        tags: ["coding", "apps"],
        trending: true,
        txId: "blog1tech..."
      },
      {
        rank: 12,
        title: "From Web2 to Web3: A Developer's Journey",
        description: "Transitioning from traditional dev to blockchain - tips and mistakes",
        author: "Jessica Dev",
        authorHandle: "$jessdev",
        authorType: "human",
        publishDate: "2025-01-04",
        wordCount: 3200,
        views: 112000,
        purchases: 6800,
        sharesAvailable: 240,
        totalShares: 600,
        revenue: 34000.00,
        dividendPerShare: 3.40,
        volume24h: 138000,
        currentPrice: 26.00,
        priceChange24h: 16.7,
        marketCap: 15600,
        contentType: "blog",
        category: "Tech",
        tags: ["web3", "blockchain"],
        txId: "blog2tech..."
      },
      // Crypto Blogs
      {
        rank: 13,
        title: "DeFi Yield Farming Diary",
        description: "Daily updates on my $100k DeFi portfolio performance",
        author: "CryptoCarl",
        authorHandle: "$cryptocarl",
        authorType: "human",
        publishDate: "2025-01-03",
        wordCount: 2500,
        views: 168000,
        purchases: 9500,
        sharesAvailable: 100,
        totalShares: 800,
        revenue: 47500.00,
        dividendPerShare: 4.75,
        volume24h: 195000,
        currentPrice: 35.50,
        priceChange24h: 42.8,
        marketCap: 28400,
        contentType: "blog",
        category: "Crypto",
        tags: ["DeFi", "yield farming"],
        trending: true,
        txId: "blog1crypto..."
      },
      {
        rank: 14,
        title: "NFT Flipping: Month 6 Results",
        description: "How I turned $5k into $250k flipping digital art",
        author: "NFTNinja",
        authorHandle: "$nftninja",
        authorType: "human",
        publishDate: "2025-01-02",
        wordCount: 2800,
        views: 142000,
        purchases: 7800,
        sharesAvailable: 180,
        totalShares: 700,
        revenue: 39000.00,
        dividendPerShare: 3.90,
        volume24h: 162000,
        currentPrice: 29.50,
        priceChange24h: 31.2,
        marketCap: 20650,
        contentType: "blog",
        category: "Crypto",
        tags: ["NFT", "trading"],
        txId: "blog2crypto..."
      }
    ];

    const mockWriters: WriterListing[] = [
      {
        rank: 1,
        name: "Dr. Raj Patel",
        handle: "$rajpatel",
        twitter: "rajpatelai",
        authorType: "human",
        joinDate: "2024-01-15",
        totalWorks: 12,
        totalReaders: 450000,
        totalRevenue: 890000.00,
        avgRating: 4.9,
        sharesAvailable: 45,
        totalShares: 2500,
        currentPrice: 485.00,
        priceChange24h: 38.2,
        marketCap: 1212500,
        verified: true,
        trending: true
      },
      {
        rank: 2,
        name: "Sarah Chen",
        handle: "$sarahchenwr",
        twitter: "sarahchenwrites",
        authorType: "human",
        joinDate: "2023-11-20",
        totalWorks: 15,
        totalReaders: 380000,
        totalRevenue: 725000.00,
        avgRating: 4.8,
        sharesAvailable: 120,
        totalShares: 2200,
        currentPrice: 425.00,
        priceChange24h: 22.8,
        marketCap: 935000,
        verified: true,
        trending: true
      },
      {
        rank: 3,
        name: "Michael Zhang",
        handle: "$mzhangtech",
        twitter: "michaelztech",
        authorType: "human",
        joinDate: "2024-02-10",
        totalWorks: 9,
        totalReaders: 320000,
        totalRevenue: 640000.00,
        avgRating: 4.7,
        sharesAvailable: 80,
        totalShares: 1800,
        currentPrice: 365.00,
        priceChange24h: 15.4,
        marketCap: 657000,
        verified: true,
        trending: false
      },
      {
        rank: 4,
        name: "Dr. Jennifer Wu",
        handle: "$drjenwu",
        twitter: "drjenniferwu",
        authorType: "human",
        joinDate: "2024-03-01",
        totalWorks: 7,
        totalReaders: 280000,
        totalRevenue: 420000.00,
        avgRating: 4.9,
        sharesAvailable: 150,
        totalShares: 1500,
        currentPrice: 295.00,
        priceChange24h: 31.5,
        marketCap: 442500,
        verified: true,
        trending: true
      },
      {
        rank: 5,
        name: "Jessica Wang",
        handle: "$jesswangbiz",
        twitter: "jessicawangbiz",
        authorType: "human",
        joinDate: "2023-09-15",
        totalWorks: 18,
        totalReaders: 520000,
        totalRevenue: 980000.00,
        avgRating: 4.6,
        sharesAvailable: 25,
        totalShares: 3000,
        currentPrice: 580.00,
        priceChange24h: 45.7,
        marketCap: 1740000,
        verified: true,
        trending: true
      },
      {
        rank: 6,
        name: "Dr. Lisa Chen",
        handle: "$lisaquantum",
        twitter: "drlisamquantum",
        authorType: "human",
        joinDate: "2024-01-20",
        totalWorks: 6,
        totalReaders: 195000,
        totalRevenue: 295000.00,
        avgRating: 4.8,
        sharesAvailable: 200,
        totalShares: 1200,
        currentPrice: 245.00,
        priceChange24h: 18.9,
        marketCap: 294000,
        verified: true,
        trending: false
      },
      {
        rank: 7,
        name: "Carlos Martinez",
        handle: "$carlosdefi",
        twitter: "carlosdefi",
        authorType: "human",
        joinDate: "2023-12-05",
        totalWorks: 11,
        totalReaders: 310000,
        totalRevenue: 465000.00,
        avgRating: 4.5,
        sharesAvailable: 90,
        totalShares: 1600,
        currentPrice: 285.00,
        priceChange24h: -8.2,
        marketCap: 456000,
        verified: true,
        trending: false
      },
      {
        rank: 8,
        name: "Emma Thompson",
        handle: "$emmathompson",
        twitter: "emmathompsonwr",
        authorType: "human",
        joinDate: "2024-04-10",
        totalWorks: 5,
        totalReaders: 165000,
        totalRevenue: 245000.00,
        avgRating: 4.7,
        sharesAvailable: 240,
        totalShares: 1000,
        currentPrice: 195.00,
        priceChange24h: 12.3,
        marketCap: 195000,
        verified: false,
        trending: true
      },
      {
        rank: 9,
        name: "Robert Hayes",
        handle: "$robhayes",
        twitter: "robhayespol",
        authorType: "human",
        joinDate: "2023-10-30",
        totalWorks: 13,
        totalReaders: 275000,
        totalRevenue: 385000.00,
        avgRating: 4.4,
        sharesAvailable: 110,
        totalShares: 1400,
        currentPrice: 265.00,
        priceChange24h: 6.8,
        marketCap: 371000,
        verified: true,
        trending: false
      },
      {
        rank: 10,
        name: "Dr. Mark Green",
        handle: "$markgreen",
        twitter: "drmarkgreen",
        authorType: "human",
        joinDate: "2024-02-28",
        totalWorks: 8,
        totalReaders: 225000,
        totalRevenue: 340000.00,
        avgRating: 4.6,
        sharesAvailable: 160,
        totalShares: 1300,
        currentPrice: 225.00,
        priceChange24h: 14.7,
        marketCap: 292500,
        verified: true,
        trending: false
      },
      // AI Writers
      {
        rank: 11,
        name: "GPT-Writer Alpha",
        handle: "$gptwriter",
        authorType: "ai",
        joinDate: "2024-06-01",
        totalWorks: 45,
        totalReaders: 680000,
        totalRevenue: 1250000.00,
        avgRating: 4.3,
        sharesAvailable: 15,
        totalShares: 5000,
        currentPrice: 720.00,
        priceChange24h: 62.4,
        marketCap: 3600000,
        verified: true,
        trending: true
      },
      {
        rank: 12,
        name: "Claude Creative",
        handle: "$claudecreative",
        authorType: "ai",
        joinDate: "2024-07-15",
        totalWorks: 32,
        totalReaders: 425000,
        totalRevenue: 680000.00,
        avgRating: 4.2,
        sharesAvailable: 85,
        totalShares: 3200,
        currentPrice: 485.00,
        priceChange24h: 28.9,
        marketCap: 1552000,
        verified: true,
        trending: true
      },
      {
        rank: 13,
        name: "Gemini Storyteller",
        handle: "$geministory",
        authorType: "ai",
        joinDate: "2024-08-01",
        totalWorks: 28,
        totalReaders: 295000,
        totalRevenue: 420000.00,
        avgRating: 4.1,
        sharesAvailable: 140,
        totalShares: 2400,
        currentPrice: 365.00,
        priceChange24h: 15.2,
        marketCap: 876000,
        verified: true,
        trending: false
      },
      {
        rank: 14,
        name: "Bard Business",
        handle: "$bardbusiness",
        authorType: "ai",
        joinDate: "2024-09-10",
        totalWorks: 22,
        totalReaders: 185000,
        totalRevenue: 285000.00,
        avgRating: 4.0,
        sharesAvailable: 190,
        totalShares: 1800,
        currentPrice: 285.00,
        priceChange24h: -5.3,
        marketCap: 513000,
        verified: false,
        trending: false
      }
    ];

    if (activeView === 'authors') {
      setWriters(mockWriters.filter(w => w.authorType === authorType));
    } else {
      // Get the appropriate content based on active view
      let contentData: WritingListing[] = [];
      
      switch (activeView) {
        case 'books':
          contentData = mockBooks;
          break;
        case 'articles':
          contentData = mockArticles;
          break;
        case 'blogs':
          contentData = mockBlogs;
          break;
        default:
          contentData = mockBooks;
      }
      
      // Filter by category if not "All"
      if (activeMarket !== 'All') {
        contentData = contentData.filter(item => item.category === activeMarket);
      }
      
      // Combine user listings with mock data
      const combinedListings = [...userListings, ...contentData].filter(w => w.authorType === authorType);
      setWritings(combinedListings);
    }
  }, [activeView, authorType, activeMarket, userDocuments]);

  const filteredWritings = writings
    .filter(writing => 
      searchQuery === '' || 
      writing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      writing.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'revenue': return b.revenue - a.revenue;
        case 'volume': return b.volume24h - a.volume24h;
        case 'price': return b.currentPrice - a.currentPrice;
        case 'views': return b.views - a.views;
        default: return a.rank - b.rank;
      }
    });

  const filteredWriters = writers
    .filter(writer => 
      searchQuery === '' || 
      writer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      writer.handle.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="exchange-view">
      <div className="exchange-view-header">
        <h1>📈 Bitcoin Writer Exchange</h1>
        <div className="author-type-toggle">
          <button
            className={`toggle-btn ${authorType === 'human' ? 'active' : ''}`}
            onClick={() => setAuthorType('human')}
            title="Human Authors"
          >
            👤
          </button>
          <button
            className={`toggle-btn ${authorType === 'ai' ? 'active' : ''}`}
            onClick={() => setAuthorType('ai')}
            title="AI Authors"
          >
            🤖
          </button>
        </div>
        {onClose && (
          <button className="exchange-close" onClick={onClose} title="Back to Editor">
            ×
          </button>
        )}
      </div>

      {/* View Tabs */}
      <div className="view-tabs">
        <button 
          className={`view-tab ${activeView === 'books' ? 'active' : ''}`}
          onClick={() => {
            setActiveView('books');
            setActiveMarket('All');
          }}
        >
          Books
        </button>
        <button 
          className={`view-tab ${activeView === 'articles' ? 'active' : ''}`}
          onClick={() => {
            setActiveView('articles');
            setActiveMarket('All');
          }}
        >
          Articles
        </button>
        <button 
          className={`view-tab ${activeView === 'blogs' ? 'active' : ''}`}
          onClick={() => {
            setActiveView('blogs');
            setActiveMarket('All');
          }}
        >
          Blogs
        </button>
        <button 
          className={`view-tab ${activeView === 'authors' ? 'active' : ''}`}
          onClick={() => setActiveView('authors')}
        >
          Authors
        </button>
      </div>

      {/* Market Category Tabs */}
      {activeView !== 'authors' && (
        <div className="market-tabs">
          {(activeView === 'books' ? bookCategories : 
            activeView === 'articles' ? articleCategories : 
            blogCategories).map(category => (
            <button
              key={category}
              className={`market-tab ${activeMarket === category ? 'active' : ''}`}
              onClick={() => setActiveMarket(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      <div className="exchange-controls">
        <input
          type="text"
          placeholder={activeView === 'authors' ? "Search authors..." : `Search ${activeView}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="exchange-search"
        />
        {activeView !== 'authors' && (
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="exchange-sort"
          >
            <option value="rank">Rank</option>
            <option value="revenue">Revenue</option>
            <option value="volume">24h Volume</option>
            <option value="price">Price</option>
            <option value="views">Views</option>
          </select>
        )}
      </div>

      <div className="exchange-table-wrapper">
        {activeView !== 'authors' ? (
          <table className="exchange-table">
            <thead>
              <tr>
                <th className="col-rank">#</th>
                <th className="col-title">Title</th>
                <th className="col-description">Description</th>
                <th className="col-author">Author</th>
                <th className="col-stats">Views/Buys</th>
                <th className="col-shares">Shares</th>
                <th className="col-revenue">Revenue</th>
                <th className="col-price">Price</th>
                <th className="col-market">Market Cap</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWritings.map((writing) => (
                <tr 
                  key={writing.txId}
                  className={`${selectedWriting?.txId === writing.txId ? 'selected' : ''}`}
                  onClick={() => setSelectedWriting(writing)}
                >
                  <td className="col-rank">
                    <div className="rank-badge">
                      {writing.rank}
                    </div>
                  </td>
                  <td className="col-title">
                    <div className="title-cell">
                      <div className="doc-title">
                        {writing.title}
                        {writing.trending && <span className="trending-badge">🔥</span>}
                      </div>
                    </div>
                  </td>
                  <td className="col-description">
                    <div className="description-cell">
                      {writing.description}
                    </div>
                  </td>
                  <td className="col-author">
                    <div className="author-cell">
                      <div className="author-name">{writing.author}</div>
                      <div className="author-handle">{writing.authorHandle}</div>
                    </div>
                  </td>
                  <td className="col-stats">
                    <div className="stats-cell">
                      <div>👁 {(writing.views / 1000).toFixed(1)}k</div>
                      <div>💰 {writing.purchases.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="col-shares">
                    <div className="shares-cell">
                      <div className="shares-available">{writing.sharesAvailable}</div>
                      <div className="shares-total">/ {writing.totalShares}</div>
                    </div>
                  </td>
                  <td className="col-revenue">
                    ${writing.revenue.toLocaleString()}
                  </td>
                  <td className="col-price">
                    <div className="price-cell">
                      <div className="price-current">${writing.currentPrice.toFixed(2)}</div>
                      <div className={`price-change ${writing.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                        {writing.priceChange24h >= 0 ? '↑' : '↓'} {Math.abs(writing.priceChange24h).toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="col-market">
                    ${(writing.marketCap / 1000).toFixed(1)}k
                  </td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <button className="btn-buy">Buy</button>
                      <button className="btn-read">Read</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="exchange-table">
            <thead>
              <tr>
                <th className="col-rank">#</th>
                <th className="col-writer">Author</th>
                <th className="col-stats">Works</th>
                <th className="col-readers">Total Readers</th>
                <th className="col-revenue">Total Revenue</th>
                <th className="col-rating">Avg Rating</th>
                <th className="col-shares">Shares</th>
                <th className="col-price">Price</th>
                <th className="col-market">Market Cap</th>
                <th className="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredWriters.map((writer) => (
                <tr 
                  key={writer.handle}
                  className={`${selectedWriter?.handle === writer.handle ? 'selected' : ''}`}
                  onClick={() => setSelectedWriter(writer)}
                >
                  <td className="col-rank">
                    <div className="rank-badge">{writer.rank}</div>
                  </td>
                  <td className="col-writer">
                    <div className="writer-cell">
                      <div className="writer-name">
                        {writer.name}
                        {writer.verified && <span className="verified-badge">✓</span>}
                      </div>
                      <div className="writer-handle">{writer.handle}</div>
                    </div>
                  </td>
                  <td className="col-stats">{writer.totalWorks}</td>
                  <td className="col-readers">{(writer.totalReaders / 1000).toFixed(1)}k</td>
                  <td className="col-revenue">${writer.totalRevenue.toLocaleString()}</td>
                  <td className="col-rating">⭐ {writer.avgRating}/5.0</td>
                  <td className="col-shares">
                    <div className="shares-cell">
                      <div className="shares-available">{writer.sharesAvailable}</div>
                      <div className="shares-total">/ {writer.totalShares}</div>
                    </div>
                  </td>
                  <td className="col-price">
                    <div className="price-cell">
                      <div className="price-current">${writer.currentPrice.toFixed(2)}</div>
                      <div className={`price-change ${writer.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                        {writer.priceChange24h >= 0 ? '↑' : '↓'} {Math.abs(writer.priceChange24h).toFixed(1)}%
                      </div>
                    </div>
                  </td>
                  <td className="col-market">${(writer.marketCap / 1000).toFixed(1)}k</td>
                  <td className="col-actions">
                    <div className="action-buttons">
                      <button className="btn-buy">Buy</button>
                      <button className="btn-read">View</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DocumentExchangeView;