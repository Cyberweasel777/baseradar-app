import type { Metadata } from "next";
import Link from "next/link";
import { getEcosystemRankings } from "@/lib/api";
import { SignalBadge } from "@/components/SignalBadge";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Crypto Ecosystem Velocity Rankings | BaseRadar",
  description: "All crypto ecosystems ranked by token velocity score. Which chains have the most momentum right now? Updated daily by BaseRadar.",
};

export default async function RankingsPage() {
  const data = await getEcosystemRankings().catch(() => null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Ecosystem Velocity Rankings</h1>
        <p className="text-zinc-400 mt-2">
          All tracked ecosystems ranked by average token velocity score. Ranked by momentum, not market cap.
        </p>
        {data?.updatedAt && (
          <p className="text-zinc-600 text-xs mt-2">
            Updated: {new Date(data.updatedAt).toLocaleString()}
          </p>
        )}
      </div>

      {!data ? (
        <div className="bg-[#111118] border border-white/5 rounded-xl p-12 text-center text-zinc-500">
          Data temporarily unavailable. Check back shortly.
        </div>
      ) : (
        <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-medium">Rank</th>
                <th className="text-left px-4 py-3 font-medium">Ecosystem</th>
                <th className="text-right px-4 py-3 font-medium">Avg Score</th>
                <th className="text-right px-4 py-3 font-medium">Top Signal</th>
                <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Surge↑</th>
                <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Rising</th>
                <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Tokens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {data.ecosystems.map((eco) => (
                <tr key={eco.slug} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-4 text-zinc-500 font-mono">{eco.rank}</td>
                  <td className="px-4 py-4">
                    <Link href={`/ecosystems/${eco.slug}`} className="text-white hover:text-cyan-400 font-semibold transition-colors">
                      {eco.name}
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-right text-cyan-400 font-bold text-base">{eco.avgScore.toFixed(1)}</td>
                  <td className="px-4 py-4 text-right">
                    <SignalBadge signal={eco.topToken?.signal ?? "STABLE"} />
                  </td>
                  <td className="px-4 py-4 text-right text-green-400 hidden md:table-cell">{eco.surgeCount}</td>
                  <td className="px-4 py-4 text-right text-blue-400 hidden md:table-cell">{eco.risingCount}</td>
                  <td className="px-4 py-4 text-right text-zinc-400 hidden md:table-cell">{eco.totalTokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-6 text-sm text-zinc-500">
        <Link href="/ecosystems" className="hover:text-zinc-300 transition-colors">← All Ecosystems</Link>
        <Link href="/today" className="hover:text-zinc-300 transition-colors">Today&apos;s Movers →</Link>
      </div>
    </div>
  );
}
