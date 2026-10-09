"use client";

import { AnimatePresence, motion } from "motion/react";
import { Mail } from "lucide-react";
import { useState, type ComponentType, type CSSProperties } from "react";
import { birthdayConfig } from "@/config/birthday";
import {
  Butterfly,
  Dandelion,
  GardenHill,
  LittleEnvelope,
  RoseBloom,
  TinyFlower,
  WishStar,
} from "@/components/art/GardenArt";
import { Sparkles } from "@/components/effects/Sparkles";
import { MagicalButton } from "@/components/ui/MagicalButton";
import { RevealText } from "@/components/ui/RevealText";
import { useSound } from "@/components/audio/SoundProvider";
import type { SceneProps } from "./types";

const copy = birthdayConfig.garden;
const NUMERALS = ["I", "II", "III", "IV", "V"];

type Spot = {
  Art: ComponentType<{ open: boolean }>;
  label: string;
  /** Position/size within the garden stage (percentages). */
  pos: CSSProperties;
  aspect: string;
  float?: boolean;
  /** Where the glow ring sits, as % of the item box. */
  ring: { top: string };
};

// Order maps 1:1 onto `birthdayConfig.garden.messages`.
const SPOTS: Spot[] = [
  { Art: RoseBloom, label: "a rosebud", pos: { left: "4%", top: "30%", width: "25%" }, aspect: "100/150", ring: { top: "26%" } },
  { Art: WishStar, label: "a little star", pos: { left: "40%", top: "0%", width: "21%" }, aspect: "1/1", float: true, ring: { top: "50%" } },
  { Art: LittleEnvelope, label: "a floating envelope", pos: { left: "72%", top: "6%", width: "24%" }, aspect: "1/1", float: true, ring: { top: "60%" } },
  { Art: Butterfly, label: "a resting butterfly", pos: { left: "5%", top: "2%", width: "24%" }, aspect: "1/1", float: true, ring: { top: "52%" } },
  { Art: Dandelion, label: "a dandelion", pos: { left: "67%", top: "36%", width: "25%" }, aspect: "100/150", ring: { top: "23%" } },
];

export function FriendshipGardenScene({ onNext }: SceneProps) {
  const [opened, setOpened] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const { play } = useSound();
  const allOpen = opened.length === SPOTS.length;

  const reveal = (i: number) => {
    setActive(i);
    setOpened((prev) => (prev.includes(i) ? prev : [...prev, i]));
    play("pluck", i);
  };

  return (
    <div className="relative flex min-h-full flex-col items-center px-5 text-center scene-pad">
      <div className="relative z-10 flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-rose-deep"
        >
          {copy.eyebrow}
        </motion.p>
        <RevealText
          as="h1"
          text={copy.heading}
          delay={0.15}
          stagger={0.08}
          className="text-balance font-display text-[clamp(2.1rem,9.5vw,4.2rem)] font-medium leading-[1.02] text-plum"
        />
        <RevealText
          text={copy.subheading}
          delay={0.7}
          className="text-balance mt-2 max-w-[24rem] text-[0.95rem] leading-relaxed text-plum/70"
        />
      </div>

      {/* the garden stage */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mt-3 aspect-[10/8.6] w-full max-w-[30rem] sm:aspect-[10/7.4] sm:max-w-[34rem]"
      >
        <div aria-hidden className="absolute inset-x-[-6%] bottom-0 h-[42%] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent),linear-gradient(0deg,transparent,#000_30%)] [mask-composite:intersect]">
          <GardenHill />
        </div>
        {[
          { left: "34%", bottom: "8%", w: "5%", c: "#E9A6BF", d: "0s" },
          { left: "42%", bottom: "4%", w: "6%", c: "#D9C4F2", d: "-1.2s" },
          { left: "52%", bottom: "9%", w: "4.5%", c: "#F4E2B8", d: "-0.6s" },
          { left: "58%", bottom: "3%", w: "5.5%", c: "#F6C9D8", d: "-2s" },
          { left: "93%", bottom: "14%", w: "4.5%", c: "#D9C4F2", d: "-1.6s" },
          { left: "1%", bottom: "6%", w: "5%", c: "#F4E2B8", d: "-0.3s" },
        ].map((f) => (
          <TinyFlower
            key={f.left}
            color={f.c}
            className="anim-sway origin-bottom-box absolute"
            style={{ left: f.left, bottom: f.bottom, width: f.w, animationDelay: f.d }}
          />
        ))}

        {SPOTS.map((spot, i) => {
          const isOpen = opened.includes(i);
          const { Art } = spot;
          return (
            <motion.div
              key={spot.label}
              className="absolute"
              style={spot.pos}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.8 + i * 0.12 }}
            >
              <div className={spot.float ? "anim-float" : ""} style={{ animationDelay: `${-i * 0.9}s` }}>
                <button
                  type="button"
                  onClick={() => reveal(i)}
                  aria-label={`Wish ${i + 1} of ${SPOTS.length}: ${spot.label}${isOpen ? " (opened)" : ""}`}
                  aria-controls="garden-message"
                  aria-pressed={active === i}
                  className="relative block w-full cursor-pointer rounded-3xl"
                  style={{ aspectRatio: spot.aspect }}
                >
                  {!isOpen && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 aspect-square w-[70%] -translate-x-1/2 -translate-y-1/2"
                      style={{ top: spot.ring.top }}
                    >
                      <span className="anim-pulse-ring absolute inset-0 rounded-full border border-champagne/80 bg-champagne-soft/20" style={{ "--delay": `${i * 0.4}s` } as CSSProperties} />
                    </span>
                  )}
                  <motion.span className="block h-full w-full" whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}>
                    <Art open={isOpen} />
                  </motion.span>
                  {isOpen && active === i && (
                    <span className="absolute left-0 right-0 h-0" style={{ top: spot.ring.top }}>
                      <Sparkles burstKey={`g${i}`} count={10} radius={60} seed={i + 30} />
                    </span>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* message whisper */}
      <div className="relative z-10 mt-1 flex w-full max-w-[26rem] flex-col items-center">
        <div className="flex items-center gap-2" aria-hidden>
          {SPOTS.map((s, i) => (
            <span
              key={s.label}
              className={`block h-1.5 rounded-full transition-all duration-500 ${
                opened.includes(i) ? "w-5 bg-rose-deep/70" : "w-1.5 bg-plum/20"
              }`}
            />
          ))}
        </div>
        <p className="sr-only">
          {opened.length} of {SPOTS.length} wishes found
        </p>

        <div id="garden-message" aria-live="polite" className="relative mt-3 flex min-h-[7.5rem] w-full items-start justify-center">
          <AnimatePresence mode="wait">
            {active === null ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.6 } }}
                exit={{ opacity: 0 }}
                className="anim-hint pt-2 text-sm font-medium text-plum/60"
              >
                {copy.hint} ✦
              </motion.p>
            ) : (
              <motion.figure
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center"
              >
                <span className="font-display text-sm font-semibold tracking-[0.3em] text-champagne" aria-hidden>
                  — {NUMERALS[active]} —
                </span>
                <blockquote className="text-balance mt-1 font-display text-[clamp(1.3rem,5.4vw,1.6rem)] italic leading-snug text-plum">
                  “{copy.messages[active]}”
                </blockquote>
              </motion.figure>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-1 flex min-h-[6.5rem] flex-col items-center justify-start">
          <AnimatePresence mode="wait">
            {allOpen ? (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="flex flex-col items-center gap-3"
              >
                <p className="font-script text-[clamp(1.7rem,7vw,2.1rem)] leading-none text-rose-deep">{copy.complete}</p>
                <MagicalButton onClick={onNext} icon={<Mail className="h-4 w-4" />}>
                  {copy.continueButton} 💌
                </MagicalButton>
              </motion.div>
            ) : (
              <motion.div
                key="skip"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 2.4 } }}
                exit={{ opacity: 0 }}
              >
                <MagicalButton variant="ghost" onClick={onNext} className="text-plum">
                  {copy.skipButton} →
                </MagicalButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
