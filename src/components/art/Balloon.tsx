import type { CSSProperties } from "react";

type Props = {
  color: string;
  shade: string;
  className?: string;
  style?: CSSProperties;
  id: string;
};

/** Glossy illustrated balloon with a ribbon string. */
export function Balloon({ color, shade, className = "", style, id }: Props) {
  return (
    <svg viewBox="0 0 80 200" className={className} style={style} aria-hidden>
      <defs>
        <radialGradient id={`bl-${id}`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="22%" stopColor={color} />
          <stop offset="100%" stopColor={shade} />
        </radialGradient>
      </defs>
      <path d="M40 98C36 120 46 136 38 156C32 172 44 184 40 200" stroke="#B48A9C" strokeWidth="1.2" fill="none" opacity="0.7" />
      <path d="M40 4C62 4 76 22 76 46C76 72 58 92 40 96C22 92 4 72 4 46C4 22 18 4 40 4Z" fill={`url(#bl-${id})`} />
      <path d="M35 95L45 95L42 101L38 101Z" fill={shade} />
      <ellipse cx="26" cy="28" rx="6" ry="11" fill="#FFFFFF" opacity="0.45" transform="rotate(-24 26 28)" />
    </svg>
  );
}
