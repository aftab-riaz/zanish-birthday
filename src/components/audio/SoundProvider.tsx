"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { birthdayConfig } from "@/config/birthday";
import { SoundEngine, type SfxName } from "@/lib/sound-engine";

type SoundContextValue = {
  soundOn: boolean;
  toggleSound: () => void;
  play: (name: SfxName, variant?: number) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState(false);
  const engineRef = useRef<SoundEngine | null>(null);
  const soundOnRef = useRef(false);

  const getEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = new SoundEngine(birthdayConfig.music.src, birthdayConfig.music.volume);
    }
    return engineRef.current;
  }, []);

  const setOn = useCallback(
    (next: boolean) => {
      const engine = getEngine();
      if (next) {
        const ok = engine.startMusic();
        if (!ok) return;
      } else {
        engine.stopMusic();
      }
      soundOnRef.current = next;
      setSoundOn(next);
    },
    [getEngine],
  );

  const toggleSound = useCallback(() => setOn(!soundOnRef.current), [setOn]);

  const play = useCallback(
    (name: SfxName, variant?: number) => {
      if (!soundOnRef.current) return;
      engineRef.current?.playSfx(name, variant);
    },
    [],
  );

  // Optional "on by default": still waits for the first real tap, as browsers require.
  useEffect(() => {
    if (!birthdayConfig.musicEnabledByDefault) return;
    const onFirstTap = () => {
      if (!soundOnRef.current) setOn(true);
    };
    window.addEventListener("pointerdown", onFirstTap, { once: true });
    return () => window.removeEventListener("pointerdown", onFirstTap);
  }, [setOn]);

  // Pause when the tab is hidden so music never plays in the background.
  useEffect(() => {
    const onVisibility = () => {
      const engine = engineRef.current;
      if (!engine || !soundOnRef.current) return;
      if (document.hidden) engine.stopMusic();
      else engine.startMusic();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => () => engineRef.current?.dispose(), []);

  const value = useMemo(() => ({ soundOn, toggleSound, play }), [soundOn, toggleSound, play]);

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside <SoundProvider>");
  return ctx;
}
