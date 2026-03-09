'use client';

import React, { useState } from 'react';
import { useBwriterStaking } from '@/hooks/useBwriterStaking';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface WithdrawalAddressFormProps {
  currentAddress?: string;
}

/**
 * WithdrawalAddressForm Component
 *
 * Allows users to set their BSV address for dividend payouts.
 * Required to receive dividends.
 */
export function WithdrawalAddressForm({ currentAddress }: WithdrawalAddressFormProps) {
  const { isLoading, error, setWithdrawalAddress } = useBwriterStaking();
  const [address, setAddress] = useState(currentAddress || '');
  const [isEditing, setIsEditing] = useState(!currentAddress);
  const [submitted, setSubmitted] = useState(false);

  const isValidBsvAddress = (addr: string): boolean => {
    // Valid BSV addresses start with 1 or 3
    return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(addr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidBsvAddress(address)) {
      return;
    }

    const success = await setWithdrawalAddress(address);
    if (success) {
      setIsEditing(false);
      setSubmitted(true);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const isAddressValid = isValidBsvAddress(address);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Dividend Withdrawal Address</CardTitle>
        <CardDescription>
          Your BSV address where dividend payments will be sent
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Success Message */}
        {submitted && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <div>
                <h3 className="font-semibold text-green-900">Address Updated</h3>
                <p className="mt-1 text-sm text-green-700">
                  Your withdrawal address has been saved
                </p>
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

        {/* Display Current Address */}
        {!isEditing && currentAddress && (
          <div className="mb-4">
            <div className="text-sm text-zinc-600">Current Address</div>
            <div className="mt-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <code className="break-all font-mono text-sm">{currentAddress}</code>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="mt-4"
            >
              Edit Address
            </Button>
          </div>
        )}

        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900">
                BSV Address
              </label>
              <Input
                type="text"
                placeholder="1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-2"
                disabled={isLoading}
              />
              <p className="mt-2 text-xs text-zinc-600">
                Must be a valid BSV address starting with 1 or 3
              </p>

              {/* Validation Feedback */}
              {address && !isAddressValid && (
                <div className="mt-2 flex items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                  <span className="text-xs text-red-600">Invalid BSV address format</span>
                </div>
              )}

              {address && isAddressValid && (
                <div className="mt-2 flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                  <span className="text-xs text-green-600">Valid BSV address</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1"
                disabled={isLoading || !isAddressValid}
              >
                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                Save Address
              </Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsEditing(false);
                  setAddress(currentAddress || '');
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {/* Info Box */}
        <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="font-semibold text-blue-900">Why do I need this?</h4>
          <p className="mt-2 text-sm text-blue-700">
            When dividends are distributed, they're sent directly to your BSV address.
            Make sure to set an address you control to receive your payments.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
