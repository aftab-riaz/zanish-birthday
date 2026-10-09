import { useMemo, type CSSProperties } from "react";
import { range, seeded } from "@/lib/random";

export type ParticleVariant = "stardust" | "petals" | "embers";

type Props = {
  variant: ParticleVariant;
  count?: number;
  seed?: number;
  className?: string;
};

const PETAL_COLORS = ["#F3B8CD", "#E9A6BF", "#F8DDE8", "#E4D2F6", "#F6CFDC"];
const DUST_COLORS = ["#FFFFFF", "#F0DFBA", "#FBE3EC", "#EDE3FB"];

/**
 * Lightweight CSS-only ambient particles (transform + opacity loops).
 * Layout is seeded, so it is identical on server and client.
 */
export function FloatingParticles({ variant, count = 22, seed = 7, className = "" }: Props) {
  const particles = useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: count }, (_, i) => {
      const falling = variant === "petals";
      return {
        id: i,
        left: range(rand, 0, 100),
        top: falling ? range(rand, -12, -4) : range(rand, 70, 112),
        size: variant === "petals" ? range(rand, 9, 17) : range(rand, 3, 9),
        dur: variant === "petals" ? range(rand, 13, 24) : range(rand, 11, 22),
        delay: range(rand, -24, 0),
        drift: range(rand, -60, 60),
        spin: range(rand, 120, 420),
        alpha: range(rand, 0.45, 0.95),
        color: (falling ? PETAL_COLORS : DUST_COLORS)[i % (falling ? 5 : 4)],
        star: rand() > 0.55,
      };
    });
  }, [variant, count, seed]);

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((p) => {
        const style = {
          left: `${p.left}%`,
          top: `${p.top}%`,
          width: p.size,
          height: p.size,
          "--dur": `${p.dur}s`,
          "--delay": `${p.delay}s`,
          "--drift": `${p.drift}px`,
          "--spin": `${p.spin}deg`,
          "--alpha": p.alpha,
        } as CSSProperties;

        if (variant === "petals") {
          return (
            <span key={p.id} className="anim-fall absolute will-change-transform" style={style}>
              <svg viewBox="0 0 20 20" className="h-full w-full">
                <path
                  d="M10 1C14 5 16 10 10 19C4 10 6 5 10 1Z"
                  fill={p.color}
                  opacity={0.9}
                />
                <path d="M10 3V16" stroke="#fff" strokeOpacity={0.45} strokeWidth={0.8} />
              </svg>
            </span>
          );
        }

        return (
          <span key={p.id} className="anim-rise absolute will-change-transform" style={style}>
            {p.star ? (
              <svg viewBox="0 0 20 20" className="h-full w-full scale-150">
                <path
                  d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z"
                  fill={variant === "embers" ? "#F0DFBA" : p.color}
                />
              </svg>
            ) : (
              <span
                className="block h-full w-full rounded-full"
                style={{
                  background: `radial-gradient(circle, ${p.color} 0%, ${p.color}00 70%)`,
                }}
              />
            )}
          </span>
        );
      })}
    </div>
  );
}
