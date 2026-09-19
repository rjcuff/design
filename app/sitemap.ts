import type { MetadataRoute } from "next";
import { categories, conceptHref } from "@/app/concepts";
import { siteConfig } from "@/app/site-config";

/**
 * Built from app/concepts.ts, so a new concept appears here without anyone
 * remembering to add it. A sitemap kept by hand is a sitemap that goes stale.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const concepts = categories.flatMap((category) =>
    category.concepts
      // An unwritten concept has no page worth indexing yet.
      .filter((concept) => !concept.soon)
      .map((concept) => ({
        url: `${siteConfig.url}${conceptHref(category.id, concept.id)}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  );

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...concepts,
    {
      url: `${siteConfig.url}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
