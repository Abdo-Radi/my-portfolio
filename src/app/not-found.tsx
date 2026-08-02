import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[80svh] flex-col justify-center pt-[clamp(7.5rem,17vh,11rem)] pb-[clamp(4rem,9vw,7rem)]">
      <div className="grid-12 items-end gap-y-[clamp(2.5rem,5vw,4rem)]">
        <div className="col-span-4 md:col-span-6">
          <p className="t-folio">(404) NOT FOUND</p>
          <h1 className="t-display mt-[clamp(1.25rem,3vw,2.25rem)] optical-left">
            404
          </h1>
        </div>

        <div className="col-span-4 md:col-span-5 md:col-start-8 md:pb-2">
          <p className="t-meta">Page not found</p>
          <p className="t-body mt-4">
            Nothing is served at this address. It was either renamed or it never
            shipped.
          </p>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link href="/">
              Back to index
              <span aria-hidden="true">→</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
