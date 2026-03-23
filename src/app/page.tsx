import Link from "next/link";
import { getDailyMovers, getEcosystemRankings } from "@/lib/api";
import { SignalBadge } from "@/components/SignalBadge";
import { EmailCapture } from "@/components/EmailCapture";

export const revalidate = 60;

export default async function HomePage() {
  const [moversData, rankingsData] = await Promise.all([
    getDailyMovers().catch(() => null),
    getEcosystemRankings().catch(() => null),
  ]);

  const topMovers = moversData?.gainers?.slice(0, 5) ?? [];
  const topEcosystems = rankingsData?.ecosystems?.slice(0, 6) ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">

      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-cyan-400 text-xs font-medium mb-2">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
          Live · Updated every 5 minutes
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight leading-none">
          The Crypto<br />Ecosystem Radar.
        </h1>
        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Track which chains and tokens are gaining momentum — before the market prices it in. 
          Free intelligence, updated daily.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/today"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
          >
            See Today&apos;s Movers →
          </Link>
          <a
            href="https://t.me/botindexdev"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-lg text-sm transition-colors"
          >
            Join Telegram →
          </a>
        </div>
      </section>

      {/* Live Movers Strip */}
      {topMovers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-medium">Today&apos;s Top Movers</p>
            <Link href="/today" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              Full report →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {topMovers.map((token) => (
              <div key={token.symbol} className="bg-[#111118] border border-white/5 rounded-xl p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-white font-bold text-sm">{token.symbol}</span>
                  <SignalBadge signal={token.signal} />
                </div>
                <p className="text-cyan-400 text-2xl font-bold">{token.velocityScore}</p>
                <p className="text-zinc-500 text-xs truncate">{token.name}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ecosystem Rankings */}
      {topEcosystems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-semibold text-xl">Ecosystem Rankings</h2>
              <p className="text-zinc-500 text-sm mt-1">Ranked by token velocity, not price.</p>
            </div>
            <Link href="/ecosystems" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
              See all →
            </Link>
          </div>
          <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">#</th>
                  <th className="text-left px-4 py-3 font-medium">Ecosystem</th>
                  <th className="text-right px-4 py-3 font-medium">Score</th>
                  <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Signal</th>
                  <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Surge↑</th>
                  <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Tokens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {topEcosystems.map((eco) => (
                  <tr key={eco.slug} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-zinc-500">{eco.rank}</td>
                    <td className="px-4 py-3">
                      <Link href={`/ecosystems/${eco.slug}`} className="text-white hover:text-cyan-400 font-medium transition-colors">
                        {eco.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right text-cyan-400 font-bold">{eco.avgScore.toFixed(1)}</td>
                    <td className="px-4 py-3 text-right hidden md:table-cell">
                      <SignalBadge signal={eco.topToken?.signal ?? "STABLE"} />
                    </td>
                    <td className="px-4 py-3 text-right text-green-400 hidden md:table-cell">{eco.surgeCount}</td>
                    <td className="px-4 py-3 text-right text-zinc-400 hidden md:table-cell">{eco.totalTokens}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Email Capture */}
      <EmailCapture />

      {/* Methodology Teaser */}
      <section className="text-center space-y-4 py-8">
        <h2 className="text-white font-semibold text-xl">Intelligence, not hype.</h2>
        <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Scores are built from token velocity, volume acceleration, and ecosystem activity. 
          Not price. Not social sentiment. Not marketing spend. 
          Price is a lagging indicator — velocity is a leading one.
        </p>
        <Link href="/methodology" className="text-cyan-400 hover:text-cyan-300 text-sm underline transition-colors">
          Read the methodology →
        </Link>
      </section>

      {/* BotIndex Bridge */}
      <section className="bg-[#111118] border border-white/5 rounded-xl p-8 text-center space-y-4">
        <p className="text-zinc-500 text-xs uppercase tracking-widest font-medium">Want the full picture?</p>
        <h2 className="text-white font-semibold text-2xl">BaseRadar is free.<br />BotIndex Pro is where the edge lives.</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Convergence signals, prediction accuracy track record, unlimited alerts, and full historical data.
        </p>
        <a
          href="https://botindex.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8 py-3 rounded-lg text-sm transition-colors"
        >
          See BotIndex Pro →
        </a>
      </section>
    </div>
  );
}
