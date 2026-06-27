import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-6xl font-bold text-muted-foreground">404</p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Button asChild>
        <Link href="/">Back home</Link>
      </Button>
    </div>
  );
}
