"use client";

import { useState } from "react";

export function EmailCapture({ label = "Get daily ecosystem intelligence. Free." }: { label?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSubmitted(true);
  }

  return (
    <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-8 text-center">
      <h2 className="text-2xl font-semibold text-white">{label}</h2>
      <p className="mt-2 text-zinc-400 text-sm">Top movers, signal events, ecosystem shifts — every morning.</p>
      {submitted ? (
        <p className="mt-6 text-emerald-400 font-medium">✓ You&apos;re in. Check your inbox.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 text-sm transition"
          />
          <button
            type="submit"
            className="rounded-xl bg-white px-6 py-3 text-black font-semibold text-sm transition hover:bg-zinc-200"
          >
            Subscribe →
          </button>
        </form>
      )}
      <p className="mt-4 text-zinc-600 text-xs">
        Or{" "}
        <a href="https://t.me/botindexdev" className="text-zinc-400 hover:text-white transition underline" target="_blank" rel="noopener noreferrer">
          join Telegram
        </a>{" "}
        for daily drops.
      </p>
    </div>
  );
}
