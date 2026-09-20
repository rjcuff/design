import { ImageResponse } from "next/og";

import { goodGroups } from "@/app/goodies";
import { siteConfig } from "@/app/site-config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `Goodies, ${siteConfig.title}`;

const count = goodGroups.reduce(
  (total, group) => total + group.goods.length,
  0,
);

/**
 * Share card for the links page.
 *
 * Carries the group names, because what makes this page worth opening is the
 * range rather than the title. A card that only said "Goodies" would tell a
 * reader nothing they could act on.
 */
export default function GoodiesOgImage() {
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

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            display: "flex",
            fontSize: 76,
            letterSpacing: "-0.03em",
            color: "#ededed",
          }}
        >
          Goodies
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#8a8a8a" }}>
          {count} links worth keeping.{" "}
          {goodGroups.map((group) => group.title).join(", ")}.
        </div>
      </div>
    </div>,
    size,
  );
}
