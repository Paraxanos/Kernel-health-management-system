#!/bin/bash
# auto_test.sh - Adaptive KHMS stress test launcher

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AGENT_BIN="$SCRIPT_DIR/../khms_agent"
PAYLOAD_BIN="$SCRIPT_DIR/khms_payload"

# Build if missing
if [ ! -f "$AGENT_BIN" ]; then
    echo "⚠️  Building khms_agent..."
    make -C "$SCRIPT_DIR/.." >/dev/null
fi

if [ ! -f "$PAYLOAD_BIN" ]; then
    echo "⚠️  Building khms_payload..."
    gcc -o "$PAYLOAD_BIN" "$SCRIPT_DIR/khms_payload.c" -lpthread -w
fi

CORES=$(nproc)
echo "🔧 Detected $CORES CPU cores"

# Cleanup function
cleanup() {
    echo -e "\n🧹 Cleaning up background processes..."
    killall khms_payload 2>/dev/null || true
    killall khms_agent 2>/dev/null || true
    exit 0
}
trap cleanup SIGINT SIGTERM

echo "🚀 Starting KHMS agent (will POST to localhost:3000)..."
"$AGENT_BIN" &
AGENT_PID=$!

sleep 2

echo "🔥 Launching CPU pressure (threads=$CORES, duration=30s)..."
"$PAYLOAD_BIN" cpu --threads="$CORES" --duration=30 &

echo "🌀 Launching CS storm (threads=$((2*CORES)), duration=20s)..."
"$PAYLOAD_BIN" cs --threads=$((2*CORES)) --duration=20 &

# Wait for agent to finish (it runs once and exits)
wait $AGENT_PID 2>/dev/null || true

echo "✅ Test cycle complete. Check UI at http://localhost:3000"