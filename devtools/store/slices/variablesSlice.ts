import { StateCreator } from 'zustand';
import type { BaseColor, ColorMode } from '../../types';

export interface VariablesSlice {
  // State
  baseColors: BaseColor[];
  colorModes: ColorMode[];
  activeColorMode: string | null;
  borderRadius: Record<string, string>;
  
  // Actions - Color Modes (read-only, but can switch active mode)
  setActiveColorMode: (id: string | null) => void;
  
  // Load from CSS (read-only source of truth)
  loadFromCSS: () => Promise<void>;
}

// Default base colors - fallback before CSS loads
// These match the @theme block in globals.css
const defaultBaseColors: BaseColor[] = [
  // Brand colors (generates bg-white, text-black, border-green, etc.)
  { id: 'white', name: 'white', displayName: 'White', value: '#FFFFFF', category: 'brand' },
  { id: 'black', name: 'black', displayName: 'Black', value: '#000000', category: 'brand' },
  { id: 'green', name: 'green', displayName: 'Green', value: '#27FF93', category: 'brand' },
  { id: 'blue', name: 'blue', displayName: 'Blue', value: '#32D6FF', category: 'brand' },
  { id: 'purple', name: 'purple', displayName: 'Purple', value: '#AF9FFF', category: 'brand' },
  { id: 'accent-1', name: 'accent-1', displayName: 'Accent 1', value: '#D8006C', category: 'brand' },
  { id: 'accent-2', name: 'accent-2', displayName: 'Accent 2', value: '#CD2900', category: 'brand' },
  { id: 'accent-3', name: 'accent-3', displayName: 'Accent 3', value: '#506000', category: 'brand' },
  // Neutral colors (generates bg-neutral-neutral-1, text-neutral-neutral-2, etc.)
  { id: 'neutral-neutral-1', name: 'neutral-1', displayName: 'Neutral 1', value: '#E5E4E3', category: 'neutral' },
  { id: 'neutral-neutral-2', name: 'neutral-2', displayName: 'Neutral 2', value: '#C8C8C8', category: 'neutral' },
  { id: 'neutral-neutral-3', name: 'neutral-3', displayName: 'Neutral 3', value: '#7D7D7D', category: 'neutral' },
  { id: 'neutral-neutral-4', name: 'neutral-4', displayName: 'Neutral 4', value: '#424242', category: 'neutral' },
  // System colors (generates bg-success-green, text-error-red, etc.)
  { id: 'success-green', name: 'success-green', displayName: 'Success Green', value: '#22C55E', category: 'system' },
  { id: 'success-green-dark', name: 'success-green-dark', displayName: 'Success Green Dark', value: '#87BB82', category: 'system' },
  { id: 'error-red', name: 'error-red', displayName: 'Error Red', value: '#D8006C', category: 'system' },
  { id: 'error-red-dark', name: 'error-red-dark', displayName: 'Error Red Dark', value: '#9E433E', category: 'system' },
  { id: 'warning-yellow', name: 'warning-yellow', displayName: 'Warning Yellow', value: '#CD2900', category: 'system' },
  { id: 'warning-yellow-dark', name: 'warning-yellow-dark', displayName: 'Warning Yellow Dark', value: '#BE9D2B', category: 'system' },
  { id: 'focus-state', name: 'focus-state', displayName: 'Focus State', value: '#32D6FF', category: 'system' },
];

export const createVariablesSlice: StateCreator<VariablesSlice, [], [], VariablesSlice> = (set, get) => ({
  baseColors: defaultBaseColors,
  colorModes: [],
  activeColorMode: null,
  borderRadius: {
    none: '0',
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },

  // Color Mode Actions (only switching active mode, no editing)
  setActiveColorMode: (id) => set({ activeColorMode: id }),

  // Load from CSS - parses existing CSS into new data model
  loadFromCSS: async () => {
    try {
      const res = await fetch('/api/devtools/read-css');
      if (!res.ok) {
        throw new Error('Failed to fetch CSS');
      }
      const css = await res.text();
      
      // Import parser dynamically to avoid SSR issues
      const { parseGlobalsCSS, parsedCSSToStoreState } = await import('../../lib/cssParser');
      
      const parsed = parseGlobalsCSS(css);
      const state = parsedCSSToStoreState(parsed);
      
      set({
        baseColors: state.baseColors,
        colorModes: state.colorModes,
        borderRadius: state.borderRadius,
      });
    } catch (error) {
      // Failed to load CSS
    }
  },
});
