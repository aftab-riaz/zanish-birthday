"use client";

import { motion } from "motion/react";
import { birthdayConfig } from "@/config/birthday";

export function LoadingScreen() {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[radial-gradient(90%_60%_at_50%_40%,#FBF1F7_0%,#EFE4F9_55%,#E8DDF8_100%)] px-8 text-center"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <svg viewBox="0 0 80 80" className="h-16 w-16" aria-hidden>
        <circle cx="40" cy="40" r="26" fill="url(#ld-glow)" className="anim-glow origin-box" />
        <path
          d="M40 10C41.5 27 53 38.5 70 40C53 41.5 41.5 53 40 70C38.5 53 27 41.5 10 40C27 38.5 38.5 27 40 10Z"
          fill="none"
          stroke="#A8577B"
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="anim-draw"
        />
        <defs>
          <radialGradient id="ld-glow">
            <stop offset="0%" stopColor="#F0DFBA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F0DFBA" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      <p className="font-display text-[clamp(1.25rem,5vw,1.6rem)] italic text-plum/85">
        {birthdayConfig.loading.message}
      </p>
    </motion.div>
  );
}
