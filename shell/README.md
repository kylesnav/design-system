<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="screenshots/Starship-Dark.png" />
    <source media="(prefers-color-scheme: light)" srcset="screenshots/Starship-Light.png" />
    <img src="screenshots/Starship-Light.png" width="600" alt="Starship prompt — Delightful" />
  </picture>
</p>

<h1 align="center">Delightful for Shell</h1>

<p align="center">
  Starship prompt, zsh config, and terminal utilities using <a href="https://github.com/kylesnav/delightful-design-system">Delightful Design System</a> colors.
  <br>
  Works with any terminal.
</p>

---

## Install

The setup script installs everything at once (Starship prompt, zsh config, terminal theme):

```bash
bash ../scripts/setup-terminal.sh
```

Or install each piece manually:

### Starship Prompt

```bash
brew install starship
cp starship.toml ~/.config/starship.toml
```

Add `eval "$(starship init zsh)"` to your `~/.zshrc`, or use the full zshrc-snippet below.

### Zsh Config

Source the snippet in your `~/.zshrc`:

```bash
source /path/to/zshrc-snippet
```

### smart-open (iTerm2 only)

Routes Cmd+click file paths to the right app — code files to VS Code (with line number support), HTML to Chrome, images to Preview.

```bash
mkdir -p ~/.local/bin
cp smart-open ~/.local/bin/smart-open
chmod +x ~/.local/bin/smart-open
```

In iTerm2: **Settings > Profiles > Advanced > Semantic History > Run command...**

```
"/Users/YOU/.local/bin/smart-open" "\1" "\2" "\5"
```

## What's Included

### Starship Prompt

Two-line prompt using Delightful accent colors:

| Element | Color | Details |
|---------|-------|---------|
| `>` prompt character | Pink | Red on error, cyan in vim mode |
| Directory | Bold | Truncated to 3 levels |
| Git branch | Pink | |
| Git status | Gold | Modified, staged, untracked |
| Language versions | Green / Gold / Red | Node, Python, Rust |
| Command duration | Muted | Commands over 2 seconds |
| Clock | Muted | Right-aligned, HH:MM |

### Zsh Config

| Feature | Details |
|---------|---------|
| Quick terminal | Auto-launches Claude Code on `Option+Space` (Ghostty 1.3+) |
| History | 50k entries, shared across sessions, no duplicates |
| Tab completion | Case-insensitive, menu-selectable |
| `AUTO_CD` | Type a directory name to cd into it |
| `CORRECT` | Spell correction for mistyped commands |

<details>
<summary><strong>AI CLI aliases</strong></summary>

<br>

All aliases clear the visible screen (preserving scrollback) before launching.

| Alias | Command |
|-------|---------|
| `c` | `claude` |
| `cc` | `claude --dangerously-skip-permissions` |
| `cr` | `claude --resume` |
| `ccr` | `claude --dangerously-skip-permissions --resume` |
| `x` | `codex` |
| `xx` | `codex --full-auto` |
| `xr` | `codex resume` |
| `xxr` | `codex --full-auto resume` |
| `g` | `gemini` |
| `gg` | `gemini --yolo` |
| `gr` | `gemini --resume latest` |
| `ggr` | `gemini --yolo --resume latest` |

Tip: `touch ~/.hushlogin` to suppress the macOS "Last login" message.

</details>

### smart-open

iTerm2 Semantic History handler for Cmd+click file paths:

| File Type | Opens In |
|-----------|----------|
| Code files (40+ extensions) | VS Code (with `--goto` line numbers) |
| Extensionless code files | VS Code (Dockerfile, Makefile, etc.) |
| `.html` / `.htm` | Chrome |
| Images, PDFs | Preview |
| Directories | Finder |
| Everything else | Default app |

## Terminal Compatibility

| Feature | Ghostty | iTerm2 | Other |
|---------|---------|--------|-------|
| Starship prompt | Yes | Yes | Any terminal |
| Zsh config | Yes | Yes | Any zsh shell |
| Quick terminal | Yes (1.3+) | No | No |
| AI CLI aliases | Yes | Yes | Any terminal |
| smart-open | No | Yes | No |

## With Claude Code

After applying the terminal theme and Starship prompt, run `/config` in Claude Code and set the theme to **light-ansi** or **dark-ansi** (matching your terminal theme). Claude Code inherits the Delightful palette from your terminal.

## Related

- [`ghostty/`](../ghostty/) — Ghostty terminal theme
- [`iterm2/`](../iterm2/) — iTerm2 color profiles

## License

[MIT](LICENSE)
