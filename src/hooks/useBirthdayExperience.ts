"use client";

import { useCallback, useEffect, useReducer } from "react";
import { SCENE_ORDER, type SceneId } from "@/config/birthday";

type State = {
  index: number;
  /** True while a scene transition is in flight — ignores repeat taps. */
  locked: boolean;
  /** Incremented on replay so every scene remounts with fresh state. */
  run: number;
};

type Action = { type: "advance" } | { type: "unlock" } | { type: "restart" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "advance":
      if (state.locked || state.index >= SCENE_ORDER.length - 1) return state;
      return { ...state, index: state.index + 1, locked: true };
    case "restart":
      if (state.locked) return state;
      return { index: 0, locked: true, run: state.run + 1 };
    case "unlock":
      return state.locked ? { ...state, locked: false } : state;
  }
}

const SAFETY_UNLOCK_MS = 2600;

export function useBirthdayExperience() {
  const [state, dispatch] = useReducer(reducer, { index: 0, locked: false, run: 0 });

  const advance = useCallback(() => dispatch({ type: "advance" }), []);
  const restart = useCallback(() => dispatch({ type: "restart" }), []);
  const unlock = useCallback(() => dispatch({ type: "unlock" }), []);

  // Transitions normally unlock when the exit animation finishes; this is a
  // safety net so a missed callback can never leave the story stuck.
  useEffect(() => {
    if (!state.locked) return;
    const id = window.setTimeout(unlock, SAFETY_UNLOCK_MS);
    return () => window.clearTimeout(id);
  }, [state.locked, state.index, state.run, unlock]);

  const scene: SceneId = SCENE_ORDER[state.index];

  return {
    scene,
    index: state.index,
    total: SCENE_ORDER.length,
    run: state.run,
    locked: state.locked,
    advance,
    restart,
    unlock,
  };
}
