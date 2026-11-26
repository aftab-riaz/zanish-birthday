"use client";

import { AnimatePresence, MotionConfig, animate, motion, useAnimate, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { sajjiConfig as C } from "@/config/sajji";
import { celebrate, heartBurst } from "@/components/effects/ConfettiEffect";
import { FloatingEmojis } from "./FloatingEmojis";
import { SajjiArt, type Mood } from "./SajjiArt";

const MAX_DODGES = C.noLabels.length;
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 380, damping: 24 } as const;

export function SajjiInvite() {
  const [accepted, setAccepted] = useState(false);

  const accept = useCallback(() => {
    setAccepted(true);
    void celebrate();
    window.setTimeout(() => document.querySelector(".scene-scroll")?.scrollTo({ top: 0, behavior: "smooth" }), 560);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <main className="app-shell relative isolate overflow-hidden bg-sunny text-ink">
        <div aria-hidden className="bg-dots pointer-events-none absolute inset-0" />
        <FloatingEmojis />
        <div className="scene-scroll relative z-10 h-full overflow-y-auto overflow-x-hidden">
          <div className="mx-auto flex min-h-full w-full max-w-md flex-col items-center justify-center px-4 pb-[calc(var(--safe-bottom)+1.5rem)] pt-[calc(var(--safe-top)+1.5rem)] sm:max-w-lg sm:py-12">
            <AnimatePresence mode="wait">
              {accepted ? (
                <Accepted key="yes" onAgain={() => setAccepted(false)} />
              ) : (
                <Ask key="ask" onYes={accept} />
              )}
            </AnimatePresence>
            <p className="mt-6 max-w-xs text-center text-xs font-medium leading-relaxed text-ink/75 text-balance">{C.footer}</p>
          </div>
        </div>
      </main>
    </MotionConfig>
  );
}

/* ───────────────────────── The question */

function moodFor(dodges: number): Mood {
  if (dodges === 0) return "happy";
  if (dodges < 4) return "worried";
  return "sad";
}

const [Q_BEFORE, Q_AFTER] = C.ask.question.split("Sajji");

function Ask({ onYes }: { onYes: () => void }) {
  const [dodges, setDodges] = useState(0);
  const [escaped, setEscaped] = useState(false);
  const noX = useMotionValue(0);
  const noY = useMotionValue(0);
  const noRotate = useMotionValue(0);
  const [cardRef, animateCard] = useAnimate<HTMLDivElement>();
  const [yesRef] = useAnimate<HTMLButtonElement>();
  const [noRef] = useAnimate<HTMLButtonElement>();
  const target = useRef({ x: 0, y: 0 });

  const gaveUp = dodges >= MAX_DODGES;
  const noLabel = gaveUp ? C.noGiveUp : C.noLabels[dodges];
  const reaction = dodges > 0 ? C.reactions[Math.min(dodges, C.reactions.length) - 1] : null;
  const yesScale = Math.min(1 + dodges * 0.04, 1.35);

  const dodge = useCallback(() => {
    const btn = noRef.current;
    if (!btn) return;
    const { left, top } = btn.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const pad = 16;
    // leave room for the next (possibly wider) label
    const w = Math.min(Math.max(btn.offsetWidth, 230), vw - pad * 2);
    const h = btn.offsetHeight;
    const yes = yesRef.current?.getBoundingClientRect();

    let next = { x: pad, y: pad };
    for (let i = 0; i < 40; i++) {
      const x = pad + Math.random() * Math.max(vw - w - pad * 2, 0);
      const y = pad + Math.random() * Math.max(vh - h - pad * 2, 0);
      next = { x, y };
      const farFromHere = Math.hypot(x - left, y - top) > 120;
      const clearOfYes =
        !yes || x + w < yes.left - 16 || x > yes.right + 16 || y + h < yes.top - 16 || y > yes.bottom + 16;
      if (farFromHere && clearOfYes) break;
    }

    if (!escaped) {
      // start the chase from where the button is right now
      noX.jump(left);
      noY.jump(top);
      setEscaped(true);
    }
    target.current = next;
    void animate(noX, next.x, SPRING);
    void animate(noY, next.y, SPRING);
    void animate(noRotate, (Math.random() - 0.5) * 14, SPRING);
    if (cardRef.current) void animateCard(cardRef.current, { x: [0, -8, 8, -5, 5, 0] }, { duration: 0.4 });
    navigator.vibrate?.(35);
    setDodges((d) => d + 1);
  }, [escaped, noX, noY, noRotate, noRef, yesRef, cardRef, animateCard]);

  // The label changes after every escape, so make sure the (possibly wider)
  // button is still fully on screen once it has re-rendered.
  useEffect(() => {
    const btn = noRef.current;
    if (!escaped || !btn) return;
    const pad = 16;
    const keepInside = () => {
      const maxX = Math.max(window.innerWidth - btn.offsetWidth - pad, pad);
      const maxY = Math.max(window.innerHeight - btn.offsetHeight - pad, pad);
      const t = target.current;
      const x = Math.min(Math.max(t.x, pad), maxX);
      const y = Math.min(Math.max(t.y, pad), maxY);
      if (x !== t.x || y !== t.y) {
        target.current = { x, y };
        void animate(noX, x, SPRING);
        void animate(noY, y, SPRING);
      }
    };
    keepInside();
    window.addEventListener("resize", keepInside);
    return () => window.removeEventListener("resize", keepInside);
  }, [dodges, escaped, noRef, noX, noY]);

  const onNoClick = () => (gaveUp ? onYes() : dodge());

  return (
    <motion.section
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -30, scale: 0.9, rotate: -3 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="w-full"
      aria-labelledby="ask-question"
    >
      <div ref={cardRef}>
        <Card>
          <Badge>{C.ask.badge}</Badge>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-center font-heading text-[1.6rem] font-extrabold leading-tight text-balance sm:text-3xl"
          >
            {C.ask.greeting}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-3 space-y-4"
          >
            <p className="text-center text-base font-medium text-ink/80">{C.ask.intro}</p>
            <motion.p
              initial={{ scale: 0.6, rotate: -6 }}
              animate={{ scale: 1, rotate: -2 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 300, damping: 12 }}
              className="mx-auto w-fit max-w-full rounded-2xl border-[3px] border-ink bg-lemon px-5 py-3 text-center font-heading text-2xl font-extrabold leading-snug shadow-[4px_4px_0_#1F1A17]"
            >
              {C.ask.quote}
            </motion.p>
            <p className="text-center text-base font-medium leading-relaxed text-ink/80 text-pretty">{C.ask.after}</p>
          </motion.div>

          <div className="mx-auto mt-4 w-32 sm:w-40 [@media(max-height:700px)]:w-24">
            <SajjiArt mood={moodFor(dodges)} className="h-auto w-full overflow-visible" />
          </div>

          <h1
            id="ask-question"
            className="mt-2 text-center font-heading text-[2.2rem] font-extrabold leading-[1.15] text-balance sm:text-[2.6rem]"
          >
            {Q_BEFORE}
            <span className="marker">Sajji</span>
            {Q_AFTER}
          </h1>

          <div className="mt-6 flex min-h-[6.5rem] flex-wrap items-center justify-center gap-4">
            <motion.button
              ref={yesRef}
              type="button"
              onClick={onYes}
              animate={{ scale: yesScale, rotate: [0, -4, 4, -3, 3, 0] }}
              whileTap={{ scale: yesScale * 0.92 }}
              transition={{
                scale: { type: "spring", stiffness: 300, damping: 15 },
                rotate: { duration: 0.6, repeat: Infinity, repeatDelay: 2.2 },
              }}
              className="btn-pop min-h-14 rounded-full bg-chili px-8 font-heading text-xl font-extrabold text-white"
            >
              {C.ask.yes}
            </motion.button>

            <motion.button
              ref={noRef}
              type="button"
              onClick={onNoClick}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse" && !gaveUp) dodge();
              }}
              style={
                escaped
                  ? { position: "fixed", left: 0, top: 0, x: noX, y: noY, rotate: noRotate, zIndex: 30 }
                  : undefined
              }
              className={`btn-pop min-h-12 whitespace-nowrap rounded-full px-6 text-base font-semibold text-ink ${
                gaveUp ? "bg-mint" : "bg-white"
              }`}
            >
              {noLabel}
            </motion.button>
          </div>

          <div className="mt-4 min-h-[4.5rem] text-center" aria-live="polite">
            <AnimatePresence mode="wait">
              {reaction ? (
                <motion.div
                  key={reaction}
                  initial={{ opacity: 0, scale: 0.6, rotate: -4 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="inline-block rounded-2xl border-2 border-ink bg-white px-4 py-2.5 text-sm font-semibold leading-snug text-pretty shadow-[3px_3px_0_#1F1A17]"
                >
                  {reaction}
                </motion.div>
              ) : (
                <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="anim-hint text-sm font-medium text-ink/75">
                  {C.ask.hint}
                </motion.p>
              )}
            </AnimatePresence>
            {dodges > 0 && (
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink/70">
                {C.ask.escapes}: <span className="text-chili">{dodges}</span>
              </p>
            )}
          </div>
        </Card>
      </div>
    </motion.section>
  );
}

/* ───────────────────────── The happy ending */

function Accepted({ onAgain }: { onAgain: () => void }) {
  const [whenId, setWhenId] = useState<string | null>(null);
  const when = C.yes.whenOptions.find((o) => o.id === whenId);
  const thanksRef = useRef<HTMLDivElement>(null);

  const pick = (id: string) => {
    const first = whenId === null;
    setWhenId(id);
    if (first) {
      void heartBurst();
      window.setTimeout(() => thanksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.85, rotate: 3 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="w-full space-y-6"
      aria-labelledby="yes-heading"
    >
      <Card>
        <Stamp />
        <Badge>{C.yes.badge}</Badge>

        <div className="mx-auto mt-4 w-32 sm:w-40">
          <SajjiArt mood="party" className="h-auto w-full overflow-visible" />
        </div>

        <div className="mt-2 text-center">
          <h1 id="yes-heading" className="font-heading text-[2.6rem] font-extrabold leading-none sm:text-5xl">
            {C.yes.heading}
          </h1>
          <p className="mt-3 text-base font-medium leading-relaxed text-ink/80 text-pretty">{C.yes.body}</p>
        </div>

        <h2 className="mt-6 text-center font-heading text-xl font-extrabold">{C.yes.termsTitle}</h2>
        <ul className="mt-3 space-y-2.5">
          {C.yes.terms.map((t, i) => (
            <motion.li
              key={t}
              initial={{ opacity: 0, x: i % 2 ? 40 : -40, rotate: i % 2 ? 3 : -3 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              transition={{ delay: 0.6 + i * 0.15, type: "spring", stiffness: 260, damping: 18 }}
              className="rounded-2xl border-2 border-ink bg-white px-4 py-3 text-center text-base font-semibold shadow-[3px_3px_0_#1F1A17]"
            >
              {t}
            </motion.li>
          ))}
        </ul>

        <h2 className="mt-7 text-center font-heading text-xl font-extrabold">{C.yes.whenTitle}</h2>
        <div className="mt-3 grid grid-cols-2 gap-3" role="radiogroup" aria-label={C.yes.whenTitle}>
          {C.yes.whenOptions.map((o) => {
            const active = whenId === o.id;
            return (
              <motion.button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => pick(o.id)}
                whileTap={{ scale: 0.94 }}
                className={`btn-pop flex min-h-[4.5rem] flex-col items-center justify-center rounded-2xl px-2 py-3 ${active ? "bg-lemon" : "bg-white"}`}
              >
                <span className="font-heading text-xl font-extrabold leading-tight">
                  {active ? "✅ " : ""}
                  {o.label}
                </span>
                <span className="text-sm font-medium text-ink/75">{o.date}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="mt-3 min-h-6 text-center" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={when?.id ?? "hint"}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`text-sm font-semibold text-pretty ${when ? "text-chili" : "anim-hint text-ink/75"}`}
            >
              {when ? when.note : C.yes.whenHint}
            </motion.p>
          </AnimatePresence>
        </div>
      </Card>

      <div ref={thanksRef} className="scroll-mt-4">
        <AnimatePresence>
          {when && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
            >
              <Card>
                <div className="text-center">
                  <motion.div
                    aria-hidden
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 0.9, repeat: Infinity, repeatDelay: 0.4 }}
                    className="text-5xl"
                  >
                    💛
                  </motion.div>
                  <h2 className="mt-2 font-heading text-[2.1rem] font-extrabold leading-tight text-chili">{C.thanks.heading}</h2>
                  <p className="mt-2 text-base font-medium leading-relaxed text-ink/80 text-pretty">{C.thanks.body}</p>
                </div>

                <h3 className="mt-6 text-center font-heading text-xl font-extrabold">{C.thanks.wishesTitle}</h3>
                <ul className="mt-3 space-y-2.5">
                  {C.thanks.wishes.map((w, i) => (
                    <motion.li
                      key={w}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.2 }}
                      className="rounded-2xl border-2 border-ink bg-lemon px-4 py-3 text-center text-base font-semibold leading-snug shadow-[3px_3px_0_#1F1A17] text-pretty"
                    >
                      {w}
                    </motion.li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={onAgain}
          className="min-h-10 text-sm font-semibold text-ink/75 underline decoration-ink/40 underline-offset-4 hover:text-ink"
        >
          {C.yes.again}
        </button>
      </div>
    </motion.section>
  );
}

/* ───────────────────────── Pieces */

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-[1.75rem] border-[3px] border-ink bg-cream px-5 py-7 shadow-[6px_6px_0_#1F1A17] sm:px-8 sm:py-9">
      {children}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <motion.span
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: -2 }}
        transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.1 }}
        className="inline-block rounded-full border-2 border-ink bg-ink px-3.5 py-1.5 text-center text-[0.7rem] font-bold uppercase tracking-wide text-lemon sm:text-xs"
      >
        {children}
      </motion.span>
    </div>
  );
}

function Stamp() {
  const ring = C.yes.stampRing.toUpperCase();
  return (
    <motion.div
      aria-hidden
      initial={{ scale: 3, opacity: 0, rotate: -40 }}
      animate={{ scale: 1, opacity: 1, rotate: -14 }}
      transition={{ delay: 1, type: "spring", stiffness: 300, damping: 12 }}
      className="absolute -right-2 -top-6 z-10 size-[5.5rem] sm:-right-6 sm:-top-8 sm:size-28"
    >
      <svg viewBox="0 0 120 120" className="size-full text-chili">
        <defs>
          <path id="stamp-ring" d="M60 60 m-45 0 a45 45 0 1 1 90 0 a45 45 0 1 1 -90 0" />
        </defs>
        <circle cx="60" cy="60" r="57" fill="#FFF8EC" stroke="currentColor" strokeWidth="4" />
        <circle cx="60" cy="60" r="34" fill="none" stroke="currentColor" strokeWidth="2" />
        <text fill="currentColor" fontSize="9.5" fontWeight="700" textLength="278" lengthAdjust="spacing" fontFamily="var(--font-poppins), sans-serif">
          <textPath href="#stamp-ring">{ring}</textPath>
        </text>
        <text x="60" y="67" textAnchor="middle" fill="currentColor" fontSize="20" fontWeight="800" fontFamily="var(--font-baloo), sans-serif">
          {C.yes.stamp.toUpperCase()}
        </text>
      </svg>
    </motion.div>
  );
}
