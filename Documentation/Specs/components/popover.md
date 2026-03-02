# Popover

> Lightweight contextual menu panel built on the native Popover API. Used for action menus, contextual content, and dropdown-style panels attached to a trigger element. Show/hide requires no JavaScript — the HTML `popovertarget` attribute handles toggling natively. Supports icon+label items, a danger-colored destructive variant, and dividers. A rich-content variant supports arbitrary markup inside the panel.

Cross-references: [[dropdown]] (Popover API also powers `.dropdown-menu` — these are two distinct implementations sharing the same browser primitive), [[button]] (trigger uses `.btn`), [[shadows]] (`--shadow-md` for elevation), [[motion]] (no custom open/close animation — native Popover API browser default behavior).

Visual reference: Section "05 — Components", subsection "Popover / Dropdown" in `design-reference.html` (lines ~5954–5976, CSS at lines ~3164–3223).

---

## 1. HTML Structure

### 1.1 Action Menu Popover (with icon items and divider)

```html
<div style="position:relative">
  <button class="btn btn-primary btn-md" popovertarget="popover-menu">
    Actions Menu
  </button>
  <div id="popover-menu" popover class="popover-panel"
       style="position:absolute;top:calc(100% + var(--space-2));left:0">
    <button class="popover-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      Edit
    </button>
    <button class="popover-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      Duplicate
    </button>
    <div class="popover-divider"></div>
    <button class="popover-item" style="color:var(--accent-danger)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
      Delete
    </button>
  </div>
</div>
```

### 1.2 Rich Content Popover (text/description panel)

```html
<div style="position:relative">
  <button class="btn btn-secondary btn-md" popovertarget="popover-info">
    More Info
  </button>
  <div id="popover-info" popover class="popover-panel"
       style="position:absolute;top:calc(100% + var(--space-2));left:0;padding:var(--space-4);min-width:240px">
    <div style="font-weight:700;font-size:var(--ui-text-sm);margin-bottom:var(--space-2)">
      Design Tokens
    </div>
    <div style="font-size:var(--ui-text-xs);color:var(--text-secondary);line-height:var(--leading-normal)">
      Tokens are the atomic building blocks of the design system. They encode color,
      spacing, typography, and motion decisions as reusable variables.
    </div>
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.popover-panel` (container)

| Property | Value | Token |
|---|---|---|
| `border` | `2px solid var(--border-default)` | `--border-default` |
| `border-radius` | `var(--radius-md)` | `16px` |
| `background` | `var(--bg-elevated)` | Elevated surface (white in light, darkest in dark) |
| `box-shadow` | `var(--shadow-md)` | `4px 4px 0 var(--border-default)` |
| `padding` | `var(--space-2)` | `8px` |
| `min-width` | `180px` | Hard minimum |
| `margin` | `0` | Reset native popover margin |
| `inset` | `unset` | Disables default popover positioning |

When open (`:popover-open` state):

| Property | Value |
|---|---|
| `display` | `flex` |
| `flex-direction` | `column` |

Backdrop:

| Property | Value |
|---|---|
| `background` | `transparent` (no overlay — popover is non-modal) |

### 2.2 `.popover-item` (menu item button)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-2)` | `8px` |
| `padding` | `var(--space-2) var(--space-3)` | `8px 12px` |
| `font-size` | `var(--ui-text-sm)` | `13px` |
| `font-family` | `var(--font-sans)` | -- |
| `font-weight` | `500` | -- |
| `border` | `none` | -- |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `background` | `transparent` | -- |
| `color` | `var(--text-primary)` | -- |
| `cursor` | `pointer` | -- |
| `text-align` | `left` | -- |
| `width` | `100%` | Full-width row |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out)` | -- |

Hover state:

| Property | Value |
|---|---|
| `background` | `var(--bg-subtle)` |

Active state:

| Property | Value |
|---|---|
| `transform` | `translateY(1px)` |

SVG inside `.popover-item`:

| Property | Value |
|---|---|
| `width` | `16px` |
| `height` | `16px` |
| `flex-shrink` | `0` |

### 2.3 `.popover-divider` (horizontal separator)

| Property | Value | Token |
|---|---|---|
| `height` | `1px` | -- |
| `background` | `var(--border-subtle)` | -- |
| `margin` | `var(--space-1) 0` | `4px 0` |

---

## 3. Variants

### 3.1 Danger Item

A destructive action item uses an inline color override. No additional class — apply `style="color:var(--accent-danger)"` on the `.popover-item`:

```html
<button class="popover-item" style="color:var(--accent-danger)">
  <svg><!-- delete icon --></svg>
  Delete
</button>
```

Note: The danger item does NOT have a background color on hover in the reference — it inherits the standard `var(--bg-subtle)` hover. If a danger-tinted background is needed, add `data-danger="true"` and use the `.dropdown-item[data-danger="true"]:hover` pattern from `.dropdown-menu` instead.

### 3.2 Rich Content (non-item) Panel

Override the default `8px` panel padding with inline style and place arbitrary content inside. The `.popover-panel` border, background, and shadow still apply:

```html
<div popover class="popover-panel" style="padding:var(--space-4);min-width:240px">
  <!-- arbitrary content -->
</div>
```

---

## 4. States

| State | Trigger | CSS Change |
|---|---|---|
| **Closed** | Default | `display: none` (browser native Popover API default) |
| **Open** | `popovertarget` click or `showPopover()` | `display: flex; flex-direction: column` via `:popover-open` |
| **Item hover** | Mouseover `.popover-item` | `background: var(--bg-subtle)` |
| **Item active** | Click/press `.popover-item` | `transform: translateY(1px)` |

---

## 5. Positioning

The `.popover-panel` uses `inset: unset` and `margin: 0` to opt out of the browser's default centered positioning. The caller positions it via inline `style` on the panel element:

```
style="position:absolute;top:calc(100% + var(--space-2));left:0"
```

The trigger wrapper must be `position:relative` for this to work:

```html
<div style="position:relative">
  <button popovertarget="my-popover">Trigger</button>
  <div id="my-popover" popover class="popover-panel"
       style="position:absolute;top:calc(100% + var(--space-2));left:0">
    <!-- items -->
  </div>
</div>
```

Gap between trigger bottom and panel top: `var(--space-2)` = `8px`.

---

## 6. Responsive Behavior

No breakpoint-specific changes in the reference. The panel uses `min-width: 180px` as a floor. For very narrow viewports, consider constraining `max-width` to viewport width via `min(180px, calc(100vw - var(--space-8)))`.

---

## 7. Accessibility

- The native `popover` attribute provides the disclosure widget semantics automatically for supporting browsers.
- The trigger button should have `aria-haspopup="menu"` and `aria-controls="<panel-id>"`.
- `.popover-item` elements are `<button>` elements — they are keyboard focusable and activate on Enter/Space natively.
- When the popover is open, focus should move into it (the Popover API handles this in browsers that support focus management).
- Escape key dismisses the popover natively (Popover API behavior).
- For keyboard navigation between items within the panel, add `role="menu"` to `.popover-panel` and `role="menuitem"` to each `.popover-item`, then implement arrow key navigation via JavaScript.
- The danger item must maintain sufficient contrast — `var(--accent-danger)` on `var(--bg-elevated)` background is the reference pattern.

---

## 8. Token Dependencies

### Tier 2 (Semantic)

- `--border-default` (panel border)
- `--bg-elevated` (panel background)
- `--shadow-md` (panel shadow)
- `--bg-subtle` (item hover background)
- `--border-subtle` (divider color)
- `--text-primary` (item text color)
- `--accent-danger` (destructive item inline color)

### Tier 3 (Component)

- `--radius-md` (`16px`) — panel border-radius
- `--radius-sm` (`10px`) — item border-radius
- `--space-1` (`4px`) — divider margin
- `--space-2` (`8px`) — panel padding, item gap
- `--space-3` (`12px`) — item horizontal padding
- `--space-4` (`16px`) — rich-content panel padding
- `--font-sans` — item font
- `--ui-text-sm` (`13px`) — item font-size
- `--motion-instant` (`100ms`) — item transform transition
- `--motion-fast` (`160ms`) — item background transition
- `--ease-out` — item background easing

---

## 9. JavaScript Behavior

The primary popover implementation in the reference uses **zero JavaScript** for show/hide. The HTML `popovertarget="<id>"` attribute on the trigger button and `popover` attribute on the panel handle toggle natively.

### 9.1 No-JS toggle

```html
<!-- trigger -->
<button popovertarget="my-popover">Open</button>

<!-- panel (no JS needed for basic open/close) -->
<div id="my-popover" popover class="popover-panel">…</div>
```

### 9.2 Programmatic control (when JS is needed)

```js
const panel = document.getElementById('my-popover');
panel.showPopover();   // open
panel.hidePopover();   // close
panel.togglePopover(); // toggle
```

### 9.3 Escape and outside-click dismissal

Both are handled natively by the Popover API — no JS required.

---

## 10. Test Specification

### 10.1 Computed Style Assertions

- `.popover-panel` has `background` matching `--bg-elevated` resolved value
- `.popover-panel` has `border: 2px solid` with color matching `--border-default`
- `.popover-panel` has `border-radius` resolving to `16px`
- `.popover-panel` has `box-shadow` matching `--shadow-md` resolved value
- `.popover-panel` has `padding` resolving to `8px`
- `.popover-item` has `border-radius` resolving to `10px`
- `.popover-item` has `font-size` resolving to `13px`
- `.popover-item` has `font-weight: 500`
- `.popover-divider` has `height: 1px` and `background` matching `--border-subtle`

### 10.2 Interaction Assertions

- Clicking a `popovertarget` button opens the associated `.popover-panel` (`:popover-open` applies)
- Clicking outside the panel or pressing Escape closes it
- `.popover-item:hover` has `background` matching `--bg-subtle`
- `.popover-item:active` has `transform: translateY(1px)`

### 10.3 Visual Regression Scenarios

- Action menu popover: closed state (trigger only)
- Action menu popover: open state (3 items + divider)
- Danger item color (red text)
- Rich content panel (non-item markup inside)
- Dark mode: panel background uses `--bg-elevated` dark value

### 10.4 Accessibility Assertions

- Trigger button has `popovertarget` attribute
- Panel has `popover` attribute
- Each `.popover-item` is a `<button>` element
- Focus moves to panel on open
- Escape closes panel

---

## 11. Implementation CSS

```css
@layer component {
  .popover-panel {
    border: 2px solid var(--border-default);
    border-radius: var(--radius-md);
    background: var(--bg-elevated);
    box-shadow: var(--shadow-md);
    padding: var(--space-2);
    min-width: 180px;
    margin: 0;
    inset: unset;
  }

  .popover-panel:popover-open {
    display: flex;
    flex-direction: column;
  }

  .popover-panel::backdrop {
    background: transparent;
  }

  .popover-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    font-size: var(--ui-text-sm);
    font-family: var(--font-sans);
    font-weight: 500;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-primary);
    cursor: pointer;
    text-align: left;
    width: 100%;
    transition: transform var(--motion-instant) linear,
                background var(--motion-fast) var(--ease-out);
  }

  .popover-item:hover {
    background: var(--bg-subtle);
  }

  .popover-item:active {
    transform: translateY(1px);
  }

  .popover-item svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  .popover-divider {
    height: 1px;
    background: var(--border-subtle);
    margin: var(--space-1) 0;
  }
}
```
