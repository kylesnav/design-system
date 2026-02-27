#!/usr/bin/env bash
# Delightful Design System — Terminal Setup
# ==========================================
# Installs Ghostty, iTerm2, and shell configs from the repo.
# Safe to re-run — skips matching configs, backs up before replacing.
#
# Usage:
#   bash scripts/setup-terminal.sh          (interactive — pick components)
#   bash scripts/setup-terminal.sh --all    (install everything detected)

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MANUAL_STEPS=()

# --- Helpers ---

info()  { printf '\033[1;36m→\033[0m %s\n' "$1"; }
ok()    { printf '\033[1;32m✓\033[0m %s\n' "$1"; }
skip()  { printf '\033[1;33m⊘\033[0m %s\n' "$1"; }
warn()  { printf '\033[1;33m!\033[0m %s\n' "$1"; }
manual(){ MANUAL_STEPS+=("$1"); }

confirm() {
  if [[ "${ALL:-}" == "1" ]]; then return 0; fi
  printf '\033[1;36m?\033[0m %s [Y/n] ' "$1"
  read -r ans
  [[ -z "$ans" || "$ans" =~ ^[Yy] ]]
}

# --- Detect environment ---

detect_os() {
  case "$(uname)" in
    Darwin) echo "macos" ;;
    Linux)  echo "linux" ;;
    *)      echo "unknown" ;;
  esac
}

OS="$(detect_os)"

has_ghostty() {
  command -v ghostty &>/dev/null || [[ -d "/Applications/Ghostty.app" ]]
}

has_iterm2() {
  [[ -d "/Applications/iTerm.app" ]] || defaults read com.googlecode.iterm2 &>/dev/null
}

has_starship() {
  command -v starship &>/dev/null
}

# --- Ghostty ---

ghostty_config_dir() {
  if [[ "$OS" == "macos" ]]; then
    echo "$HOME/Library/Application Support/com.mitchellh.ghostty"
  else
    echo "$HOME/.config/ghostty"
  fi
}

install_ghostty() {
  local config_dir
  config_dir="$(ghostty_config_dir)"
  local config_file="$config_dir/config"

  info "Ghostty config"

  if [[ -f "$config_file" ]]; then
    if diff -q "$REPO_DIR/ghostty/ghostty-theme" "$config_file" &>/dev/null; then
      ok "Ghostty config already matches — skipping"
      return
    fi
    if confirm "Ghostty config exists at $config_file. Replace it?"; then
      cp "$config_file" "$config_file.backup.$(date +%s)"
      ok "Backed up existing config"
      cp "$REPO_DIR/ghostty/ghostty-theme" "$config_file"
      ok "Ghostty config installed"
    else
      skip "Ghostty config — kept existing"
    fi
  else
    mkdir -p "$config_dir"
    cp "$REPO_DIR/ghostty/ghostty-theme" "$config_file"
    ok "Ghostty config installed"
  fi

  # Shaders
  if confirm "Install optional GLSL shaders (vignette, bloom)?"; then
    local shader_dir="$config_dir/shaders"
    mkdir -p "$shader_dir"
    cp "$REPO_DIR/ghostty/shaders/"*.glsl "$shader_dir/" 2>/dev/null && \
      ok "Shaders copied to $shader_dir" || \
      skip "No shader files found"
    manual "Uncomment the custom-shader lines in your Ghostty config to enable shaders"
  fi

  manual "Restart Ghostty to apply changes"
}

# --- iTerm2 ---

install_iterm2() {
  info "iTerm2 config"

  # Color profile
  local profile_src="$REPO_DIR/iterm2/Delightful.itermcolors"
  if [[ -f "$profile_src" ]]; then
    if confirm "Import Delightful color profile into iTerm2?"; then
      open "$profile_src"
      ok "Color profile opened in iTerm2 — select it in Settings > Profiles > Colors > Color Presets"
      manual "In iTerm2: Settings > Profiles > Colors > Color Presets > select 'Delightful'"
    fi
  fi

  # Dark variant
  local dark_src="$REPO_DIR/iterm2/Delightful-Dark.itermcolors"
  if [[ -f "$dark_src" ]]; then
    if confirm "Also import Delightful Dark color profile?"; then
      open "$dark_src"
      ok "Dark color profile opened in iTerm2"
      manual "In iTerm2: Settings > Profiles > Colors > Color Presets > select 'Delightful-Dark' (if you want dark mode)"
    fi
  fi

  # Shift+Enter key mapping
  if confirm "Set Shift+Enter to newline (for multi-line Claude Code input)?"; then
    local plist="$HOME/Library/Preferences/com.googlecode.iterm2.plist"
    local key="0xd-0x20000-0x24"

    if [[ -f "$plist" ]]; then
      # Try to add the dict first (fails silently if it already exists)
      /usr/libexec/PlistBuddy -c "Add ':New Bookmarks:0:Keyboard Map:$key' dict" "$plist" 2>/dev/null || true
      /usr/libexec/PlistBuddy -c "Add ':New Bookmarks:0:Keyboard Map:$key:Action' integer 11" "$plist" 2>/dev/null || \
        /usr/libexec/PlistBuddy -c "Set ':New Bookmarks:0:Keyboard Map:$key:Action' 11" "$plist"
      /usr/libexec/PlistBuddy -c "Add ':New Bookmarks:0:Keyboard Map:$key:Text' string 0a" "$plist" 2>/dev/null || \
        /usr/libexec/PlistBuddy -c "Set ':New Bookmarks:0:Keyboard Map:$key:Text' 0a" "$plist"
      ok "Shift+Enter → newline mapped"
    else
      warn "iTerm2 plist not found — set this manually"
      manual "In iTerm2: Settings > Profiles > Keys > Key Mappings > add Shift+Enter → Send Hex Code → 0a"
    fi
  fi

  manual "Restart iTerm2 to apply changes"
  manual "In Claude Code: run /config and set theme to 'light-ansi' to inherit terminal colors"
}

# --- Shell (Starship + Zsh) ---

install_shell() {
  info "Shell config (Starship + Zsh)"

  # Starship binary
  if ! has_starship; then
    if confirm "Starship is not installed. Install via Homebrew?"; then
      if command -v brew &>/dev/null; then
        brew install starship
        ok "Starship installed"
      else
        warn "Homebrew not found"
        manual "Install Starship: https://starship.rs/#install"
      fi
    fi
  else
    ok "Starship already installed"
  fi

  # Starship config
  local starship_dest="$HOME/.config/starship.toml"
  local starship_src="$REPO_DIR/shell/starship.toml"

  if [[ -f "$starship_dest" ]]; then
    if diff -q "$starship_src" "$starship_dest" &>/dev/null; then
      ok "Starship config already matches — skipping"
    elif confirm "Starship config exists at $starship_dest. Replace it?"; then
      cp "$starship_dest" "$starship_dest.backup.$(date +%s)"
      ok "Backed up existing starship.toml"
      cp "$starship_src" "$starship_dest"
      ok "Starship config installed"
    else
      skip "Starship config — kept existing"
    fi
  else
    mkdir -p "$(dirname "$starship_dest")"
    cp "$starship_src" "$starship_dest"
    ok "Starship config installed"
  fi

  # Zsh snippet
  local zshrc="$HOME/.zshrc"
  local snippet_src="$REPO_DIR/shell/zshrc-snippet"

  if [[ -f "$zshrc" ]] && grep -q 'starship init zsh' "$zshrc"; then
    ok "Starship already initialized in .zshrc"
  else
    manual "Add the following to your ~/.zshrc (or source the snippet):"
    manual "  source $snippet_src"
    manual "Or copy individual sections from shell/zshrc-snippet into your ~/.zshrc"
  fi
}

# --- Main ---

main() {
  echo ""
  echo "  Delightful Design System — Terminal Setup"
  echo "  =========================================="
  echo ""

  if [[ "${1:-}" == "--all" ]]; then
    ALL=1
  fi

  local did_something=0

  if has_ghostty; then
    if confirm "Set up Ghostty theme?"; then
      install_ghostty
      did_something=1
    fi
    echo ""
  else
    skip "Ghostty not detected — skipping"
    echo ""
  fi

  if has_iterm2; then
    if confirm "Set up iTerm2 theme?"; then
      install_iterm2
      did_something=1
    fi
    echo ""
  else
    skip "iTerm2 not detected — skipping"
    echo ""
  fi

  if confirm "Set up shell config (Starship prompt + zsh)?"; then
    install_shell
    did_something=1
  fi

  echo ""

  # --- Manual steps summary ---
  if [[ ${#MANUAL_STEPS[@]} -gt 0 ]]; then
    echo "  ┌─────────────────────────────────────────┐"
    echo "  │         Manual steps remaining           │"
    echo "  └─────────────────────────────────────────┘"
    echo ""
    for step in "${MANUAL_STEPS[@]}"; do
      printf '  \033[1;33m▸\033[0m %s\n' "$step"
    done
    echo ""
  fi

  if [[ "$did_something" -eq 1 ]]; then
    ok "Setup complete"
  else
    info "Nothing to do"
  fi
}

main "$@"
