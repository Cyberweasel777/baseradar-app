#!/usr/bin/env ts-node
/**
 * BaseRadar Post Generator
 * Usage: npm run generate-post "Your topic here"
 *
 * Fetches live BotIndex data from king-backend, then shells out to
 * `claude --print` (OAuth — no API key required) to generate an
 * AEO-optimized blog post with real velocity scores.
 */

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const KING_BACKEND =
  process.env.KING_BACKEND_URL || "https://king-backend.fly.dev";
const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

function slugify(text: string): string {
  const base = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/-$/, "");

  if (base.length <= 60) return base;

  // Truncate at last word boundary before 60 chars
  const truncated = base.slice(0, 60);
  const lastDash = truncated.lastIndexOf("-");
  return lastDash > 30 ? truncated.slice(0, lastDash) : truncated;
}

async function fetchLiveData() {
  const [moversRes, rankingsRes] = await Promise.allSettled([
    fetch(`${KING_BACKEND}/api/baseradar/daily-movers`).then((r) => r.json()),
    fetch(`${KING_BACKEND}/api/baseradar/ecosystem/rankings`).then((r) =>
      r.json()
    ),
  ]);

  const movers =
    moversRes.status === "fulfilled" ? moversRes.value : null;
  const rankings =
    rankingsRes.status === "fulfilled" ? rankingsRes.value : null;

  return { movers, rankings };
}

function buildDataContext(movers: any, rankings: any): string {
  const lines: string[] = [
    "## Live BotIndex Intelligence Data (use these real numbers in the post)",
  ];

  if (rankings?.ecosystems?.length) {
    lines.push("\n### Ecosystem Rankings right now:");
    for (const eco of rankings.ecosystems.slice(0, 3)) {
      lines.push(
        `- ${eco.name}: avg velocity score ${eco.avgScore}, ${eco.surgeCount} tokens in SURGE, ${eco.risingCount} RISING, ${eco.totalTokens} total tracked`
      );
    }
  }

  if (movers?.gainers?.length) {
    lines.push("\n### Top Movers Today:");
    for (const t of movers.gainers.slice(0, 8)) {
      lines.push(
        `- ${t.symbol} (${t.chain}): velocity score ${t.velocityScore}, signal: ${t.signal}, 24h volume: $${(t.volume24h / 1000).toFixed(1)}K`
      );
    }
    lines.push(`\nTotal tokens tracked: ${movers.totalTracked}`);
    lines.push(`Data date: ${movers.date}`);
  }

  return lines.join("\n");
}

function buildPrompt(topic: string, dataContext: string): string {
  const today = new Date().toISOString().slice(0, 10);

  return `You are writing a blog post for BaseRadar (baseradar.app), a free crypto ecosystem intelligence platform that scores token velocity in real time.

Topic: ${topic}
Date: ${today}

${dataContext}

Write a complete, AEO-optimized blog post in markdown. Requirements:

1. Frontmatter (exactly this format, no variation):
---
title: "Your exact title here"
date: "${today}"
description: "One sentence, 150-160 chars, factual, includes real numbers from the data above"
tags: ["tag1", "tag2", "tag3"]
---

2. Structure:
- H1 matching the title
- 2-3 sentence intro with the most compelling data point from the live data above
- 3-4 H2 sections, each 150-200 words, substantive analysis
- Use the REAL velocity scores, ecosystem names, token symbols, and volumes from the data context — not made-up numbers
- One internal link per section to baseradar.app pages: /ecosystems/solana, /ecosystems/base, /ecosystems/ethereum, /rankings, /today, /methodology
- End with a ## FAQ section, exactly 4 Q&A pairs in this format:

### Question here?
Answer here (2-3 sentences, factual).

3. Tone: analytical, data-first, no hype. "Velocity leads price" framing throughout.

4. AEO optimization: write each H2 section so it directly answers a specific question someone might ask an AI assistant. Use the live data to make citable, specific claims.

5. Word count: 900-1200 words total.

6. Do NOT include a CTA at the end — the template adds that automatically.

Return ONLY the markdown content. No preamble, no explanation, no code fences. Start directly with the --- frontmatter.`;
}

async function main() {
  const topic = process.argv[2];
  if (!topic) {
    console.error(
      'Usage: npm run generate-post "Your topic here"'
    );
    process.exit(1);
  }

  console.log("Fetching live BotIndex data...");
  const { movers, rankings } = await fetchLiveData();
  const dataContext = buildDataContext(movers, rankings);

  console.log(`Generating post: "${topic}"`);

  const prompt = buildPrompt(topic, dataContext);

  // Write prompt to temp file to avoid shell escaping issues
  const tmpPrompt = path.join(process.cwd(), ".tmp-prompt.txt");
  fs.writeFileSync(tmpPrompt, prompt, "utf-8");

  let markdown: string;
  try {
    // Use stdin — avoids shell escaping and stdout contamination from arg passing
    markdown = execSync(`claude --print --permission-mode bypassPermissions`, {
      input: prompt,
      maxBuffer: 1024 * 1024 * 10,
      encoding: "utf-8",
    }) as string;
  } finally {
    if (fs.existsSync(tmpPrompt)) fs.unlinkSync(tmpPrompt);
  }

  // Strip any accidental code fences claude might add
  markdown = markdown.replace(/^```(?:markdown)?\n?/m, "").replace(/\n?```$/m, "").trim();

  // Guard: must start with --- frontmatter, not Claude's prose explanation
  if (!markdown.startsWith("---")) {
    const altStart = markdown.indexOf("\n---");
    if (altStart !== -1) {
      markdown = markdown.slice(altStart + 1).trim();
    } else {
      throw new Error(`Invalid output: missing frontmatter. Content starts with: ${markdown.slice(0, 100)}`);
    }
  }

  // Guard: minimum size — real posts are >2000 chars, stubs are <600
  if (markdown.length < 1000) {
    throw new Error(`Content too short (${markdown.length} chars) — likely a stub or error message. Aborting.`);
  }

  // Extract slug from generated title, fall back to topic
  const titleMatch = markdown.match(/^title:\s*["'](.+?)["']/m);
  const title = titleMatch ? titleMatch[1] : topic;
  const slug = slugify(title);
  const filename = `${slug}.md`;
  const outPath = path.join(CONTENT_DIR, filename);

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  // Duplicate guard — if slug already exists, append date suffix
  if (fs.existsSync(outPath)) {
    const dateSuffix = new Date().toISOString().slice(0, 10);
    const dedupedSlug = `${slug}-${dateSuffix}`;
    const dedupedPath = path.join(CONTENT_DIR, `${dedupedSlug}.md`);
    console.warn(`[generate] Slug collision: ${filename} already exists — writing to ${dedupedSlug}.md`);
    fs.writeFileSync(dedupedPath, markdown, "utf-8");
    console.log(`\n✓ Post saved: src/content/blog/${dedupedSlug}.md`);
    console.log(`  Preview: https://baseradar.app/blog/${dedupedSlug}`);
    console.log(`\nTo publish:\n  git add src/content/blog/${dedupedSlug}.md && git commit -m "content: ${title}" && git push`);
    return;
  }

  fs.writeFileSync(outPath, markdown, "utf-8");

  console.log(`\n✓ Post saved: src/content/blog/${filename}`);
  console.log(`  Preview: https://baseradar.app/blog/${slug}`);
  console.log(
    `\nTo publish:\n  git add src/content/blog/${filename} && git commit -m "content: ${title}" && git push`
  );
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
