#!/usr/bin/env bash
set -euo pipefail

# Resolve repository root regardless of invocation path
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

INSTALL_DEPS=true

for arg in "$@"; do
  case "$arg" in
    --skip-install)
      INSTALL_DEPS=false
      ;;
    --help|-h)
      echo "Usage: $(basename "$0") [--skip-install]"
      echo "  --skip-install   reuse existing node_modules instead of running npm ci"
      exit 0
      ;;
  esac
done

if ! command -v node >/dev/null 2>&1; then
  echo "Error: Node.js is required but was not found in PATH." >&2
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Error: npm is required but was not found in PATH." >&2
  exit 1
fi

cd "$REPO_ROOT"

if "$INSTALL_DEPS"; then
  echo "Installing dependencies with npm ci..."
  npm ci
else
  echo "Skipping dependency installation as requested."
fi

echo "Starting Phaser dev server..."

# Webpack 4 relies on MD4 hashing, which requires the legacy OpenSSL provider on Node 17+.
export NODE_OPTIONS="--openssl-legacy-provider${NODE_OPTIONS:+ $NODE_OPTIONS}"

# --no-install ensures we use the locally installed webpack-dev-server
npx --no-install webpack-dev-server --config webpack/base.js --open
