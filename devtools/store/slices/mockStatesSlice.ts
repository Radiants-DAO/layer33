import { StateCreator } from 'zustand';
import type { MockState } from '../../types';

export interface MockStatesSlice {
  // State
  mockStates: MockState[];
  
  // Actions
  toggleMockState: (id: string) => void;
  updateMockStateValue: (id: string, key: string, value: unknown) => void;
}

// Default preset states
const defaultPresets: MockState[] = [
  {
    id: 'wallet-disconnected',
    name: 'Wallet Disconnected',
    description: 'Simulates a disconnected wallet',
    category: 'wallet',
    values: {
      isConnected: false,
      address: null,
      balance: '0',
    },
    active: false,
  },
  {
    id: 'wallet-connecting',
    name: 'Wallet Connecting',
    description: 'Simulates wallet connection in progress',
    category: 'wallet',
    values: {
      isConnected: false,
      address: null,
      balance: '0',
    },
    active: false,
  },
  {
    id: 'wallet-connected',
    name: 'Wallet Connected',
    description: 'Simulates a connected wallet',
    category: 'wallet',
    values: {
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      balance: '1.5',
    },
    active: false,
  },
  {
    id: 'token-hodler',
    name: 'Token Hodler',
    description: 'Simulates a user holding tokens',
    category: 'wallet',
    values: {
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      balance: '10.5',
      hasTokens: true,
    },
    active: false,
  },
  {
    id: 'tx-signing',
    name: 'Transaction Signing',
    description: 'Simulates waiting for wallet approval',
    category: 'staking',
    values: {
      status: 'signing',
      amount: '1.0',
    },
    active: false,
  },
  {
    id: 'tx-pending',
    name: 'Transaction Pending',
    description: 'Simulates transaction awaiting confirmation',
    category: 'staking',
    values: {
      status: 'pending',
      amount: '1.0',
      signature: 'sig_1234567890abcdef',
    },
    active: false,
  },
  {
    id: 'tx-success',
    name: 'Transaction Success',
    description: 'Simulates successful transaction',
    category: 'staking',
    values: {
      status: 'success',
      amount: '1.0',
      signature: 'sig_1234567890abcdef',
    },
    active: false,
  },
  {
    id: 'tx-error',
    name: 'Transaction Error',
    description: 'Simulates failed transaction',
    category: 'staking',
    values: {
      status: 'error',
      amount: '1.0',
      error: 'Transaction failed',
    },
    active: false,
  },
  {
    id: 'has-position',
    name: 'Has Staking Position',
    description: 'Simulates user with existing staked SOL',
    category: 'staking',
    values: {
      stakedAmount: '5.0',
      receivedTokens: '5.0',
      rewards: '0.25',
      apy: '5.0',
    },
    active: false,
  },
];

export const createMockStatesSlice: StateCreator<MockStatesSlice, [], [], MockStatesSlice> = (set) => ({
  mockStates: defaultPresets,

  toggleMockState: (id) => set((state) => {
    const targetState = state.mockStates.find((m) => m.id === id);
    if (!targetState) return state;

    // If activating, deactivate other states in the same category
    const newActive = !targetState.active;
    
    return {
      mockStates: state.mockStates.map((m) => {
        if (m.id === id) {
          return { ...m, active: newActive };
        }
        // Deactivate other states in the same category
        if (newActive && m.category === targetState.category && m.active) {
          return { ...m, active: false };
        }
        return m;
      })
    };
  }),

  updateMockStateValue: (id, key, value) => set((state) => {
    const targetState = state.mockStates.find((m) => m.id === id);
    if (!targetState) return state;

    return {
      mockStates: state.mockStates.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            values: {
              ...m.values,
              [key]: value,
            },
          };
        }
        return m;
      })
    };
  }),
});

