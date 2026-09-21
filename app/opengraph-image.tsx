import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/site-config";

export const alt = siteConfig.description;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The site's share card.
 *
 * Black, with the name in the middle, and nothing else. A share card is read
 * at thumbnail size in a feed, where a strapline is too small to read and a
 * wordmark in the corner is too small to notice. One word at this size
 * survives the shrink.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000000",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 132,
          letterSpacing: "-0.04em",
          color: "#ededed",
        }}
      >
        {siteConfig.title}
      </div>
    </div>,
    size,
  );
}
