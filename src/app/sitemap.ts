import type { MetadataRoute } from "next";
import { caseStudies } from "@/data/case-studies";
import { getSiteUrl } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const lastModified = process.env.NEXT_PUBLIC_BUILD_DATE ?? new Date().toISOString();
  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    ...caseStudies.map((c) => ({
      url: `${base}/projects/${c.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
