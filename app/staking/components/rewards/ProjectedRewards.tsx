'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Spinner } from '@/components/ui/Progress';

interface ProjectedReward {
  amount: string;
  symbol: string;
  decimals: number;
  displayAmount: string;
}

interface LatestSnapshot {
  primaryTokenAmount: string;
  eligibilityTokenAmount: string;
  eligible: boolean;
  timestamp: string;
}

interface WalletRewardsData {
  wallet: string;
  currentWindow: string;
  isEligible: boolean;
  isIgnored: boolean;
  weight: string;
  weightPercentage: string;
  rank: number;
  totalHolders: number;
  projectedReward: ProjectedReward;
  latestSnapshot: LatestSnapshot;
  ineligible?: boolean;
  message?: string;
}

// Minimum requirements for eligibility display
const MIN_INDIESOL = 1;
const MIN_COMPOUND_ORE = 0.95;

export function ProjectedRewards() {
  const { publicKey, connected } = useWallet();
  const [data, setData] = useState<WalletRewardsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!publicKey || !connected) {
        setData(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const rewardsRes = await fetch(`/api/rewards/${publicKey.toString()}`);

        if (!rewardsRes.ok) {
          throw new Error('Failed to fetch rewards data');
        }

        const rewardsData = await rewardsRes.json();
        setData(rewardsData);
      } catch (e) {
        console.error('Error fetching projected rewards:', e);
        setError(e instanceof Error ? e.message : 'Failed to load rewards');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [publicKey, connected]);

  if (!connected) {
    return (
      <div className="div-block text-center py-6">
        <p className="caption uppercase opacity-70">Connect wallet to see your projected rewards</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="div-block flex justify-center py-6">
        <Spinner size={24} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="div-block text-center py-6">
        <p className="caption uppercase text-red-500">{error}</p>
      </div>
    );
  }

  if (data?.ineligible || data?.isIgnored) {
    return (
      <div className="div-block text-center py-6">
        <p className="caption uppercase opacity-70">{data.message || 'Your wallet is flagged as ineligible for rewards'}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="div-block text-center py-6">
        <p className="caption uppercase opacity-70">No rewards data available</p>
      </div>
    );
  }

  // Parse balances from snapshot (9 decimals for indieSOL, 11 decimals for compoundORE)
  const indiesolBalance = data.latestSnapshot
    ? Number(data.latestSnapshot.primaryTokenAmount) / 1e9
    : 0;
  const compoundOreBalance = data.latestSnapshot
    ? Number(data.latestSnapshot.eligibilityTokenAmount) / 1e11
    : 0;

  const hasEnoughIndiesol = indiesolBalance >= MIN_INDIESOL;
  const hasEnoughCompoundOre = compoundOreBalance >= MIN_COMPOUND_ORE;
  const isEligible = data.isEligible;

  return (
    <div className="space-y-4">
      {/* Eligibility Section */}
      <div className={`div-block ${isEligible ? 'border-green' : ''}`}>
        <span className="caption uppercase opacity-70 block mb-3">Eligibility Requirements</span>

        {/* Requirement 1: Hold indieSOL */}
        <div className={`flex items-center gap-3 p-3 rounded border ${hasEnoughIndiesol ? 'border-green bg-green/10' : 'border-current opacity-70'}`}>
          <span className={`text-lg ${hasEnoughIndiesol ? 'text-green' : 'opacity-50'}`}>
            {hasEnoughIndiesol ? '✓' : '✗'}
          </span>
          <div className="flex-1">
            <span className="caption uppercase block">Hold indieSOL</span>
            <span className="caption uppercase opacity-50">
              {indiesolBalance.toFixed(4)} / {MIN_INDIESOL} required
            </span>
          </div>
        </div>

        {/* Requirement 2: Deposit compoundORE */}
        <div className={`flex items-center gap-3 p-3 rounded border mt-2 ${hasEnoughCompoundOre ? 'border-green bg-green/10' : 'border-current opacity-70'}`}>
          <span className={`text-lg ${hasEnoughCompoundOre ? 'text-green' : 'opacity-50'}`}>
            {hasEnoughCompoundOre ? '✓' : '✗'}
          </span>
          <div className="flex-1">
            <span className="caption uppercase block">Deposit ORE to CompoundORE</span>
            <span className="caption uppercase opacity-50">
              {compoundOreBalance.toFixed(4)} / {MIN_COMPOUND_ORE} required
            </span>
          </div>
        </div>

        {/* Overall Status */}
        <div className={`mt-3 p-3 rounded text-center ${isEligible ? 'bg-green/20 border border-green' : 'bg-current/10 border border-current opacity-70'}`}>
          <span className="caption uppercase font-bold">
            {isEligible ? '✓ Eligible for ORE Rewards' : 'Not Yet Eligible'}
          </span>
        </div>
      </div>

      {/* Main Reward Display */}
      <div className="div-block text-center py-4">
        <span className="caption uppercase opacity-70 block mb-2">Your Projected Weekly Reward</span>
        <div className="text-green text-3xl md:text-4xl font-bold flex justify-center">
          {data.projectedReward?.displayAmount || '0.000000000'} ORE
        </div>
        <span className="caption uppercase opacity-50 mt-2 block">
          Window: {data.currentWindow}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="div-block text-center py-3">
          <span className="caption uppercase opacity-70 block mb-1">Rank</span>
          <span className="font-bold text-lg">#{data.rank}</span>
          <span className="caption uppercase opacity-50 block">of {data.totalHolders}</span>
        </div>
        <div className="div-block text-center py-3">
          <span className="caption uppercase opacity-70 block mb-1">Weight Share</span>
          <span className="font-bold text-lg">{data.weightPercentage}%</span>
        </div>
      </div>

      {/* Info Note */}
      <p className="caption uppercase text-center opacity-70 text-xs mix-blend-difference text-white">
        Projections based on current snapshot. Actual rewards may vary based on final window weights.
      </p>
    </div>
  );
}
