'use client';

import { FC, ReactNode, useMemo, useCallback } from 'react';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletError } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';

// Import wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  // Use custom RPC URL if available, otherwise fallback to Helius or public mainnet
  const endpoint = useMemo(() => {
    // Check for explicit RPC URL first
    if (process.env.NEXT_PUBLIC_SOLANA_RPC_URL) {
      return process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    }
    // Use Helius if API key is available (via NEXT_PUBLIC for client-side access)
    if (process.env.NEXT_PUBLIC_HELIUS_API_KEY) {
      return `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_API_KEY}`;
    }
    // Fallback to public mainnet (may be rate-limited)
    return clusterApiUrl('mainnet-beta');
  }, []);

  // Configure wallet adapters
  const wallets = useMemo(() => {
    // Only include wallets that work well
    // Wallet Standard handles auto-detection of Phantom, Solflare, etc.
    return [
      new PhantomWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
      new TorusWalletAdapter(),
    ];
  }, []);

  // Handle wallet errors gracefully
  const onError = useCallback((error: WalletError) => {
    // Suppress "WalletNotReadyError" - this is expected when wallet isn't installed
    if (error.name === 'WalletNotReadyError') {
      return;
    }
    console.error('Wallet error:', error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
