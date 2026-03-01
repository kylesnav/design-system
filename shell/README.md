# Shell — Delightful Config

Shared Starship prompt, zsh config, and iTerm2 utilities using Delightful Design System colors. Works with any terminal (Ghostty, iTerm2, etc.).

See also [`ghostty/`](../ghostty/) and [`iterm2/`](../iterm2/) for terminal-specific themes.

## Contents

```
starship.toml       Starship prompt config using Delightful colors
zshrc-snippet       Zsh additions (starship, aliases, hooks)
smart-open          iTerm2 Cmd+click file routing (code → VS Code, HTML → Chrome, etc.)
```

## Install

The fastest way to set up shell config (along with your terminal theme) is the setup script:

```bash
# From the repository root
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

### smart-open (iTerm2 only)

Routes Cmd+click file paths to the right app — code files to VS Code (with line number support), HTML to Chrome, images and PDFs to Preview, directories to Finder.

1. Copy to your PATH:

```bash
mkdir -p ~/.local/bin
cp smart-open ~/.local/bin/smart-open
chmod +x ~/.local/bin/smart-open
```

2. In iTerm2, go to **Settings > Profiles > Advanced > Semantic History** and select **Run command...**:

```
"/Users/YOU/.local/bin/smart-open" "\1" "\2" "\5"
```

Replace `/Users/YOU` with your actual home directory path.

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

### smart-open

iTerm2 Semantic History handler that opens Cmd+clicked file paths intelligently:

| File Type | Opens In | Notes |
|-----------|----------|-------|
| Directories | Finder | |
| `.html` / `.htm` | Chrome | |
| Code files (40+ extensions) | VS Code | With `--goto` line number support |
| Extensionless code files | VS Code | Dockerfile, Makefile, CLAUDE.md, etc. |
| Images | Preview | png, jpg, gif, webp, heic, etc. |
| PDFs | Preview | |
| Everything else | Default app | Via macOS `open` |

Supports relative paths resolved against the working directory and line number passthrough from iTerm2.

## Terminal Compatibility

| Feature | Ghostty | iTerm2 | Other terminals |
|---------|---------|--------|-----------------|
| Starship prompt | Yes | Yes | Any terminal with Starship support |
| Zsh defaults | Yes | Yes | Any zsh shell |
| Quick terminal hook | Yes (1.3+) | No | No |
| Claude Code aliases | Yes | Yes | Any terminal |
| smart-open (Cmd+click) | No | Yes | No |

The Starship prompt and zsh config are terminal-agnostic. The quick terminal hook is Ghostty-specific (uses `GHOSTTY_QUICK_TERMINAL`). smart-open is iTerm2-specific (uses Semantic History).

## Claude Code

After applying the terminal theme and Starship prompt, run `/config` in Claude Code and set the theme to **light-ansi**. This makes Claude Code inherit the Delightful palette from your terminal.

## References

| Tool | Repo | Docs |
|------|------|------|
| Starship | [starship/starship](https://github.com/starship/starship) | [starship.rs](https://starship.rs) |
| Zsh | [zsh-users/zsh](https://github.com/zsh-users/zsh) | [zsh.sourceforge.io](https://zsh.sourceforge.io/Doc/) |
| Claude Code | [anthropics/claude-code](https://github.com/anthropics/claude-code) | [docs.anthropic.com](https://docs.anthropic.com/en/docs/claude-code) |
