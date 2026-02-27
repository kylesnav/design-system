# Shell — Delightful Config

Shared Starship prompt and zsh config using Delightful Design System colors. Works with any terminal (Ghostty, iTerm2, etc.).

## Contents

```
starship.toml       Starship prompt config using Delightful colors
zshrc-snippet       Zsh additions (starship, aliases, hooks)
```

## Install

The fastest way to set up shell config (along with your terminal theme) is the setup script:

```bash
bash scripts/setup-terminal.sh
```

Or install manually:

### Starship Prompt

```bash
brew install starship
cp starship.toml ~/.config/starship.toml
```

Add `eval "$(starship init zsh)"` to your `~/.zshrc`, or use the full `zshrc-snippet`.

### Zsh Snippet

Copy the snippet into your `~/.zshrc`, or source it:

```bash
source /path/to/zshrc-snippet
```

## What's Included

### Starship Prompt

Two-line prompt using Delightful accent colors:

| Element | Color | Details |
|---------|-------|---------|
| `>` prompt character | Pink (`#f600a3`) | Red on error, cyan in vim mode |
| Directory | Bold foreground | Truncated to 3 levels |
| Git branch | Pink | |
| Git status | Gold | Modified, staged, untracked indicators |
| Node / Python / Rust | Green / Gold / Red | Shown when in a project directory |
| Command duration | Muted | Shown for commands over 2 seconds |
| Clock | Muted | Right-aligned, HH:MM |

### Zsh Snippet

| Feature | Details |
|---------|---------|
| Quick terminal hook | Auto-launches Claude Code on `Option+Space` (Ghostty 1.3+) |
| `AUTO_CD` | Type a directory name to cd into it |
| `CORRECT` | Spell correction for mistyped commands |
| History | 50k entries, shared across sessions, no duplicates |
| Tab completion | Case-insensitive, menu-selectable |
| `c` | Alias for `claude` |
| `cc` | Alias for `claude --dangerously-skip-permissions` |
| `cr` | Alias for `claude --resume` |

All aliases clear the command line before launching.

Tip: `touch ~/.hushlogin` to suppress the macOS "Last login" message.

## References

| Tool | Repo | Docs |
|------|------|------|
| Starship | [starship/starship](https://github.com/starship/starship) | [starship.rs](https://starship.rs) |
| Zsh | [zsh-users/zsh](https://github.com/zsh-users/zsh) | [zsh.sourceforge.io](https://zsh.sourceforge.io/Doc/) |
