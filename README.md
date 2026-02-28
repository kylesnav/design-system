# Delightful Design System

A warm, neo-brutalist design system built on OKLCH color science. 3-tier token architecture (7 color families), 50+ components, full light/dark mode, @layer cascade architecture, native CSS nesting, container queries, a CSS motion system with 55+ named animations, and a JS animation system with spring physics, FLIP transitions, particles, and gesture handling.

> **[Live Demo](https://kylesnav.github.io/delightful-design-system/delightful-design-system.html)** · **[Motion System](https://kylesnav.github.io/delightful-design-system/delightful-motion.html)** · **[Animation System](https://kylesnav.github.io/delightful-design-system/delightful-animation.html)** · **[Claude Code Plugin](https://github.com/kylesnav/delightful-claude-plugin)** · **[Obsidian Theme](https://github.com/kylesnav/obsidian-delightful)**

![Delightful Design System](screenshots/preview.png)

## Ecosystem

| Tool | Description |
|------|-------------|
| **[Claude Code Plugin](claude-plugin/)** | Skills and agents for building and refactoring UI with Delightful. Includes CSS tokens, a Tailwind preset, and Figma/Style Dictionary tokens. |
| **[VSCode Theme](vscode-theme/)** | Light and dark color themes for Visual Studio Code, generated from OKLCH tokens. |
| **[Obsidian Theme](obsidian-theme/)** | A full Obsidian theme translating the design system's tokens and visual language into the editor. |
| **[Ghostty Theme](ghostty/)** | A Ghostty terminal theme with optional GLSL shaders. |
| **[iTerm2 Theme](iterm2/)** | An iTerm2 color profile using the Delightful palette. |
| **[Shell Config](shell/)** | Starship prompt and zsh config using Delightful colors. Works with any terminal. |
| **[Motion System](delightful-motion.html)** | 59 named CSS animations across 10 categories with live interactive demos. Includes entrances, exits, attention seekers, feedback, micro-interactions, and scroll-driven effects. |
| **[Animation System](delightful-animation.html)** | JS-powered animation showcase: spring physics engine, timeline orchestration, FLIP layout transitions, particle effects, SVG morphing, gesture handling, and scroll-driven animations. |

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
Primitives    → Raw OKLCH scales (neutral, pink, red, gold, cyan, green, purple)
Semantic      → Light/dark mode tokens (bg, text, accent, border, shadow)
Component     → Typography, spacing, radius, motion, button, toggle
```

Components reference semantic tokens. Semantic tokens reference primitives. Nothing skips a tier.

## License

MIT
