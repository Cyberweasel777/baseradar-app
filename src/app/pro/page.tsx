import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BotIndex Pro — Institutional-Grade Crypto Intelligence | BaseRadar",
  description:
    "Convergence signals, predictive analytics, and API access. Institutional-grade crypto intelligence for serious traders. Track 10,000+ tokens across Solana, Base, and Ethereum.",
  openGraph: {
    title: "BotIndex Pro — Institutional-Grade Crypto Intelligence",
    description:
      "Multi-indicator convergence detection, ML-powered trajectory forecasting, and full API access. Built for traders who move before the market.",
    url: "https://baseradar.app/pro",
  },
  alternates: {
    canonical: "https://baseradar.app/pro",
  },
};

const TOOLKIT = [
  {
    icon: "◈",
    title: "Convergence Signals",
    desc: "Multi-indicator alignment detection across velocity, social density, and liquidity shifts. Know when all signals point the same direction — before the crowd does.",
  },
  {
    icon: "⬡",
    title: "Predictive Analytics",
    desc: "ML-powered token trajectory forecasting. See where velocity trends are heading before they show up in price. Based on 12+ months of signal resolution data.",
  },
  {
    icon: "⌗",
    title: "Custom Alerts & API Access",
    desc: "Set threshold-based alerts for any token or ecosystem. Full REST + WebSocket API for building your own tools on top of BotIndex data.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Sign Up",
    desc: "Create your BotIndex Pro account. Linked directly to your BaseRadar profile — no separate login.",
  },
  {
    num: "02",
    title: "Connect Your Watchlist",
    desc: "Pin the tokens and ecosystems you care about. Pro tracks them at the signal level, not just price.",
  },
  {
    num: "03",
    title: "Get Real-Time Signals",
    desc: "Convergence alerts, SURGE notifications, and velocity shifts delivered the moment they're detected.",
  },
];

const FREE_FEATURES = [
  "Live ecosystem scores (Base, Solana, + more)",
  "Daily top movers — SURGE, RISING, STABLE, FADING",
  "Ecosystem rankings updated every 5 minutes",
  "Full methodology, public and transparent",
  "Daily intelligence reports (this blog)",
  "RSS + JSON feed for automation",
];

const PRO_FEATURES = [
  "Everything in BaseRadar Free",
  "Convergence signal alerts (highest-confidence pattern)",
  "ML-powered predictive trajectory scoring",
  "Custom threshold alerts — any token, any ecosystem",
  "Full historical velocity data (12+ months)",
  "REST + WebSocket API access",
  "Prediction accuracy track record dashboard",
  "Multi-ecosystem coverage (Solana, Base, Ethereum)",
  "Priority signal delivery — seconds, not hours",
];

const STATS = [
  { value: "10,000+", label: "tokens tracked across Solana, Base, and Ethereum" },
  { value: "5 min", label: "signal refresh cycle — not hourly, not daily" },
  { value: "72 hrs", label: "avg. lead time — SURGE signals before major moves" },
  { value: "59.8%", label: "SURGE signal accuracy over 338 tracked calls" },
];

export default function ProPage() {
  return (
    <div className="py-12 space-y-24">

      {/* ── Hero ── */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-block rounded-full bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 text-xs font-semibold text-cyan-400 tracking-widest uppercase">
          BotIndex Pro
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
          Welcome to BotIndex Pro
          <br />
          <span className="text-cyan-300">Institutional-grade crypto intelligence</span>
          <br />
          <span className="text-zinc-400 text-3xl sm:text-4xl font-medium">for serious traders.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
          BaseRadar shows you the signal. Pro puts you ahead of it — with convergence detection,
          predictive analytics, and full API access before the market prices it in.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <a
            href="https://botindex.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-8 py-4 text-base font-semibold text-black transition hover:bg-cyan-300"
          >
            Get BotIndex Pro →
          </a>
          <Link
            href="/today"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-8 py-4 text-base font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            See free signals first
          </Link>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <div
            key={s.value}
            className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 text-center space-y-1"
          >
            <p className="text-3xl font-bold text-cyan-300">{s.value}</p>
            <p className="text-xs text-zinc-500 leading-snug">{s.label}</p>
          </div>
        ))}
      </section>

      {/* ── The BotIndex Pro Toolkit ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">The Toolkit</p>
          <h2 className="text-3xl font-bold">BotIndex Pro at a glance</h2>
          <p className="text-zinc-400 max-w-lg mx-auto">
            Three core capabilities that separate signal-driven traders from the noise.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TOOLKIT.map((t) => (
            <div
              key={t.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 space-y-4 hover:border-cyan-500/40 transition-colors"
            >
              <div className="text-3xl text-cyan-400">{t.icon}</div>
              <h3 className="text-lg font-semibold text-white">{t.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">Process</p>
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="text-zinc-400">Three steps from signup to edge.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.num} className="relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 space-y-3">
              <p className="text-4xl font-bold text-zinc-700 font-mono">{step.num}</p>
              <h3 className="text-lg font-semibold text-white">{step.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 text-zinc-700 text-xl z-10">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <p className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">Pricing</p>
          <h2 className="text-3xl font-bold">Simple, transparent pricing</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

          {/* Free tier */}
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-8 space-y-6">
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">BaseRadar Free</p>
              <p className="mt-2 text-4xl font-bold text-white">$0</p>
              <p className="text-zinc-500 text-sm">forever, no card required</p>
            </div>
            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-zinc-400">
                  <span className="mt-0.5 text-emerald-400 shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/today"
              className="inline-flex w-full items-center justify-center rounded-xl border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            >
              Start free →
            </Link>
          </div>

          {/* Pro tier */}
          <div className="rounded-2xl border border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 rounded-bl-2xl bg-cyan-400 px-4 py-1.5 text-xs font-bold text-black tracking-wide uppercase">
              Most Popular
            </div>
            <div>
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">BotIndex Pro</p>
              <div className="mt-2 flex items-baseline gap-2">
                <p className="text-4xl font-bold text-white">$49</p>
                <p className="text-zinc-400 text-sm">/ month</p>
              </div>
              <p className="text-zinc-500 text-sm mt-1">or $399/yr — save 32%</p>
            </div>
            <ul className="space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 text-cyan-400 shrink-0">◆</span>
                  <span className="text-zinc-300">{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://botindex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
            >
              Get BotIndex Pro →
            </a>
          </div>
        </div>
      </section>

      {/* ── Social Proof / Data Points ── */}
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 md:p-12 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cyan-400 tracking-widest uppercase">Track Record</p>
          <h2 className="text-2xl font-bold text-white">The data speaks for itself</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-zinc-300 text-sm font-medium">Tracking 10,000+ tokens</p>
            <p className="text-zinc-500 text-sm">
              Across Solana, Base, and Ethereum — every token with on-chain velocity data gets scored
              and ranked on a rolling 5-minute cycle.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-zinc-300 text-sm font-medium">Updated every 5 minutes</p>
            <p className="text-zinc-500 text-sm">
              Not daily snapshots. Not hourly. Signal data refreshes every 5 minutes so your alerts
              fire when it matters, not after the move already happened.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-zinc-300 text-sm font-medium">72-hour average lead time on SURGE signals</p>
            <p className="text-zinc-500 text-sm">
              Historically, SURGE signals have identified momentum 72 hours before the broadest market
              awareness. That gap is the edge.
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-zinc-300 text-sm font-medium">Auditable, not just claimed</p>
            <p className="text-zinc-500 text-sm">
              Every signal is logged with a timestamp and resolution is tracked at 7, 14, and 30 days.
              Pro gives you access to the full log — not a cherry-picked highlight reel.
            </p>
          </div>
        </div>
        <Link href="/methodology" className="inline-block text-sm text-cyan-400 hover:text-cyan-300 transition">
          Read the full velocity methodology →
        </Link>
      </section>

      {/* ── Final CTA ── */}
      <section className="text-center space-y-6 max-w-2xl mx-auto py-4">
        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
          BaseRadar is always free.
          <br />
          <span className="text-cyan-300">Pro is for when free isn&apos;t enough.</span>
        </h2>
        <p className="text-zinc-400">
          Start with the free signals. When you&apos;re ready to trade on convergence alerts,
          predictive trajectories, and historical data — Pro is one step away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <a
            href="https://botindex.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-cyan-400 px-8 py-4 text-base font-semibold text-black transition hover:bg-cyan-300"
          >
            Get BotIndex Pro →
          </a>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-8 py-4 text-base font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
          >
            Read free intelligence reports
          </Link>
        </div>
      </section>

    </div>
  );
}
