import type { MetadataRoute } from "next";
import { siteConfig } from "@/app/site-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The product download. Keeps it out of search results, which is the
      // only thing robots.txt can do. It is a request to crawlers, not access
      // control. The unguessable filename is what actually protects it.
      disallow: "/*.zip$",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
