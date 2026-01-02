'use client';

import { useDevToolsStore } from '../../store';
import type { BaseColor } from '../../types';

/**
 * ColorDisplay - Read-only display of colors from globals.css @theme block
 * 
 * Tailwind v4 automatically generates utilities from @theme:
 * - --color-green → bg-green, text-green, border-green
 * - --color-neutral-neutral-1 → bg-neutral-neutral-1, text-neutral-neutral-1
 */
export function ColorDisplay() {
  const { baseColors } = useDevToolsStore();

  const brandColors = baseColors.filter((c) => c.category === 'brand');
  const neutralColors = baseColors.filter((c) => c.category === 'neutral');
  const systemColors = baseColors.filter((c) => c.category === 'system');

  return (
    <div className="space-y-6">
      {/* Brand Colors Section */}
      {brandColors.length > 0 && (
        <ColorSection title="Brand Colors" colors={brandColors} />
      )}

      {/* Neutral Colors Section */}
      {neutralColors.length > 0 && (
        <ColorSection title="Neutrals" colors={neutralColors} />
      )}

      {/* System Colors Section */}
      {systemColors.length > 0 && (
        <ColorSection title="System Colors" colors={systemColors} />
      )}

      {/* Info Note */}
      <div className="p-3 bg-green/20 border border-black/20 rounded-sm">
        <p className="font-alfacad text-sm text-black">
          Colors are read from <code className="bg-black/10 px-1">@theme</code> in globals.css. 
          Tailwind v4 auto-generates utilities like <code className="bg-black/10 px-1">bg-green</code>, <code className="bg-black/10 px-1">text-black</code>.
        </p>
      </div>
    </div>
  );
}

interface ColorSectionProps {
  title: string;
  colors: BaseColor[];
}

function ColorSection({ title, colors }: ColorSectionProps) {
  return (
    <div className="space-y-2">
      <h4>{title}</h4>
      
      <div className="space-y-1">
        {colors.map((color) => (
          <ColorRow key={color.id} color={color} />
        ))}
      </div>
    </div>
  );
}

interface ColorRowProps {
  color: BaseColor;
}

function ColorRow({ color }: ColorRowProps) {
  // Build CSS variable name based on category
  const cssVarName = color.category === 'neutral' 
    ? `--color-neutral-${color.name}`
    : `--color-${color.name}`;

  return (
    <div className="flex items-center gap-3 p-2 rounded-sm hover:bg-black/5 group">
      {/* Color Swatch */}
      <div
        className="w-6 h-6 rounded-xs border border-black flex-shrink-0"
        style={{ backgroundColor: color.value }}
      />

      {/* Color Name & Variable */}
      <div className="flex-1 min-w-0">
        <span className="font-alfacad text-base text-black block truncate">
          {color.displayName}
        </span>
        <code className="text-xs font-mono text-black/50 block truncate">
          {cssVarName}
        </code>
      </div>

      {/* Hex Value */}
      <code className="text-sm font-mono text-black/60 uppercase flex-shrink-0">
        {color.value}
      </code>
    </div>
  );
}

export default ColorDisplay;
