import type { Metadata } from "next";
import Link from "next/link";
import { SignalGateBanner } from "@/components/cta/SignalGateBanner";

export const revalidate = 300;

function parsePair(pair: string) {
  const parts = pair.split("-vs-");
  return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1));
}

export async function generateMetadata({ params }: { params: Promise<{ pair: string }> }): Promise<Metadata> {
  const { pair } = await params;
  const [a, b] = parsePair(pair);
  return {
    title: `${a} vs ${b} Ecosystem Intelligence | BaseRadar`,
    description: `Compare ${a} and ${b} ecosystem velocity, token momentum, and signal activity. Powered by BaseRadar.`,
  };
}

export default async function ComparePage({ params }: { params: Promise<{ pair: string }> }) {
  const { pair } = await params;
  const [a, b] = parsePair(pair);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white">{a} vs {b}: Ecosystem Comparison</h1>
        <p className="text-zinc-400 mt-3">
          Full velocity-based comparison data for {a} and {b} is in development. In the meantime, explore each ecosystem&apos;s live intelligence below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href={`/ecosystems/${a.toLowerCase()}`}
          className="bg-[#111118] border border-white/5 rounded-xl p-6 hover:border-cyan-500/40 transition-colors"
        >
          <h2 className="text-white font-semibold text-lg">{a}</h2>
          <p className="text-zinc-500 text-sm mt-1">View {a} ecosystem intelligence →</p>
        </Link>
        <Link
          href={`/ecosystems/${b.toLowerCase()}`}
          className="bg-[#111118] border border-white/5 rounded-xl p-6 hover:border-cyan-500/40 transition-colors"
        >
          <h2 className="text-white font-semibold text-lg">{b}</h2>
          <p className="text-zinc-500 text-sm mt-1">View {b} ecosystem intelligence →</p>
        </Link>
      </div>

      <Link href="/rankings" className="inline-block text-sm text-cyan-400 hover:text-cyan-300 transition">
        View current ecosystem rankings →
      </Link>

      <SignalGateBanner />
    </div>
  );
}
