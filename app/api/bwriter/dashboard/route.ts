/**
 * GET /api/bwriter/dashboard
 *
 * Comprehensive staking and dividend dashboard for authenticated user
 *
 * Returns:
 * - Token balance information
 * - All active and historical stakes
 * - Dividend accrual and payment history
 * - Ownership percentage of platform
 * - BSV withdrawal address status
 * - Next steps (if missing address, if pending deposits, etc.)
 *
 * Used by frontend to render:
 * - User's token balance
 * - Staking status (pending, confirmed, unstaking, unstaked)
 * - Dividend earnings
 * - Cap table rank (how much of platform they own)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/investors/auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // 1. Authentication
    const authContext = await getAuthenticatedUser();
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { unifiedUser } = authContext;
    const supabase = await createClient();

    // 2. Get token balance
    const { data: balance, error: balanceError } = await supabase
      .from('user_bwriter_balance')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .single();

    if (balanceError && balanceError.code !== 'PGRST116') {
      console.error('[bwriter/dashboard] Error fetching balance:', balanceError);
      return NextResponse.json(
        { error: 'Failed to fetch balance' },
        { status: 500 }
      );
    }

    // 3. Get all stakes (confirmed + pending + unstaked history)
    const { data: allStakes, error: stakesError } = await supabase
      .from('user_bwriter_stakes')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .order('created_at', { ascending: false });

    if (stakesError && stakesError.code !== 'PGRST116') {
      console.error('[bwriter/dashboard] Error fetching stakes:', stakesError);
      return NextResponse.json(
        { error: 'Failed to fetch stakes' },
        { status: 500 }
      );
    }

    // 4. Get dividend information
    const { data: dividends } = await supabase
      .from('user_bwriter_dividends_owed')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .single();

    // 5. Get withdrawal address
    const { data: addressRecord } = await supabase
      .from('user_bwriter_dividend_addresses')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .single();

    // 6. Get cap table entry (to find ownership percentage)
    const { data: capTableEntries } = await supabase
      .from('bwriter_cap_table')
      .select('percentage_of_total, last_dividend_amount, lifetime_dividends_received')
      .eq('user_id', unifiedUser.id)
      .eq('status', 'active');

    // 7. Get pending deposits (stakes waiting for blockchain confirmation)
    const { data: pendingDeposits } = await supabase
      .from('bwriter_multisig_deposits')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .eq('status', 'waiting');

    // Aggregate confirmed stakes
    const confirmedStakes = allStakes?.filter((s) => s.status === 'confirmed') || [];
    const totalStaked = confirmedStakes.reduce((sum, s) => sum + s.amount, 0);
    const totalDividendsAccumulated = confirmedStakes.reduce(
      (sum, s) => sum + (s.dividends_accumulated || 0),
      0
    );

    // Calculate aggregate ownership
    const totalOwnershipPercentage =
      capTableEntries?.reduce((sum, entry) => sum + (entry.percentage_of_total || 0), 0) || 0;

    // Determine next steps
    const nextSteps: string[] = [];
    if (!balance || balance.balance === 0) {
      nextSteps.push('Purchase or earn $bWriter tokens');
    }
    if (confirmedStakes.length === 0 && balance && balance.balance > 0) {
      nextSteps.push('Stake tokens to earn dividends');
    }
    if (
      confirmedStakes.length > 0 &&
      !addressRecord?.bsv_withdrawal_address
    ) {
      nextSteps.push('Add BSV withdrawal address for dividend payouts');
    }
    if (pendingDeposits && pendingDeposits.length > 0) {
      nextSteps.push(`${pendingDeposits.length} stake(s) pending blockchain confirmation`);
    }

    return NextResponse.json({
      // Token Balance
      balance: {
        available: balance?.balance || 0,
        totalEarned: balance?.total_earned || 0,
        totalPurchased: balance?.total_purchased || 0,
        totalStakedEver: balance?.total_staked_ever || 0,
        totalWithdrawn: balance?.total_withdrawn || 0,
      },

      // Staking Status
      stakes: {
        confirmed: confirmedStakes.map((s) => ({
          id: s.id,
          amount: s.amount,
          stakedAt: s.staked_at,
          dividendsAccumulated: s.dividends_accumulated || 0,
          status: 'confirmed',
        })),
        pending: (allStakes?.filter((s) => s.status === 'pending_deposit') || []).map((s) => ({
          id: s.id,
          amount: s.amount,
          status: 'pending_deposit',
          depositDeadline: s.deposit_deadline,
          createdAt: s.created_at,
        })),
        unstaked: (allStakes?.filter((s) => s.status === 'unstaked') || []).map((s) => ({
          id: s.id,
          amount: s.amount,
          unstakedAt: s.unstaked_at,
          dividendsAccumulated: s.dividends_accumulated || 0,
        })),
      },

      // Dividend Information
      dividends: {
        pending: dividends?.dividends_pending || 0,
        claimed: dividends?.dividends_claimed || 0,
        totalEarned: (dividends?.dividends_pending || 0) + (dividends?.dividends_claimed || 0),
      },

      // Ownership & Cap Table
      ownership: {
        totalStaked,
        totalAccumulated: totalDividendsAccumulated,
        percentageOfPlatform: (totalOwnershipPercentage * 100).toFixed(6), // Show as percentage
        capTableRank: capTableEntries?.length > 0 ? 'active' : 'none',
      },

      // Withdrawal Setup
      withdrawalAddress: {
        isConfigured: !!addressRecord?.bsv_withdrawal_address,
        addressMasked: addressRecord?.bsv_withdrawal_address
          ? addressRecord.bsv_withdrawal_address.slice(0, 5) +
            '...' +
            addressRecord.bsv_withdrawal_address.slice(-4)
          : null,
        lastDividendPaid: addressRecord?.last_dividend_paid_to_address || null,
      },

      // Pending Actions
      pendingDeposits: pendingDeposits?.map((d) => ({
        id: d.id,
        stakeId: d.stake_id,
        amount: d.amount_expected,
        status: d.status,
        createdAt: d.created_at,
        depositDeadline: allStakes?.find((s) => s.id === d.stake_id)?.deposit_deadline,
      })) || [],

      // Next Steps for UI
      nextSteps,

      // Summary
      summary: {
        dividendEligible: confirmedStakes.length > 0,
        readyForDividends:
          confirmedStakes.length > 0 && !!addressRecord?.bsv_withdrawal_address,
        totalValue: {
          tokens: totalStaked,
          satoshis: totalDividendsAccumulated + (dividends?.dividends_pending || 0),
        },
      },
    });
  } catch (error) {
    console.error('[bwriter/dashboard] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
