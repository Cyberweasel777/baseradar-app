import Link from "next/link";
import { getDailyMovers, getEcosystemRankings } from "@/lib/api";
import { SignalBadge } from "@/components/SignalBadge";
import { EmailCapture } from "@/components/EmailCapture";

export const revalidate = 60;

const HOW_IT_WORKS = [
  {
    step: "1. Scan",
    title: "Cross-chain token velocity",
    desc: "BaseRadar continuously scans DexScreener, Zora, and PumpFun across Solana, Base, and Ethereum — measuring volume acceleration, holder growth, and ecosystem activity in real time.",
  },
  {
    step: "2. Score",
    title: "Velocity, not price",
    desc: "Every token gets a velocity score (0–100) based on how fast activity is accelerating relative to its own baseline. Price is a lagging indicator. Velocity leads it.",
  },
  {
    step: "3. Surface",
    title: "Ranked intelligence, daily",
    desc: "Ecosystems and tokens are ranked by momentum signal — SURGE, RISING, STABLE, or FADING. The highest-scoring assets today are the ones worth watching tomorrow.",
  },
];

const SIGNAL_TYPES = [
  {
    signal: "SURGE",
    color: "text-green-400",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
    desc: "Score 70+. Volume acceleration + holder growth both above baseline. Strongest leading signal.",
  },
  {
    signal: "RISING",
    color: "text-blue-400",
    border: "border-blue-500/20",
    bg: "bg-blue-500/5",
    desc: "Score 50–70. Positive momentum building. One or more signals trending above normal activity.",
  },
  {
    signal: "STABLE",
    color: "text-zinc-400",
    border: "border-zinc-700",
    bg: "bg-zinc-900/60",
    desc: "Score 30–50. Normal activity. No unusual acceleration or deceleration detected.",
  },
  {
    signal: "FADING",
    color: "text-red-400",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
    desc: "Score <30. Declining momentum. Volume and activity falling below baseline.",
  },
];

const ECOSYSTEMS_STATIC = [
  { name: "Solana", slug: "solana", desc: "DeFi, NFTs, memecoins. Highest token velocity in crypto." },
  { name: "Base", slug: "base", desc: "Coinbase L2. Fastest growing developer ecosystem in 2026." },
  { name: "Ethereum", slug: "ethereum", desc: "The settlement layer. Zora, DeFi, and creator activity." },
];

const PROOF_POINTS = [
  { value: "3 chains", label: "Tracked continuously" },
  { value: "5 min", label: "Data refresh cycle" },
  { value: "4 signals", label: "SURGE · RISING · STABLE · FADING" },
  { value: "Free", label: "Always public" },
];

export default async function HomePage() {
  const [moversData, rankingsData] = await Promise.all([
    getDailyMovers().catch(() => null),
    getEcosystemRankings().catch(() => null),
  ]);

  const topMovers = moversData?.gainers?.slice(0, 5) ?? [];
  const topEcosystems = rankingsData?.ecosystems?.slice(0, 6) ?? [];

  return (
    <div>
      {/* Hero */}
      <section className="py-20 sm:py-28">
        <p className="text-sm font-medium uppercase tracking-widest text-cyan-400">
          Ecosystem velocity · Updated every 5 minutes
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          <span className="text-white">Track which ecosystems</span>
          <br />
          <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-emerald-300 bg-clip-text text-transparent">
            are actually growing.
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-xl text-zinc-300">
          BaseRadar scans Solana, Base, and Ethereum daily — scoring token velocity, volume acceleration, and ecosystem momentum. Free intelligence, ranked by signal, not hype.
        </p>
        <p className="mt-3 max-w-2xl text-base text-zinc-500">
          Price is a lagging indicator. Velocity leads it. BaseRadar scores the lead.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/today"
            className="rounded-xl bg-white px-6 py-3 text-base font-semibold text-black transition hover:bg-zinc-200"
          >
            See Today&apos;s Movers →
          </Link>
          <a
            href="https://t.me/botindexdev"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-zinc-600 bg-zinc-900 px-6 py-3 text-base font-medium text-zinc-100 transition hover:bg-zinc-800"
          >
            Join Telegram →
          </a>
        </div>

        {/* Proof points */}
        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PROOF_POINTS.map((p) => (
            <div key={p.label} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
              <p className="text-2xl font-bold text-white">{p.value}</p>
              <p className="mt-1 text-xs text-zinc-500">{p.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Live Movers Strip — only shows if API is up */}
      {topMovers.length > 0 && (
        <section className="py-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">Today&apos;s Top Movers</p>
            <Link href="/today" className="text-sm text-cyan-400 transition hover:text-cyan-300">Full report →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {topMovers.map((token) => (
              <div key={token.symbol} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-white font-bold">{token.symbol}</span>
                  <SignalBadge signal={token.signal} />
                </div>
                <p className="text-cyan-400 text-2xl font-bold">{token.velocityScore}</p>
                <p className="text-zinc-500 text-xs truncate">{token.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ecosystem Rankings — live or static fallback */}
      <section className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight">Ecosystem Rankings</h2>
        <p className="mt-3 text-zinc-400">Ranked by token velocity, not price or market cap. Updated every 5 minutes.</p>

        {topEcosystems.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-4 font-medium">#</th>
                  <th className="text-left px-6 py-4 font-medium">Ecosystem</th>
                  <th className="text-right px-6 py-4 font-medium">Score</th>
                  <th className="text-right px-6 py-4 font-medium hidden md:table-cell">Signal</th>
                  <th className="text-right px-6 py-4 font-medium hidden md:table-cell">Surge↑</th>
                  <th className="text-right px-6 py-4 font-medium hidden md:table-cell">Tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {topEcosystems.map((eco) => (
                  <tr key={eco.slug} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="px-6 py-4 text-zinc-500">{eco.rank}</td>
                    <td className="px-6 py-4">
                      <Link href={`/ecosystems/${eco.slug}`} className="text-white font-medium hover:text-cyan-400 transition">
                        {eco.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right text-cyan-400 font-bold text-lg">{eco.avgScore.toFixed(1)}</td>
                    <td className="px-6 py-4 text-right hidden md:table-cell">
                      <SignalBadge signal={eco.topToken?.signal ?? "STABLE"} />
                    </td>
                    <td className="px-6 py-4 text-right text-emerald-400 hidden md:table-cell">{eco.surgeCount}</td>
                    <td className="px-6 py-4 text-right text-zinc-400 hidden md:table-cell">{eco.totalTokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {ECOSYSTEMS_STATIC.map((eco) => (
              <Link
                key={eco.slug}
                href={`/ecosystems/${eco.slug}`}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-zinc-700 transition-colors"
              >
                <h3 className="text-lg font-semibold text-white">{eco.name}</h3>
                <p className="mt-2 text-sm text-zinc-400">{eco.desc}</p>
                <p className="mt-4 text-xs text-cyan-400">View intelligence →</p>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6">
          <Link href="/ecosystems" className="text-sm text-zinc-400 hover:text-white transition">
            See all ecosystems →
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12">
        <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
        <p className="mt-3 text-zinc-400">We track what tokens are doing — not what traders are saying.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.step} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">{s.step}</p>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-zinc-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Signal types */}
      <section className="py-12">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-8">
          <h2 className="text-2xl font-semibold text-cyan-300">What the signals mean</h2>
          <p className="mt-2 text-zinc-400">Every token and ecosystem is classified into one of four signal tiers.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {SIGNAL_TYPES.map((s) => (
              <div key={s.signal} className={`rounded-xl border ${s.border} ${s.bg} p-5`}>
                <p className={`font-bold text-sm ${s.color}`}>{s.signal}</p>
                <p className="mt-2 text-sm text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/methodology" className="text-sm text-cyan-400 hover:text-cyan-300 transition">
              Read the full methodology →
            </Link>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-12">
        <EmailCapture />
      </section>

      {/* Intelligence not hype */}
      <section className="py-12">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-8">
          <h2 className="text-2xl font-semibold text-emerald-300">Intelligence, not hype.</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-semibold text-white">Price is the last signal</h3>
              <p className="mt-2 text-sm text-zinc-400">
                By the time price moves, the momentum already happened. BaseRadar scores velocity — the rate of change in activity — which leads price by hours or days.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Data from three sources</h3>
              <p className="mt-2 text-sm text-zinc-400">
                DexScreener, Zora, and PumpFun. Cross-chain, cross-platform. When multiple independent signals point the same direction, confidence compounds.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Scored against its own baseline</h3>
              <p className="mt-2 text-sm text-zinc-400">
                A 50% volume spike on a $10M token means something different than on a $10B token. Each asset is scored against its own historical norm — not generic thresholds.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white">Always free, always public</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Rankings, movers, ecosystem intelligence — all public, no account needed. BaseRadar is the free intelligence layer. BotIndex Pro is where the edge lives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BotIndex bridge */}
      <section className="py-16">
        <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-8 sm:p-12 text-center">
          <h2 className="text-3xl font-semibold sm:text-4xl">
            BaseRadar is free.
            <br />
            <span className="text-cyan-300">BotIndex Pro is where the edge lives.</span>
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-zinc-400">
            Convergence signals, prediction accuracy track record, unlimited alerts, full historical data, and API access. For traders and builders who need the full picture.
          </p>
          <a
            href="https://botindex.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black transition hover:bg-zinc-200"
          >
            See BotIndex Pro →
          </a>
        </div>
      </section>
    </div>
  );
}
