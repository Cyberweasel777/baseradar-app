import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { MarkdownContent } from "@/components/MarkdownContent";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found | BaseRadar" };
  return {
    title: `${post.title} | BaseRadar`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug, post.tags);

  return (
    <div className="py-12">
      <div className="max-w-3xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-zinc-500 mb-8">
          <Link href="/blog" className="hover:text-zinc-300 transition">Intelligence Reports</Link>
          <span>›</span>
          <span className="text-zinc-400 truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <time className="text-zinc-500 text-sm">
              {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </time>
            <span className="text-zinc-700">·</span>
            <span className="text-zinc-500 text-sm">{post.readingTime} min read</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">{post.title}</h1>
          <p className="text-xl text-zinc-400 leading-relaxed">{post.description}</p>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-zinc-800 text-zinc-400 text-xs px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </header>

        {/* Article content */}
        <MarkdownContent content={post.content} />

        {/* Related posts */}
        {related.length > 0 && (
          <aside className="mt-16 pt-8 border-t border-zinc-800">
            <h3 className="text-white font-semibold mb-6">Related Intelligence</h3>
            <div className="space-y-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="block rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-zinc-700 transition-colors group"
                >
                  <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">{p.title}</p>
                  <p className="text-zinc-500 text-sm mt-1">{p.description}</p>
                </Link>
              ))}
            </div>
          </aside>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/5 p-8 text-center">
          <p className="text-white font-semibold text-lg">See it live.</p>
          <p className="text-zinc-400 text-sm mt-2">BaseRadar tracks this in real time. Free, no account needed.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
            <Link href="/today" className="rounded-xl bg-white px-6 py-2.5 text-black font-semibold text-sm transition hover:bg-zinc-200">
              Today&apos;s Movers →
            </Link>
            <Link href="/ecosystems" className="rounded-xl border border-zinc-600 bg-zinc-900 px-6 py-2.5 text-zinc-100 font-medium text-sm transition hover:bg-zinc-800">
              Ecosystem Rankings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
