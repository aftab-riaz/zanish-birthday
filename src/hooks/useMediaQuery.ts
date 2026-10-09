"use client";

import { useCallback, useSyncExternalStore } from "react";

/** SSR-safe media query subscription (returns `serverValue` during SSR/hydration). */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");
