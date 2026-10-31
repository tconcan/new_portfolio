import { useMemo, useState } from "react";
import Masonry from "react-masonry-css";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectFilters from "../components/projects/ProjectFilters";
import ProjectsToolbar from "../components/projects/ProjectsToolbar";
import { OUTLINE_BUTTON, SECTION_TITLE } from "../components/ui/styles";
import { PROJECTS, type Technology } from "../data/projects";
import { useProjectQuery } from "../hooks/useProjectQuery";
import { categoryOptions, queryProjects, technologyOptions } from "../lib/projects";

// Masonry columns by viewport width
const COLUMNS = { default: 3, 1024: 2, 768: 1 };

const FILTERS_ID = "project-filters";

// Filter options never change, so compute them once.
const CATEGORY_OPTIONS = categoryOptions(PROJECTS);
const TECHNOLOGY_OPTIONS = technologyOptions(PROJECTS);

export default function ProjectsPage() {
  const { query, activeFilterCount, setSort, setTechMatch, toggleCategory, toggleTechnology, clearFilters } =
    useProjectQuery();
  const [filtersOpen, setFiltersOpen] = useState(activeFilterCount > 0);

  const { sort, categories, technologies, techMatch } = query;
  const visible = useMemo(
    () => queryProjects(PROJECTS, { sort, categories, technologies, techMatch }),
    // The arrays are rebuilt from the URL on every render; key on their contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sort, techMatch, categories.join("|"), technologies.join("|")],
  );

  // Clicking a tag or badge on a card filters by it and shows the filter panel.
  const filterFromCard = (toggle: () => void) => {
    toggle();
    setFiltersOpen(true);
  };

  return (
    <section className="py-20 px-4 sm:px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className={`${SECTION_TITLE} mb-10`}>Projects</h1>

        <div className="mb-8">
          <ProjectsToolbar
            sort={sort}
            onSortChange={setSort}
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen((open) => !open)}
            filtersId={FILTERS_ID}
            activeFilterCount={activeFilterCount}
            shown={visible.length}
            total={PROJECTS.length}
            onClearFilters={clearFilters}
          />

          {filtersOpen && (
            <ProjectFilters
              id={FILTERS_ID}
              categories={CATEGORY_OPTIONS}
              technologies={TECHNOLOGY_OPTIONS}
              selectedCategories={categories}
              selectedTechnologies={technologies}
              techMatch={techMatch}
              onToggleCategory={toggleCategory}
              onToggleTechnology={toggleTechnology}
              onTechMatchChange={setTechMatch}
            />
          )}
        </div>

        {visible.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-10 text-center">
            <p className="text-lg text-gray-300 mb-4">No projects match these filters.</p>
            <button type="button" onClick={clearFilters} className={`${OUTLINE_BUTTON} px-6 py-2`}>
              Clear filters
            </button>
          </div>
        ) : (
          <Masonry breakpointCols={COLUMNS} className="masonry-grid" columnClassName="masonry-grid_column">
            {visible.map((project) => (
              <ProjectCard
                key={project.title}
                project={project}
                isCategorySelected={categories.includes(project.category)}
                isTechnologySelected={(tech: Technology) => technologies.includes(tech)}
                onCategoryClick={(category) => filterFromCard(() => toggleCategory(category))}
                onTechnologyClick={(tech) => filterFromCard(() => toggleTechnology(tech))}
              />
            ))}
          </Masonry>
        )}
      </div>
    </section>
  );
}
