# Delightful Design System

[![Version](https://img.shields.io/github/v/tag/kylesnav/delightful-design-system?label=version&style=flat-square)](https://github.com/kylesnav/delightful-design-system/releases)
[![License](https://img.shields.io/github/license/kylesnav/delightful-design-system?style=flat-square)](LICENSE)
[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/kylesnav.delightful-theme?style=flat-square&label=vscode)](https://marketplace.visualstudio.com/items?itemName=kylesnav.delightful-theme)

A warm, joyful, neo-brutalist design system built on OKLCH color science. 3-tier token architecture (7 color families), 50+ components, full light/dark mode, @layer cascade architecture, native CSS nesting, container queries, a CSS motion system with 55+ named animations, and a JS animation system with spring physics, FLIP transitions, particles, and gesture handling.

> **[Live Demo](https://kylesnav.github.io/delightful-design-system/delightful-design-system.html)** · **[Motion System](https://kylesnav.github.io/delightful-design-system/delightful-motion.html)** · **[Animation System](https://kylesnav.github.io/delightful-design-system/delightful-animation.html)** · **[Claude Code Plugin](https://github.com/kylesnav/delightful-claude-plugin)** · **[Obsidian Theme](https://github.com/kylesnav/obsidian-delightful)**

![Delightful Design System — Light](screenshots/preview-light.png)
![Delightful Design System — Dark](screenshots/preview-dark.png)

## Quick Start

**Try a theme:**

- **Claude Code** — `claude plugin install kylesnav/delightful-claude-plugin`
- **VS Code** — search "Delightful" in the Extensions panel, or `ext install kylesnav.delightful-theme`
- **Terminal** — `bash scripts/setup-terminal.sh` (installs Ghostty, iTerm2, and Starship themes)

**Use the tokens in your project:** copy [`claude-plugin/themes/css/delightful-tokens.css`](claude-plugin/themes/css/delightful-tokens.css) into your project and reference the CSS custom properties.

## Ecosystem

| Tool | Install | Description |
|------|---------|-------------|
| **[Claude Code Plugin](claude-plugin/)** | [`delightful-claude-plugin`](https://github.com/kylesnav/delightful-claude-plugin) | Skills and agents for building and refactoring UI with Delightful. Includes CSS tokens, a Tailwind preset, and Figma/Style Dictionary tokens. |
| **[VSCode Theme](vscode-theme/)** | [`delightful-theme`](https://marketplace.visualstudio.com/items?itemName=kylesnav.delightful-theme) | Light and dark color themes for Visual Studio Code, generated from OKLCH tokens. |
| **[Obsidian Theme](obsidian-theme/)** | [`obsidian-delightful`](https://github.com/kylesnav/obsidian-delightful) | A full Obsidian theme translating the design system's tokens and visual language into the editor. |
| **[Ghostty Theme](ghostty/)** | [`delightful-ghostty`](https://github.com/kylesnav/delightful-ghostty) | A Ghostty terminal theme with optional GLSL shaders. |
| **[iTerm2 Theme](iterm2/)** | [`delightful-iterm2`](https://github.com/kylesnav/delightful-iterm2) | An iTerm2 color profile using the Delightful palette. |
| **[Shell Config](shell/)** | [`delightful-shell`](https://github.com/kylesnav/delightful-shell) | Starship prompt and zsh config using Delightful colors. Works with any terminal. |
| **[Motion System](delightful-motion.html)** | — | 59 named CSS animations across 10 categories with live interactive demos. |
| **[Animation System](delightful-animation.html)** | — | JS-powered animations: spring physics, FLIP transitions, particles, SVG morphing, and gestures. |

## Terminal Setup

A single script installs the Ghostty theme, iTerm2 profile + key mappings, Starship prompt, and zsh config. It detects which terminals you have, skips what's already configured, and prints any manual steps at the end.

```bash
bash scripts/setup-terminal.sh
```

Or in Claude Code, just ask: *"run the terminal setup script"*

See [ghostty/](ghostty/), [iterm2/](iterm2/), and [shell/](shell/) for individual install instructions.

## Design Principles

- **Warm clarity** — Cream backgrounds, near-black text, generous whitespace
- **Surgical color** — Pink for actions, red for danger, gold for highlights, cyan for coolness, green for success, purple for creative
- **Neo-brutalist** — 2px borders, solid shadows (zero blur), bold typography
- **Systematic** — Every value comes from a token. No magic numbers.

## Token Architecture

```
Primitives (7 families × 5 stops)
├── neutral                     ┐
├── pink      (primary)         │
├── red       (danger)          │  Raw OKLCH color scales
├── gold      (warning)         │
├── cyan      (tertiary)        │
├── green     (success)         │
└── purple    (creative)        ┘
        ↓
Semantic (light/dark mode)
    bg · text · accent · border · shadow
        ↓
Component
    typography · spacing · radius · motion · button · toggle
```

Components reference semantic tokens. Semantic tokens reference primitives. Nothing skips a tier.

## License

MIT
