# Delightful Design System

Monorepo for the Delightful design system, its Claude Code plugin, and its Obsidian theme.

## Architecture

```
delightful-design-system.html   ← SINGLE SOURCE OF TRUTH (all tokens, components, patterns)
sample-warm-palette.html        ← Palette variant demo (not a derivative)
claude-plugin/                  ← Claude Code plugin
  themes/css/                       Standalone CSS token export
  themes/tailwind/                  Tailwind v3 preset
  themes/figma/                     Figma / Style Dictionary tokens
  reference/design-system.md        Full token + component reference
  agents/                           delightful-auditor, delightful-builder
  skills/                           build-with-delightful, refactor-with-delightful
obsidian-theme/                 ← Obsidian theme (also lives in obsidian-delightful repo)
ghostty/                        ← Ghostty terminal theme + Starship + zsh
  ghostty-theme                     Ghostty config (colors + behavior)
  shaders/                          Optional GLSL shaders (vignette, bloom)
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

## Ghostty

The Ghostty terminal theme lives only in this repo (`ghostty/`). There is no external sync repo. It contains hex color values derived from the OKLCH primitives — if primitive token values change, the hex mappings in `ghostty-theme` and `starship.toml` must be recalculated.

## Obsidian External Repo Sync

The Obsidian theme lives in two places:
- `obsidian-theme/` in this repo (development copy)
- `obsidian-delightful` repo (distribution copy)

When `obsidian-theme/` is updated, copy **all** its files (`theme.css`, `manifest.json`, `README.md`) to the `obsidian-delightful` repo and commit/push both repos.

## File Roles

| File | Role | Update when |
|------|------|-------------|
| `delightful-design-system.html` | Source of truth | First — all changes start here |
| `claude-plugin/themes/css/delightful-tokens.css` | Standalone CSS tokens | Tokens change |
| `claude-plugin/themes/tailwind/delightful-preset.js` | Tailwind preset | Tokens change |
| `claude-plugin/themes/figma/tokens.json` | Figma/Style Dictionary tokens | Tokens change |
| `claude-plugin/reference/design-system.md` | Full reference doc | Tokens or components change |
| `claude-plugin/agents/*.md` | Agent instructions | Rules or patterns change |
| `claude-plugin/skills/*/SKILL.md` | Skill workflows | Rules, patterns, or workflow change |
| `obsidian-theme/theme.css` | Obsidian theme | Tokens or visual patterns change |
| `obsidian-theme/manifest.json` | Theme metadata | Version bump |
| `ghostty/ghostty-theme` | Ghostty terminal theme | Primitive hex values change |
| `ghostty/starship.toml` | Starship prompt config | Accent hex values change |
| `ghostty/shaders/*.glsl` | Optional GLSL shaders | Visual effect tweaks |
| `ghostty/zshrc-snippet` | Zsh config | Alias or hook changes |

## Conventions

- All colors use OKLCH. No hex, rgb, or hsl anywhere.
- Token architecture is 3-tier: Primitives → Semantic → Component. Components never reference primitives directly.
- Shadows are solid (zero blur). Borders are 2px solid.
- The HTML file is self-contained — all CSS and JS inline, no external dependencies except Google Fonts.
