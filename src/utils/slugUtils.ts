// Utility functions for generating and handling article slugs

export function generateSlug(title: string, id?: string): string {
  // Convert title to lowercase and replace spaces with hyphens
  let slug = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // Append ID if provided to ensure uniqueness
  if (id) {
    slug += `-${id}`;
  }

  return slug;
}

export function extractIdFromSlug(slug: string): string | null {
  // Extract ID from the end of slug (assuming format: title-content-id)
  const parts = slug.split('-');
  const lastPart = parts[parts.length - 1];
  
  // Check if last part looks like an ID (numeric or alphanumeric)
  if (/^[a-zA-Z0-9]+$/.test(lastPart)) {
    return lastPart;
  }
  
  return null;
}

export function getArticleUrl(title: string, id: string): string {
  const slug = generateSlug(title, id);
  return `/market/article/${slug}`;
}

export function isValidSlug(slug: string): boolean {
  // Basic validation for slug format
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}