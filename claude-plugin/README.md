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

## Getting Started

After installing, try one of these to see the system in action:

```
/present-with-delightful — create a presentation about any topic
/audit-with-delightful   — scan your current project for design system violations
```

Each skill walks you through the full workflow — reading references, planning structure, generating output, and verifying compliance. You don't need to know the token system upfront; the skills handle that.

For quick lookups without running a full skill, use the MCP tools directly:

```
"What's the primary accent color?"       → lookup_token
"Show me the card component pattern"     → lookup_component
"What Delightful token matches #ff69b4?" → map_color
```

## When to Use What

| I want to... | Use this | Why |
|---|---|---|
| Build new UI from scratch | `/build-with-delightful` | Scaffolds tokens, builds components, audits for compliance |
| Migrate existing UI to Delightful | `/refactor-with-delightful` | Audits first, plans migration, replaces systematically |
| Check if my code follows the system | `/audit-with-delightful` | Scans for hardcoded values, missing states, a11y gaps |
| Make a presentation | `/present-with-delightful` | Slide deck with sidebar TOC, keyboard nav, search, theme toggle |
| Look up a specific token value | MCP: `lookup_token` | Instant answer without running a full skill |
| Get a component's CSS + HTML | MCP: `lookup_component` | Copy-ready pattern for any of 20+ components |
| Find the closest token for a color | MCP: `map_color` | Maps hex/rgb/oklch to the nearest Delightful token |
| Audit a CSS snippet inline | MCP: `audit_css` | Quick check without scanning the full project |

## Usage Examples

### Build a component

```
/build-with-delightful

"Build a settings page with a form, toggle switches, and a save button"
```

Claude reads the reference docs, establishes the token foundation, builds the page with proper OKLCH colors, solid shadows, POUNCE/SINK interactions, and dark mode — then runs the auditor to verify.

### Migrate existing code

```
/refactor-with-delightful

"Refactor this React app to use the Delightful design system"
```

Claude audits your current code, presents a migration plan (colors → spacing → typography → interactions), executes each phase, and re-audits until there are zero violations.

### Create a presentation

```
/present-with-delightful

"Create a presentation about our microservices architecture"
```

Claude plans chapter groups and slides, then generates a single HTML file with arrow-key navigation, sidebar table of contents, Cmd+K search, animated counters, and ambient particles.

### Quick token lookup

```
"What spacing token is closest to 24px?"
```

The MCP server responds instantly: `--space-6: 24px` — no skill invocation needed.

## Skills

### `/build-with-delightful`

Build a new project or UI from the ground up. Scaffolds the full token system, builds components using strict patterns, then audits for compliance. Zero hardcoded colors, full dark mode, all interaction states.

### `/refactor-with-delightful`

Refactor existing UI to use the design system. Audits first, presents a migration plan, then systematically replaces hardcoded values with tokens. Re-audits until clean.

### `/audit-with-delightful`

Run a compliance audit on your project. Scans for hardcoded values, missing interaction states, accessibility gaps, dark mode breakage, and token drift.

### `/present-with-delightful`

Generate slide deck presentations with keyboard navigation, sidebar table of contents, search, theme toggle, and the full neo-brutalist aesthetic. Turn any topic into an interactive navigable slide-based presentation.

## Agents

### `delightful-auditor`

Read-only compliance checker. Scans for hardcoded colors, spacing, font sizes, resolved semantic references, missing shadow layers, interaction states, and reduced-motion guards.

### `delightful-builder`

UI builder. Reads reference docs and constructs components strictly following all design system rules and patterns.

### `delightful-composer`

Page-level composition agent. Assembles components into complete layouts with responsive behavior, dark mode, and visual hierarchy.

## Reference Docs

| Doc | Content |
|-----|---------|
| `tokens.md` | All 3 tiers of token values |
| `components.md` | 20+ component patterns with CSS/HTML |
| `interactions.md` | POUNCE/SINK press patterns, motion, animations |
| `composition.md` | Page layouts, responsive, utilities, checklist |
| `philosophy.md` | Design rationale and principles |
| `accessibility.md` | WCAG contract, contrast, focus model |
| `animations.md` | 56 CSS @keyframes across 10 categories |
| `color-system.md` | OKLCH color architecture and dark mode shifts |
| `motion-js.md` | Spring physics, FLIP, particles, gestures |
| `porting-guide.md` | How to create new platform themes |
| `governance.md` | How to safely extend the token system |

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

## MCP Server

The plugin includes a bundled MCP server that provides programmatic access to the design system. It auto-connects when the plugin is installed in Claude Code.

### Tools

| Tool | Description |
|------|-------------|
| `lookup_token` | Look up tokens by name or category — returns value, tier, and usage guidance |
| `lookup_component` | Get the full CSS + HTML pattern for any of 20+ components |
| `map_color` | Find the closest Delightful token for any hex/rgb/oklch color |
| `audit_css` | Check a CSS snippet for design system violations with fix suggestions |
| `get_token_css` | Return the complete token stylesheet for copy/paste |

### Resources

14 browsable resources at `delightful://reference/*` (11 reference docs) and `delightful://themes/*` (CSS, Tailwind, Figma) URIs.

### Claude Desktop

The MCP server also works standalone in Claude Desktop. Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "delightful": {
      "command": "node",
      "args": ["/path/to/delightful-claude-plugin/mcp-server/index.js"]
    }
  }
}
```

Then install dependencies: `cd /path/to/delightful-claude-plugin/mcp-server && npm install`

### Skills vs MCP

Skills provide **structured workflows** (build, refactor, audit, present) with step-by-step orchestration. The MCP server provides **instant lookups** — token values, component patterns, color mapping, and CSS auditing. They complement each other: skills orchestrate, the MCP answers questions.

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
