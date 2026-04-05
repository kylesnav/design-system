---
name: present-with-delightful
description: >-
  This skill should be used when the user wants to build a scrolling HTML page
  styled with the Delightful design system. Common triggers include "build a page",
  "create an HTML document", "make a report", "showcase", "scrolling page",
  or any request to generate a single-page scrolling document with neo-brutalist
  styling, theme toggle, and scroll-reveal animations.
allowed-tools: "Bash WebFetch"
metadata:
  author: Delightful Design System
  version: 0.8.0
  tags: [design-system, css, neo-brutalist, oklch, scrolling-page, html-document]
---

# Present with Delightful

Generate self-contained scrolling HTML pages using the Delightful design system.

## Instructions

### Step 1 — Read the Showcase Template

Search for the showcase template using Glob: `**/delightful-showcase*.html` (search parent directories above the plugin root).

- **If found:** Read the entire file. Treat its `<style>` block as the canonical CSS — all 5 `@layer` declarations (~1375 lines). **Copy verbatim — never abbreviate, summarize, or rewrite.**
- **If not found:** Use `${CLAUDE_PLUGIN_ROOT}/themes/css/delightful-tokens.css` combined with the reference files to build CSS from the component patterns documented in this skill.

The showcase is a **three-zone template**: CSS | HTML | JS.

### Step 2 — Read the Plugin References

Read these files from the plugin directory:

- `${CLAUDE_PLUGIN_ROOT}/reference/tokens.md` — All token values (colors, spacing, typography, motion)
- `${CLAUDE_PLUGIN_ROOT}/reference/components.md` — Component patterns with full CSS and HTML
- `${CLAUDE_PLUGIN_ROOT}/reference/interactions.md` — POUNCE/SINK press patterns, animation keyframes
- `${CLAUDE_PLUGIN_ROOT}/reference/philosophy.md` — Design principles for content tone
- `${CLAUDE_PLUGIN_ROOT}/reference/composition.md` — Layout composition and section assembly

### Step 3 — Plan the Page Structure

Based on the user's topic, plan the structure and **present it for approval before generating**:

1. **Page title**
2. **Hero content:** eyebrow text, gradient title word, description paragraph, 3-6 stat cards
3. **3-8 scrolling sections**, each with: anchor ID, section-label, section-title, section-subtitle, content block types
4. **Nav links** (must match section anchor IDs)
5. **Footer tagline and stats line**

### Step 4 — Generate the HTML File

Build a single self-contained `.html` file with three zones:

- **CSS zone:** Full `<style>` from the showcase, copied verbatim. All 5 `@layer`s. Non-negotiable.
- **HTML zone:** Nav (brand + anchor links + theme toggle) -> Hero (orb field + eyebrow + gradient title + description + stat cards) -> Sections (composed from component vocabulary) -> Footer (tagline + gradient brand + stats).
- **JS zone:** Theme toggle (T key + button click, toggles `.theme-dark` on `<html>`) + IntersectionObserver for `.reveal` class scroll animation. Copy from showcase, extend only for interactive components.

### Step 5 — Verify

Launch the `delightful-auditor` agent to check the generated file:

- Zero hardcoded colors outside token definitions
- All spacing uses tokens
- Dark mode works (semantic tokens used correctly)
- `prefers-reduced-motion` is respected

## Page Structure

Every page follows this skeleton. Use these exact class names.

```html
<!-- Nav -->
<nav class="site-nav">
  <div class="nav-brand">Brand</div>
  <div class="nav-links">
    <a href="#section-id" class="nav-link">Section</a>
    <!-- repeat for each section -->
  </div>
  <button class="theme-toggle" aria-label="Toggle theme">
    <svg class="theme-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
    <svg class="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </button>
</nav>

<!-- Hero -->
<section class="hero">
  <div class="orb-field">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
  </div>
  <p class="hero-eyebrow">EYEBROW TEXT</p>
  <h1 class="hero-title">Title <span class="gradient-word">Word</span></h1>
  <p class="hero-description">Description paragraph.</p>
  <div class="hero-stats">
    <div class="stat-card">
      <div class="stat-value" style="color: var(--primary)">42</div>
      <div class="stat-label">Label</div>
    </div>
    <!-- 3-6 stat cards -->
  </div>
</section>

<!-- Sections (repeat 3-8) -->
<section id="section-id" class="content-section">
  <div class="section-header reveal">
    <span class="section-label">01</span>
    <h2 class="section-title">Title</h2>
    <p class="section-subtitle">Subtitle</p>
  </div>
  <div class="section-content">
    <!-- composed from component vocabulary -->
  </div>
  <div class="divider"></div>
</section>

<!-- Footer -->
<footer class="site-footer">
  <p class="footer-tagline">Tagline</p>
  <p class="footer-brand gradient-word">Brand</p>
  <p class="footer-stats">Stats line</p>
</footer>
```

## Component Vocabulary

Use these exact HTML patterns when composing section content. Every content block must include the `reveal` class.

### stat-card

Used in `hero-stats` flex row. Color the value with a semantic token.

```html
<div class="stat-card">
  <div class="stat-value" style="color: var(--primary)">204</div>
  <div class="stat-label">Design Tokens</div>
</div>
```

### gallery-card

Universal content container. Place in an auto-fit grid.

```html
<div class="gallery-grid reveal">
  <div class="gallery-card">
    <h3 class="gallery-card-title">Card Title</h3>
    <p class="gallery-card-description">Description text for this card.</p>
  </div>
  <!-- repeat -->
</div>
```

### color-panel / color-viz

Side-by-side comparison with before/after badges.

```html
<div class="color-viz reveal">
  <div class="color-panel">
    <span class="badge badge-old">Before</span>
    <div class="color-sample" style="background: var(--surface-2)"></div>
    <p>Description of the old approach.</p>
  </div>
  <div class="color-panel">
    <span class="badge badge-new">After</span>
    <div class="color-sample" style="background: var(--primary)"></div>
    <p>Description of the new approach.</p>
  </div>
</div>
```

### token-tier / token-flow

Three-stage pipeline with flow arrows showing token architecture.

```html
<div class="token-flow reveal">
  <div class="token-tier">
    <h4>Primitives</h4>
    <p>Raw OKLCH values</p>
  </div>
  <span class="flow-arrow">&rarr;</span>
  <div class="token-tier">
    <h4>Semantic</h4>
    <p>Purpose-mapped aliases</p>
  </div>
  <span class="flow-arrow">&rarr;</span>
  <div class="token-tier">
    <h4>Component</h4>
    <p>Scoped to UI elements</p>
  </div>
</div>
```

### badge

Pill badges in a `badge-row`. Five color variants: primary, gold, cyan, green, purple.

```html
<div class="badge-row reveal">
  <span class="badge badge-primary">Core</span>
  <span class="badge badge-gold">Highlight</span>
  <span class="badge badge-cyan">Technical</span>
  <span class="badge badge-green">Success</span>
  <span class="badge badge-purple">Creative</span>
</div>
```

### btn

Six color variants plus secondary and ghost. Place in a `btn-row`.

```html
<div class="btn-row reveal">
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-gold">Gold</button>
  <button class="btn btn-cyan">Cyan</button>
  <button class="btn btn-green">Green</button>
  <button class="btn btn-purple">Purple</button>
  <button class="btn btn-danger">Danger</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-ghost">Ghost</button>
</div>
```

### input

Form control with label.

```html
<div class="input-group reveal">
  <label class="input-label">Label</label>
  <input class="input" type="text" placeholder="Placeholder text">
</div>
```

### toggle

Switch control.

```html
<div class="toggle-group reveal">
  <label class="toggle-label">Feature Toggle</label>
  <button class="toggle" role="switch" aria-checked="false" onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked')==='false')">
    <span class="toggle-thumb"></span>
  </button>
</div>
```

### toast

Status messages. Variants: success, warning, error.

```html
<div class="toast toast-success reveal">Migration completed successfully.</div>
<div class="toast toast-warning reveal">Token override detected.</div>
<div class="toast toast-error reveal">Build failed: missing dependency.</div>
```

### platform-card

Icon grid with colored hover. Place in a `platform-grid`.

```html
<div class="platform-grid reveal">
  <div class="platform-card" style="--card-accent: var(--primary)">
    <div class="platform-icon">VS</div>
    <div class="platform-name">VS Code</div>
  </div>
  <div class="platform-card" style="--card-accent: var(--cyan)">
    <div class="platform-icon">GH</div>
    <div class="platform-name">Ghostty</div>
  </div>
  <!-- repeat -->
</div>
```

### motion-card

Demonstrates animation patterns.

```html
<div class="motion-card reveal">
  <div class="motion-preview">
    <div class="motion-dot"></div>
  </div>
  <h4>POUNCE / SINK</h4>
  <p>Hover lifts -2px, press sinks +2px with shadow shift.</p>
</div>
```

### code-block

With syntax token classes for key, value, and comment highlighting.

```html
<div class="code-block reveal">
  <span class="token-key">--primary</span>: <span class="token-val">oklch(72% 0.25 350)</span>; <span class="token-comment">/* Vibrant pink */</span>
  <span class="token-key">--gold</span>: <span class="token-val">oklch(82% 0.18 85)</span>; <span class="token-comment">/* Warm gold */</span>
  <span class="token-key">--cyan</span>: <span class="token-val">oklch(78% 0.15 210)</span>; <span class="token-comment">/* Cool cyan */</span>
</div>
```

### shadow-demo-card

Demonstrates the layered shadow system. Place in a `shadow-grid`.

```html
<div class="shadow-grid reveal">
  <div class="shadow-demo-card shadow-sm">
    <h4>Small</h4>
    <p>Resting state</p>
  </div>
  <div class="shadow-demo-card shadow-md">
    <h4>Medium</h4>
    <p>Hover / lifted</p>
  </div>
  <div class="shadow-demo-card shadow-lg">
    <h4>Large</h4>
    <p>Elevated / modal</p>
  </div>
</div>
```

### swatch-picker

Color swatch display.

```html
<div class="swatch-picker reveal">
  <div class="swatch" style="background: var(--primary)"></div>
  <div class="swatch" style="background: var(--gold)"></div>
  <div class="swatch" style="background: var(--cyan)"></div>
  <div class="swatch" style="background: var(--green)"></div>
  <div class="swatch" style="background: var(--purple)"></div>
  <div class="swatch" style="background: var(--danger)"></div>
</div>
```

### kbd

Keyboard hint displayed inline.

```html
<p>Press <kbd>T</kbd> to toggle theme or <kbd>Esc</kbd> to close.</p>
```

### divider

Placed between every section.

```html
<div class="divider"></div>
```

### Subsection heading

Use h3 with inline token-derived styles to break up density within sections.

```html
<h3 class="subsection-title reveal">Subsection Title</h3>
```

## Behavioral Rules

### POUNCE / SINK

Interactive elements follow this press pattern:
- **Hover:** `translateY(-2px)` + `shadow-md` (fast, 125ms)
- **Active:** `translate(2px, 2px)` + shadow removed (instant, 80ms)
- **Rest:** `shadow-sm` (slow 450ms return with spring easing)

### Scroll Reveal

Every content block gets the `reveal` class. An IntersectionObserver adds the `revealed` class when the element enters the viewport, triggering:
```css
.reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s var(--ease-spring-gentle), transform 0.6s var(--ease-spring-gentle); }
.revealed { opacity: 1; transform: translateY(0); }
```

### Theme Toggle

- **T** key and button click both toggle `.theme-dark` class on `<html>`
- All colors use semantic tokens, so theming is automatic
- Sun/moon icons swap visibility based on theme state

### Color Semantics

| Color | Token | Use for |
|-------|-------|---------|
| Pink | `--primary` | Core action, brand identity |
| Gold | `--gold` | Highlight, attention, welcome |
| Cyan | `--cyan` | Technical, data, information |
| Green | `--green` | Success, positive outcomes |
| Purple | `--purple` | Creative, vision, future |
| Red | `--danger` | Warning, error, problems |

## Composition Guidelines

- Sections expand naturally with content — no fixed heights
- Mix component types within a section for visual variety
- Every content block gets the `reveal` class
- Use subsection `h3` headings to break up density within sections
- Place a `divider` element between every section
- Nav links must match section `id` attributes exactly
- Stat cards summarize key data at a glance (3-6 in hero)
- Gradient text (`gradient-word` class) only for **one brand word** in the hero title
- Use `data-accent` attribute on sections to color-shift components within that section

## Anti-Patterns

| Anti-Pattern | Why it breaks | Do instead |
|---|---|---|
| Slide/deck layout with JS engine | Wrong format entirely | Scrolling sections with natural page flow |
| Inventing CSS class names | Unstyled, broken output | Compose from existing classes + inline styles for one-offs |
| Abbreviating or truncating the CSS | Missing styles, broken components | Copy full `<style>` verbatim — all 5 `@layer`s |
| Hardcoded OKLCH values in HTML | Dark mode breaks | Use `var(--token)` references only |
| Skipping orb field in hero | Loses ambient depth | Always include 3 orbs |
| Sections without label/title/subtitle header | Inconsistent structure | Every section gets the full header pattern |
| Using `[data-theme]` for dark mode | Doesn't match showcase implementation | Use `.theme-dark` class on `<html>` |
| Skipping `reveal` on content blocks | No scroll animations | Add `reveal` to every content block |

## Examples

### Example 1: Product Report

User says: "Build a page summarizing our Q1 launch"

Plan:
- **Hero:** eyebrow "Q1 2026", gradient word "Launch", stat cards for revenue / users / NPS / markets
- **Sections:**
  - Market Context — gallery-cards for competitive landscape
  - Key Features — code-blocks with badge labels
  - Metrics Dashboard — stat-cards in grid with colored values
  - Roadmap — token-flow pipeline showing phases

Result: Scrolling page with hero stats, content sections, scroll-reveal animations, and theme toggle.

### Example 2: Portfolio Audit

User says: "Create an HTML document auditing our design system"

Plan:
- **Hero:** eyebrow "DESIGN AUDIT", gradient word "Delightful", stat cards for token count / components / coverage / platforms
- **Sections:**
  - Color System — color-panels with before/after comparisons
  - Typography — code-blocks showing type scale tokens
  - Components — gallery-cards with component examples
  - Recommendations — badges categorizing priorities + toast warnings for critical issues

Result: Comprehensive audit document with visual token and component analysis.

### Example 3: Technical Architecture

User says: "Make a report on our microservices"

Plan:
- **Hero:** eyebrow "ARCHITECTURE", gradient word "Platform", stat cards for services / uptime / latency / deployments
- **Sections:**
  - Overview — token-flow pipeline showing request lifecycle
  - Services — platform-cards grid with service icons
  - Performance — stat-cards with color-coded metrics
  - Infrastructure — code-blocks showing configuration examples

Result: Technical document with pipeline visualizations and structured service data.

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Unstyled output | CSS truncated or missing layers | Copy full `<style>` — all 5 `@layer`s, no abbreviation |
| No scroll animations | Missing `reveal` class | Add `reveal` to every content block and section header |
| Dark mode broken | Hardcoded OKLCH values in HTML | Use only `var(--*)` token references |
| Theme toggle no-op | JS missing or wrong selector | Toggle `.theme-dark` on `document.documentElement` |
| Nav links don't scroll | ID mismatch between nav and sections | Ensure `<a href="#x">` matches `<section id="x">` |
| Components unstyled | Invented class names not in CSS | Use only classes from the component vocabulary above |
| Orbs invisible | Missing CSS for `.orb` in presentation layer | Ensure orb styles present in the copied CSS |
| Layout not responsive | Missing media queries | CSS from showcase includes responsive breakpoints |

## Verification Checklist

- [ ] `<style>` contains all 5 `@layer` declarations
- [ ] Hero has orb field, eyebrow, gradient title, description, stat cards
- [ ] Every section has section-label, section-title, section-subtitle header
- [ ] Nav links match section IDs
- [ ] Theme toggle switches light / dark
- [ ] All content blocks have `reveal` class
- [ ] No hardcoded color values in HTML (only in CSS token definitions)
- [ ] `prefers-reduced-motion` media query present
- [ ] Footer has tagline, gradient brand, stats line
- [ ] Divider between every section
