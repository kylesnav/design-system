# Delightful Design System

Monorepo for the Delightful design system — themes and plugins across editors, terminals, and tools. You are building a joyful, delightful design system.

## Change Propagation

Source of truth: `delightful-design-system.html`

**Automated** — run `npm run sync` after modifying the HTML:
- `claude-plugin/themes/css/delightful-tokens.css`
- `obsidian-theme/theme.css`
- `delightful-motion.html`
- `delightful-animation.html`
- `delightful-color.html`

**Manual** — update these yourself if tokens or patterns changed:
- `claude-plugin/themes/tailwind/delightful-preset.js`
- `claude-plugin/themes/figma/tokens.json`
- `claude-plugin/reference/tokens.md`
- `claude-plugin/reference/components.md`
- `claude-plugin/reference/interactions.md`
- `claude-plugin/reference/composition.md`
- `vscode-theme/themes/*.json` — regenerate via `cd vscode-theme/scripts && node generate-themes.mjs`
- `claude-plugin/agents/delightful-auditor.md`
- `claude-plugin/agents/delightful-builder.md`
- `claude-plugin/agents/delightful-composer.md`
- `claude-plugin/skills/build-with-delightful/SKILL.md`
- `claude-plugin/skills/refactor-with-delightful/SKILL.md`
- `claude-plugin/skills/audit-with-delightful/SKILL.md`

## Sync Verification

When asked to verify or update distribution repos, diff these paths:
- `claude-plugin/` ↔ `../delightful-claude-plugin/`
- `obsidian-theme/` ↔ `../obsidian-delightful/`
- `ghostty/` ↔ `../delightful-ghostty/`
- `iterm2/` ↔ `../delightful-iterm2/`
- `shell/` ↔ `../delightful-shell/`
- `starship/` ↔ `../delightful-starship/`
- `vscode-theme/` ↔ `../delightful-vscode/` (excluding marketplace-specific files)

Copy from this repo to distribution. Commit both.

## Versioning

Run `npm run bump <version>` to update all 7 version files (including marketplace.json) and create a git tag. Never update versions manually.

## Visual Testing via CDP

Several ports target Electron apps (Obsidian, VS Code) — launch them with `--remote-debugging-port=9222` and use Chrome DevTools MCP to screenshot, inspect DOM, and inject CSS live without taking over the user's computer. Workflow: build the theme, deploy to the app, reload CSS via CDP, screenshot diverse real content in both light and dark mode, compare against design tokens, and fix.

## Conventions

- All colors use OKLCH. No hex, rgb, or hsl.
- Token architecture: Primitives → Semantic → Component. Components never reference primitives directly.
- HTML files are self-contained — all CSS and JS inline, no external dependencies except Google Fonts.
- CSS uses cascade layers: `@layer reset, primitives, semantic, component, utilities`.
- Shadows use layered approach: hard offset (zero blur) + ambient depth layer. Borders are 2px solid.
- Plugin structure: `plugin.json` at `claude-plugin/` root (not nested in `.claude-plugin/`).
