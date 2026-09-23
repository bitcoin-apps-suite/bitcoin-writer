import { calculateValueScore } from '../src/utils/contribution';
import { createDocument, addContribution, getDocument } from '../src/lib/maipStore';
import { MAIPDocument } from '../src/types/maip';

describe('MAIP contribution scoring', () => {
  test('value score based on words and characters', () => {
    const content = 'Hello world!';
    const score = calculateValueScore(content);
    expect(score).toBeCloseTo(2 + 12 * 0.1); // 2 words, 12 chars
  });

  test('document creation and contribution tracking', () => {
    const doc = createDocument('Test Doc', 'alice', 1000);
    expect(doc.title).toBe('Test Doc');
    expect(doc.collaborators).toContain('alice');
    expect(doc.bountyPool).toBe(1000);

    const entry = {
      author: 'alice',
      timestamp: new Date().toISOString(),
      changeType: 'addition' as const,
      content: 'First line',
      valueScore: calculateValueScore('First line'),
      payment: 0,
    };

    const added = addContribution(doc.id, entry);
    expect(added).toBeTruthy();

    const fetched: MAIPDocument | undefined = getDocument(doc.id);
    expect(fetched).toBeDefined();
    expect(fetched?.contributionTracking.length).toBe(1);
    expect(fetched?.contributionTracking[0].payment).toBeGreaterThan(0);
  });
});
