'use client';

import React, { useEffect, useState } from 'react';
import { useDevToolsStore } from '../../store';
import { FontManager } from './FontManager';
import { TypographyStylesDisplay } from './TypographyStylesDisplay';
import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';

interface TypographyTabProps {
  searchQuery?: string;
}

export function TypographyTab({ searchQuery = '' }: TypographyTabProps) {
  const { loadTypographyFromCSS, loadFontsFromFilesystem } = useDevToolsStore();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load typography on mount
  useEffect(() => {
    loadTypographyFromCSS();
  }, [loadTypographyFromCSS]);

  // Handle reload
  const handleReload = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      // Load fonts from filesystem (more accurate)
      await loadFontsFromFilesystem();
      // Load typography styles from CSS
      await loadTypographyFromCSS();
      setMessage({ type: 'success', text: 'Typography reloaded!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reload typography.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="flex flex-col h-full overflow-auto pt-4 pb-4 pl-4 pr-2 bg-[var(--color-white)] border border-black rounded space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2>
          Typography
        </h2>
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
          className={`px-4 py-2 text-sm font-alfacad ${
            message.type === 'success'
              ? 'bg-success-green/30 text-black'
              : 'bg-error-red/30 text-black'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {/* Font Manager Section */}
        <FontManager />

        {/* Fluid Typography (Proportional Scaling) Info */}
        <div className="border border-black rounded-sm bg-white p-4 space-y-3">
          <h3 className="font-alfacad text-base font-bold uppercase">Proportional Fluid Scaling</h3>
          <p className="font-alfacad text-sm text-black/70">
            Everything scales proportionally using a single <code className="bg-black/10 px-1 py-0.5 rounded">clamp()</code> on the root HTML element. All rem-based measurements scale together, maintaining design ratios.
          </p>
          <div className="space-y-3 font-alfacad text-xs">
            <div>
              <div className="font-mono text-black/60 mb-1">Root Scale (html):</div>
              <div className="font-mono bg-black/5 p-2 rounded">font-size: clamp(16px, 0.95rem + 0.25vw, 18px)</div>
              <div className="text-black/50 mt-1">Scales from 16px (mobile) to 18px (large screens)</div>
            </div>
            <div>
              <div className="font-mono text-black/60 mb-1">Typography Scale (rem units):</div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <div className="font-mono text-black/60">--font-size-xs:</div>
                <div className="font-mono">0.75rem</div>
                <div className="font-mono text-black/60">--font-size-sm:</div>
                <div className="font-mono">0.875rem</div>
                <div className="font-mono text-black/60">--font-size-base:</div>
                <div className="font-mono">1rem</div>
                <div className="font-mono text-black/60">--font-size-lg:</div>
                <div className="font-mono">1.125rem</div>
                <div className="font-mono text-black/60">--font-size-xl:</div>
                <div className="font-mono">1.25rem</div>
                <div className="font-mono text-black/60">--font-size-2xl:</div>
                <div className="font-mono">1.5rem</div>
                <div className="font-mono text-black/60">--font-size-3xl:</div>
                <div className="font-mono">2rem</div>
                <div className="font-mono text-black/60">--font-size-4xl:</div>
                <div className="font-mono">2.5rem</div>
                <div className="font-mono text-black/60">--font-size-5xl:</div>
                <div className="font-mono">3.75rem</div>
                <div className="font-mono text-black/60">--font-size-hero:</div>
                <div className="font-mono">4rem</div>
              </div>
              <div className="text-black/50 mt-2">
                All typography uses rem units, scaling proportionally with the root. Spacing, padding, and margins using rem units will also scale proportionally.
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <Divider />

        {/* Typography Styles Section */}
        <TypographyStylesDisplay />
      </div>
    </div>
  );
}

export default TypographyTab;

