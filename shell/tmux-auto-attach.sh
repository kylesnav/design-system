#!/usr/bin/env bash
# tmux-auto-attach — Ghostty command hook for persistent tmux sessions
# =====================================================================
# Each Ghostty window gets its own tmux session. Sessions persist if
# a window closes — reopen and it reattaches. For agent team views,
# use tmux splits to attach to other sessions side by side.
#
# Usage in Ghostty config:
#   command = /path/to/tmux-auto-attach
#
# Session naming:
#   - With argument: uses that name (reattaches if it exists)
#   - Default: "1", "2", "3", etc.

# Ghostty's `command` runs with a minimal PATH — ensure Homebrew is available.
if [[ -x /opt/homebrew/bin/brew ]]; then
  eval "$(/opt/homebrew/bin/brew shellenv)"
elif [[ -x /usr/local/bin/brew ]]; then
  eval "$(/usr/local/bin/brew shellenv)"
fi

# No tmux? Just launch a normal shell.
if ! command -v tmux &>/dev/null; then
  exec "${SHELL:-/bin/zsh}" -l
fi

# Explicit session name — attach or create that specific session.
if [[ -n "${1:-}" ]]; then
  SESSION="$1"
  if tmux has-session -t "=$SESSION" 2>/dev/null; then
    exec tmux attach-session -t "=$SESSION"
  else
    exec tmux new-session -s "$SESSION"
  fi
fi

# Auto-name: find the lowest available numbered session.
N=1
while tmux has-session -t "=$N" 2>/dev/null; do
  # Session exists — but is it attached? Reuse detached sessions.
  if [[ "$(tmux display-message -t "=$N" -p '#{session_attached}')" == "0" ]]; then
    exec tmux attach-session -t "=$N"
  fi
  ((N++))
done

exec tmux new-session -s "$N"
