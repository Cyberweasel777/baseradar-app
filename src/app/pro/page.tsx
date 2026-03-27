import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BotIndex Pro — Advanced Velocity Signals | BaseRadar",
  description:
    "Convergence alerts, unlimited real-time signals, full historical velocity data, and API access. Built for traders who move before the market.",
  openGraph: {
    title: "BotIndex Pro — Advanced Velocity Signals",
    description:
      "The intelligence layer under BaseRadar. Convergence alerts, prediction accuracy tracking, and API access for velocity-driven traders.",
    url: "https://baseradar.app/pro",
  },
  alternates: {
    canonical: "https://baseradar.app/pro",
  },
};

const FREE_FEATURES = [
  "Live ecosystem scores (Base, Solana, + more)",
  "Daily top movers — SURGE, RISING, STABLE, FADING",
  "Ecosystem rankings updated every 5 minutes",
  "Full methodology, public and transparent",
  "Daily intelligence reports (this blog)",
  "RSS + JSON feed for automation",
];

const PRO_FEATURES = [
  {
    title: "Convergence Alerts",
    desc: "Get notified the moment on-chain velocity and social momentum align on the same token. The highest-confidence signal pattern we track.",
  },
  {
    title: "Unlimited Real-Time Alerts",
    desc: "Set thresholds by score, signal tier, ecosystem, or volume. Alerts fire within seconds of a signal upgrade — not hours.",
  },
  {
    title: "Prediction Accuracy Track Record",
    desc: "Every SURGE and RISING signal is logged. See how each call resolved over 7, 14, and 30 days. No cherry-picking.",
  },
  {
    title: "Full Historical Velocity Data",
    desc: "Query velocity scores, signal transitions, and volume data going back 12+ months. Backtest patterns before you trade them.",
  },
  {
    title: "API Access",
    desc: "Pull live and historical velocity data into your own tools, bots, or dashboards. REST + WebSocket endpoints.",
  },
  {
    title: "Multi-Ecosystem Coverage",
    desc: "Base, Solana, and additional ecosystems added on a rolling basis. One subscription, the full picture.",
  },
];

export default function ProPage() {
  return (
    <div className="py-12 space-y-20">
      {/* Hero */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-block rounded-full bg-cyan-500/10 border border-cyan-500/30 px-4 py-1.5 text-xs font-semibold text-cyan-400 tracking-wide uppercase">
          BotIndex Pro
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          BaseRadar shows you the signal.
          <br />
          <span className="text-cyan-300">Pro puts you ahead of it.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
          Convergence alerts, real-time notifications, full historical data, and API access — for
          traders who act on velocity before the market prices it in.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://botindex.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-zinc-200"
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

      {/* Free vs Pro */}
      <section className="grid md:grid-cols-2 gap-6">
        {/* Free */}
        <div className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-8 space-y-5">
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">BaseRadar Free</p>
            <p className="mt-1 text-2xl font-bold text-white">$0 / forever</p>
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
            className="inline-block text-sm text-cyan-400 hover:text-cyan-300 transition"
          >
            See today&apos;s free signals →
          </Link>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-8 space-y-5">
          <div>
            <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wide">BotIndex Pro</p>
            <p className="mt-1 text-2xl font-bold text-white">
              Advanced signals + API
            </p>
          </div>
          <ul className="space-y-3">
            {PRO_FEATURES.map((f) => (
              <li key={f.title} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 text-cyan-400 shrink-0">◆</span>
                <span>
                  <span className="text-white font-medium">{f.title}</span>
                  <span className="text-zinc-400"> — {f.desc}</span>
                </span>
              </li>
            ))}
          </ul>
          <a
            href="https://botindex.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Get BotIndex Pro →
          </a>
        </div>
      </section>

      {/* How convergence works */}
      <section className="space-y-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-cyan-300">What is a convergence signal?</h2>
        <p className="text-zinc-400">
          BaseRadar tracks on-chain velocity and social momentum as separate feeds. Most of the time
          they diverge — on-chain moves without social, or social spikes without on-chain follow-through.
        </p>
        <p className="text-zinc-400">
          A convergence signal fires when both feeds align on the same token within a narrow time window.
          Historically, convergence precedes the biggest single-session moves by hours. It&apos;s the
          highest-confidence pattern in the velocity dataset.
        </p>
        <p className="text-zinc-400">
          BotIndex Pro alerts you the moment convergence is detected — before the signal shows up in
          general rankings. That time gap is the edge.
        </p>
        <Link href="/methodology" className="text-sm text-cyan-400 hover:text-cyan-300 transition">
          Read the full velocity methodology →
        </Link>
      </section>

      {/* Social proof / track record anchor */}
      <section className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-8 space-y-4">
        <h2 className="text-xl font-semibold text-white">Transparent track record</h2>
        <p className="text-zinc-400 text-sm">
          Every SURGE and RISING signal generated by BotIndex is logged with a timestamp. Resolution
          is tracked at 7, 14, and 30 days. The track record is part of your Pro dashboard — not a
          marketing claim, an auditable log.
        </p>
        <p className="text-zinc-400 text-sm">
          If the signals don&apos;t perform, the data shows it. That&apos;s the accountability model.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-semibold">
          BaseRadar is always free.
          <br />
          <span className="text-cyan-300">Pro is for when free isn&apos;t enough.</span>
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto">
          Start with the free signals. When you&apos;re ready to trade on convergence alerts and
          historical data, Pro is one step away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://botindex.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-zinc-200"
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
