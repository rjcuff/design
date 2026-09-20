import { ImageResponse } from "next/og";

import { categories, findConcept } from "@/app/concepts";
import { siteConfig } from "@/app/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `A design engineering concept on ${siteConfig.title}`;

export function generateStaticParams() {
  return categories.flatMap((category) =>
    category.concepts
      // Unwritten concepts have no page. They are listed in the sidebar as
      // plain text rather than links, so nothing points here.
      .filter((concept) => !concept.soon)
      .map((concept) => ({
        category: category.id,
        concept: concept.id,
      })),
  );
}

/**
 * Share card for a concept. The title carries the card, with the description
 * under it, so a link posted anywhere says which concept it is rather than
 * only which site.
 */
export default async function ConceptOgImage({
  params,
}: {
  params: Promise<{ category: string; concept: string }>;
}) {
  const { category, concept } = await params;
  const found = findConcept(category, concept);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#0f0f0f",
        padding: "88px 96px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            display: "flex",
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: "#f97316",
          }}
        />
        <div style={{ display: "flex", fontSize: 30, color: "#8a8a8a" }}>
          {siteConfig.title}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            letterSpacing: "-0.03em",
            color: "#ededed",
          }}
        >
          {found?.concept.title ?? siteConfig.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 34,
            lineHeight: 1.4,
            color: "#8a8a8a",
          }}
        >
          {found?.concept.description ?? siteConfig.description}
        </div>
      </div>
    </div>,
    size,
  );
}
