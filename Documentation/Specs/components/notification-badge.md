# Notification Badge

> Overlay count indicator for avatars and icon buttons. Uses danger red for urgency and tabular-nums for stable width as counts change. Consists of a positioning wrapper and a count element.

Cross-references: [[token-tiers]] (accent-danger for urgency color), [[avatar]] (primary host for notification badges), [[button]] (can host on icon buttons), [[radius]] (uses `--radius-full`).

Visual reference: Section "05 — Components", subsection "Notification Badge" in `design-reference.html` (lines ~5861-5881).

---

## 1. HTML Structure

### 1.1 Notification Badge on an Avatar

```html
<div class="notification-badge">
  <div class="avatar avatar-md avatar-pink">AM</div>
  <span class="notification-badge-count">3</span>
</div>
```

### 1.2 Notification Badge with Double-Digit Count

```html
<div class="notification-badge">
  <div class="avatar avatar-md avatar-cyan">JD</div>
  <span class="notification-badge-count">12</span>
</div>
```

### 1.3 Notification Badge on an Icon Button

```html
<div class="notification-badge">
  <button class="btn btn-sm btn-icon btn-secondary" style="width:var(--control-md);height:var(--control-md)" aria-label="Notifications">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  </button>
  <span class="notification-badge-count">5</span>
</div>
```

---

## 2. CSS Classes

### 2.1 `.notification-badge` (positioning wrapper)

| Property | Value | Token |
|---|---|---|
| `position` | `relative` | Establishes positioning context for the count |
| `display` | `inline-flex` | -- |

### 2.2 `.notification-badge-count` (the count indicator)

| Property | Value | Token |
|---|---|---|
| `position` | `absolute` | -- |
| `top` | `-4px` | Offset above the host element |
| `right` | `-4px` | Offset right of the host element |
| `min-width` | `18px` | Minimum circle size for single digits |
| `height` | `18px` | Fixed height |
| `padding` | `0 5px` | Horizontal padding for multi-digit numbers |
| `border-radius` | `var(--radius-full)` | `9999px` -- pill/circle shape |
| `background` | `var(--accent-danger)` | Red for urgency |
| `color` | `var(--text-on-accent)` | White text |
| `font-size` | `0.625rem` | 10px |
| `font-weight` | `700` | Bold |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `border` | `2px solid var(--bg-surface)` | Creates a "cutout" effect against the host |
| `line-height` | `1` | Tight line height for vertical centering |
| `font-variant-numeric` | `tabular-nums` | Fixed-width digits so badge width doesn't jump |

---

## 3. Variants

The notification badge has a single visual variant. Variation comes from:
- The host element (avatar, icon button, or any other element)
- The count number displayed
- Single-digit counts render as a circle (min-width ensures this)
- Multi-digit counts expand horizontally as a pill shape

---

## 4. States

The notification badge is a static display component. It has no interactive states. The host element (avatar, button) handles its own interaction states.

When the count changes dynamically, `font-variant-numeric: tabular-nums` ensures the badge width transitions smoothly without jerky digit-width changes.

---

## 5. Responsive Behavior

No responsive breakpoints. The notification badge is absolutely positioned relative to its wrapper and works at all viewport sizes.

---

## 6. Accessibility

- The count conveys important information. Use `aria-label` on the host element to include the count: `aria-label="Notifications, 5 unread"`.
- Alternatively, use `aria-describedby` to associate the count with the host.
- If the count updates dynamically, the container or count element should have `aria-live="polite"` so screen readers announce changes.
- The visual count is redundant with the ARIA label -- it serves sighted users while ARIA serves screen reader users.

### Recommended Enhanced Markup

```html
<div class="notification-badge">
  <button class="btn btn-sm btn-icon btn-secondary" aria-label="Notifications, 5 unread" aria-describedby="notif-count">
    <svg><!-- bell icon --></svg>
  </button>
  <span class="notification-badge-count" id="notif-count" aria-live="polite" aria-atomic="true">5</span>
</div>
```

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--accent-danger` (background color)
- `--text-on-accent` (text color)
- `--bg-surface` (border color for cutout effect)

### Tier 3 (Component)

- `--radius-full` (`9999px`)

### Hardcoded Values

- `font-size: 0.625rem` (10px) -- not tokenized
- `top: -4px`, `right: -4px` -- position offsets
- `min-width: 18px`, `height: 18px` -- badge dimensions
- `padding: 0 5px` -- horizontal padding
- `border: 2px solid` -- cutout border width

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.notification-badge` has `position: relative`
- `.notification-badge-count` has `position: absolute`
- `.notification-badge-count` has `top: -4px` and `right: -4px`
- `.notification-badge-count` has `min-width: 18px` and `height: 18px`
- `.notification-badge-count` has `border-radius: 9999px`
- `.notification-badge-count` background matches `--accent-danger` resolved value
- `.notification-badge-count` has `font-variant-numeric: tabular-nums`
- `.notification-badge-count` has `font-weight: 700`
- `.notification-badge-count` border color matches `--bg-surface` resolved value

### 8.2 Visual Regression Scenarios

- Notification badge on avatar with single-digit count (light mode)
- Notification badge on avatar with double-digit count (light mode)
- Notification badge on icon button (light mode)
- All scenarios in dark mode
- Count changing from 9 to 10 (pill expansion)

### 8.3 Reduced Motion Compliance

No animation on this component -- no motion assertions needed.

---

## 9. Implementation CSS

```css
@layer component {
  .notification-badge {
    position: relative;
    display: inline-flex;
  }

  .notification-badge-count {
    position: absolute;
    top: -4px;
    right: -4px;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: var(--radius-full);
    background: var(--accent-danger);
    color: var(--text-on-accent);
    font-size: 0.625rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--bg-surface);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
}
```
