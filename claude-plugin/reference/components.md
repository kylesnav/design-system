# Delightful Design System — Components

20+ component patterns with full CSS and HTML examples. All components use tokens from `tokens.md` and interaction patterns from `interactions.md`.

---

## Button `.btn`

```css
.btn {
  display: inline-flex; align-items: center; justify-content: center;
  gap: var(--btn-gap); font-family: var(--font-sans); font-weight: 700;
  border: 2px solid var(--text-primary); cursor: pointer;
  border-radius: var(--radius-md); white-space: nowrap;
  transition: transform var(--motion-instant) linear, background var(--motion-fast) var(--ease-out),
              box-shadow var(--motion-instant) linear;
  box-shadow: var(--shadow-sm);
}
.btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
.btn:active { transform: translate(2px, 2px); box-shadow: 0 0 0 var(--text-primary); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; pointer-events: none; transform: none !important; box-shadow: var(--shadow-sm) !important; }
```

**Sizes:** `.btn-sm` (`--control-sm`, `--ui-text-sm`), `.btn-md` (`--control-md`, `--ui-text-md`), `.btn-lg` (`--control-lg`, `--ui-text-lg`)

**Variants** (all inherit base `.btn` shadow-sm -> shadow-md press behavior):
- `.btn-primary` — `background: var(--btn-primary-bg); color: var(--btn-primary-text);`
- `.btn-danger` — `background: var(--btn-danger-bg); color: var(--btn-danger-text);`
- `.btn-gold` — `background: var(--btn-gold-bg); color: var(--btn-gold-text);`
- `.btn-cyan` — `background: var(--btn-cyan-bg); color: var(--btn-cyan-text);`
- `.btn-green` — `background: var(--btn-green-bg); color: var(--btn-green-text);`
- `.btn-purple` — `background: var(--btn-purple-bg); color: var(--btn-purple-text);`
- `.btn-secondary` — `background: var(--bg-surface); color: var(--text-primary);`
- `.btn-ghost` — `background: transparent; border-color: transparent; box-shadow: none;` (hover adds `shadow-sm`)

**When to use each variant:**

| Variant | Use for |
|---------|---------|
| `.btn-primary` | Primary page action, CTAs, form submission |
| `.btn-danger` | Destructive actions: delete, remove, revoke |
| `.btn-gold` | Highlights, upgrades, featured/premium actions |
| `.btn-cyan` | Data operations, technical actions, info-dense contexts |
| `.btn-green` | Confirmations, save, success-path actions |
| `.btn-purple` | Creative actions, AI features, experimental/beta |
| `.btn-secondary` | Secondary actions alongside a primary, cancel in dialogs |
| `.btn-ghost` | Tertiary actions, inline actions, toolbar buttons |

```html
<button class="btn btn-primary btn-md">Primary</button>
<button class="btn btn-danger btn-md">Danger</button>
<button class="btn btn-gold btn-md">Highlight</button>
```

---

## Input `.input`

```css
.input {
  width: 100%; height: var(--control-md); padding: 0 var(--space-3);
  font-family: var(--font-sans); font-size: var(--ui-text-md);
  color: var(--text-primary); background: var(--bg-surface);
  border: 2px solid var(--text-primary); border-radius: var(--radius-sm);
  box-shadow: 2px 2px 0 var(--text-primary);
  transition: border-color var(--motion-fast) var(--ease-out), box-shadow var(--motion-instant) linear;
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

---

## Textarea `.textarea`

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

---

## Select `.select`

```css
.select {
  appearance: none; width: 100%; height: var(--control-md);
  padding: 0 32px 0 var(--space-3);
  font-family: var(--font-sans); font-size: var(--ui-text-md);
  color: var(--text-primary); background: var(--bg-surface);
  border: 2px solid var(--text-primary); border-radius: var(--radius-sm);
  cursor: pointer; box-shadow: 2px 2px 0 var(--text-primary);
}
.select:focus { outline: none; border-color: var(--accent-primary); box-shadow: 4px 4px 0 var(--accent-primary); }
```

---

## Checkbox & Radio

```css
.check-box, .radio-circle {
  width: 18px; height: 18px; border: 1.5px solid var(--border-strong);
  background: var(--bg-surface); display: flex; align-items: center; justify-content: center;
}
.check-box { border-radius: 4px; }
.radio-circle { border-radius: 50%; }
.check-box.checked, .radio-circle.checked {
  background: var(--accent-primary); border-color: var(--accent-primary);
}
```

---

## Toggle

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

---

## Card `.card`

```css
.card {
  background: var(--bg-surface); border: 2px solid var(--text-primary);
  border-radius: var(--radius-md); padding: var(--space-6);
  box-shadow: var(--shadow-md);
  /* Static container — no hover/active. Use .card-interactive for pounce/sink. */
}
```

**Variants:** `.card-featured` (pink top border), `.card-featured-red`, `.card-featured-gold`, `.card-featured-cyan`, `.card-featured-green`, `.card-featured-purple`, `.card-compact` (smaller padding)

**When to use each variant:**

| Variant | Use for |
|---------|---------|
| `.card` (no variant) | Static content display, informational cards |
| `.card-featured` (pink) | Primary/highlighted content, main call-to-action card |
| `.card-featured-red` | Warning-related content, error summaries |
| `.card-featured-gold` | Premium features, upgrade prompts, important announcements |
| `.card-featured-cyan` | Technical content, data summaries, API documentation |
| `.card-featured-green` | Success states, completed items, positive metrics |
| `.card-featured-purple` | Creative/AI features, experimental content |
| `.card-compact` | Dense information, list items within cards, sidebar content |

```html
<div class="card card-featured">
  <div class="card-title">Card Title</div>
  <div class="card-desc">Description text goes here.</div>
  <div class="card-meta">Metadata</div>
</div>
```

---

## Badge `.badge`

```css
.badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: var(--badge-py) var(--badge-px); font-size: var(--ui-text-2xs); font-weight: 600;
  border-radius: var(--radius-full);
}
```

**Variants:** `.badge-pink`, `.badge-danger`, `.badge-gold`, `.badge-cyan`, `.badge-green`, `.badge-purple` — each uses `accent-*-subtle` background with `accent-*-text` foreground.

**When to use each variant:**

| Variant | Use for |
|---------|---------|
| `.badge-pink` | Default status, informational labels |
| `.badge-danger` | Error state, critical, breaking |
| `.badge-gold` | Warning, attention needed, featured |
| `.badge-cyan` | Technical, data-related, version tags |
| `.badge-green` | Success, active, approved, stable |
| `.badge-purple` | New, experimental, beta, AI-powered |

```html
<span class="badge badge-pink">Info</span>
<span class="badge badge-green">Success</span>
<span class="badge badge-danger">Error</span>
```

---

## Alert `.alert`

```css
.alert {
  display: flex; align-items: flex-start; gap: var(--space-3);
  padding: var(--space-4); border: 2px solid var(--border-default);
  border-radius: var(--radius-md); font-size: 0.875rem; line-height: 1.5;
}
.alert-pink { background: var(--accent-primary-subtle); color: var(--accent-primary-text); border-color: var(--accent-primary); box-shadow: var(--shadow-pink); }
.alert-danger { background: var(--accent-danger-subtle); color: var(--accent-danger-text); border-color: var(--accent-danger); box-shadow: var(--shadow-danger); }
.alert-gold { background: var(--accent-gold-subtle); color: var(--accent-gold-text); border-color: var(--accent-gold); box-shadow: var(--shadow-gold); }
.alert-cyan { background: var(--accent-cyan-subtle); color: var(--accent-cyan-text); border-color: var(--accent-cyan); box-shadow: var(--shadow-cyan); }
.alert-green { background: var(--accent-green-subtle); color: var(--accent-green-text); border-color: var(--accent-green); box-shadow: var(--shadow-green); }
.alert-purple { background: var(--accent-purple-subtle); color: var(--accent-purple-text); border-color: var(--accent-purple); box-shadow: var(--shadow-purple); }
```

**When to use each variant:**

| Variant | Use for |
|---------|---------|
| `.alert-pink` | General informational messages, system announcements |
| `.alert-danger` | Error messages, failed operations, breaking changes |
| `.alert-gold` | Warnings, deprecation notices, caution messages |
| `.alert-cyan` | Technical information, API changes, developer notes |
| `.alert-green` | Success confirmations, completed operations |
| `.alert-purple` | New feature announcements, experimental/beta notices |

---

## Data Table `.data-table`

```css
.table-wrap { border: 2px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.8125rem; }
.data-table th {
  text-align: left; padding: var(--space-3) var(--space-4);
  font-weight: 600; font-size: 0.6875rem; letter-spacing: 0.04em;
  text-transform: uppercase; color: var(--text-muted);
  background: var(--bg-subtle); border-bottom: 1px solid var(--border-subtle);
}
.data-table td { padding: var(--space-3) var(--space-4); border-bottom: 1px solid var(--border-subtle); }
.data-table tbody tr:hover { background: var(--bg-subtle); transform: scale(1.01) translateY(-1px); box-shadow: var(--shadow-sm); }
```

---

## Tabs `.tabs`

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

---

## Sidebar `.sidebar-demo`

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

---

## Toast `.toast`

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
.toast-stripe { position: absolute; left: 0; top: 0; bottom: 0; width: 3px; }
.toast-stripe.success { background: var(--accent-green); }
.toast-stripe.error { background: var(--accent-danger); }
.toast-stripe.warning { background: var(--accent-gold); }
.toast-stripe.info { background: var(--accent-primary); }
```

---

## Modal `.modal-panel`

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

> **SPA Note:** In React/Vue/Svelte, modals are often rendered via portals. The design system's token-based approach works identically with portals — apply the same `.modal-panel` styles to your portal-rendered element.

---

## Drawer `.drawer-panel`

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

---

## Skeleton Loading

```css
.skel { background: var(--bg-muted); border-radius: var(--radius-sm); }
.skel-shimmer {
  background: linear-gradient(110deg, var(--bg-muted) 30%, var(--bg-subtle) 50%, var(--bg-muted) 70%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite; /* wrap in reduced-motion check */
}
.skel-pulse {
  animation: skel-pulse 1.5s ease-in-out infinite;
  transform-origin: center left; /* wrap in reduced-motion check */
}
```

**Variants:**
```css
.skel-circle { border-radius: 50%; width: 40px; height: 40px; }
.skel-text { height: 1em; border-radius: var(--radius-sm); }
.skel-heading { height: 1.5em; width: 60%; border-radius: var(--radius-sm); }
.skel-card {
  border: 2px solid var(--border-subtle); border-radius: var(--radius-lg);
  padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3);
}
.skel-avatar-sm { border-radius: 50%; width: var(--control-sm); height: var(--control-sm); }
.skel-avatar-lg { border-radius: 50%; width: var(--control-xl); height: var(--control-xl); }
```

---

## Breadcrumbs `.breadcrumbs`

```css
.breadcrumbs { display: flex; align-items: center; gap: var(--space-2); font-size: var(--ui-text-sm); }
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

---

## Pagination `.pagination`

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

---

## Progress Bar `.progress-track`

```css
.progress-track {
  height: 16px; background: var(--bg-muted);
  border: 2px solid var(--border-default);
  border-radius: var(--radius-full); overflow: hidden;
}
.progress-fill { height: 100%; border-radius: var(--radius-full); transition: width var(--motion-base) var(--ease-out); }
.progress-fill-pink { background: var(--accent-primary); }
.progress-fill-gold { background: var(--accent-gold); }
.progress-fill-cyan { background: var(--accent-cyan); }
.progress-fill-green { background: var(--accent-green); }
.progress-fill-purple { background: var(--accent-purple); }
```

---

## Avatar `.avatar`

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

**Color variants:** `.avatar-pink`, `.avatar-gold`, `.avatar-cyan`, `.avatar-green`, `.avatar-purple` — use `accent-*-subtle` backgrounds with `accent-*-text` foregrounds.

**Avatar group:** `.avatar-group` stacks avatars with negative margin overlap.

```html
<div class="avatar-group">
  <div class="avatar avatar-md avatar-pink">KS</div>
  <div class="avatar avatar-md avatar-gold">JD</div>
  <div class="avatar avatar-md avatar-cyan">AR</div>
</div>
```

---

## Tooltip `.tooltip-wrap`

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

---

## Empty State `.empty-state`

```css
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: var(--space-12) var(--space-6); text-align: center;
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

---

## Button Loading `.btn-loading`

```css
@keyframes spin { to { transform: rotate(360deg); } }

.btn-loading { pointer-events: none; position: relative; color: transparent !important; }
.btn-loading::after {
  content: ""; position: absolute; inset: 0; margin: auto;
  width: 18px; height: 18px;
  border: 2px solid var(--text-on-accent); border-right-color: transparent;
  border-radius: 50%; animation: spin 0.6s linear infinite;
}
.btn-secondary.btn-loading::after,
.btn-ghost.btn-loading::after { border-color: var(--text-primary); border-right-color: transparent; }
.btn-gold.btn-loading::after { border-color: var(--text-on-gold); border-right-color: transparent; }
```

---

## Accordion `.accordion-item`

Uses native `<details>` / `<summary>` elements for zero-JS expand/collapse.

```css
.accordion-item { border: 2px solid var(--border-default); border-radius: var(--radius-md); overflow: hidden; }
.accordion-item + .accordion-item { margin-top: -2px; border-top-left-radius: 0; border-top-right-radius: 0; }
.accordion-item:has(+ .accordion-item) { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
.accordion-trigger {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding: var(--space-4) var(--space-5);
  font-weight: 600; font-size: var(--ui-text-md);
  cursor: pointer; background: var(--bg-surface);
  list-style: none; font-family: var(--font-sans);
}
.accordion-trigger::after {
  content: "+"; font-size: 1.25rem; font-weight: 400; color: var(--text-muted);
  transition: transform var(--motion-fast) var(--ease-out);
}
.accordion-item[open] .accordion-trigger::after { transform: rotate(45deg); }
.accordion-content { padding: 0 var(--space-5) var(--space-5); font-size: var(--ui-text-md); color: var(--text-secondary); line-height: var(--leading-relaxed); }
```

```html
<details class="accordion-item" open>
  <summary class="accordion-trigger">Question one?</summary>
  <div class="accordion-content">Answer to question one.</div>
</details>
```

---

## Slider Group `.slider-group`

```css
input[type="range"] {
  appearance: none; width: 100%; height: 4px;
  border-radius: var(--radius-full); background: var(--border-default); outline: none;
}
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 18px; height: 18px;
  border-radius: 50%; background: var(--accent-primary);
  cursor: pointer; border: 2px solid var(--bg-surface);
}
.slider-group { display: flex; flex-direction: column; gap: var(--space-2); }
.slider-header { display: flex; align-items: baseline; justify-content: space-between; }
.slider-value { font-size: var(--ui-text-sm); font-weight: 600; font-variant-numeric: tabular-nums; color: var(--accent-primary-text); }
```

---

## Bento Grid `.bento-grid`

```css
.bento-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(120px, auto); gap: var(--space-4);
  container-type: inline-size;
}
.bento-span-2 { grid-column: span 2; }
.bento-span-3 { grid-column: span 3; }
.bento-tall { grid-row: span 2; }
.bento-wide { grid-column: span 2; grid-row: span 2; }

@container (max-width: 780px) {
  .bento-grid { grid-template-columns: repeat(2, 1fr); }
  .bento-span-3 { grid-column: span 2; }
}
@container (max-width: 480px) {
  .bento-grid { grid-template-columns: 1fr; }
  .bento-span-2, .bento-span-3, .bento-wide { grid-column: span 1; }
  .bento-tall { grid-row: span 1; }
}
```

---

## Skip Navigation `.skip-link`

```css
.skip-link {
  position: absolute; top: -100%; left: var(--space-4);
  padding: var(--space-2) var(--space-4);
  background: var(--accent-primary); color: var(--text-on-accent);
  font-weight: 600; font-size: var(--ui-text-md);
  border-radius: var(--radius-sm); z-index: var(--z-toast);
  text-decoration: none; transition: top var(--motion-fast) var(--ease-out);
}
.skip-link:focus { top: var(--space-4); }
```

```html
<a href="#main-content" class="skip-link">Skip to content</a>
```
