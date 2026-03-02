---
title: "Component QA Checklist"
type: qa
scope: mvp
status: active
---

# Component QA Checklist

> Per-component quality checklist. Run against every component CSS file before marking it complete.

---

## Per-Component Checks

For each of the 43 MVP component CSS files, verify:

### Structure

- [ ] File lives in `src/components/`
- [ ] File name matches component name (kebab-case)
- [ ] ALL rules are wrapped in `@layer component { }`
- [ ] No `@import` statements inside the file
- [ ] No cross-component CSS class references

### Token Usage

- [ ] All color values reference semantic tokens via `var()` -- never hardcoded hex, rgb, or oklch
- [ ] No `--primitive-*` token references (exception: toggle knob/off-state)
- [ ] All spacing uses `var(--space-*)` tokens
- [ ] All border-radius uses `var(--radius-*)` tokens
- [ ] All transitions use `var(--motion-*)` for duration and `var(--ease-*)` for easing
- [ ] All shadows use `var(--shadow-*)` tokens

### Neo-Brutalist Aesthetic

- [ ] All borders are `2px solid` (never 1px, never dashed/dotted)
- [ ] All shadows are solid: `Npx Npx 0` (zero blur radius -- never `Npx Npx Npx`)
- [ ] Shadow color uses `var(--border-default)` or accent color (never `var(--text-primary)`)
- [ ] Background colors use warm neutral tokens (never cold gray)

### Lift/Press Pattern (Interactive Components Only)

- [ ] Base state: no transform, appropriate shadow level
- [ ] Hover: `translateY(-2px)`, shadow escalates one level (sm->md or md->lg)
- [ ] Active: `translate(2px, 2px)`, shadow collapses to `0 0 0` or `none`
- [ ] Disabled: `opacity: 0.4`, `cursor: not-allowed`, `pointer-events: none`
- [ ] Focus-visible: `outline: 2px solid var(--focus-ring)`, `outline-offset: 2px`

### Accessibility

- [ ] Focus styles use `var(--focus-ring)` with 2px offset
- [ ] Disabled state uses `pointer-events: none` (not just cursor change)
- [ ] Color is not the sole indicator of state (icons, borders, or text also change)
- [ ] Hover states have sufficient contrast change

### Dark Mode

- [ ] Component renders correctly with `data-theme="dark"` (via semantic tokens)
- [ ] No hardcoded colors that break in dark mode
- [ ] Shadow direction/style consistent across themes

### Isolation

- [ ] Component renders correctly with only: tokens.css + reset.css + foundation.css + this component file
- [ ] No visual breakage when other components are absent

---

## Component Inventory (43 MVP)

### Batch A -- Simple
- [ ] badge.css
- [ ] avatar.css
- [ ] tooltip.css
- [ ] empty-state.css
- [ ] divider.css
- [ ] notification-badge.css
- [ ] code-block.css

### Batch B -- Interactive
- [ ] button.css
- [ ] card.css
- [ ] tile.css

### Batch C -- Forms
- [ ] input.css
- [ ] textarea.css
- [ ] select.css
- [ ] multi-select.css
- [ ] checkbox.css
- [ ] radio.css
- [ ] toggle.css
- [ ] range.css

### Batch D -- Navigation
- [ ] topnav.css
- [ ] tabs.css
- [ ] breadcrumbs.css
- [ ] pagination.css
- [ ] sidebar.css
- [ ] segmented-control.css
- [ ] command-palette.css
- [ ] skip-link.css

### Batch E -- Data
- [ ] table.css
- [ ] stepper.css
- [ ] scroll-progress.css
- [ ] back-to-top.css

### Batch F -- Feedback
- [ ] toast.css
- [ ] alert.css
- [ ] modal.css
- [ ] drawer.css
- [ ] progress.css

### Batch G -- Display
- [ ] popover.css
- [ ] skeleton.css
- [ ] accordion.css
- [ ] dropdown.css

### Batch I -- Composition
- [ ] sidebar-layout.css
- [ ] staggered-reveal.css
- [ ] bento-grid.css
- [ ] page-transitions.css

### Component Index
- [ ] `src/components/index.css` imports all 43 files
- [ ] Import order matches file system alphabetical order
