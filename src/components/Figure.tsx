import Image from "next/image";

import { ParallaxPlate } from "@/components/anim";
import { cn } from "@/lib/utils";

type FigureProps = {
  src: string;
  /** Real description — these are photographs of a person, not decoration. */
  alt: string;
  /** Left of the caption line, e.g. "Fig. 01". */
  index: string;
  /** Right of the caption line. */
  caption: string;
  /** Responsive width hint for the image optimiser. */
  sizes: string;
  className?: string;
  priority?: boolean;
  /**
   * Restore colour while hovered. Used sparingly — once per page at most — so
   * it reads as a deliberate moment rather than a effect applied everywhere.
   */
  revealColor?: boolean;
};

/**
 * A photograph, set the way the rest of the page is set: a hard 3:4 frame with
 * a hairline rule, no rounding, no shadow, and a mono caption line beneath.
 *
 * Every photograph is desaturated by default. The palette is ink, paper and one
 * vermilion; dropping full-colour snapshots into it would break the system
 * instantly, and a monochrome set reads as a considered edit rather than a
 * camera roll. 3:4 matches the native ratio of the source files, so nothing is
 * cropped and nothing is upscaled.
 *
 * The image drifts against its frame on scroll via <ParallaxPlate> — safe here
 * because, unlike the typographic plates, a photograph has no content on its
 * trim for the overscale to clip.
 */
export function Figure({
  src,
  alt,
  index,
  caption,
  sizes,
  className,
  priority = false,
  revealColor = false,
}: FigureProps) {
  return (
    <figure className={cn("group w-full", className)}>
      <div className="relative aspect-[3/4] w-full overflow-hidden border border-rule bg-paper-2">
        <ParallaxPlate distance={10} className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className={cn(
              "object-cover contrast-[1.06] grayscale transition-[filter] duration-700 ease-out",
              revealColor && "group-hover:grayscale-0",
            )}
          />
        </ParallaxPlate>
      </div>

      <figcaption className="t-meta mt-4 flex items-baseline justify-between gap-4">
        <span>{index}</span>
        <span className="text-right">{caption}</span>
      </figcaption>
    </figure>
  );
}
