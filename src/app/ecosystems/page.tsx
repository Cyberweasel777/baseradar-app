import type { Metadata } from "next";
import Link from "next/link";
import { getEcosystemRankings } from "@/lib/api";
import { SignalBadge } from "@/components/SignalBadge";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Crypto Ecosystem Intelligence — Rankings | BaseRadar",
  description: "Which crypto ecosystems are actually growing? BaseRadar ranks chains by token velocity and developer activity. Updated daily.",
};

export default async function EcosystemsPage() {
  const data = await getEcosystemRankings().catch(() => null);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white">Ecosystem Intelligence</h1>
        <p className="text-zinc-400 mt-2">Ranked by token velocity and developer activity. Not price. Updated daily.</p>
      </div>

      {!data ? (
        <div className="bg-[#111118] border border-white/5 rounded-xl p-12 text-center text-zinc-500">
          Data temporarily unavailable. Check back shortly.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.ecosystems.map((eco) => (
            <Link
              key={eco.slug}
              href={`/ecosystems/${eco.slug}`}
              className="bg-[#111118] border border-white/5 hover:border-white/10 rounded-xl p-6 space-y-4 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-zinc-500 text-xs font-medium">#{eco.rank}</span>
                  <h2 className="text-white font-bold text-xl group-hover:text-cyan-400 transition-colors">{eco.name}</h2>
                </div>
                <SignalBadge signal={eco.topToken?.signal ?? "STABLE"} />
              </div>
              <div>
                <p className="text-cyan-400 text-4xl font-bold">{eco.avgScore.toFixed(1)}</p>
                <p className="text-zinc-500 text-xs mt-1">avg velocity score</p>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                <div className="text-center">
                  <p className="text-green-400 font-semibold">{eco.surgeCount}</p>
                  <p className="text-zinc-600 text-xs">SURGE</p>
                </div>
                <div className="text-center">
                  <p className="text-blue-400 font-semibold">{eco.risingCount}</p>
                  <p className="text-zinc-600 text-xs">RISING</p>
                </div>
                <div className="text-center">
                  <p className="text-zinc-300 font-semibold">{eco.totalTokens}</p>
                  <p className="text-zinc-600 text-xs">tokens</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
