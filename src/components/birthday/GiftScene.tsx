"use client";

import { motion, useReducedMotion } from "motion/react";
import { Gift } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { birthdayConfig } from "@/config/birthday";
import { GiftBox } from "@/components/art/GiftBox";
import { Sparkles, SparkleShape } from "@/components/effects/Sparkles";
import { burstAt } from "@/components/effects/ConfettiEffect";
import { MagicalButton } from "@/components/ui/MagicalButton";
import { RevealText } from "@/components/ui/RevealText";
import { useSound } from "@/components/audio/SoundProvider";
import type { SceneProps } from "./types";

const copy = birthdayConfig.gift;

export function GiftScene({ onNext }: SceneProps) {
  const [opening, setOpening] = useState(false);
  const reduced = useReducedMotion();
  const { play } = useSound();
  const giftRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = () => {
    if (opening) return;
    setOpening(true);
    play("open");
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, reduced ? Math.min(ms, 400) : ms));

    at(650, () => {
      const rect = giftRef.current?.getBoundingClientRect();
      if (rect) burstAt((rect.left + rect.width / 2) / window.innerWidth, (rect.top + rect.height * 0.45) / window.innerHeight, 60);
    });
    at(2100, onNext);
  };

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-6 text-center scene-pad">
      <motion.div
        animate={{ opacity: opening ? 0 : 1, y: opening ? -12 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.5em" }}
          animate={{ opacity: 1, letterSpacing: "0.32em" }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="mb-3 flex items-center gap-3 text-[0.68rem] font-semibold uppercase text-rose-deep"
        >
          <span aria-hidden className="h-px w-6 bg-rose-deep/40" />
          {copy.eyebrow}
          <span aria-hidden className="h-px w-6 bg-rose-deep/40" />
        </motion.p>

        <RevealText
          as="h1"
          by="chars"
          text={`${copy.greeting} ✨`}
          delay={0.2}
          className="font-display text-[clamp(2.6rem,12vw,5rem)] font-medium italic leading-[1.02] text-plum"
        />
      </motion.div>

      {/* The gift */}
      <motion.div
        ref={giftRef}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 my-[clamp(0.75rem,3.5svh,2.25rem)] w-[clamp(170px,30svh,280px)]"
      >
        {/* halo */}
        <div
          aria-hidden
          className="anim-glow absolute left-1/2 top-1/2 h-[140%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,244,228,0.95)_0%,rgba(248,221,232,0.5)_40%,rgba(248,221,232,0)_70%)]"
        />
        {/* orbiting sparkles */}
        {!opening &&
          [
            "left-[2%] top-[18%] h-4 w-4 [--delay:0s]",
            "right-[0%] top-[8%] h-3 w-3 [--delay:-1.1s]",
            "right-[6%] bottom-[24%] h-5 w-5 [--delay:-2s]",
            "left-[8%] bottom-[12%] h-3 w-3 [--delay:-0.6s]",
          ].map((cls) => (
            <span key={cls} aria-hidden className={`anim-twinkle absolute ${cls}`}>
              <SparkleShape className="h-full w-full" fill="#D8B77C" />
            </span>
          ))}

        <button
          type="button"
          onClick={open}
          disabled={opening}
          aria-label={`${copy.button} — tap the gift`}
          className="anim-float relative block aspect-[260/280] w-full cursor-pointer rounded-[2rem] focus-visible:outline-offset-8 disabled:cursor-default"
        >
          <motion.span
            className="block h-full w-full"
            whileHover={opening ? undefined : { rotate: [-1.5, 1.5, -1, 0], transition: { duration: 0.6 } }}
            whileTap={opening ? undefined : { scale: 0.96 }}
            animate={opening ? { scale: [1, 1.04, 0.98, 1.06], y: [0, -4, 2, -6] } : undefined}
            transition={{ duration: 0.5 }}
          >
            <GiftBox open={opening} />
          </motion.span>
        </button>

        {opening && (
          <>
            <Sparkles burstKey="open" count={18} radius={170} delay={0.55} />
            <Sparkles burstKey="open2" count={10} radius={110} delay={0.8} seed={9} />
          </>
        )}
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col items-center"
        animate={{ opacity: opening ? 0 : 1, y: opening ? 12 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <RevealText
          text={copy.line1}
          delay={1.1}
          className="text-balance max-w-[22rem] font-display text-[clamp(1.2rem,4.8vw,1.45rem)] leading-snug text-plum/90"
        />
        <RevealText
          text={copy.line2}
          delay={1.6}
          className="mt-1 text-[0.95rem] text-plum/65"
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.0, duration: 0.7 }}
          className="mt-6 flex flex-col items-center gap-3"
        >
          <MagicalButton onClick={open} disabled={opening} icon={<Gift className="h-4 w-4" />}>
            {copy.button}
          </MagicalButton>
          <p className="anim-hint flex items-center gap-1.5 text-xs font-medium tracking-wide text-plum/55 [@media(hover:hover)]:hidden">
            <span aria-hidden>↑</span> {copy.hint}
          </p>
        </motion.div>
      </motion.div>

      {/* bloom of light that carries us into the next scene */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-1/2 z-20 h-[40vmax] w-[40vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,#FFFDF8_0%,#FFF4E6_45%,rgba(255,244,230,0)_70%)]"
        initial={{ opacity: 0, scale: 0 }}
        animate={opening ? { opacity: [0, 0, 1], scale: [0, 0.6, 4.5] } : { opacity: 0, scale: 0 }}
        transition={{ duration: 2.1, times: [0, 0.45, 1], ease: "easeIn" }}
      />
    </div>
  );
}
