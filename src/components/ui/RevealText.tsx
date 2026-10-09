"use client";

import { motion } from "motion/react";
import { Fragment, type ElementType } from "react";

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /** "chars" for headline letter cascades, "words" for longer lines. */
  by?: "chars" | "words";
  delay?: number;
  stagger?: number;
  id?: string;
  tabIndex?: number;
};

/**
 * Staggered reveal that stays accessible: screen readers get the plain text,
 * the animated pieces are aria-hidden. Words never break mid-word.
 */
export function RevealText({
  text,
  as: Tag = "p",
  className = "",
  by = "words",
  delay = 0,
  stagger,
  id,
  tabIndex,
}: Props) {
  const words = text.split(" ");
  const step = stagger ?? (by === "chars" ? 0.028 : 0.06);
  let i = 0;

  return (
    <Tag className={className} id={id} tabIndex={tabIndex}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <Fragment key={w}>
          <span className="inline-block whitespace-nowrap">
            {by === "chars" ? (
              Array.from(word).map((ch, c) => {
                const d = delay + i++ * step;
                return (
                  <motion.span
                    key={c}
                    className="inline-block"
                    initial={{ opacity: 0, y: "0.45em", rotate: 6 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {ch}
                  </motion.span>
                );
              })
            ) : (
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, y: "0.5em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: delay + i++ * step, ease: [0.22, 1, 0.36, 1] }}
              >
                {word}
              </motion.span>
            )}
          </span>
          {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
