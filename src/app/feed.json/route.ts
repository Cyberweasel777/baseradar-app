import { getAllPosts } from "@/lib/blog";

const SITE = "https://baseradar.app";

export async function GET() {
  const posts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "BaseRadar — Crypto Ecosystem Intelligence",
    home_page_url: SITE,
    feed_url: `${SITE}/feed.json`,
    description:
      "Free daily intelligence on token velocity, ecosystem momentum, and on-chain signals across Base, Solana, and Ethereum.",
    icon: `${SITE}/favicon.ico`,
    language: "en-US",
    items: posts.slice(0, 50).map((post) => ({
      id: `${SITE}/blog/${post.slug}`,
      url: `${SITE}/blog/${post.slug}`,
      title: post.title,
      summary: post.description,
      date_published: new Date(post.date).toISOString(),
      tags: post.tags,
    })),
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
