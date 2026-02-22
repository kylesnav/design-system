# Delightful Design System — Claude Code Plugin

A neo-brutalist design system with oklch colors, 3-tier tokens, 20+ components, and a complete motion system. Installable as a Claude Code plugin with two skills for building and refactoring UI.

## Installation

```bash
claude plugin install /path/to/claude-plugin
```

## Skills

### `/build-with-delightful`

Build a new project or UI from the ground up using the Delightful design system.

Scaffolds the full token system, builds components using strict design system patterns, then audits for compliance. Zero hardcoded colors, zero arbitrary spacing, full dark mode, all interaction states.

### `/refactor-with-delightful`

Refactor an existing project's UI to use the Delightful design system.

Audits the existing codebase first, presents a migration plan, then systematically replaces hardcoded values with tokens. Re-audits until clean.

## Agents

### `delightful-auditor`

Read-only compliance checker. Scans code for violations:
- Hardcoded colors, spacing, font sizes
- Missing interaction states (hover, active, focus-visible)
- Blurred shadows (should be solid)
- Missing dark mode support
- Missing `prefers-reduced-motion` guards

### `delightful-builder`

Full-capability UI builder. Reads the design system reference and constructs components/pages strictly following all rules and patterns.

## Exportable Themes

### CSS Custom Properties

```css
@import './themes/css/delightful-tokens.css';
```

Standalone file with all 3 tiers of tokens. Drop into any project.

### Tailwind Preset

```js
// tailwind.config.js
import delightfulPreset from './themes/tailwind/delightful-preset.js'

export default {
  presets: [delightfulPreset],
  // ... your config
}
```

Maps all tokens to Tailwind v3 utility classes. Requires the CSS tokens to be loaded too.

### Figma / Style Dictionary Tokens

```
themes/figma/tokens.json
```

Design Tokens Community Group format. Import into Figma with the Tokens Studio plugin or process with Style Dictionary.

## Design Principles

- **Warm clarity** — Cream backgrounds, near-black text, generous whitespace
- **Surgical color** — Pink for actions, red for danger, gold for highlights, cyan for coolness, green for success
- **Joyful restraint** — Playful but controlled. Spring motion under 240ms.
- **Neo-brutalist** — 2px borders, solid shadows (zero blur), bold typography
- **Systematic** — Every value comes from a token. No magic numbers.

## Token Architecture

```
Tier 1 — Primitives     Raw oklch scales (neutral, pink, red, gold, cyan, green)
Tier 2 — Semantic        Light/dark mode tokens (bg, text, accent, border, shadow)
Tier 3 — Component       Typography, spacing, radius, motion, button, toggle
```

## File Structure

```
claude-plugin/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── skills/
│   ├── build-with-delightful/
│   │   └── SKILL.md             # /build-with-delightful skill
│   └── refactor-with-delightful/
│       └── SKILL.md             # /refactor-with-delightful skill
├── agents/
│   ├── delightful-auditor.md    # Compliance checker agent
│   └── delightful-builder.md    # UI builder agent
├── reference/
│   └── design-system.md         # Full token + component reference
├── themes/
│   ├── css/
│   │   └── delightful-tokens.css    # Standalone CSS tokens
│   ├── tailwind/
│   │   └── delightful-preset.js     # Tailwind v3 preset
│   └── figma/
│       └── tokens.json              # Figma/Style Dictionary tokens
└── README.md
```
