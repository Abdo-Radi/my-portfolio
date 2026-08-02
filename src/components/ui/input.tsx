import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * PRESSWORK fields are ruled, not boxed: a single hairline under the text, no
 * fill, no rounding, no elevation. The rule inks up on focus; the associated
 * label is what carries the signal colour (see `ContactForm`).
 */
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-14 w-full min-w-0 border-0 border-b border-rule bg-transparent px-0 py-3 text-base text-ink transition-colors duration-200 selection:bg-signal selection:text-signal-ink placeholder:text-ink-3 disabled:pointer-events-none disabled:opacity-40 md:text-[0.9375rem]",
        "focus:border-b-ink",
        "aria-invalid:border-b-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
