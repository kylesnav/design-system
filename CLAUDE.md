# Delightful Design System

Monorepo for the Delightful design system, and various themes and plugins that can use it. You are building a joyful, delightful design system.

## Change Propagation

After completing modifications to `delightful-design-system.html`, update all derivatives you can find, some of which include:

1. `claude-plugin/themes/css/delightful-tokens.css` — extract updated token definitions (all 3 tiers)
2. `claude-plugin/themes/tailwind/delightful-preset.js` — update Tailwind color/spacing/radius/shadow mappings
3. `claude-plugin/themes/figma/tokens.json` — update DTCG-format token values
4. `claude-plugin/reference/design-system.md` — update token tables and component patterns
5. `obsidian-theme/theme.css` — update CSS variables and component styles to match
6. `vscode-theme/themes/*.json` — regenerate via `cd vscode-theme/scripts && node generate-themes.mjs`
7. `delightful-motion.html` — sync motion token block if any motion token values changed
8. `delightful-animation.html` — sync animation token block if any token values changed

If token names, values, or component patterns changed, also update:
- `claude-plugin/agents/delightful-auditor.md`
- `claude-plugin/agents/delightful-builder.md`
- `claude-plugin/skills/build-with-delightful/SKILL.md`
- `claude-plugin/skills/refactor-with-delightful/SKILL.md`

## Sync Verification

When asked to verify, check, or update distribution repos, diff these paths:
- `claude-plugin/` vs `../delightful-claude-plugin/` (all contents)
- `obsidian-theme/` vs `../obsidian-delightful/` (all contents)
- `ghostty/` vs `../delightful-ghostty/` (all contents)
- `iterm2/` vs `../delightful-iterm2/` (all contents)
- `shell/` vs `../delightful-shell/` (all contents)
- `vscode-theme/` vs `../delightful-vscode/` (all contents, excluding marketplace-specific files)

Report any files that differ. In sync mode, copy from source (this repo) to distribution and commit both. You may need to check for other packages and add them here.

## Versioning

The canonical version is the latest git tag (`git tag -l | sort -V | tail -1`). The repo is public on GitHub but not published to npm (`"private": true` in `package.json` prevents accidental `npm publish`).

When bumping the version, update **all 6 files** and create a matching git tag:

| File | Field |
|------|-------|
| `package.json` | `"version"` |
| `vscode-theme/package.json` | `"version"` |
| `claude-plugin/.claude-plugin/plugin.json` | `"version"` |
| `obsidian-theme/manifest.json` | `"version"` |
| `claude-plugin/skills/build-with-delightful/SKILL.md` | `version:` in YAML frontmatter |
| `claude-plugin/skills/refactor-with-delightful/SKILL.md` | `version:` in YAML frontmatter |

After updating all files, commit and tag: `git tag vX.Y.Z`.

Never set versions independently — all 6 files must always match.

## Conventions

- All colors use OKLCH. No hex, rgb, or hsl anywhere.
- Token architecture is 3-tier: Primitives → Semantic → Component. Components never reference primitives directly.
- Color families: neutral, pink (primary), red (danger), gold (warning), cyan (tertiary), green (success), purple (creative/special). Each has 5 primitive stops and 4 semantic tokens (base, hover, subtle, text).
- Shadows are solid (zero blur). Borders are 2px solid.
- Dark mode uses muted `--border-default` (`oklch(0.550 0.010 65)`) and bright `--border-strong` for emphasis.
- The HTML files are self-contained — all CSS and JS inline, no external dependencies except Google Fonts.
- CSS is organized in cascade layers: `@layer reset, primitives, semantic, component, utilities`. All styles must live in the correct layer.
- Component CSS uses native CSS nesting with the `&` parent selector.
- Container queries (`@container`) are used for responsive grid layouts.
- `@starting-style` is used for entry animations on overlays (modals, command palette).
- View Transitions API is used for the theme toggle crossfade effect.
- Version bumps use `npm run bump <version>` to update all 6 version files.
