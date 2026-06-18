import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const BASE = "https://www.myceliainteractive.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: BASE, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/vision`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/ls`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/ls/game`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/ls/privacy`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.5 },
  ];
}
