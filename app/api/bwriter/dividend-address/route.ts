/**
 * POST/GET /api/bwriter/dividend-address
 *
 * Manage BSV withdrawal address for dividend payouts
 *
 * Requirements:
 * - User must be authenticated
 * - User must have staked tokens with confirmed status
 * - BSV address must be valid (basic format validation)
 *
 * Context:
 * When dividends are distributed, we need to know where to send each user's BSV
 * payments. This endpoint manages that mapping.
 *
 * The flow:
 * 1. User stakes tokens (pending_deposit status)
 * 2. User provides BSV withdrawal address (or updates existing)
 * 3. Blockchain confirms deposit (stake status = confirmed)
 * 4. User is now in cap table, dividend-eligible
 * 5. When dividend runs, we send BSV to their withdrawal address
 *
 * Response:
 * - success: boolean
 * - bsvAddress: string - Their BSV withdrawal address
 * - stakeStatus: string - 'confirmed' = eligible for dividends
 * - dividendEligible: boolean
 * - message: string
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/investors/auth';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

// BSV addresses start with '1', '3' (legacy), or 'bitcoincash:' (BCH format)
// We support '1' and '3' legacy addresses
const bsvAddressSchema = z.object({
  bsvAddress: z
    .string()
    .min(26)
    .max(35)
    .regex(/^[13][a-zA-Z0-9]{25,34}$/, 'Invalid BSV address format'),
});

/**
 * POST - Set or update user's BSV withdrawal address
 *
 * Call this after staking but before dividend distribution to ensure
 * we know where to send payments
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication
    const authContext = await getAuthenticatedUser();
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { unifiedUser } = authContext;

    // 2. Validate request
    const body = await request.json();
    const validation = bsvAddressSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid BSV address',
          details: validation.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { bsvAddress } = validation.data;
    const supabase = await createClient();

    console.log(
      `[bwriter/dividend-address] User ${unifiedUser.id} setting BSV address: ${bsvAddress.slice(0, 10)}...`
    );

    // 3. Check if user has any confirmed stakes
    const { data: confirmedStakes, error: stakeError } = await supabase
      .from('user_bwriter_stakes')
      .select('id')
      .eq('user_id', unifiedUser.id)
      .eq('status', 'confirmed')
      .limit(1);

    if (stakeError) {
      console.error('[bwriter/dividend-address] Error checking stakes:', stakeError);
      return NextResponse.json(
        { error: 'Failed to verify stake status' },
        { status: 500 }
      );
    }

    const hasDividendEligibility = confirmedStakes && confirmedStakes.length > 0;

    // 4. Upsert dividend address record
    // First, check if record exists
    const { data: existingAddress } = await supabase
      .from('user_bwriter_dividend_addresses')
      .select('id')
      .eq('user_id', unifiedUser.id)
      .single();

    let addressError;
    if (existingAddress) {
      // Update existing
      const result = await supabase
        .from('user_bwriter_dividend_addresses')
        .update({
          bsv_withdrawal_address: bsvAddress,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', unifiedUser.id);
      addressError = result.error;
    } else {
      // Create new
      const result = await supabase
        .from('user_bwriter_dividend_addresses')
        .insert({
          user_id: unifiedUser.id,
          bsv_withdrawal_address: bsvAddress,
        });
      addressError = result.error;
    }

    if (addressError) {
      console.error('[bwriter/dividend-address] Error saving address:', addressError);
      return NextResponse.json(
        { error: 'Failed to save withdrawal address', details: addressError.message },
        { status: 500 }
      );
    }

    console.log(
      `[bwriter/dividend-address] Successfully set BSV address for ${unifiedUser.id}`
    );

    return NextResponse.json({
      success: true,
      bsvAddress: bsvAddress.slice(0, 5) + '...' + bsvAddress.slice(-4), // Masked for privacy
      stakeStatus: hasDividendEligibility ? 'confirmed' : 'no_confirmed_stakes',
      dividendEligible: hasDividendEligibility,
      message: hasDividendEligibility
        ? 'BSV withdrawal address saved. Dividends will be paid to this address when distributed.'
        : 'BSV withdrawal address saved. You will be dividend-eligible once your stake is confirmed on blockchain.',
    });
  } catch (error) {
    console.error('[bwriter/dividend-address] POST Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to set withdrawal address',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Retrieve user's current BSV withdrawal address and dividend eligibility
 *
 * Used by frontend to show current setup and dividend status
 */
export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedUser();
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { unifiedUser } = authContext;
    const supabase = await createClient();

    // 1. Get withdrawal address
    const { data: addressRecord, error: addressError } = await supabase
      .from('user_bwriter_dividend_addresses')
      .select('bsv_withdrawal_address, updated_at')
      .eq('user_id', unifiedUser.id)
      .single();

    // 2. Get dividend eligibility (has confirmed stakes)
    const { data: confirmedStakes, error: stakeError } = await supabase
      .from('user_bwriter_stakes')
      .select('id, amount, staked_at, dividends_accumulated')
      .eq('user_id', unifiedUser.id)
      .eq('status', 'confirmed');

    if (stakeError && stakeError.code !== 'PGRST116') {
      // PGRST116 = no rows found, which is expected
      console.error('[bwriter/dividend-address] Error fetching stakes:', stakeError);
      return NextResponse.json(
        { error: 'Failed to fetch stake status' },
        { status: 500 }
      );
    }

    // 3. Get total dividends owed
    const { data: dividends } = await supabase
      .from('user_bwriter_dividends_owed')
      .select('dividends_pending, dividends_claimed')
      .eq('user_id', unifiedUser.id)
      .single();

    const isDividendEligible = confirmedStakes && confirmedStakes.length > 0;
    const totalAmountStaked =
      confirmedStakes?.reduce((sum, stake) => sum + stake.amount, 0) || 0;
    const totalDividendsAccumulated =
      confirmedStakes?.reduce((sum, stake) => sum + (stake.dividends_accumulated || 0), 0) ||
      0;

    return NextResponse.json({
      bsvAddress: addressRecord?.bsv_withdrawal_address || null,
      lastUpdated: addressRecord?.updated_at || null,
      dividendEligible: isDividendEligible,
      confirmedStakes: confirmedStakes?.length || 0,
      totalAmountStaked,
      totalDividendsAccumulated,
      dividendsPending: dividends?.dividends_pending || 0,
      dividendsClaimed: dividends?.dividends_claimed || 0,
      needsWithdrawalAddress: isDividendEligible && !addressRecord,
      message: isDividendEligible
        ? addressRecord
          ? 'You are dividend-eligible. Dividends will be paid to your registered address.'
          : 'You are dividend-eligible but have not provided a BSV withdrawal address. Please set one to receive dividends.'
        : 'You have no confirmed stakes. Stake tokens and verify KYC to become dividend-eligible.',
    });
  } catch (error) {
    console.error('[bwriter/dividend-address] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawal address' },
      { status: 500 }
    );
  }
}
