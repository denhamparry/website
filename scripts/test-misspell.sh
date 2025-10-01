#!/bin/bash
set -e

echo "🔍 Testing misspell on talks content..."

# Install misspell if not present
if ! command -v misspell &> /dev/null; then
    echo "Installing misspell..."
    go install github.com/client9/misspell/cmd/misspell@latest
fi

# Extract readable content from talks markdown (excludes URLs, code, etc.)
echo "Extracting readable content from talks..."
node scripts/extract-content.js

# Build ignore arguments from .misspell-ignore file
echo "Building ignore list from .misspell-ignore..."
IGNORE_ARGS=""
while IFS= read -r word; do
    # Skip comments and empty lines
    [[ "$word" =~ ^#.*$ ]] && continue
    [[ -z "$word" ]] && continue
    IGNORE_ARGS="$IGNORE_ARGS -i $word"
done < .misspell-ignore

# Run misspell on extracted content with British English and ignore list
echo "Running misspell on extracted content with ignore list..."
if [ -f ".talks-content-only.txt" ]; then
    misspell -locale UK "$IGNORE_ARGS" .talks-content-only.txt

    # Clean up temporary file
    rm .talks-content-only.txt
    echo "✅ Misspell check complete!"
else
    echo "❌ Failed to extract content from talks.md"
    exit 1
fi
