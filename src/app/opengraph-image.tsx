import { ImageResponse } from "next/og";
import { sajjiConfig } from "@/config/sajji";

export const alt = sajjiConfig.meta.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Loads a Google font subset as TTF for the preview; falls back to the default font offline. */
async function loadFont(family: string, text: string) {
  "use cache";
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(text)}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const { fullName } = sajjiConfig;
  const heading = await loadFont("Baloo+2:wght@800", `Toh… Sajji treat pakki? ${fullName}`);
  const sans = await loadFont("Poppins:wght@700", "URGENT NOTICE · CASE NO. SJ-786");

  const fonts = [
    heading && { name: "Baloo", data: heading, style: "normal" as const, weight: 800 as const },
    sans && { name: "Poppins", data: sans, style: "normal" as const, weight: 700 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; style: "normal"; weight: 700 | 800 }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFD966",
          color: "#1F1A17",
        }}
      >
        <div
          style={{
            width: 1060,
            height: 490,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#FFF8EC",
            border: "6px solid #1F1A17",
            borderRadius: 48,
            boxShadow: "14px 14px 0 #1F1A17",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontFamily: sans ? "Poppins" : "sans-serif",
              fontWeight: 700,
              color: "#FFE58A",
              background: "#1F1A17",
              borderRadius: 999,
              padding: "10px 28px",
            }}
          >
            URGENT NOTICE · CASE NO. SJ-786
          </div>
          <div style={{ display: "flex", fontSize: 60, fontFamily: heading ? "Baloo" : "sans-serif", fontWeight: 800, marginTop: 34 }}>
            {fullName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              fontFamily: heading ? "Baloo" : "sans-serif",
              fontWeight: 800,
              color: "#FF4D2E",
              lineHeight: 1.1,
            }}
          >
            Toh… Sajji treat pakki? 🍗
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
