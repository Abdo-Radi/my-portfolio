import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * PRESSWORK buttons: square, hairline-ruled, mono-labelled. No rounding, no
 * shadow, no gradient. State is expressed by ink inversion, not elevation.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2.5 font-mono text-[0.6875rem] font-medium tracking-[0.16em] whitespace-nowrap uppercase transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        /** Filled ink — the primary action. One per view. */
        solid: "bg-ink text-paper hover:bg-signal hover:text-signal-ink",
        /** Hairline box — the default. */
        outline:
          "border border-rule-strong text-ink hover:border-ink hover:bg-ink hover:text-paper",
        /** Bare label with a drawn underline. */
        ghost: "text-ink-2 hover:text-ink",
        /** Signal fill — reserved for the single live/primary CTA. */
        signal: "bg-signal text-signal-ink hover:bg-ink hover:text-paper",
        /** Destructive stays available for form/error states. */
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-11 px-5",
        lg: "h-14 px-7 text-xs",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "md",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
