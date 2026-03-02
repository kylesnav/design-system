---
title: "Obsidian Emitter Specification"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Obsidian Emitter Specification

> Defines how `palettes/delightful.json` is transformed into an Obsidian community theme CSS file, including the `--primitive-*` to `--d-*` namespace rename, native `.theme-light` / `.theme-dark` selectors, and the Style Settings plugin configuration block.

Cross-references: [[palette-schema]] (input format), [[css-emitter]] (sister emitter for web), [[orchestrator]] (build pipeline).

---

## 1. File & Module

```
emitters/obsidian.mjs
```

Pure function module. No file I/O — returns output strings for the orchestrator to write.

---

## 2. Interface

```js
/**
 * @param {object} palette - Parsed palette JSON (validated against schema)
 * @param {object} [options] - Emitter options
 * @param {string} [options.themeName="Delightful"] - Display name in Obsidian settings
 * @returns {{ files: Array<{ path: string, content: string }>, warnings: string[] }}
 */
export function emit(palette, options = {}) {
  // ...
  return {
    files: [
      { path: 'ports/obsidian/theme.css', content: '...' }
    ],
    warnings: []
  };
}
```

### Contract

- **Input**: The full palette object (already validated).
- **Output**: A single CSS file for the Obsidian theme plus any warnings.
- **Pure function**: No side effects, no file reads, no network calls.

---

## 3. The `--primitive-*` to `--d-*` Rename Rule

Obsidian's CSS variable namespace shares the global `:root` scope with the app's internal variables. To avoid collisions, all Delightful tokens use the `--d-` prefix in the Obsidian theme.

### 3.1 Primitive Tokens

| Web CSS Property | Obsidian CSS Property |
|---|---|
| `--primitive-neutral-0` | `--d-neutral-0` |
| `--primitive-neutral-25` | `--d-neutral-25` |
| `--primitive-neutral-950` | `--d-neutral-950` |
| `--primitive-pink-400` | `--d-pink-400` |
| `--primitive-red-400` | `--d-red-400` |
| `--primitive-gold-400` | `--d-gold-400` |
| `--primitive-cyan-400` | `--d-cyan-400` |
| `--primitive-green-400` | `--d-green-400` |
| `--primitive-purple-400` | `--d-purple-400` |

**Rule**: Strip the `primitive-` prefix, add the `d-` prefix. `--primitive-{family}-{stop}` becomes `--d-{family}-{stop}`.

### 3.2 Semantic Tokens

| Web CSS Property | Obsidian CSS Property |
|---|---|
| `--bg-page` | `--d-bg-page` |
| `--text-primary` | `--d-text-primary` |
| `--accent-primary` | `--d-accent-primary` |
| `--border-default` | `--d-border-default` |
| `--shadow-md` | `--d-shadow-md` |

**Rule**: Add the `--d-` prefix. `--{token}` becomes `--d-{token}`.

### 3.3 Internal References

When a token value references another token via `var()`, the reference must also be updated to the `--d-` namespace:

| Web CSS | Obsidian CSS |
|---|---|
| `var(--accent-primary)` | `var(--d-accent-primary)` |
| `var(--border-default)` | `var(--d-border-default)` |
| `var(--text-primary)` | `var(--d-text-primary)` |
| `var(--primitive-neutral-300)` | `var(--d-neutral-300)` |

---

## 4. OKLCH Used Directly

Unlike the VS Code emitter, the Obsidian emitter does **not** convert OKLCH to hex. Obsidian runs in a Chromium-based Electron shell that supports OKLCH natively via the `oklch()` CSS function. Values are emitted as-is from the palette JSON.

---

## 5. CSS Selectors

Obsidian uses its own theme class system, not `data-theme` attributes.

| Obsidian Selector | Purpose | Equivalent Web Selector |
|---|---|---|
| `.theme-light` | Light mode styles | `:root, [data-theme="light"]` |
| `.theme-dark` | Dark mode styles | `[data-theme="dark"]` |
| `body` | Theme-independent tokens (primitives) | `:root` |

The theme file uses `body` for primitives (always available regardless of theme) and `.theme-light` / `.theme-dark` for semantic tokens that change between modes.

---

## 6. Obsidian-Specific CSS Variable Overrides

The theme must override Obsidian's internal CSS variables to integrate with native UI elements. These map Delightful semantic tokens to Obsidian's expected variable names.

### 6.1 Core Background & Text

| Obsidian Variable | Delightful Mapping | Purpose |
|---|---|---|
| `--background-primary` | `var(--d-bg-page)` | Main content area bg |
| `--background-primary-alt` | `var(--d-bg-surface)` | Sidebar, alt panels |
| `--background-secondary` | `var(--d-bg-surface)` | File explorer bg |
| `--background-secondary-alt` | `var(--d-bg-subtle)` | Hover states in sidebar |
| `--background-modifier-border` | `var(--d-border-default)` | Borders |
| `--background-modifier-border-hover` | `var(--d-border-strong)` | Border hover |
| `--background-modifier-border-focus` | `var(--d-accent-primary)` | Border focus |
| `--background-modifier-form-field` | `var(--d-bg-elevated)` | Input fields |
| `--background-modifier-hover` | `var(--d-bg-subtle)` | Generic hover bg |
| `--background-modifier-active-hover` | `var(--d-bg-muted)` | Active hover bg |
| `--background-modifier-success` | `var(--d-accent-green-subtle)` | Success bg |
| `--background-modifier-error` | `var(--d-accent-danger-subtle)` | Error bg |

### 6.2 Text Colors

| Obsidian Variable | Delightful Mapping | Purpose |
|---|---|---|
| `--text-normal` | `var(--d-text-primary)` | Body text |
| `--text-muted` | `var(--d-text-secondary)` | Secondary text |
| `--text-faint` | `var(--d-text-muted)` | Tertiary/hint text |
| `--text-on-accent` | `var(--d-text-on-accent)` | Text on accent bg |
| `--text-error` | `var(--d-accent-danger-text)` | Error message text |
| `--text-success` | `var(--d-accent-green-text)` | Success message text |
| `--text-selection` | `var(--d-accent-primary-subtle)` | Text selection bg |
| `--text-highlight-bg` | `var(--d-accent-gold-subtle)` | Highlighted text bg |
| `--text-accent` | `var(--d-accent-primary)` | Accent-colored text |
| `--text-accent-hover` | `var(--d-accent-primary-hover)` | Accent text hover |

### 6.3 Interactive Elements

| Obsidian Variable | Delightful Mapping | Purpose |
|---|---|---|
| `--interactive-normal` | `var(--d-bg-surface)` | Default interactive bg |
| `--interactive-hover` | `var(--d-bg-subtle)` | Interactive hover bg |
| `--interactive-accent` | `var(--d-accent-primary)` | Primary interactive accent |
| `--interactive-accent-hover` | `var(--d-accent-primary-hover)` | Accent hover |
| `--interactive-accent-hsl` | (computed HSL fallback) | HSL version for Obsidian internals |

### 6.4 Headings

| Obsidian Variable | Delightful Mapping | Purpose |
|---|---|---|
| `--h1-color` | `var(--d-accent-primary-text)` | H1 heading color |
| `--h2-color` | `var(--d-accent-cyan-text)` | H2 heading color |
| `--h3-color` | `var(--d-accent-gold-text)` | H3 heading color |
| `--h4-color` | `var(--d-accent-green-text)` | H4 heading color |
| `--h5-color` | `var(--d-accent-purple-text)` | H5 heading color |
| `--h6-color` | `var(--d-text-secondary)` | H6 heading color |

### 6.5 Shadows & Elevation

Obsidian shadows are overridden with the Delightful neo-brutalist solid shadow system:

| Obsidian Variable | Delightful Mapping | Purpose |
|---|---|---|
| `--shadow-s` | `var(--d-shadow-sm)` | Small shadow |
| `--shadow-l` | `var(--d-shadow-md)` | Large shadow |

### 6.6 Scrollbar

| Obsidian Variable | Delightful Mapping | Purpose |
|---|---|---|
| `--scrollbar-bg` | `transparent` | Scrollbar track |
| `--scrollbar-thumb-bg` | `var(--d-text-muted)` | Scrollbar thumb |
| `--scrollbar-active-thumb-bg` | `var(--d-text-secondary)` | Active thumb |

### 6.7 Code Blocks

| Obsidian Variable | Delightful Mapping | Purpose |
|---|---|---|
| `--code-normal` | `var(--d-text-primary)` | Code text |
| `--code-background` | `var(--d-bg-muted)` | Code block bg |
| `--code-comment` | `var(--d-text-muted)` | Code comments |

---

## 7. Style Settings Plugin Configuration

The theme includes a YAML comment block at the top of the CSS file that enables user-configurable options via the [Style Settings](https://github.com/mgmeyers/obsidian-style-settings) Obsidian plugin.

### 7.1 YAML Block Structure

```css
/* @settings

name: Delightful Theme
id: delightful-theme
settings:
  -
    id: accent-color
    title: Accent Color
    description: Choose the primary accent color family
    type: class-select
    allowEmpty: false
    default: accent-pink
    options:
      -
        label: Pink (Default)
        value: accent-pink
      -
        label: Cyan
        value: accent-cyan
      -
        label: Gold
        value: accent-gold
      -
        label: Green
        value: accent-green
      -
        label: Purple
        value: accent-purple
      -
        label: Red
        value: accent-red
  -
    id: shadow-style
    title: Shadow Style
    description: Neo-brutalist solid shadows or no shadows
    type: class-select
    allowEmpty: false
    default: shadow-brutalist
    options:
      -
        label: Neo-Brutalist (Default)
        value: shadow-brutalist
      -
        label: Subtle
        value: shadow-subtle
      -
        label: None
        value: shadow-none
  -
    id: border-weight
    title: Border Weight
    description: Thickness of component borders
    type: variable-number-slider
    default: 2
    min: 1
    max: 3
    step: 0.5
    format: px
  -
    id: heading-scale
    title: Heading Scale
    description: Size multiplier for headings
    type: class-select
    allowEmpty: false
    default: heading-normal
    options:
      -
        label: Compact
        value: heading-compact
      -
        label: Normal (Default)
        value: heading-normal
      -
        label: Large
        value: heading-large

*/
```

### 7.2 CSS Rules for Style Settings Options

The emitter generates CSS rules that respond to the Style Settings classes:

**Accent color switching** — remaps `--d-accent-primary` and related tokens:

```css
body.accent-cyan {
  --d-accent-primary: var(--d-accent-cyan);
  --d-accent-primary-hover: var(--d-accent-cyan-hover);
  --d-accent-primary-subtle: var(--d-accent-cyan-subtle);
  --d-accent-primary-text: var(--d-accent-cyan-text);
  --interactive-accent: var(--d-accent-cyan);
  --interactive-accent-hover: var(--d-accent-cyan-hover);
}
/* Repeat for gold, green, purple, red */
```

**Shadow style switching**:

```css
body.shadow-subtle {
  --d-shadow-sm: 0 1px 3px oklch(0 0 0 / 0.08);
  --d-shadow-md: 0 2px 6px oklch(0 0 0 / 0.10);
  --d-shadow-lg: 0 4px 12px oklch(0 0 0 / 0.12);
}

body.shadow-none {
  --d-shadow-sm: none;
  --d-shadow-md: none;
  --d-shadow-lg: none;
}
```

**Heading scale**:

```css
body.heading-compact {
  --h1-size: 1.6em;
  --h2-size: 1.35em;
  --h3-size: 1.15em;
}

body.heading-large {
  --h1-size: 2.4em;
  --h2-size: 1.9em;
  --h3-size: 1.5em;
}
```

---

## 8. Output File Structure

The complete output file `ports/obsidian/theme.css` has this structure:

```css
/* @settings
  ... (Style Settings YAML block — see section 7.1)
*/

/* ============================================================
   Delightful Theme for Obsidian
   Generated from palettes/delightful.json v{version}
   ============================================================ */

/* --- Primitives (theme-independent) --- */
body {
  --d-neutral-0: oklch(1.00 0.000 0);
  --d-neutral-25: oklch(0.988 0.006 70);
  /* ... all 44 primitive tokens ... */
  --d-purple-500: oklch(0.560 0.260 300);
}

/* --- Semantic: Light --- */
.theme-light {
  --d-bg-page: oklch(0.982 0.008 70);
  --d-bg-surface: oklch(0.995 0.004 70);
  /* ... all semantic tokens (bg, text, border, accent, status, focus, shadow) ... */
  --d-shadow-purple: 4px 4px 0 var(--d-accent-purple);

  /* Obsidian variable overrides */
  --background-primary: var(--d-bg-page);
  --background-primary-alt: var(--d-bg-surface);
  --background-secondary: var(--d-bg-surface);
  --background-secondary-alt: var(--d-bg-subtle);
  --background-modifier-border: var(--d-border-default);
  --background-modifier-border-hover: var(--d-border-strong);
  --background-modifier-border-focus: var(--d-accent-primary);
  --background-modifier-form-field: var(--d-bg-elevated);
  --background-modifier-hover: var(--d-bg-subtle);
  --background-modifier-active-hover: var(--d-bg-muted);
  --text-normal: var(--d-text-primary);
  --text-muted: var(--d-text-secondary);
  --text-faint: var(--d-text-muted);
  --text-on-accent: var(--d-text-on-accent);
  --text-accent: var(--d-accent-primary);
  --text-accent-hover: var(--d-accent-primary-hover);
  --interactive-normal: var(--d-bg-surface);
  --interactive-hover: var(--d-bg-subtle);
  --interactive-accent: var(--d-accent-primary);
  --interactive-accent-hover: var(--d-accent-primary-hover);
  --shadow-s: var(--d-shadow-sm);
  --shadow-l: var(--d-shadow-md);
  /* ... heading colors, code block colors, scrollbar ... */
}

/* --- Semantic: Dark --- */
.theme-dark {
  --d-bg-page: oklch(0.140 0.014 65);
  --d-bg-surface: oklch(0.165 0.015 65);
  /* ... all dark semantic tokens ... */
  --d-shadow-purple: 4px 4px 0 var(--d-accent-purple);

  /* Obsidian variable overrides (same structure, values come from dark semantic) */
  --background-primary: var(--d-bg-page);
  /* ... same overrides as light ... */
}

/* --- Style Settings: Accent color switching --- */
body.accent-cyan { /* ... */ }
body.accent-gold { /* ... */ }
body.accent-green { /* ... */ }
body.accent-purple { /* ... */ }
body.accent-red { /* ... */ }

/* --- Style Settings: Shadow style --- */
body.shadow-subtle { /* ... */ }
body.shadow-none { /* ... */ }

/* --- Style Settings: Heading scale --- */
body.heading-compact { /* ... */ }
body.heading-large { /* ... */ }

/* --- Typography overrides --- */
body {
  --font-text-theme: 'Inter', system-ui, -apple-system, sans-serif;
  --font-monospace-theme: 'JetBrains Mono', ui-monospace, monospace;
}
```

---

## 9. Error Handling

### Warnings

| Condition | Warning |
|---|---|
| Semantic token key not recognized | `"ObsidianEmitter: unknown semantic token '{key}'"` |
| Light/dark key mismatch | `"ObsidianEmitter: light has {n} tokens, dark has {m}"` |

### Errors (thrown)

| Condition | Error |
|---|---|
| `palette.primitives` is missing | `"ObsidianEmitter: palette.primitives is missing"` |
| `palette.semantic.light` is missing | `"ObsidianEmitter: palette.semantic.light is missing"` |
| `palette.semantic.dark` is missing | `"ObsidianEmitter: palette.semantic.dark is missing"` |

---

## 10. Key Differences from CSS Emitter

| Aspect | CSS Emitter | Obsidian Emitter |
|---|---|---|
| **Namespace** | `--primitive-*` / `--{token}` | `--d-*` for all tokens |
| **Selectors** | `:root`, `[data-theme="light"]`, `[data-theme="dark"]` | `body`, `.theme-light`, `.theme-dark` |
| **Cascade layers** | `@layer primitives`, `@layer semantic` | None (Obsidian doesn't support layers) |
| **Color format** | OKLCH (native CSS) | OKLCH (Obsidian uses Chromium) |
| **Extra content** | None | Obsidian variable overrides, Style Settings YAML, typography |
| **Output** | `src/tokens.css` | `ports/obsidian/theme.css` |
