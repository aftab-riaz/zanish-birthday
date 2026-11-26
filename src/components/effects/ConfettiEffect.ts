"use client";

import type { Options } from "canvas-confetti";

/**
 * canvas-confetti is loaded on demand so it never weighs down the first paint.
 * It respects `prefers-reduced-motion` via `disableForReducedMotion`.
 */
const PALETTE = ["#FFC83D", "#FF4D2E", "#25D366", "#5BC0FF", "#FF8FB1", "#1F1A17"];

async function load() {
  const { default: confetti } = await import("canvas-confetti");
  return confetti;
}

/** Colourful confetti from both sides, then a shower of food emojis. */
export async function celebrate() {
  if (typeof window === "undefined") return;
  const confetti = await load();
  const base: Options = { disableForReducedMotion: true, colors: PALETTE, zIndex: 40, ticks: 260 };

  void confetti({ ...base, particleCount: 70, angle: 60, spread: 60, startVelocity: 50, origin: { x: 0, y: 0.75 } });
  void confetti({ ...base, particleCount: 70, angle: 120, spread: 60, startVelocity: 50, origin: { x: 1, y: 0.75 } });

  const scalar = 2.4;
  const shapes = ["🍗", "🔥", "🎉", "😋"].map((text) => confetti.shapeFromText({ text, scalar }));
  window.setTimeout(() => {
    void confetti({
      ...base,
      shapes,
      scalar,
      particleCount: 36,
      spread: 140,
      startVelocity: 28,
      gravity: 0.7,
      flat: true,
      origin: { x: 0.5, y: 0.25 },
    });
  }, 400);
}

/** A soft shower of hearts for the thank-you. */
export async function heartBurst() {
  if (typeof window === "undefined") return;
  const confetti = await load();
  const scalar = 2.2;
  const shapes = ["💛", "❤️", "✨"].map((text) => confetti.shapeFromText({ text, scalar }));
  void confetti({
    disableForReducedMotion: true,
    zIndex: 40,
    shapes,
    scalar,
    particleCount: 28,
    spread: 120,
    startVelocity: 26,
    gravity: 0.6,
    ticks: 240,
    flat: true,
    origin: { x: 0.5, y: 0.6 },
  });
}
