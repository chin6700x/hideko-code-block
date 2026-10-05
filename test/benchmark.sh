#!/bin/bash

# ============================================================================
# Hideko Benchmark Runner Script (.sh)
# Compares Hideko vs PrismJS vs Highlight.js across different inputs & outputs
# ============================================================================

set -e

# Navigate to the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$ROOT_DIR"

echo "================================================================================"
echo "  🖥️  SYSTEM INFORMATION"
echo "================================================================================"
echo "  OS        : $(uname -s) $(uname -r) ($(uname -m))"
echo "  Node.js   : $(node -v)"
echo "  V8 Engine : $(node -p 'process.versions.v8')"
echo "  Date      : $(date '+%Y-%m-%d %H:%M:%S')"
echo "================================================================================"
echo ""

# Run the benchmark engine
node test/benchmark.js

exit 0
