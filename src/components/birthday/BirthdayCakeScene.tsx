"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, WandSparkles } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { birthdayConfig } from "@/config/birthday";
import { Cake } from "@/components/art/Cake";
import { Balloon } from "@/components/art/Balloon";
import { Sparkles } from "@/components/effects/Sparkles";
import { celebrate } from "@/components/effects/ConfettiEffect";
import { MagicalButton } from "@/components/ui/MagicalButton";
import { RevealText } from "@/components/ui/RevealText";
import { useSound } from "@/components/audio/SoundProvider";
import type { SceneProps } from "./types";

const copy = birthdayConfig.cake;

type Phase = "lit" | "wishing" | "wished";

const BALLOONS = [
  { id: "a", color: "#F3B6CB", shade: "#D27C9E", cls: "-left-5 top-[16%] w-14 sm:left-[6%] sm:w-20", dur: "6.5s", delay: "0s" },
  { id: "b", color: "#DCCBF4", shade: "#A98CD6", cls: "left-5 top-[30%] w-10 sm:left-[14%] sm:w-14", dur: "7.5s", delay: "-2s" },
  { id: "c", color: "#F4E2B8", shade: "#C9A263", cls: "-right-4 top-[12%] w-12 sm:right-[7%] sm:w-[4.5rem]", dur: "7s", delay: "-1s" },
  { id: "d", color: "#F6C9D8", shade: "#D88BAA", cls: "right-4 top-[34%] w-9 sm:right-[15%] sm:w-12", dur: "8s", delay: "-3.5s" },
];

export function BirthdayCakeScene({ onNext }: SceneProps) {
  const [phase, setPhase] = useState<Phase>("lit");
  const reduced = useReducedMotion();
  const { play } = useSound();
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const wish = () => {
    if (phase !== "lit") return;
    setPhase("wishing");
    timers.current.push(
      window.setTimeout(
        () => {
          setPhase("wished");
          play("blow");
          celebrate();
        },
        reduced ? 300 : 1500,
      ),
    );
  };

  const lit = phase !== "wished";

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-5 text-center scene-pad">
      {/* balloons */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {BALLOONS.map((b, i) => (
          <motion.div
            key={b.id}
            className={`absolute ${b.cls}`}
            initial={{ opacity: 0, y: 120 }}
            animate={{ opacity: 0.92, y: 0 }}
            transition={{ duration: 2.2, delay: 0.3 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="anim-balloon" style={{ "--dur": b.dur, "--delay": b.delay } as CSSProperties}>
              <Balloon id={b.id} color={b.color} shade={b.shade} className="w-full" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-rose-deep"
        >
          {copy.eyebrow}
        </motion.p>
        <RevealText
          as="h1"
          by="chars"
          text={copy.heading}
          delay={0.25}
          stagger={0.035}
          className="text-balance font-display text-[clamp(2.5rem,11.5vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.01em] text-plum"
        />
        <RevealText
          text={copy.subheading}
          delay={1.0}
          className="text-balance mt-3 max-w-[24rem] font-display text-[clamp(1.1rem,4.4vw,1.35rem)] italic leading-snug text-plum/80"
        />
      </div>

      {/* cake */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 my-[clamp(0.5rem,2.5svh,1.75rem)] aspect-[300/330] w-[clamp(180px,36svh,340px)]"
      >
        <Cake lit={lit} />
        {phase === "wished" && (
          <div className="absolute inset-x-0 top-[13%] h-0">
            <Sparkles burstKey="wish" count={20} radius={160} />
            <Sparkles burstKey="wish2" count={12} radius={100} seed={17} delay={0.15} />
          </div>
        )}
      </motion.div>

      <div className="relative z-10 flex min-h-[9.5rem] w-full flex-col items-center">
        <AnimatePresence mode="wait">
          {phase === "lit" && (
            <motion.div
              key="ask"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 1.6, duration: 0.6 } }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.3 } }}
            >
              <MagicalButton onClick={wish} icon={<WandSparkles className="h-4 w-4" />}>
                {copy.wishButton} ✨
              </MagicalButton>
            </motion.div>
          )}

          {phase === "wishing" && (
            <motion.p
              key="wishing"
              role="status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
              className="pt-3 font-display text-[clamp(1.2rem,5vw,1.5rem)] italic text-plum/80"
            >
              {copy.wishPrompt}
              <motion.span
                aria-hidden
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                …
              </motion.span>
            </motion.p>
          )}

          {phase === "wished" && (
            <motion.div
              key="wished"
              className="flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <RevealText
                text={copy.message}
                delay={0.5}
                stagger={0.045}
                className="text-balance max-w-[26rem] font-display text-[clamp(1.15rem,4.6vw,1.4rem)] leading-snug text-plum"
              />
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.9, duration: 0.7 }}
                className="mt-4 text-sm font-medium tracking-wide text-rose-deep"
              >
                {copy.more}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.3, duration: 0.6 }}
                className="mt-4"
              >
                <MagicalButton onClick={onNext} iconAfter={<ArrowRight className="h-4 w-4" />}>
                  {copy.continueButton}
                </MagicalButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
