# Delightful Design System — Reference

Neo-brutalist, warm boldness. oklch colors. 3-tier tokens. Solid shadows. Purposeful motion.

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
| `--primitive-neutral-25` | `oklch(0.988 0.006 70)` |
| `--primitive-neutral-50` | `oklch(0.980 0.008 70)` |
| `--primitive-neutral-100` | `oklch(0.960 0.010 70)` |
| `--primitive-neutral-150` | `oklch(0.940 0.012 70)` |
| `--primitive-neutral-200` | `oklch(0.920 0.012 70)` |
| `--primitive-neutral-300` | `oklch(0.860 0.014 70)` |
| `--primitive-neutral-400` | `oklch(0.750 0.014 70)` |
| `--primitive-neutral-500` | `oklch(0.600 0.012 70)` |
| `--primitive-neutral-600` | `oklch(0.480 0.010 70)` |
| `--primitive-neutral-700` | `oklch(0.350 0.010 70)` |
| `--primitive-neutral-800` | `oklch(0.250 0.012 60)` |
| `--primitive-neutral-900` | `oklch(0.180 0.012 60)` |
| `--primitive-neutral-950` | `oklch(0.140 0.012 60)` |

### Pink
| Token | Value |
|---|---|
| `--primitive-pink-100` | `oklch(0.920 0.060 350)` |
| `--primitive-pink-200` | `oklch(0.840 0.140 350)` |
| `--primitive-pink-300` | `oklch(0.720 0.220 350)` |
| `--primitive-pink-400` | `oklch(0.640 0.270 350)` |
| `--primitive-pink-500` | `oklch(0.560 0.280 350)` |

### Red
| Token | Value |
|---|---|
| `--primitive-red-100` | `oklch(0.930 0.050 20)` |
| `--primitive-red-200` | `oklch(0.850 0.110 20)` |
| `--primitive-red-300` | `oklch(0.720 0.180 20)` |
| `--primitive-red-400` | `oklch(0.620 0.220 20)` |
| `--primitive-red-500` | `oklch(0.540 0.230 20)` |

### Gold
| Token | Value |
|---|---|
| `--primitive-gold-100` | `oklch(0.960 0.050 85)` |
| `--primitive-gold-200` | `oklch(0.920 0.110 85)` |
| `--primitive-gold-300` | `oklch(0.870 0.160 85)` |
| `--primitive-gold-400` | `oklch(0.840 0.175 85)` |
| `--primitive-gold-500` | `oklch(0.820 0.165 84)` |

### Cyan
| Token | Value |
|---|---|
| `--primitive-cyan-100` | `oklch(0.930 0.038 210)` |
| `--primitive-cyan-200` | `oklch(0.850 0.085 210)` |
| `--primitive-cyan-300` | `oklch(0.740 0.125 210)` |
| `--primitive-cyan-400` | `oklch(0.650 0.148 210)` |
| `--primitive-cyan-500` | `oklch(0.570 0.155 210)` |

### Green
| Token | Value |
|---|---|
| `--primitive-green-100` | `oklch(0.930 0.042 148)` |
| `--primitive-green-200` | `oklch(0.840 0.095 148)` |
| `--primitive-green-300` | `oklch(0.730 0.145 148)` |
| `--primitive-green-400` | `oklch(0.630 0.170 148)` |
| `--primitive-green-500` | `oklch(0.540 0.165 148)` |

---

## Tier 2 — Semantic Tokens

### Light Mode (`:root`, `[data-theme="light"]`)

**Backgrounds:**
| Token | Value |
|---|---|
| `--bg-page` | `oklch(0.982 0.008 70)` — warm cream |
| `--bg-surface` | `oklch(0.995 0.004 70)` |
| `--bg-elevated` | `oklch(1.00 0.00 0)` |
| `--bg-subtle` | `oklch(0.965 0.012 70)` |
| `--bg-muted` | `oklch(0.948 0.014 70)` |

**Text:**
| Token | Value |
|---|---|
| `--text-primary` | `oklch(0.200 0.015 60)` |
| `--text-secondary` | `oklch(0.420 0.015 60)` |
| `--text-muted` | `oklch(0.560 0.012 60)` |
| `--text-on-accent` | `oklch(1.00 0.000 0)` |
| `--text-on-gold` | `oklch(0.220 0.020 70)` |

**Borders:**
| Token | Value |
|---|---|
| `--border-default` | `var(--text-primary)` |
| `--border-strong` | `var(--text-primary)` |
| `--border-subtle` | `oklch(0.820 0.015 70)` |

**Accent Colors:**
| Family | Base | Hover | Subtle | Text |
|---|---|---|---|---|
| Pink | `oklch(0.640 0.270 350)` | `oklch(0.580 0.280 350)` | `oklch(0.955 0.040 350)` | `oklch(0.560 0.270 350)` |
| Danger | `oklch(0.620 0.220 20)` | `oklch(0.570 0.230 20)` | `oklch(0.950 0.040 20)` | `oklch(0.550 0.220 20)` |
| Gold | `oklch(0.840 0.175 85)` | `oklch(0.820 0.165 84)` | `oklch(0.965 0.060 85)` | `oklch(0.440 0.130 85)` |
| Cyan | `oklch(0.650 0.148 210)` | `oklch(0.600 0.150 210)` | `oklch(0.945 0.030 210)` | `oklch(0.520 0.148 210)` |
| Green | `oklch(0.630 0.170 148)` | `oklch(0.580 0.165 148)` | `oklch(0.945 0.035 148)` | `oklch(0.480 0.165 148)` |

**Status:** `--status-info` = primary, `--status-error` = danger, `--status-warning` = gold, `--status-success` = green

**Utility:**
| Token | Value |
|---|---|
| `--focus-ring` | `var(--accent-primary)` |
| `--overlay-bg` | `oklch(0.200 0.015 60 / 0.30)` |

**Shadows (solid, no blur — neo-brutalist):**
| Token | Value |
|---|---|
| `--shadow-sm` | `2px 2px 0 var(--text-primary)` |
| `--shadow-md` | `4px 4px 0 var(--text-primary)` |
| `--shadow-lg` | `8px 8px 0 var(--text-primary)` |
| `--shadow-pink` | `4px 4px 0 var(--accent-primary)` |
| `--shadow-danger` | `4px 4px 0 var(--accent-danger)` |
| `--shadow-gold` | `4px 4px 0 var(--accent-gold)` |
| `--shadow-cyan` | `4px 4px 0 var(--accent-cyan)` |
| `--shadow-green` | `4px 4px 0 var(--accent-green)` |

### Dark Mode (`[data-theme="dark"]`)

**Backgrounds:**
| Token | Value |
|---|---|
| `--bg-page` | `oklch(0.140 0.014 65)` |
| `--bg-surface` | `oklch(0.165 0.015 65)` |
| `--bg-elevated` | `oklch(0.190 0.015 65)` |
| `--bg-subtle` | `oklch(0.210 0.015 65)` |
| `--bg-muted` | `oklch(0.180 0.013 65)` |

**Text:**
| Token | Value |
|---|---|
| `--text-primary` | `oklch(0.935 0.008 70)` |
| `--text-secondary` | `oklch(0.690 0.012 70)` |
| `--text-muted` | `oklch(0.540 0.010 70)` |
| `--text-on-accent` | `oklch(1.00 0.000 0)` |
| `--text-on-gold` | `oklch(0.140 0.014 65)` |

**Borders:**
| Token | Value |
|---|---|
| `--border-default` | `var(--text-primary)` |
| `--border-strong` | `var(--text-primary)` |
| `--border-subtle` | `oklch(0.330 0.015 65)` |

**Accent Colors (Dark):**
| Family | Base | Hover | Subtle | Text |
|---|---|---|---|---|
| Pink | `oklch(0.700 0.230 350)` | `oklch(0.740 0.220 350)` | `oklch(0.250 0.065 350)` | `oklch(0.750 0.210 350)` |
| Danger | `oklch(0.660 0.200 20)` | `oklch(0.700 0.190 20)` | `oklch(0.250 0.055 20)` | `oklch(0.720 0.180 20)` |
| Gold | `oklch(0.840 0.170 85)` | `oklch(0.870 0.155 84)` | `oklch(0.260 0.065 85)` | `oklch(0.870 0.155 85)` |
| Cyan | `oklch(0.720 0.140 210)` | `oklch(0.760 0.130 210)` | `oklch(0.250 0.045 210)` | `oklch(0.780 0.130 210)` |
| Green | `oklch(0.680 0.155 148)` | `oklch(0.720 0.145 148)` | `oklch(0.250 0.048 148)` | `oklch(0.740 0.145 148)` |

**Utility (Dark):**
| Token | Value |
|---|---|
| `--focus-ring` | `oklch(0.700 0.230 350)` |
| `--overlay-bg` | `oklch(0 0 0 / 0.60)` |

**Dark Shadows:** Cream `oklch(0.92 0.010 65)` instead of `var(--text-primary)` for sm/md/lg — warm inverted shadows for visible 3D on dark backgrounds. Color shadows (pink, danger, gold, cyan, green) still use their respective accent vars.

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

### UI Text Scale (fixed, non-fluid — for controls)

| Token | Value | Use |
|---|---|---|
| `--ui-text-2xs` | `0.6875rem` (11px) | Badges, table headers |
| `--ui-text-xs` | `0.75rem` (12px) | Captions, hints, form errors |
| `--ui-text-sm` | `0.8125rem` (13px) | Sidebar, breadcrumbs, small buttons |
| `--ui-text-md` | `0.875rem` (14px) | Inputs, selects, tabs |
| `--ui-text-lg` | `0.9375rem` (15px) | Medium buttons |
| `--ui-text-xl` | `1.0625rem` (17px) | Large buttons |

### Control Heights

| Token | Value | Use |
|---|---|---|
| `--control-sm` | `32px` | Small buttons, pagination |
| `--control-md` | `36px` | Inputs, selects |
| `--control-lg` | `44px` | Medium buttons, avatars |
| `--control-xl` | `56px` | Large buttons, large avatars |

### Spacing (4px base grid)
```css
--space-1: 4px;   --space-1-5: 6px; --space-2: 8px;
--space-3: 12px;  --space-4: 16px;  --space-5: 20px;
--space-6: 24px;  --space-8: 32px;  --space-10: 40px;
--space-12: 48px; --space-16: 64px; --space-20: 80px;
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

### Z-Index Scale

| Token | Value | Use |
|---|---|---|
| `--z-base` | `1` | Content layering |
| `--z-sticky` | `100` | Sticky nav, mobile menu |
| `--z-fixed` | `200` | Fixed topnav |
| `--z-overlay` | `300` | Scroll progress, overlays |
| `--z-modal` | `1000` | Modal dialogs |
| `--z-toast` | `1100` | Toast notifications |
| `--z-tooltip` | `1500` | Tooltips |

### Container Widths

| Token | Value | Use |
|---|---|---|
| `--container-sm` | `640px` | Narrow content (forms, settings) |
| `--container-md` | `960px` | Medium content (tables, lists) |
| `--container-lg` | `1200px` | Wide content (dashboards) |

### Button Tokens
```css
--btn-primary-bg: var(--accent-primary);
--btn-primary-text: var(--text-on-accent);
--btn-danger-bg: var(--accent-danger);
--btn-danger-text: var(--text-on-accent);
--btn-gold-bg: var(--accent-gold);
--btn-gold-text: var(--text-on-gold);
--btn-cyan-bg: var(--accent-cyan);
--btn-cyan-text: var(--text-on-accent);
--btn-green-bg: var(--accent-green);
--btn-green-text: var(--text-on-accent);
--btn-gap: var(--space-1-5);   /* 6px — icon + label spacing */
```

### Badge Tokens
```css
--badge-py: 2px;    /* vertical padding */
--badge-px: 10px;   /* horizontal padding */
```

### Toggle Tokens
```css
--toggle-off-bg: var(--primitive-neutral-300);
--toggle-on-bg: var(--accent-primary);
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
  @keyframes fadeOutRight {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-100%); }
    to { opacity: 1; transform: translateX(0); }
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
  gap: var(--btn-gap);
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

**Sizes:** `.btn-sm` (`--control-sm`, `--ui-text-sm`), `.btn-md` (`--control-lg`, `--ui-text-lg`), `.btn-lg` (`--control-xl`, `--ui-text-xl`)

**Variants:**
- `.btn-primary` — `background: var(--accent-primary); color: var(--text-on-accent); box-shadow: var(--shadow-pink);`
- `.btn-danger` — `background: var(--accent-danger); color: var(--text-on-accent); box-shadow: var(--shadow-danger);`
- `.btn-gold` — `background: var(--accent-gold); color: var(--text-on-gold); box-shadow: var(--shadow-gold);`
- `.btn-cyan` — `background: var(--accent-cyan); color: var(--text-on-accent); box-shadow: var(--shadow-cyan);`
- `.btn-green` — `background: var(--accent-green); color: var(--text-on-accent); box-shadow: var(--shadow-green);`
- `.btn-secondary` — `background: var(--bg-surface); border: 2px solid var(--border-default);`
- `.btn-ghost` — `background: transparent; color: var(--text-secondary);`

```html
<button class="btn btn-primary btn-md">Primary</button>
<button class="btn btn-danger btn-md">Danger</button>
<button class="btn btn-gold btn-md">Highlight</button>
<button class="btn btn-cyan btn-md">Cyan</button>
<button class="btn btn-green btn-md">Green</button>
<button class="btn btn-secondary btn-md">Secondary</button>
<button class="btn btn-ghost btn-md">Ghost</button>
```

### Input `.input`

```css
.input {
  width: 100%;
  height: var(--control-md);
  padding: 0 var(--space-3);
  font-family: var(--font-sans);
  font-size: var(--ui-text-md);
  color: var(--text-primary);
  background: var(--bg-surface);
  border: 2px solid var(--text-primary);
  border-radius: var(--radius-sm);
  box-shadow: 2px 2px 0 var(--text-primary);
  transition: border-color var(--motion-fast) var(--ease-out),
              box-shadow var(--motion-instant) linear;
}
.input:focus { outline: none; border-color: var(--accent-primary); box-shadow: 4px 4px 0 var(--accent-primary); }
.input-error { border-color: var(--accent-danger); }
.input-error:focus { box-shadow: 4px 4px 0 var(--accent-danger); }
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
.textarea:focus { outline: none; border-color: var(--accent-primary); box-shadow: 4px 4px 0 var(--accent-primary); }
```

### Select `.select`

```css
.select {
  appearance: none; width: 100%; height: var(--control-md);
  padding: 0 32px 0 var(--space-3);
  font-family: var(--font-sans); font-size: var(--ui-text-md);
  color: var(--text-primary); background: var(--bg-surface);
  border: 2px solid var(--text-primary); border-radius: var(--radius-sm);
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--text-primary);
}
.select:focus { outline: none; border-color: var(--accent-primary); box-shadow: 4px 4px 0 var(--accent-primary); }
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
  background: var(--accent-primary); border-color: var(--accent-primary);
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

**Variants:** `.card-featured` (pink top border), `.card-featured-red`, `.card-featured-gold`, `.card-featured-cyan`, `.card-featured-green`, `.card-compact` (smaller padding)

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
  padding: var(--badge-py) var(--badge-px); font-size: var(--ui-text-2xs); font-weight: 600;
  border-radius: var(--radius-full);
}
```

**Variants:**
- `.badge-pink` — `background: var(--accent-primary-subtle); color: var(--accent-primary-text);`
- `.badge-danger` — danger subtle/text
- `.badge-gold` — gold subtle/text
- `.badge-cyan` — cyan subtle/text
- `.badge-green` — green subtle/text

```html
<span class="badge badge-pink">Info</span>
<span class="badge badge-green">Success</span>
<span class="badge badge-gold">Warning</span>
<span class="badge badge-danger">Error</span>
<span class="badge badge-cyan">Tertiary</span>
```

### Alert `.alert`

```css
.alert {
  display: flex; align-items: flex-start; gap: var(--space-3);
  padding: var(--space-4); border: 2px solid var(--border-default);
  border-radius: var(--radius-md);
  font-size: 0.875rem; line-height: 1.5;
}
.alert-pink { background: var(--accent-primary-subtle); color: var(--accent-primary-text); border-color: var(--accent-primary); box-shadow: var(--shadow-pink); }
.alert-danger { background: var(--accent-danger-subtle); color: var(--accent-danger-text); border-color: var(--accent-danger); box-shadow: var(--shadow-danger); }
.alert-gold { background: var(--accent-gold-subtle); color: var(--accent-gold-text); border-color: var(--accent-gold); box-shadow: var(--shadow-gold); }
.alert-cyan { background: var(--accent-cyan-subtle); color: var(--accent-cyan-text); border-color: var(--accent-cyan); box-shadow: var(--shadow-cyan); }
.alert-green { background: var(--accent-green-subtle); color: var(--accent-green-text); border-color: var(--accent-green); box-shadow: var(--shadow-green); }
```

### Data Table `.data-table`

```css
.table-wrap {
  border: 2px solid var(--border-subtle);
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
.tab.active { color: var(--accent-primary-text); border-bottom-color: var(--accent-primary); font-weight: 600; }
```

### Sidebar `.sidebar-demo`

```css
.sidebar-demo {
  width: 240px; background: var(--bg-surface);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg); padding: var(--space-3);
}
.sidebar-item {
  display: flex; align-items: center; gap: var(--space-2);
  padding: var(--space-2) var(--space-3); border-radius: var(--radius-sm);
  font-size: 0.8125rem; color: var(--text-secondary); cursor: pointer;
}
.sidebar-item:hover { background: var(--bg-subtle); color: var(--text-primary); }
.sidebar-item.active { background: var(--accent-primary-subtle); color: var(--accent-primary-text); font-weight: 550; }
```

### Toast `.toast`

```css
.toast-container {
  position: fixed; bottom: var(--space-6); right: var(--space-6);
  display: flex; flex-direction: column-reverse; gap: var(--space-2);
  z-index: var(--z-toast); max-width: 380px; width: 100%;
}
.toast {
  display: flex; align-items: flex-start; gap: var(--space-3);
  padding: var(--space-4); background: var(--bg-surface);
  border: 2px solid var(--border-default); border-radius: var(--radius-md);
  box-shadow: var(--shadow-md); position: relative; overflow: hidden;
}
.toast-stripe {
  position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
}
.toast-stripe.success { background: var(--accent-green); }
.toast-stripe.error { background: var(--accent-danger); }
.toast-stripe.warning { background: var(--accent-gold); }
.toast-stripe.info { background: var(--accent-primary); }
```

### Modal `.modal-panel`

```css
.modal-panel {
  margin: auto; background: var(--bg-surface);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-lg); padding: var(--space-6);
  max-width: 440px; width: calc(100% - 32px);
  box-shadow: var(--shadow-lg); color: var(--text-primary);
}
.modal-panel::backdrop { background: var(--overlay-bg); }
```

Use `<dialog>` element with `.showModal()` / `.close()`.

> **SPA Note:** In React/Vue/Svelte, modals are often rendered via portals to avoid stacking context issues. The design system's token-based approach works identically with portals — apply the same `.modal-panel` styles to your portal-rendered element.

### Drawer `.drawer-panel`

```css
.drawer-panel {
  margin: 0; margin-top: auto; width: 100%;
  background: var(--bg-surface); border-top: 2px solid var(--border-default);
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

### Breadcrumbs `.breadcrumbs`

```css
.breadcrumbs {
  display: flex; align-items: center; gap: var(--space-2);
  font-size: var(--ui-text-sm);
}
.breadcrumbs a { color: var(--text-secondary); text-decoration: none; }
.breadcrumbs a:hover { color: var(--text-primary); }
.breadcrumbs .sep { color: var(--text-muted); }
.breadcrumbs .current { color: var(--text-primary); font-weight: 550; }
```

```html
<div class="breadcrumbs">
  <a href="#">Home</a><span class="sep">/</span>
  <a href="#">Settings</a><span class="sep">/</span>
  <span class="current">Profile</span>
</div>
```

### Pagination `.pagination`

```css
.pagination { display: flex; gap: var(--space-1); align-items: center; }
.page-btn {
  width: var(--control-sm); height: var(--control-sm);
  display: flex; align-items: center; justify-content: center;
  font-size: var(--ui-text-sm);
  border: 2px solid var(--border-default); border-radius: var(--radius-sm);
  background: var(--bg-surface); color: var(--text-secondary); cursor: pointer;
}
.page-btn:hover { background: var(--bg-subtle); border-color: var(--border-strong); }
.page-btn.active { background: var(--accent-primary); color: var(--text-on-accent); border-color: var(--accent-primary); }
```

### Progress Bar `.progress-track`

```css
.progress-group { margin-bottom: var(--space-4); }
.progress-label {
  display: flex; justify-content: space-between;
  font-size: var(--step--1); font-weight: 600; margin-bottom: var(--space-2);
}
.progress-track {
  height: 16px; background: var(--bg-muted);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-full); overflow: hidden;
}
.progress-fill {
  height: 100%; border-radius: var(--radius-full);
  transition: width var(--motion-base) var(--ease-out);
}
.progress-fill-pink { background: var(--accent-primary); }
.progress-fill-gold { background: var(--accent-gold); }
.progress-fill-cyan { background: var(--accent-cyan); }
.progress-fill-green { background: var(--accent-green); }
```

### Avatar `.avatar`

```css
.avatar {
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: var(--radius-full); border: 2px solid var(--border-default);
  overflow: hidden; background: var(--bg-subtle); color: var(--text-secondary);
  font-weight: 700; font-family: var(--font-sans);
  letter-spacing: var(--tracking-tight); flex-shrink: 0; user-select: none;
}
.avatar-sm { width: var(--control-sm); height: var(--control-sm); font-size: var(--ui-text-2xs); }
.avatar-md { width: var(--control-lg); height: var(--control-lg); font-size: var(--ui-text-md); }
.avatar-lg { width: var(--control-xl); height: var(--control-xl); font-size: var(--ui-text-lg); }
```

**Color variants:** `.avatar-pink`, `.avatar-gold`, `.avatar-cyan`, `.avatar-green` — use `accent-*-subtle` backgrounds with `accent-*-text` foregrounds.

**Avatar group:** `.avatar-group` stacks avatars with negative margin overlap.

```html
<div class="avatar-group">
  <div class="avatar avatar-md avatar-pink">KS</div>
  <div class="avatar avatar-md avatar-gold">JD</div>
  <div class="avatar avatar-md avatar-cyan">AR</div>
</div>
```

### Tooltip `.tooltip-wrap`

```css
.tooltip-wrap { position: relative; display: inline-block; }
.tooltip {
  position: absolute; bottom: calc(100% + var(--space-2)); left: 50%;
  transform: translateX(-50%);
  padding: var(--space-1) var(--space-2);
  background: var(--text-primary); color: var(--bg-surface);
  font-size: var(--ui-text-2xs); font-weight: 600;
  border-radius: var(--radius-sm); white-space: nowrap;
  pointer-events: none; opacity: 0;
  transition: opacity var(--motion-fast) var(--ease-out);
  z-index: var(--z-tooltip); box-shadow: var(--shadow-sm);
}
.tooltip-wrap:hover .tooltip,
.tooltip-wrap:focus-within .tooltip { opacity: 1; }
```

```html
<span class="tooltip-wrap">
  <button class="btn btn-sm btn-icon">?<span class="tooltip">Help</span></button>
</span>
```

### Empty State `.empty-state`

```css
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: var(--space-12) var(--space-6);
  text-align: center;
}
.empty-state-icon { font-size: var(--step-3); margin-bottom: var(--space-4); color: var(--text-muted); }
.empty-state-title {
  font-size: var(--step-1); font-weight: 700;
  letter-spacing: var(--tracking-tight); line-height: var(--leading-tight);
  color: var(--text-primary); margin-bottom: var(--space-2);
}
.empty-state-desc {
  font-size: var(--ui-text-md); color: var(--text-secondary);
  max-width: 360px; line-height: var(--leading-normal); margin-bottom: var(--space-6);
}
```

```html
<div class="empty-state">
  <div class="empty-state-icon">🔍</div>
  <div class="empty-state-title">No results found</div>
  <div class="empty-state-desc">Try adjusting your search or filter criteria.</div>
  <button class="btn btn-sm btn-primary">Clear filters</button>
</div>
```

---

## Responsive Patterns

The design system uses mobile-first responsive design with these breakpoints:

| Breakpoint | Value | Use |
|---|---|---|
| Extra small | `480px` | Compact phone layouts |
| Small | `600px` | Large phones, toast stacking |
| Tablet | `768px` | Tablet layouts, grid reflow |
| Desktop | `900px` | Desktop navigation |

**Container widths:** Use `--container-sm` (640px), `--container-md` (960px), `--container-lg` (1200px) for `max-width` constraints on content areas.

**Toast position:** The canonical placement is `bottom: var(--space-6); right: var(--space-6)` (bottom-right). For top-right placement, switch to `top: var(--space-6)` and change `flex-direction: column-reverse` to `flex-direction: column`.

**Table horizontal scroll:** Tables need `overflow-x: auto` on their wrapper for small screens.

**Responsive grid pattern:**
```css
.responsive-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
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
6. **Color is confident** — Pink for primary actions, red for danger, gold for highlight, cyan for tertiary, green for success
7. **Warm backgrounds** — `--bg-page` is warm cream, not pure white
8. **All colors via tokens** — No hardcoded hex/rgb/hsl in components
9. **All spacing via scale** — Only `var(--space-*)` values
10. **Reduced motion respected** — All animations behind `prefers-reduced-motion: no-preference`
11. **Focus visible on all interactive elements** — `outline: 2px solid var(--focus-ring); outline-offset: 2px;`
12. **Border radius from scale** — Only `var(--radius-*)` values
