---
title: "Utility Classes"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Utility Classes

> Complete inventory of every utility class in the Delightful Design System, their exact CSS rules, and their token references.

Cross-references: [[token-tiers]] (cascade layer architecture), [[spacing]] (spacing tokens), [[typography]] (font and text tokens).

---

## 1. Layer Declaration

All utility classes live inside `@layer utilities`, which is the **highest priority** layer in the cascade:

```css
@layer reset, primitives, semantic, component, utilities;
```

This means utility classes override everything -- component styles, semantic styles, and reset styles. This is by design: utilities are escape hatches for one-off layout adjustments in markup.

---

## 2. Cascade Specificity Interaction

### How utilities override components

Because CSS cascade layers determine priority regardless of selector specificity, a simple `.flex` class in `@layer utilities` will override a more specific selector in `@layer component`. This means:

1. You can always apply a utility to override a component's default layout behavior.
2. Utilities should be used sparingly -- they are overrides, not the primary styling mechanism.
3. If you find yourself applying many utilities to a single element, that element probably needs a component class instead.

### Layer priority (lowest to highest)

```
reset < primitives < semantic < component < utilities
```

A `.text-center` utility will always beat a `.card-title { text-align: left }` component rule, regardless of selector specificity.

---

## 3. Complete Utility Inventory

### 3.1 Flexbox Layout

| Class | CSS Rule | Token Reference |
|---|---|---|
| `.flex` | `display: flex;` | -- |
| `.flex-col` | `flex-direction: column;` | -- |
| `.flex-wrap` | `flex-wrap: wrap;` | -- |
| `.items-center` | `align-items: center;` | -- |
| `.items-start` | `align-items: flex-start;` | -- |
| `.justify-between` | `justify-content: space-between;` | -- |
| `.justify-center` | `justify-content: center;` | -- |
| `.justify-end` | `justify-content: flex-end;` | -- |

### 3.2 Gap (Spacing)

| Class | CSS Rule | Token Reference |
|---|---|---|
| `.gap-1` | `gap: var(--space-1);` | `--space-1` = `4px` |
| `.gap-2` | `gap: var(--space-2);` | `--space-2` = `8px` |
| `.gap-3` | `gap: var(--space-3);` | `--space-3` = `12px` |
| `.gap-4` | `gap: var(--space-4);` | `--space-4` = `16px` |
| `.gap-6` | `gap: var(--space-6);` | `--space-6` = `24px` |
| `.gap-8` | `gap: var(--space-8);` | `--space-8` = `32px` |

### 3.3 Margin -- Top

| Class | CSS Rule | Token Reference |
|---|---|---|
| `.mt-2` | `margin-top: var(--space-2);` | `--space-2` = `8px` |
| `.mt-4` | `margin-top: var(--space-4);` | `--space-4` = `16px` |
| `.mt-6` | `margin-top: var(--space-6);` | `--space-6` = `24px` |
| `.mt-8` | `margin-top: var(--space-8);` | `--space-8` = `32px` |

### 3.4 Margin -- Bottom

| Class | CSS Rule | Token Reference |
|---|---|---|
| `.mb-4` | `margin-bottom: var(--space-4);` | `--space-4` = `16px` |
| `.mb-6` | `margin-bottom: var(--space-6);` | `--space-6` = `24px` |

### 3.5 Text & Typography

| Class | CSS Rule | Token Reference |
|---|---|---|
| `.text-center` | `text-align: center;` | -- |
| `.font-mono` | `font-family: var(--font-mono);` | `--font-mono` = `'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace` |
| `.text-sm` | `font-size: var(--ui-text-sm);` | `--ui-text-sm` = `0.8125rem` (13px) |
| `.text-xs` | `font-size: var(--ui-text-xs);` | `--ui-text-xs` = `0.75rem` (12px) |
| `.text-muted` | `color: var(--text-muted);` | `--text-muted` (theme-aware semantic token) |
| `.text-secondary` | `color: var(--text-secondary);` | `--text-secondary` (theme-aware semantic token) |

### 3.6 Width

| Class | CSS Rule | Token Reference |
|---|---|---|
| `.w-full` | `width: 100%;` | -- |
| `.max-w-md` | `max-width: var(--container-md);` | `--container-md` = `960px` |

---

## 4. Screen-Reader Only Utility

Defined in `@layer component` (not `@layer utilities`), but functions as a utility class:

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

| Property | Value | Effect |
|---|---|---|
| `position` | `absolute` | Removes from document flow |
| `width` | `1px` | Minimum size (not 0 -- some screen readers ignore 0-sized elements) |
| `height` | `1px` | Minimum size |
| `padding` | `0` | No padding |
| `margin` | `-1px` | Collapses the 1px size |
| `overflow` | `hidden` | Clips any overflow |
| `clip` | `rect(0, 0, 0, 0)` | Legacy clip to hide visually |
| `white-space` | `nowrap` | Prevents text wrapping |
| `border-width` | `0` | No border |

Note: `.sr-only` is defined in `@layer component`, not `@layer utilities`. This means component-layer rules can override it if needed. The class is listed here because it functions as a utility despite its layer placement.

---

## 5. Token Cross-Reference Summary

Every token referenced by a utility class, verified against [[token-tiers]]:

| Token | Layer | Exists | Value |
|---|---|---|---|
| `--space-1` | component | Yes | `4px` |
| `--space-2` | component | Yes | `8px` |
| `--space-3` | component | Yes | `12px` |
| `--space-4` | component | Yes | `16px` |
| `--space-6` | component | Yes | `24px` |
| `--space-8` | component | Yes | `32px` |
| `--font-mono` | component | Yes | `'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace` |
| `--ui-text-sm` | component | Yes | `0.8125rem` |
| `--ui-text-xs` | component | Yes | `0.75rem` |
| `--text-muted` | semantic | Yes | Theme-aware |
| `--text-secondary` | semantic | Yes | Theme-aware |
| `--container-md` | component | Yes | `960px` |

All referenced tokens are verified to exist in the token tier system.

---

## 6. Implementation CSS

Complete CSS for an implementing agent to copy:

```css
@layer utilities {
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .flex-wrap { flex-wrap: wrap; }
  .items-center { align-items: center; }
  .items-start { align-items: flex-start; }
  .justify-between { justify-content: space-between; }
  .justify-center { justify-content: center; }
  .justify-end { justify-content: flex-end; }
  .gap-1 { gap: var(--space-1); }
  .gap-2 { gap: var(--space-2); }
  .gap-3 { gap: var(--space-3); }
  .gap-4 { gap: var(--space-4); }
  .gap-6 { gap: var(--space-6); }
  .gap-8 { gap: var(--space-8); }
  .mt-2 { margin-top: var(--space-2); }
  .mt-4 { margin-top: var(--space-4); }
  .mt-6 { margin-top: var(--space-6); }
  .mt-8 { margin-top: var(--space-8); }
  .mb-4 { margin-bottom: var(--space-4); }
  .mb-6 { margin-bottom: var(--space-6); }
  .text-center { text-align: center; }
  .font-mono { font-family: var(--font-mono); }
  .text-sm { font-size: var(--ui-text-sm); }
  .text-xs { font-size: var(--ui-text-xs); }
  .text-muted { color: var(--text-muted); }
  .text-secondary { color: var(--text-secondary); }
  .w-full { width: 100%; }
  .max-w-md { max-width: var(--container-md); }
}
```
