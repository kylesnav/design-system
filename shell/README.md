<h1 align="center">Delightful for Shell</h1>

<p align="center">
  Tmux, zsh config, and terminal utilities using <a href="https://github.com/kylesnav/delightful-design-system">Delightful Design System</a> colors.
  <br>
  Designed for Ghostty. iTerm2 supported as a standalone alternative.
</p>

---

## The Delightful Terminal Stack

This package is the session and config layer of a cohesive terminal experience:

| Package | Role |
|---------|------|
| [`ghostty/`](../ghostty/) | Terminal emulator — colors, fonts, keybinds |
| [`starship/`](../starship/) | Prompt — rainbow powerline segments |
| **`shell/`** (this package) | Session — tmux status bar, persistence, zsh config |
| [`claude-status-line/`](../claude-status-line/) | Claude Code status line *(coming soon)* |
| [`iterm2/`](../iterm2/) | iTerm2 color profiles (standalone alternative) |

## Prerequisites

**Nerd Font** — the tmux status bar and Starship prompt use powerline glyphs.

```sh
brew install --cask font-jetbrains-mono-nerd-font
```

## Install

The setup script installs everything at once:

```bash
bash ../scripts/setup-terminal.sh
```

Or install each piece manually:

### tmux

Copy the config:

```bash
cp tmux.conf ~/.tmux.conf
```

Install [TPM](https://github.com/tmux-plugins/tpm) (Tmux Plugin Manager):

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

Then press `prefix + I` (Ctrl+b, then Shift+i) inside tmux to install plugins.

> **iTerm2 users:** iTerm2 has native tmux integration (`tmux -CC`).
> You may prefer that over this config — see the [iTerm2 README](../iterm2/README.md).

#### Ghostty auto-attach (optional)

> **Note:** The Ghostty config works great without tmux. This is an opt-in
> addition for users who want persistent sessions across terminal restarts.

Each Ghostty window gets its own persistent tmux session (`1`, `2`, `3`, etc.).
Close a window → reopen → it reattaches to a detached session. For agent team
views, use tmux splits to watch multiple sessions.

```bash
mkdir -p ~/.local/bin
cp tmux-auto-attach.sh ~/.local/bin/tmux-auto-attach
chmod +x ~/.local/bin/tmux-auto-attach
```

In your Ghostty config:

```
command = /Users/YOU/.local/bin/tmux-auto-attach
```

Pass a name to pin a window to a specific session: `command = /path/to/tmux-auto-attach work`.

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

### tmux

| Feature | Details |
|---------|---------|
| Rainbow status bar | Powerline segments at the top of the terminal, matching the Delightful Starship aesthetic |
| Equalized splits | `prefix+\|` and `prefix+-` create panes that auto-equalize. `prefix+x` closes a pane. |
| Dynamic window names | Windows auto-rename: directory name when idle, Claude session name when Claude Code is running, command name otherwise |
| Dynamic tab titles | Ghostty tab bar shows session and context (e.g. `1 — myapp`, `1 — claude`) |
| Session restore | tmux-resurrect saves/restores sessions (`prefix+Ctrl+s` / `prefix+Ctrl+r`) |
| Vim-style navigation | `prefix+h/j/k/l` pane navigation, `prefix+\|` and `prefix+-` for splits |
| Mouse mode | Click panes to focus, drag dividers to resize, scroll — all enabled |
| Vi copy mode | `v` to select, `y` to yank to system clipboard |
| Sensible defaults | 256color, no escape delay, windows start at 1, 50k scrollback |

Status bar layout (top of terminal):

```
┌──────────────────────────────────────────────────────────────────────┐
│  main  myapp  ⠂ session  vim        hostname   Mar 26   14:30 │
│ (pink)  (gold)    (gray)   (gray)        (cyan)    (gray)   (dark) │
└──────────────────────────────────────────────────────────────────────┘
```

Windows auto-rename to the current context: directory name when idle in a shell, `claude` when Claude Code is running, or the command name for everything else.

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
| tmux config | Yes | Optional* | Any tmux-capable terminal |
| tmux auto-attach | Yes | No | No |
| Zsh config | Yes | Yes | Any zsh shell |
| Quick terminal | Yes (1.3+) | No | No |
| AI CLI aliases | Yes | Yes | Any terminal |
| smart-open | No | Yes | No |

\* iTerm2 users may prefer native tmux integration (`tmux -CC`).

## With Claude Code

After applying the terminal theme, run `/config` in Claude Code and set the theme to **light-ansi** or **dark-ansi** (matching your terminal theme). Claude Code inherits the Delightful palette from your terminal.

## License

[MIT](LICENSE)
