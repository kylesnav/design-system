---
title: "Stepper"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Stepper

> Multi-step progress indicator with numbered/icon step indicators, connecting lines between steps, and three step states: completed (accent-primary fill + checkmark), active (accent-primary fill + number + shadow), and upcoming (neutral border + number). Includes prev/next/reset navigation buttons.

Cross-references: [[button]] (navigation buttons use btn component), [[shadows]] (active step uses `--shadow-pink`), [[token-tiers]] (spacing, typography, radius, motion tokens).

Visual reference: Section "Stepper / Wizard" in `design-reference.html` (lines ~3228-3304 CSS, lines ~6003-6026 HTML, lines ~8269-8295 JS).

---

## 1. HTML Structure

```html
<div class="stepper" id="stepper-track">
  <div class="stepper-step completed">
    <div class="stepper-indicator">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
    <div class="stepper-label">Account</div>
  </div>
  <div class="stepper-step active">
    <div class="stepper-indicator">2</div>
    <div class="stepper-label">Profile</div>
  </div>
  <div class="stepper-step">
    <div class="stepper-indicator">3</div>
    <div class="stepper-label">Preferences</div>
  </div>
  <div class="stepper-step">
    <div class="stepper-indicator">4</div>
    <div class="stepper-label">Review</div>
  </div>
</div>
<div style="display:flex;gap:var(--space-2);margin-top:var(--space-6)">
  <button class="btn btn-secondary btn-sm" id="stepper-prev">Back</button>
  <button class="btn btn-primary btn-sm" id="stepper-next">Next</button>
  <button class="btn btn-ghost btn-sm" id="stepper-reset" style="margin-left:auto">Reset</button>
</div>
```

---

## 2. CSS Classes

### 2.1 `.stepper` (container)

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `align-items` | `flex-start` | -- |
| `gap` | `0` | -- |

### 2.2 `.stepper-step`

| Property | Value | Token |
|---|---|---|
| `display` | `flex` | -- |
| `flex-direction` | `column` | -- |
| `align-items` | `center` | -- |
| `flex` | `1` | -- |
| `position` | `relative` | -- |

### 2.3 Connector Lines (via `::after`)

On `.stepper-step:not(:last-child)::after`:

| Property | Value | Token |
|---|---|---|
| `content` | `''` | -- |
| `position` | `absolute` | -- |
| `top` | `16px` | Center of indicator |
| `left` | `calc(50% + 20px)` | -- |
| `right` | `calc(-50% + 20px)` | -- |
| `height` | `2px` | -- |
| `background` | `var(--border-subtle)` | Default (upcoming) |
| `z-index` | `0` | -- |

Connector state overrides:

| Step State | Connector `background` |
|---|---|
| `.completed:not(:last-child)::after` | `var(--accent-primary)` |
| `.active:not(:last-child)::after` | `linear-gradient(to right, var(--accent-primary) 50%, var(--border-subtle) 50%)` |

### 2.4 `.stepper-indicator` (base/upcoming state)

| Property | Value | Token |
|---|---|---|
| `width` | `32px` | `--control-sm` |
| `height` | `32px` | `--control-sm` |
| `border-radius` | `var(--radius-full)` | `9999px` |
| `border` | `2px solid var(--border-subtle)` | -- |
| `background` | `var(--bg-surface)` | -- |
| `display` | `flex` | -- |
| `align-items` | `center` | -- |
| `justify-content` | `center` | -- |
| `font-size` | `var(--ui-text-sm)` | `13px` |
| `font-weight` | `700` | -- |
| `color` | `var(--text-muted)` | -- |
| `z-index` | `1` | Above connector lines |
| `transition` | `all var(--motion-base) var(--ease-out)` | -- |

### 2.5 Step State Overrides on Indicator

| State | `border-color` | `background` | `color` | `box-shadow` |
|---|---|---|---|---|
| `.active .stepper-indicator` | `var(--accent-primary)` | `var(--accent-primary)` | `var(--text-on-accent)` | `var(--shadow-pink)` |
| `.completed .stepper-indicator` | `var(--accent-primary)` | `var(--accent-primary)` | `var(--text-on-accent)` | none |

### 2.6 `.stepper-label`

| Property | Value | Token |
|---|---|---|
| `margin-top` | `var(--space-2)` | `8px` |
| `font-size` | `var(--ui-text-xs)` | `12px` |
| `font-weight` | `600` | -- |
| `color` | `var(--text-muted)` | Default (upcoming) |
| `text-align` | `center` | -- |

Label state overrides:

| State | `color` |
|---|---|
| `.active .stepper-label` | `var(--accent-primary)` |
| `.completed .stepper-label` | `var(--text-secondary)` |

---

## 3. States

| Step State | Indicator | Label | Connector |
|---|---|---|---|
| Upcoming (default) | Neutral border, number text, muted | Muted text | `--border-subtle` |
| Active | Accent-primary filled, white number, pink shadow | Accent-primary text | Half gradient (accent/subtle) |
| Completed | Accent-primary filled, white checkmark SVG, no shadow | Secondary text | Solid accent-primary |

---

## 4. JavaScript Behavior

### 4.1 State Management

```js
const stepperSteps = document.querySelectorAll('#stepper-track .stepper-step');
let stepperCurrent = 1; // 0-indexed
```

### 4.2 `updateStepper()`

```js
function updateStepper() {
  stepperSteps.forEach((step, i) => {
    step.classList.remove('active', 'completed');
    const indicator = step.querySelector('.stepper-indicator');
    if (i < stepperCurrent) {
      step.classList.add('completed');
      indicator.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (i === stepperCurrent) {
      step.classList.add('active');
      indicator.textContent = i + 1;
    } else {
      indicator.textContent = i + 1;
    }
  });
}
```

### 4.3 Navigation Buttons

- **Next**: `if (stepperCurrent < stepperSteps.length - 1) { stepperCurrent++; updateStepper(); }`
- **Back**: `if (stepperCurrent > 0) { stepperCurrent--; updateStepper(); }`
- **Reset**: `stepperCurrent = 0; updateStepper();`

---

## 5. Responsive Behavior

No explicit responsive breakpoints in the reference. The stepper uses `flex: 1` on steps, so it scales proportionally. At very narrow widths, labels may overlap or wrap.

---

## 6. Accessibility

- Implementing agents should add `role="progressbar"` or a step list structure with `aria-current="step"` on the active step
- Completed steps should communicate their state (e.g., `aria-label="Account - completed"`)
- Navigation buttons should have descriptive labels (the reference uses "Back", "Next", "Reset")
- The stepper should be wrapped in a `<nav>` or similar landmark if used as primary navigation

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`
- `--text-primary`, `--text-secondary`, `--text-muted`, `--text-on-accent`
- `--border-subtle`
- `--accent-primary`
- `--shadow-pink` (`4px 4px 0 var(--accent-primary)`)

### Tier 3 (Component)

- `--control-sm` (`32px`)
- `--space-2` (`8px`), `--space-6` (`24px`)
- `--radius-full` (`9999px`)
- `--ui-text-xs` (`12px`), `--ui-text-sm` (`13px`)
- `--motion-base` (`240ms`)
- `--ease-out`

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.stepper-indicator` has `width: 32px` and `height: 32px` and `border-radius: 9999px`
- `.stepper-step.active .stepper-indicator` has `background` matching `--accent-primary` and `box-shadow` matching `--shadow-pink`
- `.stepper-step.completed .stepper-indicator` has `background` matching `--accent-primary` (no box-shadow)
- `.stepper-step.active .stepper-label` has `color` matching `--accent-primary`
- Connector line has `height: 2px`

### 8.2 Interaction Assertions

- Clicking "Next" advances `stepperCurrent` and updates step classes
- Clicking "Back" moves back one step
- Clicking "Reset" sets all steps to upcoming, first step becomes active
- Completed steps show checkmark SVG in indicator

### 8.3 Visual Regression Scenarios

- Stepper at step 1 (first completed, second active) -- light mode
- Stepper at step 1 -- dark mode
- Stepper at step 3 (3 completed, 4th active)
- Stepper fully reset (step 0 active)

### 8.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, indicator transitions complete in 0.01ms

## Implementation CSS

```css
@layer component {
  .stepper {
    display: flex;
    align-items: flex-start;
    gap: 0;
    width: 100%;
  }
  .stepper-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
    position: relative;
  }
  .stepper-step::after {
    content: '';
    position: absolute;
    top: 16px;
    left: calc(50% + 20px);
    width: calc(100% - 40px);
    height: 2px;
    background: var(--border-default);
  }
  .stepper-step:last-child::after { display: none; }
  .stepper-step.completed::after { background: var(--accent-primary); }

  .stepper-indicator {
    width: 32px;
    height: 32px;
    border-radius: var(--radius-full);
    border: 2px solid var(--border-default);
    background: var(--bg-surface);
    display: grid;
    place-items: center;
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--text-muted);
    position: relative;
    z-index: 1;
  }
  .stepper-step.active .stepper-indicator {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: var(--text-on-accent);
  }
  .stepper-step.completed .stepper-indicator {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: var(--text-on-accent);
  }

  .stepper-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-muted);
    text-align: center;
  }
  .stepper-step.active .stepper-label { color: var(--text-primary); }
  .stepper-step.completed .stepper-label { color: var(--text-secondary); }
}
```
