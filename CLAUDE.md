# Delightful Design System

Monorepo for the Delightful design system, and various themes and plugins that can use it. You are building a joyful, delightful design system. It should be extremely cutting edge, use /frontend-design as needed.

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

> **Note:** The auditor agent now reads `reference/design-system.md` at runtime for token mappings, so only its violation checks and allowed exceptions need manual updates — not the mapping tables.

## Claude Plugin External Repo Sync

The Claude Code plugin lives in two places:
- `claude-plugin/` in this repo (development copy)
- `delightful-claude-plugin` repo (distribution copy — installable via `claude plugin install`)

When any file in `claude-plugin/` is updated, copy **all** its contents (`.claude-plugin/`, `agents/`, `skills/`, `themes/`, `reference/`, `README.md`) to the `delightful-claude-plugin` repo and commit/push both repos.

## Obsidian External Repo Sync

The Obsidian theme lives in two places:
- `obsidian-theme/` in this repo (development copy)
- `obsidian-delightful` repo (distribution copy)

When `obsidian-theme/` is updated, copy **all** its files (`theme.css`, `manifest.json`, `README.md`) to the `obsidian-delightful` repo and commit/push both repos.

## VSCode Theme

The VSCode theme lives only in this repo (`vscode-theme/`). Theme JSON files are generated from OKLCH tokens via `vscode-theme/scripts/generate-themes.mjs` (requires `culori`). If primitive or semantic token values change, regenerate the themes.

## Ghostty External Repo Sync

The Ghostty config lives in two places:
- `ghostty/` in this repo (development copy)
- `delightful-ghostty` repo (distribution copy)

When any file in `ghostty/` is updated, copy **all** its contents (`themes/`, `config`, `shaders/`, `README.md`) to the `delightful-ghostty` repo and commit/push both repos.

The theme files (`themes/delightful-light`, `themes/delightful-dark`) contain color-only definitions installable via Ghostty's `theme =` directive. They contain hex color values derived from the OKLCH primitives — if primitive token values change, the hex mappings must be recalculated.

## Sync Verification

When asked to verify, check, or update distribution repos, diff these paths:
- `claude-plugin/` vs `../delightful-claude-plugin/` (all contents)
- `obsidian-theme/` vs `../obsidian-delightful/` (theme.css, manifest.json, README.md)
- `ghostty/` vs `../delightful-ghostty/` (all contents)

Report any files that differ. In sync mode, copy from source (this repo) to distribution and commit both.

## iTerm2

The iTerm2 color profile lives only in this repo (`iterm2/`). There is no external sync repo. It contains the same hex color values as the Ghostty theme converted to RGB floats — if primitive token values change, the float values in `Delightful.itermcolors` must be recalculated.

## Shell

The shared shell config (`shell/`) contains Starship prompt and zsh settings that work with any terminal. There is no external sync repo. The `starship.toml` contains hex color values derived from the OKLCH primitives — if accent hex values change, it must be updated.

## Motion System

`delightful-motion.html` is a self-contained showcase of the motion system. It duplicates the token block from the source of truth. When motion tokens change in `delightful-design-system.html`, the token block in `delightful-motion.html` must be manually synced.

The motion file is NOT a derivative in the same way as CSS/Tailwind/Figma exports. It's a companion document with its own animations, demos, and interactive features. However, its token values must always match the source of truth.

## Animation System

`delightful-animation.html` is a self-contained showcase of JS-powered animations (spring physics, timeline/FLIP, particles, gestures). Like the motion file, it duplicates the token block from the source of truth and must be kept in sync. It sits above the CSS Motion System — CSS animations handle transitions, JS handles physics-based and interactive animations.

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

## Release Process

When performing a release, spawn a 3-agent team:

1. **Token-sync agent** — Validates all derivatives are in sync with `delightful-design-system.html` (the 8 files in Change Propagation)
2. **Test agent** — Runs the full test suite and visual regression checks
3. **Distribution-sync agent** — Diffs and syncs to all distribution repos (claude-plugin → delightful-claude-plugin, obsidian-theme → obsidian-delightful, ghostty → delightful-ghostty)

All three run in parallel. The release commit and tag happen only after all three pass.

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
