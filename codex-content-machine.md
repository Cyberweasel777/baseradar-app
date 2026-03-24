# BaseRadar Content Machine — Phase 1 + Phase 2

REPO: /Users/cyberweasel/workspace/baseradar-app

---

## PHASE 1: Convert existing blog into BotIndex funnel

### Task 1A: Add SentinelCTA + Article JSON-LD to blog [slug] page

Read the existing file at `src/app/blog/[slug]/page.tsx`.

Add the following:

1. Import `SentinelCTA` from `@/components/cta/SentinelCTA`
2. Add `<SentinelCTA />` inside the post layout, after the article content and before any footer/nav
3. Add Article JSON-LD schema using Next.js `<Script>` or inline script tag in the page head. Build the schema from the post frontmatter:

```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": post.title,
  "description": post.description,
  "datePublished": post.date,
  "dateModified": post.date,
  "author": {
    "@type": "Organization",
    "name": "BaseRadar",
    "url": "https://baseradar.app"
  },
  "publisher": {
    "@type": "Organization",
    "name": "BaseRadar",
    "url": "https://baseradar.app",
    "logo": {
      "@type": "ImageObject",
      "url": "https://baseradar.app/favicon.ico"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": `https://baseradar.app/blog/${post.slug}`
  }
};
```

Inject it with:
```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
/>
```

### Task 1B: Add Related Intelligence block to blog [slug] page

After `<SentinelCTA />`, add a "Related Intelligence" section that shows:
- Links to `/ecosystems/solana`, `/ecosystems/base`, `/ecosystems/ethereum` as cards
- A link to `/rankings`
- A link to `/today`

Use this component inline (no separate file needed):

```tsx
<div className="mt-12 space-y-4">
  <h3 className="text-lg font-semibold text-white">Live Intelligence</h3>
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
    {[
      { label: "Solana Ecosystem", href: "/ecosystems/solana", desc: "Live velocity scores" },
      { label: "Base Ecosystem", href: "/ecosystems/base", desc: "Coinbase L2 momentum" },
      { label: "Ethereum Ecosystem", href: "/ecosystems/ethereum", desc: "Zora + DeFi signals" },
    ].map((link) => (
      <Link key={link.href} href={link.href} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition-colors">
        <p className="text-white font-medium text-sm">{link.label}</p>
        <p className="text-zinc-500 text-xs mt-1">{link.desc}</p>
        <p className="text-cyan-400 text-xs mt-2">View →</p>
      </Link>
    ))}
  </div>
  <div className="flex gap-4 text-sm">
    <Link href="/rankings" className="text-zinc-400 hover:text-white transition">Ecosystem Rankings →</Link>
    <Link href="/today" className="text-zinc-400 hover:text-white transition">Today's Movers →</Link>
  </div>
</div>
```

### Task 1C: Add FAQ JSON-LD block to blog [slug] page

If the post's markdown content contains a section starting with `## FAQ` or `## Frequently Asked Questions`, parse out Q&A pairs and inject a `FAQPage` JSON-LD block.

Parse pattern: `### Question text` followed by paragraph answer text.

```typescript
function extractFAQs(content: string): Array<{ q: string; a: string }> {
  const faqSection = content.split(/^##\s+(FAQ|Frequently Asked Questions)/m)[1];
  if (!faqSection) return [];
  const questions = faqSection.match(/###\s+(.+)\n+([\s\S]+?)(?=###|$)/g) ?? [];
  return questions.map((block) => {
    const [qLine, ...rest] = block.split('\n').filter(Boolean);
    return {
      q: qLine.replace(/^###\s+/, '').trim(),
      a: rest.join(' ').trim().slice(0, 500),
    };
  });
}
```

If FAQs exist, inject:
```typescript
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": { "@type": "Answer", "text": a }
  }))
};
```

---

## PHASE 2: Content generation script

Create `scripts/generate-post.ts`.

This script:
1. Accepts a topic via CLI arg: `npx ts-node scripts/generate-post.ts "Solana vs Base: Which ecosystem has more momentum in 2026"`
2. Fetches live data from king-backend
3. Uses the Anthropic SDK to generate a full markdown blog post
4. Saves to `src/content/blog/[auto-slug].md`
5. Prints the output path

### Step 2A: Dependencies check

Check if `@anthropic-ai/sdk` is in package.json. If not, add it to devDependencies.
Check if `ts-node` is in package.json. If not, add it to devDependencies.
Run `npm install` after adding deps.

### Step 2B: The script

Create `scripts/generate-post.ts`:

```typescript
#!/usr/bin/env ts-node
/**
 * BaseRadar Post Generator
 * Usage: npx ts-node scripts/generate-post.ts "Your topic here"
 * 
 * Fetches live BotIndex data from king-backend and generates an AEO-optimized
 * blog post with real velocity scores and ecosystem intelligence.
 */

import fs from 'fs';
import path from 'path';
import Anthropic from '@anthropic-ai/sdk';

const KING_BACKEND = process.env.KING_BACKEND_URL || 'https://king-backend.fly.dev';
const CONTENT_DIR = path.join(process.cwd(), 'src/content/blog');

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
}

async function fetchLiveData() {
  const [moversRes, rankingsRes] = await Promise.allSettled([
    fetch(`${KING_BACKEND}/api/baseradar/daily-movers`).then(r => r.json()),
    fetch(`${KING_BACKEND}/api/baseradar/ecosystem/rankings`).then(r => r.json()),
  ]);

  const movers = moversRes.status === 'fulfilled' ? moversRes.value : null;
  const rankings = rankingsRes.status === 'fulfilled' ? rankingsRes.value : null;

  return { movers, rankings };
}

function buildDataContext(movers: any, rankings: any): string {
  const lines: string[] = ['## Live BotIndex Intelligence Data (use these real numbers in the post)'];

  if (rankings?.ecosystems?.length) {
    lines.push('\n### Ecosystem Rankings (right now):');
    for (const eco of rankings.ecosystems.slice(0, 3)) {
      lines.push(`- ${eco.name}: avg velocity score ${eco.avgScore}, ${eco.surgeCount} tokens in SURGE, ${eco.totalTokens} total tracked`);
    }
  }

  if (movers?.gainers?.length) {
    lines.push('\n### Top Movers Today:');
    for (const t of movers.gainers.slice(0, 5)) {
      lines.push(`- ${t.symbol} (${t.chain}): velocity score ${t.velocityScore}, signal: ${t.signal}, 24h volume: $${(t.volume24h / 1000).toFixed(0)}K`);
    }
    lines.push(`\nTotal tokens tracked: ${movers.totalTracked}`);
  }

  return lines.join('\n');
}

async function generatePost(topic: string, dataContext: string): Promise<string> {
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
    model: 'claude-opus-4-6',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  return (message.content[0] as any).text;
}

async function main() {
  const topic = process.argv[2];
  if (!topic) {
    console.error('Usage: npx ts-node scripts/generate-post.ts "Your topic here"');
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

  fs.writeFileSync(outPath, markdown, 'utf-8');
  console.log(`\nPost saved: src/content/blog/${filename}`);
  console.log(`Preview: https://baseradar.app/blog/${slug}`);
  console.log(`\nTo publish: git add src/content/blog/${filename} && git commit -m "content: ${title}" && git push`);
}

main().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
```

### Step 2C: Add ts-node config if needed

Check if `tsconfig.json` has `"module": "commonjs"` or if ts-node needs a separate config. If the existing tsconfig uses `"module": "esnext"` or similar (Next.js default), create `scripts/tsconfig.json`:

```json
{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "../.scripts-dist",
    "noEmit": false
  },
  "include": ["*.ts"]
}
```

And update the run command in package.json scripts:
```json
"generate-post": "ts-node --project scripts/tsconfig.json scripts/generate-post.ts"
```

### Step 2D: Add npm script to package.json

Add to the `scripts` section of `package.json`:
```json
"generate-post": "ts-node --project scripts/tsconfig.json scripts/generate-post.ts"
```

So the usage is: `npm run generate-post "Your topic"`

---

## PHASE 2B: Generate 5 seed posts using the script

After the script is built and working, generate these 5 posts by calling the script directly (using ts-node):

1. "Solana vs Base: Which ecosystem has more momentum right now"
2. "What is token velocity and why it predicts price moves"  
3. "How to find early crypto movers before they trend"
4. "Base ecosystem tokens: what's surging on Coinbase L2 today"
5. "Hyperliquid vs Solana: DeFi ecosystem momentum compared"

For each: run the script, verify the file was created, move on to the next. Do not wait for user confirmation between posts.

Use `ANTHROPIC_API_KEY` from environment. If not set, skip generation and just print the command to run manually.

---

## COMPLETION

When all tasks are complete, run:
openclaw system event --text "Done: BaseRadar content machine built — blog funnel wired (SentinelCTA + JSON-LD + related links on all posts), generate-post script live, 5 seed posts generated with live BotIndex data" --mode now
