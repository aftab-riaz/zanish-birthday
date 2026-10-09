"use client";

import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, Share2, WandSparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { birthdayConfig } from "@/config/birthday";
import { range, seeded } from "@/lib/random";
import { starShower } from "@/components/effects/ConfettiEffect";
import { MagicalButton } from "@/components/ui/MagicalButton";
import { RevealText } from "@/components/ui/RevealText";
import { useSound } from "@/components/audio/SoundProvider";

const copy = birthdayConfig.finale;

type Props = { onReplay: () => void };

export function FinaleScene({ onReplay }: Props) {
  const [bursts, setBursts] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const { play } = useSound();
  const statusTimer = useRef<number | null>(null);
  const sparkled = bursts > 0;

  useEffect(() => () => {
    if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
  }, []);

  const sparkle = () => {
    setBursts((b) => b + 1);
    play("sparkle");
    starShower();
  };

  const flash = (msg: string) => {
    setStatus(msg);
    if (statusTimer.current !== null) window.clearTimeout(statusTimer.current);
    statusTimer.current = window.setTimeout(() => setStatus(null), 3200);
  };

  const share = async () => {
    const url = window.location.href.split("#")[0];
    const data = { title: birthdayConfig.meta.shareTitle, text: birthdayConfig.meta.shareText, url };
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      flash(copy.copied);
    } catch {
      flash(copy.shareFailed);
    }
  };

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden px-6 text-center text-cream scene-pad">
      <NightSky bright={sparkled} bursts={bursts} />

      <div className="relative z-10 flex max-w-[44rem] flex-col items-center">
        <RevealText
          as="h1"
          text={copy.heading}
          delay={0.6}
          stagger={0.11}
          className="text-balance font-display text-[clamp(2.1rem,8.8vw,4.4rem)] font-medium leading-[1.06] text-cream [text-shadow:0_0_30px_rgba(240,223,186,0.25)]"
        />
        <RevealText
          text={copy.subheading}
          delay={2.2}
          stagger={0.05}
          className="text-balance mt-5 max-w-[30rem] font-display text-[clamp(1.1rem,4.4vw,1.35rem)] italic leading-snug text-cream/80"
        />
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-script text-[clamp(2.2rem,10vw,3.4rem)] leading-none text-champagne-soft [text-shadow:0_0_24px_rgba(216,183,124,0.55)]"
        >
          {copy.birthdayLine} ✨
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.2, duration: 0.8 }}
          className="mt-8 flex flex-col items-center"
        >
          <MagicalButton variant="glow" onClick={sparkle} icon={<WandSparkles className="h-4 w-4" />}>
            {sparkled ? copy.sparkleAgainButton : copy.sparkleButton}
          </MagicalButton>

          <div className="mt-5 min-h-[2.5rem]" aria-live="polite">
            <AnimatePresence>
              {sparkled && (
                <motion.p
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="font-display text-[clamp(1.35rem,5.6vw,1.75rem)] font-medium text-cream"
                >
                  {copy.finalMessage}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.8, duration: 1 }}
          className="mt-8 flex flex-col items-center gap-5"
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <MagicalButton variant="outline" onClick={onReplay} icon={<RotateCcw className="h-4 w-4" />} className="text-cream">
              {copy.replayButton}
            </MagicalButton>
            <MagicalButton variant="outline" onClick={share} icon={<Share2 className="h-4 w-4" />} className="text-cream">
              {copy.shareButton}
            </MagicalButton>
          </div>
          <p role="status" className="min-h-5 text-sm text-champagne-soft">
            {status}
          </p>
          <p className="text-xs tracking-wide text-cream/70">{copy.footer}</p>
        </motion.div>
      </div>
    </div>
  );
}

/* ───────────────────────── Night sky */

function NightSky({ bright, bursts }: { bright: boolean; bursts: number }) {
  const stars = useMemo(() => {
    const rand = seeded(91);
    return Array.from({ length: 56 }, (_, i) => ({
      id: i,
      left: range(rand, 0, 100),
      top: range(rand, 0, 92),
      size: range(rand, 1.2, i % 9 === 0 ? 4.2 : 2.6),
      dur: range(rand, 2.2, 5.5),
      delay: range(rand, -6, 0),
    }));
  }, []);

  const shooters = useMemo(() => {
    const rand = seeded(57 + bursts);
    return Array.from({ length: 9 }, (_, i) => ({
      id: i,
      left: range(rand, 35, 110),
      top: range(rand, -5, 45),
      delay: range(rand, 0, 1.6),
      len: range(rand, 90, 180),
    }));
  }, [bursts]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* sky glow when sparkled */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(80%_55%_at_50%_30%,rgba(233,166,191,0.32)_0%,rgba(201,164,224,0.18)_45%,rgba(0,0,0,0)_75%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: bright ? 1 : 0 }}
        transition={{ duration: 1.6 }}
      />

      {/* stars */}
      <div className={`starfield absolute inset-0 ${bright ? "is-bright" : ""}`}>
        {stars.map((s) => (
          <span
            key={s.id}
            className="star anim-twinkle absolute rounded-full bg-white"
            style={
              {
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                boxShadow: s.size > 3 ? "0 0 8px 2px rgba(255,244,214,0.6)" : undefined,
                "--dur": `${s.dur}s`,
                "--delay": `${s.delay}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* moon */}
      <motion.div
        className="absolute right-[6%] top-[9%] w-[clamp(64px,18vw,120px)] sm:right-[12%]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <div className="anim-halo absolute left-1/2 top-1/2 h-[260%] w-[260%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,240,210,0.28)_0%,rgba(255,240,210,0.08)_40%,rgba(255,240,210,0)_70%)]" />
        <svg viewBox="0 0 100 100" className="relative w-full">
          <defs>
            <radialGradient id="moon" cx="38%" cy="35%" r="70%">
              <stop offset="0%" stopColor="#FFFBEF" />
              <stop offset="60%" stopColor="#F5E6C4" />
              <stop offset="100%" stopColor="#D8B77C" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="46" fill="url(#moon)" />
          <circle cx="36" cy="58" r="8" fill="#E7D2A6" opacity="0.5" />
          <circle cx="62" cy="34" r="5" fill="#E7D2A6" opacity="0.45" />
          <circle cx="64" cy="66" r="4" fill="#E7D2A6" opacity="0.4" />
        </svg>
      </motion.div>

      {/* ambient shooting stars */}
      {[
        { left: "92%", top: "8%", dur: "9s", delay: "2s" },
        { left: "70%", top: "4%", dur: "13s", delay: "7s" },
      ].map((s) => (
        <span
          key={s.left}
          className="anim-shooting absolute h-[2px] w-[130px] rounded-full bg-gradient-to-r from-white to-transparent opacity-0"
          style={{ left: s.left, top: s.top, "--dur": s.dur, "--delay": s.delay } as CSSProperties}
        />
      ))}

      {/* sparkle burst shooting stars */}
      {bursts > 0 &&
        shooters.map((s) => (
          <motion.span
            key={`${bursts}-${s.id}`}
            className="absolute h-[2px] rounded-full bg-gradient-to-r from-white via-champagne-soft to-transparent"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.len, rotate: -28, originX: 0 }}
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x: "-70vw", y: "37vw", opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.3, delay: s.delay, ease: "easeOut" }}
          />
        ))}

      {/* distant hills */}
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[14%] w-full">
        <path d="M0 40C60 18 120 30 190 38C260 46 320 20 400 30V80H0Z" fill="#2E1F38" opacity="0.7" />
        <path d="M0 58C80 40 150 56 220 52C300 48 350 40 400 48V80H0Z" fill="#1E1428" />
      </svg>
    </div>
  );
}
