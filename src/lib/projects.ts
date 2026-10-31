import { CATEGORY_STYLES, type Category, type Project, type Technology } from "../data/projects";

export const SORT_OPTIONS = {
  newest: "Newest first",
  oldest: "Oldest first",
  title: "Title (A–Z)",
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;
export type TechMatch = "all" | "any";

export interface ProjectQuery {
  sort: SortOption;
  categories: readonly string[];
  technologies: readonly string[];
  techMatch: TechMatch;
}

export function isSortOption(value: string | null): value is SortOption {
  return value !== null && Object.hasOwn(SORT_OPTIONS, value);
}

/**
 * Filter then sort. Within a group any selected value matches; across the
 * organization and technology groups both must match. Technologies match
 * "all" selected by default, or "any" of them.
 */
export function queryProjects(projects: readonly Project[], query: ProjectQuery): Project[] {
  const { categories, technologies, techMatch, sort } = query;

  const filtered = projects.filter((project) => {
    const categoryOk = categories.length === 0 || categories.includes(project.category);
    const uses = (tech: string) => (project.technologies as readonly string[]).includes(tech);
    const techOk =
      technologies.length === 0 ||
      (techMatch === "all" ? technologies.every(uses) : technologies.some(uses));
    return categoryOk && techOk;
  });

  const byTitle = (a: Project, b: Project) => a.title.localeCompare(b.title);
  return filtered.sort((a, b) => {
    if (sort === "title") return byTitle(a, b);
    const byDate = sort === "oldest" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
    return byDate || byTitle(a, b);
  });
}

function countBy<T>(values: readonly T[]): Map<T, number> {
  const counts = new Map<T, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

export interface FilterOption<T extends string> {
  value: T;
  count: number;
}

/** Organizations in the color-map order, only those with projects. */
export function categoryOptions(projects: readonly Project[]): FilterOption<Category>[] {
  const counts = countBy(projects.map((p) => p.category));
  return (Object.keys(CATEGORY_STYLES) as Category[])
    .filter((category) => counts.has(category))
    .map((category) => ({ value: category, count: counts.get(category) ?? 0 }));
}

/** Technologies ordered by how many projects use them, then alphabetically. */
export function technologyOptions(projects: readonly Project[]): FilterOption<Technology>[] {
  const counts = countBy(projects.flatMap((p) => p.technologies));
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}
