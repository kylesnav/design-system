# CSS Emitter Specification

> Defines how `palettes/delightful.json` is transformed into `src/tokens.css` — the generated CSS custom properties file that delivers Tier 1 (primitive) and Tier 2 (semantic) color tokens to the web platform.

Cross-references: [[palette-schema]] (input format), [[token-tiers]] (tier architecture), [[orchestrator]] (build pipeline).

---

## 1. File & Module

```
emitters/css.mjs
```

Pure function module. No file I/O — returns output strings for the orchestrator to write.

---

## 2. Interface

```js
/**
 * @param {object} palette - Parsed palette JSON (validated against schema)
 * @param {object} [options] - Emitter options
 * @param {boolean} [options.minify=false] - Strip whitespace and comments
 * @returns {{ files: Array<{ path: string, content: string }>, warnings: string[] }}
 */
export function emit(palette, options = {}) {
  // ...
  return {
    files: [
      { path: 'src/tokens.css', content: '/* generated CSS */' }
    ],
    warnings: []
  };
}
```

### Contract

- **Input**: The full palette object (already parsed and validated by the orchestrator). The emitter trusts the schema — it does not re-validate.
- **Output**: A single file entry for `src/tokens.css` plus any warnings.
- **Pure function**: No side effects, no file reads, no network calls.

---

## 3. Input: Palette JSON Structure

The emitter reads these keys from the palette object:

| Key | Purpose |
|---|---|
| `primitives` | Object keyed by family (`neutral`, `pink`, `red`, `gold`, `cyan`, `green`, `purple`), each containing numbered stops with OKLCH string values |
| `semantic.light` | Object of semantic token names to OKLCH string values (or `var()` references for status aliases) |
| `semantic.dark` | Object of semantic token names to OKLCH string values (same keys as `semantic.light`) |

The emitter does **not** read `component`, `terminal`, or metadata fields. Component tokens live in `foundation.css` (authored, not generated). Terminal values are consumed by other emitters.

---

## 4. Token Naming Transformation

### 4.1 Primitives

JSON key path becomes a CSS custom property name with the `--primitive-` prefix.

| JSON Path | CSS Custom Property |
|---|---|
| `primitives.neutral.0` | `--primitive-neutral-0` |
| `primitives.neutral.25` | `--primitive-neutral-25` |
| `primitives.neutral.950` | `--primitive-neutral-950` |
| `primitives.pink.100` | `--primitive-pink-100` |
| `primitives.pink.400` | `--primitive-pink-400` |
| `primitives.red.400` | `--primitive-red-400` |
| `primitives.gold.400` | `--primitive-gold-400` |
| `primitives.cyan.400` | `--primitive-cyan-400` |
| `primitives.green.400` | `--primitive-green-400` |
| `primitives.purple.400` | `--primitive-purple-400` |

**Rule**: `--primitive-{family}-{stop}` where family and stop are taken directly from the JSON keys. Dots in the path become hyphens in the property name.

### 4.2 Semantic Tokens

JSON key names under `semantic.light` and `semantic.dark` map directly to CSS custom property names with the `--` prefix.

| JSON Key | CSS Custom Property |
|---|---|
| `bg-page` | `--bg-page` |
| `text-primary` | `--text-primary` |
| `accent-primary` | `--accent-primary` |
| `border-default` | `--border-default` |
| `status-info` | `--status-info` |
| `focus-ring` | `--focus-ring` |
| `overlay-bg` | `--overlay-bg` |

**Rule**: `--{key}` — no transformation needed, the JSON keys already use the CSS custom property naming convention (kebab-case).

### 4.3 Shadow Tokens

Shadow tokens are **composite values** — they combine CSS offset syntax with color references. The shadow structure is authored in the emitter logic, not stored in the palette JSON. Only the color values come from the palette.

| Token | Light Value | Dark Value |
|---|---|---|
| `--shadow-sm` | `2px 2px 0 var(--border-default)` | `2px 2px 0 oklch(0.92 0.010 65)` |
| `--shadow-md` | `4px 4px 0 var(--border-default)` | `4px 4px 0 oklch(0.92 0.010 65)` |
| `--shadow-lg` | `8px 8px 0 var(--border-default)` | `8px 8px 0 oklch(0.92 0.010 65)` |
| `--shadow-pink` | `4px 4px 0 var(--accent-primary)` | `4px 4px 0 var(--accent-primary)` |
| `--shadow-danger` | `4px 4px 0 var(--accent-danger)` | `4px 4px 0 var(--accent-danger)` |
| `--shadow-gold` | `4px 4px 0 var(--accent-gold)` | `4px 4px 0 var(--accent-gold)` |
| `--shadow-cyan` | `4px 4px 0 var(--accent-cyan)` | `4px 4px 0 var(--accent-cyan)` |
| `--shadow-green` | `4px 4px 0 var(--accent-green)` | `4px 4px 0 var(--accent-green)` |
| `--shadow-purple` | `4px 4px 0 var(--accent-purple)` | `4px 4px 0 var(--accent-purple)` |

The shadow definitions are hardcoded in the emitter. The shadow sizes (2px, 4px, 8px) and zero-blur are neo-brutalist design decisions that do not vary with the palette. The color references (`var(--border-default)`, `var(--accent-*)`) resolve at runtime through the semantic layer.

The dark mode base shadows use a literal OKLCH cream value (`oklch(0.92 0.010 65)`) rather than a `var()` reference — this is the inverted shadow color for visibility on dark backgrounds.

---

## 5. Output: `src/tokens.css`

### 5.1 Full Expected Structure

```css
/* Generated by Delightful CSS emitter — do not edit manually */
/* Source: palettes/delightful.json v{version} */

@layer primitives {
  :root {
    /* Neutral (14 stops) */
    --primitive-neutral-0: oklch(1.00 0.000 0);
    --primitive-neutral-25: oklch(0.988 0.006 70);
    --primitive-neutral-50: oklch(0.980 0.008 70);
    --primitive-neutral-100: oklch(0.960 0.010 70);
    --primitive-neutral-150: oklch(0.940 0.012 70);
    --primitive-neutral-200: oklch(0.920 0.012 70);
    --primitive-neutral-300: oklch(0.860 0.014 70);
    --primitive-neutral-400: oklch(0.750 0.014 70);
    --primitive-neutral-500: oklch(0.600 0.012 70);
    --primitive-neutral-600: oklch(0.480 0.010 70);
    --primitive-neutral-700: oklch(0.350 0.010 70);
    --primitive-neutral-800: oklch(0.250 0.012 60);
    --primitive-neutral-900: oklch(0.180 0.012 60);
    --primitive-neutral-950: oklch(0.140 0.012 60);

    /* Pink (5 stops) */
    --primitive-pink-100: oklch(0.920 0.060 350);
    --primitive-pink-200: oklch(0.840 0.140 350);
    --primitive-pink-300: oklch(0.720 0.220 350);
    --primitive-pink-400: oklch(0.640 0.270 350);
    --primitive-pink-500: oklch(0.560 0.280 350);

    /* Red (5 stops) */
    --primitive-red-100: oklch(0.930 0.050 20);
    --primitive-red-200: oklch(0.850 0.110 20);
    --primitive-red-300: oklch(0.720 0.180 20);
    --primitive-red-400: oklch(0.620 0.220 20);
    --primitive-red-500: oklch(0.540 0.230 20);

    /* Gold (5 stops) */
    --primitive-gold-100: oklch(0.960 0.050 85);
    --primitive-gold-200: oklch(0.920 0.110 85);
    --primitive-gold-300: oklch(0.870 0.160 85);
    --primitive-gold-400: oklch(0.840 0.175 85);
    --primitive-gold-500: oklch(0.820 0.165 84);

    /* Cyan (5 stops) */
    --primitive-cyan-100: oklch(0.930 0.038 210);
    --primitive-cyan-200: oklch(0.850 0.085 210);
    --primitive-cyan-300: oklch(0.740 0.125 210);
    --primitive-cyan-400: oklch(0.650 0.148 210);
    --primitive-cyan-500: oklch(0.570 0.155 210);

    /* Green (5 stops) */
    --primitive-green-100: oklch(0.930 0.042 148);
    --primitive-green-200: oklch(0.840 0.095 148);
    --primitive-green-300: oklch(0.730 0.145 148);
    --primitive-green-400: oklch(0.630 0.170 148);
    --primitive-green-500: oklch(0.540 0.165 148);

    /* Purple (5 stops) */
    --primitive-purple-100: oklch(0.940 0.040 300);
    --primitive-purple-200: oklch(0.860 0.080 300);
    --primitive-purple-300: oklch(0.720 0.160 300);
    --primitive-purple-400: oklch(0.640 0.220 300);
    --primitive-purple-500: oklch(0.560 0.260 300);
  }
}

@layer semantic {
  :root,
  [data-theme="light"] {
    /* Backgrounds */
    --bg-page: oklch(0.982 0.008 70);
    --bg-surface: oklch(0.995 0.004 70);
    --bg-elevated: oklch(1.00 0.00 0);
    --bg-subtle: oklch(0.965 0.012 70);
    --bg-muted: oklch(0.948 0.014 70);

    /* Text */
    --text-primary: oklch(0.200 0.015 60);
    --text-secondary: oklch(0.420 0.015 60);
    --text-muted: oklch(0.560 0.012 60);
    --text-on-accent: oklch(1.00 0.000 0);
    --text-on-gold: oklch(0.220 0.020 70);

    /* Borders */
    --border-default: oklch(0.340 0.025 60);
    --border-strong: oklch(0.250 0.020 60);
    --border-subtle: oklch(0.820 0.015 70);

    /* Accents — Primary (Pink) */
    --accent-primary: oklch(0.640 0.270 350);
    --accent-primary-hover: oklch(0.580 0.280 350);
    --accent-primary-subtle: oklch(0.955 0.040 350);
    --accent-primary-text: oklch(0.560 0.270 350);

    /* Accents — Danger (Red) */
    --accent-danger: oklch(0.620 0.220 20);
    --accent-danger-hover: oklch(0.570 0.230 20);
    --accent-danger-subtle: oklch(0.950 0.040 20);
    --accent-danger-text: oklch(0.570 0.220 20);

    /* Accents — Gold */
    --accent-gold: oklch(0.840 0.175 85);
    --accent-gold-hover: oklch(0.820 0.165 84);
    --accent-gold-subtle: oklch(0.965 0.060 85);
    --accent-gold-text: oklch(0.560 0.170 85);

    /* Accents — Cyan */
    --accent-cyan: oklch(0.650 0.148 210);
    --accent-cyan-hover: oklch(0.600 0.150 210);
    --accent-cyan-subtle: oklch(0.945 0.030 210);
    --accent-cyan-text: oklch(0.560 0.148 210);

    /* Accents — Green */
    --accent-green: oklch(0.630 0.170 148);
    --accent-green-hover: oklch(0.580 0.165 148);
    --accent-green-subtle: oklch(0.945 0.035 148);
    --accent-green-text: oklch(0.520 0.170 148);

    /* Accents — Purple */
    --accent-purple: oklch(0.640 0.220 300);
    --accent-purple-hover: oklch(0.580 0.230 300);
    --accent-purple-subtle: oklch(0.950 0.035 300);
    --accent-purple-text: oklch(0.560 0.230 300);

    /* Status */
    --status-info: var(--accent-primary);
    --status-error: var(--accent-danger);
    --status-warning: var(--accent-gold);
    --status-success: var(--accent-green);

    /* Focus & Overlay */
    --focus-ring: var(--accent-primary);
    --overlay-bg: oklch(0.200 0.015 60 / 0.30);

    /* Shadows — Neo-Brutalist Solid (zero blur) */
    --shadow-sm: 2px 2px 0 var(--border-default);
    --shadow-md: 4px 4px 0 var(--border-default);
    --shadow-lg: 8px 8px 0 var(--border-default);
    --shadow-pink: 4px 4px 0 var(--accent-primary);
    --shadow-danger: 4px 4px 0 var(--accent-danger);
    --shadow-gold: 4px 4px 0 var(--accent-gold);
    --shadow-cyan: 4px 4px 0 var(--accent-cyan);
    --shadow-green: 4px 4px 0 var(--accent-green);
    --shadow-purple: 4px 4px 0 var(--accent-purple);
  }

  [data-theme="dark"] {
    /* Backgrounds — warm dark, hue 65 */
    --bg-page: oklch(0.140 0.014 65);
    --bg-surface: oklch(0.165 0.015 65);
    --bg-elevated: oklch(0.190 0.015 65);
    --bg-subtle: oklch(0.210 0.015 65);
    --bg-muted: oklch(0.180 0.013 65);

    /* Text */
    --text-primary: oklch(0.935 0.008 70);
    --text-secondary: oklch(0.690 0.012 70);
    --text-muted: oklch(0.540 0.010 70);
    --text-on-accent: oklch(1.00 0.000 0);
    --text-on-gold: oklch(0.140 0.014 65);

    /* Borders */
    --border-default: oklch(0.550 0.010 65);
    --border-strong: var(--text-primary);
    --border-subtle: oklch(0.330 0.015 65);

    /* Accents — Primary (Pink, brighter for dark) */
    --accent-primary: oklch(0.700 0.230 350);
    --accent-primary-hover: oklch(0.740 0.220 350);
    --accent-primary-subtle: oklch(0.250 0.065 350);
    --accent-primary-text: oklch(0.750 0.210 350);

    /* Accents — Danger (Red) */
    --accent-danger: oklch(0.660 0.200 20);
    --accent-danger-hover: oklch(0.700 0.190 20);
    --accent-danger-subtle: oklch(0.250 0.055 20);
    --accent-danger-text: oklch(0.720 0.180 20);

    /* Accents — Gold */
    --accent-gold: oklch(0.840 0.170 85);
    --accent-gold-hover: oklch(0.870 0.155 84);
    --accent-gold-subtle: oklch(0.260 0.065 85);
    --accent-gold-text: oklch(0.870 0.155 85);

    /* Accents — Cyan */
    --accent-cyan: oklch(0.720 0.140 210);
    --accent-cyan-hover: oklch(0.760 0.130 210);
    --accent-cyan-subtle: oklch(0.250 0.045 210);
    --accent-cyan-text: oklch(0.780 0.130 210);

    /* Accents — Green */
    --accent-green: oklch(0.680 0.155 148);
    --accent-green-hover: oklch(0.720 0.145 148);
    --accent-green-subtle: oklch(0.250 0.048 148);
    --accent-green-text: oklch(0.740 0.145 148);

    /* Accents — Purple */
    --accent-purple: oklch(0.700 0.200 300);
    --accent-purple-hover: oklch(0.740 0.190 300);
    --accent-purple-subtle: oklch(0.250 0.055 300);
    --accent-purple-text: oklch(0.760 0.180 300);

    /* Status */
    --status-info: var(--accent-primary);
    --status-error: var(--accent-danger);
    --status-warning: var(--accent-gold);
    --status-success: var(--accent-green);

    /* Focus & Overlay */
    --focus-ring: oklch(0.700 0.230 350);
    --overlay-bg: oklch(0 0 0 / 0.60);

    /* Shadows — Inverted (cream on dark) */
    --shadow-sm: 2px 2px 0 oklch(0.92 0.010 65);
    --shadow-md: 4px 4px 0 oklch(0.92 0.010 65);
    --shadow-lg: 8px 8px 0 oklch(0.92 0.010 65);
    --shadow-pink: 4px 4px 0 var(--accent-primary);
    --shadow-danger: 4px 4px 0 var(--accent-danger);
    --shadow-gold: 4px 4px 0 var(--accent-gold);
    --shadow-cyan: 4px 4px 0 var(--accent-cyan);
    --shadow-green: 4px 4px 0 var(--accent-green);
    --shadow-purple: 4px 4px 0 var(--accent-purple);
  }
}
```

### 5.2 Structure Rules

1. **File header comment** includes the emitter name and the palette version string for traceability.
2. **`@layer primitives`** wraps all primitive tokens under a single `:root` selector.
3. **`@layer semantic`** wraps all semantic tokens under `:root, [data-theme="light"]` for light mode (making light the default) and `[data-theme="dark"]` for dark overrides.
4. **Family order** within primitives: neutral, pink, red, gold, cyan, green, purple. Each family gets a comment header.
5. **Stop order** within each family: ascending numeric order (0, 25, 50, 100, ...).
6. **Semantic token order** within each theme block: backgrounds, text, borders, accents (by family: primary, danger, gold, cyan, green, purple), status, focus/overlay, shadows.
7. **No `@layer` declaration statement** in this file. The layer order declaration (`@layer reset, primitives, semantic, component, utilities;`) belongs in `reset.css` or the consuming entry point — not in the generated file. The generated file only uses `@layer primitives { ... }` and `@layer semantic { ... }` blocks.

---

## 6. Generation Logic

### 6.1 Primitive Generation

```
for each family in [neutral, pink, red, gold, cyan, green, purple]:
  for each stop in family (sorted numerically ascending):
    emit `    --primitive-{family}-{stop}: {value};`
```

### 6.2 Semantic Generation (Light)

```
for each token in semantic.light (ordered by category):
  if value is a reference string (e.g., "{accent-primary}"):
    emit `    --{token}: var(--{resolved-name});`
  else:
    emit `    --{token}: {oklch-value};`
```

Reference resolution: Values wrapped in `{curly-braces}` in the palette JSON are token aliases. The emitter resolves `{accent-primary}` to `var(--accent-primary)`.

### 6.3 Semantic Generation (Dark)

Same logic as light, emitted under the `[data-theme="dark"]` selector.

### 6.4 Shadow Generation

Shadow tokens are emitted inline within the semantic blocks. The emitter hardcodes the shadow structure:

```js
const SHADOW_DEFS = {
  light: {
    'shadow-sm':     '2px 2px 0 var(--border-default)',
    'shadow-md':     '4px 4px 0 var(--border-default)',
    'shadow-lg':     '8px 8px 0 var(--border-default)',
    'shadow-pink':   '4px 4px 0 var(--accent-primary)',
    'shadow-danger': '4px 4px 0 var(--accent-danger)',
    'shadow-gold':   '4px 4px 0 var(--accent-gold)',
    'shadow-cyan':   '4px 4px 0 var(--accent-cyan)',
    'shadow-green':  '4px 4px 0 var(--accent-green)',
    'shadow-purple': '4px 4px 0 var(--accent-purple)',
  },
  dark: {
    'shadow-sm':     '2px 2px 0 oklch(0.92 0.010 65)',
    'shadow-md':     '4px 4px 0 oklch(0.92 0.010 65)',
    'shadow-lg':     '8px 8px 0 oklch(0.92 0.010 65)',
    'shadow-pink':   '4px 4px 0 var(--accent-primary)',
    'shadow-danger': '4px 4px 0 var(--accent-danger)',
    'shadow-gold':   '4px 4px 0 var(--accent-gold)',
    'shadow-cyan':   '4px 4px 0 var(--accent-cyan)',
    'shadow-green':  '4px 4px 0 var(--accent-green)',
    'shadow-purple': '4px 4px 0 var(--accent-purple)',
  },
};
```

---

## 7. Complete Example: Input to Output

### Input (excerpt)

```json
{
  "primitives": {
    "pink": {
      "400": "oklch(0.640 0.270 350)"
    }
  },
  "semantic": {
    "light": {
      "accent-primary": "oklch(0.640 0.270 350)"
    },
    "dark": {
      "accent-primary": "oklch(0.700 0.230 350)"
    }
  }
}
```

### Output (excerpt)

```css
@layer primitives {
  :root {
    --primitive-pink-400: oklch(0.640 0.270 350);
  }
}

@layer semantic {
  :root,
  [data-theme="light"] {
    --accent-primary: oklch(0.640 0.270 350);
  }

  [data-theme="dark"] {
    --accent-primary: oklch(0.700 0.230 350);
  }
}
```

---

## 8. Error Handling

### Warnings (collected, reported, do not abort)

| Condition | Warning Message |
|---|---|
| Primitive family has fewer than 5 stops (accent) or 14 stops (neutral) | `"Warning: {family} has {n} stops, expected {expected}"` |
| Semantic token key not recognized as a known category | `"Warning: unknown semantic token '{key}'"` |
| `semantic.light` and `semantic.dark` have different key counts | `"Warning: light has {n} tokens, dark has {m} — key mismatch"` |

### Errors (thrown, abort the pipeline)

| Condition | Error |
|---|---|
| `palette.primitives` is missing or not an object | `"CSSEmitter: palette.primitives is missing or invalid"` |
| `palette.semantic.light` is missing | `"CSSEmitter: palette.semantic.light is missing"` |
| `palette.semantic.dark` is missing | `"CSSEmitter: palette.semantic.dark is missing"` |
| A required primitive family is entirely missing | `"CSSEmitter: required family '{family}' not found in primitives"` |

Required primitive families: `neutral`, `pink`, `red`, `gold`, `cyan`, `green`, `purple`.

---

## 9. What This File Does NOT Contain

- **Component tokens** (Tier 3) — defined in `src/foundation.css` (authored)
- **Reset styles** — defined in `src/reset.css` (authored)
- **Layer order declaration** — defined in the consuming entry point
- **Typography, spacing, radius, motion tokens** — defined in `src/foundation.css` (authored)
- **Hex values** — OKLCH is the native format for CSS; no conversion needed

---

## 10. Token Count

The generated file contains:

| Category | Count |
|---|---|
| Primitive tokens | 44 |
| Semantic tokens (per theme) | 52 |
| **Total CSS custom properties** | **96 unique names** (44 primitives + 52 semantic, with semantic having light + dark values) |
