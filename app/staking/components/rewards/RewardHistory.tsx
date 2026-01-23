'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Spinner } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';

const ITEMS_PER_PAGE = 5;

interface HistoryEntry {
  epoch: string;
  window_id?: string;
  distributed_at: string;
  amount: string;
  symbol: string;
  tx_signature?: string;
}

interface HistoryData {
  wallet: string;
  history: HistoryEntry[];
  total_received: string;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function shortenSignature(sig: string): string {
  if (sig.length <= 16) return sig;
  return `${sig.slice(0, 8)}...${sig.slice(-8)}`;
}

export function RewardHistory() {
  const { publicKey, connected } = useWallet();
  const [data, setData] = useState<HistoryData | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!publicKey || !connected) {
        setData(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const historyRes = await fetch(`/api/rewards/${publicKey.toString()}/history`);

        if (!historyRes.ok) {
          throw new Error('Failed to fetch reward history');
        }

        const historyData = await historyRes.json();
        setData(historyData);
      } catch (e) {
        console.error('Error fetching reward history:', e);
        setError(e instanceof Error ? e.message : 'Failed to load history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [publicKey, connected]);

  if (!connected) {
    return (
      <div className="div-block text-center py-6">
        <p className="caption uppercase opacity-70">Connect wallet to see your reward history</p>
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

  if (!data || data.history.length === 0) {
    return (
      <div className="div-block text-center py-6">
        <p className="caption uppercase opacity-70">No reward history yet</p>
        <p className="caption uppercase opacity-50 mt-2">
          ORE rewards are distributed weekly
        </p>
      </div>
    );
  }

  const totalReceived = parseFloat(data.total_received) || 0;
  const totalPages = Math.ceil(data.history.length / ITEMS_PER_PAGE);
  const paginatedHistory = data.history.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-3">
      {/* Total Received */}
      <div className="div-block text-center py-3">
        <span className="caption uppercase opacity-70 block mb-1">Total ORE Received</span>
        <span className="heading-style-h3 text-green text-2xl">{totalReceived.toFixed(6)} ORE</span>
      </div>

      {/* History Table */}
      <div className="div-block overflow-hidden p-0">
        <table className="w-full">
          <thead>
            <tr className="border-b border-current/30">
              <th className="caption uppercase text-left py-3 px-4">Date</th>
              <th className="caption uppercase text-right py-3 px-4">Amount</th>
              <th className="caption uppercase text-right py-3 px-4">TX</th>
            </tr>
          </thead>
          <tbody>
            {paginatedHistory.map((entry, index) => {
              const amount = parseFloat(entry.amount) || 0;
              const symbol = entry.symbol || 'ORE';

              return (
                <tr
                  key={`${entry.epoch || entry.window_id}-${index}`}
                  className="border-b border-current/10"
                >
                  <td className="py-3 px-4">
                    <span className="block">{formatDate(entry.distributed_at)}</span>
                    <span className="caption uppercase opacity-50">
                      {entry.window_id ? `Window ${entry.window_id}` : `Epoch ${entry.epoch}`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right tabular-nums text-green">
                    +{amount.toFixed(6)} {symbol}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {entry.tx_signature ? (
                      <a
                        href={`https://solscan.io/tx/${entry.tx_signature}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="caption uppercase underline hover:text-green transition-colors"
                      >
                        {shortenSignature(entry.tx_signature)}
                      </a>
                    ) : (
                      <span className="caption uppercase opacity-50">-</span>
                    )}
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
    </div>
  );
}
