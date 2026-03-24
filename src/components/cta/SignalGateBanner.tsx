"use client";

import { useState } from "react";
import Link from "next/link";

export function SignalGateBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-950 border-t border-zinc-800 px-4 py-3 flex items-center justify-between gap-4">
      <p className="text-sm text-zinc-300">
        BaseRadar shows the surface.{" "}
        <span className="text-cyan-400">BotIndex shows what&apos;s underneath.</span>
      </p>
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="https://botindex.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-zinc-200"
        >
          Get Full Signals →
        </Link>
        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-500 hover:text-zinc-300 transition text-lg leading-none"
          aria-label="Dismiss"
        >
          ×
        </button>
      </div>
    </div>
  );
}
