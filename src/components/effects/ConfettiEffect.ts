"use client";

import type { Options } from "canvas-confetti";

/**
 * canvas-confetti is loaded on demand so it never weighs down the first paint.
 * It respects `prefers-reduced-motion` via `disableForReducedMotion`.
 */
const PALETTE = ["#E9A6BF", "#F8DDE8", "#E8DDF8", "#D8B77C", "#FFFFFF", "#C9A4E0"];

async function fire(opts: Options) {
  if (typeof window === "undefined") return;
  const { default: confetti } = await import("canvas-confetti");
  void confetti({
    disableForReducedMotion: true,
    colors: PALETTE,
    ticks: 260,
    scalar: 0.9,
    zIndex: 40,
    ...opts,
  });
}

/** Gentle burst from a point (x/y are 0–1 viewport fractions). */
export function burstAt(x: number, y: number, particleCount = 70) {
  void fire({ particleCount, spread: 75, startVelocity: 32, origin: { x, y }, gravity: 0.9 });
}

/** Soft celebratory rain from both sides. */
export function celebrate() {
  void fire({ particleCount: 60, angle: 60, spread: 60, startVelocity: 48, origin: { x: 0, y: 0.75 } });
  void fire({ particleCount: 60, angle: 120, spread: 60, startVelocity: 48, origin: { x: 1, y: 0.75 } });
  window.setTimeout(() => {
    void fire({ particleCount: 70, spread: 120, startVelocity: 26, gravity: 0.6, origin: { x: 0.5, y: 0.2 } });
  }, 380);
}

/** Starry finale shower. */
export function starShower() {
  const stars: Options = {
    shapes: ["star"],
    colors: ["#F0DFBA", "#D8B77C", "#FFFFFF", "#F8DDE8", "#E8DDF8"],
    gravity: 0.5,
    decay: 0.93,
    startVelocity: 28,
    ticks: 300,
  };
  void fire({ ...stars, particleCount: 40, spread: 360, scalar: 1.1, origin: { x: 0.5, y: 0.35 } });
  window.setTimeout(() => void fire({ ...stars, particleCount: 30, spread: 360, scalar: 0.8, origin: { x: 0.25, y: 0.3 } }), 250);
  window.setTimeout(() => void fire({ ...stars, particleCount: 30, spread: 360, scalar: 0.8, origin: { x: 0.75, y: 0.3 } }), 500);
}
