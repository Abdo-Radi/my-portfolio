"use client";

import * as React from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="name" placeholder="Your name" required maxLength={100} />
        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          maxLength={200}
        />
      </div>
      <Textarea
        name="message"
        placeholder="Your message..."
        required
        rows={6}
        maxLength={5000}
      />
      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="size-4" />
            Send message
          </>
        )}
      </Button>
    </form>
  );
}
