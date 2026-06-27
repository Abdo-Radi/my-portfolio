import type { Metadata } from "next";
import { Mail } from "lucide-react";

import { siteConfig } from "@/data/site";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
      <header className="mb-10 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Get in touch
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Have a project in mind, a role to fill, or just want to say hi? My
          inbox is always open.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4 text-muted-foreground">
          <p>
            Fill out the form and I&apos;ll get back to you as soon as I can.
            Prefer email? Reach me directly:
          </p>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex items-center gap-2 font-medium text-foreground hover:underline"
          >
            <Mail className="size-4" />
            {siteConfig.email}
          </a>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
