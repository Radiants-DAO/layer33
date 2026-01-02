import type { BaseColor, ColorMode, FontDefinition, FontFile, TypographyStyle } from '../types';

export interface ParsedCSS {
  themeInline: Record<string, string>;
  theme: Record<string, string>;
  colorModes: Record<string, Record<string, string>>;
}

// Known brand color names in radOS
const KNOWN_BRAND_COLORS = [
  'white', 'black', 'green', 'blue', 'purple', 
  'accent-1', 'accent-2', 'accent-3', 'transparent'
];

// System colors (success, warning, error, focus)
const SYSTEM_COLOR_PREFIXES = [
  'success-', 'warning-', 'error-', 'focus-'
];

/**
 * Parse globals.css and extract theme variables
 */
export function parseGlobalsCSS(css: string): ParsedCSS {
  const result: ParsedCSS = {
    themeInline: {},
    theme: {},
    colorModes: {},
  };

  // Parse @theme inline block - find the complete block including nested content
  const themeInlineMatch = css.match(/@theme\s+inline\s*\{([\s\S]*?)(?=\n@theme\s*\{|\n\/\*|$)/);
  if (themeInlineMatch) {
    // Find the closing brace by counting braces
    const content = extractBlockContent(css, themeInlineMatch.index!);
    if (content) {
      result.themeInline = parseVariables(content);
    }
  }

  // Parse @theme block (not inline)
  const themeBlockStart = css.indexOf('@theme {');
  if (themeBlockStart !== -1) {
    const content = extractBlockContent(css, themeBlockStart);
    if (content) {
      result.theme = parseVariables(content);
    }
  }

  // Parse color mode classes (.dark, .light, etc.)
  const modeMatches = css.matchAll(/\.(\w+)\s*\{([\s\S]*?)\}/g);
  for (const match of modeMatches) {
    const modeName = match[1];
    // Only capture known color modes
    if (['dark', 'light', 'contrast'].includes(modeName)) {
      result.colorModes[modeName] = parseVariables(match[2]);
    }
  }

  return result;
}

/**
 * Extract content between matching braces
 */
function extractBlockContent(css: string, startIndex: number): string | null {
  const openBrace = css.indexOf('{', startIndex);
  if (openBrace === -1) return null;

  let depth = 0;
  let closeBrace = -1;

  for (let i = openBrace; i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}') {
      depth--;
      if (depth === 0) {
        closeBrace = i;
        break;
      }
    }
  }

  if (closeBrace === -1) return null;
  return css.slice(openBrace + 1, closeBrace);
}

/**
 * Parse CSS variables from a block of CSS
 */
export function parseVariables(block: string): Record<string, string> {
  const vars: Record<string, string> = {};
  const matches = block.matchAll(/(--[\w-]+):\s*([^;]+);/g);
  
  for (const match of matches) {
    vars[match[1]] = match[2].trim();
  }
  
  return vars;
}

/**
 * Resolve a CSS variable reference (handles var() references)
 */
export function resolveVariable(
  varName: string,
  parsed: ParsedCSS
): string | null {
  // Check theme first, then themeInline
  const value = parsed.theme[varName] || parsed.themeInline[varName];
  
  if (!value) return null;
  
  // Resolve var() references
  const varRef = value.match(/var\((--[\w-]+)\)/);
  if (varRef) {
    return resolveVariable(varRef[1], parsed);
  }
  
  return value;
}

/**
 * Create display name from variable name
 * e.g., "sun-yellow" -> "Sun Yellow"
 */
function toDisplayName(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Convert parsed CSS to store-friendly structures (new data model)
 * 
 * Tailwind v4 uses @theme {} block for design tokens:
 * - --color-* generates bg-*, text-*, border-* utilities
 * - --radius-* generates rounded-* utilities
 * - --shadow-* generates shadow-* utilities
 * - --font-* generates font-* utilities
 */
export function parsedCSSToStoreState(parsed: ParsedCSS): {
  baseColors: BaseColor[];
  colorModes: ColorMode[];
  borderRadius: Record<string, string>;
} {
  const baseColors: BaseColor[] = [];
  const borderRadius: Record<string, string> = {};

  // Build a map to track color IDs for reference resolution
  const colorIdMap = new Map<string, string>(); // name -> id

  // Merge theme and themeInline - Tailwind v4 uses @theme {} for design tokens
  const themeVars = { ...parsed.themeInline, ...parsed.theme };

  // Extract base colors from @theme block
  for (const [key, value] of Object.entries(themeVars)) {
    // Skip non-color variables (fonts, shadows, radius)
    if (key.startsWith('--font-')) continue;
    if (key.startsWith('--shadow-')) continue;
    if (key.startsWith('--radius-')) continue;

    // Skip if not a color variable
    if (!key.startsWith('--color-')) continue;

    const colorName = key.replace('--color-', '');
    const resolvedValue = value.startsWith('var(') ? resolveVariable(key, parsed) || value : value;

    // Neutral colors (--color-neutral-neutral-1, etc.)
    if (colorName.startsWith('neutral-')) {
      const name = colorName.replace('neutral-', '');
      const id = `neutral-${name}`;
      colorIdMap.set(name, id);
      colorIdMap.set(id, id);
      baseColors.push({
        id,
        name,
        displayName: toDisplayName(name),
        value: resolvedValue,
        category: 'neutral',
      });
    }
    // System colors (success-green, warning-yellow, error-red, focus-state)
    else if (SYSTEM_COLOR_PREFIXES.some(prefix => colorName.startsWith(prefix))) {
      const id = colorName;
      colorIdMap.set(colorName, id);
      baseColors.push({
        id,
        name: colorName,
        displayName: toDisplayName(colorName),
        value: resolvedValue,
        category: 'system',
      });
    }
    // Brand colors (white, black, green, blue, purple, accent-1, etc.)
    else if (KNOWN_BRAND_COLORS.includes(colorName) || resolvedValue.startsWith('#')) {
      const id = colorName;
      colorIdMap.set(colorName, id);
      baseColors.push({
        id,
        name: colorName,
        displayName: toDisplayName(colorName),
        value: resolvedValue,
        category: 'brand',
      });
    }
  }

  // Extract border radius from @theme
  for (const [key, value] of Object.entries(themeVars)) {
    if (key.startsWith('--radius-')) {
      const radiusName = key.replace('--radius-', '');
      borderRadius[radiusName] = value;
    }
  }

  // Extract color modes
  const colorModes: ColorMode[] = Object.entries(parsed.colorModes).map(([name, overrides]) => {
    const processedOverrides: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(overrides)) {
      // Process color overrides - map to base color names
      if (key.startsWith('--color-')) {
        const colorName = key.replace('--color-', '');
        const reference = value.includes('var(') ? value.match(/var\(--color-([\w-]+)\)/)?.[1] || value : value;
        processedOverrides[colorName] = reference;
      }
    }

    return {
      id: crypto.randomUUID(),
      name,
      className: `.${name}`,
      overrides: processedOverrides,
    };
  });

  return {
    baseColors,
    colorModes,
    borderRadius,
  };
}


// ============================================================================
// Font Face Parsing
// ============================================================================

// Weight name to number mapping
const WEIGHT_MAP: Record<string, number> = {
  'thin': 100,
  'hairline': 100,
  'extralight': 200,
  'ultralight': 200,
  'light': 300,
  'regular': 400,
  'normal': 400,
  'medium': 500,
  'semibold': 600,
  'demibold': 600,
  'bold': 700,
  'extrabold': 800,
  'ultrabold': 800,
  'black': 900,
  'heavy': 900,
};

/**
 * Auto-detect weight and style from filename
 * e.g., "Alfacad-Flux-Regular.ttf" -> { weight: 400, style: 'normal' }
 * e.g., "Space-Mono-Regular.ttf" -> { weight: 400, style: 'normal' }
 */
export function detectFontPropertiesFromFilename(filename: string): { weight: number; style: string } {
  const name = filename.toLowerCase();
  
  // Detect style
  const style = name.includes('italic') ? 'italic' : 'normal';
  
  // Detect weight
  let weight = 400; // Default to regular
  for (const [weightName, weightValue] of Object.entries(WEIGHT_MAP)) {
    if (name.includes(weightName)) {
      weight = weightValue;
      break;
    }
  }
  
  return { weight, style };
}

/**
 * Parse @font-face declarations from CSS
 */
export function parseFontFaces(css: string): FontDefinition[] {
  const fontFaces: FontDefinition[] = [];
  const fontMap = new Map<string, FontDefinition>();
  
  // Match all @font-face blocks
  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    
    // Extract font-family
    const familyMatch = block.match(/font-family:\s*['"]?([^'";]+)['"]?;/);
    if (!familyMatch) continue;
    const family = familyMatch[1].trim();
    
    // Extract src (path and format)
    const srcMatch = block.match(/src:\s*url\(['"]?([^'"()]+)['"]?\)\s*format\(['"]?([^'"]+)['"]?\)/);
    if (!srcMatch) continue;
    const path = srcMatch[1];
    const format = srcMatch[2].replace('woff2', 'woff2').replace('truetype', 'ttf').replace('opentype', 'otf') as FontFile['format'];
    
    // Extract font-weight
    const weightMatch = block.match(/font-weight:\s*(\d+);/);
    const weight = weightMatch ? parseInt(weightMatch[1], 10) : 400;
    
    // Extract font-style
    const styleMatch = block.match(/font-style:\s*(\w+);/);
    const style = styleMatch ? styleMatch[1] : 'normal';
    
    // Get or create font definition
    const fontId = family.toLowerCase().replace(/\s+/g, '-');
    let font = fontMap.get(fontId);
    
    if (!font) {
      font = {
        id: fontId,
        name: family,
        family: family,
        files: [],
        weights: [],
        styles: [],
      };
      fontMap.set(fontId, font);
    }
    
    // Add file
    const fileId = `${fontId}-${weight}-${style}`;
    font.files.push({
      id: fileId,
      weight,
      style,
      format: format as FontFile['format'],
      path,
    });
    
    // Update weights and styles
    if (!font.weights.includes(weight)) {
      font.weights.push(weight);
      font.weights.sort((a, b) => a - b);
    }
    if (!font.styles.includes(style)) {
      font.styles.push(style);
    }
  }
  
  return Array.from(fontMap.values());
}

// ============================================================================
// Layer Base Parsing
// ============================================================================

// Tailwind class patterns for typography
const SIZE_CLASSES = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'];
const WEIGHT_CLASSES = ['font-thin', 'font-extralight', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold', 'font-black'];
const LEADING_CLASSES = ['leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose'];
const TRACKING_CLASSES = ['tracking-tighter', 'tracking-tight', 'tracking-normal', 'tracking-wide', 'tracking-wider', 'tracking-widest'];

/**
 * Parse @layer base block for typography styles
 */
export function parseLayerBase(css: string): TypographyStyle[] {
  const styles: TypographyStyle[] = [];
  
  // Find @layer base block
  const layerMatch = css.match(/@layer\s+base\s*\{([\s\S]*?)\n\}/);
  if (!layerMatch) return styles;
  
  const layerContent = layerMatch[1];
  
  // Match each element rule: h1 { @apply ... }
  const elementRegex = /\s*(h[1-6]|p|a|ul|ol|li|small|strong|em|code|pre|kbd|mark|blockquote|cite|abbr|dfn|q|sub|sup|del|ins|caption|label|figcaption)\s*\{([^}]+)\}/g;
  let match;
  
  while ((match = elementRegex.exec(layerContent)) !== null) {
    const element = match[1];
    const ruleContent = match[2];
    
    // Extract @apply classes
    const applyMatch = ruleContent.match(/@apply\s+([^;]+);/);
    if (!applyMatch) continue;
    
    const classes = applyMatch[1].trim().split(/\s+/);
    
    // Parse classes into typography style properties
    const style: TypographyStyle = {
      id: element,
      element,
      fontFamilyId: '', // Will be resolved based on font-* class
      fontSize: 'text-base',
      fontWeight: 'font-normal',
      baseColorId: 'black', // Default to black text color
      displayName: getElementDisplayName(element),
      utilities: [],
    };
    
    for (const cls of classes) {
      // Font family (font-alfacad, font-space-mono)
      if (cls.startsWith('font-') && !WEIGHT_CLASSES.includes(cls)) {
        const fontName = cls.replace('font-', '');
        style.fontFamilyId = fontName;
      }
      // Font size
      else if (SIZE_CLASSES.includes(cls)) {
        style.fontSize = cls;
      }
      // Font weight
      else if (WEIGHT_CLASSES.includes(cls)) {
        style.fontWeight = cls;
      }
      // Line height
      else if (LEADING_CLASSES.includes(cls)) {
        style.lineHeight = cls;
      }
      // Letter spacing
      else if (TRACKING_CLASSES.includes(cls)) {
        style.letterSpacing = cls;
      }
      // Text color (text-black, text-white, etc.) - extract base color name
      else if (cls.startsWith('text-') && !SIZE_CLASSES.includes(cls)) {
        const colorName = cls.replace('text-', '');
        // Map common color names to base color IDs
        style.baseColorId = colorName === 'white' ? 'white' :
                           colorName === 'black' ? 'black' :
                           colorName === 'green' ? 'green' :
                           colorName === 'blue' ? 'blue' :
                           colorName === 'purple' ? 'purple' :
                           colorName === 'accent-1' ? 'accent-1' :
                           colorName === 'accent-2' ? 'accent-2' :
                           colorName === 'accent-3' ? 'accent-3' : 'black'; // Default to black
      }
      // Other utilities
      else {
        style.utilities = style.utilities || [];
        style.utilities.push(cls);
      }
    }
    
    styles.push(style);
  }
  
  return styles;
}

/**
 * Get display name for HTML element
 */
function getElementDisplayName(element: string): string {
  const names: Record<string, string> = {
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    p: 'Paragraph',
    a: 'Link',
    ul: 'Unordered List',
    ol: 'Ordered List',
    li: 'List Item',
    small: 'Small Text',
    strong: 'Strong',
    em: 'Emphasis',
    code: 'Inline Code',
    pre: 'Code Block',
    kbd: 'Keyboard Input',
    mark: 'Highlighted Text',
    blockquote: 'Block Quote',
    cite: 'Citation',
    abbr: 'Abbreviation',
    dfn: 'Definition Term',
    q: 'Inline Quote',
    sub: 'Subscript',
    sup: 'Superscript',
    del: 'Deleted Text',
    ins: 'Inserted Text',
    caption: 'Caption',
    label: 'Form Label',
    figcaption: 'Figure Caption',
  };
  return names[element] || element.toUpperCase();
}
