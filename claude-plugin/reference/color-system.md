# Delightful Design System — Color System

OKLCH-native, 3-tier token architecture, 6 accent families + warm neutral scale. Every value is `oklch()` — no hex, rgb, or hsl anywhere. Light and dark themes are hand-tuned independently, not generated from formulas.

Cross-references: `tokens.md` for full token tables, `components.md` for component patterns, `composition.md` for layout rules.

---

## Why OKLCH

OKLCH (Oklab Lightness-Chroma-Hue) is the color model for the entire system. Every primitive, semantic, and component color is authored in `oklch()`.

**Perceptual uniformity.** Equal numeric steps in L (lightness) produce equal perceived brightness changes. A pink at `L 0.640` and a cyan at `L 0.650` look roughly the same brightness — unlike HSL where `lightness: 50%` varies wildly across hues.

**Predictable lightness.** The L channel (0-1) maps directly to perceived luminance. This makes contrast math straightforward: if two colors differ by 0.4+ in L, they have strong visual separation.

**Chroma-independent hue.** Changing saturation (C) does not shift the perceived hue. In HSL, desaturating a blue makes it look purple. In OKLCH, hue stays locked.

**Wide gamut (P3).** OKLCH natively addresses the full Display P3 gamut. The system's pink (`C 0.270`) and purple (`C 0.260`) values exceed sRGB — they render at full vibrancy on P3 displays and gracefully gamut-map on sRGB.

**Gamut mapping.** Browsers automatically clamp out-of-gamut OKLCH values to the nearest displayable color. No fallback stacks needed — `oklch(0.640 0.270 350)` just works.

```css
/* OKLCH anatomy */
oklch(L C H)
/*    L = Lightness  0-1    (0 = black, 1 = white)
      C = Chroma     0-0.4  (0 = gray, higher = more saturated)
      H = Hue        0-360  (angle on the color wheel) */
```

---

## Palette Composition

### 6 Accent Families

Each family has a fixed hue angle and 5 stops (100-500). The 400 stop is the "base" used for semantic accent tokens.

| Family | Hue Angle | Role | Base (400) |
|--------|-----------|------|------------|
| Pink | 350 | Primary brand, actions | `oklch(0.640 0.270 350)` |
| Red | 20 | Danger, errors | `oklch(0.620 0.220 20)` |
| Gold | 85 | Warning, highlights | `oklch(0.840 0.175 85)` |
| Cyan | 210 | Tertiary, info | `oklch(0.650 0.148 210)` |
| Green | 148 | Success | `oklch(0.630 0.170 148)` |
| Purple | 300 | Creative, special | `oklch(0.640 0.220 300)` |

### Accent Stop Pattern

Each accent family follows the same 5-stop curve. Lightness decreases and chroma increases from 100 to 500:

| Stop | Lightness Range | Chroma Range | Use |
|------|-----------------|--------------|-----|
| 100 | 0.920 - 0.960 | 0.038 - 0.060 | Tint backgrounds, subtle fills |
| 200 | 0.840 - 0.920 | 0.080 - 0.140 | Light accents, hover backgrounds |
| 300 | 0.720 - 0.870 | 0.125 - 0.220 | Medium accents, illustrations |
| 400 | 0.620 - 0.840 | 0.148 - 0.270 | **Base** — buttons, badges, primary UI |
| 500 | 0.540 - 0.820 | 0.155 - 0.280 | Deep accents, hover states, text on light |

Full primitive values for all 6 families and the neutral scale are in `tokens.md` (Tier 1 Primitives section). Here's one family to show the pattern:

**Pink** (H 350):
```
--primitive-pink-100  oklch(0.920 0.060 350)   /* tint bg */
--primitive-pink-200  oklch(0.840 0.140 350)   /* light accent */
--primitive-pink-300  oklch(0.720 0.220 350)   /* medium */
--primitive-pink-400  oklch(0.640 0.270 350)   /* base */
--primitive-pink-500  oklch(0.560 0.280 350)   /* deep */
```

All 6 families follow the same L/C curve — only hue differs. See `tokens.md` for complete values.

### Neutral Scale

14 stops from pure white (0) to near-black (950). Full values in `tokens.md`.

**Hue shift at 800+:** Neutral stops 0-700 use hue 70 (amber-cream warmth). Stops 800-950 shift to hue 60 (slightly cooler charcoal) for richer darks without orange muddiness.

**Chroma curve:** Stays low throughout (0.000 - 0.014). Just enough tint to feel warm, never enough to read as a color.

---

## 3-Tier Token Flow

Color flows through 3 strict tiers. Nothing skips a tier.

### Tier 1 — Primitives

Raw OKLCH values. Named by family + lightness stop. No semantic meaning.

```
--primitive-{family}-{stop}
```

Examples:
```css
--primitive-pink-400:    oklch(0.640 0.270 350);
--primitive-neutral-800: oklch(0.250 0.012 60);
--primitive-gold-100:    oklch(0.960 0.050 85);
```

**Rule:** Never reference primitives directly in component CSS. They exist only as the raw material for Tier 2.

### Tier 2 — Semantic Tokens

Theme-aware. Each token has a light and dark value, hand-tuned independently. Named by intent, not color.

**Naming conventions:**
- Backgrounds: `--bg-{level}` (page, surface, elevated, subtle, muted)
- Text: `--text-{role}` (primary, secondary, muted, on-accent, on-gold)
- Borders: `--border-{weight}` (default, strong, subtle)
- Accents: `--accent-{family}` with 4 variants per family:

| Variant | Pattern | Purpose |
|---------|---------|---------|
| Base | `--accent-{family}` | Primary color for the family |
| Hover | `--accent-{family}-hover` | Darker (light) / lighter (dark) for hover |
| Subtle | `--accent-{family}-subtle` | Tinted background fill |
| Text | `--accent-{family}-text` | Readable colored text on neutral backgrounds |

**Light mode accent example** (Pink):
```css
--accent-primary:        oklch(0.640 0.270 350);  /* base */
--accent-primary-hover:  oklch(0.580 0.280 350);  /* darker for hover */
--accent-primary-subtle: oklch(0.955 0.040 350);  /* light pink tint bg */
--accent-primary-text:   oklch(0.560 0.270 350);  /* readable on neutral bg */
```

**Dark mode accent example** (Pink):
```css
--accent-primary:        oklch(0.700 0.230 350);  /* lighter base */
--accent-primary-hover:  oklch(0.740 0.220 350);  /* even lighter for hover */
--accent-primary-subtle: oklch(0.250 0.065 350);  /* dark pink tint bg */
--accent-primary-text:   oklch(0.750 0.210 350);  /* readable on dark bg */
```

**Status aliases** map to accent families:
```css
--status-info:    var(--accent-primary);  /* Pink */
--status-error:   var(--accent-danger);   /* Red */
--status-warning: var(--accent-gold);     /* Gold */
--status-success: var(--accent-green);    /* Green */
```

### Tier 3 — Component Tokens

UI-specific. Scoped to a single component type. Always `var()` references to semantic tokens — never raw OKLCH.

```css
/* Button tokens */
--btn-primary-bg:   var(--accent-primary);
--btn-primary-text: var(--text-on-accent);
--btn-gold-bg:      var(--accent-gold);
--btn-gold-text:    var(--text-on-gold);

/* Toggle tokens */
--toggle-off-bg: var(--primitive-neutral-300);
--toggle-on-bg:  var(--accent-primary);
--toggle-knob:   var(--primitive-neutral-0);

/* Chart palette */
--chart-1: var(--accent-primary);
--chart-2: var(--accent-gold);
--chart-3: var(--accent-cyan);
--chart-4: var(--accent-green);
--chart-5: var(--accent-purple);
--chart-6: var(--accent-danger);
```

### The Complete Flow

Trace a single color from raw value to rendered button:

```
Tier 1 (Primitive)     Tier 2 (Semantic)       Tier 3 (Component)
─────────────────      ──────────────────      ──────────────────
--primitive-pink-400   --accent-primary        --btn-primary-bg
oklch(0.640 0.270 350) var(--prim-pink-400)*   var(--accent-primary)
                       ↕ theme-switched         → used in .btn-primary
                       light: oklch(0.640 0.270 350)
                       dark:  oklch(0.700 0.230 350)
```

*Semantic tokens resolve to different primitives per theme, but the values are hand-tuned — not literal `var()` references to primitives.

---

## Dark Mode Shift Rules

Light and dark values are tuned independently per token. The shifts follow consistent patterns across the system.

### Background Shifts

Backgrounds invert from high-L warm cream to low-L warm charcoal. Hue shifts from 70 (amber) to 65 (amber-brown).

| Token | Light | Dark | L shift | C shift | H shift |
|-------|-------|------|---------|---------|---------|
| `--bg-page` | `oklch(0.982 0.008 70)` | `oklch(0.140 0.014 65)` | -0.842 | +0.006 | -5 |
| `--bg-surface` | `oklch(0.995 0.004 70)` | `oklch(0.165 0.015 65)` | -0.830 | +0.011 | -5 |
| `--bg-elevated` | `oklch(1.00 0.00 0)` | `oklch(0.190 0.015 65)` | -0.810 | +0.015 | +65 |
| `--bg-subtle` | `oklch(0.965 0.012 70)` | `oklch(0.210 0.015 65)` | -0.755 | +0.003 | -5 |
| `--bg-muted` | `oklch(0.948 0.014 70)` | `oklch(0.180 0.013 65)` | -0.768 | -0.001 | -5 |

**Pattern:** L drops ~0.75-0.84. Chroma stays very low but increases slightly in dark mode for warmth. Hue shifts 70 to 65.

### Text Shifts

Text inverts from dark-on-light to light-on-dark. Hue shifts from 60 to 70.

| Token | Light | Dark | L shift |
|-------|-------|------|---------|
| `--text-primary` | `oklch(0.200 0.015 60)` | `oklch(0.935 0.008 70)` | +0.735 |
| `--text-secondary` | `oklch(0.420 0.015 60)` | `oklch(0.690 0.012 70)` | +0.270 |
| `--text-muted` | `oklch(0.560 0.012 60)` | `oklch(0.540 0.010 70)` | -0.020 |
| `--text-on-accent` | `oklch(1.00 0.000 0)` | `oklch(1.00 0.000 0)` | 0 |
| `--text-on-gold` | `oklch(0.220 0.020 70)` | `oklch(0.140 0.014 65)` | -0.080 |

**Pattern:** Primary text does a full inversion (~+0.74 L). Secondary gets a moderate bump. Muted stays near the midpoint in both themes. `--text-on-accent` stays white in both modes. `--text-on-gold` stays very dark in both (gold is always high-L).

### Accent Shifts

Accents shift lighter in dark mode (higher L) and slightly lower chroma for readability on dark backgrounds.

| Family | Light Base | Dark Base | L shift | C shift |
|--------|-----------|----------|---------|---------|
| Pink | `oklch(0.640 0.270 350)` | `oklch(0.700 0.230 350)` | +0.060 | -0.040 |
| Red | `oklch(0.620 0.220 20)` | `oklch(0.660 0.200 20)` | +0.040 | -0.020 |
| Gold | `oklch(0.840 0.175 85)` | `oklch(0.840 0.170 85)` | 0.000 | -0.005 |
| Cyan | `oklch(0.650 0.148 210)` | `oklch(0.720 0.140 210)` | +0.070 | -0.008 |
| Green | `oklch(0.630 0.170 148)` | `oklch(0.680 0.155 148)` | +0.050 | -0.015 |
| Purple | `oklch(0.640 0.220 300)` | `oklch(0.700 0.200 300)` | +0.060 | -0.020 |

**Pattern:** L increases +0.04 to +0.07 in dark mode (except gold, which is already high-L). Chroma decreases slightly (-0.005 to -0.040) to avoid over-saturation on dark backgrounds. Hue angles stay fixed.

### Subtle Background Shifts

Subtle tints invert dramatically — from high-L pastel washes to low-L dark tints.

| Family | Light Subtle | Dark Subtle | L shift | C shift |
|--------|-------------|------------|---------|---------|
| Pink | `oklch(0.955 0.040 350)` | `oklch(0.250 0.065 350)` | -0.705 | +0.025 |
| Red | `oklch(0.950 0.040 20)` | `oklch(0.250 0.055 20)` | -0.700 | +0.015 |
| Gold | `oklch(0.965 0.060 85)` | `oklch(0.260 0.065 85)` | -0.705 | +0.005 |
| Cyan | `oklch(0.945 0.030 210)` | `oklch(0.250 0.045 210)` | -0.695 | +0.015 |
| Green | `oklch(0.945 0.035 148)` | `oklch(0.250 0.048 148)` | -0.695 | +0.013 |
| Purple | `oklch(0.950 0.035 300)` | `oklch(0.250 0.055 300)` | -0.700 | +0.020 |

**Pattern:** L drops ~0.70. Chroma increases slightly in dark mode (+0.01 to +0.025) — dark tints need more chroma to remain perceptible against dark backgrounds.

### Accent Text Shifts

Text-colored accents shift significantly lighter in dark mode for readability.

| Family | Light Text | Dark Text | L shift | C shift |
|--------|-----------|----------|---------|---------|
| Pink | `oklch(0.560 0.270 350)` | `oklch(0.750 0.210 350)` | +0.190 | -0.060 |
| Red | `oklch(0.570 0.220 20)` | `oklch(0.720 0.180 20)` | +0.150 | -0.040 |
| Gold | `oklch(0.560 0.170 85)` | `oklch(0.870 0.155 85)` | +0.310 | -0.015 |
| Cyan | `oklch(0.560 0.148 210)` | `oklch(0.780 0.130 210)` | +0.220 | -0.018 |
| Green | `oklch(0.520 0.170 148)` | `oklch(0.740 0.145 148)` | +0.220 | -0.025 |
| Purple | `oklch(0.560 0.230 300)` | `oklch(0.760 0.180 300)` | +0.200 | -0.050 |

**Pattern:** L increases +0.15 to +0.31 (the largest shift of any token category — accent text must be highly readable). Chroma decreases to avoid vibration on dark backgrounds.

### Shadow Shifts

Shadows fundamentally change strategy between themes.

**Light mode:** Hard offset uses `var(--border-default)` (dark solid line). Ambient layer uses `oklch(0 0 0 / alpha)`.
```css
--shadow-md: 4px 4px 0 var(--border-default),
             0 4px 8px oklch(0 0 0 / 0.08);
```

**Dark mode:** Hard offset uses semi-transparent cream `oklch(0.92 0.010 65 / 0.2)` for a subtle warm glow. Ambient layer uses higher alpha.
```css
--shadow-md: 4px 4px 0 oklch(0.92 0.010 65 / 0.2),
             0 4px 12px oklch(0 0 0 / 0.3);
```

### Border Shifts

| Token | Light | Dark | Note |
|-------|-------|------|------|
| `--border-default` | `oklch(0.340 0.025 60)` | `oklch(0.550 0.010 65)` | Dark mode is muted — use `--border-strong` for emphasis |
| `--border-strong` | `oklch(0.250 0.020 60)` | `var(--text-primary)` | Full-contrast in both modes |
| `--border-subtle` | `oklch(0.820 0.015 70)` | `oklch(0.330 0.015 65)` | Structural dividers |

**Key dark mode behavior:** `--border-default` becomes muted (L 0.550, C 0.010) to reduce visual noise. This is intentional — dark UIs need less border contrast. Use `--border-strong` when you need a hard, visible edge.

---

## Contrast Pairing Guidelines

### Text on Neutral Backgrounds

| Text Token | Works On | Avoid |
|-----------|----------|-------|
| `--text-primary` | `--bg-page`, `--bg-surface`, `--bg-elevated`, `--bg-subtle`, `--bg-muted` | None — highest contrast, works everywhere |
| `--text-secondary` | `--bg-page`, `--bg-surface`, `--bg-elevated` | `--bg-muted` in light mode (marginal contrast) |
| `--text-muted` | `--bg-page`, `--bg-surface`, `--bg-elevated` | `--bg-subtle`, `--bg-muted` (insufficient contrast) |

### Text on Accent Backgrounds

| Accent Background | Text Token | Reason |
|-------------------|-----------|--------|
| Pink, Red, Cyan, Green, Purple (base) | `--text-on-accent` | White — high contrast against medium-L accents |
| Gold (base) | `--text-on-gold` | Dark — gold is high-L (~0.84), white would fail contrast |

### Accent Text on Neutral Backgrounds

Accent `-text` variants are tuned for readability on neutral backgrounds:

| Accent Text Token | Light Mode L | Dark Mode L | Safe Backgrounds |
|-------------------|-------------|-------------|------------------|
| `--accent-primary-text` | 0.560 | 0.750 | `--bg-page`, `--bg-surface`, `--bg-elevated` |
| `--accent-danger-text` | 0.570 | 0.720 | `--bg-page`, `--bg-surface`, `--bg-elevated` |
| `--accent-gold-text` | 0.560 | 0.870 | `--bg-page`, `--bg-surface`, `--bg-elevated` |
| `--accent-cyan-text` | 0.560 | 0.780 | `--bg-page`, `--bg-surface`, `--bg-elevated` |
| `--accent-green-text` | 0.520 | 0.740 | `--bg-page`, `--bg-surface`, `--bg-elevated` |
| `--accent-purple-text` | 0.560 | 0.760 | `--bg-page`, `--bg-surface`, `--bg-elevated` |

### Subtle Background Pairing

Subtle backgrounds (`--accent-{family}-subtle`) are designed for content blocks with accent text:

```css
/* Correct: accent text on accent subtle background */
.info-banner {
  background: var(--accent-primary-subtle);
  color: var(--accent-primary-text);
}

/* Also correct: primary text on subtle background */
.info-banner {
  background: var(--accent-primary-subtle);
  color: var(--text-primary);
}
```

Light subtle backgrounds (L ~0.945-0.965) pair with their `-text` variant (L ~0.52-0.56) and with `--text-primary` (L 0.200). Dark subtle backgrounds (L ~0.250-0.260) pair with their `-text` variant (L ~0.72-0.87) and with `--text-primary` (L 0.935).

### Quick Contrast Rules

1. **Primary text goes anywhere.** `--text-primary` has maximum contrast on all background tokens.
2. **Accent base needs white text.** Except gold, which needs dark text (`--text-on-gold`).
3. **Accent text tokens are for neutral backgrounds.** Do not put `-text` variants on `-subtle` backgrounds of a *different* family.
4. **Muted text is decorative.** `--text-muted` should not carry critical information — it has lower contrast by design.
5. **Borders do double duty.** In light mode, `--border-default` is dark enough for visible box shadows. In dark mode, shadows switch to semi-transparent cream.
