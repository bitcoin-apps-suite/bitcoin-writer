'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { StakingForm } from '@/components/bwriter/StakingForm';
import { StakingStatus } from '@/components/bwriter/StakingStatus';
import { WithdrawalAddressForm } from '@/components/bwriter/WithdrawalAddressForm';
import { FiTrendingUp, FiUsers, FiDollarSign, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

interface StakingStats {
  totalStaked: number;
  totalUsers: number;
  totalDistributed: number;
  platformRevenue: number;
}

/**
 * $bWriter Staking Dashboard
 *
 * Main page for the $bWriter token staking system.
 * Displays:
 * - Hero section explaining staking
 * - User dashboard (authenticated users)
 * - Global stats
 * - How it works guide
 */
export default function BwriterDashboard() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState<StakingStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Load global staking stats
  useEffect(() => {
    async function loadStats() {
      try {
        // TODO: Create /api/bwriter/stats endpoint
        // For now, use placeholder values
        setStats({
          totalStaked: 45000000,
          totalUsers: 1250,
          totalDistributed: 2500000,
          platformRevenue: 12500000,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    }

    loadStats();
  }, []);

  return (
    <motion.div
      className="min-h-screen text-white font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <motion.div
        className="px-4 md:px-8 py-12 md:py-20 border-b border-zinc-900"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-white text-black text-xs uppercase font-bold tracking-wider rounded">
              $bWriter Staking
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Earn Dividends from Platform Revenue
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-3xl">
            Stake your $bWriter tokens to become a shareholder in the Bitcoin Writer ecosystem.
            Earn a proportional share of platform revenue as BSV dividends.
          </p>

          <div className="flex flex-wrap gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="#staking"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  Start Staking
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                >
                  Learn More
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-zinc-200 transition-colors"
                >
                  Sign In to Stake
                  <FiArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white text-white font-bold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors"
                >
                  How It Works
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="px-4 md:px-8 py-12 md:py-16 border-b border-zinc-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-12 tracking-tight">
            Ecosystem Stats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Total Staked */}
            <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-900 rounded">
                  <FiDollarSign className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs uppercase text-zinc-500 tracking-wider">
                  Total Staked
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold">
                {stats?.totalStaked ? (stats.totalStaked / 1000000).toFixed(1) : '-'}M
              </div>
              <p className="text-xs text-zinc-600 mt-2">$bWriter tokens</p>
            </div>

            {/* Total Users */}
            <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-900 rounded">
                  <FiUsers className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs uppercase text-zinc-500 tracking-wider">
                  Shareholders
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold">
                {stats?.totalUsers ? stats.totalUsers.toLocaleString() : '-'}
              </div>
              <p className="text-xs text-zinc-600 mt-2">Active stakers</p>
            </div>

            {/* Dividends Distributed */}
            <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-900 rounded">
                  <FiTrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs uppercase text-zinc-500 tracking-wider">
                  Distributed
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold">
                {stats?.totalDistributed ? (stats.totalDistributed / 1000000).toFixed(2) : '-'}M
              </div>
              <p className="text-xs text-zinc-600 mt-2">Satoshis (BSV)</p>
            </div>

            {/* Platform Revenue */}
            <div className="border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-zinc-900 rounded">
                  <FiCheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs uppercase text-zinc-500 tracking-wider">
                  Revenue
                </span>
              </div>
              <div className="text-2xl md:text-3xl font-bold">
                {stats?.platformRevenue ? (stats.platformRevenue / 1000000).toFixed(2) : '-'}M
              </div>
              <p className="text-xs text-zinc-600 mt-2">Satoshis (BSV)</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Dashboard (Authenticated Only) */}
      {isAuthenticated && (
        <motion.div
          className="px-4 md:px-8 py-12 md:py-16 border-b border-zinc-900"
          id="staking"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-12 tracking-tight">
              Your Staking Dashboard
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Column - Forms */}
              <div className="lg:col-span-2 space-y-8">
                <StakingForm />
                <WithdrawalAddressForm />
              </div>

              {/* Sidebar - Status */}
              <div>
                <StakingStatus />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* How It Works Section */}
      <motion.div
        className="px-4 md:px-8 py-12 md:py-16 border-b border-zinc-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-12 tracking-tight">
            How Staking Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="border-l-2 border-zinc-700 pl-6">
              <div className="text-4xl font-bold text-zinc-700 mb-4">01</div>
              <h3 className="text-lg font-bold mb-3">Complete KYC</h3>
              <p className="text-sm text-zinc-400">
                Verify your identity to become eligible for dividend payouts and shareholder benefits.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border-l-2 border-zinc-700 pl-6">
              <div className="text-4xl font-bold text-zinc-700 mb-4">02</div>
              <h3 className="text-lg font-bold mb-3">Set Withdrawal Address</h3>
              <p className="text-sm text-zinc-400">
                Provide your BSV address where dividend payments will be sent automatically.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border-l-2 border-zinc-700 pl-6">
              <div className="text-4xl font-bold text-zinc-700 mb-4">03</div>
              <h3 className="text-lg font-bold mb-3">Stake Tokens</h3>
              <p className="text-sm text-zinc-400">
                Request a stake and send tokens to the multisig address. Confirmed within 24 hours.
              </p>
            </div>

            {/* Step 4 */}
            <div className="border-l-2 border-zinc-700 pl-6">
              <div className="text-4xl font-bold text-zinc-700 mb-4">04</div>
              <h3 className="text-lg font-bold mb-3">Earn Dividends</h3>
              <p className="text-sm text-zinc-400">
                Receive your proportional share of platform revenue distributed daily in BSV.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Economics Section */}
      <motion.div
        className="px-4 md:px-8 py-12 md:py-16 border-b border-zinc-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-8 tracking-tight">
            Dividend Economics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-zinc-800 rounded-lg p-8">
              <h3 className="text-lg font-bold mb-4">Revenue Split</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-3">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full" />
                  <span>
                    <strong className="text-white">75%</strong> → Dividend Pool (distributed to stakers)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-3 h-3 bg-zinc-600 rounded-full" />
                  <span>
                    <strong className="text-white">25%</strong> → Platform Fee (operating costs)
                  </span>
                </li>
              </ul>
            </div>

            <div className="border border-zinc-800 rounded-lg p-8">
              <h3 className="text-lg font-bold mb-4">Dividend Distribution</h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Calculated daily at midnight UTC</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Based on your ownership percentage</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Sent directly to your BSV address</span>
                </li>
                <li className="flex items-center gap-3">
                  <FiCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>No claiming required - automatic</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        className="px-4 md:px-8 py-12 md:py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold mb-12 tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'What is $bWriter?',
                a: 'A utility token that represents ownership in the Bitcoin Writer ecosystem. Holders can stake tokens to earn dividends from platform revenue.',
              },
              {
                q: 'Do I need KYC to stake?',
                a: 'Yes. Staking requires identity verification for compliance with UK shareholder regulations. This protects both you and the platform.',
              },
              {
                q: 'How long does deposit confirmation take?',
                a: 'Deposits are typically confirmed within 1-3 hours once sent to the multisig address. We monitor the blockchain hourly and activate confirmed stakes automatically.',
              },
              {
                q: 'Can I unstake anytime?',
                a: 'Yes. You can unstake your tokens at any time. Your stake will be removed from the cap table and tokens returned to your balance. Dividends accumulated during your stake period remain yours.',
              },
              {
                q: 'What happens to my dividends if I unstake?',
                a: 'Your accumulated dividends are preserved and can be claimed anytime. You don\'t lose them by unstaking - they just stop accumulating after you remove your stake.',
              },
              {
                q: 'How is my ownership percentage calculated?',
                a: 'Your percentage = your staked tokens / total staked tokens. This is recalculated daily and used to determine your dividend share.',
              },
            ].map((item, index) => (
              <div key={index} className="border-l-2 border-zinc-800 pl-6 py-4">
                <h3 className="font-bold text-white mb-2">{item.q}</h3>
                <p className="text-sm text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Footer CTA */}
      <motion.div
        className="px-4 md:px-8 py-12 md:py-16 border-t border-zinc-900 bg-zinc-950"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Stake?</h2>
          <p className="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
            Join {stats?.totalUsers ? stats.totalUsers.toLocaleString() : '1000+'} shareholders earning dividends
          </p>
          <Link
            href={isAuthenticated ? '#staking' : '/login'}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold text-sm uppercase tracking-wider hover:bg-zinc-200 transition-colors"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Sign In to Get Started'}
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
