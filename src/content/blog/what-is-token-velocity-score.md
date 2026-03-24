---
title: "What Is Token Velocity Score? How BaseRadar Measures Crypto Momentum"
date: "2026-03-24"
description: "Token velocity score measures how fast on-chain activity is accelerating vs. a token's own baseline — not raw volume. Here's exactly how it works."
tags: ["velocity", "methodology", "signals", "explainer"]
---

# What Is Token Velocity Score? How BaseRadar Measures Crypto Momentum

Price is a lagging indicator. By the time a token's price moves, the underlying activity that caused it has already been happening for hours — sometimes days. Token velocity score is BaseRadar's attempt to measure that underlying activity *before* price catches up.

As of today, March 24, 2026, BaseRadar is tracking 40 tokens across Base and Solana, with the top velocity score in the current scan sitting at 40 (SHX on Base). That's a STABLE signal. When scores start pushing above 50 and 70, that's when the data gets interesting.

## The Core Concept: Baseline-Relative Measurement

Most crypto data platforms show raw numbers: 24h volume, price change, market cap. These are useful but they suffer from a scale problem. A $1M volume spike on a $10M token is massive. The same $1M spike on a $10B token is noise. Raw numbers don't tell you which is which.

Velocity score solves this by measuring each token against its own historical baseline. A score of 70 doesn't mean "high absolute volume" — it means "volume and holder activity are accelerating at a rate significantly above this token's own normal patterns." A small token with unusual acceleration scores higher than a large token with normal activity.

This is the same logic professional traders use when they talk about "relative volume" — except BaseRadar automates it across the entire tracked token universe in real time.

[Read the full methodology →](/methodology)

## The Four Signal Tiers

BaseRadar maps every token's velocity score to one of four signal classifications:

**SURGE (score 70–100):** Volume acceleration and holder growth both running well above baseline. This is the strongest leading signal in the system. Today's scan shows zero tokens in SURGE across Base and Solana — when SURGE tokens appear, they're worth attention.

**RISING (score 50–70):** Positive momentum building. One or more signals trending above normal activity. Not yet confirmation, but directional.

**STABLE (score 30–50):** Normal activity. No unusual acceleration or deceleration. Most tokens on most days live here — including all 40 tokens tracked today.

**FADING (score below 30):** Declining momentum. Volume and activity falling below baseline. Worth monitoring for reversal, not for entry.

[View current ecosystem rankings by signal →](/rankings)

## What Goes Into the Score

BaseRadar pulls data from three sources: DexScreener, Zora, and PumpFun. These cover the primary liquidity and trading venues for tokens on Base, Solana, and Ethereum.

From each source, the scanner measures:
- Volume acceleration (rate of change, not absolute)
- Volume in the most recent 1h window vs. 24h average
- On-chain holder activity where available
- Cross-source signal convergence when the same token appears active across multiple platforms

The score is computed every 5 minutes. A token that was STABLE an hour ago can move to RISING or SURGE if the right combination of signals appears — and BaseRadar will reflect that within the next scan cycle.

## Why This Leads Price

The mechanism is straightforward: before a token's price moves significantly, people have to buy it. Before people buy it in volume, there's usually a period of increasing on-chain activity — more transactions, growing holder counts, rising swap frequency. This activity shows up in velocity scores before the price chart shows anything.

It doesn't work every time. Velocity spikes can resolve without a price move. But the base rate is favorable: tokens that hit SURGE status have shown above-baseline price performance in the periods following the signal in BaseRadar's historical scan data.

The edge isn't certainty — it's having a systematic process for identifying which tokens are exhibiting unusual acceleration before the crowd notices.

[See today's top movers →](/today)

## How to Read the Data in Practice

When you open BaseRadar's daily movers or ecosystem pages, you're looking at a ranked list of tokens by velocity score at that moment. The practical read:

- **Zero SURGE tokens** (like today): consolidation phase, watch for first breakouts
- **1–3 SURGE tokens per ecosystem**: early momentum, worth deeper research
- **5+ SURGE tokens**: broad ecosystem activation, elevated market conditions
- **FADING ecosystem average**: sector rotation away from that chain

The ecosystem-level average velocity score is the macro read. Individual token scores are the micro opportunity. Both update in real time.

## FAQ

### How is velocity score different from trading volume?

Trading volume is an absolute number. Velocity score is a relative measure — how much has activity accelerated compared to that specific token's own historical norm. A small token with unusual volume acceleration will score higher than a large token with normal volume. Velocity captures *change*, not scale.

### Can velocity score predict price movements?

Velocity score is a leading indicator, not a prediction. Tokens with SURGE signals (70+) have historically shown above-baseline price performance following the signal, but the relationship is probabilistic, not deterministic. Some SURGE events resolve without significant price movement. The signal improves your odds of identifying early momentum — it doesn't eliminate risk.

### What does a score of 40 mean specifically?

A score of 40 places a token in the STABLE range (30–50). It means on-chain activity is running close to historical norms — no significant acceleration or deceleration detected. The top token in today's BaseRadar scan scores 40, reflecting a quiet market day across both Base and Solana.

### How often does the velocity score update?

Every 5 minutes. BaseRadar's scanner continuously pulls from DexScreener, Zora, and PumpFun and recomputes velocity scores on each cycle. The ecosystem rankings and daily movers pages reflect the most recent scan.
