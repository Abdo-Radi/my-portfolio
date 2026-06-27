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
  it("renders the title, description and tags", () => {
    render(<ProjectCard project={project} />);

    expect(
      screen.getByRole("heading", { name: "Test Project" }),
    ).toBeInTheDocument();
    expect(screen.getByText("A test project description.")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("links to the live and source URLs", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByRole("link", { name: /live/i })).toHaveAttribute(
      "href",
      project.liveUrl,
    );
    expect(screen.getByRole("link", { name: /code/i })).toHaveAttribute(
      "href",
      project.sourceUrl,
    );
  });

  it("omits link buttons when URLs are absent", () => {
    render(
      <ProjectCard
        project={{ ...project, liveUrl: undefined, sourceUrl: undefined }}
      />,
    );

    expect(
      screen.queryByRole("link", { name: /live/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /code/i }),
    ).not.toBeInTheDocument();
  });
});
