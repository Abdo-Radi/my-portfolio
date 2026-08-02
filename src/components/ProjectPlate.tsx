import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Project } from "@/data/projects";

/**
 * Cover art for a project.
 *
 * When a project has a real screenshot (`project.image`) it is rendered as-is.
 * Otherwise the plate is set typographically: a hairline press grid, the slug,
 * the initials at display size, and a folio. Because it's built from tokens it
 * inverts correctly with the theme — a raster or gradient asset never would.
 *
 * One of three deterministic layouts is chosen from the slug so an index of
 * plates reads as a set rather than a repeat. Deterministic, so SSR and client
 * always agree.
 */
export function ProjectPlate({
  project,
  index,
  className,
}: {
  project: Project;
  index?: number;
  className?: string;
}) {
  const initials = initialsOf(project.title);
  const variant = hash(project.slug) % 3;
  const folio = String((index ?? hash(project.slug)) + 1).padStart(2, "0");

  if (project.image) {
    return (
      <div className={cn("relative overflow-hidden bg-paper-2", className)}>
        <Image
          src={project.image}
          alt=""
          fill
          sizes="(min-width: 768px) 45vw, 90vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ containerType: "inline-size" }}
      className={cn(
        "relative flex size-full flex-col justify-between overflow-hidden bg-paper-2 p-4 select-none sm:p-6",
        className,
      )}
    >
      {/* Press grid — structural, not decorative noise. */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--rule) 1px, transparent 1px), linear-gradient(to bottom, var(--rule) 1px, transparent 1px)",
          backgroundSize: "clamp(2rem, 6%, 4rem) clamp(2rem, 6%, 4rem)",
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <span className="t-meta">{project.slug}</span>
        <span className="t-meta">{folio}</span>
      </div>

      <div
        className={cn(
          "relative flex",
          variant === 0 && "items-center justify-center",
          variant === 1 && "items-end justify-start",
          variant === 2 && "items-center justify-end",
        )}
      >
        <span
          className={cn(
            // Sized against the plate's own width via a container query — a
            // percentage font-size would resolve against the parent's font
            // size instead and pin every plate at the clamp floor.
            "font-sans text-[clamp(2.75rem,24cqw,8rem)] leading-[0.78] font-extrabold tracking-[-0.05em] text-ink",
            variant === 2 && "text-ink-3",
          )}
        >
          {initials}
        </span>
      </div>

      <div className="relative flex items-end justify-between gap-4">
        <span className="t-meta max-w-[70%] truncate">
          {project.tags.slice(0, 2).join(" · ")}
        </span>
        <span
          className="h-px w-10 shrink-0 bg-rule-strong"
          style={{ marginBottom: "0.4em" }}
        />
      </div>
    </div>
  );
}

/** "DevOps Portfolio" → "DP"; single-word titles take their first two letters. */
export function initialsOf(title: string): string {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  if (words.length === 1) return (words[0] ?? "").slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase();
}

/** Small stable string hash — used only to vary plate layout per slug. */
function hash(value: string): number {
  let total = 0;
  for (let i = 0; i < value.length; i += 1) {
    total = (total * 31 + value.charCodeAt(i)) >>> 0;
  }
  return total;
}
