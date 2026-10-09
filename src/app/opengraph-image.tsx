import { ImageResponse } from "next/og";
import { birthdayConfig } from "@/config/birthday";

export const alt = birthdayConfig.meta.shareTitle;
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

const STARS = [
  [90, 80, 18], [210, 470, 12], [1080, 120, 22], [980, 520, 14], [160, 300, 9],
  [1120, 360, 10], [560, 70, 10], [700, 560, 12], [400, 540, 8], [860, 60, 9],
];

export default async function OpengraphImage() {
  const { name } = birthdayConfig;
  const display = await loadFont("Cormorant+Garamond:ital,wght@1,500", `Happy Birthday, ${name} ${birthdayConfig.birthdayDate}`);
  const script = await loadFont("Pinyon+Script", "A little surprise for you");

  const fonts = [
    display && { name: "Cormorant", data: display, style: "italic" as const, weight: 500 as const },
    script && { name: "Pinyon", data: script, style: "normal" as const, weight: 400 as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; style: "italic" | "normal"; weight: 400 | 500 }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 0%, #F7EEFC 0%, rgba(247,238,252,0) 60%), linear-gradient(160deg, #EDE2F9 0%, #F8DDE8 55%, #FFF4EF 100%)",
          color: "#49344E",
          position: "relative",
        }}
      >
        {STARS.map(([x, y, s], i) => (
          <svg key={i} width={s * 2} height={s * 2} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y }}>
            <path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" fill={i % 3 ? "#D8B77C" : "#E9A6BF"} />
          </svg>
        ))}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "2px solid rgba(216,183,124,0.55)",
            borderRadius: 28,
            display: "flex",
          }}
        />
        <div
          style={{
            fontSize: 38,
            letterSpacing: 4,
            fontStyle: "italic",
            color: "#A8577B",
            fontFamily: display ? "Cormorant" : "serif",
            display: "flex",
          }}
        >
          {birthdayConfig.birthdayDate}
        </div>
        <div
          style={{
            fontSize: 112,
            fontStyle: "italic",
            fontFamily: display ? "Cormorant" : "serif",
            marginTop: 18,
            lineHeight: 1.05,
            display: "flex",
          }}
        >
          Happy Birthday, {name}
        </div>
        <div
          style={{
            fontSize: 64,
            fontFamily: script ? "Pinyon" : "serif",
            color: "#A8577B",
            marginTop: 26,
            display: "flex",
          }}
        >
          A little surprise for you
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
