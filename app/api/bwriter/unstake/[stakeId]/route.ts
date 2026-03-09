/**
 * DELETE /api/bwriter/unstake/[stakeId]
 *
 * Unstake $bWriter tokens from multisig and remove from dividend-bearing cap table
 *
 * Requirements:
 * - User must own the stake (stakeId must belong to authenticated user)
 * - Stake must have status = 'confirmed' (already locked in multisig)
 *
 * Flow:
 * 1. User requests to unstake tokens
 * 2. System verifies stake ownership and status
 * 3. Removes stake from cap table (status = 'removed')
 * 4. Returns tokens to user balance
 * 5. Records unstaked_at timestamp
 * 6. Preserves dividends_accumulated (still "owed" to user)
 * 7. Tokens can now be withdrawn or traded freely
 *
 * Key Behavior:
 * - Dividends stop accruing from unstaked_at onward
 * - Previous accumulated dividends remain claimable (if KYC still valid)
 * - User can re-stake later (creates new stake record)
 * - Withdrawn tokens carry no dividend history to new owner
 *
 * Path parameters:
 * - stakeId: UUID - The stake record to unstake
 *
 * Response:
 * - success: boolean
 * - stakeId: string - The unstaked stake ID
 * - status: 'unstaked'
 * - amountUnstaked: number - Tokens returned to balance
 * - unstaked_at: string - ISO timestamp
 * - dividendsPreserved: number - Satoshis still owed (preserved from unstaking)
 * - message: string - Confirmation message
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/investors/auth';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { stakeId: string } }
) {
  try {
    // 1. Authentication
    const authContext = await getAuthenticatedUser();
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { unifiedUser } = authContext;
    const supabase = await createClient();

    console.log(
      `[bwriter/unstake] User ${unifiedUser.id} requesting to unstake ${params.stakeId}`
    );

    // 2. Get the stake record
    const { data: stake, error: stakeError } = await supabase
      .from('user_bwriter_stakes')
      .select('*')
      .eq('id', params.stakeId)
      .eq('user_id', unifiedUser.id)
      .single();

    if (stakeError || !stake) {
      console.log(`[bwriter/unstake] Stake not found or doesn't belong to user`);
      return NextResponse.json(
        { error: 'Stake not found or unauthorized' },
        { status: 404 }
      );
    }

    // 3. Verify stake status is 'confirmed'
    if (stake.status !== 'confirmed') {
      console.log(
        `[bwriter/unstake] Cannot unstake: status is ${stake.status}, must be 'confirmed'`
      );
      return NextResponse.json(
        {
          error: `Cannot unstake stake with status '${stake.status}'`,
          details:
            stake.status === 'pending_deposit'
              ? 'Stake must be confirmed on blockchain first'
              : stake.status === 'unstaked'
                ? 'Stake is already unstaked'
                : 'Invalid stake status',
        },
        { status: 400 }
      );
    }

    // 4. Record the unstaking timestamp
    const unstaked_at = new Date().toISOString();

    // 5. Update stake record: mark as unstaked
    const { error: updateStakeError } = await supabase
      .from('user_bwriter_stakes')
      .update({
        status: 'unstaked',
        unstaked_at,
      })
      .eq('id', params.stakeId);

    if (updateStakeError) {
      console.error('[bwriter/unstake] Error updating stake status:', updateStakeError);
      return NextResponse.json(
        { error: 'Failed to unstake', details: updateStakeError.message },
        { status: 500 }
      );
    }

    // 6. Remove from cap table
    const { error: capTableError } = await supabase
      .from('bwriter_cap_table')
      .update({
        status: 'removed',
      })
      .eq('stake_id', params.stakeId);

    if (capTableError) {
      console.error('[bwriter/unstake] Error removing from cap table:', capTableError);
      return NextResponse.json(
        { error: 'Failed to remove from cap table', details: capTableError.message },
        { status: 500 }
      );
    }

    // 7. Return tokens to user balance
    const { data: balance, error: balanceError } = await supabase
      .from('user_bwriter_balance')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .single();

    if (balanceError || !balance) {
      console.error('[bwriter/unstake] Error fetching user balance:', balanceError);
      return NextResponse.json(
        { error: 'Failed to fetch balance', details: balanceError?.message },
        { status: 500 }
      );
    }

    // Add unstaked tokens back to available balance
    const { error: updateBalanceError } = await supabase
      .from('user_bwriter_balance')
      .update({
        balance: balance.balance + stake.amount,
        // Note: We don't decrement total_staked_ever - that's cumulative history
      })
      .eq('user_id', unifiedUser.id);

    if (updateBalanceError) {
      console.error('[bwriter/unstake] Error updating balance:', updateBalanceError);
      return NextResponse.json(
        { error: 'Failed to return tokens to balance', details: updateBalanceError.message },
        { status: 500 }
      );
    }

    // 8. Log successful unstaking
    console.log(
      `[bwriter/unstake] Successfully unstaked ${stake.amount} tokens for user ${unifiedUser.id}`
    );

    // 9. Return response
    return NextResponse.json({
      success: true,
      stakeId: params.stakeId,
      status: 'unstaked',
      amountUnstaked: stake.amount,
      unstaked_at,
      dividendsPreserved: stake.dividends_accumulated || 0,
      message: `Successfully unstaked ${stake.amount.toLocaleString()} $bWriter tokens. Your tokens have been returned to your balance and can now be withdrawn or traded. Your accumulated dividends remain claimable if you maintain KYC verification.`,
    });
  } catch (error) {
    console.error('[bwriter/unstake] Fatal error:', error);
    return NextResponse.json(
      {
        error: 'Failed to unstake',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bwriter/unstake/[stakeId]
 *
 * Check if a stake can be unstaked (verify status and ownership)
 * Used by frontend to validate unstake button state
 *
 * Response:
 * - canUnstake: boolean
 * - stakeId: string
 * - status: string - Current stake status
 * - amountStaked: number
 * - dividendsAccumulated: number
 * - reason: string (if canUnstake is false)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { stakeId: string } }
) {
  try {
    const authContext = await getAuthenticatedUser();
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { unifiedUser } = authContext;
    const supabase = await createClient();

    const { data: stake, error: stakeError } = await supabase
      .from('user_bwriter_stakes')
      .select('*')
      .eq('id', params.stakeId)
      .eq('user_id', unifiedUser.id)
      .single();

    if (stakeError || !stake) {
      return NextResponse.json(
        { error: 'Stake not found' },
        { status: 404 }
      );
    }

    const canUnstake = stake.status === 'confirmed';

    return NextResponse.json({
      canUnstake,
      stakeId: params.stakeId,
      status: stake.status,
      amountStaked: stake.amount,
      dividendsAccumulated: stake.dividends_accumulated || 0,
      reason: canUnstake
        ? null
        : stake.status === 'pending_deposit'
          ? 'Stake must be confirmed on blockchain first'
          : stake.status === 'unstaked'
            ? 'Stake is already unstaked'
            : 'Invalid stake status',
    });
  } catch (error) {
    console.error('[bwriter/unstake] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stake status' },
      { status: 500 }
    );
  }
}
