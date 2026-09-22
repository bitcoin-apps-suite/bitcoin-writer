import { ContributionEntry } from '../types/maip';

/**
 * Very naive value score calculation based on character count.
 * In production this would be replaced with an AI model.
 */
export function calculateValueScore(content: string): number {
  const words = content.trim().split(/\s+/).length;
  const chars = content.length;
  // Example: 1 point per word, 0.1 per character
  return words + chars * 0.1;
}
