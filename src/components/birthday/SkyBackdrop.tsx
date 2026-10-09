"use client";

import { AnimatePresence, motion } from "motion/react";
import type { SceneId } from "@/config/birthday";
import { Clouds } from "@/components/art/Clouds";
import { FloatingParticles } from "@/components/effects/FloatingParticles";

const SKIES: Record<SceneId, string> = {
  gift: [
    "radial-gradient(120% 70% at 50% 0%, #F4E9FC 0%, rgba(244,233,252,0) 60%)",
    "radial-gradient(80% 50% at 0% 100%, #F8D4E3 0%, rgba(248,212,227,0) 70%)",
    "radial-gradient(70% 50% at 100% 75%, #E3D6F7 0%, rgba(227,214,247,0) 70%)",
    "linear-gradient(180deg, #ECE1F8 0%, #F6DDEA 55%, #FCEFF0 100%)",
  ].join(","),
  cake: [
    "radial-gradient(60% 40% at 50% 62%, #FFF1DC 0%, rgba(255,241,220,0) 70%)",
    "radial-gradient(90% 60% at 50% 0%, #F7D3E2 0%, rgba(247,211,226,0) 70%)",
    "linear-gradient(180deg, #F6D9E7 0%, #FBE8EE 50%, #FFF5EE 100%)",
  ].join(","),
  garden: [
    "radial-gradient(80% 45% at 20% 10%, #FFF4E4 0%, rgba(255,244,228,0) 70%)",
    "linear-gradient(180deg, #E4DBF6 0%, #F1E2F2 42%, #F8E3EA 68%, #F3EADB 100%)",
  ].join(","),
  letter: [
    "radial-gradient(90% 60% at 50% 35%, #FFFDF8 0%, rgba(255,253,248,0) 70%)",
    "linear-gradient(180deg, #FBF2E8 0%, #F7E9E2 100%)",
  ].join(","),
  finale: [
    "radial-gradient(60% 40% at 80% 12%, rgba(240,223,186,0.16) 0%, rgba(240,223,186,0) 60%)",
    "radial-gradient(120% 60% at 50% 115%, #7B4F80 0%, rgba(123,79,128,0) 65%)",
    "linear-gradient(180deg, #120C1E 0%, #22162F 40%, #3A2742 75%, #49344E 100%)",
  ].join(","),
};

const SCENES = Object.keys(SKIES) as SceneId[];

/** Cross-fading sky layers (opacity only) plus per-scene ambient life. */
export function SkyBackdrop({ scene }: { scene: SceneId }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {SCENES.map((id) => (
        <div
          key={id}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{ background: SKIES[id], opacity: id === scene ? 1 : 0 }}
        />
      ))}

      <AnimatePresence>
        {(scene === "gift" || scene === "cake") && (
          <motion.div
            key="clouds"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <Clouds />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="popLayout">
        <motion.div
          key={scene}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        >
          {scene === "gift" && <FloatingParticles variant="stardust" count={22} seed={11} />}
          {scene === "cake" && <FloatingParticles variant="embers" count={16} seed={23} />}
          {scene === "garden" && <FloatingParticles variant="petals" count={14} seed={37} />}
          {scene === "letter" && <FloatingParticles variant="petals" count={7} seed={41} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
