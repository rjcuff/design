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
 * Share card for a concept. The title, centered, and nothing else. The
 * description is already in the link preview underneath the image, so putting
 * it on the image too just prints it twice at a size nobody can read.
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
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
        padding: "0 120px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 100,
          lineHeight: 1.15,
          letterSpacing: "-0.04em",
          textAlign: "center",
          color: "#ededed",
        }}
      >
        {found?.concept.title ?? siteConfig.title}
      </div>
    </div>,
    size,
  );
}
