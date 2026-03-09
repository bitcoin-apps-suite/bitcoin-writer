/**
 * POST /api/bwriter/revenue/record
 *
 * Record revenue from various sources for dividend distribution.
 *
 * This endpoint is called by:
 * - BitcoinWriter save transaction webhook
 * - Bitcoin Corp payment processor
 * - Admin/testing to simulate revenue
 *
 * Admin only - requires admin API key in X-API-Key header
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const recordRevenueSchema = z.object({
  amount_satoshis: z.number().int().positive('Amount must be positive'),
  revenue_source: z.enum(['bitcoin_writer_save', 'bitcoin_corp_fee', 'manual_deposit', 'other']),
  source_reference: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Validate admin API key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid or missing admin API key' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validationResult = recordRevenueSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { amount_satoshis, revenue_source, source_reference, description } = validationResult.data;

    // Create Supabase client
    const supabase = await createClient();

    // Record revenue
    const { data, error } = await supabase
      .from('bwriter_revenue_accumulated')
      .insert({
        amount_satoshis,
        revenue_source,
        source_reference,
        status: 'pending', // Will be marked 'distributed' after dividend run
        revenue_period_start: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('[bwriter/revenue/record] Error recording revenue:', error);
      return NextResponse.json(
        { error: 'Failed to record revenue', details: error.message },
        { status: 500 }
      );
    }

    console.log(
      `[bwriter/revenue/record] Recorded ${amount_satoshis} satoshis from ${revenue_source}`
    );

    return NextResponse.json({
      status: 'success',
      message: `Recorded ${amount_satoshis} satoshis revenue`,
      revenue_id: data.id,
      amount_satoshis,
      revenue_source,
      source_reference,
    });
  } catch (error) {
    console.error('[bwriter/revenue/record] Fatal error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bwriter/revenue/record
 *
 * Get revenue statistics (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Validate admin API key
    const apiKey = request.headers.get('x-api-key');
    if (apiKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid or missing admin API key' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    // Get pending revenue statistics
    const { data: pendingRevenue, error: pendingError } = await supabase
      .from('bwriter_revenue_accumulated')
      .select('amount_satoshis')
      .eq('status', 'pending');

    if (pendingError) {
      throw pendingError;
    }

    const totalPending = pendingRevenue?.reduce(
      (sum: number, record: any) => sum + record.amount_satoshis,
      0
    ) || 0;

    // Get revenue by source
    const { data: bySource, error: sourceError } = await supabase
      .from('bwriter_revenue_accumulated')
      .select('revenue_source, amount_satoshis')
      .eq('status', 'pending');

    if (sourceError) {
      throw sourceError;
    }

    const sourceBreakdown = (bySource || []).reduce(
      (acc: any, record: any) => {
        acc[record.revenue_source] = (acc[record.revenue_source] || 0) + record.amount_satoshis;
        return acc;
      },
      {}
    );

    return NextResponse.json({
      status: 'success',
      totalPendingRevenue: totalPending,
      revenueCount: pendingRevenue?.length || 0,
      sourceBreakdown,
      dividendPool: Math.floor(totalPending * 0.75),
      platformFee: Math.floor(totalPending * 0.25),
    });
  } catch (error) {
    console.error('[bwriter/revenue/record] Error fetching revenue stats:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch revenue statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
