#!/usr/bin/env bash
set -euo pipefail

REPO=""
VERSION="latest"
TARGET="all"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo)
      REPO="$2"
      shift 2
      ;;
    --version)
      VERSION="$2"
      shift 2
      ;;
    --target)
      TARGET="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
  esac
done

if [[ -z "$REPO" ]]; then
  echo "Usage: scripts/install-from-release.sh --repo owner/repo [--version v1.0.0] [--target all|codex|claude|cursor|gemini]" >&2
  exit 1
fi

ASSET_NAME="spec-os-skills.zip"
if [[ "$VERSION" == "latest" ]]; then
  DOWNLOAD_URL="https://github.com/$REPO/releases/latest/download/$ASSET_NAME"
else
  DOWNLOAD_URL="https://github.com/$REPO/releases/download/$VERSION/$ASSET_NAME"
fi

TEMP_ROOT="$(mktemp -d)"
cleanup() {
  rm -rf "$TEMP_ROOT"
}
trap cleanup EXIT

ZIP_PATH="$TEMP_ROOT/$ASSET_NAME"
EXTRACT_PATH="$TEMP_ROOT/extract"

echo "Downloading: $DOWNLOAD_URL"
curl -L "$DOWNLOAD_URL" -o "$ZIP_PATH"
mkdir -p "$EXTRACT_PATH"
unzip -q "$ZIP_PATH" -d "$EXTRACT_PATH"

INSTALLER="$(find "$EXTRACT_PATH" -name install-skills.sh -type f | head -n 1)"
if [[ -z "$INSTALLER" ]]; then
  echo "install-skills.sh not found in release package." >&2
  exit 1
fi

bash "$INSTALLER" "$TARGET"
