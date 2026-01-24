'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { getStakePoolAccount, depositSol } from '@solana/spl-stake-pool';
import { Input, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Progress';
import { useToast } from '@/components/ui/Toast';
import { INDIE_SOL_POOL, INDIESOL_MINT, COMPUTE_UNIT_PRICE } from '@/lib/constants';
import { ComputeBudgetProgram, Transaction } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

type TransactionStatus = 'idle' | 'signing' | 'pending' | 'success' | 'error';

export function DirectStakeTab() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();
  const { addToast } = useToast();

  const [amount, setAmount] = useState('');
  const [solBalance, setSolBalance] = useState(0);
  const [indiesolBalance, setIndiesolBalance] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(1);
  const [txStatus, setTxStatus] = useState<TransactionStatus>('idle');
  const [isLoadingBalances, setIsLoadingBalances] = useState(false);

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
        // Token account doesn't exist yet
        setIndiesolBalance(0);
      }

      // Fetch exchange rate from stake pool
      try {
        const poolPubkey = new PublicKey(INDIE_SOL_POOL);
        const stakePool = await getStakePoolAccount(connection, poolPubkey);
        const totalLamports = Number(stakePool.account.data.totalLamports);
        const poolTokenSupply = Number(stakePool.account.data.poolTokenSupply);
        if (poolTokenSupply > 0) {
          setExchangeRate(poolTokenSupply / totalLamports);
        }
      } catch (e) {
        console.error('Error fetching exchange rate:', e);
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

  // Calculate indieSOL amount
  const indiesolAmount = amount
    ? (parseFloat(amount) * exchangeRate).toFixed(6)
    : '0.000000';

  // Handle stake
  const handleStake = async () => {
    if (!publicKey || !connection || !amount) return;

    const amountLamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);
    if (amountLamports <= 0) {
      addToast({
        variant: 'error',
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to stake.',
      });
      return;
    }

    if (amountLamports > solBalance * LAMPORTS_PER_SOL) {
      addToast({
        variant: 'error',
        title: 'Insufficient Balance',
        description: 'You do not have enough SOL to stake this amount.',
      });
      return;
    }

    setTxStatus('signing');

    try {
      const poolPubkey = new PublicKey(INDIE_SOL_POOL);

      // Get deposit instructions
      const { instructions, signers } = await depositSol(
        connection,
        poolPubkey,
        publicKey,
        amountLamports
      );

      // Create transaction with compute budget
      const transaction = new Transaction();
      transaction.add(
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: COMPUTE_UNIT_PRICE,
        })
      );
      transaction.add(...instructions);

      // Get recent blockhash
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign with stake pool signers
      if (signers.length > 0) {
        transaction.partialSign(...signers);
      }

      setTxStatus('pending');

      // Send transaction
      const signature = await sendTransaction(transaction, connection);

      // Confirm transaction
      await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight,
      });

      setTxStatus('success');
      addToast({
        variant: 'success',
        title: 'Stake Successful',
        description: `Successfully staked ${amount} SOL for ${indiesolAmount} INDIESOL`,
      });

      // Refresh balances
      setTimeout(fetchBalances, 2000);
      setAmount('');
    } catch (e) {
      console.error('Stake error:', e);
      setTxStatus('error');
      addToast({
        variant: 'error',
        title: 'Stake Failed',
        description: e instanceof Error ? e.message : 'Failed to stake SOL',
      });
    }
  };

  // Get button text
  const getButtonText = () => {
    if (!connected) return 'CONNECT WALLET ABOVE';
    if (txStatus === 'signing') return 'APPROVE IN WALLET';
    if (txStatus === 'pending') return 'CONFIRMING...';
    if (txStatus === 'success') return 'STAKE MORE';
    if (txStatus === 'error') return 'RETRY';
    return 'STAKE';
  };

  const isButtonLoading = txStatus === 'signing' || txStatus === 'pending';
  const isButtonDisabled =
    !connected ||
    txStatus === 'signing' ||
    txStatus === 'pending' ||
    (connected && !amount && txStatus === 'idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (txStatus === 'success') {
      setTxStatus('idle');
      return;
    }
    handleStake();
  };

  return (
    <div className="stake_form w-form">
      <form
        id="direct-stake-form"
        name="direct-stake-form"
        className="form"
        onSubmit={handleSubmit}
      >
        <Label htmlFor="direct-stake-amount" className="caption uppercase mb-2 block mix-blend-difference text-white">
          Direct Stake SOL
        </Label>

        {/* You Stake Section */}
        <div className="div-block mb-6">
          <div className="flex flex-row items-start justify-between gap-x-2 gap-y-2">
            <Label htmlFor="direct-stake-amount" className="caption uppercase">
              You Stake
            </Label>
            <div className="flex items-center gap-2">
              <span className="caption uppercase">
                Balance: {isLoadingBalances ? '...' : solBalance.toFixed(4)} SOL
              </span>
            </div>
          </div>
          <div className="position-relative h-10">
            <Input
              id="direct-stake-amount"
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
                onClick={() => setAmount((solBalance - 0.01).toFixed(6))} // Leave some for fees
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
          <div className="received-field">{indiesolAmount} INDIESOL</div>
          {/* Exchange Rate */}
          <div className="text-center mt-2">
            <span className="caption uppercase opacity-50">
              1 SOL = {exchangeRate.toFixed(6)} INDIESOL
            </span>
          </div>
        </div>

        {/* Info Text */}
        <p className="caption uppercase text-center mb-4 opacity-70 mix-blend-difference text-white">
          Stake directly to the Layer33 stake pool. 0.05% fee.
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
