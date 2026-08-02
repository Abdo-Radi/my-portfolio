"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Toasts in the PRESSWORK register: a square ink slab with a hairline and a
 * mono label. Sonner's own rules are all written with `:where()` (zero
 * specificity), so plain utilities override them without `!important`.
 *
 * `bg-ink` / `text-paper` inverts with the theme automatically, so the toast is
 * always the opposite of the page it sits on.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "flex w-full items-start gap-3 border border-rule-strong bg-ink p-4 text-paper shadow-none",
          content: "flex flex-col gap-1",
          title:
            "font-mono text-[0.6875rem] font-medium tracking-[0.14em] uppercase text-paper",
          description:
            "font-mono text-[0.6875rem] leading-[1.5] tracking-[0.06em] text-paper/70",
          // Errors carry a signal flag instead of a decorative glyph.
          error: "border-l-[3px] border-l-signal",
          actionButton:
            "border border-paper/40 bg-transparent px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] uppercase text-paper",
          cancelButton:
            "border border-paper/20 bg-transparent px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] uppercase text-paper/70",
          closeButton:
            "border border-rule-strong bg-ink text-paper hover:bg-ink hover:text-paper",
          // Decorative status icons are banned; the label carries the meaning.
          icon: "hidden",
        },
      }}
      style={
        {
          "--normal-bg": "var(--ink)",
          "--normal-text": "var(--paper)",
          "--normal-border": "var(--rule-strong)",
          "--border-radius": "0px",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
