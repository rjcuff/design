import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/site-config";

export const alt = siteConfig.description;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The site's share card.
 *
 * Same treatment as the concept and Goodies cards: wordmark up top, the line
 * that matters below it, on the site's own canvas. This was a white card with
 * an orange dot, left over from before the site went dark, so a link to the
 * home page looked like it came from somewhere else entirely.
 */
export default function OpengraphImage() {
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
      <div style={{ display: "flex", fontSize: 30, color: "#8a8a8a" }}>
        {siteConfig.title}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 60,
          lineHeight: 1.25,
          letterSpacing: "-0.03em",
          color: "#ededed",
        }}
      >
        {siteConfig.description}
      </div>
    </div>,
    size,
  );
}
