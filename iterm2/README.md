# iTerm2 — Delightful Theme

iTerm2 color profile derived from the Delightful Design System.

## Contents

```
Delightful.itermcolors    iTerm2 color profile (XML plist)
```

## Install

### Import via iTerm2 Settings

1. Open iTerm2
2. Go to **Settings > Profiles > Colors**
3. Click the **Color Presets...** dropdown (bottom right)
4. Select **Import...**
5. Navigate to `Delightful.itermcolors` and open it
6. Click **Color Presets...** again and select **Delightful**

### Import via command line

```bash
cp Delightful.itermcolors ~/Library/Application\ Support/iTerm2/DynamicProfiles/
```

Then restart iTerm2 and select the Delightful color preset in Settings > Profiles > Colors > Color Presets.

## Starship Prompt & Zsh

See [`shell/README.md`](../shell/README.md) for the shared Starship prompt and zsh config. These work with any terminal.

## Claude Code

After applying the iTerm2 theme, run `/config` in Claude Code and set the theme to **light-ansi**. This makes Claude Code inherit the Delightful palette from your terminal.

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
| iTerm2 | [gnachman/iTerm2](https://github.com/gnachman/iTerm2) | [iterm2.com](https://iterm2.com) |
| Claude Code | [anthropics/claude-code](https://github.com/anthropics/claude-code) | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) |
| Starship | [starship/starship](https://github.com/starship/starship) | [starship.rs](https://starship.rs) |
