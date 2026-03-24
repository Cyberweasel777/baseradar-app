import { getAllPosts } from "@/lib/blog";

const SITE = "https://baseradar.app";
const TITLE = "BaseRadar — Crypto Ecosystem Intelligence";
const DESCRIPTION =
  "Free daily intelligence on token velocity, ecosystem momentum, and on-chain signals across Base, Solana, and Ethereum.";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = getAllPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const items = posts
    .slice(0, 50)
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE}/blog/${post.slug}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(TITLE)}</title>
    <link>${SITE}</link>
    <description>${escapeXml(DESCRIPTION)}</description>
    <language>en-us</language>
    <managingEditor>intelligence@baseradar.app (BaseRadar)</managingEditor>
    <webMaster>intelligence@baseradar.app (BaseRadar)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE}/favicon.ico</url>
      <title>${escapeXml(TITLE)}</title>
      <link>${SITE}</link>
    </image>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
