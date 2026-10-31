import type { CSSProperties, ReactNode } from "react";
import { CATEGORY_STYLES, TECH_COLORS, type Category, type Technology } from "../../data/projects";
import { readableTextColor } from "../../lib/color";
import type { FilterOption, TechMatch } from "../../lib/projects";

const INACTIVE_CHIP = "border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white";
const GROUP_LABEL = "text-xs font-semibold uppercase tracking-wider text-gray-400";

function FilterChip({
  active,
  onClick,
  className,
  style,
  children,
}: {
  active: boolean;
  onClick: () => void;
  className: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={style}
      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-colors inline-flex items-center gap-1.5 ${className}`}
    >
      {children}
    </button>
  );
}

interface ProjectFiltersProps {
  id: string;
  categories: readonly FilterOption<Category>[];
  technologies: readonly FilterOption<Technology>[];
  selectedCategories: readonly string[];
  selectedTechnologies: readonly string[];
  techMatch: TechMatch;
  onToggleCategory: (category: Category) => void;
  onToggleTechnology: (tech: Technology) => void;
  onTechMatchChange: (match: TechMatch) => void;
}

const MATCH_OPTIONS: readonly [TechMatch, string][] = [
  ["all", "All"],
  ["any", "Any"],
];

/** Organization and technology filter chips, each showing its project count. */
export default function ProjectFilters({
  id,
  categories,
  technologies,
  selectedCategories,
  selectedTechnologies,
  techMatch,
  onToggleCategory,
  onToggleTechnology,
  onTechMatchChange,
}: ProjectFiltersProps) {
  return (
    <div id={id} className="mt-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 space-y-5">
      <div role="group" aria-labelledby={`${id}-organization`}>
        <p id={`${id}-organization`} className={`${GROUP_LABEL} mb-3`}>
          Organization
        </p>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ value, count }) => {
            const active = selectedCategories.includes(value);
            return (
              <FilterChip
                key={value}
                active={active}
                onClick={() => onToggleCategory(value)}
                className={active ? CATEGORY_STYLES[value] : INACTIVE_CHIP}
              >
                {value}
                <span className={active ? "opacity-80" : "text-gray-500"}>{count}</span>
              </FilterChip>
            );
          })}
        </div>
      </div>

      <div role="group" aria-labelledby={`${id}-technology`}>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <p id={`${id}-technology`} className={GROUP_LABEL}>
            Technology
          </p>
          <div className="inline-flex items-center gap-2 text-xs text-gray-400">
            <span>Match</span>
            <div
              className="inline-flex rounded-lg border border-gray-600 overflow-hidden"
              role="group"
              aria-label="Technology match mode"
            >
              {MATCH_OPTIONS.map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={techMatch === value}
                  onClick={() => onTechMatchChange(value)}
                  className={`px-2.5 py-1 font-medium transition-colors ${
                    techMatch === value ? "bg-purple-500 text-white" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {technologies.map(({ value, count }) => {
            const active = selectedTechnologies.includes(value);
            const color = TECH_COLORS[value];
            return (
              <FilterChip
                key={value}
                active={active}
                onClick={() => onToggleTechnology(value)}
                style={active ? { backgroundColor: color, borderColor: color, color: readableTextColor(color) } : undefined}
                className={active ? "" : INACTIVE_CHIP}
              >
                {!active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />}
                {value}
                <span className={active ? "opacity-70" : "text-gray-500"}>{count}</span>
              </FilterChip>
            );
          })}
        </div>
      </div>
    </div>
  );
}
