'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, VersionedTransaction } from '@solana/web3.js';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { SOL_MINT, INDIESOL_MINT } from '@/lib/constants';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

type TransactionStatus = 'idle' | 'fetching' | 'signing' | 'pending' | 'success' | 'error';

export function SwapTab() {
  const { publicKey, signTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { addToast } = useToast();

  const [amount, setAmount] = useState('');
  const [solBalance, setSolBalance] = useState(0);
  const [indiesolBalance, setIndiesolBalance] = useState(0);
  const [quoteAmount, setQuoteAmount] = useState('0.000000');
  const [txStatus, setTxStatus] = useState<TransactionStatus>('idle');
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);
  const [quoteData, setQuoteData] = useState<{ transaction: string } | null>(null);

  // Fetch balances
  const fetchBalances = useCallback(async () => {
    if (!publicKey || !connection) return;

    setIsLoadingBalances(true);
    try {
      // Fetch SOL balance
      const solBal = await connection.getBalance(publicKey);
      setSolBalance(solBal / LAMPORTS_PER_SOL);

      // Fetch indieSOL balance
      try {
        const indiesolMint = new PublicKey(INDIESOL_MINT);
        const ata = await getAssociatedTokenAddress(indiesolMint, publicKey);
        const tokenAccount = await getAccount(connection, ata);
        setIndiesolBalance(Number(tokenAccount.amount) / LAMPORTS_PER_SOL);
      } catch {
        setIndiesolBalance(0);
      }
    } catch (e) {
      console.error('Error fetching balances:', e);
    } finally {
      setIsLoadingBalances(false);
    }
  }, [publicKey, connection]);

  // Fetch balances on mount and when wallet changes
  useEffect(() => {
    if (connected) {
      fetchBalances();
    } else {
      setSolBalance(0);
      setIndiesolBalance(0);
    }
  }, [connected, fetchBalances]);

  // Fetch quote when amount changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!amount || parseFloat(amount) <= 0 || !publicKey) {
        setQuoteAmount('0.000000');
        setQuoteData(null);
        return;
      }

      setTxStatus('fetching');
      try {
        const amountLamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
        const response = await fetch(
          `/api/jupiter/quote?inputMint=${SOL_MINT}&outputMint=${INDIESOL_MINT}&amount=${amountLamports}&taker=${publicKey.toString()}`
        );

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch quote');
        }

        const data = await response.json();
        const outAmount = Number(data.outAmount) / LAMPORTS_PER_SOL;
        setQuoteAmount(outAmount.toFixed(6));
        setQuoteData(data);
        setTxStatus('idle');
      } catch (e) {
        console.error('Error fetching quote:', e);
        setQuoteAmount('0.000000');
        setQuoteData(null);
        setTxStatus('idle');
      }
    };

    // Debounce the quote fetch
    const timeoutId = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [amount, publicKey]);

  // Handle swap
  const handleSwap = async () => {
    if (!publicKey || !connection || !quoteData || !signTransaction) return;

    setTxStatus('signing');

    try {
      // Decode the versioned transaction
      const transactionBuffer = Buffer.from(quoteData.transaction, 'base64');
      const transaction = VersionedTransaction.deserialize(transactionBuffer);

      // Sign the transaction
      const signedTransaction = await signTransaction(transaction);

      setTxStatus('pending');

      // Send the signed transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });

      // Confirm transaction
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      setTxStatus('success');
      addToast({
        variant: 'success',
        title: 'Swap Successful',
        description: `Successfully swapped ${amount} SOL for ${quoteAmount} INDIESOL`,
      });

      // Refresh balances
      setTimeout(fetchBalances, 2000);
      setAmount('');
      setQuoteData(null);
    } catch (e) {
      console.error('Swap error:', e);
      setTxStatus('error');
      addToast({
        variant: 'error',
        title: 'Swap Failed',
        description: e instanceof Error ? e.message : 'Failed to swap SOL',
      });
    }
  };

  // Get button text
  const getButtonText = () => {
    if (!connected) return 'CONNECT WALLET ABOVE';
    if (txStatus === 'fetching') return 'FETCHING QUOTE...';
    if (txStatus === 'signing') return 'APPROVE IN WALLET';
    if (txStatus === 'pending') return 'CONFIRMING...';
    if (txStatus === 'success') return 'SWAP MORE';
    if (txStatus === 'error') return 'RETRY';
    if (!quoteData && amount) return 'ENTER AMOUNT';
    return 'SWAP';
  };

  const isButtonLoading =
    txStatus === 'fetching' || txStatus === 'signing' || txStatus === 'pending';
  const isButtonDisabled =
    !connected ||
    txStatus === 'fetching' ||
    txStatus === 'signing' ||
    txStatus === 'pending' ||
    (connected && !quoteData && txStatus === 'idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (txStatus === 'success') {
      setTxStatus('idle');
      return;
    }
    handleSwap();
  };

  return (
    <div className="stake_form w-form">
      <form id="swap-form" name="swap-form" className="form" onSubmit={handleSubmit}>
        <Label htmlFor="swap-amount" className="caption uppercase mb-2 block mix-blend-difference text-white">
          Swap SOL for INDIESOL
        </Label>

        {/* You Swap Section */}
        <div className="div-block mb-6">
          <div className="flex flex-row items-start justify-between gap-x-2 gap-y-2">
            <Label htmlFor="swap-amount" className="caption uppercase">
              You Swap
            </Label>
            <div className="flex items-center gap-2">
              <span className="caption uppercase">
                Balance: {isLoadingBalances ? '...' : solBalance.toFixed(4)} SOL
              </span>
            </div>
          </div>
          <div className="position-relative h-10">
            <Input
              id="swap-amount"
              name="Amount"
              type="number"
              step="0.000001"
              min="0"
              placeholder="0.00 SOL"
              autoComplete="off"
              variant="dark"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={txStatus === 'signing' || txStatus === 'pending'}
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex justify-center items-center gap-3 h-full pl-3 pr-3">
              <Button
                type="button"
                variant="text"
                onClick={() => setAmount((solBalance / 2).toFixed(6))}
                disabled={!connected || solBalance === 0 || txStatus !== 'idle'}
                style={{ justifyContent: 'center', color: 'white' }}
              >
                HALF
              </Button>
              <Button
                type="button"
                variant="text"
                onClick={() => setAmount((solBalance - 0.01).toFixed(6))}
                disabled={!connected || solBalance === 0 || txStatus !== 'idle'}
                style={{ justifyContent: 'center', color: 'white' }}
              >
                MAX
              </Button>
            </div>
          </div>
        </div>

        {/* You Receive Section */}
        <div className="div-block mb-6">
          <div className="flex flex-row items-start justify-between gap-x-2 gap-y-2">
            <span className="caption uppercase">You Receive</span>
            <span className="caption uppercase">
              Balance: {isLoadingBalances ? '...' : indiesolBalance.toFixed(4)} INDIESOL
            </span>
          </div>
          <div className="received-field">
            {txStatus === 'fetching' ? (
              <span className="flex items-center gap-2">
                <Spinner size={14} /> Fetching...
              </span>
            ) : (
              `${quoteAmount} INDIESOL`
            )}
          </div>
          {/* Exchange Rate */}
          {amount && parseFloat(amount) > 0 && parseFloat(quoteAmount) > 0 && (
            <div className="text-center mt-2">
              <span className="caption uppercase opacity-50">
                1 SOL = {(parseFloat(quoteAmount) / parseFloat(amount)).toFixed(6)} INDIESOL
              </span>
            </div>
          )}
        </div>

        {/* Info Text */}
        <p className="caption uppercase text-center mb-4 opacity-70 mix-blend-difference text-white">
          Swap via Jupiter aggregator. Best available rate.
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={isButtonDisabled}
          style={{ justifyContent: 'center' }}
        >
          {isButtonLoading ? (
            <span className="flex items-center gap-2">
              <Spinner size={16} />
              {getButtonText()}
            </span>
          ) : (
            getButtonText()
          )}
        </Button>
      </form>
    </div>
  );
}
