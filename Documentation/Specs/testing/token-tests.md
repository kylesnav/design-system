# Token Tests

> Token verification tests covering palette schema validation (`tests/palette.spec.ts`), generated CSS correctness (`tests/tokens.spec.ts`), and cross-port consistency (`tests/ports.spec.ts`).

Cross-references: [[token-tiers]] (complete token inventory), [[dark-mode]] (semantic token light/dark values), [[test-strategy]] (Playwright config and helpers), [[Rebuild Plan]] (emitter pipeline structure).

---

## 1. Schema Validation -- `tests/palette.spec.ts`

These tests validate `palettes/delightful.json` against `palettes/palette.schema.json` and enforce structural constraints.

### 1.1 JSON Schema Validation

```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

const palette = JSON.parse(readFileSync('palettes/delightful.json', 'utf-8'));
const schema = JSON.parse(readFileSync('palettes/palette.schema.json', 'utf-8'));

test.describe('Palette Schema Validation', () => {
  test('palette JSON validates against palette.schema.json', () => {
    const ajv = new Ajv({ allErrors: true, strict: false });
    addFormats(ajv);
    const validate = ajv.compile(schema);
    const valid = validate(palette);
    if (!valid) {
      console.error('Validation errors:', JSON.stringify(validate.errors, null, 2));
    }
    expect(valid).toBe(true);
  });
});
```

### 1.2 Required Top-Level Keys

```typescript
test.describe('Palette Structure', () => {
  test('has all required top-level keys', () => {
    const requiredKeys = ['$schemaVersion', 'name', 'version', 'author', 'primitives', 'semantic', 'terminal'];
    for (const key of requiredKeys) {
      expect(palette).toHaveProperty(key);
    }
  });

  test('$schemaVersion is 1', () => {
    expect(palette.$schemaVersion).toBe(1);
  });

  test('name is "Delightful"', () => {
    expect(palette.name).toBe('Delightful');
  });

  test('author is "Kyle Snavely"', () => {
    expect(palette.author).toBe('Kyle Snavely');
  });
});
```

### 1.3 Primitive Family Validation

```typescript
test.describe('Primitive Families', () => {
  const requiredFamilies = ['neutral', 'pink', 'red', 'gold', 'cyan', 'green', 'purple'];

  test('all 7 primitive families are present', () => {
    for (const family of requiredFamilies) {
      expect(palette.primitives).toHaveProperty(family);
    }
    expect(Object.keys(palette.primitives)).toHaveLength(7);
  });

  test('neutral family has exactly 14 stops', () => {
    const neutralStops = Object.keys(palette.primitives.neutral);
    expect(neutralStops).toHaveLength(14);
    const expectedStops = ['0', '25', '50', '100', '150', '200', '300', '400', '500', '600', '700', '800', '900', '950'];
    expect(neutralStops.sort()).toEqual(expectedStops.sort());
  });

  const accentFamilies = ['pink', 'red', 'gold', 'cyan', 'green', 'purple'];
  for (const family of accentFamilies) {
    test(`${family} family has exactly 5 stops`, () => {
      const stops = Object.keys(palette.primitives[family]);
      expect(stops).toHaveLength(5);
      const expectedStops = ['100', '200', '300', '400', '500'];
      expect(stops.sort()).toEqual(expectedStops.sort());
    });
  }
});
```

### 1.4 OKLCH Format Validation

```typescript
test.describe('OKLCH Format', () => {
  const oklchRegex = /^oklch\(\d+\.\d+\s+\d+\.\d+\s+\d+(\.\d+)?\)$/;

  test('every primitive OKLCH string matches format regex', () => {
    for (const [family, stops] of Object.entries(palette.primitives)) {
      for (const [stop, value] of Object.entries(stops as Record<string, string>)) {
        expect(value, `primitives.${family}.${stop}`).toMatch(oklchRegex);
      }
    }
  });

  test('every semantic light OKLCH string matches format regex (where not a var reference)', () => {
    for (const [key, value] of Object.entries(palette.semantic.light as Record<string, string>)) {
      if (typeof value === 'string' && value.startsWith('oklch(')) {
        expect(value, `semantic.light.${key}`).toMatch(oklchRegex);
      }
    }
  });

  test('every semantic dark OKLCH string matches format regex (where not a var reference)', () => {
    for (const [key, value] of Object.entries(palette.semantic.dark as Record<string, string>)) {
      if (typeof value === 'string' && value.startsWith('oklch(')) {
        expect(value, `semantic.dark.${key}`).toMatch(oklchRegex);
      }
    }
  });
});
```

### 1.5 Semantic Key Symmetry

```typescript
test.describe('Semantic Key Symmetry', () => {
  test('semantic.light and semantic.dark have identical key sets', () => {
    const lightKeys = Object.keys(palette.semantic.light).sort();
    const darkKeys = Object.keys(palette.semantic.dark).sort();
    expect(lightKeys).toEqual(darkKeys);
  });
});
```

### 1.6 Terminal Palette Validation

```typescript
test.describe('Terminal Palette', () => {
  const hexRegex = /^#[0-9a-fA-F]{6}$/;

  test('terminal.light.ansi is an array of exactly 16 hex strings', () => {
    expect(Array.isArray(palette.terminal.light.ansi)).toBe(true);
    expect(palette.terminal.light.ansi).toHaveLength(16);
    for (const hex of palette.terminal.light.ansi) {
      expect(hex).toMatch(hexRegex);
    }
  });

  test('terminal.dark.ansi is an array of exactly 16 hex strings', () => {
    expect(Array.isArray(palette.terminal.dark.ansi)).toBe(true);
    expect(palette.terminal.dark.ansi).toHaveLength(16);
    for (const hex of palette.terminal.dark.ansi) {
      expect(hex).toMatch(hexRegex);
    }
  });

  test('terminal.light has foreground, background, and cursor as hex', () => {
    expect(palette.terminal.light.foreground).toMatch(hexRegex);
    expect(palette.terminal.light.background).toMatch(hexRegex);
    expect(palette.terminal.light.cursor).toMatch(hexRegex);
  });

  test('terminal.dark has foreground, background, and cursor as hex', () => {
    expect(palette.terminal.dark.foreground).toMatch(hexRegex);
    expect(palette.terminal.dark.background).toMatch(hexRegex);
    expect(palette.terminal.dark.cursor).toMatch(hexRegex);
  });
});
```

---

## 2. WCAG Contrast Checks -- `tests/palette.spec.ts`

These tests parse OKLCH values from the palette JSON, convert to sRGB, and compute WCAG 2.1 contrast ratios.

### 2.1 Helper: Resolve Palette Value

```typescript
import { parse, converter, wcagContrast } from 'culori';

const toRgb = converter('rgb');

function resolveColor(mode: 'light' | 'dark', tokenName: string): string {
  const value = palette.semantic[mode][tokenName];
  if (!value) throw new Error(`Token ${tokenName} not found in semantic.${mode}`);
  // If value is a var() reference, resolve it through the palette
  if (value.startsWith('var(--')) {
    const refName = value.match(/var\(--(.+)\)/)?.[1];
    if (refName) return resolveColor(mode, refName);
  }
  return value;
}

function contrastRatio(color1: string, color2: string): number {
  const c1 = toRgb(parse(color1));
  const c2 = toRgb(parse(color2));
  if (!c1 || !c2) throw new Error(`Failed to parse: ${color1}, ${color2}`);
  return wcagContrast(c1, c2);
}
```

### 2.2 Contrast Pair Assertions

Each pair is tested for both light AND dark modes.

```typescript
test.describe('WCAG Contrast - Light Mode', () => {
  const mode = 'light' as const;

  test('text-primary on bg-page >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-primary'),
      resolveColor(mode, 'bg-page')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-primary on bg-surface >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-primary'),
      resolveColor(mode, 'bg-surface')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-secondary on bg-page >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-secondary'),
      resolveColor(mode, 'bg-page')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-primary >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-primary')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-danger >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-danger')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-success (green) >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-green')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-gold on accent-gold >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-gold'),
      resolveColor(mode, 'accent-gold')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-cyan >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-cyan')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-purple >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-purple')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('border-default on bg-page >= 3:1 (non-text)', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'border-default'),
      resolveColor(mode, 'bg-page')
    );
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });
});
```

```typescript
test.describe('WCAG Contrast - Dark Mode', () => {
  const mode = 'dark' as const;

  test('text-primary on bg-page >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-primary'),
      resolveColor(mode, 'bg-page')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-primary on bg-surface >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-primary'),
      resolveColor(mode, 'bg-surface')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-secondary on bg-page >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-secondary'),
      resolveColor(mode, 'bg-page')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-primary >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-primary')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-danger >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-danger')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-success (green) >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-green')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-gold on accent-gold >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-gold'),
      resolveColor(mode, 'accent-gold')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-cyan >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-cyan')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('text-on-accent on accent-purple >= 4.5:1', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'text-on-accent'),
      resolveColor(mode, 'accent-purple')
    );
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test('border-default on bg-page >= 3:1 (non-text)', () => {
    const ratio = contrastRatio(
      resolveColor(mode, 'border-default'),
      resolveColor(mode, 'bg-page')
    );
    expect(ratio).toBeGreaterThanOrEqual(3.0);
  });
});
```

---

## 3. Generated CSS Correctness -- `tests/tokens.spec.ts`

These tests verify the output of the CSS emitter (`emitters/css.mjs`). They run after `npm run build` has generated `src/tokens.css`.

### 3.1 File Existence

```typescript
import { readFileSync, existsSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test.describe('Generated tokens.css', () => {
  const tokensPath = 'src/tokens.css';

  test('src/tokens.css exists after build', () => {
    expect(existsSync(tokensPath)).toBe(true);
  });

  const css = existsSync(tokensPath) ? readFileSync(tokensPath, 'utf-8') : '';
```

### 3.2 Layer Structure

```typescript
  test('contains @layer primitives block', () => {
    expect(css).toContain('@layer primitives');
  });

  test('contains @layer semantic block with :root selector', () => {
    expect(css).toMatch(/@layer\s+semantic\s*\{[\s\S]*:root/);
  });

  test('contains [data-theme="dark"] selector', () => {
    expect(css).toContain('[data-theme="dark"]');
  });
});
```

### 3.3 Specific Custom Property Spot-Checks

```typescript
test.describe('Token Value Spot-Checks', () => {
  // These run in a browser context for accurate CSS custom property resolution
  test.beforeEach(async ({ page }) => {
    const tokensCSS = readFileSync('src/tokens.css', 'utf-8');
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en" data-theme="light">
      <head><style>${tokensCSS}</style></head>
      <body></body>
      </html>
    `);
  });

  test('--primitive-neutral-100 = oklch(0.960 0.010 70)', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primitive-neutral-100').trim()
    );
    expect(value).toBe('oklch(0.960 0.010 70)');
  });

  test('--primitive-pink-400 = oklch(0.640 0.270 350)', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--primitive-pink-400').trim()
    );
    expect(value).toBe('oklch(0.640 0.270 350)');
  });

  test('--bg-page (light) = oklch(0.982 0.008 70)', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg-page').trim()
    );
    expect(value).toBe('oklch(0.982 0.008 70)');
  });

  test('--accent-primary (light) = oklch(0.640 0.270 350)', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim()
    );
    expect(value).toBe('oklch(0.640 0.270 350)');
  });

  test('--accent-primary (dark) = oklch(0.700 0.230 350)', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim()
    );
    expect(value).toBe('oklch(0.700 0.230 350)');
  });

  test('--shadow-md (light) contains 4px 4px 0', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--shadow-md').trim()
    );
    expect(value).toContain('4px 4px 0');
  });

  test('--shadow-md (dark) uses cream color oklch(0.92 0.010 65)', async ({ page }) => {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--shadow-md').trim()
    );
    expect(value).toContain('oklch(0.92 0.010 65)');
  });
});
```

### 3.4 Total Custom Property Count

```typescript
test.describe('Token Count', () => {
  test('total custom property count >= 176', async ({ page }) => {
    const tokensCSS = readFileSync('src/tokens.css', 'utf-8');
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en" data-theme="light">
      <head><style>${tokensCSS}</style></head>
      <body></body>
      </html>
    `);

    const count = await page.evaluate(() => {
      const styles = getComputedStyle(document.documentElement);
      let customPropCount = 0;
      for (let i = 0; i < styles.length; i++) {
        if (styles[i].startsWith('--')) {
          customPropCount++;
        }
      }
      return customPropCount;
    });

    expect(count).toBeGreaterThanOrEqual(176);
  });
});
```

---

## 4. Cross-Port Consistency -- `tests/ports.spec.ts`

These tests verify that platform port outputs are consistent with each other and with the palette source of truth.

### 4.1 Ghostty and iTerm2 ANSI Palette Match

```typescript
import { readFileSync, existsSync } from 'node:fs';
import { test, expect } from '@playwright/test';

test.describe('Cross-Port Consistency', () => {
  test('Ghostty light ANSI values match iTerm2 light ANSI values', () => {
    const ghosttyConfig = readFileSync('ports/ghostty/config', 'utf-8');
    const itermPlist = readFileSync('ports/iterm2/delightful-light.itermcolors', 'utf-8');

    // Extract hex values from Ghostty config (format: palette = index=hex)
    const ghosttyColors: string[] = [];
    const ghosttyRegex = /palette\s*=\s*(\d+)=(#[0-9a-fA-F]{6})/g;
    let match: RegExpExecArray | null;
    while ((match = ghosttyRegex.exec(ghosttyConfig)) !== null) {
      ghosttyColors[parseInt(match[1])] = match[2].toLowerCase();
    }

    // Extract RGB float values from iTerm2 plist and convert to hex
    // The plist uses <key>Ansi N Color</key> followed by RGB float dict
    const itermColors = parseItermAnsiColors(itermPlist);

    // Compare first 16 ANSI colors
    for (let i = 0; i < 16; i++) {
      expect(
        ghosttyColors[i],
        `ANSI color ${i}: Ghostty=${ghosttyColors[i]}, iTerm2=${itermColors[i]}`
      ).toBe(itermColors[i]);
    }
  });

  test('Ghostty dark ANSI values match iTerm2 dark ANSI values', () => {
    // Same pattern as above but with dark theme files
    const ghosttyConfig = readFileSync('ports/ghostty/config-dark', 'utf-8');
    const itermPlist = readFileSync('ports/iterm2/delightful-dark.itermcolors', 'utf-8');

    const ghosttyColors = parseGhosttyAnsiColors(ghosttyConfig);
    const itermColors = parseItermAnsiColors(itermPlist);

    for (let i = 0; i < 16; i++) {
      expect(
        ghosttyColors[i],
        `Dark ANSI color ${i}: Ghostty=${ghosttyColors[i]}, iTerm2=${itermColors[i]}`
      ).toBe(itermColors[i]);
    }
  });
});
```

### 4.2 VS Code Theme Structure

```typescript
test.describe('VS Code Theme', () => {
  test('light theme has required top-level keys', () => {
    const theme = JSON.parse(
      readFileSync('ports/vscode/themes/delightful-light-color-theme.json', 'utf-8')
    );
    expect(theme).toHaveProperty('name');
    expect(theme).toHaveProperty('type');
    expect(theme).toHaveProperty('colors');
    expect(theme).toHaveProperty('tokenColors');
  });

  test('dark theme has required top-level keys', () => {
    const theme = JSON.parse(
      readFileSync('ports/vscode/themes/delightful-dark-color-theme.json', 'utf-8')
    );
    expect(theme).toHaveProperty('name');
    expect(theme).toHaveProperty('type');
    expect(theme).toHaveProperty('colors');
    expect(theme).toHaveProperty('tokenColors');
  });

  test('light theme type is "light"', () => {
    const theme = JSON.parse(
      readFileSync('ports/vscode/themes/delightful-light-color-theme.json', 'utf-8')
    );
    expect(theme.type).toBe('light');
  });

  test('dark theme type is "dark"', () => {
    const theme = JSON.parse(
      readFileSync('ports/vscode/themes/delightful-dark-color-theme.json', 'utf-8')
    );
    expect(theme.type).toBe('dark');
  });

  test('terminal.ansiBlack matches palette terminal.light.ansi[0]', () => {
    const theme = JSON.parse(
      readFileSync('ports/vscode/themes/delightful-light-color-theme.json', 'utf-8')
    );
    const palette = JSON.parse(readFileSync('palettes/delightful.json', 'utf-8'));
    expect(theme.colors['terminal.ansiBlack'].toLowerCase()).toBe(
      palette.terminal.light.ansi[0].toLowerCase()
    );
  });
});
```

### 4.3 Obsidian Theme Namespace

```typescript
test.describe('Obsidian Theme', () => {
  test('obsidian theme uses --d-* namespace', () => {
    const css = readFileSync('ports/obsidian/theme.css', 'utf-8');
    // Should contain --d- prefixed custom properties
    expect(css).toMatch(/--d-[\w-]+/);
  });

  test('obsidian theme does not contain --primitive-* references', () => {
    const css = readFileSync('ports/obsidian/theme.css', 'utf-8');
    // No raw primitive references should leak into the Obsidian port
    const primitiveRefs = css.match(/var\(--primitive-/g);
    expect(primitiveRefs).toBeNull();
  });
});
```

### 4.4 Helper: Parse iTerm2 ANSI Colors

```typescript
/**
 * Parse iTerm2 .itermcolors plist XML and extract ANSI colors as hex.
 * The plist stores RGB as float values (0.0-1.0) in a dict structure.
 */
function parseItermAnsiColors(plist: string): string[] {
  const colors: string[] = [];
  for (let i = 0; i < 16; i++) {
    const keyName = `Ansi ${i} Color`;
    const keyIdx = plist.indexOf(`<key>${keyName}</key>`);
    if (keyIdx === -1) continue;

    const dictStart = plist.indexOf('<dict>', keyIdx);
    const dictEnd = plist.indexOf('</dict>', dictStart);
    const dictContent = plist.slice(dictStart, dictEnd);

    const r = parseFloat(dictContent.match(/<key>Red Component<\/key>\s*<real>([^<]+)<\/real>/)?.[1] ?? '0');
    const g = parseFloat(dictContent.match(/<key>Green Component<\/key>\s*<real>([^<]+)<\/real>/)?.[1] ?? '0');
    const b = parseFloat(dictContent.match(/<key>Blue Component<\/key>\s*<real>([^<]+)<\/real>/)?.[1] ?? '0');

    const hex = '#' +
      Math.round(r * 255).toString(16).padStart(2, '0') +
      Math.round(g * 255).toString(16).padStart(2, '0') +
      Math.round(b * 255).toString(16).padStart(2, '0');
    colors[i] = hex.toLowerCase();
  }
  return colors;
}

/**
 * Parse Ghostty config and extract ANSI palette colors as hex.
 * Format: palette = index=#rrggbb
 */
function parseGhosttyAnsiColors(config: string): string[] {
  const colors: string[] = [];
  const regex = /palette\s*=\s*(\d+)=(#[0-9a-fA-F]{6})/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(config)) !== null) {
    colors[parseInt(match[1])] = match[2].toLowerCase();
  }
  return colors;
}
```
