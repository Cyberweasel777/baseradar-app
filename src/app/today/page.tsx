import type { Metadata } from "next";
import Link from "next/link";
import { getDailyMovers } from "@/lib/api";
import { SignalBadge } from "@/components/SignalBadge";
import { ChainBadge } from "@/components/ChainBadge";
import { EmailCapture } from "@/components/EmailCapture";
import { SentinelCTA } from "@/components/cta/SentinelCTA";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getDailyMovers().catch(() => null);
  const top = data?.gainers?.[0];
  const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  return {
    title: top
      ? `${top.symbol} leads today's movers — ${date} | BaseRadar`
      : `Today's Crypto Ecosystem Movers — ${date} | BaseRadar`,
    description: top
      ? `${top.symbol} is today's top ecosystem mover with a velocity score of ${top.velocityScore} (${top.signal}). Daily intelligence from BaseRadar.`
      : "Today's top crypto ecosystem movers ranked by velocity score. Updated every 5 minutes.",
  };
}

function formatVol(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

export default async function TodayPage() {
  const data = await getDailyMovers().catch(() => null);
  const date = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const shareText = data?.gainers?.slice(0, 3)
    .map((t) => `${t.symbol} ${t.velocityScore}pts (${t.signal})`)
    .join(" · ");
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Today's top crypto ecosystem movers 📡\n${shareText}\n\nbaseradar.app/today`)}`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Today&apos;s Ecosystem Movers</h1>
          <p className="text-zinc-500 mt-1">{date}</p>
          {data?.updatedAt && (
            <p className="text-zinc-600 text-xs mt-1">
              Last updated: {new Date(data.updatedAt).toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/20 hover:border-white/40 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            Share on X →
          </a>
          <Link href="/ecosystems" className="text-zinc-400 hover:text-white text-sm transition-colors">
            Ecosystems →
          </Link>
        </div>
      </div>

      {!data ? (
        <div className="bg-[#111118] border border-white/5 rounded-xl p-12 text-center text-zinc-500">
          Data temporarily unavailable. Check back shortly.
        </div>
      ) : (
        <>
          {/* Gainers */}
          <section className="space-y-4">
            <h2 className="text-white font-semibold text-lg">Top Gainers</h2>
            <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-4 py-3 font-medium">#</th>
                    <th className="text-left px-4 py-3 font-medium">Token</th>
                    <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Chain</th>
                    <th className="text-right px-4 py-3 font-medium">Score</th>
                    <th className="text-right px-4 py-3 font-medium">Signal</th>
                    <th className="text-right px-4 py-3 font-medium hidden md:table-cell">24h Vol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data.gainers.map((token, i) => (
                    <tr key={token.symbol} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 text-zinc-500 font-mono">{i + 1}</td>
                      <td className="px-4 py-3">
                        <a href={token.url} target="_blank" rel="noopener noreferrer" className="group">
                          <span className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{token.symbol}</span>
                          <span className="text-zinc-500 text-xs ml-2 hidden sm:inline truncate max-w-[120px]">{token.name}</span>
                        </a>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell"><ChainBadge chain={token.chain} /></td>
                      <td className="px-4 py-3 text-right text-cyan-400 font-bold text-base">{token.velocityScore}</td>
                      <td className="px-4 py-3 text-right"><SignalBadge signal={token.signal} /></td>
                      <td className="px-4 py-3 text-right text-zinc-400 hidden md:table-cell">{formatVol(token.volume24h)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Decliners */}
          {data.decliners.length > 0 && (
            <section className="space-y-4">
              <details>
                <summary className="text-zinc-500 text-sm cursor-pointer hover:text-zinc-300 transition-colors select-none">
                  Show decliners ({data.decliners.length})
                </summary>
                <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden mt-3">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-white/5">
                      {data.decliners.map((token, i) => (
                        <tr key={token.symbol} className="hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-zinc-600 font-mono">{i + 1}</td>
                          <td className="px-4 py-3 text-zinc-400 font-semibold">{token.symbol}</td>
                          <td className="px-4 py-3 hidden sm:table-cell"><ChainBadge chain={token.chain} /></td>
                          <td className="px-4 py-3 text-right text-zinc-500 font-bold">{token.velocityScore}</td>
                          <td className="px-4 py-3 text-right"><SignalBadge signal={token.signal} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            </section>
          )}

          <p className="text-zinc-600 text-xs text-center">
            Tracking {data.totalTracked} tokens across all ecosystems
          </p>
        </>
      )}

      <SentinelCTA />

      <EmailCapture label="Get this report delivered daily. Free." />
    </div>
  );
}
