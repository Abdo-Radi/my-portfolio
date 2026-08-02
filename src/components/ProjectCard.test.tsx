import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/data/projects";

const project: Project = {
  slug: "test-project",
  title: "Test Project",
  description: "A test project description.",
  tags: ["React", "TypeScript"],
  liveUrl: "https://example.com/live",
  sourceUrl: "https://github.com/example/repo",
};

describe("ProjectCard", () => {
  it("renders the title, description and all tags", () => {
    render(<ProjectCard project={project} />);

    expect(
      screen.getByRole("heading", { level: 3, name: /test project/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("A test project description.")).toBeInTheDocument();
    for (const tag of project.tags) {
      expect(screen.getAllByText(tag).length).toBeGreaterThan(0);
    }
  });

  it("renders decorative cover initials derived from the title", () => {
    render(<ProjectCard project={project} />);

    // "Test Project" → "TP" (aria-hidden cover art, so query by text)
    expect(screen.getByText("TP")).toBeInTheDocument();
  });

  it("makes the title the primary link to the live URL", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByRole("link", { name: "Test Project" })).toHaveAttribute(
      "href",
      project.liveUrl,
    );
  });

  it("falls back to the source URL as primary link when no live URL exists", () => {
    render(<ProjectCard project={{ ...project, liveUrl: undefined }} />);

    expect(screen.getByRole("link", { name: "Test Project" })).toHaveAttribute(
      "href",
      project.sourceUrl,
    );
  });

  it("renders labelled footer links for live and source URLs", () => {
    render(<ProjectCard project={project} />);

    expect(
      screen.getByRole("link", { name: /open live site for test project/i }),
    ).toHaveAttribute("href", project.liveUrl);
    expect(
      screen.getByRole("link", {
        name: /view source code for test project/i,
      }),
    ).toHaveAttribute("href", project.sourceUrl);
  });

  it("omits all links when URLs are absent", () => {
    render(
      <ProjectCard
        project={{ ...project, liveUrl: undefined, sourceUrl: undefined }}
      />,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    // Title still renders, just not as a link.
    expect(
      screen.getByRole("heading", { level: 3, name: /test project/i }),
    ).toBeInTheDocument();
  });

  it("omits only the missing footer link when one URL is absent", () => {
    render(<ProjectCard project={{ ...project, sourceUrl: undefined }} />);

    expect(
      screen.getByRole("link", { name: /open live site for test project/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /view source code/i }),
    ).not.toBeInTheDocument();
  });
});
