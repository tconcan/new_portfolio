import { SORT_OPTIONS, isSortOption, type SortOption } from "../../lib/projects";
import { ChevronDownIcon, FilterIcon } from "../ui/icons";

interface ProjectsToolbarProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  filtersOpen: boolean;
  onToggleFilters: () => void;
  filtersId: string;
  activeFilterCount: number;
  shown: number;
  total: number;
  onClearFilters: () => void;
}

/** Sort select, filter panel toggle, and "Showing X of Y · Clear filters". */
export default function ProjectsToolbar({
  sort,
  onSortChange,
  filtersOpen,
  onToggleFilters,
  filtersId,
  activeFilterCount,
  shown,
  total,
  onClearFilters,
}: ProjectsToolbarProps) {
  const highlighted = filtersOpen || activeFilterCount > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <span>Sort</span>
          {/* Custom-styled select: Safari's native styling clips the label */}
          <span className="relative inline-flex">
            <select
              value={sort}
              onChange={(e) => {
                if (isSortOption(e.target.value)) onSortChange(e.target.value);
              }}
              className="appearance-none bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg pl-3 pr-9 py-2 text-white text-sm leading-5 min-w-[9.5rem] cursor-pointer focus:outline-none focus:border-purple-400"
            >
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </span>
        </label>

        <button
          type="button"
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          aria-controls={filtersId}
          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium border backdrop-blur-sm transition-colors ${
            highlighted
              ? "bg-purple-500/20 border-purple-400 text-white"
              : "bg-gray-800/80 border-gray-700 text-gray-300 hover:border-purple-400 hover:text-white"
          }`}
        >
          <FilterIcon className="w-4 h-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="bg-purple-500 text-white rounded-full text-xs min-w-[1.25rem] h-5 px-1.5 inline-flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
          <ChevronDownIcon className={`w-4 h-4 transition-transform ${filtersOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      <p className="text-sm text-gray-400" aria-live="polite">
        Showing {shown} of {total}
        {activeFilterCount > 0 && (
          <>
            {" · "}
            <button type="button" onClick={onClearFilters} className="text-purple-400 hover:text-purple-300 font-medium">
              Clear filters
            </button>
          </>
        )}
      </p>
    </div>
  );
}
