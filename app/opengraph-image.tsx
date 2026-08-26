import { ImageResponse } from "next/og";
import { siteConfig } from "@/app/site-config";

export const alt = `${siteConfig.title} — ${siteConfig.description}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#ffffff",
        padding: "96px",
      }}
    >
      <div
        style={{
          display: "flex",
          width: 72,
          height: 72,
          borderRadius: "50%",
          backgroundColor: "#f97316",
        }}
      />
      <div
        style={{
          display: "flex",
          marginTop: 48,
          fontSize: 92,
          letterSpacing: "-0.03em",
          color: "#171717",
        }}
      >
        {siteConfig.title}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: 20,
          fontSize: 36,
          color: "#737373",
        }}
      >
        {siteConfig.description}
      </div>
    </div>,
    size,
  );
}
