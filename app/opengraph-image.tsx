import { ImageResponse } from "next/og";
import { businessLocationLabel } from "@/lib/business-display";
import { getSiteData } from "@/lib/data";

export const alt = "Business services social preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const { settings, categories } = await getSiteData();
  const location = businessLocationLabel(settings.address).toUpperCase();
  const serviceLine = categories.slice(0, 6).map((category) => category.title.split(/,|&/)[0]?.trim() || category.title).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 82px",
          color: "#ffffff",
          background: "linear-gradient(135deg, #071a32 0%, #0b376f 58%, #08766f 100%)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", maxWidth: "820px" }}>
          <div style={{ display: "flex", fontSize: 28, fontWeight: 700, letterSpacing: 2, color: "#8fe1d9" }}>
            {location}
          </div>
          <div style={{ display: "flex", marginTop: 30, fontSize: 66, fontWeight: 800, lineHeight: 1.05 }}>
            {settings.business_name}
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 34, fontWeight: 600, color: "#dce8ee" }}>
            {settings.tagline}
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 25, lineHeight: 1.35, color: "#c9dae2" }}>
            {serviceLine || "Local services"}
          </div>
        </div>
        <div
          style={{
            width: 190,
            height: 190,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "4px solid rgba(255,255,255,0.85)",
            borderRadius: 42,
            background: "rgba(255,255,255,0.08)",
            fontSize: 64,
            fontWeight: 900,
          }}
        >
          {settings.business_name.slice(0, 2).toUpperCase()}
        </div>
      </div>
    ),
    size,
  );
}
