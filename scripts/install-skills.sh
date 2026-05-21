#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-all}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

CODEX_PATH="${CODEX_PATH:-${CODEX_HOME:-$HOME/.codex}/skills}"
CLAUDE_PATH="${CLAUDE_PATH:-$HOME/.claude/skills}"
CURSOR_PATH="${CURSOR_PATH:-$HOME/.cursor/skills-cursor}"
GEMINI_PATH="${GEMINI_PATH:-$HOME/.gemini/antigravity/skills}"

SKILLS=(
  "ace-programmer"
  "project-context"
  "system-architect"
  "repo-map-generator"
  "task-coder"
  "code-reviewer"
)

copy_skill() {
  local skill_name="$1"
  local destination_root="$2"
  local source="$REPO_ROOT/$skill_name"
  local destination="$destination_root/$skill_name"

  if [[ ! -f "$source/SKILL.md" ]]; then
    echo "Missing skill folder or SKILL.md: $source" >&2
    exit 1
  fi

  mkdir -p "$destination"
  rm -rf "$destination"
  mkdir -p "$destination_root"
  cp -R "$source" "$destination_root/"
}

install_to_target() {
  local name="$1"
  local destination_root="$2"

  mkdir -p "$destination_root"
  for skill in "${SKILLS[@]}"; do
    copy_skill "$skill" "$destination_root"
  done
  echo "Installed to $name: $destination_root"
}

case "$TARGET" in
  all)
    install_to_target "codex" "$CODEX_PATH"
    install_to_target "claude" "$CLAUDE_PATH"
    install_to_target "cursor" "$CURSOR_PATH"
    install_to_target "gemini" "$GEMINI_PATH"
    ;;
  codex)
    install_to_target "codex" "$CODEX_PATH"
    ;;
  claude)
    install_to_target "claude" "$CLAUDE_PATH"
    ;;
  cursor)
    install_to_target "cursor" "$CURSOR_PATH"
    ;;
  gemini)
    install_to_target "gemini" "$GEMINI_PATH"
    ;;
  *)
    echo "Usage: scripts/install-skills.sh [all|codex|claude|cursor|gemini]" >&2
    exit 1
    ;;
esac

echo "Done. Reload skills in the target tool if needed."
