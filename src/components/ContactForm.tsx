"use client";

import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/** Shared wrapper: hairline above, folio'd label, ruled field. */
const FIELD = "group border-t border-rule pt-5";
const LABEL =
  "t-meta flex items-baseline gap-2.5 transition-colors duration-200 group-focus-within:text-signal";

export function ContactForm() {
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setPending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(body?.error ?? "Something went wrong.");
      }

      toast.success("Message sent! I'll get back to you soon.");
      form.reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full" noValidate>
      <div className={FIELD}>
        <label htmlFor="contact-name" className={LABEL}>
          <span className="tabular-nums opacity-55">01</span>
          <span>Name</span>
        </label>
        <Input
          id="contact-name"
          name="name"
          placeholder="Full name"
          autoComplete="name"
          required
          maxLength={100}
        />
      </div>

      <div className={FIELD}>
        <label htmlFor="contact-email" className={LABEL}>
          <span className="tabular-nums opacity-55">02</span>
          <span>Email</span>
        </label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@domain.com"
          autoComplete="email"
          required
          maxLength={200}
        />
      </div>

      <div className={FIELD}>
        <label htmlFor="contact-message" className={LABEL}>
          <span className="tabular-nums opacity-55">03</span>
          <span>Message</span>
        </label>
        <Textarea
          id="contact-message"
          name="message"
          placeholder="What are you building, and what have you already tried?"
          required
          rows={6}
          maxLength={5000}
        />
      </div>

      <Button
        type="submit"
        variant="solid"
        size="lg"
        disabled={pending}
        className="mt-8 w-full"
      >
        {pending ? (
          <>
            <span
              aria-hidden="true"
              className="size-3 animate-spin border border-current"
            />
            Sending
          </>
        ) : (
          <>
            Send message
            <span aria-hidden="true">→</span>
          </>
        )}
      </Button>
    </form>
  );
}
