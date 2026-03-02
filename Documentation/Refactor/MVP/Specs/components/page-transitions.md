---
title: "Page Transitions"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Page Transitions

> Simulated page transition demo with three transition types: crossfade, slide-left, and slide-right. The reference implements these as CSS transitions applied via JavaScript within a contained frame, alternating between two page panels. The reference also uses the native View Transitions API (`document.startViewTransition`) for the theme toggle crossfade. All transitions are disabled when `prefers-reduced-motion: reduce`.

Cross-references: [[motion]] (easing curves `--ease-smooth`, `--ease-out`), [[token-tiers]] (border, radius, spacing tokens).

Visual reference: Section "09 -- Loading & Transitions", subsection "Simulated Page Transition" in `design-reference.html` (lines ~6523-6564 HTML, JS at lines ~8028-8062). View Transitions API usage for theme toggle at CSS lines ~3724-3730, JS lines ~7329-7338.

---

## 1. HTML Structure

### 1.1 Page Transition Demo Frame

```html
<div class="subsection">
  <div class="subsection-label">Simulated Page Transition</div>
  <div class="subsection-desc">
    A contained frame simulating crossfade and slide page transitions.
    In production, use the CSS View Transitions API.
  </div>

  <div class="btn-row" style="margin-bottom:var(--space-4)">
    <button class="btn btn-secondary btn-sm" onclick="pageTransition('crossfade')">Crossfade</button>
    <button class="btn btn-secondary btn-sm" onclick="pageTransition('slide-left')">Slide Left</button>
    <button class="btn btn-secondary btn-sm" onclick="pageTransition('slide-right')">Slide Right</button>
  </div>

  <div style="position:relative;height:200px;border:2px solid var(--border-default);border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-surface)"
    id="page-transition-frame">

    <!-- Page A (initially visible) -->
    <div id="pt-page-a"
      style="position:absolute;inset:0;padding:var(--space-6);display:flex;flex-direction:column;justify-content:center">
      <div style="font-size:var(--step-1);font-weight:650;letter-spacing:var(--tracking-tight);margin-bottom:var(--space-2)">
        Dashboard Overview
      </div>
      <div style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:var(--space-4)">
        View your project metrics, team activity, and recent deployments.
      </div>
      <div style="display:flex;gap:var(--space-3)">
        <div style="flex:1;height:40px;background:var(--accent-primary-subtle);border-radius:var(--radius-sm)"></div>
        <div style="flex:1;height:40px;background:var(--accent-gold-subtle);border-radius:var(--radius-sm)"></div>
        <div style="flex:1;height:40px;background:var(--accent-cyan-subtle);border-radius:var(--radius-sm)"></div>
      </div>
    </div>

    <!-- Page B (initially hidden) -->
    <div id="pt-page-b"
      style="position:absolute;inset:0;padding:var(--space-6);display:flex;flex-direction:column;justify-content:center;opacity:0;transform:translateX(100%)">
      <div style="font-size:var(--step-1);font-weight:650;letter-spacing:var(--tracking-tight);margin-bottom:var(--space-2)">
        Team Settings
      </div>
      <div style="font-size:0.875rem;color:var(--text-secondary);margin-bottom:var(--space-4)">
        Manage team members, roles, and workspace preferences.
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--space-2)">
        <div style="height:12px;background:var(--bg-muted);border-radius:var(--radius-sm);width:80%"></div>
        <div style="height:12px;background:var(--bg-muted);border-radius:var(--radius-sm);width:60%"></div>
        <div style="height:12px;background:var(--bg-muted);border-radius:var(--radius-sm);width:70%"></div>
      </div>
    </div>
  </div>
</div>
```

### 1.2 Frame Container Properties

| Property | Value | Token |
|---|---|---|
| `position` | `relative` | -- |
| `height` | `200px` | -- |
| `border` | `2px solid var(--border-default)` | `--border-default` |
| `border-radius` | `var(--radius-lg)` | `24px` |
| `overflow` | `hidden` | -- |
| `background` | `var(--bg-surface)` | Surface background |

### 1.3 Page Panel Properties

Both pages use:

| Property | Value |
|---|---|
| `position` | `absolute` |
| `inset` | `0` |
| `padding` | `var(--space-6)` = `24px` |
| `display` | `flex` |
| `flex-direction` | `column` |
| `justify-content` | `center` |

Page A initial state: `opacity: 1; transform: none` (visible)
Page B initial state: `opacity: 0; transform: translateX(100%)` (hidden off-screen right)

---

## 2. Transition Types

### 2.1 Crossfade

Leaving page fades out, entering page fades in with a 150ms overlap delay.

**Leaving page:**

| Property | Value |
|---|---|
| `transition` | `opacity 0.3s ease-out` |
| `transform` | `translateX(0)` (no movement) |
| `opacity` | `0` |

**Entering page:**

| Property | Value |
|---|---|
| `transition` | `opacity 0.3s ease-out 0.15s` |
| `transform` | `translateX(0)` (no movement) |
| `opacity` | `1` |

| Parameter | Value |
|---|---|
| Duration | `300ms` |
| Easing | `ease-out` |
| Overlap delay | `150ms` (entering starts 150ms after leaving begins) |
| Total duration | `~450ms` (300ms leaving + 150ms offset entering finishes at 450ms) |

### 2.2 Slide Left

Leaving page slides to the left, entering page slides in from the right.

**Leaving page:**

| Property | Value |
|---|---|
| `transition` | `transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out` |
| `transform` | `translateX(-100%)` |
| `opacity` | `0` |

**Entering page (set before animation frame):**

| Property | Value |
|---|---|
| `transform` | `translateX(100%)` (starting position: off-screen right) |
| `opacity` | `0` |

**Entering page (after `requestAnimationFrame`):**

| Property | Value |
|---|---|
| `transition` | `transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out` |
| `transform` | `translateX(0)` |
| `opacity` | `1` |

| Parameter | Value |
|---|---|
| Transform duration | `400ms` |
| Transform easing | `cubic-bezier(0.22,1,0.36,1)` = `--ease-smooth` |
| Opacity duration | `300ms` |
| Opacity easing | `ease-out` |

### 2.3 Slide Right

Mirror of slide-left. Leaving page slides to the right, entering page slides in from the left.

**Leaving page:**

| Property | Value |
|---|---|
| `transition` | `transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out` |
| `transform` | `translateX(100%)` |
| `opacity` | `0` |

**Entering page (set before animation frame):**

| Property | Value |
|---|---|
| `transform` | `translateX(-100%)` (starting position: off-screen left) |
| `opacity` | `0` |

**Entering page (after `requestAnimationFrame`):**

| Property | Value |
|---|---|
| `transition` | `transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out` |
| `transform` | `translateX(0)` |
| `opacity` | `1` |

---

## 3. View Transitions API (Theme Toggle)

The reference also uses the native View Transitions API for the theme toggle, not for the page transition demo. This is included here for completeness as it demonstrates the production-ready approach.

### 3.1 CSS

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 240ms;
}
```

### 3.2 JavaScript

```js
themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  const apply = () => {
    applyTheme(next, true);
  };
  if (document.startViewTransition) document.startViewTransition(apply);
  else apply();
});
```

### 3.3 Feature Detection

```js
if (document.startViewTransition) {
  document.startViewTransition(apply);
} else {
  apply();
}
```

If the View Transitions API is not supported, the theme change applies immediately without a crossfade.

---

## 4. JavaScript Behavior

### 4.1 Page Transition Demo

```js
let ptCurrentPage = 'a';

window.pageTransition = function(type) {
  if (prefersReduced) return;

  const pageA = document.getElementById('pt-page-a');
  const pageB = document.getElementById('pt-page-b');
  const entering = ptCurrentPage === 'a' ? pageB : pageA;
  const leaving = ptCurrentPage === 'a' ? pageA : pageB;

  if (type === 'crossfade') {
    leaving.style.transition = 'opacity 0.3s ease-out';
    leaving.style.transform = 'translateX(0)';
    leaving.style.opacity = '0';
    entering.style.transition = 'opacity 0.3s ease-out 0.15s';
    entering.style.transform = 'translateX(0)';
    entering.style.opacity = '1';
  } else if (type === 'slide-left') {
    leaving.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out';
    leaving.style.transform = 'translateX(-100%)';
    leaving.style.opacity = '0';
    entering.style.transform = 'translateX(100%)';
    entering.style.opacity = '0';
    requestAnimationFrame(() => {
      entering.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out';
      entering.style.transform = 'translateX(0)';
      entering.style.opacity = '1';
    });
  } else if (type === 'slide-right') {
    leaving.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out';
    leaving.style.transform = 'translateX(100%)';
    leaving.style.opacity = '0';
    entering.style.transform = 'translateX(-100%)';
    entering.style.opacity = '0';
    requestAnimationFrame(() => {
      entering.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out';
      entering.style.transform = 'translateX(0)';
      entering.style.opacity = '1';
    });
  }

  ptCurrentPage = ptCurrentPage === 'a' ? 'b' : 'a';
};
```

### 4.2 Function Signature

| Parameter | Type | Values |
|---|---|---|
| `type` | `string` | `'crossfade'`, `'slide-left'`, `'slide-right'` |

### 4.3 State Management

- `ptCurrentPage` tracks which page is currently visible (`'a'` or `'b'`)
- Each call toggles `ptCurrentPage` after applying the transition
- The function is attached to `window` for use with inline `onclick` handlers

### 4.4 Reduced Motion Guard

```js
if (prefersReduced) return;
```

The function exits immediately if reduced motion is preferred. No transition occurs and the pages stay in their current state.

### 4.5 Slide Transition Frame Boundary

For `slide-left` and `slide-right`, the entering page is first positioned off-screen (e.g., `translateX(100%)`) without a transition. A `requestAnimationFrame` call ensures this position is painted before the transition to `translateX(0)` begins. Without this frame boundary, the browser may batch both style changes and skip the animation.

---

## 5. Accessibility

### 5.1 `prefers-reduced-motion: reduce`

All page transitions are completely disabled. The `pageTransition` function returns immediately without modifying any styles. Pages remain static.

Additionally, the global CSS override ensures any accidental transitions complete in 0.01ms:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.2 View Transitions API

The theme toggle view transition uses a `240ms` animation duration. Under reduced motion, this is overridden by the global rule to `0.01ms`. The feature detection fallback (`else apply()`) ensures the theme still changes even without View Transitions API support.

### 5.3 Content Accessibility

- Both pages exist in the DOM at all times. Screen readers can access both.
- The hidden page (Page B initially) has `opacity: 0` and `transform: translateX(100%)` but is not removed from the DOM or set to `display: none`.
- For production use, consider adding `aria-hidden="true"` to the non-visible page and toggling it during transitions.

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--border-default` -- frame border
- `--bg-surface` -- frame background
- `--text-secondary` -- page description text
- `--accent-primary-subtle`, `--accent-gold-subtle`, `--accent-cyan-subtle` -- Page A color bars
- `--bg-muted` -- Page B placeholder bars

### Tier 3 (Component)

- `--radius-lg` (`24px`) -- frame border-radius
- `--radius-sm` (`10px`) -- color bar border-radius
- `--space-2` (`8px`) -- Page B bar gap
- `--space-3` (`12px`) -- Page A bar gap
- `--space-4` (`16px`) -- button row margin, description margin
- `--space-6` (`24px`) -- page panel padding
- `--step-1` -- page title font-size
- `--tracking-tight` (`-0.02em`) -- page title letter-spacing

### Easing (used in JS, matching tokens)

- `cubic-bezier(0.22,1,0.36,1)` -- matches `--ease-smooth` (slide transitions)
- `ease-out` -- standard CSS easing (crossfade and opacity in slides)

### Hardcoded Values

- `200px` -- frame height (not tokenized)
- `0.3s` (300ms) -- crossfade and opacity duration (not tokenized)
- `0.4s` (400ms) -- slide transform duration (not tokenized)
- `0.15s` (150ms) -- crossfade overlap delay (not tokenized)
- `240ms` -- view transition animation duration (not tokenized)

---

## 7. Test Specification

### 7.1 Computed Style Assertions

- Frame container has `border: 2px solid` with color matching `--border-default`
- Frame container has `border-radius: 24px`
- Frame container has `overflow: hidden`
- Frame container has `height: 200px`
- Page A initially has `opacity: 1` and no transform offset
- Page B initially has `opacity: 0` and `transform: translateX(100%)`

### 7.2 Interaction Assertions

**Crossfade:**
- After clicking "Crossfade", leaving page transitions to `opacity: 0`
- Entering page transitions to `opacity: 1` with a `0.15s` delay
- Neither page changes `transform` (stays at `translateX(0)`)

**Slide Left:**
- After clicking "Slide Left", leaving page moves to `translateX(-100%)` and `opacity: 0`
- Entering page moves from `translateX(100%)` to `translateX(0)` and `opacity: 1`

**Slide Right:**
- After clicking "Slide Right", leaving page moves to `translateX(100%)` and `opacity: 0`
- Entering page moves from `translateX(-100%)` to `translateX(0)` and `opacity: 1`

**State tracking:**
- `ptCurrentPage` toggles between `'a'` and `'b'` with each transition
- Consecutive transitions alternate which page enters/leaves

### 7.3 Visual Regression Scenarios

- Frame at rest showing Page A (light mode)
- Frame at rest showing Page A (dark mode)
- Mid-crossfade transition (both pages partially visible)
- Mid-slide-left transition (pages side by side)
- Frame showing Page B after transition

### 7.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, clicking any transition button has no effect
- Pages remain in their current state
- `ptCurrentPage` does not change

### 7.5 View Transitions API

- With View Transitions API support: theme toggle triggers crossfade with `240ms` duration
- Without View Transitions API: theme toggle applies immediately (no crossfade)

---

## 8. Implementation CSS

```css
@layer component {
  /* View Transitions — Theme toggle crossfade */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 240ms;
  }
}
```

The page transition demo uses no dedicated CSS classes -- all styling is inline via `style` attributes and JavaScript. The frame container, page panels, and content are all styled inline.

## 9. Implementation JavaScript

```js
let ptCurrentPage = 'a';

window.pageTransition = function(type) {
  if (prefersReduced) return;

  const pageA = document.getElementById('pt-page-a');
  const pageB = document.getElementById('pt-page-b');
  const entering = ptCurrentPage === 'a' ? pageB : pageA;
  const leaving = ptCurrentPage === 'a' ? pageA : pageB;

  if (type === 'crossfade') {
    leaving.style.transition = 'opacity 0.3s ease-out';
    leaving.style.transform = 'translateX(0)';
    leaving.style.opacity = '0';
    entering.style.transition = 'opacity 0.3s ease-out 0.15s';
    entering.style.transform = 'translateX(0)';
    entering.style.opacity = '1';
  } else if (type === 'slide-left') {
    leaving.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out';
    leaving.style.transform = 'translateX(-100%)';
    leaving.style.opacity = '0';
    entering.style.transform = 'translateX(100%)';
    entering.style.opacity = '0';
    requestAnimationFrame(() => {
      entering.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out';
      entering.style.transform = 'translateX(0)';
      entering.style.opacity = '1';
    });
  } else if (type === 'slide-right') {
    leaving.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out';
    leaving.style.transform = 'translateX(100%)';
    leaving.style.opacity = '0';
    entering.style.transform = 'translateX(-100%)';
    entering.style.opacity = '0';
    requestAnimationFrame(() => {
      entering.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease-out';
      entering.style.transform = 'translateX(0)';
      entering.style.opacity = '1';
    });
  }

  ptCurrentPage = ptCurrentPage === 'a' ? 'b' : 'a';
};
```
