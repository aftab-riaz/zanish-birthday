"use client";

import { useEffect } from "react";
import { useFinePointer, useMediaQuery } from "@/hooks/useMediaQuery";

const MAX_SPARKS = 18;

/** Desktop-only sparkle trail. Disabled on touch devices and for reduced motion. */
export function CursorSparkles() {
  const finePointer = useFinePointer();
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = finePointer && !reduced;

  useEffect(() => {
    if (!enabled) return;
    let last = 0;
    let lastX = 0;
    let lastY = 0;
    let n = 0;
    const live = new Set<HTMLSpanElement>();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (now - last < 45 || dist < 14 || live.size >= MAX_SPARKS) return;
      last = now;
      lastX = e.clientX;
      lastY = e.clientY;
      n++;

      const el = document.createElement("span");
      el.className = "cursor-spark";
      el.setAttribute("aria-hidden", "true");
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      el.style.setProperty("--dx", `${((n * 37) % 30) - 15}px`);
      el.style.setProperty("--dy", `${12 + ((n * 13) % 16)}px`);
      const done = () => {
        live.delete(el);
        el.remove();
      };
      el.addEventListener("animationend", done, { once: true });
      live.add(el);
      document.body.appendChild(el);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      live.forEach((el) => el.remove());
      live.clear();
    };
  }, [enabled]);

  return null;
}
