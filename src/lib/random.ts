/**
 * Deterministic pseudo-random generator. Particle layouts are generated from a
 * fixed seed so the server render and the client hydration always match.
 */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Round to 2 decimals so serialized inline styles stay identical. */
export const r2 = (n: number) => Math.round(n * 100) / 100;

export function range(rand: () => number, min: number, max: number) {
  return r2(min + rand() * (max - min));
}
