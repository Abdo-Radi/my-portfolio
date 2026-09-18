import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ExperienceTable } from "@/components/about/ExperienceTable";
import type { ExperienceItem } from "@/data/experience";

const withLinks: ExperienceItem = {
  role: "Full-Stack Developer",
  organization: "Studio A",
  period: "2024",
  kind: "work",
  description: "Built a shop.",
  highlights: ["Built a storefront."],
  links: [
    { label: "Live demo", href: "https://example.com/live" },
    { label: "Source on GitHub", href: "https://github.com/example/repo" },
  ],
};

const withoutLinks: ExperienceItem = {
  role: "Support Engineer",
  organization: "Studio B",
  period: "2023",
  kind: "work",
  description: "Kept things running.",
  highlights: ["Resolved incidents."],
};

describe("ExperienceTable", () => {
  it("renders a row's links, opening in a new tab", () => {
    render(<ExperienceTable items={[withLinks]} />);

    const live = screen.getByRole("link", { name: /live demo/i });
    expect(live).toHaveAttribute("href", "https://example.com/live");
    expect(live).toHaveAttribute("target", "_blank");
    expect(live).toHaveAttribute("rel", "noreferrer noopener");

    expect(
      screen.getByRole("link", { name: /source on github/i }),
    ).toHaveAttribute("href", "https://github.com/example/repo");
  });

  it("puts the links in the same row as the role they belong to", () => {
    render(<ExperienceTable items={[withLinks, withoutLinks]} />);

    const [, linkedRow, plainRow] = screen.getAllByRole("row");
    expect(within(linkedRow!).getAllByRole("link")).toHaveLength(2);
    expect(within(plainRow!).queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders no links for rows without any", () => {
    render(<ExperienceTable items={[withoutLinks]} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Resolved incidents.")).toBeInTheDocument();
  });
});
