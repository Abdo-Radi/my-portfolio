"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/** SSR-safe `prefers-reduced-motion` subscription (no setState-in-effect). */
function usePrefersReducedMotion() {
  return React.useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

type TypingTextProps = {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseMs?: number;
  className?: string;
};

/**
 * Typewriter that cycles through `words`: types a word, pauses, deletes it,
 * then moves to the next. Falls back to a static first word when the user
 * prefers reduced motion. All state transitions happen inside the timer
 * callback so no state is set synchronously during the effect.
 */
export function TypingText({
  words,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseMs = 1500,
  className,
}: TypingTextProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [deleting, setDeleting] = React.useState(false);

  React.useEffect(() => {
    if (reducedMotion || words.length === 0) return;
    const current = words[index % words.length] ?? "";

    let delay = deleting ? deletingSpeed : typingSpeed;
    if (!deleting && subIndex === current.length) delay = pauseMs;

    const timer = setTimeout(() => {
      if (!deleting && subIndex === current.length) {
        setDeleting(true);
      } else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      } else {
        setSubIndex((s) => s + (deleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [
    subIndex,
    deleting,
    index,
    reducedMotion,
    words,
    typingSpeed,
    deletingSpeed,
    pauseMs,
  ]);

  const active = words[index % words.length] ?? "";
  const text = reducedMotion ? (words[0] ?? "") : active.slice(0, subIndex);

  return (
    <span
      className={cn("inline-flex items-center", className)}
      aria-label={words.join(", ")}
    >
      <span aria-hidden>{text}</span>
      <span
        aria-hidden
        className={cn(
          "ml-1 inline-block h-[1em] w-0.5 translate-y-[0.1em] bg-current",
          !reducedMotion && "animate-caret",
        )}
      />
    </span>
  );
}
