"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

/**
 * `useSyncExternalStore` with a never-firing subscription is the cheapest
 * "am I past hydration?" flag: React uses `getServerSnapshot` for the SSR and
 * hydration passes, then re-renders once with the client snapshot. No
 * `setState` inside an effect, and no attribute mismatch during hydration.
 */
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * The theme control is typographic, not iconographic: two words and a slash.
 * The active mode is inked, the other is dropped back to `ink-3`.
 *
 * The active/inactive colouring is done with the `dark:` variant rather than
 * with React state, because `next-themes` writes the `.dark` class on <html>
 * from a blocking inline script — so CSS already knows the answer before the
 * first paint. That means zero hydration mismatch and, more importantly, zero
 * layout shift: both words are always rendered at the same size.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const hydrated = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const isDark = hydrated && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={
        hydrated
          ? isDark
            ? "Switch to the light theme"
            : "Switch to the dark theme"
          : "Switch colour theme"
      }
      className={cn(
        "t-meta inline-flex shrink-0 items-center gap-1 py-1 text-[0.625rem] tracking-[0.1em] md:gap-1.5 md:text-[0.6875rem] md:tracking-[0.16em]",
        className,
      )}
    >
      <span className="text-ink transition-colors duration-200 dark:text-ink-3">
        Paper
      </span>
      <span aria-hidden="true" className="text-ink-3">
        /
      </span>
      <span className="text-ink-3 transition-colors duration-200 dark:text-ink">
        Press
      </span>
    </button>
  );
}
