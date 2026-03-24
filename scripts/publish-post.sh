#!/bin/bash
# BaseRadar Auto-Publisher
# 1. Runs discover-topics.ts to pull trending signals from Reddit/HN/Dev.to/X/Paragraph
# 2. Picks best topic (discovered first, static queue fallback)
# 3. Generates post with live BotIndex data via Claude OAuth
# 4. Commits + pushes to GitHub → Vercel auto-deploys

set -e

REPO="/Users/cyberweasel/workspace/baseradar-app"
SCRIPTS="$REPO/scripts"
LOG="$SCRIPTS/.publish-log.json"
QUEUE_INDEX="$SCRIPTS/.queue-index"
DISCOVERED="$SCRIPTS/.discovered-topics.json"

cd "$REPO"

# ── Step 1: Discover trending topics ──────────────────────────────────────
echo "[publish] Running topic discovery..."
npx ts-node --project scripts/tsconfig.json scripts/discover-topics.ts || echo "[publish] Discovery failed — using static queue"

# ── Step 2: Pick topic (discovered or static) ─────────────────────────────
TOPIC=""

# Check discovered topics first
if [ -f "$DISCOVERED" ]; then
  CONSUMED=$(node -e "const d=require('$DISCOVERED'); console.log(d.consumed || 0)" 2>/dev/null || echo "0")
  TOPIC_COUNT=$(node -e "const d=require('$DISCOVERED'); console.log((d.topics||[]).length)" 2>/dev/null || echo "0")

  if [ "$CONSUMED" -lt "$TOPIC_COUNT" ]; then
    TOPIC=$(node -e "const d=require('$DISCOVERED'); console.log(d.topics[$CONSUMED])" 2>/dev/null || echo "")
    if [ -n "$TOPIC" ]; then
      # Advance consumed counter
      node -e "
        const fs=require('fs');
        const d=require('$DISCOVERED');
        d.consumed=(d.consumed||0)+1;
        fs.writeFileSync('$DISCOVERED', JSON.stringify(d, null, 2));
      " 2>/dev/null || true
      echo "[publish] Using discovered topic ($((CONSUMED+1))/$TOPIC_COUNT): $TOPIC"
    fi
  fi
fi

# Fall back to static queue
if [ -z "$TOPIC" ]; then
  INDEX=0
  if [ -f "$QUEUE_INDEX" ]; then
    INDEX=$(cat "$QUEUE_INDEX")
  fi

  TOPIC=$(npx ts-node --project scripts/tsconfig.json -e "
import { TOPIC_QUEUE } from './scripts/topic-queue';
const idx = ${INDEX} % TOPIC_QUEUE.length;
console.log(TOPIC_QUEUE[idx]);
" 2>/dev/null || echo "")

  if [ -z "$TOPIC" ]; then
    echo "[publish] ERROR: Could not get topic from queue"
    exit 1
  fi

  echo "[publish] Using static queue (index $INDEX): $TOPIC"

  # Advance static index
  NEXT_INDEX=$((INDEX + 1))
  echo "$NEXT_INDEX" > "$QUEUE_INDEX"
fi

# ── Step 3: Generate post ──────────────────────────────────────────────────
echo "[publish] Generating post..."
npm run generate-post "$TOPIC" 2>&1

# Find newly created file
NEW_FILE=$(ls -t src/content/blog/*.md | head -1)
echo "[publish] New file: $NEW_FILE"

# ── Step 4: Commit and push ────────────────────────────────────────────────
git add "$NEW_FILE"
git commit -m "content: $TOPIC"
git push origin main

# ── Step 5: Log ────────────────────────────────────────────────────────────
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "{\"timestamp\": \"$TIMESTAMP\", \"topic\": \"$TOPIC\", \"file\": \"$NEW_FILE\"}" >> "$LOG"

echo "[publish] Done. Post live after Vercel deploy (~20s)"
echo "[publish] https://baseradar.app/blog/$(basename $NEW_FILE .md)"
