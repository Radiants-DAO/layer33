'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Spinner } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';

interface WindowPayoutEntry {
  rank: number;
  wallet: string;
  walletFull: string;
  payoutAmount: string;
  displayAmount: string;
  sharePercentage: string;
}

interface WindowData {
  windowId: string;
  rewardId: string;
  distributedAt: string;
  totalPool: {
    amount: string;
    symbol: string;
    displayAmount: string;
  };
  totalRecipients: number;
  recipients: WindowPayoutEntry[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface AvailableWindow {
  windowId: string;
  rewardId: string;
  distributedAt: string;
  totalAmount: string;
  displayAmount: string;
  recipientCount: number;
}

interface TotalRewardsData {
  wallet: string;
  totalAmount: string;
  displayAmount: string;
  symbol: string;
  windowCount: number;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatWindowId(windowId: string): string {
  // Convert 2026-W03 to "Week 3"
  const match = windowId.match(/W(\d+)$/);
  if (match) {
    return `Week ${parseInt(match[1], 10)}`;
  }
  return windowId;
}

export function RewardHistory() {
  const { publicKey, connected } = useWallet();
  const [windows, setWindows] = useState<AvailableWindow[]>([]);
  const [selectedWindowId, setSelectedWindowId] = useState<string | null>(null);
  const [windowData, setWindowData] = useState<WindowData | null>(null);
  const [totalRewards, setTotalRewards] = useState<TotalRewardsData | null>(null);
  const [page, setPage] = useState(1);
  const [isLoadingWindows, setIsLoadingWindows] = useState(true);
  const [isLoadingWindow, setIsLoadingWindow] = useState(false);
  const [isLoadingTotal, setIsLoadingTotal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch available windows
  useEffect(() => {
    const fetchWindows = async () => {
      setIsLoadingWindows(true);
      setError(null);

      try {
        const res = await fetch('/api/rewards/windows?limit=5');
        if (!res.ok) throw new Error('Failed to fetch windows');

        const data = await res.json();
        setWindows(data.windows || []);

        // Auto-select first window
        if (data.windows?.length > 0 && !selectedWindowId) {
          setSelectedWindowId(data.windows[0].windowId);
        }
      } catch (e) {
        console.error('Error fetching windows:', e);
        setError('Failed to load reward windows');
      } finally {
        setIsLoadingWindows(false);
      }
    };

    fetchWindows();
  }, []);

  // Fetch total rewards for connected wallet
  useEffect(() => {
    const fetchTotal = async () => {
      if (!publicKey || !connected) {
        setTotalRewards(null);
        return;
      }

      setIsLoadingTotal(true);

      try {
        const res = await fetch(`/api/rewards/total/${publicKey.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch total');

        const data = await res.json();
        setTotalRewards(data);
      } catch (e) {
        console.error('Error fetching total rewards:', e);
      } finally {
        setIsLoadingTotal(false);
      }
    };

    fetchTotal();
  }, [publicKey, connected]);

  // Fetch window data when selection changes
  useEffect(() => {
    const fetchWindowData = async () => {
      if (!selectedWindowId) return;

      setIsLoadingWindow(true);
      setPage(1);

      try {
        const res = await fetch(
          `/api/rewards/window/${selectedWindowId}?page=1&limit=${ITEMS_PER_PAGE}`
        );
        if (!res.ok) throw new Error('Failed to fetch window data');

        const data = await res.json();
        setWindowData(data);
      } catch (e) {
        console.error('Error fetching window data:', e);
        setError('Failed to load window data');
      } finally {
        setIsLoadingWindow(false);
      }
    };

    fetchWindowData();
  }, [selectedWindowId]);

  // Fetch page data
  const fetchPage = async (newPage: number) => {
    if (!selectedWindowId) return;

    setIsLoadingWindow(true);

    try {
      const res = await fetch(
        `/api/rewards/window/${selectedWindowId}?page=${newPage}&limit=${ITEMS_PER_PAGE}`
      );
      if (!res.ok) throw new Error('Failed to fetch page');

      const data = await res.json();
      setWindowData(data);
      setPage(newPage);
    } catch (e) {
      console.error('Error fetching page:', e);
    } finally {
      setIsLoadingWindow(false);
    }
  };

  // Sort recipients to put connected wallet first
  const sortedRecipients = useMemo(() => {
    if (!windowData?.recipients) return [];
    if (!publicKey) return windowData.recipients;

    const walletAddress = publicKey.toString();
    const userEntry = windowData.recipients.find(r => r.walletFull === walletAddress);

    if (!userEntry) return windowData.recipients;

    // Put user at top, keep others in original order
    return [
      userEntry,
      ...windowData.recipients.filter(r => r.walletFull !== walletAddress),
    ];
  }, [windowData?.recipients, publicKey]);

  if (isLoadingWindows) {
    return (
      <div className="div-block flex justify-center py-6">
        <Spinner size={24} />
      </div>
    );
  }

  if (error && windows.length === 0) {
    return (
      <div className="div-block text-center py-6">
        <p className="caption uppercase text-red-500">{error}</p>
      </div>
    );
  }

  if (windows.length === 0) {
    return (
      <div className="div-block text-center py-6">
        <p className="caption uppercase opacity-70">No reward distributions yet</p>
        <p className="caption uppercase opacity-50 mt-2">
          ORE rewards are distributed weekly
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Total Rewards Received */}
      {connected && (
        <div className="div-block text-center py-4">
          <span className="caption uppercase opacity-70 block mb-1">
            Total ORE Received
          </span>
          {isLoadingTotal ? (
            <Spinner size={20} />
          ) : totalRewards ? (
            <>
              <span className="heading-style-h3 text-green text-2xl">
                {parseFloat(totalRewards.displayAmount).toFixed(6)} {totalRewards.symbol}
              </span>
              <span className="caption uppercase opacity-50 block mt-1">
                across {totalRewards.windowCount} {totalRewards.windowCount === 1 ? 'window' : 'windows'}
              </span>
            </>
          ) : (
            <span className="caption uppercase opacity-50">No rewards yet</span>
          )}
        </div>
      )}

      {/* Window Selector Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {windows.map((w) => (
          <button
            key={w.windowId}
            onClick={() => setSelectedWindowId(w.windowId)}
            className={`px-4 py-2 text-sm uppercase font-bold transition-all ${
              selectedWindowId === w.windowId
                ? 'bg-white text-black'
                : 'bg-transparent border border-current opacity-70 hover:opacity-100 mix-blend-difference text-white'
            }`}
          >
            {formatWindowId(w.windowId)}
          </button>
        ))}
      </div>

      {/* Selected Window Info */}
      {selectedWindowId && (
        <div className="div-block text-center py-2">
          <span className="caption uppercase opacity-50">
            {windows.find(w => w.windowId === selectedWindowId)?.windowId} •
            Distributed {formatDate(windows.find(w => w.windowId === selectedWindowId)?.distributedAt || '')}
          </span>
        </div>
      )}

      {/* Window Leaderboard */}
      {isLoadingWindow ? (
        <div className="div-block flex justify-center py-6">
          <Spinner size={24} />
        </div>
      ) : windowData ? (
        <>
          {/* Pool Total */}
          <div className="div-block text-center py-2">
            <span className="caption uppercase opacity-70">Total Pool: </span>
            <span className="text-green font-bold">
              {parseFloat(windowData.totalPool.displayAmount).toFixed(6)} {windowData.totalPool.symbol}
            </span>
            <span className="caption uppercase opacity-50 ml-2">
              ({windowData.totalRecipients} recipients)
            </span>
          </div>

          {/* Recipients Table */}
          <div className="div-block overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-current/30">
                  <th className="caption uppercase text-left py-3 px-4 w-12">#</th>
                  <th className="caption uppercase text-left py-3 px-4">Wallet</th>
                  <th className="caption uppercase text-right py-3 px-4">Share</th>
                  <th className="caption uppercase text-right py-3 px-4">Reward</th>
                </tr>
              </thead>
              <tbody>
                {sortedRecipients.map((entry, index) => {
                  const isCurrentUser = publicKey && entry.walletFull === publicKey.toString();
                  const displayRank = isCurrentUser && index === 0 ? entry.rank : entry.rank;

                  return (
                    <tr
                      key={entry.walletFull}
                      className={`border-b border-current/10 ${
                        isCurrentUser ? 'bg-green/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className={isCurrentUser ? 'text-green font-bold' : ''}>
                          {entry.rank <= 3 ? (
                            <span className="text-lg">
                              {entry.rank === 1 ? '👑' : entry.rank === 2 ? '🥈' : '🥉'}
                            </span>
                          ) : (
                            displayRank
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono ${isCurrentUser ? 'text-green font-bold' : ''}`}>
                          {isCurrentUser ? 'You' : entry.wallet}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums">
                        {entry.sharePercentage}%
                      </td>
                      <td className={`py-3 px-4 text-right tabular-nums ${isCurrentUser ? 'text-green font-bold' : 'text-green'}`}>
                        {parseFloat(entry.displayAmount).toFixed(6)} ORE
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {windowData.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => fetchPage(page - 1)}
                disabled={page === 1 || isLoadingWindow}
              >
                Prev
              </Button>
              <span className="caption uppercase opacity-70 mix-blend-difference text-white">
                Page {page} of {windowData.pagination.totalPages}
              </span>
              <Button
                type="button"
                variant="secondary"
                onClick={() => fetchPage(page + 1)}
                disabled={page === windowData.pagination.totalPages || isLoadingWindow}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
