import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectPlate, initialsOf } from "@/components/ProjectPlate";
import type { Project } from "@/data/projects";

const base: Project = {
  slug: "test-plate",
  title: "Test Plate",
  description: "A test project description.",
  tags: ["React"],
};

/**
 * Every plate variant has to fill its frame on its own.
 *
 * `ProjectCard` wraps the plate in an `aspect-[4/3]` box and passes
 * `size-full`; `WorkIndex` wraps it in an `aspect-[4/5]` box and passes only a
 * border. A variant that relies on the caller for its height renders at zero
 * height in the second case — which is exactly how the screenshot plates went
 * missing from the home-page hover. Any new variant must hold this too.
 */
describe("ProjectPlate", () => {
  const variants: [string, Project][] = [
    ["screenshot", { ...base, image: "/projects/yaluoza.jpg" }],
    ["diagram", { ...base, diagram: "payment-console" }],
    ["typographic", base],
  ];

  for (const [name, project] of variants) {
    it(`fills its frame as a ${name} plate without help from the caller`, () => {
      const { container } = render(<ProjectPlate project={project} />);
      const root = container.firstElementChild;

      expect(root).not.toBeNull();
      expect(root?.className).toContain("size-full");
    });
  }

  it("keeps any className the caller adds", () => {
    const { container } = render(
      <ProjectPlate
        project={{ ...base, image: "/projects/yaluoza.jpg" }}
        className="border border-rule"
      />,
    );

    expect(container.firstElementChild?.className).toContain("border-rule");
  });

  it("renders the screenshot when a project has one", () => {
    const { container } = render(
      <ProjectPlate project={{ ...base, image: "/projects/yaluoza.jpg" }} />,
    );

    // Cover art is decorative — the card's heading carries the name.
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img?.getAttribute("alt")).toBe("");
  });
});

describe("initialsOf", () => {
  it("takes the first letter of the first two words", () => {
    expect(initialsOf("Payment Management Console")).toBe("PM");
  });

  it("takes two letters from a single-word title", () => {
    expect(initialsOf("Yaluoza")).toBe("YA");
  });

  it("returns an empty string for an empty title", () => {
    expect(initialsOf("   ")).toBe("");
  });
});
