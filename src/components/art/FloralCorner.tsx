/** Delicate botanical corner ornament for stationery. */
export function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <path d="M6 114C10 70 34 34 112 8" stroke="#C9A263" strokeWidth="1.1" fill="none" opacity="0.8" />
      <path d="M8 96C16 66 40 40 84 22" stroke="#C9A263" strokeWidth="0.7" fill="none" opacity="0.5" />
      {[
        [24, 70, -40],
        [38, 50, -30],
        [56, 34, -20],
        [76, 22, -12],
      ].map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 0C6 -10 16 -12 22 -8C16 -2 8 2 0 0Z" fill="#B9CDB4" opacity="0.85" />
          <path d="M0 0C-4 -10 -2 -20 4 -24C8 -16 6 -6 0 0Z" fill="#CFDDC9" opacity="0.8" />
        </g>
      ))}
      <g transform="translate(18 92)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-7" rx="5" ry="7.5" fill="#F0B9CC" transform={`rotate(${a})`} />
        ))}
        <circle r="3.6" fill="#D8B77C" />
      </g>
      <g transform="translate(46 62) scale(0.7)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-7" rx="5" ry="7.5" fill="#DCCBF4" transform={`rotate(${a})`} />
        ))}
        <circle r="3.4" fill="#F0DFBA" />
      </g>
      <g transform="translate(92 16) scale(0.55)">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="0" cy="-7" rx="5" ry="7.5" fill="#F6D5E1" transform={`rotate(${a})`} />
        ))}
        <circle r="3.4" fill="#D8B77C" />
      </g>
      {[
        [64, 46],
        [30, 82],
        [100, 30],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="#D8B77C" opacity="0.7" />
      ))}
    </svg>
  );
}
