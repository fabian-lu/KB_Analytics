#!/bin/bash

# Install/update all dependencies (Python + Node.js)
# Make sure your venv is activated before running this

# Stop immediately if any command fails
set -e

# Find the folder where this script lives (so it works from any directory)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Installing Python dependencies..."

# Find all requirements.txt files, but skip .venv folder
for req in $(find "$SCRIPT_DIR" -name "requirements.txt" -not -path "*/.venv/*"); do
    echo "  -> $req"
    pip install -r "$req"
done

echo ""
echo "Installing frontend dependencies..."

if [ -d "$SCRIPT_DIR/frontend" ]; then
    cd "$SCRIPT_DIR/frontend"
    npm install
    echo "  -> frontend/package.json"
else
    echo "  -> No frontend directory found, skipping"
fi

echo ""
echo "Done!"
