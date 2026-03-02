---
title: "Starship Emitter Specification"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Starship Emitter Specification

> Defines how `palettes/delightful.json` terminal hex values are transformed into a Starship shell prompt configuration file (`starship.toml`) with color-coded prompt segments.

Cross-references: [[palette-schema]] (input format, terminal section), [[terminal-emitters]] (shared hex values), [[orchestrator]] (build pipeline).

---

## 1. File & Module

```
emitters/starship.mjs
```

Pure function module. No file I/O -- returns output strings for the orchestrator to write.

---

## 2. Interface

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
      { path: 'ports/starship/starship.toml', content: '...' }
    ],
    warnings: []
  };
}
```

### Contract

- **Input**: The full palette object (already validated).
- **Output**: A single TOML configuration file plus any warnings.
- **Pure function**: No side effects, no file reads, no network calls.

---

## 3. Input: Palette JSON Keys Used

| Key | Purpose |
|---|---|
| `terminal.light` | Hand-tuned hex values for light theme prompt colors |
| `terminal.dark` | Hand-tuned hex values for dark theme prompt colors |
| `name` | Palette name for the file header comment |
| `version` | Palette version for the file header comment |

The emitter reads `foreground`, `background`, `cursor`, and `ansi` values from `palette.terminal.light` and `palette.terminal.dark`. These are hex-authoritative values -- NOT derived from OKLCH.

---

## 4. Output: `ports/starship/starship.toml`

### 4.1 TOML Format

Starship uses TOML configuration. Colors are specified as hex strings (without the `#` prefix for some formats, or with `#` depending on the Starship module).

### 4.2 Color Mapping Strategy

The Starship config maps Delightful's ANSI palette to prompt segments using hex color values. The primary theme (light) is used as the default configuration, with comments indicating dark theme alternatives.

### 4.3 Output File Structure

```toml
# Delightful — Starship prompt theme
# Generated from palettes/delightful.json v{version}
# Theme: Uses light palette colors by default.
# For dark theme, swap the color values as noted in comments.

format = """
$username\
$hostname\
$directory\
$git_branch\
$git_status\
$nodejs\
$python\
$rust\
$golang\
$cmd_duration\
$line_break\
$character"""

[character]
success_symbol = "[>](bold #f600a3)"
error_symbol = "[>](bold #ed324b)"

[username]
style_user = "bold #f600a3"
style_root = "bold #ed324b"
format = "[$user]($style) "
show_always = false

[hostname]
style = "bold #00a6c0"
format = "[@$hostname]($style) "

[directory]
style = "bold #1b150f"
truncation_length = 3
truncation_symbol = ".../"
format = "[$path]($style)[$read_only]($read_only_style) "

[git_branch]
style = "bold #f600a3"
format = "[$symbol$branch]($style) "
symbol = " "

[git_status]
style = "bold #ed324b"
format = '([$all_status$ahead_behind]($style) )'
ahead = "#22a448"
behind = "#ed324b"
modified = "#febf00"
untracked = "#00a6c0"
staged = "#22a448"
deleted = "#ed324b"

[nodejs]
style = "bold #22a448"
format = "[$symbol($version)]($style) "

[python]
style = "bold #febf00"
format = "[$symbol($version)]($style) "

[rust]
style = "bold #ed324b"
format = "[$symbol($version)]($style) "

[golang]
style = "bold #00a6c0"
format = "[$symbol($version)]($style) "

[cmd_duration]
style = "bold #6b5e52"
min_time = 2_000
format = "[$duration]($style) "

[line_break]
disabled = false
```

### 4.4 Color Assignments

| Segment | Color Source | Hex Value (Light) | Semantic Role |
|---|---|---|---|
| Character success | `ansi[5]` (Magenta) | `#f600a3` | Primary brand accent |
| Character error | `ansi[1]` (Red) | `#ed324b` | Error/danger |
| Username | `ansi[5]` (Magenta) | `#f600a3` | Brand accent |
| Username root | `ansi[1]` (Red) | `#ed324b` | Danger highlight for root |
| Hostname | `ansi[4]` (Blue/Cyan) | `#00a6c0` | Info/link color |
| Directory | `foreground` | `#1b150f` | Primary text |
| Git branch | `ansi[5]` (Magenta) | `#f600a3` | Brand accent |
| Git status | `ansi[1]` (Red) | `#ed324b` | Status indicators |
| Git ahead | `ansi[2]` (Green) | `#22a448` | Success |
| Git behind | `ansi[1]` (Red) | `#ed324b` | Warning |
| Git modified | `ansi[3]` (Yellow) | `#febf00` | Changed |
| Git untracked | `ansi[4]` (Blue) | `#00a6c0` | New/info |
| Git staged | `ansi[2]` (Green) | `#22a448` | Ready/success |
| Git deleted | `ansi[1]` (Red) | `#ed324b` | Removed |
| Node.js | `ansi[2]` (Green) | `#22a448` | Node green |
| Python | `ansi[3]` (Yellow) | `#febf00` | Python yellow |
| Rust | `ansi[1]` (Red) | `#ed324b` | Rust red |
| Go | `ansi[4]` (Blue) | `#00a6c0` | Go cyan |
| Duration | `ansi[8]` (Bright Black) | `#6b5e52` | Muted/secondary |

---

## 5. Generation Logic

```
1. Read palette.terminal.light and palette.terminal.dark
2. Extract foreground, background, cursor, and ansi[0-15] hex values
3. Build TOML string using light theme hex values as defaults
4. Include dark theme values as TOML comments for user reference
5. Return { files: [{ path, content }], warnings: [] }
```

The emitter uses string template interpolation to build the TOML output. No TOML parsing library is needed -- the output is simple enough for template-based generation.

---

## 6. Error Handling

### Warnings

| Condition | Warning |
|---|---|
| ANSI array has fewer than 16 entries | `"StarshipEmitter: terminal.{theme}.ansi has {n} entries, expected 16"` |

### Errors (thrown)

| Condition | Error |
|---|---|
| `palette.terminal` is missing | `"StarshipEmitter: palette.terminal is missing"` |
| `palette.terminal.light` is missing | `"StarshipEmitter: palette.terminal.light is missing"` |
| `palette.terminal.light.foreground` is missing | `"StarshipEmitter: terminal.light.foreground is required"` |
| `palette.terminal.light.ansi` is not an array | `"StarshipEmitter: terminal.light.ansi must be an array"` |

---

## 7. Output Files Summary

| File | Path | Format |
|---|---|---|
| Starship config | `ports/starship/starship.toml` | TOML |
