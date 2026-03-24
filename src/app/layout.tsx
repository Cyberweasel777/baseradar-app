import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BaseRadar — Crypto Ecosystem Intelligence",
  description: "Track which crypto ecosystems and tokens are gaining momentum — before the market prices it in. Free daily intelligence from DexScreener, Zora, and PumpFun.",
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
  { href: "/blog", label: "Research" },
  { href: "/methodology", label: "Methodology" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased`}>
        {/* Nav */}
        <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-[#0a0a0a]/90 backdrop-blur">
          <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              BaseRadar<span className="text-cyan-400">.</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="transition hover:text-white">
                  {l.label}
                </Link>
              ))}
            </div>
            <a
              href="https://botindex.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 text-sm text-cyan-300 transition hover:bg-cyan-400/20"
            >
              BotIndex Pro →
            </a>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {children}
        </main>

        <footer className="border-t border-zinc-800/80 py-8 mt-16">
          <div className="mx-auto flex w-full max-w-6xl flex-col md:flex-row items-center justify-between gap-4 px-4 text-sm text-zinc-500 sm:px-6 lg:px-8">
            <p>© 2026 BaseRadar · Powered by <a href="https://botindex.dev" className="hover:text-zinc-300 transition">BotIndex</a> intelligence</p>
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-zinc-300 transition">
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
