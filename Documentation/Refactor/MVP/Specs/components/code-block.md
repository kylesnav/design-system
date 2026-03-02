---
title: "Code Block"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Code Block

> Dark-background code display with a warm syntax theme. Seven syntax token colors cover keywords (pink), strings (gold), function names (cyan), comments (muted neutral italic), numbers (green), operators (achromatic), and property names (light pink). Uses `--font-mono` and `white-space: pre` for exact character alignment. No line numbers or copy button in the reference implementation. The background color is a hardcoded OKLCH value independent of the page theme — it does not change between light and dark mode.

Cross-references: [[token-tiers]] (section 5.17 documents the 7 inline syntax colors — they are hardcoded OKLCH values, not CSS custom properties), [[shadows]] (`--shadow-md` for elevation), [[typography]] (`--font-mono`).

Visual reference: Section "05 — Components" CSS at lines ~3382–3405 in `design-reference.html`. The component is used for code display in the design system reference itself.

---

## 1. HTML Structure

### 1.1 Standard Code Block

```html
<pre class="code-block"><span class="keyword">const</span> <span class="function">greet</span> <span class="operator">=</span> (<span class="property">name</span>) <span class="operator">=></span> {
  <span class="keyword">return</span> <span class="string">`Hello, ${name}!`</span><span class="operator">;</span>
}<span class="operator">;</span>

<span class="comment">// Call the function</span>
<span class="function">greet</span>(<span class="string">"world"</span>)<span class="operator">;</span>
</pre>
```

### 1.2 CSS Property Code Block

```html
<pre class="code-block"><span class="property">--accent-primary</span><span class="operator">:</span> <span class="function">oklch</span>(<span class="number">0.640</span> <span class="number">0.270</span> <span class="number">350</span>)<span class="operator">;</span>
<span class="property">--shadow-md</span><span class="operator">:</span> <span class="number">4</span><span class="operator">px</span> <span class="number">4</span><span class="operator">px</span> <span class="number">0</span> <span class="keyword">var</span>(<span class="property">--border-default</span>)<span class="operator">;</span>
</pre>
```

---

## 2. CSS Classes

### 2.1 `.code-block` (container)

| Property | Value | Notes |
|---|---|---|
| `background` | `oklch(0.200 0.015 60)` | Hardcoded dark warm charcoal — does NOT change with theme |
| `border` | `2px solid var(--border-default)` | Standard border token |
| `border-radius` | `var(--radius-md)` | `16px` |
| `box-shadow` | `var(--shadow-md)` | `4px 4px 0 var(--border-default)` |
| `padding` | `var(--space-4) var(--space-5)` | `16px 20px` |
| `font-family` | `var(--font-mono)` | `'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace` |
| `font-size` | `0.8125rem` | `13px` — hardcoded, not a token |
| `line-height` | `1.7` | Hardcoded |
| `overflow-x` | `auto` | Horizontal scrolling for long lines |
| `white-space` | `pre` | Preserves all whitespace and newlines |
| `color` | `oklch(0.920 0.010 70)` | Default foreground — warm near-white |

### 2.2 Syntax Span Classes

These classes are nested inside `.code-block`. All values are hardcoded OKLCH — they are **not** CSS custom properties in the reference.

| Class | Color | Role | Notes |
|---|---|---|---|
| `.keyword` | `oklch(0.750 0.200 350)` | Keywords (`const`, `return`, `var`) | Pink family |
| `.string` | `oklch(0.870 0.160 85)` | String literals, template literals | Gold family |
| `.function` | `oklch(0.750 0.130 210)` | Function names, call expressions | Cyan family |
| `.comment` | `oklch(0.550 0.010 60)` | Comments | Muted neutral; additionally `font-style: italic` |
| `.number` | `oklch(0.800 0.140 148)` | Numeric literals | Green family |
| `.operator` | `oklch(0.700 0.000 0)` | Operators (`=`, `=>`, `:`, `;`) | Achromatic (no chroma) |
| `.property` | `oklch(0.780 0.100 350)` | Property names, CSS custom properties | Light pink (lower chroma than `.keyword`) |

---

## 3. Variants

There is one variant defined in the reference:

### 3.1 Base (the only variant)

All code blocks share the same dark background and syntax theme. No light-mode variant, no alternate themes, no line-number variant, and no copy button in the reference. Those are enhancement opportunities outside the current spec scope.

---

## 4. States

The `.code-block` is a static display element with no interactive states in the reference:

- No hover state
- No focus state (non-interactive)
- Horizontal scrolling via `overflow-x: auto` is the only dynamic behavior (browser-native)

---

## 5. Responsive Behavior

The `.code-block` is a block-level element that fills its container width. `overflow-x: auto` provides horizontal scrolling for lines that exceed container width. No breakpoint-specific rules are defined in the reference.

---

## 6. Accessibility

- Wrap `.code-block` in `<pre>` to preserve whitespace semantics.
- When the code block contains a language-specific example, annotate with `<code>` inside `<pre>`: `<pre class="code-block"><code>...</code></pre>`.
- Screen readers will read the raw text content — syntax spans do not add semantic meaning, only visual color.
- Ensure color is not the sole means of conveying syntax meaning (comment italics are a good secondary cue already present).
- Provide a visible language label adjacent to the block when the language is not self-evident.
- The dark background (`oklch(0.200 0.015 60)`) with the default foreground (`oklch(0.920 0.010 70)`) provides approximately 9:1 contrast ratio — WCAG AAA compliant.
- Individual syntax colors against the dark background:
  - `.keyword` (pink, 0.750 L): ~5.5:1 — AA
  - `.string` (gold, 0.870 L): ~8.5:1 — AAA
  - `.function` (cyan, 0.750 L): ~5.5:1 — AA
  - `.comment` (muted, 0.550 L): ~2.5:1 — below AA at normal size; comments are supplemental, but consider increasing to 0.600+
  - `.number` (green, 0.800 L): ~7:1 — AAA
  - `.operator` (achromatic, 0.700 L): ~4.5:1 — AA
  - `.property` (light pink, 0.780 L): ~6.5:1 — AAA

---

## 7. Token Dependencies

### Tier 2 (Semantic)

- `--border-default` (border color)
- `--shadow-md` (box shadow)

### Tier 3 (Component)

- `--radius-md` (`16px`) — border radius
- `--space-4` (`16px`) — vertical padding
- `--space-5` (`20px`) — horizontal padding
- `--font-mono` — font family

### Inline (not tokenized as custom properties)

These 9 color values are hardcoded inside `.code-block` CSS in the reference. They are intentional design decisions; if the build pipeline requires them as tokens, promote to `--code-*` custom properties in the component layer:

| Suggested Token Name | Value | Role |
|---|---|---|
| `--code-bg` | `oklch(0.200 0.015 60)` | Background |
| `--code-fg` | `oklch(0.920 0.010 70)` | Default foreground |
| `--code-keyword` | `oklch(0.750 0.200 350)` | Keywords |
| `--code-string` | `oklch(0.870 0.160 85)` | Strings |
| `--code-function` | `oklch(0.750 0.130 210)` | Functions |
| `--code-comment` | `oklch(0.550 0.010 60)` | Comments |
| `--code-number` | `oklch(0.800 0.140 148)` | Numbers |
| `--code-operator` | `oklch(0.700 0.000 0)` | Operators |
| `--code-property` | `oklch(0.780 0.100 350)` | Properties |

---

## 8. Test Specification

### 8.1 Computed Style Assertions

- `.code-block` has `background-color` resolving to `oklch(0.200 0.015 60)`
- `.code-block` has `font-family` matching `--font-mono` resolved value
- `.code-block` has `font-size` resolving to `13px` (`0.8125rem`)
- `.code-block` has `line-height: 1.7`
- `.code-block` has `white-space: pre`
- `.code-block` has `overflow-x: auto`
- `.code-block` has `color` resolving to `oklch(0.920 0.010 70)`
- `.code-block` has `border-radius` resolving to `16px`
- `.code-block .keyword` has `color` resolving to `oklch(0.750 0.200 350)`
- `.code-block .string` has `color` resolving to `oklch(0.870 0.160 85)`
- `.code-block .function` has `color` resolving to `oklch(0.750 0.130 210)`
- `.code-block .comment` has `color` resolving to `oklch(0.550 0.010 60)` AND `font-style: italic`
- `.code-block .number` has `color` resolving to `oklch(0.800 0.140 148)`
- `.code-block .operator` has `color` resolving to `oklch(0.700 0.000 0)`
- `.code-block .property` has `color` resolving to `oklch(0.780 0.100 350)`

### 8.2 Visual Regression Scenarios

- Code block with all 7 syntax token classes represented (light mode)
- Code block with all 7 syntax token classes represented (dark mode) — background does NOT change
- Long-line code block verifying horizontal scroll handles overflow
- Code block inside a constrained-width container

### 8.3 Theme Invariance

- Toggle page theme between light and dark — `.code-block` background must remain `oklch(0.200 0.015 60)` in both states. The `--border-default` border color will adapt, and `--shadow-md` will adapt, but the code background itself must not.

---

## 9. Implementation CSS

```css
@layer component {
  .code-block {
    background: oklch(0.200 0.015 60);
    border: 2px solid var(--border-default);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    padding: var(--space-4) var(--space-5);
    font-family: var(--font-mono);
    font-size: 0.8125rem;
    line-height: 1.7;
    overflow-x: auto;
    white-space: pre;
    color: oklch(0.920 0.010 70);
  }

  .code-block .keyword  { color: oklch(0.750 0.200 350); }
  .code-block .string   { color: oklch(0.870 0.160 85); }
  .code-block .function { color: oklch(0.750 0.130 210); }
  .code-block .comment  { color: oklch(0.550 0.010 60); font-style: italic; }
  .code-block .number   { color: oklch(0.800 0.140 148); }
  .code-block .operator { color: oklch(0.700 0.000 0); }
  .code-block .property { color: oklch(0.780 0.100 350); }
}
```
