#!/usr/bin/env ts-node
/**
 * BaseRadar Post Generator
 * Usage: npx ts-node scripts/generate-post.ts "Your topic here"
 *
 * Fetches live BotIndex data from king-backend and generates an AEO-optimized
 * blog post with real velocity scores and ecosystem intelligence.
 */

import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";

const KING_BACKEND =
  process.env.KING_BACKEND_URL || "https://king-backend.fly.dev";
const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

async function fetchLiveData() {
  const [moversRes, rankingsRes] = await Promise.allSettled([
    fetch(`${KING_BACKEND}/api/baseradar/daily-movers`).then((r) => r.json()),
    fetch(`${KING_BACKEND}/api/baseradar/ecosystem/rankings`).then((r) =>
      r.json()
    ),
  ]);

  const movers = moversRes.status === "fulfilled" ? moversRes.value : null;
  const rankings =
    rankingsRes.status === "fulfilled" ? rankingsRes.value : null;

  return { movers, rankings };
}

function buildDataContext(movers: any, rankings: any): string {
  const lines: string[] = [
    "## Live BotIndex Intelligence Data (use these real numbers in the post)",
  ];

  if (rankings?.ecosystems?.length) {
    lines.push("\n### Ecosystem Rankings (right now):");
    for (const eco of rankings.ecosystems.slice(0, 3)) {
      lines.push(
        `- ${eco.name}: avg velocity score ${eco.avgScore}, ${eco.surgeCount} tokens in SURGE, ${eco.totalTokens} total tracked`
      );
    }
  }

  if (movers?.gainers?.length) {
    lines.push("\n### Top Movers Today:");
    for (const t of movers.gainers.slice(0, 5)) {
      lines.push(
        `- ${t.symbol} (${t.chain}): velocity score ${t.velocityScore}, signal: ${t.signal}, 24h volume: $${(t.volume24h / 1000).toFixed(0)}K`
      );
    }
    lines.push(`\nTotal tokens tracked: ${movers.totalTracked}`);
  }

  return lines.join("\n");
}

async function generatePost(
  topic: string,
  dataContext: string
): Promise<string> {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const today = new Date().toISOString().slice(0, 10);

  const prompt = `You are writing a blog post for BaseRadar (baseradar.app), a free crypto ecosystem intelligence platform.

Topic: ${topic}
Date: ${today}

${dataContext}

Write a complete, AEO-optimized blog post in markdown format. Requirements:

1. Frontmatter (exactly this format):
---
title: "Your exact title here"
date: "${today}"
description: "One sentence, 150-160 chars, factual, includes real numbers from the data above"
tags: ["tag1", "tag2", "tag3"]
---

2. Structure:
- H1 matching the title
- 2-3 sentence intro with the most compelling data point from the live data
- 3-4 H2 sections with substantive analysis
- Use the REAL velocity scores, ecosystem rankings, and token names from the data context above
- Each section: 150-200 words, factual, no hype
- One internal link per section to baseradar.app pages: /ecosystems/solana, /ecosystems/base, /ecosystems/ethereum, /rankings, /today, /methodology
- End with a ## FAQ section with 3-4 Q&A pairs in this format:
  ### Question here?
  Answer here (2-3 sentences).

3. Tone: analytical, data-first, no hype. "Velocity leads price" framing throughout.

4. AEO optimization: write each section so it directly answers a question someone might ask an AI assistant. Use the data to make specific, citable claims.

5. Word count: 800-1200 words.

6. Do NOT include a CTA — that is added by the template. Just end with the FAQ section.

Return ONLY the markdown. No preamble, no explanation.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  return (message.content[0] as any).text;
}

async function main() {
  const topic = process.argv[2];
  if (!topic) {
    console.error(
      'Usage: npx ts-node scripts/generate-post.ts "Your topic here"'
    );
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error(
      "ANTHROPIC_API_KEY not set. Run with:\n  ANTHROPIC_API_KEY=sk-... npm run generate-post \"" +
        topic +
        '"'
    );
    process.exit(1);
  }

  console.log(`Fetching live BotIndex data...`);
  const { movers, rankings } = await fetchLiveData();
  const dataContext = buildDataContext(movers, rankings);

  console.log(`Generating post: "${topic}"`);
  const markdown = await generatePost(topic, dataContext);

  // Extract slug from generated frontmatter title, or use topic
  const titleMatch = markdown.match(/^title:\s*"(.+?)"/m);
  const title = titleMatch ? titleMatch[1] : topic;
  const slug = slugify(title);
  const filename = `${slug}.md`;
  const outPath = path.join(CONTENT_DIR, filename);

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  fs.writeFileSync(outPath, markdown, "utf-8");
  console.log(`\nPost saved: src/content/blog/${filename}`);
  console.log(`Preview: https://baseradar.app/blog/${slug}`);
  console.log(
    `\nTo publish: git add src/content/blog/${filename} && git commit -m "content: ${title}" && git push`
  );
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
