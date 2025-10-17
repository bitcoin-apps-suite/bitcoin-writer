import React from 'react';

// Note: Article data is stored in data/articles.json
// Using getStaticProps to pre-render article pages at build time for better performance and SEO.

// Placeholder for article content
const articles = {
  '1': {
    title: 'Bitcoin Hits $100,000: A New Era for Cryptocurrency',
    content: 'Placeholder content for article 1. Replace with actual content from https://bitcoin-writer.vercel.app/market/article/1.',
    author: 'Satoshi Nakamoto',
    date: '2023-12-01'
  },
  '2': {
    title: 'Bitcoin Writer: The Uberfication of Writing',
    content: 'Placeholder content for article 2. Replace with actual content from historical data or React deployment.',
    author: 'b0ase',
    date: '2023-12-02'
  },
  '3': {
    title: 'Ideological Oversimplification: Dissecting a Shallow Critique of Debt and Money',
    content: 'Placeholder content for article 3. Replace with actual content from historical data or React deployment.',
    author: 'b0ase',
    date: '2023-12-03'
  },
  '4': {
    title: 'How to Build a \'bOS\': A Pragmatic Strategic Plan for Decentralized Finance',
    content: 'Placeholder content for article 4. Replace with actual content from https://bitcoin-writer.vercel.app/market/article/4.',
    author: 'b0ase',
    date: '2023-12-15'
  },
  '5': {
    title: 'Crypto Content Monetization',
    content: 'Placeholder content for article 5. Replace with actual content from historical data or React deployment.',
    author: 'Satoshi Writer',
    date: '2023-12-05'
  },
  '6': {
    title: 'NFT Publishing Revolution',
    content: 'Placeholder content for article 6. Replace with actual content from historical data or React deployment.',
    author: 'NFT Creator',
    date: '2023-12-06'
  }
  // Add more articles as needed based on historical data
};

const ArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const article = articles[id as keyof typeof articles];
  
  if (!article) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p>The requested article could not be found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-600 mb-2">By {article.author} | {article.date}</p>
      <div className="prose mt-4">
        <p>{article.content}</p>
      </div>
      <a href="/market" className="text-blue-500 hover:underline mt-4 block">Back to Market</a>
    </div>
  );
};

export async function generateStaticParams() {
  return Object.keys(articles).map(id => ({
    id: id,
  }));
}

export default ArticlePage;
