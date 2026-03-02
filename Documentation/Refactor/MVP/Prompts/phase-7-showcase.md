---
title: "Phase 7: Documentation Assembly"
type: prompt
scope: mvp
status: active
---

# Phase 7: Documentation Assembly

> Assemble interactive documentation pages from source CSS/JS files. Pages import tokens, components, and motion -- they never define them inline. Excludes `docs/motion.html` and `docs/animation.html` (Roadmap scope).

---

## Context

Read these specs before starting:
- `Specs/motion/inline-behaviors.md` -- all JS behaviors (theme toggle, toast, command palette, etc.)
- `Specs/components/*.md` -- component HTML structures and variants
- `Specs/testing/test-strategy.md` -- Playwright test setup
- `Architecture/mvp-architecture.md` -- Section 7 (Theme System), Section 9 (Build Pipeline)

---

## Deliverables

### 7.1 -- Main Showcase (`docs/index.html`)

The primary documentation page demonstrating all 43 MVP components.

**Imports** (in order):
```html
<link rel="stylesheet" href="../src/tokens.css">
<link rel="stylesheet" href="../src/reset.css">
<link rel="stylesheet" href="../src/foundation.css">
<link rel="stylesheet" href="../src/motion/motion.css">
<link rel="stylesheet" href="../src/components/index.css">
<link rel="stylesheet" href="../src/utilities.css">
```

**Section Structure** (matching existing design-reference):
1. Hero with word reveal animation
2. Philosophy
3. Color System (palette explorer, token architecture visualization)
4. Typography (type tester with presets)
5. Spacing and Layout
6. Components (all 43, organized by batch)
7. Iconography
8. Motion and Easing (easing demo, stagger reveal)
9. Micro-Interactions (splash particles, skeleton loading)
10. Loading and Transitions (page transition demo)
11. Overlays and Feedback (toast, modal, drawer, alert)
12. Compositions (bento grid, sidebar layout)

**Interactive JS Behaviors** (inline `<script>` at end of body):

Wrap everything in an IIFE with `'use strict'`:

```js
(function () {
  'use strict';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ... all behaviors
})();
```

Key behaviors to implement (see inline-behaviors.md for each):
1. Theme toggle (localStorage persistence, View Transitions API)
2. Toast system (`window.showToast(type, title, msg)`)
3. Command palette (Cmd+K / Ctrl+K, fuzzy search, keyboard nav)
4. Data table sorting (`window.sortTable(tableId, colIndex)`)
5. Row selection (`window.toggleRow`, `window.toggleAllRows`)
6. Stepper navigation (next/prev/reset)
7. Splash particle engine (mousedown on `.btn` and `.card`)
8. Skeleton loading toggle (shimmer/pulse modes, load/reset)
9. Page transition demo (crossfade, slide-left, slide-right)
10. Easing demonstrations (5 curves)
11. Scroll progress bar (CSS-only, `animation-timeline: scroll()`)
12. Back-to-top button (IntersectionObserver)
13. Nav reveal animation (first visit only)
14. Hero word reveal (stagger animation)
15. Scroll spy (active nav link tracking)
16. Staggered reveal (3 spring presets)
17. Modal and drawer (native `<dialog>`)
18. Brand dropdown
19. Click to copy
20. Contrast checker
21. Type tester
22. Token architecture visualization

**ARIA and Accessibility**:
- Command palette: combobox with listbox pattern
- Skip link as first focusable element
- All interactive elements have focus-visible outlines
- Theme toggle has `aria-label`
- Modal/drawer use native `<dialog>` for built-in accessibility

### 7.2 -- Color Explorer (`docs/color.html`)

Dedicated page for the color system:
- Imports tokens.css + relevant component CSS
- Primitive color grid with OKLCH values
- Semantic token mapping visualization
- Copy-to-clipboard on swatches
- Accent family switcher
- Neutral scale visualization

### 7.3 -- Preview Posters (`docs/preview-light.html`, `docs/preview-dark.html`)

Fixed 1280x720 layouts for screenshots:
- Grid of representative components
- Each poster imports tokens + components
- Light poster: `data-theme="light"`
- Dark poster: `data-theme="dark"`

### 7.4 -- Tests (`tests/docs.spec.ts`)

- Each page loads without console errors
- Theme toggle works (switches `data-theme` attribute)
- Command palette opens (Cmd+K) and closes (Escape)
- Toast appears and auto-dismisses
- Visual regression screenshots for main showcase (light + dark)

---

## Important Notes

- **No tokens defined inline**: All color values come from imported CSS. The only inline styles are for JS-driven animations (transitions, transforms).
- **No `docs/motion.html` or `docs/animation.html`**: These are Roadmap scope. The easing demo and stagger reveal live in the main showcase.
- **All 43 MVP components demonstrated**: Every component from Phase 5 must appear in the showcase with at least one live example.
- **JS behaviors respect `prefersReduced`**: Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` at the top of the IIFE.

---

## Acceptance Criteria

- [ ] `docs/index.html` renders all 43 components with live examples
- [ ] Theme toggle persists via localStorage
- [ ] Command palette works with keyboard navigation
- [ ] Toast system shows all 4 types
- [ ] No tokens or component styles defined inline in HTML
- [ ] All pages load without console errors
- [ ] Preview posters render at 1280x720
- [ ] `npm test` passes all docs tests
- [ ] Visual regression screenshots captured (light + dark)
