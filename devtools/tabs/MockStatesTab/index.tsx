'use client';

import { useDevToolsStore } from '../../store';
import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Input';
import { Divider } from '@/components/ui/Divider';

export function MockStatesTab() {
  const { mockStates, toggleMockState, updateMockStateValue } = useDevToolsStore();

  // Group states by category
  const walletStates = mockStates.filter((s) => s.category === 'wallet');
  const stakingStates = mockStates.filter((s) => s.category === 'staking');

  // Get active states
  const activeWalletState = walletStates.find((s) => s.active);
  const activeStakingState = stakingStates.find((s) => s.active);

  // Quick action handlers
  const setWalletDisconnected = () => {
    toggleMockState('wallet-disconnected');
  };

  const setWalletConnected = () => {
    // First ensure wallet-connected is active
    if (!mockStates.find(s => s.id === 'wallet-connected')?.active) {
      toggleMockState('wallet-connected');
    }
  };

  const setWalletConnectedWithBalance = (balance: string) => {
    // Activate wallet-connected state
    if (!mockStates.find(s => s.id === 'wallet-connected')?.active) {
      toggleMockState('wallet-connected');
    }
    // Update balance
    updateMockStateValue('wallet-connected', 'balance', balance);
  };

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-black rounded space-y-4">
      <h2 className="font-space-mono text-sm uppercase text-black">Mock States</h2>
      
      {/* Quick Actions Section */}
      <div className="space-y-3">
        <h3 className="font-space-mono text-xs uppercase text-black/60">Quick Actions - Wallet</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeWalletState?.id === 'wallet-disconnected' ? 'primary' : 'outline'}
            size="sm"
            onClick={setWalletDisconnected}
          >
            Disconnected
          </Button>
          <Button
            variant={activeWalletState?.id === 'wallet-connected' ? 'primary' : 'outline'}
            size="sm"
            onClick={setWalletConnected}
          >
            Connected
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWalletConnectedWithBalance('0')}
          >
            0 SOL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWalletConnectedWithBalance('1.5')}
          >
            1.5 SOL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWalletConnectedWithBalance('100')}
          >
            100 SOL
          </Button>
        </div>
      </div>

      <Divider />

      {/* Transaction State Actions */}
      <div className="space-y-3">
        <h3 className="font-space-mono text-xs uppercase text-black/60">Transaction States</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant={activeStakingState?.id === 'tx-signing' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleMockState('tx-signing')}
          >
            Signing
          </Button>
          <Button
            variant={activeStakingState?.id === 'tx-pending' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleMockState('tx-pending')}
          >
            Pending
          </Button>
          <Button
            variant={activeStakingState?.id === 'tx-success' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleMockState('tx-success')}
          >
            Success
          </Button>
          <Button
            variant={activeStakingState?.id === 'tx-error' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => toggleMockState('tx-error')}
          >
            Error
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => toggleMockState('has-position')}
        >
          {mockStates.find(s => s.id === 'has-position')?.active ? '✓ ' : ''}Has Staking Position
        </Button>
      </div>

      <Divider />

      {/* Current State Display */}
      {(activeWalletState || activeStakingState) && (
        <div className="space-y-3">
          <h3 className="font-space-mono text-xs uppercase text-black/60">Active States</h3>
          
          {activeWalletState && (
            <div className="flex flex-col gap-2 p-2 border border-black rounded bg-black/5">
              <div className="flex justify-between items-center">
                <span className="font-space-mono text-xs uppercase">{activeWalletState.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleMockState(activeWalletState.id)}
                  style={{ padding: '2px 8px', minHeight: 'auto' }}
                >
                  ✕
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs uppercase">Balance (SOL)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={String(activeWalletState.values.balance || '0')}
                    onChange={(e) => updateMockStateValue(activeWalletState.id, 'balance', e.target.value)}
                    fullWidth
                    size="sm"
                  />
                </div>
                <div>
                  <Label className="text-xs uppercase">Connected</Label>
                  <Button
                    variant={activeWalletState.values.isConnected ? 'primary' : 'outline'}
                    size="sm"
                    fullWidth
                    onClick={() => updateMockStateValue(
                      activeWalletState.id, 
                      'isConnected', 
                      !activeWalletState.values.isConnected
                    )}
                  >
                    {activeWalletState.values.isConnected ? 'Yes' : 'No'}
                  </Button>
                </div>
              </div>
              {typeof activeWalletState.values.address === 'string' && activeWalletState.values.address ? (
                <div className="text-xs font-mono break-all text-black/60">
                  {activeWalletState.values.address}
                </div>
              ) : null}
            </div>
          )}

          {activeStakingState && (
            <div className="flex flex-col gap-2 p-2 border border-black rounded bg-black/5">
              <div className="flex justify-between items-center">
                <span className="font-space-mono text-xs uppercase">{activeStakingState.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleMockState(activeStakingState.id)}
                  style={{ padding: '2px 8px', minHeight: 'auto' }}
                >
                  ✕
                </Button>
              </div>
              <div className="text-xs text-black/60">
                {activeStakingState.description}
              </div>
            </div>
          )}
        </div>
      )}

      <Divider />

      {/* All States (Collapsed) */}
      <details className="group">
        <summary className="font-space-mono text-xs uppercase text-black/60 cursor-pointer hover:text-black">
          All Mock States ({mockStates.length})
        </summary>
        <div className="mt-3 grid grid-cols-1 gap-2">
          {mockStates.map((state) => (
            <Button
              key={state.id}
              variant={state.active ? 'primary' : 'outline'}
              size="sm"
              fullWidth
              onClick={() => toggleMockState(state.id)}
            >
              {state.name}
            </Button>
          ))}
        </div>
      </details>
    </div>
  );
}
