'use client';

import { useEffect, useState, useRef } from 'react';
import { useDevToolsStore } from '../../store';
import { ColorDisplay } from './ColorDisplay';
import { ColorModeSelector } from './ColorModeSelector';
import { BorderRadiusDisplay } from './BorderRadiusDisplay';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

export function VariablesTab() {
  const { loadFromCSS } = useDevToolsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const messageTimerRef = useRef<NodeJS.Timeout>(undefined);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    };
  }, []);

  // Load CSS on mount to sync with actual file
  useEffect(() => {
    loadFromCSS();
  }, [loadFromCSS]);

  const handleReload = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      await loadFromCSS();
      setMessage({ type: 'success', text: 'Reloaded from CSS!' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to reload. Check console.' });
    } finally {
      setIsLoading(false);
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-black rounded-none space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <h2>Design Tokens</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            iconName="refresh"
            onClick={handleReload}
            disabled={isLoading}
          >
            {isLoading ? 'Reloading...' : 'Reload'}
          </Button>
        </div>
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`px-3 py-2 font-alfacad text-base rounded-sm ${
            message.type === 'success'
              ? 'bg-green text-black'
              : 'bg-error-red text-white'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Display Sections */}
      <div className="space-y-4">
        <ColorModeSelector />
        <Divider />
        <ColorDisplay />
        <Divider />
        <BorderRadiusDisplay />
      </div>
    </div>
  );
}
