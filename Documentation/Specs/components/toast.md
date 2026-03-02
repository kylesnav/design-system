# Toast

> Toast notification system with a fixed container in the bottom-right, 4 types (success/error/warning/info) each with a colored left stripe, auto-dismiss after 5 seconds with animated progress bar, close button, and max 3 visible toasts. Entry animation slides up from below; exit slides right.

Cross-references: [[alert]] (static banners vs. ephemeral toasts), [[shadows]] (toasts use `--shadow-md`), [[token-tiers]] (spacing, typography, radius, z-index, motion tokens).

Visual reference: Section "TOASTS" in `design-reference.html` (lines ~2698-2796 CSS, line ~7135 HTML, lines ~7810-7831 JS, lines ~493-501 keyframes).

---

## 1. HTML Structure

### 1.1 Container

```html
<div class="toast-container" id="toast-container" aria-live="polite" aria-atomic="false"></div>
```

### 1.2 Individual Toast (dynamically generated)

```html
<div class="toast">
  <div class="toast-stripe success"></div>
  <div class="toast-icon" style="color:var(--accent-green)">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  </div>
  <div class="toast-content">
    <strong>Title</strong><br>
    <span style="color:var(--text-secondary)">Description message</span>
  </div>
  <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  <div class="toast-progress">
    <div class="toast-progress-bar"></div>
  </div>
</div>
```

---

## 2. CSS Classes

### 2.1 `.toast-container`

| Property | Value | Token |
|---|---|---|
| `position` | `fixed` | -- |
| `bottom` | `var(--space-6)` | `24px` |
| `right` | `var(--space-6)` | `24px` |
| `display` | `flex` | -- |
| `flex-direction` | `column-reverse` | Newest toasts appear at bottom |
| `gap` | `var(--space-2)` | `8px` |
| `z-index` | `var(--z-toast)` | `1100` |
| `pointer-events` | `none` | Container itself is not interactive |
| `max-width` | `380px` | -- |
| `width` | `100%` | -- |

### 2.2 `.toast`

| Property | Value | Token |
|---|---|---|
| `pointer-events` | `auto` | Individual toasts are interactive |
| `display` | `flex` | -- |
| `align-items` | `flex-start` | -- |
| `gap` | `var(--space-3)` | `12px` |
| `padding` | `var(--space-4)` | `16px` |
| `background` | `var(--bg-surface)` | -- |
| `border` | `2px solid var(--border-default)` | -- |
| `border-radius` | `var(--radius-md)` | `16px` |
| `box-shadow` | `var(--shadow-md)` | -- |
| `position` | `relative` | -- |
| `overflow` | `hidden` | -- |
| `opacity` | `0` | Initial (pre-animation) |
| `transform` | `translateY(20px)` | Initial (slides up) |
| `cursor` | `grab` | -- |

### 2.3 `.toast-stripe`

| Property | Value | Token |
|---|---|---|
| `position` | `absolute` | -- |
| `left` | `0` | -- |
| `top` | `0` | -- |
| `bottom` | `0` | -- |
| `width` | `3px` | -- |

Color variants:

| Class | `background` |
|---|---|
| `.toast-stripe.success` | `var(--accent-green)` |
| `.toast-stripe.error` | `var(--accent-danger)` |
| `.toast-stripe.warning` | `var(--accent-gold)` |
| `.toast-stripe.info` | `var(--accent-primary)` |

### 2.4 `.toast-icon`

| Property | Value |
|---|---|
| `flex-shrink` | `0` |
| `margin-top` | `1px` |
| `margin-left` | `var(--space-2)` = `8px` |

Icon color is set inline via `style` attribute using the accent color matching the toast type.

### 2.5 `.toast-content`

| Property | Value | Token |
|---|---|---|
| `flex` | `1` | -- |
| `font-size` | `var(--ui-text-md)` | `14px` |
| `line-height` | `1.4` | -- |
| `margin-right` | `var(--space-6)` | `24px` (space for close button) |

### 2.6 `.toast-close`

| Property | Value | Token |
|---|---|---|
| `position` | `absolute` | -- |
| `top` | `var(--space-3)` | `12px` |
| `right` | `var(--space-3)` | `12px` |
| `background` | `none` | -- |
| `border` | `none` | -- |
| `cursor` | `pointer` | -- |
| `color` | `var(--text-muted)` | -- |
| `padding` | `2px` | -- |
| `border-radius` | `2px` | -- |
| `transition` | `transform var(--motion-instant) linear, color var(--motion-fast) var(--ease-out)` | -- |

| State | CSS Changes |
|---|---|
| Hover | `color: var(--text-secondary)` |
| Active | `transform: scale(0.85)` |

### 2.7 `.toast-progress`

| Property | Value | Token |
|---|---|---|
| `position` | `absolute` | -- |
| `bottom` | `0` | -- |
| `left` | `0` | -- |
| `right` | `0` | -- |
| `height` | `2px` | -- |
| `background` | `var(--border-default)` | -- |

### 2.8 `.toast-progress-bar`

| Property | Value |
|---|---|
| `height` | `100%` |
| `background` | `var(--text-muted)` |
| `transform-origin` | `left` |

Animated with `progress-shrink` keyframes:

```css
@keyframes progress-shrink {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
```

Applied via JS: `bar.style.animation = 'progress-shrink 5s linear forwards';`

---

## 3. States

| State | Visual |
|---|---|
| Pre-entry | `opacity: 0; transform: translateY(20px)` |
| Visible | `opacity: 1; transform: translateY(0)` (transitioned in via JS) |
| Exit | `opacity: 0; transform: translateX(80px)` (slides right then removed) |

---

## 4. Toast Types

| Type | Stripe Color | Icon Color | Icon SVG |
|---|---|---|---|
| `success` | `var(--accent-green)` | `var(--accent-green)` | Checkmark circle |
| `error` | `var(--accent-danger)` | `var(--accent-danger)` | X circle |
| `warning` | `var(--accent-gold)` | `var(--accent-gold)` | Triangle alert |
| `info` | `var(--accent-primary)` | `var(--accent-primary)` | Info circle |

---

## 5. JavaScript Behavior

### 5.1 `showToast(type, title, msg)`

```js
window.showToast = function (type, title, msg) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <div class="toast-stripe ${type}"></div>
    <div class="toast-icon" style="color:${toastColors[type]}">${toastIcons[type]}</div>
    <div class="toast-content"><strong>${title}</strong><br><span style="color:var(--text-secondary)">${msg}</span></div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    <div class="toast-progress"><div class="toast-progress-bar"></div></div>`;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transition = 'opacity 0.3s ease-out, transform 0.3s cubic-bezier(0.22,1,0.36,1)';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });
  const bar = toast.querySelector('.toast-progress-bar');
  if (!prefersReduced && bar) {
    bar.style.animation = 'progress-shrink 5s linear forwards';
  }
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(80px)';
    setTimeout(() => toast.remove(), 300);
  }, 5000);
  while (toastContainer.children.length > MAX_TOASTS) {
    toastContainer.children[0].remove();
  }
};
```

### 5.2 Constants

- `MAX_TOASTS = 3` -- oldest toasts are removed when exceeded
- Auto-dismiss duration: `5000ms` (5 seconds)
- Exit animation delay after dismiss: `300ms` (time for exit transition)
- Progress bar animation: `5s linear` matching the auto-dismiss timing

### 5.3 Toast Icon Map

```js
const toastIcons = {
  success: '<svg ...><!-- checkmark circle --></svg>',
  error: '<svg ...><!-- x circle --></svg>',
  warning: '<svg ...><!-- triangle alert --></svg>',
  info: '<svg ...><!-- info circle --></svg>'
};
const toastColors = {
  success: 'var(--accent-green)',
  error: 'var(--accent-danger)',
  warning: 'var(--accent-gold)',
  info: 'var(--accent-primary)'
};
```

---

## 6. Responsive Behavior

### At `max-width: 600px`:

- `.toast-container` switches to: `left: var(--space-4); right: var(--space-4); max-width: none` (full width with padding)

---

## 7. Accessibility

- Container uses `aria-live="polite"` for screen reader announcements of new toasts
- `aria-atomic="false"` so only new content is announced (not the entire container)
- Close button provides manual dismissal
- Toast content includes both `<strong>` title and description text
- Implementing agents should consider adding `role="status"` to individual toasts

---

## 8. Token Dependencies

### Tier 2 (Semantic)

- `--bg-surface`
- `--text-secondary`, `--text-muted`
- `--border-default`
- `--accent-primary`, `--accent-danger`, `--accent-gold`, `--accent-green`
- `--shadow-md`

### Tier 3 (Component)

- `--z-toast` (`1100`)
- `--space-2` (`8px`), `--space-3` (`12px`), `--space-4` (`16px`), `--space-6` (`24px`)
- `--radius-md` (`16px`)
- `--ui-text-md` (`14px`)
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`, `--ease-smooth`

---

## 9. Test Specification

### 9.1 Computed Style Assertions

- `.toast-container` has `z-index: 1100`
- `.toast-container` has `max-width: 380px`
- `.toast` has `border-radius: 16px` and `box-shadow` matching `--shadow-md`
- `.toast-stripe.success` has `background` matching `--accent-green`
- `.toast-stripe.error` has `background` matching `--accent-danger`
- `.toast-progress` has `height: 2px`

### 9.2 Interaction Assertions

- `showToast('success', 'Title', 'Msg')` creates a toast element in the container
- Toast enters with opacity 0->1 and translateY(20px)->0
- After 5 seconds, toast exits with opacity 0 and translateX(80px)
- Clicking close button removes the toast immediately
- Creating 4 toasts removes the oldest (max 3 visible)

### 9.3 Visual Regression Scenarios

- Success toast (light mode)
- Error toast (light mode)
- Warning toast (dark mode)
- Info toast (dark mode)
- 3 stacked toasts
- Mobile full-width toasts at 500px viewport

### 9.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, entry/exit transitions complete in 0.01ms
- Progress bar animation completes in 0.01ms (bar appears static)
