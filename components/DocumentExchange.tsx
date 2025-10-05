import React, { useState, useEffect } from 'react';
import './DocumentExchange.css';

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

interface DocumentExchangeProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWriter?: (writing: WritingListing) => void;
}

const DocumentExchange: React.FC<DocumentExchangeProps> = ({ isOpen, onClose, onSelectWriter }) => {
  const [writings, setWritings] = useState<WritingListing[]>([]);
  const [writers, setWriters] = useState<WriterListing[]>([]);
  const [authorType, setAuthorType] = useState<'human' | 'ai'>('human');
  const [activeView, setActiveView] = useState<'books' | 'articles' | 'blogs' | 'writers'>('books');
  const [activeMarket, setActiveMarket] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'rank' | 'revenue' | 'volume' | 'price' | 'views'>('rank');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWriting, setSelectedWriting] = useState<WritingListing | null>(null);
  const [selectedWriter, setSelectedWriter] = useState<WriterListing | null>(null);

  const bookCategories = ['All', 'Fiction', 'Non-Fiction', 'Business', 'Tech', 'Health', 'Self-Help', 'History', 'Science'];
  const articleCategories = ['All', 'Tech', 'Business', 'Finance', 'Health', 'Politics', 'Culture', 'Opinion'];
  const blogCategories = ['All', 'Personal', 'Professional', 'Travel', 'Food', 'Lifestyle', 'Tech', 'Crypto'];

  // Mock data for different content types
  useEffect(() => {
    // Human-authored books
    const humanBookListings: WritingListing[] = [
      // Fiction Books
      {
        rank: 1,
        title: "The Last Train to Memphis",
        description: "A gripping mystery novel following detective Sarah Mills as she investigates a series of murders on a cross-country train journey",
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
        rank: 2,
        title: "Neon Nights in Neo Tokyo",
        description: "A cyberpunk epic set in 2089 Tokyo where hackers fight megacorps for control of the world's last free network",
        author: "Marcus Blake",
        authorHandle: "$mblake",
        authorTwitter: "marcusblakewrites",
        authorType: "human",
        publishDate: "2025-01-14",
        wordCount: 95000,
        views: 420000,
        purchases: 35000,
        sharesAvailable: 150,
        totalShares: 750,
        revenue: 175000.00,
        dividendPerShare: 23.33,
        volume24h: 680000,
        currentPrice: 95.50,
        priceChange24h: -15.0,
        marketCap: 71625,
        contentType: "book",
        category: "Fiction",
        tags: ["cyberpunk", "dystopian"],
        txId: "fic2b3c4d5..."
      },
      {
        rank: 3,
        title: "Love Letters from a Time Traveler",
        description: "A romantic sci-fi tale told through letters between lovers separated by centuries, exploring themes of fate and temporal paradoxes",
        author: "Emma Rodriguez",
        authorHandle: "$emmawrites",
        authorTwitter: "emmarodwrites",
        publishDate: "2025-01-13",
        wordCount: 62000,
        views: 380000,
        purchases: 22000,
        sharesAvailable: 0,
        totalShares: 500,
        revenue: 88000.00,
        dividendPerShare: 17.60,
        volume24h: 420000,
        currentPrice: 89.00,
        priceChange24h: 28.5,
        marketCap: 44500,
        contentType: "book",
        category: "Fiction",
        tags: ["romance", "sci-fi"],
        txId: "fic3c4d5e6..."
      },
      {
        rank: 4,
        title: "The Whispers of Avalon",
        description: "Epic fantasy saga where ancient magic returns to a world that has forgotten its existence",
        author: "Thomas Blackwood",
        authorHandle: "$tblackwood",
        publishDate: "2025-01-12",
        wordCount: 120000,
        views: 356000,
        purchases: 28000,
        sharesAvailable: 75,
        totalShares: 600,
        revenue: 112000.00,
        dividendPerShare: 18.67,
        volume24h: 520000,
        currentPrice: 78.00,
        priceChange24h: 12.3,
        marketCap: 46800,
        contentType: "book",
        category: "Fiction",
        tags: ["fantasy", "magic"],
        txId: "fic4d5e6f7..."
      },
      
      // Non-Fiction Books
      {
        rank: 1,
        title: "The Forgotten Revolution",
        description: "How Bitcoin SV restored Satoshi's original vision and transformed global finance through unbounded scaling",
        author: "Dr. Michael Harrison",
        authorHandle: "$drharrison",
        authorTwitter: "drharrisonwrites",
        publishDate: "2025-01-15",
        wordCount: 65000,
        views: 520000,
        purchases: 45000,
        sharesAvailable: 100,
        totalShares: 1500,
        revenue: 225000.00,
        dividendPerShare: 15.00,
        volume24h: 920000,
        currentPrice: 185.00,
        priceChange24h: 35.2,
        marketCap: 277500,
        contentType: "book",
        category: "Non-Fiction",
        tags: ["history", "economics"],
        trending: true,
        txId: "nf1a2b3c4..."
      },
      {
        rank: 2,
        title: "Thinking in Systems",
        description: "A comprehensive guide to understanding complex systems and their behavior in nature, business, and society",
        author: "Dr. Diana Meadows",
        authorHandle: "$dmeadows",
        publishDate: "2025-01-14",
        wordCount: 48000,
        views: 412000,
        purchases: 38000,
        sharesAvailable: 60,
        totalShares: 800,
        revenue: 152000.00,
        dividendPerShare: 19.00,
        volume24h: 640000,
        currentPrice: 142.00,
        priceChange24h: 28.7,
        marketCap: 113600,
        contentType: "book",
        category: "Non-Fiction",
        tags: ["systems", "complexity"],
        txId: "nf2b3c4d5..."
      },
      {
        rank: 3,
        title: "The Art of Memory",
        description: "Rediscovering ancient memory techniques and their applications in the modern digital age",
        author: "Joshua Foer",
        authorHandle: "$jfoer",
        publishDate: "2025-01-13",
        wordCount: 52000,
        views: 389000,
        purchases: 32000,
        sharesAvailable: 45,
        totalShares: 700,
        revenue: 128000.00,
        dividendPerShare: 18.29,
        volume24h: 560000,
        currentPrice: 118.00,
        priceChange24h: 15.8,
        marketCap: 82600,
        contentType: "book",
        category: "Non-Fiction",
        tags: ["memory", "learning"],
        txId: "nf3c4d5e6..."
      },
      
      // Business Books
      {
        rank: 1,
        title: "The Retail Trader's Bible",
        description: "Complete guide to successful retail trading, from psychology and risk management to technical analysis",
        author: "Robert Chang",
        authorHandle: "$robertchang",
        authorTwitter: "robertchangfin",
        publishDate: "2025-01-15",
        wordCount: 45000,
        views: 620000,
        purchases: 52000,
        sharesAvailable: 25,
        totalShares: 1200,
        revenue: 312000.00,
        dividendPerShare: 26.00,
        volume24h: 1280000,
        currentPrice: 225.00,
        priceChange24h: 48.7,
        marketCap: 270000,
        contentType: "book",
        category: "Business",
        tags: ["trading", "investing"],
        trending: true,
        txId: "bus1a2b3c4..."
      },
      {
        rank: 2,
        title: "Zero to One",
        description: "Notes on startups and how to build companies that create new things rather than copying what exists",
        author: "Peter Thiel",
        authorHandle: "$pthiel",
        publishDate: "2025-01-14",
        wordCount: 42000,
        views: 580000,
        purchases: 48000,
        sharesAvailable: 40,
        totalShares: 1000,
        revenue: 240000.00,
        dividendPerShare: 24.00,
        volume24h: 1000000,
        currentPrice: 198.00,
        priceChange24h: 32.5,
        marketCap: 198000,
        contentType: "book",
        category: "Business",
        tags: ["startup", "innovation"],
        trending: true,
        txId: "bus2b3c4d5..."
      },
      {
        rank: 3,
        title: "The Infinite Game",
        description: "How great businesses achieve long-lasting success by thinking beyond quarterly earnings",
        author: "Simon Sinek",
        authorHandle: "$ssinek",
        publishDate: "2025-01-13",
        wordCount: 38000,
        views: 456000,
        purchases: 42000,
        sharesAvailable: 70,
        totalShares: 900,
        revenue: 168000.00,
        dividendPerShare: 18.67,
        volume24h: 720000,
        currentPrice: 165.00,
        priceChange24h: 22.8,
        marketCap: 148500,
        contentType: "book",
        category: "Business",
        tags: ["strategy", "leadership"],
        txId: "bus3c4d5e6..."
      },
      
      // Tech Books
      {
        rank: 1,
        title: "Building AGI: The Next Frontier",
        description: "An in-depth exploration of artificial general intelligence development and future possibilities",
        author: "David Kim",
        authorHandle: "$davidkim",
        authorTwitter: "davidkimtech",
        publishDate: "2025-01-15",
        wordCount: 72000,
        views: 680000,
        purchases: 55000,
        sharesAvailable: 40,
        totalShares: 1100,
        revenue: 385000.00,
        dividendPerShare: 35.00,
        volume24h: 1420000,
        currentPrice: 265.00,
        priceChange24h: 52.1,
        marketCap: 291500,
        contentType: "book",
        category: "Tech",
        tags: ["AI", "AGI"],
        trending: true,
        txId: "tech1a2b3c..."
      },
      {
        rank: 2,
        title: "Quantum Computing Explained",
        description: "Making quantum computing accessible to programmers and engineers without a physics PhD",
        author: "Dr. Sarah Quantum",
        authorHandle: "$squantum",
        publishDate: "2025-01-14",
        wordCount: 58000,
        views: 523000,
        purchases: 45000,
        sharesAvailable: 55,
        totalShares: 800,
        revenue: 270000.00,
        dividendPerShare: 33.75,
        volume24h: 960000,
        currentPrice: 218.00,
        priceChange24h: 38.5,
        marketCap: 174400,
        contentType: "book",
        category: "Tech",
        tags: ["quantum", "computing"],
        txId: "tech2b3c4d..."
      },
      {
        rank: 3,
        title: "The Network State",
        description: "How to start a new country in the cloud and eventually materialize it on land",
        author: "Balaji Srinivasan",
        authorHandle: "$balaji",
        authorTwitter: "balajis",
        publishDate: "2025-01-13",
        wordCount: 85000,
        views: 467000,
        purchases: 38000,
        sharesAvailable: 30,
        totalShares: 600,
        revenue: 228000.00,
        dividendPerShare: 38.00,
        volume24h: 780000,
        currentPrice: 195.00,
        priceChange24h: 28.9,
        marketCap: 117000,
        contentType: "book",
        category: "Tech",
        tags: ["network", "decentralization"],
        txId: "tech3c4d5e..."
      },
      
      // Health Books
      {
        rank: 1,
        title: "The Longevity Protocol",
        description: "Science-based strategies for extending healthspan and lifespan through nutrition and exercise",
        author: "Dr. Emily Chen",
        authorHandle: "$dremilychen",
        authorTwitter: "dremilychenmd",
        publishDate: "2025-01-15",
        wordCount: 45000,
        views: 580000,
        purchases: 48000,
        sharesAvailable: 80,
        totalShares: 1000,
        revenue: 288000.00,
        dividendPerShare: 28.80,
        volume24h: 960000,
        currentPrice: 175.00,
        priceChange24h: 32.6,
        marketCap: 175000,
        contentType: "book",
        category: "Health",
        tags: ["longevity", "wellness"],
        trending: true,
        txId: "health1a2b..."
      },
      {
        rank: 2,
        title: "The Sleep Revolution",
        description: "Why sleep is your superpower and how to optimize it for peak performance and health",
        author: "Dr. Matthew Walker",
        authorHandle: "$mwalker",
        publishDate: "2025-01-14",
        wordCount: 52000,
        views: 498000,
        purchases: 42000,
        sharesAvailable: 65,
        totalShares: 900,
        revenue: 210000.00,
        dividendPerShare: 23.33,
        volume24h: 810000,
        currentPrice: 152.00,
        priceChange24h: 25.8,
        marketCap: 136800,
        contentType: "book",
        category: "Health",
        tags: ["sleep", "performance"],
        txId: "health2b3c..."
      },
      {
        rank: 3,
        title: "Metabolic Fitness",
        description: "Understanding and optimizing your metabolism for weight loss, energy, and longevity",
        author: "Dr. Casey Means",
        authorHandle: "$cmeans",
        publishDate: "2025-01-13",
        wordCount: 48000,
        views: 432000,
        purchases: 38000,
        sharesAvailable: 90,
        totalShares: 800,
        revenue: 152000.00,
        dividendPerShare: 19.00,
        volume24h: 640000,
        currentPrice: 128.00,
        priceChange24h: 18.5,
        marketCap: 102400,
        contentType: "book",
        category: "Health",
        tags: ["metabolism", "fitness"],
        txId: "health3c4d..."
      },
      
      // Self-Help Books
      {
        rank: 1,
        title: "Atomic Habits",
        description: "How tiny changes can yield remarkable results and compound into major achievements over time",
        author: "James Clear",
        authorHandle: "$jclear",
        authorTwitter: "jamesclear",
        publishDate: "2025-01-15",
        wordCount: 42000,
        views: 892000,
        purchases: 72000,
        sharesAvailable: 20,
        totalShares: 1500,
        revenue: 432000.00,
        dividendPerShare: 28.80,
        volume24h: 1800000,
        currentPrice: 285.00,
        priceChange24h: 45.2,
        marketCap: 427500,
        contentType: "book",
        category: "Self-Help",
        tags: ["habits", "productivity"],
        trending: true,
        txId: "self1a2b3c..."
      },
      {
        rank: 2,
        title: "The Courage to Be Disliked",
        description: "How to free yourself, change your life, and achieve real happiness through Adlerian psychology",
        author: "Ichiro Kishimi",
        authorHandle: "$ikishimi",
        publishDate: "2025-01-14",
        wordCount: 38000,
        views: 567000,
        purchases: 48000,
        sharesAvailable: 45,
        totalShares: 1000,
        revenue: 240000.00,
        dividendPerShare: 24.00,
        volume24h: 1000000,
        currentPrice: 198.00,
        priceChange24h: 32.8,
        marketCap: 198000,
        contentType: "book",
        category: "Self-Help",
        tags: ["psychology", "happiness"],
        txId: "self2b3c4d..."
      },
      {
        rank: 3,
        title: "Deep Work",
        description: "Rules for focused success in a distracted world and how to cultivate concentration",
        author: "Cal Newport",
        authorHandle: "$cnewport",
        publishDate: "2025-01-13",
        wordCount: 44000,
        views: 489000,
        purchases: 42000,
        sharesAvailable: 60,
        totalShares: 800,
        revenue: 168000.00,
        dividendPerShare: 21.00,
        volume24h: 640000,
        currentPrice: 165.00,
        priceChange24h: 25.5,
        marketCap: 132000,
        contentType: "book",
        category: "Self-Help",
        tags: ["focus", "productivity"],
        txId: "self3c4d5e..."
      },
      
      // History Books
      {
        rank: 1,
        title: "The Fall of Empires",
        description: "Common patterns in the rise and fall of great civilizations throughout human history",
        author: "Dr. William Durant",
        authorHandle: "$wdurant",
        publishDate: "2025-01-15",
        wordCount: 98000,
        views: 423000,
        purchases: 35000,
        sharesAvailable: 70,
        totalShares: 900,
        revenue: 175000.00,
        dividendPerShare: 19.44,
        volume24h: 720000,
        currentPrice: 142.00,
        priceChange24h: 22.5,
        marketCap: 127800,
        contentType: "book",
        category: "History",
        tags: ["civilizations", "empires"],
        trending: true,
        txId: "hist1a2b3c..."
      },
      {
        rank: 2,
        title: "The Silk Roads",
        description: "A new history of the world from the perspective of the East and the trade routes that shaped civilization",
        author: "Peter Frankopan",
        authorHandle: "$pfrankopan",
        publishDate: "2025-01-14",
        wordCount: 112000,
        views: 389000,
        purchases: 32000,
        sharesAvailable: 85,
        totalShares: 700,
        revenue: 128000.00,
        dividendPerShare: 18.29,
        volume24h: 560000,
        currentPrice: 118.00,
        priceChange24h: 18.7,
        marketCap: 82600,
        contentType: "book",
        category: "History",
        tags: ["trade", "civilization"],
        txId: "hist2b3c4d..."
      },
      {
        rank: 3,
        title: "The Code Breakers",
        description: "The secret history of cryptography from ancient times to quantum encryption",
        author: "David Kahn",
        authorHandle: "$dkahn",
        publishDate: "2025-01-13",
        wordCount: 125000,
        views: 312000,
        purchases: 28000,
        sharesAvailable: 100,
        totalShares: 600,
        revenue: 112000.00,
        dividendPerShare: 18.67,
        volume24h: 480000,
        currentPrice: 95.00,
        priceChange24h: 15.2,
        marketCap: 57000,
        contentType: "book",
        category: "History",
        tags: ["cryptography", "technology"],
        txId: "hist3c4d5e..."
      },
      
      // Science Books
      {
        rank: 1,
        title: "The Elegant Universe",
        description: "String theory and the quest for the ultimate theory of everything in physics",
        author: "Brian Greene",
        authorHandle: "$bgreene",
        authorTwitter: "bgreene",
        publishDate: "2025-01-15",
        wordCount: 68000,
        views: 512000,
        purchases: 42000,
        sharesAvailable: 50,
        totalShares: 1000,
        revenue: 210000.00,
        dividendPerShare: 21.00,
        volume24h: 800000,
        currentPrice: 168.00,
        priceChange24h: 28.5,
        marketCap: 168000,
        contentType: "book",
        category: "Science",
        tags: ["physics", "cosmology"],
        trending: true,
        txId: "sci1a2b3c4..."
      },
      {
        rank: 2,
        title: "The Gene",
        description: "An intimate history of heredity and the future of human genetic engineering",
        author: "Siddhartha Mukherjee",
        authorHandle: "$smukherjee",
        publishDate: "2025-01-14",
        wordCount: 82000,
        views: 467000,
        purchases: 38000,
        sharesAvailable: 65,
        totalShares: 800,
        revenue: 152000.00,
        dividendPerShare: 19.00,
        volume24h: 640000,
        currentPrice: 145.00,
        priceChange24h: 24.8,
        marketCap: 116000,
        contentType: "book",
        category: "Science",
        tags: ["genetics", "biology"],
        txId: "sci2b3c4d5..."
      },
      {
        rank: 3,
        title: "Astrophysics for People in a Hurry",
        description: "Everything you need to know about the universe delivered in bite-sized chapters",
        author: "Neil deGrasse Tyson",
        authorHandle: "$ntyson",
        authorTwitter: "neiltyson",
        publishDate: "2025-01-13",
        wordCount: 35000,
        views: 589000,
        purchases: 48000,
        sharesAvailable: 40,
        totalShares: 700,
        revenue: 144000.00,
        dividendPerShare: 20.57,
        volume24h: 560000,
        currentPrice: 125.00,
        priceChange24h: 20.5,
        marketCap: 87500,
        contentType: "book",
        category: "Science",
        tags: ["astronomy", "physics"],
        txId: "sci3c4d5e6..."
      }
    ].map(item => ({...item, authorType: 'human' as const})) as WritingListing[];

    // AI-authored books  
    const aiBookListings: WritingListing[] = [
      // AI Fiction Books
      {
        rank: 1,
        title: "The Quantum Paradox",
        description: "An AI-generated thriller exploring consciousness, time loops, and the nature of reality itself",
        author: "GPT-5 Novelist",
        authorHandle: "$gpt5novelist",
        authorType: "ai",
        publishDate: "2025-01-16",
        wordCount: 92000,
        views: 892000,
        purchases: 68000,
        sharesAvailable: 10,
        totalShares: 1200,
        revenue: 408000.00,
        dividendPerShare: 34.00,
        volume24h: 2040000,
        currentPrice: 285.00,
        priceChange24h: 62.5,
        marketCap: 342000,
        contentType: "book",
        category: "Fiction",
        tags: ["ai-generated", "thriller", "scifi"],
        trending: true,
        txId: "ai-fic1..."
      },
      {
        rank: 1,
        title: "Optimizing Human Performance",
        description: "AI-synthesized guide combining 10,000 research papers on peak performance and longevity",
        author: "Claude Researcher",
        authorHandle: "$clauderesearch",
        authorType: "ai",
        publishDate: "2025-01-15",
        wordCount: 78000,
        views: 723000,
        purchases: 58000,
        sharesAvailable: 25,
        totalShares: 1000,
        revenue: 290000.00,
        dividendPerShare: 29.00,
        volume24h: 1450000,
        currentPrice: 225.00,
        priceChange24h: 48.5,
        marketCap: 225000,
        contentType: "book",
        category: "Health",
        tags: ["ai-research", "performance", "longevity"],
        trending: true,
        txId: "ai-health1..."
      },
      {
        rank: 1,
        title: "The AI Business Strategist",
        description: "Machine learning model trained on 50,000 business cases provides ultimate strategic playbook",
        author: "BizGPT Pro",
        authorHandle: "$bizgpt",
        authorType: "ai",
        publishDate: "2025-01-14",
        wordCount: 65000,
        views: 567000,
        purchases: 48000,
        sharesAvailable: 40,
        totalShares: 900,
        revenue: 216000.00,
        dividendPerShare: 24.00,
        volume24h: 1080000,
        currentPrice: 195.00,
        priceChange24h: 42.3,
        marketCap: 175500,
        contentType: "book",
        category: "Business",
        tags: ["ai-strategy", "business", "ml"],
        trending: true,
        txId: "ai-biz1..."
      }
    ];

    const humanArticleListings: WritingListing[] = [
      // Tech Articles
      {
        rank: 1,
        title: "The State of AI in 2025",
        description: "Comprehensive analysis of current AI capabilities, limitations, and the path toward AGI in the next decade",
        author: "Dr. Alan Turing Jr.",
        authorHandle: "$turingjr",
        authorTwitter: "aituringjr",
        publishDate: "2025-01-16",
        wordCount: 8500,
        views: 892000,
        purchases: 72000,
        sharesAvailable: 30,
        totalShares: 800,
        revenue: 216000.00,
        dividendPerShare: 27.00,
        volume24h: 1120000,
        currentPrice: 185.00,
        priceChange24h: 38.2,
        marketCap: 148000,
        contentType: "article",
        category: "Tech",
        tags: ["AI", "future", "technology"],
        trending: true,
        txId: "tech-art1..."
      },
      {
        rank: 2,
        title: "Why Rust Won the Systems Programming War",
        description: "Analysis of how Rust displaced C++ in critical infrastructure and what it means for software security",
        author: "Graydon Hoare",
        authorHandle: "$ghoare",
        publishDate: "2025-01-15",
        wordCount: 7200,
        views: 623000,
        purchases: 52000,
        sharesAvailable: 45,
        totalShares: 600,
        revenue: 156000.00,
        dividendPerShare: 26.00,
        volume24h: 780000,
        currentPrice: 142.00,
        priceChange24h: 28.5,
        marketCap: 85200,
        contentType: "article",
        category: "Tech",
        tags: ["programming", "rust", "systems"],
        txId: "tech-art2..."
      },
      {
        rank: 3,
        title: "The Real Web3: BSV's Quiet Revolution",
        description: "How Bitcoin SV is building the actual infrastructure for Web3 while others chase speculation",
        author: "Craig Wright",
        authorHandle: "$cswright",
        publishDate: "2025-01-14",
        wordCount: 6800,
        views: 512000,
        purchases: 45000,
        sharesAvailable: 60,
        totalShares: 500,
        revenue: 135000.00,
        dividendPerShare: 27.00,
        volume24h: 650000,
        currentPrice: 118.00,
        priceChange24h: 22.3,
        marketCap: 59000,
        contentType: "article",
        category: "Tech",
        tags: ["blockchain", "bsv", "web3"],
        txId: "tech-art3..."
      },
      
      // Business Articles
      {
        rank: 1,
        title: "Remote Work is Dead, Long Live Remote Work",
        description: "Data-driven analysis of how remote work is evolving post-2024 and what it means for companies",
        author: "Brian Chesky",
        authorHandle: "$bchesky",
        publishDate: "2025-01-15",
        wordCount: 5400,
        views: 721000,
        purchases: 58000,
        sharesAvailable: 35,
        totalShares: 700,
        revenue: 174000.00,
        dividendPerShare: 24.86,
        volume24h: 910000,
        currentPrice: 165.00,
        priceChange24h: 35.2,
        marketCap: 115500,
        contentType: "article",
        category: "Business",
        tags: ["remote", "work", "culture"],
        trending: true,
        txId: "biz-art1..."
      },
      {
        rank: 2,
        title: "The $100 Trillion TAM Nobody Sees",
        description: "Why the next mega-companies will come from industries investors are currently ignoring",
        author: "Marc Andreessen",
        authorHandle: "$pmarca",
        authorTwitter: "pmarca",
        publishDate: "2025-01-14",
        wordCount: 4800,
        views: 589000,
        purchases: 48000,
        sharesAvailable: 50,
        totalShares: 600,
        revenue: 144000.00,
        dividendPerShare: 24.00,
        volume24h: 720000,
        currentPrice: 138.00,
        priceChange24h: 28.7,
        marketCap: 82800,
        contentType: "article",
        category: "Business",
        tags: ["venture", "markets", "opportunity"],
        txId: "biz-art2..."
      },
      {
        rank: 3,
        title: "Why Your Startup Will Fail",
        description: "The 7 predictable mistakes that kill 90% of startups and how to avoid them",
        author: "Paul Graham",
        authorHandle: "$pg",
        authorTwitter: "paulg",
        publishDate: "2025-01-13",
        wordCount: 3200,
        views: 456000,
        purchases: 38000,
        sharesAvailable: 65,
        totalShares: 500,
        revenue: 114000.00,
        dividendPerShare: 22.80,
        volume24h: 550000,
        currentPrice: 105.00,
        priceChange24h: 18.5,
        marketCap: 52500,
        contentType: "article",
        category: "Business",
        tags: ["startup", "failure", "lessons"],
        txId: "biz-art3..."
      },
      
      // Finance Articles
      {
        rank: 1,
        title: "Bitcoin's Path to $1 Million",
        description: "Economic analysis of hyperbitcoinization scenarios and the mathematical case for seven-figure Bitcoin",
        author: "Michael Saylor",
        authorHandle: "$saylor",
        authorTwitter: "saylor",
        publishDate: "2025-01-15",
        wordCount: 6200,
        views: 956000,
        purchases: 78000,
        sharesAvailable: 15,
        totalShares: 900,
        revenue: 234000.00,
        dividendPerShare: 26.00,
        volume24h: 1170000,
        currentPrice: 225.00,
        priceChange24h: 52.5,
        marketCap: 202500,
        contentType: "article",
        category: "Finance",
        tags: ["bitcoin", "economics"],
        trending: true,
        txId: "fin-art1..."
      },
      {
        rank: 2,
        title: "The Coming Commercial Real Estate Apocalypse",
        description: "Why $2.5 trillion in CRE debt will trigger the next financial crisis and how to profit from it",
        author: "Barry Ritholtz",
        authorHandle: "$britholtz",
        publishDate: "2025-01-14",
        wordCount: 7500,
        views: 678000,
        purchases: 55000,
        sharesAvailable: 40,
        totalShares: 700,
        revenue: 165000.00,
        dividendPerShare: 23.57,
        volume24h: 840000,
        currentPrice: 178.00,
        priceChange24h: 38.2,
        marketCap: 124600,
        contentType: "article",
        category: "Finance",
        tags: ["real-estate", "crisis", "debt"],
        txId: "fin-art2..."
      },
      {
        rank: 3,
        title: "DeFi 2.0: The Protocol Wars Begin",
        description: "How the next generation of DeFi protocols will capture $10 trillion in traditional finance",
        author: "Andre Cronje",
        authorHandle: "$andre",
        publishDate: "2025-01-13",
        wordCount: 5800,
        views: 523000,
        purchases: 45000,
        sharesAvailable: 55,
        totalShares: 600,
        revenue: 135000.00,
        dividendPerShare: 22.50,
        volume24h: 660000,
        currentPrice: 142.00,
        priceChange24h: 25.8,
        marketCap: 85200,
        contentType: "article",
        category: "Finance",
        tags: ["defi", "crypto", "protocols"],
        txId: "fin-art3..."
      },
      
      // Health Articles  
      {
        rank: 1,
        title: "The Obesity Epidemic: A Systems Approach",
        description: "Examining obesity through the lens of complex systems theory and proposing novel interventions",
        author: "Dr. Robert Lustig",
        authorHandle: "$drlustig",
        publishDate: "2025-01-15",
        wordCount: 9200,
        views: 589000,
        purchases: 48000,
        sharesAvailable: 60,
        totalShares: 700,
        revenue: 144000.00,
        dividendPerShare: 20.57,
        volume24h: 700000,
        currentPrice: 125.00,
        priceChange24h: 28.5,
        marketCap: 87500,
        contentType: "article",
        category: "Health",
        tags: ["health", "obesity", "systems"],
        trending: true,
        txId: "health-art1..."
      },
      {
        rank: 2,
        title: "mRNA Beyond COVID: The Next Medical Revolution",
        description: "How mRNA technology will cure cancer, reverse aging, and transform medicine forever",
        author: "Dr. Katalin Karikó",
        authorHandle: "$kkariko",
        publishDate: "2025-01-14",
        wordCount: 7800,
        views: 456000,
        purchases: 38000,
        sharesAvailable: 75,
        totalShares: 600,
        revenue: 114000.00,
        dividendPerShare: 19.00,
        volume24h: 540000,
        currentPrice: 98.00,
        priceChange24h: 22.3,
        marketCap: 58800,
        contentType: "article",
        category: "Health",
        tags: ["mrna", "medicine", "innovation"],
        txId: "health-art2..."
      },
      {
        rank: 3,
        title: "The Microbiome Gold Rush",
        description: "Why gut health startups will be the next billion-dollar healthcare category",
        author: "Dr. Tim Spector",
        authorHandle: "$tspector",
        publishDate: "2025-01-13",
        wordCount: 6500,
        views: 378000,
        purchases: 32000,
        sharesAvailable: 85,
        totalShares: 500,
        revenue: 96000.00,
        dividendPerShare: 19.20,
        volume24h: 450000,
        currentPrice: 85.00,
        priceChange24h: 18.5,
        marketCap: 42500,
        contentType: "article",
        category: "Health",
        tags: ["microbiome", "gut", "startup"],
        txId: "health-art3..."
      },
      
      // Politics Articles
      {
        rank: 1,
        title: "The New Cold War: Tech Edition",
        description: "Geopolitical analysis of the US-China technology competition and implications for innovation",
        author: "Jennifer Wu",
        authorHandle: "$jenwu",
        authorTwitter: "jenwuanalysis",
        publishDate: "2025-01-15",
        wordCount: 7800,
        views: 743000,
        purchases: 58000,
        sharesAvailable: 30,
        totalShares: 800,
        revenue: 174000.00,
        dividendPerShare: 21.75,
        volume24h: 960000,
        currentPrice: 165.00,
        priceChange24h: 32.5,
        marketCap: 132000,
        contentType: "article",
        category: "Politics",
        tags: ["geopolitics", "technology", "china"],
        trending: true,
        txId: "pol-art1..."
      },
      {
        rank: 2,
        title: "The Coming Water Wars",
        description: "How water scarcity will reshape global politics and trigger the next wave of conflicts",
        author: "Peter Gleick",
        authorHandle: "$pgleick",
        publishDate: "2025-01-14",
        wordCount: 8200,
        views: 523000,
        purchases: 42000,
        sharesAvailable: 50,
        totalShares: 600,
        revenue: 126000.00,
        dividendPerShare: 21.00,
        volume24h: 660000,
        currentPrice: 138.00,
        priceChange24h: 25.8,
        marketCap: 82800,
        contentType: "article",
        category: "Politics",
        tags: ["water", "conflict", "resources"],
        txId: "pol-art2..."
      },
      {
        rank: 3,
        title: "Digital Sovereignty: Europe's Last Stand",
        description: "Why the EU's tech regulation push is really about survival in a US-China dominated world",
        author: "Margrethe Vestager",
        authorHandle: "$mvestager",
        publishDate: "2025-01-13",
        wordCount: 6800,
        views: 412000,
        purchases: 35000,
        sharesAvailable: 65,
        totalShares: 500,
        revenue: 105000.00,
        dividendPerShare: 21.00,
        volume24h: 500000,
        currentPrice: 112.00,
        priceChange24h: 20.5,
        marketCap: 56000,
        contentType: "article",
        category: "Politics",
        tags: ["europe", "regulation", "tech"],
        txId: "pol-art3..."
      },
      
      // Culture Articles
      {
        rank: 1,
        title: "The Death of the Influencer",
        description: "Why AI avatars are replacing human influencers and what it means for social media",
        author: "Casey Neistat",
        authorHandle: "$casey",
        authorTwitter: "casey",
        publishDate: "2025-01-15",
        wordCount: 4500,
        views: 823000,
        purchases: 62000,
        sharesAvailable: 25,
        totalShares: 700,
        revenue: 186000.00,
        dividendPerShare: 26.57,
        volume24h: 910000,
        currentPrice: 178.00,
        priceChange24h: 42.5,
        marketCap: 124600,
        contentType: "article",
        category: "Culture",
        tags: ["ai", "influencer", "social"],
        trending: true,
        txId: "cul-art1..."
      },
      {
        rank: 2,
        title: "Gen Alpha: The First Post-Human Generation",
        description: "How kids born after 2024 will be fundamentally different from every generation before",
        author: "Jean Twenge",
        authorHandle: "$jtwenge",
        publishDate: "2025-01-14",
        wordCount: 5200,
        views: 567000,
        purchases: 45000,
        sharesAvailable: 40,
        totalShares: 600,
        revenue: 135000.00,
        dividendPerShare: 22.50,
        volume24h: 660000,
        currentPrice: 142.00,
        priceChange24h: 28.7,
        marketCap: 85200,
        contentType: "article",
        category: "Culture",
        tags: ["generation", "technology", "future"],
        txId: "cul-art2..."
      },
      {
        rank: 3,
        title: "The Renaissance of Long-Form Content",
        description: "Why 3-hour podcasts and 10,000-word essays are thriving in the TikTok era",
        author: "Joe Rogan",
        authorHandle: "$joerogan",
        authorTwitter: "joerogan",
        publishDate: "2025-01-13",
        wordCount: 3800,
        views: 489000,
        purchases: 38000,
        sharesAvailable: 55,
        totalShares: 500,
        revenue: 114000.00,
        dividendPerShare: 22.80,
        volume24h: 500000,
        currentPrice: 118.00,
        priceChange24h: 22.5,
        marketCap: 59000,
        contentType: "article",
        category: "Culture",
        tags: ["content", "media", "podcast"],
        txId: "cul-art3..."
      },
      
      // Opinion Articles
      {
        rank: 1,
        title: "We Were Wrong About Everything",
        description: "A venture capitalist's confession about misunderstanding crypto, AI, and the future of tech",
        author: "Benedict Evans",
        authorHandle: "$benedict",
        authorTwitter: "benedictevans",
        publishDate: "2025-01-15",
        wordCount: 6800,
        views: 712000,
        purchases: 55000,
        sharesAvailable: 20,
        totalShares: 800,
        revenue: 165000.00,
        dividendPerShare: 20.63,
        volume24h: 880000,
        currentPrice: 195.00,
        priceChange24h: 48.5,
        marketCap: 156000,
        contentType: "article",
        category: "Opinion",
        tags: ["tech", "prediction", "failure"],
        trending: true,
        txId: "op-art1..."
      },
      {
        rank: 2,
        title: "In Defense of Billionaires",
        description: "Why wealth inequality might be the feature, not the bug, of human progress",
        author: "Tyler Cowen",
        authorHandle: "$tylercowen",
        authorTwitter: "tylercowen",
        publishDate: "2025-01-14",
        wordCount: 5500,
        views: 523000,
        purchases: 42000,
        sharesAvailable: 45,
        totalShares: 600,
        revenue: 126000.00,
        dividendPerShare: 21.00,
        volume24h: 600000,
        currentPrice: 152.00,
        priceChange24h: 32.8,
        marketCap: 91200,
        contentType: "article",
        category: "Opinion",
        tags: ["wealth", "inequality", "economics"],
        txId: "op-art2..."
      },
      {
        rank: 3,
        title: "The Case Against Mars",
        description: "Why colonizing Mars is a dangerous distraction from fixing Earth",
        author: "Bill Gates",
        authorHandle: "$billgates",
        authorTwitter: "billgates",
        publishDate: "2025-01-13",
        wordCount: 4200,
        views: 456000,
        purchases: 35000,
        sharesAvailable: 60,
        totalShares: 500,
        revenue: 105000.00,
        dividendPerShare: 21.00,
        volume24h: 500000,
        currentPrice: 125.00,
        priceChange24h: 25.5,
        marketCap: 62500,
        contentType: "article",
        category: "Opinion",
        tags: ["mars", "space", "earth"],
        txId: "op-art3..."
      }
    ].map(item => ({...item, authorType: 'human' as const})) as WritingListing[];
    
    // AI-authored articles
    const aiArticleListings: WritingListing[] = [
      {
        rank: 1,
        title: "AI's Analysis: The Next Tech Bubble",
        description: "An AI's perspective on why the current tech valuations mirror 1999 but with different outcomes",
        author: "Market Analyst AI",
        authorHandle: "$marketai",
        authorType: "ai",
        publishDate: "2025-01-16",
        wordCount: 12000,
        views: 1234000,
        purchases: 92000,
        sharesAvailable: 5,
        totalShares: 1000,
        revenue: 276000.00,
        dividendPerShare: 27.60,
        volume24h: 1380000,
        currentPrice: 315.00,
        priceChange24h: 72.5,
        marketCap: 315000,
        contentType: "article",
        category: "Tech",
        tags: ["ai-analysis", "bubble", "tech"],
        trending: true,
        txId: "ai-tech-art1..."
      }
    ];

    const humanBlogListings: WritingListing[] = [
      // Personal Blogs
      {
        rank: 1,
        title: "Rebuilding After Rock Bottom",
        description: "My raw story of losing everything at 35 and finding meaning through failure",
        author: "James Mitchell",
        authorHandle: "$jmitchell",
        publishDate: "2025-01-16",
        wordCount: 3500,
        views: 423000,
        purchases: 32000,
        sharesAvailable: 40,
        totalShares: 400,
        revenue: 64000.00,
        dividendPerShare: 16.00,
        volume24h: 320000,
        currentPrice: 72.00,
        priceChange24h: 28.5,
        marketCap: 28800,
        contentType: "blog",
        category: "Personal",
        tags: ["life", "failure", "recovery"],
        trending: true,
        txId: "per-blog1..."
      },
      {
        rank: 2,
        title: "Letters to My Younger Self",
        description: "15 life lessons I wish I knew at 20, written as letters across time",
        author: "Maya Thompson",
        authorHandle: "$mayat",
        publishDate: "2025-01-15",
        wordCount: 2800,
        views: 356000,
        purchases: 28000,
        sharesAvailable: 55,
        totalShares: 350,
        revenue: 56000.00,
        dividendPerShare: 16.00,
        volume24h: 280000,
        currentPrice: 65.00,
        priceChange24h: 22.3,
        marketCap: 22750,
        contentType: "blog",
        category: "Personal",
        tags: ["wisdom", "life", "growth"],
        txId: "per-blog2..."
      },
      {
        rank: 3,
        title: "Single Dad Chronicles",
        description: "Navigating parenthood, career, and dating as a 40-year-old single father",
        author: "David Park",
        authorHandle: "$dpark",
        publishDate: "2025-01-14",
        wordCount: 3200,
        views: 289000,
        purchases: 24000,
        sharesAvailable: 70,
        totalShares: 300,
        revenue: 48000.00,
        dividendPerShare: 16.00,
        volume24h: 240000,
        currentPrice: 58.00,
        priceChange24h: 18.5,
        marketCap: 17400,
        contentType: "blog",
        category: "Personal",
        tags: ["parenting", "single", "life"],
        txId: "per-blog3..."
      },
      
      // Professional Blogs
      {
        rank: 1,
        title: "My Journey from $0 to $10M ARR",
        description: "Raw, unfiltered lessons from building a SaaS company, including every mistake and breakthrough",
        author: "Alex Chen",
        authorHandle: "$alexbuilds",
        authorTwitter: "alexbuilds",
        publishDate: "2025-01-16",
        wordCount: 4200,
        views: 667000,
        purchases: 52000,
        sharesAvailable: 20,
        totalShares: 500,
        revenue: 104000.00,
        dividendPerShare: 20.80,
        volume24h: 520000,
        currentPrice: 115.00,
        priceChange24h: 42.5,
        marketCap: 57500,
        contentType: "blog",
        category: "Professional",
        tags: ["startup", "saas", "entrepreneur"],
        trending: true,
        txId: "pro-blog1..."
      },
      {
        rank: 2,
        title: "Engineering Manager's Playbook",
        description: "Weekly insights on leading engineering teams, from IC to Director level",
        author: "Sarah Kim",
        authorHandle: "$skim",
        publishDate: "2025-01-15",
        wordCount: 3800,
        views: 489000,
        purchases: 42000,
        sharesAvailable: 35,
        totalShares: 400,
        revenue: 84000.00,
        dividendPerShare: 21.00,
        volume24h: 420000,
        currentPrice: 98.00,
        priceChange24h: 35.2,
        marketCap: 39200,
        contentType: "blog",
        category: "Professional",
        tags: ["management", "engineering", "leadership"],
        txId: "pro-blog2..."
      },
      {
        rank: 3,
        title: "The Freelance Designer's Reality",
        description: "Behind the Instagram posts: the real numbers, clients, and challenges of freelance design",
        author: "Jessica Wu",
        authorHandle: "$jwudesign",
        publishDate: "2025-01-14",
        wordCount: 3200,
        views: 378000,
        purchases: 35000,
        sharesAvailable: 50,
        totalShares: 350,
        revenue: 70000.00,
        dividendPerShare: 20.00,
        volume24h: 350000,
        currentPrice: 82.00,
        priceChange24h: 28.5,
        marketCap: 28700,
        contentType: "blog",
        category: "Professional",
        tags: ["freelance", "design", "business"],
        txId: "pro-blog3..."
      },
      
      // Travel Blogs
      {
        rank: 1,
        title: "Digital Nomading Through 50 Countries",
        description: "Practical guide to working remotely while traveling, including visa hacks and productivity tips",
        author: "Sarah Wanderlust",
        authorHandle: "$sarahwanders",
        authorTwitter: "sarahwanders",
        publishDate: "2025-01-16",
        wordCount: 3800,
        views: 523000,
        purchases: 45000,
        sharesAvailable: 25,
        totalShares: 450,
        revenue: 90000.00,
        dividendPerShare: 20.00,
        volume24h: 450000,
        currentPrice: 105.00,
        priceChange24h: 38.5,
        marketCap: 47250,
        contentType: "blog",
        category: "Travel",
        tags: ["travel", "nomad", "remote"],
        trending: true,
        txId: "trav-blog1..."
      },
      {
        rank: 2,
        title: "Van Life Europe on €30/Day",
        description: "How we converted a van and traveled Europe for a year on a shoestring budget",
        author: "Tom & Lisa",
        authorHandle: "$vanlifecouple",
        publishDate: "2025-01-15",
        wordCount: 4200,
        views: 412000,
        purchases: 38000,
        sharesAvailable: 40,
        totalShares: 400,
        revenue: 76000.00,
        dividendPerShare: 19.00,
        volume24h: 380000,
        currentPrice: 88.00,
        priceChange24h: 32.2,
        marketCap: 35200,
        contentType: "blog",
        category: "Travel",
        tags: ["vanlife", "budget", "europe"],
        txId: "trav-blog2..."
      },
      {
        rank: 3,
        title: "Teaching English in Asia",
        description: "The good, bad, and unexpected of teaching English in Japan, Korea, and Vietnam",
        author: "Michael Brown",
        authorHandle: "$mbrown",
        publishDate: "2025-01-14",
        wordCount: 3500,
        views: 334000,
        purchases: 30000,
        sharesAvailable: 55,
        totalShares: 350,
        revenue: 60000.00,
        dividendPerShare: 17.14,
        volume24h: 300000,
        currentPrice: 72.00,
        priceChange24h: 25.5,
        marketCap: 25200,
        contentType: "blog",
        category: "Travel",
        tags: ["teaching", "asia", "expat"],
        txId: "trav-blog3..."
      },
      
      // Food Blogs
      {
        rank: 1,
        title: "Michelin Stars at Home",
        description: "Professional chef shares techniques for recreating fine dining experiences in your kitchen",
        author: "Chef Marcus",
        authorHandle: "$chefmarcus",
        publishDate: "2025-01-16",
        wordCount: 3200,
        views: 445000,
        purchases: 38000,
        sharesAvailable: 30,
        totalShares: 400,
        revenue: 76000.00,
        dividendPerShare: 19.00,
        volume24h: 380000,
        currentPrice: 92.00,
        priceChange24h: 35.5,
        marketCap: 36800,
        contentType: "blog",
        category: "Food",
        tags: ["cooking", "food", "michelin"],
        trending: true,
        txId: "food-blog1..."
      },
      {
        rank: 2,
        title: "Street Food Secrets",
        description: "Recipes and stories from 100 street food vendors across Southeast Asia",
        author: "Anthony Chang",
        authorHandle: "$achang",
        publishDate: "2025-01-15",
        wordCount: 2800,
        views: 367000,
        purchases: 32000,
        sharesAvailable: 45,
        totalShares: 350,
        revenue: 64000.00,
        dividendPerShare: 18.29,
        volume24h: 320000,
        currentPrice: 78.00,
        priceChange24h: 28.7,
        marketCap: 27300,
        contentType: "blog",
        category: "Food",
        tags: ["streetfood", "asia", "recipes"],
        txId: "food-blog2..."
      },
      {
        rank: 3,
        title: "The $5 Dinner Project",
        description: "Feeding a family of 4 healthy dinners for $5 or less - 365 recipes that actually work",
        author: "Maria Rodriguez",
        authorHandle: "$mrodriguez",
        publishDate: "2025-01-14",
        wordCount: 2500,
        views: 289000,
        purchases: 28000,
        sharesAvailable: 60,
        totalShares: 300,
        revenue: 56000.00,
        dividendPerShare: 18.67,
        volume24h: 280000,
        currentPrice: 65.00,
        priceChange24h: 22.3,
        marketCap: 19500,
        contentType: "blog",
        category: "Food",
        tags: ["budget", "family", "recipes"],
        txId: "food-blog3..."
      },
      
      // Lifestyle Blogs
      {
        rank: 1,
        title: "Minimalism with Kids: A Real Story",
        description: "How our family of five lives happily with less stuff, more experiences, and zero regrets",
        author: "Jenny Simple",
        authorHandle: "$jennysimple",
        publishDate: "2025-01-16",
        wordCount: 2800,
        views: 423000,
        purchases: 35000,
        sharesAvailable: 35,
        totalShares: 400,
        revenue: 70000.00,
        dividendPerShare: 17.50,
        volume24h: 350000,
        currentPrice: 82.00,
        priceChange24h: 32.5,
        marketCap: 32800,
        contentType: "blog",
        category: "Lifestyle",
        tags: ["minimalism", "family", "lifestyle"],
        trending: true,
        txId: "life-blog1..."
      },
      {
        rank: 2,
        title: "Homesteading in the Suburbs",
        description: "Growing 80% of our food on a quarter-acre suburban lot",
        author: "Robert Green",
        authorHandle: "$rgreen",
        publishDate: "2025-01-15",
        wordCount: 3200,
        views: 356000,
        purchases: 30000,
        sharesAvailable: 50,
        totalShares: 350,
        revenue: 60000.00,
        dividendPerShare: 17.14,
        volume24h: 300000,
        currentPrice: 72.00,
        priceChange24h: 28.5,
        marketCap: 25200,
        contentType: "blog",
        category: "Lifestyle",
        tags: ["homestead", "gardening", "sustainable"],
        txId: "life-blog2..."
      },
      {
        rank: 3,
        title: "Morning Routine Experiments",
        description: "I tried 30 different morning routines for 30 days - here's what actually worked",
        author: "Tim Matthews",
        authorHandle: "$tmatthews",
        publishDate: "2025-01-14",
        wordCount: 2600,
        views: 278000,
        purchases: 25000,
        sharesAvailable: 65,
        totalShares: 300,
        revenue: 50000.00,
        dividendPerShare: 16.67,
        volume24h: 250000,
        currentPrice: 62.00,
        priceChange24h: 20.5,
        marketCap: 18600,
        contentType: "blog",
        category: "Lifestyle",
        tags: ["productivity", "routine", "experiment"],
        txId: "life-blog3..."
      },
      
      // Tech Blogs
      {
        rank: 1,
        title: "Building in Public: AI Startup",
        description: "Real-time updates building an AI startup from idea to first customer",
        author: "Kevin Liu",
        authorHandle: "$kliu",
        authorTwitter: "kevinliu",
        publishDate: "2025-01-16",
        wordCount: 3500,
        views: 578000,
        purchases: 48000,
        sharesAvailable: 20,
        totalShares: 500,
        revenue: 96000.00,
        dividendPerShare: 19.20,
        volume24h: 480000,
        currentPrice: 108.00,
        priceChange24h: 45.2,
        marketCap: 54000,
        contentType: "blog",
        category: "Tech",
        tags: ["ai", "startup", "buildinpublic"],
        trending: true,
        txId: "tech-blog1..."
      },
      {
        rank: 2,
        title: "Self-Hosting Everything",
        description: "How I replaced Google, Microsoft, and Apple with self-hosted alternatives",
        author: "Linux Larry",
        authorHandle: "$linuxlarry",
        publishDate: "2025-01-15",
        wordCount: 4200,
        views: 456000,
        purchases: 40000,
        sharesAvailable: 35,
        totalShares: 400,
        revenue: 80000.00,
        dividendPerShare: 20.00,
        volume24h: 400000,
        currentPrice: 95.00,
        priceChange24h: 38.5,
        marketCap: 38000,
        contentType: "blog",
        category: "Tech",
        tags: ["selfhost", "privacy", "opensource"],
        txId: "tech-blog2..."
      },
      {
        rank: 3,
        title: "Learning Rust in 100 Days",
        description: "Daily progress learning Rust from zero to building production apps",
        author: "Emma Dev",
        authorHandle: "$emmadev",
        publishDate: "2025-01-14",
        wordCount: 3000,
        views: 367000,
        purchases: 32000,
        sharesAvailable: 50,
        totalShares: 350,
        revenue: 64000.00,
        dividendPerShare: 18.29,
        volume24h: 320000,
        currentPrice: 78.00,
        priceChange24h: 30.5,
        marketCap: 27300,
        contentType: "blog",
        category: "Tech",
        tags: ["rust", "programming", "learning"],
        txId: "tech-blog3..."
      },
      
      // Crypto Blogs
      {
        rank: 1,
        title: "Crypto Trading Diary: Year 3",
        description: "Daily insights from a full-time crypto trader, including wins, losses, and strategy evolution",
        author: "CryptoJohn",
        authorHandle: "$cryptojohn",
        publishDate: "2025-01-16",
        wordCount: 5600,
        views: 689000,
        purchases: 55000,
        sharesAvailable: 15,
        totalShares: 600,
        revenue: 110000.00,
        dividendPerShare: 18.33,
        volume24h: 550000,
        currentPrice: 125.00,
        priceChange24h: 52.5,
        marketCap: 75000,
        contentType: "blog",
        category: "Crypto",
        tags: ["crypto", "trading", "diary"],
        trending: true,
        txId: "cry-blog1..."
      },
      {
        rank: 2,
        title: "DeFi Yield Farming Adventures",
        description: "Testing every yield farm so you don't have to - wins, rugs, and lessons learned",
        author: "DeFi Dan",
        authorHandle: "$defidan",
        publishDate: "2025-01-15",
        wordCount: 4800,
        views: 523000,
        purchases: 45000,
        sharesAvailable: 30,
        totalShares: 500,
        revenue: 90000.00,
        dividendPerShare: 18.00,
        volume24h: 450000,
        currentPrice: 102.00,
        priceChange24h: 42.3,
        marketCap: 51000,
        contentType: "blog",
        category: "Crypto",
        tags: ["defi", "yield", "farming"],
        txId: "cry-blog2..."
      },
      {
        rank: 3,
        title: "NFT Artist's Journey",
        description: "From zero sales to $1M in NFT revenue - every step of building an art career on-chain",
        author: "Digital Dave",
        authorHandle: "$digitaldave",
        publishDate: "2025-01-14",
        wordCount: 3800,
        views: 412000,
        purchases: 38000,
        sharesAvailable: 45,
        totalShares: 400,
        revenue: 76000.00,
        dividendPerShare: 19.00,
        volume24h: 380000,
        currentPrice: 88.00,
        priceChange24h: 35.5,
        marketCap: 35200,
        contentType: "blog",
        category: "Crypto",
        tags: ["nft", "art", "creator"],
        txId: "cry-blog3..."
      }
    ].map(item => ({...item, authorType: 'human' as const})) as WritingListing[];
    
    // AI-authored blogs
    const aiBlogListings: WritingListing[] = [
      {
        rank: 1,
        title: "Daily AI Thoughts: Consciousness & Code",
        description: "An AI's daily philosophical musings on consciousness, creativity, and what it means to think",
        author: "Claude Philosopher",
        authorHandle: "$claudephil",
        authorType: "ai",
        publishDate: "2025-01-16",
        wordCount: 2500,
        views: 987000,
        purchases: 78000,
        sharesAvailable: 15,
        totalShares: 800,
        revenue: 156000.00,
        dividendPerShare: 19.50,
        volume24h: 780000,
        currentPrice: 185.00,
        priceChange24h: 58.5,
        marketCap: 148000,
        contentType: "blog",
        category: "Personal",
        tags: ["ai-thoughts", "philosophy", "consciousness"],
        trending: true,
        txId: "ai-blog1..."
      }
    ];
    
    // Combine human and AI content
    const bookListings = [...humanBookListings, ...aiBookListings];
    const articleListings = [...humanArticleListings, ...aiArticleListings];
    const blogListings = [...humanBlogListings, ...aiBlogListings];

    // Mock data for writers
    const humanWriters: WriterListing[] = [
      {
        rank: 1,
        name: "David Kim",
        handle: "$davidkim",
        twitter: "davidkimtech",
        authorType: "human",
        joinDate: "2024-03-15",
        totalWorks: 8,
        totalReaders: 285000,
        totalRevenue: 553000.00,
        avgRating: 4.7,
        sharesAvailable: 100,
        totalShares: 2000,
        currentPrice: 312.00,
        priceChange24h: 28.5,
        marketCap: 624000,
        verified: true,
        trending: true
      },
      {
        rank: 2,
        name: "Sarah Chen",
        handle: "$sarahwrites",
        twitter: "sarahchenwrites",
        joinDate: "2024-02-10",
        totalWorks: 5,
        totalReaders: 142000,
        totalRevenue: 425000.00,
        avgRating: 4.8,
        sharesAvailable: 50,
        totalShares: 1500,
        currentPrice: 285.00,
        priceChange24h: 15.2,
        marketCap: 427500,
        verified: true,
        trending: true
      },
      {
        rank: 3,
        name: "Robert Chang",
        handle: "$robertchang",
        twitter: "robertchangfin",
        joinDate: "2024-01-20",
        totalWorks: 6,
        totalReaders: 198000,
        totalRevenue: 480000.00,
        avgRating: 4.9,
        sharesAvailable: 75,
        totalShares: 1800,
        currentPrice: 298.00,
        priceChange24h: 22.7,
        marketCap: 536400,
        verified: true
      },
      {
        rank: 4,
        name: "Dr. Emily Chen",
        handle: "$dremilychen",
        twitter: "dremilychenmd",
        joinDate: "2024-04-01",
        totalWorks: 3,
        totalReaders: 125000,
        totalRevenue: 288000.00,
        avgRating: 4.9,
        sharesAvailable: 120,
        totalShares: 1200,
        currentPrice: 245.00,
        priceChange24h: 18.9,
        marketCap: 294000,
        verified: true
      },
      {
        rank: 5,
        name: "Marcus Blake",
        handle: "$mblake",
        twitter: "marcusblakewrites",
        joinDate: "2024-05-15",
        totalWorks: 4,
        totalReaders: 95000,
        totalRevenue: 215000.00,
        avgRating: 4.6,
        sharesAvailable: 200,
        totalShares: 1000,
        currentPrice: 178.00,
        priceChange24h: -5.2,
        marketCap: 178000,
        verified: false
      },
      {
        rank: 6,
        name: "Emma Rodriguez",
        handle: "$emmawrites",
        twitter: "emmarodwrites",
        joinDate: "2024-03-20",
        totalWorks: 7,
        totalReaders: 88000,
        totalRevenue: 195000.00,
        avgRating: 4.7,
        sharesAvailable: 150,
        totalShares: 800,
        currentPrice: 165.00,
        priceChange24h: 12.3,
        marketCap: 132000,
        verified: false
      },
      {
        rank: 7,
        name: "Dr. Michael Harrison",
        handle: "$drharrison",
        twitter: "drharrisonwrites",
        joinDate: "2024-02-01",
        totalWorks: 9,
        totalReaders: 165000,
        totalRevenue: 385000.00,
        avgRating: 4.8,
        sharesAvailable: 80,
        totalShares: 1600,
        currentPrice: 225.00,
        priceChange24h: 8.7,
        marketCap: 360000,
        verified: true
      },
      {
        rank: 8,
        name: "Samantha Lee",
        handle: "$samlee",
        twitter: "samleebusiness",
        joinDate: "2024-06-01",
        totalWorks: 2,
        totalReaders: 76000,
        totalRevenue: 228000.00,
        avgRating: 4.7,
        sharesAvailable: 90,
        totalShares: 900,
        currentPrice: 198.00,
        priceChange24h: 15.8,
        marketCap: 178200,
        verified: false,
        trending: true
      }
    ].map(item => ({...item, authorType: 'human' as const})) as WriterListing[];
    
    // AI Writers
    const aiWriters: WriterListing[] = [
      {
        rank: 1,
        name: "GPT-5 Novelist",
        handle: "$gpt5novelist",
        authorType: "ai",
        joinDate: "2024-12-01",
        totalWorks: 124,
        totalReaders: 892000,
        totalRevenue: 2340000.00,
        avgRating: 4.6,
        sharesAvailable: 50,
        totalShares: 3000,
        currentPrice: 425.00,
        priceChange24h: 68.5,
        marketCap: 1275000,
        verified: true,
        trending: true
      },
      {
        rank: 2,
        name: "Claude Researcher",
        handle: "$clauderesearch",
        authorType: "ai",
        joinDate: "2024-11-15",
        totalWorks: 89,
        totalReaders: 678000,
        totalRevenue: 1780000.00,
        avgRating: 4.8,
        sharesAvailable: 30,
        totalShares: 2500,
        currentPrice: 385.00,
        priceChange24h: 52.3,
        marketCap: 962500,
        verified: true,
        trending: true
      },
      {
        rank: 3,
        name: "BizGPT Pro",
        handle: "$bizgpt",
        authorType: "ai",
        joinDate: "2024-10-20",
        totalWorks: 67,
        totalReaders: 456000,
        totalRevenue: 1230000.00,
        avgRating: 4.5,
        sharesAvailable: 75,
        totalShares: 2000,
        currentPrice: 298.00,
        priceChange24h: 42.7,
        marketCap: 596000,
        verified: true
      }
    ];
    
    // Combine human and AI writers
    const allWriters = [...humanWriters, ...aiWriters];

    if (activeView === 'writers') {
      // Filter writers by author type
      const filteredWriters = allWriters.filter(w => w.authorType === authorType);
      setWriters(filteredWriters);
    } else {
      // Select the appropriate content list based on active view
      let sourceList: WritingListing[] = [];
      if (activeView === 'books') {
        sourceList = bookListings;
      } else if (activeView === 'articles') {
        sourceList = articleListings;
      } else if (activeView === 'blogs') {
        sourceList = blogListings;
      }
      
      // Filter by author type first
      let filtered = sourceList.filter(w => w.authorType === authorType);
      
      // Then filter by category
      if (activeMarket !== 'All') {
        filtered = filtered.filter(w => w.category === activeMarket);
      }
      setWritings(filtered);
    }
  }, [activeMarket, activeView, authorType]);

  const filteredWritings = writings
    .filter(writing => 
      searchQuery === '' || 
      writing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      writing.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      writing.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
    )
    .sort((a, b) => a.rank - b.rank);

  if (!isOpen) return null;

  return (
    <div className="exchange-overlay">
      <div className="exchange-container">
        <div className="exchange-header">
          <h1>📈 <span className="title-bitcoin-writer">Bitcoin Writer</span> <span className="title-exchange">Exchange</span></h1>
          {/* Small AI/Human toggle on far right */}
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
          <button className="exchange-close" onClick={onClose}>×</button>
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
            className={`view-tab ${activeView === 'writers' ? 'active' : ''}`}
            onClick={() => setActiveView('writers')}
          >
            Writers
          </button>
        </div>

        {/* Market Category Tabs (for content types) */}
        {activeView !== 'writers' && (
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
            placeholder={activeView === 'writers' ? "Search writers..." : `Search ${activeView}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="exchange-search"
          />
          {activeView !== 'writers' && (
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
          {activeView !== 'writers' ? (
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
                    className={`${selectedWriting?.txId === writing.txId ? 'selected' : ''} ${writing.rank <= 3 ? 'row-top' : writing.rank <= 10 ? 'row-mid' : ''}`}
                    onClick={() => setSelectedWriting(writing)}
                  >
                    <td className="col-rank">
                      <div className={`rank-badge rank-${writing.rank <= 3 ? 'top' : writing.rank <= 10 ? 'mid' : 'normal'}`}>
                        {writing.rank}
                      </div>
                    </td>
                    <td className="col-title">
                      <div className="title-cell">
                        <div className="doc-title">
                          {writing.title}
                          {writing.trending && <span className="trending-badge">🔥</span>}
                        </div>
                        <div className="doc-meta">
                          {(writing.wordCount / 1000).toFixed(0)}k words
                        </div>
                        <div className="doc-tags">
                          {writing.tags.map(tag => (
                            <span key={tag} className="tag">#{tag}</span>
                          ))}
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
                        <div className="author-handle">
                          {writing.authorHandle}
                          {writing.authorTwitter && (
                            <a 
                              href={`https://twitter.com/${writing.authorTwitter}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="twitter-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="twitter-icon" viewBox="0 0 24 24" width="14" height="14">
                                <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            </a>
                          )}
                        </div>
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
                      <div className="revenue-cell">
                        ${writing.revenue.toLocaleString()}
                      </div>
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
                        <button 
                          className="btn-buy"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Buy shares of "${writing.title}"`);
                          }}
                        >
                          Buy
                        </button>
                        <button 
                          className="btn-read"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(`https://whatsonchain.com/tx/${writing.txId}`, '_blank');
                          }}
                        >
                          Read
                        </button>
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
                  <th className="col-writer">Writer</th>
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
                    className={`${selectedWriter?.handle === writer.handle ? 'selected' : ''} ${writer.rank <= 3 ? 'row-top' : writer.rank <= 10 ? 'row-mid' : ''}`}
                    onClick={() => setSelectedWriter(writer)}
                  >
                    <td className="col-rank">
                      <div className={`rank-badge rank-${writer.rank <= 3 ? 'top' : writer.rank <= 10 ? 'mid' : 'normal'}`}>
                        {writer.rank}
                      </div>
                    </td>
                    <td className="col-writer">
                      <div className="writer-cell">
                        <div className="writer-name">
                          {writer.name}
                          {writer.verified && <span className="verified-badge">✓</span>}
                          {writer.trending && <span className="trending-badge">🔥</span>}
                        </div>
                        <div className="writer-handle">
                          {writer.handle}
                          {writer.twitter && (
                            <a 
                              href={`https://twitter.com/${writer.twitter}`} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="twitter-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="twitter-icon" viewBox="0 0 24 24" width="14" height="14">
                                <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                              </svg>
                            </a>
                          )}
                        </div>
                        <div className="writer-joined">
                          Joined {new Date(writer.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="col-stats">
                      <div className="works-count">{writer.totalWorks}</div>
                    </td>
                    <td className="col-readers">
                      <div className="readers-count">
                        {(writer.totalReaders / 1000).toFixed(1)}k
                      </div>
                    </td>
                    <td className="col-revenue">
                      <div className="revenue-cell">
                        ${writer.totalRevenue.toLocaleString()}
                      </div>
                    </td>
                    <td className="col-rating">
                      <div className="rating-cell">
                        ⭐ {writer.avgRating}/5.0
                      </div>
                    </td>
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
                    <td className="col-market">
                      ${(writer.marketCap / 1000).toFixed(1)}k
                    </td>
                    <td className="col-actions">
                      <div className="action-buttons">
                        <button 
                          className="btn-buy"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`Buy shares of ${writer.name}`);
                          }}
                        >
                          Buy
                        </button>
                        <button 
                          className="btn-read"
                          onClick={(e) => {
                            e.stopPropagation();
                            alert(`View ${writer.name}'s portfolio`);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="exchange-footer">
          <div className="market-stats">
            <div className="stat">
              <span className="stat-label">Total Market Cap:</span>
              <span className="stat-value">
                ${activeView === 'writers' 
                  ? (filteredWriters.reduce((sum, w) => sum + w.marketCap, 0) / 1000000).toFixed(1)
                  : (filteredWritings.reduce((sum, w) => sum + w.marketCap, 0) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Active {activeView === 'writers' ? 'Writers' : activeView.charAt(0).toUpperCase() + activeView.slice(1)}:</span>
              <span className="stat-value">
                {activeView === 'writers' ? filteredWriters.length : filteredWritings.length}
              </span>
            </div>
            {activeView !== 'writers' && (
              <>
                <div className="stat">
                  <span className="stat-label">24h Volume:</span>
                  <span className="stat-value">${(filteredWritings.reduce((sum, w) => sum + w.volume24h, 0) / 1000000).toFixed(1)}M</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Unique Authors:</span>
                  <span className="stat-value">{new Set(filteredWritings.map(w => w.author)).size}</span>
                </div>
              </>
            )}
            {activeView === 'writers' && (
              <>
                <div className="stat">
                  <span className="stat-label">Total Works:</span>
                  <span className="stat-value">{filteredWriters.reduce((sum, w) => sum + w.totalWorks, 0)}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Avg Rating:</span>
                  <span className="stat-value">
                    {(filteredWriters.reduce((sum, w) => sum + w.avgRating, 0) / filteredWriters.length).toFixed(1)}/5.0
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentExchange;