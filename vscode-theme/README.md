# Delightful — VSCode Theme

A warm, neo-brutalist color theme for Visual Studio Code, derived from the [Delightful Design System](../delightful-design-system.html).

## Variants

- **Delightful Light** — Warm cream backgrounds with high-contrast accents
- **Delightful Dark** — Amber-tinted dark backgrounds with vibrant syntax colors

## Installation

### From source (development)

```bash
# Generate theme files from OKLCH tokens
cd vscode-theme/scripts
npm install
node generate-themes.mjs

# Install for development
code --extensionDevelopmentPath=/path/to/vscode-theme
```

### Manual install

1. Package the extension: `cd vscode-theme && npx @vscode/vsce package`
2. Install the `.vsix`: `code --install-extension delightful-theme-1.0.0.vsix`

## Color Palette

All colors are derived from the Delightful Design System's OKLCH tokens:

| Role | Light | Dark |
|------|-------|------|
| Background | Warm cream (`bg-surface`) | Amber-tinted dark (`bg-surface`) |
| Text | Deep warm brown (`text-primary`) | Light cream (`text-primary`) |
| Accent | Hot pink/fuchsia | Lighter pink |
| Danger | Warm red | Bright red |
| Warning | Gold | Gold |
| Info | Cyan | Bright cyan |
| Success | Green | Bright green |

## Syntax Highlighting

- **Keywords** — Pink (brand accent)
- **Strings** — Gold
- **Functions** — Cyan
- **Comments** — Muted neutral, italic
- **Numbers** — Green
- **Properties** — Soft pink
- **Types** — Cyan (brighter)
- **Constants** — Red

## Regenerating

When design system tokens change, regenerate the theme files:

```bash
cd vscode-theme/scripts
node generate-themes.mjs
```

The generator reads OKLCH token values and converts them to hex using [culori](https://culorijs.org/).
