'use client';

import React, { useState } from 'react';
import { useBwriterStaking } from '@/hooks/useBwriterStaking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface StakingFormProps {
  onStakingComplete?: () => void;
}

/**
 * StakingForm Component
 *
 * Allows users to:
 * 1. Enter amount to stake
 * 2. Submit stake request
 * 3. See multisig address for sending tokens
 * 4. Track deposit deadline
 */
export function StakingForm({ onStakingComplete }: StakingFormProps) {
  const { status, isLoading, error, requestStake } = useBwriterStaking();
  const [amount, setAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [multisigAddress, setMultisigAddress] = useState('');
  const [depositDeadline, setDepositDeadline] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    // Check balance
    if (status && parsedAmount > status.balance) {
      return;
    }

    const result = await requestStake(parsedAmount);
    if (result) {
      setMultisigAddress(result.multisigAddress || '');
      setDepositDeadline(result.deadline || null);
      setAmount('');
      setSubmitted(true);
      onStakingComplete?.();

      // Auto-hide success message after 10 seconds
      setTimeout(() => setSubmitted(false), 10000);
    }
  };

  // Not authenticated or no status yet
  if (!status) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>$bWriter Staking</CardTitle>
          <CardDescription>Loading staking information...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // KYC not verified
  if (!status.kyc_verified) {
    return (
      <Card className="w-full border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">KYC Required</CardTitle>
          <CardDescription className="text-yellow-800">
            You must complete KYC verification to stake $bWriter tokens
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full">
            Complete KYC Verification
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Stake $bWriter Tokens</CardTitle>
          <CardDescription>
            Lock your tokens to earn dividends from platform revenue
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Success Message */}
          {submitted && multisigAddress && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Stake Request Submitted</h3>
                  <p className="mt-1 text-sm text-green-700">
                    Send tokens to the address below within 24 hours
                  </p>
                  <div className="mt-3 break-all rounded bg-green-100 p-3 font-mono text-xs">
                    {multisigAddress}
                  </div>
                  {depositDeadline && (
                    <p className="mt-2 text-xs text-green-700">
                      Deadline: {new Date(depositDeadline).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{error.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Balance Display */}
          <div className="mb-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <div className="text-sm text-zinc-600">Available Balance</div>
            <div className="mt-2 text-2xl font-bold">
              {status.balance.toLocaleString()} $bWriter
            </div>
          </div>

          {/* Staking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900">
                Amount to Stake
              </label>
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                max={status.balance}
                disabled={isLoading || submitted}
                className="mt-2"
              />
              <p className="mt-1 text-xs text-zinc-600">
                Max: {status.balance.toLocaleString()} tokens
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                submitted ||
                !amount ||
                parseInt(amount) <= 0 ||
                parseInt(amount) > status.balance
              }
            >
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {submitted ? 'Staking Submitted' : 'Request to Stake'}
            </Button>
          </form>

          {/* Active Stakes */}
          {status.activeStakes && status.activeStakes.length > 0 && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-sm font-semibold text-zinc-900">Your Active Stakes</h3>
              <div className="mt-4 space-y-3">
                {status.activeStakes.map((stake) => (
                  <div key={stake.id} className="rounded-lg border border-zinc-200 p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-zinc-900">
                          {stake.amount.toLocaleString()} tokens
                        </div>
                        <div className="text-xs text-zinc-600 capitalize">
                          Status: {stake.status.replace('_', ' ')}
                        </div>
                      </div>
                      {stake.status === 'confirmed' && (
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
