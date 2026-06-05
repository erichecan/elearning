#!/usr/bin/env bash
# Install the nightly image generation launchd job.
# Run once: bash scripts/install-launchd.sh
set -euo pipefail

PLIST_SRC="$(cd "$(dirname "$0")" && pwd)/com.elearning.imagegen.plist"
PLIST_DEST="$HOME/Library/LaunchAgents/com.elearning.imagegen.plist"

echo "Installing launchd agent..."
cp "$PLIST_SRC" "$PLIST_DEST"
launchctl unload "$PLIST_DEST" 2>/dev/null || true
launchctl load "$PLIST_DEST"
echo "Loaded: com.elearning.imagegen (runs daily at 02:00)"

# Schedule a pmset wake at 01:58 so the Mac is already awake when launchd fires at 02:00.
# pmset requires sudo. If this fails, the launchd job will still run — it just won't wake
# the Mac from sleep. The job will catch up on the next boot or manual run.
echo ""
echo "Setting nightly wake time via pmset (requires sudo)..."
if sudo pmset repeat wake MTWRFSU 01:58:00; then
    echo "pmset wake scheduled: every day at 01:58"
else
    echo "pmset failed (no sudo access?). Launchd job is still registered but Mac must"
    echo "be awake at 02:00 for it to run. You can manually trigger any time with:"
    echo "  node scripts/generate-images-codex.mjs"
fi

echo ""
echo "Done. Check logs at: /tmp/elearning-imagegen.log"
echo "Manual trigger: node scripts/generate-images-codex.mjs"
echo "Uninstall: launchctl unload ~/Library/LaunchAgents/com.elearning.imagegen.plist"
