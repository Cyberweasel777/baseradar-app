import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How BaseRadar Scores Crypto Ecosystems | Methodology",
  description: "How does BaseRadar calculate ecosystem momentum scores? We score token velocity, volume acceleration, holder growth, and ecosystem activity — not price.",
};

const SIGNAL_TIERS = [
  { signal: "SURGE", range: "70–100", color: "text-green-400", description: "Strong upward momentum. Volume acceleration + holder growth both above baseline." },
  { signal: "RISING", range: "50–69", color: "text-blue-400", description: "Positive momentum building. One or more signals trending above normal." },
  { signal: "STABLE", range: "30–49", color: "text-zinc-400", description: "Normal activity. No unusual acceleration or deceleration detected." },
  { signal: "FADING", range: "0–29", color: "text-red-400", description: "Declining momentum. Volume and activity falling below baseline." },
];

const FAQ = [
  {
    q: "What is a velocity score?",
    a: "A velocity score (0–100) measures how fast an ecosystem or token is gaining activity relative to its own baseline. A score of 70+ means activity is accelerating significantly — not just high in absolute terms, but growing quickly.",
  },
  {
    q: "Why doesn't BaseRadar use price?",
    a: "Price is a lagging indicator. By the time price moves, the intelligence is already priced in. Velocity — the rate of change in activity, volume, and ecosystem participation — leads price. BaseRadar scores the lead, not the lag.",
  },
  {
    q: "How often does data refresh?",
    a: "BaseRadar pulls from DexScreener, Zora, and PumpFun. The velocity scanner runs continuously with a 5-minute cache window. Rankings pages refresh every 5 minutes. The Daily Movers page refreshes every 60 seconds.",
  },
  {
    q: "What data sources does BaseRadar use?",
    a: "DexScreener (cross-chain DEX data), Zora (Base/Ethereum NFT and creator activity), and PumpFun (Solana launch activity). All three are aggregated and scored using the same velocity formula.",
  },
  {
    q: "What is the difference between BaseRadar and BotIndex?",
    a: "BaseRadar is the free public intelligence surface — rankings, movers, ecosystem pages, all public. BotIndex Pro is the premium layer: convergence signals (when multiple independent signals align), prediction accuracy track record, unlimited alerts, and full historical data.",
  },
];

export default function MethodologyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-white">How BaseRadar Scores Ecosystems</h1>
        <p className="text-zinc-400 text-lg leading-relaxed">
          Every score on BaseRadar is derived from the same underlying formula: 
          how fast is activity accelerating, relative to baseline? Not price. Not hype. Velocity.
        </p>
      </div>

      {/* Scoring Formula */}
      <section className="space-y-6">
        <h2 className="text-white font-semibold text-2xl">The Velocity Score</h2>
        <p className="text-zinc-400 leading-relaxed">
          The velocity score (0–100) is a composite of four inputs:
        </p>
        <div className="space-y-4">
          {[
            { name: "Volume Change (1h)", weight: "Primary", desc: "How much has trading volume changed in the last hour vs the rolling average? Rapid volume acceleration is the strongest leading signal." },
            { name: "Market Cap Context", weight: "Modifier", desc: "Absolute market cap provides context. A 50% volume spike on a $100M token is more significant than on a $10B token." },
            { name: "Holder Growth", weight: "Confirmation", desc: "New unique holders confirm organic demand vs wash trading. Growing holder base at the same time as volume = higher confidence signal." },
            { name: "Boosted Status", weight: "Modifier", desc: "Tokens with active promotional boosts on DexScreener are flagged. Boosted status is weighted lower to avoid artificial inflation." },
          ].map((input) => (
            <div key={input.name} className="bg-[#111118] border border-white/5 rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">{input.name}</h3>
                <span className="text-zinc-500 text-xs bg-white/5 px-2 py-0.5 rounded">{input.weight}</span>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">{input.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signal Tiers */}
      <section className="space-y-6">
        <h2 className="text-white font-semibold text-2xl">Signal Classifications</h2>
        <p className="text-zinc-400 leading-relaxed">
          Every token and ecosystem is classified into one of four signal tiers based on its velocity score:
        </p>
        <div className="space-y-3">
          {SIGNAL_TIERS.map((tier) => (
            <div key={tier.signal} className="flex items-start gap-4 bg-[#111118] border border-white/5 rounded-xl p-5">
              <div className="w-20 flex-shrink-0">
                <span className={`font-bold text-sm ${tier.color}`}>{tier.signal}</span>
                <p className="text-zinc-600 text-xs mt-0.5">{tier.range}</p>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed">{tier.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why not price */}
      <section className="bg-[#111118] border border-white/5 rounded-xl p-8 space-y-4">
        <h2 className="text-white font-semibold text-xl">Why we don&apos;t score price</h2>
        <p className="text-zinc-400 leading-relaxed">
          Price-based ranking tells you what already happened. By the time a token&apos;s price reflects 
          growing ecosystem activity, most of the move is already priced in.
        </p>
        <p className="text-zinc-400 leading-relaxed">
          Velocity is a leading indicator. When volume accelerates, when new holders arrive, when 
          ecosystem activity increases — that precedes price. BaseRadar scores the signal, not the result.
        </p>
      </section>

      {/* Data Sources */}
      <section className="space-y-4">
        <h2 className="text-white font-semibold text-2xl">Data Sources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "DexScreener", desc: "Cross-chain DEX trading data. Volume, price, liquidity, holder counts across all major chains." },
            { name: "Zora", desc: "Base and Ethereum creator/NFT activity. Trending coins, attention momentum, creator velocity." },
            { name: "PumpFun", desc: "Solana token launch activity. New launches, graduation rates, early momentum signals." },
          ].map((src) => (
            <div key={src.name} className="bg-[#111118] border border-white/5 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-2">{src.name}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{src.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-zinc-600 text-xs">Data refreshes every 5 minutes. Rankings pages cache for 5 minutes. Daily Movers page caches for 60 seconds.</p>
      </section>

      {/* FAQ — AEO optimized */}
      <section className="space-y-6">
        <h2 className="text-white font-semibold text-2xl">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <div key={item.q} className="space-y-2">
              <h3 className="text-white font-semibold">{item.q}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom nav */}
      <div className="flex items-center gap-6 text-sm text-zinc-500 pt-4 border-t border-white/5">
        <Link href="/today" className="hover:text-zinc-300 transition-colors">See Today&apos;s Movers →</Link>
        <Link href="/ecosystems" className="hover:text-zinc-300 transition-colors">Explore Ecosystems →</Link>
      </div>
    </div>
  );
}
