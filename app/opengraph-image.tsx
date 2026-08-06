import { ImageResponse } from "next/og";

export const alt = "Yaqoob Enterprises — Everyday services in Akhtar Colony, Karachi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
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
            AKHTAR COLONY · KARACHI
          </div>
          <div style={{ display: "flex", marginTop: 30, fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>
            Everyday services, handled clearly.
          </div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 30, lineHeight: 1.35, color: "#dce8ee" }}>
            Printing · Documents · Online Forms · Biometric · Payments · Tickets
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
            fontSize: 72,
            fontWeight: 900,
          }}
        >
          YE
        </div>
      </div>
    ),
    size,
  );
}
