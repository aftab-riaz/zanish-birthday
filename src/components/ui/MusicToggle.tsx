"use client";

import { motion } from "motion/react";
import { Music, VolumeX } from "lucide-react";
import { useSound } from "@/components/audio/SoundProvider";

/** Muted by default; music starts only after an explicit tap. */
export function MusicToggle({ tone }: { tone: "light" | "dark" }) {
  const { soundOn, toggleSound } = useSound();
  const dark = tone === "dark";

  return (
    <motion.button
      type="button"
      onClick={toggleSound}
      aria-pressed={soundOn}
      aria-label={soundOn ? "Turn music off" : "Turn music on"}
      whileTap={{ scale: 0.92 }}
      className={`relative flex h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-xs font-semibold tracking-wide transition-colors duration-500 ${
        dark
          ? "bg-white/10 text-cream ring-1 ring-white/20 hover:bg-white/15"
          : "bg-white/55 text-plum ring-1 ring-plum/10 hover:bg-white/75"
      }`}
    >
      {soundOn ? (
        <span className="flex h-4 items-end gap-[3px]" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={`block w-[3px] rounded-full ${dark ? "bg-champagne-soft" : "bg-rose-deep"}`}
              animate={{ height: ["35%", "100%", "50%", "80%", "35%"] }}
              transition={{ duration: 1.2 + i * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </span>
      ) : (
        <VolumeX className="h-4 w-4" aria-hidden />
      )}
      <span className="hidden sm:inline">{soundOn ? "Music on" : "Music"}</span>
      {!soundOn && <Music className="hidden h-3.5 w-3.5 opacity-60 sm:block" aria-hidden />}
    </motion.button>
  );
}
