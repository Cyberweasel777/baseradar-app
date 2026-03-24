#!/usr/bin/env ts-node
/**
 * BaseRadar Topic Discovery
 * Scrapes Reddit, HN, Dev.to, X, and Paragraph for trending crypto topics.
 * Uses Claude to select the 3 most relevant for BaseRadar's angle.
 * Injects them at the front of the publish queue.
 *
 * Usage: npm run discover-topics
 * Called automatically by publish-post.sh before generation.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const QUEUE_INDEX_FILE = path.join(__dirname, ".queue-index");
const DISCOVERED_FILE = path.join(__dirname, ".discovered-topics.json");
const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
const KING_BACKEND = process.env.KING_BACKEND_URL || "https://king-backend.fly.dev";
const SEARXNG_URL = process.env.SEARXNG_URL || "http://localhost:8888";

// ─── Data Sources ──────────────────────────────────────────────────────────

async function fetchRedditTrending(): Promise<string[]> {
  const subreddits = ["CryptoCurrency", "defi", "solana", "0xBase", "ethereum"];
  const titles: string[] = [];

  for (const sub of subreddits) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/hot.json?limit=10`,
        { headers: { "User-Agent": "BaseRadar-TopicBot/1.0" } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      const posts = data?.data?.children ?? [];
      for (const post of posts) {
        const title = post?.data?.title;
        const score = post?.data?.score ?? 0;
        if (title && score > 50) titles.push(`[Reddit r/${sub}] ${title}`);
      }
    } catch {
      // skip failed subreddit
    }
  }

  return titles;
}

async function fetchHNTrending(): Promise<string[]> {
  const queries = ["crypto", "solana", "base ethereum", "defi", "token velocity"];
  const titles: string[] = [];

  for (const q of queries) {
    try {
      const res = await fetch(
        `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=5&numericFilters=points>50`
      );
      if (!res.ok) continue;
      const data = await res.json();
      for (const hit of data?.hits ?? []) {
        if (hit.title) titles.push(`[HackerNews] ${hit.title}`);
      }
    } catch {
      // skip
    }
  }

  return titles;
}

async function fetchDevToTrending(): Promise<string[]> {
  const tags = ["crypto", "blockchain", "web3", "defi", "solana"];
  const titles: string[] = [];

  for (const tag of tags) {
    try {
      const res = await fetch(
        `https://dev.to/api/articles?tag=${tag}&top=7&per_page=5`
      );
      if (!res.ok) continue;
      const articles = await res.json();
      for (const a of articles) {
        if (a.title) titles.push(`[Dev.to] ${a.title}`);
      }
    } catch {
      // skip
    }
  }

  return titles;
}

async function firecrawlScrape(url: string): Promise<string> {
  if (!FIRECRAWL_API_KEY) return "";
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
    });
    if (!res.ok) return "";
    const data = await res.json();
    return data?.data?.markdown?.slice(0, 3000) ?? "";
  } catch {
    return "";
  }
}

async function fetchXTrending(): Promise<string[]> {
  // Scrape X crypto trending via Firecrawl
  const content = await firecrawlScrape("https://x.com/search?q=%23crypto+%23solana+%23base&f=top");
  if (!content) return [];

  // Extract lines that look like tweet content (rough heuristic)
  return content
    .split("\n")
    .filter((l) => l.length > 40 && l.length < 200 && !l.startsWith("#") && !l.startsWith("http"))
    .slice(0, 10)
    .map((l) => `[X/Twitter] ${l.trim()}`);
}

async function fetchSearXNGTrending(): Promise<string[]> {
  const queries = [
    "crypto token momentum 2026",
    "solana base ethereum ecosystem",
    "defi on-chain velocity signals",
    "crypto market trends this week",
    "token launch velocity base solana",
  ];
  const titles: string[] = [];

  for (const q of queries) {
    try {
      const url = `${SEARXNG_URL}/search?q=${encodeURIComponent(q)}&format=json&categories=general&time_range=week`;
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const data = await res.json();
      for (const result of (data?.results ?? []).slice(0, 6)) {
        if (result.title && result.title.length > 15) {
          titles.push(`[SearXNG] ${result.title}`);
        }
      }
    } catch {
      // skip failed query
    }
  }

  return [...new Set(titles)]; // dedupe
}

async function fetchParagraphTrending(): Promise<string[]> {
  const content = await firecrawlScrape("https://paragraph.xyz/explore?tag=crypto");
  if (!content) return [];

  return content
    .split("\n")
    .filter((l) => l.length > 20 && l.length < 150)
    .slice(0, 8)
    .map((l) => `[Paragraph] ${l.trim()}`);
}

async function fetchLiveEcosystemContext(): Promise<string> {
  try {
    const [movers, rankings] = await Promise.all([
      fetch(`${KING_BACKEND}/api/baseradar/daily-movers`).then((r) => r.json()),
      fetch(`${KING_BACKEND}/api/baseradar/ecosystem/rankings`).then((r) => r.json()),
    ]);

    const lines = ["Current BaseRadar data:"];
    if (rankings?.ecosystems) {
      for (const e of rankings.ecosystems) {
        lines.push(`- ${e.name}: avg score ${e.avgScore}, ${e.surgeCount} SURGE, ${e.totalTokens} tokens`);
      }
    }
    if (movers?.gainers?.[0]) {
      lines.push(`Top mover: ${movers.gainers[0].symbol} score ${movers.gainers[0].velocityScore}`);
    }
    return lines.join("\n");
  } catch {
    return "Live data unavailable";
  }
}

// ─── Claude Topic Selector ──────────────────────────────────────────────────

function selectTopicsWithClaude(allTitles: string[], ecosystemContext: string): string[] {
  const deduped = [...new Set(allTitles)].slice(0, 80);

  const prompt = `You are the content strategist for BaseRadar (baseradar.app), a crypto ecosystem velocity intelligence platform.

BaseRadar's angle: real-time token velocity scores, on-chain momentum signals, ecosystem rankings for Base, Solana, and Ethereum. Free intelligence layer that funnels to BotIndex paid tier.

${ecosystemContext}

Here are trending topics from Reddit, HackerNews, Dev.to, X, and Paragraph right now:

${deduped.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Select exactly 3 topics from this list that BaseRadar could write about with a velocity/momentum intelligence angle. Each topic must:
- Be directly relevant to crypto ecosystem activity, token momentum, or on-chain signals
- Be something BaseRadar's data (velocity scores, ecosystem rankings) can add unique value to
- Have SEO/AEO potential — questions people ask AI assistants about crypto

Reframe each selected topic as a specific BaseRadar blog post title (not the raw trending headline).

Return ONLY a JSON array of 3 strings. No explanation. Example format:
["Topic one as blog title", "Topic two as blog title", "Topic three as blog title"]`;

  const tmpFile = path.join(__dirname, ".tmp-select.txt");
  fs.writeFileSync(tmpFile, prompt, "utf-8");

  try {
    const raw = execSync(
      `claude --print --permission-mode bypassPermissions "$(cat ${tmpFile})"`,
      { encoding: "utf-8", maxBuffer: 1024 * 1024 }
    ) as string;

    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);

    // Extract JSON array from response
    const match = raw.match(/\[[\s\S]*?\]/);
    if (!match) return [];
    return JSON.parse(match[0]);
  } catch {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    return [];
  }
}

// ─── Queue Injection ────────────────────────────────────────────────────────

function injectTopicsIntoQueue(topics: string[]) {
  // Save discovered topics to a separate file
  // publish-post.sh checks this file first before the static queue
  const payload = {
    discoveredAt: new Date().toISOString(),
    topics,
    consumed: 0,
  };
  fs.writeFileSync(DISCOVERED_FILE, JSON.stringify(payload, null, 2), "utf-8");
  console.log(`[discover] Injected ${topics.length} trending topics into queue:`);
  topics.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("[discover] Fetching trending topics from all sources...");

  const [reddit, hn, devto, xTrends, paragraph, searxng] = await Promise.all([
    fetchRedditTrending(),
    fetchHNTrending(),
    fetchDevToTrending(),
    fetchXTrending(),
    fetchParagraphTrending(),
    fetchSearXNGTrending(),
  ]);

  const all = [...reddit, ...hn, ...devto, ...xTrends, ...paragraph, ...searxng];
  console.log(`[discover] Collected ${all.length} raw signals (Reddit: ${reddit.length}, HN: ${hn.length}, Dev.to: ${devto.length}, X: ${xTrends.length}, Paragraph: ${paragraph.length}, SearXNG: ${searxng.length})`);

  if (all.length === 0) {
    console.log("[discover] No signals collected — skipping topic injection");
    return;
  }

  console.log("[discover] Fetching live ecosystem context...");
  const ecosystemContext = await fetchLiveEcosystemContext();

  console.log("[discover] Selecting best topics with Claude...");
  const selected = selectTopicsWithClaude(all, ecosystemContext);

  if (selected.length === 0) {
    console.log("[discover] Claude returned no topics — skipping injection");
    return;
  }

  injectTopicsIntoQueue(selected);
  console.log("[discover] Done.");
}

main().catch((e) => {
  console.error("[discover] Error:", e.message);
  process.exit(0); // non-fatal — publish-post.sh continues with static queue
});
