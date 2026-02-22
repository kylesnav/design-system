# Delightful Design System — Reference

Neo-brutalist, warm minimalism. oklch colors. 3-tier tokens. Solid shadows. Purposeful motion.

**Fonts:** Inter (sans), JetBrains Mono (mono)
**Font links:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet" />
```

---

## Tier 1 — Primitives

Raw oklch values. Named by scale, no semantic meaning. **Never use directly in components** — always go through Tier 2 semantic tokens.

### Neutral
| Token | Value |
|---|---|
| `--primitive-neutral-0` | `oklch(1.00 0.000 0)` |
| `--primitive-neutral-25` | `oklch(0.988 0.004 90)` |
| `--primitive-neutral-50` | `oklch(0.978 0.005 90)` |
| `--primitive-neutral-100` | `oklch(0.958 0.006 90)` |
| `--primitive-neutral-150` | `oklch(0.938 0.007 90)` |
| `--primitive-neutral-200` | `oklch(0.905 0.007 90)` |
| `--primitive-neutral-300` | `oklch(0.855 0.008 90)` |
| `--primitive-neutral-400` | `oklch(0.755 0.010 90)` |
| `--primitive-neutral-500` | `oklch(0.610 0.012 90)` |
| `--primitive-neutral-600` | `oklch(0.490 0.010 90)` |
| `--primitive-neutral-700` | `oklch(0.360 0.010 90)` |
| `--primitive-neutral-800` | `oklch(0.240 0.008 90)` |
| `--primitive-neutral-900` | `oklch(0.170 0.007 90)` |
| `--primitive-neutral-950` | `oklch(0.135 0.008 90)` |

### Blue
| Token | Value |
|---|---|
| `--primitive-blue-100` | `oklch(0.920 0.045 260)` |
| `--primitive-blue-200` | `oklch(0.830 0.100 260)` |
| `--primitive-blue-300` | `oklch(0.720 0.160 260)` |
| `--primitive-blue-400` | `oklch(0.630 0.200 260)` |
| `--primitive-blue-500` | `oklch(0.550 0.220 260)` |

### Red
| Token | Value |
|---|---|
| `--primitive-red-100` | `oklch(0.920 0.045 25)` |
| `--primitive-red-200` | `oklch(0.830 0.100 25)` |
| `--primitive-red-300` | `oklch(0.720 0.160 25)` |
| `--primitive-red-400` | `oklch(0.630 0.200 25)` |
| `--primitive-red-500` | `oklch(0.550 0.220 25)` |

### Yellow
| Token | Value |
|---|---|
| `--primitive-yellow-100` | `oklch(0.960 0.050 90)` |
| `--primitive-yellow-200` | `oklch(0.930 0.100 90)` |
| `--primitive-yellow-300` | `oklch(0.900 0.140 90)` |
| `--primitive-yellow-400` | `oklch(0.870 0.160 90)` |
| `--primitive-yellow-500` | `oklch(0.850 0.180 90)` |

### Green
| Token | Value |
|---|---|
| `--primitive-green-100` | `oklch(0.920 0.045 155)` |
| `--primitive-green-200` | `oklch(0.830 0.100 155)` |
| `--primitive-green-300` | `oklch(0.720 0.150 155)` |
| `--primitive-green-400` | `oklch(0.650 0.175 155)` |
| `--primitive-green-500` | `oklch(0.580 0.180 155)` |

---

## Tier 2 — Semantic Tokens

### Light Mode (`:root`, `[data-theme="light"]`)

**Backgrounds:**
| Token | Value |
|---|---|
| `--bg-page` | `oklch(0.985 0.005 80)` — warm off-white |
| `--bg-surface` | `oklch(1.00 0.00 0)` |
| `--bg-elevated` | `oklch(1.00 0.00 0)` |
| `--bg-subtle` | `oklch(0.965 0.010 80)` |
| `--bg-muted` | `oklch(0.950 0.012 80)` |

**Text:**
| Token | Value |
|---|---|
| `--text-primary` | `oklch(0.180 0.010 80)` |
| `--text-secondary` | `oklch(0.400 0.015 80)` |
| `--text-muted` | `oklch(0.550 0.015 80)` |
| `--text-on-accent` | `oklch(1.00 0.000 0)` |
| `--text-on-yellow` | `oklch(0.200 0.020 90)` |

**Borders:**
| Token | Value |
|---|---|
| `--border-default` | `var(--text-primary)` |
| `--border-strong` | `var(--text-primary)` |
| `--border-subtle` | `oklch(0.800 0.020 80)` |

**Accent Colors:**
| Family | Base | Hover | Subtle | Text |
|---|---|---|---|---|
| Blue | `oklch(0.600 0.250 260)` | `oklch(0.550 0.260 260)` | `oklch(0.940 0.050 260)` | `oklch(0.550 0.250 260)` |
| Red | `oklch(0.600 0.260 20)` | `oklch(0.550 0.250 20)` | `oklch(0.940 0.050 20)` | `oklch(0.550 0.250 20)` |
| Yellow | `oklch(0.850 0.200 90)` | `oklch(0.800 0.190 90)` | `oklch(0.960 0.080 90)` | `oklch(0.400 0.150 90)` |
| Green | `oklch(0.650 0.200 150)` | `oklch(0.600 0.190 150)` | `oklch(0.940 0.060 150)` | `oklch(0.500 0.180 150)` |

**Status:** `--status-info` = blue, `--status-error` = red, `--status-warning` = yellow, `--status-success` = green

**Utility:**
| Token | Value |
|---|---|
| `--focus-ring` | `var(--accent-blue)` |
| `--overlay-bg` | `oklch(0.180 0.010 80 / 0.30)` |

**Shadows (solid, no blur — neo-brutalist):**
| Token | Value |
|---|---|
| `--shadow-sm` | `2px 2px 0 var(--text-primary)` |
| `--shadow-md` | `4px 4px 0 var(--text-primary)` |
| `--shadow-lg` | `8px 8px 0 var(--text-primary)` |
| `--shadow-blue` | `4px 4px 0 var(--accent-blue)` |
| `--shadow-red` | `4px 4px 0 var(--accent-red)` |
| `--shadow-yellow` | `4px 4px 0 var(--accent-yellow)` |

### Dark Mode (`[data-theme="dark"]`)

**Backgrounds:**
| Token | Value |
|---|---|
| `--bg-page` | `oklch(0.135 0.010 90)` |
| `--bg-surface` | `oklch(0.160 0.012 90)` |
| `--bg-elevated` | `oklch(0.185 0.012 90)` |
| `--bg-subtle` | `oklch(0.205 0.012 90)` |
| `--bg-muted` | `oklch(0.175 0.010 90)` |

**Text:**
| Token | Value |
|---|---|
| `--text-primary` | `oklch(0.935 0.005 90)` |
| `--text-secondary` | `oklch(0.690 0.010 90)` |
| `--text-muted` | `oklch(0.540 0.010 90)` |
| `--text-on-accent` | `oklch(1.00 0.000 0)` |
| `--text-on-yellow` | `oklch(0.135 0.010 90)` |

**Borders:**
| Token | Value |
|---|---|
| `--border-default` | `var(--text-primary)` |
| `--border-strong` | `var(--text-primary)` |
| `--border-subtle` | `oklch(0.330 0.012 90)` |

**Accent Colors (Dark):**
| Family | Base | Hover | Subtle | Text |
|---|---|---|---|---|
| Blue | `oklch(0.670 0.200 260)` | `oklch(0.720 0.190 260)` | `oklch(0.250 0.060 260)` | `oklch(0.730 0.190 260)` |
| Red | `oklch(0.620 0.210 25)` | `oklch(0.670 0.200 25)` | `oklch(0.250 0.060 25)` | `oklch(0.700 0.190 25)` |
| Yellow | `oklch(0.810 0.160 85)` | `oklch(0.850 0.150 85)` | `oklch(0.260 0.060 85)` | `oklch(0.850 0.150 85)` |
| Green | `oklch(0.680 0.170 155)` | `oklch(0.720 0.160 155)` | `oklch(0.250 0.050 155)` | `oklch(0.730 0.160 155)` |

**Utility (Dark):**
| Token | Value |
|---|---|
| `--focus-ring` | `oklch(0.670 0.200 260)` |
| `--overlay-bg` | `oklch(0 0 0 / 0.60)` |

**Dark Shadows:** `oklch(0 0 0 / 0.8)` instead of `var(--text-primary)` for sm/md/lg.

---

## Tier 3 — Component Tokens

### Typography
```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace;

/* Fluid scale (Major Third) */
--step--2: clamp(0.694rem, 0.650rem + 0.22vi, 0.8rem);
--step--1: clamp(0.833rem, 0.775rem + 0.29vi, 1rem);
--step-0:  clamp(1rem, 0.913rem + 0.43vi, 1.25rem);
--step-1:  clamp(1.2rem, 1.074rem + 0.63vi, 1.5625rem);
--step-2:  clamp(1.44rem, 1.261rem + 0.89vi, 1.953rem);
--step-3:  clamp(1.728rem, 1.480rem + 1.24vi, 2.441rem);
--step-4:  clamp(2.074rem, 1.734rem + 1.70vi, 3.052rem);
--step-5:  clamp(2.488rem, 2.028rem + 2.30vi, 3.815rem);

--tracking-tight: -0.02em;
--tracking-tighter: -0.03em;
--tracking-tightest: -0.04em;

--leading-none: 1.0;
--leading-tight: 1.15;
--leading-snug: 1.3;
--leading-normal: 1.55;
--leading-relaxed: 1.65;
```

### Spacing (4px base grid)
```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;
--space-4: 16px;  --space-5: 20px;  --space-6: 24px;
--space-8: 32px;  --space-10: 40px; --space-12: 48px;
--space-16: 64px; --space-20: 80px;
```

### Border Radius
```css
--radius-sm: 10px;  --radius-md: 16px;  --radius-lg: 24px;
--radius-xl: 32px;  --radius-full: 9999px;
```

### Motion
```css
--motion-instant: 100ms;
--motion-fast: 160ms;
--motion-base: 240ms;
--motion-slow: 360ms;

--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
```

### Button Tokens
```css
--btn-primary-bg: var(--accent-blue);
--btn-primary-text: var(--text-on-accent);
--btn-danger-bg: var(--accent-red);
--btn-danger-text: var(--text-on-accent);
--btn-highlight-bg: var(--accent-yellow);
--btn-highlight-text: var(--text-on-yellow);
```

### Toggle Tokens
```css
--toggle-off-bg: var(--primitive-neutral-300);
--toggle-on-bg: var(--accent-blue);
--toggle-knob: var(--primitive-neutral-0);
```

---

## Base Reset & Body

```css
*, *::before, *::after {
  margin: 0; padding: 0; box-sizing: border-box;
}

body {
  font-family: var(--font-sans);
  font-size: var(--step-0);
  line-height: var(--leading-normal);
  color: var(--text-primary);
  background: var(--bg-page);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "cv02", "cv03", "cv04", "cv11";
}

:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 2px;
}
```

---

## Animations & Keyframes

All animations MUST be wrapped in `@media (prefers-reduced-motion: no-preference)`.

```css
@media (prefers-reduced-motion: no-preference) {
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes scaleIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-6px); }
    40% { transform: translateX(5px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(2px); }
  }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Animation Utility Classes
```css
.anim-in { animation: fadeInUp 0.5s var(--ease-smooth) both; }
.anim-d1 { animation-delay: 0.06s; }
.anim-d2 { animation-delay: 0.12s; }
/* ... up to .anim-d12 (0.72s) */
```

---

## Interaction Patterns

### hover-lift (cards, tiles)
```css
.hover-lift {
  transition: transform var(--motion-fast) var(--ease-smooth),
              box-shadow var(--motion-fast) var(--ease-out);
}
.hover-lift:hover {
  transform: translateY(-3px) scale(1.01);
}
.hover-lift:active {
  transform: translateY(0) scale(0.99);
}
```

### btn-bounce (buttons)
```css
.btn-bounce {
  transition: transform var(--motion-fast) var(--ease-bounce),
              background-color var(--motion-fast) ease-out,
              box-shadow var(--motion-fast) var(--ease-out);
}
.btn-bounce:hover { transform: scale(1.03); }
.btn-bounce:active { transform: scale(0.97); transition-duration: var(--motion-instant); }
```

### card-interactive
```css
.card-interactive {
  transition: transform var(--motion-fast) var(--ease-smooth),
              box-shadow var(--motion-base) var(--ease-out),
              border-color var(--motion-fast) ease-out;
}
.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--border-strong);
}
```

### Neo-Brutalist Card Hover (signature)
```css
.card:hover {
  transform: translate(-4px, -4px);
  box-shadow: var(--shadow-lg);
}
.card:active {
  transform: translate(2px, 2px);
  box-shadow: 0 0 0 var(--text-primary);
}
```

---

## Components

### Button `.btn`

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: var(--font-sans);
  font-weight: 700;
  border: 2px solid var(--text-primary);
  cursor: pointer;
  border-radius: var(--radius-md);
  white-space: nowrap;
  transition: transform var(--motion-instant) linear,
              background var(--motion-fast) var(--ease-out),
              box-shadow var(--motion-instant) linear;
  box-shadow: var(--shadow-sm);
}
.btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn:active { transform: translate(2px, 2px); box-shadow: 0 0 0 var(--text-primary); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
```

**Sizes:** `.btn-sm` (32px, 0.8125rem), `.btn-md` (44px, 0.9375rem), `.btn-lg` (56px, 1.0625rem)

**Variants:**
- `.btn-primary` — `background: var(--accent-blue); color: var(--text-on-accent); box-shadow: var(--shadow-blue);`
- `.btn-danger` — `background: var(--accent-red); color: var(--text-on-accent); box-shadow: var(--shadow-red);`
- `.btn-highlight` — `background: var(--accent-yellow); color: var(--text-on-yellow); box-shadow: var(--shadow-yellow);`
- `.btn-secondary` — `background: var(--bg-surface); border: 1px solid var(--border-default);`
- `.btn-ghost` — `background: transparent; color: var(--text-secondary);`

```html
<button class="btn btn-primary btn-md">Primary</button>
<button class="btn btn-danger btn-md">Danger</button>
<button class="btn btn-highlight btn-md">Highlight</button>
<button class="btn btn-secondary btn-md">Secondary</button>
<button class="btn btn-ghost btn-md">Ghost</button>
```

### Input `.input`

```css
.input {
  width: 100%;
  height: 36px;
  padding: 0 var(--space-3);
  font-family: var(--font-sans);
  font-size: 0.875rem;
  color: var(--text-primary);
  background: var(--bg-surface);
  border: 2px solid var(--text-primary);
  border-radius: var(--radius-sm);
  box-shadow: 2px 2px 0 var(--text-primary);
  transition: border-color var(--motion-fast) var(--ease-out),
              box-shadow var(--motion-instant) linear;
}
.input:focus { outline: none; border-color: var(--accent-blue); box-shadow: 4px 4px 0 var(--accent-blue); }
.input-error { border-color: var(--accent-red); }
.input-error:focus { box-shadow: 4px 4px 0 var(--accent-red); }
.input:disabled { opacity: 0.5; cursor: not-allowed; background: var(--bg-subtle); }
```

```html
<div class="form-group">
  <label class="form-label">Email</label>
  <input class="input" type="email" placeholder="you@example.com" />
  <span class="form-hint">We'll never share your email.</span>
</div>
```

### Textarea `.textarea`

```css
.textarea {
  height: auto; min-height: 80px; padding: var(--space-3);
  resize: vertical; font-family: var(--font-sans); font-size: 0.875rem;
  color: var(--text-primary); background: var(--bg-surface);
  border: 2px solid var(--text-primary); border-radius: var(--radius-sm);
  box-shadow: 2px 2px 0 var(--text-primary);
}
.textarea:focus { outline: none; border-color: var(--accent-blue); box-shadow: 4px 4px 0 var(--accent-blue); }
```

### Select `.select`

```css
.select {
  appearance: none; width: 100%; height: 36px;
  padding: 0 32px 0 var(--space-3);
  font-family: var(--font-sans); font-size: 0.875rem;
  color: var(--text-primary); background: var(--bg-surface);
  border: 2px solid var(--text-primary); border-radius: var(--radius-sm);
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--text-primary);
}
.select:focus { outline: none; border-color: var(--accent-blue); box-shadow: 4px 4px 0 var(--accent-blue); }
```

### Checkbox & Radio

```css
.check-box, .radio-circle {
  width: 18px; height: 18px;
  border: 1.5px solid var(--border-strong);
  background: var(--bg-surface);
  display: flex; align-items: center; justify-content: center;
}
.check-box { border-radius: 4px; }
.radio-circle { border-radius: 50%; }
.check-box.checked, .radio-circle.checked {
  background: var(--accent-blue); border-color: var(--accent-blue);
}
```

### Toggle

```css
.toggle {
  width: 40px; height: 22px; border-radius: var(--radius-full);
  background: var(--toggle-off-bg); cursor: pointer; position: relative;
  border: none; padding: 0;
}
.toggle-knob {
  position: absolute; top: 3px; left: 3px;
  width: 16px; height: 16px; border-radius: 50%;
  background: var(--toggle-knob);
}
.toggle.on { background: var(--toggle-on-bg); }
.toggle.on .toggle-knob { transform: translateX(18px); }
```

### Card `.card`

```css
.card {
  background: var(--bg-surface);
  border: 2px solid var(--text-primary);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-sm);
  transition: transform var(--motion-instant) linear,
              box-shadow var(--motion-instant) linear;
}
.card:hover { transform: translate(-4px, -4px); box-shadow: var(--shadow-lg); }
.card:active { transform: translate(2px, 2px); box-shadow: 0 0 0 var(--text-primary); }
```

**Variants:** `.card-featured` (blue top border), `.card-featured-red`, `.card-featured-yellow`, `.card-featured-green`, `.card-compact` (smaller padding)

```html
<div class="card card-featured">
  <div class="card-title">Card Title</div>
  <div class="card-desc">Description text goes here.</div>
  <div class="card-meta">Metadata · Extra info</div>
</div>
```

### Badge `.badge`

```css
.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 10px; font-size: 0.6875rem; font-weight: 600;
  border-radius: var(--radius-full);
}
```

**Variants:**
- `.badge-blue` — `background: var(--accent-blue-subtle); color: var(--accent-blue-text);`
- `.badge-red` — red subtle/text
- `.badge-yellow` — yellow subtle/text
- `.badge-green` — green subtle/text

```html
<span class="badge badge-blue">Info</span>
<span class="badge badge-green">Success</span>
<span class="badge badge-yellow">Warning</span>
<span class="badge badge-red">Error</span>
```

### Alert `.alert`

```css
.alert {
  display: flex; align-items: flex-start; gap: var(--space-3);
  padding: var(--space-4); border-radius: var(--radius-md);
  font-size: 0.875rem; line-height: 1.5;
}
.alert-info { background: var(--accent-blue-subtle); color: var(--accent-blue-text); }
.alert-error { background: var(--accent-red-subtle); color: var(--accent-red-text); }
.alert-warning { background: var(--accent-yellow-subtle); color: var(--accent-yellow-text); }
.alert-success { background: var(--accent-green-subtle); color: var(--accent-green-text); }
```

### Data Table `.data-table`

```css
.table-wrap {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg); overflow: hidden;
}
.data-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
.data-table th {
  text-align: left; padding: var(--space-3) var(--space-4);
  font-weight: 600; font-size: 0.6875rem; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--text-muted);
  background: var(--bg-subtle); border-bottom: 1px solid var(--border-subtle);
}
.data-table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border-subtle);
}
.data-table tbody tr:hover {
  background: var(--bg-subtle);
  transform: scale(1.01) translateY(-1px);
  box-shadow: var(--shadow-sm);
}
```

### Tabs `.tabs`

```css
.tabs { display: flex; border-bottom: 1px solid var(--border-subtle); }
.tab {
  padding: var(--space-3) var(--space-4); font-size: 0.875rem;
  font-weight: 500; color: var(--text-secondary);
  border: none; background: none;
  border-bottom: 2px solid transparent; margin-bottom: -1px;
}
.tab:hover { color: var(--text-primary); }
.tab.active { color: var(--accent-blue-text); border-bottom-color: var(--accent-blue); font-weight: 600; }
```

### Sidebar `.sidebar-demo`

```css
.sidebar-demo {
  width: 240px; background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg); padding: var(--space-3);
}
.sidebar-item {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm);
  font-size: 0.8125rem; color: var(--text-secondary); cursor: pointer;
}
.sidebar-item:hover { background: var(--bg-subtle); color: var(--text-primary); }
.sidebar-item.active { background: var(--accent-blue-subtle); color: var(--accent-blue-text); font-weight: 550; }
```

### Toast `.toast`

```css
.toast-container {
  position: fixed; bottom: var(--space-6); right: var(--space-6);
  display: flex; flex-direction: column-reverse; gap: var(--space-2);
  z-index: 1000; max-width: 380px; width: 100%;
}
.toast {
  display: flex; align-items: flex-start; gap: var(--space-3);
  padding: var(--space-4); background: var(--bg-surface);
  border: 1px solid var(--border-default); border-radius: var(--radius-md);
  box-shadow: var(--shadow-md); position: relative; overflow: hidden;
}
.toast-stripe {
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
}
.toast-stripe.success { background: var(--accent-green); }
.toast-stripe.error { background: var(--accent-red); }
.toast-stripe.warning { background: var(--accent-yellow); }
.toast-stripe.info { background: var(--accent-blue); }
```

### Modal `.modal-panel`

```css
.modal-panel {
  margin: auto; background: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg); padding: var(--space-6);
  max-width: 440px; width: calc(100% - 32px);
  box-shadow: var(--shadow-lg); color: var(--text-primary);
}
.modal-panel::backdrop { background: var(--overlay-bg); }
```

Use `<dialog>` element with `.showModal()` / `.close()`.

### Drawer `.drawer-panel`

```css
.drawer-panel {
  margin: 0; margin-top: auto; width: 100%;
  background: var(--bg-surface); border-top: 1px solid var(--border-default);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: var(--space-6); max-height: 80vh; overflow-y: auto;
}
.drawer-handle {
  width: 36px; height: 4px; background: var(--border-strong);
  border-radius: var(--radius-full); margin: 0 auto var(--space-4);
}
```

### Skeleton Loading

```css
.skel { background: var(--bg-muted); border-radius: var(--radius-sm); }
.skel-shimmer {
  background: linear-gradient(110deg, var(--bg-muted) 30%, var(--bg-subtle) 50%, var(--bg-muted) 70%);
  background-size: 200% 100%;
  animation: playful-shimmer 2s linear infinite; /* wrap in reduced-motion check */
}
```

---

## Dark Mode Toggle Pattern

```html
<html data-theme="light">
```

```js
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
}

// On load — respect system preference
const saved = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
```

---

## Neo-Brutalist Rules Checklist

1. **Borders over shadows** — Cards/buttons get `border: 2px solid var(--text-primary)` + solid shadow (no blur)
2. **Solid shadows only** — `box-shadow: Xpx Ypx 0` — zero blur radius
3. **Hover = lift + bigger shadow** — `transform: translate(-4px, -4px); box-shadow: var(--shadow-lg);`
4. **Active = press + no shadow** — `transform: translate(2px, 2px); box-shadow: 0 0 0 var(--text-primary);`
5. **Bold typography** — Headings 650-800 weight, tight tracking
6. **Color is surgical** — Blue for primary actions, red for danger, yellow for highlight, green for success
7. **Warm backgrounds** — `--bg-page` is warm off-white, not pure white
8. **All colors via tokens** — No hardcoded hex/rgb/hsl in components
9. **All spacing via scale** — Only `var(--space-*)` values
10. **Reduced motion respected** — All animations behind `prefers-reduced-motion: no-preference`
11. **Focus visible on all interactive elements** — `outline: 2px solid var(--focus-ring); outline-offset: 2px;`
12. **Border radius from scale** — Only `var(--radius-*)` values
