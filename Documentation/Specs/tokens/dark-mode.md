# Dark Mode Specification

> How the Delightful Design System switches between light and dark themes — the mechanism, every token that changes, the shadow inversion logic, and the accent brightening strategy.

Cross-references: [[palette-schema]] (complete OKLCH values), [[token-tiers]] (tier architecture and cascade layers).

---

## 1. The `data-theme` Attribute Mechanism

Theme switching uses the `data-theme` attribute on `<html>`:

```html
<html lang="en" data-theme="light">   <!-- light theme -->
<html lang="en" data-theme="dark">    <!-- dark theme  -->
```

### CSS Selectors

The semantic layer defines two selector blocks:

```css
@layer semantic {
  :root,
  [data-theme="light"] {
    /* Light values — also the default fallback on :root */
  }

  [data-theme="dark"] {
    /* Dark overrides */
  }
}
```

The `:root` selector ensures light values are the default even if no `data-theme` attribute is set. The `[data-theme="light"]` selector is redundant with `:root` but ensures explicit specificity parity with the dark selector.

### Two-State Toggle

The system is strictly **two-state**: `light` or `dark`. There is no "auto" state stored — the OS preference is only used for **initialization**.

State diagram:

```
           ┌─── user clicks toggle ───┐
           │                          │
     ┌─────▼─────┐             ┌──────▼────┐
     │   light    │◄────────────│    dark    │
     └────────────┘  user click └───────────┘
```

---

## 2. JavaScript Theme Controller

The theme toggle is implemented in a single IIFE at the bottom of the page.

### Initialization Logic

```
1. Check localStorage for key "delightful-theme"
2. (Legacy cleanup) If "delightful-theme-mode" exists, remove it
3. If stored value is "light" or "dark" → use it
4. Else → query OS preference via matchMedia('(prefers-color-scheme: dark)')
   - If matches → apply "dark"
   - Else → apply "light"
5. Set the data-theme attribute on <html>
```

Exact code:

```javascript
const savedTheme = localStorage.getItem('delightful-theme');
const legacyMode = localStorage.getItem('delightful-theme-mode');
if (legacyMode) localStorage.removeItem('delightful-theme-mode');

const initialTheme = (savedTheme === 'light' || savedTheme === 'dark')
  ? savedTheme
  : (prefersDarkMq.matches ? 'dark' : 'light');
applyTheme(initialTheme);
```

### Theme Application

```javascript
function applyTheme(theme, persist = false) {
  html.setAttribute('data-theme', theme);
  html.removeAttribute('data-theme-mode');  // legacy cleanup
  if (persist) localStorage.setItem('delightful-theme', theme);
}
```

- `persist = false` for initialization (don't overwrite an absent preference with a derived one)
- `persist = true` for user-initiated toggles (save explicit choice)

### Toggle Click Handler

```javascript
themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  const apply = () => {
    applyTheme(next, true);
    if (typeof renderArchitecture === 'function') renderArchitecture(activeFamily || 'pink');
  };
  if (document.startViewTransition) document.startViewTransition(apply);
  else apply();
});
```

- Uses `document.startViewTransition()` when available for smooth cross-fade
- Falls back to instant swap in unsupported browsers
- Persists to `localStorage` on every toggle click

### OS Preference Listener

```javascript
prefersDarkMq.addEventListener('change', (e) => {
  const storedTheme = localStorage.getItem('delightful-theme');
  if (storedTheme !== 'light' && storedTheme !== 'dark') {
    applyTheme(e.matches ? 'dark' : 'light');
  }
});
```

- Only responds to OS changes if no explicit user preference is stored
- Once a user clicks the toggle, OS changes are ignored (user intent wins)

### localStorage Persistence

| Key | Values | Purpose |
|---|---|---|
| `delightful-theme` | `"light"` or `"dark"` | Persisted user preference |
| `delightful-theme-mode` | (legacy, removed on load) | Old 3-state key, cleaned up |
| `delightful-nav-revealed` | `"1"` | Unrelated — nav animation state |

---

## 3. Complete Token Diff: Light vs. Dark

Every semantic token that changes between themes, with exact OKLCH values from the reference.

### 3.1 Background Tokens

| Token | Light | Dark | Delta |
|---|---|---|---|
| `--bg-page` | `oklch(0.982 0.008 70)` | `oklch(0.140 0.014 65)` | L: 0.982 -> 0.140, hue 70 -> 65 |
| `--bg-surface` | `oklch(0.995 0.004 70)` | `oklch(0.165 0.015 65)` | L: 0.995 -> 0.165, hue 70 -> 65 |
| `--bg-elevated` | `oklch(1.00 0.00 0)` | `oklch(0.190 0.015 65)` | L: 1.00 -> 0.190, achromatic -> warm |
| `--bg-subtle` | `oklch(0.965 0.012 70)` | `oklch(0.210 0.015 65)` | L: 0.965 -> 0.210, hue 70 -> 65 |
| `--bg-muted` | `oklch(0.948 0.014 70)` | `oklch(0.180 0.013 65)` | L: 0.948 -> 0.180, hue 70 -> 65 |

**Pattern**: Light backgrounds use hue 70 (warm cream). Dark backgrounds shift to hue 65 (amber-tinted darkness). The lightness range in light mode is 0.948-1.00; in dark mode it is 0.140-0.210. Elevated surfaces are progressively lighter in dark mode (page < surface < elevated < subtle), maintaining the visual hierarchy.

### 3.2 Text Tokens

| Token | Light | Dark | Delta |
|---|---|---|---|
| `--text-primary` | `oklch(0.200 0.015 60)` | `oklch(0.935 0.008 70)` | L inverted: 0.200 -> 0.935 |
| `--text-secondary` | `oklch(0.420 0.015 60)` | `oklch(0.690 0.012 70)` | L inverted: 0.420 -> 0.690 |
| `--text-muted` | `oklch(0.560 0.012 60)` | `oklch(0.540 0.010 70)` | Near-identical L, hue shift |
| `--text-on-accent` | `oklch(1.00 0.000 0)` | `oklch(1.00 0.000 0)` | **No change** (always white) |
| `--text-on-gold` | `oklch(0.220 0.020 70)` | `oklch(0.140 0.014 65)` | Darkens to match dark bg-page |

**Pattern**: Primary and secondary text invert their lightness. Muted text stays in the middle range for both themes. `--text-on-accent` is always white. `--text-on-gold` darkens in dark mode to maintain contrast against the still-bright gold.

### 3.3 Border Tokens

| Token | Light | Dark | Delta |
|---|---|---|---|
| `--border-default` | `oklch(0.340 0.025 60)` | `oklch(0.550 0.010 65)` | L: 0.340 -> 0.550 (lighter in dark) |
| `--border-strong` | `oklch(0.250 0.020 60)` | `var(--text-primary)` * | Resolves to oklch(0.935 0.008 70) |
| `--border-subtle` | `oklch(0.820 0.015 70)` | `oklch(0.330 0.015 65)` | L inverted: 0.820 -> 0.330 |

\* `--border-strong` in dark mode is defined as `var(--text-primary)`, which resolves to the dark mode text-primary value.

**Pattern**: Border lightness inverts roughly. In dark mode, `--border-default` becomes a mid-lightness divider, `--border-strong` matches the near-white text for maximum contrast, and `--border-subtle` drops to low lightness for minimal contrast against the dark background.

### 3.4 Accent Tokens — Primary (Pink, hue 350)

| Token | Light | Dark | L Delta | C Delta |
|---|---|---|---|---|
| `--accent-primary` | `oklch(0.640 0.270 350)` | `oklch(0.700 0.230 350)` | +0.060 | -0.040 |
| `--accent-primary-hover` | `oklch(0.580 0.280 350)` | `oklch(0.740 0.220 350)` | +0.160 | -0.060 |
| `--accent-primary-subtle` | `oklch(0.955 0.040 350)` | `oklch(0.250 0.065 350)` | -0.705 | +0.025 |
| `--accent-primary-text` | `oklch(0.560 0.270 350)` | `oklch(0.750 0.210 350)` | +0.190 | -0.060 |

### 3.5 Accent Tokens — Danger (Red, hue 20)

| Token | Light | Dark | L Delta | C Delta |
|---|---|---|---|---|
| `--accent-danger` | `oklch(0.620 0.220 20)` | `oklch(0.660 0.200 20)` | +0.040 | -0.020 |
| `--accent-danger-hover` | `oklch(0.570 0.230 20)` | `oklch(0.700 0.190 20)` | +0.130 | -0.040 |
| `--accent-danger-subtle` | `oklch(0.950 0.040 20)` | `oklch(0.250 0.055 20)` | -0.700 | +0.015 |
| `--accent-danger-text` | `oklch(0.570 0.220 20)` | `oklch(0.720 0.180 20)` | +0.150 | -0.040 |

### 3.6 Accent Tokens — Gold (hue 85/84)

| Token | Light | Dark | L Delta | C Delta |
|---|---|---|---|---|
| `--accent-gold` | `oklch(0.840 0.175 85)` | `oklch(0.840 0.170 85)` | 0.000 | -0.005 |
| `--accent-gold-hover` | `oklch(0.820 0.165 84)` | `oklch(0.870 0.155 84)` | +0.050 | -0.010 |
| `--accent-gold-subtle` | `oklch(0.965 0.060 85)` | `oklch(0.260 0.065 85)` | -0.705 | +0.005 |
| `--accent-gold-text` | `oklch(0.560 0.170 85)` | `oklch(0.870 0.155 85)` | +0.310 | -0.015 |

### 3.7 Accent Tokens — Cyan (hue 210)

| Token | Light | Dark | L Delta | C Delta |
|---|---|---|---|---|
| `--accent-cyan` | `oklch(0.650 0.148 210)` | `oklch(0.720 0.140 210)` | +0.070 | -0.008 |
| `--accent-cyan-hover` | `oklch(0.600 0.150 210)` | `oklch(0.760 0.130 210)` | +0.160 | -0.020 |
| `--accent-cyan-subtle` | `oklch(0.945 0.030 210)` | `oklch(0.250 0.045 210)` | -0.695 | +0.015 |
| `--accent-cyan-text` | `oklch(0.560 0.148 210)` | `oklch(0.780 0.130 210)` | +0.220 | -0.018 |

### 3.8 Accent Tokens — Green (hue 148)

| Token | Light | Dark | L Delta | C Delta |
|---|---|---|---|---|
| `--accent-green` | `oklch(0.630 0.170 148)` | `oklch(0.680 0.155 148)` | +0.050 | -0.015 |
| `--accent-green-hover` | `oklch(0.580 0.165 148)` | `oklch(0.720 0.145 148)` | +0.140 | -0.020 |
| `--accent-green-subtle` | `oklch(0.945 0.035 148)` | `oklch(0.250 0.048 148)` | -0.695 | +0.013 |
| `--accent-green-text` | `oklch(0.520 0.170 148)` | `oklch(0.740 0.145 148)` | +0.220 | -0.025 |

### 3.9 Accent Tokens — Purple (hue 300)

| Token | Light | Dark | L Delta | C Delta |
|---|---|---|---|---|
| `--accent-purple` | `oklch(0.640 0.220 300)` | `oklch(0.700 0.200 300)` | +0.060 | -0.020 |
| `--accent-purple-hover` | `oklch(0.580 0.230 300)` | `oklch(0.740 0.190 300)` | +0.160 | -0.040 |
| `--accent-purple-subtle` | `oklch(0.950 0.035 300)` | `oklch(0.250 0.055 300)` | -0.700 | +0.020 |
| `--accent-purple-text` | `oklch(0.560 0.230 300)` | `oklch(0.760 0.180 300)` | +0.200 | -0.050 |

### 3.10 Status Aliases

| Token | Light Value | Dark Value |
|---|---|---|
| `--status-info` | `var(--accent-primary)` | `var(--accent-primary)` |
| `--status-error` | `var(--accent-danger)` | `var(--accent-danger)` |
| `--status-warning` | `var(--accent-gold)` | `var(--accent-gold)` |
| `--status-success` | `var(--accent-green)` | `var(--accent-green)` |

These are identical `var()` references in both themes. They inherit the theme change through their accent targets.

### 3.11 Focus & Overlay

| Token | Light | Dark |
|---|---|---|
| `--focus-ring` | `var(--accent-primary)` | `oklch(0.700 0.230 350)` |
| `--overlay-bg` | `oklch(0.200 0.015 60 / 0.30)` | `oklch(0 0 0 / 0.60)` |

Note: `--focus-ring` in light mode uses a `var()` reference; in dark mode it is a direct OKLCH value. The resolved values are: light = `oklch(0.640 0.270 350)`, dark = `oklch(0.700 0.230 350)`.

Overlay doubles its opacity in dark mode (0.30 -> 0.60) for sufficient dimming against bright content behind the overlay.

### 3.12 Shadows

| Token | Light | Dark |
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

---

## 4. Shadow Inversion Logic

The neo-brutalist shadow style uses **zero blur, solid offset** shadows. The inversion strategy differs between neutral and accent shadows.

### Neutral Shadows (sm, md, lg)

| Mode | Shadow Color | Effect |
|---|---|---|
| Light | `var(--border-default)` = `oklch(0.340 0.025 60)` | **Dark shadow** on light surface |
| Dark | `oklch(0.92 0.010 65)` | **Cream shadow** on dark surface |

The light-mode shadows use the existing `--border-default` (a dark warm gray). In dark mode, the shadows invert to a cream/off-white (`oklch(0.92 0.010 65)` — lightness 0.92). This produces a visible 3D effect on dark backgrounds where a dark shadow would be invisible.

The comment in the reference file describes this as: "Neo-Brutalist Solid Shadows -- Warm Inverted (cream on dark = visible 3D)".

### Accent Shadows (pink, danger, gold, cyan, green, purple)

These use `var()` references to their respective accent tokens in both themes. They do **not** need inversion because the accent colors are bright enough to be visible on both light and dark backgrounds. The accent tokens themselves increase in lightness in dark mode (see section 5 below), which further ensures visibility.

---

## 5. Accent Brightening Logic

In dark mode, accent colors are brightened to maintain visibility and vibrancy against dark backgrounds. The pattern is consistent across all six accent families:

### Base Accent (`--accent-*`)

**Strategy**: Increase lightness by +0.040 to +0.070, decrease chroma by -0.005 to -0.040.

| Family | Light L | Dark L | L Increase | Light C | Dark C | C Decrease |
|---|---|---|---|---|---|---|
| Primary | 0.640 | 0.700 | +0.060 | 0.270 | 0.230 | -0.040 |
| Danger | 0.620 | 0.660 | +0.040 | 0.220 | 0.200 | -0.020 |
| Gold | 0.840 | 0.840 | 0.000 | 0.175 | 0.170 | -0.005 |
| Cyan | 0.650 | 0.720 | +0.070 | 0.148 | 0.140 | -0.008 |
| Green | 0.630 | 0.680 | +0.050 | 0.170 | 0.155 | -0.015 |
| Purple | 0.640 | 0.700 | +0.060 | 0.220 | 0.200 | -0.020 |

Gold is the exception: it is already very light (L=0.840) so it does not increase further. Its chroma decreases minimally.

### Hover State (`--accent-*-hover`)

**Strategy**: In light mode, hovers darken (lower L). In dark mode, hovers brighten (higher L). This is a full direction reversal.

| Family | Light Hover L | Dark Hover L | Direction |
|---|---|---|---|
| Primary | 0.580 (darken) | 0.740 (brighten) | Reversed |
| Danger | 0.570 (darken) | 0.700 (brighten) | Reversed |
| Gold | 0.820 (darken) | 0.870 (brighten) | Reversed |
| Cyan | 0.600 (darken) | 0.760 (brighten) | Reversed |
| Green | 0.580 (darken) | 0.720 (brighten) | Reversed |
| Purple | 0.580 (darken) | 0.740 (brighten) | Reversed |

### Subtle Background (`--accent-*-subtle`)

**Strategy**: Full inversion. Light mode uses near-white tints (L ~0.945-0.965). Dark mode uses near-black tints (L ~0.250-0.260). Chroma slightly increases in dark mode.

| Family | Light L | Dark L | Light C | Dark C |
|---|---|---|---|---|
| Primary | 0.955 | 0.250 | 0.040 | 0.065 |
| Danger | 0.950 | 0.250 | 0.040 | 0.055 |
| Gold | 0.965 | 0.260 | 0.060 | 0.065 |
| Cyan | 0.945 | 0.250 | 0.030 | 0.045 |
| Green | 0.945 | 0.250 | 0.035 | 0.048 |
| Purple | 0.950 | 0.250 | 0.035 | 0.055 |

### Accent Text (`--accent-*-text`)

**Strategy**: Significant lightness increase (+0.150 to +0.310) to ensure readability on dark backgrounds. Chroma decreases.

| Family | Light L | Dark L | L Increase |
|---|---|---|---|
| Primary | 0.560 | 0.750 | +0.190 |
| Danger | 0.570 | 0.720 | +0.150 |
| Gold | 0.560 | 0.870 | +0.310 |
| Cyan | 0.560 | 0.780 | +0.220 |
| Green | 0.520 | 0.740 | +0.220 |
| Purple | 0.560 | 0.760 | +0.200 |

---

## 6. Hue Shifts Between Themes

### Background Hues

Light backgrounds use **hue 70** (warm cream). Dark backgrounds use **hue 65** (amber-tinted). This 5-degree shift produces a slightly warmer, more amber darkness.

### Text Hues

Light text uses **hue 60** (warm). Dark theme text uses **hue 70** (cream). The shift is reversed — dark text on light uses a warmer tone, light text on dark uses a creamier tone.

### Border Hues

Same pattern as backgrounds: hue 60 in light -> hue 65 in dark.

### Accent Hues

All accent hues remain **unchanged** between themes. Only lightness and chroma are adjusted.

---

## 7. Component-Level Dark Mode Overrides

One component has a direct `[data-theme="dark"]` override outside the semantic layer:

### Top Navigation

```css
.topnav {
  background: oklch(0.995 0.004 70 / 0.88);
  backdrop-filter: blur(16px);

  [data-theme="dark"] & {
    background: oklch(0.165 0.015 65 / 0.88);
  }
}
```

This uses a nested selector (CSS Nesting) to override the nav background in dark mode. The 0.88 alpha provides a frosted-glass effect over scrolled content. The dark value matches `--bg-surface` at the same opacity.

---

## 8. Tokens That Do NOT Change

The following semantic tokens are identical in both themes:

| Token | Value (both themes) | Reason |
|---|---|---|
| `--text-on-accent` | `oklch(1.00 0.000 0)` | Always white — accent bg colors ensure contrast |
| `--status-info` | `var(--accent-primary)` | Inherits change through var() |
| `--status-error` | `var(--accent-danger)` | Inherits change through var() |
| `--status-warning` | `var(--accent-gold)` | Inherits change through var() |
| `--status-success` | `var(--accent-green)` | Inherits change through var() |

Note: The status tokens use identical `var()` references in both themes, but their **resolved values** do change because the accent tokens they reference are overridden.

The only truly invariant resolved value is `--text-on-accent`, which is pure white in both themes.

---

## 9. Implementation Checklist

For an agent implementing dark mode:

1. Set cascade layer order: `@layer reset, primitives, semantic, component, utilities;`
2. Define light semantic tokens on `:root, [data-theme="light"]`
3. Define dark semantic tokens on `[data-theme="dark"]`
4. Primitives (Tier 1) go on `:root` only — they do not change between themes
5. Component tokens (Tier 3) go on `:root` only — they reference semantic tokens that handle the switch
6. Add theme toggle JS:
   - Read `localStorage.getItem('delightful-theme')`
   - Fall back to `matchMedia('(prefers-color-scheme: dark)').matches`
   - Toggle sets `data-theme` attribute and persists to `localStorage`
   - Use `document.startViewTransition()` when available
7. Add OS preference listener that respects stored preference
8. Ensure the code block syntax colors (hardcoded in `.code-block`) remain static — they are designed for a dark background and do not theme-switch
