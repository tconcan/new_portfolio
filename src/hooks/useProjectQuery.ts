import { useSearchParams } from "react-router";
import { isSortOption, type ProjectQuery, type SortOption, type TechMatch } from "../lib/projects";

type ListParam = "org" | "tech";

/**
 * Sort and filter state for the projects page, stored in the URL query string
 * (?sort=…&org=…&tech=…&match=any) so filtered views can be shared/bookmarked.
 * Defaults (newest, match all) are omitted from the URL.
 */
export function useProjectQuery() {
  const [params, setParams] = useSearchParams();

  const rawSort = params.get("sort");
  const query: ProjectQuery = {
    sort: isSortOption(rawSort) ? rawSort : "newest",
    categories: params.getAll("org"),
    technologies: params.getAll("tech"),
    techMatch: params.get("match") === "any" ? "any" : "all",
  };

  const update = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    mutate(next);
    setParams(next, { replace: true });
  };

  const toggle = (key: ListParam, value: string) =>
    update((next) => {
      const values = next.getAll(key);
      next.delete(key);
      const updated = values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
      updated.forEach((v) => next.append(key, v));
    });

  return {
    query,
    activeFilterCount: query.categories.length + query.technologies.length,
    setSort: (sort: SortOption) =>
      update((next) => (sort === "newest" ? next.delete("sort") : next.set("sort", sort))),
    setTechMatch: (match: TechMatch) =>
      update((next) => (match === "all" ? next.delete("match") : next.set("match", match))),
    toggleCategory: (category: string) => toggle("org", category),
    toggleTechnology: (tech: string) => toggle("tech", tech),
    clearFilters: () =>
      update((next) => {
        next.delete("org");
        next.delete("tech");
        next.delete("match");
      }),
  };
}
