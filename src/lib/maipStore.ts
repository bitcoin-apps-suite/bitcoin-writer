import { MAIPDocument, ContributionEntry } from '../types/maip';
import { v4 as uuidv4 } from 'uuid';

const documents = new Map<string, MAIPDocument>();

export function createDocument(
  title: string,
  creator: string,
  bountyPool: number
): MAIPDocument {
  const id = uuidv4();
  const doc: MAIPDocument = {
    id,
    title,
    collaborators: [creator],
    permissions: { [creator]: 'admin' },
    bountyPool,
    contributionTracking: [],
  };
  documents.set(id, doc);
  return doc;
}

export function getDocument(id: string): MAIPDocument | undefined {
  return documents.get(id);
}

export function addCollaborator(
  id: string,
  collaborator: string,
  permission: 'read' | 'write' | 'admin'
): boolean {
  const doc = documents.get(id);
  if (!doc) return false;
  if (!doc.collaborators.includes(collaborator)) {
    doc.collaborators.push(collaborator);
  }
  doc.permissions[collaborator] = permission;
  return true;
}

export function addContribution(
  id: string,
  entry: ContributionEntry
): boolean {
  const doc = documents.get(id);
  if (!doc) return false;
  doc.contributionTracking.push(entry);
  // Simple payment logic: split bountyPool equally among contributions
  const totalContributions = doc.contributionTracking.length;
  const paymentPerContribution = Math.floor(doc.bountyPool / totalContributions);
  entry.payment = paymentPerContribution;
  return true;
}
