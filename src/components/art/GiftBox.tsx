"use client";

import { motion } from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Illustrated gift. `open` plays: ribbon loosens → lid lifts → light pours out. */
export function GiftBox({ open }: { open: boolean }) {
  return (
    <div className="relative h-full w-full">
      {/* light rays pouring out of the box (HTML so the transform origin is reliable) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[48.5%] h-0 w-0"
        initial={false}
        animate={open ? { opacity: [0, 1, 0.9], scale: [0.2, 1.05, 1.2] } : { opacity: 0, scale: 0.2 }}
        transition={{ duration: 1.5, delay: open ? 0.5 : 0, ease: EASE }}
      >
        <div className="anim-spin-slow absolute -left-[260px] -top-[260px] h-[520px] w-[520px] rounded-full bg-[repeating-conic-gradient(from_0deg,rgba(255,248,234,0.75)_0deg_7deg,rgba(255,248,234,0)_7deg_22deg)] [mask-image:radial-gradient(circle,#000_10%,transparent_68%)]" />
        <div className="absolute -left-[110px] -top-[110px] h-[220px] w-[220px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.95)_0%,rgba(255,244,220,0.6)_40%,rgba(240,223,186,0)_70%)]" />
      </motion.div>
    <svg viewBox="0 0 260 280" className="relative h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="gb-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F4C3D5" />
          <stop offset="55%" stopColor="#E9A6BF" />
          <stop offset="100%" stopColor="#CF86A5" />
        </linearGradient>
        <linearGradient id="gb-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9D3E1" />
          <stop offset="100%" stopColor="#EBAEC6" />
        </linearGradient>
        <linearGradient id="gb-ribbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A263" />
          <stop offset="45%" stopColor="#F3DFB4" />
          <stop offset="100%" stopColor="#C9A263" />
        </linearGradient>
        <linearGradient id="gb-bow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F6E5BF" />
          <stop offset="100%" stopColor="#C9A263" />
        </linearGradient>
        <radialGradient id="gb-light" cx="50%" cy="100%" r="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="35%" stopColor="#FFF4DC" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F0DFBA" stopOpacity="0" />
        </radialGradient>
        <pattern id="gb-dots" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="2" fill="#FFF9F5" opacity="0.38" />
          <circle cx="16" cy="16" r="1.4" fill="#FFF9F5" opacity="0.28" />
        </pattern>
      </defs>

      {/* ground shadow */}
      <ellipse cx="130" cy="268" rx="92" ry="9" fill="#49344E" opacity="0.12" />

      {/* inner glow at box mouth */}
      <motion.ellipse
        cx="130"
        cy="136"
        rx="96"
        ry="70"
        fill="url(#gb-light)"
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.8, delay: open ? 0.45 : 0, ease: EASE }}
      />

      {/* box body */}
      <g>
        <rect x="42" y="136" width="176" height="126" rx="8" fill="url(#gb-body)" />
        <rect x="42" y="136" width="176" height="126" rx="8" fill="url(#gb-dots)" />
        <rect x="42" y="136" width="176" height="12" fill="#49344E" opacity="0.08" />
        <rect x="118" y="136" width="24" height="126" fill="url(#gb-ribbon)" />
        <rect x="42" y="250" width="176" height="12" rx="6" fill="#49344E" opacity="0.06" />
      </g>

      {/* lid */}
      <motion.g
        initial={false}
        animate={
          open
            ? { y: [0, -24, -150], x: [0, -6, -70], rotate: [0, -6, -32], opacity: [1, 1, 0] }
            : { y: 0, x: 0, rotate: 0, opacity: 1 }
        }
        transition={{ duration: 1.1, delay: open ? 0.35 : 0, ease: EASE, times: [0, 0.3, 1] }}
      >
        <rect x="32" y="104" width="196" height="38" rx="8" fill="url(#gb-lid)" />
        <rect x="32" y="104" width="196" height="38" rx="8" fill="url(#gb-dots)" />
        <rect x="32" y="130" width="196" height="12" rx="6" fill="#B66A8C" opacity="0.18" />
        <rect x="118" y="104" width="24" height="38" fill="url(#gb-ribbon)" />
        <path d="M40 110H220" stroke="#FFFFFF" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
      </motion.g>

      {/* bow — loops loosen and drift apart */}
      <g>
        <motion.g
          initial={false}
          animate={open ? { x: -46, y: -18, rotate: -55, opacity: 0, scale: 0.7 } : { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <g className="anim-sway origin-right-box">
            <path d="M130 104C104 64 64 70 70 96C74 112 104 110 130 104Z" fill="url(#gb-bow)" />
            <path d="M126 102C106 80 82 80 82 94" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </motion.g>
        <motion.g
          initial={false}
          animate={open ? { x: 46, y: -18, rotate: 55, opacity: 0, scale: 0.7 } : { x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <g className="anim-sway origin-left-box" style={{ animationDelay: "-1.8s" }}>
            <path d="M130 104C156 64 196 70 190 96C186 112 156 110 130 104Z" fill="url(#gb-bow)" />
            <path d="M134 102C154 80 178 80 178 94" stroke="#FFFFFF" strokeOpacity="0.55" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        </motion.g>
        {/* tails */}
        <motion.g
          initial={false}
          animate={open ? { y: 40, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          <path d="M126 106L104 148L116 144L120 156L132 110Z" fill="#D2AE70" />
          <path d="M134 106L156 148L144 144L140 156L128 110Z" fill="#C9A263" />
        </motion.g>
        <motion.ellipse
          cx="130"
          cy="104"
          rx="12"
          ry="10"
          fill="#E3C48E"
          initial={false}
          animate={open ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </g>
    </svg>
    </div>
  );
}
