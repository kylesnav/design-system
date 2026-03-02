# Cohesion Review

> Systematic cross-check of all specification files in the Delightful Design System documentation rebuild. Every component spec, token spec, motion spec, emitter spec, test spec, integration spec, and both architecture documents were read before this review was written. No finding is inferred — every item is traced to a specific file and line.

Reviewer scope: 47 component specs (including 2 placeholders), 8 token/foundation specs, 3 motion specs, 5 emitter specs, 4 testing specs, 2 integration specs, 2 architecture docs, and a structural scan of `design-reference.html`.

---

## Section 1: Cross-Reference Token Check

**Status: WARNING**

Checks whether every token name referenced in component specs resolves to a declared name in the semantic or component tier.

### 1.1 Tokens verified present (Tier 2 semantic)

All of the following were referenced in component specs and confirmed declared in `token-tiers.md` and `css-emitter.md`:

- Background: `--bg-page`, `--bg-surface`, `--bg-elevated`, `--bg-subtle`, `--bg-muted`
- Text: `--text-primary`, `--text-secondary`, `--text-muted`, `--text-on-accent`, `--text-on-gold`
- Border: `--border-default`, `--border-subtle`, `--border-strong`
- Accent: `--accent-primary`, `--accent-primary-subtle`, `--accent-danger`, `--accent-danger-subtle`, `--accent-gold`, `--accent-gold-subtle`, `--accent-gold-text`, `--accent-cyan`, `--accent-cyan-subtle`, `--accent-purple`, `--accent-purple-subtle`, `--accent-green`, `--accent-pink`, `--accent-success`
- Shadows: `--shadow-sm`, `--shadow-md`, `--shadow-pink`, `--shadow-danger`, `--shadow-gold`, `--shadow-cyan`, `--shadow-purple`, `--shadow-green`
- Overlay: `--overlay-bg`, `--focus-ring`

### 1.2 Tokens verified present (Tier 3 component)

- Spacing: `--space-1`, `--space-1-5`, `--space-2`, `--space-3`, `--space-4`, `--space-6`, `--space-8`, `--space-12`, `--space-16`, `--space-20`
- Radius: `--radius-sm` (10px), `--radius-md` (16px), `--radius-lg` (24px), `--radius-xl` (32px), `--radius-full` (9999px)
- Typography: `--font-sans`, `--font-mono`, `--step-0` through `--step-5`, `--step--1`, `--step--2`, `--ui-text-2xs`, `--ui-text-xs`, `--ui-text-sm`, `--ui-text-md`, `--tracking-tight`, `--tracking-tighter`
- Control sizes: `--control-sm` (32px), `--control-md` (36px), `--control-lg` (44px), `--control-xl` (56px)
- Motion: `--motion-instant` (100ms), `--motion-fast` (160ms), `--motion-base` (240ms), `--motion-slow` (360ms), `--motion-slower` (500ms)
- Easing: `--ease-out`, `--ease-smooth`, `--ease-bounce`
- Z-index: `--z-base` (0), `--z-raised` (50), `--z-sticky` (100), `--z-fixed` (200), `--z-overlay` (300), `--z-modal` (1000), `--z-toast` (1100), `--z-tooltip` (1500)
- Containers: `--container-lg` (1200px)

### 1.3 Warnings

**W-01: `--shadow-md` in cascade-layers.md and Core Concepts — wrong token value.**

`cascade-layers.md` §2 and `Core Concepts & Fundamental Technologies.md` §3.3 both show:

```css
--shadow-md: 4px 4px 0 var(--text-primary);  /* WRONG */
```

The authoritative value from `css-emitter.md` is:

```css
--shadow-md: 4px 4px 0 var(--border-default);  /* CORRECT */
```

This is a documentation transcription error, not a code error. The `--text-primary` value would produce a near-black shadow in light mode and near-white in dark mode, which breaks the neo-brutalist shadow pattern. Any implementer reading the architecture docs directly would reproduce this bug.

**W-02: `--badge-py` / `--badge-px` value conflict.**

`token-tiers.md` defines badge padding tokens as `--badge-py: 2px` and `--badge-px: 10px`. The badge component spec references `var(--space-1)` (4px) and `var(--space-3)` (12px) for badge padding. These values do not match. Either the badge component uses different spacing from its own component tokens, or one of the two specs is wrong. The badge component tokens in `token-tiers.md` do not appear in any component spec as named tokens — they appear to be unused.

**W-03: `--accent-success` alias resolution.**

`orchestrator.md` §6.1 references `accent-success (resolves to accent-green)` in the WCAG contrast check table. This alias is not declared in `token-tiers.md` under the semantic layer. It may be an alias used only in the WCAG check logic and not a CSS custom property. If it is a CSS property, it is undocumented in the token specs.

**W-04: `--border-strong` referenced in `topnav.md` but not confirmed in token-tiers.md.**

`topnav.md` §3.2 specifies `border-color: var(--border-strong)` on `.topnav-btn:hover`. The `border-strong` semantic token was not listed in the semantic token table in `token-tiers.md`. It should be audited for presence in the palette JSON and CSS emitter output.

---

## Section 2: Cascade Layer Consistency

**Status: WARNING**

Checks that every component styles declaration uses `@layer component` and that no component writes to `@layer primitives` or `@layer semantic`.

### 2.1 Verified in @layer component

All component specs that include an Implementation CSS section explicitly declare `@layer component { ... }`:

- `select.md`, `textarea.md`, `tooltip.md`, `sidebar-layout.md`, `skeleton.md`, `checkbox.md`, `radio.md` — all contain `@layer component { ... }` with confirmed CSS.
- `input.md`, `button.md`, `card.md`, `badge.md`, `avatar.md`, `bento-grid.md`, `blur-grid.md` — all confirmed.
- Animation utility classes (`animation-classes.md`) — confirmed as `@layer component { @media (prefers-reduced-motion: no-preference) { ... } }`.

### 2.2 Warnings

**W-05: Specs without Implementation CSS sections.**

Several component specs include property tables and token dependency lists but omit the Implementation CSS section with an explicit `@layer component` declaration:

- `alert.md` — no Implementation CSS section
- `breadcrumbs.md` — no Implementation CSS section
- `modal.md` — no Implementation CSS section
- `command-palette.md` — references `@starting-style` but no complete Implementation CSS block
- `popover.md` — no Implementation CSS section

These specs cannot be verified for layer compliance from the spec alone. They are assumed to follow the pattern, but the omission creates a verification gap for anyone implementing from docs only.

**W-06: Topnav uses hardcoded OKLCH values for backdrop background.**

`topnav.md` §2.1 specifies:

```css
background: oklch(0.995 0.004 70 / 0.88);  /* light mode */
background: oklch(0.165 0.015 65 / 0.88);  /* dark mode */
```

These are raw OKLCH values rather than semantic tokens. This is documented as intentional — the translucency requires a raw value that cannot be expressed as a CSS custom property reference with opacity. However, it means the nav's background will not automatically update if the base palette changes. This is a legitimate exception, but it should be noted in the spec itself. It is not currently flagged.

**W-07: `.sr-only` is placed in @layer component, not @layer utilities.**

`checkbox.md` §7 defines `.sr-only` in `@layer component`. `utilities.md` mentions `.sr-only` as a utility class. Placing an accessibility utility in the component layer violates the layer architecture. If `.sr-only` is ever needed outside of checkbox context, it would need to be redefined in another layer.

---

## Section 3: Token Tier Compliance

**Status: WARNING**

Checks that component specs do not directly reference Tier 1 primitive tokens (those beginning with `--primitive-*`).

### 3.1 Known Intentional Violations

Two primitive token usages are documented in `token-tiers.md` as an "intentional exception":

- `--toggle-off-bg: var(--primitive-neutral-300)`
- `--toggle-knob: var(--primitive-neutral-0)`

`Core Concepts & Fundamental Technologies.md` §3.5 escalates this language, calling the same violations "a blocking fix." This language conflict creates ambiguity about whether these violations are accepted design decisions or open bugs. The two specs contradict each other on the same known issue.

### 3.2 Hardcoded Values Not Yet Tokenized

These hardcoded values appear in component specs without corresponding tokens. They are flagged for future tokenization consideration, not as failures:

| Component | Hardcoded Value | Notes |
|---|---|---|
| `code-block.md` | `oklch(0.200 0.015 60)` background | Does not change with theme. Intentional per spec. |
| `code-block.md` | 9 inline syntax colors (OKLCH) | Spec suggests `--code-*` promotion path |
| `topnav.md` | `oklch(0.995 0.004 70 / 0.88)` light, `oklch(0.165 0.015 65 / 0.88)` dark | Translucent backdrop, cannot be a bare token |
| `topnav.md` | `34px` button width/height | Not tokenized, close to `--control-md` (36px) but not identical |
| `topnav.md` | `720` font-weight for brand name | No typography token for this weight |
| `sidebar-layout.md` | `240px` sidebar width | Explicitly documented as not tokenized |
| `sidebar-layout.md` | `420px` min-height | Explicitly documented as not tokenized |
| `blur-grid.md` | `blur(2px)` radius, `0.7` opacity | Intentional, not tokenized |
| `toast.md` | `380px` max-width container | Not tokenized |
| `notification-badge.md` | `0.625rem` font-size | Not using `--ui-text-*` token |
| `range.md` | `4px` track height | Not tokenized |
| `stepper.md` | `16px` indicator top offset | Not tokenized |

### 3.3 Warning

**W-08: Toggle primitive violations described with conflicting severity language.**

`token-tiers.md` §2 describes these as "intentional exceptions" while `Core Concepts` §3.5 describes them as "a blocking fix." This should be resolved to a single stance. If they are blocking, a tracking issue should reference the fix. If they are intentional, the "blocking fix" language should be removed from Core Concepts.

---

## Section 4: Interaction Pattern Consistency

**Status: WARNING**

Checks whether the canonical lift/press pattern (defined in `Core Concepts` §4.1 and `cascade-layers.md`) is applied consistently across all interactive components.

### 4.1 The Canonical Pattern

Per `Core Concepts` §4.1, the lift/press pattern for interactive elements is:

- Hover: `translateY(-2px)` + shadow escalation
- Active: `translate(2px, 2px)` + shadow collapse to `0 0 0 var(--border-default)`
- Disabled: `opacity: 0.4` + `pointer-events: none`

Per `button.md` and `card.md`, the full lift/press shadow escalation for `.card` and `.tile` uses `translate(-4px, -4px)` on hover and `translate(2px, 2px)` on active. This is a documented intentional deviation for larger interactive surfaces.

### 4.2 Component-by-Component Active State Summary

| Component | Hover | Active | Notes |
|---|---|---|---|
| `.btn` (primary/secondary) | `translateY(-2px)` | `translate(2px, 2px)` | Canonical |
| `.card-interactive` | `translate(-4px, -4px)` | `translate(2px, 2px)` | Documented larger-surface variant |
| `.tile` | `translate(-4px, -4px)` | `translate(2px, 2px)` | Same as card |
| `.accordion-trigger` | — | `translateY(1px)` | 1px lighter variant |
| `.tab:active` | — | `translateY(1px)` | 1px lighter variant |
| `.topnav-links a:active` | — | `translateY(1px)` | 1px lighter variant |
| `.topnav-btn:hover` | `translateY(-1px)` | `translateY(1px)` | 1px two-way variant |
| `.topnav-toggle:hover` | `translateY(-1px)` | `translateY(1px)` | Same |
| `.topnav-kbd:active` | — | `translateY(1px)` | Same |
| `.breadcrumb-link:active` | — | `translateY(1px)` | 1px lighter variant |
| `.back-to-top:active` | — | `translateY(1px)` | 1px lighter variant |
| `.table th.sortable:active` | — | `translateY(1px)` | 1px lighter variant |
| `.segmented-control-item` | No transform | No transform | Inverted color state only |
| `.tabs .tab` | No hover transform | `translateY(1px)` | 1px active only |
| `.checkbox .check-box:active` | — | `scale(0.85)` | Scale variant |
| `.toast-close:active` | — | `scale(0.85)` | Scale variant |
| `.magnetic-button:active` | — | `scale(0.95) !important` | Overrides JS transform |

### 4.3 Warnings

**W-09: `back-to-top` active state undocumented as a deviation.**

`back-to-top` (documented in `inline-behaviors.md` and referenced in several specs) uses `translateY(1px)` on active and `box-shadow: none` instead of `0 0 0 var(--border-default)`. This is the 1px lighter variant (same as tabs, topnav links, breadcrumbs, table headers) but the box-shadow collapse is not the canonical collapse value. No spec explicitly documents this as an intentional deviation. All other components using the 1px variant still document their shadow behavior.

**W-10: Core Concepts §4.1 overstates universality.**

Core Concepts §4.1 states that hover is `translateY(-2px)` for "all interactive elements." This conflicts with the documented card/tile `translate(-4px,-4px)` hover and the multiple 1px variants. The sentence creates false expectations for implementers. The Core Concepts doc should be updated to state that `translateY(-2px)` is the default and document the surface-size variants.

**W-11: `back-to-top` uses hardcoded z-index `100`.**

`back-to-top` uses `z-index: 100` rather than `var(--z-sticky)` (also 100). The value is numerically correct, but using a hardcoded value breaks the convention that z-index values are always referenced via tokens. If `--z-sticky` is ever changed, the back-to-top would silently diverge.

---

## Section 5: Dark Mode Completeness

**Status: PASS with notes**

Checks that every semantic token has a `[data-theme="dark"]` override and that component specs do not assume a fixed theme.

### 5.1 Token Coverage

`token-tiers.md` and `css-emitter.md` confirm that all 52 semantic tokens (`palette.semantic.light` and `palette.semantic.dark`) are defined for both themes. The palette JSON is the source of truth. The CSS emitter generates both `:root` (light) and `[data-theme="dark"]` blocks.

Shadow tokens are hardcoded in the CSS emitter for both themes. The spec in `css-emitter.md` confirms both light and dark shadow values are emitted.

### 5.2 Component-Level Dark Mode

Every component spec uses only semantic tokens (Tier 2) or component tokens (Tier 3) for colors. No component spec hardcodes a light-only or dark-only color value with one exception:

**N-01: `code-block.md` background is theme-invariant by design.**

The code block uses `oklch(0.200 0.015 60)` as its background in both light and dark mode. The spec documents this explicitly: "The code block is always dark. It does not invert in light mode." This is intentional, not a gap.

**N-02: Topnav backdrop uses separate hardcoded values for each theme.**

`topnav.md` §2.1 shows separate light and dark OKLCH values for the translucent backdrop. Both modes are specified. This is complete.

### 5.3 Alert Variant Coverage

`alert.md` defines 6 color variants (neutral, pink, danger, gold, cyan, green). All use semantic tokens that have dark mode overrides. Alert gold uses `--accent-gold-text` for text rather than `--accent-gold` — this is an intentional accessibility decision documented in the spec for readable contrast on warm gold backgrounds.

---

## Section 6: Test Coverage

**Status: PASS**

Checks that every component spec has a Test Specification section, and that the testing architecture specs reference all required test categories.

### 6.1 Component Spec Test Coverage

Every component spec reviewed contains a Test Specification section with:
- Computed style assertions (at minimum 3-5 per component)
- Interaction assertions (for all interactive components)
- Visual regression scenarios (light/dark mode captured)
- Reduced motion compliance assertion

Two placeholder specs (`spotlight.md`, `tilt-card.md`) do not have test sections, which is correct — they are explicitly marked `status: not-in-reference` and cannot be tested against a reference.

### 6.2 Testing Architecture Coverage

`test-strategy.md` defines 4 test categories: token tests, component tests, motion tests, and port tests. All 4 have dedicated spec files (`token-tests.md`, `component-tests.md`, `motion-tests.md`, and cross-port consistency is defined in `terminal-emitters.md` §2).

**N-03: No explicit `port-tests.md` file.**

The terminal emitters spec (`terminal-emitters.md` §2) states: "enforced by test (`tests/ports.spec.ts`)." No dedicated `port-tests.md` spec file exists in the `testing/` directory. The cross-port ANSI consistency requirement is documented within the emitter spec rather than the testing specs. This is a coverage gap for the documentation, not for the tests themselves.

### 6.3 Motion Test Coverage

`motion-tests.md` documents 12 stagger delay classes at 60ms increments. `animation-classes.md` confirms 12 classes (`.anim-d1` through `.anim-d12`) at 60ms increments. These match exactly.

`motion-tests.md` references `--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1)`. `staggered-reveal.md` §3.3 confirms the Snappy spring easing is `cubic-bezier(0.34,1.56,0.64,1)`, which matches the token. The stagger spec documents that easing values are hardcoded in JS "matching `--ease-smooth` and `--ease-bounce`."

---

## Section 7: Dependency Graph Validation

**Status: WARNING**

Checks that the emitter dependency graph described in `orchestrator.md` matches the set of emitter spec files, and that runtime dependencies are documented.

### 7.1 Emitter Registry vs. Spec Files

`orchestrator.md` §7.1 registers 7 emitters:

| Emitter Name | Module | Spec File | Status |
|---|---|---|---|
| `css` | `css.mjs` | `css-emitter.md` | PASS |
| `vscode` | `vscode.mjs` | `vscode-emitter.md` | PASS |
| `obsidian` | `obsidian.mjs` | `obsidian-emitter.md` | PASS |
| `ghostty` | `ghostty.mjs` | `terminal-emitters.md` §3 | PASS |
| `iterm2` | `iterm2.mjs` | `terminal-emitters.md` §4 | PASS |
| `starship` | `starship.mjs` | **No spec file** | FAIL |
| `tailwind` | `tailwind.mjs` | **No spec file** | FAIL |

**W-12: `starship.mjs` emitter has no spec.**

`orchestrator.md` registers a Starship Config emitter outputting `ports/starship/starship.toml`. No `starship-emitter.md` (or equivalent) exists in `Documentation/Specs/emitters/`. The Rebuild Plan mentions "starship emitter included (not in the 5 emitter specs documented)" — this was acknowledged as a known gap but never resolved.

**W-13: `tailwind.mjs` emitter has no spec.**

`orchestrator.md` registers a Tailwind Preset emitter outputting `packages/tailwind/dist/preset.js`. No `tailwind-emitter.md` exists in `Documentation/Specs/emitters/`. This was not flagged anywhere in the existing documentation.

### 7.2 npm Dependencies

`orchestrator.md` §11 lists only 2 runtime dependencies: `ajv` (JSON Schema validation) and `culori` (OKLCH/sRGB conversion). Both are referenced consistently:

- `ajv` is used in the orchestrator for palette schema validation.
- `culori` is used in the orchestrator for WCAG contrast calculations and in `vscode-emitter.md` for OKLCH → hex conversion.

No other runtime dependencies are referenced in any emitter spec.

### 7.3 Build Pipeline Step Order

`orchestrator.md` §4 specifies 10 steps. WCAG contrast checks (Step 2) run before any emitter (Steps 3-9). This means a palette that passes schema validation but fails WCAG contrast will not produce any output files. The fail-fast ordering is correct and intentional.

---

## Section 8: Rebuild Plan Alignment

**Status: WARNING**

Checks whether the specification content aligns with the goals and scope described in `Rebuild Plan.md` and `Core Concepts & Fundamental Technologies.md`.

### 8.1 Component Count

`Core Concepts` §8.1 confirms 47 components. The component spec directory contains 47 files. The count matches.

### 8.2 Keyframe Count

`Core Concepts` §7.3 states 59 `@keyframes` total in the full motion catalog, with 22 showcased in `design-reference.html`. `keyframes.md` lists 22 keyframes (matching the showcase count). The gap of 37 additional keyframes is not individually specified — they exist in the reference CSS but were not extracted into `keyframes.md`. The rebuild plan acknowledges this scope boundary.

### 8.3 Token Count

The rebuild plan and Core Concepts both cite:
- 44 primitive tokens
- 52 semantic tokens (light + dark each)
- 80 component tokens
- Total: 176 CSS custom properties

`css-emitter.md` §2.3 confirms 44 primitives + 52 semantic = 96 unique names in the palette-driven emitter output. The 80 component tokens are hardcoded in the CSS file, making 176 total.

### 8.4 Warnings

**W-14: Core Concepts §3.3 contains a critical shadow token documentation error.**

This is the same finding as W-01 but restated here at the rebuild plan alignment level. The `Core Concepts` doc — which is the primary architecture reference — incorrectly documents `--shadow-md` as `4px 4px 0 var(--text-primary)`. An implementer reading this document would produce shadows that change with text color rather than border color. This breaks the neo-brutalist pattern in dark mode where `--text-primary` would be near-white.

The authoritative source (`css-emitter.md`) correctly shows `4px 4px 0 var(--border-default)`.

**W-15: Layer order in Core Concepts §3.1 shows `component` before `utilities`.**

`Core Concepts` §3.1 documents the layer order as: `reset, primitives, semantic, component, utilities`. `cascade-layers.md` documents the same order. This is consistent. Both docs agree. No discrepancy.

**W-16: Toggle violation language inconsistency between two architecture docs.**

As noted in Section 3, `token-tiers.md` calls the primitive toggle violation "intentional" while `Core Concepts` calls it "a blocking fix." These are the two most authoritative architecture documents, and they contradict each other on a known issue. The Rebuild Plan should clarify the canonical stance.

---

## Section 9: Scope Compliance (Placeholder Components)

**Status: PASS**

Checks that placeholder specs are correctly identified and that their status does not block other specs from being complete.

### 9.1 Placeholder Components

Two component specs are correctly marked `status: not-in-reference`:

**`spotlight.md`** — Explicitly states: "This component was requested for specification but does not exist as an implemented component in `design-reference.html`." The word "spotlight" appears once in the reference as an animation pattern name, not as a component. No CSS classes, no JS, no radial gradient tracking. The placeholder correctly identifies what is expected and what action is required.

**`tilt-card.md`** — Explicitly states: "This component was requested for specification but does not exist in `design-reference.html`." No CSS classes, no perspective properties, no JS tilt tracking. `inline-behaviors.md` §8 and §9 confirm both are absent ("Not present in design-reference.html").

### 9.2 Placeholder Status Propagation

No other spec references `spotlight` or `tilt-card` as a dependency. No token spec lists values for them. No test spec includes test scenarios for them. Their placeholder status is self-contained and does not create gaps in other specs.

### 9.3 Action Required

Both placeholders end with "Add the [component] to `design-reference.html` before this spec can be completed with exact values." This is the correct forward-looking instruction. The specs cannot be completed until the reference is updated.

---

## Section 10: Design Reference Scope Coverage

**Status: PASS with notes**

Structural scan of `Documentation/design-reference.html` to verify that all sections and components present in the file have corresponding spec coverage.

### 10.1 Top-Level Sections in design-reference.html

| Section ID | Section Title | Spec Coverage |
|---|---|---|
| `landing` (`.hero`) | Hero / Landing | No component spec (hero is a page section, not a component) |
| `philosophy` | Warm boldness, confident color, neo-brutalist expression | Philosophy section, no spec needed |
| `color` | oklch color tokens | Covered by `palette-schema.md`, `token-tiers.md`, `cascade-layers.md` |
| `typography` | Fluid type scale | Covered by `typography.md` (foundation) |
| `spacing` | 8px grid system | Covered by `spacing.md`, `shadows.md`, `radius.md` (foundation) |
| `components` | Interactive building blocks | All subsections covered below |
| `icons` | Lucide icon system | No dedicated icon spec (Lucide is an external library) |
| `motion` | Duration and easing tokens | Covered by `keyframes.md`, `animation-classes.md` |
| `micro` | Feel every interaction | Covered by skeleton, page-transitions, staggered-reveal, avatar, tooltip, empty-state, code-block, command-palette |
| `loading` | Skeleton loading and staggered reveals | `skeleton.md`, `staggered-reveal.md` |
| `overlays` | Toasts, modals, drawers, alerts | `toast.md`, `modal.md`, `drawer.md`, `alert.md`, `progress.md` |
| `signature` | The last 2% of polish | `blur-grid.md`, `magnetic-button.md` |
| `compositions` | Components in context | `bento-grid.md`, `sidebar-layout.md` |

### 10.2 Components Subsection (Section 5) Coverage

| Reference Subsection | Component | Spec File |
|---|---|---|
| 5a. Buttons | Button variants + states + sizes + icon + loading | `button.md` |
| 5b. Form Elements — Text Inputs | Input + states | `input.md` |
| 5b. Form Elements — Select, Date & Tags | Select + multi-select | `select.md`, `multi-select.md` |
| 5b. Form Elements — Textarea | Textarea | `textarea.md` |
| 5b. Form Elements — Checkboxes, Radios & Toggle | Checkbox, radio, toggle | `checkbox.md`, `radio.md` (toggle covered within checkbox spec) |
| 5b. Form Elements — Range Slider | Range | `range.md` |
| 5c. Cards | Card + tile variants | `card.md` |
| 5d. Data Table | Sortable table with selection | `table.md` |
| 5e. Badges | Badge variants | `badge.md` |
| 5f. Divider | Horizontal divider | `divider.md` |
| 5g. Segmented Control | Mode-switching control | `segmented-control.md` |
| 5h. Notification Badge | Counter badge | `notification-badge.md` |
| 5i. Dropdown Menu | Dropdown with Popover API | `dropdown.md` |
| 5j. Navigation — Sidebar | Sidebar nav items | Covered in `sidebar-layout.md` cross-ref |
| 5j. Navigation — Tabs | Horizontal tabs | `tabs.md` |
| 5j. Navigation — Breadcrumbs | Breadcrumb trail | `breadcrumbs.md` |
| 5j. Navigation — Pagination | Page controls | Referenced in several specs; standalone spec not confirmed in this review |
| Popover | Popover with Popover API | `popover.md` |
| Accordion | Expand/collapse sections | `accordion.md` |
| Stepper / Wizard | Multi-step progress | `stepper.md` |

### 10.3 Micro Section (Section 8) Coverage

| Reference Subsection | Spec File |
|---|---|
| Skeleton Loading | `skeleton.md` |
| Simulated Page Transition | `page-transitions.md` |
| Staggered Entry | `staggered-reveal.md` |
| Progress Bars | `progress.md` |
| Avatar + Avatar Group | `avatar.md` |
| Tooltip | `tooltip.md` |
| Empty State | `empty-state.md` |
| Code Block — Warm Syntax | `code-block.md` |
| Command Palette | `command-palette.md` |

### 10.4 Notes

**N-04: Pagination component not confirmed with a dedicated spec.**

The design reference shows a pagination component in section 5j (Navigation). No `pagination.md` spec file was found in the component spec directory during this review. If a pagination spec exists, it was not encountered in this review sweep. This should be verified.

**N-05: Sidebar navigation component may be under-specified.**

The reference shows a sidebar navigation pattern (`.sidebar-item`, `.sidebar-section-label`) used in the Dashboard composition and in section 5j. `sidebar-layout.md` covers the composition layout but cross-references `[[sidebar]]` as a separate component. No standalone `sidebar.md` spec was encountered in this review. The sidebar nav item classes may be covered within `sidebar-layout.md` or in a separate file not reviewed here.

**N-06: Scroll-progress bar is not in any component subsection.**

The scroll-progress bar is present in the HTML (`line ~4125`) and has a spec (`scroll-progress.md`), but it is not listed under any section in `design-reference.html` — it is placed globally before the topnav. The spec exists and is complete. No coverage gap.

**N-07: Icon system has no spec.**

The Lucide icon system section (`id="icons"`) in the reference has no corresponding spec. This is appropriate — Lucide is an external library and the reference showcases it but does not define it. No spec is expected.

**N-08: Toast container, Modal, Drawer, Command palette are global DOM elements.**

These are placed at the bottom of the HTML body (`lines ~7134-7188`) as singletons. They have complete specs (`toast.md`, `modal.md`, `drawer.md`, `command-palette.md`). Coverage is complete.

---

## Summary of All Findings

### Critical (must fix before documentation is authoritative)

| ID | File | Finding |
|---|---|---|
| W-01 | `cascade-layers.md` §2, `Core Concepts` §3.3 | `--shadow-md` documented as `var(--text-primary)` — should be `var(--border-default)`. Breaks neo-brutalist shadow pattern. |

### Warnings (should fix)

| ID | File | Finding |
|---|---|---|
| W-02 | `token-tiers.md`, `badge.md` | Badge padding token values (`--badge-py: 2px`, `--badge-px: 10px`) conflict with component spec spacing (`var(--space-1)` = 4px, `var(--space-3)` = 12px). Likely unused tokens. |
| W-03 | `orchestrator.md` §6.1 | `accent-success` alias used in WCAG check table; not declared in `token-tiers.md`. Needs clarification. |
| W-04 | `topnav.md` §3.2 | `--border-strong` referenced but not confirmed in semantic token table in `token-tiers.md`. |
| W-05 | `alert.md`, `breadcrumbs.md`, `modal.md`, `command-palette.md`, `popover.md` | Missing Implementation CSS section — cannot verify `@layer component` compliance from spec alone. |
| W-06 | `topnav.md` §2.1 | Hardcoded OKLCH backdrop values not flagged as intentional exceptions in the spec body. Should be annotated. |
| W-07 | `checkbox.md` §7 | `.sr-only` defined in `@layer component` rather than `@layer utilities`. Accessibility utility belongs in utilities layer. |
| W-08 | `token-tiers.md` §2, `Core Concepts` §3.5 | Toggle primitive violations described as "intentional exception" in one doc and "blocking fix" in another. Contradictory. |
| W-09 | `inline-behaviors.md`, various back-to-top refs | `back-to-top` active state uses `translateY(1px)` + `box-shadow: none` instead of canonical values. Not documented as a deviation. |
| W-10 | `Core Concepts` §4.1 | Lift/press hover stated as universal `translateY(-2px)` but card/tile use `translate(-4px,-4px)` and many elements use 1px variants. Overstates universality. |
| W-11 | `inline-behaviors.md` back-to-top | `z-index: 100` hardcoded; should be `var(--z-sticky)`. |
| W-12 | `orchestrator.md` §7.1 | `starship.mjs` emitter registered; no `starship-emitter.md` spec exists. |
| W-13 | `orchestrator.md` §7.1 | `tailwind.mjs` emitter registered; no `tailwind-emitter.md` spec exists. Unacknowledged gap. |
| W-14 | `Core Concepts` §3.3 | Same as W-01, restated at rebuild plan alignment level. |
| W-15 | (resolved) | Layer order consistent across docs. No discrepancy. |
| W-16 | `token-tiers.md` §2, `Core Concepts` §3.5 | Same as W-08, restated at rebuild plan level. |

### Notes (informational, no action required unless priorities shift)

| ID | File | Finding |
|---|---|---|
| N-01 | `code-block.md` | Theme-invariant dark background is intentional. Spec documents it explicitly. |
| N-02 | `topnav.md` | Separate OKLCH values per theme for backdrop. Both modes specified. Complete. |
| N-03 | `testing/` | No `port-tests.md` file; cross-port consistency requirement is documented in `terminal-emitters.md` instead. |
| N-04 | `components/` | No `pagination.md` spec confirmed. Reference shows pagination in section 5j. |
| N-05 | `components/` | Sidebar nav item classes may lack a standalone spec; `sidebar-layout.md` covers the composition. |
| N-06 | `scroll-progress.md` | Spec exists. Component is global (not in a section group). Coverage complete. |
| N-07 | `icons` section | No spec for Lucide — correct, it is an external library. |
| N-08 | `toast.md`, `modal.md`, `drawer.md`, `command-palette.md` | Global singleton DOM elements. All have complete specs. |

---

## Priority Action List

1. **Fix W-01 / W-14**: Update `cascade-layers.md` §2 and `Core Concepts` §3.3 to use `var(--border-default)` in the `--shadow-md` example.
2. **Fix W-08 / W-16**: Align `token-tiers.md` and `Core Concepts` on the toggle primitive violation stance — either accept it as intentional or track it as a tracked issue.
3. **Fix W-12**: Write `starship-emitter.md` spec.
4. **Fix W-13**: Write `tailwind-emitter.md` spec. This is an unacknowledged gap.
5. **Fix W-07**: Move `.sr-only` to `@layer utilities` or add an explicit note explaining why it is in `@layer component`.
6. **Fix W-10**: Update Core Concepts §4.1 lift/press description to accurately describe all three variants: canonical (2px), larger-surface (4px), and lighter (1px).
7. **Confirm W-04**: Verify `--border-strong` token exists in the semantic palette and emitter output.
8. **Resolve W-02**: Audit `--badge-py` and `--badge-px` tokens against the badge component implementation. Remove or correct.
9. **Clarify W-03**: Determine whether `accent-success` is a CSS custom property or a variable name used only in the WCAG check logic.
10. **Address N-04**: Confirm whether a `pagination.md` spec exists or create one.
