"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** SSR-safe "is the page scrolled past `threshold`px?" subscription. */
function useScrolled(threshold = 8) {
  return React.useSyncExternalStore(
    (onChange) => {
      window.addEventListener("scroll", onChange, { passive: true });
      return () => window.removeEventListener("scroll", onChange);
    },
    () => window.scrollY > threshold,
    () => false,
  );
}

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [open, setOpen] = React.useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-mono text-lg font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          {siteConfig.name.split(" ")[0]}
          <span className="text-muted-foreground">.dev</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  isActive(pathname, link.href)
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t bg-background/95 backdrop-blur md:hidden">
          <ul className="mx-auto flex max-w-5xl flex-col gap-1 px-4 py-3">
            {links.map((link) => (
              <li key={link.href}>
                <Button
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start",
                    isActive(pathname, link.href)
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  <Link href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
