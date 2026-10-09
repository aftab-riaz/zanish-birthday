import type { CSSProperties } from "react";

function Cloud({ uid, className = "", style, tint = "#FFFFFF" }: { uid: string; className?: string; style?: CSSProperties; tint?: string }) {
  return (
    <svg viewBox="0 0 320 120" className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={`cloud-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tint} stopOpacity="0.95" />
          <stop offset="100%" stopColor={tint} stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path
        d="M30 100C8 100 2 78 18 68C12 46 40 34 58 46C64 20 102 10 122 32C136 8 184 6 196 36C214 20 250 26 252 52C280 44 306 64 294 86C304 96 296 104 282 104Z"
        fill={`url(#cloud-${uid})`}
      />
    </svg>
  );
}

/** Soft drifting clouds for the daytime scenes. */
export function Clouds({ tint = "#FFFFFF" }: { tint?: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Cloud
        uid="a"
        tint={tint}
        className="anim-cloud absolute -left-16 top-[14%] w-[62vw] max-w-[420px] opacity-70"
        style={{ "--dur": "42s" } as CSSProperties}
      />
      <Cloud
        uid="b"
        tint={tint}
        className="anim-cloud absolute -right-20 top-[38%] w-[50vw] max-w-[360px] opacity-50"
        style={{ "--dur": "36s", "--delay": "-12s" } as CSSProperties}
      />
      <Cloud
        uid="c"
        tint={tint}
        className="anim-cloud absolute -bottom-6 -left-10 w-[80vw] max-w-[560px] opacity-80"
        style={{ "--dur": "48s", "--delay": "-20s" } as CSSProperties}
      />
      <Cloud
        uid="d"
        tint={tint}
        className="anim-cloud absolute -bottom-10 -right-16 w-[70vw] max-w-[520px] opacity-70"
        style={{ "--dur": "40s", "--delay": "-6s" } as CSSProperties}
      />
    </div>
  );
}
