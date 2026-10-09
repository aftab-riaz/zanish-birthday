"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type Variant = "primary" | "glow" | "ghost" | "outline";

type Props = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: Variant;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  children: ReactNode;
};

const base =
  "group relative inline-flex min-h-12 select-none items-center justify-center gap-2.5 overflow-hidden rounded-full px-7 py-3 text-[0.95rem] font-semibold tracking-[0.02em] transition-[box-shadow,background-color,color] duration-300 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "bg-plum text-cream shadow-[0_10px_30px_-10px_rgb(73_52_78/0.65),0_2px_0_0_rgb(255_255_255/0.08)_inset] hover:shadow-[0_16px_40px_-12px_rgb(168_87_123/0.7)]",
  glow:
    "bg-[linear-gradient(135deg,#FFF6E6_0%,#F0DFBA_45%,#F3C3D6_100%)] text-plum-deep shadow-[0_0_0_1px_rgb(255_255_255/0.5)_inset,0_0_34px_4px_rgb(240_223_186/0.38),0_12px_30px_-8px_rgb(0_0_0/0.5)] hover:shadow-[0_0_0_1px_rgb(255_255_255/0.6)_inset,0_0_48px_8px_rgb(240_223_186/0.5),0_12px_30px_-8px_rgb(0_0_0/0.5)]",
  outline:
    "border border-current/25 bg-white/10 text-current backdrop-blur-[2px] hover:bg-white/20",
  ghost: "px-4 font-medium text-current/80 underline decoration-current/30 underline-offset-[6px] hover:text-current hover:decoration-current/70",
};

export function MagicalButton({
  variant = "primary",
  icon,
  iconAfter,
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96, y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 22 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {(variant === "primary" || variant === "glow") && (
        <>
          {/* champagne hairline */}
          <span
            aria-hidden
            className={`pointer-events-none absolute inset-[3px] rounded-full border ${
              variant === "primary" ? "border-champagne/45" : "border-white/60"
            }`}
          />
          {/* slow shimmer sweep */}
          <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <span className="anim-shimmer absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </span>
        </>
      )}
      {icon && <span className="relative flex shrink-0 items-center" aria-hidden>{icon}</span>}
      <span className="relative">{children}</span>
      {iconAfter && (
        <span
          className="relative flex shrink-0 items-center transition-transform duration-300 group-hover:translate-x-0.5"
          aria-hidden
        >
          {iconAfter}
        </span>
      )}
    </motion.button>
  );
}
