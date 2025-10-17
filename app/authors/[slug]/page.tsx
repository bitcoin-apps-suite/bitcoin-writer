'use client';

import React from 'react';
import { useParams } from 'next/navigation';

// Placeholder for author data
const authors = {
  'b0ase': {
    name: 'b0ase',
    handle: '@b0ase',
    bio: 'Creator of Bitcoin Writer, exploring the intersection of technology and writing.',
    articles: [
      { id: '1', title: 'Bitcoin Hits $100,000: A New Era for Cryptocurrency' },
      { id: '2', title: 'Bitcoin Writer: The Uberfication of Writing' },
      { id: '3', title: 'Ideological Oversimplification: Dissecting a Shallow Critique of Debt and Money' },
      { id: '4', title: 'How to Build a \'bOS\': A Pragmatic Strategic Plan for Decentralized Finance' }
    ]
  },
  'satoshi-writer': {
    name: 'Satoshi Writer',
    handle: '@satoshiwriter',
    bio: 'Writing about cryptocurrency and blockchain technology.',
    articles: [
      { id: '5', title: 'Crypto Content Monetization' }
    ]
  },
  'nft-creator': {
    name: 'NFT Creator',
    handle: '@nftcreator',
    bio: 'Exploring the world of NFTs and digital publishing.',
    articles: [
      { id: '6', title: 'NFT Publishing Revolution' }
    ]
  }
  // Add more authors as needed based on historical data
};

const AuthorPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const author = authors[slug as keyof typeof authors];

  if (!author) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Author Not Found</h1>
        <p>The requested author could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{author.name}</h1>
      <p className="text-gray-600 mb-2">{author.handle}</p>
      <p className="mb-4">{author.bio}</p>
      <h2 className="text-2xl font-semibold mb-2">Articles by {author.name}</h2>
      <ul className="list-disc pl-5">
        {author.articles.map((article) => (
          <li key={article.id}>
            <a href={`/market/article/${article.id}`} className="text-blue-500 hover:underline">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
      <a href="/market" className="text-blue-500 hover:underline mt-4 block">Back to Market</a>
    </div>
  );
};

export default AuthorPage;
