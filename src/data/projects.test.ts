import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { DIAGRAMS } from "@/components/diagrams";
import { experience } from "@/data/experience";
import { projects } from "@/data/projects";

// Vitest runs from the project root (where vitest.config.ts lives). Under the
// jsdom environment `import.meta.url` isn't a file: URL, so resolve from cwd.
const publicDir = join(process.cwd(), "public");

/** Every outbound link on the site should be an absolute https URL. */
const isHttpsUrl = (value: string) => {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

describe("projects data", () => {
  it("gives every project a unique slug", () => {
    const slugs = projects.map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("links live demos and source code over https", () => {
    for (const project of projects) {
      for (const url of [project.liveUrl, project.sourceUrl]) {
        if (url !== undefined) {
          expect(isHttpsUrl(url), `${project.slug}: ${url}`).toBe(true);
        }
      }
    }
  });

  it("points every local cover image at a file that exists in /public", () => {
    // A typo here would ship a broken image on the home page and the archive.
    for (const project of projects) {
      if (project.image?.startsWith("/")) {
        expect(
          existsSync(join(publicDir, project.image)),
          `${project.slug}: public${project.image} is missing`,
        ).toBe(true);
      }
    }
  });

  it("points every diagram at a drawing in the registry", () => {
    // The DiagramKey union already enforces this at compile time; this
    // documents the contract beside the other data checks.
    for (const project of projects) {
      if (project.diagram) {
        expect(
          DIAGRAMS[project.diagram],
          `${project.slug}: no diagram for ${project.diagram}`,
        ).toBeDefined();
      }
    }
  });

  it("explains every project that carries no link", () => {
    for (const project of projects) {
      if (!project.liveUrl && !project.sourceUrl && project.note) {
        expect(project.note.trim(), `${project.slug}`).not.toBe("");
      }
    }
  });
});

describe("experience data", () => {
  it("links out over https", () => {
    for (const item of experience) {
      for (const link of item.links ?? []) {
        expect(link.label.trim(), `${item.role}: empty label`).not.toBe("");
        expect(isHttpsUrl(link.href), `${item.role}: ${link.href}`).toBe(true);
      }
    }
  });
});
