# Token Tier Architecture

> The Delightful Design System uses a strict 3-tier token hierarchy enforced by CSS cascade layers. This document is the complete inventory of every token in each tier.

Cross-references: [[palette-schema]] (JSON structure and OKLCH values), [[dark-mode]] (how semantic tokens change between themes).

---

## 1. Cascade Layer Order

```css
@layer reset, primitives, semantic, component, utilities;
```

| Layer | Priority | Purpose |
|---|---|---|
| `reset` | Lowest | Box-sizing, margin/padding reset, scroll behavior, base typography, `:focus-visible` |
| `primitives` | Low | Raw OKLCH color scales — no semantic meaning |
| `semantic` | Medium | Theme-aware tokens (bg, text, border, accent, shadow) |
| `component` | High | Foundation tokens (typography, spacing, radius, motion, z-index, containers) + component-specific color aliases + chart/status aliases |
| `utilities` | Highest | Utility classes (overrides) |

Later layers override earlier layers. This means component tokens can override semantic defaults, and utilities override everything.

---

## 2. The Strict Rule

> **Components must NEVER reference primitive tokens directly.**

The reference chain is:

```
Primitive  -->  Semantic  -->  Component  -->  CSS usage
```

A component may reference a semantic token or another component token. It must never reach down to a primitive. The only exceptions are the three `toggle-*` tokens which reference primitives for the knob color (`--primitive-neutral-0`) and the off-state background (`--primitive-neutral-300`). These are intentional because the toggle knob is always white regardless of theme, and the off-state is a fixed neutral.

Why: When a theme changes, only the semantic layer is swapped. If a component directly referenced `--primitive-pink-400`, it would not respond to the dark theme override at `--accent-primary`.

---

## 3. Tier 1 — Primitives

Defined in `@layer primitives` on `:root`. These are raw OKLCH color values. They do not change between themes.

### 3.1 Neutral Scale (14 stops)

| CSS Custom Property | OKLCH Value | Hue |
|---|---|---|
| `--primitive-neutral-0` | `oklch(1.00 0.000 0)` | 0 (achromatic) |
| `--primitive-neutral-25` | `oklch(0.988 0.006 70)` | 70 |
| `--primitive-neutral-50` | `oklch(0.980 0.008 70)` | 70 |
| `--primitive-neutral-100` | `oklch(0.960 0.010 70)` | 70 |
| `--primitive-neutral-150` | `oklch(0.940 0.012 70)` | 70 |
| `--primitive-neutral-200` | `oklch(0.920 0.012 70)` | 70 |
| `--primitive-neutral-300` | `oklch(0.860 0.014 70)` | 70 |
| `--primitive-neutral-400` | `oklch(0.750 0.014 70)` | 70 |
| `--primitive-neutral-500` | `oklch(0.600 0.012 70)` | 70 |
| `--primitive-neutral-600` | `oklch(0.480 0.010 70)` | 70 |
| `--primitive-neutral-700` | `oklch(0.350 0.010 70)` | 70 |
| `--primitive-neutral-800` | `oklch(0.250 0.012 60)` | 60 |
| `--primitive-neutral-900` | `oklch(0.180 0.012 60)` | 60 |
| `--primitive-neutral-950` | `oklch(0.140 0.012 60)` | 60 |

Note: Stops 800-950 shift from hue 70 to hue 60 for warmer deep darks.

### 3.2 Pink Scale (5 stops, hue 350) — Primary Brand

| CSS Custom Property | OKLCH Value |
|---|---|
| `--primitive-pink-100` | `oklch(0.920 0.060 350)` |
| `--primitive-pink-200` | `oklch(0.840 0.140 350)` |
| `--primitive-pink-300` | `oklch(0.720 0.220 350)` |
| `--primitive-pink-400` | `oklch(0.640 0.270 350)` |
| `--primitive-pink-500` | `oklch(0.560 0.280 350)` |

### 3.3 Red Scale (5 stops, hue 20) — Danger

| CSS Custom Property | OKLCH Value |
|---|---|
| `--primitive-red-100` | `oklch(0.930 0.050 20)` |
| `--primitive-red-200` | `oklch(0.850 0.110 20)` |
| `--primitive-red-300` | `oklch(0.720 0.180 20)` |
| `--primitive-red-400` | `oklch(0.620 0.220 20)` |
| `--primitive-red-500` | `oklch(0.540 0.230 20)` |

### 3.4 Gold Scale (5 stops, hue 85/84) — Highlight

| CSS Custom Property | OKLCH Value |
|---|---|
| `--primitive-gold-100` | `oklch(0.960 0.050 85)` |
| `--primitive-gold-200` | `oklch(0.920 0.110 85)` |
| `--primitive-gold-300` | `oklch(0.870 0.160 85)` |
| `--primitive-gold-400` | `oklch(0.840 0.175 85)` |
| `--primitive-gold-500` | `oklch(0.820 0.165 84)` |

Note: Stop 500 shifts from hue 85 to 84.

### 3.5 Cyan Scale (5 stops, hue 210) — Tertiary Brand

| CSS Custom Property | OKLCH Value |
|---|---|
| `--primitive-cyan-100` | `oklch(0.930 0.038 210)` |
| `--primitive-cyan-200` | `oklch(0.850 0.085 210)` |
| `--primitive-cyan-300` | `oklch(0.740 0.125 210)` |
| `--primitive-cyan-400` | `oklch(0.650 0.148 210)` |
| `--primitive-cyan-500` | `oklch(0.570 0.155 210)` |

### 3.6 Green Scale (5 stops, hue 148) — Success

| CSS Custom Property | OKLCH Value |
|---|---|
| `--primitive-green-100` | `oklch(0.930 0.042 148)` |
| `--primitive-green-200` | `oklch(0.840 0.095 148)` |
| `--primitive-green-300` | `oklch(0.730 0.145 148)` |
| `--primitive-green-400` | `oklch(0.630 0.170 148)` |
| `--primitive-green-500` | `oklch(0.540 0.165 148)` |

### 3.7 Purple Scale (5 stops, hue 300) — Violet

| CSS Custom Property | OKLCH Value |
|---|---|
| `--primitive-purple-100` | `oklch(0.940 0.040 300)` |
| `--primitive-purple-200` | `oklch(0.860 0.080 300)` |
| `--primitive-purple-300` | `oklch(0.720 0.160 300)` |
| `--primitive-purple-400` | `oklch(0.640 0.220 300)` |
| `--primitive-purple-500` | `oklch(0.560 0.260 300)` |

**Tier 1 Total: 44 primitive tokens**

---

## 4. Tier 2 — Semantic Tokens

Defined in `@layer semantic`. These tokens change between `[data-theme="light"]` and `[data-theme="dark"]`. The light values are also set on `:root` as the default.

For the complete light/dark side-by-side values, see [[dark-mode]].

### 4.1 Background Tokens (5)

| CSS Custom Property | Purpose | Light Value | Dark Value |
|---|---|---|---|
| `--bg-page` | Page background | `oklch(0.982 0.008 70)` | `oklch(0.140 0.014 65)` |
| `--bg-surface` | Card/panel surface | `oklch(0.995 0.004 70)` | `oklch(0.165 0.015 65)` |
| `--bg-elevated` | Popover, modal, dropdown | `oklch(1.00 0.00 0)` | `oklch(0.190 0.015 65)` |
| `--bg-subtle` | Subtle region differentiation | `oklch(0.965 0.012 70)` | `oklch(0.210 0.015 65)` |
| `--bg-muted` | Muted area | `oklch(0.948 0.014 70)` | `oklch(0.180 0.013 65)` |

### 4.2 Text Tokens (5)

| CSS Custom Property | Purpose | Light Value | Dark Value |
|---|---|---|---|
| `--text-primary` | Headings, body | `oklch(0.200 0.015 60)` | `oklch(0.935 0.008 70)` |
| `--text-secondary` | Descriptions, metadata | `oklch(0.420 0.015 60)` | `oklch(0.690 0.012 70)` |
| `--text-muted` | Placeholders, hints | `oklch(0.560 0.012 60)` | `oklch(0.540 0.010 70)` |
| `--text-on-accent` | White text on accent bg | `oklch(1.00 0.000 0)` | `oklch(1.00 0.000 0)` |
| `--text-on-gold` | Dark text on gold bg | `oklch(0.220 0.020 70)` | `oklch(0.140 0.014 65)` |

### 4.3 Border Tokens (3)

| CSS Custom Property | Purpose | Light Value | Dark Value |
|---|---|---|---|
| `--border-default` | Standard borders | `oklch(0.340 0.025 60)` | `oklch(0.550 0.010 65)` |
| `--border-strong` | Emphasized borders | `oklch(0.250 0.020 60)` | `var(--text-primary)` |
| `--border-subtle` | Dividers, separators | `oklch(0.820 0.015 70)` | `oklch(0.330 0.015 65)` |

### 4.4 Accent Tokens (24 — 4 per color family x 6 families)

Each accent family has 4 tokens: base, hover, subtle (bg tint), and text.

**Primary (Pink, hue 350)**

| CSS Custom Property | Light | Dark |
|---|---|---|
| `--accent-primary` | `oklch(0.640 0.270 350)` | `oklch(0.700 0.230 350)` |
| `--accent-primary-hover` | `oklch(0.580 0.280 350)` | `oklch(0.740 0.220 350)` |
| `--accent-primary-subtle` | `oklch(0.955 0.040 350)` | `oklch(0.250 0.065 350)` |
| `--accent-primary-text` | `oklch(0.560 0.270 350)` | `oklch(0.750 0.210 350)` |

**Danger (Red, hue 20)**

| CSS Custom Property | Light | Dark |
|---|---|---|
| `--accent-danger` | `oklch(0.620 0.220 20)` | `oklch(0.660 0.200 20)` |
| `--accent-danger-hover` | `oklch(0.570 0.230 20)` | `oklch(0.700 0.190 20)` |
| `--accent-danger-subtle` | `oklch(0.950 0.040 20)` | `oklch(0.250 0.055 20)` |
| `--accent-danger-text` | `oklch(0.570 0.220 20)` | `oklch(0.720 0.180 20)` |

**Gold (hue 85/84)**

| CSS Custom Property | Light | Dark |
|---|---|---|
| `--accent-gold` | `oklch(0.840 0.175 85)` | `oklch(0.840 0.170 85)` |
| `--accent-gold-hover` | `oklch(0.820 0.165 84)` | `oklch(0.870 0.155 84)` |
| `--accent-gold-subtle` | `oklch(0.965 0.060 85)` | `oklch(0.260 0.065 85)` |
| `--accent-gold-text` | `oklch(0.560 0.170 85)` | `oklch(0.870 0.155 85)` |

**Cyan (hue 210)**

| CSS Custom Property | Light | Dark |
|---|---|---|
| `--accent-cyan` | `oklch(0.650 0.148 210)` | `oklch(0.720 0.140 210)` |
| `--accent-cyan-hover` | `oklch(0.600 0.150 210)` | `oklch(0.760 0.130 210)` |
| `--accent-cyan-subtle` | `oklch(0.945 0.030 210)` | `oklch(0.250 0.045 210)` |
| `--accent-cyan-text` | `oklch(0.560 0.148 210)` | `oklch(0.780 0.130 210)` |

**Green (hue 148)**

| CSS Custom Property | Light | Dark |
|---|---|---|
| `--accent-green` | `oklch(0.630 0.170 148)` | `oklch(0.680 0.155 148)` |
| `--accent-green-hover` | `oklch(0.580 0.165 148)` | `oklch(0.720 0.145 148)` |
| `--accent-green-subtle` | `oklch(0.945 0.035 148)` | `oklch(0.250 0.048 148)` |
| `--accent-green-text` | `oklch(0.520 0.170 148)` | `oklch(0.740 0.145 148)` |

**Purple (hue 300)**

| CSS Custom Property | Light | Dark |
|---|---|---|
| `--accent-purple` | `oklch(0.640 0.220 300)` | `oklch(0.700 0.200 300)` |
| `--accent-purple-hover` | `oklch(0.580 0.230 300)` | `oklch(0.740 0.190 300)` |
| `--accent-purple-subtle` | `oklch(0.950 0.035 300)` | `oklch(0.250 0.055 300)` |
| `--accent-purple-text` | `oklch(0.560 0.230 300)` | `oklch(0.760 0.180 300)` |

### 4.5 Status Aliases (4)

These use `var()` references, not direct OKLCH values. They inherit theme changes through their accent targets.

| CSS Custom Property | Value (both themes) | Resolves To |
|---|---|---|
| `--status-info` | `var(--accent-primary)` | Pink accent |
| `--status-error` | `var(--accent-danger)` | Red accent |
| `--status-warning` | `var(--accent-gold)` | Gold accent |
| `--status-success` | `var(--accent-green)` | Green accent |

### 4.6 Focus & Overlay (2)

| CSS Custom Property | Light | Dark |
|---|---|---|
| `--focus-ring` | `var(--accent-primary)` | `oklch(0.700 0.230 350)` |
| `--overlay-bg` | `oklch(0.200 0.015 60 / 0.30)` | `oklch(0 0 0 / 0.60)` |

### 4.7 Shadows (9)

Neo-brutalist solid shadows — zero blur, pure offset. See [[dark-mode]] for the inversion logic.

| CSS Custom Property | Light | Dark |
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

**Tier 2 Total: 52 semantic tokens** (5 bg + 5 text + 3 border + 24 accent + 4 status + 2 focus/overlay + 9 shadow)

---

## 5. Tier 3 — Component Tokens

Defined in `@layer component` on `:root`. These do not change between themes — they reference semantic tokens that do the theme switching.

### 5.1 Typography — Font Families (2)

| CSS Custom Property | Value |
|---|---|
| `--font-sans` | `'Inter', system-ui, -apple-system, sans-serif` |
| `--font-mono` | `'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace` |

### 5.2 Typography — Fluid Type Scale (8 steps)

Uses `clamp()` for fluid sizing between a minimum and maximum viewport.

| CSS Custom Property | Value | Approx Range |
|---|---|---|
| `--step--2` | `clamp(0.694rem, 0.650rem + 0.22vi, 0.8rem)` | ~11px - 12.8px |
| `--step--1` | `clamp(0.833rem, 0.775rem + 0.29vi, 1rem)` | ~13.3px - 16px |
| `--step-0` | `clamp(1rem, 0.913rem + 0.43vi, 1.25rem)` | 16px - 20px |
| `--step-1` | `clamp(1.2rem, 1.074rem + 0.63vi, 1.5625rem)` | ~19.2px - 25px |
| `--step-2` | `clamp(1.44rem, 1.261rem + 0.89vi, 1.953rem)` | ~23px - 31.2px |
| `--step-3` | `clamp(1.728rem, 1.480rem + 1.24vi, 2.441rem)` | ~27.6px - 39px |
| `--step-4` | `clamp(2.074rem, 1.734rem + 1.70vi, 3.052rem)` | ~33.2px - 48.8px |
| `--step-5` | `clamp(2.488rem, 2.028rem + 2.30vi, 3.815rem)` | ~39.8px - 61px |

### 5.3 Typography — Letter Spacing (3)

| CSS Custom Property | Value |
|---|---|
| `--tracking-tight` | `-0.02em` |
| `--tracking-tighter` | `-0.03em` |
| `--tracking-tightest` | `-0.04em` |

### 5.4 Typography — Line Height (5)

| CSS Custom Property | Value |
|---|---|
| `--leading-none` | `1.0` |
| `--leading-tight` | `1.15` |
| `--leading-snug` | `1.3` |
| `--leading-normal` | `1.55` |
| `--leading-relaxed` | `1.65` |

### 5.5 Typography — UI Text Scale (6, fixed / non-fluid)

For UI controls — not body text. Fixed `rem` values for consistent control sizing.

| CSS Custom Property | Value | Pixel Equivalent | Usage |
|---|---|---|---|
| `--ui-text-2xs` | `0.6875rem` | 11px | Badges, table headers |
| `--ui-text-xs` | `0.75rem` | 12px | Captions, hints, form errors |
| `--ui-text-sm` | `0.8125rem` | 13px | Sidebar, breadcrumbs, small buttons |
| `--ui-text-md` | `0.875rem` | 14px | Inputs, selects, tabs |
| `--ui-text-lg` | `0.9375rem` | 15px | Medium buttons |
| `--ui-text-xl` | `1.0625rem` | 17px | Large buttons |

### 5.6 Spacing Scale (13 stops)

Linear 4px base grid. Named by multiplier (e.g., `--space-4` = 4 * 4px = 16px).

| CSS Custom Property | Value |
|---|---|
| `--space-1` | `4px` |
| `--space-1-5` | `6px` |
| `--space-2` | `8px` |
| `--space-3` | `12px` |
| `--space-4` | `16px` |
| `--space-5` | `20px` |
| `--space-6` | `24px` |
| `--space-8` | `32px` |
| `--space-10` | `40px` |
| `--space-12` | `48px` |
| `--space-16` | `64px` |
| `--space-20` | `80px` |

Note: `--space-1-5` breaks the multiplier pattern (6px instead of the expected 4*1.5=6px — it works out, but the name uses a dash not a dot).

### 5.7 Border Radius (5 stops)

| CSS Custom Property | Value |
|---|---|
| `--radius-sm` | `10px` |
| `--radius-md` | `16px` |
| `--radius-lg` | `24px` |
| `--radius-xl` | `32px` |
| `--radius-full` | `9999px` |

### 5.8 Control Heights (4 stops)

Fixed heights for interactive controls (buttons, inputs, selects).

| CSS Custom Property | Value | Usage |
|---|---|---|
| `--control-sm` | `32px` | Small buttons, compact inputs |
| `--control-md` | `36px` | Default buttons/inputs |
| `--control-lg` | `44px` | Large buttons, prominent inputs |
| `--control-xl` | `56px` | Hero CTAs |

### 5.9 Motion Durations (5 stops)

| CSS Custom Property | Value | Usage |
|---|---|---|
| `--motion-instant` | `100ms` | Micro-interactions (opacity, color) |
| `--motion-fast` | `160ms` | Hover transitions |
| `--motion-base` | `240ms` | Standard transitions |
| `--motion-slow` | `360ms` | Enter/exit animations |
| `--motion-deliberate` | `500ms` | Page-level transitions |

### 5.10 Easing Functions (7 — 5 cubic-bezier + 2 spring)

**Cubic-bezier easings:**

| CSS Custom Property | Value | Character |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Standard deceleration |
| `--ease-bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Slight overshoot |
| `--ease-smooth` | `cubic-bezier(0.22, 1, 0.36, 1)` | Smooth, natural deceleration |
| `--ease-slam` | `cubic-bezier(0.55, 0.06, 0.68, 0.19)` | Fast-in, hard stop |
| `--ease-elastic` | `cubic-bezier(0.68, -0.55, 0.265, 1.55)` | Elastic overshoot both ends |

**Spring easings (using `linear()` for multi-oscillation curves):**

| CSS Custom Property | Value |
|---|---|
| `--ease-spring-gentle` | `linear(0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%, 0.937 38.1%, 0.968 41.8%, 0.991 45.7%, 1.006 50%, 1.015 55%, 1.017 63.9%, 1.001 85.9%, 1)` |
| `--ease-spring-bouncy` | `linear(0, 0.004, 0.016, 0.035, 0.063 9.1%, 0.141, 0.25, 0.391, 0.563, 0.765, 1, 0.891, 0.813 45.5%, 0.785, 0.766, 0.754, 0.75, 0.754, 0.766, 0.785, 0.813 63.6%, 0.891, 1 72.7%, 0.973, 0.953, 0.941, 0.938, 0.941, 0.953, 0.973, 1, 0.988, 0.984, 0.988, 1)` |

### 5.11 Z-Index Scale (7 stops)

| CSS Custom Property | Value | Usage |
|---|---|---|
| `--z-base` | `1` | Default stacking |
| `--z-sticky` | `100` | Sticky headers |
| `--z-fixed` | `200` | Fixed navigation |
| `--z-overlay` | `300` | Overlay backdrops |
| `--z-modal` | `1000` | Modal dialogs |
| `--z-toast` | `1100` | Toast notifications |
| `--z-tooltip` | `1500` | Tooltips |

### 5.12 Container Widths (3 stops)

| CSS Custom Property | Value |
|---|---|
| `--container-sm` | `640px` |
| `--container-md` | `960px` |
| `--container-lg` | `1200px` |

### 5.13 Button Tokens (13)

| CSS Custom Property | Value | Purpose |
|---|---|---|
| `--btn-primary-bg` | `var(--accent-primary)` | Primary button background |
| `--btn-primary-text` | `var(--text-on-accent)` | Primary button text |
| `--btn-danger-bg` | `var(--accent-danger)` | Danger button background |
| `--btn-danger-text` | `var(--text-on-accent)` | Danger button text |
| `--btn-gold-bg` | `var(--accent-gold)` | Gold button background |
| `--btn-gold-text` | `var(--text-on-gold)` | Gold button text |
| `--btn-cyan-bg` | `var(--accent-cyan)` | Cyan button background |
| `--btn-cyan-text` | `var(--text-on-accent)` | Cyan button text |
| `--btn-green-bg` | `var(--accent-green)` | Green button background |
| `--btn-green-text` | `var(--text-on-accent)` | Green button text |
| `--btn-purple-bg` | `var(--accent-purple)` | Purple button background |
| `--btn-purple-text` | `var(--text-on-accent)` | Purple button text |
| `--btn-gap` | `var(--space-1-5)` | Gap between button icon and label |

### 5.14 Badge Tokens (2)

| CSS Custom Property | Value | Purpose |
|---|---|---|
| `--badge-py` | `2px` | Badge vertical padding |
| `--badge-px` | `10px` | Badge horizontal padding |

### 5.15 Toggle Tokens (3)

| CSS Custom Property | Value | Purpose |
|---|---|---|
| `--toggle-off-bg` | `var(--primitive-neutral-300)` | Toggle off-state background |
| `--toggle-on-bg` | `var(--accent-primary)` | Toggle on-state background |
| `--toggle-knob` | `var(--primitive-neutral-0)` | Toggle knob (always white) |

### 5.16 Chart Palette (6)

Data visualization colors drawn from the accent families.

| CSS Custom Property | Value | Color Family |
|---|---|---|
| `--chart-1` | `var(--accent-primary)` | Pink |
| `--chart-2` | `var(--accent-gold)` | Gold |
| `--chart-3` | `var(--accent-cyan)` | Cyan |
| `--chart-4` | `var(--accent-green)` | Green |
| `--chart-5` | `var(--accent-purple)` | Purple |
| `--chart-6` | `var(--accent-danger)` | Red |

### 5.17 Code Block Syntax Highlighting (7 inline colors)

These are defined as inline CSS within the `.code-block` class, not as CSS custom properties. They are hardcoded OKLCH values applied to syntax spans.

| CSS Selector | OKLCH Value | Syntax Role |
|---|---|---|
| `.code-block` (color) | `oklch(0.920 0.010 70)` | Default text / base foreground |
| `.code-block` (background) | `oklch(0.200 0.015 60)` | Code block background |
| `.code-block .keyword` | `oklch(0.750 0.200 350)` | Keywords (pink) |
| `.code-block .string` | `oklch(0.870 0.160 85)` | String literals (gold) |
| `.code-block .function` | `oklch(0.750 0.130 210)` | Function names (cyan) |
| `.code-block .comment` | `oklch(0.550 0.010 60)` | Comments (muted neutral, italic) |
| `.code-block .number` | `oklch(0.800 0.140 148)` | Numeric literals (green) |
| `.code-block .operator` | `oklch(0.700 0.000 0)` | Operators (achromatic) |
| `.code-block .property` | `oklch(0.780 0.100 350)` | Property names (light pink) |

Note: These are not tokenized as CSS custom properties in the reference. If the build pipeline needs them as tokens, they should be promoted to `--code-*` custom properties in the component layer.

**Tier 3 Total: 80 component tokens** (2 font + 8 step + 3 tracking + 5 leading + 6 ui-text + 12 space + 5 radius + 4 control + 5 motion + 7 ease + 7 z-index + 3 container + 13 button + 2 badge + 3 toggle + 6 chart) — plus 9 inline code-block syntax colors that are not yet tokenized as custom properties.

---

## 6. Documentation-Only Component Tokens

The reference HTML includes code snippets (inside `<pre>` blocks) that show **suggested** component-level tokens for buttons, inputs, cards, and badges. These are displayed as documentation for developers but are **not defined as actual CSS custom properties** in the stylesheet. They represent the intended tokenization when these components are built.

### Buttons (documented, not yet defined as custom properties)

```
--btn-py: var(--space-2);
--btn-px: var(--space-5);
```

### Inputs (documented, not yet defined as custom properties)

```
--input-py: var(--space-2);
--input-px: var(--space-3);
--input-radius: var(--radius-sm);
--input-border: var(--border-default);
--input-bg: var(--bg-elevated);
--input-focus-ring: var(--focus-ring);
--input-error-border: var(--accent-danger);
--input-error-text: var(--accent-danger-text);
```

### Cards (documented, not yet defined as custom properties)

```
--card-padding: var(--space-6);
--card-radius: var(--radius-md);
--card-bg: var(--bg-surface);
--card-border: var(--border-default);
--card-shadow: var(--shadow-md);
--card-shadow-hover: var(--shadow-lg);
--card-featured-bg: var(--accent-primary-subtle);
--card-featured-border: var(--accent-primary);
```

### Badges (documented, not yet defined as custom properties)

```
--badge-py: var(--space-1);
--badge-px: var(--space-3);
--badge-radius: var(--radius-full);
--badge-font-size: var(--ui-text-2xs);
--badge-pink-bg: var(--accent-primary-subtle);
--badge-pink-text: var(--accent-primary-text);
--badge-gold-bg: var(--accent-gold-subtle);
--badge-gold-text: var(--accent-gold-text);
```

Note: The `--badge-py` and `--badge-px` tokens in section 5.14 above ARE defined as CSS custom properties in the component layer (with values `2px` and `10px`). The documentation snippets show different values (`var(--space-1)` = 4px and `var(--space-3)` = 12px). This is a discrepancy — the actual CSS custom properties take precedence.

---

## 7. Grand Total

| Tier | Count | Notes |
|---|---|---|
| Tier 1 — Primitives | 44 | Raw OKLCH color scales |
| Tier 2 — Semantic | 52 | Theme-aware (light + dark values) |
| Tier 3 — Component | 80 | Foundation + component-specific |
| **Total** | **176** | Defined as CSS custom properties |
| Code block syntax (inline) | 9 | Not tokenized as custom properties |
| Documentation-only | ~20 | Shown in `<pre>` snippets, not in `<style>` |
