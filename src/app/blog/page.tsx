import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Crypto Ecosystem Intelligence Reports | BaseRadar",
  description: "Research, analysis, and intelligence on crypto ecosystem momentum, token velocity, and on-chain signals. Free from BaseRadar.",
  openGraph: {
    title: "Crypto Ecosystem Intelligence Reports | BaseRadar",
    description: "Research and intelligence on crypto ecosystem momentum, token velocity, and on-chain signals.",
    url: "https://baseradar.app/blog",
    siteName: "BaseRadar",
    type: "website",
  },
  alternates: { canonical: "https://baseradar.app/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="py-12 space-y-10">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-cyan-400 mb-2">Intelligence Reports</p>
        <h1 className="text-3xl font-bold text-white">Research & Analysis</h1>
        <p className="text-zinc-400 mt-2">Deep dives on ecosystem momentum, velocity signals, and crypto intelligence methodology.</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-zinc-500">No posts yet. Check back soon.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 hover:border-zinc-700 transition-colors group">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <time className="text-zinc-500 text-xs">
                  {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
                <span className="text-zinc-700 text-xs">·</span>
                <span className="text-zinc-500 text-xs">{post.readingTime} min read</span>
                {post.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
              <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed">{post.description}</p>
              <Link href={`/blog/${post.slug}`} className="inline-block mt-4 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}

      {/* Live data CTA */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-6 text-center">
        <p className="text-white font-semibold">Want the live data?</p>
        <p className="text-zinc-400 text-sm mt-1">Every concept in these articles is tracked in real time on BaseRadar. Free, no account needed.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Link href="/today" className="rounded-xl bg-white px-5 py-2 text-black font-semibold text-sm transition hover:bg-zinc-200">
            Today&apos;s Movers →
          </Link>
          <Link href="/ecosystems" className="rounded-xl border border-zinc-600 bg-zinc-900 px-5 py-2 text-zinc-100 font-medium text-sm transition hover:bg-zinc-800">
            Ecosystem Rankings →
          </Link>
        </div>
      </div>
    </div>
  );
}
