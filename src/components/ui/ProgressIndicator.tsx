"use client";

import { motion } from "motion/react";
import { SCENE_ORDER, birthdayConfig } from "@/config/birthday";

/** Five tiny stars joined by a hairline — the current scene glows. */
export function ProgressIndicator({ index, tone }: { index: number; tone: "light" | "dark" }) {
  const dark = tone === "dark";
  const label = birthdayConfig.progressLabels[SCENE_ORDER[index]];

  return (
    <div className="flex items-center" role="group" aria-label={`Scene ${index + 1} of ${SCENE_ORDER.length}: ${label}`}>
      <ol className="flex items-center">
        {SCENE_ORDER.map((id, i) => {
          const done = i < index;
          const current = i === index;
          return (
            <li key={id} className="flex items-center" aria-current={current ? "step" : undefined}>
              {i > 0 && (
                <span
                  aria-hidden
                  className={`mx-1 block h-px w-3 transition-colors duration-700 sm:w-5 ${
                    i <= index
                      ? dark
                        ? "bg-champagne-soft/70"
                        : "bg-rose-deep/50"
                      : dark
                        ? "bg-white/20"
                        : "bg-plum/15"
                  }`}
                />
              )}
              <motion.svg
                viewBox="0 0 24 24"
                aria-hidden
                className="h-3.5 w-3.5"
                animate={{ scale: current ? 1.35 : 1, rotate: current ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
              >
                <path
                  d="M12 0C12.8 7 17 11.2 24 12C17 12.8 12.8 17 12 24C11.2 17 7 12.8 0 12C7 11.2 11.2 7 12 0Z"
                  className="transition-[fill] duration-700"
                  fill={
                    current
                      ? dark
                        ? "#F0DFBA"
                        : "#A8577B"
                      : done
                        ? dark
                          ? "rgba(240,223,186,0.65)"
                          : "rgba(168,87,123,0.5)"
                        : dark
                          ? "rgba(255,255,255,0.25)"
                          : "rgba(73,52,78,0.2)"
                  }
                />
              </motion.svg>
              <span className="sr-only">{birthdayConfig.progressLabels[id]}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
