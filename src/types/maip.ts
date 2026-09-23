export interface MAIPDocument {
  id: string;
  title: string;
  collaborators: string[];
  permissions: CollaboratorPermissions;
  bountyPool: number; // BSV satoshis
  contributionTracking: ContributionEntry[];
}

export interface CollaboratorPermissions {
  [collaborator: string]: 'read' | 'write' | 'admin';
}

export interface ContributionEntry {
  author: string;
  timestamp: string;
  changeType: 'addition' | 'deletion' | 'modification';
  content: string;
  valueScore: number; // AI-calculated contribution value
  payment: number; // BSV satoshis earned
}
