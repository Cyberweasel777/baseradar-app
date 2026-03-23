import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BaseRadar — Crypto Ecosystem Intelligence",
  description: "Daily momentum signals for crypto ecosystems and tokens. Track which chains and projects are gaining velocity. Free, updated daily.",
  openGraph: {
    title: "BaseRadar — Crypto Ecosystem Intelligence",
    description: "Track which chains and tokens are gaining momentum before the market prices it in.",
    url: "https://baseradar.app",
    siteName: "BaseRadar",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BaseRadar — Crypto Ecosystem Intelligence",
    description: "Track which chains and tokens are gaining momentum before the market prices it in.",
  },
};

const NAV_LINKS = [
  { href: "/today", label: "Today" },
  { href: "/ecosystems", label: "Ecosystems" },
  { href: "/rankings", label: "Rankings" },
  { href: "/methodology", label: "Methodology" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0f] text-zinc-100 min-h-screen flex flex-col">
        {/* Nav */}
        <header className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="text-white font-bold text-lg tracking-tight">
              BaseRadar
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-zinc-400 hover:text-white text-sm transition-colors">
                  {l.label}
                </Link>
              ))}
            </nav>
            <a
              href="https://botindex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-semibold px-3 py-1.5 rounded transition-colors"
            >
              BotIndex Pro →
            </a>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1">{children}</main>

        {/* Footer */}
        <footer className="border-t border-white/5 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-zinc-500 text-sm">
            <p>© 2026 BaseRadar · Powered by <a href="https://botindex.dev" className="hover:text-zinc-300 underline">BotIndex</a> intelligence</p>
            <div className="flex items-center gap-4">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-zinc-300 transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
