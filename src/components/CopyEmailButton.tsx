"use client";

import * as React from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

/**
 * Copies `value` and swaps its own label to "COPIED" for two seconds. The label
 * is its own polite live region, so the change is announced without moving
 * focus.
 *
 * `navigator.clipboard` is undefined outside a secure context and `writeText`
 * can reject when permission is denied — both land in the same catch, so the
 * promise is never left unhandled.
 */
export function CopyEmailButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable.");
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Clipboard unavailable — select the address to copy it.");
    }
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className={cn(
        "t-meta shrink-0 border border-rule px-2.5 py-1.5 text-ink-2 transition-colors duration-200 hover:border-ink hover:text-ink",
        className,
      )}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      <span className="sr-only"> email address</span>
    </button>
  );
}
