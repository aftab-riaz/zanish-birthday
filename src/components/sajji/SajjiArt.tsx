"use client";

import { AnimatePresence, motion, type TargetAndTransition } from "motion/react";

export type Mood = "happy" | "worried" | "sad" | "party";

const MOUTHS: Record<Exclude<Mood, "party">, string> = {
  happy: "M96 126 Q103 137 110 137 Q117 137 124 126",
  worried: "M97 136 Q103 129 110 134 Q117 139 123 132",
  sad: "M96 140 Q103 130 110 130 Q117 130 124 140",
};

const BODY_MOTION: Record<Mood, TargetAndTransition> = {
  happy: { rotate: [0, -3, 0, 3, 0], y: [0, -4, 0], transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } },
  worried: { x: [0, -3, 3, -2, 2, 0], transition: { duration: 0.5, repeat: Infinity, repeatDelay: 0.8 } },
  sad: { rotate: -6, y: 4, transition: { type: "spring", stiffness: 120, damping: 10 } },
  party: { rotate: [-10, 10], y: [0, -10], transition: { duration: 0.32, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } },
};

/** A cartoon Sajji on a skewer, over glowing coals, whose face follows the mood. */
export function SajjiArt({ mood = "happy", className = "" }: { mood?: Mood; className?: string }) {
  const sadBrows = mood === "sad" || mood === "worried";

  return (
    <svg viewBox="0 0 220 250" className={className} role="img" aria-label="A cartoon Sajji on a skewer over the coals">
      <defs>
        <radialGradient id="sj-glow" cx="50%" cy="85%" r="60%">
          <stop offset="0%" stopColor="#FF8A3D" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FF8A3D" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sj-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFCF7A" />
          <stop offset="50%" stopColor="#E88A33" />
          <stop offset="100%" stopColor="#A8461A" />
        </linearGradient>
        <linearGradient id="sj-leg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E99A40" />
          <stop offset="100%" stopColor="#A8461A" />
        </linearGradient>
        <linearGradient id="sj-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FF4D2E" />
          <stop offset="60%" stopColor="#FFB347" />
          <stop offset="100%" stopColor="#FFE7A3" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="205" rx="100" ry="50" fill="url(#sj-glow)" className="anim-glow" />

      {/* steam */}
      <g fill="none" stroke="#C9B8A6" strokeWidth="3" strokeLinecap="round">
        <path className="anim-steam" style={{ ["--delay" as string]: "0s" }} d="M80 40 C 72 28, 88 20, 80 6" />
        <path className="anim-steam" style={{ ["--delay" as string]: "1.1s" }} d="M140 40 C 132 28, 148 20, 140 6" />
      </g>

      <motion.g style={{ originX: 0.5, originY: 1 }} animate={BODY_MOTION[mood]}>
        {/* skewer */}
        <rect x="107" y="30" width="6" height="190" rx="3" fill="#B9AEA3" stroke="#1F1A17" strokeWidth="2" />
        <circle cx="110" cy="30" r="6" fill="#E8DED2" stroke="#1F1A17" strokeWidth="2" />

        {/* legs */}
        <path d="M78 150 C 62 170, 60 190, 72 200 C 82 206, 92 196, 92 182 L 96 156 Z" fill="url(#sj-leg)" stroke="#1F1A17" strokeWidth="3" strokeLinejoin="round" />
        <path d="M142 150 C 158 170, 160 190, 148 200 C 138 206, 128 196, 128 182 L 124 156 Z" fill="url(#sj-leg)" stroke="#1F1A17" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="72" cy="200" r="7" fill="#FFF4E0" stroke="#1F1A17" strokeWidth="2.5" />
        <circle cx="148" cy="200" r="7" fill="#FFF4E0" stroke="#1F1A17" strokeWidth="2.5" />

        {/* body */}
        <path
          d="M110 56 C 152 56, 170 92, 166 124 C 162 156, 140 172, 110 172 C 80 172, 58 156, 54 124 C 50 92, 68 56, 110 56 Z"
          fill="url(#sj-skin)"
          stroke="#1F1A17"
          strokeWidth="3.5"
        />
        <path d="M74 84 C 82 70, 98 64, 112 65" fill="none" stroke="#FFF1C9" strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" />
        {/* masala specks */}
        <g fill="#7A2E0E" fillOpacity="0.55">
          <circle cx="76" cy="146" r="2" />
          <circle cx="146" cy="146" r="2" />
          <circle cx="152" cy="100" r="1.8" />
          <circle cx="66" cy="112" r="1.8" />
          <circle cx="110" cy="160" r="1.8" />
        </g>
        {/* cheeks */}
        <ellipse cx="78" cy="126" rx="9" ry="5.5" fill="#FF6B5A" opacity="0.55" />
        <ellipse cx="142" cy="126" rx="9" ry="5.5" fill="#FF6B5A" opacity="0.55" />

        {/* eyes (blink) */}
        <g className="anim-blink origin-box">
          <circle cx="92" cy="104" r="12" fill="#fff" stroke="#1F1A17" strokeWidth="3" />
          <circle cx="128" cy="104" r="12" fill="#fff" stroke="#1F1A17" strokeWidth="3" />
          <motion.g
            animate={mood === "worried" ? { x: [0, 4, -4, 0] } : mood === "sad" ? { y: 3, x: 0 } : { x: 0, y: 0 }}
            transition={mood === "worried" ? { duration: 1.4, repeat: Infinity } : { duration: 0.3 }}
          >
            <circle cx="93" cy="106" r="5.5" fill="#1F1A17" />
            <circle cx="129" cy="106" r="5.5" fill="#1F1A17" />
            <circle cx="95" cy="103.5" r="1.8" fill="#fff" />
            <circle cx="131" cy="103.5" r="1.8" fill="#fff" />
          </motion.g>
        </g>

        {/* brows */}
        <motion.g
          animate={{ opacity: sadBrows ? 1 : 0, y: sadBrows ? 0 : -4 }}
          stroke="#1F1A17"
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          <line x1="82" y1="86" x2="99" y2="91" />
          <line x1="138" y1="86" x2="121" y2="91" />
        </motion.g>

        {/* mouth */}
        {mood === "party" ? (
          <g>
            <path d="M93 124 Q110 152 127 124 Z" fill="#5A1A0C" stroke="#1F1A17" strokeWidth="3" strokeLinejoin="round" />
            <path d="M101 137 Q110 132 119 137 Q114 145 110 145 Q106 145 101 137 Z" fill="#FF6B7A" />
          </g>
        ) : (
          <motion.path
            initial={{ d: MOUTHS[mood] }}
            animate={{ d: MOUTHS[mood] }}
            transition={{ duration: 0.3 }}
            fill="none"
            stroke="#1F1A17"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        )}

        {/* tears */}
        {mood === "sad" && (
          <g fill="#5BC0FF" stroke="#1F1A17" strokeWidth="1.5">
            <path className="anim-tear" d="M84 116 q-5 8 0 11 q5 -3 0 -11z" />
            <path className="anim-tear" style={{ ["--delay" as string]: "0.6s" }} d="M136 116 q-5 8 0 11 q5 -3 0 -11z" />
          </g>
        )}

        {/* deal-with-it sunglasses */}
        <AnimatePresence>
          {mood === "party" && (
            <motion.g
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -120, opacity: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 160, damping: 13 }}
            >
              <rect x="74" y="94" width="34" height="20" rx="6" fill="#1F1A17" />
              <rect x="112" y="94" width="34" height="20" rx="6" fill="#1F1A17" />
              <rect x="104" y="98" width="12" height="4" fill="#1F1A17" />
              <path d="M80 99 l8 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
              <path d="M118 99 l8 0" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </motion.g>
          )}
        </AnimatePresence>
      </motion.g>

      {/* lemon */}
      <g transform="translate(168 64) rotate(20)">
        <circle r="13" fill="#F9E27A" stroke="#1F1A17" strokeWidth="2.5" />
        <circle r="9" fill="#FFF3B0" />
        <g stroke="#F9E27A" strokeWidth="1.4">
          <line x1="-8" y1="0" x2="8" y2="0" />
          <line x1="0" y1="-8" x2="0" y2="8" />
        </g>
      </g>

      {/* flames */}
      <g>
        <path className="anim-flicker origin-bottom-box" style={{ ["--dur" as string]: "1.2s" }} d="M70 238 C 58 222, 70 210, 76 198 C 80 212, 92 220, 84 238 Z" fill="url(#sj-flame)" />
        <path className="anim-flicker origin-bottom-box" style={{ ["--dur" as string]: "1.5s", ["--delay" as string]: "0.2s" }} d="M98 238 C 86 220, 100 206, 106 196 C 112 210, 124 220, 116 238 Z" fill="url(#sj-flame)" />
        <path className="anim-flicker origin-bottom-box" style={{ ["--dur" as string]: "1.3s", ["--delay" as string]: "0.4s" }} d="M136 238 C 128 222, 140 210, 146 198 C 150 212, 162 220, 152 238 Z" fill="url(#sj-flame)" />
      </g>
      {/* coals */}
      <g stroke="#1F1A17" strokeWidth="2">
        <ellipse cx="62" cy="240" rx="16" ry="7" fill="#3A1A10" />
        <ellipse cx="94" cy="242" rx="18" ry="7" fill="#4A1F10" />
        <ellipse cx="128" cy="242" rx="18" ry="7" fill="#3A1A10" />
        <ellipse cx="160" cy="240" rx="16" ry="7" fill="#4A1F10" />
      </g>
    </svg>
  );
}
