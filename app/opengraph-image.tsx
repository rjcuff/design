import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/site-config";

export const alt = siteConfig.description;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 28,
        backgroundColor: "#ffffff",
        padding: "96px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexShrink: 0,
          width: 44,
          height: 44,
          borderRadius: "50%",
          backgroundColor: "#f97316",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 52,
          letterSpacing: "-0.02em",
          color: "#171717",
        }}
      >
        {siteConfig.description}
      </div>
    </div>,
    size,
  );
}
