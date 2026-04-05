# Delightful Design System — Porting Guide

How to bring Delightful tokens to a new platform. Covers the token pipeline, ANSI mapping, editor themes, hex conversion, and platform constraints.

---

## Overview

The canonical token source is `${CLAUDE_PLUGIN_ROOT}/themes/css/delightful-tokens.css` — a CSS custom property stylesheet containing every primitive, semantic, and component token. All ports start by reading this file and transforming its values into the target platform's format.

Additional formats are available in the plugin:
- **CSS:** `${CLAUDE_PLUGIN_ROOT}/themes/css/delightful-tokens.css`
- **Tailwind:** `${CLAUDE_PLUGIN_ROOT}/themes/tailwind/delightful-preset.js`
- **Figma:** `${CLAUDE_PLUGIN_ROOT}/themes/figma/tokens.json`

---

## General Porting Strategy

1. **Identify the platform's color/theme format.** (JSON, YAML, CSS, plist, TOML, etc.)
2. **Map semantic tokens to platform concepts.** Every platform has its own vocabulary -- VS Code says `editor.background`, Ghostty says `background`, iTerm2 uses XML keys.
3. **Generate output from the semantic layer**, not primitives. This ensures light/dark variants work correctly.
4. **Test on representative content.** A theme is only good if it looks right on real code, real prose, and real UI.

---

## ANSI Palette Mapping

Terminals are limited to a 16-color ANSI palette. The 7 OKLCH families map as follows:

| ANSI slot | Delightful family | Notes |
|---|---|---|
| Black (0) | Neutral 900/950 | Dark background tones |
| Red (1) | Red 300-400 | Error, danger |
| Green (2) | Green 300-400 | Success, strings |
| Yellow (3) | Gold 300-400 | Warnings, types |
| Blue (4) | Cyan 300-400 | Info, keywords |
| Magenta (5) | Pink 300-400 | Accent, decorators |
| Cyan (6) | Cyan 200-300 | Secondary info, links |
| White (7) | Neutral 200-300 | Light foreground |
| Bright Black (8) | Neutral 600-700 | Comments, muted text |
| Bright Red (9) | Red 200-300 | Bright error |
| Bright Green (10) | Green 200-300 | Bright success |
| Bright Yellow (11) | Gold 200-300 | Bright warning |
| Bright Blue (12) | Cyan 200 | Bright info |
| Bright Magenta (13) | Pink 200-300 | Bright accent (also covers Purple) |
| Bright Cyan (14) | Cyan 100-200 | Bright secondary |
| Bright White (15) | Neutral 50-100 | Brightest foreground |

**Purple (hue 300)** does not have a direct ANSI slot. Map it to Bright Magenta or the closest Pink stop depending on the context.

**Background/Foreground** use Neutral semantic tokens (`--bg-page`, `--text-primary`), not ANSI slots.

---

## Editor Theme Mapping

For VS Code and similar editors, semantic tokens map to the theme JSON schema:

| Editor concept | Delightful semantic token |
|---|---|
| `editor.background` | `--bg-page` |
| `editor.foreground` | `--text-primary` |
| `editorCursor.foreground` | `--accent-primary` |
| `editor.selectionBackground` | `--accent-primary-subtle` (with alpha) |
| `editor.lineHighlightBackground` | `--bg-surface` |
| `editorLineNumber.foreground` | `--text-muted` |
| `editorLineNumber.activeForeground` | `--text-primary` |
| `sideBar.background` | `--bg-surface` |
| `sideBar.foreground` | `--text-secondary` |
| `tab.activeBackground` | `--bg-page` |
| `tab.inactiveBackground` | `--bg-surface` |
| `statusBar.background` | `--accent-primary-subtle` |
| `titleBar.activeBackground` | `--bg-surface` |
| `panel.background` | `--bg-page` |
| `terminal.background` | `--bg-page` |
| `terminal.foreground` | `--text-primary` |

Use these mappings as a starting point when porting to any editor that supports JSON theme schemas.

---

## Hex Conversion

OKLCH values must be converted to hex for platforms that do not support OKLCH natively (most of them):

```js
import { formatHex, clampChroma } from 'culori';

function toHex(oklchString) {
  // oklchString example: "oklch(0.720 0.220 350)"
  const clamped = clampChroma(oklchString, 'oklch');
  return formatHex(clamped);
}
```

- **`clampChroma`** reduces chroma until the color fits within the sRGB gamut. This keeps colors as vivid as possible without clipping.
- The `tokens.mjs` utility in the VS Code theme scripts provides a `toHex()` helper that wraps this pattern.
- Always clamp before converting. Raw OKLCH values with high chroma may be outside sRGB and will produce incorrect hex if converted directly.

---

## New Port Checklist

1. **Identify required color slots.** Read the platform's theme documentation. List every color the platform expects.
2. **Map semantic tokens to slots.** Use the semantic layer (`--bg-page`, `--text-primary`, `--accent-primary`, etc.), not primitives.
3. **Handle light and dark variants.** Most platforms expect separate theme files or a single file with both modes.
4. **Convert to hex.** Use `clampChroma` + `formatHex` as described above.
5. **Test contrast on representative content.** Code, prose, UI chrome. Check in both light and dark modes.
6. **Document the generation step.** Record how to regenerate the theme from tokens so future maintainers can reproduce it.

---

## Platform Constraints

| Platform | Constraint |
|---|---|
| **Terminals** (Ghostty, iTerm2) | 16 ANSI colors + foreground + background + cursor + selection. No semantic tokens, no gradients, no opacity. |
| **VS Code** | Fixed JSON schema with hundreds of scopes. Supports hex + alpha (`#RRGGBBAA`). No OKLCH. |
| **Obsidian** | CSS variable overrides on the `:root` and `.theme-dark` selectors. Supports any CSS color format the browser supports, but hex is safest for compatibility. |
| **Figma** | JSON token files with hex values. Organized by collection (primitives, semantic, component). |
| **Tailwind** | JavaScript preset exporting a `theme.extend.colors` object with hex values. |
| **Shell/Starship** | TOML configuration. Colors as hex strings or ANSI names. |
