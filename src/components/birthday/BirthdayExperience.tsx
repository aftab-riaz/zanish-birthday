"use client";

import { AnimatePresence, MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { birthdayConfig } from "@/config/birthday";
import { useBirthdayExperience } from "@/hooks/useBirthdayExperience";
import { SoundProvider } from "@/components/audio/SoundProvider";
import { CursorSparkles } from "@/components/effects/CursorSparkles";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { MusicToggle } from "@/components/ui/MusicToggle";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { SkyBackdrop } from "./SkyBackdrop";
import { SceneTransition } from "./SceneTransition";
import { GiftScene } from "./GiftScene";
import { BirthdayCakeScene } from "./BirthdayCakeScene";
import { FriendshipGardenScene } from "./FriendshipGardenScene";
import { LetterScene } from "./LetterScene";
import { FinaleScene } from "./FinaleScene";

const MIN_LOADING_MS = 900;
const MAX_FONT_WAIT_MS = 2200;

export function BirthdayExperience() {
  const { scene, index, run, advance, restart, unlock } = useBirthdayExperience();
  const [ready, setReady] = useState(false);
  const tone = scene === "finale" ? "dark" : "light";

  // Short, honest loading moment: wait for fonts (capped) so headings don't jump.
  useEffect(() => {
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.all([wait(MIN_LOADING_MS), Promise.race([fonts, wait(MAX_FONT_WAIT_MS)])]).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const content = (() => {
    switch (scene) {
      case "gift":
        return <GiftScene onNext={advance} />;
      case "cake":
        return <BirthdayCakeScene onNext={advance} />;
      case "garden":
        return <FriendshipGardenScene onNext={advance} />;
      case "letter":
        return <LetterScene onNext={advance} />;
      case "finale":
        return <FinaleScene onReplay={restart} />;
    }
  })();

  return (
    <MotionConfig reducedMotion="user">
      <SoundProvider>
        <main className="app-shell relative w-full overflow-hidden">
          <SkyBackdrop scene={scene} />

          {/* soft fade so the header never sits on top of scrolled letter text */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-x-0 top-0 z-20 h-[calc(var(--safe-top)+4.5rem)] bg-gradient-to-b from-[#FBF2E8] via-[#FBF2E8]/90 to-transparent transition-opacity duration-700 ${
              scene === "letter" ? "opacity-100" : "opacity-0"
            }`}
          />

          <header
            className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-4 sm:px-6"
            style={{ paddingTop: "calc(var(--safe-top) + 0.75rem)" }}
          >
            <span className="w-11" aria-hidden />
            <div
              className={`pointer-events-auto transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
            >
              <ProgressIndicator index={index} tone={tone} />
            </div>
            <div className="pointer-events-auto">
              <MusicToggle tone={tone} />
            </div>
          </header>

          <AnimatePresence mode="wait" onExitComplete={unlock}>
            {ready && (
              <SceneTransition
                key={`${run}-${scene}`}
                label={birthdayConfig.progressLabels[scene]}
                manageFocus={index > 0 || run > 0}
              >
                {content}
              </SceneTransition>
            )}
          </AnimatePresence>

          <AnimatePresence>{!ready && <LoadingScreen key="loading" />}</AnimatePresence>
        </main>
        <CursorSparkles />
      </SoundProvider>
    </MotionConfig>
  );
}
