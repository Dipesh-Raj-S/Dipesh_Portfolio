import { ImageResponse } from "next/og";
import { site } from "@/data/site";

export const alt = `${site.name} — ${site.role}`;
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
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "linear-gradient(135deg, #0f1420 0%, #151b2b 100%)",
        color: "#e6e4df",
        position: "relative",
      }}
    >
      {/* soft lamp light */}
      <div
        style={{
          position: "absolute",
          right: -120,
          top: -160,
          width: 720,
          height: 720,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(232,167,93,0.20) 0%, rgba(232,167,93,0) 65%)",
        }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#9aa3b2",
          fontFamily: "monospace",
        }}
      >
        <span style={{ color: "#e8a75d" }}>~/</span>
        {site.shortName}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 44, color: "#e8a75d", marginTop: 12 }}>{site.role}</div>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#9aa3b2" }}>
        {site.tagline}
      </div>
    </div>,
    size,
  );
}
