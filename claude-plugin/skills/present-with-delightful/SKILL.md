---
name: present-with-delightful
description: >-
  This skill should be used when the user wants to create a presentation styled with
  the Delightful design system. Common triggers include "make a presentation",
  "create a slide deck", "build slides", "present with delightful", "deck with delightful",
  "slide deck", "showcase", "keynote-style presentation", or any request to generate
  a navigable slide-based presentation with sidebar navigation, search, keyboard
  controls, theme toggle, and neo-brutalist styling.
allowed-tools: "Bash WebFetch"
metadata:
  author: Delightful Design System
  version: 0.7.0
  tags: [design-system, css, neo-brutalist, oklch, slides, presentation, deck, showcase]
---

# Present with Delightful

Generate self-contained slide deck presentations using the Delightful design system engine.

## Instructions

### Step 1 — Read the Deck Template

Read the deck template at `${CLAUDE_PLUGIN_ROOT}/templates/delightful-deck-template.html`.

- Read the entire file. This is the engine — CSS, HTML chrome, and JS navigation. **Copy verbatim — never abbreviate, summarize, or rewrite.**

**Important:** Do NOT modify the bundled template files in `${CLAUDE_PLUGIN_ROOT}/templates/`. Always generate a new file.

The template has four zones: CSS | HTML Chrome | Slide Data (empty) | JS Engine.

### Step 2 — Read the Plugin References

Read these files from the plugin directory:

- `${CLAUDE_PLUGIN_ROOT}/reference/tokens.md` — All token values (colors, spacing, typography, motion)
- `${CLAUDE_PLUGIN_ROOT}/reference/components.md` — Component patterns with full CSS and HTML
- `${CLAUDE_PLUGIN_ROOT}/reference/interactions.md` — POUNCE/SINK press patterns, animation keyframes
- `${CLAUDE_PLUGIN_ROOT}/reference/philosophy.md` — Design principles for content tone
- `${CLAUDE_PLUGIN_ROOT}/reference/composition.md` — Layout composition and section assembly

### Step 3 — Plan the Deck Structure

Based on the user's topic, plan the structure and **present it for approval before generating**:

1. **Deck title and subtitle** (shown in sidebar and title slide)
2. **Section groups** (chapters) — each with id (roman numeral), title, accent color
3. **Sections within each group** — each with id, title, and group mapping
4. **Slides per section** — for each:
   - Section intro slide (auto-generated via `sectionIntro()`)
   - Content slides with: headline, subtitle, content type, optional footnote
5. **Closing slide** content
6. **Total slide count** (target 10–50 slides)

### Step 4 — Generate the HTML File

Build a single self-contained `.html` file by populating the template:

- **CSS zone:** Copy verbatim from the deck template. All 4 `@layer`s. Non-negotiable.
- **HTML chrome:** Copy from the template. Update the sidebar `<h1>` brand and `.sidebar-subtitle` to match the deck title. Update `<title>`.
- **Slide Data zone:** Populate the four data structures:
  - `SECTION_GROUPS` — array of chapter definitions
  - `SECTIONS` — array of section definitions within chapters
  - `S` — title slide using `makeSlide()` with custom `render()` and `animate()`
  - `R` — section intros + content slides + closing slide
  - `INTERACTIVE_RENDERS` — custom render/animate functions for complex slides
- **JS Engine zone:** Copy verbatim from the template. Do not modify.

### Step 5 — Verify

Launch the `delightful-auditor` agent to check the generated file:

- Zero hardcoded colors in render functions (only `var(--*)` references)
- All spacing in render functions uses tokens
- Dark mode works (semantic tokens used correctly)
- `prefers-reduced-motion` is respected
- All ID linkages are consistent (R.sectionId → SECTIONS.id, R.g → SECTION_GROUPS.id)

## Slide Data Format

Every deck is driven by four data structures. The JS engine reads these and handles all rendering, navigation, and state.

### SECTION_GROUPS

Chapters of the presentation. Each gets a sidebar group and accent color.

```javascript
const SECTION_GROUPS=[
  {id:'I', title:'Introduction', color:'gold'},
  {id:'II', title:'Architecture', color:'primary'},
  {id:'III', title:'Results', color:'cyan'},
];
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Roman numeral or `'0'` for welcome. Must be unique. |
| `title` | string | Chapter name shown in sidebar |
| `color` | string | Accent: `'primary'`\|`'gold'`\|`'cyan'`\|`'green'`\|`'purple'`\|`'danger'` |

### SECTIONS

Individual sections within each chapter. Each gets a sidebar nav item.

```javascript
const SECTIONS=[
  {id:'01', title:'Problem Statement', groupId:'I', color:'gold'},
  {id:'02', title:'System Design', groupId:'II', color:'primary'},
  {id:'03', title:'Performance', groupId:'III', color:'cyan'},
];
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Two-digit string (00–99). Must be unique. |
| `title` | string | Section name shown in sidebar |
| `groupId` | string | Must match a `SECTION_GROUPS.id` |
| `color` | string | Accent color for this section |

### S Array (Title Slide)

The first slide in the deck. Uses `makeSlide()` with full property names.

```javascript
const S=[
makeSlide({
  id:'title',
  sectionId:null,
  sectionIndex:0,
  sectionSlideCount:1,
  groupId:null,
  accentColor:'gold',
  title:'My Presentation',
  slideTitle:'A Subtitle',
  searchText:'presentation keywords',
  headline:'', sub:'',
  render(c){
    c.innerHTML=`<div class="title-hero">
      <div class="title-decoration"></div>
      <div class="title-decoration"></div>
      <div class="title-decoration"></div>
      <div class="title-name">My Presentation</div>
      <div class="title-tagline">A compelling subtitle</div>
      <div class="title-mono">Key Point \u00B7 Key Point \u00B7 Key Point</div>
      <div class="title-date">Stat \u00B7 Stat \u00B7 Stat</div>
      <div class="title-hint">\u2192 or <kbd>j</kbd> to begin \u2022 <kbd>n</kbd> table of contents \u2022 <kbd>?</kbd> shortcuts</div>
    </div>`;
  },
  animate(el){
    el.querySelectorAll('.title-name,.title-tagline,.title-mono,.title-date,.title-hint')
      .forEach((e,i)=>{
        e.style.opacity='0';
        e.style.transform='translateY(30px)';
        setTimeout(()=>{
          e.style.transition='opacity 0.6s var(--ease-spring-gentle), transform 0.6s var(--ease-spring-gentle)';
          e.style.opacity='1';
          e.style.transform='none';
        },300+i*180);
      });
  }
}),
];
```

**Important:** The S array uses **full property names** (`sectionIndex`, `accentColor`, `groupId`, etc.) because `makeSlide()` processes these directly. The R array uses **abbreviated names** (`si`, `a`, `g`, etc.) because the engine maps them.

### R Array (Content Slides)

All slides after the title. Uses abbreviated property names.

#### R entry format

```javascript
{
  id: 's{sectionId}-{index}',  // e.g. 's01-0', 's01-1'
  sectionId: '01',              // matches SECTIONS.id (null for intros/closing)
  si: 0,                        // index within section (0-based)
  sc: 2,                        // total slides in this section
  g: 'I',                       // matches SECTION_GROUPS.id
  a: 'primary',                 // accent color
  t: 'Section Title',           // for nav and search
  st: 'Slide Title',            // for search
  s: 'search keywords',         // space-separated
  h: 'Headline <span class="accent">emphasis</span>',
  sub: 'Subtitle text.',
  foot: 'Optional footnote with <span class="accent">accent</span>.'
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique slide ID |
| `sectionId` | string\|null | Yes | Links to SECTIONS.id, or null for intros/closing |
| `si` | number | Yes | Index within section (0-based) |
| `sc` | number | Yes | Total slides in this section |
| `g` | string | Yes | Group ID from SECTION_GROUPS |
| `a` | string | Yes | Accent color name |
| `t` | string | Yes | Title for nav/search |
| `st` | string | Yes | Subtitle for search |
| `s` | string | Yes | Space-separated search keywords |
| `h` | string | Yes | Headline HTML (use `<span class="accent">` for emphasis) |
| `sub` | string | Yes | Subtitle text |
| `foot` | string | No | Footnote text (optional) |
| `render` | function | No | Custom render function (see below) |
| `animate` | function | No | Custom animation function (see below) |

#### Section intro slide

Every group must have one. Uses `sectionIntro()` helper.

```javascript
{id:'intro-I', sectionId:null, si:0, sc:1, g:'I', a:'primary',
 t:'Introduction', st:'Chapter', s:'introduction overview',
 h:'', sub:'',
 render(c){ c.innerHTML=sectionIntro('I','Introduction','3 sections \u2022 Overview, Context, Goals'); }},
```

#### Simple text slide (no render function)

If you omit `render`, the engine auto-generates a slide with headline, subtitle, and footnote. Best for straightforward informational slides.

```javascript
{id:'s01-0', sectionId:'01', si:0, sc:1, g:'I', a:'gold',
 t:'Problem Statement', st:'The Challenge',
 s:'problem challenge context',
 h:'Every year, <span class="accent">30% of developer time</span> is lost.',
 sub:'Manual processes account for the majority of wasted cycles.',
 foot:'Source: <span class="accent">2025 Developer Survey</span>'},
```

#### Closing slide

Always the last entry in R. Uses the `title-hero` structure.

```javascript
{id:'closing', sectionId:null, si:0, sc:1, g:null, a:'gold',
 t:'End', st:'Thank You', s:'end closing thank you finish'},
```

The engine generates a default closing render for any slide with `id:'closing'`. Customize by adding your own `render()`.

### INTERACTIVE_RENDERS

Custom render/animate functions for slides needing interactive or complex content.

```javascript
const INTERACTIVE_RENDERS={
  's02-0': {
    render(c, r, gl){
      c.innerHTML=`${gl?`<div class="slide-section-badge">${gl}</div>`:''}
        ${r.h?`<h2 class="slide-headline">${r.h}</h2>`:''}
        <p class="slide-subtitle">${r.sub||''}</p>
        <div class="slide-body" id="sb-${r.id}"></div>
        ${r.foot?`<div class="slide-footnote">${r.foot}</div>`:''}`;
      const b=c.querySelector('#sb-'+r.id);
      b.innerHTML=`<div class="counter-grid cols-3">...</div>`;
    },
    animate(el){
      animC(el); // Animate counter values
    }
  },
};
```

**Render parameters:**
- `c` (Element): The `.slide-inner` container. Set `c.innerHTML` or manipulate DOM.
- `r` (Object): The raw R array entry (abbreviated fields: `r.id`, `r.h`, `r.sub`, `r.g`, etc.)
- `gl` (string): Pre-formatted group label like `"I — Introduction"` or empty string.

**Animate parameters:**
- `el` (Element): The `.slide` container (parent of `.slide-inner`). Called once when slide becomes active, after a 100ms delay.

## Slide Content Vocabulary

These CSS classes are available in the presentation layer for use in custom `render()` functions.

### Flip Cards

3D card flip with front/back reveal. Click to flip.

```javascript
render(c, r, gl){
  c.innerHTML=`...
    <div class="slide-body">
      <div class="flip-grid grid-3">
        <div class="flip-card" onclick="this.classList.toggle('flipped')">
          <div class="flip-inner">
            <div class="flip-front">
              <div class="flip-icon">🎨</div>
              <h3>Card Title</h3>
              <p class="caption">Short description.</p>
            </div>
            <div class="flip-back">
              <p>Detailed explanation on the back.</p>
              <div class="data-point">Key metric or data</div>
            </div>
          </div>
        </div>
        <!-- repeat -->
      </div>
      <div class="flip-hint">Click cards to flip</div>
    </div>`;
}
```

### Accordion / Expand Cards

Expandable/collapsible cards. Click header to toggle.

```javascript
b.innerHTML=`<div class="expand-stack">
  <div class="expand-card" onclick="this.classList.toggle('open')">
    <div class="expand-header">
      <span class="expand-badge tier1">Tier 1</span>
      <span class="expand-title">Section Title</span>
      <span class="expand-chevron">▼</span>
    </div>
    <div class="expand-body"><div class="expand-body-inner">
      Details revealed when expanded.
    </div></div>
  </div>
  <!-- repeat -->
</div>`;
```

Badge variants: `tier1` (gold), `tier2` (cyan), `tier3` (primary), `critical` (danger), `high` (gold), `medium` (cyan), `low` (green).

### Animated Counters

Numbers that count up on slide entry. Engine calls `animC()` automatically if you call it in `animate`.

```javascript
render(c, r, gl){
  // ... standard slide wrapper ...
  b.innerHTML=`<div class="counter-grid cols-3">
    <div class="counter-item">
      <div class="counter-value" data-target="204" data-suffix="" data-duration="2000">0</div>
      <div class="counter-label">Design Tokens</div>
    </div>
    <!-- repeat -->
  </div>`;
},
animate(el){ animC(el); }
```

Grid column helpers: `cols-2`, `cols-3`, `cols-4`.

Counter attributes: `data-target` (number), `data-suffix` (e.g. "%"), `data-prefix` (e.g. "$"), `data-duration` (ms).

### Comparison Columns

Side-by-side pro/con or before/after.

```javascript
b.innerHTML=`<div class="comparison">
  <div class="comp-col">
    <div class="comp-header positive">Strengths</div>
    <div class="comp-body">
      <div class="comp-item">Fast iteration cycles</div>
      <div class="comp-item">Consistent token system</div>
    </div>
  </div>
  <div class="comp-col">
    <div class="comp-header negative">Challenges</div>
    <div class="comp-body">
      <div class="comp-item">Migration effort required</div>
      <div class="comp-item">Learning curve for OKLCH</div>
    </div>
  </div>
</div>`;
```

Header variants: `positive` (green), `negative` (red).

### Callout

Highlighted information box with accent border.

```javascript
b.innerHTML=`<div class="callout">
  <div class="callout-label">Key Insight</div>
  <div class="callout-text">Important information that deserves visual prominence.</div>
</div>`;
```

### Quote Card

Testimonial or blockquote.

```javascript
b.innerHTML=`<div class="quote-card">
  <div class="quote-mark">\u201C</div>
  <div class="quote-text">A compelling quote that supports the slide's point.</div>
</div>`;
```

### Pipeline / Silo Row

Flow visualization with arrows between stages.

```javascript
b.innerHTML=`<div class="silo-row">
  <div class="silo-box"><h4>Input</h4></div>
  <div class="silo-gap">\u2192</div>
  <div class="silo-box"><h4>Process</h4></div>
  <div class="silo-gap">\u2192</div>
  <div class="silo-box"><h4>Output</h4></div>
</div>`;
```

### Data Table

Structured data display.

```javascript
b.innerHTML=`<table class="matrix">
  <thead><tr><th>Metric</th><th>Value</th><th>Target</th></tr></thead>
  <tbody>
    <tr><td>Latency</td><td>42ms</td><td>&lt;50ms</td></tr>
    <tr><td>Uptime</td><td>99.97%</td><td>99.9%</td></tr>
  </tbody>
</table>`;
```

### Data Bars

Animated horizontal bar chart. Engine adds `.in` class on slide activation.

```javascript
b.innerHTML=`<div style="display:flex;flex-direction:column;gap:var(--space-3)">
  <div style="font-size:var(--step--1);color:var(--text-secondary)">Revenue by Region</div>
  <div class="data-bar" style="--value:85%;--i:0">North America 85%</div>
  <div class="data-bar" style="--value:62%;--i:1">Europe 62%</div>
  <div class="data-bar" style="--value:45%;--i:2">Asia Pacific 45%</div>
</div>`;
```

### Badge

Inline label/tag. Inherits accent from `[data-accent]`.

```javascript
b.innerHTML=`<span class="badge">Label</span>`;
```

### Layout Grids

Column helpers for arranging content.

```javascript
b.innerHTML=`<div class="grid-3">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>`;
```

Variants: `grid-2` (2 equal columns), `grid-3` (3 equal columns), `grid-2-1` (2:1 ratio).

### Stagger Animation

Container class that staggers children on slide entry. Engine adds `.in` class.

```javascript
b.innerHTML=`<div class="stagger">
  <div style="--i:0">First item</div>
  <div style="--i:1">Second item (100ms delay)</div>
  <div style="--i:2">Third item (200ms delay)</div>
</div>`;
```

### Draw Line

Animated horizontal divider. Engine adds `.in` class.

```javascript
b.innerHTML=`<div class="draw-line"></div>`;
```

### Accent Text

Use `<span class="accent">` in headlines, subtitles, and footnotes for accent-colored emphasis.

```html
<h2 class="slide-headline">Total revenue: <span class="accent">$4.2M</span></h2>
```

## Behavioral Rules

### Navigation

The engine provides these controls automatically — no additional code needed:
- **Arrow keys / j/k / Space** — next/prev slide
- **N key** — toggle sidebar table of contents
- **T key** — toggle light/dark theme
- **Cmd+K** — open search
- **? key** — show keyboard shortcuts
- **Click zones** — left 12% / right 12% of viewport
- **Touch swipe** — left/right (50px threshold)
- **Nav dots** — bottom center, click to jump

### POUNCE / SINK

Interactive slide components follow the press pattern automatically via CSS:
- **Hover:** `translateY(-2px)` or `translate(-4px,-4px)` + shadow escalation
- **Active:** `translate(2px, 2px)` + shadow collapse
- **Rest:** slow return (450ms) with spring easing

Applies to: flip cards, expand cards, counter items, callouts, quote cards, silo boxes.

### Stagger System

1. Add `class="stagger"` to a container in your render function
2. Set `style="--i:N"` on each child (N = 0, 1, 2, ...)
3. Engine adds `.in` class 100ms after slide becomes active
4. Each child fades in with N * 100ms delay

### Counter Animation

1. Add `data-target="N"` to `.counter-value` elements
2. Call `animC(el)` in your `animate()` function
3. Engine counts from 0 to N with cubic ease-out over `data-duration` ms
4. Completion triggers celebration sparkle effect

### Slide Lifecycle

1. Engine calls `render(containerElement)` — build DOM content
2. Slide gets `.active` class — CSS transition fades it in
3. After 100ms: `.stagger` gets `.in`, `.draw-line` gets `.in`, `.data-bar` gets `.in`
4. `animate(slideElement)` fires once (tracked, never re-fires)
5. When navigating away: `.active` removed, exit transition plays
6. Engine evicts slides >1 position away from DOM for performance

### Color Semantics

| Color | Token | Use for |
|-------|-------|---------|
| Pink | `primary` | Core action, brand identity |
| Gold | `gold` | Highlight, attention, welcome |
| Cyan | `cyan` | Technical, data, information |
| Green | `green` | Success, positive outcomes |
| Purple | `purple` | Creative, vision, future |
| Red | `danger` | Warning, error, problems |

## Composition Guidelines

- Target 10–50 slides — nav dots overflow past ~60
- Every group needs a section intro slide using `sectionIntro()`
- Simple slides (just h/sub/foot) don't need a render function — the engine auto-renders
- Use custom `render()` only for interactive content (flip cards, counters, data bars, etc.)
- Put custom renders in `INTERACTIVE_RENDERS` map, not inline in R entries
- Mix content types across slides for visual variety
- Use `<span class="accent">` for one key phrase per headline
- Footnotes ground data with sources or key rules
- All inline styles in render functions must use `var(--token)` references
- Set `--i` CSS custom property on stagger children for sequential delays

## Anti-Patterns

| Anti-Pattern | Why it breaks | Do instead |
|---|---|---|
| Scrolling page layout | Wrong format — this skill generates slides | Slide-based layout with R array entries |
| Inventing CSS class names | Unstyled, broken output | Use only classes from the presentation CSS layer |
| Abbreviating or truncating the CSS | Missing styles, broken components | Copy full CSS from template verbatim |
| Hardcoded OKLCH values in render functions | Dark mode breaks | Use `var(--token)` references only |
| Missing section intro slides | Navigation confusion, lost visual rhythm | Every group must have one using `sectionIntro()` |
| Mismatched IDs | Sidebar nav broken, search broken | R.sectionId must match SECTIONS.id, R.g must match SECTION_GROUPS.id |
| Using `[data-theme]` for dark mode | Doesn't match implementation | Engine uses `.theme-dark` class on `<html>` |
| >60 slides | Nav dots overflow, performance degrades | Keep decks to 10–50 slides |
| Modifying the engine code | Breaks navigation, search, state management | Engine is read-only — customize through data arrays only |
| Inline render functions in R entries | Hard to read, difficult to maintain | Use INTERACTIVE_RENDERS map for complex slides |
| Skipping `si`/`sc` fields | Slide pip counter breaks in sidebar | Always set section index and section slide count |

## Examples

### Example 1: Technical Architecture Deck

User says: "Create a slide deck presenting our microservices architecture"

Plan:
- **Title:** "Platform Architecture" / "Microservices Overview"
- **Groups:** I. Service Layer (cyan), II. Data Layer (gold), III. Deployment (green)
- **Sections:** 01. Service Catalog (I), 02. Request Flow (I), 03. Database Topology (II), 04. Caching (II), 05. CI/CD Pipeline (III), 06. Monitoring (III)
- **Slides:**
  - Title slide (counter-grid: service count, uptime, latency)
  - intro-I → s01-0: flip cards per service → s02-0: silo-row request flow
  - intro-II → s03-0: matrix table → s04-0: comparison (with/without cache)
  - intro-III → s05-0: silo-row CI/CD → s06-0: data-bars for metrics
  - Closing slide
- **Total:** 13 slides

### Example 2: Quarterly Business Review

User says: "Build a QBR slide deck"

Plan:
- **Title:** "Q1 2026 Review" / "Business Performance"
- **Groups:** 0. Executive Summary (gold), I. Revenue (green), II. Product (primary), III. Roadmap (purple)
- **Sections:** 00. KPIs (0), 01. Revenue by Segment (I), 02. Growth (I), 03. Features Shipped (II), 04. User Metrics (II), 05. Next Quarter (III)
- **Slides:**
  - Title slide → s00-0: counter-grid KPIs
  - intro-I → s01-0: data-bars revenue → s02-0: comparison YoY
  - intro-II → s03-0: expand-stack features → s04-0: counter-grid users
  - intro-III → s05-0: silo-row timeline
  - Closing slide
- **Total:** 14 slides

### Example 3: Design System Walkthrough

User says: "Create slides walking through our component library"

Plan:
- **Title:** "Delightful" / "Component Library Tour"
- **Groups:** I. Foundations (gold), II. Inputs (green), III. Display (cyan), IV. Navigation (purple)
- **Slides:** Title → intro per group → flip cards for components within each → counter-grid totals → Closing
- **Total:** 18 slides

## Troubleshooting

| Problem | Cause | Solution |
|---------|-------|----------|
| Empty deck, no slides | Data arrays are empty | Populate SECTION_GROUPS, SECTIONS, S, and R arrays |
| Sidebar nav missing entries | SECTIONS array incomplete or groupId mismatch | Ensure every section links to a valid SECTION_GROUPS entry |
| Slide shows raw text instead of styled content | Custom render not registered | Add entry to INTERACTIVE_RENDERS with matching slide ID |
| Counters don't animate | Missing `animC(el)` call | Add `animate(el){ animC(el); }` to the INTERACTIVE_RENDERS entry |
| Accent color wrong on slide | `a` field mismatch | Ensure R entry `a` matches the group's color |
| Search returns no results | Missing `s` (searchText) field | Add space-separated keywords to every R entry |
| Navigation dots overflow | Too many slides (>60) | Reduce slide count or combine sections |
| Dark mode colors wrong | Hardcoded OKLCH in render | Replace with `var(--token)` references |
| Slide content overflows viewport | Too much content on one slide | Split into multiple slides or use expand-stack |
| Theme toggle doesn't work | Engine JS modified or missing | Copy engine code verbatim — don't modify |

## Verification Checklist

- [ ] CSS contains all 4 `@layer` declarations (reset + semantic, component, presentation, utilities)
- [ ] HTML chrome includes: particles, journey bar, TOC button, theme toggle, nav dots, sidebar, deck viewport, search overlay, shortcuts overlay
- [ ] `SECTION_GROUPS` array has entries for every group referenced in R
- [ ] `SECTIONS` array has entries for every section referenced in R
- [ ] Every R entry has all required fields: `id`, `sectionId`, `si`, `sc`, `g`, `a`, `t`, `st`, `s`, `h`, `sub`
- [ ] Every group has a section intro slide using `sectionIntro()`
- [ ] Title slide exists as first entry in S array via `makeSlide()`
- [ ] Closing slide exists as last entry in R array with `id:'closing'`
- [ ] No hardcoded color values in render functions (only `var(--*)` token references)
- [ ] `prefers-reduced-motion` media query present in CSS
- [ ] Sidebar brand `<h1>` and `.sidebar-subtitle` match deck title
- [ ] All `sectionId` values in R map to valid `SECTIONS.id` entries
- [ ] All `g` (groupId) values in R map to valid `SECTION_GROUPS.id` entries
- [ ] Counter elements use `data-target` attribute (not hardcoded textContent)
