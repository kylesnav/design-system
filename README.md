# Delightful Design System

A warm, neo-brutalist design system built on OKLCH color science. 3-tier token architecture, 20+ components, full light/dark mode, and a complete motion system.

**[View the design system](https://kylesnav.github.io/delightful-design-system/delightful-design-system.html)**

## Ecosystem

- **[Claude Code Plugin](claude-plugin/)** — Skills and agents for building and refactoring UI with the Delightful design system. Includes exportable CSS tokens, a Tailwind preset, and Figma/Style Dictionary tokens.
- **[Obsidian Theme](obsidian-theme/)** — A full Obsidian theme translating the design system's tokens and visual language into the Obsidian editor.
- **[Ghostty Theme](ghostty/)** — A Ghostty terminal theme with optional GLSL shaders.
- **[iTerm2 Theme](iterm2/)** — An iTerm2 color profile using the Delightful palette.
- **[Shell Config](shell/)** — Starship prompt and zsh config using Delightful colors. Works with any terminal.

## Design Principles

- **Warm clarity** — Cream backgrounds, near-black text, generous whitespace
- **Surgical color** — Pink for actions, red for danger, gold for highlights, cyan for coolness, green for success
- **Neo-brutalist** — 2px borders, solid shadows (zero blur), bold typography
- **Systematic** — Every value comes from a token. No magic numbers.

## Token Architecture

```
Primitives    → Raw OKLCH scales (neutral, pink, red, gold, cyan, green)
Semantic      → Light/dark mode tokens (bg, text, accent, border, shadow)
Component     → Typography, spacing, radius, motion, button, toggle
```

Components reference semantic tokens. Semantic tokens reference primitives. Nothing skips a tier.

## License

MIT
