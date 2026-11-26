import { range, seeded } from "@/lib/random";

const EMOJIS = ["🍗", "🔥", "🍋", "🥤", "😋", "🫓", "🤤", "🍗"];
const rand = seeded(786);
const ITEMS = Array.from({ length: 16 }, (_, i) => ({
  emoji: EMOJIS[i % EMOJIS.length],
  left: range(rand, 2, 94),
  size: range(rand, 1.1, 2),
  dur: range(rand, 14, 24),
  delay: range(rand, -24, 0),
  drift: range(rand, -50, 50),
  spin: range(rand, -120, 120),
}));

/** Food emojis drifting up the background. Seeded, so SSR and hydration match. */
export function FloatingEmojis() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {ITEMS.map((e, i) => (
        <span
          key={i}
          className="anim-rise absolute -bottom-12 select-none"
          style={
            {
              left: `${e.left}%`,
              fontSize: `${e.size}rem`,
              "--dur": `${e.dur}s`,
              "--delay": `${e.delay}s`,
              "--drift": `${e.drift}px`,
              "--spin": `${e.spin}deg`,
              "--alpha": 0.5,
            } as React.CSSProperties
          }
        >
          {e.emoji}
        </span>
      ))}
    </div>
  );
}
