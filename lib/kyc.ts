/**
 * KYC (Know Your Customer) verification utilities
 *
 * Enforces identity verification requirements for:
 * - Dividend payouts
 * - Share withdrawals
 * - Bank transfers
 */

import { createClient } from '@/lib/supabase/server';

export interface KYCStatus {
  verified: boolean;
  status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  submittedAt?: string;
  verifiedAt?: string;
  rejectedReason?: string;
}

/**
 * Check if user has passed KYC verification
 * Required before allowing dividend payouts or withdrawals
 */
export async function checkKYCStatus(userId: string): Promise<KYCStatus> {
  try {
    const supabase = await createClient();

    const { data: kyc, error } = await supabase
      .from('user_kyc')
      .select('status, submitted_at, verified_at, rejected_reason')
      .eq('user_id', userId)
      .single();

    if (error || !kyc) {
      return {
        verified: false,
        status: 'not_submitted',
      };
    }

    return {
      verified: kyc.status === 'verified',
      status: kyc.status,
      submittedAt: kyc.submitted_at,
      verifiedAt: kyc.verified_at,
      rejectedReason: kyc.rejected_reason,
    };
  } catch (error) {
    console.error('[kyc] Error checking status:', error);
    return {
      verified: false,
      status: 'not_submitted',
    };
  }
}

/**
 * Enforce KYC requirement for sensitive operations
 * Returns 403 Forbidden if not verified
 */
export function requireKYC(kycStatus: KYCStatus) {
  if (!kycStatus.verified) {
    const message =
      kycStatus.status === 'rejected'
        ? `KYC verification was rejected: ${kycStatus.rejectedReason}. Please contact support.`
        : kycStatus.status === 'pending'
          ? 'Your KYC verification is pending. Please wait for manual review (typically 1-2 business days).'
          : 'KYC verification required. Please upload your ID and proof of address to proceed.';

    return {
      error: 'KYC Verification Required',
      message,
      status: 403,
    };
  }

  return null;
}

/**
 * Get pending KYC records for admin review
 * Admin only - returns full KYC documents
 */
export async function getPendingKYCRecords() {
  try {
    const supabase = await createClient();

    const { data: records, error } = await supabase
      .from('user_kyc')
      .select('*')
      .eq('status', 'pending')
      .order('submitted_at', { ascending: true });

    if (error) {
      console.error('[kyc] Error fetching pending records:', error);
      return [];
    }

    return records || [];
  } catch (error) {
    console.error('[kyc] Error:', error);
    return [];
  }
}

/**
 * Approve KYC verification (admin only)
 */
export async function approveKYC(kycId: string, adminId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('user_kyc')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString(),
        verified_by: adminId,
      })
      .eq('id', kycId);

    if (error) {
      console.error('[kyc] Error approving KYC:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[kyc] Error:', error);
    return false;
  }
}

/**
 * Reject KYC verification (admin only)
 */
export async function rejectKYC(kycId: string, adminId: string, reason: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from('user_kyc')
      .update({
        status: 'rejected',
        verified_at: new Date().toISOString(),
        verified_by: adminId,
        rejected_reason: reason,
      })
      .eq('id', kycId);

    if (error) {
      console.error('[kyc] Error rejecting KYC:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('[kyc] Error:', error);
    return false;
  }
}
