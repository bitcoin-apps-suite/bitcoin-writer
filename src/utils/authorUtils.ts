// Author utility functions

export const getAuthorSlug = (authorName: string): string => {
  return authorName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const getAuthorUrl = (authorName: string): string => {
  const slug = getAuthorSlug(authorName);
  return `/authors/${slug}`;
};

// Map display names to slugs for existing authors
export const authorNameToSlug: Record<string, string> = {
  'Sarah Chen': 'sarahchen',
  'Alex Martinez': 'alexmart', 
  'Dev Community': 'devcommunity',
  'Emma Wilson': 'emmawilson',
  'Tech Researcher': 'techresearcher',
  'Career Coach': 'careercoach',
  'Satoshi Writer': 'satoshiwriter',
  'Content Strategist': 'contentstrat',
  'NFT Creator': 'nftcreator',
  'Tech Tutorial': 'techtutorial',
  'Newsletter Pro': 'newsletterpro',
  'Blockchain Expert': 'blockchainexpert',
  'b0ase': 'b0ase'
};

export const getAuthorSlugFromName = (authorName: string): string => {
  return authorNameToSlug[authorName] || getAuthorSlug(authorName);
};