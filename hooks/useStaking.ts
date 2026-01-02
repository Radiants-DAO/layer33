'use client';

import { useState, useCallback } from 'react';
import { useMockState } from '@/devtools/hooks/useMockState';
import { useDevToolsStore } from '@/devtools/store';
import { useToast } from '@/components/ui/Toast';
import type { 
  StakingState, 
  WalletConnectionStatus, 
  TransactionStatus,
  StakingPosition 
} from '@/app/staking/types';

// ============================================================================
// Types
// ============================================================================

export interface UseStakingOptions {
  // Replace these with real Solana wallet adapter calls
  onConnect?: () => Promise<{ address: string; balance: string }>;
  onDisconnect?: () => Promise<void>;
  onStake?: (amount: string) => Promise<{ signature: string }>;
}

interface WalletState {
  isConnected: boolean;
  address: string | null;
  balance: string;
}

// ============================================================================
// Hook
// ============================================================================

export function useStaking(options?: UseStakingOptions) {
  const { addToast } = useToast();
  const walletState = useMockState<WalletState>('wallet');
  const { mockStates, updateMockStateValue } = useDevToolsStore();

  // Find active wallet state for simulation
  const activeWalletState = mockStates.find(
    (s) => s.category === 'wallet' && s.active
  );

  // Local state
  const [amount, setAmount] = useState('');
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('idle');
  const [signature, setSignature] = useState<string | undefined>();
  const [transactionError, setTransactionError] = useState<string | undefined>();

  // Track connecting state locally
  const [isConnecting, setIsConnecting] = useState(false);

  // Derive wallet status from mock state
  const walletStatus: WalletConnectionStatus = isConnecting
    ? 'connecting'
    : walletState?.isConnected 
    ? 'connected' 
    : transactionStatus === 'signing' || transactionStatus === 'pending'
    ? 'connected' // Stay connected during transaction
    : 'disconnected';

  // Exchange rate (1:1 for now)
  const exchangeRate = '1.0';

  // Calculate estimated receive amount
  const estimatedReceive = amount 
    ? (parseFloat(amount) * parseFloat(exchangeRate)).toFixed(2)
    : '0.00';

  // Position (null for now, can be populated from mock state later)
  const position: StakingPosition | null = null;

  // Build state object
  const state: StakingState = {
    wallet: {
      status: walletStatus,
      address: walletState?.address ?? null,
      balance: walletState?.balance ?? '0',
    },
    transaction: {
      status: transactionStatus,
      amount,
      signature,
      error: transactionError,
    },
    position,
    exchangeRate,
  };

  // Connect wallet
  const connect = useCallback(async () => {
    setIsConnecting(true);
    
    if (options?.onConnect) {
      // Real implementation
      try {
        setTransactionStatus('idle');
        const result = await options.onConnect();
        if (activeWalletState) {
          updateMockStateValue(activeWalletState.id, 'isConnected', true);
          updateMockStateValue(activeWalletState.id, 'address', result.address);
          updateMockStateValue(activeWalletState.id, 'balance', result.balance);
        }
        setIsConnecting(false);
        addToast({
          title: 'Wallet Connected',
          description: 'Your wallet has been connected successfully.',
          variant: 'success',
        });
      } catch (error) {
        setIsConnecting(false);
        addToast({
          title: 'Connection Failed',
          description: error instanceof Error ? error.message : 'Failed to connect wallet.',
          variant: 'error',
        });
      }
    } else {
      // Simulation - add delay to show connecting state
      setTimeout(() => {
        if (activeWalletState) {
          // Update existing active wallet state
          updateMockStateValue(activeWalletState.id, 'isConnected', true);
          if (!activeWalletState.values.address) {
            updateMockStateValue(activeWalletState.id, 'address', '0x1234567890abcdef1234567890abcdef12345678');
          }
          if (!activeWalletState.values.balance || activeWalletState.values.balance === '0') {
            updateMockStateValue(activeWalletState.id, 'balance', '1.5');
          }
          setIsConnecting(false);
          addToast({
            title: 'Wallet Connected',
            description: 'Your wallet has been connected successfully.',
            variant: 'success',
          });
        } else {
          // No active wallet mock state - activate wallet-connected preset
          // First, we need to toggle the wallet-connected state from the store
          const { toggleMockState } = useDevToolsStore.getState();
          toggleMockState('wallet-connected');
          setIsConnecting(false);
          addToast({
            title: 'Wallet Connected',
            description: 'Your wallet has been connected successfully. (Mock wallet-connected state activated)',
            variant: 'success',
          });
        }
      }, 1000);
    }
  }, [options, activeWalletState, updateMockStateValue, addToast]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    if (options?.onDisconnect) {
      await options.onDisconnect();
    }
    setIsConnecting(false);
    if (activeWalletState) {
      updateMockStateValue(activeWalletState.id, 'isConnected', false);
    }
    setAmount('');
    setTransactionStatus('idle');
    setSignature(undefined);
    setTransactionError(undefined);
  }, [options, activeWalletState, updateMockStateValue]);

  // Set stake amount
  const handleSetAmount = useCallback((newAmount: string) => {
    setAmount(newAmount);
  }, []);

  // Stake
  const stake = useCallback(async () => {
    // Validation
    if (!amount || parseFloat(amount) <= 0) {
      addToast({
        title: 'Invalid Amount',
        description: 'Please enter a valid stake amount greater than 0.',
        variant: 'error',
      });
      return;
    }

    const balance = parseFloat(walletState?.balance ?? '0');
    if (parseFloat(amount) > balance) {
      addToast({
        title: 'Insufficient Balance',
        description: `You only have ${balance} SOL available.`,
        variant: 'error',
      });
      return;
    }

    if (options?.onStake) {
      // Real implementation
      try {
        setTransactionStatus('signing');
        setTransactionError(undefined);
        
        const result = await options.onStake(amount);
        
        setSignature(result.signature);
        setTransactionStatus('pending');
        
        addToast({
          title: 'Transaction Submitted',
          description: 'Your transaction has been submitted to the network.',
          variant: 'info',
        });

        // In real implementation, wait for confirmation
        // For now, simulate success after delay
        setTimeout(() => {
          setTransactionStatus('success');
          addToast({
            title: 'Stake Successful!',
            description: result.signature 
              ? `Transaction confirmed: ${result.signature.slice(0, 8)}...${result.signature.slice(-8)}`
              : 'Your SOL has been staked successfully.',
            variant: 'success',
          });
          
          // Reset to idle after showing success
          setTimeout(() => {
            setTransactionStatus('idle');
            setAmount('');
            setSignature(undefined);
          }, 2000);
        }, 2000);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Transaction failed';
        setTransactionError(errorMessage);
        setTransactionStatus('error');
        
        if (errorMessage.includes('reject') || errorMessage.includes('cancel')) {
          addToast({
            title: 'Transaction Cancelled',
            description: 'You cancelled the transaction in your wallet.',
            variant: 'warning',
          });
        } else {
          addToast({
            title: 'Transaction Failed',
            description: errorMessage,
            variant: 'error',
          });
        }
        
        // Reset to idle after showing error
        setTimeout(() => {
          setTransactionStatus('idle');
          setTransactionError(undefined);
        }, 3000);
      }
    } else {
      // Simulation
      setTransactionStatus('signing');
      setTransactionError(undefined);
      
      // Simulate wallet approval delay
      setTimeout(() => {
        setTransactionStatus('pending');
        addToast({
          title: 'Transaction Submitted',
          description: 'Your transaction has been submitted to the network.',
          variant: 'info',
        });

        // Simulate confirmation delay
        setTimeout(() => {
          const mockSignature = `sig_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
          setSignature(mockSignature);
          setTransactionStatus('success');
          
          addToast({
            title: 'Stake Successful!',
            description: `Transaction confirmed: ${mockSignature.slice(0, 8)}...${mockSignature.slice(-8)}`,
            variant: 'success',
          });
          
          // Reset to idle after showing success
          setTimeout(() => {
            setTransactionStatus('idle');
            setAmount('');
            setSignature(undefined);
          }, 2000);
        }, 2000);
      }, 1000);
    }
  }, [amount, walletState, options, addToast]);

  // Reset transaction state
  const reset = useCallback(() => {
    setTransactionStatus('idle');
    setAmount('');
    setSignature(undefined);
    setTransactionError(undefined);
  }, []);

  // Simulation helpers
  const simulate = {
    advanceToNextState: useCallback(() => {
      if (transactionStatus === 'idle') {
        setTransactionStatus('signing');
      } else if (transactionStatus === 'signing') {
        setTransactionStatus('pending');
      } else if (transactionStatus === 'pending') {
        setTransactionStatus('success');
        setTimeout(() => setTransactionStatus('idle'), 2000);
      }
    }, [transactionStatus]),
    
    triggerError: useCallback((message: string) => {
      setTransactionError(message);
      setTransactionStatus('error');
      addToast({
        title: 'Transaction Failed',
        description: message,
        variant: 'error',
      });
      setTimeout(() => {
        setTransactionStatus('idle');
        setTransactionError(undefined);
      }, 3000);
    }, [addToast]),
    
    setBalance: useCallback((newBalance: string) => {
      if (activeWalletState) {
        updateMockStateValue(activeWalletState.id, 'balance', newBalance);
      }
    }, [activeWalletState, updateMockStateValue]),
  };

  return {
    state,
    connect,
    disconnect,
    setAmount: handleSetAmount,
    stake,
    reset,
    simulate,
  };
}
