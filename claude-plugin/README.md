<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="screenshots/Delightful-Dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="screenshots/Delightful-Light.png" />
    <img src="screenshots/Delightful-Light.png" width="600" alt="Delightful Design System" />
  </picture>
</p>

<h1 align="center">Delightful — Claude Code Plugin</h1>

<p align="center">
  Build and refactor UI with the <a href="https://github.com/kylesnav/delightful-design-system">Delightful Design System</a>. Includes skills, agents, and exportable tokens.
</p>

---

## Install

```bash
claude plugin install kylesnav/delightful-claude-plugin
```

## Skills

### `/build-with-delightful`

Build a new project or UI from the ground up using the Delightful design system. Scaffolds the full token system, builds components using strict design system patterns, then audits for compliance. Zero hardcoded colors, zero arbitrary spacing, full dark mode, all interaction states.

### `/refactor-with-delightful`

Refactor an existing project's UI to use the Delightful design system. Audits the existing codebase first, presents a migration plan, then systematically replaces hardcoded values with tokens. Re-audits until clean.

## Agents

### `delightful-auditor`

Read-only compliance checker. Scans for hardcoded colors, spacing, and font sizes. Catches missing interaction states, blurred shadows, missing dark mode support, and missing `prefers-reduced-motion` guards.

### `delightful-builder`

Full-capability UI builder. Reads the design system reference and constructs components strictly following all rules and patterns.

## Exportable Tokens

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
}
```

Maps all tokens to Tailwind v3 utility classes. Requires the CSS tokens to be loaded too.

### Figma / Style Dictionary

```
themes/figma/tokens.json
```

Design Tokens Community Group format. Import into Figma with Tokens Studio or process with Style Dictionary.

## Design Principles

| Principle | Description |
|-----------|-------------|
| **Warm clarity** | Cream backgrounds, near-black text, generous whitespace |
| **Surgical color** | Pink for actions, red for danger, gold for highlights, cyan for coolness, green for success, purple for creative |
| **Joyful restraint** | Playful but controlled — spring motion under 240ms |
| **Neo-brutalist** | 2px borders, solid shadows (zero blur), bold typography |
| **Systematic** | Every value comes from a token, no magic numbers |

## Token Architecture

```
Tier 1 — Primitives     Raw OKLCH scales (neutral, pink, red, gold, cyan, green, purple)
Tier 2 — Semantic        Light/dark mode tokens (bg, text, accent, border, shadow)
Tier 3 — Component       Typography, spacing, radius, motion, button, toggle
```

## License

[MIT](LICENSE)
