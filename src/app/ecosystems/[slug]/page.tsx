import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEcosystemSummary } from "@/lib/api";
import { SignalBadge } from "@/components/SignalBadge";
import { ChainBadge } from "@/components/ChainBadge";
import { EmailCapture } from "@/components/EmailCapture";
import { SentinelCTA } from "@/components/cta/SentinelCTA";

export const revalidate = 300;

const KNOWN_CHAINS = ["solana", "base", "ethereum"];

const RELATED_COMPARISONS: Record<string, { label: string; href: string }[]> = {
  solana: [{ label: "Compare Solana vs Base →", href: "/compare/solana-vs-base" }],
  base: [{ label: "Compare Base vs Ethereum →", href: "/compare/base-vs-ethereum" }],
  ethereum: [{ label: "Compare Ethereum vs Solana →", href: "/compare/ethereum-vs-solana" }],
};

export async function generateStaticParams() {
  return KNOWN_CHAINS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getEcosystemSummary(slug).catch(() => null);
  if (!data) return { title: `${slug} Ecosystem | BaseRadar` };
  const eco = data.ecosystem;
  return {
    title: `${eco.name} Ecosystem Momentum — Score ${eco.avgScore.toFixed(1)} | BaseRadar`,
    description: `${eco.name} ecosystem intelligence: ${eco.totalTokens} tokens tracked, ${eco.surgeCount} in SURGE, ${eco.risingCount} RISING. Average velocity score: ${eco.avgScore.toFixed(1)}. Updated daily.`,
    openGraph: {
      title: `${eco.name}: Score ${eco.avgScore.toFixed(1)} · ${eco.topToken?.signal} Signal`,
      description: `${eco.surgeCount} tokens surging, ${eco.risingCount} rising. Ranked #${eco.rank} by ecosystem velocity.`,
    },
  };
}

export default async function EcosystemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getEcosystemSummary(slug).catch(() => null);
  if (!data) notFound();
  const eco = data.ecosystem;
  const related = RELATED_COMPARISONS[slug] ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/ecosystems" className="hover:text-zinc-300 transition-colors">Ecosystems</Link>
        <span>›</span>
        <span className="text-zinc-300">{eco.name}</span>
      </nav>

      {/* Hero */}
      <div className="space-y-4">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">{eco.name}</h1>
            <p className="text-zinc-500 mt-1">Ecosystem Intelligence · Rank #{eco.rank}</p>
          </div>
          <SignalBadge signal={eco.topToken?.signal ?? "STABLE"} />
        </div>
        <div className="flex items-end gap-4">
          <p className="text-cyan-400 text-7xl font-bold leading-none">{eco.avgScore.toFixed(1)}</p>
          <p className="text-zinc-500 text-sm mb-2">avg velocity score</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Rank", value: `#${eco.rank}`, color: "text-white" },
          { label: "SURGE tokens", value: eco.surgeCount, color: "text-green-400" },
          { label: "RISING tokens", value: eco.risingCount, color: "text-blue-400" },
          { label: "Total tracked", value: eco.totalTokens, color: "text-zinc-300" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111118] border border-white/5 rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-zinc-500 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top Tokens */}
      {eco.topTokens?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-white font-semibold text-lg">Top Tokens in {eco.name}</h2>
          <div className="bg-[#111118] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">#</th>
                  <th className="text-left px-4 py-3 font-medium">Token</th>
                  <th className="text-right px-4 py-3 font-medium">Score</th>
                  <th className="text-right px-4 py-3 font-medium">Signal</th>
                  <th className="text-right px-4 py-3 font-medium hidden md:table-cell">Chain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {eco.topTokens.map((token, i) => (
                  <tr key={token.symbol} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-zinc-500">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a href={token.url} target="_blank" rel="noopener noreferrer" className="group">
                        <span className="text-white font-semibold group-hover:text-cyan-400 transition-colors">{token.symbol}</span>
                        <span className="text-zinc-500 text-xs ml-2 hidden sm:inline">{token.name}</span>
                      </a>
                    </td>
                    <td className="px-4 py-3 text-right text-cyan-400 font-bold">{token.velocityScore}</td>
                    <td className="px-4 py-3 text-right"><SignalBadge signal={token.signal} /></td>
                    <td className="px-4 py-3 text-right hidden md:table-cell"><ChainBadge chain={token.chain} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related comparisons */}
      {related.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-zinc-500 text-sm font-medium uppercase tracking-wider">Compare</h3>
          <div className="flex flex-wrap gap-3">
            {related.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="border border-white/10 hover:border-cyan-500/40 text-zinc-300 hover:text-cyan-400 text-sm px-4 py-2 rounded-lg transition-colors"
              >
                {r.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <SentinelCTA />

      <EmailCapture label={`Get daily ${eco.name} intelligence. Free.`} />
    </div>
  );
}
