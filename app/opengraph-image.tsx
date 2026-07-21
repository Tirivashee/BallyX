import { ImageResponse } from "next/og";
import { brand } from "@/lib/site-config";

export const runtime = "edge";
export const alt = brand.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#15161A",
          color: "#FAF7F1",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              backgroundColor: "#FF6B35",
              display: "flex",
            }}
          />
          <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: -1, display: "flex" }}>
            Bally<span style={{ color: "#FF6B35" }}>X</span>
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              maxWidth: 900,
              display: "flex",
            }}
          >
            {brand.tagline}
          </span>
          <span style={{ fontSize: 24, color: "#FAF7F1", opacity: 0.7, display: "flex" }}>
            {brand.location.display} — Flagship product: Pluto
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
