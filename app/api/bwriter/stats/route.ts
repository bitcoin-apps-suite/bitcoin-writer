/**
 * GET /api/bwriter/stats
 *
 * Public endpoint returning global staking ecosystem stats.
 * No authentication required — these are aggregate numbers.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch aggregate stats in parallel
    const [stakesResult, usersResult, dividendsResult, revenueResult] =
      await Promise.all([
        // Total staked tokens (confirmed stakes only)
        supabase
          .from('user_bwriter_stakes')
          .select('amount')
          .eq('status', 'confirmed'),

        // Count unique stakers
        supabase
          .from('user_bwriter_stakes')
          .select('user_id')
          .eq('status', 'confirmed'),

        // Total dividends distributed
        supabase
          .from('bwriter_dividend_distributions')
          .select('total_distributed_satoshis'),

        // Total platform revenue
        supabase
          .from('bwriter_revenue_accumulated')
          .select('amount_satoshis'),
      ]);

    // Calculate totals
    const totalStaked = stakesResult.data?.reduce(
      (sum, s) => sum + (s.amount || 0),
      0
    ) ?? 0;

    const uniqueUsers = new Set(
      usersResult.data?.map((s) => s.user_id) ?? []
    ).size;

    const totalDistributed = dividendsResult.data?.reduce(
      (sum, d) => sum + (d.total_distributed_satoshis || 0),
      0
    ) ?? 0;

    const platformRevenue = revenueResult.data?.reduce(
      (sum, r) => sum + (r.amount_satoshis || 0),
      0
    ) ?? 0;

    return NextResponse.json({
      totalStaked,
      totalUsers: uniqueUsers,
      totalDistributed,
      platformRevenue,
    });
  } catch (error) {
    console.error('[bwriter/stats] Error:', error);

    // Return fallback stats so the dashboard still renders
    return NextResponse.json({
      totalStaked: 0,
      totalUsers: 0,
      totalDistributed: 0,
      platformRevenue: 0,
    });
  }
}
