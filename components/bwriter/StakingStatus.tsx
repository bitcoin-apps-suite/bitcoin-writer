'use client';

import React from 'react';
import { useBwriterStaking } from '@/hooks/useBwriterStaking';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Loader } from 'lucide-react';

/**
 * StakingStatus Component
 *
 * Displays current staking information:
 * - Total balance
 * - Active stakes
 * - Pending deposits
 * - Accumulated dividends
 * - Ownership percentage
 */
export function StakingStatus() {
  const { status, isLoading, error } = useBwriterStaking();

  if (isLoading && !status) {
    return (
      <div className="flex items-center justify-center gap-2">
        <Loader className="h-5 w-5 animate-spin" />
        <span className="text-sm text-zinc-600">Loading staking status...</span>
      </div>
    );
  }

  if (error && !status) {
    return (
      <Card className="w-full border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900">Error Loading Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-700">{error.message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!status) {
    return null;
  }

  const totalStaked = status.activeStakes
    ?.filter((s) => s.status === 'confirmed')
    .reduce((sum, s) => sum + s.amount, 0) || 0;

  const pendingStakes = status.activeStakes
    ?.filter((s) => s.status === 'pending_deposit')
    .reduce((sum, s) => sum + s.amount, 0) || 0;

  return (
    <div className="space-y-4">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Available Balance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status.balance.toLocaleString()}</div>
            <p className="text-xs text-zinc-600 mt-1">$bWriter tokens</p>
          </CardContent>
        </Card>

        {/* Total Staked */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Total Staked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalStaked.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-600 mt-1">Confirmed stakes</p>
          </CardContent>
        </Card>

        {/* Accumulated Dividends */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-zinc-600">
              Dividends Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {status.accumulatedDividends.toLocaleString()}
            </div>
            <p className="text-xs text-zinc-600 mt-1">Satoshis (sats)</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Stakes */}
      {status.activeStakes && status.activeStakes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Stakes</CardTitle>
            <CardDescription>
              {status.activeStakes.length} total stake
              {status.activeStakes.length !== 1 ? 's' : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {status.activeStakes.map((stake) => (
                <div
                  key={stake.id}
                  className="flex items-center justify-between rounded-lg border border-zinc-200 p-3"
                >
                  <div className="flex-1">
                    <div className="font-medium text-zinc-900">
                      {stake.amount.toLocaleString()} tokens
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-600 mt-1">
                      <span className="capitalize px-2 py-1 rounded bg-zinc-100">
                        {stake.status.replace('_', ' ')}
                      </span>
                      {stake.staked_at && (
                        <span>
                          Staked {new Date(stake.staked_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Indicator */}
                  <div
                    className={`h-3 w-3 rounded-full flex-shrink-0 ${
                      stake.status === 'confirmed'
                        ? 'bg-green-500'
                        : stake.status === 'pending_deposit'
                          ? 'bg-yellow-500'
                          : 'bg-zinc-300'
                    }`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Deposits Info */}
      {pendingStakes > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-sm text-yellow-900">
              Pending Deposits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-800">
              You have {pendingStakes.toLocaleString()} tokens waiting to be deposited.
              Send them to the multisig address to activate your stake.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Ownership Info */}
      {status.ownership_percentage && status.ownership_percentage > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Your Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(status.ownership_percentage * 100).toFixed(4)}%
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-zinc-200">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${Math.min(status.ownership_percentage * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              Of total staked $bWriter tokens
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
