---
title: "Dropdown"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Dropdown

> JS-powered contextual action menu using the native Popover API. Distinct from the simpler `.popover-panel` (which needs no JS) — the `.dropdown-menu` adds grouped labels, separator lines, danger item styling, `aria-expanded` state management, outside-click dismissal, and keyboard navigation (Escape to close). Trigger button uses `popovertarget` for zero-JS show/hide, with an optional JS layer for enhanced behavior.

Cross-references: [[popover]] (`.popover-panel` shares the Popover API but is simpler — no label/separator grouping), [[button]] (trigger uses `.btn`), [[shadows]] (`--shadow-md`), [[motion]] (no custom animation — Popover API browser default).

Visual reference: Section "05 — Components", subsection "Dropdown Menu" in `design-reference.html` (lines ~5883–5898 HTML, CSS at lines ~2472–2533, JS at lines ~7340–7369).

---

## 1. HTML Structure

### 1.1 Standard Dropdown with Labels, Separators, and Danger Item

```html
<div style="position:relative;display:inline-block">
  <button class="btn btn-secondary btn-sm" id="dropdown-trigger"
          popovertarget="dropdown-demo"
          aria-expanded="false"
          aria-haspopup="true">
    Actions
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>
  <div id="dropdown-demo" popover class="dropdown-menu"
       style="position:absolute;top:calc(100% + var(--space-2));left:0">
    <div class="dropdown-label">Actions</div>
    <button class="dropdown-item"
            onclick="document.getElementById('dropdown-demo').hidePopover()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
      Edit
    </button>
    <button class="dropdown-item"
            onclick="document.getElementById('dropdown-demo').hidePopover()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
      Duplicate
    </button>
    <button class="dropdown-item"
            onclick="document.getElementById('dropdown-demo').hidePopover()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <polyline points="16 6 12 2 8 6"/>
        <line x1="12" y1="2" x2="12" y2="15"/>
      </svg>
      Export
    </button>
    <hr class="dropdown-separator">
    <button class="dropdown-item" data-danger="true"
            onclick="document.getElementById('dropdown-demo').hidePopover()">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
      </svg>
      Delete
    </button>
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.dropdown-menu` (container)

| Property | Value | Token |
|---|---|---|
| `background` | `var(--bg-surface)` | Card-level surface |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-md)` | `16px` |
| `box-shadow` | `var(--shadow-md)` | `4px 4px 0 var(--border-default)` |
| `padding` | `var(--space-1)` | `4px` |
| `min-width` | `200px` | Wider than `.popover-panel` (180px) |
| `position` | `absolute` | Caller sets absolute position inline |
| `z-index` | `var(--z-overlay)` | `300` |

When used with the Popover API (`[popover]` attribute):

| Property | Value |
|---|---|
| `margin` | `0` |
| `inset` | `unset` |

### 2.2 `.dropdown-item` (menu item)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-2)` | `8px` |
| `padding` | `var(--space-2) var(--space-3)` | `8px 12px` |
| `border-radius` | `calc(var(--radius-md) - 4px)` | `12px` (inner radius compensation) |
| `font-size` | `var(--ui-text-sm)` | `13px` |
| `color` | `var(--text-primary)` | -- |
| `background` | `none` | -- |
| `border` | `none` | -- |
| `width` | `100%` | Full-width row |
| `text-align` | `left` | -- |
| `cursor` | `pointer` | -- |
| `transition` | `background var(--motion-fast) var(--ease-out)` | -- |

Hover state and `[data-active="true"]`:

| Property | Value |
|---|---|
| `background` | `var(--bg-subtle)` |

### 2.3 `.dropdown-item[data-danger="true"]` (destructive item)

| Property | Value | Token |
|---|---|---|
| `color` | `var(--accent-danger)` | Red text |
| `:hover background` | `var(--accent-danger-subtle)` | Tinted red hover (not plain `--bg-subtle`) |

### 2.4 `.dropdown-separator` (horizontal rule)

| Property | Value | Token |
|---|---|---|
| `border` | `none` | Reset `<hr>` default |
| `border-top` | `2px solid var(--border-subtle)` | -- |
| `margin` | `var(--space-1) 0` | `4px 0` |

### 2.5 `.dropdown-label` (group heading)

| Property | Value | Token |
|---|---|---|
| `padding` | `var(--space-2) var(--space-3) var(--space-1)` | `8px 12px 4px` |
| `font-size` | `var(--ui-text-2xs)` | `11px` |
| `font-weight` | `600` | -- |
| `letter-spacing` | `0.06em` | Hardcoded |
| `text-transform` | `uppercase` | -- |
| `color` | `var(--text-muted)` | -- |

---

## 3. Variants

### 3.1 Standard (with group label)

Uses `.dropdown-label` to visually group items. Default shown above.

### 3.2 Without label (simple list)

Omit `.dropdown-label`. Items occupy the full panel directly:

```html
<div popover class="dropdown-menu" style="position:absolute;top:calc(100% + var(--space-2));left:0">
  <button class="dropdown-item">Item One</button>
  <button class="dropdown-item">Item Two</button>
</div>
```

### 3.3 Danger item

Apply `data-danger="true"` to a `.dropdown-item` for red text + red-tinted hover:

```html
<button class="dropdown-item" data-danger="true">Delete</button>
```

---

## 4. States

| State | Element | CSS Change |
|---|---|---|
| **Closed** | `.dropdown-menu` | `display: none` (Popover API default) |
| **Open** | `.dropdown-menu:popover-open` | `display: block` (browser default for `popover`) |
| **Item hover** | `.dropdown-item:hover` | `background: var(--bg-subtle)` |
| **Item active** (JS keyboard highlight) | `.dropdown-item[data-active="true"]` | `background: var(--bg-subtle)` |
| **Danger hover** | `.dropdown-item[data-danger="true"]:hover` | `background: var(--accent-danger-subtle)` |

---

## 5. JavaScript Behavior

### 5.1 Basic open/close (zero-JS)

The trigger uses `popovertarget="<id>"` — clicking it toggles the popover natively. No JS required for basic show/hide.

### 5.2 Enhanced JS layer (aria-expanded + Escape + outside-click)

The reference implements this pattern for the brand nav dropdown (lines ~7340–7369). Same pattern applies to `.dropdown-menu`:

```js
const trigger = document.getElementById('dropdown-trigger');
const menu    = document.getElementById('dropdown-demo');

function openDropdown() {
  trigger.setAttribute('aria-expanded', 'true');
  menu.showPopover();
}

function closeDropdown() {
  trigger.setAttribute('aria-expanded', 'false');
  menu.hidePopover();
}

// Toggle on trigger click
trigger.addEventListener('click', () => {
  const isOpen = trigger.getAttribute('aria-expanded') === 'true';
  isOpen ? closeDropdown() : openDropdown();
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!trigger.contains(e.target) && !menu.contains(e.target)) {
    closeDropdown();
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') {
    closeDropdown();
    trigger.focus(); // return focus to trigger
  }
});
```

### 5.3 Item dismissal

Each `.dropdown-item` calls `hidePopover()` on click to dismiss the menu after selection:

```js
document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', () => {
    menu.hidePopover();
    closeDropdown();
  });
});
```

Or inline on each item (as in the reference): `onclick="document.getElementById('dropdown-demo').hidePopover()"`.

---

## 6. Distinction from `.popover-panel`

| Feature | `.popover-panel` | `.dropdown-menu` |
|---|---|---|
| Background | `--bg-elevated` | `--bg-surface` |
| Min-width | `180px` | `200px` |
| Padding | `var(--space-2)` (8px) | `var(--space-1)` (4px) |
| Item class | `.popover-item` | `.dropdown-item` |
| Item border-radius | `var(--radius-sm)` = 10px | `calc(var(--radius-md) - 4px)` = 12px |
| Group label | No | Yes — `.dropdown-label` |
| Separator | `.popover-divider` (1px height div) | `.dropdown-separator` (`<hr>`) |
| Danger hover | Inherits `--bg-subtle` | `var(--accent-danger-subtle)` |
| JS layer | Optional | Recommended for `aria-expanded` + keyboard |
| z-index | Not set (relies on popover stacking) | `var(--z-overlay)` = 300 |

---

## 7. Responsive Behavior

No breakpoint-specific rules. The dropdown uses `position: absolute` and is positioned by the caller. On narrow viewports, consider clamping `min-width: 200px` to `min(200px, 100vw - var(--space-8))`.

---

## 8. Accessibility

- Trigger: `aria-haspopup="true"` (or `"menu"` for strict ARIA menu pattern), `aria-expanded="false/true"`, `aria-controls="<menu-id>"`.
- Menu: `role="menu"` when using the ARIA menu pattern. Each item: `role="menuitem"`.
- Keyboard navigation: Escape closes and returns focus to trigger (JS required). Arrow Up/Down navigates items (JS required for full ARIA menu keyboard pattern).
- The `.dropdown-label` should be `role="presentation"` (not focusable, not interactive).
- The `.dropdown-separator` `<hr>` provides semantic section separation.
- Focus should move into the menu on open; the first item should receive focus.
- Danger items must contrast with their hover background (`var(--accent-danger)` on `var(--accent-danger-subtle)` — verify contrast ratio meets AA).

---

## 9. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface` (menu background)
- `--border-default` (menu border + shadow)
- `--shadow-md` (menu shadow)
- `--bg-subtle` (item hover background)
- `--border-subtle` (separator line)
- `--text-primary` (item text)
- `--text-muted` (label text)
- `--accent-danger` (danger item text)
- `--accent-danger-subtle` (danger item hover background)

### Tier 3 (Component)

- `--radius-md` (`16px`) — menu border-radius, base for item radius
- `--z-overlay` (`300`) — menu z-index
- `--space-1` (`4px`) — menu padding, separator margin
- `--space-2` (`8px`) — item gap, item vertical padding
- `--space-3` (`12px`) — item horizontal padding
- `--ui-text-sm` (`13px`) — item font-size
- `--ui-text-2xs` (`11px`) — label font-size
- `--motion-fast` (`160ms`) — item background transition
- `--ease-out` — item background easing

---

## 10. Test Specification

### 10.1 Computed Style Assertions

- `.dropdown-menu` has `background` matching `--bg-surface`
- `.dropdown-menu` has `border: 2px solid` matching `--border-default`
- `.dropdown-menu` has `border-radius` resolving to `16px`
- `.dropdown-menu` has `min-width: 200px`
- `.dropdown-menu` has `padding` resolving to `4px`
- `.dropdown-item` has `font-size` resolving to `13px`
- `.dropdown-item` has `border-radius` resolving to `12px`
- `.dropdown-label` has `font-size` resolving to `11px`
- `.dropdown-label` has `text-transform: uppercase`
- `.dropdown-separator` has `border-top-width: 2px`

### 10.2 Interaction Assertions

- Trigger click shows popover (`:popover-open` present on `.dropdown-menu`)
- Trigger `aria-expanded` toggles between `"true"` and `"false"` (with JS enhancement)
- Escape key closes menu and returns focus to trigger
- Outside click closes menu
- `.dropdown-item:hover` has `background` matching `--bg-subtle`
- `.dropdown-item[data-danger="true"]:hover` has `background` matching `--accent-danger-subtle`
- Clicking `.dropdown-item` dismisses the menu

### 10.3 Visual Regression Scenarios

- Closed (trigger only)
- Open: standard items with label
- Open: separator visible
- Danger item in default and hover state
- Dark mode: open state

---

## 11. Implementation CSS

```css
@layer component {
  .dropdown-menu {
    background: var(--bg-surface);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    padding: var(--space-1);
    min-width: 200px;
    position: absolute;
    z-index: var(--z-overlay);
  }

  .dropdown-menu[popover] {
    margin: 0;
    inset: unset;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    padding: var(--space-2) var(--space-3);
    border-radius: calc(var(--radius-md) - 4px);
    font-size: var(--ui-text-sm);
    color: var(--text-primary);
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: background var(--motion-fast) var(--ease-out);
  }

  .dropdown-item:hover,
  .dropdown-item[data-active="true"] {
    background: var(--bg-subtle);
  }

  .dropdown-item[data-danger="true"] {
    color: var(--accent-danger);
  }
  .dropdown-item[data-danger="true"]:hover {
    background: var(--accent-danger-subtle);
  }

  .dropdown-separator {
    border: none;
    border-top: 2px solid var(--border-subtle);
    margin: var(--space-1) 0;
  }

  .dropdown-label {
    padding: var(--space-2) var(--space-3) var(--space-1);
    font-size: var(--ui-text-2xs);
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
}
```
