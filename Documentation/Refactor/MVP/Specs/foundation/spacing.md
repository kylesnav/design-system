---
title: "Spacing"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Spacing

> Complete spacing token inventory and usage guidance for the Delightful Design System.

Cross-references: [[token-tiers]] (where these tokens live in the cascade), [[utilities]] (utility classes that consume spacing tokens).

---

## 1. Base Unit

The spacing system is built on a **4px base unit**. Token names use a multiplier convention: `--space-N` equals `N * 4px`.

The one exception is `--space-1-5` (6px), which fills the gap between 4px and 8px for tight UI spacing needs like button icon gaps.

---

## 2. The 8px Grid

While the base unit is 4px, the **primary alignment grid is 8px** (i.e., `--space-2`). Most component padding, margins, and gaps should align to multiples of 8px. The 4px sub-grid exists for fine-tuning within components (e.g., badge padding, icon-to-label gaps).

---

## 3. Complete Spacing Scale

All tokens defined on `:root` inside `@layer component`.

| CSS Custom Property | Value | Multiplier | Usage Examples |
|---|---|---|---|
| `--space-1` | `4px` | 1x | Icon-to-text micro gap, badge vertical padding |
| `--space-1-5` | `6px` | 1.5x | Button icon-label gap (`--btn-gap`) |
| `--space-2` | `8px` | 2x | Tight padding (overline margin-bottom), small gaps |
| `--space-3` | `12px` | 3x | Inter-element spacing, section title margin-bottom |
| `--space-4` | `16px` | 4x | Standard component padding, grid-4 gap |
| `--space-5` | `20px` | 5x | Button horizontal padding |
| `--space-6` | `24px` | 6x | Subsection title margin-bottom, grid-3 gap |
| `--space-8` | `32px` | 8x | Page-wrap horizontal padding, grid-2 gap |
| `--space-10` | `40px` | 10x | Medium section padding (mobile) |
| `--space-12` | `48px` | 12x | Section header margin-bottom, subsection margin-bottom |
| `--space-16` | `64px` | 16x | Large vertical rhythm |
| `--space-20` | `80px` | 20x | Section vertical padding (`.ds-section`) |

**Total: 12 spacing tokens**

---

## 4. Spacing in Component Context

### 4.1 Page Layout

| Element | Property | Token |
|---|---|---|
| `.page-wrap` | `padding: 0 var(--space-8)` | `--space-8` (32px horizontal) |
| `.ds-section` | `padding: var(--space-20) 0` | `--space-20` (80px vertical) |
| `.section-header` | `margin-bottom: var(--space-12)` | `--space-12` (48px) |

### 4.2 Section Typography

| Element | Property | Token |
|---|---|---|
| `.section-overline` | `margin-bottom: var(--space-2)` | `--space-2` (8px) |
| `.section-overline` | `gap: var(--space-2)` | `--space-2` (8px) |
| `.section-title` | `margin-bottom: var(--space-3)` | `--space-3` (12px) |
| `.subsection` | `margin-bottom: var(--space-12)` | `--space-12` (48px) |
| `.subsection-title` | `margin-bottom: var(--space-6)` | `--space-6` (24px) |
| `.subsection-label` | `margin-bottom: var(--space-3)` | `--space-3` (12px) |
| `.subsection-desc` | `margin-bottom: var(--space-6)` | `--space-6` (24px) |

### 4.3 Grid Gaps

| Grid Class | Gap Token | Value |
|---|---|---|
| `.grid-2` | `var(--space-8)` | 32px |
| `.grid-3` | `var(--space-6)` | 24px |
| `.grid-4` | `var(--space-4)` | 16px |
| `.flex-wrap-gap` | `var(--space-3)` | 12px |

### 4.4 Controls (Documented)

| Component | Property | Token | Value |
|---|---|---|---|
| Button icon gap | `gap` | `var(--btn-gap)` = `var(--space-1-5)` | 6px |
| Badge | `padding` | `--badge-py: 2px` / `--badge-px: 10px` | Hardcoded values |
| Button (documented) | `padding` | `var(--space-2)` / `var(--space-5)` | 8px / 20px |

---

## 5. Implementation CSS

Complete CSS for an implementing agent to copy:

```css
@layer component {
  :root {
    --space-1: 4px;
    --space-1-5: 6px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;
    --space-12: 48px;
    --space-16: 64px;
    --space-20: 80px;
  }
}
```
