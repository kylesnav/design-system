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

# Let tmux clean up stale clients from a Ghostty restart.
if tmux list-sessions &>/dev/null; then
  sleep 0.3
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

# Reattach to any detached session (regardless of name/number).
DETACHED=$(tmux list-sessions -F '#{session_name} #{session_attached}' 2>/dev/null \
  | awk '$2=="0"{print $1; exit}')
if [[ -n "$DETACHED" ]]; then
  exec tmux attach-session -t "=$DETACHED"
fi

# No detached sessions — create a new one with the lowest available number.
N=1
while tmux has-session -t "=$N" 2>/dev/null; do
  ((N++))
done

exec tmux new-session -s "$N"
