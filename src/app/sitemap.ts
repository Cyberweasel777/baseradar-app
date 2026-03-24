import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://baseradar.app";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                              lastModified: now, changeFrequency: "hourly",  priority: 1.0 },
    { url: `${base}/today`,                   lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${base}/rankings`,                lastModified: now, changeFrequency: "hourly",  priority: 0.8 },
    { url: `${base}/ecosystems`,              lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${base}/ecosystems/solana`,       lastModified: now, changeFrequency: "hourly",  priority: 0.8 },
    { url: `${base}/ecosystems/base`,         lastModified: now, changeFrequency: "hourly",  priority: 0.8 },
    { url: `${base}/ecosystems/ethereum`,     lastModified: now, changeFrequency: "hourly",  priority: 0.8 },
    { url: `${base}/compare/solana-vs-base`,          lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/compare/base-vs-ethereum`,        lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/compare/ethereum-vs-solana`,      lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/blog`,                    lastModified: now, changeFrequency: "daily",   priority: 0.7 },
    { url: `${base}/methodology`,             lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Dynamically include every blog post — auto-updates as new posts are published
  const posts = getAllPosts();
  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
