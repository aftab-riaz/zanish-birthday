"use client";

import { motion } from "motion/react";
import type { CSSProperties } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
type ArtProps = { open: boolean };

/* ───────────── 1. Rose — blooms open */
export function RoseBloom({ open }: ArtProps) {
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <svg viewBox="0 0 100 150" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="rb-petal" cx="50%" cy="80%" r="80%">
          <stop offset="0%" stopColor="#FCE3EC" />
          <stop offset="60%" stopColor="#F0A9C2" />
          <stop offset="100%" stopColor="#D97C9F" />
        </radialGradient>
      </defs>
      <path d="M50 58C48 90 54 116 50 150" stroke="#7FA287" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M51 104C64 92 78 96 82 88C70 84 56 90 51 104Z" fill="#9CBFA2" />
      <path d="M50 124C38 112 24 116 20 108C32 104 46 110 50 124Z" fill="#8DB394" />

      {/* outer petals */}
      {petals.map((a, i) => (
        <motion.ellipse
          key={a}
          cx="50"
          cy="30"
          rx="13"
          ry="20"
          fill="url(#rb-petal)"
          initial={false}
          animate={open ? { rotate: a, scale: 1, opacity: 1 } : { rotate: a * 0.15, scale: 0.35, opacity: 0 }}
          transition={{ duration: 0.9, delay: open ? i * 0.07 : 0, ease: EASE }}
          style={{ originX: 0.5, originY: 1 }}
        />
      ))}
      {/* inner swirl */}
      <motion.g
        initial={false}
        animate={open ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0.6, rotate: -40, opacity: 0 }}
        transition={{ duration: 0.8, delay: open ? 0.35 : 0, ease: EASE }}
      >
        <circle cx="50" cy="50" r="12" fill="#E58DAE" />
        <path d="M50 42C57 42 59 50 54 54C49 58 43 53 46 48C48 45 52 46 52 49" stroke="#FCE3EC" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="50" r="3" fill="#D8B77C" />
      </motion.g>
      {/* closed bud */}
      <motion.g
        initial={false}
        animate={open ? { scale: 0.4, opacity: 0, y: -4 } : { scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <path d="M50 22C62 30 64 48 50 60C36 48 38 30 50 22Z" fill="url(#rb-petal)" />
        <path d="M50 26C56 34 56 46 50 56" stroke="#FCE3EC" strokeWidth="1.4" fill="none" opacity="0.8" />
        <path d="M50 60C42 58 38 52 37 46C43 50 47 52 50 60C53 52 57 50 63 46C62 52 58 58 50 60Z" fill="#8DB394" />
      </motion.g>
    </svg>
  );
}

/* ───────────── 2. Wishing star — sparkles & turns */
export function WishStar({ open }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="ws-glow">
          <stop offset="0%" stopColor="#FFF4D6" stopOpacity="1" />
          <stop offset="100%" stopColor="#FFF4D6" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ws-fill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF6E0" />
          <stop offset="100%" stopColor="#D8B77C" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="50"
        cy="50"
        r="48"
        fill="url(#ws-glow)"
        initial={false}
        animate={{ opacity: open ? 1 : 0.55, scale: open ? 1.25 : 0.85 }}
        transition={{ duration: 0.8, ease: EASE }}
      />
      {open &&
        [0, 1, 2].map((k) => (
          <motion.circle
            key={k}
            cx="50"
            cy="50"
            r="22"
            fill="none"
            stroke="#E9CF9B"
            strokeWidth="1.2"
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 1.4, delay: k * 0.25, ease: "easeOut" }}
          />
        ))}
      <motion.path
        d="M50 14L59.5 37.5L84 39.5L65.5 55.5L71 80L50 67L29 80L34.5 55.5L16 39.5L40.5 37.5Z"
        fill="url(#ws-fill)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={false}
        animate={open ? { rotate: 144, scale: 1.1 } : { rotate: 0, scale: 0.92 }}
        transition={{ type: "spring", stiffness: 120, damping: 12 }}
      />
      <motion.g
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.4, delay: open ? 0.3 : 0 }}
      >
        <path d="M88 14L90 20L96 22L90 24L88 30L86 24L80 22L86 20Z" fill="#FFFFFF" />
        <path d="M12 76L13.5 80.5L18 82L13.5 83.5L12 88L10.5 83.5L6 82L10.5 80.5Z" fill="#F8DDE8" />
      </motion.g>
    </svg>
  );
}

/* ───────────── 3. Floating envelope — unfolds */
export function LittleEnvelope({ open }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <path d="M50 4C46 14 54 18 50 28" stroke="#D8B77C" strokeWidth="1.4" fill="none" strokeDasharray="2 3" />
      {/* card rising out */}
      <motion.g
        initial={false}
        animate={open ? { y: -26 } : { y: 0 }}
        transition={{ duration: 0.8, delay: open ? 0.35 : 0, ease: EASE }}
      >
        <rect x="24" y="36" width="52" height="40" rx="3" fill="#FFFCF6" stroke="#EAD9C4" />
        <path d="M50 62C44 57 40 53 43 49C45.5 46 49 47.5 50 50C51 47.5 54.5 46 57 49C60 53 56 57 50 62Z" fill="#E9A6BF" />
      </motion.g>
      {/* envelope pocket */}
      <path d="M18 44H82V82C82 84 80 86 78 86H22C20 86 18 84 18 82Z" fill="#F6D5E1" />
      <path d="M18 46L50 70L82 46V82C82 84 80 86 78 86H22C20 86 18 84 18 82Z" fill="#F9E2EA" />
      <path d="M18 84L44 64M82 84L56 64" stroke="#E7B9CA" strokeWidth="1.2" />
      {/* flap */}
      <motion.path
        d="M18 44L50 68L82 44Z"
        fill="#EFBFD0"
        stroke="#E7B9CA"
        strokeLinejoin="round"
        initial={false}
        animate={{ scaleY: open ? -1 : 1 }}
        transition={{ duration: 0.55, ease: EASE }}
        style={{ originX: 0.5, originY: 0 }}
      />
      <motion.circle
        cx="50"
        cy="62"
        r="5.5"
        fill="#D8B77C"
        initial={false}
        animate={{ scale: open ? 0 : 1, opacity: open ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </svg>
  );
}

/* ───────────── 4. Butterfly — flutters away */
export function Butterfly({ open }: ArtProps) {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="bf-wing" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8DDF8" />
          <stop offset="55%" stopColor="#C9A9EA" />
          <stop offset="100%" stopColor="#E9A6BF" />
        </linearGradient>
      </defs>
      {/* glowing trail left behind */}
      <motion.path
        d="M50 54C60 44 66 50 72 40C78 30 86 30 96 12"
        stroke="#D8B77C"
        strokeWidth="1.6"
        strokeDasharray="1 5"
        strokeLinecap="round"
        fill="none"
        initial={false}
        animate={{ pathLength: open ? 1 : 0, opacity: open ? 0.9 : 0 }}
        transition={{ duration: 1.4, delay: open ? 0.3 : 0 }}
      />
      <motion.circle
        cx="50"
        cy="54"
        r="4"
        fill="#F0DFBA"
        initial={false}
        animate={{ opacity: open ? [0, 1, 0.7] : 0, scale: open ? 1 : 0 }}
        transition={{ duration: 1, delay: open ? 0.6 : 0 }}
      />
      <motion.g
        initial={false}
        animate={
          open
            ? { x: [0, 14, 38, 90], y: [0, -14, -36, -110], rotate: [0, 12, -6, 18], opacity: [1, 1, 1, 0] }
            : { x: 0, y: 0, rotate: 0, opacity: 1 }
        }
        transition={{ duration: open ? 2 : 0.5, ease: "easeInOut" }}
      >
        <g
          className="anim-flap origin-box"
          style={{ "--dur": open ? "0.22s" : "2.4s" } as CSSProperties}
        >
          <path d="M48 50C36 30 14 28 14 42C14 54 30 58 48 54Z" fill="url(#bf-wing)" />
          <path d="M48 54C34 58 22 70 30 78C38 84 46 70 48 56Z" fill="url(#bf-wing)" opacity="0.9" />
          <path d="M52 50C64 30 86 28 86 42C86 54 70 58 52 54Z" fill="url(#bf-wing)" />
          <path d="M52 54C66 58 78 70 70 78C62 84 54 70 52 56Z" fill="url(#bf-wing)" opacity="0.9" />
          <circle cx="28" cy="42" r="3" fill="#FFFFFF" opacity="0.7" />
          <circle cx="72" cy="42" r="3" fill="#FFFFFF" opacity="0.7" />
        </g>
        <ellipse cx="50" cy="56" rx="2.4" ry="12" fill="#49344E" />
        <path d="M49 45C46 38 42 36 40 36M51 45C54 38 58 36 60 36" stroke="#49344E" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

/* ───────────── 5. Dandelion — seeds drift off as wishes */
const SEEDS = Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2;
  return {
    i,
    x2: Math.round((50 + Math.cos(a) * 20) * 10) / 10,
    y2: Math.round((34 + Math.sin(a) * 20) * 10) / 10,
    fx: 30 + ((i * 23) % 50),
    fy: -60 - ((i * 37) % 60),
    rot: ((i * 53) % 120) - 60,
  };
});

export function Dandelion({ open }: ArtProps) {
  return (
    <svg viewBox="0 0 100 150" className="h-full w-full overflow-visible" aria-hidden>
      <path d="M50 38C52 70 46 110 50 150" stroke="#8DB394" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M49 120C38 108 30 112 24 104C34 100 44 106 49 120Z" fill="#9CBFA2" />
      <circle cx="50" cy="34" r="22" fill="#FFFFFF" opacity={open ? 0 : 0.35} style={{ transition: "opacity .6s" }} />
      {SEEDS.map((s) => (
        <motion.g
          key={s.i}
          initial={false}
          animate={
            open
              ? { x: s.fx, y: s.fy, rotate: s.rot, opacity: 0 }
              : { x: 0, y: 0, rotate: 0, opacity: 1 }
          }
          transition={{ duration: open ? 2.4 : 0.4, delay: open ? s.i * 0.06 : 0, ease: "easeOut" }}
        >
          <path d={`M50 34L${s.x2} ${s.y2}`} stroke="#EDE5F0" strokeWidth="1" />
          <circle cx={s.x2} cy={s.y2} r="2.6" fill="#FFFFFF" />
          <circle cx={s.x2} cy={s.y2} r="4.6" fill="#FFFFFF" opacity="0.35" />
        </motion.g>
      ))}
      <circle cx="50" cy="34" r="4.5" fill="#D8C6A0" />
      <motion.circle
        cx="50"
        cy="34"
        r="3"
        fill="#F0DFBA"
        initial={false}
        animate={{ opacity: open ? [0.4, 1, 0.6] : 0 }}
        transition={{ duration: 1.6, repeat: open ? Infinity : 0, repeatType: "mirror" }}
      />
    </svg>
  );
}

/* ───────────── Non-interactive garden scenery */
export function GardenHill() {
  return (
    <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="gh-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCE8D6" />
          <stop offset="100%" stopColor="#E9E3D2" />
        </linearGradient>
        <linearGradient id="gh-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9DEC7" />
          <stop offset="100%" stopColor="#F1E6D8" />
        </linearGradient>
      </defs>
      <path d="M0 50C70 18 150 30 210 44C280 60 330 26 400 36V120H0Z" fill="url(#gh-back)" opacity="0.8" />
      <path d="M0 76C80 52 160 70 230 66C300 62 350 50 400 62V120H0Z" fill="url(#gh-front)" />
      {Array.from({ length: 26 }, (_, i) => {
        const x = 8 + i * 15.2;
        const h = 8 + ((i * 7) % 5) * 2.4;
        const base = 72 + ((i * 11) % 6);
        return (
          <path
            key={i}
            d={`M${x} ${base}Q${x + 2} ${base - h * 0.6} ${x + (i % 2 ? 4 : -3)} ${base - h}`}
            stroke="#A9C7A7"
            strokeWidth="1.4"
            fill="none"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export function TinyFlower({ color, className, style }: { color: string; className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 20 40" className={className} style={style} aria-hidden>
      <path d="M10 14V40" stroke="#9CBFA2" strokeWidth="1.4" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="10" cy="6" rx="3" ry="4.4" fill={color} transform={`rotate(${a} 10 10)`} />
      ))}
      <circle cx="10" cy="10" r="2.2" fill="#F0DFBA" />
    </svg>
  );
}
