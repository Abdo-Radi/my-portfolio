import * as React from "react";

import { cn } from "@/lib/utils";

/** The multi-line counterpart to `Input`: same hairline rule, no box. */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-36 w-full resize-none border-0 border-b border-rule bg-transparent px-0 py-3 text-base leading-[1.6] text-ink transition-colors duration-200 selection:bg-signal selection:text-signal-ink placeholder:text-ink-3 disabled:pointer-events-none disabled:opacity-40 md:text-[0.9375rem]",
        "focus:border-b-ink",
        "aria-invalid:border-b-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
