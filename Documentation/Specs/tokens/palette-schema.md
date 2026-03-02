# Palette Schema Specification

> Defines the exact JSON structure for `palettes/delightful.json` — the single source of truth for every color in the Delightful Design System.

Cross-references: [[token-tiers]] (tier architecture), [[dark-mode]] (theme switching).

---

## 1. File Location & Purpose

```
packages/tokens/palettes/delightful.json
```

This file is the **color authority** for the entire system. All CSS custom properties for color are generated from it. No color value should exist in CSS that does not trace back to a key in this file.

---

## 2. Top-Level JSON Structure

```jsonc
{
  "$schema": "./palette.schema.json",
  "$schemaVersion": 1,
  "name": "Delightful",
  "version": "1.0.0",
  "author": "Kyle Snavely",
  "primitives": { /* Tier 1 — raw OKLCH scales */ },
  "semantic": {
    "light": { /* Tier 2 — light theme mappings */ },
    "dark":  { /* Tier 2 — dark theme mappings */ }
  },
  "component": { /* Tier 3 — component-level color aliases */ },
  "terminal": {
    "light": { /* Hex-authoritative terminal values */ },
    "dark":  { /* Hex-authoritative terminal values */ }
  }
}
```

### JSON Schema Rules

| Field | Type | Required | Constraints |
|---|---|---|---|
| `$schema` | `string` | No | Reference to JSON Schema file |
| `$schemaVersion` | `integer` | Yes | Schema version, currently `1` |
| `name` | `string` | Yes | Palette display name |
| `version` | `string` | Yes | Semver format `MAJOR.MINOR.PATCH` |
| `author` | `string` | Yes | Author name |
| `primitives` | `object` | Yes | Keyed by family, each containing numbered stops. OKLCH format. |
| `semantic.light` | `object` | Yes | Every semantic token must appear here. OKLCH format. |
| `semantic.dark` | `object` | Yes | Must contain the same keys as `semantic.light`. OKLCH format. |
| `component` | `object` | Yes | Component-level color aliases (theme-independent) |
| `terminal.light` | `object` | Yes | Hand-tuned hex values: `foreground`, `background`, `cursor`, `ansi` (16-element array) |
| `terminal.dark` | `object` | Yes | Hand-tuned hex values: same keys as `terminal.light` |

---

## 3. Color Authority Model

The palette uses **two authority modes**:

### OKLCH-Authoritative (Primary)

All primitive and semantic tokens are stored as OKLCH strings. OKLCH is the canonical format because:
- Perceptually uniform lightness
- Predictable chroma/hue manipulation for dark mode
- Native CSS support via `oklch()` function

Format: `"oklch(L C H)"` where L = lightness (0-1), C = chroma (0-0.4), H = hue angle (0-360).

For alpha values: `"oklch(L C H / A)"` where A = alpha (0-1).

### Hex-Authoritative (Terminal Values)

Terminal hex values **are stored in the palette file** under the `terminal` key. These are **hand-tuned** values, NOT derived from OKLCH via conversion. OKLCH → hex conversion can lose nuance in terminal color renderers, so terminal palettes are maintained as hex and are authoritative for:
- **VS Code**: hex color theme JSON (OKLCH → hex via culori with `clampChroma()` for editor/UI colors, but ANSI terminal colors use these hand-tuned hex values)
- **Ghostty**: plain-text `key = value` hex format
- **iTerm2**: Apple plist XML with RGB floats derived from these hex values
- **Starship**: TOML with hex color values

The `terminal` section has `light` and `dark` keys, each containing `foreground`, `background`, `cursor`, and `ansi` (16-element hex array for ANSI colors 0–15).

```jsonc
"terminal": {
  "light": {
    "foreground": "#1b150f",
    "background": "#fdf8f3",
    "cursor": "#f600a3",
    "ansi": ["#1b150f", "#ed324b", "#22a448", "#febf00", "#00a6c0", "#f600a3", "#17c0d6", "#e8ddd3", "#6b5e52", "#ff6b7f", "#44d66a", "#ffe066", "#33cfea", "#ff33c0", "#55e8f0", "#fdf8f3"]
  },
  "dark": {
    "foreground": "#e8ddd3",
    "background": "#1b150f",
    "cursor": "#ff33c0",
    "ansi": ["#1b150f", "#ed324b", "#22a448", "#febf00", "#00a6c0", "#f600a3", "#17c0d6", "#e8ddd3", "#6b5e52", "#ff6b7f", "#44d66a", "#ffe066", "#33cfea", "#ff33c0", "#55e8f0", "#fdf8f3"]
  }
}
```

**Important:** These hex values must NOT be regenerated from OKLCH. They are the source of truth for all terminal-facing emitters.

---

## 4. Primitives — Complete Inventory

Each primitive is a raw color with no semantic meaning. Named by `family-stop`.

### 4.1 Neutral Family (Hue 70 / 60)

Warm-tinted neutrals. Stops 0-700 use hue 70; stops 800-950 shift to hue 60.

| Token | OKLCH Value | Notes |
|---|---|---|
| `neutral-0` | `oklch(1.00 0.000 0)` | Pure white (achromatic) |
| `neutral-25` | `oklch(0.988 0.006 70)` | Near-white warm cream |
| `neutral-50` | `oklch(0.980 0.008 70)` | Lightest warm tint |
| `neutral-100` | `oklch(0.960 0.010 70)` | |
| `neutral-150` | `oklch(0.940 0.012 70)` | |
| `neutral-200` | `oklch(0.920 0.012 70)` | |
| `neutral-300` | `oklch(0.860 0.014 70)` | Toggle off-state bg |
| `neutral-400` | `oklch(0.750 0.014 70)` | |
| `neutral-500` | `oklch(0.600 0.012 70)` | |
| `neutral-600` | `oklch(0.480 0.010 70)` | |
| `neutral-700` | `oklch(0.350 0.010 70)` | |
| `neutral-800` | `oklch(0.250 0.012 60)` | Hue shifts to 60 |
| `neutral-900` | `oklch(0.180 0.012 60)` | |
| `neutral-950` | `oklch(0.140 0.012 60)` | Deepest neutral |

### 4.2 Pink Family (Hue 350) — Primary Brand

| Token | OKLCH Value | Notes |
|---|---|---|
| `pink-100` | `oklch(0.920 0.060 350)` | Lightest tint |
| `pink-200` | `oklch(0.840 0.140 350)` | |
| `pink-300` | `oklch(0.720 0.220 350)` | |
| `pink-400` | `oklch(0.640 0.270 350)` | Primary accent (light) |
| `pink-500` | `oklch(0.560 0.280 350)` | Deepest pink |

### 4.3 Red Family (Hue 20) — Danger

| Token | OKLCH Value | Notes |
|---|---|---|
| `red-100` | `oklch(0.930 0.050 20)` | |
| `red-200` | `oklch(0.850 0.110 20)` | |
| `red-300` | `oklch(0.720 0.180 20)` | |
| `red-400` | `oklch(0.620 0.220 20)` | Danger accent (light) |
| `red-500` | `oklch(0.540 0.230 20)` | |

### 4.4 Gold Family (Hue 85 / 84) — Highlight Accent

| Token | OKLCH Value | Notes |
|---|---|---|
| `gold-100` | `oklch(0.960 0.050 85)` | |
| `gold-200` | `oklch(0.920 0.110 85)` | |
| `gold-300` | `oklch(0.870 0.160 85)` | |
| `gold-400` | `oklch(0.840 0.175 85)` | Gold accent (light) |
| `gold-500` | `oklch(0.820 0.165 84)` | Hue shifts to 84 |

### 4.5 Cyan Family (Hue 210) — Tertiary Brand

| Token | OKLCH Value | Notes |
|---|---|---|
| `cyan-100` | `oklch(0.930 0.038 210)` | |
| `cyan-200` | `oklch(0.850 0.085 210)` | |
| `cyan-300` | `oklch(0.740 0.125 210)` | |
| `cyan-400` | `oklch(0.650 0.148 210)` | Cyan accent (light) |
| `cyan-500` | `oklch(0.570 0.155 210)` | |

### 4.6 Green Family (Hue 148) — Success/Safe

| Token | OKLCH Value | Notes |
|---|---|---|
| `green-100` | `oklch(0.930 0.042 148)` | |
| `green-200` | `oklch(0.840 0.095 148)` | |
| `green-300` | `oklch(0.730 0.145 148)` | |
| `green-400` | `oklch(0.630 0.170 148)` | Green accent (light) |
| `green-500` | `oklch(0.540 0.165 148)` | |

### 4.7 Purple Family (Hue 300) — Violet

| Token | OKLCH Value | Notes |
|---|---|---|
| `purple-100` | `oklch(0.940 0.040 300)` | |
| `purple-200` | `oklch(0.860 0.080 300)` | |
| `purple-300` | `oklch(0.720 0.160 300)` | |
| `purple-400` | `oklch(0.640 0.220 300)` | Purple accent (light) |
| `purple-500` | `oklch(0.560 0.260 300)` | |

**Total primitive tokens: 44** (14 neutral + 5 pink + 5 red + 5 gold + 5 cyan + 5 green + 5 purple)

---

## 5. Semantic Tokens — Complete Inventory

Every semantic token has a light value and a dark value. These are stored under `semantic.light` and `semantic.dark` respectively.

### 5.1 Backgrounds

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `bg-page` | `oklch(0.982 0.008 70)` | `oklch(0.140 0.014 65)` | Page-level background |
| `bg-surface` | `oklch(0.995 0.004 70)` | `oklch(0.165 0.015 65)` | Card/panel surface |
| `bg-elevated` | `oklch(1.00 0.00 0)` | `oklch(0.190 0.015 65)` | Popover, dropdown, modal |
| `bg-subtle` | `oklch(0.965 0.012 70)` | `oklch(0.210 0.015 65)` | Subtle differentiation |
| `bg-muted` | `oklch(0.948 0.014 70)` | `oklch(0.180 0.013 65)` | Muted regions |

### 5.2 Text

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `text-primary` | `oklch(0.200 0.015 60)` | `oklch(0.935 0.008 70)` | Headings, body text |
| `text-secondary` | `oklch(0.420 0.015 60)` | `oklch(0.690 0.012 70)` | Descriptions, metadata |
| `text-muted` | `oklch(0.560 0.012 60)` | `oklch(0.540 0.010 70)` | Placeholders, hints |
| `text-on-accent` | `oklch(1.00 0.000 0)` | `oklch(1.00 0.000 0)` | Text on accent-colored bg |
| `text-on-gold` | `oklch(0.220 0.020 70)` | `oklch(0.140 0.014 65)` | Text on gold bg |

### 5.3 Borders

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `border-default` | `oklch(0.340 0.025 60)` | `oklch(0.550 0.010 65)` | Standard component borders |
| `border-strong` | `oklch(0.250 0.020 60)` | `var(--text-primary)` * | Emphasized borders |
| `border-subtle` | `oklch(0.820 0.015 70)` | `oklch(0.330 0.015 65)` | Dividers, separators |

\* `border-strong` in dark mode resolves to `oklch(0.935 0.008 70)` (the dark mode `text-primary` value).

### 5.4 Accent — Primary (Pink, Hue 350)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `accent-primary` | `oklch(0.640 0.270 350)` | `oklch(0.700 0.230 350)` | Primary actions, brand |
| `accent-primary-hover` | `oklch(0.580 0.280 350)` | `oklch(0.740 0.220 350)` | Hover state |
| `accent-primary-subtle` | `oklch(0.955 0.040 350)` | `oklch(0.250 0.065 350)` | Subtle bg tint |
| `accent-primary-text` | `oklch(0.560 0.270 350)` | `oklch(0.750 0.210 350)` | Accent-colored text |

### 5.5 Accent — Danger (Red, Hue 20)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `accent-danger` | `oklch(0.620 0.220 20)` | `oklch(0.660 0.200 20)` | Destructive actions |
| `accent-danger-hover` | `oklch(0.570 0.230 20)` | `oklch(0.700 0.190 20)` | Hover state |
| `accent-danger-subtle` | `oklch(0.950 0.040 20)` | `oklch(0.250 0.055 20)` | Subtle bg tint |
| `accent-danger-text` | `oklch(0.570 0.220 20)` | `oklch(0.720 0.180 20)` | Accent-colored text |

### 5.6 Accent — Gold (Hue 85/84)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `accent-gold` | `oklch(0.840 0.175 85)` | `oklch(0.840 0.170 85)` | Highlight, warning |
| `accent-gold-hover` | `oklch(0.820 0.165 84)` | `oklch(0.870 0.155 84)` | Hover state |
| `accent-gold-subtle` | `oklch(0.965 0.060 85)` | `oklch(0.260 0.065 85)` | Subtle bg tint |
| `accent-gold-text` | `oklch(0.560 0.170 85)` | `oklch(0.870 0.155 85)` | Accent-colored text |

### 5.7 Accent — Cyan (Hue 210)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `accent-cyan` | `oklch(0.650 0.148 210)` | `oklch(0.720 0.140 210)` | Tertiary brand |
| `accent-cyan-hover` | `oklch(0.600 0.150 210)` | `oklch(0.760 0.130 210)` | Hover state |
| `accent-cyan-subtle` | `oklch(0.945 0.030 210)` | `oklch(0.250 0.045 210)` | Subtle bg tint |
| `accent-cyan-text` | `oklch(0.560 0.148 210)` | `oklch(0.780 0.130 210)` | Accent-colored text |

### 5.8 Accent — Green (Hue 148)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `accent-green` | `oklch(0.630 0.170 148)` | `oklch(0.680 0.155 148)` | Success, safe |
| `accent-green-hover` | `oklch(0.580 0.165 148)` | `oklch(0.720 0.145 148)` | Hover state |
| `accent-green-subtle` | `oklch(0.945 0.035 148)` | `oklch(0.250 0.048 148)` | Subtle bg tint |
| `accent-green-text` | `oklch(0.520 0.170 148)` | `oklch(0.740 0.145 148)` | Accent-colored text |

### 5.9 Accent — Purple (Hue 300)

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `accent-purple` | `oklch(0.640 0.220 300)` | `oklch(0.700 0.200 300)` | Violet accent |
| `accent-purple-hover` | `oklch(0.580 0.230 300)` | `oklch(0.740 0.190 300)` | Hover state |
| `accent-purple-subtle` | `oklch(0.950 0.035 300)` | `oklch(0.250 0.055 300)` | Subtle bg tint |
| `accent-purple-text` | `oklch(0.560 0.230 300)` | `oklch(0.760 0.180 300)` | Accent-colored text |

### 5.10 Status Aliases

These are `var()` references, not direct OKLCH values. They resolve through the accent tokens.

| Token | Value (both themes) | Resolves To |
|---|---|---|
| `status-info` | `var(--accent-primary)` | Pink accent |
| `status-error` | `var(--accent-danger)` | Red accent |
| `status-warning` | `var(--accent-gold)` | Gold accent |
| `status-success` | `var(--accent-green)` | Green accent |

### 5.11 Focus & Overlay

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `focus-ring` | `var(--accent-primary)` | `oklch(0.700 0.230 350)` | Focus outline color |
| `overlay-bg` | `oklch(0.200 0.015 60 / 0.30)` | `oklch(0 0 0 / 0.60)` | Modal/overlay backdrop |

### 5.12 Shadows

Shadows are composite values (not single colors). They combine offset + color.

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `shadow-sm` | `2px 2px 0 var(--border-default)` | `2px 2px 0 oklch(0.92 0.010 65)` | Small neo-brutalist shadow |
| `shadow-md` | `4px 4px 0 var(--border-default)` | `4px 4px 0 oklch(0.92 0.010 65)` | Medium neo-brutalist shadow |
| `shadow-lg` | `8px 8px 0 var(--border-default)` | `8px 8px 0 oklch(0.92 0.010 65)` | Large neo-brutalist shadow |
| `shadow-pink` | `4px 4px 0 var(--accent-primary)` | `4px 4px 0 var(--accent-primary)` | Pink accent shadow |
| `shadow-danger` | `4px 4px 0 var(--accent-danger)` | `4px 4px 0 var(--accent-danger)` | Danger accent shadow |
| `shadow-gold` | `4px 4px 0 var(--accent-gold)` | `4px 4px 0 var(--accent-gold)` | Gold accent shadow |
| `shadow-cyan` | `4px 4px 0 var(--accent-cyan)` | `4px 4px 0 var(--accent-cyan)` | Cyan accent shadow |
| `shadow-green` | `4px 4px 0 var(--accent-green)` | `4px 4px 0 var(--accent-green)` | Green accent shadow |
| `shadow-purple` | `4px 4px 0 var(--accent-purple)` | `4px 4px 0 var(--accent-purple)` | Purple accent shadow |

**Total semantic tokens: 50** (5 bg + 5 text + 3 border + 24 accent + 4 status + 2 focus/overlay + 9 shadow - note: shadow values are composite)

---

## 6. Component Color Tokens

These live in the `component` key. They reference semantic tokens by name (not OKLCH values).

| Token | Value | Purpose |
|---|---|---|
| `btn-primary-bg` | `var(--accent-primary)` | Primary button background |
| `btn-primary-text` | `var(--text-on-accent)` | Primary button text |
| `btn-danger-bg` | `var(--accent-danger)` | Danger button background |
| `btn-danger-text` | `var(--text-on-accent)` | Danger button text |
| `btn-gold-bg` | `var(--accent-gold)` | Gold button background |
| `btn-gold-text` | `var(--text-on-gold)` | Gold button text |
| `btn-cyan-bg` | `var(--accent-cyan)` | Cyan button background |
| `btn-cyan-text` | `var(--text-on-accent)` | Cyan button text |
| `btn-green-bg` | `var(--accent-green)` | Green button background |
| `btn-green-text` | `var(--text-on-accent)` | Green button text |
| `btn-purple-bg` | `var(--accent-purple)` | Purple button background |
| `btn-purple-text` | `var(--text-on-accent)` | Purple button text |
| `toggle-off-bg` | `var(--primitive-neutral-300)` | Toggle switch off state |
| `toggle-on-bg` | `var(--accent-primary)` | Toggle switch on state |
| `toggle-knob` | `var(--primitive-neutral-0)` | Toggle switch knob |
| `chart-1` | `var(--accent-primary)` | Chart color 1 (pink) |
| `chart-2` | `var(--accent-gold)` | Chart color 2 (gold) |
| `chart-3` | `var(--accent-cyan)` | Chart color 3 (cyan) |
| `chart-4` | `var(--accent-green)` | Chart color 4 (green) |
| `chart-5` | `var(--accent-purple)` | Chart color 5 (purple) |
| `chart-6` | `var(--accent-danger)` | Chart color 6 (red) |

---

## 7. Example JSON (Partial)

```json
{
  "version": "3.0.0",
  "name": "delightful",
  "primitives": {
    "neutral": {
      "0":   "oklch(1.00 0.000 0)",
      "25":  "oklch(0.988 0.006 70)",
      "50":  "oklch(0.980 0.008 70)",
      "100": "oklch(0.960 0.010 70)",
      "150": "oklch(0.940 0.012 70)",
      "200": "oklch(0.920 0.012 70)",
      "300": "oklch(0.860 0.014 70)",
      "400": "oklch(0.750 0.014 70)",
      "500": "oklch(0.600 0.012 70)",
      "600": "oklch(0.480 0.010 70)",
      "700": "oklch(0.350 0.010 70)",
      "800": "oklch(0.250 0.012 60)",
      "900": "oklch(0.180 0.012 60)",
      "950": "oklch(0.140 0.012 60)"
    },
    "pink": {
      "100": "oklch(0.920 0.060 350)",
      "200": "oklch(0.840 0.140 350)",
      "300": "oklch(0.720 0.220 350)",
      "400": "oklch(0.640 0.270 350)",
      "500": "oklch(0.560 0.280 350)"
    },
    "red": {
      "100": "oklch(0.930 0.050 20)",
      "200": "oklch(0.850 0.110 20)",
      "300": "oklch(0.720 0.180 20)",
      "400": "oklch(0.620 0.220 20)",
      "500": "oklch(0.540 0.230 20)"
    },
    "gold": {
      "100": "oklch(0.960 0.050 85)",
      "200": "oklch(0.920 0.110 85)",
      "300": "oklch(0.870 0.160 85)",
      "400": "oklch(0.840 0.175 85)",
      "500": "oklch(0.820 0.165 84)"
    },
    "cyan": {
      "100": "oklch(0.930 0.038 210)",
      "200": "oklch(0.850 0.085 210)",
      "300": "oklch(0.740 0.125 210)",
      "400": "oklch(0.650 0.148 210)",
      "500": "oklch(0.570 0.155 210)"
    },
    "green": {
      "100": "oklch(0.930 0.042 148)",
      "200": "oklch(0.840 0.095 148)",
      "300": "oklch(0.730 0.145 148)",
      "400": "oklch(0.630 0.170 148)",
      "500": "oklch(0.540 0.165 148)"
    },
    "purple": {
      "100": "oklch(0.940 0.040 300)",
      "200": "oklch(0.860 0.080 300)",
      "300": "oklch(0.720 0.160 300)",
      "400": "oklch(0.640 0.220 300)",
      "500": "oklch(0.560 0.260 300)"
    }
  },
  "semantic": {
    "light": {
      "bg-page": "oklch(0.982 0.008 70)",
      "bg-surface": "oklch(0.995 0.004 70)",
      "bg-elevated": "oklch(1.00 0.00 0)",
      "bg-subtle": "oklch(0.965 0.012 70)",
      "bg-muted": "oklch(0.948 0.014 70)",
      "text-primary": "oklch(0.200 0.015 60)",
      "text-secondary": "oklch(0.420 0.015 60)",
      "text-muted": "oklch(0.560 0.012 60)",
      "text-on-accent": "oklch(1.00 0.000 0)",
      "text-on-gold": "oklch(0.220 0.020 70)",
      "border-default": "oklch(0.340 0.025 60)",
      "border-strong": "oklch(0.250 0.020 60)",
      "border-subtle": "oklch(0.820 0.015 70)",
      "accent-primary": "oklch(0.640 0.270 350)",
      "accent-primary-hover": "oklch(0.580 0.280 350)",
      "accent-primary-subtle": "oklch(0.955 0.040 350)",
      "accent-primary-text": "oklch(0.560 0.270 350)",
      "accent-danger": "oklch(0.620 0.220 20)",
      "accent-danger-hover": "oklch(0.570 0.230 20)",
      "accent-danger-subtle": "oklch(0.950 0.040 20)",
      "accent-danger-text": "oklch(0.570 0.220 20)",
      "accent-gold": "oklch(0.840 0.175 85)",
      "accent-gold-hover": "oklch(0.820 0.165 84)",
      "accent-gold-subtle": "oklch(0.965 0.060 85)",
      "accent-gold-text": "oklch(0.560 0.170 85)",
      "accent-cyan": "oklch(0.650 0.148 210)",
      "accent-cyan-hover": "oklch(0.600 0.150 210)",
      "accent-cyan-subtle": "oklch(0.945 0.030 210)",
      "accent-cyan-text": "oklch(0.560 0.148 210)",
      "accent-green": "oklch(0.630 0.170 148)",
      "accent-green-hover": "oklch(0.580 0.165 148)",
      "accent-green-subtle": "oklch(0.945 0.035 148)",
      "accent-green-text": "oklch(0.520 0.170 148)",
      "accent-purple": "oklch(0.640 0.220 300)",
      "accent-purple-hover": "oklch(0.580 0.230 300)",
      "accent-purple-subtle": "oklch(0.950 0.035 300)",
      "accent-purple-text": "oklch(0.560 0.230 300)",
      "focus-ring": "{accent-primary}",
      "overlay-bg": "oklch(0.200 0.015 60 / 0.30)"
    },
    "dark": {
      "bg-page": "oklch(0.140 0.014 65)",
      "bg-surface": "oklch(0.165 0.015 65)",
      "bg-elevated": "oklch(0.190 0.015 65)",
      "bg-subtle": "oklch(0.210 0.015 65)",
      "bg-muted": "oklch(0.180 0.013 65)",
      "text-primary": "oklch(0.935 0.008 70)",
      "text-secondary": "oklch(0.690 0.012 70)",
      "text-muted": "oklch(0.540 0.010 70)",
      "text-on-accent": "oklch(1.00 0.000 0)",
      "text-on-gold": "oklch(0.140 0.014 65)",
      "border-default": "oklch(0.550 0.010 65)",
      "border-strong": "{text-primary}",
      "border-subtle": "oklch(0.330 0.015 65)",
      "accent-primary": "oklch(0.700 0.230 350)",
      "accent-primary-hover": "oklch(0.740 0.220 350)",
      "accent-primary-subtle": "oklch(0.250 0.065 350)",
      "accent-primary-text": "oklch(0.750 0.210 350)",
      "accent-danger": "oklch(0.660 0.200 20)",
      "accent-danger-hover": "oklch(0.700 0.190 20)",
      "accent-danger-subtle": "oklch(0.250 0.055 20)",
      "accent-danger-text": "oklch(0.720 0.180 20)",
      "accent-gold": "oklch(0.840 0.170 85)",
      "accent-gold-hover": "oklch(0.870 0.155 84)",
      "accent-gold-subtle": "oklch(0.260 0.065 85)",
      "accent-gold-text": "oklch(0.870 0.155 85)",
      "accent-cyan": "oklch(0.720 0.140 210)",
      "accent-cyan-hover": "oklch(0.760 0.130 210)",
      "accent-cyan-subtle": "oklch(0.250 0.045 210)",
      "accent-cyan-text": "oklch(0.780 0.130 210)",
      "accent-green": "oklch(0.680 0.155 148)",
      "accent-green-hover": "oklch(0.720 0.145 148)",
      "accent-green-subtle": "oklch(0.250 0.048 148)",
      "accent-green-text": "oklch(0.740 0.145 148)",
      "accent-purple": "oklch(0.700 0.200 300)",
      "accent-purple-hover": "oklch(0.740 0.190 300)",
      "accent-purple-subtle": "oklch(0.250 0.055 300)",
      "accent-purple-text": "oklch(0.760 0.180 300)",
      "focus-ring": "oklch(0.700 0.230 350)",
      "overlay-bg": "oklch(0 0 0 / 0.60)"
    }
  },
  "component": {
    "btn-primary-bg": "{accent-primary}",
    "btn-primary-text": "{text-on-accent}",
    "btn-danger-bg": "{accent-danger}",
    "btn-danger-text": "{text-on-accent}",
    "btn-gold-bg": "{accent-gold}",
    "btn-gold-text": "{text-on-gold}",
    "btn-cyan-bg": "{accent-cyan}",
    "btn-cyan-text": "{text-on-accent}",
    "btn-green-bg": "{accent-green}",
    "btn-green-text": "{text-on-accent}",
    "btn-purple-bg": "{accent-purple}",
    "btn-purple-text": "{text-on-accent}",
    "toggle-off-bg": "{primitive.neutral.300}",
    "toggle-on-bg": "{accent-primary}",
    "toggle-knob": "{primitive.neutral.0}",
    "chart-1": "{accent-primary}",
    "chart-2": "{accent-gold}",
    "chart-3": "{accent-cyan}",
    "chart-4": "{accent-green}",
    "chart-5": "{accent-purple}",
    "chart-6": "{accent-danger}"
  }
}
```

> **Reference notation**: Values wrapped in `{curly-braces}` are token aliases resolved at build time. Direct OKLCH strings are literal values.

---

## 8. Platform Consumption

| Platform | Format | Source |
|---|---|---|
| **CSS** | `oklch()` custom properties | Direct from palette OKLCH values |
| **Tailwind** | CSS custom properties referenced in `theme.extend.colors` | Generated CSS file |
| **iOS (Swift)** | Hex strings in asset catalog / UIColor extension | Build-time OKLCH-to-hex conversion |
| **Android (Kotlin)** | ARGB hex integers in `colors.xml` | Build-time OKLCH-to-hex conversion |
| **Figma** | Hex color variables via plugin | Build-time OKLCH-to-hex conversion |

---

## 9. Validation Rules

1. Every key in `semantic.light` must also exist in `semantic.dark` (and vice versa).
2. Every OKLCH string must match the regex: `^oklch\(\d+\.?\d*\s+\d+\.?\d*\s+\d+\.?\d*(\s*/\s*\d+\.?\d*)?\)$`
3. Token alias references (curly-brace notation) must resolve to an existing key in `primitives` or `semantic`.
4. The `version` field must be valid semver.
5. No primitive token may appear directly in component CSS — components reference semantic tokens only (see [[token-tiers]] for the strict rule).
