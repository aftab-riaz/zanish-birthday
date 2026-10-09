"use client";

import { motion } from "motion/react";
import { useMemo } from "react";
import { range, seeded } from "@/lib/random";

type Props = {
  /** Change to replay the burst. */
  burstKey: number | string;
  count?: number;
  /** Max travel radius in px. */
  radius?: number;
  colors?: string[];
  seed?: number;
  className?: string;
  delay?: number;
};

export function SparkleShape({ className = "", fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z" fill={fill} />
    </svg>
  );
}

const DEFAULT_COLORS = ["#F0DFBA", "#FFFFFF", "#E9A6BF", "#E8DDF8"];

/** A one-shot radial burst of sparkles, positioned at the parent's center. */
export function Sparkles({
  burstKey,
  count = 16,
  radius = 140,
  colors = DEFAULT_COLORS,
  seed = 3,
  className = "",
  delay = 0,
}: Props) {
  const sparks = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + rand() * 0.5;
      const dist = radius * (0.45 + rand() * 0.55);
      return {
        id: i,
        x: Math.round(Math.cos(angle) * dist),
        y: Math.round(Math.sin(angle) * dist),
        size: range(rand, 8, 18),
        rot: range(rand, -180, 180),
        d: range(rand, 0, 0.18),
        color: colors[i % colors.length],
      };
    });
  }, [count, radius, colors, seed]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-1/2 top-1/2 h-0 w-0 ${className}`}
      key={burstKey}
    >
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="absolute -left-2 -top-2 block"
          style={{ width: s.size, height: s.size }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{ x: s.x, y: s.y, scale: [0, 1.2, 0], opacity: [1, 1, 0], rotate: s.rot }}
          transition={{ duration: 1.3, delay: delay + s.d, ease: [0.16, 1, 0.3, 1] }}
        >
          <SparkleShape className="h-full w-full" fill={s.color} />
        </motion.span>
      ))}
    </div>
  );
}
