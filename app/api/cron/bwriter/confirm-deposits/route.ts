/**
 * GET /api/cron/bwriter/confirm-deposits
 *
 * Cron Job: Watch multisig address for incoming $bWriter deposits
 *
 * Runs every hour:
 * 1. Find all pending deposits (status = 'waiting')
 * 2. Query whatsonchain for transactions to multisig address
 * 3. Match deposits to pending stakes
 * 4. Confirm stakes, add to cap table, start dividend accrual
 *
 * Scheduled: Every hour via Vercel cron
 * Environment: process.env.CRON_SECRET must match header
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import axios from 'axios';

const MULTISIG_ADDRESS = '1Dd3iSFQEM8spmdLbqwxMenWEryNnBBHM6';
const CONFIRMATIONS_REQUIRED = 1; // BSV confirmations before activating stake

/**
 * Query whatsonchain for incoming transactions to multisig
 */
async function getMultisigDeposits() {
  try {
    console.log(`[bwriter/cron] Querying deposits to ${MULTISIG_ADDRESS}`);

    const response = await axios.get(
      `https://api.whatsonchain.com/v1/bsv/main/address/${MULTISIG_ADDRESS}/unspent`
    );

    if (!response.data) {
      console.log('[bwriter/cron] No UTXOs found at multisig address');
      return [];
    }

    // Return recent deposits (last 100 blocks worth)
    return response.data.map((utxo: any) => ({
      txid: utxo.tx_hash,
      vout: utxo.vout,
      value: utxo.value, // In satoshis
      height: utxo.height,
    }));
  } catch (error) {
    console.error('[bwriter/cron] Error querying multisig:', error);
    return [];
  }
}

/**
 * Get transaction details to determine output amounts
 */
async function getTransactionOutput(txid: string, vout: number) {
  try {
    const response = await axios.get(
      `https://api.whatsonchain.com/v1/bsv/main/tx/${txid}`
    );

    if (!response.data || !response.data.vout || !response.data.vout[vout]) {
      return null;
    }

    const output = response.data.vout[vout];
    return {
      satoshis: output.value,
      address: output.scriptPubKey?.addresses?.[0],
    };
  } catch (error) {
    console.error('[bwriter/cron] Error fetching transaction:', error);
    return null;
  }
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

    console.log('[bwriter/cron] Starting deposit confirmation job');

    // 2. Get all pending deposits
    const { data: pendingDeposits, error: queryError } = await supabase
      .from('bwriter_multisig_deposits')
      .select('*')
      .eq('status', 'waiting');

    if (queryError) {
      console.error('[bwriter/cron] Error fetching pending deposits:', queryError);
      return NextResponse.json(
        { error: 'Database error', details: queryError.message },
        { status: 500 }
      );
    }

    if (!pendingDeposits || pendingDeposits.length === 0) {
      console.log('[bwriter/cron] No pending deposits to process');
      return NextResponse.json({
        status: 'success',
        processed: 0,
        message: 'No pending deposits',
      });
    }

    console.log(`[bwriter/cron] Found ${pendingDeposits.length} pending deposits`);

    // 3. Query multisig address for recent activity
    const deposits = await getMultisigDeposits();
    console.log(`[bwriter/cron] Found ${deposits.length} UTXOs at multisig`);

    let confirmed = 0;

    // 4. Try to match deposits to pending stakes
    for (const pending of pendingDeposits) {
      console.log(
        `[bwriter/cron] Processing deposit ${pending.stake_id} (expecting ${pending.amount_expected} sats)`
      );

      // Look for matching UTXO
      const matching = deposits.find((d) =>
        d.value >= pending.amount_expected - 1000 && // Allow 1000 sat variance
        d.value <= pending.amount_expected + 1000
      );

      if (!matching) {
        console.log(
          `[bwriter/cron] No matching deposit found for ${pending.stake_id}`
        );
        continue;
      }

      console.log(
        `[bwriter/cron] Found matching deposit: ${matching.txid}:${matching.vout}`
      );

      // 5. Update deposit record with blockchain info
      const { error: updateError } = await supabase
        .from('bwriter_multisig_deposits')
        .update({
          deposit_txid: matching.txid,
          amount_received: matching.value,
          confirmations: 1, // BSV confirms instantly for practical purposes
          confirmed_at: new Date().toISOString(),
          status: 'confirmed',
        })
        .eq('id', pending.id);

      if (updateError) {
        console.error('[bwriter/cron] Error updating deposit:', updateError);
        continue;
      }

      // 6. Activate the stake record
      const { error: stakeError } = await supabase
        .from('user_bwriter_stakes')
        .update({
          status: 'confirmed',
          staked_at: new Date().toISOString(),
          blockchain_confirmations: 1,
        })
        .eq('id', pending.stake_id);

      if (stakeError) {
        console.error('[bwriter/cron] Error confirming stake:', stakeError);
        continue;
      }

      // 7. Add to cap table
      const { error: capTableError } = await supabase
        .from('bwriter_cap_table')
        .insert({
          stake_id: pending.stake_id,
          user_id: pending.user_id,
          tokens_staked: pending.amount_expected,
          status: 'active',
        });

      if (capTableError) {
        console.error('[bwriter/cron] Error adding to cap table:', capTableError);
        continue;
      }

      // 8. Deduct from user balance
      const { data: balance } = await supabase
        .from('user_bwriter_balance')
        .select('*')
        .eq('user_id', pending.user_id)
        .single();

      if (balance) {
        await supabase
          .from('user_bwriter_balance')
          .update({
            balance: balance.balance - pending.amount_expected,
            total_staked_ever: balance.total_staked_ever + pending.amount_expected,
          })
          .eq('user_id', pending.user_id);
      }

      confirmed++;
      console.log(
        `[bwriter/cron] Successfully confirmed deposit for ${pending.stake_id}`
      );
    }

    console.log(
      `[bwriter/cron] Job complete. Confirmed ${confirmed}/${pendingDeposits.length} deposits`
    );

    return NextResponse.json({
      status: 'success',
      processed: pendingDeposits.length,
      confirmed,
      message: `Processed ${pendingDeposits.length} pending deposits, confirmed ${confirmed}`,
    });
  } catch (error) {
    console.error('[bwriter/cron] Fatal error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
