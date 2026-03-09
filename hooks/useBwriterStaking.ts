'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface StakingStatus {
  balance: number;
  activeStakes: Array<{
    id: string;
    amount: number;
    status: 'pending_deposit' | 'confirmed' | 'unstaking' | 'unstaked';
    staked_at?: string;
  }>;
  pendingDeposits: Array<{
    id: string;
    amount: number;
    deadline: string;
    multisigAddress: string;
  }>;
  accumulatedDividends: number;
  ownership_percentage?: number;
  kyc_verified: boolean;
  bsv_withdrawal_address?: string;
}

interface StakingError {
  message: string;
  code?: string;
}

/**
 * Hook for managing $bWriter staking operations
 *
 * Provides:
 * - Staking and unstaking functions
 * - Status queries
 * - Error handling
 * - Loading states
 */
export function useBwriterStaking() {
  const { user, isAuthenticated } = useAuth();
  const [status, setStatus] = useState<StakingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<StakingError | null>(null);

  // Get current staking status
  const getStatus = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/bwriter/dashboard', {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken?.()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch staking status: ${response.status}`);
      }

      const data = await response.json();
      setStatus(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError({ message, code: 'FETCH_STATUS' });
      console.error('[useBwriterStaking] Error fetching status:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Request to create stake
  const requestStake = useCallback(
    async (amount: number) => {
      if (!isAuthenticated || !user) {
        setError({ message: 'Not authenticated', code: 'NOT_AUTHENTICATED' });
        return null;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/bwriter/stake', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken?.()}`,
          },
          body: JSON.stringify({ amount }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Staking failed: ${response.status}`);
        }

        const data = await response.json();

        // Refresh status
        await getStatus();

        return data;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to request stake';
        setError({ message, code: 'STAKE_REQUEST' });
        console.error('[useBwriterStaking] Error requesting stake:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, getStatus]
  );

  // Unstake
  const unstake = useCallback(
    async (stakeId: string) => {
      if (!isAuthenticated || !user) {
        setError({ message: 'Not authenticated', code: 'NOT_AUTHENTICATED' });
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/bwriter/unstake/${stakeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${await user.getIdToken?.()}`,
          },
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Unstaking failed: ${response.status}`);
        }

        // Refresh status
        await getStatus();

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to unstake';
        setError({ message, code: 'UNSTAKE' });
        console.error('[useBwriterStaking] Error unstaking:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, getStatus]
  );

  // Set BSV withdrawal address
  const setWithdrawalAddress = useCallback(
    async (bsvAddress: string) => {
      if (!isAuthenticated || !user) {
        setError({ message: 'Not authenticated', code: 'NOT_AUTHENTICATED' });
        return false;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/bwriter/dividend-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await user.getIdToken?.()}`,
          },
          body: JSON.stringify({ bsvAddress }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Failed to set address: ${response.status}`);
        }

        // Refresh status
        await getStatus();

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to set withdrawal address';
        setError({ message, code: 'SET_ADDRESS' });
        console.error('[useBwriterStaking] Error setting address:', err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isAuthenticated, user, getStatus]
  );

  // Load status on mount and when user changes
  useEffect(() => {
    if (isAuthenticated) {
      getStatus();
    }
  }, [isAuthenticated, getStatus]);

  return {
    status,
    isLoading,
    error,
    getStatus,
    requestStake,
    unstake,
    setWithdrawalAddress,
  };
}
