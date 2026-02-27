# Delightful Design System

Monorepo for the Delightful design system, its Claude Code plugin, and its Obsidian theme.

## Architecture

```
delightful-design-system.html   ← SINGLE SOURCE OF TRUTH (all tokens, components, patterns)
sample-warm-palette.html        ← Palette variant demo (not a derivative)
delightful-motion.html          ← Motion system showcase (59 animations, 10 categories)
delightful-animation.html       ← Animation system showcase (JS-powered: springs, FLIP, particles, gestures)
claude-plugin/                  ← Claude Code plugin
  themes/css/                       Standalone CSS token export
  themes/tailwind/                  Tailwind v3 preset
  themes/figma/                     Figma / Style Dictionary tokens
  reference/design-system.md        Full token + component reference
  agents/                           delightful-auditor, delightful-builder
  skills/                           build-with-delightful, refactor-with-delightful
obsidian-theme/                 ← Obsidian theme (also lives in obsidian-delightful repo)
vscode-theme/                  ← VSCode color theme extension
  themes/                          Light + dark theme JSON (generated)
  scripts/                         OKLCH-to-hex generation script
ghostty/                        ← Ghostty terminal theme
  ghostty-theme                     Ghostty config (colors + behavior)
  shaders/                          Optional GLSL shaders (vignette, bloom)
iterm2/                         ← iTerm2 color profile
  Delightful.itermcolors            Color profile (XML plist)
shell/                          ← Shared terminal config (works with any terminal)
  starship.toml                     Starship prompt config
  zshrc-snippet                     Zsh additions (aliases, hooks)
archive/                        ← Archived prior versions (gitignored)
```

## Source of Truth

`delightful-design-system.html` is the canonical definition of every token, component, and pattern. All other files are derivatives. Never introduce new tokens or change values in a derivative — change the HTML first, then propagate.

## Change Propagation

After modifying `delightful-design-system.html`, update all derivatives:

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

## Claude Plugin External Repo Sync

The Claude Code plugin lives in two places:
- `claude-plugin/` in this repo (development copy)
- `delightful-claude-plugin` repo (distribution copy — installable via `claude plugin install`)

When any file in `claude-plugin/` is updated, copy **all** its contents (`.claude-plugin/`, `agents/`, `skills/`, `themes/`, `reference/`, `README.md`) to the `delightful-claude-plugin` repo and commit/push both repos.

## VSCode Theme

The VSCode theme lives only in this repo (`vscode-theme/`). Theme JSON files are generated from OKLCH tokens via `vscode-theme/scripts/generate-themes.mjs` (requires `culori`). If primitive or semantic token values change, regenerate the themes.

## Ghostty

The Ghostty terminal theme lives only in this repo (`ghostty/`). There is no external sync repo. It contains hex color values derived from the OKLCH primitives — if primitive token values change, the hex mappings in `ghostty-theme` must be recalculated.

## iTerm2

The iTerm2 color profile lives only in this repo (`iterm2/`). There is no external sync repo. It contains the same hex color values as the Ghostty theme converted to RGB floats — if primitive token values change, the float values in `Delightful.itermcolors` must be recalculated.

## Shell

The shared shell config (`shell/`) contains Starship prompt and zsh settings that work with any terminal. There is no external sync repo. The `starship.toml` contains hex color values derived from the OKLCH primitives — if accent hex values change, it must be updated.

## Motion System

`delightful-motion.html` is a self-contained showcase of the motion system. It duplicates the token block from the source of truth. When motion tokens change in `delightful-design-system.html`, the token block in `delightful-motion.html` must be manually synced.

The motion file is NOT a derivative in the same way as CSS/Tailwind/Figma exports. It's a companion document with its own animations, demos, and interactive features. However, its token values must always match the source of truth.

## Animation System

`delightful-animation.html` is a self-contained showcase of JS-powered animations (spring physics, timeline/FLIP, particles, gestures). Like the motion file, it duplicates the token block from the source of truth and must be kept in sync. It sits above the CSS Motion System — CSS animations handle transitions, JS handles physics-based and interactive animations.

## Obsidian External Repo Sync

The Obsidian theme lives in two places:
- `obsidian-theme/` in this repo (development copy)
- `obsidian-delightful` repo (distribution copy)

When `obsidian-theme/` is updated, copy **all** its files (`theme.css`, `manifest.json`, `README.md`) to the `obsidian-delightful` repo and commit/push both repos.

## File Roles

| File | Role | Update when |
|------|------|-------------|
| `delightful-design-system.html` | Source of truth | First — all changes start here |
| `delightful-motion.html` | Motion system showcase | Motion tokens change, visual patterns change |
| `delightful-animation.html` | Animation system showcase | Token values change |
| `claude-plugin/themes/css/delightful-tokens.css` | Standalone CSS tokens | Tokens change |
| `claude-plugin/themes/tailwind/delightful-preset.js` | Tailwind preset | Tokens change |
| `claude-plugin/themes/figma/tokens.json` | Figma/Style Dictionary tokens | Tokens change |
| `claude-plugin/reference/design-system.md` | Full reference doc | Tokens or components change |
| `claude-plugin/agents/*.md` | Agent instructions | Rules or patterns change |
| `claude-plugin/skills/*/SKILL.md` | Skill workflows | Rules, patterns, or workflow change |
| `obsidian-theme/theme.css` | Obsidian theme | Tokens or visual patterns change |
| `obsidian-theme/manifest.json` | Theme metadata | Version bump |
| `vscode-theme/themes/*.json` | VSCode color theme | Tokens or syntax colors change |
| `vscode-theme/package.json` | VSCode extension metadata | Version bump |
| `vscode-theme/scripts/generate-themes.mjs` | Theme generator | Token names or structure change |
| `ghostty/ghostty-theme` | Ghostty terminal theme | Primitive hex values change |
| `ghostty/shaders/*.glsl` | Optional GLSL shaders | Visual effect tweaks |
| `iterm2/Delightful.itermcolors` | iTerm2 color profile | Primitive hex values change |
| `shell/starship.toml` | Starship prompt config | Accent hex values change |
| `shell/zshrc-snippet` | Zsh config | Alias or hook changes |

## Versioning

The canonical version is the latest git tag (`git tag -l | sort -V | tail -1`). Currently **v0.4.5**. The repo is public on GitHub but not published to npm (`"private": true` in `package.json` prevents accidental `npm publish`).

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
- Version bumps use `npm run bump <version>` to update all 6 version files.
