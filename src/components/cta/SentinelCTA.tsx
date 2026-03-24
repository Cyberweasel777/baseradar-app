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
