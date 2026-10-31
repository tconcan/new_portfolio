import { describe, expect, it } from "vitest";
import { PROJECTS, type Project } from "../data/projects";
import { categoryOptions, isSortOption, queryProjects, technologyOptions, type ProjectQuery } from "./projects";

const base: ProjectQuery = { sort: "newest", categories: [], technologies: [], techMatch: "all" };
const titles = (projects: Project[]) => projects.map((p) => p.title);

const sample: Project[] = [
  { title: "B", category: "Purdue", date: "2024-05", description: "", technologies: ["Python", "Jupyter"], links: [] },
  { title: "A", category: "Purdue", date: "2025-01", description: "", technologies: ["Python"], links: [] },
  { title: "C", category: "es@p", date: "2025-01", description: "", technologies: ["Arduino", "Python"], links: [] },
  { title: "D", category: "Hackathon", date: "2023-03", description: "", technologies: ["Flask"], links: [] },
];

describe("queryProjects sorting", () => {
  it("sorts newest first by default, ties broken by title", () => {
    expect(titles(queryProjects(sample, base))).toEqual(["A", "C", "B", "D"]);
  });

  it("sorts oldest first", () => {
    expect(titles(queryProjects(sample, { ...base, sort: "oldest" }))).toEqual(["D", "B", "A", "C"]);
  });

  it("sorts by title", () => {
    expect(titles(queryProjects(sample, { ...base, sort: "title" }))).toEqual(["A", "B", "C", "D"]);
  });

  it("does not mutate the input", () => {
    const copy = [...sample];
    queryProjects(sample, { ...base, sort: "title" });
    expect(sample).toEqual(copy);
  });
});

describe("queryProjects filtering", () => {
  it("matches any selected organization", () => {
    expect(titles(queryProjects(sample, { ...base, categories: ["es@p", "Hackathon"] }))).toEqual(["C", "D"]);
  });

  it("requires all selected technologies by default", () => {
    expect(titles(queryProjects(sample, { ...base, technologies: ["Python", "Jupyter"] }))).toEqual(["B"]);
  });

  it("can match any selected technology", () => {
    const result = queryProjects(sample, { ...base, technologies: ["Jupyter", "Flask"], techMatch: "any" });
    expect(titles(result)).toEqual(["B", "D"]);
  });

  it("combines organization and technology filters", () => {
    expect(titles(queryProjects(sample, { ...base, categories: ["Purdue"], technologies: ["Jupyter"] }))).toEqual(["B"]);
  });

  it("returns nothing when no project matches", () => {
    expect(queryProjects(sample, { ...base, categories: ["Hackathon"], technologies: ["Arduino"] })).toEqual([]);
  });
});

describe("filter options", () => {
  it("lists organizations in color-map order with counts", () => {
    expect(categoryOptions(sample)).toEqual([
      { value: "Purdue", count: 2 },
      { value: "es@p", count: 1 },
      { value: "Hackathon", count: 1 },
    ]);
  });

  it("orders technologies by usage, then name", () => {
    expect(technologyOptions(sample).map((o) => o.value)).toEqual(["Python", "Arduino", "Flask", "Jupyter"]);
  });
});

describe("isSortOption", () => {
  it("accepts known options only", () => {
    expect(isSortOption("oldest")).toBe(true);
    expect(isSortOption("toString")).toBe(false);
    expect(isSortOption(null)).toBe(false);
  });
});

describe("project data", () => {
  it("has unique titles and valid YYYY-MM dates", () => {
    expect(new Set(PROJECTS.map((p) => p.title)).size).toBe(PROJECTS.length);
    for (const p of PROJECTS) expect(p.date).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/);
  });
});
