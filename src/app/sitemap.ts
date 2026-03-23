import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://baseradar.app";
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/today`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/ecosystems`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/ecosystems/solana`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/ecosystems/base`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/ecosystems/ethereum`, lastModified: now, changeFrequency: "hourly", priority: 0.8 },
    { url: `${base}/rankings`, lastModified: now, changeFrequency: "hourly", priority: 0.7 },
    { url: `${base}/methodology`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
  ];
}
