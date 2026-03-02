---
title: "Typography"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Typography

> Complete font, type scale, letter spacing, and line height specification for the Delightful Design System.

Cross-references: [[token-tiers]] (where these tokens live in the cascade), [[palette-schema]] (color tokens used with type).

---

## 1. Font Family Declarations

Two font families are defined as component-layer tokens on `:root` inside `@layer component`.

### 1.1 Sans-Serif (Primary)

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
```

| Position | Font | Notes |
|---|---|---|
| 1 | `'Inter'` | Primary typeface. Loaded via Google Fonts with `opsz` 14-32, weight 100-900, italic support. Feature settings: `"cv02", "cv03", "cv04", "cv11"` (applied on `body`). |
| 2 | `system-ui` | OS default sans-serif |
| 3 | `-apple-system` | Legacy macOS/iOS fallback |
| 4 | `sans-serif` | Generic fallback |

Inter is loaded with the following Google Fonts URL:

```
https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap
```

### 1.2 Monospace

```css
--font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;
```

| Position | Font | Notes |
|---|---|---|
| 1 | `'JetBrains Mono'` | Primary monospace. Loaded via Google Fonts with weight 100-800, italic support. |
| 2 | `ui-monospace` | OS default monospace |
| 3 | `'Cascadia Code'` | Windows/VS Code fallback |
| 4 | `monospace` | Generic fallback |

JetBrains Mono is loaded with the following Google Fonts URL:

```
https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap
```

---

## 2. Fluid Type Scale

Eight steps defined as component-layer tokens on `:root` inside `@layer component`. These use `clamp()` with a `vi` (viewport inline) unit for fluid scaling.

The scale uses a major third ratio (~1.2) between steps.

| CSS Custom Property | `clamp()` Formula | Approx Min (px) | Approx Max (px) |
|---|---|---|---|
| `--step--2` | `clamp(0.694rem, 0.650rem + 0.22vi, 0.8rem)` | ~11.1 | ~12.8 |
| `--step--1` | `clamp(0.833rem, 0.775rem + 0.29vi, 1rem)` | ~13.3 | 16 |
| `--step-0` | `clamp(1rem, 0.913rem + 0.43vi, 1.25rem)` | 16 | 20 |
| `--step-1` | `clamp(1.2rem, 1.074rem + 0.63vi, 1.5625rem)` | ~19.2 | 25 |
| `--step-2` | `clamp(1.44rem, 1.261rem + 0.89vi, 1.953rem)` | ~23 | ~31.2 |
| `--step-3` | `clamp(1.728rem, 1.480rem + 1.24vi, 2.441rem)` | ~27.6 | ~39 |
| `--step-4` | `clamp(2.074rem, 1.734rem + 1.70vi, 3.052rem)` | ~33.2 | ~48.8 |
| `--step-5` | `clamp(2.488rem, 2.028rem + 2.30vi, 3.815rem)` | ~39.8 | ~61 |

### Where the fluid scale is used

The fluid type scale is for **content typography** -- headings, body text, and prose. It scales with the viewport to maintain comfortable reading sizes across screen widths.

| Usage | Token | Weight | Tracking | Leading |
|---|---|---|---|---|
| Section title | `--step-3` | 800 | `--tracking-tighter` | `--leading-tight` |
| Subsection title | `--step-1` | 650 | `--tracking-tight` | (inherited) |
| Body text / base | `--step-0` | (inherited, 400) | (none) | `--leading-normal` |
| Small body text | `--step--1` | (inherited) | (none) | (inherited) |
| Caption / fine print | `--step--2` | (inherited) | (none) | (inherited) |

---

## 3. Fixed UI Text Scale

Six fixed-size tokens for UI controls. These do **not** scale with the viewport -- they remain at exact pixel sizes for consistent interactive element sizing.

Defined as component-layer tokens on `:root` inside `@layer component`.

| CSS Custom Property | Value | Pixel Equivalent | Usage |
|---|---|---|---|
| `--ui-text-2xs` | `0.6875rem` | 11px | Badges, table headers |
| `--ui-text-xs` | `0.75rem` | 12px | Captions, hints, form errors |
| `--ui-text-sm` | `0.8125rem` | 13px | Sidebar, breadcrumbs, small buttons |
| `--ui-text-md` | `0.875rem` | 14px | Inputs, selects, tabs |
| `--ui-text-lg` | `0.9375rem` | 15px | Medium buttons |
| `--ui-text-xl` | `1.0625rem` | 17px | Large buttons |

### When to use fixed vs. fluid

- **Fluid scale (`--step-*`)**: Content headings, body paragraphs, prose -- anything the user reads at length.
- **Fixed scale (`--ui-text-*`)**: Buttons, inputs, badges, tabs, breadcrumbs, form labels -- UI chrome that must stay a consistent size for usability.

---

## 4. Letter Spacing Tokens

Three negative tracking tokens for tighter headline typesetting. Defined on `:root` inside `@layer component`.

| CSS Custom Property | Value | Usage |
|---|---|---|
| `--tracking-tight` | `-0.02em` | Subsection titles (`--step-1`), general tight headings |
| `--tracking-tighter` | `-0.03em` | Section titles (`--step-3`), major headings |
| `--tracking-tightest` | `-0.04em` | Hero-level display text (`--step-4` and above) |

All tracking values are negative because the system uses tight, impactful headline typesetting. Body text does not use letter spacing tokens -- it inherits the browser default (0).

---

## 5. Line Height Tokens

Five line height tokens. Unitless values for proper inheritance. Defined on `:root` inside `@layer component`.

| CSS Custom Property | Value | Usage |
|---|---|---|
| `--leading-none` | `1.0` | Display text, single-line controls, badges |
| `--leading-tight` | `1.15` | Headings (`--step-2` and above) |
| `--leading-snug` | `1.3` | Sub-headings, compact paragraphs |
| `--leading-normal` | `1.55` | Body text (set on `body` element in the reset layer) |
| `--leading-relaxed` | `1.65` | Section descriptions, long-form content |

---

## 6. Body Element Baseline

The `body` element is styled in `@layer reset` with the following typography baseline:

```css
body {
  font-family: var(--font-sans);
  font-size: var(--step-0);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}
```

| Property | Value | Notes |
|---|---|---|
| `font-family` | `var(--font-sans)` | Inter with fallbacks |
| `font-size` | `var(--step-0)` | Fluid base size (16px - 20px) |
| `line-height` | `var(--leading-normal)` | 1.55 -- generous for readability |
| `color` | `var(--text-primary)` | Semantic text color (theme-aware) |
| `-webkit-font-smoothing` | `antialiased` | Subpixel antialiasing disabled for crisp rendering |
| `-moz-osx-font-smoothing` | `auto` | Firefox default rendering |
| `font-feature-settings` | `"cv02", "cv03", "cv04", "cv11"` | Inter alternate character variants for improved readability |

---

## 7. Implementation CSS

Complete CSS for an implementing agent to copy:

```css
@layer component {
  :root {
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;

    --step--2: clamp(0.694rem, 0.650rem + 0.22vi, 0.8rem);
    --step--1: clamp(0.833rem, 0.775rem + 0.29vi, 1rem);
    --step-0: clamp(1rem, 0.913rem + 0.43vi, 1.25rem);
    --step-1: clamp(1.2rem, 1.074rem + 0.63vi, 1.5625rem);
    --step-2: clamp(1.44rem, 1.261rem + 0.89vi, 1.953rem);
    --step-3: clamp(1.728rem, 1.480rem + 1.24vi, 2.441rem);
    --step-4: clamp(2.074rem, 1.734rem + 1.70vi, 3.052rem);
    --step-5: clamp(2.488rem, 2.028rem + 2.30vi, 3.815rem);

    --tracking-tight: -0.02em;
    --tracking-tighter: -0.03em;
    --tracking-tightest: -0.04em;

    --leading-none: 1.0;
    --leading-tight: 1.15;
    --leading-snug: 1.3;
    --leading-normal: 1.55;
    --leading-relaxed: 1.65;

    --ui-text-2xs: 0.6875rem;   /* 11px */
    --ui-text-xs:  0.75rem;     /* 12px */
    --ui-text-sm:  0.8125rem;   /* 13px */
    --ui-text-md:  0.875rem;    /* 14px */
    --ui-text-lg:  0.9375rem;   /* 15px */
    --ui-text-xl:  1.0625rem;   /* 17px */
  }
}
```
