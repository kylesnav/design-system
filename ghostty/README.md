# Ghostty — Delightful Theme

Color themes and personal config for Ghostty, derived from the Delightful Design System.

## Contents

```
themes/
  delightful-light    Color-only theme (installable via Ghostty's theme system)
  delightful-dark     Color-only dark variant
config                Personal config (fonts, keybinds, window — references theme)
shaders/              Optional GLSL shaders (vignette, bloom)
```

See also [`shell/`](../shell/) for the shared Starship prompt and zsh config.

## Install Themes

Copy the theme files to Ghostty's theme directory:

```bash
# macOS / Linux
mkdir -p ~/.config/ghostty/themes
cp themes/delightful-light themes/delightful-dark ~/.config/ghostty/themes/
```

Then add to your Ghostty config:

```
theme = delightful-light
```

Or for dark mode:

```
theme = delightful-dark
```

## Install Full Config (optional)

If you want the complete Delightful experience (fonts, keybinds, shaders):

```bash
# macOS
cp config ~/Library/Application\ Support/com.mitchellh.ghostty/config

# Linux
cp config ~/.config/ghostty/config
```

Or use the setup script which handles Ghostty + Starship + zsh:

```bash
bash scripts/setup-terminal.sh
```

## Shaders (optional)

Copy the shader files and uncomment the `custom-shader` lines in your config:

```bash
# macOS
cp shaders/*.glsl ~/Library/Application\ Support/com.mitchellh.ghostty/shaders/

# Linux
cp shaders/*.glsl ~/.config/ghostty/shaders/
```

## Claude Code

After applying the theme, run `/config` in Claude Code and set the theme to **light-ansi**. This makes Claude Code inherit the Delightful palette from your terminal.

## Quick Terminal

`Option+Space` opens a centered floating terminal from anywhere on macOS. The session persists between toggles — open it, type `cc` to start Claude Code, then toggle it away.

## Token Mapping

| Terminal Color | Design Token | Light Hex | Dark Hex |
|----------------|--------------------------|-----------|-----------|
| Background | bg-page | `#fdf8f3` | `#1e1a16` |
| Foreground | text-primary | `#1b150f` | `#eee9e3` |
| Cursor | accent-primary (pink) | `#f600a3` | `#ff4fa8` |
| Selection BG | accent-primary-subtle | `#ffe6f4` | `#3d2235` |
| Black | neutral-950 | `#16100c` | `#1e1a16` |
| Red | red-400 | `#ed324b` | `#e8554c` |
| Green | green-400 | `#22a448` | `#3aad5f` |
| Yellow | gold-400 | `#febf00` | `#f5c526` |
| Blue | cyan-400 | `#00a6c0` | `#5cb8d6` |
| Magenta | pink-400 | `#f600a3` | `#ff4fa8` |
| Cyan | cyan-300 | `#17c0d6` | `#5cb8d6` |
| White | neutral-100 | `#f6f1eb` | `#eee9e3` |

Blue slots use the cyan hue at different lightness levels since Delightful has no dedicated blue.

## References

| Tool | Repo | Docs |
|------|------|------|
| Ghostty | [ghostty-org/ghostty](https://github.com/ghostty-org/ghostty) | [ghostty.org/docs](https://ghostty.org/docs) |
| Claude Code | [anthropics/claude-code](https://github.com/anthropics/claude-code) | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) |
| JetBrains Mono | [JetBrains/JetBrainsMono](https://github.com/JetBrains/JetBrainsMono) | [jetbrains.com/lp/mono](https://www.jetbrains.com/lp/mono/) |
