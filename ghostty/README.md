# Ghostty — Delightful Theme

Ghostty terminal config derived from the Delightful Design System.

## Contents

```
ghostty-theme       Complete Ghostty config
shaders/            Optional GLSL shaders (vignette, bloom)
```

See also [`shell/`](../shell/) for the shared Starship prompt and zsh config.

## Quick Start

The fastest way to set up everything (Ghostty + Starship + zsh) is the setup script:

```bash
bash scripts/setup-terminal.sh
```

It detects Ghostty, copies the config, installs Starship, and tells you about any manual steps. Or install manually:

```bash
# 1. Install Starship prompt
brew install starship

# 2. Copy Starship config
cp shell/starship.toml ~/.config/starship.toml

# 3. Add to ~/.zshrc (if not already present)
eval "$(starship init zsh)"

# 4. Install Ghostty config (see below)

# 5. Restart Ghostty
```

## Install

### Full Config (replaces your existing config)

```bash
# macOS
cp ghostty-theme ~/Library/Application\ Support/com.mitchellh.ghostty/config

# Linux
cp ghostty-theme ~/.config/ghostty/config
```

### Colors Only (keep your own config)

```bash
mkdir -p ~/.config/ghostty/themes
cp ghostty-theme ~/.config/ghostty/themes/delightful
```

Then set `theme = delightful` in your Ghostty config.

### Shaders (optional)

Copy the shader files and uncomment the `custom-shader` lines in your config:

```bash
# macOS
cp shaders/*.glsl ~/Library/Application\ Support/com.mitchellh.ghostty/shaders/

# Linux
cp shaders/*.glsl ~/.config/ghostty/shaders/
```

Update the paths in your config to point to the copied files.

## Starship Prompt & Zsh

See [`shell/README.md`](../shell/README.md) for Starship and zsh setup instructions. These configs work with any terminal, not just Ghostty.

## Claude Code

After applying the Ghostty theme, run `/config` in Claude Code and set the theme to **light-ansi**. This makes Claude Code inherit the Delightful palette from your terminal.

## Quick Terminal

`Option+Space` opens a centered floating terminal from anywhere on macOS. The session persists between toggles — open it, type `cc` to start Claude Code, then toggle it away. Claude keeps running.

On Ghostty 1.3+, the `GHOSTTY_QUICK_TERMINAL` env var enables auto-launch via the zshrc snippet. On 1.2.x, type `cc` manually on first open.

## What's Included

### Ghostty Config

| Category | Details |
|----------|---------|
| **Typography** | JetBrains Mono (Ghostty default) at 14px. `font-thicken` enabled for macOS Retina. Stylistic alternates `cv02`-`cv04`, `cv11`. Explicit italic/bold/bold-italic styles. 20% extra line height. |
| **Colors** | Delightful light-mode palette mapped from OKLCH primitives to hex. Block cursor (no blink) in accent-primary pink. Pink selection highlight. 1.3 minimum contrast ratio. |
| **Window** | 16px horizontal / 12px top + 8px bottom padding. Tab-style titlebar. Session state persists across restarts. Unfocused splits dim to 90% opacity. |
| **Behavior** | Copy-on-select. No paste protection. Mouse hides while typing. Clickable URLs. Zsh shell integration (cursor shape, sudo detection, title updates). Option-as-alt. 10M line scrollback. |

### Keybinds

| Keybind | Action |
|---------|--------|
| `Cmd+D` | New split (right) |
| `Cmd+Shift+D` | New split (down) |
| `Ctrl+H/J/K/L` | Navigate splits (vim-style) |
| `Shift+Enter` | Literal newline |
| `Cmd+T` | New tab |
| `Cmd+W` | Close tab/split |
| `Cmd+1`-`5` | Switch to tab 1-5 |
| `Opt+Space` | Toggle quick terminal (global, works from any app) |
| `Cmd+Shift+P` | Open config file |
| `Cmd+Shift+,` | Reload config |

### Optional (commented out by default)

| Feature | Details |
|---------|---------|
| Glassmorphic background | Translucent terminal (88% opacity) with macOS backdrop blur |
| Shaders | Warm edge vignette + subtle text bloom (GLSL, hot-reloadable) |

## Ghostty vs iTerm2

Ghostty is minimal by default — no pane title bars, thin split dividers, auto-hiding scrollbars. If you use iTerm2 instead, see the [iTerm2 README](../iterm2/README.md) for recommended appearance settings to reduce chrome.

## Token Mapping

| Terminal Color | Design Token | Hex |
|----------------|--------------------------|-----------|
| Background | bg-page (light) | `#fdf8f3` |
| Foreground | text-primary (light) | `#1b150f` |
| Cursor | accent-primary (pink) | `#f600a3` |
| Selection BG | accent-primary-subtle | `#ffe6f4` |
| Black | neutral-950 | `#16100c` |
| Red | red-400 | `#ed324b` |
| Green | green-400 | `#22a448` |
| Yellow | gold-400 | `#febf00` |
| Blue | cyan-400 | `#00a6c0` |
| Magenta | pink-400 | `#f600a3` |
| Cyan | cyan-300 | `#17c0d6` |
| White | neutral-100 | `#f6f1eb` |
| Bright Black | neutral-600 | `#615d58` |
| Bright Red | red-300 | `#ff6e74` |
| Bright Green | green-300 | `#60c072` |
| Bright Yellow | gold-300 | `#ffcb3f` |
| Bright Blue | cyan-200 | `#88ddec` |
| Bright Magenta | pink-300 | `#ff5cb8` |
| Bright Cyan | cyan-200 | `#88ddec` |
| Bright White | white | `#ffffff` |

Blue slots use the cyan hue at different lightness levels since Delightful has no dedicated blue.

## References

| Tool | Repo | Docs |
|------|------|------|
| Ghostty | [ghostty-org/ghostty](https://github.com/ghostty-org/ghostty) | [ghostty.org/docs](https://ghostty.org/docs) |
| Claude Code | [anthropics/claude-code](https://github.com/anthropics/claude-code) | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) |
| JetBrains Mono | [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono) | [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/) |
