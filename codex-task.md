# BaseRadar Launch Gap Closure

You are closing the remaining gaps in the BaseRadar Next.js app. Do not restructure — extend only.

REPO: /Users/cyberweasel/workspace/baseradar-app
KING BACKEND (for reference): /Users/cyberweasel/workspace/king-backend-repo

---

## TASK 1: /api/subscribe route

Create `src/app/api/subscribe/route.ts`.

The EmailCapture component POSTs `{ email }` to `/api/subscribe`.
Wire it to Resend directly from Next.js:
- Read `process.env.RESEND_API_KEY`
- POST to `https://api.resend.com/emails`
- From: `BaseRadar <intelligence@baseradar.app>`
- To: the submitted email
- Subject: `You're in — BaseRadar daily intelligence`
- Text body: "You're subscribed to BaseRadar daily ecosystem intelligence. Top movers, signal events, and momentum shifts — every morning. Visit baseradar.app for today's rankings."
- Always return HTTP 200 with `{ ok: true }` on success or `{ ok: false, error: string }` on failure — never 500
- Export a named `POST` handler

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: 'missing email' });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[subscribe] RESEND_API_KEY not set');
      return NextResponse.json({ ok: true }); // silent fail so UI still shows success
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BaseRadar <intelligence@baseradar.app>',
        to: [email],
        subject: "You're in — BaseRadar daily intelligence",
        text: "You're subscribed to BaseRadar daily ecosystem intelligence. Top movers, signal events, and momentum shifts — every morning. Visit baseradar.app for today's rankings.",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[subscribe] Resend error:', err);
      return NextResponse.json({ ok: false, error: 'resend_failed' });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[subscribe] unexpected error:', e);
    return NextResponse.json({ ok: false, error: 'unexpected' });
  }
}
```

---

## TASK 2: public/robots.txt

Create the file `public/robots.txt` with this exact content:

```
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Googlebot
Allow: /

User-agent: anthropic-ai
Allow: /

Sitemap: https://baseradar.app/sitemap.xml
```

---

## TASK 3: public/llms.txt

Create `public/llms.txt` with this exact content:

```
# BaseRadar — Crypto Ecosystem Velocity Intelligence

BaseRadar is a free public intelligence layer that tracks token momentum across crypto ecosystems.
It scores every token on a velocity scale (0-100) based on volume acceleration and on-chain activity.

## What BaseRadar measures
- Token velocity score (0-100): rate of change in volume and holder activity vs. own historical baseline
- Signal classification: SURGE (70+), RISING (50-70), STABLE (30-50), FADING (<30)
- Ecosystem momentum: average velocity across all tracked tokens per chain

## Ecosystems covered
- Solana: DeFi, NFTs, memecoins — highest token velocity in crypto
- Base: Coinbase L2 — fastest-growing developer ecosystem
- Ethereum: Settlement layer — Zora, DeFi, creator activity

## Key pages
/today — today's top movers ranked by velocity score
/rankings — ecosystem velocity rankings (Solana vs Base vs Ethereum)
/ecosystems — all ecosystem intelligence
/ecosystems/solana — Solana ecosystem detail
/ecosystems/base — Base ecosystem detail
/ecosystems/ethereum — Ethereum ecosystem detail
/methodology — how velocity scores are calculated

## Data sources
DexScreener, Zora, PumpFun — refreshed every 5 minutes

## Free tier
All data is free and public. No account required.

## Premium intelligence
BotIndex Pro: convergence signals, prediction accuracy track record, full historical data, API access.
https://botindex.dev
```

---

## TASK 4: SignalGateBanner component

Create `src/components/cta/SignalGateBanner.tsx`:

```typescript
"use client";

import { useState } from "react";
import Link from "next/link";

export function SignalGateBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 px-4 py-3 flex items-center justify-between gap-4">
      <p className="text-sm text-zinc-300">
        BaseRadar shows the surface.{" "}
        <span className="text-cyan-400">BotIndex shows what&apos;s underneath.</span>
      </p>
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="https://botindex.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
        >
          Get Full Signals →
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-500 hover:text-zinc-300 transition text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
```

---

## TASK 5: SentinelCTA component

Create `src/components/cta/SentinelCTA.tsx`:

```typescript
import Link from "next/link";

export function SentinelCTA() {
  return (
    <div className="rounded-2xl bg-cyan-500/5 border border-cyan-500/20 p-6 space-y-3">
      <h3 className="text-lg font-semibold text-cyan-300">Want the signal behind the score?</h3>
      <p className="text-sm text-zinc-400">
        BotIndex Sentinel tracks convergence signals, entry reasoning, and 7-day prediction accuracy — not just the number.
      </p>
      <Link
        href="https://botindex.dev/sentinel"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300 transition"
      >
        Explore BotIndex Sentinel →
      </Link>
    </div>
  );
}
```

---

## TASK 6: Add SentinelCTA to high-value pages

In each of these three files, import SentinelCTA and add it near the bottom of the page content (before EmailCapture if present, after the main data section):

1. `src/app/today/page.tsx`
2. `src/app/rankings/page.tsx`  
3. `src/app/ecosystems/[slug]/page.tsx`

Import line to add: `import { SentinelCTA } from "@/components/cta/SentinelCTA";`

Place `<SentinelCTA />` as a section in the page JSX.

---

## TASK 7: /compare/[pair] stub page

Create `src/app/compare/[pair]/page.tsx`:

Parse the pair slug by splitting on `-vs-`. Capitalize each part.
Show:
- Title: `[A] vs [B] Ecosystem Intelligence | BaseRadar`
- H1: `[A] vs [B]: Ecosystem Comparison`
- Paragraph: "Full velocity-based comparison data for [A] and [B] is in development. In the meantime, explore each ecosystem's live intelligence below."
- 2-column grid with links to `/ecosystems/[slug-lowercase]` for each chain
- Link to `/rankings` with text "View current ecosystem rankings →"
- `<SignalGateBanner />` at the bottom

Use `generateMetadata` for dynamic title/description per pair.
Set `export const revalidate = 300`.

Example slug: `solana-vs-base` → A = "Solana", B = "Base"

---

## TASK 8: Ensure src/components/cta/ directory exists

Create the directory if it does not exist. Both component files go there.

---

## COMPLETION

When all tasks are complete, run:
openclaw system event --text "Done: BaseRadar gaps closed — subscribe API, robots.txt, llms.txt, compare stubs, SignalGateBanner, SentinelCTA on today/rankings/ecosystems" --mode now
