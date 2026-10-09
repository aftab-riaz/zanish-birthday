"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Sparkles as SparklesIcon, X } from "lucide-react";
import { useEffect, useRef, useState, type Ref } from "react";
import { birthdayConfig } from "@/config/birthday";
import { FloralCorner } from "@/components/art/FloralCorner";
import { MagicalButton } from "@/components/ui/MagicalButton";
import { useSound } from "@/components/audio/SoundProvider";
import type { SceneProps } from "./types";

const copy = birthdayConfig.letter;
const EASE = [0.22, 1, 0.36, 1] as const;

type Phase = "sealed" | "opening" | "open";

export function LetterScene({ onNext }: SceneProps) {
  const [phase, setPhase] = useState<Phase>("sealed");
  const reduced = useReducedMotion();
  const { play } = useSound();
  const timer = useRef<number | null>(null);
  const letterRef = useRef<HTMLElement>(null);
  const envelopeRef = useRef<HTMLButtonElement>(null);
  const refocusEnvelope = useRef(false);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const openLetter = () => {
    if (phase !== "sealed") return;
    setPhase("opening");
    play("paper");
    timer.current = window.setTimeout(() => setPhase("open"), reduced ? 250 : 1700);
  };

  const foldLetter = () => {
    refocusEnvelope.current = true;
    setPhase("sealed");
  };

  // Move focus sensibly as the letter opens and folds.
  useEffect(() => {
    if (phase === "open") {
      letterRef.current?.focus({ preventScroll: true });
      letterRef.current?.closest(".scene-scroll")?.scrollTo({ top: 0 });
    }
  }, [phase]);

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-4 scene-pad">
      {phase !== "open" && (
        <>
          <FloralCorner className="pointer-events-none absolute left-0 top-0 w-28 opacity-70 sm:w-40" />
          <FloralCorner className="pointer-events-none absolute bottom-0 right-0 w-28 rotate-180 opacity-70 sm:w-40" />
        </>
      )}

      <AnimatePresence mode="wait">
        {phase !== "open" ? (
          <motion.div
            key="envelope"
            className="flex w-full flex-col items-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40, scale: 0.96, transition: { duration: 0.45 } }}
            transition={{ duration: 0.8, ease: EASE }}
            onAnimationComplete={() => {
              if (!refocusEnvelope.current) return;
              refocusEnvelope.current = false;
              envelopeRef.current?.focus();
            }}
          >
            <motion.div animate={{ opacity: phase === "opening" ? 0 : 1 }} transition={{ duration: 0.4 }}>
              <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-rose-deep">{copy.eyebrow}</p>
              <h1 className="text-balance font-display text-[clamp(1.9rem,8.4vw,3.2rem)] font-medium italic leading-tight text-plum">
                {copy.envelopeLabel}
              </h1>
            </motion.div>

            <Envelope ref={envelopeRef} opening={phase === "opening"} onOpen={openLetter} />

            <motion.p
              animate={{ opacity: phase === "opening" ? 0 : 1 }}
              className="anim-hint mt-2 text-xs font-medium tracking-wide text-plum/60"
            >
              {copy.hint} ✦
            </motion.p>
          </motion.div>
        ) : (
          <Letter key="letter" ref={letterRef} onFold={foldLetter} onNext={onNext} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────────────────────── Envelope */

function Envelope({
  opening,
  onOpen,
  ref,
}: {
  opening: boolean;
  onOpen: () => void;
  ref: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      disabled={opening}
      aria-label={copy.openButton}
      className="group relative mt-8 aspect-[1.45] w-[min(84vw,24rem)] cursor-pointer rounded-xl [perspective:1100px] disabled:cursor-default"
    >
      <motion.div
        className="absolute inset-0"
        whileHover={opening ? undefined : { y: -4, rotate: -1 }}
        whileTap={opening ? undefined : { scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        {/* shadow */}
        <div className="absolute inset-x-[6%] -bottom-4 h-6 rounded-[50%] bg-plum/15 blur-md" />

        {/* back of envelope */}
        <div className="absolute inset-0 rounded-xl bg-[linear-gradient(160deg,#F2D6DE_0%,#E9C3CF_100%)] shadow-[0_24px_50px_-22px_rgba(73,52,78,0.45)]" />

        {/* letter peeking out */}
        <motion.div
          className="paper-texture absolute inset-x-[7%] top-[8%] h-[84%] rounded-md shadow-sm"
          initial={false}
          animate={opening ? { y: "-58%" } : { y: "0%" }}
          transition={{ duration: 0.8, delay: opening ? 0.75 : 0, ease: EASE }}
          style={{ zIndex: 1 }}
        >
          <div className="mx-auto mt-[9%] h-px w-1/2 bg-champagne/50" />
          <p className="mt-[5%] text-center font-script text-[clamp(1.2rem,5vw,1.6rem)] text-plum/80">{copy.greeting}</p>
          <div className="mx-auto mt-[4%] flex w-3/4 flex-col gap-2">
            {[1, 0.85, 0.92].map((w, i) => (
              <span key={i} className="block h-px bg-plum/12" style={{ width: `${w * 100}%` }} />
            ))}
          </div>
        </motion.div>

        {/* front pocket */}
        <svg viewBox="0 0 290 200" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" style={{ zIndex: 2 }} aria-hidden>
          <defs>
            <linearGradient id="env-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FBE7EE" />
              <stop offset="100%" stopColor="#F5D6E1" />
            </linearGradient>
          </defs>
          <path d="M0 0L145 118L290 0V188C290 194.6 284.6 200 278 200H12C5.4 200 0 194.6 0 188Z" fill="url(#env-front)" />
          <path d="M0 196L118 98M290 196L172 98" stroke="#E5B7C8" strokeWidth="1.2" />
        </svg>

        {/* address label */}
        <div className="absolute inset-x-0 bottom-[10%] text-center" style={{ zIndex: 3 }}>
          <p className="font-script text-[clamp(1.3rem,5.6vw,1.75rem)] leading-none text-plum/85">{birthdayConfig.name}</p>
          <div className="mx-auto mt-1 h-px w-24 bg-champagne/60" />
        </div>

        {/* flap */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[60%] origin-top"
          initial={false}
          animate={opening ? { rotateX: 180, zIndex: [4, 4, 0] } : { rotateX: 0, zIndex: 4 }}
          transition={{ duration: 0.75, delay: opening ? 0.2 : 0, ease: EASE, zIndex: { duration: 0.75, delay: opening ? 0.2 : 0, times: [0, 0.5, 0.51] } }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,#EDBFD0_0%,#F4CFDC_100%)] drop-shadow-[0_4px_6px_rgba(73,52,78,0.15)]"
            style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", borderRadius: "12px 12px 0 0" }}
          />
        </motion.div>

        {/* wax seal */}
        <motion.div
          className="absolute left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2"
          style={{ zIndex: 5 }}
          initial={false}
          animate={opening ? { scale: [1, 1.15, 0], opacity: [1, 1, 0], rotate: 25 } : { scale: 1, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.45, ease: "easeIn" }}
        >
          <span className="anim-pulse-ring absolute inset-0 rounded-full border border-champagne/70" />
          <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#F0D9A8_0%,#D8B77C_45%,#B48F52_100%)] shadow-[0_3px_8px_rgba(73,52,78,0.3),inset_0_-2px_4px_rgba(0,0,0,0.15)] ring-2 ring-[#C9A263]/40 ring-offset-0 sm:h-16 sm:w-16">
            <span className="font-script text-[1.9rem] leading-none text-[#7A5A2B] [text-shadow:0_1px_0_rgba(255,255,255,0.4)]">
              {birthdayConfig.name.charAt(0)}
            </span>
          </span>
        </motion.div>
      </motion.div>
    </button>
  );
}

/* ───────────────────────── The letter */

function Letter({
  onFold,
  onNext,
  ref,
}: {
  onFold: () => void;
  onNext: () => void;
  ref: Ref<HTMLElement>;
}) {
  const base = 0.5;
  const step = 0.32;
  const doneAt = base + (copy.paragraphs.length + 3) * step;

  return (
    <motion.article
      ref={ref}
      tabIndex={-1}
      aria-labelledby="letter-greeting"
      initial={{ opacity: 0, y: 60, scale: 0.92, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, y: 40, scale: 0.94, transition: { duration: 0.4 } }}
      transition={{ duration: 0.9, ease: EASE }}
      className="paper-texture relative my-2 w-full max-w-[34rem] rounded-[6px] px-6 pb-8 pt-16 text-left shadow-[0_1px_0_rgba(255,255,255,0.8)_inset,0_30px_60px_-30px_rgba(73,52,78,0.45),0_8px_20px_-10px_rgba(73,52,78,0.2)] outline-none sm:px-12 sm:pb-12 sm:pt-20"
    >
      {/* double hairline frame */}
      <div aria-hidden className="pointer-events-none absolute inset-[10px] rounded-[3px] border border-champagne/45" />
      <div aria-hidden className="pointer-events-none absolute inset-[14px] rounded-[2px] border border-champagne/20" />
      <FloralCorner className="pointer-events-none absolute left-1 top-1 w-16 sm:w-24" />
      <FloralCorner className="pointer-events-none absolute bottom-1 right-1 w-16 rotate-180 sm:w-24" />

      <button
        type="button"
        onClick={onFold}
        aria-label={copy.closeButton}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full text-plum/55 transition-colors hover:bg-blush/60 hover:text-plum"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>

      <div className="relative">
        <motion.h2
          id="letter-greeting"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: base, duration: 0.8 }}
          className="font-script text-[clamp(2.2rem,9vw,3rem)] leading-tight text-plum"
        >
          {copy.greeting}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: base + step, duration: 0.7 }}
          className="mt-3 font-display text-[1.35rem] font-semibold text-rose-deep"
        >
          {copy.opener}
        </motion.p>

        <div className="mt-3 space-y-4 font-display text-[clamp(1.12rem,4.4vw,1.25rem)] font-medium leading-[1.62] text-plum/90">
          {copy.paragraphs.map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: base + (i + 2) * step, duration: 0.8, ease: EASE }}
              className="text-pretty"
            >
              {p}
            </motion.p>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: doneAt, duration: 0.8 }}
          className="mt-8 text-right"
        >
          <p className="font-display text-[1.15rem] italic text-plum/80">{copy.closing}</p>
          <p className="ml-auto mt-1 max-w-[18rem] font-script text-[clamp(1.45rem,6vw,1.8rem)] leading-[1.25] text-rose-deep">
            {copy.signature}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: doneAt + 0.6, duration: 0.7 }}
          className="mt-10 flex flex-col items-center gap-2"
        >
          <div aria-hidden className="mb-2 flex items-center gap-3 text-champagne">
            <span className="h-px w-10 bg-champagne/60" />✦<span className="h-px w-10 bg-champagne/60" />
          </div>
          <MagicalButton onClick={onNext} icon={<SparklesIcon className="h-4 w-4" />}>
            {copy.continueButton} ✨
          </MagicalButton>
          <MagicalButton variant="ghost" onClick={onFold} className="text-plum">
            {copy.closeButton}
          </MagicalButton>
        </motion.div>
      </div>
    </motion.article>
  );
}
