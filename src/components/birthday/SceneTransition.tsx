"use client";

import { motion } from "motion/react";
import { useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  label: string;
  /** Focus the scene heading after entering (skip on first load). */
  manageFocus: boolean;
};

/** Full-screen, independently scrollable scene with a soft cinematic cross-fade. */
export function SceneTransition({ children, label, manageFocus }: Props) {
  const ref = useRef<HTMLElement>(null);

  return (
    <motion.section
      ref={ref}
      aria-label={label}
      className="scene-scroll absolute inset-0 z-10 overflow-x-hidden overflow-y-auto"
      initial={{ opacity: 0, scale: 1.03, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.985, y: -10 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={(def) => {
        if (!manageFocus || def === "exit" || !ref.current) return;
        const heading = ref.current.querySelector<HTMLElement>("h1");
        if (heading && !ref.current.contains(document.activeElement)) {
          heading.tabIndex = -1;
          heading.focus({ preventScroll: true });
        }
      }}
    >
      {children}
    </motion.section>
  );
}
