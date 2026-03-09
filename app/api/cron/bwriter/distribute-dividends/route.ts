/**
 * GET /api/cron/bwriter/distribute-dividends
 *
 * Cron Job: Distribute accumulated platform revenue as dividends to all staked token holders
 *
 * Runs periodically (e.g., daily or weekly):
 * 1. Query total platform revenue from revenue tracker
 * 2. Calculate dividend pool (75% of revenue)
 * 3. Calculate each token holder's percentage of total staked
 * 4. Distribute proportional BSV to each holder's wallet
 * 5. Record distribution for audit trail
 *
 * Key Economics:
 * - Revenue flows in as BSV from users saving documents
 * - 75% of revenue becomes dividend pool (25% platform fee)
 * - Divided proportionally among all staked tokens
 * - Paid directly to BSV withdrawal addresses
 *
 * Scheduled: Set via Vercel cron config
 * Environment: process.env.CRON_SECRET must match header
 *
 * Future Enhancement:
 * Revenue tracking should integrate with:
 * - BitcoinWriter save transactions
 * - Bitcoin Corp payments
 * - Any other platform revenue sources
 * Currently stub - assumes revenue is recorded in bwriter_revenue_accumulated
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import axios from 'axios';
import { sendBsvDividends } from '@/lib/bsv-transfer';

// Revenue tracking via bwriter_revenue_accumulated table
// This table is updated by:
// - BitcoinWriter save transaction hooks
// - Bitcoin Corp payment processors
// - Admin deposits for testing
// - Any other revenue source integrated with the platform
const REVENUE_SATOSHIS_THIS_PERIOD = 0; // Will be fetched dynamically from database

// 75% dividend, 25% platform
const DIVIDEND_PERCENTAGE = 0.75;

/**
 * Get total revenue accumulated since last distribution
 *
 * Queries the bwriter_revenue_accumulated table for revenue from:
 * 1. Bitcoin Writer transaction fees (users pay per save)
 * 2. Bitcoin Corp service fees
 * 3. Manual deposits for testing
 * 4. Any other platform revenue source
 */
async function getAccumulatedRevenue(supabase: any): Promise<bigint> {
  try {
    // Get all pending revenue that hasn't been distributed
    const { data: revenueRecords, error } = await supabase
      .from('bwriter_revenue_accumulated')
      .select('amount_satoshis')
      .eq('status', 'pending')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

    if (error) {
      console.error('[bwriter/distribute] Error fetching accumulated revenue:', error);
      throw error;
    }

    if (!revenueRecords || revenueRecords.length === 0) {
      console.log('[bwriter/distribute] No pending revenue to distribute');
      return BigInt(0);
    }

    // Sum all revenue
    const totalRevenue = revenueRecords.reduce((sum: bigint, record: any) => {
      return sum + BigInt(record.amount_satoshis || 0);
    }, BigInt(0));

    console.log(
      `[bwriter/distribute] Accumulated revenue: ${totalRevenue.toString()} satoshis from ${revenueRecords.length} transactions`
    );

    return totalRevenue;
  } catch (error) {
    console.error('[bwriter/distribute] Fatal error fetching revenue:', error);
    throw error;
  }
}

/**
 * Calculate each staker's percentage of total
 */
async function calculateOwnershipPercentages(
  supabase: any
): Promise<{ stakeId: string; userId: string; percentageOfTotal: number }[]> {
  // Get all active stakes
  const { data: activeStakes, error: stakeError } = await supabase
    .from('user_bwriter_stakes')
    .select('id, user_id, amount')
    .eq('status', 'confirmed');

  if (stakeError) {
    console.error(
      '[bwriter/distribute] Error fetching active stakes:',
      stakeError
    );
    throw stakeError;
  }

  if (!activeStakes || activeStakes.length === 0) {
    console.log('[bwriter/distribute] No active stakes found - no dividends to distribute');
    return [];
  }

  // Calculate total staked
  const totalStaked = activeStakes.reduce((sum, stake) => sum + stake.amount, 0);

  if (totalStaked === 0) {
    console.log('[bwriter/distribute] Total staked is 0 - no dividends to distribute');
    return [];
  }

  // Calculate percentage for each
  const percentages = activeStakes.map((stake) => ({
    stakeId: stake.id,
    userId: stake.user_id,
    percentageOfTotal: stake.amount / totalStaked,
  }));

  console.log(
    `[bwriter/distribute] Calculated ownership percentages for ${percentages.length} stakes`
  );

  return percentages;
}

/**
 * Update cap table with ownership percentages
 */
async function updateCapTablePercentages(
  supabase: any,
  percentages: { stakeId: string; percentageOfTotal: number }[]
): Promise<void> {
  for (const entry of percentages) {
    const { error } = await supabase
      .from('bwriter_cap_table')
      .update({
        percentage_of_total: entry.percentageOfTotal,
      })
      .eq('stake_id', entry.stakeId);

    if (error) {
      console.error(
        `[bwriter/distribute] Error updating cap table for ${entry.stakeId}:`,
        error
      );
      throw error;
    }
  }

  console.log(`[bwriter/distribute] Updated cap table percentages for ${percentages.length} entries`);
}

/**
 * Send BSV to each holder's withdrawal address
 *
 * Collects withdrawal addresses and amounts, then uses the BSV transfer service
 * to send dividends to all holders in a single batch transaction.
 *
 * The BSV transfer service handles:
 * - Transaction building
 * - Fee calculation
 * - Address validation
 * - Multisig signing
 * - Network broadcasting
 *
 * (Note: Phase 1 stubs most of this; Phase 2 implements actual transfers)
 */
async function sendBsvPayouts(
  supabase: any,
  dividendPool: bigint,
  percentages: { stakeId: string; userId: string; percentageOfTotal: number }[]
): Promise<{ successCount: number; failureCount: number }> {
  // Collect all dividend outputs
  const outputs: Array<{ address: string; amountSatoshis: bigint }> = [];

  for (const entry of percentages) {
    const dividendAmount = dividendPool * BigInt(Math.round(entry.percentageOfTotal * 1000000)) / BigInt(1000000);

    // Get withdrawal address
    const { data: addressRecord, error: addressError } = await supabase
      .from('user_bwriter_dividend_addresses')
      .select('bsv_withdrawal_address')
      .eq('user_id', entry.userId)
      .single();

    if (addressError || !addressRecord) {
      console.log(
        `[bwriter/distribute] User ${entry.userId} has no withdrawal address - skipping`
      );
      continue;
    }

    outputs.push({
      address: addressRecord.bsv_withdrawal_address,
      amountSatoshis: dividendAmount,
    });
  }

  if (outputs.length === 0) {
    console.log('[bwriter/distribute] No valid withdrawal addresses - skipping BSV transfers');
    return { successCount: 0, failureCount: 0 };
  }

  // Send BSV dividends via BSV transfer service
  const transferResults = await sendBsvDividends(outputs);

  // Count successes and failures
  const successCount = transferResults.filter((r) => r.status === 'success').length;
  const failureCount = transferResults.filter((r) => r.status === 'failed').length;

  console.log(
    `[bwriter/distribute] Sent dividends: ${successCount} succeeded, ${failureCount} failed`
  );

  return { successCount, failureCount };
}

/**
 * Update dividend tracking for each holder
 */
async function updateDividendRecords(
  supabase: any,
  dividendPool: bigint,
  percentages: { stakeId: string; userId: string; percentageOfTotal: number }[]
): Promise<void> {
  for (const entry of percentages) {
    const dividendAmount = dividendPool * BigInt(Math.round(entry.percentageOfTotal * 1000000)) / BigInt(1000000);

    // Update stake with accumulated dividends
    const { error: stakeError } = await supabase
      .from('user_bwriter_stakes')
      .select('dividends_accumulated')
      .eq('id', entry.stakeId)
      .single()
      .then(async ({ data: stake }) => {
        if (!stake) throw new Error('Stake not found');

        return supabase
          .from('user_bwriter_stakes')
          .update({
            dividends_accumulated: (stake.dividends_accumulated || 0) + dividendAmount.toString(),
          })
          .eq('id', entry.stakeId);
      });

    if (stakeError) {
      console.error(
        `[bwriter/distribute] Error updating stake dividends for ${entry.stakeId}:`,
        stakeError
      );
      continue;
    }

    // Update user's dividend owed
    const { data: dividendRecord } = await supabase
      .from('user_bwriter_dividends_owed')
      .select('dividends_pending')
      .eq('user_id', entry.userId)
      .single();

    const { error: dividendError } = await supabase
      .from('user_bwriter_dividends_owed')
      .update({
        dividends_pending: (dividendRecord?.dividends_pending || 0) + dividendAmount.toString(),
      })
      .eq('user_id', entry.userId);

    if (dividendError) {
      console.error(
        `[bwriter/distribute] Error updating dividends owed for ${entry.userId}:`,
        dividendError
      );
    }
  }

  console.log(`[bwriter/distribute] Updated dividend records for ${percentages.length} holders`);
}

/**
 * Record distribution for audit trail
 */
async function recordDistribution(
  supabase: any,
  revenue: bigint,
  dividendPool: bigint,
  totalTokensStaked: bigint,
  percentages: { stakeId: string }[]
): Promise<void> {
  // Get current block height (stub)
  const currentBlockHeight = Math.floor(Date.now() / 10000); // Approximate

  const { error } = await supabase
    .from('bwriter_dividend_distributions')
    .insert({
      distribution_round: Math.floor(Date.now() / 1000), // Use timestamp as round ID
      block_height: currentBlockHeight,
      total_revenue_bsv: revenue.toString(),
      dividend_pool_bsv: dividendPool.toString(),
      total_tokens_staked: totalTokensStaked.toString(),
      tokens_per_satoshi: (totalTokensStaked > 0 ? dividendPool / totalTokensStaked : 0).toString(),
    });

  if (error) {
    console.error('[bwriter/distribute] Error recording distribution:', error);
    throw error;
  }

  console.log(
    `[bwriter/distribute] Recorded distribution: ${revenue} satoshis revenue, ${dividendPool} satoshis dividend pool`
  );
}

export async function GET(request: NextRequest) {
  try {
    // 1. Validate CRON_SECRET
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    console.log('[bwriter/distribute] Starting dividend distribution job');

    // 2. Get accumulated revenue
    const revenue = await getAccumulatedRevenue(supabase);

    if (revenue === BigInt(0)) {
      console.log('[bwriter/distribute] No revenue to distribute');
      return NextResponse.json({
        status: 'success',
        message: 'No revenue to distribute this period',
        revenue: '0',
        dividendPool: '0',
        holdersReceived: 0,
      });
    }

    // 3. Calculate dividend pool
    const dividendPool = revenue * BigInt(Math.round(DIVIDEND_PERCENTAGE * 1000000)) / BigInt(1000000);

    console.log(
      `[bwriter/distribute] Revenue: ${revenue.toString()}, Dividend Pool: ${dividendPool.toString()}`
    );

    // 4. Calculate ownership percentages
    const percentages = await calculateOwnershipPercentages(supabase);

    if (percentages.length === 0) {
      return NextResponse.json({
        status: 'success',
        message: 'No active stakes to distribute to',
        revenue: revenue.toString(),
        dividendPool: dividendPool.toString(),
        holdersReceived: 0,
      });
    }

    // 5. Update cap table
    await updateCapTablePercentages(supabase, percentages);

    // 6. Send BSV payouts (currently stubbed)
    const payoutResults = await sendBsvPayouts(supabase, dividendPool, percentages);

    // 7. Update dividend records
    await updateDividendRecords(supabase, dividendPool, percentages);

    // 8. Record distribution for audit
    const totalTokensStaked = percentages.length > 0
      ? BigInt(100) // Placeholder - would be actual total from cap table
      : BigInt(0);

    await recordDistribution(supabase, revenue, dividendPool, totalTokensStaked, percentages);

    console.log(
      `[bwriter/distribute] Distribution complete. Sent to ${payoutResults.successCount} holders, ${payoutResults.failureCount} failed`
    );

    return NextResponse.json({
      status: 'success',
      message: 'Dividend distribution completed',
      revenue: revenue.toString(),
      dividendPool: dividendPool.toString(),
      holdersReceived: payoutResults.successCount,
      holdersFailed: payoutResults.failureCount,
      nextDistributionEstimate: 'Daily (configure in Vercel)',
    });
  } catch (error) {
    console.error('[bwriter/distribute] Fatal error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
