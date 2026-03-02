---
title: "Alert"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Alert

> Static alert banners with 6 color variants (pink, danger, gold, cyan, green, purple). Each variant has a matching accent-subtle background, accent border, and colored neo-brutalist shadow. Includes an icon, message text, and optional dismiss button.

Cross-references: [[toast]] (ephemeral notifications vs. static alerts), [[shadows]] (colored shadow variants: `--shadow-pink`, `--shadow-danger`, etc.), [[token-tiers]] (spacing, radius, accent tokens).

Visual reference: Section "Alert Banners" in `design-reference.html` (lines ~2937-3012 CSS, lines ~6672-6710 HTML).

---

## 1. HTML Structure

### 1.1 Alert with Dismiss Button

```html
<div class="alert alert-pink">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
  <span>A new version of the design system is available with improved tokens.</span>
  <button class="alert-dismiss" onclick="this.parentElement.style.display='none'">&times;</button>
</div>
```

---

## 2. CSS Classes

### 2.1 `.alert` (base)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `flex-start` | -- |
| `gap` | `var(--space-3)` | `12px` |
| `padding` | `var(--space-4)` | `16px` |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-md)` | `16px` |
| `font-size` | `0.875rem` | `--ui-text-md` = `14px` |
| `line-height` | `1.5` | -- |

### 2.2 `.alert svg` (icon)

| Property | Value |
|---|---|
| `flex-shrink` | `0` |
| `margin-top` | `1px` |

### 2.3 Color Variants

| Class | `background` | `color` | `border-color` | `box-shadow` |
|---|---|---|---|---|
| `.alert-pink` | `var(--accent-primary-subtle)` | `var(--accent-primary)` | `var(--accent-primary)` | `var(--shadow-pink)` |
| `.alert-danger` | `var(--accent-danger-subtle)` | `var(--accent-danger)` | `var(--accent-danger)` | `var(--shadow-danger)` |
| `.alert-gold` | `var(--accent-gold-subtle)` | `var(--accent-gold-text)` | `var(--accent-gold)` | `var(--shadow-gold)` |
| `.alert-cyan` | `var(--accent-cyan-subtle)` | `var(--accent-cyan)` | `var(--accent-cyan)` | `var(--shadow-cyan)` |
| `.alert-green` | `var(--accent-green-subtle)` | `var(--accent-green)` | `var(--accent-green)` | `var(--shadow-green)` |
| `.alert-purple` | `var(--accent-purple-subtle)` | `var(--accent-purple)` | `var(--accent-purple)` | `var(--shadow-purple)` |

Note: `.alert-gold` uses `--accent-gold-text` for text color (darker gold for readability), while other variants use their base accent color.

### 2.4 `.alert-dismiss`

| Property | Value | Token |
|---|---|---|
| `margin-left` | `auto` | Pushes to right edge |
| `background` | `none` | -- |
| `border` | `none` | -- |
| `cursor` | `pointer` | -- |
| `color` | `inherit` | Inherits from alert variant |
| `opacity` | `0.6` | -- |
| `padding` | `2px` | -- |
| `transition` | `transform var(--motion-instant) linear, opacity var(--motion-fast) var(--ease-out)` | -- |

| State | CSS Changes |
|---|---|
| Hover | `opacity: 1` |
| Active | `transform: scale(0.85)` |

---

## 3. States

| State | Visual |
|---|---|
| Default | Full alert visible with colored background, border, and shadow |
| Hover on dismiss | Dismiss button opacity changes from 0.6 to 1 |
| Press on dismiss | Dismiss button scales to 0.85 |
| Dismissed | `display: none` (via inline onclick) |

---

## 4. Responsive Behavior

### At `max-width: 768px`:

- `.alert` gets `padding: var(--space-3) var(--space-4)` (slightly reduced)

---

## 5. Accessibility

- Implementing agents should add `role="alert"` for important alerts or `role="status"` for informational ones
- Dismiss button should have `aria-label="Dismiss"` or `aria-label="Close alert"`
- Icons should have `aria-hidden="true"` since the message text conveys the meaning
- Color should not be the only indicator of alert type -- the icon shape and message text must communicate the severity

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--border-default`
- `--accent-primary`, `--accent-primary-subtle`
- `--accent-danger`, `--accent-danger-subtle`
- `--accent-gold`, `--accent-gold-subtle`, `--accent-gold-text`
- `--accent-cyan`, `--accent-cyan-subtle`
- `--accent-green`, `--accent-green-subtle`
- `--accent-purple`, `--accent-purple-subtle`
- `--shadow-pink`, `--shadow-danger`, `--shadow-gold`, `--shadow-cyan`, `--shadow-green`, `--shadow-purple`

### Tier 3 (Component)

- `--space-3` (`12px`), `--space-4` (`16px`)
- `--radius-md` (`16px`)
- `--ui-text-md` (`14px`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`

---

## 7. Test Specification

### 7.1 Computed Style Assertions

- `.alert` has `border-radius: 16px`
- `.alert-pink` has `background` matching `--accent-primary-subtle`, `color` matching `--accent-primary`, `border-color` matching `--accent-primary`, `box-shadow` matching `--shadow-pink`
- `.alert-gold` has `color` matching `--accent-gold-text` (not `--accent-gold`)
- `.alert-dismiss` has `opacity: 0.6` at rest
- All 6 alert variants have distinct `box-shadow` values (colored shadows)

### 7.2 Interaction Assertions

- Clicking `.alert-dismiss` hides the alert (`display: none`)
- `.alert-dismiss:hover` has `opacity: 1`
- `.alert-dismiss:active` has `transform: scale(0.85)`

### 7.3 Visual Regression Scenarios

- All 6 alert variants stacked (light mode)
- All 6 alert variants stacked (dark mode)
- Alert with dismiss button hover state

### 7.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, all transitions complete in 0.01ms

## 8. Implementation CSS

```css
@layer component {
  .alert {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    padding: var(--space-4);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-md);
    font-size: 0.875rem;
    line-height: 1.5;
  }

  .alert svg {
    flex-shrink: 0;
    margin-top: 1px;
  }

  .alert-pink   { background: var(--accent-primary-subtle); color: var(--accent-primary); border-color: var(--accent-primary); box-shadow: var(--shadow-pink); }
  .alert-danger  { background: var(--accent-danger-subtle);  color: var(--accent-danger);  border-color: var(--accent-danger);  box-shadow: var(--shadow-danger); }
  .alert-gold    { background: var(--accent-gold-subtle);    color: var(--accent-gold-text); border-color: var(--accent-gold);  box-shadow: var(--shadow-gold); }
  .alert-cyan    { background: var(--accent-cyan-subtle);    color: var(--accent-cyan);    border-color: var(--accent-cyan);    box-shadow: var(--shadow-cyan); }
  .alert-green   { background: var(--accent-green-subtle);   color: var(--accent-green);   border-color: var(--accent-green);   box-shadow: var(--shadow-green); }
  .alert-purple  { background: var(--accent-purple-subtle);  color: var(--accent-purple);  border-color: var(--accent-purple);  box-shadow: var(--shadow-purple); }

  .alert-dismiss {
    margin-left: auto;
    background: none;
    border: none;
    cursor: pointer;
    color: inherit;
    opacity: 0.6;
    padding: 2px;
    transition: transform var(--motion-instant) linear, opacity var(--motion-fast) var(--ease-out);
  }
  .alert-dismiss:hover { opacity: 1; }
  .alert-dismiss:active { transform: scale(0.85); }

  @media (max-width: 768px) {
    .alert { padding: var(--space-3) var(--space-4); }
  }
}
```
