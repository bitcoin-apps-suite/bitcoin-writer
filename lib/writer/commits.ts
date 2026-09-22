/**
 * Chain index (Supabase `bwriter_commits`). Best-effort: the chain is the source of truth and the
 * editor keeps a local mirror, so a missing table degrades gracefully.
 */

import { createAdminClient } from '@/lib/supabase/admin';

export interface CommitRow {
  txid: string;
  type: 'chainproof' | 'chainproof_fork';
  doc_id: string;
  key_id: string;
  version: number;
  branch: string;
  message: string;
  parent_txid: string | null;
  parent_vout: number | null;
  content_hash: string | null;
  author_handle: string;
  byte_size: number;
  miner_sats: number;
  service_sats: number;
  funding_txid: string;
  raw_tx: string;
  status: 'broadcast' | 'pending';
  created_at?: string;
}

export async function recordCommit(row: CommitRow): Promise<boolean> {
  try {
    const { error } = await createAdminClient().from('bwriter_commits').upsert(row);
    if (error) console.error('[commits] upsert failed:', error.message);
    return !error;
  } catch (error) {
    console.error('[commits] index unavailable:', error);
    return false;
  }
}

export async function getCommit(txid: string): Promise<CommitRow | null> {
  try {
    const { data } = await createAdminClient().from('bwriter_commits').select('*').eq('txid', txid).maybeSingle();
    return (data as CommitRow) ?? null;
  } catch {
    return null;
  }
}

export async function listCommits(authorHandle: string, docId?: string): Promise<CommitRow[] | null> {
  try {
    let query = createAdminClient()
      .from('bwriter_commits')
      .select('txid,type,doc_id,key_id,version,branch,message,parent_txid,parent_vout,content_hash,author_handle,byte_size,miner_sats,service_sats,funding_txid,status,created_at')
      .eq('author_handle', authorHandle)
      .order('created_at', { ascending: true })
      .limit(2000);
    if (docId) query = query.eq('doc_id', docId);
    const { data, error } = await query;
    if (error) {
      console.error('[commits] list failed:', error.message);
      return null;
    }
    return data as CommitRow[];
  } catch (error) {
    console.error('[commits] index unavailable:', error);
    return null;
  }
}
