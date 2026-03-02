---
title: "Accessibility Review Checklist"
type: qa
scope: mvp
status: active
---

# Accessibility Review Checklist

> WCAG 2.1 AA compliance checks for the Delightful Design System MVP.

---

## Color Contrast (WCAG 1.4.3 / 1.4.11)

### Text Contrast (>= 4.5:1 for normal text, >= 3:1 for large text)

- [ ] `--text-primary` on `--bg-page` >= 4.5:1 (light)
- [ ] `--text-primary` on `--bg-page` >= 4.5:1 (dark)
- [ ] `--text-primary` on `--bg-surface` >= 4.5:1 (both themes)
- [ ] `--text-secondary` on `--bg-page` >= 4.5:1 (both themes)
- [ ] `--text-on-accent` on `--accent-primary` >= 4.5:1 (both themes)
- [ ] `--text-on-accent` on `--accent-danger` >= 4.5:1 (both themes)
- [ ] `--text-on-accent` on `--accent-green` >= 4.5:1 (both themes)
- [ ] `--text-on-gold` on `--accent-gold` >= 4.5:1 (both themes)
- [ ] `--text-on-accent` on `--accent-cyan` >= 4.5:1 (both themes)
- [ ] `--text-on-accent` on `--accent-purple` >= 4.5:1 (both themes)

### Non-Text Contrast (>= 3:1)

- [ ] `--border-default` on `--bg-page` >= 3:1 (both themes)
- [ ] `--border-default` on `--bg-surface` >= 3:1 (both themes)
- [ ] Focus ring (`--focus-ring`) on `--bg-page` >= 3:1 (both themes)
- [ ] Interactive element boundaries are visible (2px borders)

---

## Keyboard Navigation (WCAG 2.1.1 / 2.1.2)

### Focus Visibility
- [ ] All interactive elements have `:focus-visible` styles
- [ ] Focus outline: `2px solid var(--focus-ring)` with `outline-offset: 2px`
- [ ] Focus is visible in both light and dark themes
- [ ] No element traps keyboard focus

### Component-Specific Keyboard Support
- [ ] **Button**: Activatable with Enter and Space
- [ ] **Toggle**: Toggleable with Space
- [ ] **Checkbox**: Checkable with Space
- [ ] **Radio**: Navigable with arrow keys within group
- [ ] **Select**: Opens with Enter/Space, navigable with arrows
- [ ] **Tabs**: Navigable with arrow keys, activatable with Enter
- [ ] **Modal**: Opens focused, Escape closes, focus trapped inside
- [ ] **Drawer**: Opens focused, Escape closes, focus trapped inside
- [ ] **Command Palette**: Cmd+K opens, Escape closes, arrow keys navigate, Enter selects
- [ ] **Accordion**: Toggleable with Enter/Space on header
- [ ] **Dropdown**: Opens with Enter/Space, navigable with arrows, Escape closes
- [ ] **Table (sortable)**: Column headers are focusable and activatable
- [ ] **Pagination**: All page buttons are focusable
- [ ] **Skip Link**: Visible on focus, navigates to main content

---

## Reduced Motion (WCAG 2.3.3)

### Global Gate
- [ ] `reset.css` contains `@media (prefers-reduced-motion: reduce)` gate
- [ ] Gate sets `animation-duration: 0.01ms !important` on all elements
- [ ] Gate sets `transition-duration: 0.01ms !important` on all elements
- [ ] Gate sets `scroll-behavior: auto !important`

### Motion CSS
- [ ] All keyframes in `motion.css` are inside `@media (prefers-reduced-motion: no-preference)`
- [ ] Scroll-driven animations additionally gated in `@supports (animation-timeline: scroll())`

### JS Behaviors
- [ ] `prefersReduced` boolean checked at IIFE top
- [ ] Splash particle engine returns early when reduced
- [ ] Page transitions return early when reduced
- [ ] Hero word reveal skips animation when reduced
- [ ] Nav reveal animation skips when reduced
- [ ] Toast progress bar animation skipped when reduced

---

## Semantic HTML and ARIA (WCAG 4.1.2)

### Roles and Labels
- [ ] **Alert**: `role="alert"` or `role="status"` present
- [ ] **Alert dismiss**: `aria-label="Dismiss"` or `aria-label="Close alert"`
- [ ] **Modal**: Uses native `<dialog>` element (built-in role)
- [ ] **Drawer**: Uses native `<dialog>` element
- [ ] **Toast**: `role="status"` with `aria-live="polite"`
- [ ] **Command Palette**: Input has `role="combobox"`, `aria-expanded`, `aria-activedescendant`; list items have `role="option"`, `aria-selected`
- [ ] **Toggle**: `role="switch"` with `aria-checked`
- [ ] **Accordion**: Headers use `aria-expanded`, panels use `aria-hidden`
- [ ] **Tabs**: Tab list has `role="tablist"`, tabs have `role="tab"`, panels have `role="tabpanel"` with `aria-labelledby`
- [ ] **Dropdown**: Trigger has `aria-expanded`, `aria-haspopup`
- [ ] **Skip Link**: First focusable element on page, links to `#main`
- [ ] **Breadcrumbs**: Container has `aria-label="Breadcrumb"` or `<nav aria-label="Breadcrumb">`
- [ ] **Stepper**: Steps have `aria-current="step"` for active step

### Decorative Elements
- [ ] All decorative icons have `aria-hidden="true"`
- [ ] Brand dots in topnav are `aria-hidden="true"`
- [ ] SVG icons in alerts/toasts have `aria-hidden="true"` (message text conveys meaning)

---

## Theme Switching (Custom)

- [ ] Theme toggle has `aria-label` describing current/next state
- [ ] Theme preference persists via localStorage
- [ ] OS preference respected as initialization fallback
- [ ] No flash of wrong theme on page load
- [ ] All components remain readable after theme switch

---

## Responsive / Touch (WCAG 2.5.5)

- [ ] All interactive targets are at least 44x44px (or have sufficient spacing)
- [ ] Topnav collapses to hamburger menu at 768px
- [ ] Tables use `.table-wrap` with `overflow-x: auto` for horizontal scroll
- [ ] Modals and drawers are at most 90vw / 85vw on mobile
