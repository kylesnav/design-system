---
title: "Sidebar Layout"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Sidebar Layout

> Full application layout composition using CSS Grid with a fixed 240px sidebar and fluid main content area. Wraps a `.comp-sidebar` (navigation panel) and `.comp-main` (scrollable content area) inside a `.comp-frame` container with neo-brutalist border styling. Collapses to single-column at 768px breakpoint by hiding the sidebar entirely.

Cross-references: [[sidebar]] (the sidebar navigation component used inside `.comp-sidebar`), [[card]] (cards used in main content area), [[token-tiers]] (spacing, background, and border tokens).

Visual reference: Section "Bonus -- Sample Compositions", subsection "Dashboard" in `design-reference.html` (lines ~6928-7001 HTML, CSS at lines ~3626-3656).

---

## 1. HTML Structure

### 1.1 Dashboard Composition (full reference example)

```html
<div class="comp-frame">
  <div class="comp-sidebar-layout">
    <div class="comp-sidebar">
      <div class="sidebar-section-label">Navigation</div>
      <a class="sidebar-item active">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        Dashboard
      </a>
      <a class="sidebar-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        Components
      </a>
      <a class="sidebar-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
        Tokens
      </a>
      <a class="sidebar-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06..." />
        </svg>
        Settings
      </a>
    </div>
    <div class="comp-main">
      <div style="font-size:var(--step-2);font-weight:700;letter-spacing:var(--tracking-tighter);margin-bottom:var(--space-6)">
        Dashboard
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4);margin-bottom:var(--space-6)">
        <div class="card card-compact card-featured">
          <div style="font-size:var(--step-2);font-weight:700;color:var(--accent-primary)">2,847</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">Active Users</div>
        </div>
        <div class="card card-compact card-featured card-featured-gold">
          <div style="font-size:var(--step-2);font-weight:700;color:var(--accent-gold)">94.2%</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">Uptime</div>
        </div>
        <div class="card card-compact card-featured card-featured-cyan">
          <div style="font-size:var(--step-2);font-weight:700;color:var(--accent-cyan)">1.2s</div>
          <div style="font-size:0.75rem;color:var(--text-muted)">Avg Load</div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">Recent Activity</div>
        <!-- activity list items -->
      </div>
    </div>
  </div>
</div>
```

### 1.2 Minimal Pattern

```html
<div class="comp-frame">
  <div class="comp-sidebar-layout">
    <div class="comp-sidebar">
      <!-- sidebar navigation content -->
    </div>
    <div class="comp-main">
      <!-- main content area -->
    </div>
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.comp-frame` (outer container)

| Property | Value | Token |
|---|---|---|
| `background` | `var(--bg-page)` | Page background |
| `border` | `2px solid var(--border-default)` | `--border-default` |
| `border-radius` | `var(--radius-lg)` | `24px` |
| `overflow` | `hidden` | -- |

### 2.2 `.comp-sidebar-layout` (grid container)

| Property | Value | Token |
|---|---|---|
| `display` | `grid` | -- |
| `grid-template-columns` | `240px 1fr` | Sidebar: fixed 240px, main: fluid |
| `min-height` | `420px` | -- |

#### Responsive: `@media (max-width: 768px)`

| Property | Value |
|---|---|
| `grid-template-columns` | `1fr` |

At 768px and below, the layout collapses to a single column.

### 2.3 `.comp-sidebar` (sidebar panel)

| Property | Value | Token |
|---|---|---|
| `background` | `var(--bg-surface)` | Card/panel surface |
| `border-right` | `2px solid var(--border-default)` | `--border-default` |
| `padding` | `var(--space-3)` | `12px` |

#### Responsive: `@media (max-width: 768px)`

| Property | Value |
|---|---|
| `display` | `none` |

The sidebar is completely hidden on small screens. There is no hamburger menu, overlay, or off-canvas pattern in the reference -- the sidebar simply disappears below 768px.

### 2.4 `.comp-main` (main content area)

| Property | Value | Token |
|---|---|---|
| `padding` | `var(--space-6)` | `24px` |
| `overflow-y` | `auto` | -- |

---

## 3. States

The sidebar layout is a static composition with no interactive states of its own. Interactive behavior comes from the child components:
- `.sidebar-item.active` -- active navigation item (see [[sidebar]])
- `.card-interactive` -- interactive cards in main area (see [[card]])

---

## 4. JavaScript Behavior

None. The sidebar layout is a pure CSS grid composition. No JavaScript is required for the layout itself. Interactive behaviors within the layout (sidebar navigation, card interactions) are handled by their respective component scripts.

---

## 5. Responsive Behavior

| Breakpoint | Sidebar | Main Content | Grid |
|---|---|---|---|
| `> 768px` | Visible, 240px fixed width | Fluid `1fr` | `240px 1fr` |
| `<= 768px` | Hidden (`display: none`) | Full width `1fr` | `1fr` |

At the 768px breakpoint:
- The sidebar disappears entirely
- The main content takes the full width
- No mobile navigation alternative is provided in the reference (hamburger, drawer, etc.)
- The `min-height: 420px` on `.comp-sidebar-layout` is maintained

---

## 6. Accessibility

- The sidebar uses `<a>` elements for navigation items, providing native keyboard focusability and screen reader accessibility.
- The sidebar disappearing at 768px means mobile users lose access to navigation. In production, this should be augmented with a mobile navigation pattern (hamburger + drawer, bottom nav, etc.) -- this is not present in the reference composition.
- The `.comp-main` area has `overflow-y: auto`, making it independently scrollable when content exceeds the container height.

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-page` -- comp-frame background
- `--bg-surface` -- sidebar background
- `--border-default` -- frame border, sidebar right border
- `--text-primary` -- (used by child content)
- `--text-muted` -- (used by child content)
- `--accent-primary`, `--accent-gold`, `--accent-cyan` -- (used by KPI cards in main area)

### Tier 3 (Component)

- `--radius-lg` (`24px`) -- frame border-radius
- `--space-3` (`12px`) -- sidebar padding
- `--space-6` (`24px`) -- main content padding
- `--space-4` (`16px`) -- KPI card grid gap
- `--step-2` -- KPI value font size, page title font size
- `--tracking-tighter` (`-0.03em`) -- page title letter-spacing

### Hardcoded Values

- `240px` -- sidebar width (not tokenized)
- `420px` -- minimum height (not tokenized)
- `768px` -- responsive breakpoint (not tokenized)

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.comp-frame` has `border: 2px solid` with color matching `--border-default`
- `.comp-frame` has `border-radius: 24px`
- `.comp-frame` has `overflow: hidden`
- `.comp-sidebar-layout` has `display: grid`
- `.comp-sidebar-layout` has `grid-template-columns` resolving to `240px` and auto (1fr)
- `.comp-sidebar-layout` has `min-height: 420px`
- `.comp-sidebar` has `background` matching `--bg-surface`
- `.comp-sidebar` has `border-right: 2px solid` with color matching `--border-default`
- `.comp-sidebar` has `padding: 12px`
- `.comp-main` has `padding: 24px`
- `.comp-main` has `overflow-y: auto`

### 8.2 Responsive Assertions

- At viewport width 1024px: `.comp-sidebar` is visible (`display` is not `none`)
- At viewport width 768px: `.comp-sidebar` has `display: none`
- At viewport width 768px: `.comp-sidebar-layout` has `grid-template-columns: 1fr`
- At viewport width 768px: `.comp-main` takes full width

### 8.3 Visual Regression Scenarios

- Full dashboard composition at 1200px (light mode)
- Full dashboard composition at 1200px (dark mode)
- Dashboard composition at 768px (sidebar hidden)
- Dashboard composition at 480px (mobile)

---

## 9. Implementation CSS

```css
@layer component {
  .comp-frame {
    background: var(--bg-page);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }

  .comp-sidebar-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: 420px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .comp-sidebar {
    background: var(--bg-surface);
    border-right: 2px solid var(--border-default);
    padding: var(--space-3);

    @media (max-width: 768px) {
      display: none;
    }
  }

  .comp-main {
    padding: var(--space-6);
    overflow-y: auto;
  }
}
```
