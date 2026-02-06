'use client';

import dynamic from 'next/dynamic';

// Dynamically import WalletMultiButton to prevent SSR issues
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export function WalletButton() {
  return (
    <div className="wallet-button-wrapper">
      <WalletMultiButton />
      <style jsx global>{`
        .wallet-button-wrapper .wallet-adapter-button {
          font-family: var(--font-alfacad), sans-serif;
          font-size: 0.75rem;
          text-transform: uppercase;
          border-radius: 0;
          background-color: var(--color-green);
          color: var(--color-black);
          border: 1px solid var(--color-black);
          padding: 0.5rem 0.75rem;
          transition: all 0.15s ease;
          white-space: nowrap;
        }
        @media (min-width: 768px) {
          .wallet-button-wrapper .wallet-adapter-button {
            font-size: 0.875rem;
            padding: 0.5rem 1rem;
          }
        }
        .wallet-button-wrapper .wallet-adapter-button:hover {
          background-color: var(--color-green);
          transform: translateY(-2px);
          box-shadow: 0 3px 0 0 var(--color-black);
        }
        .wallet-button-wrapper .wallet-adapter-button:active {
          transform: translateY(0);
          box-shadow: none;
        }
        .wallet-button-wrapper .wallet-adapter-button-trigger {
          background-color: var(--color-green);
        }
        .wallet-button-wrapper .wallet-adapter-dropdown {
          font-family: var(--font-alfacad), sans-serif;
        }
        .wallet-button-wrapper .wallet-adapter-dropdown-list {
          border-radius: 0;
          border: 1px solid var(--color-black);
          background-color: var(--color-white);
        }
        .wallet-button-wrapper .wallet-adapter-dropdown-list-item {
          border-radius: 0;
          font-size: 0.875rem;
          text-transform: uppercase;
          color: var(--color-black);
        }
        .wallet-button-wrapper .wallet-adapter-dropdown-list-item:hover {
          background-color: var(--color-neutral-1);
          color: var(--color-black);
        }
      `}</style>
    </div>
  );
}
