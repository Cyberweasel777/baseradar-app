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
    <div className="bg-[#111118] border border-white/5 rounded-xl p-8 text-center">
      <p className="text-white font-semibold text-lg mb-1">{label}</p>
      <p className="text-zinc-500 text-sm mb-6">Top movers, signal events, ecosystem shifts — every morning.</p>
      {submitted ? (
        <p className="text-cyan-400 font-medium">✓ You&apos;re in. Check your inbox.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 text-sm"
          />
          <button
            type="submit"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Subscribe →
          </button>
        </form>
      )}
      <p className="text-zinc-600 text-xs mt-4">
        Or{" "}
        <a href="https://t.me/botindexdev" className="text-zinc-400 hover:text-white underline" target="_blank" rel="noopener noreferrer">
          join Telegram
        </a>{" "}
        for daily drops.
      </p>
    </div>
  );
}
