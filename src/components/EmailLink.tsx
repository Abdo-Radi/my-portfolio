"use client";

import * as React from "react";
import { toast } from "sonner";

import { siteConfig } from "@/data/site";

type EmailLinkProps = Omit<React.ComponentProps<"a">, "href">;

/**
 * The email address as a real `mailto:` anchor that also copies itself.
 *
 * `mailto:` alone is a dead end for anyone without a registered mail handler —
 * a large share of visitors, since Windows 11 ships no Mail app and webmail
 * users never register one. The click silently does nothing, and a portfolio
 * quietly loses the contact.
 *
 * So the default navigation is left intact (people who *do* have a mail client
 * get it, and middle-click / "copy link address" still behave), and the address
 * is written to the clipboard on the way past with a toast to confirm. Either
 * way the visitor leaves with the address.
 */
export function EmailLink({ children, onClick, ...props }: EmailLinkProps) {
  async function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      toast.success("Email address copied to clipboard");
    } catch {
      // Clipboard blocked (insecure origin or denied permission). The mailto:
      // navigation is unaffected, so there is nothing to recover from.
    }
  }

  return (
    <a href={`mailto:${siteConfig.email}`} onClick={handleClick} {...props}>
      {children ?? siteConfig.email}
    </a>
  );
}
