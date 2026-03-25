#!/bin/bash
# BaseRadar Auto-Publisher — hardened with retry logic
# 1. Discovers trending topics (Reddit/HN/Dev.to/X/Paragraph/SearXNG)
# 2. Picks best topic (discovered first, static queue fallback)
# 3. Generates post with live BotIndex data via Claude OAuth
# 4. Commits + pushes to GitHub → Vercel auto-deploys

set -e

REPO="/Users/cyberweasel/workspace/baseradar-app"
SCRIPTS="$REPO/scripts"
LOG="$SCRIPTS/.publish-log.json"
QUEUE_INDEX="$SCRIPTS/.queue-index"
DISCOVERED="$SCRIPTS/.discovered-topics.json"
MAX_RETRIES=3

cd "$REPO"

# ── Retry wrapper ──────────────────────────────────────────────────────────
retry() {
  local n=0
  until [ "$n" -ge "$MAX_RETRIES" ]; do
    "$@" && return 0
    n=$((n+1))
    echo "[publish] Attempt $n failed. Retrying in 10s..."
    sleep 10
  done
  echo "[publish] All $MAX_RETRIES attempts failed: $*"
  return 1
}

# ── Step 1: Pull latest git state (avoid conflicts) ────────────────────────
echo "[publish] Syncing git..."
retry git pull --rebase origin main || {
  echo "[publish] git pull failed — resetting to origin/main"
  git fetch origin
  git reset --hard origin/main
}

# ── Step 2: Discover trending topics ──────────────────────────────────────
echo "[publish] Running topic discovery..."
npx ts-node --project scripts/tsconfig.json scripts/discover-topics.ts \
  2>&1 || echo "[publish] Discovery failed — using static queue"

# ── Step 3: Pick topic ─────────────────────────────────────────────────────
TOPIC=""

# Check discovered topics first
if [ -f "$DISCOVERED" ]; then
  CONSUMED=$(node -e "try{const d=require('$DISCOVERED');console.log(d.consumed||0)}catch(e){console.log(0)}" 2>/dev/null || echo "0")
  TOPIC_COUNT=$(node -e "try{const d=require('$DISCOVERED');console.log((d.topics||[]).length)}catch(e){console.log(0)}" 2>/dev/null || echo "0")

  if [ "$CONSUMED" -lt "$TOPIC_COUNT" ]; then
    TOPIC=$(node -e "try{const d=require('$DISCOVERED');console.log(d.topics[$CONSUMED]||'')}catch(e){console.log('')}" 2>/dev/null || echo "")
    if [ -n "$TOPIC" ]; then
      node -e "
        const fs=require('fs');
        try {
          const d=JSON.parse(fs.readFileSync('$DISCOVERED','utf8'));
          d.consumed=(d.consumed||0)+1;
          fs.writeFileSync('$DISCOVERED',JSON.stringify(d,null,2));
        } catch(e) {}
      " 2>/dev/null || true
      echo "[publish] Using discovered topic ($((CONSUMED+1))/$TOPIC_COUNT): $TOPIC"
    fi
  fi
fi

# Fall back to static queue
if [ -z "$TOPIC" ]; then
  INDEX=0
  [ -f "$QUEUE_INDEX" ] && INDEX=$(cat "$QUEUE_INDEX")

  TOPIC=$(npx ts-node --project scripts/tsconfig.json -e "
import { TOPIC_QUEUE } from './scripts/topic-queue';
const idx = ${INDEX} % TOPIC_QUEUE.length;
process.stdout.write(TOPIC_QUEUE[idx]);
" 2>/dev/null || echo "")

  [ -z "$TOPIC" ] && { echo "[publish] ERROR: Could not get topic"; exit 1; }

  echo "[publish] Using static queue (index $INDEX): $TOPIC"
  echo "$((INDEX + 1))" > "$QUEUE_INDEX"
fi

# ── Step 4: Generate post ──────────────────────────────────────────────────
echo "[publish] Generating post..."
retry npm run generate-post "$TOPIC" 2>&1

# Find newly created file (most recent .md)
NEW_FILE=$(ls -t src/content/blog/*.md | head -1)
echo "[publish] New file: $NEW_FILE"

# ── Step 5: Commit and push with retry ────────────────────────────────────
git add "$NEW_FILE"
git diff --cached --quiet && { echo "[publish] Nothing to commit — file may already exist"; exit 0; }
git commit -m "content: $TOPIC"
retry git push origin main

# ── Step 6: Log ────────────────────────────────────────────────────────────
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "{\"timestamp\": \"$TIMESTAMP\", \"topic\": \"$TOPIC\", \"file\": \"$NEW_FILE\"}" >> "$LOG"
SLUG=$(basename "$NEW_FILE" .md)

# ── Step 6: Force Vercel prod deploy (GitHub auto-deploy can lag) ──────────
echo "[publish] Triggering Vercel production deploy..."
vercel --prod --yes 2>&1 | tail -2 || echo "[publish] Vercel deploy failed — post still in git, will deploy on next push"

echo "[publish] ✓ Live at https://baseradar.app/blog/${SLUG}"
