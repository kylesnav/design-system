---
title: "Border Radius"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Border Radius

> Complete border radius token inventory and design rationale for the Delightful Design System.

Cross-references: [[token-tiers]] (where these tokens live in the cascade).

---

## 1. Design Decision: Deliberately Large Radii

The Delightful Design System uses **deliberately large border radius values** compared to typical design systems. This is an intentional aesthetic choice: softness within a bold, neo-brutalist visual system. The large radii create a friendly, approachable feel that contrasts with the hard-edged solid shadows and strong borders -- producing a distinctive tension that defines the brand.

Even the smallest radius (`--radius-sm` at 10px) is larger than many systems' "large" radius. This is by design.

---

## 2. Complete Radius Scale

All tokens defined on `:root` inside `@layer component`.

| CSS Custom Property | Value | Design Intent |
|---|---|---|
| `--radius-sm` | `10px` | Default for small controls: buttons, inputs, badges, tags |
| `--radius-md` | `16px` | Cards, panels, elevated surfaces |
| `--radius-lg` | `24px` | Large cards, featured sections, dialog containers |
| `--radius-xl` | `32px` | Hero elements, prominent CTAs, decorative containers |
| `--radius-full` | `9999px` | Pills, avatars, toggle knobs, fully-rounded elements |

**Total: 5 radius tokens**

---

## 3. Component Usage

### 3.1 Which components use which radius

| Component | Radius Token | Notes |
|---|---|---|
| Buttons (default) | `--radius-sm` (10px) | All button variants (primary, outline, ghost, danger, etc.) |
| Inputs / Selects | `--radius-sm` (10px) | Documented as `--input-radius: var(--radius-sm)` |
| Badges | `--radius-full` (9999px) | Pill shape for all badge variants |
| Cards | `--radius-md` (16px) | Documented as `--card-radius: var(--radius-md)` |
| Toggle switch track | `--radius-full` (9999px) | Fully rounded capsule shape |
| Toggle switch knob | 50% (circle) | Uses `border-radius: 50%` directly |
| Tooltips | `--radius-sm` (10px) | Small control-level rounding |
| Modals / Dialogs | `--radius-lg` (24px) | Large container rounding |
| Avatars | `--radius-full` (9999px) | Circular |

### 3.2 Scale reasoning

The scale follows a doubling-ish progression: 10 -> 16 -> 24 -> 32 -> 9999. Each step represents a clear visual shift:

- **sm (10px)**: Noticeably rounded but compact. Good for elements that appear frequently (buttons, inputs).
- **md (16px)**: Soft but structural. For surfaces that frame content (cards, panels).
- **lg (24px)**: Prominently soft. For important containers that need visual weight (dialogs, feature sections).
- **xl (32px)**: Very soft. Reserved for hero-level or decorative use.
- **full (9999px)**: Fully rounded into a pill or circle. For avatars, badges, and toggles.

---

## 4. Implementation CSS

Complete CSS for an implementing agent to copy:

```css
@layer component {
  :root {
    --radius-sm: 10px;
    --radius-md: 16px;
    --radius-lg: 24px;
    --radius-xl: 32px;
    --radius-full: 9999px;
  }
}
```
