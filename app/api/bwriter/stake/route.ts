/**
 * POST /api/bwriter/stake
 *
 * Request to stake $bWriter tokens in multisig for dividend generation
 *
 * Requirements:
 * - User must have tokens in balance (user_bwriter_balance)
 * - User must be KYC verified (user_kyc.status = 'verified')
 * - Tokens will be locked in multisig: 1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6
 *
 * Flow:
 * 1. User requests to stake X tokens
 * 2. System checks: KYC verified? Balance sufficient?
 * 3. If yes → creates pending stake, gives deposit address + deadline
 * 4. User sends tokens to multisig (we watch blockchain)
 * 5. When confirmed → stake activated, tokens locked, dividends accrue
 *
 * Request body:
 * - amount: number - Tokens to stake
 *
 * Response:
 * - success: boolean
 * - stakeId: string - Stake record ID
 * - status: 'pending_deposit'
 * - depositDeadline: string - ISO timestamp (24 hours from now)
 * - multisigAddress: string - Send tokens here
 * - message: string - Instructions
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/investors/auth';
import { createClient } from '@/lib/supabase/server';
import { checkKYCStatus } from '@/lib/kyc';
import { z } from 'zod';

const stakeSchema = z.object({
  amount: z.number().min(1).max(1000000000), // Max 1B tokens
});

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
    const validation = stakeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { amount } = validation.data;
    const supabase = await createClient();

    // 3. Check KYC Status
    const kycStatus = await checkKYCStatus(unifiedUser.id);
    if (!kycStatus.verified) {
      return NextResponse.json(
        {
          error: 'KYC verification required to stake tokens',
          kycStatus: kycStatus.status,
          message:
            'Please complete KYC verification before staking tokens for dividends. Visit /tools/verify to upload your ID.',
        },
        { status: 403 }
      );
    }

    // 4. Check Balance
    const { data: balance, error: balanceError } = await supabase
      .from('user_bwriter_balance')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .single();

    if (balanceError || !balance) {
      return NextResponse.json(
        { error: 'No token balance found' },
        { status: 404 }
      );
    }

    if (balance.balance < amount) {
      return NextResponse.json(
        {
          error: 'Insufficient balance',
          required: amount,
          available: balance.balance,
        },
        { status: 400 }
      );
    }

    // 5. Get KYC ID
    const { data: kyc } = await supabase
      .from('user_kyc')
      .select('id')
      .eq('user_id', unifiedUser.id)
      .eq('status', 'verified')
      .single();

    if (!kyc) {
      return NextResponse.json(
        { error: 'KYC record not found' },
        { status: 500 }
      );
    }

    // 6. Create Stake Record
    const depositDeadline = new Date();
    depositDeadline.setHours(depositDeadline.getHours() + 24);

    const { data: stake, error: stakeError } = await supabase
      .from('user_bwriter_stakes')
      .insert({
        user_id: unifiedUser.id,
        platform_staked_on: 'b0ase.com', // This endpoint is on b0ase.com
        kyc_id: kyc.id,
        amount,
        status: 'pending_deposit',
        deposit_deadline: depositDeadline.toISOString(),
      })
      .select()
      .single();

    if (stakeError || !stake) {
      console.error('[bwriter/stake] Failed to create stake:', stakeError);
      return NextResponse.json(
        { error: 'Failed to create stake record' },
        { status: 500 }
      );
    }

    // 7. Create Multisig Deposit Tracker
    await supabase.from('bwriter_multisig_deposits').insert({
      stake_id: stake.id,
      user_id: unifiedUser.id,
      target_multisig_address: '1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6',
      amount_expected: amount,
      status: 'waiting',
    });

    return NextResponse.json({
      success: true,
      stakeId: stake.id,
      status: 'pending_deposit',
      amount,
      depositDeadline: depositDeadline.toISOString(),
      multisigAddress: '1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6',
      instructions: [
        `You have requested to stake ${amount.toLocaleString()} $bWriter tokens.`,
        '',
        `Please send your tokens to the multisig address:`,
        `1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6`,
        '',
        `This address will automatically lock your tokens and activate dividend generation.`,
        `Deadline: ${depositDeadline.toISOString()}`,
        '',
        `Once confirmed on the blockchain (usually 10 minutes), your tokens will be locked and you will start earning dividends.`,
        '',
        `Your stake ID: ${stake.id}`,
      ].join('\n'),
    });
  } catch (error) {
    console.error('[bwriter/stake] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to create stake',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bwriter/stake
 *
 * Get user's current staking status
 */
export async function GET(request: NextRequest) {
  try {
    const authContext = await getAuthenticatedUser();
    if (!authContext) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { unifiedUser } = authContext;
    const supabase = await createClient();

    const { data: stakes } = await supabase
      .from('user_bwriter_stakes')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .order('created_at', { ascending: false });

    const { data: balance } = await supabase
      .from('user_bwriter_balance')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .single();

    const { data: dividends } = await supabase
      .from('user_bwriter_dividends_owed')
      .select('*')
      .eq('user_id', unifiedUser.id)
      .single();

    return NextResponse.json({
      balance: balance?.balance || 0,
      stakes: stakes || [],
      dividendsOwed: dividends?.dividends_pending || 0,
      dividendsClaimed: dividends?.dividends_claimed || 0,
    });
  } catch (error) {
    console.error('[bwriter/stake] GET Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staking status' },
      { status: 500 }
    );
  }
}
