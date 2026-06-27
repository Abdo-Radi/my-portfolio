"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

/**
 * Dark/light toggle. `next-themes` persists the selection to
 * `localStorage` (key: "theme") and re-applies it on load, so the choice
 * survives reloads and navigation. The icon is chosen purely with a CSS dark
 * variant to avoid a hydration flash and any setState-in-effect.
 */
export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggle = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <Sun className="hidden size-5 dark:block" />
      <Moon className="size-5 dark:hidden" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
