"use client";

import { AnimatePresence, motion } from "motion/react";
import type { CSSProperties } from "react";

const CANDLES = [116, 133, 150, 167, 184];

function Drips({ y, x, w, fill, seed }: { y: number; x: number; w: number; fill: string; seed: number }) {
  // A hand-drawn-feeling icing edge: alternating long/short drips.
  const n = Math.round(w / 18);
  const step = w / n;
  let d = `M${x} ${y - 4} L${x + w} ${y - 4} L${x + w} ${y + 4}`;
  for (let i = n - 1; i >= 0; i--) {
    const cx = x + i * step + step / 2;
    const len = ((i * 7 + seed) % 3) * 6 + 6;
    d += ` Q${cx + step / 2} ${y + 4} ${cx + step * 0.28} ${y + 6}`;
    d += ` Q${cx + step * 0.3} ${y + len + 6} ${cx} ${y + len + 6}`;
    d += ` Q${cx - step * 0.3} ${y + len + 6} ${cx - step * 0.28} ${y + 6}`;
    d += ` Q${cx - step / 2} ${y + 4} ${x + i * step} ${y + 4}`;
  }
  d += " Z";
  return <path d={d} fill={fill} />;
}

function Pearls({ y, x, w, r = 2.6 }: { y: number; x: number; w: number; r?: number }) {
  const n = Math.floor(w / (r * 2.6));
  const gap = w / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <circle cx={x + gap / 2 + i * gap} cy={y} r={r} fill="#FFF9F5" />
          <circle cx={x + gap / 2 + i * gap - r * 0.35} cy={y - r * 0.35} r={r * 0.35} fill="#FFFFFF" />
        </g>
      ))}
    </g>
  );
}

function Rosette({ cx, cy, s = 1, fill = "#E9A6BF" }: { cx: number; cy: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy="-4.2" rx="3.4" ry="4.6" fill={fill} transform={`rotate(${a})`} />
      ))}
      <circle r="2.4" fill="#D8B77C" />
    </g>
  );
}

/** Three-tier illustrated celebration cake with flickering candles. */
export function Cake({ lit }: { lit: boolean }) {
  return (
    <svg viewBox="0 0 300 330" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="ck-t1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F3C9D8" />
          <stop offset="40%" stopColor="#FCE6EE" />
          <stop offset="100%" stopColor="#EDB8CB" />
        </linearGradient>
        <linearGradient id="ck-t2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#DCCBF1" />
          <stop offset="40%" stopColor="#F1E9FB" />
          <stop offset="100%" stopColor="#D6C3EE" />
        </linearGradient>
        <linearGradient id="ck-t3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F6D7C9" />
          <stop offset="40%" stopColor="#FFF4EC" />
          <stop offset="100%" stopColor="#F1CDBE" />
        </linearGradient>
        <linearGradient id="ck-plate" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#C9A263" />
          <stop offset="50%" stopColor="#F6E5BF" />
          <stop offset="100%" stopColor="#C9A263" />
        </linearGradient>
        <linearGradient id="ck-candle" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F2E6FA" />
          <stop offset="50%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E3D2F2" />
        </linearGradient>
        <radialGradient id="ck-flame" cx="50%" cy="70%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#FFF0B8" />
          <stop offset="75%" stopColor="#FFB867" />
          <stop offset="100%" stopColor="#F5876A" />
        </radialGradient>
        <radialGradient id="ck-glow">
          <stop offset="0%" stopColor="#FFE6A8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFE6A8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* candle glow halo */}
      <motion.ellipse
        cx="150"
        cy="58"
        rx="110"
        ry="70"
        fill="url(#ck-glow)"
        initial={false}
        animate={{ opacity: lit ? 0.9 : 0 }}
        transition={{ duration: 0.8 }}
      />

      {/* stand */}
      <ellipse cx="150" cy="318" rx="60" ry="7" fill="#49344E" opacity="0.12" />
      <path d="M134 296H166L172 316H128Z" fill="url(#ck-plate)" />
      <ellipse cx="150" cy="294" rx="134" ry="12" fill="url(#ck-plate)" />
      <ellipse cx="150" cy="291" rx="128" ry="8" fill="#FBEFD6" />

      {/* bottom tier */}
      <rect x="36" y="206" width="228" height="86" rx="10" fill="url(#ck-t1)" />
      <path d="M36 248 Q58 266 81.6 248 Q104 266 127.2 248 Q150 266 172.8 248 Q196 266 218.4 248 Q241 266 264 248" stroke="#D88BAA" strokeWidth="2.2" fill="none" opacity="0.7" />
      {[58, 104, 150, 196, 241].map((x) => (
        <Rosette key={x} cx={x} cy={262} s={0.9} />
      ))}
      <Pearls x={40} y={286} w={220} />
      <ellipse cx="150" cy="206" rx="114" ry="9" fill="#FFF6F9" />
      <Drips x={36} y={206} w={228} fill="#FFFBFD" seed={1} />

      {/* middle tier */}
      <rect x="66" y="142" width="168" height="66" rx="9" fill="url(#ck-t2)" />
      <rect x="66" y="194" width="168" height="8" fill="url(#ck-plate)" opacity="0.9" />
      {[90, 120, 150, 180, 210].map((x, i) => (
        <circle key={x} cx={x} cy={176} r={i % 2 ? 2.2 : 3} fill="#FFFFFF" opacity="0.85" />
      ))}
      <ellipse cx="150" cy="142" rx="84" ry="7" fill="#FBF7FF" />
      <Drips x={66} y={142} w={168} fill="#F7C9DA" seed={2} />

      {/* top tier */}
      <rect x="98" y="92" width="104" height="52" rx="8" fill="url(#ck-t3)" />
      <Pearls x={100} y={139} w={100} r={2.2} />
      <Rosette cx={150} cy={118} s={1.15} fill="#E9A6BF" />
      <Rosette cx={124} cy={121} s={0.75} fill="#D9C4F2" />
      <Rosette cx={176} cy={121} s={0.75} fill="#D9C4F2" />
      <ellipse cx="150" cy="92" rx="52" ry="5.5" fill="#FFFDFB" />
      <Drips x={98} y={92} w={104} fill="#FFFFFF" seed={0} />

      {/* candles */}
      {CANDLES.map((x, i) => (
        <g key={x}>
          <rect x={x - 3.5} y={58} width={7} height={36} rx={2} fill="url(#ck-candle)" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${x - 3.5} ${66 + k * 8}L${x + 3.5} ${61 + k * 8}`} stroke="#E9A6BF" strokeWidth="2" />
          ))}
          <path d={`M${x} 58V52`} stroke="#5A4351" strokeWidth="1.2" strokeLinecap="round" />

          <AnimatePresence>
            {lit && (
              <motion.g
                key="flame"
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0, y: -6, transition: { duration: 0.35, delay: i * 0.06, ease: "easeIn" } }}
                className="origin-bottom-box"
              >
                <g
                  className="anim-flicker origin-bottom-box"
                  style={{ "--dur": `${1.2 + (i % 3) * 0.25}s`, "--delay": `${-i * 0.37}s` } as CSSProperties}
                >
                  <circle cx={x} cy={44} r={9} fill="#FFE6A8" opacity="0.35" />
                  <path d={`M${x} 31C${x + 6} 40 ${x + 6} 48 ${x} 52C${x - 6} 48 ${x - 6} 40 ${x} 31Z`} fill="url(#ck-flame)" />
                  <ellipse cx={x} cy={47} rx={1.8} ry={3} fill="#9FC4FF" opacity="0.55" />
                </g>
              </motion.g>
            )}
          </AnimatePresence>

          {/* smoke after the wish */}
          {!lit && (
            <motion.path
              d={`M${x} 50C${x - 5} 42 ${x + 5} 36 ${x} 28C${x - 5} 20 ${x + 4} 14 ${x} 6`}
              stroke="#B9A7C4"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
              initial={{ pathLength: 0, opacity: 0, y: 0 }}
              animate={{ pathLength: 1, opacity: [0, 0.75, 0], y: -18 }}
              transition={{ duration: 1.8, delay: 0.2 + i * 0.08, ease: "easeOut" }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
