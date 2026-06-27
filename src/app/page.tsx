import Link from "next/link";
import { ArrowRight, Download, Mail } from "lucide-react";

import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/button";
import { TypingText } from "@/components/TypingText";

const roles = [
  siteConfig.role,
  "DevOps Engineer",
  "TypeScript Enthusiast",
  "Problem Solver",
];

export default function Home() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center px-4 py-20">
      <p className="mb-4 animate-fade-in font-mono text-sm text-muted-foreground">
        Hi, my name is
      </p>

      <h1 className="animate-fade-in text-4xl font-bold tracking-tight sm:text-6xl">
        {siteConfig.name}
      </h1>

      <h2 className="mt-3 flex flex-wrap items-center gap-x-2 text-2xl font-bold tracking-tight text-muted-foreground sm:text-4xl">
        <span>I&apos;m a</span>
        <TypingText words={roles} className="text-foreground" />
      </h2>

      <p className="mt-6 max-w-xl text-lg text-muted-foreground">
        {siteConfig.tagline}
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link href="/projects">
            View my work
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <a href={siteConfig.resumeUrl} download>
            <Download className="size-4" />
            Resume
          </a>
        </Button>
        <Button asChild size="lg" variant="ghost">
          <Link href="/contact">
            <Mail className="size-4" />
            Get in touch
          </Link>
        </Button>
      </div>
    </section>
  );
}
