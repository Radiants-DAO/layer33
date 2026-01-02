'use client';

import { useDevToolsStore } from '../../store';
import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export function ColorModeSelector() {
  const { colorModes, activeColorMode, setActiveColorMode, baseColors } = useDevToolsStore();
  const { addToast } = useToast();

  // Apply color mode to document
  useEffect(() => {
    const html = document.documentElement;
    
    // Remove all color mode classes
    colorModes.forEach((mode) => {
      html.classList.remove(mode.name);
    });
    
    // Add active color mode class
    if (activeColorMode) {
      const activeMode = colorModes.find((m) => m.id === activeColorMode);
      if (activeMode) {
        html.classList.add(activeMode.name);
      }
    }
  }, [activeColorMode, colorModes]);

  // Helper to get CSS variable name
  const getCssVarName = (color: typeof baseColors[0]) => {
    if (color.category === 'neutral') {
      return `--color-neutral-${color.name}`;
    }
    return `--color-${color.name}`;
  };

  const handleCopyPrompt = () => {
    // Generate prompt for AI agent to create a new color mode
    const brandColors = baseColors.filter(c => c.category === 'brand');
    const neutralColors = baseColors.filter(c => c.category === 'neutral');
    const systemColors = baseColors.filter(c => c.category === 'system');

    const brandColorsList = brandColors
      .map(c => `  ${getCssVarName(c)}: ${c.value};`)
      .join('\n');

    const neutralColorsList = neutralColors
      .map(c => `  ${getCssVarName(c)}: ${c.value};`)
      .join('\n');

    const systemColorsList = systemColors
      .map(c => `  ${getCssVarName(c)}: ${c.value};`)
      .join('\n');

    const prompt = `Create a new color mode in globals.css.

Add a CSS class selector (e.g., .dark, .light, .high-contrast) after the existing @theme block with color variable overrides.

Template:
.[mode-name] {
  /* Brand Colors - map to new values */
${brandColorsList}

  /* Neutral Colors */
${neutralColorsList}

  /* System Colors (optional - override if needed) */
${systemColorsList}
}

Current color values for reference:
${baseColors.map(c => `- ${c.displayName} (${getCssVarName(c)}): ${c.value}`).join('\n')}

Replace [mode-name] with your desired mode name (e.g., dark, light, high-contrast) and update the color values as needed.`;

    navigator.clipboard.writeText(prompt).then(() => {
      addToast({
        title: 'Prompt copied',
        description: 'Paste the prompt to an AI agent to create a new color mode',
        variant: 'success',
      });
    }).catch(() => {
      addToast({
        title: 'Failed to copy',
        description: 'Could not copy prompt to clipboard',
        variant: 'error',
      });
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3>Color Mode</h3>
        <Button
          variant="outline"
          size="md"
          iconName="copy"
          onClick={handleCopyPrompt}
        >
          Copy Prompt
        </Button>
      </div>
      
      {/* Color Mode Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeColorMode === null ? 'primary' : 'ghost'}
          size="md"
          onClick={() => setActiveColorMode(null)}
          className={activeColorMode === null ? 'border-2' : ''}
        >
          Default
        </Button>
        
        {colorModes.map((mode) => (
          <Button
            key={mode.id}
            variant={activeColorMode === mode.id ? 'primary' : 'ghost'}
            size="md"
            onClick={() => setActiveColorMode(mode.id)}
            className={activeColorMode === mode.id ? 'border-2' : ''}
          >
            {mode.name}
          </Button>
        ))}
      </div>

      {/* Active Overrides Display */}
      {activeColorMode && (
        <div className="p-3 bg-black/10 rounded-md">
          <h4 className="mb-2">Active Overrides</h4>
          <div className="space-y-1">
            {Object.entries(colorModes.find((m) => m.id === activeColorMode)?.overrides || {}).map(([token, ref]) => (
              <div key={token} className="flex items-center gap-2 font-alfacad text-sm">
                <span className="text-black font-mono">{token}</span>
                <span className="text-black/60">→</span>
                <span className="text-black/60 font-mono">{ref}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="p-3 bg-green/20 border border-black/20 rounded-sm">
        <p className="font-alfacad text-sm text-black">
          Color modes are read from globals.css. Use the &quot;Copy Prompt&quot; button to generate a prompt for creating new color modes with an AI agent.
        </p>
      </div>
    </div>
  );
}

