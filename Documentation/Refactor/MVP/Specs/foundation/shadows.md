---
title: "Shadows"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Shadows

> Complete shadow token inventory, design philosophy, and dark mode inversion logic for the Delightful Design System.

Cross-references: [[token-tiers]] (shadow tokens live in the semantic tier), [[palette-schema]] (accent colors used in colored shadows), [[motion]] (lift/press interaction timing).

---

## 1. The Zero-Blur Neo-Brutalist Rule

Every shadow in the Delightful Design System uses **zero blur**. All shadows are solid, hard-edged offset rectangles. This is the defining characteristic of the neo-brutalist shadow style:

```
offset-x  offset-y  blur  color
   4px       4px     0    <color>
```

The `blur` value is always `0`. This creates a graphic, print-inspired shadow that looks like a physical object casting a shadow at a fixed angle (down-right at 45 degrees). There are no soft, diffused shadows anywhere in the system.

---

## 2. The 3 Size Tiers

Three neutral shadow sizes provide depth hierarchy. Defined in `@layer semantic`.

### 2.1 Light Mode

| CSS Custom Property | Value | Offset |
|---|---|---|
| `--shadow-sm` | `2px 2px 0 var(--border-default)` | 2px right, 2px down |
| `--shadow-md` | `4px 4px 0 var(--border-default)` | 4px right, 4px down |
| `--shadow-lg` | `8px 8px 0 var(--border-default)` | 8px right, 8px down |

In light mode, the shadow color is `var(--border-default)` which resolves to `oklch(0.340 0.025 60)` -- a warm dark brown/charcoal.

### 2.2 Dark Mode

| CSS Custom Property | Value | Offset |
|---|---|---|
| `--shadow-sm` | `2px 2px 0 oklch(0.92 0.010 65)` | 2px right, 2px down |
| `--shadow-md` | `4px 4px 0 oklch(0.92 0.010 65)` | 4px right, 4px down |
| `--shadow-lg` | `8px 8px 0 oklch(0.92 0.010 65)` | 8px right, 8px down |

In dark mode, the shadow color **inverts** to a warm cream (`oklch(0.92 0.010 65)`) -- visible against dark backgrounds while maintaining the warm tonal character.

### 2.3 Size progression

The offsets double at each step: 2px -> 4px -> 8px. This creates clear visual hierarchy:

| Tier | Offset | Use Case |
|---|---|---|
| `sm` (2px) | Subtle lift. Buttons at rest, small cards, tags. |
| `md` (4px) | Standard elevation. Cards, panels, dropdowns. |
| `lg` (8px) | Maximum lift. Hover states, featured cards, modals. |

---

## 3. The 6 Colored Variants

Six accent-colored shadows for branded elevation. All use the `md` offset (4px 4px). Defined in `@layer semantic`.

### 3.1 Light Mode

| CSS Custom Property | Value | Accent Family |
|---|---|---|
| `--shadow-pink` | `4px 4px 0 var(--accent-primary)` | Primary (pink, hue 350) |
| `--shadow-danger` | `4px 4px 0 var(--accent-danger)` | Danger (red, hue 20) |
| `--shadow-gold` | `4px 4px 0 var(--accent-gold)` | Gold (hue 85) |
| `--shadow-cyan` | `4px 4px 0 var(--accent-cyan)` | Cyan (hue 210) |
| `--shadow-green` | `4px 4px 0 var(--accent-green)` | Green (hue 148) |
| `--shadow-purple` | `4px 4px 0 var(--accent-purple)` | Purple (hue 300) |

### 3.2 Dark Mode

| CSS Custom Property | Value | Accent Family |
|---|---|---|
| `--shadow-pink` | `4px 4px 0 var(--accent-primary)` | Primary (pink) |
| `--shadow-danger` | `4px 4px 0 var(--accent-danger)` | Danger (red) |
| `--shadow-gold` | `4px 4px 0 var(--accent-gold)` | Gold |
| `--shadow-cyan` | `4px 4px 0 var(--accent-cyan)` | Cyan |
| `--shadow-green` | `4px 4px 0 var(--accent-green)` | Green |
| `--shadow-purple` | `4px 4px 0 var(--accent-purple)` | Purple |

Colored shadows use `var()` references to accent tokens in both themes. Since accent tokens themselves change between light and dark mode (e.g., `--accent-primary` shifts from `oklch(0.640 0.270 350)` in light to `oklch(0.700 0.230 350)` in dark), the colored shadows automatically adapt.

---

## 4. Shadow Inversion in Dark Mode

### 4.1 Neutral shadows: dark to cream

In light mode, neutral shadows cast **dark** against a light background (border-default color). In dark mode, this inverts: shadows cast a **warm cream** (`oklch(0.92 0.010 65)`) against the dark background. This maintains the 3D illusion -- the shadow must be visible against its surface.

The dark-mode cream color is hardcoded (not a `var()` reference) because it needs to be a specific warm off-white that reads as a shadow against dark surfaces without appearing like a glow.

### 4.2 Colored shadows: accent colors maintained

Colored shadows use the same `var(--accent-*)` references in both themes. The accent tokens themselves adjust between themes (lighter/brighter in dark mode for readability), so colored shadows naturally adapt without additional overrides.

---

## 5. Lift/Press Interaction Pattern

The shadow system enables a physical "lift and press" interaction pattern for interactive cards and buttons:

### 5.1 The pattern

| State | Shadow | Transform | Effect |
|---|---|---|---|
| **Rest** | `--shadow-md` (4px 4px) | none | Element appears elevated |
| **Hover** | `--shadow-lg` (8px 8px) | `translateY(-3px) scale(1.01)` | Element lifts higher |
| **Active/Press** | none (0 0 0) | `translateY(0) scale(0.99)` or `translate(2px, 2px)` | Element "presses" flat into surface |

### 5.2 Shadow escalation on hover

Cards use shadow escalation: resting at `--shadow-md`, scaling up to `--shadow-lg` on hover, and snapping flat on press. The `.hover-lift` utility class implements this for standalone elements.

### 5.3 Reactive grid dimming

When one card in a grid is hovered, non-hovered cards dim and their shadows collapse:

```css
.grid-2:has(.card-interactive:hover) .card:not(:hover) {
  opacity: 0.7;
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 var(--border-default);
  filter: grayscale(0.8);
}
```

This creates a visual "press" effect on the non-hovered cards while the hovered card lifts.

---

## 6. Complete Token Summary

**Total: 9 shadow tokens** (3 neutral size tiers + 6 colored variants)

All 9 tokens are defined in `@layer semantic` with separate values for `[data-theme="light"]` and `[data-theme="dark"]`.

---

## 7. Implementation CSS

Complete CSS for an implementing agent to copy:

```css
@layer semantic {
  :root,
  [data-theme="light"] {
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
