import { ImageResponse } from "next/og";

import { siteConfig } from "@/app/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Goodies, ${siteConfig.title}`;

/**
 * Share card for the links page. Title only, on the same black canvas as the
 * rest of the cards, so a set of links from this site reads as a set.
 */
export default function GoodiesOgImage() {
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
          fontSize: 112,
          letterSpacing: "-0.04em",
          color: "#ededed",
        }}
      >
        Goodies
      </div>
    </div>,
    size,
  );
}
