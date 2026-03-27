# Delightful Starship — Design Spec

**Linear:** KS-36
**Date:** 2026-03-24
**Status:** Approved

## Overview

New port: Delightful color system applied to the [Gruvbox Rainbow](https://starship.rs/presets/gruvbox-rainbow) Starship preset structure. This is a **color theme modification** of the Gruvbox Rainbow preset — the structural layout (powerline segments, module ordering, Nerd Font symbols) comes from that preset; the color palette is replaced with Delightful OKLCH-derived hex values.

Extracts `starship.toml` from `shell/` into its own `starship/` package directory, unblocking the shell refactor (KS-33).

## Color Palette

### Dark Mode (primary)

Uses Gruvbox Rainbow palette key names mapped to Delightful hex values for structural parity with upstream.

| Delightful Token | Hex       | Gruvbox Key      |
|------------------|-----------|------------------|
| Pink             | `#f600a3` | `color_orange`, `color_purple` |
| Gold             | `#febf00` | `color_yellow`   |
| Green            | `#22a448` | `color_aqua`, `color_green` |
| Cyan             | `#00a6c0` | `color_blue`     |
| Red              | `#ed324b` | `color_red`      |
| Neutral          | `#615d58` | `color_bg3`      |
| BG               | `#3c3632` | `color_bg1`      |
| FG               | `#fdf8f3` | `color_fg0`      |

### Light Mode (comment block variant)

| Delightful Token | Hex       |
|------------------|-----------|
| Pink             | `#ff4fa8` |
| Gold             | `#f5c526` |
| Green            | `#3aad5f` |
| Cyan             | `#5cb8d6` |
| Red              | `#e8554c` |
| Neutral          | `#9a958f` |
| BG               | `#d4cfc9` |
| FG               | `#1b150f` |

## Segment Flow

Exact Gruvbox Rainbow structure with Delightful colors:

```
[Pink: OS/User] → [Gold: Dir] → [Green: Git] → [Cyan: Lang] → [Neutral: Docker] → [BG: Time]
```

- **Pink** — `os`, `username`
- **Gold** — `directory` (project path, truncated to 3 segments)
- **Green** — `git_branch`, `git_status`
- **Cyan** — all language modules (nodejs, python, rust, c, cpp, golang, php, java, kotlin, haskell)
- **Neutral** — `docker_context`, `conda`, `pixi`
- **BG** — `time`

Red is reserved for the error prompt symbol only.

## Starship Features

- **Palette-based theming:** Uses Starship's `[palettes]` feature with `delightful_dark` as the active palette. `delightful_light` is included as a commented TOML block at the bottom for easy swapping.
- **Powerline segments:** Chevron (``) transitions between colored segments, matching Gruvbox Rainbow's visual style.
- **Nerd Font symbols:** All module icons use Nerd Font glyphs (requires JetBrains Mono Nerd Font).
- **Two-line prompt:** Segments on line 1, character prompt (`❯` / `❯` error) on line 2.
- **Vim mode indicators:** Success, error, and vimcmd symbols using palette colors.

## Modules

Full Gruvbox Rainbow module set with Delightful colors:

| Module           | Segment Color | Symbol |
|------------------|---------------|--------|
| `os`             | Pink          | (per OS)|
| `username`       | Pink          | —      |
| `directory`      | Gold          | —      |
| `git_branch`     | Green         | ``    |
| `git_status`     | Green         | (status)|
| `nodejs`         | Cyan          | ``    |
| `python`         | Cyan          | ``    |
| `rust`           | Cyan          | ``    |
| `c`, `cpp`, etc. | Cyan          | (per lang)|
| `docker_context` | Neutral       | ``    |
| `time`           | BG            | ``    |
| `character`      | Green/Red     | (arrow)|

### Directory Substitutions

Carried over from Gruvbox Rainbow:
- Documents → `󰈙`
- Downloads → ``
- Music → `󰝚`
- Pictures → ``
- Developer → `󰲋`

## File Changes

### Create

- **`starship/starship.toml`** — Full config with `delightful_dark` palette active, `delightful_light` as commented block.
- **`starship/README.md`** — Install instructions, Nerd Font requirement (`brew install --cask font-jetbrains-mono-nerd-font`), credits Gruvbox Rainbow preset.
- **`starship/LICENSE`** — MIT, matching repo root LICENSE.

### Delete

- **`shell/starship.toml`** — Moved to `starship/`.

### Modify

- **`shell/README.md`** — Remove Starship-specific content, add reference pointing to `starship/`.

## Attribution

README includes: "Based on the [Gruvbox Rainbow](https://starship.rs/presets/gruvbox-rainbow) Starship preset, re-themed with the Delightful color system."
