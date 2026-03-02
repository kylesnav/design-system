---
title: "Terminal Emitter Specifications"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Terminal Emitter Specifications

> Defines how `palettes/delightful.json` terminal hex values are transformed into Ghostty configuration files and iTerm2 `.itermcolors` property list files. Both emitters consume the same hand-tuned hex values and must produce identical ANSI palettes.

Cross-references: [[palette-schema]] (input format, terminal section), [[vscode-emitter]] (shares ANSI values for terminal panel), [[orchestrator]] (build pipeline).

---

## 1. Input: Terminal Hex Values

Both emitters read from `palette.terminal.light` and `palette.terminal.dark`. These are **hex-authoritative** — hand-tuned values, NOT derived from OKLCH conversion.

### 1.1 Palette Terminal Structure

```json
"terminal": {
  "light": {
    "foreground": "#1b150f",
    "background": "#fdf8f3",
    "cursor": "#f600a3",
    "ansi": [
      "#1b150f", "#ed324b", "#22a448", "#febf00",
      "#00a6c0", "#f600a3", "#17c0d6", "#e8ddd3",
      "#6b5e52", "#ff6b7f", "#44d66a", "#ffe066",
      "#33cfea", "#ff33c0", "#55e8f0", "#fdf8f3"
    ]
  },
  "dark": {
    "foreground": "#e8ddd3",
    "background": "#1b150f",
    "cursor": "#ff33c0",
    "ansi": [
      "#1b150f", "#ed324b", "#22a448", "#febf00",
      "#00a6c0", "#f600a3", "#17c0d6", "#e8ddd3",
      "#6b5e52", "#ff6b7f", "#44d66a", "#ffe066",
      "#33cfea", "#ff33c0", "#55e8f0", "#fdf8f3"
    ]
  }
}
```

### 1.2 ANSI Color Index Mapping

The `ansi` array contains 16 hex values at indices 0-15, following the standard ANSI color assignment:

| Index | ANSI Name | Standard Role | Delightful Hex |
|---|---|---|---|
| 0 | Black | Default dark / background | `#1b150f` |
| 1 | Red | Errors, danger | `#ed324b` |
| 2 | Green | Success, additions | `#22a448` |
| 3 | Yellow | Warnings, caution | `#febf00` |
| 4 | Blue | Info, links (mapped to cyan-blue) | `#00a6c0` |
| 5 | Magenta | Special, brand accent | `#f600a3` |
| 6 | Cyan | Secondary info, paths | `#17c0d6` |
| 7 | White | Default light / foreground | `#e8ddd3` |
| 8 | Bright Black | Comments, muted text | `#6b5e52` |
| 9 | Bright Red | Highlighted errors | `#ff6b7f` |
| 10 | Bright Green | Highlighted success | `#44d66a` |
| 11 | Bright Yellow | Highlighted warnings | `#ffe066` |
| 12 | Bright Blue | Highlighted info | `#33cfea` |
| 13 | Bright Magenta | Highlighted special | `#ff33c0` |
| 14 | Bright Cyan | Highlighted secondary | `#55e8f0` |
| 15 | Bright White | Bright foreground | `#fdf8f3` |

Normal colors (0-7) are used for standard terminal output. Bright colors (8-15) are used for bold text or explicit bright escape sequences.

---

## 2. Cross-Port Consistency Requirement

The ANSI palette (16 colors) MUST be identical between Ghostty and iTerm2 for the same theme variant. This is enforced by test (`tests/ports.spec.ts`).

Both emitters read from the same `palette.terminal.{theme}.ansi` array, ensuring a single source of truth. If either emitter transforms or reorders the values, the test will fail.

---

## 3. Ghostty Emitter

### 3.1 File & Module

```
emitters/ghostty.mjs
```

### 3.2 Interface

```js
/**
 * @param {object} palette - Parsed palette JSON (validated against schema)
 * @param {object} [options] - Emitter options
 * @returns {{ files: Array<{ path: string, content: string }>, warnings: string[] }}
 */
export function emit(palette, options = {}) {
  // ...
  return {
    files: [
      { path: 'ports/ghostty/delightful-light.conf', content: '...' },
      { path: 'ports/ghostty/delightful-dark.conf', content: '...' }
    ],
    warnings: []
  };
}
```

### 3.3 Output Format

Ghostty uses a plain-text `key = value` configuration format. No JSON, no XML — just flat key-value pairs, one per line.

### 3.4 Output File: `ports/ghostty/delightful-light.conf`

```conf
# Delightful Light — Ghostty color theme
# Generated from palettes/delightful.json v{version}

# Colors
background = #fdf8f3
foreground = #1b150f
cursor-color = #f600a3
cursor-text = #fdf8f3
selection-background = #f5e6f0
selection-foreground = #1b150f

# ANSI palette
palette = 0=#1b150f
palette = 1=#ed324b
palette = 2=#22a448
palette = 3=#febf00
palette = 4=#00a6c0
palette = 5=#f600a3
palette = 6=#17c0d6
palette = 7=#e8ddd3
palette = 8=#6b5e52
palette = 9=#ff6b7f
palette = 10=#44d66a
palette = 11=#ffe066
palette = 12=#33cfea
palette = 13=#ff33c0
palette = 14=#55e8f0
palette = 15=#fdf8f3

# Font
font-family = "JetBrains Mono"
font-size = 14

# Window
window-padding-x = 12
window-padding-y = 8
window-decoration = true
```

### 3.5 Output File: `ports/ghostty/delightful-dark.conf`

Same structure, with `background`, `foreground`, `cursor-color`, and `cursor-text` swapped to dark theme values. The ANSI palette uses `palette.terminal.dark.ansi`.

```conf
# Delightful Dark — Ghostty color theme
# Generated from palettes/delightful.json v{version}

# Colors
background = #1b150f
foreground = #e8ddd3
cursor-color = #ff33c0
cursor-text = #1b150f
selection-background = #3a2030
selection-foreground = #e8ddd3

# ANSI palette
palette = 0=#1b150f
palette = 1=#ed324b
palette = 2=#22a448
palette = 3=#febf00
palette = 4=#00a6c0
palette = 5=#f600a3
palette = 6=#17c0d6
palette = 7=#e8ddd3
palette = 8=#6b5e52
palette = 9=#ff6b7f
palette = 10=#44d66a
palette = 11=#ffe066
palette = 12=#33cfea
palette = 13=#ff33c0
palette = 14=#55e8f0
palette = 15=#fdf8f3

# Font
font-family = "JetBrains Mono"
font-size = 14

# Window
window-padding-x = 12
window-padding-y = 8
window-decoration = true
```

### 3.6 Ghostty Color Properties

| Config Key | Source |
|---|---|
| `background` | `terminal.{theme}.background` |
| `foreground` | `terminal.{theme}.foreground` |
| `cursor-color` | `terminal.{theme}.cursor` |
| `cursor-text` | `terminal.{theme}.background` (inverse of cursor for readability) |
| `selection-background` | Derived from `accent-primary-subtle` (OKLCH->hex) |
| `selection-foreground` | `terminal.{theme}.foreground` |
| `palette = {index}=#{hex}` | `terminal.{theme}.ansi[index]` (indices 0-15) |

### 3.7 Font & Window Configuration

These are static values embedded in the emitter, not derived from the palette:

| Key | Value | Notes |
|---|---|---|
| `font-family` | `"JetBrains Mono"` | Matches system typography |
| `font-size` | `14` | Default terminal font size |
| `window-padding-x` | `12` | Horizontal window padding |
| `window-padding-y` | `8` | Vertical window padding |
| `window-decoration` | `true` | Show window chrome |

---

## 4. iTerm2 Emitter

### 4.1 File & Module

```
emitters/iterm2.mjs
```

### 4.2 Interface

```js
/**
 * @param {object} palette - Parsed palette JSON (validated against schema)
 * @param {object} [options] - Emitter options
 * @returns {{ files: Array<{ path: string, content: string }>, warnings: string[] }}
 */
export function emit(palette, options = {}) {
  // ...
  return {
    files: [
      { path: 'ports/iterm2/Delightful Light.itermcolors', content: '...' },
      { path: 'ports/iterm2/Delightful Dark.itermcolors', content: '...' }
    ],
    warnings: []
  };
}
```

### 4.3 Hex to RGB Float Conversion

iTerm2 `.itermcolors` files use RGB float values (0.0 to 1.0), not hex strings. The emitter converts each hex color component to a float:

```js
function hexToRGBFloats(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255.0;
  const g = parseInt(hex.slice(3, 5), 16) / 255.0;
  const b = parseInt(hex.slice(5, 7), 16) / 255.0;
  return { r, g, b };
}
```

Example: `#ed324b` becomes:
- Red: `237 / 255.0` = `0.929412`
- Green: `50 / 255.0` = `0.196078`
- Blue: `75 / 255.0` = `0.294118`

### 4.4 Output Format: Apple Property List (plist XML)

iTerm2 color profiles use the Apple plist XML format. Each color entry is a `<dict>` with typed color components.

### 4.5 Color Key Names

| iTerm2 Key | Source |
|---|---|
| `Background Color` | `terminal.{theme}.background` |
| `Foreground Color` | `terminal.{theme}.foreground` |
| `Bold Color` | `terminal.{theme}.foreground` |
| `Cursor Color` | `terminal.{theme}.cursor` |
| `Cursor Text Color` | `terminal.{theme}.background` |
| `Selected Text Color` | `terminal.{theme}.foreground` |
| `Selection Color` | Derived from `accent-primary-subtle` |
| `Ansi 0 Color` | `terminal.{theme}.ansi[0]` |
| `Ansi 1 Color` | `terminal.{theme}.ansi[1]` |
| `Ansi 2 Color` | `terminal.{theme}.ansi[2]` |
| `Ansi 3 Color` | `terminal.{theme}.ansi[3]` |
| `Ansi 4 Color` | `terminal.{theme}.ansi[4]` |
| `Ansi 5 Color` | `terminal.{theme}.ansi[5]` |
| `Ansi 6 Color` | `terminal.{theme}.ansi[6]` |
| `Ansi 7 Color` | `terminal.{theme}.ansi[7]` |
| `Ansi 8 Color` | `terminal.{theme}.ansi[8]` |
| `Ansi 9 Color` | `terminal.{theme}.ansi[9]` |
| `Ansi 10 Color` | `terminal.{theme}.ansi[10]` |
| `Ansi 11 Color` | `terminal.{theme}.ansi[11]` |
| `Ansi 12 Color` | `terminal.{theme}.ansi[12]` |
| `Ansi 13 Color` | `terminal.{theme}.ansi[13]` |
| `Ansi 14 Color` | `terminal.{theme}.ansi[14]` |
| `Ansi 15 Color` | `terminal.{theme}.ansi[15]` |

### 4.6 Color Entry XML Structure

Each color entry in the plist follows this exact format:

```xml
<key>Ansi 1 Color</key>
<dict>
    <key>Color Space</key>
    <string>sRGB</string>
    <key>Red Component</key>
    <real>0.929412</real>
    <key>Green Component</key>
    <real>0.196078</real>
    <key>Blue Component</key>
    <real>0.294118</real>
    <key>Alpha Component</key>
    <real>1.0</real>
</dict>
```

### 4.7 Full Plist XML Structure

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Ansi 0 Color</key>
    <dict>
        <key>Color Space</key>
        <string>sRGB</string>
        <key>Red Component</key>
        <real>0.105882</real>
        <key>Green Component</key>
        <real>0.082353</real>
        <key>Blue Component</key>
        <real>0.058824</real>
        <key>Alpha Component</key>
        <real>1.0</real>
    </dict>

    <key>Ansi 1 Color</key>
    <dict>
        <key>Color Space</key>
        <string>sRGB</string>
        <key>Red Component</key>
        <real>0.929412</real>
        <key>Green Component</key>
        <real>0.196078</real>
        <key>Blue Component</key>
        <real>0.294118</real>
        <key>Alpha Component</key>
        <real>1.0</real>
    </dict>

    <!-- ... Ansi 2 Color through Ansi 15 Color ... -->

    <key>Background Color</key>
    <dict>
        <key>Color Space</key>
        <string>sRGB</string>
        <key>Red Component</key>
        <real>0.992157</real>
        <key>Green Component</key>
        <real>0.972549</real>
        <key>Blue Component</key>
        <real>0.952941</real>
        <key>Alpha Component</key>
        <real>1.0</real>
    </dict>

    <key>Bold Color</key>
    <dict>
        <!-- ... same structure ... -->
    </dict>

    <key>Cursor Color</key>
    <dict>
        <!-- ... same structure ... -->
    </dict>

    <key>Cursor Text Color</key>
    <dict>
        <!-- ... same structure ... -->
    </dict>

    <key>Foreground Color</key>
    <dict>
        <!-- ... same structure ... -->
    </dict>

    <key>Selected Text Color</key>
    <dict>
        <!-- ... same structure ... -->
    </dict>

    <key>Selection Color</key>
    <dict>
        <!-- ... same structure ... -->
    </dict>
</dict>
</plist>
```

### 4.8 RGB Float Precision

Float values are output with 6 decimal places (e.g., `0.929412`, not `0.93`). This matches iTerm2's native precision for imported color profiles.

---

## 5. Error Handling

### Warnings (both emitters)

| Condition | Warning |
|---|---|
| ANSI array has fewer than 16 entries | `"{EmitterName}: terminal.{theme}.ansi has {n} entries, expected 16"` |
| Hex value doesn't match expected format | `"{EmitterName}: invalid hex '{value}' at ansi[{index}]"` |

### Errors (thrown, both emitters)

| Condition | Error |
|---|---|
| `palette.terminal` is missing | `"{EmitterName}: palette.terminal is missing"` |
| `palette.terminal.light` is missing | `"{EmitterName}: palette.terminal.light is missing"` |
| `palette.terminal.dark` is missing | `"{EmitterName}: palette.terminal.dark is missing"` |
| `terminal.{theme}.foreground` is missing | `"{EmitterName}: terminal.{theme}.foreground is required"` |
| `terminal.{theme}.background` is missing | `"{EmitterName}: terminal.{theme}.background is required"` |
| `terminal.{theme}.cursor` is missing | `"{EmitterName}: terminal.{theme}.cursor is required"` |
| `terminal.{theme}.ansi` is not an array | `"{EmitterName}: terminal.{theme}.ansi must be an array"` |

---

## 6. Output Files Summary

| Emitter | File | Path | Format |
|---|---|---|---|
| Ghostty | Light config | `ports/ghostty/delightful-light.conf` | Plain text key=value |
| Ghostty | Dark config | `ports/ghostty/delightful-dark.conf` | Plain text key=value |
| iTerm2 | Light profile | `ports/iterm2/Delightful Light.itermcolors` | Apple plist XML |
| iTerm2 | Dark profile | `ports/iterm2/Delightful Dark.itermcolors` | Apple plist XML |
