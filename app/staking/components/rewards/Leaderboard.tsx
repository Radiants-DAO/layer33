'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Spinner } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';

const ITEMS_PER_PAGE = 10;

interface ProjectedReward {
  amount: string;
  symbol: string;
  displayAmount: string;
}

interface LeaderboardEntry {
  rank: number;
  wallet: string;
  walletFull: string;
  weight: string;
  weightPercentage: string;
  projectedReward: ProjectedReward;
}

interface LeaderboardData {
  currentWindow: string;
  totalParticipants: number;
  entries: LeaderboardEntry[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

function shortenAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function Leaderboard() {
  const { publicKey } = useWallet();
  const [data, setData] = useState<LeaderboardData | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedWallet, setExpandedWallet] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/leaderboard?page=${page}&limit=${ITEMS_PER_PAGE}`);
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const result = await response.json();
        setData(result);
      } catch (e) {
        console.error('Error fetching leaderboard:', e);
        setError(e instanceof Error ? e.message : 'Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [page]);

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

  if (!data || data.entries.length === 0) {
    return (
      <div className="div-block text-center py-6">
        <p className="caption uppercase opacity-70">No leaderboard data available</p>
      </div>
    );
  }

  const userWallet = publicKey?.toString();
  const totalPages = data.pagination?.totalPages || 1;

  // Rank icons for top 3
  const getRankDisplay = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex justify-between items-center mb-2 mix-blend-difference">
        <span className="caption uppercase text-white opacity-70">Top Stakers - {data.currentWindow}</span>
        <span className="caption uppercase text-white opacity-50">{data.totalParticipants} participants</span>
      </div>

      {/* Leaderboard Table */}
      <div className="div-block overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-current/30">
              <th className="caption uppercase text-left py-3 px-4">#</th>
              <th className="caption uppercase text-left py-3 px-4">Wallet</th>
              <th className="caption uppercase text-right py-3 px-4">Share</th>
              <th className="caption uppercase text-right py-3 px-4">Est. ORE</th>
            </tr>
          </thead>
          <tbody>
            {data.entries.map((entry) => {
              const isCurrentUser = userWallet === entry.walletFull;
              const isExpanded = expandedWallet === entry.walletFull;

              return (
                <tr
                  key={entry.walletFull}
                  className={`border-b border-current/10 ${
                    isCurrentUser ? 'bg-green/20' : ''
                  }`}
                >
                  <td className="py-3 px-4 font-bold">
                    {getRankDisplay(entry.rank)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => setExpandedWallet(isExpanded ? null : entry.walletFull)}
                      className={`text-left hover:opacity-70 transition-opacity ${isCurrentUser ? 'text-green font-bold' : ''}`}
                    >
                      {isExpanded ? entry.walletFull : shortenAddress(entry.walletFull)}
                      {isCurrentUser && !isExpanded && ' (You)'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums">
                    {entry.weightPercentage}%
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-green">
                    {entry.projectedReward.displayAmount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>
          <span className="caption uppercase opacity-70 mix-blend-difference text-white">
            Page {page} of {totalPages}
          </span>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Info Footer */}
      <p className="caption uppercase text-center opacity-50 text-xs mix-blend-difference text-white">
        Estimated weekly ORE rewards based on current snapshot weights
      </p>
    </div>
  );
}
