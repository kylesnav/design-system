---
title: "Topnav"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Topnav

> Sticky top navigation bar with translucent backdrop blur, brand dots, section links with scroll-spy active state, theme toggle, command palette trigger, and responsive hamburger menu at narrow viewports.

Cross-references: [[button]] (topnav-btn uses similar lift/press micro-pattern), [[command-palette]] (Cmd+K trigger lives in topnav-right), [[skip-link]] (skip link precedes topnav in DOM), [[token-tiers]] (z-index, spacing, radius, motion tokens).

Visual reference: Section "STICKY NAV" in `design-reference.html` (lines ~1027-1209 CSS, lines ~4131-4205 HTML).

---

## 1. HTML Structure

### 1.1 Complete Topnav

```html
<nav class="topnav" role="navigation" aria-label="Main navigation">
  <div class="topnav-inner">
    <div class="topnav-brand-wrap">
      <button class="topnav-brand" id="brand-trigger" aria-expanded="false" aria-haspopup="true" aria-controls="brand-dropdown">
        <span class="brand-dots">
          <span class="brand-dot" style="background:var(--accent-primary)"></span>
          <span class="brand-dot" style="background:var(--accent-gold)"></span>
          <span class="brand-dot" style="background:var(--accent-cyan)"></span>
        </span>
        <span class="brand-label">Design</span>
        <svg class="brand-chevron" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 5 6 8 9 5"/></svg>
      </button>
      <div class="brand-dropdown" id="brand-dropdown" role="menu">
        <a href="#" class="brand-dropdown-item active" role="menuitem">
          <span class="brand-dropdown-dot" style="background:var(--accent-primary)"></span>Design
        </a>
        <a href="#" class="brand-dropdown-item" role="menuitem">
          <span class="brand-dropdown-dot" style="background:var(--accent-gold)"></span>Color
        </a>
        <a href="#" class="brand-dropdown-item" role="menuitem">
          <span class="brand-dropdown-dot" style="background:var(--accent-cyan)"></span>Motion
        </a>
        <a href="#" class="brand-dropdown-item" role="menuitem">
          <span class="brand-dropdown-dot" style="background:var(--accent-green)"></span>Animation
        </a>
        <div class="brand-dropdown-sep"></div>
        <a href="#" target="_blank" rel="noopener noreferrer" class="brand-dropdown-item brand-dropdown-github" role="menuitem">
          <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><!-- GitHub icon --></svg>
          GitHub
        </a>
      </div>
    </div>
    <ul class="topnav-links" id="nav-links">
      <li><a href="#philosophy">Philosophy</a></li>
      <li><a href="#color">Color</a></li>
      <li><a href="#typography">Typography</a></li>
      <li><a href="#spacing">Spacing</a></li>
      <li><a href="#components">Components</a></li>
      <!-- additional links -->
    </ul>
    <div class="topnav-right">
      <button class="topnav-toggle" id="nav-toggle" aria-label="Toggle navigation">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
      <kbd class="topnav-kbd" id="cmd-k-trigger" title="Quick navigation">&#8984;K</kbd>
      <button class="topnav-btn" id="theme-toggle" aria-label="Toggle theme">
        <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>
    </div>
  </div>
</nav>
```

---

## 2. CSS Classes

### 2.1 `.topnav` (root)

| Property | Value | Token |
|---|---|---|
| `position` | `sticky` | -- |
| `top` | `0` | -- |
| `z-index` | `var(--z-fixed)` | `200` |
| `background` | `oklch(0.995 0.004 70 / 0.88)` | Light mode: semi-transparent bg-surface |
| `backdrop-filter` | `blur(16px)` | -- |
| `-webkit-backdrop-filter` | `blur(16px)` | -- |
| `border-bottom` | `2px solid var(--border-subtle)` | `--border-subtle` |

Dark mode override (`[data-theme="dark"] &`):

| Property | Value |
|---|---|
| `background` | `oklch(0.165 0.015 65 / 0.88)` |

### 2.2 `.topnav-inner`

| Property | Value | Token |
|---|---|---|
| `max-width` | `1200px` | `--container-lg` |
| `margin` | `0 auto` | -- |
| `padding` | `var(--space-3) var(--space-8)` | `12px 32px` |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `space-between` | -- |
| `gap` | `var(--space-4)` | `16px` |

### 2.3 `.brand-dots`

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `gap` | `3px` | -- |

### 2.4 `.brand-dot`

| Property | Value | Token |
|---|---|---|
| `width` | `7px` | -- |
| `height` | `7px` | -- |
| `border-radius` | `var(--radius-full)` | `9999px` |

The three dots use inline `background` styles: `var(--accent-primary)`, `var(--accent-gold)`, `var(--accent-cyan)`.

### 2.5 `.topnav-links`

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-1)` | `4px` |
| `list-style` | `none` | -- |
| `overflow-x` | `auto` | -- |
| `scrollbar-width` | `none` | -- |

Scrollbar hidden via `&::-webkit-scrollbar { display: none; }`.

### 2.6 `.topnav-links a`

| Property | Value | Token |
|---|---|---|
| `font-size` | `0.8125rem` | `--ui-text-sm` = `13px` |
| `font-weight` | `500` | -- |
| `color` | `var(--text-secondary)` | -- |
| `text-decoration` | `none` | -- |
| `padding` | `var(--space-1) var(--space-3)` | `4px 12px` |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `white-space` | `nowrap` | -- |
| `transition` | `transform var(--motion-instant) linear, color var(--motion-fast) var(--ease-out), background var(--motion-fast) var(--ease-out)` | -- |

### 2.7 `.topnav-right`

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `gap` | `var(--space-3)` | `12px` |
| `flex-shrink` | `0` | -- |

### 2.8 `.topnav-btn` (theme toggle button)

| Property | Value | Token |
|---|---|---|
| `width` | `34px` | -- |
| `height` | `34px` | -- |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `background` | `var(--bg-surface)` | -- |
| `color` | `var(--text-primary)` | -- |
| `cursor` | `pointer` | -- |
| `transition` | `transform var(--motion-instant) linear, box-shadow var(--motion-instant) linear, background var(--motion-fast) var(--ease-out), border-color var(--motion-fast) var(--ease-out)` | -- |

SVG inside: `width: 16px; height: 16px`.

### 2.9 `.topnav-toggle` (hamburger menu)

| Property | Value | Token |
|---|---|---|
| `display` | `none` (hidden on desktop) | -- |
| `width` | `34px` | -- |
| `height` | `34px` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-sm)` | `10px` |
| `background` | `var(--bg-surface)` | -- |
| `color` | `var(--text-primary)` | -- |
| `cursor` | `pointer` | -- |
| `padding` | `0` | -- |
| `transition` | `transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out)` | -- |

SVG inside: `width: 16px; height: 16px`.

### 2.10 `.topnav-kbd` (Cmd+K trigger)

| Property | Value | Token |
|---|---|---|
| `font-size` | `var(--ui-text-xs)` | `12px` |
| `font-family` | `var(--font-sans)` | -- |
| `padding` | `2px var(--space-1)` | `2px 4px` |
| `border-radius` | `4px` | -- |
| `border` | `2px solid var(--border-subtle)` | -- |
| `background` | `var(--bg-subtle)` | -- |
| `color` | `var(--text-muted)` | -- |
| `cursor` | `pointer` | -- |
| `white-space` | `nowrap` | -- |
| `transition` | `transform var(--motion-instant) linear, border-color var(--motion-fast) var(--ease-out)` | -- |

### 2.11 Brand Dropdown (`.topnav-brand`, `.brand-dropdown`, etc.)

| Class | Key Properties |
|---|---|
| `.topnav-brand-wrap` | `position: relative` |
| `.topnav-brand` | `font-weight: 720; font-size: var(--step-0); color: var(--text-primary); letter-spacing: var(--tracking-tight); display: flex; align-items: center; gap: var(--space-2); background: none; border: none; cursor: pointer; padding: 0; font-family: inherit` |
| `.brand-chevron` | `width: 12px; height: 12px; transition: transform var(--motion-fast) var(--ease-out)` |
| `.topnav-brand[aria-expanded="true"] .brand-chevron` | `transform: rotate(180deg)` |
| `.brand-dropdown` | `display: none; position: absolute; top: calc(100% + var(--space-3)); left: 0; min-width: 200px; background: var(--bg-surface); border: 2px solid var(--text-primary); border-radius: var(--radius-sm); box-shadow: var(--shadow-md); padding: var(--space-2); z-index: var(--z-overlay); flex-direction: column; gap: 2px` |
| `.brand-dropdown.open` | `display: flex; animation: scale-in var(--motion-fast) var(--ease-bounce)` |
| `.brand-dropdown-item` | `display: flex; align-items: center; gap: var(--space-2); padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm); font-size: var(--ui-text-sm); font-weight: 600; color: var(--text-secondary); text-decoration: none` |
| `.brand-dropdown-item:hover` | `background: var(--bg-subtle); color: var(--text-primary)` |
| `.brand-dropdown-item.active` | `color: var(--accent-primary); font-weight: 700` |
| `.brand-dropdown-dot` | `width: 8px; height: 8px; border-radius: var(--radius-full); flex-shrink: 0` |
| `.brand-dropdown-sep` | `height: 2px; background: var(--border-subtle); margin: var(--space-1) 0` |

---

## 3. States

### 3.1 Nav Links

| State | CSS Changes |
|---|---|
| Default | `color: var(--text-secondary)` |
| Hover / Active (`.active`) | `color: var(--text-primary); background: var(--bg-subtle)` |
| Active (pressed) | `transform: translateY(1px)` |

### 3.2 `.topnav-btn` (theme toggle)

| State | CSS Changes |
|---|---|
| Default | As specified above |
| Hover | `background: var(--bg-subtle); border-color: var(--border-strong); transform: translateY(-1px)` |
| Active | `background: var(--bg-muted); transform: translateY(1px)` |

### 3.3 `.topnav-toggle` (hamburger)

| State | CSS Changes |
|---|---|
| Hover | `transform: translateY(-1px); background: var(--bg-subtle)` |
| Active | `transform: translateY(1px)` |

### 3.4 `.topnav-kbd`

| State | CSS Changes |
|---|---|
| Hover | `border-color: var(--border-default)` |
| Active | `transform: translateY(1px)` |

---

## 4. Responsive Behavior

### At `max-width: 900px`:

- `.topnav-toggle` becomes `display: flex` (visible)
- `.topnav-links` becomes hidden (`display: none`), positioned absolutely below the nav:
  - `position: absolute; top: 100%; left: 0; right: 0`
  - `flex-direction: column`
  - `background: var(--bg-surface); border-bottom: 2px solid var(--border-subtle)`
  - `padding: var(--space-3) var(--space-6); gap: 0`
  - `z-index: var(--z-sticky)`
- `.topnav-links.open` becomes `display: flex` (shown by JS toggle)
- `.topnav-links a` gets `width: 100%; padding: var(--space-2) var(--space-3)`
- `.topnav-inner` gets `position: relative; padding: var(--space-3) var(--space-4)`

### Touch targets (`@media (pointer: coarse)`):

- `.topnav-links a` gets `min-height: 44px; min-width: 44px`

---

## 5. Accessibility

- `<nav>` element with `role="navigation"` and `aria-label="Main navigation"`
- Theme toggle uses `aria-label="Toggle theme"`
- Hamburger toggle uses `aria-label="Toggle navigation"`
- Brand dropdown: `aria-expanded`, `aria-haspopup="true"`, `aria-controls` on trigger; `role="menu"` on dropdown; `role="menuitem"` on items
- Escape key closes brand dropdown and returns focus to trigger
- Scroll-spy updates `.active` class on nav links to indicate current section
- Icon-only buttons (theme toggle, hamburger) have descriptive `aria-label` attributes

---

## 6. JavaScript Behavior

### 6.1 Mobile Nav Toggle

```js
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
```

### 6.2 Scroll Spy

Uses `IntersectionObserver` with `rootMargin: '-20% 0px -70% 0px'`:

```js
const sections = document.querySelectorAll('.ds-section[id], .hero[id]');
const navAs = document.querySelectorAll('.topnav-links a');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAs.forEach(a => a.classList.remove('active'));
      const link = document.querySelector(`.topnav-links a[href="#${e.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-20% 0px -70% 0px' });
sections.forEach(s => observer.observe(s));
```

### 6.3 Theme Toggle

Uses `document.startViewTransition` (with fallback) to toggle between `light` and `dark` on `data-theme` attribute. Persists to `localStorage` under `delightful-theme`. Listens for OS `prefers-color-scheme` changes when no explicit preference is stored.

### 6.4 Brand Dropdown

- `click` on brand trigger toggles `aria-expanded` and `.open` class on dropdown
- `click` outside closes dropdown
- `Escape` key closes dropdown and returns focus to trigger

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`, `--bg-subtle`, `--bg-muted`
- `--text-primary`, `--text-secondary`, `--text-muted`
- `--border-default`, `--border-strong`, `--border-subtle`
- `--accent-primary`, `--accent-gold`, `--accent-cyan`, `--accent-green`
- `--overlay-bg`
- `--focus-ring`
- `--shadow-md`

### Tier 3 (Component)

- `--z-fixed` (`200`), `--z-sticky` (`100`), `--z-overlay` (`300`)
- `--space-1` (`4px`), `--space-2` (`8px`), `--space-3` (`12px`), `--space-4` (`16px`), `--space-6` (`24px`), `--space-8` (`32px`)
- `--radius-sm` (`10px`), `--radius-full` (`9999px`)
- `--step-0` (fluid type for brand name)
- `--ui-text-xs` (`12px`), `--ui-text-sm` (`13px`)
- `--font-sans`
- `--tracking-tight` (`-0.02em`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`, `--ease-bounce`, `--ease-smooth`
- `--container-lg` (`1200px`)

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.topnav` has `position: sticky` and `z-index: 200`
- `.topnav` has `backdrop-filter` containing `blur(16px)`
- `.topnav-inner` has `max-width: 1200px`
- `.brand-dot` has `width: 7px` and `height: 7px` and `border-radius: 9999px`
- `.topnav-btn` has `width: 34px` and `height: 34px`
- `.topnav-toggle` has `display: none` at widths > 900px

### 8.2 Interaction Assertions

- Click `.topnav-toggle` adds `.open` to `.topnav-links`
- Click `.topnav-toggle` again removes `.open`
- Scroll past hero section adds `.active` to corresponding nav link
- Click `#theme-toggle` changes `data-theme` attribute on `<html>`
- Click brand trigger toggles `aria-expanded` between `true` and `false`
- Escape key when brand dropdown is open closes it

### 8.3 Visual Regression Scenarios

- Desktop full nav (light mode)
- Desktop full nav (dark mode)
- Mobile collapsed state at 800px
- Mobile expanded (`.open`) state at 800px
- Brand dropdown open state
- Scroll-spy active link highlighting

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, all transitions complete in 0.01ms

## Implementation CSS

```css
@layer component {
  .topnav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: var(--z-nav);
    background: var(--bg-surface);
    border-bottom: 2px solid var(--border-default);
    height: 60px;
  }
  .topnav-inner {
    max-width: var(--container-xl);
    margin: 0 auto;
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 var(--space-5);
    gap: var(--space-4);
  }
  .brand-dots { display: flex; gap: 3px; }
  .brand-dot {
    width: 10px;
    height: 10px;
    border-radius: var(--radius-full);
    border: 2px solid var(--border-default);
  }
  .topnav-links {
    display: flex;
    align-items: center;
    gap: var(--space-1);
    margin-left: auto;
  }
  .topnav-links a {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    transition: color var(--motion-fast) var(--ease-out),
                background var(--motion-fast) var(--ease-out);
  }
  .topnav-links a:hover { color: var(--text-primary); background: var(--bg-subtle); }
  .topnav-links a.active { color: var(--accent-primary); }

  .topnav-right { display: flex; align-items: center; gap: var(--space-2); }
  .topnav-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    border: 2px solid var(--border-default);
    background: var(--bg-surface);
    cursor: pointer;
    display: grid;
    place-items: center;
    box-shadow: var(--shadow-sm);
    transition: transform var(--motion-fast) var(--ease-smooth),
                box-shadow var(--motion-fast) var(--ease-smooth);
  }
  .topnav-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
  .topnav-btn:active { transform: translate(2px, 2px); box-shadow: none; }

  .topnav-toggle {
    display: none;
    width: 36px;
    height: 36px;
    border: 2px solid var(--border-default);
    border-radius: var(--radius-md);
    background: var(--bg-surface);
    cursor: pointer;
  }
  .topnav-kbd {
    padding: var(--space-1) var(--space-3);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-md);
    background: var(--bg-surface);
    font-size: 0.75rem;
    color: var(--text-muted);
    cursor: pointer;
    box-shadow: var(--shadow-sm);
  }

  @media (max-width: 768px) {
    .topnav-links { display: none; }
    .topnav-toggle { display: grid; place-items: center; }
  }
}
```
