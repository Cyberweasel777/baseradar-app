import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  verification: {
    google: "1RgCHzc4yCxsvPaiBogqRwpWZY_69Xbqzk2AbBsGZfw",
  },
  title: "BaseRadar — Crypto Ecosystem Intelligence",
  description: "Track which crypto ecosystems and tokens are gaining momentum — before the market prices it in. Free daily intelligence from DexScreener, Zora, and PumpFun.",
  alternates: {
    types: {
      "application/rss+xml": "https://baseradar.app/rss.xml",
      "application/feed+json": "https://baseradar.app/feed.json",
    },
  },
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
  { href: "/pro", label: "Pro" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0SCHX3MTRZ"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0SCHX3MTRZ');
          `}
        </Script>
        {/* JSON-LD: WebSite + Organization + SearchAction */}
        <Script
          id="jsonld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://baseradar.app/#website",
                  "url": "https://baseradar.app",
                  "name": "BaseRadar",
                  "description": "Track which crypto ecosystems and tokens are gaining momentum before the market prices it in. Free daily intelligence from DexScreener, Zora, and PumpFun.",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": {
                      "@type": "EntryPoint",
                      "urlTemplate": "https://baseradar.app/rankings?q={search_term_string}"
                    },
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "Organization",
                  "@id": "https://baseradar.app/#organization",
                  "name": "BaseRadar",
                  "url": "https://baseradar.app",
                  "description": "BaseRadar is a crypto ecosystem intelligence platform that tracks token velocity and momentum across Base, Solana, and Ethereum.",
                  "sameAs": [
                    "https://botindex.dev"
                  ]
                }
              ]
            })
          }}
        />
        {/* JSON-LD: FAQPage — How It Works */}
        <Script
          id="jsonld-faq"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is BaseRadar?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "BaseRadar is a crypto ecosystem intelligence platform that continuously tracks token velocity and momentum across Base, Solana, and Ethereum using data from DexScreener, Zora, and PumpFun."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does BaseRadar score tokens?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Every token receives a velocity score from 0 to 100 based on how fast activity is accelerating relative to its own baseline. Velocity leads price — it measures volume acceleration, holder growth, and ecosystem activity in real time."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How often is BaseRadar data updated?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "BaseRadar updates token velocity scores every 60 seconds using live data from DexScreener, Zora, and PumpFun across Solana, Base, and Ethereum."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is BaseRadar free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. BaseRadar provides free daily ecosystem intelligence, token velocity rankings, and momentum signals. Advanced intelligence is available through BotIndex."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What data sources does BaseRadar use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "BaseRadar aggregates data from DexScreener, Zora, and PumpFun to track cross-chain token velocity across Solana, Base, and Ethereum ecosystems."
                  }
                }
              ]
            })
          }}
        />
      </head>
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
