---
title: "MVP Architecture"
date: 2026-03-02
type: architecture
scope: mvp
status: active
---

# MVP Architecture

Everything an agent needs to understand before building the Delightful Design System MVP (Phases 0--7, excluding Phase 6).

---

## 1. System Overview

The Delightful Design System is a single design language defined once and propagated to every tool in a developer's workspace -- editor, terminal, notes app, shell prompt, and any web application built with it. The same warm palette, the same solid shadows, the same typographic voice appear everywhere.

**Aesthetic**: Neo-brutalist. Solid shadows (never blurred), thick borders (always 2px), warm backgrounds (cream in light mode, amber-dark in dark mode), and bold typography. Intentionally physical and tactile -- the opposite of flat, generic SaaS design.

**Color science**: Built on OKLCH, a perceptually uniform color space where equal numeric steps produce equal perceived differences in lightness. This is a genuine technical advantage over HSL -- it means a pink-400 and a cyan-400 look equally vivid without manual tuning.

**Token model**: A strict 3-tier architecture enforced by CSS cascade layers. Primitives (raw color) feed semantic tokens (contextual meaning) which feed component tokens (usage). Components never reference primitives directly.

**Interaction pattern**: Lift/press. Interactive elements lift on hover (shadow escalation, Y-translate) and press flat on active (shadow collapse, XY-translate). This physical metaphor is uniform across all interactive components.

---

## 2. 3-Tier Token Architecture

### Tier 1: Primitives (44 tokens)

Raw OKLCH color values with no semantic meaning. Named by family and intensity. Static -- they do not change between themes.

```css
--primitive-pink-400: oklch(0.640 0.270 350);
--primitive-neutral-100: oklch(0.960 0.010 70);
```

**7 color families:**

| Family | Hue | Role | Stops |
|--------|-----|------|-------|
| Neutral | 70 (60 for deep darks) | Backgrounds, text, borders | 14 (0--950) |
| Pink | 350 | Primary brand | 5 (100--500) |
| Red | 20 | Danger/error | 5 (100--500) |
| Gold | 85 | Warning/highlight | 5 (100--500) |
| Cyan | 210 | Tertiary brand | 5 (100--500) |
| Green | 148 | Success | 5 (100--500) |
| Purple | 300 | Creative/violet | 5 (100--500) |

Neutral uses warm hue 70 (cream/amber) -- never cold gray. Stops 800--950 shift to hue 60 for warmer deep darks.

### Tier 2: Semantic Tokens (~52 tokens)

What values mean in context. Theme-aware -- light and dark modes are separate sets of mappings against the same primitives.

```css
/* Light */
--bg-page: oklch(0.982 0.008 70);        /* warm cream */
--accent-primary: oklch(0.640 0.270 350); /* hot pink */
--shadow-md: 4px 4px 0 var(--border-default); /* dark shadow on light */

/* Dark */
--bg-page: oklch(0.140 0.014 65);        /* warm dark */
--accent-primary: oklch(0.700 0.230 350); /* brighter pink */
--shadow-md: 4px 4px 0 oklch(0.92 0.010 65); /* cream shadow on dark */
```

**Categories:**
- **Backgrounds** (5): page, surface, elevated, subtle, muted
- **Text** (5): primary, secondary, muted, on-accent, on-gold
- **Borders** (3): default, strong, subtle
- **Accents** (24): 6 families x 4 variants (base, hover, subtle, text)
- **Status** (4): info -> primary, error -> danger, warning -> gold, success -> green
- **Shadows** (9): sm/md/lg sizes + 6 colored variants
- **Focus/Overlay** (2): focus ring, overlay background

### Tier 3: Component Tokens (~80 tokens)

How the system is used by UI elements. References semantic tokens -- never primitives. These do not change between themes; they reference semantic tokens that handle the theme switch.

```css
--btn-primary-bg: var(--accent-primary);
--btn-primary-text: var(--text-on-accent);
--toggle-on-bg: var(--accent-primary);
```

Includes all foundation tokens (font families, fluid type scale, fixed UI text scale, spacing, radius, control heights, motion durations, easing functions, z-index, container widths) plus component-specific color aliases (button, badge, toggle, chart).

### The No-Primitive Rule

**Components must NEVER reference `--primitive-*` tokens directly.** The reference chain is:

```
Primitive  -->  Semantic  -->  Component  -->  CSS usage
```

When a theme changes, only the semantic layer is swapped. If a component directly referenced `--primitive-pink-400`, it would not respond to the dark theme override at `--accent-primary`.

This rule is enforced by Biome linter (catches `--primitive-` references in component-layer CSS).

**Known exception**: The toggle component references `var(--primitive-neutral-0)` for the knob color (always white regardless of theme) and `var(--primitive-neutral-300)` for the off-state background. These are acknowledged intentional exceptions, not bugs to fix.

---

## 3. Cascade Layer Model

The layer order is declared once in `reset.css`:

```css
@layer reset, primitives, semantic, component, utilities;
```

### Layer Priorities (lowest to highest)

| Priority | Layer | What Lives Here | File(s) |
|----------|-------|----------------|---------|
| 1 (lowest) | `reset` | Box-sizing, margins, scroll, `:focus-visible`, reduced-motion gate, image resets | `src/reset.css` |
| 2 | `primitives` | 44 `--primitive-*` OKLCH values on `:root` | `src/tokens.css` (generated) |
| 3 | `semantic` | ~52 semantic tokens, light on `:root, [data-theme="light"]`, dark on `[data-theme="dark"]` | `src/tokens.css` (generated) |
| 4 | `component` | Foundation tokens (Tier 3) + all component styles | `src/foundation.css` + `src/components/*.css` |
| 5 (highest) | `utilities` | ~28 utility classes | `src/utilities.css` |

**Key rules:**
- Later layers override earlier layers regardless of selector specificity
- Unlayered consumer CSS has HIGHER priority than all layers (intentional -- consumers can always override)
- Every component file wraps ALL its rules in `@layer component { }`
- The `@layer` order declaration MUST appear before any `@layer` blocks. It lives in `reset.css`.
- No component file may declare or use `@layer reset`, `@layer primitives`, `@layer semantic`, or `@layer utilities`

---

## 4. Color Authority Model

The system uses two authority modes for color values:

### OKLCH-Authoritative (CSS Platforms)

OKLCH is the canonical format for CSS-native platforms. The browser renders OKLCH natively -- no conversion step.

| Platform | Format | Conversion |
|----------|--------|------------|
| Web (CSS) | `oklch()` custom properties | None needed |
| Obsidian | OKLCH via CSS | None needed |

**No hex conversion for CSS outputs.** OKLCH values from the palette are written directly into `tokens.css`.

### Hex-Authoritative (Terminal Platforms)

Terminal hex values are **hand-tuned** -- NOT derived from OKLCH via conversion. OKLCH to hex conversion can lose nuance in terminal color renderers, so terminal palettes are maintained as hex and are the source of truth for:

| Platform | Format | Source |
|----------|--------|--------|
| VS Code | Hex JSON (editor/UI via culori conversion; ANSI uses hand-tuned hex) | OKLCH -> hex via `culori` + `clampChroma()` for editor; `palette.terminal` hex for ANSI |
| Ghostty | Hex plain-text | `palette.terminal` hex values |
| iTerm2 | RGB floats (XML plist) | `palette.terminal` hex -> float |
| Starship | Hex TOML | `palette.terminal` hex values |

Terminal hex values are stored in `palettes/delightful.json` under the `terminal` key with `light` and `dark` sub-keys, each containing `foreground`, `background`, `cursor`, and `ansi` (16-element hex array).

---

## 5. Emitter Contract

All emitters implement the same pure-function interface:

```js
/**
 * @param {object} palette - Parsed, validated palette JSON
 * @param {object} [options] - Emitter-specific options
 * @returns {{ files: Array<{ path: string, content: string }>, warnings: string[] }}
 */
export function emit(palette, options = {}) {
  return {
    files: [{ path: 'relative/to/repo/root', content: 'file contents' }],
    warnings: []
  };
}
```

### Contract Rules

- **Pure functions**: Emitters must not read files, write files, or perform network calls
- **`files` array**: Each entry has a `path` (relative to repo root) and `content` (full file content as string)
- **`warnings` array**: Human-readable strings for non-fatal issues (empty array if none)
- **Errors**: Emitters throw on fatal conditions; the orchestrator catches and reports with emitter name
- **Orchestrator handles all writes**: Only `emitters/orchestrator.mjs` performs file I/O

### Build Fails Fast

Validation runs before any emitter. If palette schema validation or WCAG contrast checks fail, the pipeline aborts immediately with a specific error message. No files are written.

---

## 6. Component CSS Architecture

### One Component Per File

Each component lives in its own file in `src/components/`. File name matches component name: `button.css`, `card.css`, `toast.css`.

### All Rules Wrapped in `@layer component`

```css
/* src/components/button.css */
@layer component {
  .btn { /* ... */ }
  .btn:hover { /* ... */ }
  .btn-primary { /* ... */ }
  .btn:disabled { /* ... */ }
}
```

### No Cross-Component Dependencies

Components depend only on tokens (from `tokens.css`) and foundation values (from `foundation.css`). No component imports another component's CSS. Each component can be imported in isolation: tokens + foundation + component = works.

### No `@import` Statements

Component files contain only CSS rules. No `@import` statements inside component files.

### Bundle Entry Point

`src/components/index.css` is `@import` only -- it imports every individual component file. Consumers can import this for everything, or import individual files for tree-shaking.

---

## 7. Theme System

### `data-theme` Attribute

Theme switching uses the `data-theme` attribute on `<html>`:

```html
<html lang="en" data-theme="light">
<html lang="en" data-theme="dark">
```

### CSS Selectors

```css
@layer semantic {
  :root,
  [data-theme="light"] {
    /* Light values -- also the default fallback on :root */
  }

  [data-theme="dark"] {
    /* Dark overrides */
  }
}
```

The `:root` selector ensures light values are the default even if no `data-theme` attribute is set.

### JavaScript Theme Controller

```
1. Read localStorage.getItem('delightful-theme')
2. If stored value is "light" or "dark" -> use it
3. Else -> query OS preference via matchMedia('(prefers-color-scheme: dark)')
   - If matches -> apply "dark"
   - Else -> apply "light"
4. Set data-theme attribute on <html>
```

- `localStorage` stores explicit user choice
- OS preference (`prefers-color-scheme`) is only a silent initialization fallback
- Once user clicks the toggle, their choice is locked and OS changes are ignored
- Use `document.startViewTransition()` when available for smooth cross-fade
- Default theme is light

### No `prefers-color-scheme` CSS Media Query

The theme system does NOT use `@media (prefers-color-scheme)` as a primary mechanism. Theme state is controlled exclusively through the `data-theme` attribute. The media query is only read by JavaScript for initialization.

---

## 8. Lift/Press Interaction Pattern

All interactive components follow the same physical metaphor -- objects that lift when you reach for them and press flat when you push them.

| State | Transform | Shadow | Other |
|-------|-----------|--------|-------|
| **Base** | `none` | `var(--shadow-sm)` (e.g., `2px 2px 0 var(--border-default)`) | Standard cursor |
| **Hover** | `translateY(-2px)` | Shadow escalates one size (sm -> md, or md -> lg) | Pointer cursor |
| **Active/Press** | `translate(2px, 2px)` | Shadow collapses to `0 0 0` (object is flush) | |
| **Disabled** | `none` | Base shadow retained | `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none` |
| **Focus-visible** | (inherits current state) | (inherits current state) | `outline: 2px solid var(--focus-ring)` with `outline-offset: 2px` |

This applies uniformly to: buttons, cards, tiles, badges, pagination buttons, sidebar items, and any other interactive element. The consistency creates a learnable physical language.

### Shadow Sizes

All shadows are solid (zero blur) -- the signature neo-brutalist treatment:

- **sm**: `2px 2px 0` -- subtle depth (buttons, badges)
- **md**: `4px 4px 0` -- standard depth (cards, alerts)
- **lg**: `8px 8px 0` -- maximum depth (hovered cards, tiles)
- **Colored**: `4px 4px 0` in accent color (featured cards, colored alerts)

---

## 9. Build Pipeline

`npm run build` sequence, managed by `emitters/orchestrator.mjs`:

```
npm run build
  |
  +-- 1. Validate palette JSON against schema (ajv)
  +-- 2. Run WCAG contrast checks on 10 semantic pairs (both themes)
  +-- 3. Emit tokens.css (OKLCH custom properties, Tier 1 + 2, light/dark)
  +-- 4. Emit VS Code themes (2 JSON files, ~324 color mappings, hex via culori)
  +-- 5. Emit Obsidian theme (CSS with --d-* namespace, OKLCH direct)
  +-- 6. Emit Ghostty configs (2 .conf files, hex from terminal authority)
  +-- 7. Emit iTerm2 configs (2 .itermcolors plist files, RGB floats from hex)
  +-- 8. Emit Starship config (TOML with hex colors)
  +-- 9. Emit Tailwind preset (var() references to semantic tokens)
  +-- 10. Report: files written, tokens emitted, warnings
```

### Key Properties

- **Deterministic**: Same input always produces same output
- **Single command**: One `npm run build` generates all platform outputs
- **Fail-fast**: Validation runs before any emitter; failures abort immediately
- **Pure emitters**: All emitters are pure functions; orchestrator handles all I/O
- **Color propagation**: Changing a value in `palettes/delightful.json` and rebuilding updates every platform port automatically

### File Dependency Graph

```
palettes/delightful.json          <-- EDIT HERE for color changes
        |
        +---> emitters/css.mjs
        |         +---> src/tokens.css           <-- DO NOT EDIT (generated)
        |
        +---> emitters/vscode.mjs
        |         +---> ports/vscode/themes/*.json
        |
        +---> emitters/obsidian.mjs
        |         +---> ports/obsidian/theme.css
        |
        +---> emitters/ghostty.mjs
        |         +---> ports/ghostty/*.conf
        |
        +---> emitters/iterm2.mjs
        |         +---> ports/iterm2/*.itermcolors
        |
        +---> emitters/starship.mjs
        |         +---> ports/starship/starship.toml
        |
        +---> emitters/tailwind.mjs
                  +---> packages/tailwind/dist/preset.js
```

### Authored vs. Generated

**Authored** (never overwritten by build):
- `palettes/delightful.json`, `palettes/palette.schema.json`
- All `emitters/*.mjs`
- `src/foundation.css`, `src/reset.css`, `src/utilities.css`, `src/motion/motion.css`
- All `src/components/*.css`
- All test files, config files, documentation HTML

**Generated** (overwritten on every build):
- `src/tokens.css`
- All files in `ports/` (VS Code, Obsidian, Ghostty, iTerm2, Starship outputs)
- `packages/tailwind/dist/preset.js`

### Component Bundling

Component bundling is a separate step from the emitter pipeline:

```
npm run build:components
```

This concatenates all `src/components/*.css` into `dist/components.css` (full bundle) and copies individual files to `dist/components/*.css` (tree-shakeable).
