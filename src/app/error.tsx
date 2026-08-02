"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

/**
 * Error boundaries must be Client Components (Next.js requirement).
 *
 * Next 16.2 replaced `reset()` with `unstable_retry()` — the latter re-fetches
 * *and* re-renders the segment, where `reset()` only clears the boundary. Both
 * are accepted here so the page works on either, preferring the retry.
 */
export default function Error({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="shell flex min-h-[80svh] flex-col justify-center pt-[clamp(7.5rem,17vh,11rem)] pb-[clamp(4rem,9vw,7rem)]">
      <p className="t-folio">(500) RUNTIME ERROR</p>

      <h1 className="t-display mt-[clamp(1.25rem,3vw,2.25rem)] optical-left">
        Something
        <br />
        broke
      </h1>

      <div className="grid-12 mt-[clamp(2.5rem,5vw,4rem)] items-start gap-y-8 border-t border-rule pt-8">
        <div className="col-span-4 md:col-span-5">
          <p className="t-body">
            This section failed to render. Trying again re-runs it; if it keeps
            failing, the fault is on my side.
          </p>
          {error.digest ? (
            <p className="t-meta mt-5">Digest {error.digest}</p>
          ) : null}
        </div>

        <div className="col-span-4 flex flex-wrap gap-3 md:col-span-4 md:col-start-9">
          <Button
            variant="solid"
            size="lg"
            onClick={() => retry?.()}
            disabled={!retry}
          >
            Try again
            <span aria-hidden="true">→</span>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to index</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
